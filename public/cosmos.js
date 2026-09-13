/* The recorded sky and the authored Luma game rules share a clock, not a claim
 * of physical causation. No network, device location, or wall clock is required. */
import {Astronomy} from './luma/astronomy.js';
import {ALPHABET, RATIOS} from './luma/data.js';
import {STAR_CATALOG} from './luma/stars.js';
import {parse, roleWord, roleName, toNative} from './luma/language.js';

export const SKY_MODEL = Object.freeze({epoch:'2026-09-12T18:00:00.000Z', rate:120,
  latitude:38, longitude:0, elevation:150, frame:'True ecliptic/equinox of date; topocentric horizon',
  catalogueFrame:'ICRS, epoch 2000.0; fixed reference directions', engine:'Astronomy Engine 2.1.19',
  convention:'One active second advances the sky by two minutes. The town location is authored.'});
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
  // One cache bucket is one real second / two simulated minutes. Visual beat
  // timing uses the exact elapsed time independently of the ephemeris bucket.
  const bucket=Math.floor(elapsedMs/1000);if(cache.has(bucket))return cache.get(bucket);
  const date=new Date(Date.parse(SKY_MODEL.epoch)+bucket*1000*SKY_MODEL.rate);
  const observer=new Astronomy.Observer(SKY_MODEL.latitude,SKY_MODEL.longitude,SKY_MODEL.elevation);
  const bodies=BODIES.map((name,i)=>{
    const v=Astronomy.GeoVector(name,date,true),e=Astronomy.Ecliptic(v),q=Astronomy.Equator(name,date,observer,true,true);
    const h=Astronomy.Horizon(date,observer,q.ra,q.dec,'normal');
    return {name,word:name==='Sun'?'sola':name==='Moon'?'luna':null,longitude:mod(e.elon),altitude:h.altitude,azimuth:h.azimuth,color:COLORS[i]};
  });
  const sun=bodies[0],moon=bodies[1],phase=mod(moon.longitude-sun.longitude),daylight=clamp((sun.altitude+10)/35,0,1);
  const pairs=[];
  for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
    const separation=Math.abs(mod(bodies[i].longitude-bodies[j].longitude+180)-180);
    for(const [name,angle] of [['conjunction',0],['sextile',60],['square',90],['trine',120],['opposition',180]]){
      const orb=Math.abs(separation-angle);if(orb<=6)pairs.push({a:bodies[i].name,b:bodies[j].name,name,angle,orb,strength:1-orb/6});
    }
  }
  pairs.sort((a,b)=>a.orb-b.orb);
  const theta=mod(Astronomy.SiderealTime(date)*15+SKY_MODEL.longitude),rotation=Astronomy.Rotation_EQJ_EQD(date);
  const stars=STAR_CATALOG.stars.map(s=>{
    const v=Astronomy.RotateVector(rotation,new Astronomy.Vector(...s.icrsUnitVector,Astronomy.MakeTime(date)));
    const eq=Astronomy.EquatorFromVector(v),h=Astronomy.Horizon(date,observer,eq.ra,eq.dec,'normal');
    return {name:s.name,altitude:h.altitude,azimuth:h.azimuth};
  });
  const word=daylight>.5?'sola':phase>120&&phase<240?'luna':'sira';
  // Seven body angles + local sidereal angle form eight circles embedded in R16.
  const coordinates16=[...bodies.map(b=>b.longitude),theta].flatMap(a=>[Math.cos(a*D),Math.sin(a*D)]);
  const result=Object.freeze({utc:date.toISOString(),day:Math.floor(bucket/720)+1,bodies,stars,daylight,phase,
    moonLight:(1-Math.cos(phase*D))/2,word,native:toNative(word),sidereal:theta,coordinates16,
    alignment:pairs[0]||null,aspects:pairs,solarAltitude:sun.altitude,
    // Four real sky-dependent game coefficients, kept modest and explained in UI.
    forgeBonus:Math.round(8*daylight),alchemyBonus:Math.round(8*(1-Math.cos(phase*D))/2)});
  if(cache.size>=8)cache.delete(cache.keys().next().value);cache.set(bucket,result);return result;
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
  const job={id:++w.serial,recipe:recipeId,mode,started:now,stage:0,stageAt:now,strikes:[],grades:[],cooling:'water',sky:skyAt(now).utc};
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
  j.grades.push(quality);
  if(j.stage<2){j.stage++;j.stageAt=now;j.strikes=[];j.cooling=cooling;return {stage:j.stage,quality};}
  const product={id:j.id,recipe:j.recipe,quality:Math.round(j.grades.reduce((a,b)=>a+b,0)/3),created:now,
    sky:j.sky,finishedSky:sky.utc,mode:j.mode,grades:j.grades.slice(),inscription:toNative(r.word)};
  w.products.push(product);w.records.push(structuredClone(product));w.records=w.records.slice(-32);w.job=null;
  return {product:structuredClone(product)};
}
export function takeProduct(w,id){const i=w.products.findIndex(p=>p.id===id);if(i<0)fail('Choose a work you still own.');return w.products.splice(i,1)[0];}
export function investment(w,item){return (w.job?(RECIPES[w.job.recipe].cost[item]||0):0)+w.products.reduce((n,p)=>n+(RECIPES[p.recipe].cost[item]||0),0);}
export function validateWorkshop(w,now=1e14){
  if(!exact(w,['schema','serial','job','products','records'])||w.schema!==1||!integer(w.serial)||!Array.isArray(w.products)||w.products.length>24||!Array.isArray(w.records)||w.records.length>32)fail('The workshop record is malformed.');
  const product=p=>{
    if(!exact(p,['id','recipe','quality','created','sky','finishedSky','mode','grades','inscription'])||!integer(p.id,1,w.serial)||!RECIPES[p.recipe]||!integer(p.quality,0,100)||!goodNumber(p.created,0,now)||!['steady','rhythm'].includes(p.mode)||!Array.isArray(p.grades)||p.grades.length!==3||p.grades.some(n=>!integer(n,58,100))||p.quality!==Math.round(p.grades.reduce((a,b)=>a+b,0)/3)||p.inscription!==toNative(RECIPES[p.recipe].word)||![p.sky,p.finishedSky].every(s=>typeof s==='string'&&/^\d{4}-\d\d-\d\dT/.test(s)&&Number.isFinite(Date.parse(s))))fail('The finished work lost its material or language record.');
  };
  w.products.forEach(product);w.records.forEach(product);
  if(new Set(w.products.map(p=>p.id)).size!==w.products.length||new Set(w.records.map(p=>p.id)).size!==w.records.length)fail('A finished work appears twice.');
  const j=w.job;if(j){
    if(!exact(j,['id','recipe','mode','started','stage','stageAt','strikes','grades','cooling','sky'])||!integer(j.id,1,w.serial)||j.id!==w.serial||w.products.some(p=>p.id===j.id)||!RECIPES[j.recipe]||!['steady','rhythm'].includes(j.mode)||!integer(j.stage,0,2)||!goodNumber(j.started,0,now)||!goodNumber(j.stageAt,j.started,now)||!['water','air'].includes(j.cooling)||!Array.isArray(j.grades)||j.grades.length!==j.stage||j.grades.some(n=>!integer(n,58,100))||!Array.isArray(j.strikes)||j.strikes.length>8||typeof j.sky!=='string')fail('The active work is malformed.');
    const duration=RECIPES[j.recipe].stages[j.stage][2];
    if(new Set(j.strikes.map(s=>s.slot)).size!==j.strikes.length||j.strikes.some(s=>!exact(s,['slot','at','accuracy'])||!integer(s.slot,1,duration/BEAT_MS)||!goodNumber(s.at,j.stageAt,now)||!integer(s.accuracy,0,100)||Math.abs(s.at-j.stageAt-s.slot*BEAT_MS)>260||s.accuracy!==Math.round(100*(1-Math.abs(s.at-j.stageAt-s.slot*BEAT_MS)/300))))fail('The work rhythm record is malformed.');
  }
  return w;
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
