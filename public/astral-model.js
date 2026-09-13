import {WORLDS,world,encounterPhrase} from './astral-data.js';
import {score} from './cosmos.js';
import {toNative} from './luma/language.js';
import {DICTIONARY} from './luma/data.js';

export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const hash=s=>[...s].reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
export function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function noise(x,z,s=0){const f=n=>n*n*(3-2*n),i=Math.floor(x),j=Math.floor(z),a=f(x-i),b=f(z-j),h=(x,z)=>{const n=Math.sin(x*127.1+z*311.7+s*.13)*43758.5453;return n-Math.floor(n);};return(h(i,j)*(1-a)+h(i+1,j)*a)*(1-b)+(h(i,j+1)*(1-a)+h(i+1,j+1)*a)*b;}
export function fbm(x,z,s){let n=0,a=.56;for(let i=0;i<5;i++){n+=a*noise(x,z,s+i*23);x=x*2.03+7;z=z*2.01-3;a*=.48;}return n;}
export const rgb=h=>h.match(/[a-f\d]{2}/gi).map(c=>parseInt(c,16)/255);
const mix=(a,b,t)=>a.map((c,i)=>c+(b[i]-c)*clamp(t,0,1));
export function landscape(w,site){
 const seed=hash(w.id+':'+site.id),rng=random(seed),kind=site.kind,base=rgb(w.color),fluid=w.style==='gas'||w.style==='sun'||['cloud','ocean','lake','haze','corona','granules','storm','hexagon','rings'].includes(kind);
 const craters=Array.from({length:32},()=>({x:(rng()-.5)*350,z:(rng()-.5)*350,r:2+rng()*16}));
 const crack=(x,z)=>Math.abs(Math.sin(x*.038+Math.sin(z*.026)*1.5)*10+Math.sin(z*.07)*2);
 function height(x,z){
  const n=fbm(x*.025,z*.025,seed),r=Math.hypot(x,z);let y=(n-.4)*9;
  if(['crater','basin','multiring','salt'].includes(kind)){
   const bowl=(x,z,r)=>{const d=Math.hypot(x,z)/r;return-8*Math.exp(-d*d*2)+3.6*Math.exp(-Math.pow((d-1)*7,2));};
   y+=bowl(x,z,kind==='basin'?48:30);
   for(const c of craters)y+=bowl(x-c.x,z-c.z,c.r)*.25;
   if(kind==='multiring')y+=Math.sin(r*.36)*Math.exp(-r/130)*3;
  }else if(['canyon','fault','ridge','saddle'].includes(kind)){
   const path=x-12*Math.sin(z*.028);y+=kind==='ridge'?20*Math.exp(-path*path/90):kind==='saddle'?10*(1-Math.exp(-path*path/180)):18*Math.tanh((Math.abs(path)-12)*.17);
   y+=Math.sin(y*2)*.3;
  }else if(['volcano','lava','mountain','flare'].includes(kind)){
   y+=37*Math.exp(-r*r/1250)-19*Math.exp(-r*r/90);
   if(kind==='mountain')y+=Math.pow(n,3)*45;
  }else if(['fracture','plume','ice','chaos'].includes(kind)){
   y=n*4-2;if(kind==='fracture'||kind==='plume')y-=3*Math.exp(-crack(x,z)*crack(x,z)*.7);
   if(kind==='chaos')y+=Math.abs(Math.sin(x*.11+noise(x*.09,z*.07,seed)*2)*Math.cos(z*.14))*8;
   if(w.id==='pluto')y=.8*n+Math.pow(Math.abs(Math.sin(x*.11)+Math.sin(z*.12)),12)*.0001;
  }else if(kind==='dunes')y=4*Math.pow(.5+.5*Math.sin(x*.21+Math.sin(z*.025)*2),3)+n*2;
  else if(kind==='lake'||kind==='ocean')y=kind==='lake'?Math.max(-1,(n-.43)*24):-1;
  else if(fluid){y=(n-.45)*(w.style==='sun'?9:4);if(kind==='storm')y-=5*Math.exp(-r*r/900);}
  else if(kind==='boulder'||kind==='metal'||kind==='dust')y=(n-.35)*5;
  if(w.style==='rubble'||w.style==='bennu')y-=r*r*.00022;
  return y;
 }
 function color(x,z){const n=fbm(x*.07,z*.07,seed+500),y=height(x,z),r=Math.hypot(x,z);let c=base.map(v=>v*(.58+n*.55));
  if(w.style==='mars')c=mix([.3,.12,.07],[.8,.43,.24],n+y*.009);
  if(kind==='salt'&&r<18)c=mix(c,[.95,.97,.96],.88);
  if(['fracture','plume'].includes(kind)&&crack(x,z)<1.5)c=mix(c,w.id==='europa'?[.36,.15,.1]:[.1,.36,.47],.8);
  if(w.style==='io')c=mix([.5,.23,.045],[.88,.76,.28],n);
  if((kind==='lava'||kind==='volcano')&&r<7)c=w.style==='io'?[1,.17,.01]:c.map(v=>v*.3);
  if(w.style==='iapetus')c=c.map(v=>v*(x>0?.95:.25));
  if(w.style==='triton')c=mix(c,[.85,.6,.57],n*.6);
  if(kind==='lake'&&y<.15)c=[.075,.09,.075];
  if(kind==='ocean')c=[.025,.21,.3];
  if(w.style==='gas'){const angle=Math.atan2(z,x),spiral=Math.sin(r*.22+angle*4),bands=.5+.5*Math.sin(z*.18+n*3);c=mix(base.map(v=>v*.48),base.map(v=>Math.min(1,v*1.12)),bands);if(kind==='storm'&&r<40)c=mix(c,w.id==='jupiter'?[.75,.27,.16]:[.14,.3,.52],(.5+.3*spiral)*(1-r/40));if(kind==='hexagon'){const edge=r*Math.cos(((angle+Math.PI/6)%(Math.PI/3))-Math.PI/6);c=mix(c,[.17,.31,.29],Math.exp(-Math.pow((edge-30)/4,2))*.8);}}
  if(kind==='home')c=mix([.13,.22,.055],[.26,.43,.13],n);
  if(kind==='cap')c=mix(c,[.45,.18,.11],.6);
  if(w.style==='sun')c=mix([1,.12,.01],[1,.85,.22],n);
  if(kind==='metal')c=mix(c,[.43,.47,.52],n>.53?.5:0);
  return c;
 }
 return {seed,kind,fluid,height,color,craters};
}
export function flightStep(p,input,dt,terrain){
 const d=clamp(dt,0,.05),speed=input.fast?32:11,f=(input.forward||0),s=(input.right||0),length=Math.max(1,Math.hypot(f,s));
 p.x=clamp(p.x+(Math.sin(p.yaw)*f+Math.cos(p.yaw)*s)/length*speed*d,-155,155);
 p.z=clamp(p.z+(-Math.cos(p.yaw)*f+Math.sin(p.yaw)*s)/length*speed*d,-155,155);
 p.y=clamp(p.y+(input.up||0)*speed*d,terrain.height(p.x,p.z)+2,100);
 return p;
}
export const astralState=()=>({schema:1,encounters:[]});
export function validateAstral(a){
 if(!a||Object.keys(a).sort().join()!=='encounters,schema'||a.schema!==1||!Array.isArray(a.encounters)||a.encounters.length>WORLDS.reduce((n,w)=>n+w.sites.length,0))throw Error('The astral journal is malformed.');
 const ids=new Set();
 for(const e of a.encounters){const w=world(e?.world);if(!e||Object.keys(e).sort().join()!=='clock,note,site,world'||!w?.sites.some(s=>s.id===e.site)||!Number.isSafeInteger(e.clock)||e.clock<0||typeof e.note!=='string'||e.note.length>1200||ids.has(e.world+':'+e.site))throw Error('An astral encounter is malformed.');ids.add(e.world+':'+e.site);}
 return a;
}
export function rememberEncounter(a,id,siteId,clock,note=''){
 const w=world(id);if(!w?.sites.some(s=>s.id===siteId)||!Number.isSafeInteger(clock)||clock<0||typeof note!=='string'||note.length>1200)throw Error('Choose a world and landmark, with a reflection of at most 1,200 characters.');
 const entry=a.encounters.find(e=>e.world===id&&e.site===siteId);
 if(entry){entry.note=note;return entry;}
 const e={world:id,site:siteId,clock,note};a.encounters.push(e);return e;
}
export function encounterReading(id){const w=world(id);if(!w)throw Error('Choose a known world.');return {word:w.word,meaning:DICTIONARY.find(d=>d.word===w.word)?.gloss||'',phrase:encounterPhrase(id),native:toNative(encounterPhrase(id)),notes:score(w.word),association:'Authored Luma resonance; planetary names retain their quoted spelling.'};}
