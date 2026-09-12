/* AWE embodied local profile. No network, wallet, hidden rewards or LLM calls. */
export const PROFILE='awe-first-orchard-0.8.0';
export const BRIDGE=Object.freeze({id:'living-crossing',x:0,near:-7,far:-19,halfWidth:3.2,requiredWater:6});
export const SINKS=['bridge','orchard','habitat'];
export const PAIRS=[['spring','west'],['spring','east'],...['west','east'].flatMap(a=>SINKS.map(b=>[a,b]))];
export const KEYS=PAIRS.map(p=>p.join('>')).sort();
export const NODES={spring:{x:-15,z:12,name:'The Wellspring'},west:{x:-12,z:0,name:'West loom'},east:{x:12,z:0,name:'East loom'},bridge:{x:0,z:-6,name:'Living Crossing'},orchard:{x:14,z:-30,name:'First Orchard'},habitat:{x:-25,z:5,name:'Oru’s reed garden'}};
export const BRAID=[['spring','west',6],['spring','east',6],['west','bridge',2],['east','bridge',2],['west','habitat',4],['east','orchard',4]];
const cmp=(a,b)=>{for(let i=0;i<a.length;i++){if(a[i]!==b[i])return a[i]-b[i];}return 0;};
export function routeWater(supply,edges,priority=SINKS){
 if(!Number.isInteger(supply)||supply<0||supply>18)throw Error('Invalid rain supply');
 if(!Array.isArray(priority)||priority.length!==3||new Set(priority).size!==3||priority.some(s=>!SINKS.includes(s)))throw Error('Invalid priority');
 const caps=Object.fromEntries(KEYS.map(k=>[k,0]));
 for(const e of edges){let k=e.from+'>'+e.to;if(!KEYS.includes(k)||caps[k]||!Number.isInteger(e.capacity)||e.capacity<1||e.capacity>6)throw Error('Invalid channel');caps[k]=e.capacity;}
 const opts=j=>{let o=[];for(let a=0;a<=caps[j+'>bridge'];a++)for(let b=0;b<=caps[j+'>orchard'];b++)for(let c=0;c<=caps[j+'>habitat'];c++)if(a+b+c<=caps['spring>'+j])o.push([a,b,c]);return o;};
 let best=null,score=[-1,-1,-1],vector=null;const ix=priority.map(s=>SINKS.indexOf(s));
 for(const w of opts('west'))for(const e of opts('east')){const d=w.map((v,i)=>v+e[i]);if(d.some(v=>v>6)||d.reduce((a,b)=>a+b,0)>supply)continue;const s=ix.map(i=>d[i]);if(cmp(s,score)<0)continue;const f={'spring>west':w.reduce((a,b)=>a+b,0),'spring>east':e.reduce((a,b)=>a+b,0)};SINKS.forEach((k,i)=>{f['west>'+k]=w[i];f['east>'+k]=e[i];});const v=KEYS.map(k=>f[k]);if(cmp(s,score)>0||!vector||cmp(v,vector)<0){best=d;score=s;vector=v;}}
 const deliveries=Object.fromEntries(SINKS.map((s,i)=>[s,best[i]]));const used=best.reduce((a,b)=>a+b,0);return{flows:Object.fromEntries(KEYS.map((k,i)=>[k,vector[i]])),deliveries,source_used:used,overflow:supply-used};
}
export function genesis(){return{profile:PROFILE,revision:0,pulse:0,weather:'balanced',priority:[...SINKS],channels:{},storage:{bridge:4,orchard:4,habitat:4},flows:Object.fromEntries(KEYS.map(k=>[k,0])),deliveries:{bridge:0,orchard:0,habitat:0},fiber:{human:24,agent:12,keeper:12},focus:{human:12,agent:12},focusSpent:0,scrap:0,supplied:0,overflow:0,losses:0,balances:{human:20,agent:0,keeper:18,carrier:0},escrow:12,cargo:{x:0,z:5,food:4,owner:'carrier',status:'waiting'},grant:{enabled:false,epoch:0},reserveBridge:false,events:[{id:0,pulse:0,text:'You woke in the First Orchard. The rain has not yet moved.'}],discovered:[],pavilionBest:0};}
function event(w,text){w.revision++;w.events.push({id:w.revision,pulse:w.pulse,text});if(w.events.length>160)w.events.shift();}
export function channel(w,from,to,capacity,kind='installed',actor='human'){
 const key=from+'>'+to;
 if(!KEYS.includes(key)||w.channels[key])throw Error('That channel slot is unavailable.');
 if(!Number.isInteger(capacity)||capacity<1||capacity>6)throw Error('Capacity must be 1–6.');
 if(!['installed','temporary'].includes(kind)||!['human','agent'].includes(actor))throw Error('Invalid channel request.');
 if(actor==='agent'&&(!w.grant.enabled||(to==='bridge'&&w.reserveBridge)))throw Error('Serein does not have permission for this connection.');
 const stock=kind==='temporary'?w.focus:w.fiber;if(stock[actor]<capacity)throw Error(kind==='temporary'?'Not enough Focus. Install a fiber channel instead.':'Not enough fiber. Salvage a channel or invite Serein.');
 stock[actor]-=capacity;if(kind==='temporary')w.focusSpent+=capacity;
 // New invitations permit human maintenance of future agent installations.
 // Ownership remains with the builder; legacy unmarked rows keep their rights.
 w.channels[key]={from,to,capacity,kind,owner:actor,remaining:kind==='temporary'?3:null,...(actor==='agent'?{maintainer:'human'}:{})};event(w,`${actor==='human'?'You':'Serein'} ${kind==='temporary'?'wove':'installed'} ${from} → ${to}, capacity ${capacity}.${actor==='agent'?' Human caretaker removal returns salvage to Serein.':''}`);
}
export function installBraid(w){const next=structuredClone(w);for(const[a,b,c]of BRAID)channel(next,a,b,c);Object.assign(w,next);}
export function removeChannel(w,key){const c=w.channels[key],caretaker=c?.owner==='agent'&&c.maintainer==='human';if(!c||(c.owner!=='human'&&!caretaker))throw Error('Only your own channels or agent channels with agreed human maintenance can be salvaged.');let returned=0;if(c.kind==='installed'){returned=Math.floor(c.capacity/2);w.fiber[c.owner]+=returned;w.scrap+=c.capacity-returned;}delete w.channels[key];event(w,`You ${caretaker?'maintained':'removed'} ${c.from} → ${c.to}.${caretaker?` ${returned} fiber returned to Serein; ownership was not transferred.`:''} Stored water remains.`);}
export function setWeather(w,name){if(!['balanced','drought','storm'].includes(name))throw Error('Unknown weather');w.weather=name;event(w,`You chose ${name} rain for the next pulse.`);}
export function setPriority(w,first){if(!SINKS.includes(first))throw Error('Unknown priority');w.priority=[first,...SINKS.filter(s=>s!==first)];event(w,`${first} now receives first claim on scarce rain.`);}
export function pulse(w){const supply=w.weather==='drought'?6:w.weather==='storm'?18:12;const r=routeWater(supply,Object.values(w.channels).map(({from,to,capacity})=>({from,to,capacity})),w.priority);w.pulse++;w.supplied+=supply;w.overflow+=r.overflow;w.flows=r.flows;w.deliveries=r.deliveries;const was=bridgeOpen(w);for(const s of SINKS){const total=w.storage[s]+r.deliveries[s];w.overflow+=Math.max(0,total-12);const held=Math.min(12,total),loss=Math.min(2,held);w.storage[s]=held-loss;w.losses+=loss;}for(const[k,c]of Object.entries(w.channels))if(c.kind==='temporary'&&--c.remaining<=0)delete w.channels[k];event(w,`Rain ${w.pulse}: crossing +${r.deliveries.bridge}, orchard +${r.deliveries.orchard}, reeds +${r.deliveries.habitat}.`);if(was!==bridgeOpen(w))event(w,bridgeOpen(w)?'The living crossing rose. Its load is now supported.':'The crossing folded: its water store fell below six.');rescueCargo(w);return r;}
export function bridgeOpen(w){return w.storage.bridge>=BRIDGE.requiredWater;}
export function onBridge(x,z){return z<=BRIDGE.near&&z>=BRIDGE.far&&Math.abs(x-BRIDGE.x)<=BRIDGE.halfWidth;}
function clippedEllipse(cx,cz,rx,rz,cut,side){let input=Array.from({length:128},(_,i)=>[cx+Math.cos(i/128*Math.PI*2)*rx,cz+Math.sin(i/128*Math.PI*2)*rz]),out=[];for(let i=0;i<input.length;i++){const a=input[i],b=input[(i+1)%input.length],ia=(a[1]-cut)*side>=0,ib=(b[1]-cut)*side>=0;if(ia)out.push(a);if(ia!==ib){const t=(cut-a[1])/(b[1]-a[1]);out.push([a[0]+t*(b[0]-a[0]),cut]);}}return out;}
export const GROUND=[{x:0,z:14,poly:clippedEllipse(0,14,51,34,-7,1)},{x:0,z:-33,poly:clippedEllipse(0,-33,37,23,-19,-1)}];
export function land(x,z){if(z>=BRIDGE.far&&z<=BRIDGE.near)return false;for(const{poly}of GROUND){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){let a=poly[i],b=poly[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)return true;}return false;}
export function walkable(w,x,z){return land(x,z)||(onBridge(x,z)&&bridgeOpen(w));}
export function rescueCargo(w){const c=w.cargo;if(c.status==='delivered')return;if(c.z<BRIDGE.near+1.5&&c.z>BRIDGE.far-1.5&&!bridgeOpen(w)){c.z=BRIDGE.near+1.6;c.status='waiting';event(w,'Vey’s safety tether returned the wagon to the near bank. The carrier still owns its four food.');}}
export function tickCargo(w,dt){if(!Number.isFinite(dt)||dt<0||dt>0.1)throw Error('Invalid simulation step');const c=w.cargo;if(c.status==='delivered')return false;rescueCargo(w);if(!bridgeOpen(w)&&c.z>=-7){c.status='waiting';return false;}c.status='traveling';const next=Math.max(-28,c.z-dt*1.9);if(!walkable(w,0,next)){c.status='waiting';return false;}c.z=next;if(c.z<=-28){c.status='delivered';c.owner='keeper';w.balances.carrier+=w.escrow;w.escrow=0;event(w,'Vey’s wagon reached the far-bank depot. Four food changed custody; the reserved 12 Marks paid the carrier once.');return true;}return false;}
export function grant(w,enabled){if(typeof enabled!=='boolean')throw Error('Invalid grant');if(w.grant.enabled!==enabled){w.grant.enabled=enabled;w.grant.epoch++;event(w,enabled?'You invited Serein to propose channels using its own fiber. Future channels allow your maintenance; salvage returns to Serein.':'You withdrew Serein’s permission to build.');}}
export function reserve(w,enabled){w.reserveBridge=!!enabled;event(w,enabled?'Both bridge inlets are reserved for your contribution.':'You released the bridge contribution reservation.');}
const acceptedProposals=new WeakMap();
export function propose(w){if(!w.grant.enabled)throw Error('Invite Serein first.');let candidates=[];for(const s of [...SINKS].sort((a,b)=>w.storage[a]-w.storage[b])){if(s==='bridge'&&w.reserveBridge)continue;for(const j of ['west','east']){const plan=[];if(!w.channels['spring>'+j])plan.push(['spring',j,4]);if(!w.channels[j+'>'+s])plan.push([j,s,4]);if(!plan.length||plan.reduce((n,p)=>n+p[2],0)>w.fiber.agent)continue;const clone=structuredClone(w);try{for(const[a,b,c]of plan)channel(clone,a,b,c,'installed','agent');pulse(clone);candidates.push({plan,forecast:{...clone.storage},target:s});}catch{}}}if(!candidates.length)throw Error('No legal proposal fits Serein’s remaining fiber and your reservations.');const p={...candidates[0],revision:w.revision,epoch:w.grant.epoch};acceptedProposals.set(p,{world:w,bytes:JSON.stringify(p)});return p;}
export function acceptProposal(w,p){const binding=acceptedProposals.get(p);if(!binding||binding.world!==w||binding.bytes!==JSON.stringify(p))throw Error('The exact viewed proposal does not belong to this world.');if(!p||p.revision!==w.revision||p.epoch!==w.grant.epoch||!w.grant.enabled)throw Error('The world changed. Ask Serein for a fresh proposal.');const next=structuredClone(w);for(const[a,b,c]of p.plan)channel(next,a,b,c,'installed','agent');Object.assign(w,next);acceptedProposals.delete(p);}
export function ledger(w){return{water:12+w.supplied-Object.values(w.storage).reduce((a,b)=>a+b,0)-w.overflow-w.losses,money:Object.values(w.balances).reduce((a,b)=>a+b,0)+w.escrow,fiber:Object.values(w.fiber).reduce((a,b)=>a+b,0)+Object.values(w.channels).filter(c=>c.kind==='installed').reduce((a,c)=>a+c.capacity,0)+w.scrap,focus:Object.values(w.focus).reduce((a,b)=>a+b,0)+w.focusSpent,food:w.cargo.food};}
export function discover(w,id,label){if(!w.discovered.includes(id)){w.discovered.push(id);event(w,`You found ${label}.`);return true;}return false;}
export function validateSave(w){
 const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===[...keys].sort().join('|');
 if(!w||w.profile!==PROFILE||!Number.isSafeInteger(w.pulse)||w.pulse<0||!Number.isSafeInteger(w.revision)||w.revision<0)throw Error('Incompatible save');
 if(!['balanced','drought','storm'].includes(w.weather)||!Number.isInteger(w.pavilionBest)||w.pavilionBest<0||w.pavilionBest>150)throw Error('Invalid activity or weather');
 if(!exact(w.storage,SINKS)||!exact(w.fiber,['human','agent','keeper'])||!exact(w.focus,['human','agent'])||!exact(w.balances,['human','agent','keeper','carrier'])||!exact(w.flows,KEYS)||!exact(w.deliveries,SINKS))throw Error('Invalid account fields');
 for(const n of [...Object.values(w.flows),...Object.values(w.deliveries)])if(!Number.isInteger(n)||n<0||n>6)throw Error('Invalid last flow');
 routeWater(12,Object.values(w.channels).map(({from,to,capacity})=>({from,to,capacity})),w.priority);
 for(const s of SINKS)if(!Number.isInteger(w.storage[s])||w.storage[s]<0||w.storage[s]>10)throw Error('Invalid storage');
 for(const group of[w.fiber,w.focus,w.balances])for(const n of Object.values(group))if(!Number.isInteger(n)||n<0)throw Error('Invalid stock');
 for(const n of[w.supplied,w.overflow,w.losses,w.scrap,w.focusSpent,w.escrow])if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid ledger');
 for(const[k,c]of Object.entries(w.channels)){const marked=Object.hasOwn(c,'maintainer');if(!exact(c,['from','to','capacity','kind','owner','remaining',...(marked?['maintainer']:[])])||k!==c.from+'>'+c.to||!['human','agent'].includes(c.owner)||!['installed','temporary'].includes(c.kind)||(marked&&(c.maintainer!=='human'||c.owner!=='agent'))||(c.kind==='temporary'?(!Number.isInteger(c.remaining)||c.remaining<1||c.remaining>3):c.remaining!==null))throw Error('Invalid channel record');}
 if(typeof w.grant.enabled!=='boolean'||!Number.isSafeInteger(w.grant.epoch)||w.grant.epoch<0||typeof w.reserveBridge!=='boolean')throw Error('Invalid permission');
 const l=ledger(w);if(l.water!==0||l.money!==50||l.fiber!==48||l.focus!==24||l.food!==4)throw Error('Save failed conservation');
 const c=w.cargo;if(c.x!==0||!Number.isFinite(c.z)||c.z< -28||c.z>5||!['waiting','traveling','delivered'].includes(c.status))throw Error('Invalid cargo');
 if(c.status==='delivered'?(c.z!==-28||c.owner!=='keeper'||w.escrow!==0||w.balances.carrier!==12):(c.owner!=='carrier'||w.escrow!==12||w.balances.carrier!==0))throw Error('Invalid settlement');
 if(!Array.isArray(w.events)||w.events.length>160||w.events.some(e=>typeof e.text!=='string'||e.text.length>600)||!Array.isArray(w.discovered)||w.discovered.some(s=>typeof s!=='string'||s.length>80))throw Error('Invalid history');
 return w;
}
