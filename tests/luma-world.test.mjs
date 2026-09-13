import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../public/realm.js';
import * as L from '../public/luma/language.js';

const createPhrase='pe mi me peli melu ta musa.';
const copy=s=>structuredClone(s);
const key=s=>R.LumaWorld.nextKey(s);
const speak=(s,text,c={})=>R.utter(s,text,{...c,key:key(s)});
const rejectAtomic=(s,fn,pattern)=>{const before=copy(s);assert.throws(fn,pattern);assert.deepEqual(s,before);};
let commandSerial=0;
const command=(s,op,payload={})=>R.command(s,{world:s.id,rules:R.Kingdoms.RULES,controller:'human',epoch:s.kingdoms.grant.epoch,revision:s.kingdoms.revision,key:`luma-test-command-${++commandSerial}`,op,payload});
const ticks=(s,n)=>{for(let i=0;i<n;i++)R.tick(s);};
const until=(s,predicate,budget=6000)=>{for(let i=0;i<budget;i++){if(predicate(s))return i;R.tick(s);}assert.fail(`Condition unmet after ${budget} simulation ticks`);};
const invariants=s=>{assert.deepEqual(Object.values(R.materialLedger(s)),[0,0,0,0,0,0]);assert.equal(R.Rain.ledger(s.rain).water,0);assert.equal(R.Rain.ledger(s.rain).money,50);const c=R.Kingdoms.chargeLedger(s);assert.equal(c.issued,c.source+c.flight+c.receiver+c.spent+c.dissipated);R.restore(R.snapshot(s));};
const instance=(s,id)=>s.creation.instances.find(e=>e.id===id);
function instrumentFixture(){const s=R.newRealm();const receipt=speak(s,createPhrase,{x:-4,z:15});return {s,id:receipt.result.instanceId};}
function crossingFixture(){
  const s=R.newRealm();
  // Explicit unit-fixture body placement; the end-to-end journey below walks.
  s.hero.x=6;s.hero.z=20;command(s,'buy_crystal');s.hero.x=0;s.hero.z=-4;
  const source=speak(s,createPhrase,{x:-3,z:-4}).result.instanceId;
  const target=speak(s,'pe mi me bani ta yuna.',{x:0,z:-13}).result.instanceId;
  return {s,source,target};
}

test('Luma imagination, inference and experience are pure views of actual state',()=>{
  const s=R.newRealm(),before=copy(s);
  for(const mode of ['i','e','a']){
    const out=R.utter(s,`${mode} mi me peli melu ta musa.`);
    assert.equal(out.mode,mode);assert.equal(out.operation,'creation.create');assert.equal(out.blueprint.luma.word,'musa');assert.ok(out.cost.wood>0);
    assert.deepEqual(s,before);
  }
  const out=R.previewLuma(s,'e mi me wedi ta pela.');
  assert.deepEqual(out.observation.pack,s.pack);assert.equal(out.observation.body.hp,s.hero.hp);assert.equal(out.observation.tick,s.tick);
  assert.deepEqual(s,before);
});

test('an intention preserves its exact passage and a matching undertaking pays the compiled bill',()=>{
  const s=R.newRealm(),before=copy(s.pack),ctx={x:-4,z:15,dimension:6};
  const planned=speak(s,'u mi me peli melu ta musa.',ctx);
  assert.equal(planned.mode,'u');assert.deepEqual(s.pack,before);assert.equal(s.creation.instances.length,0);
  assert.equal(s.luma.intentions[0].source,'u mi me peli melu ta musa.');
  const cost=R.previewLuma(s,createPhrase,ctx).cost;
  const receipt=speak(s,createPhrase,{...ctx,x:-3,z:15});
  for(const item of R.MATERIALS)assert.equal(s.pack[item],before[item]-cost[item]);
  assert.equal(s.luma.intentions[0].fulfilled,receipt.revision);
  assert.equal(instance(s,receipt.result.instanceId).blueprint.luma.dimension,6);
  assert.equal(s.luma.intentions[0].operation,'creation.create');invariants(s);
});

test('typed actor, role, manner and negation checks never silently coerce a different claim',()=>{
  const s=R.newRealm();
  for(const text of ['pe ni me peli ta musa.','pe "mi" me peli ta musa.','pe mi me nu peli ta musa.','pe e mi me peli ta musa.','pe #e mi me peli ta musa.','pe mi me peli ta musa li ti.','pe mi me peli ta musa ki bema.','pe mi me peli remu ta musa.','pe mi me peli ta #e musa.','pe mi me doni ta #e bama li ti.','pe mi me yuni ta yuna.','pe mi me remi ta "mi".']) rejectAtomic(s,()=>speak(s,text,{x:-4,z:15}));
  for(const c of [{x:-4},{x:NaN,z:15},{x:-4,z:15,dimension:17},{x:-4,z:15,extra:true},{focusId:3}])rejectAtomic(s,()=>speak(s,createPhrase,c));
  invariants(s);
});

test('failed placement and insufficient material leave no receipt or partial resources',()=>{
  const s=R.newRealm(),k=key(s);
  rejectAtomic(s,()=>R.utter(s,createPhrase,{x:50,z:40,key:k}),/sixteen steps/);
  const exhausted=copy(s);exhausted.spent.herb+=exhausted.pack.herb;exhausted.pack.herb=0;
  rejectAtomic(exhausted,()=>R.utter(exhausted,createPhrase,{x:-4,z:15,key:key(exhausted)}),/need/);
  const receipt=R.utter(s,createPhrase,{x:-4,z:15,key:k});assert.equal(receipt.revision,1);invariants(s);
});

test('accepted keyed utterances replay exactly across save restore and reject changed bytes',()=>{
  let s=R.newRealm();const c={x:-4,z:15,key:key(s)},receipt=R.utter(s,createPhrase,c);
  s=R.restore(R.snapshot(s));const before=copy(s);
  assert.deepEqual(R.utter(s,createPhrase,c),receipt);assert.deepEqual(s,before);
  rejectAtomic(s,()=>R.utter(s,'pe mi me peli ta musa.',c),/different passage/);
  rejectAtomic(s,()=>R.utter(s,createPhrase,{...c,x:-5}),/different passage/);
  rejectAtomic(s,()=>R.utter(s,createPhrase,{x:-4,z:15,key:`luma:${s.id}:3`}),/next/);
  rejectAtomic(s,()=>R.utter(s,createPhrase,{x:-4,z:15,key:'luma:foreign:2'}),/this world/);
});

test('evicted Luma receipts stay spent forever through the monotonic world sequence',()=>{
  let s=R.newRealm();const c={key:key(s)},first=R.utter(s,'pe mi me wedi ta pela.',c);
  for(let i=0;i<70;i++)speak(s,'pe mi me wedi ta pela.');
  assert.equal(s.luma.serial,71);assert.equal(s.luma.receipts.length,64);assert.equal(s.luma.receipts[0].revision,8);
  s=R.restore(R.snapshot(s));rejectAtomic(s,()=>R.utter(s,first.source,c),/already been used/);invariants(s);
});

test('saved Luma records validate source agreement, canonical keys and bounded results',()=>{
  const s=R.newRealm();speak(s,'u mi me peli melu ta musa.',{dimension:4});speak(s,createPhrase,{x:-4,z:15,dimension:4});const raw=R.snapshot(s);
  const variants=[x=>x.luma.schema='other',x=>x.luma.extra=1,x=>x.luma.serial++,x=>x.luma.receipts[1].result.word='wuna',x=>x.luma.receipts[1].operation='body.mend',x=>x.luma.receipts[1].native='ordinary Latin',x=>x.luma.receipts[1].key='luma:foreign:2',x=>x.luma.receipts[1].signature='{}',x=>x.luma.intentions[0].fulfilled=1,x=>x.luma.intentions[0].source='pe mi me peli melu ta musa.',x=>x.luma.intentions[0].context.dimension=0,x=>x.luma.receipts[1].result.extra=true];
  for(const mutate of variants){const bad=copy(raw);mutate(bad);assert.throws(()=>R.restore(bad));}
  assert.deepEqual(R.restore(raw).luma,raw.luma);
});

test('older compatible snapshots gain only an empty Luma notebook',()=>{
  const raw=R.snapshot(R.newRealm());delete raw.luma;
  const restored=R.restore(raw);assert.deepEqual(restored.luma,R.LumaWorld.state());assert.deepEqual(restored.pack,raw.pack);assert.deepEqual(restored.rain,raw.rain);
  for(const malformed of [null,false,[],{}])assert.throws(()=>R.restore({...raw,luma:malformed}));
});

test('genuine native text produces the same priced form and preserves exact source bytes',()=>{
  const s=R.newRealm(),native=L.toNative(createPhrase),preview=R.previewLuma(s,native,{x:-4,z:15});
  assert.match(native,/[\uE000-\uE013]/);assert.equal(preview.word,'musa');
  const receipt=speak(s,native,{x:-4,z:15});assert.equal(receipt.source,native);assert.equal(receipt.native,native);assert.equal(instance(s,receipt.result.instanceId).blueprint.luma.word,'musa');invariants(s);
});

test('a Luma instrument connects, consumes a crystal and powers a real deck through timed notes',()=>{
  let {s,source,target}=crossingFixture();
  const joined=speak(s,'pe mi me yuni ta pesa.',{focusId:source,targetId:target});
  assert.equal(joined.result.sourceId,source);assert.equal(R.Creation.surface(s,0,-13),false);
  speak(s,'pe mi me meli ta musa.',{focusId:source});assert.equal(s.spent.crystal,1);assert.equal(s.kingdoms.sources[0].charge,24);
  const breath=s.hero.breath,performance=speak(s,'pe mi me musi ta musa.',{focusId:source});assert.equal(s.hero.breath,breath-40);assert.equal(performance.result.notes,8);
  const notes=[];for(let i=0;i<300;i++){R.tick(s);notes.push(...s.creation.notes);}
  assert.equal(notes.length,8);assert.ok(notes.every(note=>note.code==='luma'&&note.frequency>0));
  assert.ok(R.Creation.surface(s,0,-13));assert.equal(s.creation.instances.find(e=>e.id===source).performance,null);
  s=R.restore(R.snapshot(s));invariants(s);
});

test('care uses one real food or crystal and rejects the wrong recipient kind atomically',()=>{
  const s=R.newRealm(),bird=speak(s,'pe mi me peli ta wuna.',{x:-4,z:15}).result.instanceId;
  const food=s.pack.food;speak(s,'pe mi me meli ta wuna.',{focusId:bird});assert.equal(s.pack.food,food-1);assert.equal(instance(s,bird).energy,80);
  rejectAtomic(s,()=>speak(s,'pe mi me meli ta wuna.',{focusId:bird}),/enough energy/);
  rejectAtomic(s,()=>speak(s,'pe mi me meli ta musa.',{focusId:bird}),/care word/);
  rejectAtomic(s,()=>R.previewLuma(s,'i mi me meli ta musa.',{focusId:bird}),/care word/);
  s.hero.x=30;rejectAtomic(s,()=>speak(s,'pe mi me meli ta wuna.',{focusId:bird}),/Stand near/);invariants(s);
});

test('a legal household journey separates intention, depot funding and physical delivery',()=>{
  const s=R.newRealm();
  speak(s,'u mi me temi ta mena.');assert.equal(s.civilization.active,false);
  rejectAtomic(s,()=>speak(s,'pe mi me temi ta mena.'),/council/);
  command(s,'walk',{x:0,z:23});until(s,x=>!x.kingdoms.journey,1000);
  speak(s,'pe mi me temi ta mena.');assert.equal(s.civilization.active,true);assert.equal(s.luma.intentions[0].fulfilled,2);
  const food=s.pack.food;speak(s,'u mi me doni ta #e bama li "households".');assert.equal(s.pack.food,food);
  rejectAtomic(s,()=>speak(s,'pe mi me doni ta #e/i bama li "households".'),/whole quantity/);
  const giving=speak(s,'pe mi me doni ta #e bama li "households".');assert.equal(giving.result.count,1);assert.equal(s.pack.food,food-1);assert.equal(s.civilization.depot.food,1);assert.equal(s.civilization.ledger.delivered,0);
  until(s,x=>x.civilization.ledger.delivered===1,3000);assert.equal(s.civilization.households[0].pantry,1);assert.ok(s.civilization.trace.some(e=>e.type==='delivery'));invariants(s);
});

test('mending the speaker uses an existing tonic and cannot waste one at full health',()=>{
  const s=R.newRealm();rejectAtomic(s,()=>speak(s,'pe mi me remi ta mi.'),/already well/);
  s.hero.hp=60;const count=s.hero.items.tonic;speak(s,'pe mi me remi ta mi.');assert.equal(s.hero.hp,100);assert.equal(s.hero.items.tonic,count-1);
  s.hero.hp=0;rejectAtomic(s,()=>speak(s,'pe mi me remi ta mi.'),/living world body/);
});

test('revision reclaims the actual bill into a new lineage and preserves location and dimension',()=>{
  const {s,id}=instrumentFixture(),old=copy(instance(s,id)),pack=copy(s.pack);
  const result=speak(s,'pe mi me remi melu ta pela.',{focusId:id,dimension:1}).result,changed=instance(s,result.instanceId);
  assert.notEqual(result.instanceId,id);assert.equal(result.replacedId,id);assert.equal(s.creation.instances.length,1);assert.deepEqual(s.pack,pack);
  assert.equal(changed.blueprint.parent,old.blueprint.id+'@'+old.blueprint.revision);assert.notEqual(changed.blueprint.id,old.blueprint.id);
  assert.equal(changed.blueprint.luma.dimension,old.blueprint.luma.dimension);assert.equal(changed.x,old.x);assert.equal(changed.z,old.z);
  speak(s,'pe mi me musi ta musa.',{focusId:changed.id});rejectAtomic(s,()=>speak(s,'pe mi me remi ta pela.',{focusId:changed.id}),/performance/);invariants(s);
});

test('wired or occupied repair rejects atomically until the actual dependency is clear',()=>{
  const {s,source,target}=crossingFixture();speak(s,'pe mi me yuni ta pesa.',{focusId:source,targetId:target});
  rejectAtomic(s,()=>speak(s,'pe mi me remi ta pela.',{focusId:source}),/Disconnect/);
  command(s,'unlink',{id:s.kingdoms.links[0].id});
  const repaired=speak(s,'pe mi me remi ta pela.',{focusId:source});assert.ok(instance(s,repaired.result.instanceId));assert.equal(s.kingdoms.sources.length,0);invariants(s);
});

test('notebook release has an explicit undertaking and a bounded sixteen-entry capacity',()=>{
  const s=R.newRealm();for(let i=0;i<16;i++)speak(s,'u mi me gimi ta pela.');
  rejectAtomic(s,()=>speak(s,'u mi me gimi ta pela.'),/sixteen intentions/);
  const first=s.luma.intentions[0].id,pack=copy(s.pack),receipt=R.dismissLumaIntention(s,first);
  assert.equal(receipt.operation,'intention.release');assert.equal(receipt.result.intentionId,first);assert.equal(s.luma.intentions.length,15);assert.deepEqual(s.pack,pack);
  rejectAtomic(s,()=>R.dismissLumaIntention(s,first),/still in your notebook/);
  speak(s,'u mi me gimi ta pela.');assert.equal(s.luma.intentions.length,16);invariants(s);
});
