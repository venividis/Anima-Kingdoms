// Bounded grid navigation with exact segment checks between waypoints.
// Routes are runtime caches, never saved authority or invented movement.
const routes=new WeakMap();
export function clearRoute(actor){routes.delete(actor);}
export function lineClear(s,a,b,legal){const d=Math.hypot(a.x-b.x,a.z-b.z),n=Math.max(1,Math.ceil(d/.35));for(let i=1;i<=n;i++)if(!legal(s,a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n,.35))return false;return true;}
class Heap{constructor(){this.a=[];}push(n){let a=this.a;a.push(n);let i=a.length-1;while(i){let p=(i-1)>>1;if(a[p].f<=n.f)break;a[i]=a[p];i=p;}a[i]=n;}pop(){const a=this.a,top=a[0],last=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let j=i*2+1;if(j+1<a.length&&a[j+1].f<a[j].f)j++;if(a[j].f>=last.f)break;a[i]=a[j];i=j;}a[i]=last;}return top;}get length(){return this.a.length;}}
export function waypoint(s,actor,target,legal,bounds){
 if(lineClear(s,actor,target,legal)){routes.delete(actor);return target;}
 const topology=s.mode+'|'+(s.rain.storage.bridge>=6)+'|'+s.structures.map(b=>b.id).join(',')+'|'+s.creation.instances.filter(e=>e.blueprint.kind==='structure').map(e=>e.id).join(',');let cached=routes.get(actor);
 if(cached&&cached.topology===topology&&Math.hypot(cached.target.x-target.x,cached.target.z-target.z)<2&&s.tick-cached.tick<240){if(!cached.path.length)return null;while(cached.path.length&&Math.hypot(actor.x-cached.path[0].x,actor.z-cached.path[0].z)<.5)cached.path.shift();if(cached.path.length&&lineClear(s,actor,cached.path[0],legal))return cached.path[0];}
 const unit=1,start={i:Math.round(actor.x),j:Math.round(actor.z)},goal={i:Math.round(target.x),j:Math.round(target.z)},key=(i,j)=>i+','+j,open=new Heap(),seen=new Map();
 const first={...start,g:0,f:Math.abs(start.i-goal.i)+Math.abs(start.j-goal.j),parent:null};open.push(first);seen.set(key(first.i,first.j),first);let end=null,expanded=0;
 while(open.length&&expanded++<6000){const n=open.pop();if(n!==seen.get(key(n.i,n.j)))continue;if(Math.hypot(n.i-target.x,n.j-target.z)<1.2&&lineClear(s,{x:n.i,z:n.j},target,legal)){end=n;break;}for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const i=n.i+dx,j=n.j+dz;if(i<bounds.minX||i>bounds.maxX||j<bounds.minZ||j>bounds.maxZ||!legal(s,i*unit,j*unit,.4))continue;const k=key(i,j),g=n.g+1;if(seen.has(k)&&seen.get(k).g<=g)continue;const next={i,j,g,f:g+Math.abs(i-goal.i)+Math.abs(j-goal.j),parent:n};seen.set(k,next);open.push(next);}}
 if(!end){routes.set(actor,{target:{...target},tick:s.tick,topology,path:[]});return null;}
 const path=[];while(end.parent){path.unshift({x:end.i,z:end.j});end=end.parent;}path.push({x:target.x,z:target.z});cached={target:{x:target.x,z:target.z},tick:s.tick,topology,path};routes.set(actor,cached);return path[0]||target;
}
