/* One numerical sky for the town, observatory, seal and workshop provenance.
 * Celestial coordinates never redefine a Luma phoneme or authorize an action. */
import {Astronomy as A} from './luma/astronomy.js';
import {ALPHABET, RATIOS} from './luma/data.js';
import {toNative} from './luma/language.js';

export const SKY_VERSION='luma-whole-sky-2';
export const SKY_MODEL=Object.freeze({epoch:'2026-09-12T18:00:00.000Z',rate:120,latitude:38,longitude:0,elevation:150,
  frame:'Geocentric true ecliptic/equinox of date; topocentric apparent horizon',
  catalogueFrame:'BSC: FK5 J2000 epoch 2000.0; source Luma triangle: ICRS epoch 2000.0',engine:'Astronomy Engine 2.1.19',
  commit:'865d3da7d8112bbc7911238052c6af4aaf877181',version:SKY_VERSION,
  convention:'One active second advances the sky by two minutes. The town location is authored.'});
export const BODY_NAMES=Object.freeze(['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']);
export const SEAL_ORDER=Object.freeze([...BODY_NAMES.slice(0,7),'Ascendant']);
export const SIGNS=Object.freeze(['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']);
export const NAKSHATRAS=Object.freeze(['Aśvinī','Bharaṇī','Kṛttikā','Rohiṇī','Mṛgaśīrṣa','Ārdrā','Punarvasu','Puṣya','Āśleṣā','Maghā','Pūrvaphālgunī','Uttaraphālgunī','Hasta','Citrā','Svāti','Viśākhā','Anurādhā','Jyeṣṭhā','Mūla','Pūrvāṣāḍhā','Uttarāṣāḍhā','Śravaṇa','Dhaniṣṭhā','Śatabhiṣaj','Pūrvabhādrapadā','Uttarabhādrapadā','Revatī']);
export const SOLAR_TERMS=Object.freeze([
  ['春分','chūnfēn','March equinox'],['清明','qīngmíng','Bright and clear'],['穀雨','gǔyǔ','Grain rain'],['立夏','lìxià','Summer begins'],
  ['小滿','xiǎomǎn','Grain fills'],['芒種','mángzhòng','Grain in ear'],['夏至','xiàzhì','June solstice'],['小暑','xiǎoshǔ','Lesser heat'],
  ['大暑','dàshǔ','Greater heat'],['立秋','lìqiū','Autumn begins'],['處暑','chǔshǔ','Heat recedes'],['白露','báilù','White dew'],
  ['秋分','qiūfēn','September equinox'],['寒露','hánlù','Cold dew'],['霜降','shuāngjiàng','Frost descends'],['立冬','lìdōng','Winter begins'],
  ['小雪','xiǎoxuě','Lesser snow'],['大雪','dàxuě','Greater snow'],['冬至','dōngzhì','December solstice'],['小寒','xiǎohán','Lesser cold'],
  ['大寒','dàhán','Greater cold'],['立春','lìchūn','Spring begins'],['雨水','yǔshuǐ','Rain water'],['驚蟄','jīngzhé','Insects awaken']]);
export const PRACTICES=Object.freeze({
  Sun:{word:'liha',verb:'wedi',theme:'pela',title:'Illuminate',question:'What am I making visible, and whose view have I missed?'},
  Moon:{word:'yema',verb:'yemi',theme:'mela',title:'Remember',question:'What needs rest or acknowledgment before I continue?'},
  Mercury:{word:'lina',verb:'lini',theme:'pela',title:'Learn',question:'Which distinction, question, or listener would improve this work?'},
  Venus:{word:'mela',verb:'peli',theme:'pela',title:'Create with care',question:'How can beauty also express welcome and care?'},
  Mars:{word:'rema',verb:'remi',theme:'pela',title:'Repair',question:'What specific repair can I make without imposing my will on another?'},
  Jupiter:{word:'dona',verb:'doni',theme:'dona',title:'Give',question:'What could I share, and what would the recipient welcome?'},
  Saturn:{word:'pelama',verb:'pelami',theme:'pela',title:'Sustain',question:'What limit or sustained commitment lets this work endure?'}
});
export function practicePhrase(body,mode='u'){
  if(!Object.hasOwn(PRACTICES,body)||!['u','pe','i'].includes(mode))throw Error('Choose one of the seven authored practices.');
  if(body==='Saturn')return `${mode} mi me pelami ta [mi me meli ta pela].`;
  const p=PRACTICES[body];return `${mode} mi me ${p.verb}${body==='Venus'?' melu':''} ta ${p.theme}${body==='Jupiter'?' li ti':''}.`;
}
export const DEG=Math.PI/180;
export const wrap=x=>{if(!Number.isFinite(x))throw Error('An angle must be finite.');return x>=0&&x<360?x:((x%360)+360)%360;};
export const signed=x=>{const a=wrap(x);return a>=180?a-360:a;};
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
export const vec=(v)=>[v.x,v.y,v.z];
export function unit(a){const r=Math.hypot(...a);return r>0?a.map(x=>x/r):null;}
export const longitude=v=>wrap(Math.atan2(v[1],v[0])/DEG);
export const rotate=(rotation,a,date)=>vec(A.RotateVector(rotation,new A.Vector(...a,A.MakeTime(date))));

// floor(parts * lambda / 360) with the exported decimal as the contract.
export function sectorIndex(angle,parts){
  if(!Number.isSafeInteger(parts)||parts<1||parts>100000)throw Error('Choose a positive, bounded division count.');
  if(!Number.isFinite(angle))throw Error('An angle must be finite.');
  const [mantissa,exponent='0']=String(angle).split('e'),[whole,fraction='']=mantissa.split('.');
  let n=BigInt(whole+fraction),d=10n**BigInt(fraction.length),e=Number(exponent);
  if(e>0)n*=10n**BigInt(e);else if(e<0)d*=10n**BigInt(-e);
  const turn=360n*d;n=((n%turn)+turn)%turn;
  return Number(n*BigInt(parts)/turn);
}
export function sealCell(angle){
  if(angle===null)return null;
  const bin=sectorIndex(angle,400),digits=[Math.floor(bin/20),bin%20],latin='#'+digits.map(q=>ALPHABET[q]).join('');
  // Ordinary quantity rendering canonicalizes leading zeros. A named two-digit
  // cell has a separate formatting contract and retains both native characters.
  return {bin,digits,latin,native:'#'+digits.map(q=>String.fromCodePoint(0xE000+q)).join(''),intervalNumerators:[String(9*bin),String(9*(bin+1))],denominator:10,
    midpointDegrees:.9*(bin+.5),maxErrorDegrees:.45,
    notes:digits.flatMap(q=>[Math.floor(q/5),q%5].map(p=>({pitch:p,frequency:220*RATIOS[p]})))};
}
export function angularCoordinates(angles){return angles.flatMap(a=>a===null?[null,null]:[Math.cos(a*DEG),Math.sin(a*DEG)]);}
export function coordinatePrefix(coordinates,d){
  if(coordinates.length!==16||!Number.isInteger(d)||d<1||d>16)throw Error('Choose 1 through 16 sky coordinates.');
  const slots=Math.floor(d/2),completePairs=Array.from({length:slots},(_,i)=>coordinates[2*i]!==null&&coordinates[2*i+1]!==null).filter(Boolean).length;
  return {values:coordinates.slice(0,d),omitted:coordinates.slice(d).map((_,i)=>d+i),completePairs,completePairSlots:slots,unpaired:d%2?SEAL_ORDER[slots]:null,unpairedAvailable:!!(d%2)&&coordinates[d-1]!==null,
    mask:coordinates.map((v,i)=>i<d&&v!==null)};
}
export function divisions(moon,sun,offset=0){
  const selected=wrap(moon-offset),pada=sectorIndex(selected,108),n=Math.floor(pada/4),phase=wrap(moon-sun);
  return {phase,tithi:sectorIndex(phase,30)+1,tithiFraction:(phase%12)/12,waxing:phase<180,nakshatra:n,pada:pada%4+1,address:pada,
    intervalArcminutes:[n*800,(n+1)*800],quarterArcminutes:[pada*200,(pada+1)*200],yoga:sectorIndex(wrap(moon+sun-2*offset),27)+1,
    sign:sectorIndex(selected,12),letter:sectorIndex(selected,20),solarTerm:sectorIndex(sun,24)};
}
export function checkInput(date,observer={latitude:SKY_MODEL.latitude,longitude:SKY_MODEL.longitude,elevation:SKY_MODEL.elevation}){
  if(typeof date==='string'&&!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(date))throw Error('Use a complete UTC timestamp ending in Z.');
  const original=typeof date==='string'?date:null;date=new Date(date);const year=date.getUTCFullYear();
  if(!Number.isFinite(+date)||year<1800||year>2200)throw Error('This observatory supports dates from 1800 through 2200.');
  if(original&&date.toISOString().slice(0,19)!==original.slice(0,19))throw Error('That calendar date or time is invalid.');
  const {latitude,longitude,elevation=0}=observer;
  if(!Number.isFinite(latitude)||latitude< -90||latitude>90||!Number.isFinite(longitude)||longitude< -180||longitude>180||!Number.isFinite(elevation)||elevation< -500||elevation>12000)throw Error('Choose latitude −90…90°, longitude −180…180°, and elevation −500…12000 m.');
  return {date,observer:{latitude,longitude,elevation},engineObserver:new A.Observer(latitude,longitude,elevation)};
}
export function horizonAngles(date,observer){
  const theta=wrap(A.SiderealTime(date)*15+observer.longitude)*DEG,phi=observer.latitude*DEG,R=A.Rotation_EQD_ECT(date);
  const z=rotate(R,[Math.cos(phi)*Math.cos(theta),Math.cos(phi)*Math.sin(theta),Math.sin(phi)],date);
  const e=rotate(R,[-Math.sin(theta),Math.cos(theta),0],date),m=rotate(R,[Math.cos(theta),Math.sin(theta),0],date);
  let v=unit([-z[1],z[0],0]),w=unit([-e[1],e[0],0]),reason=null;
  if(Math.abs(observer.latitude)>=89.999999999)reason='The diurnal rising direction is undefined at a geographic pole.';
  else if(!v||Math.abs(dot(v,e))<1e-10)reason='The ecliptic and horizon have no unique rising intersection.';
  if(v&&dot(v,e)<0)v=v.map(x=>-x);if(w&&dot(w,m)<0)w=w.map(x=>-x);
  return {ascendant:reason?null:longitude(v),midheaven:w?longitude(w):null,reason,sidereal:theta/DEG};
}
export function osculatingNodes(date){
  const s=A.GeoMoonState(date),R=A.Rotation_EQJ_ECT(date),r=rotate(R,[s.x,s.y,s.z],date),v=rotate(R,[s.vx,s.vy,s.vz],date);
  const h=cross(r,v),n=unit([-h[1],h[0],0]);
  return {ascending:n?longitude(n):null,descending:n?wrap(longitude(n)+180):null,model:'Instantaneous geocentric osculating lunar plane, true ecliptic of date. Nodes are crossings, not bodies.'};
}
const COLORS=['#ffdc9d','#d2e7ff','#b9d8dc','#f6d0e9','#ffad92','#eec997','#bfb6ff','#a4efee','#839aff','#c9b8a5'];
export function calculateSky(input,location,offset=0){
  const {date,observer,engineObserver}=checkInput(input,location);
  if(!Number.isFinite(offset)||offset< -360||offset>360)throw Error('The custom longitude offset must be finite and within one turn.');
  const time=A.MakeTime(date),before=time.AddDays(-.01),after=time.AddDays(.01);
  const bodies=BODY_NAMES.map((name,i)=>{
    const v=A.GeoVector(name,time,true),e=A.Ecliptic(v),q=A.Equator(name,time,engineObserver,true,true),eqj=A.EquatorFromVector(v);
    const apparent=A.Horizon(time,engineObserver,q.ra,q.dec,'normal'),geometric=A.Horizon(time,engineObserver,q.ra,q.dec),light=A.Illumination(name,time);
    const speed=signed(A.Ecliptic(A.GeoVector(name,after,true)).elon-A.Ecliptic(A.GeoVector(name,before,true)).elon)/.02;
    return {name,kind:i===0?'star':i===1?'moon':i===9?'dwarf planet':'planet',word:i===0?'sola':i===1?'luna':null,color:COLORS[i],
      longitude:wrap(e.elon-offset),tropicalLongitude:wrap(e.elon),latitude:e.elat,ra:q.ra,dec:q.dec,raJ2000:eqj.ra,decJ2000:eqj.dec,
      altitude:apparent.altitude,geometricAltitude:geometric.altitude,azimuth:apparent.azimuth,speed,retrograde:speed<0,stationary:Math.abs(speed)<.001,
      magnitude:light.mag,illumination:light.phase_fraction,distanceAu:light.geo_dist,constellation:A.Constellation(eqj.ra,eqj.dec).name};
  });
  const sun=bodies[0],moon=bodies[1],relations=divisions(moon.tropicalLongitude,sun.tropicalLongitude,offset),angles=horizonAngles(time,observer);
  const daylight=clamp((sun.altitude+10)/35,0,1),aspects=[];
  for(let i=0;i<7;i++)for(let j=i+1;j<7;j++){
    const separation=Math.abs(signed(bodies[i].longitude-bodies[j].longitude));
    for(const [name,angle] of [['conjunction',0],['sextile',60],['square',90],['trine',120],['opposition',180]]){
      const orb=Math.abs(separation-angle);if(orb<=6)aspects.push({a:bodies[i].name,b:bodies[j].name,name,angle,orb,strength:1-orb/6,maximumOrb:6});
    }
  }
  aspects.sort((a,b)=>a.orb-b.orb);
  const ordered=[...bodies.slice(0,7).map(b=>b.longitude),angles.ascendant===null?null:wrap(angles.ascendant-offset)];
  const coordinates16=angularCoordinates(ordered),seal=ordered.map((value,i)=>({body:SEAL_ORDER[i],longitude:value,cell:sealCell(value)}));
  const word=daylight>.5?'sola':relations.phase>120&&relations.phase<240?'luna':'sira';
  return {version:SKY_VERSION,utc:date.toISOString(),observer,offset,offsetDefinition:offset===0?'Tropical true equinox of date':'Custom fixed offset for this chart; not a named ayanāṃśa',
    time:{julianUT:time.ut+2451545,julianTT:time.tt+2451545,deltaTSeconds:(time.tt-time.ut)*86400,convention:'UTC approximated as UT1; Espenak–Meeus model for TT−UT'},
    bodies,daylight,solarAltitude:sun.altitude,phase:relations.phase,moonLight:moon.illumination,word,native:toNative(word),
    relations,angles,nodes:osculatingNodes(time),sidereal:angles.sidereal,coordinates16,coordinateMask:coordinates16.map(x=>x!==null),seal,
    alignment:aspects[0]||null,aspects,forgeBonus:Math.round(8*daylight),alchemyBonus:Math.round(8*moon.illumination)};
}
export function skyRecord(sky){
  return {schema:SKY_VERSION,utc:sky.utc,observer:{...sky.observer},engine:SKY_MODEL.engine,engineCommit:SKY_MODEL.commit,
    frame:SKY_MODEL.frame,offset:sky.offset,offsetDefinition:sky.offsetDefinition,time:{...sky.time},
    order:[...SEAL_ORDER],angles:sky.seal.map(s=>s.longitude),coordinates:sky.coordinates16.slice(),mask:sky.coordinateMask.slice(),
    cells:sky.seal.map(s=>s.cell),phase:sky.phase,illuminatedFraction:sky.moonLight,
    correction:'Geocentric planetary/Sun light-time and aberration. Upstream Moon is geometric. Altitudes use topocentric apparent positions.',
    quantization:'400 half-open bins of 0.9 degrees; shortest-decimal integer evaluation; midpoint error at most 0.45 degrees, separate from model uncertainty.'};
}
const MS_DAY=86400000;
function refineEvent(start,target,quantity){
  const guess=+new Date(start),at=ms=>signed(quantity(new Date(ms))-target);
  let lo=guess-.15*MS_DAY,hi=guess+.15*MS_DAY;
  if(at(lo)>0||at(hi)<0)return null;
  for(let i=0;i<32;i++){const mid=(lo+hi)/2;if(at(mid)>0)hi=mid;else lo=mid;}
  return new Date((lo+hi)/2).toISOString();
}
const chartLongitude=(name,date)=>wrap(A.Ecliptic(A.GeoVector(name,date,true)).elon);
export function skyEvents(input,location){
  const {date,engineObserver}=checkInput(input,location),events=[];
  for(const [body,direction,title] of [['Sun',1,'Sunrise'],['Sun',-1,'Sunset'],['Moon',1,'Moonrise'],['Moon',-1,'Moonset']]){
    const time=A.SearchRiseSet(body,engineObserver,direction,date,2);
    events.push({kind:'horizon',title,utc:time?.date.toISOString()||null,scope:'Upper limb, conventional refraction, unobstructed horizon; bounded two-day search.'});
  }
  // Start a day back, then filter refined roots: an upstream bracket can lie
  // just after the requested instant while the chart-convention root is before it.
  let quarter=A.SearchMoonQuarter(new Date(+date-MS_DAY)),count=0;
  while(count<4){
    const utc=refineEvent(quarter.time.date,quarter.quarter*90,t=>wrap(chartLongitude('Moon',t)-chartLongitude('Sun',t)));
    if(utc&&+new Date(utc)>+date){events.push({kind:'phase',title:['New Moon','First quarter','Full Moon','Last quarter'][quarter.quarter],utc,target:quarter.quarter*90,scope:'Refined to the same longitude subtraction as the displayed chart.'});count++;}
    quarter=A.NextMoonQuarter(quarter);
  }
  const target=(sectorIndex(chartLongitude('Sun',date),24)+1)%24;
  const guess=A.SearchSunLongitude(target*15,date,18);
  if(guess){const utc=refineEvent(guess.date,target*15,t=>chartLongitude('Sun',t));if(utc)events.push({kind:'season',title:SOLAR_TERMS[target][0]+' · '+SOLAR_TERMS[target][2],utc,target:target*15,scope:'Modern 15° tropical solar-term boundary, refined to chart solar longitude.'});}
  const node=A.SearchMoonNode(date);events.push({kind:'node',title:node.kind>0?'Moon crosses north through the ecliptic':'Moon crosses south through the ecliptic',utc:node.time.date.toISOString(),scope:'Upstream EclipticGeoMoon latitude-zero event; a crossing alone is not an eclipse.'});
  return events.sort((a,b)=>(a.utc?Date.parse(a.utc):Infinity)-(b.utc?Date.parse(b.utc):Infinity));
}
export function planetaryHour(input,location,utcOffsetMinutes=0){
  const {date,engineObserver}=checkInput(input,location);
  if(!Number.isInteger(utcOffsetMinutes)||Math.abs(utcOffsetMinutes)>840)throw Error('Use an explicit fixed UTC offset in minutes.');
  const rise=A.SearchRiseSet('Sun',engineObserver,1,date,-2);
  if(!rise)return {available:false,reason:'No preceding sunrise within two days.'};
  const sunset=A.SearchRiseSet('Sun',engineObserver,-1,rise,2),next=A.SearchRiseSet('Sun',engineObserver,1,rise.AddDays(.01),2);
  if(!sunset||!next||+sunset.date>=+next.date||+date>=+next.date)return {available:false,reason:'No ordinary sunrise–sunset–sunrise cycle brackets this moment.'};
  const day=+date<+sunset.date,start=day?+rise.date:+sunset.date,end=day?+sunset.date:+next.date,width=(end-start)/12;
  const index=clamp(Math.floor((+date-start)/width),0,11),sequence=['Saturn','Jupiter','Mars','Sun','Venus','Mercury','Moon'];
  const weekday=new Date(+rise.date+utcOffsetMinutes*60000).getUTCDay(),first=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'][weekday];
  return {available:true,ruler:sequence[(sequence.indexOf(first)+index+(day?0:12))%7],number:index+1+(day?0:12),daytime:day,
    start:new Date(start+index*width).toISOString(),end:new Date(start+(index+1)*width).toISOString(),minutes:width/60000,
    sunrise:rise.date.toISOString(),sunset:sunset.date.toISOString(),nextSunrise:next.date.toISOString(),utcOffsetMinutes};
}
