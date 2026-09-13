import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as R from '../public/realm.js';

const tick = (s, count) => { for (let i=0; i<count; i++) R.tick(s); };
const invariants = s => {
  assert.deepEqual(Object.values(R.materialLedger(s)), [0,0,0,0,0,0]);
  assert.equal(R.Rain.ledger(s.rain).water, 0);
  assert.equal(R.Rain.ledger(s.rain).money, 50);
  R.Civilization.validate(s);
};
const activate = () => {
  const s=R.newRealm();
  s.hero.x=0; s.hero.z=23; // Local unit fixture; the full journey below walks here.
  R.civilize(s, 'invite');
  return s;
};
// Test setup changes custody within the existing supply, never mints test goods.
const fromReserve = (s,item,count) => { s.reserve[item]-=count; s.pack[item]+=count; };
const rejectAtomic = (s,fn) => {
  const before=structuredClone(s);
  assert.throws(fn);
  assert.deepEqual(s,before);
};
const until = (s, predicate, budget=6000) => {
  for(let i=0;i<budget;i++) { if(predicate(s)) return i; R.tick(s); }
  assert.fail(`State condition did not occur in ${budget} simulation ticks`);
};

test('household invitation is optional and adds no goods, water or Marks', () => {
  const s=R.newRealm(), empty=structuredClone(s.civilization);
  tick(s,5000);
  assert.deepEqual(s.civilization,empty);
  const pack=structuredClone(s.pack), rain=R.Rain.ledger(s.rain);
  s.hero.z=23; R.civilize(s,'invite');
  assert.equal(R.Civilization.inspect(s).population,12);
  assert.equal(R.Civilization.held(s,'food'),0);
  assert.deepEqual(s.pack,pack);
  assert.deepEqual(R.Rain.ledger(s.rain),rain);
  rejectAtomic(s,()=>R.civilize(s,'invite'));
  invariants(s);
});

test('compatible v0.9 and v0.10 worlds gain only an inactive civilization schema', () => {
  for(const name of ['v10-creature.json','v10-overhanging-deck.json']) {
    const raw=JSON.parse(fs.readFileSync(new URL(`fixtures/${name}`,import.meta.url),'utf8'));
    const loaded=R.restore(raw);
    assert.deepEqual(loaded.pack,raw.pack);
    assert.deepEqual(loaded.civilization,R.Civilization.state());
    invariants(loaded);
  }
  const raw=R.snapshot(R.newRealm());
  raw.profile='awe-living-concord-0.9.0';
  delete raw.creation; delete raw.kingdoms; delete raw.civilization;
  const before=structuredClone(raw.pack), loaded=R.restore(raw);
  assert.deepEqual(loaded.pack,before);
  assert.equal(loaded.creation.instances.length,0);
  assert.equal(loaded.civilization.active,false);
  const reordered=R.snapshot(loaded);
  reordered.civilization=Object.fromEntries(Object.entries(reordered.civilization).reverse());
  assert.doesNotThrow(()=>R.restore(reordered));
  for(const value of [null,false,{},[]]) assert.throws(()=>R.restore({...reordered,civilization:value}));
});

test('household commands reject distance, dead bodies, malformed payloads and remote supplies atomically', () => {
  const s=R.newRealm();
  rejectAtomic(s,()=>R.civilize(s,'invite'));
  s.hero.z=23;
  rejectAtomic(s,()=>R.civilize(s,'supply',{count:1}));
  R.civilize(s,'invite');
  for(const [op,payload] of [['constructor',{}],['supply',{count:-1}],['supply',{count:NaN}],['supply',{count:1.5}],['supply',{count:1,extra:true}],['supply',{count:'1'}],['courier',{enabled:1}],['production',{item:'ore',enabled:true}],['compost',{item:'food',count:21}],['garden',{plot:6}],['assign',{worker:'intruder',job:'food'}]]) rejectAtomic(s,()=>R.civilize(s,op,payload));
  s.hero.x=10;
  for(const [op,payload] of [['supply',{count:1}],['production',{item:'wood',enabled:false}],['harvest',{enabled:true}],['garden',{plot:0}]]) rejectAtomic(s,()=>R.civilize(s,op,payload));
  s.hero.x=0; s.hero.hp=0;
  rejectAtomic(s,()=>R.civilize(s,'supply',{count:1}));
});

test('depot funding, movement, doorstep delivery, meals and compost have separate actual custody', () => {
  const s=activate(); R.civilize(s,'supply',{count:4});
  assert.equal(s.pack.food,0);
  assert.equal(s.civilization.depot.food,4);
  R.tick(s);
  assert.equal(s.civilization.courier.cargo.count,1);
  assert.equal(s.civilization.depot.food,3);
  assert.equal(s.civilization.ledger.delivered,0);
  for(let i=0;i<5000;i++) {
    const before={...s.civilization.courier}, old=s.civilization.ledger.delivered;
    R.tick(s);
    const after=s.civilization.courier;
    assert.ok(Math.hypot(after.x-before.x,after.z-before.z)<=R.Civilization.COURIER_SPEED/60+1e-7);
    if(s.civilization.ledger.delivered>old) {
      const home=R.Civilization.HOMES.find(h=>h.id===before.cargo.household);
      assert.ok(Math.hypot(after.x-home.x,after.z-home.z)<=.6);
    }
    assert.deepEqual(Object.values(R.materialLedger(s)),[0,0,0,0,0,0]);
  }
  assert.equal(s.civilization.ledger.delivered,4);
  assert.equal(s.civilization.ledger.consumed,4);
  assert.ok(s.civilization.households.every(h=>h.consumed===1&&h.missed===0));
  assert.ok(s.civilization.ledger.compostReturned>=2);
  assert.equal(s.spent.food,4);
  for(const type of ['deposit','pickup','delivery','meal','compost']) assert.ok(s.civilization.trace.some(e=>e.type===type));
  invariants(s);
});

test('resting a loaded courier returns the real cargo after a checkpoint, once', () => {
  let s=activate(); R.civilize(s,'supply',{count:2}); tick(s,90);
  assert.ok(Math.hypot(s.civilization.courier.x,s.civilization.courier.z-23)>4);
  R.civilize(s,'courier',{enabled:false});
  s=R.restore(R.snapshot(s));
  assert.equal(s.civilization.depot.food,1);
  assert.equal(s.civilization.courier.cargo.count,1);
  until(s,s=>s.civilization.courier.cargo===null);
  assert.equal(s.civilization.depot.food,2);
  assert.equal(s.civilization.ledger.delivered,0);
  const before=structuredClone(s.civilization.depot);
  tick(s,200);
  assert.deepEqual(s.civilization.depot,before);
  assert.ok(Math.hypot(s.civilization.courier.x,s.civilization.courier.z-23)<=.6);
  invariants(s);
});

test('a full return depot preserves carried food until space exists', () => {
  const s=activate(); fromReserve(s,'food',31);
  R.civilize(s,'supply',{count:20}); R.civilize(s,'supply',{count:12});
  tick(s,90); R.civilize(s,'supply',{count:1}); R.civilize(s,'courier',{enabled:false});
  tick(s,150);
  assert.equal(s.civilization.courier.phase,'depot full');
  assert.equal(s.civilization.depot.food,32);
  assert.equal(s.civilization.courier.cargo.count,1);
  rejectAtomic(s,()=>R.civilize(s,'supply',{count:1}));
  R.civilize(s,'withdraw',{count:1}); R.tick(s);
  assert.equal(s.civilization.courier.cargo,null);
  assert.equal(s.civilization.depot.food,32);
  invariants(s);
});

test('blocked courier movement cannot credit a household inventory', () => {
  const s=activate(); R.civilize(s,'supply',{count:1}); R.tick(s);
  const start={x:s.civilization.courier.x,z:s.civilization.courier.z};
  // An intentionally blocked navigation context models an impassable route.
  for(let i=0;i<180;i++){s.tick++;R.Civilization.tick(s,{steer(){}});}
  assert.equal(s.civilization.courier.phase,'route blocked');
  assert.equal(s.civilization.ledger.delivered,0);
  assert.equal(s.civilization.courier.cargo.count,1);
  assert.deepEqual({x:s.civilization.courier.x,z:s.civilization.courier.z},start);
  invariants(s);
});

for(const [item,rule] of Object.entries(R.Civilization.PATCHES)) {
  test(`${item} renews under its actual water/soil costs and stops at carrying capacity`, () => {
    const s=activate(); fromReserve(s,item,rule.yield);
    const water=s.rain.storage[rule.water];
    tick(s,rule.ticks);
    assert.equal(s.reserve[item],rule.capacity);
    assert.equal(s.civilization.ledger.produced[item],rule.yield);
    assert.equal(s.civilization.soil,R.Civilization.INITIAL_SOIL-rule.yield);
    assert.equal(s.rain.storage[rule.water],water-rule.waterCost);
    const issued=s.civilization.ledger.produced[item];
    tick(s,rule.ticks*2);
    assert.equal(s.civilization.ledger.produced[item],issued);
    assert.equal(s.civilization.patches[item].progress,0);
    invariants(s); R.restore(R.snapshot(s));
  });
}

test('cultivation has no output during water shortage or the player’s rest policy', () => {
  const s=activate(); fromReserve(s,'food',8);
  s.rain.losses+=s.rain.storage.orchard; s.rain.storage.orchard=0;
  tick(s,1800);
  assert.equal(s.civilization.patches.food.progress,0);
  assert.equal(s.civilization.ledger.produced.food,0);
  R.buildBraid(s); R.rainPulse(s); R.rainPulse(s);
  tick(s,600); const progress=s.civilization.patches.food.progress;
  assert.equal(progress,600);
  R.civilize(s,'production',{item:'food',enabled:false}); tick(s,1500);
  assert.equal(s.civilization.patches.food.progress,progress);
  assert.equal(s.civilization.ledger.produced.food,0);
  R.civilize(s,'production',{item:'food',enabled:true}); tick(s,600);
  assert.equal(s.civilization.ledger.produced.food,4);
  invariants(s);
});

test('compost donation consumes real goods and returns bounded soil after processing', () => {
  const s=activate(); R.civilize(s,'compost',{item:'herb',count:2});
  assert.equal(s.pack.herb,0); assert.equal(s.spent.herb,2);
  assert.equal(s.civilization.compost,2); assert.equal(s.civilization.soil,12);
  tick(s,R.Civilization.COMPOST_TICKS-1);
  assert.equal(s.civilization.soil,12);
  R.tick(s);
  assert.equal(s.civilization.soil,14);
  assert.equal(s.civilization.compost,0);
  assert.equal(s.civilization.ledger.compostReturned,2);
  invariants(s);
});

test('zero soil, zero compost and exhausted food still have a declared recovery path', () => {
  const s=activate(); fromReserve(s,'food',20);
  R.buildBraid(s); R.rainPulse(s); R.rainPulse(s); s.options.autoRain=true;
  tick(s,4800);
  assert.equal(s.civilization.soil,0);
  assert.equal(s.civilization.compost,0);
  // Disaster fixture: all remaining six-ledger food is explicitly spent.
  for(const place of ['pack','reserve','market']){s.spent.food+=s[place].food;s[place].food=0;}
  const issued=s.civilization.ledger.produced.food;
  tick(s,3600);
  assert.ok(s.civilization.ledger.recovered>=2);
  assert.ok(s.civilization.ledger.produced.food>issued);
  assert.ok(s.reserve.food>0);
  assert.equal(s.pack.food,0);
  assert.equal(s.civilization.ledger.workerMeals,0);
  invariants(s);
});

test('starving households recover through later physical food deliveries', () => {
  const s=activate(); tick(s,12300);
  assert.ok(s.civilization.households.every(h=>h.hunger>=3));
  fromReserve(s,'food',20); R.civilize(s,'supply',{count:20});
  tick(s,11000);
  assert.ok(s.civilization.households.every(h=>h.hunger===0));
  assert.equal(s.civilization.households.length,4);
  assert.ok(s.civilization.ledger.delivered>=12);
  assert.ok(s.civilization.ledger.consumed>=12);
  invariants(s);
});

test('arenas pause growth, household deadlines, in-transit cargo and compost', () => {
  for(const mode of ['duel','ctf','boss']) {
    let s=activate(); R.civilize(s,'supply',{count:2}); tick(s,90);
    const before=structuredClone(s.civilization);
    R.enterActivity(s,mode); tick(s,500);
    assert.deepEqual(s.civilization,before);
    rejectAtomic(s,()=>R.civilize(s,'supply',{count:1}));
    s=R.restore(R.snapshot(s));
    assert.deepEqual(s.civilization,before);
    R.tick(s); assert.equal(s.civilization.clock,before.clock+1);
    invariants(s);
  }
});

test('malformed production, custody, clocks, water and household saves are rejected', () => {
  const s=activate(); R.civilize(s,'supply',{count:4}); tick(s,80);
  const raw=R.snapshot(s);
  for(const mutate of [
    x=>x.civilization.schema='other',
    x=>x.civilization.clock=x.tick+1,
    x=>x.civilization.extra=true,
    x=>x.civilization.active=false,
    x=>x.civilization.courier.x=Infinity,
    x=>x.civilization.courier.x=999,
    x=>x.civilization.courier.cargo.count=-1,
    x=>x.civilization.courier.cargo.household='missing',
    x=>x.civilization.courier.target='missing',
    x=>x.civilization.households[0].pantry++,
    x=>x.civilization.households[0].due=0,
    x=>x.civilization.households[0].consumed++,
    x=>x.civilization.households.push(x.civilization.households[0]),
    x=>x.civilization.depot.food=33,
    x=>x.civilization.ledger.funded++,
    x=>x.civilization.ledger.produced.food++,
    x=>x.civilization.ledger.water.orchard++,
    x=>x.civilization.ledger.recovered++,
    x=>x.civilization.soil=25,
    x=>x.civilization.patches.food.progress=1200,
    x=>x.civilization.trace[0].clock=x.civilization.clock+1,
  ]) {
    const candidate=structuredClone(raw); mutate(candidate);
    assert.throws(()=>R.restore(candidate));
  }
  const restored=R.restore(raw);
  until(restored,x=>x.civilization.ledger.delivered>=4);
  tick(restored,5000);
  invariants(restored);
});

test('legal 1,000-second farmer journey renews beyond starting stock and closes delivery-consumption-compost cycle', () => {
  let s=R.newRealm();
  R.command(s,{world:s.id,rules:R.Kingdoms.RULES,controller:'human',epoch:s.kingdoms.grant.epoch,revision:s.kingdoms.revision,key:'household-council-journey',op:'walk',payload:{x:0,z:23}});
  until(s,x=>!x.kingdoms.journey,1000);
  R.civilize(s,'invite');
  R.civilize(s,'garden',{plot:0});
  R.civilize(s,'assign',{worker:'mira',job:'food'});
  R.civilize(s,'assign',{worker:'fen',job:'food'});
  R.civilize(s,'supply',{count:2});
  R.civilize(s,'harvest',{enabled:true});
  R.buildBraid(s); R.rainPulse(s); R.rainPulse(s); s.options.autoRain=true;
  for(let i=0;i<10;i++) {
    tick(s,6000);
    invariants(s);
    s=R.restore(R.snapshot(s));
  }
  const c=s.civilization;
  assert.ok(c.ledger.produced.food>R.INITIAL.reserve.food);
  assert.ok(c.ledger.consumed>=60);
  assert.ok(c.households.every(h=>h.hunger===0&&h.consumed>=15));
  assert.ok(c.ledger.workerMeals>30);
  assert.ok(c.ledger.compostReturned>=c.ledger.consumed);
  assert.ok(c.ledger.delivered>c.ledger.consumed);
  assert.ok(c.ledger.funded>2);
  assert.ok(s.reserve.food<=R.Civilization.PATCHES.food.capacity);
  assert.ok(c.soil<=R.Civilization.SOIL_CAPACITY&&c.compost<=R.Civilization.COMPOST_CAPACITY);
  invariants(s);
  if(process.env.CIVILIZATION_TEST_EVIDENCE) {
    const sources=Object.fromEntries(['realm.js','civilization.js','world.js','navigation.js'].map(name=>[name,createHash('sha256').update(fs.readFileSync(new URL(`../public/${name}`,import.meta.url))).digest('hex')]));
    fs.writeFileSync(process.env.CIVILIZATION_TEST_EVIDENCE,JSON.stringify({
      scenario:'Legal council, farm, water, physical harvest, depot, courier, household meal and compost journey',
      method:'Deterministic core commands and real 60 Hz simulation movement. No teleport or material fixture injection in this scenario. Automatic-rain flag is the existing player Settings choice.',
      clock:c.clock,seconds:c.clock/60,checkpoints:10,sources,
      final:{pack:s.pack,reserve:s.reserve,depot:c.depot,households:c.households,soil:c.soil,compost:c.compost,ledger:c.ledger},
      invariants:{materials:R.materialLedger(s),water:R.Rain.ledger(s.rain).water,money:R.Rain.ledger(s.rain).money},
      limits:'Four local households, twelve fixed residents, one courier, one food need, declared game growth/fertility units. Automated state exercise; not browser/device observation, biological physics, a full ecology or a human study.'
    },null,2)+'\n');
  }
});

function courierSolid() {
  const blueprint=R.Creation.seed('structure');
  blueprint.parts=[{shape:'box',x:0,y:1,z:0,w:1,h:2,d:1,color:'#61e1d2',role:'solid',yaw:0}];
  return blueprint;
}
let courierCommandSerial=0;
const courierCommand=(s,op,payload)=>R.command(s,{world:s.id,rules:R.Kingdoms.RULES,controller:'human',epoch:s.kingdoms.grant.epoch,revision:s.kingdoms.revision,key:`courier-occupancy-${++courierCommandSerial}`,op,payload});

test('loaded civilization courier rejects solid placement while nearby clear placement still works', () => {
  // Council body is the explicitly labeled activate() unit fixture. Tavi's
  // subsequent position and loaded cargo come from the real delivery route.
  const s=activate(); R.civilize(s,'supply',{count:2}); tick(s,90);
  const courier=s.civilization.courier, point={x:courier.x,z:courier.z};
  assert.equal(courier.cargo.count,1);
  assert.ok(Math.hypot(point.x,point.z-23)>5);
  const blueprint=courierSolid(), before=structuredClone(s);
  assert.throws(()=>R.create(s,blueprint,point.x,point.z),/person or companion/);
  assert.deepEqual(s,before);
  const nearby=R.create(s,blueprint,point.x,point.z+3);
  assert.equal(s.creation.instances.length,1);
  assert.equal(nearby.x,point.x);
  assert.deepEqual(s.civilization.courier.cargo,before.civilization.courier.cargo);
  until(s,x=>x.civilization.ledger.delivered===1);
  invariants(s); R.restore(R.snapshot(s));
});

test('civilization courier prevents supporting-deck reclamation and conversion until its actual exit', () => {
  const s=activate(); R.civilize(s,'supply',{count:2}); R.tick(s);
  // Isolated support fixture: a loaded Tavi is placed on a permanent dry deck.
  // This does not claim the normal household route crosses this bridge.
  s.hero.x=0; s.hero.z=-4;
  const deck=R.create(s,R.Creation.seed('structure'),0,-13);
  s.civilization.courier.x=0; s.civilization.courier.z=-13;
  assert.ok(R.legal(s,0,-13));
  assert.equal(R.Rain.walkable(s.rain,0,-13),false);
  rejectAtomic(s,()=>R.reclaimCreation(s,deck.id));
  rejectAtomic(s,()=>courierCommand(s,'receiver',{id:deck.id}));
  const cargo=structuredClone(s.civilization.courier.cargo);
  until(s,x=>x.civilization.courier.z>-4.8);
  assert.deepEqual(s.civilization.courier.cargo,cargo);
  courierCommand(s,'receiver',{id:deck.id});
  R.reclaimCreation(s,deck.id);
  assert.equal(s.creation.instances.length,0);
  assert.ok(R.legal(s,s.civilization.courier.x,s.civilization.courier.z));
  invariants(s); R.restore(R.snapshot(s));
});

test('civilization courier keeps an expired gate open and the gate closes after a real body exit', () => {
  const s=activate(); R.civilize(s,'supply',{count:2});
  // Isolated gate fixture uses explicit hero setup positions and an ordinary
  // funded score. Only the courier's gate-start position is assigned below.
  s.hero.x=6; s.hero.z=20; courierCommand(s,'buy_crystal',{});
  s.hero.x=0; s.hero.z=6;
  const source=R.create(s,R.Creation.seed('instrument'),0,5);
  const gate=R.create(s,courierSolid(),0,0);
  courierCommand(s,'receiver',{id:gate.id});
  courierCommand(s,'link',{source:source.id,target:gate.id,pitches:[0]});
  courierCommand(s,'fuel',{id:source.id});
  courierCommand(s,'perform',{id:source.id});
  until(s,x=>x.civilization.courier.cargo&&!x.creation.instances.find(e=>e.id===source.id).performance&&!x.kingdoms.packets.length&&x.kingdoms.receivers[0].status==='active');
  const receiver=s.kingdoms.receivers[0];
  s.civilization.courier.x=0; s.civilization.courier.z=0;
  const cargo=structuredClone(s.civilization.courier.cargo), delivered=s.civilization.ledger.delivered;
  assert.ok(R.legal(s,0,0));
  // Deliberately hold bodies stationary in this module-isolation phase while
  // the earned receiver lease expires; this is not a natural route claim.
  while(s.kingdoms.clock<receiver.until){s.tick++;R.Kingdoms.tick(s,R.creationContext());}
  assert.equal(receiver.status,'clearing');
  assert.ok(R.legal(s,0,0));
  assert.deepEqual(s.civilization.courier.cargo,cargo);
  until(s,x=>x.kingdoms.receivers[0].status==='dormant');
  assert.equal(R.legal(s,0,0),false);
  assert.ok(R.legal(s,s.civilization.courier.x,s.civilization.courier.z));
  assert.deepEqual(s.civilization.courier.cargo,cargo);
  until(s,x=>x.civilization.ledger.delivered>delivered);
  invariants(s); R.restore(R.snapshot(s));
});
