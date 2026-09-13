import {BRIDGE as ORCHARD_BRIDGE, land} from './world.js';

// This shared commons is a separate authoritative place. Device saves never fund it.
export const RULES_VERSION = 'anima-shared-1';
export const MATERIALS = Object.freeze(['wood','stone','ore','food','herb','crystal']);
export const ITEMS = Object.freeze([...MATERIALS,'marks']);
export const BOUNDS = Object.freeze({xMin:-55,xMax:55,zMin:-62,zMax:48});
export const BRIDGE = Object.freeze({...ORCHARD_BRIDGE});
export const SPAWN = Object.freeze({x:0,z:16});
export const OBSTACLES = Object.freeze([
  {x:11,z:21,r:3.2},{x:21,z:28,r:3},{x:-21,z:23,r:3},{x:-6,z:28,r:2.4},
].map(Object.freeze));
export const NODE_DEFINITIONS = Object.freeze([
  {id:'grove',name:'Fallen boughs',item:'wood',x:-9,z:17,initial:160},
  {id:'quarry',name:'Basalt quarry',item:'stone',x:9,z:17,initial:140},
  {id:'reeds',name:'Silverleaf reeds',item:'herb',x:-12,z:5,initial:60},
  {id:'fruit',name:'Orchard fruit',item:'food',x:12,z:5,initial:100},
  {id:'ore',name:'Star-iron seam',item:'ore',x:-20,z:-32,initial:50},
  {id:'crystal',name:'Singing crystals',item:'crystal',x:20,z:-32,initial:30},
].map(Object.freeze));
export const PROJECT_DEFINITIONS = Object.freeze([
  {id:'crossing',name:'The Joined Span',x:0,z:-3,required:{wood:8,stone:8}},
  {id:'beacon',name:'The Concord Beacon',x:0,z:-28,required:{wood:6,stone:4,ore:2,crystal:2}},
].map(p=>Object.freeze({...p,required:Object.freeze(p.required)})));
export const MARKET = Object.freeze({x:6,z:20,name:'The Commons Exchange',
  bid:Object.freeze({wood:1,stone:1,ore:3,food:1,herb:2,crystal:5}),
  ask:Object.freeze({wood:2,stone:2,ore:4,food:2,herb:3,crystal:7})});
export const COMMAND_SCOPES = Object.freeze(['cosmos.start','cosmos.strike','cosmos.advance','cosmos.reclaim','cosmos.use','move','gather','offer.create','offer.fill','offer.cancel','project.contribute','market.buy','market.sell','chat.send','blueprint.publish','blueprint.remove','luma.speak','gift.offer','gift.accept','gift.decline','gift.cancel']);
export const SPEED = 7;
export const emptyBag = () => Object.fromEntries(ITEMS.map(item=>[item,0]));
export function traversable(bridgeOpen,x,z) {
  if(!Number.isFinite(x)||!Number.isFinite(z)||x<BOUNDS.xMin+.3||x>BOUNDS.xMax-.3||z<BOUNDS.zMin+.3||z>BOUNDS.zMax-.3)return false;
  const bridge = bridgeOpen&&z<=BRIDGE.near&&z>=BRIDGE.far&&Math.abs(x-BRIDGE.x)<=BRIDGE.halfWidth-.3;
  return (land(x,z)||bridge)&&!OBSTACLES.some(o=>Math.hypot(x-o.x,z-o.z)<o.r+.3);
}
export function moveIntent(player,bridgeOpen,dx,dz,elapsedMs) {
  const length=Math.hypot(dx,dz),scale=SPEED*Math.max(0,Math.min(250,elapsedMs))/1000/Math.max(1,length);
  const vx=dx*scale,vz=dz*scale,steps=Math.max(1,Math.ceil(Math.hypot(vx,vz)/.12));
  for(let i=0;i<steps;i++){
    if(traversable(bridgeOpen,player.x+vx/steps,player.z))player.x+=vx/steps;
    if(traversable(bridgeOpen,player.x,player.z+vz/steps))player.z+=vz/steps;
  }
}
