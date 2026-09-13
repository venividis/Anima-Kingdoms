import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname} from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {HostedRealm} from '../server/hosted-authority.mjs';
import {handleCommons} from '../server/hosted-http.mjs';
import {toNative} from '../public/luma/language.js';

const require=createRequire(import.meta.url);
const {Miniflare}=await import(require.resolve('miniflare',{paths:[dirname(require.resolve('wrangler/package.json'))]}));
let mf;let caseNumber=0;
before(()=>{mf=new Miniflare({modules:true,script:'export default {fetch(){return new Response("isolated D1 tests")}}',d1Databases:Array.from({length:12},(_,i)=>'DB'+i),compatibilityDate:'2026-05-15'});});
after(async()=>{await mf?.dispose();});
async function setup(){
 const db=await mf.getD1Database('DB'+caseNumber++);
 for(const sql of readFileSync(new URL('../drizzle/0000_flippant_ego.sql',import.meta.url),'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(sql).run();
 let clock=1800000000000;
 const realm=()=>new HostedRealm(db,{now:()=>clock});
 const session=async name=>realm().createSession({name,key:randomUUID()});
 const act=async(token,op,payload)=>{clock+=1000;return realm().command(token,{key:randomUUID(),expectedRevision:(await realm().state(token)).revision,op,payload});};
 const walk=async(token,x,z)=>{for(let n=0;n<80;n++){const p=(await realm().state(token)).you,dx=x-p.x,dz=z-p.z,len=Math.hypot(dx,dz);if(len<.3)return;const scale=Math.max(1.75,len);await act(token,'move',{dx:dx/scale,dz:dz/scale});}throw Error('Walking did not reach the selected place.');};
 const gather=async(token,nodeId,n)=>{for(let i=0;i<n;i++)await act(token,'gather',{nodeId});};
 return {db,realm,session,act,walk,gather,now:()=>clock,advance:ms=>{clock+=ms;}};
}

test('the hosted game executes the canonical rules without a second handwritten rule set',()=>{
 execFileSync(process.execPath,['scripts/build-hosted-rules.mjs','--check']);
 const generated=readFileSync(new URL('../server/hosted-rules.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(generated,/node:(sqlite|fs|path)/);
});

test('concurrent arrivals and cold requests retain one identity and its stable recovery key',async()=>{
 const t=await setup(),body={name:'Melu',key:randomUUID()};
 const arrivals=await Promise.all([t.realm().createSession(body),t.realm().createSession(body)]);
 assert.equal(arrivals[0].token,arrivals[1].token);assert.equal(arrivals[0].playerId,arrivals[1].playerId);
 const state=await t.realm().state(arrivals[0].token);assert.equal(state.revision,1);assert.equal(state.players.length,1);
 assert.equal(Object.values(state.you.inventory).reduce((a,b)=>a+b),0);
 await assert.rejects(t.realm().createSession({...body,name:'Different'}),{code:'SESSION_KEY_COLLISION'});
 assert.equal((await t.realm().createSession(body)).replayed,true);
});

test('two hosted players build the span through native Luma and exchange a real gift',async()=>{
 const t=await setup(),a=await t.session('Melu'),b=await t.session('Rema');
 await t.walk(a.token,-9,17);await t.gather(a.token,'grove',8);await t.walk(a.token,0,1);
 await t.walk(b.token,9,17);await t.gather(b.token,'quarry',8);await t.walk(b.token,0,1);
 const bound=(item)=>({text:toNative('pe mi me bani ta bana.'),bindings:{kind:'project',projectId:'crossing',item,quantity:8}});
 for(const mode of ['i','u','e']){
  const value=bound('wood');value.text=toNative(mode+' mi me bani ta bana.');
  const result=await t.act(a.token,'luma.speak',value);assert.equal(result.state.you.inventory.wood,8);assert.equal(result.state.projects[0].delivered.wood,0);
 }
 await t.act(a.token,'luma.speak',bound('wood'));const built=await t.act(b.token,'luma.speak',bound('stone'));
 assert.equal(built.state.world.bridgeOpen,true);assert.equal(built.state.you.inventory.marks,16);
 await t.walk(a.token,0,-20);assert.ok((await t.realm().state(a.token)).you.z<-15);
 const gift=await t.act(a.token,'luma.speak',{text:toNative('pe mi me doni ta dona li ti.'),bindings:{kind:'gift',recipientId:b.playerId,item:'marks',quantity:1}});
 const id=gift.receipt.result.effect.giftId;
 await t.act(b.token,'gift.accept',{giftId:id});
 assert.equal((await t.realm().state(a.token)).you.inventory.marks,15);
 const final=await t.realm().state(b.token);assert.equal(final.you.inventory.marks,17);
 assert.ok(Object.values(final.ledger.residual).every(v=>v===0));assert.ok(final.luma.utterances.some(u=>u.native.includes('\uE000')));
});

test('simultaneous gift settlement commits once and exact retries replay the receipt',async()=>{
 const t=await setup(),a=await t.session('Giver'),b=await t.session('Receiver');
 await t.walk(a.token,-9,17);await t.gather(a.token,'grove',1);
 const gift=await t.act(a.token,'gift.offer',{recipientId:b.playerId,give:{item:'wood',quantity:1}});
 const envelope={key:randomUUID(),expectedRevision:gift.state.revision,op:'gift.accept',payload:{giftId:gift.receipt.result.giftId}};
 const results=await Promise.all([t.realm().command(b.token,envelope),t.realm().command(b.token,envelope)]);
 assert.equal(results[0].receipt.revision,results[1].receipt.revision);assert.ok(results.some(r=>r.receipt.replayed));
 assert.equal((await t.realm().state(b.token)).you.inventory.wood,1);
 await assert.rejects(t.realm().command(b.token,{...envelope,op:'gift.decline'}),{code:'KEY_COLLISION'});
 const revision=(await t.realm().state(b.token)).revision;
 const race=await Promise.allSettled([t.realm().command(b.token,{key:randomUUID(),expectedRevision:revision,op:'move',payload:{dx:1,dz:0}}),t.realm().command(b.token,{key:randomUUID(),expectedRevision:revision,op:'move',payload:{dx:-1,dz:0}})]);
 assert.equal(race.filter(r=>r.status==='fulfilled').length,1);assert.equal(race.find(r=>r.status==='rejected').reason.code,'REVISION_CONFLICT');
});

test('a failing D1 batch rolls back the state, transfer, credential and receipt writes',async()=>{
 const t=await setup(),a=await t.session('Keeper'),before=await t.realm().state(a.token);
 const broken={prepare:sql=>t.db.prepare(sql),batch:queries=>t.db.batch([...queries,t.db.prepare('INSERT INTO commons_realm SELECT * FROM commons_realm')])};
 const envelope={key:randomUUID(),expectedRevision:before.revision,op:'agent.create',payload:{name:'No partial agent',scopes:['move'],allowance:3,expiresInSeconds:600}};
 await assert.rejects(new HostedRealm(broken,{now:t.now}).command(a.token,envelope));
 const after=await t.realm().state(a.token);assert.equal(after.revision,before.revision);assert.equal(after.agents.length,0);
 assert.equal((await t.db.prepare('SELECT count(*) AS n FROM commons_credentials').first()).n,1);
 assert.equal((await t.db.prepare('SELECT count(*) AS n FROM commons_receipts').first()).n,0);
 assert.equal((await t.db.prepare('SELECT count(*) AS n FROM commons_journal').first()).n,1);
});

test('hosted agent scopes, allowance, replay, renewal and revocation survive fresh instances',async()=>{
 const t=await setup(),a=await t.session('Keeper');
 const grant=await t.act(a.token,'agent.create',{name:'Scribe',scopes:['luma.speak','move'],allowance:1,expiresInSeconds:600}),token=grant.receipt.result.token;
 await assert.rejects(t.act(token,'luma.speak',{text:'pe mi me bani ta bana.',bindings:{kind:'project',projectId:'crossing',item:'wood',quantity:1}}),{code:'AGENT_SCOPE'});
 const envelope={key:randomUUID(),expectedRevision:grant.state.revision,op:'luma.speak',payload:{text:'a mi me honi ta loma he.',bindings:{kind:'experience'}}};
 const used=await t.realm().command(token,envelope);assert.equal(used.state.you.agent.remaining,0);
 assert.equal((await t.realm().command(token,envelope)).receipt.replayed,true);
 await assert.rejects(t.act(token,'move',{dx:1,dz:0}),{code:'AGENT_ALLOWANCE'});
 const renewed=await t.act(a.token,'session.renew',{});assert.ok(renewed.state.you.expiresAt>a.expiresAt);
 await t.act(a.token,'agent.revoke',{agentId:grant.receipt.result.agentId});
 await assert.rejects(t.realm().state(token),{code:'AGENT_REVOKED'});
});

test('hosted HTTP preserves drafts on errors and applies origin, body and principal limits',async()=>{
 const t=await setup();
 const call=(path,method='GET',value,headers={})=>handleCommons(new Request('https://game.example'+path,{method,headers:{...(value===undefined?{}:{'content-type':'application/json'}),...headers},...(value===undefined?{}:{body:JSON.stringify(value)})}),t.db,{now:t.now});
 assert.equal((await call('/api/health')).status,200);
 assert.equal((await call('/api/session','POST',{name:'Other'},{origin:'https://elsewhere.example'})).status,403);
 assert.equal((await call('/api/session','POST',{name:'a'.repeat(20000)})).status,413);
 const arrived=await call('/api/session','POST',{name:'Tester',key:randomUUID()});assert.equal(arrived.status,201);const player=await arrived.json();
 const headers={authorization:'Bearer '+player.token};const state=await call('/api/state','GET',undefined,headers);assert.equal(state.headers.get('cache-control'),'no-store');assert.equal(state.status,200);
 assert.equal((await call('/api/command','POST',{key:randomUUID(),expectedRevision:0,op:'move',payload:{dx:1,dz:0}},headers)).status,409);
 await t.db.prepare('UPDATE commons_limits SET count=1200 WHERE principal=?').bind('player:'+player.playerId).run();
 assert.equal((await call('/api/state','GET',undefined,headers)).status,429);
 assert.equal((await t.realm().state(player.token)).revision,1);
});

test('damaged persisted custody is refused without minting a replacement realm',async()=>{
 const t=await setup(),a=await t.session('Keeper');
 await t.db.prepare('UPDATE commons_realm SET checksum=? WHERE id=1').bind('invalid').run();
 await assert.rejects(t.realm().state(a.token),{code:'CORRUPT_REALM'});
 await t.db.prepare('DELETE FROM commons_realm WHERE id=1').run();
 await assert.rejects(t.realm().load(),{code:'CORRUPT_REALM'});
 assert.equal((await t.db.prepare('SELECT count(*) AS n FROM commons_realm').first()).n,0);
});

test('a hosted schema-three realm migrates in place and a native alchemy process survives cold D1 requests',async()=>{
 const t=await setup(),a=await t.session('Moonwell keeper');await t.walk(a.token,-12,5);await t.gather(a.token,'reeds',2);await t.walk(a.token,12,5);await t.gather(a.token,'fruit',1);
 const row=await t.db.prepare('SELECT state FROM commons_realm WHERE id=1').first(),legacy=JSON.parse(row.state);delete legacy.cosmos;legacy.schemaVersion=3;const bytes=JSON.stringify(legacy);
 await t.db.prepare('UPDATE commons_realm SET state=?,checksum=? WHERE id=1').bind(bytes,createHash('sha256').update(bytes).digest('hex')).run();
 const migrated=await t.realm().state(a.token);assert.equal(migrated.you.inventory.herb,2);assert.equal(migrated.cosmos.workshop.job,null);
 await t.walk(a.token,4,13);const made=await t.act(a.token,'cosmos.start',{recipe:'dew',mode:'steady',text:toNative('pe mi me peli ta "Moon dew" ki wela.')});assert.equal(made.state.you.inventory.herb,0);
 await assert.rejects(t.act(a.token,'cosmos.advance',{cooling:'water'}),{code:'COSMOS_RULE'});
 for(const duration of [4500,6000,3000]){t.advance(duration);await t.act(a.token,'cosmos.advance',{cooling:'water'});}
 const product=(await t.realm().state(a.token)).cosmos.workshop.products[0];assert.equal(product.inscription,toNative('luna'));
 const envelope={key:randomUUID(),expectedRevision:(await t.realm().state(a.token)).revision,op:'cosmos.use',payload:{id:product.id}};
 const used=await t.realm().command(a.token,envelope);assert.ok(used.state.cosmos.effects.dewUntil>used.state.cosmos.elapsed);assert.equal((await t.realm().command(a.token,envelope)).receipt.replayed,true);
 const saved=JSON.parse((await t.db.prepare('SELECT state FROM commons_realm WHERE id=1').first()).state);assert.equal(saved.schemaVersion,4);assert.equal(saved.cosmos.spent.herb,2);assert.ok(Object.values(used.state.ledger.residual).every(n=>n===0));
});
