import * as C from './cosmos.js';
export const state=()=>({schema:1,clock:0,workshop:C.workshopState(),town:C.townState(),blade:null,dewUntil:0});
const fail=m=>{throw Error(m);};
const exact=(p,keys)=>p&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).sort().join()===keys.slice().sort().join();
export const elapsed=s=>(s.cosmos?.clock||0)*1000/60;
export const held=(s,item)=>s.cosmos?C.investment(s.cosmos.workshop,item):0;
export function validate(s){
  const c=s.cosmos;
  if(!exact(c,['schema','clock','workshop','town','blade','dewUntil'])||c.schema!==1||!Number.isSafeInteger(c.clock)||c.clock<0||c.clock>s.tick||!Number.isSafeInteger(c.dewUntil)||c.dewUntil<0||!exact(c.town,['bell','garden']))fail('The celestial world record is malformed.');
  C.validateWorkshop(c.workshop,elapsed(s));
  for(const [value,id] of [[c.blade,'iron'],[c.town.bell,'alloy'],[c.town.garden,'earth']])if(value){
    C.validateWorkshop({schema:1,serial:c.workshop.serial,job:null,products:[value],records:[]},elapsed(s));
    if(value.recipe!==id||c.workshop.products.some(p=>p.id===value.id))fail('An installed work cannot also remain in your pack.');
  }
  return c;
}
export function command(s,op,payload={},ctx={}){
  if(s.mode!=='world'||s.hero.hp<=0||s.hero.dead)fail('Return to your living orchard body first.');
  const draft=structuredClone(s),c=draft.cosmos,w=c.workshop,now=elapsed(draft);
  const near=(point,range=6)=>{if(Math.hypot(draft.hero.x-point.x,draft.hero.z-point.z)>range)fail(`Walk to ${point.name} first.`);};
  const spend=(cost)=>{for(const [item,n] of Object.entries(cost))if(draft.pack[item]<n)fail(`You need ${n} ${item}. Gather or trade for it first.`);for(const [item,n] of Object.entries(cost))draft.pack[item]-=n;};
  const consumed=r=>{for(const [item,n] of Object.entries(r.cost))draft.spent[item]+=n;};
  let result;
  if(op==='start'){
    if(!exact(payload,['recipe','mode','text']))fail('Choose the recipe, work mode and complete Luma sentence.');
    const phrase=C.resolveWorkshopPhrase(payload.text),r=C.RECIPES[payload.recipe];
    if(phrase.operation!=='start'||phrase.recipe!==payload.recipe)fail('The sentence must name the recipe you selected.');
    if(phrase.mode!=='pe')return {...phrase,cost:r.cost,sky:C.skyAt(now),message:'This is a reading or possibility. Use pe to undertake the work.'};
    near(C.WORKSITES[r.station]);spend(r.cost);result=C.startWork(w,payload.recipe,now,payload.mode);
  }else if(op==='strike'||op==='advance'){
    if(!exact(payload,op==='strike'?[]:['cooling']))fail('Use the current work control.');
    if(!w.job)fail('Begin a work first.');near(C.WORKSITES[C.RECIPES[w.job.recipe].station]);
    result=op==='strike'?C.strikeWork(w,now):C.advanceWork(w,now,payload.cooling);
  }else if(op==='reclaim'){
    if(!exact(payload,['id']))fail('Choose the work to reclaim.');
    const work=payload.id===null?w.job:w.products.find(p=>p.id===payload.id);if(!work)fail('Choose a work you still own.');
    const r=C.RECIPES[work.recipe];near(C.WORKSITES[r.station]);
    if(payload.id===null)w.job=null;else C.takeProduct(w,payload.id);
    for(const [item,n] of Object.entries(r.cost)){if(item==='wood'&&r.kind==='metal')draft.spent[item]+=n;else draft.pack[item]+=n;}
    result={reclaimed:true,fuelReturned:false};
  }else if(op==='use'){
    if(!exact(payload,['id']))fail('Choose a finished work.');
    const p=w.products.find(p=>p.id===payload.id);if(!p)fail('Choose a work you still own.');
    const r=C.RECIPES[p.recipe];
    if(['alloy','earth'].includes(p.recipe)){
      near(C.WORKSITES.town);
      const field=p.recipe==='alloy'?'bell':'garden';
      if(c.town[field]&&c.town[field].quality>=p.quality)fail('The town already has an equally fine work. Keep or reclaim this one.');
      c.town[field]=structuredClone(p);
    }else if(p.recipe==='iron'){
      if(c.blade&&c.blade.quality>=p.quality)fail('Your weapon already holds an equally fine temper.');
      c.blade=structuredClone(p);
    }else{
      if(draft.hero.hp>=draft.hero.maxHp&&draft.hero.breath>=100)fail('You are already restored. Keep your dew.');
      draft.hero.hp=Math.min(draft.hero.maxHp,draft.hero.hp+20+Math.floor(p.quality/4));
      draft.hero.breath=Math.min(100,draft.hero.breath+30+Math.floor(p.quality/3));
      c.dewUntil=c.clock+3600;
    }
    C.takeProduct(w,p.id);consumed(r);result={used:p.recipe,quality:p.quality};
  }else fail('Unknown celestial workshop action.');
  validate(draft);ctx.record?.(draft,op==='start'?`You began ${C.RECIPES[payload.recipe].name} in Luma.`:result.product?`${C.RECIPES[result.product.recipe].name} is finished · quality ${result.product.quality}.`:op==='use'?`${C.RECIPES[result.used].name} now serves ${result.used==='alloy'||result.used==='earth'?'the town':'your journey'}.`:`Starforge: ${op}.`,'cosmos');
  ctx.validate?.(draft);Object.assign(s,draft);return result;
}
