/* The recorded sky and the authored Luma game rules share a clock, not a claim
 * of physical causation. No network, device location, or wall clock is required. */
import {Astronomy} from './luma/astronomy.js';
import {calculateSky, skyRecord, SKY_MODEL, PRACTICES, practicePhrase} from './sky-model.js';
export {SKY_MODEL};
import {ALPHABET, RATIOS} from './luma/data.js';
import {STAR_CATALOG} from './luma/stars.js';
import {parse, roleWord, roleName, toNative} from './luma/language.js';

export const BEAT_MS = 750;
export const WORKSITES = Object.freeze({forge:{x:-5,z:18,name:'The Starforge'}, alembic:{x:4,z:13,name:'The Moonwell'}, town:{x:0,z:23,name:'The Singing Hearth'}});
export const RECIPES = Object.freeze({
  iron:{name:'Star-iron',word:'bema',kind:'metal',station:'forge',cost:{ore:2,wood:1},heat:900,quench:'water',
    stages:[['Calcine','fama',6000],['Shape','rima',6000],['Temper','wela',3000]],
    use:'Temper your weapon: +2 melee damage in the orchard and local PvE.'},
  alloy:{name:'Singing alloy',word:'yuna',kind:'metal',station:'forge',cost:{ore:2,crystal:1,wood:2},heat:1100,quench:'air',
    stages:[['Fuse','fama',6000],['Harmonize','yuna',6000],['Anneal','sira',4500]],
    use:'Hang a town bell: its celestial rhythm quickens physical delivery and gathering.'},
  dew:{name:'Moon dew',word:'luna',kind:'alchemy',station:'alembic',cost:{herb:2,food:1},heat:70,quench:'water',
    stages:[['Dissolve','wela',4500],['Distill','luna',6000],['Coalesce','mela',3000]],
    use:'Drink to restore health and Breath; in the Commons, refresh your gathering cadence.'},
  earth:{name:'Earth tincture',word:'tera',kind:'alchemy',station:'alembic',cost:{herb:2,stone:1},heat:90,quench:'air',
    stages:[['Grind','bema',4500],['Circulate','rima',6000],['Settle','tera',4500]],
    use:'Tend the town garden: growth cycles or shared gathering become quicker, with the same material limits.'}
});
const D=Math.PI/180, mod=(x,n=360)=>(x%n+n)%n;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const goodNumber=(n,a=0,b=1e14)=>typeof n==='number'&&Number.isFinite(n)&&n>=a&&n<=b;
const integer=(n,a=0,b=1e9)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const exact=(v,k)=>object(v)&&Object.keys(v).sort().join()===k.slice().sort().join();
const fail=m=>{throw Error(m);};
const cache=new Map();
const BODIES=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'];
const COLORS=['#ffdc9d','#d2e7ff','#b9d8dc','#f6d0e9','#ffad92','#eec997','#bfb6ff'];
export function score(word){return [...word].flatMap((letter,index)=>{
  const q=ALPHABET.indexOf(letter);if(q<0)fail('A score must use Luma letters.');
  return [Math.floor(q/5),q%5].map((pitch,pair)=>({letter,index,pair,pitch,frequency:220*RATIOS[pitch]}));
});}
export function skyAt(elapsedMs){
  if(!goodNumber(elapsedMs,0,2e12))fail('The celestial clock is outside its supported range.');
  const bucket=Math.floor(elapsedMs/1000);if(cache.has(bucket))return cache.get(bucket);
  const date=new Date(Date.parse(SKY_MODEL.epoch)+bucket*1000*SKY_MODEL.rate);
  const result=calculateSky(date);
  // The original three-star reference remains separately inspectable. The full
  // catalogue is computed in the browser, never sent in every shared-state reply.
  const observer=new Astronomy.Observer(SKY_MODEL.latitude,SKY_MODEL.longitude,SKY_MODEL.elevation);
  const rotation=Astronomy.Rotation_EQJ_EQD(date);
  result.stars=STAR_CATALOG.stars.map(s=>{
    const v=Astronomy.RotateVector(rotation,new Astronomy.Vector(...s.icrsUnitVector,Astronomy.MakeTime(date)));
    const eq=Astronomy.EquatorFromVector(v),h=Astronomy.Horizon(date,observer,eq.ra,eq.dec,'normal');
    return {name:s.name,altitude:h.altitude,azimuth:h.azimuth};
  });
  result.day=Math.floor(bucket/720)+1;
  if(cache.size>=8)cache.delete(cache.keys().next().value);cache.set(bucket,Object.freeze(result));return result;
}
export const beatAt=ms=>({index:Math.floor(ms/BEAT_MS),phase:mod(ms,BEAT_MS)/BEAT_MS});
export function resonantBeat(ms){const sky=skyAt(ms),notes=score(sky.word),beat=beatAt(ms);return {...beat,...notes[mod(beat.index,notes.length)],word:sky.word};}

export const workshopState=()=>({schema:1,serial:0,job:null,products:[],records:[]});
export const townState=()=>({bell:null,garden:null});
export function startWork(w,recipeId,now,mode='steady'){
  const recipe=RECIPES[recipeId];if(!recipe)fail('Choose an existing recipe.');
  if(!goodNumber(now)||!['steady','rhythm'].includes(mode))fail('Choose steady work or rhythm work.');
  if(w.job)fail('Finish or reclaim your current work first.');
  if(w.products.length>=24)fail('Use or reclaim a finished work before making another.');
  const job={id:++w.serial,recipe:recipeId,mode,started:now,stage:0,stageAt:now,strikes:[],grades:[],cooling:'water',sky:skyAt(now).utc,celestial:skyRecord(skyAt(now)),stageEvidence:[]};
  w.job=job;return structuredClone(job);
}
export function workStatus(w,now){
  if(!w?.job)return null;const j=w.job,r=RECIPES[j.recipe],stage=r.stages[j.stage],age=Math.max(0,now-j.stageAt);
  const duration=stage[2],phase=clamp(age/duration,0,1),notes=score(stage[1]);
  const temperature=j.stage===0?20+(r.heat-20)*(1-Math.exp(-age/(duration/3))):j.stage===1?r.heat*.82:r.heat*Math.exp(-age/(j.cooling==='water'?800:2400));
  return {job:j,recipe:r,name:stage[0],word:stage[1],age,duration,phase,ready:age>=duration,
    temperature:Math.round(temperature),notes,index:Math.min(notes.length-1,Math.floor(age/BEAT_MS)),
    untilNext:BEAT_MS-mod(age,BEAT_MS),quality:j.grades.length?Math.round(j.grades.reduce((a,b)=>a+b,0)/j.grades.length):null};
}
export function strikeWork(w,now){
  const status=workStatus(w,now);if(!status)fail('Begin a work before following its rhythm.');
  const j=w.job;if(j.mode!=='rhythm')fail('Steady work does not need timed strikes.');
  const slot=Math.round(status.age/BEAT_MS),error=Math.abs(status.age-slot*BEAT_MS);
  if(slot<1||slot>Math.floor(status.duration/BEAT_MS)||w.job.strikes.some(s=>s.slot===slot))fail('Each beat accepts one strike. Follow the next note.');
  if(error>260)fail('Listen or watch for the next light. This strike did not consume material.');
  const accuracy=Math.round(100*(1-error/300));j.strikes.push({slot,at:now,accuracy});return {slot,accuracy,letter:status.notes[mod(slot-1,status.notes.length)].letter};
}
export function advanceWork(w,now,cooling='water'){
  const status=workStatus(w,now);if(!status)fail('There is no active work.');
  if(!status.ready)fail(`Let ${status.name.toLowerCase()} finish before continuing.`);
  if(!['water','air'].includes(cooling))fail('Choose water quenching or air cooling.');
  const j=w.job,r=status.recipe,sky=skyAt(now),bonus=r.kind==='metal'?sky.forgeBonus:sky.alchemyBonus;
  const rhythmic=j.mode==='rhythm'?Math.min(18,Math.round(j.strikes.reduce((s,x)=>s+x.accuracy,0)/Math.floor(status.duration/BEAT_MS)*.18)):8;
  const alignment=sky.alignment?Math.round(sky.alignment.strength*4):0;
  const coolingBonus=j.stage===2?(j.cooling===r.quench?8:0):8;
  const quality=Math.min(100,58+rhythmic+bonus+alignment+coolingBonus);
  j.stageEvidence??=Array(j.stage).fill(null);
  j.stageEvidence.push({stage:j.stage,at:now,utc:sky.utc,base:58,rhythm:rhythmic,skyBonus:bonus,alignment,cooling:coolingBonus,quality,
    solarAltitude:sky.solarAltitude,illuminatedFraction:sky.moonLight,aspect:sky.alignment?{a:sky.alignment.a,b:sky.alignment.b,name:sky.alignment.name,orb:sky.alignment.orb}:null});
  j.grades.push(quality);
  if(j.stage<2){j.stage++;j.stageAt=now;j.strikes=[];j.cooling=cooling;return {stage:j.stage,quality};}
  const product={id:j.id,recipe:j.recipe,quality:Math.round(j.grades.reduce((a,b)=>a+b,0)/3),created:now,
    sky:j.sky,finishedSky:sky.utc,mode:j.mode,grades:j.grades.slice(),inscription:toNative(r.word),celestial:{started:j.celestial||null,finished:skyRecord(sky),stages:j.stageEvidence.slice(),qualityRule:'atelier-2: model illumination, classical longitude aspects, unchanged bounded craft coefficients'}};
  w.products.push(product);w.records.push(structuredClone(product));w.records=w.records.slice(-32);w.job=null;
  return {product:structuredClone(product)};
}
export function takeProduct(w,id){const i=w.products.findIndex(p=>p.id===id);if(i<0)fail('Choose a work you still own.');return w.products.splice(i,1)[0];}
export function investment(w,item){return (w.job?(RECIPES[w.job.recipe].cost[item]||0):0)+w.products.reduce((n,p)=>n+(RECIPES[p.recipe].cost[item]||0),0);}
export function validateWorkshop(w,now=1e14){
  if(!(exact(w,['schema','serial','job','products','records'])||exact(w,['schema','serial','job','products','records','observations']))||w.schema!==1||!integer(w.serial)||!Array.isArray(w.products)||w.products.length>24||!Array.isArray(w.records)||w.records.length>32)fail('The workshop record is malformed.');
  const product=p=>{
    const keys=['id','recipe','quality','created','sky','finishedSky','mode','grades','inscription'];
    if(!(exact(p,keys)||exact(p,[...keys,'celestial']))||!integer(p.id,1,w.serial)||!RECIPES[p.recipe]||!integer(p.quality,0,100)||!goodNumber(p.created,0,now)||!['steady','rhythm'].includes(p.mode)||!Array.isArray(p.grades)||p.grades.length!==3||p.grades.some(n=>!integer(n,58,100))||p.quality!==Math.round(p.grades.reduce((a,b)=>a+b,0)/3)||p.inscription!==toNative(RECIPES[p.recipe].word)||![p.sky,p.finishedSky].every(s=>typeof s==='string'&&/^\d{4}-\d\d-\d\dT/.test(s)&&Number.isFinite(Date.parse(s))))fail('The finished work lost its material or language record.');
    if(p.celestial){if(!exact(p.celestial,['started','finished','stages','qualityRule'])||typeof p.celestial.qualityRule!=='string')fail('Invalid sky provenance.');if(p.celestial.started)validateSkyRecord(p.celestial.started);validateSkyRecord(p.celestial.finished);validateStageEvidence(p.celestial.stages,p.grades,now);if(p.celestial.finished.utc!==p.finishedSky||p.celestial.started&&p.celestial.started.utc!==p.sky)fail('The work and its sky record disagree.');}
  };
  w.products.forEach(product);w.records.forEach(product);
  if(new Set(w.products.map(p=>p.id)).size!==w.products.length||new Set(w.records.map(p=>p.id)).size!==w.records.length)fail('A finished work appears twice.');
  const j=w.job;if(j){
    const keys=['id','recipe','mode','started','stage','stageAt','strikes','grades','cooling','sky'];
    if(!exact(j,[...keys,...['celestial','stageEvidence'].filter(k=>Object.hasOwn(j,k))])||!integer(j.id,1,w.serial)||j.id!==w.serial||w.products.some(p=>p.id===j.id)||!RECIPES[j.recipe]||!['steady','rhythm'].includes(j.mode)||!integer(j.stage,0,2)||!goodNumber(j.started,0,now)||!goodNumber(j.stageAt,j.started,now)||!['water','air'].includes(j.cooling)||!Array.isArray(j.grades)||j.grades.length!==j.stage||j.grades.some(n=>!integer(n,58,100))||!Array.isArray(j.strikes)||j.strikes.length>8||typeof j.sky!=='string')fail('The active work is malformed.');
    if(j.celestial){validateSkyRecord(j.celestial);if(j.celestial.utc!==j.sky)fail('The starting sky disagrees with the work.');}
    if(j.stageEvidence)validateStageEvidence(j.stageEvidence,j.grades,now);
    const duration=RECIPES[j.recipe].stages[j.stage][2];
    if(new Set(j.strikes.map(s=>s.slot)).size!==j.strikes.length||j.strikes.some(s=>!exact(s,['slot','at','accuracy'])||!integer(s.slot,1,duration/BEAT_MS)||!goodNumber(s.at,j.stageAt,now)||!integer(s.accuracy,0,100)||Math.abs(s.at-j.stageAt-s.slot*BEAT_MS)>260||s.accuracy!==Math.round(100*(1-Math.abs(s.at-j.stageAt-s.slot*BEAT_MS)/300))))fail('The work rhythm record is malformed.');
  }
  if(w.observations!==undefined){
    if(!Array.isArray(w.observations)||w.observations.length>24||new Set(w.observations.map(o=>o.id)).size!==w.observations.length)fail('The sky notebook is malformed.');
    for(const o of w.observations){
      if(!exact(o,['id','at','practice','phrase','sky','reflections','actions'])||!integer(o.id,1)||!goodNumber(o.at,0,now)||!Object.hasOwn(PRACTICES,o.practice)||o.phrase!==practicePhrase(o.practice)||!Array.isArray(o.reflections)||o.reflections.length>8||!Array.isArray(o.actions)||o.actions.length>24)fail('Invalid sky encounter.');
      validateSkyRecord(o.sky);
      for(const r of o.reflections)if(!exact(r,['at','text'])||!goodNumber(r.at,o.at,now)||typeof r.text!=='string'||!r.text.trim()||r.text.length>600)fail('Invalid reflection.');
      for(const a of o.actions)if(!exact(a,['at','productId','recipe','quality'])||!goodNumber(a.at,o.at,now)||!integer(a.productId,1,w.serial)||!RECIPES[a.recipe]||!integer(a.quality,0,100))fail('Invalid encounter action.');
    }
  }
  return w;
}
function validateStageEvidence(rows,grades,now){
  if(!Array.isArray(rows)||rows.length!==grades.length)fail('Invalid stage evidence.');
  rows.forEach((r,i)=>{if(r===null)return;
    if(!exact(r,['stage','at','utc','base','rhythm','skyBonus','alignment','cooling','quality','solarAltitude','illuminatedFraction','aspect'])||r.stage!==i||!goodNumber(r.at,0,now)||r.base!==58||!integer(r.rhythm,0,18)||!integer(r.skyBonus,0,8)||!integer(r.alignment,0,4)||![0,8].includes(r.cooling)||r.quality!==grades[i]||r.quality!==Math.min(100,r.base+r.rhythm+r.skyBonus+r.alignment+r.cooling)||!goodNumber(r.solarAltitude,-90,90)||!goodNumber(r.illuminatedFraction,0,1)||typeof r.utc!=='string'||!Number.isFinite(Date.parse(r.utc)))fail('The grade disagrees with its recorded factors.');
    if(r.aspect&&(!exact(r.aspect,['a','b','name','orb'])||!BODIES.includes(r.aspect.a)||!BODIES.includes(r.aspect.b)||!goodNumber(r.aspect.orb,0,6)))fail('Invalid recorded aspect.');
  });
}

// Validation is structural and mathematical; authenticated action code creates
// the record. A local export is not a signed certificate of astronomical truth.
import {SKY_VERSION,SEAL_ORDER,angularCoordinates,sealCell} from './sky-model.js';
export function validateSkyRecord(r){
  const keys=['schema','utc','observer','engine','engineCommit','frame','offset','offsetDefinition','time','order','angles','coordinates','mask','cells','phase','illuminatedFraction','correction','quantization'];
  if(!exact(r,keys)||r.schema!==SKY_VERSION||typeof r.utc!=='string'||!Number.isFinite(Date.parse(r.utc))||JSON.stringify(r.order)!==JSON.stringify(SEAL_ORDER)||!Array.isArray(r.angles)||r.angles.length!==8||r.angles.some((a,i)=>a===null?i!==7:!goodNumber(a,0,360))||!goodNumber(r.phase,0,360)||!goodNumber(r.illuminatedFraction,0,1)||!goodNumber(r.offset,-360,360)||!exact(r.observer,['latitude','longitude','elevation'])||!goodNumber(r.observer.latitude,-90,90)||!goodNumber(r.observer.longitude,-180,180)||!goodNumber(r.observer.elevation,-500,12000))fail('Invalid recorded sky.');
  const coordinates=angularCoordinates(r.angles);
  if(JSON.stringify(r.coordinates)!==JSON.stringify(coordinates)||JSON.stringify(r.mask)!==JSON.stringify(coordinates.map(x=>x!==null))||JSON.stringify(r.cells)!==JSON.stringify(r.angles.map(sealCell)))fail('The sky seal cannot be reconstructed from its angles.');
  return r;
}
export function observeSky(w,now,practice){
  if(!Object.hasOwn(PRACTICES,practice))fail('Choose one of the seven authored planetary practices.');
  const sky=skyRecord(skyAt(now)),last=w.observations?.at(-1);
  if(last&&last.sky.utc===sky.utc&&last.practice===practice)fail('This moment is already in your notebook.');
  const entry={id:(last?.id||0)+1,at:now,practice,phrase:practicePhrase(practice),sky,reflections:[],actions:[]};
  w.observations=[...(w.observations||[]),entry].slice(-24);return {observation:structuredClone(entry),message:'The town sky and your intention are recorded. Return after acting to reflect.'};
}
export function reflectSky(w,id,text,now){
  const o=w.observations?.find(x=>x.id===id);
  if(!o)fail('Choose an encounter from your own notebook.');
  if(typeof text!=='string'||!text.trim()||text.length>600||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))fail('Write a reflection of 1 to 600 characters.');
  if(o.reflections.length>=8)fail('This encounter already has eight saved revisions. Begin another encounter.');
  o.reflections.push({at:now,text:text.trim()});return {message:'Your reflection is saved alongside the original intention.'};
}
export function recordSkyUse(w,product,now){
  const o=w.observations?.at(-1);if(o&&o.actions.length<24)o.actions.push({at:now,productId:product.id,recipe:product.recipe,quality:product.quality});
}

// A deliberately bounded executable register. Foreign names remain quoted;
// unsupported qualifiers/roles/modes cannot silently become an undertaking.
export function resolveWorkshopPhrase(text){
  const p=parse(text),c=p.ast?.statements?.[0];
  const bare=np=>np&&np.type==='nounPhrase'&&np.quantifier===null&&!np.adjectives?.length&&!np.relatives?.length;
  if(p.ast.statements.length!==1||!c||!bare(p.subject)||p.subject.head.type!=='pronoun'||p.subject.head.value!=='mi'||c.time!==null||c.aspect!==null||c.vocative!==null||c.predicate.negated||!['pe','i','u','e','a'].includes(p.mode)||p.manner.some(w=>w!=='melu')||p.manner.length>1||Object.values(p.roles).some(np=>!bare(np))||Object.keys(p.roles).some(k=>!['ta','ki'].includes(k))||c.force&&c.stance)fail('Use one own-speaker Luma clause with its explicit mode and unqualified theme.');
  if(p.verb==='peli'){
    const name=roleName(p,'ta'),entry=Object.entries(RECIPES).find(([,r])=>r.name===name);
    if(!entry||p.roles.ki&&roleWord(p,'ki')!==(entry[1].kind==='metal'?'fama':'wela'))fail('Name the recipe exactly in quotes and use its fire or water means.');
    return {mode:p.mode,operation:'start',recipe:entry[0],native:p.native,latin:p.latin};
  }
  if(p.verb==='yeli'&&roleWord(p,'ta')==='loma'&&!p.roles.ki)return {mode:p.mode,operation:'observe',native:p.native,latin:p.latin};
  fail('That Luma sentence has no workshop action.');
}
