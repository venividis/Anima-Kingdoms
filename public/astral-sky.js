import {stellarField,skyGuides,starColor} from './sky-observer.js';
import {WORLDS} from './astral-data.js';
import {clamp} from './astral-model.js';

const DEG=Math.PI/180,TAU=Math.PI*2;
const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
export const direction=(az,alt)=>[Math.sin(az*DEG)*Math.cos(alt*DEG),Math.sin(alt*DEG),Math.cos(az*DEG)*Math.cos(alt*DEG)];
export const skyCamera=()=>({yaw:180,pitch:90,zoom:1,dome:true,labels:true});

// Equidistant projection stays finite at the zenith and lets the spirit turn
// through the entire celestial sphere. Dome mode fits one complete hemisphere.
export function skyProject(point,camera,width,height){
 const a=camera.yaw*DEG,p=camera.pitch*DEG;
 const forward=direction(camera.yaw,camera.pitch),right=[Math.cos(a),0,-Math.sin(a)],up=[-Math.sin(a)*Math.sin(p),Math.cos(p),-Math.cos(a)*Math.sin(p)];
 const vector=point.vector||direction(point.azimuth,point.altitude),z=clamp(dot(vector,forward),-1,1),angle=Math.acos(z);
 if(angle>Math.PI-.001||camera.dome&&angle>Math.PI/2+.00001)return null;
 const scale=(camera.dome?Math.min(width*.46,height*.385):Math.min(width,height)*.65)*camera.zoom/(Math.PI/2);
 const radial=angle<.000001?scale:angle*scale/Math.sqrt(Math.max(1e-12,1-z*z));
 const x=width/2+dot(vector,right)*radial,y=height*.48-dot(vector,up)*radial;
 return x>=-30&&x<=width+30&&y>=-30&&y<=height+30?{x,y}:null;
}

export function skyPaths(sky){
 const planets=sky.bodies.map(b=>({...b,id:b.name.toLowerCase(),type:'world',vector:direction(b.azimuth,b.altitude)}));
 // A visible route glyph, explicitly not an asteroid ephemeris. Choose a point
 // on the existing ecliptic away from the Sun so the gate stays easy to find.
 const ecliptic=skyGuides(sky)[0].points,sun=planets.find(b=>b.id==='sun');
 const gate=ecliptic.reduce((best,p)=>Math.abs(dot(direction(p.azimuth,p.altitude),sun.vector))<Math.abs(dot(direction(best.azimuth,best.altitude),sun.vector))?p:best);
 return [...planets,{...gate,id:'asteroid-paths',name:'Asteroid paths',type:'gate',color:'#c6abc9',vector:direction(gate.azimuth,gate.altitude)}];
}
export function pathWorlds(id){
 if(id==='asteroid-paths')return WORLDS.filter(w=>w.kind==='asteroid'||w.id==='ceres');
 return WORLDS.filter(w=>w.id===id||w.kind==='moon'&&w.parent===id);
}

export class AstralSky {
 constructor(canvas,sky){
  this.canvas=canvas;this.c=canvas.getContext('2d');this.sky=sky;
  this.stars=stellarField(sky).map(s=>({...s,vector:direction(s.azimuth,s.altitude),color:starColor(s.star.bv)}));
  this.paths=skyPaths(sky);this.guides=skyGuides(sky).map(g=>({...g,points:g.points.map(p=>({...p,vector:direction(p.azimuth,p.altitude)}))}));
  const brightest=new Map();for(const s of this.stars){const old=brightest.get(s.star.constellation);if(!old||s.star.mag<old.star.mag)brightest.set(s.star.constellation,s);}
  this.constellations=[...brightest.values()];this.targets=[];this.dirty=true;
 }
 draw(camera,selected){
  const width=Math.max(1,this.canvas.clientWidth||innerWidth),height=Math.max(1,this.canvas.clientHeight||innerHeight),dpr=Math.min(globalThis.devicePixelRatio||1,2);
  const signature=[width,height,dpr,camera.yaw,camera.pitch,camera.zoom,camera.dome,camera.labels,selected?.id].join(':');
  if(signature===this.signature)return;this.signature=signature;
  const c=this.c;this.canvas.width=Math.round(width*dpr);this.canvas.height=Math.round(height*dpr);c.setTransform(dpr,0,0,dpr,0,0);
  const bg=c.createRadialGradient(width*.5,height*.44,0,width*.5,height*.44,Math.max(width,height)*.8);bg.addColorStop(0,'#101b32');bg.addColorStop(.55,'#060d1b');bg.addColorStop(1,'#01040c');c.fillStyle=bg;c.fillRect(0,0,width,height);
  const project=p=>skyProject(p,camera,width,height),radius=Math.min(width*.46,height*.385);
  c.save();if(camera.dome){c.beginPath();c.arc(width/2,height*.48,radius,0,TAU);c.clip();}
  const path=(points)=>{c.beginPath();let last=null;for(const p of points){const q=project(p);if(!q){last=null;continue;}if(!last||Math.hypot(q.x-last.x,q.y-last.y)>width*.3)c.moveTo(q.x,q.y);else c.lineTo(q.x,q.y);last=q;}c.stroke();};
  // Soft light follows the galactic equator from the same Luma sky model.
  for(let i=0;i<this.guides[2].points.length;i+=2){const q=project(this.guides[2].points[i]);if(!q)continue;const r=(32+Math.sin(i*.27)*9)*Math.min(1.3,width/650+.4),light=c.createRadialGradient(q.x,q.y,0,q.x,q.y,r);light.addColorStop(0,'rgba(138,157,205,.038)');light.addColorStop(.4,'rgba(111,139,192,.018)');light.addColorStop(1,'rgba(104,133,190,0)');c.fillStyle=light;c.fillRect(q.x-r,q.y-r,r*2,r*2);}
  this.targets=[];
  for(const s of this.stars){const q=project(s);if(!q)continue;const r=clamp((6.7-s.star.mag)*.23,.35,2.4);c.globalAlpha=clamp((8.2-s.star.mag)/6,.17,1);c.fillStyle=s.color;c.beginPath();c.arc(q.x,q.y,r,0,TAU);c.fill();if(s.star.mag<1.7){const halo=c.createRadialGradient(q.x,q.y,0,q.x,q.y,r*4);halo.addColorStop(0,s.color);halo.addColorStop(1,'transparent');c.globalAlpha=.1;c.fillStyle=halo;c.fillRect(q.x-r*4,q.y-r*4,r*8,r*8);}this.targets.push({...q,id:s.star.id,type:'star',record:s,radius:8});}
  c.globalAlpha=1;
  if(camera.labels){c.lineWidth=.7;c.strokeStyle='#a8a0cc38';c.setLineDash([3,8]);path(this.guides[0].points);c.setLineDash([]);c.font='10px system-ui';c.fillStyle='#9badc17a';c.textAlign='center';const placed=[];for(const s of this.constellations){const q=project(s);if(!q||q.y<100||q.y>height-150||placed.some(p=>Math.hypot(p.x-q.x,p.y-q.y)<95))continue;c.fillText(s.star.constellation.toUpperCase(),q.x,q.y+24);placed.push(q);}}
  c.lineWidth=.8;c.strokeStyle='#a1d3d13d';path(Array.from({length:181},(_,i)=>({azimuth:i*2,altitude:0})));
  for(const [az,name]of [[0,'N'],[90,'E'],[180,'S'],[270,'W']]){const q=project({azimuth:az,altitude:camera.pitch<0?-3:3});if(q){c.font='11px system-ui';c.fillStyle='#acd4cf';c.textAlign='center';c.fillText(name,q.x,q.y);}}
  this.positions=[];
  for(const p of this.paths){const q=project(p);if(!q)continue;const active=selected?.id===p.id,r=p.id==='sun'?7:p.id==='moon'?6:p.type==='gate'?5:3.3;const halo=c.createRadialGradient(q.x,q.y,0,q.x,q.y,24);halo.addColorStop(0,p.color||'#e7dbc8');halo.addColorStop(1,'transparent');c.fillStyle=halo;c.globalAlpha=.16;c.fillRect(q.x-24,q.y-24,48,48);c.globalAlpha=1;c.fillStyle=p.color||'#e7dbc8';c.beginPath();if(p.type==='gate'){c.moveTo(q.x,q.y-7);c.lineTo(q.x+7,q.y);c.lineTo(q.x,q.y+7);c.lineTo(q.x-7,q.y);c.closePath();c.strokeStyle=p.color;c.stroke();}else{c.arc(q.x,q.y,r,0,TAU);c.fill();}if(active){c.strokeStyle='#def7fa';c.lineWidth=1;c.beginPath();c.arc(q.x,q.y,19,0,TAU);c.stroke();}this.positions.push({...q,...p});this.targets.push({...q,id:p.id,type:p.type,record:p,radius:24});}
  if(selected?.type==='star'){const q=project(selected.record);if(q){c.strokeStyle='#bbdaee';c.beginPath();c.arc(q.x,q.y,12,0,TAU);c.stroke();}}
  c.restore();return true;
 }
 pick(x,y){return [...this.targets].reverse().filter(p=>Math.hypot(p.x-x,p.y-y)<p.radius).sort((a,b)=>(a.type==='star')-(b.type==='star')||Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0]||null;}
}
