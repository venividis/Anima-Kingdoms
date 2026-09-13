import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import * as C from '../public/cosmos.js';
import * as R from '../public/realm.js';
import {ALPHABET,RATIOS} from '../public/luma/data.js';
import {toNative} from '../public/luma/language.js';
import {SharedRealm,custody} from '../server/authority.mjs';
import {gatheringDelay} from '../server/cosmos-rules.mjs';
import {SPEED} from '../public/shared-rules.js';
import {CosmicMeshes} from '../public/cosmos-view.js';

const payload=(id,mode='steady',speech='pe')=>({recipe:id,mode,text:toNative(`${speech} mi me peli ta "${C.RECIPES[id].name}" ki ${C.RECIPES[id].kind==='metal'?'fama':'wela'}.`)});
const tick=(s,n)=>{for(let i=0;i<n;i++)R.tick(s);};
let serial=0;
function walk(s,p){R.command(s,{world:s.id,rules:R.Kingdoms.RULES,controller:'human',epoch:s.kingdoms.grant.epoch,revision:s.kingdoms.revision,key:'cosmic-walk-'+(++serial),op:'walk',payload:{x:p.x,z:p.z}});for(let i=0;i<3000&&s.kingdoms.journey;i++)R.tick(s);assert.ok(Math.hypot(s.hero.x-p.x,s.hero.z-p.z)<1);}
function finish(s,id){walk(s,C.WORKSITES[C.RECIPES[id].station]);R.cosmosCommand(s,'start',payload(id));for(const stage of C.RECIPES[id].stages){tick(s,stage[2]/1000*60+1);R.cosmosCommand(s,'advance',{cooling:C.RECIPES[id].quench});}return s.cosmos.workshop.products.at(-1);}
function balanced(s){assert.ok(Object.values(R.materialLedger(s)).every(n=>n===0));R.restore(R.snapshot(s));}

test('the recorded sky changes the day and preserves the source alphabet, named stars and ordered pitches',()=>{
 const a=C.skyAt(180000),b=C.skyAt(540000);assert.equal(a.stars.length,3);assert.deepEqual(a.stars.map(s=>s.name),['Vega','Deneb','Altair']);
 assert.ok(Math.abs(a.solarAltitude-b.solarAltitude)>10);assert.notEqual(a.daylight,b.daylight);
 assert.equal(a.coordinates16.length,16);for(let i=0;i<16;i+=2)assert.ok(Math.abs(a.coordinates16[i]**2+a.coordinates16[i+1]**2-1)<1e-12);
 const notes=C.score(ALPHABET);assert.equal(notes.length,40);for(let q=0;q<20;q++)assert.deepEqual(notes.slice(q*2,q*2+2).map(n=>n.frequency),[220*RATIOS[Math.floor(q/5)],220*RATIOS[q%5]]);
 for(const s of [a,b,C.skyAt(3e10)])for(const body of s.bodies)assert.ok([body.longitude,body.azimuth,body.altitude].every(Number.isFinite));assert.throws(()=>C.skyAt(NaN));
});

test('rhythm earns quality, cooling changes temper, early and duplicate strikes cannot advance work',()=>{
 function work(mode,cooling){const w=C.workshopState();let now=0;C.startWork(w,'iron',now,mode);assert.throws(()=>C.advanceWork(w,now,cooling));
  for(const stage of C.RECIPES.iron.stages){if(mode==='rhythm'){const at=now;for(let n=1;n<=stage[2]/C.BEAT_MS;n++){now=at+n*C.BEAT_MS;C.strikeWork(w,now);assert.throws(()=>C.strikeWork(w,now));C.validateWorkshop(w,now);}}else now+=stage[2];C.advanceWork(w,now,cooling);}return w.products[0];}
 const steady=work('steady','water'),rhythmic=work('rhythm','water'),air=work('steady','air');assert.ok(rhythmic.quality>steady.quality);assert.ok(steady.quality>air.quality);assert.equal(rhythmic.inscription,toNative('bema'));
 const w=C.workshopState();C.startWork(w,'iron',0,'rhythm');assert.throws(()=>C.strikeWork(w,350));assert.throws(()=>C.strikeWork(w,1100));assert.equal(w.job.strikes.length,0);
});

test('forge, alembic and bell geometry stays finite in active and empty world rendering',()=>{
 let vertices=0,draws=0;const r={mesh(g){assert.ok(g.data.length>0);assert.ok(g.data.every(Number.isFinite));vertices+=g.data.length/9;return g;},draw(g,m){assert.equal(m.length,16);assert.ok([...m].every(Number.isFinite));draws++;}};
 const scene=new CosmicMeshes(r);scene.draw(null,0);const w=C.workshopState();C.startWork(w,'iron',0);scene.draw({workshop:w,town:{bell:{},garden:{}}},750);assert.ok(vertices<100000);assert.ok(draws>10);
});

test('an early tincture accelerates the first growth cycle without making a valid save unreadable',()=>{
 const s=R.newRealm(),p=finish(s,'earth');walk(s,C.WORKSITES.town);R.cosmosCommand(s,'use',{id:p.id});R.civilize(s,'invite');s.pack.wood+=s.reserve.wood;s.reserve.wood=0;
 const rule=R.Civilization.PATCHES.wood;for(let n=0;n<rule.ticks&&!s.civilization.patches.wood.cycles;n++)R.tick(s);
 assert.equal(s.civilization.patches.wood.cycles,1);assert.ok(s.civilization.clock<rule.ticks);balanced(s);
});

test('local crafting walks, pays, survives a mid-process save, reclaims only nonfuel and rejects fabricated input atomically',()=>{
 let s=R.newRealm();const initial=structuredClone(s.pack);walk(s,C.WORKSITES.forge);
 for(const mode of ['i','u','e','a']){R.cosmosCommand(s,'start',payload('iron','steady',mode));assert.deepEqual(s.pack,initial);assert.equal(s.cosmos.workshop.job,null);}
 R.cosmosCommand(s,'start',payload('iron','rhythm'));tick(s,45);R.cosmosCommand(s,'strike',{});s=R.restore(R.snapshot(s));assert.equal(s.cosmos.workshop.job.strikes.length,1);balanced(s);
 for(const p of [{...payload('iron'),now:1e10},{...payload('alloy'),text:payload('iron').text},{...payload('iron'),text:'pe ni me peli ta "Star-iron".'}]){const before=structuredClone(s);assert.throws(()=>R.cosmosCommand(s,'start',p));assert.deepEqual(s,before);}
 R.cosmosCommand(s,'reclaim',{id:null});assert.equal(s.pack.ore,initial.ore);assert.equal(s.pack.wood,initial.wood-1);assert.equal(s.spent.wood,1);balanced(s);
 const raw=R.snapshot(s);delete raw.cosmos;const legacy=R.restore(raw);assert.equal(legacy.cosmos.clock,0);assert.deepEqual(legacy.pack,s.pack);
});

test('all four local recipes become applied work and the town changes physical delivery and growth',()=>{
 const s=R.newRealm();walk(s,{x:6,z:20});R.trade(s,R.quote(s,'crystal','buy',1));R.trade(s,R.quote(s,'ore','buy',1));R.trade(s,R.quote(s,'herb','buy',2));
 const iron=finish(s,'iron');R.cosmosCommand(s,'use',{id:iron.id});assert.equal(s.cosmos.blade.quality,iron.quality);
 const alloy=finish(s,'alloy');walk(s,C.WORKSITES.town);R.cosmosCommand(s,'use',{id:alloy.id});R.civilize(s,'invite');R.civilize(s,'supply',{count:1});
 const plain=structuredClone(s);plain.cosmos.town.bell=null;let quicker=0,ordinary=0;while(!s.civilization.ledger.delivered&&quicker<4000){R.tick(s);quicker++;}while(!plain.civilization.ledger.delivered&&ordinary<4000){R.tick(plain);ordinary++;}assert.ok(quicker<ordinary);balanced(s);
 const dew=finish(s,'dew');s.hero.hp=35;R.cosmosCommand(s,'use',{id:dew.id});assert.ok(s.hero.hp>35);
 const earth=finish(s,'earth');walk(s,C.WORKSITES.town);R.cosmosCommand(s,'use',{id:earth.id});
 // Unit ecology setup moves existing stock into the pack to open capacity.
 const patch='wood',rule=R.Civilization.PATCHES[patch];s.pack.wood+=s.reserve.wood;s.reserve.wood=0;
 const baseline=structuredClone(s);baseline.cosmos.town.garden=null;assert.equal(R.Civilization.growthStatus(s,patch),'Growing');
 const before=s.civilization.patches[patch].progress;tick(s,4);tick(baseline,4);assert.equal(s.civilization.patches[patch].progress-before,5);assert.equal(baseline.civilization.patches[patch].progress-before,4);
 tick(s,rule.ticks);balanced(s);assert.ok(s.civilization.patches[patch].cycles>0);assert.ok(s.cosmos.town.bell&&s.cosmos.town.garden);assert.equal(s.cosmos.workshop.products.length,0);
});

function shared(t){const directory=mkdtempSync(join(tmpdir(),'anima-cosmos-')),path=join(directory,'realm.db');let clock=1800000000000,realm=new SharedRealm({path,now:()=>clock}),sequence=0;
 const f={get realm(){return realm;},get now(){return clock;},advance(n){clock+=n;},session:name=>realm.createSession({name}),act(token,op,payload){return realm.command(token,{key:'cosmos-'+(++sequence),expectedRevision:realm.state(token).revision,op,payload});},
  walk(token,x,z){for(let n=0;n<500;n++){const p=realm.state(token).you,dx=x-p.x,dz=z-p.z,len=Math.hypot(dx,dz);if(len<.1)return;clock+=250;const d=Math.max(len,SPEED*.25);this.act(token,'move',{dx:dx/d,dz:dz/d});}assert.fail('Walking did not arrive');},
  gather(token,nodeId,count){const node=realm.state(token).nodes.find(n=>n.id===nodeId);this.walk(token,node.x,node.z);for(let n=0;n<count;n++){clock+=900;this.act(token,'gather',{nodeId});}},
  reopen(){realm.close();realm=new SharedRealm({path,now:()=>clock});},finish(token,id){const r=C.RECIPES[id],p=C.WORKSITES[r.station];this.walk(token,p.x,p.z);this.act(token,'cosmos.start',payload(id));for(const stage of r.stages){clock+=stage[2];this.act(token,'cosmos.advance',{cooling:r.quench});}return realm.state(token).cosmos.workshop.products.at(-1);}};
 t.after(()=>{realm.close();rmSync(directory,{recursive:true,force:true});});return f;}

test('two shared players build the crossing, gather minerals, forge, install a town bell and retain custody after restart',t=>{
 const f=shared(t),a=f.session('Smith'),b=f.session('Witness');f.gather(a.token,'grove',10);f.gather(b.token,'quarry',8);f.walk(a.token,0,-3);f.act(a.token,'project.contribute',{projectId:'crossing',item:'wood',quantity:8});f.walk(b.token,0,-3);f.act(b.token,'project.contribute',{projectId:'crossing',item:'stone',quantity:8});
 f.walk(a.token,0,-24);f.gather(a.token,'ore',2);f.walk(a.token,0,-24);f.gather(a.token,'crystal',1);f.walk(a.token,0,-24);f.walk(a.token,0,1);const p=f.finish(a.token,'alloy');f.reopen();assert.equal(f.realm.state(a.token).cosmos.workshop.products[0].quality,p.quality);
 f.walk(a.token,0,23);const result=f.act(a.token,'cosmos.use',{id:p.id});assert.equal(result.state.cosmos.town.bell.ownerId,a.playerId);assert.ok(gatheringDelay(f.realm.read(),b.playerId,f.now)<900);
 f.reopen();assert.equal(f.realm.state(b.token).cosmos.town.bell.work.inscription,toNative('yuna'));assert.ok(Object.values(custody(f.realm.read()).residual).every(n=>n===0));
 f.gather(b.token,'grove',1);f.advance(gatheringDelay(f.realm.read(),b.playerId,f.now));assert.doesNotThrow(()=>f.act(b.token,'gather',{nodeId:'grove'}));
});

test('shared work is scoped, server timed, exactly replayed and never transfers another player’s product',t=>{
 const f=shared(t),a=f.session('Alchemist'),b=f.session('Visitor');f.gather(a.token,'reeds',2);f.gather(a.token,'quarry',1);f.walk(a.token,4,13);
 const grant=f.act(a.token,'agent.create',{name:'Reader',scopes:['cosmos.start'],allowance:2,expiresInSeconds:3600}).receipt.result;
 const start={key:'cosmic-exact-retry',expectedRevision:f.realm.state(a.token).revision,op:'cosmos.start',payload:payload('earth','rhythm')};f.realm.command(grant.token,start);f.reopen();assert.equal(f.realm.command(grant.token,start).receipt.replayed,true);assert.equal(f.realm.state(grant.token).you.agent.remaining,1);
 const before=structuredClone(f.realm.read());for(const [token,op,p] of [[a.token,'cosmos.advance',{cooling:'air'}],[a.token,'cosmos.strike',{at:1e12}],[b.token,'cosmos.reclaim',{id:null}],[grant.token,'cosmos.advance',{cooling:'air'}]])assert.throws(()=>f.act(token,op,p));assert.deepEqual(f.realm.read(),before);
 for(const stage of C.RECIPES.earth.stages){f.advance(stage[2]);f.act(a.token,'cosmos.advance',{cooling:'air'});}const product=f.realm.state(a.token).cosmos.workshop.products[0];assert.throws(()=>f.act(b.token,'cosmos.use',{id:product.id}));
 f.act(a.token,'agent.revoke',{agentId:grant.agentId});assert.throws(()=>f.act(grant.token,'cosmos.reclaim',{id:product.id}));f.walk(a.token,0,23);f.act(a.token,'cosmos.use',{id:product.id});f.reopen();assert.ok(f.realm.state(b.token).cosmos.town.garden);assert.ok(Object.values(custody(f.realm.read()).residual).every(n=>n===0));
});
