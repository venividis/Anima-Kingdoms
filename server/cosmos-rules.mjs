import * as C from '../public/cosmos.js';
import {ITEMS,emptyBag} from '../public/shared-rules.js';
const exact=(p,keys)=>p&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).sort().join()===keys.slice().sort().join();
const fail=m=>{throw Error(m);};
export const cosmosState=()=>({schema:1,workshops:{},town:C.townState(),spent:emptyBag(),effects:{}});
export function migrateCosmos(s){if(s?.schemaVersion===3&&!Object.hasOwn(s,'cosmos')){s.schemaVersion=4;s.cosmos=cosmosState();}return s;}
export const elapsed=(s,now)=>Math.max(0,now-s.createdAt);
export const held=(s,item)=>s.cosmos.spent[item]+Object.values(s.cosmos.workshops).reduce((n,w)=>n+C.investment(w,item),0);
export function accounts(s){return [['cosmos:spent',s.cosmos.spent],...Object.entries(s.cosmos.workshops).map(([id,w])=>['atelier:'+id,Object.fromEntries(ITEMS.map(item=>[item,C.investment(w,item)]))])];}
export function validateCosmos(s){
  const c=s.cosmos;if(!exact(c,['schema','workshops','town','spent','effects'])||c.schema!==1||!exact(c.town,['bell','garden'])||!c.workshops||typeof c.workshops!=='object'||Array.isArray(c.workshops)||!c.effects||typeof c.effects!=='object'||Array.isArray(c.effects)||!exact(c.spent,ITEMS)||Object.values(c.spent).some(n=>!Number.isSafeInteger(n)||n<0)||c.spent.marks!==0)fail('Invalid celestial custody.');
  for(const [id,w] of Object.entries(c.workshops)){if(!Object.hasOwn(s.players,id))fail('Unknown workshop owner.');C.validateWorkshop(w);}
  for(const [id,e] of Object.entries(c.effects))if(!Object.hasOwn(s.players,id)||!exact(e,['iron','dewUntil'])||!Number.isSafeInteger(e.iron)||e.iron<0||e.iron>100||!Number.isFinite(e.dewUntil)||e.dewUntil<0)fail('Invalid work effect.');
  for(const [field,recipe] of [['bell','alloy'],['garden','earth']])if(c.town[field]){
    const t=c.town[field];if(!exact(t,['ownerId','work'])||!Object.hasOwn(s.players,t.ownerId)||t.work?.recipe!==recipe)fail('Invalid installed town work.');
    const w=c.workshops[t.ownerId];if(!w||w.products.some(p=>p.id===t.work.id))fail('Installed work is still in a pack.');
    C.validateWorkshop({schema:1,serial:w.serial,job:null,products:[t.work],records:[]});
  }
}
export function cosmosView(s,id,now){const ms=elapsed(s,now);return {elapsed:ms,sky:C.skyAt(ms),workshop:structuredClone(s.cosmos.workshops[id]||C.workshopState()),town:structuredClone(s.cosmos.town),effects:structuredClone(s.cosmos.effects[id]||{iron:0,dewUntil:0})};}
export function gatheringDelay(s,id,now){
  const c=s.cosmos,e=c.effects[id],bell=c.town.bell?.work.quality||0,garden=c.town.garden?.work.quality||0;
  return Math.max(550,900-Math.round(bell*1.2)-Math.round(garden*.6)-(e?.iron?70:0)-(e?.dewUntil>elapsed(s,now)?100:0));
}
export function dispatchCosmos(s,credential,op,payload,now,transfers){
  const id=credential.player_id,p=s.players[id],c=s.cosmos,ms=elapsed(s,now);
  const w=c.workshops[id]||C.workshopState();
  const near=point=>{if(Math.hypot(p.x-point.x,p.z-point.z)>6)fail(`Walk to ${point.name} first.`);};
  const event=text=>{s.events.push({id:s.revision+1,at:now,playerId:id,text});s.events=s.events.slice(-100);};
  const ledger=(to,item,quantity)=>transfers.push({from:'atelier:'+id,to,item,quantity});
  let result;
  if(op==='cosmos.start'){
    if(!exact(payload,['recipe','mode','text']))fail('Select a recipe, work mode and complete Luma sentence.');
    const phrase=C.resolveWorkshopPhrase(payload.text),r=C.RECIPES[payload.recipe];
    if(phrase.operation!=='start'||phrase.recipe!==payload.recipe)fail('The spoken recipe must match the selected work.');
    if(phrase.mode!=='pe')return {...phrase,cost:r.cost,message:'A possibility is recorded without spending. Use pe to undertake it.'};
    near(C.WORKSITES[r.station]);
    for(const [item,n] of Object.entries(r.cost))if(p.inventory[item]<n)fail(`You need ${n} ${item}. Gather or trade for it first.`);
    result=C.startWork(w,payload.recipe,ms,payload.mode);
    for(const [item,n] of Object.entries(r.cost)){p.inventory[item]-=n;transfers.push({from:'player:'+id,to:'atelier:'+id,item,quantity:n});}
    c.workshops[id]=w;event(`${p.name} began ${r.name} in Luma.`);
  }else if(op==='cosmos.strike'||op==='cosmos.advance'){
    if(!exact(payload,op==='cosmos.strike'?[]:['cooling']))fail('Use the current work control.');
    if(!w.job)fail('Begin a work first.');near(C.WORKSITES[C.RECIPES[w.job.recipe].station]);
    result=op==='cosmos.strike'?C.strikeWork(w,ms):C.advanceWork(w,ms,payload.cooling);
    if(result.product)event(`${p.name} finished ${C.RECIPES[result.product.recipe].name} · quality ${result.product.quality}.`);
  }else if(op==='cosmos.reclaim'){
    if(!exact(payload,['id']))fail('Choose a work to reclaim.');
    const work=payload.id===null?w.job:w.products.find(p=>p.id===payload.id);if(!work)fail('That work is not in your custody.');
    const r=C.RECIPES[work.recipe];near(C.WORKSITES[r.station]);
    if(payload.id===null)w.job=null;else C.takeProduct(w,payload.id);
    for(const [item,n] of Object.entries(r.cost)){
      if(item==='wood'&&r.kind==='metal'){c.spent[item]+=n;ledger('cosmos:spent',item,n);}
      else {p.inventory[item]+=n;ledger('player:'+id,item,n);}
    }
    result={reclaimed:true};event(`${p.name} reclaimed work; spent furnace fuel stayed consumed.`);
  }else if(op==='cosmos.use'){
    if(!exact(payload,['id']))fail('Choose a finished work.');
    const work=w.products.find(p=>p.id===payload.id);if(!work)fail('That finished work is not in your custody.');
    const recipe=C.RECIPES[work.recipe],e=c.effects[id]||{iron:0,dewUntil:0};
    if(['alloy','earth'].includes(work.recipe)){
      near(C.WORKSITES.town);const field=work.recipe==='alloy'?'bell':'garden';
      if(c.town[field]&&c.town[field].work.quality>=work.quality)fail('The town already has an equally fine work. Keep or reclaim yours.');
      c.town[field]={ownerId:id,work:structuredClone(work)};
    }else if(work.recipe==='iron'){
      if(e.iron>=work.quality)fail('Your tool already holds an equally fine temper.');e.iron=work.quality;
    }else{
      if(e.dewUntil>ms)fail('Your previous dew is still active. Keep this one.');e.dewUntil=ms+60000;
    }
    c.effects[id]=e;C.takeProduct(w,work.id);
    for(const [item,n] of Object.entries(recipe.cost)){c.spent[item]+=n;ledger('cosmos:spent',item,n);}
    result={used:work.recipe,quality:work.quality};event(`${p.name} put ${recipe.name} to work${['alloy','earth'].includes(work.recipe)?' for the whole town':''}.`);
  }else fail('Unknown workshop action.');
  validateCosmos(s);return result;
}
