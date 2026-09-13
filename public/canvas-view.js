/* A hardware-independent cartographic renderer of the actual simulation. */
import * as R from './realm.js';
import {inscriptionCurves} from './luma/geometry.js';
import {toNative} from './luma/language.js';
const tau=Math.PI*2;
export function paintBlueprint(c,b,project,x=0,z=0,yaw=0,alpha=1,cameraYaw=0){
 c.save();c.globalAlpha=alpha;const root={x,z,yaw:yaw*180/Math.PI};
 for(const p of b.parts){const o=R.Creation.point(root,p),v=project(o.x,p.y,o.z),unit=project(1,0,0),zero=project(0,0,0),scale=Math.hypot(unit.x-zero.x,(unit.y-zero.y)/.68);c.save();c.translate(v.x,v.y);c.rotate(-o.yaw-cameraYaw);c.fillStyle=p.color;c.strokeStyle='#d1f9ea55';c.lineWidth=1;const w=Math.max(2,p.w*scale),h=Math.max(2,(p.d*.68+p.h*.4)*scale);if(p.role==='light'){c.shadowColor=p.color;c.shadowBlur=10;}if(p.shape==='box'){c.fillRect(-w/2,-h/2,w,h);c.strokeRect(-w/2,-h/2,w,h);}else if(p.shape==='spire'){c.beginPath();c.moveTo(0,-h/2);c.lineTo(w/2,h/2);c.lineTo(-w/2,h/2);c.closePath();c.fill();}else{c.beginPath();c.ellipse(0,0,w/2,h/2,0,0,tau);if(p.shape==='ring'){c.lineWidth=2;c.strokeStyle=p.color;c.stroke();}else c.fill();}c.restore();}
 if(b.luma){
  const co=Math.cos(yaw),si=Math.sin(yaw);c.lineWidth=.8;
  for(const curve of inscriptionCurves(b.luma)){c.strokeStyle='aeiou'.includes(curve.letter)?'#9cd7d499':'#e7c58c99';c.beginPath();curve.points.forEach(([px,py,pz],i)=>{const q=project(x+px*co+pz*si,py,z-px*si+pz*co);i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y);});c.stroke();}
  const q=project(x,3.2,z);c.fillStyle='#f3dca8';c.font='22px "Luma Origin Prefinal", serif';c.textAlign='center';c.fillText(toNative(b.luma.word),q.x,q.y);
 }
 c.restore();
}
export class CanvasWorldView{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.yaw=0;this.pitch=.5;this.distance=22;this.atlas=false;this.reduced=false;this.placement=null;this.cx=0;this.cz=0;this.scale=15;this.fallback=true;}
 rebuild(){}setPreview(p){this.preview=p;}
 project(x,y,z){const dx=x-this.cx,dz=z-this.cz,co=Math.cos(this.yaw),si=Math.sin(this.yaw),px=this.canvas.width/2+(dx*co-dz*si)*this.scale,py=this.canvas.height*.5+(dx*si+dz*co)*this.scale*.68-y*this.scale*.65;return{x:px,y:py,visible:px>-100&&py>-100&&px<this.canvas.width+100&&py<this.canvas.height+100};}
 groundPoint(x,y){const dx=(x-this.canvas.width/2)/this.scale,dz=(y-this.canvas.height*.5)/(this.scale*.68),co=Math.cos(this.yaw),si=Math.sin(this.yaw);return{x:this.cx+dx*co+dz*si,z:this.cz-dx*si+dz*co};}
 render(s,t){const canvas=this.canvas,c=this.c;if(canvas.width!==innerWidth)canvas.width=innerWidth;if(canvas.height!==innerHeight)canvas.height=innerHeight;this.scale=this.atlas?Math.min(innerWidth/118,innerHeight/95):Math.max(9,Math.min(22,360/this.distance));this.cx=this.atlas?0:s.hero.x;this.cz=this.atlas?-4:s.hero.z;c.clearRect(0,0,canvas.width,canvas.height);
 const poly=(points,color)=>{c.beginPath();points.forEach(([x,z],i)=>{const p=this.project(x,0,z);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=color;c.fill();c.strokeStyle='#9fd5b43b';c.lineWidth=2;c.stroke();};
 if(s.mode==='world')for(const g of R.Rain.GROUND)poly(g.poly,'#284b44');else{const a=R.ARENAS[s.mode];poly(Array.from({length:64},(_,i)=>[a.x+Math.cos(i/64*tau)*a.r,a.z+Math.sin(i/64*tau)*a.r]),'#324d50');}
 const dot=(x,y,z,r,color)=>{const p=this.project(x,y,z);c.fillStyle=color;c.beginPath();c.arc(p.x,p.y,r*this.scale,0,tau);c.fill();};
 if(s.mode==='world'){
  if(R.Rain.bridgeOpen(s.rain))poly([[-3.2,-7],[3.2,-7],[3.2,-19],[-3.2,-19]],'#d8bd80');
  for(const l of R.LANDMARKS){dot(l.x,0,l.z,1.4,'#4a7063');dot(l.x,.3,l.z,.4,'#e4c98e');}
  for(const r of R.RESOURCES)dot(r.x,.3,r.z,1.3,{wood:'#649575',stone:'#7f949b',herb:'#9ebdaa',ore:'#a5aad7',food:'#d8ab78'}[r.item]);
  for(const o of R.obstacles(s).filter(o=>o.shape!=='box')){const p=this.project(o.x,1,o.z);c.fillStyle='#152f32';c.fillRect(p.x-o.r*this.scale,p.y-o.r*this.scale*.68,o.r*2*this.scale,o.r*1.36*this.scale);}
  for(const l of s.kingdoms.links){const a=s.creation.instances.find(e=>e.id===l.source),b=s.creation.instances.find(e=>e.id===l.target),p=this.project(a.x,.6,a.z),q=this.project(b.x,.6,b.z);c.strokeStyle='#70dbc66b';c.setLineDash([4,6]);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();c.setLineDash([]);}
  for(const e of s.creation.instances){const r=s.kingdoms.receivers.find(r=>r.id===e.id);paintBlueprint(c,e.blueprint,this.project.bind(this),e.x,e.z,e.yaw*Math.PI/180,r?.status==='dormant'&&r.kind==='bridge'?.2:r?.kind==='gate'&&r.status!=='dormant'?.2:1,this.yaw);if(e.cargo)dot(e.x,2,e.z,.28,'#f2c570');}
  for(const p of s.kingdoms.packets){const a=s.creation.instances.find(e=>e.id===p.source),b=s.creation.instances.find(e=>e.id===p.target),f=Math.max(0,Math.min(1,(s.kingdoms.clock-p.start)/(p.due-p.start)));dot(a.x+(b.x-a.x)*f,.8,a.z+(b.z-a.z)*f,.2,'#d5ffe4');}
  const o=s.kingdoms.order;dot(o.x,0,o.z,o.paid?1.7:.9,o.paid?'#e1ac64':'#829f9c');if(o.paid){dot(o.x,1+Math.sin(t*3)*.1,o.z,.4,'#ffdf94');}
  for(const w of s.workers)dot(w.x,.7,w.z,.45,'#b5ceab');dot(s.pet.x,.7,s.pet.z,.32,'#b6a6e4');
  if(s.civilization.active){const cv=s.civilization,carrier=cv.courier;
   const label=(x,z,text,color='#e6d5ad')=>{const p=this.project(x,1.7,z);c.font='11px system-ui';c.textAlign='center';c.fillStyle=color;c.fillText(text,p.x,p.y);c.textAlign='start';};
   dot(R.Civilization.DEPOT.x,.1,R.Civilization.DEPOT.z,1,'#bb9963');label(0,23,`Depot ${cv.depot.food}/32`);
   for(const h of cv.households){const home=R.Civilization.HOMES.find(a=>a.id===h.id),color=h.hunger>=3?'#de8874':h.hunger?'#d4b06a':'#8cc7a0';dot(home.x,.1,home.z,.85,color);label(home.x,home.z,`${home.name.split(' ')[0]} · ${h.pantry} food`,color);for(const[dx,dz]of[[-1.1,.75],[1.1,.75],[0,1.65]])dot(home.x+dx,.7,home.z+dz,.3,'#e8d9b9');for(let i=0;i<h.pantry;i++)dot(home.x-.45+i*.45,.4,home.z,.12,'#f4d28b');}
   dot(carrier.x,.8,carrier.z,.43,'#f4ca99');if(carrier.cargo)dot(carrier.x,1.4,carrier.z,.22,'#edbd65');label(carrier.x,carrier.z,carrier.cargo?`Tavi · ${carrier.cargo.count} food`:'Tavi');
   if(carrier.cargo){const destination=R.Civilization.HOMES.find(h=>h.id===carrier.cargo.household),p=this.project(carrier.x,.1,carrier.z),q=this.project(destination.x,.1,destination.z);c.strokeStyle='#e4c68865';c.setLineDash([3,7]);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();c.setLineDash([]);}
   for(const[item,rule]of Object.entries(R.Civilization.PATCHES))label(rule.x,rule.z,`${s.reserve[item]}/${rule.capacity} ${item}`,'#b9d3ae');
  }
 }
 if(s.mode!=='world')for(const o of R.obstacles(s)){const p=this.project(o.x,0,o.z);c.fillStyle='#172f36';c.strokeStyle='#bed8c166';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y,o.r*this.scale,o.r*this.scale*.68,0,0,tau);c.fill();c.stroke();const top=this.project(o.x,1.2,o.z);c.fillStyle='#56716e';c.beginPath();c.ellipse(top.x,top.y,o.r*this.scale,o.r*this.scale*.68,0,0,tau);c.fill();c.stroke();}
 for(const e of s.enemies)if(e.hp>0&&!e.dead){dot(e.x,.6,e.z,e.boss?1.8:.65,e.team==='amber'?'#f0c675':'#cc7973');const p=this.project(e.x,.6,e.z);c.strokeStyle='#f4ddd0';c.lineWidth=2;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x+Math.sin(e.angle-this.yaw)*14,p.y+Math.cos(e.angle-this.yaw)*10);c.stroke();}
 for(const w of s.creation.waves){const p=this.project(w.x,.1,w.z);c.strokeStyle='#8ae8d588';c.beginPath();c.ellipse(p.x,p.y,w.radius*this.scale,w.radius*this.scale*.68,0,0,tau);c.stroke();}
 for(const b of s.bolts)dot(b.x,1,b.z,.2,'#9fdcff');
 if(s.mode==='trial')for(let i=0;i<s.activity.blueprint.course.length;i++){const p=s.activity.blueprint.course[i];dot(-83+p.x,.1,-43+p.z,1,s.activity.touched.includes(i)?'#5b977c':'#edc879');}
 if(s.mode==='ctf')for(const f of s.activity.flags)dot(f.x,1,f.z,.6,f.team==='amber'?'#ffd986':'#64dfdc');
 if(s.range)for(const target of s.range.targets)if(!target.hit)dot(target.x,1,target.z,.6,'#e6b770');
 if(this.placement){const p=this.placement;paintBlueprint(c,p.blueprint,this.project.bind(this),p.x,p.z,p.yaw*Math.PI/180,.55,this.yaw);}
 dot(s.hero.x,0,s.hero.z,.65,'#081b25');dot(s.hero.x,1+s.hero.y,s.hero.z,.48,'#fff1c8');const hp=this.project(s.hero.x,1+s.hero.y,s.hero.z);c.strokeStyle='#fdf4d2';c.lineWidth=2;c.beginPath();c.moveTo(hp.x,hp.y);c.lineTo(hp.x+Math.sin(s.hero.angle-this.yaw)*16,hp.y+Math.cos(s.hero.angle-this.yaw)*11);c.stroke();
 if(this.astralPose){const pose=this.astralPose,p=this.project(s.hero.x,pose.spiritY+1,s.hero.z);c.save();c.strokeStyle='#c3f1ff';c.globalAlpha=.65;c.lineWidth=1.4;c.beginPath();c.moveTo(hp.x,hp.y);c.quadraticCurveTo(p.x+20,(hp.y+p.y)/2,p.x,p.y);c.stroke();c.fillStyle='#cbf6ff';c.beginPath();c.ellipse(p.x,p.y,7,15,0,0,tau);c.fill();c.beginPath();c.arc(p.x,p.y-21,6,0,tau);c.fill();c.restore();}
 if(s.kingdoms.journey){const p=this.project(s.kingdoms.journey.x,0,s.kingdoms.journey.z);c.strokeStyle='#a7efce';c.beginPath();c.arc(p.x,p.y,9,0,tau);c.stroke();}
 c.fillStyle='#b7d0c3';c.font='12px system-ui';c.fillText('CARTOGRAPHIC VIEW · SAME WORLD & RULES',20,canvas.height-18);
 }
 map(canvas,s){const c=canvas.getContext('2d');c.clearRect(0,0,220,220);c.fillStyle='#162f34';c.fillRect(0,0,220,220);const arena=R.ARENAS[s.mode],scale=arena?3.2:1.5,cx=arena?.x||0,cz=arena?.z||0,p=(x,z)=>[110+(x-cx)*scale,115+(z-cz)*scale];
 if(arena){c.fillStyle='#486d64';c.beginPath();c.arc(110,115,arena.r*scale,0,tau);c.fill();for(const o of R.obstacles(s)){c.fillStyle='#172c31';c.beginPath();c.arc(...p(o.x,o.z),o.r*scale,0,tau);c.fill();}}
 else for(const g of R.Rain.GROUND){c.beginPath();g.poly.forEach(([x,z],i)=>i?c.lineTo(...p(x,z)):c.moveTo(...p(x,z)));c.closePath();c.fillStyle='#527965';c.fill();}
 for(const e of s.enemies)if(e.hp>0&&!e.dead){c.fillStyle=e.team==='amber'?'#efc888':'#ed8e83';c.beginPath();c.arc(...p(e.x,e.z),3,0,tau);c.fill();}
 if(s.activity?.flags)for(const f of s.activity.flags){c.fillStyle=f.team==='amber'?'#ffdb81':'#81efea';const[x,y]=p(f.x,f.z);c.fillRect(x-3,y-3,6,6);}
 c.fillStyle='#ffe8b5';c.beginPath();c.arc(...p(s.hero.x,s.hero.z),4,0,tau);c.fill();}

}
export class CanvasBlueprintView{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.visible=false;this.draft=null;this.selected=-1;this.yaw=.25;canvas.onpointerdown=()=>this.yaw+=.35;const frame=()=>{if(this.visible&&this.draft){const {width,height}=canvas.getBoundingClientRect();if(canvas.width!==Math.max(1,Math.floor(width)))canvas.width=Math.max(1,Math.floor(width));if(canvas.height!==Math.max(1,Math.floor(height)))canvas.height=Math.max(1,Math.floor(height));const c=this.c;c.clearRect(0,0,width,height);const b=this.draft,extent=Math.max(4,...b.parts.map(p=>Math.max(Math.abs(p.x)+p.w,Math.abs(p.z)+p.d,p.y+p.h))),scale=Math.min(width,height)/(extent*2.4);paintBlueprint(c,b,(x,y,z)=>({x:width/2+x*scale,y:height*.66+z*scale*.68-y*scale*.65}),0,0,this.yaw);c.fillStyle='#aac5b9';c.font='12px system-ui';c.fillText('Canvas blueprint · click to rotate',15,25);}requestAnimationFrame(frame);};requestAnimationFrame(frame);}
 set(b,index=-1){this.draft=b;this.selected=index;}
}
