import test from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../public/sky-model.js';
import * as C from '../public/cosmos.js';
import * as R from '../public/realm.js';
import {Astronomy as A} from '../public/luma/astronomy.js';
import {CATALOG,CATALOG_META,CONSTELLATIONS,stellarField,starDirection,domePoint} from '../public/sky-observer.js';
import {parse,toLatin} from '../public/luma/language.js';

const greenwich={latitude:51.4779,longitude:0,elevation:0},epoch='2026-09-11T12:00:00Z';
const adjacent=(x,direction)=>{if(x===0)return direction*Number.MIN_VALUE;const b=new ArrayBuffer(8),f=new Float64Array(b),u=new BigUint64Array(b);f[0]=x;u[0]+=BigInt(direction*(x>0?1:-1));return f[0];};

test('Codex Greenwich reference survives the expanded ten-body model and true Ascendant',()=>{
  const sky=S.calculateSky(epoch,greenwich),expected=[168.777893,173.303357,181.378421,210.747110,109.970808,135.863563,13.024146];
  expected.forEach((n,i)=>assert.ok(Math.abs(sky.bodies[i].longitude-n)<=.0000005));
  assert.equal(sky.bodies.length,10);assert.notEqual(sky.angles.ascendant,sky.sidereal);
  assert.equal(sky.seal[7].body,'Ascendant');assert.equal(sky.seal[7].longitude,sky.angles.ascendant);
  assert.equal(sky.moonLight,A.Illumination('Moon',new Date(epoch)).phase_fraction);
  assert.ok(Math.abs(sky.moonLight-(1-Math.cos(sky.phase*S.DEG))/2)>1e-6);
  assert.equal(sky.seal.flatMap(s=>s.cell.notes).length,32);
});

test('all 400 decimal endpoints and IEEE neighbors obey half-open sky-seal bins',()=>{
  for(let b=0;b<400;b++){
    const edge=b*9/10;assert.equal(S.sectorIndex(edge,400),b,'endpoint '+edge);
    assert.equal(S.sectorIndex(adjacent(edge,1),400),b,'above '+edge);
    assert.equal(S.sectorIndex(adjacent(edge,-1),400),(b+399)%400,'below '+edge);
    const cell=S.sealCell(edge);assert.equal(cell.digits[0]*20+cell.digits[1],b);
    assert.deepEqual([...cell.native].slice(1).map(c=>c.codePointAt(0)-0xE000),cell.digits);assert.equal(cell.native.length,3);assert.equal(cell.latin.length,3);
  }
  assert.equal(S.sectorIndex(360,400),0);assert.equal(S.sectorIndex(-.9,400),399);
  assert.equal(S.sectorIndex(1e-300,400),0);assert.equal(S.sectorIndex(-1e-300,400),399);
  assert.throws(()=>S.sectorIndex(NaN,400));assert.throws(()=>S.sectorIndex(1,0));
});

test('the 108-cell refinement, origin invariants and calendar definitions remain distinct',()=>{
  const covered=new Set();for(let n=0;n<27;n++)for(let p=0;p<4;p++){
    const index=n*4+p,x=(index+.5)*10/3,r=S.divisions(x,0);covered.add(r.address);assert.equal(r.nakshatra,n);assert.equal(r.pada,p+1);assert.deepEqual(r.intervalArcminutes,[n*800,(n+1)*800]);
  }assert.equal(covered.size,108);
  const a=S.calculateSky(epoch,greenwich),b=S.calculateSky(epoch,greenwich,24.2);
  assert.equal(a.phase,b.phase);assert.equal(a.relations.tithi,b.relations.tithi);assert.notEqual(a.relations.yoga,b.relations.yoga);
  assert.deepEqual(a.bodies.map(x=>[x.altitude,x.azimuth]),b.bodies.map(x=>[x.altitude,x.azimuth]));
  a.aspects.forEach((x,i)=>assert.ok(Math.abs(x.orb-b.aspects[i].orb)<1e-10));
  assert.equal(S.SOLAR_TERMS.length,24);assert.equal(S.NAKSHATRAS.length,27);assert.equal(S.SOLAR_TERMS[12][0],'秋分');
});

test('horizon angles satisfy the geometric planes and carry absence at the poles',()=>{
  for(const latitude of [-75,-38,0,38,66,75])for(const longitude of [-120,0,130]){
    const sky=S.calculateSky(epoch,{latitude,longitude,elevation:0}),asc=sky.angles.ascendant;
    if(asc===null)continue;
    const eq=S.rotate(A.Rotation_ECT_EQD(new Date(epoch)),[Math.cos(asc*S.DEG),Math.sin(asc*S.DEG),0],new Date(epoch));
    const theta=sky.sidereal*S.DEG,phi=latitude*S.DEG,zenith=[Math.cos(phi)*Math.cos(theta),Math.cos(phi)*Math.sin(theta),Math.sin(phi)],east=[-Math.sin(theta),Math.cos(theta),0];
    assert.ok(Math.abs(S.dot(eq,zenith))<1e-12);assert.ok(S.dot(eq,east)>0);
    assert.ok(Math.abs(S.signed(sky.nodes.descending-sky.nodes.ascending))===180);
  }
  for(const latitude of [-90,90]){
    const sky=S.calculateSky(epoch,{latitude,longitude:0,elevation:0});assert.equal(sky.angles.ascendant,null);assert.deepEqual(sky.coordinates16.slice(14),[null,null]);assert.equal(sky.seal[7].cell,null);assert.deepEqual(sky.coordinateMask.slice(14),[false,false]);assert.equal(S.coordinatePrefix(sky.coordinates16,16).completePairs,7);assert.equal(S.coordinatePrefix(sky.coordinates16,15).unpairedAvailable,false);
  }
});

test('all coordinate prefixes name missing information without changing the stored sky',()=>{
  const sky=S.calculateSky(epoch,greenwich),stored=JSON.stringify(sky);
  for(let d=1;d<=16;d++){const p=S.coordinatePrefix(sky.coordinates16,d);assert.equal(p.values.length,d);assert.equal(p.omitted.length,16-d);assert.equal(p.completePairs,Math.floor(d/2));assert.equal(!!p.unpaired,!!(d%2));}
  assert.equal(JSON.stringify(sky),stored);assert.deepEqual(S.angularCoordinates([0,90]).map(x=>Math.round(x)),[1,0,0,1]);
});

test('catalogue coverage, proper motion and horizon projection have finite reproducible directions',()=>{
  assert.equal(CATALOG.length,9096);assert.equal(CONSTELLATIONS.length,88);assert.equal(CATALOG_META.omittedHR.length,14);
  assert.equal(new Set(CATALOG.map(s=>s.hr)).size,9096);
  const vega=CATALOG.find(s=>s.hr===7001);assert.equal(vega.name,'Vega');assert.ok(Math.abs(vega.ra-279.234735)<.001);
  const a=starDirection(vega,2000),b=starDirection(vega,2100);assert.ok(Math.abs(Math.hypot(...b)-1)<1e-12);assert.notDeepEqual(a,b);
  const sky=S.calculateSky(epoch,greenwich),field=stellarField(sky);assert.equal(field.length,9096);
  const star=field.find(s=>s.star===vega),time=A.MakeTime(new Date(epoch)),v=starDirection(vega,2000+time.tt/365.25);
  const eq=A.EquatorFromVector(A.RotateVector(A.Rotation_EQJ_EQD(time),new A.Vector(...v,time))),h=A.Horizon(time,new A.Observer(51.4779,0,0),eq.ra,eq.dec,'normal');
  assert.ok(Math.abs(star.altitude-h.altitude)<1e-9);assert.ok(Math.abs(S.signed(star.azimuth-h.azimuth))<1e-9);
  assert.deepEqual(domePoint(0,90,0,0,1),[0,0]);assert.equal(domePoint(0,-1,0,0,1),null);assert.ok(domePoint(90,0,0,0,1)[0]<0);
});

test('phase and seasonal events solve the displayed convention; polar hours remain unavailable',()=>{
  const events=S.skyEvents(epoch,greenwich);assert.equal(events.filter(e=>e.kind==='phase').length,4);
  for(const event of events){if(!event.utc)continue;assert.ok(Date.parse(event.utc)>Date.parse(epoch));
    if(['phase','season'].includes(event.kind)){const sky=S.calculateSky(event.utc,greenwich),q=event.kind==='phase'?sky.phase:sky.bodies[0].longitude;assert.ok(Math.abs(S.signed(q-event.target))<.00001);}
  }
  const hour=S.planetaryHour(epoch,greenwich);assert.ok(hour.available);assert.ok(Date.parse(hour.start)<=Date.parse(epoch)&&Date.parse(epoch)<Date.parse(hour.end));assert.notEqual(hour.minutes,60);
  const midnight=S.planetaryHour('2026-09-11T02:00:00Z',greenwich);assert.equal(midnight.sunrise.slice(0,10),'2026-09-10');
  assert.equal(S.planetaryHour('2026-06-21T12:00:00Z',{latitude:90,longitude:0,elevation:0}).available,false);
});

test('invalid dates and observer values cannot normalize into an unintended chart',()=>{
  for(const date of ['2026-02-31T00:00:00Z','2026-09-11T12:00:00','2026-09-11','1799-12-31T23:59:59Z','2201-01-01T00:00:00Z'])assert.throws(()=>S.calculateSky(date,greenwich));
  assert.throws(()=>S.calculateSky(epoch,{latitude:91,longitude:0,elevation:0}));assert.throws(()=>S.calculateSky(epoch,greenwich,NaN));
});

test('encounters retain valid native intentions, reflections, actual work uses and old saves',()=>{
  for(const name of Object.keys(S.PRACTICES)){const text=S.practicePhrase(name);assert.equal(parse(text).mode,'u');assert.equal(parse(S.practicePhrase(name,'pe')).mode,'pe');}
  const state=R.newRealm(),before=structuredClone(state.pack);R.cosmosCommand(state,'observe',{practice:'Mars'});let w=state.cosmos.workshop;
  assert.equal(w.observations.length,1);assert.deepEqual(state.pack,before);assert.equal(w.observations[0].sky.utc,C.skyAt(0).utc);
  R.cosmosCommand(state,'reflect',{id:1,text:'I repaired the invitation. The recipient found the next step clearer.'});
  const restored=R.restore(R.snapshot(state));assert.equal(restored.cosmos.workshop.observations[0].reflections.length,1);
  const malformed=structuredClone(restored);malformed.cosmos.workshop.observations[0].sky.cells[0].bin=399;assert.throws(()=>R.restore(R.snapshot(malformed)));
  const legacy=R.newRealm();assert.equal(legacy.cosmos.workshop.observations,undefined);assert.doesNotThrow(()=>R.restore(R.snapshot(legacy)));
  const stable=JSON.stringify(state);assert.throws(()=>R.cosmosCommand(state,'observe',{practice:'Mars',now:1e15}));assert.throws(()=>R.cosmosCommand(state,'reflect',{id:99,text:'other'}));assert.equal(JSON.stringify(state),stable);
  for(const practice of ['__proto__','constructor','Uranus'])assert.throws(()=>R.cosmosCommand(state,'observe',{practice}));
});
