import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as G from '../public/luma/geometry.js';
import {ALPHABET,ROOTS} from '../public/luma/data.js';
import {toNative,wordCode} from '../public/luma/language.js';
import * as C from '../public/creation.js';
import * as R from '../public/realm.js';
import {CreationMeshes} from '../public/creation-view.js';

const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-12,`${a} differs from ${b}`);
test('projection agrees with the actual uploaded source at every retained dimension',()=>{
  const html=fs.readFileSync(new URL('../public/luma/origin.html',import.meta.url),'utf8');
  const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  const data=JSON.parse(scripts[0]),context={DATA:{astronomy:data.astronomy},state:{rotation:105,dimensions:16,yaw:0,pitch:0}};
  vm.createContext(context);
  for(const name of ['rotationsAt','camera','vectorProject']){
    const line=scripts[1].split('\n').find(line=>line.startsWith(`function ${name}(`));assert.ok(line,`${name} source found`);vm.runInContext(line,context);
  }
  for(const row of data.alphabet.letters)for(let d=1;d<=16;d++)for(const t of [0,.41,2.6]){
    const index=3,v=row.featureVector.map((b,j)=>(.25+b)*Math.cos((j+1)*t+.43*j+.37*index)/4);
    assert.deepEqual(G.featurePoint(row.letter,t,index),v);context.state.dimensions=d;
    const expected=context.vectorProject(v,0),actual=G.vectorProject(v,d);actual.forEach((n,i)=>close(n,expected[i]));
  }
});

test('twenty full curves stay distinct and omitted articulation contrasts disappear explicitly',()=>{
  const signatures=[...ALPHABET].map(c=>JSON.stringify(G.projectLetter(c)));
  assert.equal(new Set(signatures).size,20);assert.equal(G.projectLetter('m').length,193);
  assert.deepEqual(G.projectLetter('p',1),G.projectLetter('b',1));
  assert.notDeepEqual(G.projectLetter('p',2),G.projectLetter('b',2));
  assert.equal(G.prefixClasses(16),20);assert.ok(G.prefixClasses(1)<20);
  const v=G.featurePoint('r',.2);v[15]+=100;
  assert.deepEqual(G.vectorProject(v,15),G.vectorProject(G.featurePoint('r',.2),15));
  // Retaining a coordinate does not guarantee a visible distinction after projection.
  assert.deepEqual(G.vectorProject(v,16),G.vectorProject(G.featurePoint('r',.2),16));
  const lower=G.featurePoint('r',.2);lower[2]+=100;
  assert.deepEqual(G.vectorProject(lower,2),G.vectorProject(G.featurePoint('r',.2),2));
  assert.notDeepEqual(G.vectorProject(lower,3),G.vectorProject(G.featurePoint('r',.2),3));
  for(const bad of [0,17,NaN,1.5])assert.throws(()=>G.projectLetter('m',bad));
});

test('all 180 nouns compile to deterministic forms with real bills and a fixed twelve-point budget',()=>{
  for(const root of ROOTS){const word=root+'a',sentence=`pe mi me peli ta ${word}.`,a=G.blueprintForWord(word,sentence),b=G.blueprintForWord(word,sentence);
    assert.deepEqual(a,b);const d=C.compile(a);assert.equal(d.blueprint.luma.word,word);assert.equal(a.power+a.reach+a.tempo,12);
    assert.ok(Object.values(d.cost).some(n=>n>0));assert.equal(d.cost.food,0);assert.ok(a.parts.length<=32);
  }
  const span=G.blueprintForWord('yuna');assert.equal(span.kind,'structure');
  const decks=span.parts.filter(p=>p.role==='walkway');assert.equal(decks.length,5);
  assert.equal(Math.max(...decks.map(p=>p.z+p.d/2))-Math.min(...decks.map(p=>p.z-p.d/2)),15);
  assert.notDeepEqual(G.blueprintForWord('mela',undefined,1).parts,G.blueprintForWord('mela',undefined,16).parts);
});

test('source glyph paths and inscribed meshes render without inventing replacement symbols',()=>{
  const ops=[],ctx=new Proxy({},{get:(target,key)=>key in target?target[key]:(...args)=>ops.push([key,...args])});
  for(const c of ALPHABET)G.drawGlyph(ctx,c);assert.ok(ops.some(x=>x[0]==='bezierCurveTo'));assert.ok(ops.some(x=>x[0]==='quadraticCurveTo'));assert.ok(ops.some(x=>x[0]==='arc'));
  let geometryValues=0,draws=0;const renderer={mesh:g=>{assert.ok(g.data.every(Number.isFinite));geometryValues+=g.data.length;return g;},draw:(m,t)=>{assert.ok([...t].every(Number.isFinite));draws++;},dispose:()=>{}};
  const meshes=new CreationMeshes(renderer);meshes.draw(G.blueprintForWord('musa'));meshes.draw(C.seed('instrument'));
  assert.ok(geometryValues>10000&&draws>10);
  assert.equal([...toNative('musa')].length,4);assert.ok([...toNative('musa')].every(c=>c.codePointAt(0)>=0xE000));
});

test('word music keeps every two-note code and the simulation emits its exact ratios on time',()=>{
  const long='malema';assert.equal(C.scoreLength({luma:{word:long}}),12);
  assert.deepEqual(C.scoreNotes({luma:{word:long}}).map(n=>n.pitch),wordCode(long).ratioIndices);
  const legacy=C.seed('instrument');assert.equal(C.scoreLength(legacy),8);assert.equal(C.scoreNotes(legacy)[2].frequency,220*2**(legacy.score[2]/12));
  const s=R.newRealm(),b=G.blueprintForWord('musa'),before={...s.pack},e=R.create(s,b,2,12),events=[];
  for(const[k,n]of Object.entries(C.compile(b).cost))assert.equal(s.pack[k],before[k]-n);
  C.perform(s,e.id);for(let i=0;i<210;i++){R.tick(s);for(const n of s.creation.notes)events.push({tick:s.tick,...n});}
  assert.equal(events.length,8);assert.deepEqual(events.map(n=>n.frequency),wordCode('musa').notes.map(n=>n.frequency));
  for(let i=0;i<events.length;i++){assert.equal(events[i].code,'luma');if(i)assert.equal(events[i].tick-events[i-1].tick,b.beat);}
  assert.deepEqual(R.materialLedger(s),C.emptyBag());assert.equal(e.performance,null);
});

test('inscription forgery is rejected and an independent branch leaves its placed ancestor intact',()=>{
  const s=R.newRealm(),b=G.blueprintForWord('musa'),e=R.create(s,b,2,12),original=JSON.stringify(e.blueprint);
  for(const edit of [x=>x.luma.word='wuna',x=>x.luma.dimension=17,x=>x.luma.extra=true,x=>x.parts[0].x+=.2,x=>x.score[0]=12,x=>x.power=5,x=>x.luma.sentence='pe mi me peli ta pela.']){const bad=structuredClone(b);edit(bad);const before=JSON.stringify(s);assert.throws(()=>R.create(s,bad,2,12));assert.equal(JSON.stringify(s),before);}
  const independent=C.branch(b);delete independent.luma;independent.parts[0].x=.25;independent.score[0]=12;C.compile(independent);
  assert.equal(independent.parent,b.id+'@1');assert.equal(JSON.stringify(e.blueprint),original);
  const restored=R.restore(R.snapshot(s));assert.deepEqual(restored.creation.instances[0].blueprint,b);
});
