/* The Dream Foundry. Pure-data blueprints; no eval, remote code, or asset minting.
   A published instance owns an immutable blueprint copy and its actual materials. */
export const SCHEMA = 'awe-blueprint-1';
export const KINDS = ['creature', 'relic', 'structure', 'instrument', 'trial'];
export const SHAPES = ['box', 'orb', 'spire', 'ring'];
export const ROLES = ['ornament', 'solid', 'walkway', 'light'];
export const GOODS = ['wood', 'stone', 'ore', 'food', 'herb', 'crystal'];
export const TRIGGERS = ['always', 'threat', 'hurt', 'hungry'];
export const ACTIONS = ['follow', 'guard', 'harvest', 'orbit', 'rest'];
const clone = x => structuredClone(x);
const uuid = () => globalThis.crypto?.randomUUID?.() || `creation-${Date.now()}-${Math.random()}`;
const finite = (x, a, b) => typeof x === 'number' && Number.isFinite(x) && x >= a && x <= b;
const integer = (x, a, b) => Number.isInteger(x) && x >= a && x <= b;
const exact = (o, keys) => o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).sort().join() === [...keys].sort().join();
export const emptyBag = () => Object.fromEntries(GOODS.map(k => [k, 0]));
const fail = text => { throw Error(text); };
export const state = () => ({schema:SCHEMA, drafts:[], instances:[], equipped:null, ward:0, wardUntil:0, waves:[], notes:[], serial:0, memories:[], grants:{agent:false}, proposals:[], trials:[]});
const part = (shape,x,y,z,w,h,d,color='#61e1d2',role='ornament',yaw=0) => ({shape,x,y,z,w,h,d,color,role,yaw});

export function seed(kind='creature') {
  if (!KINDS.includes(kind)) fail('Choose a supported creation kind.');
  const b={schema:SCHEMA,id:uuid(),revision:1,parent:null,name:'Untitled creation',kind,material:'wood',power:4,reach:4,tempo:4,verb:'bolt',rules:[{when:'threat',do:'guard'},{when:'always',do:'follow'}],resource:'wood',score:[0,4,7,12,7,4,2,0],beat:24,voice:'mend',course:[{x:-8,z:6},{x:-8,z:-6},{x:0,z:-10},{x:8,z:-6},{x:8,z:6}],seconds:60,order:'sequence',parts:[]};
  if(kind==='creature') {b.name='Lanternwing';b.parts=[part('orb',0,1,0,1,1.1,1.3),part('orb',0,1.6,.5,.7,.6,.7,'#f5ce83'),part('box',-.95,1.3,0,1.7,.08,.8,'#58baf5','ornament',-18),part('box',.95,1.3,0,1.7,.08,.8,'#58baf5','ornament',18),part('spire',0,2,.55,.25,.7,.25,'#f5ce83','light'),part('orb',-.18,1.7,.8,.12,.12,.12,'#ffffff','light'),part('orb',.18,1.7,.8,.12,.12,.12,'#ffffff','light')];}
  if(kind==='relic'){b.name='The Far Note';b.material='ore';b.parts=[part('box',0,.8,0,.16,1.6,.16,'#d8b877'),part('ring',0,1.8,0,1.2,.08,1.2,'#61e1d2','light'),part('spire',0,2.1,0,.45,.9,.45,'#75baff','light')];}
  if(kind==='structure'){b.name='Rainstep Span';b.parts=Array.from({length:5},(_,i)=>part('box',0,.08,(i-2)*3,3,.16,3,'#b9cbd3','walkway'));b.parts.push(part('spire',-1.35,.85,-6,.15,1.4,.15,'#70ebd7','light'),part('spire',1.35,.85,6,.15,1.4,.15,'#70ebd7','light'));}
  if(kind==='instrument'){b.name='An Orchard Remembered';b.material='herb';b.parts=[part('box',0,.18,0,2,.35,1.2,'#9ca8d1'),...Array.from({length:8},(_,i)=>part('spire',(i-3.5)*.23,.8+i*.08,0,.12,1+i*.16,.12,'#61e1d2','light'))];}
  if(kind==='trial'){b.name='A Letter Written in Footsteps';b.parts=[part('ring',0,1.5,0,2.4,.2,2.4,'#7ab8fc','light'),part('spire',-1,1,0,.2,2,.2,'#f5ce83'),part('spire',1,1,0,.2,2,.2,'#f5ce83')];}
  return b;
}

export function compile(raw) {
  const keys=['schema','id','revision','parent','name','kind','material','power','reach','tempo','verb','rules','resource','score','beat','voice','course','seconds','order','parts'];
  if(!exact(raw,keys)||raw.schema!==SCHEMA) fail('This is not a complete Dream Foundry blueprint.');
  if(typeof raw.id!=='string'||!raw.id.length||raw.id.length>100||!integer(raw.revision,1,10000)||!(raw.parent===null||typeof raw.parent==='string'&&raw.parent.length<=120))fail('Invalid blueprint lineage.');
  if(typeof raw.name!=='string'||raw.name.trim().length<1||raw.name.length>64||/[<>\x00-\x1f]/.test(raw.name))fail('Use a name of 1–64 plain-text characters.');
  if(!KINDS.includes(raw.kind)||!GOODS.includes(raw.material)||raw.material==='food')fail('Unknown creation kind or material.');
  if(![raw.power,raw.reach,raw.tempo].every(n=>integer(n,1,8))||raw.power+raw.reach+raw.tempo>12)fail('Power, reach and tempo share twelve points; each needs at least one.');
  if(!['bolt','wave','mend','ward'].includes(raw.verb)||!['mend','ward','force'].includes(raw.voice)||!['wood','stone','food','herb','ore'].includes(raw.resource))fail('Unknown behavior.');
  if(!Array.isArray(raw.rules)||raw.rules.length<1||raw.rules.length>4||raw.rules.some(r=>!exact(r,['when','do'])||!TRIGGERS.includes(r.when)||!ACTIONS.includes(r.do)))fail('Use one to four typed creature rules.');
  if(!Array.isArray(raw.score)||raw.score.length!==8||raw.score.some(n=>!integer(n,0,12))||!integer(raw.beat,12,60))fail('A score needs eight pitches from 0 to 12 and a beat of 12–60 ticks.');
  if(!Array.isArray(raw.course)||raw.course.length<3||raw.course.length>12||raw.course.some(p=>!exact(p,['x','z'])||!finite(p.x,-12,12)||!finite(p.z,-12,12))||!integer(raw.seconds,15,180)||!['sequence','any'].includes(raw.order))fail('A trial needs 3–12 reachable sigils, 15–180 seconds and a valid order.');
  if(!Array.isArray(raw.parts)||raw.parts.length<1||raw.parts.length>32)fail('Build with 1–32 parts.');
  for(const p of raw.parts){
    if(!exact(p,['shape','x','y','z','w','h','d','color','role','yaw'])||!SHAPES.includes(p.shape)||!ROLES.includes(p.role)||typeof p.color!=='string'||!/^#[0-9a-f]{6}$/i.test(p.color))fail('A part has an unsupported shape, role or color.');
    if(!finite(p.x,-8,8)||!finite(p.z,-8,8)||!finite(p.y,0,8)||![p.w,p.h,p.d].every(n=>finite(n,.05,8))||!finite(p.yaw,-180,180))fail('Parts must fit inside the Foundry size limits.');
    if(p.role!=='ornament'&&p.role!=='light'&&raw.kind!=='structure')fail('Only structures have solid walls and walking surfaces.');
    if(['solid','walkway'].includes(p.role)&&p.shape!=='box')fail('Collision parts use boxes so geometry and boundaries agree.');
    if(p.role==='walkway'&&(Math.abs(p.y+p.h/2-.16)>.001||p.h>.32))fail('Walking decks have a top at 0.16; keep their center/height aligned.');
  }
  const b=clone(raw);b.name=b.name.trim();
  const volume=b.parts.reduce((n,p)=>n+p.w*p.h*p.d*(p.shape==='orb'?.53:p.shape==='ring'?.1:p.shape==='spire'?.33:1),0);
  const cost=emptyBag();cost[b.material]=Math.max(1,Math.ceil(volume/3+b.parts.length/8));
  if(b.kind==='creature'){cost.wood+=2;cost.herb+=1;}
  if(b.kind==='relic')cost.ore+=2;
  if(b.kind==='instrument')cost.wood+=2;
  if(b.kind==='trial')cost.stone+=2;
  if(b.kind==='structure')cost.stone+=1;
  const move={name:b.name,startup:36-b.tempo*3,active:2,recovery:14+b.power*2,damage:4+b.power*3,reach:2+b.reach*2,cost:10+b.power*2+b.reach,arc:Math.PI*2,verb:b.verb,projectile:b.verb==='bolt',speed:10+b.tempo*1.5,custom:true};
  return {blueprint:b,cost,volume,move,energyCost:8+b.power,creatureSpeed:1.6+b.tempo*.3,range:3+b.reach,cooldown:100-b.tempo*7};
}

export function branch(raw){const b=compile(raw).blueprint;b.parent=b.id+'@'+b.revision;b.id=uuid();b.revision=1;b.name=(b.name+' · variation').slice(0,64);return b;}
export function saveDraft(s,raw){const b=compile(raw).blueprint;const c=s.creation,i=c.drafts.findIndex(d=>d.id===b.id);if(i>=0){b.revision=Math.max(b.revision,c.drafts[i].revision+1);if(b.revision>10000)fail('Branch this blueprint to begin a new revision lineage.');}if(i<0&&c.drafts.length>=24)fail('The shelf holds 24 blueprints. Export or remove one before adding another.');if(i>=0)c.drafts[i]=b;else c.drafts.push(b);remember(s,'Saved blueprint: '+b.name);return b;}
export function remember(s,text){s.creation.serial++;s.creation.memories.push({id:s.creation.serial,tick:s.tick,text});if(s.creation.memories.length>160)s.creation.memories.shift();}
export function invested(s,k){return s.creation?.instances.reduce((n,e)=>n+e.investment[k]+(e.cargo?.item===k?e.cargo.count:0),0)||0;}
export function point(e,p){const a=e.yaw*Math.PI/180,c=Math.cos(a),v=Math.sin(a);return{x:e.x+p.x*c+p.z*v,z:e.z-p.x*v+p.z*c,y:p.y,yaw:(e.yaw+p.yaw)*Math.PI/180,hx:p.w/2,hz:p.d/2};}
export function inside(x,z,o,r=0){const c=Math.cos(o.yaw),v=Math.sin(o.yaw),dx=x-o.x,dz=z-o.z,lx=dx*c-dz*v,lz=dx*v+dz*c;return Math.hypot(Math.max(0,Math.abs(lx)-o.hx),Math.max(0,Math.abs(lz)-o.hz))<=r;}
export function surfaces(s,exclude=null){return(s.creation?.instances||[]).filter(e=>e.id!==exclude&&e.blueprint.kind==='structure').flatMap(e=>e.blueprint.parts.filter(p=>p.role==='walkway').map(p=>({...point(e,p),owner:e.id})));}
export function surface(s,x,z,exclude=null){return surfaces(s,exclude).some(p=>inside(x,z,p));}
export function obstacles(s){return(s.creation?.instances||[]).filter(e=>e.blueprint.kind==='structure').flatMap(e=>e.blueprint.parts.filter(p=>p.role==='solid'&&p.y-p.h/2<2.2&&p.y+p.h/2>0).map(p=>({...point(e,p),r:Math.hypot(p.w,p.d)/2,shape:'box',owner:e.id})));}
export function segmentBox(x,z,nx,nz,o){const c=Math.cos(o.yaw),v=Math.sin(o.yaw),p=[(x-o.x)*c-(z-o.z)*v,(x-o.x)*v+(z-o.z)*c],d=[(nx-x)*c-(nz-z)*v,(nx-x)*v+(nz-z)*c],extent=[o.hx,o.hz];let lo=0,hi=1;for(let k=0;k<2;k++){if(Math.abs(d[k])<1e-12){if(Math.abs(p[k])>extent[k])return null;}else{let a=(-extent[k]-p[k])/d[k],b=(extent[k]-p[k])/d[k];if(a>b)[a,b]=[b,a];lo=Math.max(lo,a);hi=Math.min(hi,b);if(lo>hi)return null;}}return lo;}

export function placement(s,raw,x,z,yaw,ctx){
  const def=compile(raw);if(s.mode!=='world'||s.hero.dead||s.hero.hp<=0)fail('Return to a living world body before creating.');
  if(!finite(x,-55,55)||!finite(z,-62,48)||!finite(yaw,-180,180)||Math.hypot(x-s.hero.x,z-s.hero.z)>16)fail('Place your creation within sixteen steps of your body.');
  const e={id:'preview',x,z,yaw,blueprint:def.blueprint};
  if(def.blueprint.kind!=='structure'){if(!ctx.legal(s,x,z,.8))fail('Choose clear, solid ground.');}
  else {
    const decks=def.blueprint.parts.filter(p=>p.role==='walkway').map(p=>point(e,p));
    if(!ctx.baseGround(x,z)&&!decks.some(p=>[-1,0,1].some(a=>[-1,0,1].some(b=>ctx.baseGround(p.x+a*p.hx,p.z+b*p.hz)))))fail('Anchor the structure to the original island ground.');
    const bodies=[s.hero,...s.workers,s.pet,...s.creation.instances.filter(e=>e.blueprint.kind==='creature')];
    for(const p of def.blueprint.parts.filter(p=>p.role==='solid')){const o=point(e,p);if((ctx.protectedPlaces||[]).some(a=>inside(a.x,a.z,o,2)))fail('Keep clear access around resources, landmarks and safety landings.');if(bodies.some(a=>inside(a.x,a.z,o,.8)))fail('A person or companion occupies a solid part. Move or redesign it.');if(ctx.obstacles(s).some(a=>inside(a.x,a.z,o,a.r||.8)))fail('A solid part overlaps existing construction.');}
  }
  return def;
}
export function instantiate(s,raw,x,z,yaw,ctx){
  if(s.creation.instances.length>=16)fail('This valley currently supports sixteen authored instances. Reclaim one first.');
  const def=placement(s,raw,x,z,yaw,ctx);for(const k of GOODS)if(s.pack[k]<def.cost[k])fail(`You need ${def.cost[k]} ${k}; you have ${s.pack[k]}.`);
  for(const k of GOODS)s.pack[k]-=def.cost[k];
  const e={id:uuid(),blueprint:def.blueprint,investment:clone(def.cost),x,z,yaw,home:{x,z},bank:z<-19?'far':'near',energy:0,cargo:null,task:'arrived',cooldown:0,cycle:0,performance:null,age:0};s.creation.instances.push(e);remember(s,`Brought ${e.blueprint.name} into the world.`);return e;
}
export function reclaim(s,id,ctx){
  if(s.mode!=='world')fail('Return to the world to reclaim a creation.');const e=s.creation.instances.find(e=>e.id===id);if(!e)fail('That instance no longer exists.');
  const distance=e.blueprint.kind==='structure'?Math.min(...e.blueprint.parts.map(p=>{const o=point(e,p);return Math.max(0,Math.hypot(s.hero.x-o.x,s.hero.z-o.z)-Math.hypot(o.hx,o.hz));})):Math.hypot(e.x-s.hero.x,e.z-s.hero.z);if(distance>8)fail('Stand within eight steps of a visible part to reclaim it.');
  if(e.cargo||e.performance)fail('Finish this delivery or performance before reclaiming it.');
  if(e.blueprint.kind==='structure')for(const a of[s.hero,...s.workers,s.pet,...s.creation.instances.filter(a=>a.id!==id)])if(surfaces(s).some(p=>p.owner===id&&inside(a.x,a.z,p))&&!ctx.originalWalkable(s,a.x,a.z)&&!surface(s,a.x,a.z,id))fail('Another body or creation depends on this surface. Move it to an island first.');
  for(const k of GOODS)s.pack[k]+=e.investment[k];s.creation.instances=s.creation.instances.filter(a=>a!==e);if(s.creation.equipped===id)s.creation.equipped=null;remember(s,`Reclaimed the actual materials of ${e.blueprint.name}.`);
}
export function feed(s,id){const e=s.creation.instances.find(e=>e.id===id&&e.blueprint.kind==='creature');if(s.mode!=='world'||s.hero.dead||s.hero.hp<=0||!e||Math.hypot(e.x-s.hero.x,e.z-s.hero.z)>8)fail('Stand near your creature in the world.');if(e.energy>20)fail('This creature has enough energy; food will not be wasted.');if(s.pack.food<1)fail('One food is needed.');s.pack.food--;s.spent.food++;e.energy=Math.min(100,e.energy+80);remember(s,`Fed ${e.blueprint.name}; one food became eighty energy.`);}
export function equip(s,id){const e=s.creation.instances.find(e=>e.id===id&&e.blueprint.kind==='relic');if(s.mode!=='world'||s.hero.dead||s.hero.hp<=0||!e||Math.hypot(e.x-s.hero.x,e.z-s.hero.z)>8)fail('Stand beside this relic in the world.');s.creation.equipped=id;e.x=s.hero.x;e.z=s.hero.z;remember(s,`Attuned to ${e.blueprint.name}.`);}
export function activeMove(s){if(!['world','boss'].includes(s.mode))return null;const e=s.creation.instances.find(e=>e.id===s.creation.equipped);return e?compile(e.blueprint).move:null;}
export function perform(s,id){const e=s.creation.instances.find(e=>e.id===id&&e.blueprint.kind==='instrument');if(s.mode!=='world'||s.hero.dead||s.hero.hp<=0||!e||Math.hypot(e.x-s.hero.x,e.z-s.hero.z)>8)fail('Stand beside the instrument in the world.');if(e.performance||s.tick<e.cooldown)fail('Let the score finish and the instrument settle.');if(s.hero.breath<40)fail('A performance needs forty Breath.');s.hero.breath-=40;s.hero.lastSpend=s.tick;e.performance={next:s.tick+1,index:0};e.cooldown=s.tick+720;remember(s,`Began the authored score of ${e.blueprint.name}.`);}
export function wave(s,x,z,voice,power,reach,pitch=0){s.creation.waves.push({id:uuid(),x,z,voice,power,radius:0,maximum:reach,hit:[],pitch});if(s.creation.waves.length>48)s.creation.waves.shift();}

export function tick(s,ctx){
 const c=s.creation;if(c.wardUntil<=s.tick)c.ward=0;c.notes=[];
 for(const e of s.mode==='world'?c.instances:[]){
  e.age++;if(e.id===c.equipped){e.x=s.hero.x;e.z=s.hero.z;}const b=e.blueprint;
  if(b.kind==='instrument'&&e.performance&&s.tick>=e.performance.next){const p=e.performance,n=b.score[p.index];wave(s,e.x,e.z,b.voice,1+b.power/2,3+b.reach,n);c.notes.push({pitch:n,energy:b.power});p.index++;p.next+=b.beat;if(p.index===b.score.length){e.performance=null;remember(s,`${b.name} completed its eight-note score.`);}}
  if(b.kind!=='creature')continue;const def=compile(b),nearest=s.enemies.filter(a=>a.hp>0&&!a.dead).sort((a,d)=>Math.hypot(a.x-e.x,a.z-e.z)-Math.hypot(d.x-e.x,d.z-e.z))[0];
  const threat=nearest&&Math.hypot(nearest.x-e.x,nearest.z-e.z)<=def.range;
  const rule=b.rules.find(r=>r.when==='always'||r.when==='threat'&&threat||r.when==='hurt'&&s.hero.hp<s.hero.maxHp*.5||r.when==='hungry'&&e.energy<def.energyCost);
  let action=rule?.do||'rest';if(e.cargo)action='deliver';e.task=action;
  if(action==='guard'&&threat&&e.energy>=def.energyCost){if(Math.hypot(e.x-nearest.x,e.z-nearest.z)>2)ctx.steer(s,e,nearest,def.creatureSpeed);else if(s.tick>=e.cooldown&&!ctx.blocked(s,e,nearest)){e.energy-=def.energyCost;e.cooldown=s.tick+def.cooldown;ctx.damage(s,nearest,3+b.power*2,e);wave(s,e.x,e.z,'visual',0,2,7);}}
  else if(action==='harvest'&&e.energy>=def.energyCost){const n=ctx.resources.find(n=>n.item===b.resource);if(n){if(Math.hypot(e.x-n.x,e.z-n.z)>1.5){ctx.steer(s,e,n,def.creatureSpeed);e.task='traveling to '+b.resource;}else if(!ctx.harvestReady(s,b.resource)){e.task='waiting for water';}else if(s.reserve[b.resource]>0){e.cycle++;if(e.cycle>=100){s.reserve[b.resource]--;e.cargo={item:b.resource,count:1};e.energy-=def.energyCost;e.cycle=0;remember(s,`${b.name} gathered one existing ${b.resource}.`);}}else e.task='reserve exhausted';}}
  else if(action==='deliver'){if(Math.hypot(e.x-s.hero.x,e.z-s.hero.z)>1.6)ctx.steer(s,e,s.hero,def.creatureSpeed);else{s.pack[e.cargo.item]+=e.cargo.count;e.cargo=null;remember(s,`${b.name} placed its carried bundle in your inventory.`);}}
  else if(action==='orbit'){const a=s.tick*.008;ctx.steer(s,e,{x:s.hero.x+Math.sin(a)*3,z:s.hero.z+Math.cos(a)*3},def.creatureSpeed);}
  else if(action==='follow'||action==='guard'){if(Math.hypot(e.x-s.hero.x,e.z-s.hero.z)>2.5)ctx.steer(s,e,s.hero,def.creatureSpeed);}
  if(e.z>-7)e.bank='near';if(e.z<-19)e.bank='far';if(e.angle!==undefined)e.yaw=e.angle*180/Math.PI;
 }
 for(const w of c.waves){const before=w.radius;w.radius+=.12;const bodies=w.voice==='force'?s.enemies.filter(a=>a.hp>0&&!a.dead):w.voice==='mend'||w.voice==='ward'?[s.hero]:[];for(const a of bodies){const id=a.id,dist=Math.hypot(a.x-w.x,a.z-w.z);if(w.hit.includes(id)||dist>w.radius+.6||dist<before-.6)continue;w.hit.push(id);if(w.voice==='force')ctx.damage(s,a,w.power,{x:w.x,z:w.z});if(w.voice==='mend')a.hp=Math.min(a.maxHp,a.hp+w.power);if(w.voice==='ward'){c.ward=Math.min(30,c.ward+w.power);c.wardUntil=s.tick+180;}}
 }
 c.waves=c.waves.filter(w=>w.radius<w.maximum);
}

export function trialDefinition(s,id){const e=s.creation.instances.find(e=>e.id===id&&e.blueprint.kind==='trial');if(s.mode!=='world'||s.hero.dead||!e||Math.hypot(e.x-s.hero.x,e.z-s.hero.z)>6)fail('Stand at your authored trial gate.');return clone(compile(e.blueprint).blueprint);}
export function trialTick(s){const a=s.activity;if(s.mode!=='trial'||a.winner)return;const b=a.blueprint,origin={x:-83,z:-43};for(let i=0;i<b.course.length;i++){if(a.touched.includes(i)||b.order==='sequence'&&a.touched.length!==i)continue;const p=b.course[i];if(Math.hypot(s.hero.x-origin.x-p.x,s.hero.z-origin.z-p.z)<1.5)a.touched.push(i);}if(a.touched.length===b.course.length||a.elapsed>=b.seconds*60){a.winner=a.touched.length===b.course.length?'completed':'time';const result={name:b.name,blueprint:b.id,revision:b.revision,tick:s.tick,elapsed:a.elapsed,touched:a.touched.length,total:b.course.length,result:a.winner};s.creation.trials.push(result);if(s.creation.trials.length>40)s.creation.trials.shift();remember(s,`${b.name}: ${result.touched}/${result.total} sigils in ${(a.elapsed/60).toFixed(1)} seconds. No assets minted.`);}}

export function validate(c){
 if(!exact(c,['schema','drafts','instances','equipped','ward','wardUntil','waves','notes','serial','memories','grants','proposals','trials'])||c.schema!==SCHEMA)fail('Malformed creation state.');
 if(!Array.isArray(c.drafts)||c.drafts.length>24||!Array.isArray(c.instances)||c.instances.length>16)fail('Too many creations.');
 for(const b of c.drafts)compile(b);if(new Set(c.drafts.map(b=>b.id)).size!==c.drafts.length)fail('Duplicate blueprint identity.');
 for(const e of c.instances){
  const allowed=['id','blueprint','investment','x','z','yaw','home','bank','energy','cargo','task','cooldown','cycle','performance','age','angle'];if(!e||typeof e!=='object'||Object.keys(e).some(k=>!allowed.includes(k))||allowed.filter(k=>k!=='angle').some(k=>!(k in e))||('angle' in e&&!finite(e.angle,-100000,100000)))fail('Malformed creation body.');const d=compile(e.blueprint);if(!['near','far'].includes(e.bank))fail('Invalid creation entry bank.');if(typeof e.id!=='string'||e.id.length>100||!finite(e.x,-60,60)||!finite(e.z,-65,55)||!finite(e.yaw,-100000,100000)||!finite(e.energy,0,100)||!integer(e.cooldown,0,1e10)||!integer(e.cycle,0,100)||!integer(e.age,0,1e10)||typeof e.task!=='string'||e.task.length>80||!e.home||!finite(e.home.x,-60,60)||!finite(e.home.z,-65,55))fail('Malformed creation instance.');
  if(!exact(e.investment,GOODS)||GOODS.some(k=>e.investment[k]!==d.cost[k]))fail('Creation investment must match its exact compiled bill.');
  if(e.cargo!==null&&(!exact(e.cargo,['item','count'])||e.blueprint.kind!=='creature'||!GOODS.includes(e.cargo.item)||e.cargo.count!==1))fail('Invalid carried creation inventory.');
  if(e.performance!==null&&(!exact(e.performance,['next','index'])||e.blueprint.kind!=='instrument'||!integer(e.performance.next,0,1e10)||!integer(e.performance.index,0,7)))fail('Invalid score cursor.');
 }
 if(new Set(c.instances.map(e=>e.id)).size!==c.instances.length)fail('Duplicate instance identity.');
 if(c.equipped!==null&&!c.instances.some(e=>e.id===c.equipped&&e.blueprint.kind==='relic'))fail('Equipped relic is missing.');
 if(!finite(c.ward,0,30)||!integer(c.wardUntil,0,1e10)||!integer(c.serial,0,1e10)||!Array.isArray(c.waves)||c.waves.length||!Array.isArray(c.notes)||c.notes.length||!Array.isArray(c.memories)||c.memories.length>160||c.memories.some(m=>!exact(m,['id','tick','text'])||!integer(m.id,0,1e10)||!integer(m.tick,0,1e10)||typeof m.text!=='string'||m.text.length>400))fail('Malformed creation event state.');
 if(!exact(c.grants,['agent'])||typeof c.grants.agent!=='boolean'||!Array.isArray(c.proposals)||c.proposals.length)fail('Pending approvals cannot import.');
 if(!Array.isArray(c.trials)||c.trials.length>40||c.trials.some(t=>typeof t.name!=='string'||t.name.length>64||typeof t.blueprint!=='string'||t.blueprint.length>100||!integer(t.revision,1,10000)||!integer(t.tick,0,1e10)||!integer(t.elapsed,0,10801)||!integer(t.touched,0,12)||!integer(t.total,3,12)||!['completed','time'].includes(t.result)))fail('Malformed trial history.');
}
