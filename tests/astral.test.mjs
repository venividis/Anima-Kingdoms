import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {WORLDS,ROUTES,world} from '../public/astral-data.js';
import {landscape,flightStep,encounterReading,validateAstral} from '../public/astral-model.js';
import {sphere,ground} from '../public/astral-renderer.js';
import {DICTIONARY} from '../public/luma/data.js';
import * as R from '../public/realm.js';

test('all eight planets, the Sun, moons and asteroid destinations have valid landmarks, routes, local textures and original Luma words',()=>{
 assert.equal(WORLDS.filter(w=>w.kind==='planet').length,8);assert.ok(world('sun'));assert.equal(WORLDS.length,38);const ids=new Set();let sites=0;
 for(const w of WORLDS){assert.ok(!ids.has(w.id));ids.add(w.id);assert.ok(w.sites.length>=2);assert.ok(DICTIONARY.some(d=>d.word===w.word),w.word);if(w.parent)assert.ok(world(w.parent));for(const key of ['texture','nightTexture','cloudTexture','surfaceTexture'])if(w[key])assert.ok(existsSync(new URL('../public/assets/astral/'+w[key]+'.jpg',import.meta.url)),w[key]);const sids=new Set();for(const s of w.sites){assert.ok(!sids.has(s.id));sids.add(s.id);assert.ok(Math.abs(s.lat)<=90&&Math.abs(s.lon)<=180);sites++;}const reading=encounterReading(w.id);assert.ok(reading.notes.length>0);assert.match(reading.native,/[\uE000-\uE013]/);assert.ok(reading.notes.every(n=>Number.isFinite(n.frequency)&&n.frequency>0));}
 assert.equal(sites,91);for(const r of ROUTES)for(const id of r.worlds)assert.ok(world(id));
});
test('each authored landmark generates finite relief, colors, normals, and collision-safe flight',()=>{
 const signatures=new Set();for(const w of WORLDS){const s=sphere(w,24);assert.ok(s.data.every(Number.isFinite),w.id);for(const site of w.sites){const t=landscape(w,site);signatures.add([[-27,7],[12,39],[0,0]].map(([x,z])=>t.height(x,z).toFixed(4)).join());for(let i=0;i<15;i++){const x=i*21-150,z=i*11-60;assert.ok(Number.isFinite(t.height(x,z)));assert.ok(t.color(x,z).every(n=>Number.isFinite(n)&&n>=0&&n<=1));}const p={x:0,z:65,y:22,yaw:0,pitch:0};for(let i=0;i<100;i++){flightStep(p,{forward:1,up:-1,fast:true},.04,t);assert.ok(p.y>=t.height(p.x,p.z)+2-1e-8);}const g=ground(w,site,12);assert.ok(g.mesh.data.every(Number.isFinite));}}
 assert.ok(signatures.size>85,'Sites must retain their own stable terrain seed.');
});
test('astral memories survive save and restore without changing town position, inventory, health or elapsed time',()=>{
 const s=R.newRealm(),hero=structuredClone(s.hero),pack=structuredClone(s.pack),clock=s.cosmos.clock;for(const id of ['sun','mars','europa','bennu'])R.cosmosCommand(s,'astral-remember',{world:id,site:world(id).sites[0].id,note:'A quiet memory.'});const restored=R.restore(R.snapshot(s));assert.equal(restored.cosmos.astral.encounters.length,4);assert.deepEqual(restored.hero,hero);assert.deepEqual(restored.pack,pack);assert.equal(restored.cosmos.clock,clock);assert.ok(Object.values(R.materialLedger(restored)).every(n=>n===0));R.cosmosCommand(restored,'astral-remember',{world:'mars',site:'olympus',note:'A revised memory.'});assert.equal(restored.cosmos.astral.encounters.length,4);assert.equal(restored.cosmos.astral.encounters.find(e=>e.world==='mars').note,'A revised memory.');
});
test('legacy worlds migrate, while malformed encounters fail atomically',()=>{
 const s=R.newRealm(),legacy=R.snapshot(s);delete legacy.cosmos.astral;assert.equal(R.restore(legacy).cosmos.astral.encounters.length,0);assert.ok(!Object.hasOwn(legacy.cosmos,'astral'),'Migration must not mutate the imported object.');const before=R.snapshot(s);for(const p of [{world:'pluto',site:'missing',note:''},{world:'mars',site:'olympus',note:'x'.repeat(1201)},{world:'__proto__',site:'a',note:''}]){assert.throws(()=>R.cosmosCommand(s,'astral-remember',p));assert.deepEqual(R.snapshot(s),before);}assert.throws(()=>validateAstral({schema:1,encounters:[null]}));
 const all=R.newRealm();for(const w of WORLDS)for(const site of w.sites)R.cosmosCommand(all,'astral-remember',{world:w.id,site:site.id,note:'x'.repeat(1200)});assert.equal(R.restore(R.snapshot(all)).cosmos.astral.encounters.length,91);
});
