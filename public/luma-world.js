/* Luma is a language of accountable local actions. Modes choose what the
 * speaker does; the existing simulation owns bodies, reach and resources. */
import * as L from './luma/language.js';
import {blueprintForWord} from './luma/geometry.js';
import * as C from './creation.js';
import * as K from './kingdoms.js';
import * as V from './civilization.js';

export const SCHEMA = 'anima-luma-1';
export const MAX_INTENTIONS = 16, MAX_RECEIPTS = 64;
export const state = () => ({schema:SCHEMA, revision:0, serial:0, intentions:[], receipts:[]});
const clone = value => structuredClone(value);
const fail = message => { throw Error(message); };
const int = (n,min=0,max=1e9) => Number.isSafeInteger(n)&&n>=min&&n<=max;
const object = value => !!value&&typeof value==='object'&&!Array.isArray(value);
const exact = (value,keys) => object(value)&&Object.keys(value).sort().join()===keys.slice().sort().join();
const finite = (n,min,max) => typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const bounded = (s,max=100) => typeof s==='string'&&s.length>0&&s.length<=max;
const canonical = value => JSON.stringify(value, (_key,node) => object(node)?Object.fromEntries(Object.entries(node).sort(([a],[b])=>a.localeCompare(b))):node);
const CONTEXT_KEYS = ['x','z','yaw','dimension','focusId','targetId','intentionId','key'];

export function context(raw={}) {
  if(!object(raw)||Object.keys(raw).some(key=>!CONTEXT_KEYS.includes(key))) fail('Use the named Luma context fields.');
  const c={x:raw.x??null,z:raw.z??null,yaw:raw.yaw??0,dimension:raw.dimension??16,focusId:raw.focusId??null,targetId:raw.targetId??null,intentionId:raw.intentionId??null,key:raw.key??null};
  if((c.x===null)!==(c.z===null)||c.x!==null&&(!finite(c.x,-55,55)||!finite(c.z,-62,48))||!finite(c.yaw,-180,180)||!int(c.dimension,1,16)) fail('Choose a position inside the valley, an orientation, and one to sixteen coordinates.');
  for(const key of ['focusId','targetId','key']) if(c[key]!==null&&!bounded(c[key],100)) fail('Use a valid Luma context identity.');
  if(c.intentionId!==null&&!int(c.intentionId,1)) fail('Choose an existing intention.');
  return c;
}
const withoutKey = c => ({...c,key:null});
const bare = phrase => phrase&&phrase.type==='nounPhrase'&&phrase.quantifier===null&&Array.isArray(phrase.adjectives)&&!phrase.adjectives.length&&Array.isArray(phrase.relatives)&&!phrase.relatives.length;
const bareRoles = parsed => {
  for(const [name,phrase] of Object.entries(parsed.roles)) {
    if(!phrase||phrase.type!=='nounPhrase'||!Array.isArray(phrase.adjectives)||phrase.adjectives.length||!Array.isArray(phrase.relatives)||phrase.relatives.length) fail('Use unqualified local role words; this action cannot execute extra descriptions.');
    if(phrase.quantifier!==null&&!(name==='ta'&&['doni','mari'].includes(parsed.verb))) fail('This local action does not execute that quantity.');
  }
};
function parseAction(source) {
  if(typeof source!=='string'||source.length>384) fail('A local Luma passage holds at most 384 characters.');
  const p=L.parse(source), clauses=p.ast?.statements;
  if(!Array.isArray(clauses)||clauses.length!==1||clauses[0].type!=='clause') fail('Choose one complete Luma clause.');
  const clause=clauses[0];
  if(!['i','u','pe','e','a'].includes(p.mode)||clause.vocative!==null||clause.time!==null||clause.aspect!==null||clause.predicate?.negated||clause.force!==null&&clause.force!=='pe'||clause.force&&clause.stance) fail('This local register uses one explicit mode with no unexecuted time, condition or negation.');
  if(!bare(p.subject)||p.subject.head?.type!=='pronoun'||p.subject.head.value!=='mi') fail('Only the speaker’s own mi can undertake a local action.');
  if(!Array.isArray(p.manner)||p.manner.some(word=>word!=='melu')||p.manner.length>1) fail('The local action understands the optional manner melu, with care.');
  bareRoles(p);
  const theme=L.roleWord(p,'ta'), name=L.roleName(p,'ta'), roles=Object.keys(p.roles);
  let operation, allowed=['ta'];
  if(['peli','bani'].includes(p.verb)) {
    if(p.roles.ta?.head?.type!=='word'||!theme?.endsWith('a')) fail('Choose an existing dictionary noun to make.');
    operation='creation.create';
  } else if(p.verb==='musi'&&['musa','sona'].includes(theme)) operation='creation.perform';
  else if(p.verb==='meli'&&['wuna','musa','sona','pela'].includes(theme)) operation='creation.care';
  else if(p.verb==='yuni'&&theme==='pesa') operation='creation.connect';
  else if(['doni','mari'].includes(p.verb)&&theme==='bama') {
    operation='households.supply'; allowed=['ta','li'];
    if(L.roleName(p,'li')!=='households'||!bare(p.roles.li)) fail('Name the household recipient exactly as "households".');
    const q=L.roleQuantity(p,'ta');
    if(!q||q.d!==1n||q.n<1n||q.n>20n) fail('Give a whole quantity of food from one to twenty.');
  } else if(p.verb==='temi'&&theme==='mena') operation='households.invite';
  else if(p.verb==='remi'&&theme==='mi'&&p.roles.ta?.head?.type==='pronoun') operation='body.mend';
  else if(p.verb==='remi'&&theme==='pela') operation='creation.revise';
  else if(p.verb==='duri'&&theme==='pelama') operation='intention.release';
  else if(['wedi','yeli','gimi','honi','lini','yemi'].includes(p.verb)&&theme&&p.roles.ta?.head?.type==='word') operation='world.observe';
  else if(p.verb==='huri'&&!roles.length) {operation='world.observe';allowed=[];}
  else fail('This sentence parses, but its verb and theme do not name an implemented local action.');
  if(roles.some(role=>!allowed.includes(role))||name!==null&&name!==undefined) fail('This action cannot silently ignore an additional role or borrowed name.');
  return {...p,word:theme,operation};
}

function observe(s,c) {
  const e=s.creation.instances.find(item=>item.id===c.focusId);
  return {tick:s.tick,body:{x:s.hero.x,z:s.hero.z,hp:s.hero.hp,maxHp:s.hero.maxHp,breath:s.hero.breath},pack:clone(s.pack),water:clone(s.rain.storage),creations:s.creation.instances.length,focus:e?{id:e.id,name:e.blueprint.name,kind:e.blueprint.kind,x:e.x,z:e.z,energy:e.energy,task:e.task}:null};
}
function selected(s,c,kind=null) {
  const e=s.creation.instances.find(item=>item.id===c.focusId&&(!kind||item.blueprint.kind===kind));
  if(!e) fail(kind?`Choose an existing ${kind}.`:'Choose an existing creation.');
  return e;
}
function explain(p) {
  const action={
    'creation.create':`Create ${p.word} from its letters and actual materials.`,
    'creation.perform':'Begin the selected instrument’s complete score using forty Breath.',
    'creation.care':'Give the selected creature one food, or fuel a connected instrument with one crystal.',
    'creation.connect':'Join the selected instrument to a nearby powered walking deck or gate.',
    'households.supply':'Move the named food into the household depot; Tavi still has to deliver it.',
    'households.invite':'Invite four households into the food and soil cycle at the council.',
    'body.mend':'Use one existing tonic to mend your injured body.',
    'creation.revise':'Rebuild the selected inscription from reclaimed materials, keeping its word, coordinates and lineage.',
    'intention.release':'Release the selected intention from your notebook.',
    'world.observe':'Read the present body, inventory and world state.'
  }[p.operation];
  return ({i:'Imagination: ',u:'Intention: ',pe:'Undertaking: ',e:'Model or observation: ',a:'Your experience: '}[p.mode]||'')+action;
}

export function preview(s,source,rawContext={}) {
  const p=parseAction(source), c=context(rawContext), out={schema:'anima-luma-preview-1',mode:p.mode,latin:p.latin,native:p.native,verb:p.verb,word:p.word,operation:p.operation,context:c,cost:null,blueprint:null,message:explain(p),code:L.phraseCode(source)};
  if(p.operation==='creation.create') {
    const b=blueprintForWord(p.word,p.latin,c.dimension), compiled=C.compile(b);
    out.blueprint=compiled.blueprint;out.cost=compiled.cost;
  }
  if(p.operation==='households.supply') out.cost={food:Number(L.roleQuantity(p,'ta').n)};
  if(p.operation==='body.mend') out.cost={tonic:1};
  if(p.operation==='creation.perform') out.cost={breath:40};
  if(p.operation==='creation.care'&&c.focusId) {
    const kind=selected(s,c).blueprint.kind;
    if(kind==='creature'&&!['wuna','pela'].includes(p.word)||kind==='instrument'&&!['musa','sona','pela'].includes(p.word)||!['creature','instrument'].includes(kind)) fail('The care word must match a creature or an instrument.');
    out.cost=kind==='creature'?{food:1}:{crystal:1};
  }
  if(p.operation==='world.observe'||p.mode==='e'||p.mode==='a') out.observation=observe(s,c);
  return out;
}

export const nextKey = s => `luma:${s.id}:${s.luma.serial+1}`;
function sequence(s,key) {
  const prefix=`luma:${s.id}:`;
  if(!bounded(key,100)||!key.startsWith(prefix)||!/^\d+$/.test(key.slice(prefix.length))) fail('Use the next Luma key for this world.');
  const n=Number(key.slice(prefix.length));
  if(!int(n,1)||`${prefix}${n}`!==key) fail('Use a canonical Luma key for this world.');
  return n;
}
function connectedCommand(s,op,payload,ctx,key,suffix) {
  return K.command(s,{world:s.id,rules:K.RULES,controller:'human',epoch:s.kingdoms.grant.epoch,revision:s.kingdoms.revision,key:`${key}:${suffix}`,op,payload},ctx);
}
function execute(s,p,c,ctx,key) {
  if(s.mode!=='world'||s.hero.dead||s.hero.hp<=0) fail('Return to your living world body before undertaking an action.');
  if(p.operation==='creation.create') {
    if(c.x===null) fail('Place the word in the valley before undertaking its creation.');
    const b=blueprintForWord(p.word,p.latin,c.dimension), e=ctx.create(s,b,c.x,c.z,c.yaw);
    return {instanceId:e.id,blueprintId:e.blueprint.id,word:p.word};
  }
  if(p.operation==='creation.perform') {
    const e=selected(s,c,'instrument'); connectedCommand(s,'perform',{id:e.id},ctx,key,'perform');
    return {instanceId:e.id,notes:C.scoreLength?C.scoreLength(e.blueprint):e.blueprint.score.length,breath:40};
  }
  if(p.operation==='creation.care') {
    const e=selected(s,c), kind=e.blueprint.kind;
    if(kind==='creature'&&!['wuna','pela'].includes(p.word)||kind==='instrument'&&!['musa','sona','pela'].includes(p.word)||!['creature','instrument'].includes(kind)) fail('The care word must match a creature or an instrument.');
    connectedCommand(s,kind==='creature'?'feed':'fuel',{id:e.id},ctx,key,'care');
    return {instanceId:e.id,item:kind==='creature'?'food':'crystal',count:1};
  }
  if(p.operation==='creation.connect') {
    const source=selected(s,c,'instrument'), target=s.creation.instances.find(item=>item.id===c.targetId&&item.blueprint.kind==='structure');
    if(!target) fail('Choose a walking deck or solid gate as the connection target.');
    if(!s.kingdoms.receivers.some(item=>item.id===target.id)) connectedCommand(s,'receiver',{id:target.id},ctx,key,'receiver');
    const pitches=[...new Set((C.scoreNotes?C.scoreNotes(source.blueprint):source.blueprint.score).map(note=>typeof note==='number'?note:note.pitch))].sort((a,b)=>a-b);
    const result=connectedCommand(s,'link',{source:source.id,target:target.id,pitches},ctx,key,'link');
    return {sourceId:source.id,targetId:target.id,linkId:result.result};
  }
  if(p.operation==='households.invite') {V.command(s,'invite',{},ctx);return {population:12};}
  if(p.operation==='households.supply') {const count=Number(L.roleQuantity(p,'ta').n);V.command(s,'supply',{count},ctx);return {item:'food',count,recipient:'households'};}
  if(p.operation==='body.mend') {
    if(s.hero.hp>=s.hero.maxHp) fail('Your body is already well; the tonic will stay in your pack.');
    const hp=s.hero.hp;ctx.consume(s,'tonic');return {item:'tonic',count:1,restored:s.hero.hp-hp};
  }
  if(p.operation==='creation.revise') {
    const e=selected(s,c);
    if(!e.blueprint.luma) fail('Choose a creation with an existing Luma inscription to revise.');
    const old=clone(e), parent=`${old.blueprint.id}@${old.blueprint.revision}`;
    ctx.reclaimCreation(s,e.id);
    const b=blueprintForWord(old.blueprint.luma.word,old.blueprint.luma.sentence,old.blueprint.luma.dimension);b.id=K.makeId();b.parent=parent;
    const created=ctx.create(s,b,old.x,old.z,old.yaw);
    return {instanceId:created.id,replacedId:old.id,blueprintId:created.blueprint.id,parent};
  }
  if(p.operation==='intention.release') {
    const entry=s.luma.intentions.find(item=>item.id===c.intentionId);
    if(!entry) fail('Choose an intention that is still in your notebook.');
    s.luma.intentions=s.luma.intentions.filter(item=>item!==entry);return {intentionId:entry.id};
  }
  return {observation:observe(s,c)};
}
function meaning(p,c) {
  return canonical({verb:p.verb,manner:p.manner,roles:p.roles,dimension:c.dimension,focusId:c.focusId,targetId:c.targetId});
}

export function utter(s,source,rawContext={},ctx={}) {
  const p=parseAction(source), c=context(rawContext);
  if(['i','e','a'].includes(p.mode)) return preview(s,source,c);
  const key=c.key??nextKey(s), n=sequence(s,key), signature=canonical({source,context:withoutKey(c)}), old=s.luma.receipts.find(receipt=>receipt.key===key);
  if(old) {if(old.signature!==signature) fail('That Luma key already belongs to a different passage or context.');return clone(old);}
  if(n!==s.luma.serial+1) fail(n<=s.luma.serial?'That earlier Luma key has already been used; its receipt has left the recent window.':'Use the next Luma key in this world.');
  const draft=clone(s), d=draft.luma;let result;
  if(p.mode==='u') {
    if(d.intentions.length>=MAX_INTENTIONS) fail('Your notebook holds sixteen intentions. Release one before adding another.');
    if(p.operation==='intention.release') fail('Use pe to release an intention; an intention to release would leave it in the notebook.');
    const entry={id:n,tick:s.tick,source,context:withoutKey(c),operation:p.operation,fulfilled:null};
    d.intentions.push(entry);result={intentionId:n};
  } else {
    result=execute(draft,p,c,ctx,key);
    const accepted=meaning(p,c);
    for(const entry of draft.luma.intentions) if(entry.fulfilled===null&&meaning(parseAction(entry.source),entry.context)===accepted) entry.fulfilled=n;
  }
  // Existing command adapters may replace nested state on the atomic draft.
  const current=draft.luma;
  current.serial=n;current.revision++;
  const receipt={key,signature,revision:current.revision,tick:s.tick,source,native:p.native,mode:p.mode,operation:p.operation,result,summary:p.mode==='u'?'Intention recorded. No material has been used.':explain(p)};
  current.receipts.push(receipt);if(current.receipts.length>MAX_RECEIPTS) current.receipts.shift();
  if(ctx.record) ctx.record(draft,p.mode==='u'?'You recorded a Luma intention.':`Luma: ${p.operation}.`,'luma');
  validate(draft);
  if(ctx.validateCandidate) ctx.validateCandidate(draft);
  Object.assign(s,draft);
  return clone(receipt);
}

export function dismissIntention(s,id,ctx={}) {return utter(s,'pe mi me duri ta pelama.',{intentionId:id,key:nextKey(s)},ctx);}

function observationShape(value) {
  if(!exact(value,['tick','body','pack','water','creations','focus'])||!int(value.tick)||!exact(value.body,['x','z','hp','maxHp','breath'])||!Object.values(value.body).every(n=>finite(n,-150,500))||!int(value.creations,0,16)) return false;
  if(!exact(value.pack,C.GOODS)||Object.values(value.pack).some(n=>!int(n))||!exact(value.water,['bridge','orchard','habitat'])||Object.values(value.water).some(n=>!finite(n,0,1e9))) return false;
  const focus=value.focus;
  return focus===null||exact(focus,['id','name','kind','x','z','energy','task'])&&bounded(focus.id)&&bounded(focus.name,64)&&C.KINDS.includes(focus.kind)&&finite(focus.x,-60,60)&&finite(focus.z,-65,55)&&finite(focus.energy,0,100)&&bounded(focus.task,80);
}
function resultShape(receipt) {
  const r=receipt.result;
  if(receipt.mode==='u') return exact(r,['intentionId'])&&int(r.intentionId,1);
  switch(receipt.operation) {
    case 'creation.create': return exact(r,['instanceId','blueprintId','word'])&&bounded(r.instanceId)&&bounded(r.blueprintId)&&bounded(r.word,48)&&r.word===parseAction(receipt.source).word;
    case 'creation.perform': return exact(r,['instanceId','notes','breath'])&&bounded(r.instanceId)&&int(r.notes,1,96)&&r.breath===40;
    case 'creation.care': return exact(r,['instanceId','item','count'])&&bounded(r.instanceId)&&['food','crystal'].includes(r.item)&&r.count===1;
    case 'creation.connect': return exact(r,['sourceId','targetId','linkId'])&&Object.values(r).every(value=>bounded(value));
    case 'households.invite': return exact(r,['population'])&&r.population===12;
    case 'households.supply': return exact(r,['item','count','recipient'])&&r.item==='food'&&int(r.count,1,20)&&r.recipient==='households'&&BigInt(r.count)===L.roleQuantity(parseAction(receipt.source),'ta').n;
    case 'body.mend': return exact(r,['item','count','restored'])&&r.item==='tonic'&&r.count===1&&finite(r.restored,0,45)&&r.restored>0;
    case 'creation.revise': return exact(r,['instanceId','replacedId','blueprintId','parent'])&&Object.values(r).every(value=>bounded(value,120))&&r.instanceId!==r.replacedId;
    case 'intention.release': return exact(r,['intentionId'])&&int(r.intentionId,1);
    case 'world.observe': return exact(r,['observation'])&&observationShape(r.observation);
    default:return false;
  }
}
export function validate(s) {
  const d=s.luma, bad=()=>fail('Malformed Luma notebook, receipt or action history.');
  if(!exact(d,['schema','revision','serial','intentions','receipts'])||d.schema!==SCHEMA||!int(d.serial)||d.revision!==d.serial||!Array.isArray(d.intentions)||d.intentions.length>MAX_INTENTIONS||!Array.isArray(d.receipts)||d.receipts.length>MAX_RECEIPTS) bad();
  if(d.receipts.length!==Math.min(d.serial,MAX_RECEIPTS)) bad();
  for(let i=0;i<d.receipts.length;i++) {
    const r=d.receipts[i];
    if(!exact(r,['key','signature','revision','tick','source','native','mode','operation','result','summary'])||!['u','pe'].includes(r.mode)||!int(r.revision,1,d.revision)||r.revision!==d.serial-d.receipts.length+i+1||!int(r.tick,0,s.tick)||!bounded(r.source,384)||!bounded(r.native,512)||!bounded(r.signature,1400)||!bounded(r.summary,400)||sequence(s,r.key)!==r.revision) bad();
    let input,p;
    try {input=JSON.parse(r.signature);p=parseAction(r.source);} catch {bad();}
    if(!exact(input,['source','context'])||input.source!==r.source||input.context?.key!==null||canonical(input)!==r.signature||canonical(context(input.context))!==canonical(input.context)||p.mode!==r.mode||p.native!==r.native||p.operation!==r.operation||!resultShape(r)) bad();
    if(i&&r.tick<d.receipts[i-1].tick) bad();
    if(r.mode==='u'&&r.result.intentionId!==r.revision) bad();
  }
  const seen=new Set();
  for(const entry of d.intentions) {
    if(!exact(entry,['id','tick','source','context','operation','fulfilled'])||!int(entry.id,1,d.serial)||seen.has(entry.id)||!int(entry.tick,0,s.tick)||!bounded(entry.source,384)||entry.context?.key!==null||canonical(context(entry.context))!==canonical(entry.context)||entry.fulfilled!==null&&!int(entry.fulfilled,entry.id+1,d.serial)) bad();
    seen.add(entry.id);let p;try{p=parseAction(entry.source);}catch{bad();}
    if(p.mode!=='u'||p.operation!==entry.operation||p.operation==='intention.release') bad();
    const saved=d.receipts.find(receipt=>receipt.revision===entry.id);
    if(saved&&(saved.mode!=='u'||saved.source!==entry.source||saved.tick!==entry.tick||saved.signature!==canonical({source:entry.source,context:entry.context}))) bad();
    const fulfilled=d.receipts.find(receipt=>receipt.revision===entry.fulfilled);
    if(fulfilled) {
      const input=JSON.parse(fulfilled.signature);
      if(fulfilled.mode!=='pe'||meaning(parseAction(fulfilled.source),input.context)!==meaning(p,entry.context)) bad();
    }
  }
  return d;
}
