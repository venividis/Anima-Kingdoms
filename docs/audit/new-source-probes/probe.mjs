import * as R from './realm.js';
import fs from 'node:fs';
const result=[];
for(const [id,corrupt] of [['missing-enemies',s=>delete s.enemies],['nonnumeric-y',s=>s.hero.y='bad'],['markup-discipline',s=>s.hero.discipline='<b>forged</b>'],['missing-workers',s=>delete s.workers]]){
 const raw=R.snapshot(R.newRealm());corrupt(raw);let accepted=false,error=null;
 try {const s=R.restore(raw);accepted=true;try{R.tick(s)}catch(e){error=e.message;}}catch(e){error=e.message;}
 result.push({id,accepted,followupError:error});
}
const qstate=R.newRealm();const q=R.quote(qstate,'wood','buy',1);q.total=0;let badQuote=false;try{R.trade(qstate,q);badQuote=true;}catch{}result.push({id:'modified-quote',accepted:badQuote});
const other=R.newRealm();let cross=false;try{R.trade(other,R.quote(qstate,'wood','buy',1));cross=true;}catch{}result.push({id:'cross-world-quote',accepted:cross});
const duel=R.newRealm();R.enterActivity(duel,'duel',true);const hx=duel.hero.x,bx=duel.enemies[0].x;R.tick(duel,{guard:true,move:[1,0],p2:{guard:true,move:[1,0]}});result.push({id:'p2-guard-speed',heroDX:duel.hero.x-hx,p2DX:duel.enemies[0].x-bx});
const dodge=R.newRealm();R.enterActivity(dodge,'duel',true);dodge.hero.angle=0;dodge.enemies[0].angle=0;const hz=dodge.hero.z,bz=dodge.enemies[0].z;R.tick(dodge,{dodge:true,p2:{dodge:true}});for(let i=0;i<24;i++)R.tick(dodge,{});result.push({id:'p2-dodge-displacement',heroDZ:dodge.hero.z-hz,p2DZ:dodge.enemies[0].z-bz});
console.log(JSON.stringify(result,null,2));fs.writeFileSync(new URL('./results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
