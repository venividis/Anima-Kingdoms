import {Renderer,Geometry,transform,multiply} from './engine.js';
import {compile} from './creation.js';
const rgb = hex => [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);

// The same part renderer is used in the editor, rehearsal, and inhabited world.
export class CreationMeshes {
  constructor(r){
    this.r=r;
    const white=[1,1,1];
    this.mesh={
      box:r.mesh(new Geometry().box(0,0,0,1,1,1,white)),
      orb:r.mesh(new Geometry().sphere(0,0,0,.5,.5,.5,white,16,10)),
      spire:r.mesh(new Geometry().cone([0,-.5,0],[0,.5,0],.5,0,white,10)),
      ring:r.mesh(new Geometry().ring(0,0,0,.45,.05,white,40))
    };
    this.halo=r.mesh(new Geometry().ring(0,0,0,1,.022,white,64));
  }
  draw(b,x=0,y=0,z=0,yaw=0,t=0,opts={}){
    const root=transform(x,y,z,opts.scale||1,opts.scale||1,opts.scale||1,yaw);
    for(let i=0;i<b.parts.length;i++){
      const p=b.parts[i],wing=b.kind==='creature'&&Math.abs(p.x)>.65?Math.sin(t*5+p.x)*.1:0;
      const m=multiply(root,transform(p.x,p.y+wing,p.z,p.w,p.h,p.d,p.yaw*Math.PI/180));
      this.r.draw(this.mesh[p.shape],m,{tint:opts.tint||rgb(p.color),glow:p.role==='light'?.45:opts.selected===i?.22:0,alpha:opts.alpha??1});
      if(opts.selected===i)this.r.draw(this.halo,multiply(root,transform(p.x,p.y+p.h*.55,p.z,Math.max(p.w,p.d)*.65,1,Math.max(p.w,p.d)*.65)),{tint:[1,.85,.55],glow:.8});
    }
  }
  instances(s,t){
    if(s.mode==='world')for(const e of s.creation.instances){
      if(e.id===s.creation.equipped)continue;
      const receiver=s.kingdoms?.receivers.find(r=>r.id===e.id);this.draw(e.blueprint,e.x,0,e.z,e.yaw*Math.PI/180,t,{alpha:receiver?.status==='dormant'&&receiver.kind==='bridge'?.15:receiver?.kind==='gate'&&receiver.status!=='dormant'?.15:1});if(receiver?.status==='active')this.r.draw(this.halo,transform(e.x,.22,e.z,2,1,2),{tint:[.5,1,.72],glow:.9});
      if(e.cargo)this.r.draw(this.mesh.box,transform(e.x,.8,e.z+.5,.4,.4,.4),{tint:[.96,.78,.4]});
      if(e.blueprint.kind==='creature'&&e.energy>0)this.r.draw(this.halo,transform(e.x,.04,e.z,.8,1,.8),{tint:[.25,.8,.8],alpha:.5});
    }
    if(s.mode==='world'&&s.kingdoms){
      for(const l of s.kingdoms.links){const a=s.creation.instances.find(e=>e.id===l.source),b=s.creation.instances.find(e=>e.id===l.target);for(let i=0;i<16;i++){const f=i/15;this.r.draw(this.mesh.orb,transform(a.x+(b.x-a.x)*f,.35,a.z+(b.z-a.z)*f,.07,.07,.07),{tint:[.4,.8,.7],glow:.4,alpha:.6});}}
      for(const p of s.kingdoms.packets){const a=s.creation.instances.find(e=>e.id===p.source),b=s.creation.instances.find(e=>e.id===p.target),f=Math.max(0,Math.min(1,(s.kingdoms.clock-p.start)/(p.due-p.start)));this.r.draw(this.mesh.orb,transform(a.x+(b.x-a.x)*f,.7,a.z+(b.z-a.z)*f,.2,.2,.2),{tint:[.8,1,.7],glow:1});}
      const o=s.kingdoms.order;this.r.draw(this.halo,transform(o.x,.12,o.z,1.3,1,1.3),{tint:o.paid?[1,.77,.4]:[.5,.7,.7],glow:.5});for(let i=0;i<o.delivered;i++)this.r.draw(this.mesh.box,transform(o.x+(i?1:-1)*.6,.35,o.z,.7,.7,.7),{tint:[.6,.7,.7]});if(o.paid)this.r.draw(this.mesh.spire,transform(o.x,1+Math.sin(t*3)*.12,o.z,.6,1.6,.6),{tint:[1,.72,.32],glow:1});
    }
    if(['world','boss'].includes(s.mode)){
      const held=s.creation.instances.find(e=>e.id===s.creation.equipped);
      if(held)this.draw(held.blueprint,s.hero.x+Math.cos(s.hero.angle)*.6,.25+s.hero.y,s.hero.z-Math.sin(s.hero.angle)*.6,s.hero.angle,t,{scale:.6});
      for(const w of s.creation.waves)this.r.draw(this.halo,transform(w.x,.3,w.z,w.radius,1,w.radius),{tint:w.voice==='force'?[1,.48,.32]:w.voice==='ward'?[.48,.7,1]:[.45,1,.75],glow:1,alpha:Math.max(.08,1-w.radius/w.maximum)});
      if(s.creation.ward>0)this.r.draw(this.halo,transform(s.hero.x,.1,s.hero.z,1.1,1,1.1),{tint:[.4,.72,1],glow:.8});
    }
    if(s.mode==='trial'){
      const a=s.activity;
      for(let i=0;i<a.blueprint.course.length;i++){
        const p=a.blueprint.course[i],done=a.touched.includes(i),next=a.blueprint.order==='any'||a.touched.length===i;
        this.r.draw(this.halo,transform(-83+p.x,.15,-43+p.z,1.25,1,1.25),{tint:done?[.25,.6,.45]:next?[.95,.78,.4]:[.35,.48,.6],glow:next?.8:.2});
        if(!done)this.r.draw(this.mesh.spire,transform(-83+p.x,1.2+Math.sin(t*2+i)*.1,-43+p.z,.3,1.3,.3),{tint:next?[1,.8,.4]:[.4,.65,1],glow:.6});
      }
    }
  }
}

export class BlueprintView {
  constructor(canvas){this.canvas=canvas;this.r=new Renderer(canvas);this.shapes=new CreationMeshes(this.r);this.yaw=.6;this.pitch=.5;this.zoom=1;this.selected=-1;this.draft=null;this.visible=false;
    let drag=null;canvas.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;this.yaw-=(e.clientX-drag.x)*.008;this.pitch=Math.max(.12,Math.min(1.3,this.pitch+(e.clientY-drag.y)*.008));drag={x:e.clientX,y:e.clientY};};canvas.onpointerup=()=>drag=null;canvas.onpointercancel=()=>drag=null;
    canvas.onwheel=e=>{e.preventDefault();this.zoom=Math.max(.4,Math.min(2.3,this.zoom+e.deltaY*.001));};
    const frame=ms=>{if(this.visible&&this.draft){const b=this.draft,extent=Math.max(3,...b.parts.map(p=>Math.max(Math.abs(p.x)+p.w,Math.abs(p.z)+p.d,p.y+p.h))),distance=extent*2.2*this.zoom,c=[0,Math.min(2,extent*.2),0],eye=[Math.sin(this.yaw)*Math.cos(this.pitch)*distance,c[1]+Math.sin(this.pitch)*distance,Math.cos(this.yaw)*Math.cos(this.pitch)*distance];const rect=canvas.getBoundingClientRect();if(rect.width&&rect.height){this.r.begin(eye,c,ms/1000,false,[rect.width,rect.height]);this.r.draw(this.shapes.halo,transform(0,-.03,0,extent*.7,1,extent*.7),{tint:[.15,.4,.5],glow:.15});this.shapes.draw(b,0,0,0,0,ms/1000,{selected:this.selected});}}requestAnimationFrame(frame);};requestAnimationFrame(frame);
  }
  set(b,index=-1){this.draft=b;this.selected=index;}
}
