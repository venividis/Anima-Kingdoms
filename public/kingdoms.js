/* Anima Kingdoms: bounded connections, conserved charge and physical civic cargo.
   This module has no renderer, wallet, language model, or wall-clock authority. */
import * as C from './creation.js';
export const RULES='anima-concord-1';
export const CHARGE_PER_CRYSTAL=24, TICKS_PER_CHARGE=180;
const copy=x=>structuredClone(x), fail=m=>{throw Error(m);};
const exact=(o,k)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join()===k.slice().sort().join();
const int=(n,a=0,b=1e9)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const pos=p=>exact(p,['x','z'])&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.abs(p.x)<=55&&p.z>=-62&&p.z<=48;
export function makeId(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();const a=new Uint8Array(16);if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(a);else for(let i=0;i<16;i++)a[i]=Math.floor(Math.random()*256);return Array.from(a,n=>n.toString(16).padStart(2,'0')).join('');}
const id=makeId;
const instance=(s,id,kind)=>{const e=s.creation.instances.find(e=>e.id===id&&(!kind||e.blueprint.kind===kind));if(!e)fail('That creation is missing or has the wrong kind.');return e;};
const near=(s,e)=>{const d=e.blueprint.kind==='structure'?Math.min(...footprint(e).map(p=>Math.max(0,Math.hypot(s.hero.x-p.x,s.hero.z-p.z)-Math.hypot(p.hx,p.hz)))):Math.hypot(s.hero.x-e.x,s.hero.z-e.z);if(d>8)fail('Walk within eight steps of this creation.');};
export function state(keeper=18){return {schema:RULES,revision:0,clock:0,topology:0,serial:0,sources:[],receivers:[],links:[],packets:[],jobs:[],order:{id:'orchard-hearth',item:'stone',need:2,delivered:0,reward:4,reserved:keeper>=4?4:0,paid:false,x:8,z:-27},ledger:{crystals:0,spent:0,dissipated:0},trace:[],receipts:[],grant:{enabled:false,epoch:0,remaining:0},journey:null};}
export function reserved(s){return s.kingdoms?.order.reserved||0;}
export function chargeLedger(s){const k=s.kingdoms;return {issued:k.ledger.crystals*24,source:k.sources.reduce((n,a)=>n+a.charge,0),flight:k.packets.length,receiver:k.receivers.reduce((n,a)=>n+a.charge,0),spent:k.ledger.spent,dissipated:k.ledger.dissipated};}
function trace(s,type,text,parent=null){const k=s.kingdoms,e={id:++k.serial,tick:k.clock,type,text,parent};k.trace.push(e);if(k.trace.length>120)k.trace.shift();return e.id;}
const receiver=(s,id)=>s.kingdoms?.receivers.find(r=>r.id===id);
export function supported(s,id){const r=receiver(s,id);return !r||r.kind==='gate'||r.status!=='dormant';}
export function blocking(s,id){const r=receiver(s,id);return !r||r.kind!=='gate'||r.status==='dormant';}
function footprint(e){return e.blueprint.parts.filter(p=>['walkway','solid'].includes(p.role)).map(p=>C.point(e,p));}
function occupied(s,e){const boxes=footprint(e);return [s.hero,s.pet,...s.workers,...s.enemies.filter(a=>a.hp>0),...s.creation.instances.filter(a=>a!==e)].some(a=>boxes.some(p=>C.inside(a.x,a.z,p,.8)));}
function status(s,r,next){if(r.status!==next){r.status=next;s.kingdoms.topology++;trace(s,'route',`${instance(s,r.id).blueprint.name}: ${next}.`,r.cause);}}
function convert(s,e){near(s,e);if(receiver(s,e.id))fail('This structure already has a receiver.');const roles=e.blueprint.parts.map(p=>p.role);if(roles.includes('walkway')&&roles.includes('solid'))fail('Separate walking decks and solid gates into two structures.');if(!roles.some(p=>['walkway','solid'].includes(p)))fail('A receiver needs a walking deck or a solid gate.');if(occupied(s,e))fail('Move every body and creation off the structure before conversion.');s.kingdoms.receivers.push({id:e.id,revision:e.blueprint.revision,kind:roles.includes('walkway')?'bridge':'gate',charge:0,until:0,status:'dormant',cause:null});s.kingdoms.topology++;}
function connect(s,p){const k=s.kingdoms,a=instance(s,p.source,'instrument'),b=instance(s,p.target,'structure');near(s,a);if(!receiver(s,b.id))fail('First convert the structure to a powered receiver.');if(Math.hypot(a.x-b.x,a.z-b.z)>32)fail('Keep connected endpoints within thirty-two steps.');if(k.links.length>=24||k.links.some(l=>l.source===a.id&&l.target===b.id))fail('Connection already exists or the twenty-four wire limit is reached.');if(!k.sources.some(x=>x.id===a.id))k.sources.push({id:a.id,revision:a.blueprint.revision,charge:0});const link={id:id(),source:a.id,target:b.id,sourceRevision:a.blueprint.revision,targetRevision:b.blueprint.revision,pitches:p.pitches.slice()};k.links.push(link);trace(s,'wire',`Connected ${a.blueprint.name} to ${b.blueprint.name}.`);return link.id;}
const schemas={walk:['x','z'],buy_crystal:[],guide:[],receiver:['id'],link:['source','target','pitches'],unlink:['id'],fuel:['id'],perform:['id'],feed:['id'],assign:['carrier'],cancel:['carrier'],grant:['enabled','limit']};
function checkPayload(op,p){if(!schemas[op]||!exact(p,schemas[op]))fail('Use the exact typed payload for this operation.');if(op==='walk'&&!pos(p))fail('Choose a destination inside the valley.');for(const f of ['id','carrier','source','target'])if(f in p&&(typeof p[f]!=='string'||!p[f].length||p[f].length>100))fail('Invalid creation identity.');if(op==='link'&&(!Array.isArray(p.pitches)||p.pitches.length<1||p.pitches.length>13||p.pitches.some(n=>!int(n,0,12))||new Set(p.pitches).size!==p.pitches.length))fail('Choose distinct accepted pitches from zero to twelve.');if(op==='grant'&&(typeof p.enabled!=='boolean'||!int(p.limit,0,32)))fail('A grant contains a boolean and at most thirty-two commands.');}
export function command(s,envelope,ctx){
 if(!exact(envelope,['world','rules','controller','epoch','revision','key','op','payload']))fail('Incomplete command envelope.');
 const {world,rules,controller,epoch,revision,key,op,payload:p}=envelope,k=s.kingdoms;
 if(world!==s.id||rules!==RULES||!['human','agent'].includes(controller)||!int(epoch)||!int(revision)||typeof key!=='string'||!key.length||key.length>100)fail('Command belongs to another world or rules version.');
 checkPayload(op,p);
 if(controller==='agent'&&(!k.grant.enabled||epoch!==k.grant.epoch||op==='grant'))fail('The human has not granted this agent authority, or revoked its grant.');
 const bytes=JSON.stringify(envelope),old=k.receipts.find(r=>r.key===key);
 if(old){if(old.bytes!==bytes)fail('This idempotency key was already used for a different command.');return copy(old);}
 if(revision!==k.revision)fail('World connections changed. Inspect again before acting.');
 if(controller==='agent'&&k.grant.remaining<1)fail('The agent command budget is exhausted.');
 if(s.mode!=='world'||s.hero.dead||s.hero.hp<=0)fail('Return to your living world body first.');
 const draft=copy(s),d=draft.kingdoms;let result=null;
 if(op==='grant'){d.grant={enabled:p.enabled,epoch:d.grant.epoch+1,remaining:p.enabled?p.limit:0};}
 if(op==='walk'){if(!ctx.legal(draft,p.x,p.z,.4))fail('This destination has no open, clear ground.');d.journey={...p};}
 if(op==='receiver')convert(draft,instance(draft,p.id,'structure'));
 if(op==='link')result=connect(draft,p);
 if(op==='unlink'){const l=d.links.find(l=>l.id===p.id);if(!l)fail('This wire is already absent.');near(draft,instance(draft,l.source));d.ledger.dissipated+=d.packets.filter(a=>a.link===l.id).length;d.packets=d.packets.filter(a=>a.link!==l.id);d.links=d.links.filter(a=>a!==l);trace(draft,'wire','Disconnected a wire; in-flight charge dissipated.');}
 if(op==='fuel'){const e=instance(draft,p.id,'instrument');near(draft,e);const source=d.sources.find(a=>a.id===p.id);if(!source)fail('Connect the instrument to a receiver first.');if(source.charge>48)fail('The source holds enough fuel; finish some performances first.');if(draft.pack.crystal<1)fail('Buy one existing crystal at Vey’s Exchange first.');draft.pack.crystal--;draft.spent.crystal++;source.charge+=24;d.ledger.crystals++;trace(draft,'fuel',`${e.blueprint.name}: one crystal became twenty-four charge.`);}
 if(op==='perform')C.perform(draft,p.id);
 if(op==='feed')C.feed(draft,p.id);
 if(op==='assign'){const e=instance(draft,p.carrier,'creature');near(draft,e);if(e.cargo||d.jobs.some(j=>j.carrier===e.id)||d.jobs.length)fail('Finish or cancel the existing civic consignment first.');if(d.order.paid||d.order.reserved<d.order.reward)fail('This finite request is complete or has no reserved reward.');if(e.energy<12)fail('Feed the courier before assigning this request.');if(draft.pack.stone<d.order.need-d.order.delivered)fail('Keep enough stone in your pack for this request.');d.jobs.push({id:id(),carrier:e.id,order:d.order.id,pickup:{x:draft.hero.x,z:draft.hero.z},phase:'pickup',wait:'',cause:null});trace(draft,'job',`${e.blueprint.name} accepted the hearth request. Your body must remain near its pickup to load your pack.`);}
 if(op==='cancel'){const j=d.jobs.find(j=>j.carrier===p.carrier);if(!j)fail('No civic consignment belongs to this creature.');const e=instance(draft,p.carrier);if(e.cargo){j.phase='cancel';j.wait='Returning the actual cargo to its pickup.';}else d.jobs=d.jobs.filter(a=>a!==j);trace(draft,'cancel','Civic request cancelled; undelivered material stays in custody.');}
 if(op==='buy_crystal'){if(Math.hypot(draft.hero.x-6,draft.hero.z-20)>7)fail('Walk to Vey’s Exchange first.');ctx.trade(draft,ctx.quote(draft,'crystal','buy',1));}
 if(op==='guide'){
  if(draft.creation.instances.length)fail('The guided kit is for an empty creation field. Connect your existing creations below.');
  if(Math.hypot(draft.hero.x,draft.hero.z+4)>3)fail('Walk to the bridgehead first.');
  const song=C.seed('instrument');song.name='The First Concord';song.material='stone';
  const span=C.seed('structure');span.name='The Listening Span';
  const bird=C.seed('creature');bird.name='Pip · keeper of small promises';
  const a=ctx.create(draft,song,-3,-4,0),b=ctx.create(draft,span,0,-13,0),e=ctx.create(draft,bird,2,-4,0);
  // Conversion from the nearest deck edge uses the same eight-step interaction rule.
  convert(draft,b);connect(draft,{source:a.id,target:b.id,pitches:Array.from({length:13},(_,i)=>i)});result={source:a.id,receiver:b.id,carrier:e.id};
 }
 if(controller==='agent')d.grant.remaining--;
 d.revision++;const receipt={key,bytes,revision:d.revision,op,result};d.receipts.push(receipt);if(d.receipts.length>64)d.receipts.shift();
 ctx.record(draft,`${controller==='agent'?'Invited agent':'You'}: ${op}.`,'connection');Object.assign(s,draft);return copy(receipt);
}
export function emit(s,e,pitch,index){const k=s.kingdoms;if(!k)return;const source=k.sources.find(a=>a.id===e.id);if(!source)return;const cause=trace(s,'note',`${e.blueprint.name}: note ${index+1}, pitch ${pitch}.`);for(const l of k.links.filter(l=>l.source===e.id).sort((a,b)=>a.id.localeCompare(b.id))){if(!l.pitches.includes(pitch)){trace(s,'filter',`Pitch ${pitch} is filtered out.`,cause);continue;}if(source.charge<1){trace(s,'empty','No fuel: music still sounds, but carries no mechanical charge.',cause);break;}if(k.packets.length>=64){trace(s,'capacity','The sixty-four packet limit was reached; fuel stayed at the source.',cause);break;}const target=instance(s,l.target);source.charge--;k.packets.push({id:++k.serial,link:l.id,source:e.id,target:l.target,pitch,index,start:k.clock,due:k.clock+Math.max(1,Math.ceil(Math.hypot(e.x-target.x,e.z-target.z)*6)),cause});}}
export function courier(s,e,ctx){const k=s.kingdoms,j=k?.jobs.find(j=>j.carrier===e.id);if(!j)return false;const o=k.order;
 const returning=['return','cancel'].includes(j.phase),dest=j.phase==='out'?o:j.pickup;
 if(Math.hypot(e.x-dest.x,e.z-dest.z)>1.3){const before={x:e.x,z:e.z};ctx.steer(s,e,dest,C.compile(e.blueprint).creatureSpeed);if(!ctx.originalWalkable(s,e.x,e.z)){const surfaces=C.surfaces(s),support=surfaces.find(p=>C.inside(e.x,e.z,p)&&(ctx.originalWalkable(s,before.x,before.z)||!surfaces.some(q=>q.owner===p.owner&&C.inside(before.x,before.z,q))));if(support){const r=receiver(s,support.owner);j.cause=trace(s,'crossing',`${e.blueprint.name} entered ${instance(s,support.owner).blueprint.name} at ${e.x.toFixed(1)}, ${e.z.toFixed(1)} with ${e.cargo?.item||'empty cargo'}; previous custody event #${j.cause||0}.`,r?.cause||j.cause);}}j.wait=Math.hypot(e.x-before.x,e.z-before.z)<.00001?'No passable route. Power a span, supply rain, or build a permanent crossing.':'';e.task=j.wait?'waiting for an open route':returning?'returning to pickup':j.phase==='out'?'carrying stone to the hearth':'approaching pickup';return true;}
 if(j.phase==='out'){
  if(!e.cargo||e.cargo.item!==o.item)fail('Civic cargo custody invariant failed.');
  e.cargo=null;s.spent.stone++;o.delivered++;k.revision++;const receipt=trace(s,'delivery',`One actual stone reached the hearth (${o.delivered}/${o.need}).`,j.cause);j.cause=receipt;
  if(o.delivered===o.need){s.rain.balances.keeper-=o.reserved;s.rain.balances.human+=o.reserved;s.rain.revision++;o.reserved=0;o.paid=true;trace(s,'payment','The hearth is built. Four reserved Marks transferred once.',receipt);}j.phase='return';
 }else if(returning){if(e.cargo){if(Math.hypot(s.hero.x-j.pickup.x,s.hero.z-j.pickup.z)>3){j.wait='Return your body to the pickup to recover its cargo.';e.task='waiting for owner';return true;}s.pack[e.cargo.item]+=e.cargo.count;e.cargo=null;}if(j.phase==='cancel'||o.paid){k.jobs=k.jobs.filter(a=>a!==j);e.task='promise kept';k.revision++;return true;}j.phase='pickup';}
 else{
  if(Math.hypot(s.hero.x-j.pickup.x,s.hero.z-j.pickup.z)>3){j.wait='Return your body to the pickup so the creature can load your pack.';e.task='waiting for owner';return true;}
  if(s.pack.stone<1||e.energy<12){j.wait=s.pack.stone<1?'Bring stone to the pickup.':'Feed this courier one food at the pickup.';e.task='waiting for supplies';return true;}
  s.pack.stone--;e.cargo={item:'stone',count:1};e.energy-=12;j.phase='out';j.wait='';j.cause=trace(s,'pickup',`${e.blueprint.name} took custody of one stone.`);k.revision++;
 }return true;
}
export function tick(s,ctx,input={}){const k=s.kingdoms;if(!k||s.mode!=='world')return;k.clock++;
 for(const p of k.packets.filter(p=>p.due<=k.clock)){const r=receiver(s,p.target);if(r&&r.charge<16){r.charge++;r.cause=p.cause;trace(s,'arrival',`Pitch ${p.pitch} delivered one charge.`,p.cause);}else{k.ledger.dissipated++;trace(s,'overflow','Receiver capacity reached; one charge dissipated.',p.cause);}}
 k.packets=k.packets.filter(p=>p.due>k.clock);
 for(const r of k.receivers){if(k.clock>=r.until&&r.charge){r.charge--;k.ledger.spent++;r.until=k.clock+TICKS_PER_CHARGE;status(s,r,'active');}else if(k.clock>=r.until){const e=instance(s,r.id);status(s,r,occupied(s,e)?'clearing':'dormant');}}
 if(k.journey){if(input.move?.some(n=>n)||input.attack||input.dodge||s.hero.dead)k.journey=null;else if(Math.hypot(s.hero.x-k.journey.x,s.hero.z-k.journey.z)<.6)k.journey=null;else ctx.steer(s,s.hero,k.journey,4.3);}
}
export function detach(s,id){const k=s.kingdoms;if(k.jobs.some(j=>j.carrier===id))fail('Finish or cancel the civic consignment before reclaiming this courier.');if(k.links.some(l=>l.source===id||l.target===id))fail('Disconnect this creation’s wires before reclaiming it.');const source=k.sources.find(a=>a.id===id),r=receiver(s,id);k.ledger.dissipated+=(source?.charge||0)+(r?.charge||0);k.sources=k.sources.filter(a=>a.id!==id);k.receivers=k.receivers.filter(a=>a.id!==id);k.topology++;k.revision++;}
export function inspect(s){const k=s.kingdoms;return copy({world:s.id,rules:RULES,revision:k.revision,epoch:k.grant.epoch,grant:k.grant,mode:s.mode,body:{x:s.hero.x,z:s.hero.z,breath:s.hero.breath},pack:s.pack,marks:s.rain.balances.human,creations:s.creation.instances.map(e=>({id:e.id,name:e.blueprint.name,kind:e.blueprint.kind,x:e.x,z:e.z,energy:e.energy,cargo:e.cargo,task:e.task,cooldown:Math.max(0,e.cooldown-s.tick)})),sources:k.sources,receivers:k.receivers,links:k.links,packets:k.packets,jobs:k.jobs,order:k.order,charge:chargeLedger(s),journey:k.journey,trace:k.trace.slice(-24)});}
export function validate(s){const k=s.kingdoms,bad=()=>fail('Malformed Anima Kingdoms connection state.');
 if(!exact(k,['schema','revision','clock','topology','serial','sources','receivers','links','packets','jobs','order','ledger','trace','receipts','grant','journey'])||k.schema!==RULES)bad();
 for(const n of ['revision','clock','topology','serial'])if(!int(k[n]))bad();
 for(const [n,max]of [['sources',16],['receivers',16],['links',24],['packets',64],['jobs',1],['trace',120],['receipts',64]])if(!Array.isArray(k[n])||k[n].length>max)bad();
 for(const a of k.sources){if(!exact(a,['id','revision','charge'])||!int(a.charge,0,72)||a.revision!==instance(s,a.id,'instrument').blueprint.revision)bad();}
 for(const a of k.receivers){const e=instance(s,a.id,'structure');if(!exact(a,['id','revision','kind','charge','until','status','cause'])||a.revision!==e.blueprint.revision||!int(a.charge,0,16)||!int(a.until,0,k.clock+TICKS_PER_CHARGE)||a.status==='active'&&a.until<=k.clock||a.status!=='active'&&a.until>k.clock||!['active','clearing','dormant'].includes(a.status)||!['bridge','gate'].includes(a.kind)||!(a.cause===null||int(a.cause,1,k.serial)))bad();const roles=e.blueprint.parts.map(p=>p.role);if(!roles.includes(a.kind==='bridge'?'walkway':'solid')||roles.includes(a.kind==='bridge'?'solid':'walkway'))bad();}
 for(const l of k.links){if(!exact(l,['id','source','target','sourceRevision','targetRevision','pitches'])||typeof l.id!=='string'||l.id.length>100)bad();checkPayload('link',{source:l.source,target:l.target,pitches:l.pitches});if(!k.sources.some(a=>a.id===l.source&&a.revision===l.sourceRevision)||!k.receivers.some(a=>a.id===l.target&&a.revision===l.targetRevision))bad();}
 for(const p of k.packets){if(!exact(p,['id','link','source','target','pitch','index','start','due','cause'])||!int(p.id,1,k.serial)||!int(p.pitch,0,12)||!int(p.index,0,7)||!int(p.start,0,k.clock)||!int(p.due,k.clock,1e9)||p.due-p.start>300||!int(p.cause,1,k.serial)||!k.links.some(l=>l.id===p.link&&l.source===p.source&&l.target===p.target&&l.pitches.includes(p.pitch)))bad();}
 const o=k.order;if(!exact(o,['id','item','need','delivered','reward','reserved','paid','x','z'])||o.id!=='orchard-hearth'||o.item!=='stone'||o.need!==2||o.reward!==4||o.x!==8||o.z!==-27||!int(o.delivered,0,2)||![0,4].includes(o.reserved)||typeof o.paid!=='boolean'||o.paid!==(o.delivered===2)||o.paid&&o.reserved!==0||o.reserved>s.rain.balances.keeper||o.delivered>s.spent.stone)bad();
 for(const j of k.jobs){const e=instance(s,j.carrier,'creature');if(!exact(j,['id','carrier','order','pickup','phase','wait','cause'])||typeof j.id!=='string'||j.id.length>100||j.order!==o.id||!pos(j.pickup)||!['pickup','out','return','cancel'].includes(j.phase)||typeof j.wait!=='string'||j.wait.length>200||!(j.cause===null||int(j.cause,1,k.serial))||o.paid&&['pickup','out'].includes(j.phase)||!o.paid&&o.reserved!==4||j.phase==='out'&&e.cargo?.item!=='stone'||e.cargo&&e.cargo.item!=='stone')bad();}
 if(!exact(k.ledger,['crystals','spent','dissipated'])||Object.values(k.ledger).some(n=>!int(n))||k.ledger.crystals>s.spent.crystal)bad();const l=chargeLedger(s);if(l.issued!==l.source+l.flight+l.receiver+l.spent+l.dissipated)bad();
 for(const n of ['sources','receivers','links','packets','jobs'])if(new Set(k[n].map(a=>a.id)).size!==k[n].length)bad();
 if(new Set(k.links.map(l=>l.source+'>'+l.target)).size!==k.links.length)bad();
 if(!exact(k.grant,['enabled','epoch','remaining'])||typeof k.grant.enabled!=='boolean'||!int(k.grant.epoch)||!int(k.grant.remaining,0,32)||k.journey!==null&&!pos(k.journey))bad();
 for(const t of k.trace)if(!exact(t,['id','tick','type','text','parent'])||!int(t.id,1,k.serial)||!int(t.tick,0,k.clock)||typeof t.type!=='string'||t.type.length>24||typeof t.text!=='string'||t.text.length>400||!(t.parent===null||int(t.parent,1,k.serial)))bad();
 for(const r of k.receipts){if(!exact(r,['key','bytes','revision','op','result'])||typeof r.key!=='string'||r.key.length>100||typeof r.bytes!=='string'||r.bytes.length>1000||!int(r.revision,1,k.revision)||!schemas[r.op])bad();let e;try{e=JSON.parse(r.bytes);}catch{bad();}if(!exact(e,['world','rules','controller','epoch','revision','key','op','payload'])||e.world!==s.id||e.rules!==RULES||!['human','agent'].includes(e.controller)||!int(e.epoch)||!int(e.revision,0,k.revision-1)||e.key!==r.key||e.op!==r.op||r.revision!==e.revision+1)bad();checkPayload(e.op,e.payload);if(r.op==='guide'){if(!exact(r.result,['source','receiver','carrier'])||Object.values(r.result).some(v=>typeof v!=='string'||!/^[-a-zA-Z0-9]{16,100}$/.test(v)))bad();}else if(r.op==='link'){if(typeof r.result!=='string'||!/^[-a-zA-Z0-9]{16,100}$/.test(r.result))bad();}else if(r.result!==null)bad();}
 if(k.receipts.some((r,i)=>i&&r.revision<=k.receipts[i-1].revision))bad();
 if(new Set(k.receipts.map(r=>r.key)).size!==k.receipts.length)bad();
}
