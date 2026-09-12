import * as R from '../public/realm.js';
import test from 'node:test';
import fs from 'node:fs';
const canonical=s=>JSON.stringify(s);
const legacy=name=>JSON.parse(fs.readFileSync(new URL('./fixtures/'+name,import.meta.url),'utf8'));
class Audit {
 constructor(label){this.label=label;this.results=[];this.counter=0;}
 expect(condition,message,details={}){if(!condition)throw Error(message+' '+JSON.stringify(details));}
 async scenario(id,label,fn){await test(id+' '+label,async()=>{const evidence=await fn();this.results.push({id,label,status:'passed',evidence});});}
 rejectAtomic(s,fn){const before=canonical(s);let error;try{fn();}catch(e){error=e.message;}this.expect(!!error,'Command unexpectedly accepted');this.expect(canonical(s)===before,'Rejected command mutated runtime state',{error});return error;}
 command(R,s,op,payload={},extra={}){const q={world:s.id,rules:'anima-concord-1',controller:'human',epoch:s.kingdoms.grant.epoch,revision:s.kingdoms.revision,key:`audit-${++this.counter}`,op,payload,...extra};return {request:q,receipt:R.command(s,q)};}
 checkpoint(R,s){const raw=R.snapshot(s),restored=R.restore(raw);this.expect(Object.values(R.materialLedger(restored)).every(n=>n===0),'Restored materials do not balance');return restored;}
 async until(R,s,predicate,cap=18000){for(let n=0;n<cap;n++){if(predicate(s))return n;R.tick(s);}throw Error(`Condition not reached after ${cap} real simulation ticks`);}
}

const a=new Audit('Independent Kingdoms ready2 adversarial execution');
const tick=(s,n)=>{for(let i=0;i<n;i++)R.tick(s);};
const find=(s,id)=>s.creation.instances.find(e=>e.id===id);
function fixture({assign=true,play=true}={}){
 const s=R.newRealm();s.hero.x=6;s.hero.z=20;R.trade(s,R.quote(s,'crystal','buy',1));
 a.command(R,s,'walk',{x:0,z:-4});for(let i=0;i<1000&&s.kingdoms.journey;i++)R.tick(s);
 a.expect(!s.kingdoms.journey,'Could not walk to bridgehead');
 const kit=a.command(R,s,'guide').receipt.result;a.command(R,s,'fuel',{id:kit.source});a.command(R,s,'feed',{id:kit.carrier});if(play)a.command(R,s,'perform',{id:kit.source});if(assign)a.command(R,s,'assign',{carrier:kit.carrier});return {s,kit};
}
const bounds=s=>({materials:R.materialLedger(s),charge:R.Kingdoms.chargeLedger(s),money:R.Rain.ledger(s.rain).money,order:structuredClone(s.kingdoms.order)});
const invariant=s=>{a.expect(Object.values(R.materialLedger(s)).every(n=>n===0),'Material conservation failed',bounds(s));const c=R.Kingdoms.chargeLedger(s);a.expect(c.issued===c.source+c.flight+c.receiver+c.spent+c.dissipated,'Charge conservation failed',bounds(s));a.expect(R.Rain.ledger(s.rain).money===50,'Money conservation failed',bounds(s));};
await a.scenario('A01','Rejected command envelope and payload operations are atomic',()=>{
 const {s,kit}=fixture({assign:false,play:false});const base={world:s.id,rules:R.Kingdoms.RULES,controller:'human',epoch:s.kingdoms.grant.epoch,revision:s.kingdoms.revision,key:'bad-case',op:'fuel',payload:{id:kit.source}};
 const variants=[{world:'another'},{rules:'another'},{revision:0},{op:'unknown',payload:{}},{op:'walk',payload:{x:NaN,z:0}},{op:'walk',payload:{x:0,z:0,teleport:true}},{op:'link',payload:{source:kit.source,target:kit.receiver,pitches:[1,1]}},{controller:'agent'}];
 return variants.map(v=>({case:v,error:a.rejectAtomic(s,()=>R.command(s,{...base,...v}))}));
});
await a.scenario('A02','Exact accepted command replays without duplicate resource consumption',()=>{
 const {s}=fixture({assign:false,play:false});const original=s.kingdoms.receipts.find(r=>r.op==='fuel'),before=canonical(s),again=R.command(s,JSON.parse(original.bytes));a.expect(canonical(s)===before,'Fuel replay spent resources twice');a.expect(JSON.stringify(again)===JSON.stringify(original),'Fuel replay receipt changed');return {receipt:again,charge:R.Kingdoms.chargeLedger(s)};
});
// Independent positive replay also checks a multi-creation command.
await a.scenario('A02b','Guide receipt replay retains only three creations and no second spending',()=>{
 const s=R.newRealm();s.hero.x=0;s.hero.z=-4;const {request,receipt}=a.command(R,s,'guide'),before=canonical(s),again=R.command(s,request);a.expect(canonical(s)===before,'Duplicate guide mutated state');a.expect(JSON.stringify(again)===JSON.stringify(receipt),'Replay did not return same receipt');return {count:s.creation.instances.length,receipt};
});
await a.scenario('A03','Changed payload with accepted key is rejected atomically',()=>{
 const s=R.newRealm();const {request}=a.command(R,s,'walk',{x:0,z:12});return a.rejectAtomic(s,()=>R.command(s,{...request,payload:{x:2,z:12}}));
});
await a.scenario('A04','Agent grant budget and revocation are enforced',()=>{
 const s=R.newRealm();a.command(R,s,'grant',{enabled:true,limit:1});a.command(R,s,'walk',{x:0,z:12},{controller:'agent'});a.expect(s.kingdoms.grant.remaining===0,'Grant budget not consumed');const exhausted=a.rejectAtomic(s,()=>a.command(R,s,'walk',{x:0,z:10},{controller:'agent'}));a.command(R,s,'grant',{enabled:false,limit:0});const revoked=a.rejectAtomic(s,()=>a.command(R,s,'walk',{x:0,z:10},{controller:'agent'}));return {exhausted,revoked};
});
await a.scenario('C01','Physical two-stone delivery pays four Marks exactly once',async()=>{
 const {s,kit}=fixture(),start=s.rain.balances.human;await a.until(R,s,s=>s.kingdoms.order.paid,4000);const event=s.kingdoms.trace.filter(e=>e.type==='payment');a.expect(s.rain.balances.human-start===4,'Incorrect reward');a.expect(event.length===1,'Payment trace not once');const after=s.rain.balances.human;tick(s,1000);a.expect(s.rain.balances.human===after,'Payment repeated');a.rejectAtomic(s,()=>a.command(R,s,'assign',{carrier:kit.carrier}));invariant(s);a.checkpoint(R,s);return {ticks:s.tick,balances:s.rain.balances,order:s.kingdoms.order,job:s.kingdoms.jobs,carrier:{x:find(s,kit.carrier).x,z:find(s,kit.carrier).z},invariants:bounds(s)};
});
await a.scenario('C02','Cancellation before pickup spends no stone',()=>{
 const {s,kit}=fixture();const before=s.pack.stone;a.command(R,s,'cancel',{carrier:kit.carrier});tick(s,50);a.expect(s.pack.stone===before,'Pre-pickup cancellation spent stone');a.expect(!s.kingdoms.jobs.length,'Job retained');invariant(s);return bounds(s);
});
await a.scenario('C03','Cancellation during outbound cargo returns the actual unit',async()=>{
 let {s,kit}=fixture();await a.until(R,s,s=>find(s,kit.carrier).cargo,500);const loaded=s.pack.stone;tick(s,100);a.command(R,s,'cancel',{carrier:kit.carrier});s=a.checkpoint(R,s);await a.until(R,s,s=>!s.kingdoms.jobs.length,2000);a.expect(s.pack.stone===loaded+1,'Cancelled cargo not returned exactly once');a.expect(s.kingdoms.order.delivered===0,'Cancelled cargo delivered');invariant(s);return bounds(s);
});
await a.scenario('C04','Cancel after partial delivery preserves consumed first stone',async()=>{
 const {s,kit}=fixture();const start=s.pack.stone,marks=s.rain.balances.human;await a.until(R,s,s=>s.kingdoms.order.delivered===1,2000);a.command(R,s,'cancel',{carrier:kit.carrier});tick(s,10);a.expect(s.pack.stone===start-1,'Partial consumption was refunded or charged twice');a.expect(s.rain.balances.human===marks,'Partial request paid unexpectedly');a.expect(s.kingdoms.order.delivered===1,'Partial progress lost');invariant(s);a.checkpoint(R,s);return bounds(s);
});
await a.scenario('C06','Reclaim connected source and active courier is atomic',async()=>{
 const {s,kit}=fixture();const first=a.rejectAtomic(s,()=>R.reclaimCreation(s,kit.source));await a.until(R,s,s=>find(s,kit.carrier).cargo,500);const second=a.rejectAtomic(s,()=>R.reclaimCreation(s,kit.carrier));return {first,second};
});
await a.scenario('S01','Checkpoint preserves in-flight connection packets and future arrival',()=>{
 let {s}=fixture({assign:false});R.tick(s);a.expect(s.kingdoms.packets.length===1,'First packet not emitted');const packet=structuredClone(s.kingdoms.packets[0]);s=a.checkpoint(R,s);a.expect(s.kingdoms.packets[0].id===packet.id,'Packet lost on restore');tick(s,packet.due-s.kingdoms.clock);a.expect(s.kingdoms.receivers[0].status==='active','Restored packet did not power span');invariant(s);return bounds(s);
});
await a.scenario('S03','Checkpoint at every cargo transition retains exactly-once completion',async()=>{
 let {s,kit}=fixture();const start=s.rain.balances.human;let seen=new Set(),checkpoints=[];for(let i=0;i<4000&&!s.kingdoms.order.paid;i++){R.tick(s);const key=s.kingdoms.order.delivered+':'+s.kingdoms.jobs[0]?.phase;if(!seen.has(key)){seen.add(key);s=a.checkpoint(R,s);checkpoints.push({key,tick:s.tick});}}a.expect(s.kingdoms.order.paid,'Checkpointed order did not complete');s=a.checkpoint(R,s);tick(s,500);a.expect(s.rain.balances.human-start===4,'Checkpointed payment differed');invariant(s);return {checkpoints,order:s.kingdoms.order};
});
await a.scenario('S04a','Unknown endpoint and impossible charge corruption are rejected',()=>{
 const {s}=fixture({assign:false});const raw=R.snapshot(s);return [x=>x.kingdoms.links[0].target='missing',x=>x.kingdoms.sources[0].charge=999,x=>x.kingdoms.receivers.push(structuredClone(x.kingdoms.receivers[0]))].map(m=>{const z=structuredClone(raw);m(z);let error;try{R.restore(z);}catch(e){error=e.message;}a.expect(error,'Corruption unexpectedly accepted');return error;});
});
await a.scenario('S04b','Lease far beyond maximum charge duration is rejected',()=>{
 const {s}=fixture({assign:false});tick(s,100);const raw=R.snapshot(s);raw.kingdoms.receivers[0].until=raw.kingdoms.clock+1000000;let error;try{R.restore(raw);}catch(e){error=e.message;}a.expect(error,'Corrupt million-tick powered lease was accepted',{clock:raw.kingdoms.clock,receiver:raw.kingdoms.receivers[0]});return error;
});
await a.scenario('S04c','Receipt operation must agree with its original typed command',()=>{
 const s=R.newRealm();a.command(R,s,'walk',{x:0,z:12});const raw=R.snapshot(s);raw.kingdoms.receipts[0].op='guide';let error;try{R.restore(raw);}catch(e){error=e.message;}a.expect(error,'Receipt op guide was accepted while its bytes describe walk');return error;
});
await a.scenario('S05','Known legal far-east footprint is now rejected before material spending',()=>{
 const s=R.newRealm();s.hero.x=43;s.hero.z=14;const b=R.Creation.seed('structure');b.parts=Array.from({length:5},(_,i)=>({shape:'box',x:(i-2)*4,y:.08,z:0,w:4,h:.16,d:4,color:'#61e1d2',role:'walkway',yaw:0}));return a.rejectAtomic(s,()=>R.create(s,b,55,14));
});
await a.scenario('S06','Prior v0.10 creation world migrates without property loss',()=>{
 const raw=legacy('v10-creature.json'),loaded=R.restore(raw);a.expect(loaded.creation.instances.length===1,'Creation lost in migration');a.expect(JSON.stringify(loaded.pack)===JSON.stringify(raw.pack),'Inventory changed in migration');invariant(loaded);return {oldProfile:raw.profile,newProfile:loaded.profile,kingdoms:!!loaded.kingdoms};
});
await a.scenario('S06b','Accepted legacy overhanging structure cannot create a new unloadable save',()=>{
 const s=R.restore(legacy('v10-overhanging-deck.json')),id=s.creation.instances.find(e=>e.blueprint.kind==='creature').id;for(let i=0;i<1500;i++)R.tick(s,{move:[1,0]});a.checkpoint(R,s);return {hero:s.hero.x,creature:find(s,id).x};
});
await a.scenario('C03b','Cancelled cargo waits for its owner at the fixed pickup',async()=>{
 const {s,kit}=fixture();await a.until(R,s,s=>find(s,kit.carrier).cargo,500);const loaded=s.pack.stone;tick(s,100);a.command(R,s,'walk',{x:10,z:0});await a.until(R,s,s=>!s.kingdoms.journey,1000);a.command(R,s,'cancel',{carrier:kit.carrier});tick(s,400);a.expect(find(s,kit.carrier).cargo?.count===1,'Cargo credited without owner at pickup');a.expect(s.pack.stone===loaded,'Pack changed while owner absent');const pickup=structuredClone(s.kingdoms.jobs[0].pickup);a.command(R,s,'walk',pickup);await a.until(R,s,s=>!s.kingdoms.jobs.length,1500);a.expect(s.pack.stone===loaded+1,'Cargo not returned on actual owner arrival');invariant(s);return bounds(s);
});
await a.scenario('P01','Invited agent completes connected delivery and courier return through typed commands',async()=>{
 const s=R.newRealm();s.hero.x=6;s.hero.z=20;R.trade(s,R.quote(s,'crystal','buy',1));a.command(R,s,'grant',{enabled:true,limit:24});const commands=[];
 const agent=(op,payload={})=>{const out=a.command(R,s,op,payload,{controller:'agent'});commands.push(out);return out.receipt;};
 agent('walk',{x:0,z:-4});await a.until(R,s,s=>!s.kingdoms.journey,1000);const kit=agent('guide').result;agent('fuel',{id:kit.source});agent('feed',{id:kit.carrier});agent('perform',{id:kit.source});agent('assign',{carrier:kit.carrier});await a.until(R,s,s=>s.kingdoms.order.paid,4000);agent('perform',{id:kit.source});await a.until(R,s,s=>!s.kingdoms.jobs.length,3000);invariant(s);a.checkpoint(R,s);a.expect(s.kingdoms.order.delivered===2&&s.kingdoms.order.paid,'Agent did not fulfill request');return {setup:'Human merchant fixture buys one existing crystal and grants24 typed commands; every subsequent action uses controller agent.',ticks:s.tick,commands,remaining:s.kingdoms.grant.remaining,carrier:{x:find(s,kit.carrier).x,z:find(s,kit.carrier).z},balances:s.rain.balances,invariants:bounds(s)};
});
await a.scenario('E03','Activity pause preserves connection clock and pending packet deadlines',()=>{
 const {s}=fixture({assign:false});R.tick(s);const before=structuredClone(s.kingdoms);R.enterActivity(s,'duel');tick(s,20);a.expect(s.kingdoms.clock===before.clock,'World clock advanced in arena');a.expect(JSON.stringify(s.kingdoms.packets)===JSON.stringify(before.packets),'Packets changed in arena');R.leaveActivity(s);R.tick(s);a.expect(s.kingdoms.clock===before.clock+1,'World clock failed to resume');invariant(s);return {before:before.clock,after:s.kingdoms.clock};
});
function gateFixture(pitches=[0],fanout=false){
 const s=R.newRealm();s.hero.x=6;s.hero.z=20;R.trade(s,R.quote(s,'crystal','buy',1));s.hero.x=0;s.hero.z=6;
 const song=R.create(s,R.Creation.seed('instrument'),0,5),gates=[];
 for(const x of fanout?[-4,4]:[0]){const b=R.Creation.seed('structure');b.parts=[{shape:'box',x:0,y:1.2,z:0,w:2,h:2.4,d:1,color:'#61e1d2',role:'solid',yaw:0}];const g=R.create(s,b,x,0);a.command(R,s,'receiver',{id:g.id});a.command(R,s,'link',{source:song.id,target:g.id,pitches});gates.push(g.id);}
 a.command(R,s,'fuel',{id:song.id});return {s,source:song.id,gates};
}
await a.scenario('E01','Pitch filter rejects every unaccepted score note without spending charge',()=>{
 const {s,source}=gateFixture([11]);a.command(R,s,'perform',{id:source});tick(s,500);a.expect(s.kingdoms.sources[0].charge===24,'Filtered note spent source charge');a.expect(s.kingdoms.receivers[0].status==='dormant','Wrong pitch opened gate');a.expect(s.kingdoms.trace.filter(t=>t.type==='filter').length===8,'Each score note was not explicitly filtered');invariant(s);return bounds(s);
});
await a.scenario('E02','Powered gate shares collision state and waits safely for an occupying body',async()=>{
 const {s,source,gates}=gateFixture([0]);a.expect(!R.legal(s,0,0),'Dormant gate is not solid');a.command(R,s,'perform',{id:source});await a.until(R,s,s=>s.kingdoms.receivers[0].status==='active',200);a.expect(R.legal(s,0,0),'Active gate still blocks');a.command(R,s,'walk',{x:0,z:0});await a.until(R,s,s=>!s.kingdoms.journey,500);tick(s,600);a.expect(s.kingdoms.receivers[0].status==='clearing','Occupied expired gate did not wait to close');a.expect(R.legal(s,s.hero.x,s.hero.z),'Occupied body was trapped');a.checkpoint(R,s);a.command(R,s,'walk',{x:0,z:6});await a.until(R,s,s=>!s.kingdoms.journey,500);tick(s,400);a.expect(s.kingdoms.receivers[0].status==='dormant','Vacant gate failed to close');a.expect(!R.legal(s,0,0),'Closed gate has no collision');invariant(s);return {receiver:s.kingdoms.receivers[0],invariants:bounds(s)};
});
await a.scenario('E05','Fanout debits one charge per actual receiver packet',()=>{
 const {s,source}=gateFixture([0],true);a.command(R,s,'perform',{id:source});tick(s,500);a.expect(s.kingdoms.sources[0].charge===20,'Two accepted notes across two wires did not cost four units');a.expect(s.kingdoms.trace.filter(t=>t.type==='arrival').length===4,'Fanout receiver count wrong');invariant(s);a.checkpoint(R,s);return bounds(s);
});
await a.scenario('S08','Saving during each arena restores pending world work at its entrance',()=>{
 const result=[];for(const mode of ['duel','ctf','boss','trial']){let {s,kit}=fixture({assign:false});R.tick(s);const clock=s.kingdoms.clock,pack=JSON.stringify(s.pack);if(mode==='trial'){const b=R.Creation.seed('trial');const bill=R.Creation.compile(b).cost;for(const k of R.MATERIALS)if(s.pack[k]<bill[k]){const q=bill[k]-s.pack[k];s.reserve[k]-=q;s.pack[k]+=q;}const e=R.create(s,b,4,-3);R.enterTrial(s,e.id);}else R.enterActivity(s,mode);tick(s,20);s=a.checkpoint(R,s);a.expect(s.mode==='world','Arena checkpoint did not return to world');a.expect(s.kingdoms.clock===clock,'Checkpoint advanced kingdom clock');a.expect(s.kingdoms.packets.length===1,'Checkpoint lost pending packet');tick(s,100);a.expect(s.kingdoms.receivers[0].status==='active','Checkpointed packet failed to arrive');invariant(s);result.push({mode,clock:s.kingdoms.clock,status:s.kingdoms.receivers[0].status});}return {fixtures:'Trial case transfers needed seed materials from existing reserve to pack for entrance setup; this is explicitly test-only, not agent gameplay.',result};
});

if(process.env.KINGDOMS_TEST_EVIDENCE)fs.writeFileSync(process.env.KINGDOMS_TEST_EVIDENCE,JSON.stringify({label:a.label,results:a.results},null,2)+'\n');
