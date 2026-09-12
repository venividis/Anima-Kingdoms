import * as R from './realm.js';
const C=R.Creation;

// Lab issuance belongs solely to this disposable copy. It cannot be promoted,
// saved as a world or merged; only its blueprint and factual metrics can return.
export function makeRehearsal(raw){
 const def=C.compile(raw),s=R.newRealm('thread');const issued=C.emptyBag();
 for(const k of C.GOODS){issued[k]=def.cost[k];s.pack[k]+=issued[k];}
 s.hero.hp=55;
 let position=def.blueprint.kind==='structure'?{x:0,z:-13}:{x:2,z:12};
 if(def.blueprint.kind==='structure'){s.hero.x=0;s.hero.z=-5;}
 if(def.blueprint.kind==='structure'){try{C.placement(s,def.blueprint,position.x,position.z,0,R.creationContext());}catch{position={x:0,z:0};s.hero.x=0;s.hero.z=16;}}const e=R.create(s,def.blueprint,position.x,position.z,0);
 // A single known target; its decision rule remains in the normal runtime.
 s.enemies[0].x=2;s.enemies[0].z=7;s.enemies[0].homeX=2;s.enemies[0].homeZ=7;s.enemies[0].nextAI=1e9;
 if(def.blueprint.kind==='creature')C.feed(s,e.id);
 if(def.blueprint.kind==='relic')C.equip(s,e.id);
 if(def.blueprint.kind==='instrument')C.perform(s,e.id);
 if(def.blueprint.kind==='trial')R.enterTrial(s,e.id);
 return {world:s,instance:e.id,issued,initial:{hp:s.hero.hp,enemyHp:s.enemies.reduce((n,e)=>n+e.hp,0),pack:{...s.pack},residual:R.materialLedger(s)},kind:def.blueprint.kind,name:def.blueprint.name,blueprint:def.blueprint,method:'living rehearsal',scenario:'orchard-bench-1',notes:0,travel:0,last:{x:s.hero.x,z:s.hero.z},firstImpactTick:null,targetDefeatTick:null,attacksStarted:0,lastAction:null};
}
export function observe(lab){const s=lab.world,target=(s.worldEnemies||s.enemies).find(e=>e.id==='gloom1');lab.notes+=s.creation.notes.length;lab.travel+=Math.hypot(s.hero.x-lab.last.x,s.hero.z-lab.last.z);lab.last={x:s.hero.x,z:s.hero.z};if(target&&target.hp<34&&lab.firstImpactTick===null)lab.firstImpactTick=s.tick;if(target&&target.hp<=0&&lab.targetDefeatTick===null)lab.targetDefeatTick=s.tick;if(s.hero.action&&s.hero.action.id!==lab.lastAction){lab.attacksStarted++;lab.lastAction=s.hero.action.id;}}
export function report(lab){const s=lab.world,c=s.creation.instances.find(e=>e.id===lab.instance);return {name:lab.name,kind:lab.kind,scenario:lab.scenario,method:lab.method,blueprint:structuredClone(lab.blueprint),firstImpactTick:lab.firstImpactTick,targetDefeatTick:lab.targetDefeatTick,attacksStarted:lab.attacksStarted,ticks:s.tick,damage:Math.max(0,lab.initial.enemyHp-(s.worldEnemies||s.enemies).reduce((n,e)=>n+e.hp,0)),healing:Math.max(0,s.hero.hp-lab.initial.hp),travel:Number(lab.travel.toFixed(2)),energyRemaining:c?.energy||0,deliveries:s.creation.memories.filter(m=>m.text.includes('carried bundle')).length,notes:lab.notes,trialResult:s.activity?.winner||null,farBank:s.mode==='world'&&s.hero.bank==='far'&&R.Rain.land(s.hero.x,s.hero.z),ledgerDelta:Object.fromEntries(C.GOODS.map(k=>[k,R.materialLedger(s)[k]-lab.initial.residual[k]]))};}
export function measure(raw,ticks=1800){
 const lab=makeRehearsal(raw),s=lab.world;lab.method='deterministic state-informed policy';
 for(let i=0;i<ticks;i++){
   const target=s.enemies.find(e=>e.hp>0);let input={};
   if(lab.kind==='relic'&&target)input={aim:Math.atan2(target.x-s.hero.x,target.z-s.hero.z),attack:'creation'};
   if(lab.kind==='structure')input={move:[0,-1]};
   if(lab.kind==='trial'&&!s.activity.winner){const a=s.activity,p=a.blueprint.course.find((p,j)=>!a.touched.includes(j));if(p)input={move:[-83+p.x-s.hero.x,-43+p.z-s.hero.z],run:true};}
   R.tick(s,input);observe(lab);
   if(s.activity?.winner)break;
 }
 return report(lab);
}
