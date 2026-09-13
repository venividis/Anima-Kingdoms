/* Fresh legal local journey. Only public commands and simulation ticks mutate
 * the world; checkpoint restore uses the current earned snapshot, never an
 * earlier favorable state. No body coordinates, supplies or outcomes are set. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import * as R from '../../../public/realm.js';
import * as L from '../../../public/luma/language.js';
import {lumaScoreNotes} from '../../../public/luma/geometry.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const output=path.resolve(root,process.argv[2]||'docs/audit/luma/local-journey.json');
const hash=value=>createHash('sha256').update(value).digest('hex');
const clone=structuredClone;
const inputs=['public/realm.js','public/world.js','public/creation.js','public/kingdoms.js','public/civilization.js','public/navigation.js','public/luma-world.js','public/luma/language.js','public/luma/geometry.js','public/luma/numbers.js','public/luma/data.js','public/luma/origin.html','docs/audit/luma/local-journey.mjs'];
const report={schema:'anima-luma-legal-local-journey-1',method:'One fresh ordinary world; public local APIs, guided legal movement and 60-Hz ticks. Current-state persistence checkpoints only. This is scripted agent play, not a browser or human playtest.',runtime:process.version,source:inputs.map(file=>({file,sha256:hash(fs.readFileSync(path.join(root,file)))})),status:'running',actions:[],walks:[],checkpoints:[],notes:[],observations:[]};
let s=R.newRealm(), commandSerial=0;
const body=()=>({x:s.hero.x,z:s.hero.z,hp:s.hero.hp,breath:s.hero.breath,bank:s.hero.bank});
const balances=()=>({materials:R.materialLedger(s),water:R.Rain.ledger(s.rain).water,money:R.Rain.ledger(s.rain).money,charge:R.Kingdoms.chargeLedger(s)});
const visible=()=>({tick:s.tick,body:body(),pack:clone(s.pack),market:clone(s.market),reserve:clone(s.reserve),spent:clone(s.spent),marks:clone(s.rain.balances),escrow:s.rain.escrow,instances:s.creation.instances.map(e=>({id:e.id,word:e.blueprint.luma?.word,kind:e.blueprint.kind,investment:clone(e.investment),x:e.x,z:e.z,energy:e.energy,cargo:clone(e.cargo),performance:clone(e.performance)})),households:clone(s.civilization),ledger:balances()});
function check(){const b=balances();assert.ok(Object.values(b.materials).every(n=>n===0));assert.equal(b.water,0);assert.equal(b.money,50);assert.equal(b.charge.issued,b.charge.source+b.charge.flight+b.charge.receiver+b.charge.spent+b.charge.dissipated);R.LumaWorld.validate(s);R.Kingdoms.validate(s);R.Civilization.validate(s);}
function action(label,fn){const before=visible();try{const result=fn();check();report.actions.push({label,tick:s.tick,result:clone(result),before,after:visible()});return result;}catch(error){report.actions.push({label,tick:s.tick,error:error.message,before,after:visible()});throw error;}}
const speak=(text,context={})=>action(text,()=>R.utter(s,text,{...context,key:R.LumaWorld.nextKey(s)}));
const command=(op,payload={})=>action(op,()=>R.command(s,{world:s.id,rules:R.Kingdoms.RULES,controller:'human',epoch:s.kingdoms.grant.epoch,revision:s.kingdoms.revision,key:`legal-journey:${++commandSerial}`,op,payload}));
function tick(){R.tick(s);report.notes.push(...s.creation.notes.map(note=>({tick:s.tick,...clone(note)})));if(s.tick%60===0)check();}
function until(label,predicate,max=6000){const start=s.tick;for(let n=0;n<=max;n++){if(predicate()){check();return s.tick-start;}if(n===max)throw Error(`${label} did not complete within ${max} ticks`);tick();}}
function walk(x,z){const start=s.tick,from=body();command('walk',{x,z});const elapsed=until('legal walk',()=>!s.kingdoms.journey,6000);assert.ok(Math.hypot(s.hero.x-x,s.hero.z-z)<.65,'walk reaches requested location');report.walks.push({from,target:{x,z},arrival:body(),start,end:s.tick,ticks:elapsed});}
function checkpoint(label){const before=visible(),snapshot=R.snapshot(s),serialized=JSON.stringify(snapshot);s=R.restore(JSON.parse(serialized));assert.deepEqual(visible(),before,'persistence preserves earned holdings, positions, scores and household custody');check();report.checkpoints.push({label,tick:s.tick,snapshotSha256:hash(serialized),snapshotBytes:Buffer.byteLength(serialized),ledger:balances()});}
function expectAtomicRejection(label,fn,pattern){const before=JSON.stringify(s);let message;try{fn();assert.fail('Expected rejection');}catch(error){message=error.message;assert.match(message,pattern);}assert.equal(JSON.stringify(s),before);report.observations.push({label,tick:s.tick,rejection:message,unchanged:true});}
const instance=id=>s.creation.instances.find(e=>e.id===id);
report.initial=visible();
try{
  check();
  const pureBefore=JSON.stringify(s);
  const imagined=R.previewLuma(s,'i mi me peli melu ta musa.',{x:-3,z:-4});
  assert.equal(JSON.stringify(s),pureBefore);assert.equal(imagined.blueprint.luma.word,'musa');
  report.observations.push({label:'Pure imagination and exact bill',tick:s.tick,cost:imagined.cost,word:imagined.word,unchanged:true});
  walk(6,20);
  command('buy_crystal');
  for(const[item,qty]of[['herb',3],['food',1]])action(`Buy ${qty} ${item} at the market`,()=>{assert.ok(Math.hypot(s.hero.x-6,s.hero.z-20)<4);const q=R.quote(s,item,'buy',qty);R.trade(s,q);return q;});
  walk(0,23);
  speak('u mi me temi ta mena.');
  speak('pe mi me temi ta mena.');
  speak('u mi me doni ta #u bama li "households".');
  speak('pe mi me doni ta #u bama li "households".');
  assert.equal(s.civilization.ledger.delivered,0);assert.equal(s.civilization.depot.food,4);
  checkpoint('Depot funding is saved before courier delivery');
  walk(0,-4);
  const instrumentPlan=speak('u mi me peli melu ta musa.',{x:-3,z:-4,dimension:16});
  const created=speak('pe mi me peli melu ta musa.',{x:-3,z:-4,dimension:16});
  const music=created.result.instanceId;
  assert.equal(s.luma.intentions.find(e=>e.id===instrumentPlan.result.intentionId).fulfilled,created.revision);
  const span=speak('pe mi me bani ta yuna.',{x:0,z:-13,dimension:16}).result.instanceId;
  const bird=speak('pe mi me peli melu ta wuna.',{x:2,z:-4}).result.instanceId;
  speak('pe mi me meli ta wuna.',{focusId:bird});
  assert.equal(instance(bird).energy,80);
  expectAtomicRejection('Food is not wasted on an already fed creature',()=>R.utter(s,'pe mi me meli ta wuna.',{focusId:bird,key:R.LumaWorld.nextKey(s)}),/enough energy/);
  speak('pe mi me yuni ta pesa.',{focusId:music,targetId:span});
  assert.equal(R.Creation.surface(s,0,-13),false);
  speak('pe mi me meli ta musa.',{focusId:music});
  const playing=speak('pe mi me musi ta musa.',{focusId:music});
  const firstPerformanceStart=s.tick,expectedMusic=lumaScoreNotes('musa');
  until('first note',()=>report.notes.length===1,5);
  checkpoint('Score cursor and in-flight packet preserved after first note');
  until('powered deck',()=>s.kingdoms.receivers.find(e=>e.id===span)?.status==='active',300);
  assert.equal(R.Rain.bridgeOpen(s.rain),false);
  assert.equal(R.Creation.surface(s,0,-13),true);
  const activeTick=s.tick;
  walk(0,-21);
  assert.equal(s.hero.bank,'far');
  report.observations.push({label:'The player crosses an actually powered authored span while the original rain bridge stays closed',activeTick,arrivalTick:s.tick,body:body(),rainBridgeOpen:R.Rain.bridgeOpen(s.rain),receiver:clone(s.kingdoms.receivers.find(e=>e.id===span))});
  checkpoint('Far-bank earned position after legal crossing');
  walk(0,-4);
  until('complete first source score',()=>!instance(music).performance,600);
  const firstNotes=report.notes.slice();assert.equal(firstNotes.length,8);
  assert.deepEqual(firstNotes.map(({tick,...n})=>({letter:n.letter,letterIndex:n.letterIndex,pairIndex:n.pairIndex,pitch:n.pitch,frequency:n.frequency,ratio:n.ratio,code:n.code})),expectedMusic);
  assert.deepEqual(firstNotes.map(n=>n.tick-firstPerformanceStart),Array.from({length:8},(_,i)=>1+i*instance(music).blueprint.beat));
  const oldWire=s.kingdoms.links.find(l=>l.source===music).id;
  expectAtomicRejection('A connected creation cannot be silently reclaimed during repair',()=>R.utter(s,'pe mi me remi melu ta pela.',{focusId:music,key:R.LumaWorld.nextKey(s)}),/Disconnect/);
  command('unlink',{id:oldWire});
  const beforeRepair=clone(s.pack),oldBlueprint=clone(instance(music).blueprint);
  const revised=speak('pe mi me remi melu ta pela.',{focusId:music}).result.instanceId;
  assert.deepEqual(s.pack,beforeRepair);assert.equal(instance(revised).blueprint.parent,`${oldBlueprint.id}@${oldBlueprint.revision}`);
  assert.equal(s.kingdoms.ledger.dissipated,16);
  const sound=speak('pe mi me peli ta sona.',{x:-4,z:-1}).result.instanceId;
  speak('pe mi me musi ta sona.',{focusId:sound});
  const secondPerformanceStart=s.tick;
  until('complete second source score',()=>!instance(sound).performance,600);
  const secondNotes=report.notes.slice(8);assert.equal(secondNotes.length,8);
  assert.deepEqual(secondNotes.map(({tick,...n})=>({letter:n.letter,letterIndex:n.letterIndex,pairIndex:n.pairIndex,pitch:n.pitch,frequency:n.frequency,ratio:n.ratio,code:n.code})),lumaScoreNotes('sona'));
  assert.deepEqual(secondNotes.map(n=>n.tick-secondPerformanceStart),Array.from({length:8},(_,i)=>1+i*instance(sound).blueprint.beat));
  checkpoint('Both complete source scores and repaired lineage survive');
  walk(0,23);
  until('all four household deliveries',()=>s.civilization.ledger.delivered===4,6000);
  until('all four household meals',()=>s.civilization.households.every(h=>h.consumed===1),6000);
  assert.equal(s.civilization.ledger.consumed,4);assert.equal(s.civilization.ledger.funded,4);assert.ok(s.civilization.households.every(h=>h.received===1&&h.missed===0));
  checkpoint('Delivered food has become four observed meals');
  const receipt=s.luma.receipts.find(e=>e.revision===playing.revision),signature=JSON.parse(receipt.signature),beforeReplay=JSON.stringify(s);
  assert.deepEqual(R.utter(s,receipt.source,{...signature.context,key:receipt.key}),receipt);assert.equal(JSON.stringify(s),beforeReplay);
  report.observations.push({label:'Accepted performance receipt replays after persistence without a second cost or score',tick:s.tick,receiptKey:receipt.key,unchanged:true});
  const native=L.toNative('a mi me honi ta loma he.'),beforeExperience=JSON.stringify(s);R.utter(s,native);assert.equal(JSON.stringify(s),beforeExperience);
  report.observations.push({label:'A genuine native own-experience sentence is accepted without mutating the world',tick:s.tick,native,unchanged:true});
  until('all eight received charge units accounted as spent',()=>R.Kingdoms.chargeLedger(s).spent===8,3000);
  report.final=visible();report.trace={connection:clone(s.kingdoms.trace),household:clone(s.civilization.trace),luma:clone(s.luma.receipts)};
  report.summary={actions:report.actions.length,legalWalks:report.walks.length,currentStateCheckpoints:report.checkpoints.length,ticks:s.tick,seconds:s.tick/60,actualNotes:report.notes.length,sourceScores:['musa','sona'],deliveredFood:s.civilization.ledger.delivered,householdMeals:s.civilization.ledger.consumed,matchedIntentions:s.luma.intentions.filter(e=>e.fulfilled!==null).length,finalLedger:balances()};
  report.status='passed';
}catch(error){report.status='failed';report.error={message:error.message,stack:error.stack};report.final=visible();process.exitCode=1;}
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,output,summary:report.summary,error:report.error?.message}));
