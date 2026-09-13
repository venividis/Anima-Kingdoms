import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {request} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {SharedRealm,custody} from '../server/authority.mjs';
import {createRealmServer} from '../server/index.mjs';
import {SPEED,ITEMS} from '../public/shared-rules.js';
import {seed,compile} from '../public/creation.js';
import {toNative} from '../public/luma/language.js';

function fixture(t,{disk=false}={}){
  const directory=mkdtempSync(join(tmpdir(),'anima-luma-shared-')),path=disk?join(directory,'realm.sqlite'):':memory:';
  let clock=1_800_000_000_000,sequence=0,realm=new SharedRealm({path,now:()=>clock});
  const f={directory,path,get realm(){return realm;},advance(ms=1000){clock+=ms;},session(name,key){return realm.createSession(key?{name,key}:{name});},
    envelope(token,op,payload){return {key:'luma-shared-'+(++sequence),expectedRevision:realm.state(token).revision,op,payload};},
    command(token,op,payload){return realm.command(token,this.envelope(token,op,payload));},
    speak(token,text,bindings){return this.command(token,'luma.speak',{text,bindings});},
    walk(token,x,z){for(let n=0;n<500;n++){const p=realm.state(token).you,dx=x-p.x,dz=z-p.z,len=Math.hypot(dx,dz);if(len<.08)return;clock+=250;const d=Math.max(len,SPEED*.25);this.command(token,'move',{dx:dx/d,dz:dz/d});}throw Error('Could not walk to '+x+','+z);},
    gather(token,nodeId,count=1){const node=realm.state(token).nodes.find(n=>n.id===nodeId);this.walk(token,node.x,node.z);for(let n=0;n<count;n++){clock+=900;this.command(token,'gather',{nodeId});}},
    unchanged(fn,code){const before=JSON.stringify(realm.read());assert.throws(fn,error=>code?error.code===code:!!error.code);assert.equal(JSON.stringify(realm.read()),before);},
    reopen(){try{realm.close();}catch(error){if(error.code!=='ERR_INVALID_STATE')throw error;}realm=new SharedRealm({path,now:()=>clock});return realm;},
    invariant(){assert.deepEqual(custody(realm.read()).residual,Object.fromEntries(ITEMS.map(item=>[item,0])));}
  };
  t.after(()=>{try{realm.close();}catch{}rmSync(directory,{recursive:true,force:true});});return f;
}
const project=(item='wood',quantity=1)=>({kind:'project',projectId:'crossing',item,quantity});
const gift=(recipientId,item='wood',quantity=1)=>({kind:'gift',recipientId,item,quantity});
async function serve(t,realm,options={}){const server=createRealmServer({realm,...options});await new Promise(resolve=>server.listen(0,options.bind||'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>{server.closeAllConnections();server.close(resolve);}));return {server,base:'http://127.0.0.1:'+server.address().port};}
const headers=token=>({'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})});

test('Luma imagination, intention and inference report real blockers; native undertakings fund a shared crossing once',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Melu'),b=f.session('Rema');
  for(const [mode,status] of [['i','imagined'],['u','intended'],['e','inspected']]){
    const result=f.speak(a.token,`${mode} mi me bani ta bana.`,project('wood',8)).receipt.result;
    assert.equal(result.status,status);assert.equal(result.ready,false);assert.equal(result.blocker.code,'OUT_OF_REACH');assert.equal(result.effect,undefined);
  }
  assert.equal(f.realm.state(a.token).you.inventory.wood,0);assert.equal(f.realm.read().projects[0].delivered.wood,0);
  f.gather(a.token,'grove',8);f.walk(a.token,0,-3);
  const before=f.realm.state(a.token).you.inventory;
  const imagined=f.speak(a.token,'i mi me bani melu ta "The Joined Span" ki #f "wood".',project('wood',8)).receipt.result;
  assert.equal(imagined.ready,true);assert.equal(imagined.preview.reward,16);assert.deepEqual(f.realm.state(a.token).you.inventory,before);
  const text=toNative('pe mi me bani melu ta bana la "The Joined Span" ki #f "wood".'),envelope=f.envelope(a.token,'luma.speak',{text,bindings:project('wood',8)}),built=f.realm.command(a.token,envelope);
  assert.equal(built.receipt.result.status,'enacted');assert.equal(built.receipt.result.effect.reward,16);assert.equal(built.state.you.inventory.wood,0);assert.equal(built.state.you.inventory.marks,16);
  f.reopen();assert.equal(f.realm.command(a.token,envelope).receipt.replayed,true);assert.equal(f.realm.state(a.token).you.inventory.marks,16);
  f.gather(b.token,'quarry',8);f.walk(b.token,0,-3);
  const done=f.speak(b.token,'pe mi me bani ta pela ki #f bema.',project('stone',8));assert.equal(done.state.world.bridgeOpen,true);assert.equal(done.state.treasury.marks,468);
  f.walk(a.token,0,-22);f.walk(b.token,0,-24);assert.ok(f.realm.state(a.token).you.z<-19);assert.ok(f.realm.state(b.token).you.z<-19);f.invariant();
});

test('shared action resolution rejects other speakers, mixed modes, qualifiers and every unimplemented condition without mutation',t=>{
  const f=fixture(t),a=f.session('Melu');
  const sentences=[
    'pe ni me bani ta bana.','pe "mi" me bani ta bana.','pe #e mi me bani ta bana.','pe mi mele me bani ta bana.',
    'pe mi me nu bani ta bana.','pe pa mi me bani ta bana.','pe do mi me bani ta bana.','pe u mi me bani ta bana.',
    'mi me bani ta bana.','pe mi me bani ta bana su ti.','pe mi me bani ta bana leme.','pe mi me bani ta [mi me peli].',
    'pe mi me bani ta bana ki "stone".','pe mi me bani ta bana ki "ore".','pe mi me bani ta bana ki #e/i "wood".',
    'pe mi me bani ta bana ki #i "wood".','pe mi me bani ta bana la "The Concord Beacon".',
    'pe mi me bani ta bana. pe ni me bani ta bana.'
  ];
  for(const text of sentences)f.unchanged(()=>f.speak(a.token,text,project()));
  f.unchanged(()=>f.speak(a.token,'pe mi me bani ta bana.',{...project(),playerId:a.playerId}),'INVALID_SHAPE');f.invariant();
});

test('Luma gifts remain funded escrow until the actual recipient welcomes them, declines them or the sender withdraws',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Melu'),b=f.session('Rema'),c=f.session('Third witness');f.gather(a.token,'fruit',3);
  const bindings=gift(b.playerId,'food',1);
  for(const mode of ['i','u','e']){const r=f.speak(a.token,`${mode} mi me doni ta #e bama li "Rema".`,bindings);assert.equal(r.receipt.result.ready,true);assert.equal(r.state.you.inventory.food,3);assert.equal(r.state.gifts.length,0);}
  const offered=f.speak(a.token,toNative('pe mi me doni ta #e bama li ti.'),bindings),id=offered.receipt.result.effect.giftId;
  assert.equal(offered.state.you.inventory.food,2);assert.equal(f.realm.state(b.token).you.inventory.food,0);assert.equal(f.realm.state(c.token).gifts.length,0);
  for(const token of [a.token,c.token])for(const op of ['gift.accept','gift.decline'])f.unchanged(()=>f.command(token,op,{giftId:id}),'NOT_OWNER');
  f.unchanged(()=>f.command(b.token,'gift.cancel',{giftId:id}),'NOT_OWNER');
  f.reopen();const accept=f.envelope(b.token,'gift.accept',{giftId:id});f.realm.command(b.token,accept);f.reopen();assert.equal(f.realm.command(b.token,accept).receipt.replayed,true);assert.equal(f.realm.state(b.token).you.inventory.food,1);
  const second=f.speak(a.token,'pe mi me mari ta dona li "Rema".',bindings).receipt.result.effect.giftId;f.command(b.token,'gift.decline',{giftId:second});assert.equal(f.realm.state(a.token).you.inventory.food,2);
  const third=f.speak(a.token,'pe mi me doni ta dona li ti.',bindings).receipt.result.effect.giftId;f.command(a.token,'gift.cancel',{giftId:third});assert.equal(f.realm.state(a.token).you.inventory.food,2);f.invariant();
});

test('gift bindings reject prototype names, mismatched material/quantity/recipient and exhausted open-gift capacity',t=>{
  const f=fixture(t),a=f.session('Melu'),b=f.session('Rema');f.gather(a.token,'grove',14);
  for(const recipientId of ['__proto__','constructor','toString',null])f.unchanged(()=>f.speak(a.token,'pe mi me doni ta dona li ti.',gift(recipientId)),'UNKNOWN_RECIPIENT');
  for(const text of ['pe mi me doni ta bema li ti.','pe mi me doni ta "ore" li ti.','pe mi me doni ta #i dona li ti.','pe mi me doni ta dona li "Someone else".','pe mi me doni ta dona li #e ti.'])f.unchanged(()=>f.speak(a.token,text,gift(b.playerId)));
  f.unchanged(()=>f.speak(a.token,'pe mi me doni ta dona li ti.',gift(a.playerId)),'SELF_GIFT');
  for(let n=0;n<12;n++)f.speak(a.token,'pe mi me doni ta dona li ti.',gift(b.playerId));
  f.unchanged(()=>f.speak(a.token,'pe mi me doni ta dona li ti.',gift(b.playerId)),'GIFT_LIMIT');assert.equal(f.realm.state(a.token).you.inventory.wood,2);f.invariant();
});

test('open gift custody survives more than two hundred closed gifts and restart',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Melu'),b=f.session('Rema');f.gather(a.token,'grove',2);
  const pending=f.command(a.token,'gift.offer',{recipientId:b.playerId,give:{item:'wood',quantity:1}}).receipt.result.giftId;
  for(let n=0;n<205;n++){const id=f.command(a.token,'gift.offer',{recipientId:b.playerId,give:{item:'wood',quantity:1}}).receipt.result.giftId;f.command(a.token,'gift.cancel',{giftId:id});}
  assert.equal(f.realm.read().gifts.length,201);assert.equal(f.realm.state(b.token).gifts.find(g=>g.id===pending).status,'open');f.reopen();f.command(b.token,'gift.accept',{giftId:pending});assert.equal(f.realm.state(b.token).gifts.at(-1).id,pending);assert.equal(f.realm.state(b.token).gifts.at(-1).status,'accepted');assert.equal(f.realm.state(b.token).you.inventory.wood,1);assert.equal(f.realm.state(a.token).you.inventory.wood,1);f.invariant();
});

test('delegated undertakings require both language and resolved-action scopes, consume one allowance and replay at zero extra cost',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Melu'),b=f.session('Rema');f.gather(a.token,'grove',2);
  const grant=scopes=>f.command(a.token,'agent.create',{name:'Luma companion',scopes,allowance:2,expiresInSeconds:3600}).receipt.result;
  const languageOnly=grant(['luma.speak']);f.unchanged(()=>f.speak(languageOnly.token,'pe mi me doni ta dona li ti.',gift(b.playerId)),'AGENT_SCOPE');
  assert.equal(f.speak(languageOnly.token,'i mi me doni ta dona li ti.',gift(b.playerId)).receipt.result.status,'imagined');assert.equal(f.realm.state(languageOnly.token).you.agent.remaining,1);
  const actionOnly=grant(['gift.offer']);f.unchanged(()=>f.speak(actionOnly.token,'pe mi me doni ta dona li ti.',gift(b.playerId)),'AGENT_SCOPE');
  const both=grant(['luma.speak','gift.offer']),envelope=f.envelope(both.token,'luma.speak',{text:'pe mi me doni ta dona li ti.',bindings:gift(b.playerId)}),first=f.realm.command(both.token,envelope);
  assert.equal(first.state.you.agent.remaining,1);assert.equal(first.state.you.inventory.wood,1);f.reopen();const replay=f.realm.command(both.token,envelope);assert.equal(replay.receipt.replayed,true);assert.equal(replay.state.you.agent.remaining,1);assert.equal(replay.receipt.result.effect.giftId,first.receipt.result.effect.giftId);f.invariant();
});

test('own experience records preserve native speech and bounded history without acquiring assets or commanding another person',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Melu'),b=f.session('Rema'),before=f.realm.state(a.token).you.inventory;
  f.unchanged(()=>f.speak(a.token,'a ti me honi ta loma he.',{kind:'experience'}),'LUMA_SPEAKER');f.unchanged(()=>f.speak(a.token,'pe mi me honi ta loma he.',{kind:'experience'}),'LUMA_BINDING');
  for(let n=0;n<83;n++)f.speak(a.token,toNative('a mi me honi ta loma he.'),{kind:'experience'});
  f.reopen();const view=f.realm.state(b.token),u=view.luma.utterances.at(-1);assert.equal(view.luma.utterances.length,80);assert.equal(u.playerName,'Melu');assert.equal(u.mode,'a');assert.equal(u.status,'experienced');assert.equal(u.native,toNative('a mi me honi ta loma he.'));assert.deepEqual(f.realm.state(a.token).you.inventory,before);f.invariant();
});

test('Luma blueprint publication recompiles a bounded design and publishes no imported inventory',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Melu'),b=f.session('Rema'),blueprint=seed('instrument');blueprint.name='A repeatable note';
  const imagined=f.speak(a.token,'i mi me peli ta pela.',{kind:'blueprint',blueprint});assert.equal(imagined.state.blueprints.length,0);assert.deepEqual(imagined.receipt.result.preview.buildCost,compile(blueprint).cost);
  const published=f.speak(a.token,'pe mi me peli melu ta pela.',{kind:'blueprint',blueprint});assert.equal(published.state.blueprints.length,1);assert.deepEqual(published.state.you.inventory,Object.fromEntries(ITEMS.map(item=>[item,0])));
  assert.equal(f.realm.state(b.token).blueprints[0].authorName,'Melu');f.unchanged(()=>f.speak(a.token,'pe mi me peli ta pela.',{kind:'blueprint',blueprint:{...blueprint,inventory:{wood:99}}}),'INVALID_BLUEPRINT');f.reopen();assert.equal(f.realm.state(b.token).blueprints[0].id,published.receipt.result.effect.publicationId);f.invariant();
});

test('keyed arrival repeats the identical credential after restart and refuses a changed name or invalid key',t=>{
  const f=fixture(t,{disk:true}),key=randomUUID(),a=f.session('Melu',key),revision=f.realm.read().revision;
  assert.equal(a.replayed,false);const again=f.session('Melu',key);assert.equal(again.replayed,true);assert.equal(again.token,a.token);assert.equal(again.playerId,a.playerId);assert.equal(f.realm.read().revision,revision);
  f.unchanged(()=>f.session('Rema',key),'SESSION_KEY_COLLISION');f.unchanged(()=>f.realm.createSession({name:'Melu',key:'short'}),'INVALID_SESSION_KEY');f.unchanged(()=>f.realm.createSession({name:' ',key:randomUUID()}),'INVALID_TEXT');
  const rows=f.realm.db.prepare('SELECT * FROM arrivals').all();assert.equal(rows.length,1);assert.ok(!JSON.stringify(rows).includes(key));assert.ok(!JSON.stringify(rows).includes(a.token));f.reopen();assert.equal(f.session('Melu',key).token,a.token);assert.equal(f.realm.read().revision,revision);
  assert.notEqual(f.session('Melu').playerId,a.playerId);f.invariant();
});

test('actual HTTP arrival can lose its successful response and recover one principal with the same saved request',async t=>{
  const f=fixture(t,{disk:true}),{base}=await serve(t,f.realm),payload={name:'Recovered speaker',key:randomUUID()},bytes=JSON.stringify(payload);
  await new Promise((resolve,reject)=>{const req=request(base+'/api/session',{method:'POST',headers:{...headers(),'Content-Length':Buffer.byteLength(bytes)}},res=>{assert.equal(res.statusCode,201);res.destroy();resolve();});req.on('error',reject);req.end(bytes);});
  const response=await fetch(base+'/api/session',{method:'POST',headers:headers(),body:bytes}),again=await response.json();assert.equal(response.status,201);assert.equal(again.replayed,true);assert.equal(f.realm.read().revision,1);assert.equal(Object.keys(f.realm.read().players).length,1);assert.equal(f.realm.state(again.token).you.name,payload.name);
  const raced=await Promise.all([1,2].map(()=>fetch(base+'/api/session',{method:'POST',headers:headers(),body:bytes}).then(r=>r.json())));assert.ok(raced.every(r=>r.token===again.token&&r.replayed));f.invariant();
});

test('schema two migration preserves prior escrow, credentials, journal and exact command replay',t=>{
  const f=fixture(t,{disk:true}),a=f.session('Earlier player'),b=f.session('Earlier receiver');f.gather(a.token,'grove');const envelope=f.envelope(a.token,'offer.create',{give:{item:'wood',quantity:1},want:{item:'stone',quantity:1}}),offer=f.realm.command(a.token,envelope).receipt.result.offerId,before=f.realm.read();
  f.realm.close();const db=new DatabaseSync(f.path),legacy=structuredClone(before);legacy.schemaVersion=2;delete legacy.gifts;delete legacy.luma;delete legacy.cosmos;const bytes=JSON.stringify(legacy);db.prepare('UPDATE realm SET state=?,checksum=? WHERE id=1').run(bytes,createHash('sha256').update(bytes).digest('hex'));db.close();
  f.reopen();const after=f.realm.read();assert.equal(after.schemaVersion,4);assert.deepEqual(after.players,before.players);assert.deepEqual(after.offers,before.offers);assert.equal(after.revision,before.revision);assert.deepEqual(after.gifts,[]);assert.equal(f.realm.command(a.token,envelope).receipt.replayed,true);assert.equal(f.realm.state(b.token).offers.find(o=>o.id===offer).status,'open');f.invariant();
});

test('HTTP quotas follow verified principal identity across owner and delegate, while arrival ignores forged forwarding headers',async t=>{
  const f=fixture(t),a=f.session('Melu'),b=f.session('Rema'),agent=f.command(a.token,'agent.create',{name:'Reader',scopes:['move'],allowance:1,expiresInSeconds:3600}).receipt.result,{base}=await serve(t,f.realm);
  for(let n=0;n<1200;n++){const response=await fetch(base+'/api/state',{headers:headers(n%2?agent.token:a.token)});assert.equal(response.status,200);await response.arrayBuffer();}
  assert.equal((await fetch(base+'/api/state',{headers:headers(agent.token)})).status,429);assert.equal((await fetch(base+'/api/state',{headers:headers(a.token)})).status,429);assert.equal((await fetch(base+'/api/state',{headers:headers(b.token)})).status,200);
  for(let n=0;n<12;n++){const response=await fetch(base+'/api/session',{method:'POST',headers:{...headers(),'X-Forwarded-For':'198.51.100.'+n},body:JSON.stringify({name:'Arrival '+n,key:randomUUID()})});assert.equal(response.status,201);await response.arrayBuffer();}
  assert.equal((await fetch(base+'/api/session',{method:'POST',headers:{...headers(),'X-Forwarded-For':'192.0.2.99'},body:JSON.stringify({name:'Thirteenth',key:randomUUID()})})).status,429);f.invariant();
});

test('public binding requires a declared origin and the retained source archive alone receives exact executable-script hashes',async t=>{
  const f=fixture(t),unsafe=await serve(t,f.realm,{bind:'0.0.0.0'});assert.equal((await fetch(unsafe.base+'/api/health',{headers:{Host:'localhost'}})).status,403);
  const safe=await serve(t,f.realm),page=await fetch(safe.base+'/shared.html');assert.match(page.headers.get('content-security-policy'),/script-src 'self';/);assert.doesNotMatch(page.headers.get('content-security-policy'),/font-src 'self' data:/);
  const archive=await fetch(safe.base+'/luma/origin.html'),policy=archive.headers.get('content-security-policy'),text=await archive.text();assert.equal(archive.status,200);
  const scripts=[...text.replace(/\r\n?/g,'\n').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)].filter(m=>!m[1].includes('application/json'));
  assert.equal(scripts.length,5);for(const [,attrs,source] of scripts){assert.ok(!attrs.includes('src='));const hash=createHash('sha256').update(source).digest('base64');assert.ok(policy.includes("'sha256-"+hash+"'"));}
  assert.equal((policy.match(/sha256-/g)||[]).length,5);assert.match(policy,/font-src 'self' data:/);assert.match(policy,/media-src 'self' data: blob:/);assert.doesNotMatch(policy,/unsafe-eval/);
  const publicHost=await serve(t,f.realm,{bind:'0.0.0.0',publicOrigin:'https://commons.example'});assert.equal((await fetch(publicHost.base+'/api/health',{headers:{Host:'commons.example',Origin:'https://commons.example'}})).status,200);assert.equal((await fetch(publicHost.base+'/api/health',{headers:{Host:'commons.example',Origin:'https://elsewhere.example'}})).status,403);
});
