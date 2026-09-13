import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {SharedRealm} from '../server/authority.mjs';
import {createRealmServer} from '../server/index.mjs';
import {backupRealm} from '../server/backup.mjs';
import {seed as blueprintSeed,compile as compileBlueprint} from '../public/creation.js';
import {ITEMS,SPEED,traversable,OBSTACLES} from '../public/shared-rules.js';

function fixture(t,{disk=false}={}) {
  const directory=mkdtempSync(join(tmpdir(),'anima-shared-test-')),path=disk?join(directory,'realm.sqlite'):':memory:';
  let now=1780000000000,sequence=0,realm=new SharedRealm({path,now:()=>now});
  const f={path,directory,get realm(){return realm;},get now(){return now;},advance(ms=1000){now+=ms;},session(name){return realm.createSession({name});},
    envelope(token,op,payload={},extra={}){return {key:'test-key-'+String(++sequence).padStart(6,'0'),expectedRevision:realm.state(token).revision,op,payload,...extra};},
    command(token,op,payload={},extra={}){return realm.command(token,this.envelope(token,op,payload,extra));},
    reopen(){realm.close();realm=new SharedRealm({path,now:()=>now});return realm;},
    walk(token,x,z){for(let n=0;n<400;n++){const p=realm.state(token).you,dx=x-p.x,dz=z-p.z,length=Math.hypot(dx,dz);if(length<.08)return;now+=250;const divisor=Math.max(length,SPEED*.25);this.command(token,'move',{dx:dx/divisor,dz:dz/divisor});}throw Error(`Could not legally walk to ${x},${z}`);},
    gather(token,nodeId,n=1){const node=realm.state(token).nodes.find(n=>n.id===nodeId);this.walk(token,node.x,node.z);for(let i=0;i<n;i++){now+=900;this.command(token,'gather',{nodeId});}},
    invariant(token){const view=realm.state(token);assert.ok(Object.values(view.ledger.residual).every(v=>v===0));return view;},
    unchanged(fn,code){const before=JSON.stringify(realm.read());assert.throws(fn,error=>error.code===code);assert.equal(JSON.stringify(realm.read()),before);},
  };
  t.after(()=>{try{realm.close();}catch{}rmSync(directory,{recursive:true,force:true});});return f;
}

test('shared sessions isolate principals, confer no signup assets, and never accept supplied identity',t=>{
  const f=fixture(t),a=f.session('Ash'),b=f.session('Birch');assert.notEqual(a.playerId,b.playerId);assert.notEqual(a.token,b.token);
  assert.deepEqual(a.state.you.inventory,Object.fromEntries(ITEMS.map(item=>[item,0])));assert.equal(f.realm.state(a.token).treasury.marks,500);
  assert.equal(f.realm.state(a.token).players.length,2);assert.equal(f.realm.state(a.token).players[1].inventory,undefined);
  assert.throws(()=>f.realm.state(b.playerId),e=>e.code==='UNAUTHENTICATED');assert.throws(()=>f.realm.state(a.token+'changed'),e=>e.code==='UNAUTHENTICATED');
  f.unchanged(()=>f.realm.createSession({name:'Ash',playerId:b.playerId}),'INVALID_SHAPE');
  f.unchanged(()=>f.command(a.token,'move',{dx:0,dz:1,playerId:b.playerId}),'INVALID_SHAPE');
  f.unchanged(()=>f.command(a.token,'move',{dx:0,dz:1},{playerId:b.playerId}),'INVALID_SHAPE');
  f.invariant(a.token);
});

test('movement consumes trusted elapsed time, blocks impossible axes, walls, closed river and borders',t=>{
  const f=fixture(t),a=f.session('Ash');const initial=f.realm.state(a.token).you;
  f.advance(600000);f.command(a.token,'move',{dx:1,dz:1});const p=f.realm.state(a.token).you;
  assert.ok(Math.hypot(p.x-initial.x,p.z-initial.z)<=SPEED*.25+1e-9);
  const same={x:p.x,z:p.z};for(let n=0;n<20;n++)f.command(a.token,'move',{dx:1,dz:0});assert.equal(f.realm.state(a.token).you.x,same.x);
  for(const payload of [{dx:999,dz:0},{dx:NaN,dz:0},{dx:null,dz:0},{x:30,z:0},{dx:1,dz:0,elapsedMs:100000}])f.unchanged(()=>f.command(a.token,'move',payload),Object.hasOwn(payload,'x')||Object.hasOwn(payload,'elapsedMs')?'INVALID_SHAPE':'INVALID_MOVEMENT');
  f.walk(a.token,0,-5);for(let n=0;n<35;n++){f.advance(250);f.command(a.token,'move',{dx:0,dz:-1});}assert.ok(f.realm.state(a.token).you.z>=-7);
  f.walk(a.token,8,15);for(let n=0;n<40;n++){f.advance(250);f.command(a.token,'move',{dx:0,dz:1});const q=f.realm.state(a.token).you;assert.ok(OBSTACLES.every(o=>Math.hypot(q.x-o.x,q.z-o.z)>=o.r+.3-1e-9));}
  for(let n=0;n<160;n++){f.advance(250);f.command(a.token,'move',{dx:1,dz:0});assert.ok(traversable(false,f.realm.state(a.token).you.x,f.realm.state(a.token).you.z));}
  assert.ok(f.realm.state(a.token).you.x<55);f.invariant(a.token);
});

test('two principals fund a real shared crossing and keep rewards within the finite treasury',t=>{
  const f=fixture(t),a=f.session('Ash'),b=f.session('Birch');f.gather(a.token,'grove',8);f.gather(b.token,'quarry',8);
  f.walk(a.token,0,-3);f.command(a.token,'project.contribute',{projectId:'crossing',item:'wood',quantity:8});assert.equal(f.realm.state(b.token).world.bridgeOpen,false);
  f.walk(b.token,0,-3);const done=f.command(b.token,'project.contribute',{projectId:'crossing',item:'stone',quantity:8});assert.equal(done.receipt.result.complete,true);
  assert.equal(done.state.treasury.marks,468);assert.equal(done.state.projects[0].contributors[a.playerId],8);assert.equal(done.state.projects[0].contributors[b.playerId],8);
  assert.equal(f.realm.state(a.token).you.inventory.marks,16);assert.equal(f.realm.state(b.token).you.inventory.marks,16);
  f.walk(a.token,0,-22);f.walk(b.token,0,-24);assert.ok(f.realm.state(a.token).you.z<-19);assert.ok(f.realm.state(b.token).you.z<-19);
  f.gather(a.token,'ore',2);f.gather(b.token,'crystal',2);assert.equal(f.realm.state(a.token).you.inventory.ore,2);assert.equal(f.realm.state(b.token).you.inventory.crystal,2);
  f.invariant(a.token);
});

test('finite gathering enforces reach, cooldown and exhausted deposits without inventing stock',t=>{
  const f=fixture(t),a=f.session('Ash');f.unchanged(()=>f.command(a.token,'gather',{nodeId:'ore'}),'OUT_OF_REACH');f.gather(a.token,'reeds');
  f.unchanged(()=>f.command(a.token,'gather',{nodeId:'reeds'}),'COOLDOWN');
  for(let i=1;i<60;i++){f.advance(900);f.command(a.token,'gather',{nodeId:'reeds'});}f.advance(900);
  f.unchanged(()=>f.command(a.token,'gather',{nodeId:'reeds'}),'RESOURCE_EMPTY');assert.equal(f.realm.state(a.token).you.inventory.herb,60);f.invariant(a.token);
});

test('player escrow fills once, unauthorized cancellation and unfunded fills leave all custody intact',t=>{
  const f=fixture(t),a=f.session('Ash'),b=f.session('Birch'),c=f.session('Cedar');f.gather(a.token,'grove',3);f.gather(b.token,'quarry',2);
  const created=f.command(a.token,'offer.create',{give:{item:'wood',quantity:3},want:{item:'stone',quantity:2}}),offerId=created.receipt.result.offerId;
  assert.equal(created.state.you.inventory.wood,0);f.invariant(a.token);
  f.unchanged(()=>f.command(b.token,'offer.cancel',{offerId}),'NOT_OWNER');f.unchanged(()=>f.command(c.token,'offer.fill',{offerId}),'INSUFFICIENT_FUNDS');f.unchanged(()=>f.command(a.token,'offer.fill',{offerId}),'SELF_TRADE');
  const fill=f.command(b.token,'offer.fill',{offerId});assert.equal(fill.state.you.inventory.wood,3);assert.equal(fill.state.you.inventory.stone,0);assert.equal(f.realm.state(a.token).you.inventory.stone,2);
  f.unchanged(()=>f.command(c.token,'offer.fill',{offerId}),'OFFER_CLOSED');f.unchanged(()=>f.command(a.token,'offer.cancel',{offerId}),'OFFER_CLOSED');f.invariant(b.token);
});

test('durable replay, stale revisions, command-key collisions and cancellation give exactly-once custody',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Ash');f.gather(a.token,'grove',3);
  const envelope=f.envelope(a.token,'offer.create',{give:{item:'wood',quantity:3},want:{item:'stone',quantity:1}}),first=f.realm.command(a.token,envelope),after=JSON.stringify(f.realm.read());
  const replay=f.realm.command(a.token,envelope);assert.equal(replay.receipt.replayed,true);assert.equal(JSON.stringify(f.realm.read()),after);assert.deepEqual(replay.receipt.result,first.receipt.result);
  f.unchanged(()=>f.realm.command(a.token,{...envelope,payload:{...envelope.payload,want:{item:'stone',quantity:2}}}),'KEY_COLLISION');
  f.unchanged(()=>f.command(a.token,'chat.send',{text:'old state'},{expectedRevision:0}),'REVISION_CONFLICT');
  f.reopen();const again=f.realm.command(a.token,envelope);assert.equal(again.receipt.replayed,true);assert.equal(f.realm.state(a.token).you.inventory.wood,0);
  const cancel=f.envelope(a.token,'offer.cancel',{offerId:first.receipt.result.offerId});f.realm.command(a.token,cancel);f.reopen();f.realm.command(a.token,cancel);assert.equal(f.realm.state(a.token).you.inventory.wood,3);f.invariant(a.token);
});

test('restart during open escrow and after committed fill preserves exact owners and receipt',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Ash'),b=f.session('Birch');f.gather(a.token,'grove',2);f.gather(b.token,'quarry',1);
  const offerId=f.command(a.token,'offer.create',{give:{item:'wood',quantity:2},want:{item:'stone',quantity:1}}).receipt.result.offerId;
  const before=JSON.stringify(f.realm.read());f.reopen();assert.equal(JSON.stringify(f.realm.read()),before);
  const envelope=f.envelope(b.token,'offer.fill',{offerId});f.realm.command(b.token,envelope);const after=JSON.stringify(f.realm.read());f.reopen();assert.equal(JSON.stringify(f.realm.read()),after);
  assert.equal(f.realm.command(b.token,envelope).receipt.replayed,true);assert.equal(f.realm.state(b.token).you.inventory.wood,2);assert.equal(f.realm.state(a.token).you.inventory.stone,1);f.invariant(b.token);
});

test('process death after writing a fill but before SQLite COMMIT rolls back both sides and replays safely',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Ash'),b=f.session('Birch');f.gather(a.token,'grove',2);f.gather(b.token,'quarry',1);
  const offerId=f.command(a.token,'offer.create',{give:{item:'wood',quantity:2},want:{item:'stone',quantity:1}}).receipt.result.offerId,envelope=f.envelope(b.token,'offer.fill',{offerId}),before=JSON.stringify(f.realm.read());
  f.realm.close();
  const child=spawnSync(process.execPath,['--input-type=module','-e',`import {SharedRealm} from ${JSON.stringify(new URL('../server/authority.mjs',import.meta.url).href)};const realm=new SharedRealm({path:process.env.TEST_REALM_PATH,now:()=>Number(process.env.TEST_REALM_TIME),beforeCommit:()=>process.kill(process.pid,'SIGKILL')});realm.command(process.env.TEST_REALM_TOKEN,JSON.parse(process.env.TEST_REALM_COMMAND));`],{env:{...process.env,TEST_REALM_PATH:f.path,TEST_REALM_TIME:String(f.now),TEST_REALM_TOKEN:b.token,TEST_REALM_COMMAND:JSON.stringify(envelope)},encoding:'utf8'});
  assert.equal(child.signal,'SIGKILL',child.stderr);const recovered=new SharedRealm({path:f.path,now:()=>f.now});t.after(()=>recovered.close());assert.equal(JSON.stringify(recovered.read()),before);
  const filled=recovered.command(b.token,envelope);assert.equal(filled.receipt.replayed,false);assert.equal(filled.state.you.inventory.wood,2);assert.equal(recovered.state(a.token).you.inventory.stone,1);assert.ok(Object.values(filled.state.ledger.residual).every(n=>n===0));
});

test('invited agent has the owner inventory, shared movement budget, exact allowance, scope and revocation',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Ash'),other=f.session('Birch');f.gather(a.token,'grove');
  const grantEnvelope=f.envelope(a.token,'agent.create',{name:'Courier',scopes:['gather','move'],allowance:2,expiresInSeconds:3600}),grant=f.realm.command(a.token,grantEnvelope).receipt.result,token=grant.token;
  assert.equal(f.realm.state(token).you.id,a.playerId);f.unchanged(()=>f.command(token,'offer.create',{give:{item:'wood',quantity:1},want:{item:'stone',quantity:1}}),'AGENT_SCOPE');
  f.advance(900);const gather=f.envelope(token,'gather',{nodeId:'grove'});f.realm.command(token,gather);assert.equal(f.realm.state(a.token).you.inventory.wood,2);assert.equal(f.realm.state(token).you.agent.remaining,1);
  f.realm.command(token,gather);assert.equal(f.realm.state(token).you.agent.remaining,1);
  f.advance(250);f.command(token,'move',{dx:1,dz:0});const x=f.realm.state(a.token).you.x;f.command(a.token,'move',{dx:1,dz:0});assert.equal(f.realm.state(a.token).you.x,x);
  f.unchanged(()=>f.command(token,'gather',{nodeId:'grove'}),'AGENT_ALLOWANCE');assert.equal(f.realm.command(token,gather).receipt.replayed,true);
  f.reopen();assert.equal(f.realm.command(a.token,grantEnvelope).receipt.result.token,token);assert.equal(f.realm.state(token).you.agent.remaining,0);
  f.unchanged(()=>f.command(other.token,'agent.revoke',{agentId:grant.agentId}),'NOT_OWNER');f.command(a.token,'agent.revoke',{agentId:grant.agentId});assert.throws(()=>f.realm.command(token,gather),e=>e.code==='AGENT_REVOKED');f.invariant(a.token);
});

test('agent expiry and owner session renewal enforce the credential lifetime',t=>{
  const f=fixture(t),a=f.session('Ash');const grant=f.command(a.token,'agent.create',{name:'Courier',scopes:['move'],allowance:10,expiresInSeconds:60}).receipt.result;
  f.advance(60000);assert.throws(()=>f.realm.state(grant.token),e=>e.code==='UNAUTHENTICATED');
  f.advance(29*86400*1000);const renewed=f.command(a.token,'session.renew',{});assert.ok(renewed.receipt.result.expiresAt>a.expiresAt);f.advance(2*86400*1000);assert.equal(f.realm.state(a.token).you.id,a.playerId);f.advance(29*86400*1000);assert.throws(()=>f.realm.state(a.token),e=>e.code==='UNAUTHENTICATED');
});

test('shared treasury market has physical reach, real stock, finite Marks and no profitable round-trip faucet',t=>{
  const f=fixture(t),a=f.session('Ash'),b=f.session('Birch');f.gather(a.token,'grove',4);
  f.unchanged(()=>f.command(a.token,'market.sell',{item:'wood',quantity:4}),'OUT_OF_REACH');f.walk(a.token,5,19);
  f.command(a.token,'market.sell',{item:'wood',quantity:4});assert.equal(f.realm.state(a.token).you.inventory.marks,4);assert.equal(f.realm.state(b.token).treasury.wood,4);
  f.command(a.token,'market.buy',{item:'wood',quantity:2});assert.equal(f.realm.state(a.token).you.inventory.marks,0);assert.equal(f.realm.state(a.token).you.inventory.wood,2);
  f.unchanged(()=>f.command(a.token,'market.buy',{item:'wood',quantity:1}),'INSUFFICIENT_FUNDS');assert.equal(f.realm.state(a.token).treasury.marks,500);f.invariant(a.token);
});

test('public chat stores bounded plain text and applies principal-wide cooldown to agent credentials',t=>{
  const f=fixture(t),a=f.session('Ash');f.command(a.token,'chat.send',{text:'<img src=x onerror=alert(1)>'});assert.equal(f.realm.state(a.token).chat[0].text,'<img src=x onerror=alert(1)>');
  f.unchanged(()=>f.command(a.token,'chat.send',{text:'too fast'}),'CHAT_COOLDOWN');f.advance(1000);
  f.unchanged(()=>f.command(a.token,'chat.send',{text:'x'.repeat(281)}),'INVALID_TEXT');f.unchanged(()=>f.command(a.token,'chat.send',{text:'bad\u0000control'}),'INVALID_TEXT');
  for(let i=0;i<90;i++){f.advance(1000);f.command(a.token,'chat.send',{text:'Message '+i});}assert.equal(f.realm.state(a.token).chat.length,80);f.invariant(a.token);
});

test('shared Foundry shelf publishes reusable immutable designs with real author ownership and no asset import',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Ash'),b=f.session('Birch'),blueprint=blueprintSeed('creature');blueprint.name='The Shared Lanternwing';
  const before=f.realm.state(a.token).you.inventory,envelope=f.envelope(a.token,'blueprint.publish',{blueprint}),published=f.realm.command(a.token,envelope),id=published.receipt.result.publicationId;
  blueprint.name='Changed afterward';const shelf=f.realm.state(b.token).blueprints;assert.equal(shelf.length,1);assert.equal(shelf[0].blueprint.name,'The Shared Lanternwing');assert.equal(shelf[0].authorId,a.playerId);assert.equal(shelf[0].authorName,'Ash');
  assert.deepEqual(compileBlueprint(shelf[0].blueprint).blueprint,shelf[0].blueprint);assert.deepEqual(f.realm.state(a.token).you.inventory,before);
  f.unchanged(()=>f.command(b.token,'blueprint.remove',{publicationId:id}),'NOT_OWNER');
  for(const invalid of [{...blueprint,script:'fetch(secret)'},{...blueprint,parts:[{...blueprint.parts[0],x:9999}]},{...blueprint,name:'<script>evil</script>'}])f.unchanged(()=>f.command(a.token,'blueprint.publish',{blueprint:invalid}),'INVALID_BLUEPRINT');
  f.reopen();assert.equal(f.realm.state(b.token).blueprints[0].id,id);f.command(a.token,'blueprint.remove',{publicationId:id});assert.equal(f.realm.state(b.token).blueprints.length,0);
  f.unchanged(()=>f.command(a.token,'blueprint.remove',{publicationId:id}),'UNKNOWN_BLUEPRINT');f.invariant(a.token);
});

test('shared design shelf enforces per-principal and realm-wide bounds and exact publication replay',t=>{
  const f=fixture(t),authors=Array.from({length:9},(_,i)=>f.session('Author '+i)),blueprint=blueprintSeed('instrument');
  for(let author=0;author<8;author++)for(let n=0;n<8;n++){
    const token=authors[author].token,envelope=f.envelope(token,'blueprint.publish',{blueprint}),receipt=f.realm.command(token,envelope).receipt;
    assert.equal(f.realm.command(token,envelope).receipt.result.publicationId,receipt.result.publicationId);
    if(author===0&&n===7)f.unchanged(()=>f.command(token,'blueprint.publish',{blueprint}),'BLUEPRINT_LIMIT');
  }
  assert.equal(f.realm.state(authors[0].token).blueprints.length,64);
  f.unchanged(()=>f.command(authors[8].token,'blueprint.publish',{blueprint}),'BLUEPRINT_LIMIT');
  const removable=f.realm.state(authors[0].token).blueprints[0].id;f.command(authors[0].token,'blueprint.remove',{publicationId:removable});f.command(authors[8].token,'blueprint.publish',{blueprint});f.invariant(authors[8].token);
});

test('online SQLite backup preserves active escrow, credentials and exact receipts without overwriting a file',async t=>{
  const f=fixture(t,{disk:true}),a=f.session('Ash'),b=f.session('Birch');f.gather(a.token,'grove',2);f.gather(b.token,'quarry',1);
  const envelope=f.envelope(a.token,'offer.create',{give:{item:'wood',quantity:2},want:{item:'stone',quantity:1}}),receipt=f.realm.command(a.token,envelope).receipt;
  const destination=join(f.directory,'snapshots','first.sqlite'),before=JSON.stringify(f.realm.read()),summary=await backupRealm(f.path,destination);assert.equal(summary.openOffers,1);
  const restored=new SharedRealm({path:destination,now:()=>f.now});t.after(()=>restored.close());assert.equal(JSON.stringify(restored.read()),before);assert.equal(restored.command(a.token,envelope).receipt.replayed,true);
  assert.equal(restored.state(a.token).you.inventory.wood,0);assert.equal(restored.state(b.token).you.inventory.stone,1);
  const bytes=readFileSync(destination);await assert.rejects(()=>backupRealm(f.path,destination),e=>e.code==='EEXIST');assert.deepEqual(readFileSync(destination),bytes);
  f.command(b.token,'offer.fill',{offerId:receipt.result.offerId});assert.equal(restored.state(b.token).offers[0].status,'open');assert.equal(f.realm.state(b.token).offers[0].status,'filled');
});

test('corrupt state, resealed owner substitution, missing custody history and corrupt receipts refuse restart',t=>{
  for(const corruption of ['checksum','owner','journal','receipt']){
    const directory=mkdtempSync(join(tmpdir(),'anima-corrupt-')),path=join(directory,'realm.sqlite');t.after(()=>rmSync(directory,{recursive:true,force:true}));
    let now=1780000000000;const realm=new SharedRealm({path,now:()=>now}),a=realm.createSession({name:'Ash'}),b=realm.createSession({name:'Birch'});
    const cmd=(op,payload)=>realm.command(a.token,{key:'corrupt-'+now,expectedRevision:realm.state(a.token).revision,op,payload});
    for(let i=0;i<6;i++){now+=250;cmd('move',{dx:-1,dz:0});}now+=1000;cmd('gather',{nodeId:'grove'});realm.close();const db=new DatabaseSync(path);
    if(corruption==='checksum'){const row=db.prepare('SELECT state FROM realm').get();db.prepare('UPDATE realm SET state=?').run(row.state+' ');}
    if(corruption==='owner'){const row=db.prepare('SELECT state FROM realm').get(),s=JSON.parse(row.state);s.players[a.playerId].inventory.wood--;s.players[b.playerId].inventory.wood++;const bytes=JSON.stringify(s);db.prepare('UPDATE realm SET state=?,checksum=?').run(bytes,createHash('sha256').update(bytes).digest('hex'));}
    if(corruption==='journal')db.exec('DELETE FROM journal WHERE revision=(SELECT max(revision) FROM journal)');
    if(corruption==='receipt')db.exec("UPDATE receipts SET receipt='{}'");db.close();
    assert.throws(()=>new SharedRealm({path,now:()=>now}),error=>error.code==='CORRUPT_REALM',corruption);
  }
  const directory=mkdtempSync(join(tmpdir(),'anima-invalid-')),path=join(directory,'realm.sqlite');t.after(()=>rmSync(directory,{recursive:true,force:true}));writeFileSync(path,'not a database');assert.throws(()=>new SharedRealm({path}));assert.equal(readFileSync(path,'utf8'),'not a database');
});

test('two HTTP clients race for one escrow: one wins; reconnect sees one settlement and no secret leakage',async t=>{
  const f=fixture(t),a=f.session('Ash'),b=f.session('Birch'),c=f.session('Cedar');f.gather(a.token,'grove');f.gather(b.token,'quarry');f.gather(c.token,'quarry');
  const offerId=f.command(a.token,'offer.create',{give:{item:'wood',quantity:1},want:{item:'stone',quantity:1}}).receipt.result.offerId;
  const server=createRealmServer({realm:f.realm});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));const base=`http://127.0.0.1:${server.address().port}`;
  const post=(token,envelope,extra={})=>fetch(base+'/api/command',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,...extra},body:JSON.stringify(envelope)});
  const bEnvelope=f.envelope(b.token,'offer.fill',{offerId}),cEnvelope=f.envelope(c.token,'offer.fill',{offerId});const replies=await Promise.all([post(b.token,bEnvelope),post(c.token,cEnvelope)]);
  assert.deepEqual(replies.map(r=>r.status).sort(),[200,409]);const bodies=await Promise.all(replies.map(r=>r.json()));const winner=bodies.find(b=>b.receipt),loser=bodies.find(b=>b.error);assert.equal(loser.error.code,'REVISION_CONFLICT');assert.equal(winner.state.you.inventory.wood,1);
  const view=await (await fetch(base+'/api/state',{headers:{Authorization:'Bearer '+a.token}})).json();assert.equal(view.you.inventory.stone,1);assert.equal(JSON.stringify(view).includes(a.token),false);assert.equal(JSON.stringify(view).includes('token_hash'),false);
  const again=await post(winner.state.you.id===b.playerId?b.token:c.token,winner.state.you.id===b.playerId?bEnvelope:cEnvelope);assert.equal((await again.json()).receipt.replayed,true);
  assert.equal((await fetch(base+'/api/state')).status,401);assert.equal((await post(a.token,f.envelope(a.token,'move',{dx:0,dz:0}),{Origin:'https://attacker.invalid'})).status,403);
  assert.equal((await fetch(base+'/server/authority.mjs')).status,404);assert.equal((await fetch(base+'/..%2fserver%2fauthority.mjs')).status,404);
  assert.equal((await fetch(base+'/shared-rules.js')).headers.get('content-type'),'text/javascript; charset=utf-8');
  const malformed=await fetch(base+'/api/command',{method:'POST',headers:{Authorization:'Bearer '+a.token,'Content-Type':'application/json'},body:'{"op":'});assert.equal(malformed.status,400);
  f.invariant(a.token);
});
