import {Geometry,transform,V} from './engine.js';
import {land,NODES,BRIDGE,GROUND,bridgeOpen} from './world.js';
export const C={stone:[.22,.31,.30],dark:[.12,.21,.22],pale:[.79,.80,.65],light:[.92,.88,.69],grass:[.23,.43,.34],teal:[.33,.67,.57],gold:[.98,.68,.28],water:[.33,.70,.67],pink:[.78,.64,.58]};
export const PEOPLE=[{id:'iria',name:'Iria',role:'BRIDGEWRIGHT',x:-6,z:-3,color:C.gold},{id:'vey',name:'Vey',role:'CARAVAN KEEPER',x:4,z:5,color:[.66,.36,.25]},{id:'oru',name:'Oru',role:'KEEPER OF SMALL THINGS',x:-22,z:8,color:C.teal},{id:'serein',name:'Serein',role:'INVITABLE SCRIPTED PARTNER',x:-11,z:15,color:C.pale}];
export const PLACES=[{id:'pavilion',name:'The Bell Pavilion',x:24,z:15,icon:'♧',description:'A little game inside a much larger world.'},{id:'overlook',name:'The Sleeper’s Ear',x:-34,z:22,icon:'✧',description:'The hill beneath you takes a breath.'},{id:'archive',name:'The Unwritten Archive',x: -12,z:-38,icon:'⌑',description:'Here, history belongs to what actually happened.'},{id:'orchard',name:'The First Orchard',x:14,z:-30,icon:'❧',description:'Every living branch keeps its own account of the rain.'}];
export const OBSTACLES=[{x:11,z:21,r:3.4},{x:21,z:28,r:3.2},{x:-21,z:23,r:3.1},{x:-6,z:28,r:2.6}];
function random(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};}
let rng=random(47307);const rr=(a,b)=>a+rng()*(b-a);
function tree(g,x,z,size=1){const y=0;g.cone([x,y,z],[x+.3*size,y+4*size,z],.37*size,.18*size,C.pale,7);for(let i=0;i<4;i++){let a=i*2.2+rr(0,.7),end=[x+Math.cos(a)*2.1*size,y+rr(4,6)*size,z+Math.sin(a)*2.1*size];g.cone([x,y+2.5*size,z],end,.15*size,.04*size,C.pale,6);g.sphere(...end,1.7*size,.7*size,1.5*size,[.35+rr(0,.1),.52+rr(0,.1),.40],7,4);g.sphere(end[0],end[1]-.25*size,end[2],.13*size,.22*size,.13*size,C.gold,6,4);}}
function arch(g,x,z,width=4,height=5,angle=0){const p=(a,y)=>[x+Math.cos(angle)*a,y,z+Math.sin(angle)*a];for(const side of[-1,1]){g.cone(p(side*width*.5,0),p(side*width*.4,height*.6),.24,.2,C.pale);g.cone(p(side*width*.4,height*.6),p(0,height),.2,.08,C.pale);}g.sphere(x,height-.45,z,.13,.35,.13,C.gold,6,5);}
function hut(g,x,z,size=1,rot=0){g.cone([x,0,z],[x,2.7*size,z],2.9*size,2.65*size,C.stone,10);g.cone([x,2.7*size,z],[x,4.6*size,z],3.6*size,.5*size,[.49,.58,.46],10);g.cone([x,4.6*size,z],[x+.2,5.8*size,z],.5*size,0,C.pale,7);g.box(x,1.2*size,z+2.6*size,1.35*size,2.4*size,.12,C.dark);g.box(x+1.4*size,1.8*size,z+2.25*size,.6*size,.75*size,.18,C.gold);for(let i=0;i<5;i++){let a=(i/5)*6.28;g.cone([x+Math.cos(a)*2.6*size,0,z+Math.sin(a)*2.6*size],[x+Math.cos(a)*2.7*size,2.8*size,z+Math.sin(a)*2.7*size],.09,.13,C.pale,5);}}
export function makeScene(r){
 rng=random(47307);
 const earth=new Geometry(),architecture=new Geometry(),green=new Geometry(),distant=new Geometry();
 for(const region of GROUND){for(let i=0;i<region.poly.length;i++){const a=region.poly[i],b=region.poly[(i+1)%region.poly.length];earth.tri([region.x,0,region.z],[b[0],0,b[1]],[a[0],0,a[1]],[.27+rr(0,.025),.38+rr(0,.025),.31]);}}
 // Deep island sides are separate geology below the walkable material surface.
 for(const n of[{x:0,z:14,rx:51,rz:34},{x:0,z:-33,rx:37,rz:23}])for(let i=0;i<64;i++){let a=i/64*6.283,b=(i+1)/64*6.283;let p=[n.x+Math.cos(a)*n.rx,-.03,n.z+Math.sin(a)*n.rz],q=[n.x+Math.cos(b)*n.rx,-.03,n.z+Math.sin(b)*n.rz];if((n.z===14&&(p[2]<-6||q[2]<-6))||(n.z<0&&(p[2]>-19||q[2]>-19)))continue;const depth=rr(10,22);earth.quad(p,[p[0]*.85,-depth,n.z+(p[2]-n.z)*.85],[q[0]*.85,-depth,n.z+(q[2]-n.z)*.85],q,[.17+rr(0,.07),.27,.27]);}
 // Actual cleft: no terrain spans the gap. Both cliff faces end on its banks.
 for(let x=-44;x<44;x+=3){earth.quad([x,0,-7],[x,-15,-7],[x+3,-17,-7],[x+3,0,-7],C.stone);if(Math.abs(x)<32)earth.quad([x,0,-19],[x+3,0,-19],[x+3,-16,-19],[x,-15,-19],C.stone);}
 for(let i=0;i<130;i++){let x=rr(-47,47),z=rr(-53,43);if(!land(x,z)||Math.abs(x)<5||OBSTACLES.some(o=>Math.hypot(x-o.x,z-o.z)<o.r+2)||Object.values(NODES).some(o=>Math.hypot(x-o.x,z-o.z)<3))continue;if(i<32)tree(green,x,z,rr(.55,1.25));else earth.sphere(x,.1,z,rr(.4,1.2),rr(.3,.7),rr(.4,1.3),C.stone,6,4);}
 for(let i=0;i<1100;i++){const x=rr(-48,48),z=rr(-53,44);if(!land(x,z)||Math.abs(x)<3||OBSTACLES.some(o=>Math.hypot(x-o.x,z-o.z)<o.r+1))continue;const h=rr(.2,.7),col=[rr(.29,.43),rr(.48,.61),rr(.35,.44)];green.tri([x-.13,0,z],[x+.04,h,z+.06],[x+.15,0,z],col);green.tri([x,0,z-.15],[x+.02,h*.8,z],[x,0,z+.15],col);if(i%19===0)green.sphere(x,h,z,.09,.09,.09,C.gold,5,3);}
 // Road mosaic and quiet village details.
 for(let z=-43;z<37;z+=1.2){if(z>=-19&&z<=-7)continue;for(let j=-1;j<=1;j++)architecture.box(j*1.5+rr(-.1,.1),.025,z+rr(-.1,.1),1.3,.07,.95,[.50,.54,.43]);}
 for(const o of OBSTACLES.slice(0,4))hut(architecture,o.x,o.z,o.r/3.4);
 arch(architecture,0,21,6,6);arch(architecture,0,-24,7,7);arch(architecture,-12,-38,6,8);
 // Bell pavilion: an open, enterable circular floor with a pale lattice canopy.
 architecture.cone([24,-.05,15],[24,.02,15],5.4,5.4,C.stone,24);architecture.ring(24,.12,15,4.6,.07,C.gold);
 for(let i=0;i<6;i++){let a=i/6*6.28,x=24+Math.cos(a)*4,z=15+Math.sin(a)*4;architecture.cone([x,0,z],[x,5,z],.13,.16,C.pale,7);architecture.cone([x,5,z],[24,7.5,15],.14,.06,C.pale,7);}architecture.cone([24,5.8,15],[24,6.7,15],.6,.2,C.gold,12);
 // Living spring, loom stones and destination bowls.
 for(const[id,n]of Object.entries(NODES)){architecture.cone([n.x,.02,n.z],[n.x,.38,n.z],id==='spring'?2:1.15,id==='spring'?1.7:1,C.pale,12);architecture.ring(n.x,.42,n.z,id==='spring'?1.7:1,.06,C.gold);if(['west','east'].includes(id))arch(architecture,n.x,n.z,2.3,2.6);}
 for(const x of[-3.2,3.2])for(const z of[-6,-20])architecture.cone([x,0,z],[x,2.8,z],.2,.08,C.pale);
 // Iria’s work bench; Vey’s crates; Oru’s listening chimes.
 architecture.box(-6,.85,-4,2,.18,1,C.pale); // patched with explicit color below
 for(const x of[-6.8,-5.2])architecture.cone([x,0,-4],[x,.8,-4],.1,.1,C.pale);
 for(let i=0;i<4;i++){architecture.box(5+i%2*.8,.4+Math.floor(i/2)*.7,6,.65,.65,.65,[.45,.39,.26]);}
 arch(architecture,-22,10,3,3.8);for(let i=0;i<4;i++)architecture.cone([-23+i*.6,2.1,10],[-23+i*.6,3.2-i*.13,10],.055,.055,C.gold,6);
 for(let i=0;i<18;i++){let x=rr(-34,35),z=rr(0,36);if(!land(x,z))continue;architecture.cone([x,0,z],[x,2.4,z],.055,.04,C.pale,5);architecture.sphere(x,2.3,z,.17,.24,.17,C.gold,7,4);}
 // A distant neck and ear suggest the city-beast without replacing real terrain.
 distant.sphere(7,-27,3,60,19,50,[.18,.30,.29],28,14);
 distant.cone([26,-8,-49],[39,14,-77],12,8,[.23,.35,.33],12);distant.sphere(39,17,-81,12,8,17,[.29,.40,.36],15,10);
 distant.cone([31,21,-78],[27,39,-84],3.5,.1,C.pale,9);distant.cone([45,21,-80],[49,35,-86],3,.1,C.pale,9);
 distant.sphere(31,18,-87,.3,.2,2,C.gold,7,5);
 for(let i=0;i<15;i++){let a=i/15*6.28,d=rr(100,170),x=Math.cos(a)*d,z=Math.sin(a)*d;distant.cone([x,-28,z],[x,rr(5,20),z],rr(3,8),rr(12,21),[.25,.41,.40],7);if(i%3===0)arch(distant,x,z,4,rr(10,20));}
 const bridge=new Geometry();for(let i=0;i<20;i++){let z=BRIDGE.near-(i+.5)*(BRIDGE.near-BRIDGE.far)/20;bridge.box(BRIDGE.x,.03,z,BRIDGE.halfWidth*2,.25,.56,[.69,.72,.55]);bridge.cone([-3.1,.6,z],[-2.9,1.4,z-.25],.055,.035,C.pale,5);bridge.cone([3.1,.6,z],[2.9,1.4,z-.25],.055,.035,C.pale,5);}for(const x of[-3,3])bridge.cone([x,1.15,BRIDGE.near],[x,1.15,BRIDGE.far],.055,.055,C.gold,6);
 const closed=new Geometry();for(const z of[-7.2,-18.8])for(let i=0;i<4;i++)closed.box(0,-.6-i*.45,z+(z>-10?-1:1)*i*.32,6.4-i*.7,.25,.5,C.pale);
 const body=new Geometry();body.cone([0,.55,0],[0,1.5,0],.42,.28,C.pale,8);body.sphere(0,1.72,0,.29,.33,.29,C.dark,10,7);body.cone([0,1.77,0],[0,2.12,-.12],.35,.02,C.teal,8);body.box(0,1.7,.25,.23,.11,.02,C.gold);body.cone([-.3,1.5,-.08],[-.48,.5,-.35],.12,.27,C.teal,5);body.cone([.3,1.5,-.08],[.48,.5,-.35],.12,.27,C.teal,5);
 const limb=new Geometry().cone([0,0,0],[0,.65,0],.105,.12,C.dark,7);
 const hand=new Geometry().sphere(0,0,0,.09,.12,.09,C.pale,7,5);
 const cart=new Geometry().box(0,1,0,2,.32,2.5,[.46,.40,.27]);cart.box(0,1.6,0,1.9,1.1,2.25,[.36,.39,.28]);for(const x of[-1.2,1.2])for(const z of[-.8,.8])cart.sphere(x,.55,z,.18,.52,.52,C.dark,9,6);cart.cone([-1,2.2,-1],[0,3,-1],.07,.07,C.pale);cart.cone([1,2.2,-1],[0,3,-1],.07,.07,C.pale);cart.box(0,2.8,0,2.4,.12,2.7,C.teal);for(let i=0;i<4;i++)cart.sphere((i%2-.5)*.65,2.2,(Math.floor(i/2)-.5)*.75,.3,.4,.32,C.gold,7,4);
 const pet=new Geometry().sphere(0,.4,0,.4,.36,.57,C.dark,10,6);pet.sphere(0,.62,.35,.28,.25,.25,C.dark,9,6);for(const x of[-.24,.24]){pet.sphere(x,.13,.27,.1,.11,.16,C.pale,6,4);pet.sphere(x,.13,-.3,.1,.11,.16,C.pale,6,4);pet.cone([x,.65,.33],[x*1.3,1,.28],.09,.005,C.dark,6);}pet.sphere(0,.46,.55,.14,.13,.08,C.gold,8,5);
 const orb=new Geometry().sphere(0,0,0,.13,.13,.13,[1,.86,.49],7,5),water=new Geometry().cone([0,0,0],[0,.035,0],1,1,C.water,24),shadow=new Geometry().cone([0,0,0],[0,.004,0],1,1,[.06,.14,.13],16);
 const orchard=new Geometry();for(const[x,z]of[[11,-30],[17,-31],[14,-34],[20,-36],[9,-36]])tree(orchard,x,z,1.2);
 const reeds=new Geometry();for(let i=0;i<90;i++){let x=rr(-29,-22),z=rr(1,6),h=rr(.8,2.1);reeds.cone([x,0,z],[x+.2,h,z],.026,.02,C.teal,4);reeds.cone([x+.2,h,z],[x+.2,h+.3,z],.06,.04,C.gold,5);}
 return{earth:r.mesh(earth),architecture:r.mesh(architecture),green:r.mesh(green),distant:r.mesh(distant),bridge:r.mesh(bridge),closed:r.mesh(closed),body:r.mesh(body),limb:r.mesh(limb),hand:r.mesh(hand),cart:r.mesh(cart),pet:r.mesh(pet),orb:r.mesh(orb),water:r.mesh(water),shadow:r.mesh(shadow),orchard:r.mesh(orchard),reeds:r.mesh(reeds)};
}
export function channelPoint(a,b,t){const A=NODES[a],B=NODES[b];return[A.x+(B.x-A.x)*t,.75+Math.sin(t*Math.PI)*(1.5+Math.hypot(A.x-B.x,A.z-B.z)*.075),A.z+(B.z-A.z)*t];}
export function channelGeometry(channels,preview=false){const g=new Geometry();for(const c of Object.values(channels)){for(let i=0;i<24;i++){const p=channelPoint(c.from,c.to,i/24),q=channelPoint(c.from,c.to,(i+1)/24);g.cone(p,q,.026+c.capacity*.009,.026+c.capacity*.009,preview?C.gold:c.owner==='agent'?C.teal:C.pale,5);}}return g;}
export function drawPerson(r,meshes,x,y,z,angle,t,walk,tint=[1,1,1]){const sin=Math.sin(t*9)*walk;const local=(lx,ly,lz)=>[x+Math.cos(angle)*lx+Math.sin(angle)*lz,y+ly,z-Math.sin(angle)*lx+Math.cos(angle)*lz];r.draw(meshes.shadow,transform(x,.02,z,.6,1,.45),{alpha:.25});r.draw(meshes.body,transform(x,y+Math.abs(sin)*.04,z,1,1,1,angle),{tint});for(const side of[-1,1]){let p=local(side*.18,.06+Math.max(0,side*sin)*.12,side*sin*.22);r.draw(meshes.limb,transform(...p,1,1,1,angle),{tint});let arm=local(side*.39,.91,-side*sin*.16);r.draw(meshes.limb,transform(...arm,.75,.75,.75,angle),{tint});let h=local(side*.4,.9,-side*sin*.17);r.draw(meshes.hand,transform(...h));}}
