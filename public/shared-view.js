import {Renderer, Geometry, transform, project} from './engine.js';
import {makeScene, drawPerson, C} from './scene.js';
import {GROUND} from './world.js';

const COLORS = {wood:[.49,.72,.46], stone:[.66,.75,.78], ore:[.68,.60,.86],
  food:[.93,.66,.34], herb:[.40,.80,.66], crystal:[.48,.79,.93]};

/** Rendering consumes the server view. It never writes player positions or stock. */
export class SharedView {
  constructor(canvas) {
    this.canvas = canvas;
    this.yaw = .12;
    this.pitch = .59;
    this.distance = 23;
    this.overview = false;
    this.center = {x:0,z:16};
    this.people = new Map();
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      this.r = new Renderer(canvas);
      this.base = makeScene(this.r);
      const gem = new Geometry().cone([0,0,0],[0,1.2,0],.48,0,[1,1,1],6);
      gem.cone([0,0,0],[0,-.3,0],.48,0,[.65,.75,.77],6);
      this.gem = this.r.mesh(gem);
      this.ring = this.r.mesh(new Geometry().ring(0,.05,0,1,.025,[1,1,1],40));
      const pier = new Geometry();
      pier.box(0,.05,0,2.6,.3,2.6,C.stone);
      for (let i=0;i<6;i++) {
        const a=i*Math.PI/3,x=Math.sin(a)*1.5,z=Math.cos(a)*1.5;
        pier.cone([x,0,z],[x,2.2,z],.12,.07,C.pale,7);
        pier.sphere(x,2.3,z,.11,.15,.11,C.gold,7,5);
      }
      this.pier = this.r.mesh(pier);
    } catch {
      // A failed WebGL allocation may have claimed the context; replace its canvas.
      this.r = null;
      const replacement = canvas.cloneNode();
      canvas.replaceWith(replacement);
      this.canvas = replacement;
      this.c = replacement.getContext('2d');
    }
  }
  project(x,y,z) {
    if (this.r?.vp) return project([x,y,z],this.r.vp,innerWidth,innerHeight);
    const scale=this.scale||10,dx=x-this.center.x,dz=z-this.center.z;
    return {x:innerWidth*.46+(dx*Math.cos(this.yaw)-dz*Math.sin(this.yaw))*scale,
      y:innerHeight*.54+(dx*Math.sin(this.yaw)+dz*Math.cos(this.yaw))*scale*.64-y*scale,
      visible:true};
  }
  render(state,t,dt,journey) {
    const desired = this.overview ? {x:0,z:-4} : state?.you || {x:0,z:16};
    const follow = 1-Math.exp(-dt*7);
    this.center.x += (desired.x-this.center.x)*follow;
    this.center.z += (desired.z-this.center.z)*follow;
    if (!this.r) { this.renderCanvas(state,t,journey); return; }
    const r=this.r,b=this.base,x=this.center.x,z=this.center.z;
    const len=this.overview?79:this.distance, pitch=this.overview?1.12:this.pitch;
    const target=[x+(innerWidth>900?2:0),.8,z];
    const eye=[x+Math.sin(this.yaw)*len*Math.cos(pitch),1.8+Math.sin(pitch)*len,z+Math.cos(this.yaw)*len*Math.cos(pitch)];
    const time=this.reduced?0:t;
    r.begin(eye,target,time);
    r.draw(b.distant,transform(0,Math.sin(time*.24)*.12,0));
    r.draw(b.earth); r.draw(b.architecture); r.draw(b.green,transform(),{sway:this.reduced?0:.004});
    r.draw(b.orchard,transform(),{tint:[.9,1.06,.93],sway:this.reduced?0:.005});
    r.draw(b.reeds,transform(),{sway:this.reduced?0:.006});
    r.draw(state?.world?.bridgeOpen?b.bridge:b.closed);
    for (const n of state?.nodes||[]) {
      const color=COLORS[n.item]||C.gold;
      r.draw(this.ring,transform(n.x,.06,n.z,1.7,1,1.7),{tint:color,alpha:.65,glow:.4});
      for(let i=0;i<Math.min(4,n.remaining);i++) {
        const a=i*2.39+time*.08,spread=i===0?0:.58;
        r.draw(this.gem,transform(n.x+Math.sin(a)*spread,.7+Math.sin(time*1.2+i)*.07,n.z+Math.cos(a)*spread,.45,.45,.45,a),{tint:color,glow:.22});
      }
    }
    for (const p of state?.projects||[]) {
      r.draw(this.pier,transform(p.x,0,p.z,.8,.8,.8),{tint:p.complete?[1,1.1,.85]:[.65,.79,.79]});
      if(p.complete)r.draw(b.orb,transform(p.x,2.9+Math.sin(time)*.13,p.z,1.8,1.8,1.8),{tint:C.gold,glow:1.1});
      else r.draw(this.ring,transform(p.x,.1,p.z,2.6,1,2.6),{tint:C.gold,alpha:.7,glow:.5});
    }
    const all=state?[...state.players.filter(p=>p.id!==state.you.id),state.you]:[];
    for(const a of all) {
      let drawn=this.people.get(a.id);
      if(!drawn){drawn={x:a.x,z:a.z,angle:Math.PI};this.people.set(a.id,drawn);}
      const dx=a.x-drawn.x,dz=a.z-drawn.z,d=Math.hypot(dx,dz);
      if(d>.035)drawn.angle=Math.atan2(dx,dz);
      drawn.x+=dx*follow;drawn.z+=dz*follow;
      const mine=a.id===state.you.id,color=mine?[1.12,1.02,.87]:[.73,1.1,1.14];
      drawPerson(r,b,drawn.x,state.world?.bridgeOpen&&drawn.z<-7&&drawn.z>-19?.16:0,drawn.z,drawn.angle,time,d>.04?.55:0,color);
      r.draw(b.shadow,transform(drawn.x,.025,drawn.z,.65,1,.5),{alpha:.32});
      if(mine)r.draw(this.ring,transform(drawn.x,.035,drawn.z,.8,1,.8),{tint:C.gold,glow:.4,alpha:.7});
    }
    for(const id of this.people.keys())if(!all.some(p=>p.id===id))this.people.delete(id);
    if(journey)r.draw(this.ring,transform(journey.x,.08,journey.z,.75,1,.75),{tint:[.64,1,.83],glow:.8});
    for(let i=0;i<(this.reduced?0:20);i++) {
      const px=Math.sin(i*47.1)*36,pz=Math.cos(i*31.7)*31+8,py=1.3+Math.sin(time*.5+i)*.6;
      r.draw(b.orb,transform(px,py,pz,.13,.13,.13),{glow:1,alpha:.6});
    }
  }
  renderCanvas(state,t,journey) {
    const c=this.c,canvas=this.canvas;
    canvas.width=innerWidth;canvas.height=innerHeight;
    this.scale=this.overview?Math.min(innerWidth/120,innerHeight/105):Math.max(8,Math.min(20,340/this.distance));
    const bg=c.createLinearGradient(0,0,0,innerHeight);bg.addColorStop(0,'#234b57');bg.addColorStop(1,'#102e37');c.fillStyle=bg;c.fillRect(0,0,innerWidth,innerHeight);
    const poly=(points,color)=>{c.beginPath();points.forEach(([x,z],i)=>{const p=this.project(x,0,z);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=color;c.fill();c.strokeStyle='#c3d7b23c';c.stroke();};
    for(const g of GROUND)poly(g.poly,'#43694f');
    if(state?.world?.bridgeOpen)poly([[-3.2,-7],[3.2,-7],[3.2,-19],[-3.2,-19]],'#cbb587');
    const dot=(x,y,z,r,color)=>{const p=this.project(x,y,z);c.beginPath();c.ellipse(p.x,p.y,r*this.scale,r*this.scale*.65,0,0,Math.PI*2);c.fillStyle=color;c.fill();};
    for(const o of state?.world?.obstacles||[]) {const p=this.project(o.x,1,o.z);c.fillStyle='#1f3940';c.fillRect(p.x-o.r*this.scale,p.y-o.r*this.scale*.64,o.r*2*this.scale,o.r*1.28*this.scale);}
    for(const n of state?.nodes||[]) {dot(n.x,0,n.z,1.7,'#102d3a');dot(n.x,.4,n.z,n.remaining?.8:.3,{wood:'#78aa79',stone:'#a7babe',ore:'#b6a1d6',food:'#edbf7d',herb:'#8cd6b4',crystal:'#99dbe8'}[n.item]);}
    for(const p of state?.projects||[]) {dot(p.x,0,p.z,2,'#28444b');dot(p.x,.5,p.z,p.complete?1.1:.6,p.complete?'#eacb8c':'#739890');}
    for(const a of state?.players||[])if(a.id!==state.you.id) {dot(a.x,0,a.z,.6,'#17343a');dot(a.x,1,a.z,.45,'#8dd7c8');}
    if(state?.you){dot(state.you.x,0,state.you.z,.7,'#102934');dot(state.you.x,1,state.you.z,.48,'#f1d5a1');}
    if(journey){const p=this.project(journey.x,0,journey.z);c.strokeStyle='#9eeccc';c.beginPath();c.arc(p.x,p.y,10,0,Math.PI*2);c.stroke();}
  }
}
