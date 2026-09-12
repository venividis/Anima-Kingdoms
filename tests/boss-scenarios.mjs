// Reproducible legal-input policy experiments. Not a browser or human playtest.
import * as R from '../public/realm.js';
import fs from 'node:fs';
const results=[];
for(const policy of ['gale-circle','thread-rush']){
 const s=R.newRealm(policy==='gale-circle'?'gale':'thread');R.enterActivity(s,'boss');
 let deaths=0,oldDead=0,phases=new Set([1]);const limit=policy==='gale-circle'?18000:3600;
 for(let i=0;i<limit&&!s.bossDefeated;i++){
  const h=s.hero,b=s.enemies.find(x=>x.boss);phases.add(b.phase);
  if(policy==='gale-circle'){
   const target=s.enemies.filter(x=>x.hp>0).sort((a,c)=>Math.hypot(a.x-h.x,a.z-h.z)-Math.hypot(c.x-h.x,c.z-h.z))[0];
   const a=Math.atan2(h.x-b.x,h.z-b.z),dest={x:b.x+12*Math.sin(a+.28),z:b.z+12*Math.cos(a+.28)};
   R.tick(s,{move:[dest.x-h.x,dest.z-h.z],run:true,aim:Math.atan2(target.x-h.x,target.z-h.z),attack:i%110===0?'note':undefined});
  }else{
   const d=Math.hypot(b.x-h.x,b.z-h.z),warn=b.telegraph,guard=!!warn&&warn.kind==='sweep'&&warn.timer<24;
   R.tick(s,{move:d>2?[b.x-h.x,b.z-h.z]:[0,0],aim:Math.atan2(b.x-h.x,b.z-h.z),guard,attack:d<2.5&&!guard?'palm':undefined});
   if(s.hero.hp<40&&s.hero.items.tonic&&!s.hero.dead)R.consume(s,'tonic');
  }
  if(s.hero.dead&&!oldDead)deaths++;oldDead=s.hero.dead;
 }
 results.push({policy,defeated:s.bossDefeated,ticks:s.tick,seconds:s.tick/60,deaths,hp:s.hero.hp,tonicsRemaining:s.hero.items.tonic,phases:[...phases],bossHp:s.enemies.find(x=>x.boss).hp,materialResidual:R.materialLedger(s)});
}
const report={profile:R.PROFILE,evidence:'Two deterministic legal-input policies with full local state; no browser or human playtest.',results};
fs.writeFileSync(new URL('../docs/boss-scenarios.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
