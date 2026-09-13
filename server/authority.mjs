import * as Cosmos from './cosmos-rules.mjs';
import {DatabaseSync} from 'node:sqlite';
import {createHash,createHmac,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {mkdirSync,chmodSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {compile as compileBlueprint} from '../public/creation.js';
import {parse as parseLuma,toNative,roleWord,roleName,roleQuantity} from '../public/luma/language.js';
import {
  RULES_VERSION,MATERIALS,ITEMS,BOUNDS,BRIDGE,SPAWN,OBSTACLES,NODE_DEFINITIONS,
  PROJECT_DEFINITIONS,MARKET,COMMAND_SCOPES,emptyBag,traversable,moveIntent,
} from '../public/shared-rules.js';

export class RealmError extends Error {
  constructor(code,message,status=400){super(message);this.name='RealmError';this.code=code;this.status=status;}
}
const fail=(code,message,status=400)=>{throw new RealmError(code,message,status);};
const hash=value=>createHash('sha256').update(value).digest('hex');
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
const own=(table,id)=>typeof id==='string'&&Object.hasOwn(table,id)?table[id]:null;
function exact(value,keys,label='Payload') {
  if(!object(value)||Object.keys(value).length!==keys.length||keys.some(key=>!Object.hasOwn(value,key)))fail('INVALID_SHAPE',`${label} requires exactly: ${keys.join(', ')}.`);
}
function integer(value,min,max,label){if(!Number.isSafeInteger(value)||value<min||value>max)fail('INVALID_NUMBER',`${label} must be an integer from ${min} to ${max}.`);return value;}
function plainText(value,min,max,label) {
  if(typeof value!=='string'||value.trim().length<min||value.trim().length>max||/[\u0000-\u001f\u007f-\u009f]/u.test(value))fail('INVALID_TEXT',`${label} must contain ${min}–${max} plain text characters.`);
  return value.trim();
}
function canonical(value) {
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(object(value))return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}';
  return JSON.stringify(value);
}
function itemAmount(value) {
  exact(value,['item','quantity']);if(!ITEMS.includes(value.item))fail('UNKNOWN_ITEM','Choose an existing material or Marks.');
  integer(value.quantity,1,10000,'Quantity');return {...value};
}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const LUMA_STATUS=Object.freeze({i:'imagined',u:'intended',e:'inspected',a:'experienced',pe:'enacted'});
function bareNoun(np,{quantity=false}={}){
  return object(np)&&np.type==='nounPhrase'&&object(np.head)&&['word','name','pronoun'].includes(np.head.type)&&Array.isArray(np.adjectives)&&!np.adjectives.length&&Array.isArray(np.relatives)&&!np.relatives.length&&(quantity||np.quantifier===null);
}
function checkQuantity(parsed,key,quantity){const q=roleQuantity(parsed,key);if(q&&(q.d!==1n||q.n!==BigInt(quantity)))fail('LUMA_BINDING','The spoken quantity must equal the whole quantity selected for this action.');}
function isMaterial(parsed,key,item){const name=roleName(parsed,key),word=roleWord(parsed,key),native=item==='stone'?'bema':item==='food'?'bama':null;return name===item||native!==null&&word===native;}
// This resolver checks the entire retained clause. Unsupported conditions never
// disappear merely because a familiar verb appears inside the sentence.
function resolveLuma(s,playerId,text,bindings){
  const source=plainText(text,1,512,'Luma statement');let parsed;
  try{parsed=parseLuma(source);}catch(error){fail('INVALID_LUMA',error.message);}
  const clause=parsed.ast?.statements?.[0];
  if(!clause||parsed.ast.statements.length!==1||!Object.hasOwn(LUMA_STATUS,parsed.mode))fail('LUMA_MODE','Choose one statement marked i, u, e, a or pe.');
  if(!bareNoun(parsed.subject)||parsed.subject.head.type!=='pronoun'||parsed.subject.head.value!=='mi')fail('LUMA_SPEAKER','A shared action must name the current speaker with the pronoun mi.');
  if(clause.time!==null||clause.aspect!==null||clause.vocative!==null||clause.predicate?.negated||parsed.manner.some(word=>word!=='melu')||parsed.manner.length>1)fail('LUMA_UNSUPPORTED','Time, aspect, negation, vocatives and unimplemented manners cannot be applied to this action.');
  if(parsed.mode==='pe'?(parsed.force!=='pe'||parsed.stance!==null):(parsed.force!==null||parsed.stance!==parsed.mode))fail('LUMA_MODE','Use a single explicit mode for the shared action.');
  if(!object(bindings)||typeof bindings.kind!=='string')fail('INVALID_SHAPE','Select one explicit Luma action binding.');
  const roles=Object.keys(parsed.roles),allow=(keys)=>{if(roles.some(key=>!keys.includes(key)))fail('LUMA_UNSUPPORTED','This action cannot apply every role in the sentence.');for(const key of roles)if(!bareNoun(parsed.roles[key],{quantity:key==='ki'||bindings.kind==='gift'&&key==='ta'}))fail('LUMA_UNSUPPORTED','Qualified or nested participants need an action that implements their conditions.');};
  const namedProject=(key,project)=>roleName(parsed,key)===project.name;
  if(bindings.kind==='project'){
    exact(bindings,['kind','projectId','item','quantity'],'Project binding');allow(['ta','la','ki']);
    const project=s.projects.find(p=>p.id===bindings.projectId);if(!project)fail('UNKNOWN_PROJECT','That public project does not exist.');
    integer(bindings.quantity,1,100,'Quantity');if(!ITEMS.includes(bindings.item))fail('UNKNOWN_ITEM','Choose an existing material.');
    if(parsed.verb!=='bani'||!(['bana','pela'].includes(roleWord(parsed,'ta'))||namedProject('ta',project))||parsed.roles.la&&!namedProject('la',project))fail('LUMA_BINDING','The building statement must name the selected public project or a building/creation.');
    if(parsed.roles.ki){if(!isMaterial(parsed,'ki',bindings.item))fail('LUMA_BINDING','The spoken material does not match the selected material.');checkQuantity(parsed,'ki',bindings.quantity);}
    return {parsed,operation:'project.contribute',payload:{projectId:project.id,item:bindings.item,quantity:bindings.quantity},context:structuredClone(bindings),preview:{context:{projectId:project.id,projectName:project.name,item:bindings.item,quantity:bindings.quantity},cost:{[bindings.item]:bindings.quantity}}};
  }
  if(bindings.kind==='gift'){
    exact(bindings,['kind','recipientId','item','quantity'],'Gift binding');allow(['ta','li']);
    const recipient=own(s.players,bindings.recipientId);if(!recipient)fail('UNKNOWN_RECIPIENT','Select an existing recipient.');
    const give=itemAmount({item:bindings.item,quantity:bindings.quantity});
    const recipientHead=parsed.roles.li?.head,recipientMatches=recipientHead?.type==='pronoun'&&recipientHead.value==='ti'||recipientHead?.type==='name'&&recipientHead.value===recipient.name;
    if(!['doni','mari'].includes(parsed.verb)||!(roleWord(parsed,'ta')==='dona'||isMaterial(parsed,'ta',give.item))||!recipientMatches)fail('LUMA_BINDING','Name a gift or its material, and the selected recipient with li ti or their exact quoted name.');
    checkQuantity(parsed,'ta',give.quantity);
    return {parsed,operation:'gift.offer',payload:{recipientId:recipient.id,give},context:structuredClone(bindings),preview:{context:{recipientId:recipient.id,recipientName:recipient.name,item:give.item,quantity:give.quantity},cost:{[give.item]:give.quantity}}};
  }
  if(bindings.kind==='blueprint'){
    exact(bindings,['kind','blueprint'],'Blueprint binding');allow(['ta']);
    if(parsed.verb!=='peli'||roleWord(parsed,'ta')!=='pela')fail('LUMA_BINDING','A blueprint publication uses peli ta pela.');
    let compiled;try{compiled=compileBlueprint(bindings.blueprint);}catch(error){fail('INVALID_BLUEPRINT',error.message);}
    const context={kind:'blueprint',blueprint:compiled.blueprint};
    return {parsed,operation:'blueprint.publish',payload:{blueprint:compiled.blueprint},context,preview:{context:{blueprintId:compiled.blueprint.id,name:compiled.blueprint.name},cost:{},buildCost:compiled.cost}};
  }
  if(bindings.kind==='experience'){
    exact(bindings,['kind'],'Experience binding');allow(['ta']);
    if(parsed.mode!=='a'||parsed.verb!=='honi'||roleWord(parsed,'ta')!=='loma'||parsed.manner.length)fail('LUMA_BINDING','This record accepts the speaker’s own awe at the sky: a mi me honi ta loma he.');
    return {parsed,operation:'experience.record',payload:{},context:{kind:'experience'},preview:{context:{playerId},cost:{}}};
  }
  fail('LUMA_BINDING','Choose a project, gift, blueprint or own-experience binding.');
}
const held=(state,item)=>Object.values(state.players).reduce((n,p)=>n+p.inventory[item],0)+
  state.nodes.filter(node=>node.item===item).reduce((n,node)=>n+node.remaining,0)+state.treasury[item]+
  state.offers.filter(o=>o.status==='open'&&o.give.item===item).reduce((n,o)=>n+o.give.quantity,0)+
  (state.gifts||[]).filter(g=>g.status==='open'&&g.give.item===item).reduce((n,g)=>n+g.give.quantity,0)+
  state.projects.reduce((n,p)=>n+(p.delivered[item]||0),0)+Cosmos.held(state,item);
export function custody(state){return {residual:Object.fromEntries(ITEMS.map(item=>[item,held(state,item)-state.totals[item]]))};}
function genesis(now) {
  const totals=emptyBag();totals.marks=500;for(const node of NODE_DEFINITIONS)totals[node.item]+=node.initial;
  const treasury=emptyBag();treasury.marks=totals.marks;
  return {schemaVersion:4,cosmos:Cosmos.cosmosState(),rulesVersion:RULES_VERSION,realmId:randomUUID(),revision:0,createdAt:now,players:{},nodes:NODE_DEFINITIONS.map(node=>({...node,remaining:node.initial})),
    offers:[],projects:PROJECT_DEFINITIONS.map(p=>({...p,required:{...p.required},delivered:Object.fromEntries(Object.keys(p.required).map(item=>[item,0])),complete:false,contributors:{}})),
    treasury,totals,agents:{},chat:[],events:[],blueprints:[],gifts:[],luma:{schema:1,utterances:[]}};
}
function assertState(s) {
  const corrupt=message=>fail('CORRUPT_REALM',`Realm custody refused: ${message}`,503);
  if(!object(s)||s.schemaVersion!==4||s.rulesVersion!==RULES_VERSION||!Number.isSafeInteger(s.revision)||s.revision<0||typeof s.realmId!=='string'||!object(s.players)||!object(s.agents))corrupt('invalid realm schema');
  const bag=(b,label)=>{if(!object(b)||Object.keys(b).length!==ITEMS.length||ITEMS.some(k=>!Number.isSafeInteger(b[k])||b[k]<0||b[k]>1000000))corrupt(`invalid ${label}`);};
  bag(s.treasury,'treasury');bag(s.totals,'genesis supply');
  const expected=genesis(0).totals;if(ITEMS.some(k=>s.totals[k]!==expected[k]))corrupt('genesis supply changed');
  if(!Array.isArray(s.nodes)||s.nodes.length!==NODE_DEFINITIONS.length||!Array.isArray(s.projects)||s.projects.length!==PROJECT_DEFINITIONS.length||!Array.isArray(s.offers)||s.offers.length>10000)corrupt('invalid collections');
  const ids=new Set();for(const n of s.nodes){const original=NODE_DEFINITIONS.find(d=>d.id===n.id);if(!original||ids.has(n.id)||Object.keys(original).some(k=>n[k]!==original[k])||!Number.isSafeInteger(n.remaining)||n.remaining<0||n.remaining>n.initial)corrupt('invalid resource node');ids.add(n.id);}
  const projectIds=new Set();for(const p of s.projects){const original=PROJECT_DEFINITIONS.find(d=>d.id===p.id);if(!original||projectIds.has(p.id)||p.name!==original.name||p.x!==original.x||p.z!==original.z||canonical(p.required)!==canonical(original.required)||!object(p.delivered)||Object.keys(p.delivered).length!==Object.keys(original.required).length||!object(p.contributors))corrupt('invalid public project');projectIds.add(p.id);
    for(const [item,total] of Object.entries(original.required))if(!Number.isSafeInteger(p.delivered[item])||p.delivered[item]<0||p.delivered[item]>total)corrupt('invalid public project progress');
    if(p.complete!==Object.entries(p.required).every(([item,n])=>p.delivered[item]===n))corrupt('invalid public project completion');
    const contributed=Object.values(p.contributors).reduce((n,c)=>n+c,0);if(Object.entries(p.contributors).some(([id,n])=>!s.players[id]||!Number.isSafeInteger(n)||n<1)||contributed!==Object.values(p.delivered).reduce((a,b)=>a+b,0))corrupt('invalid project contributors');
  }
  const bridgeOpen=s.projects.find(p=>p.id==='crossing').complete;
  if(Object.keys(s.players).length>500)corrupt('too many principals');
  for(const [id,p] of Object.entries(s.players)){if(id!==p.id||typeof p.name!=='string'||!p.name.trim()||p.name.length>32||!traversable(bridgeOpen,p.x,p.z)||!Number.isSafeInteger(p.createdAt)||!Number.isSafeInteger(p.lastMoveAt)||!Number.isSafeInteger(p.lastGatherAt)||!Number.isSafeInteger(p.lastChatAt))corrupt('invalid principal');bag(p.inventory,'player inventory');}
  const offerIds=new Set();for(const o of s.offers){if(typeof o.id!=='string'||offerIds.has(o.id)||!s.players[o.sellerId]||!['open','filled','cancelled'].includes(o.status))corrupt('invalid offer');offerIds.add(o.id);for(const term of [o.give,o.want])if(!object(term)||!ITEMS.includes(term.item)||!Number.isSafeInteger(term.quantity)||term.quantity<1||term.quantity>10000)corrupt('invalid escrow terms');if(o.give.item===o.want.item||o.status==='filled'&&(!s.players[o.buyerId]||o.buyerId===o.sellerId))corrupt('invalid offer settlement');}
  if(!Array.isArray(s.gifts)||s.gifts.length>6200||s.gifts.filter(g=>g.status!=='open').length>200)corrupt('invalid gift collection');
  const giftIds=new Set(),sent=new Map(),received=new Map();
  for(const g of s.gifts){
    if(!object(g)||typeof g.id!=='string'||giftIds.has(g.id)||!own(s.players,g.senderId)||!own(s.players,g.recipientId)||g.senderId===g.recipientId||!['open','accepted','declined','cancelled'].includes(g.status)||!Number.isSafeInteger(g.createdAt))corrupt('invalid gift');
    giftIds.add(g.id);if(!object(g.give)||!ITEMS.includes(g.give.item)||!Number.isSafeInteger(g.give.quantity)||g.give.quantity<1||g.give.quantity>10000)corrupt('invalid gift custody');
    if(g.status==='open'){sent.set(g.senderId,(sent.get(g.senderId)||0)+1);received.set(g.recipientId,(received.get(g.recipientId)||0)+1);}
    else if(!Number.isSafeInteger(g.closedAt)||g.closedAt<g.createdAt)corrupt('invalid gift settlement');
  }
  if([...sent.values(),...received.values()].some(n=>n>12))corrupt('too many open gifts');
  if(!object(s.luma)||s.luma.schema!==1||!Array.isArray(s.luma.utterances)||s.luma.utterances.length>80)corrupt('invalid language history');
  let utteranceId=0;
  for(const u of s.luma.utterances){
    if(!object(u)||!Number.isSafeInteger(u.id)||u.id<=utteranceId||u.id>s.revision||!Number.isSafeInteger(u.at)||!own(s.players,u.playerId)||typeof u.text!=='string'||u.text.length>512||typeof u.latin!=='string'||typeof u.native!=='string'||!object(u.context)||!object(u.result))corrupt('invalid language record');
    utteranceId=u.id;
    try{const resolved=resolveLuma(s,u.playerId,u.text,u.context),parsed=resolved.parsed;if(parsed.mode!==u.mode||parsed.latin!==u.latin||toNative(u.latin)!==u.native||u.result.mode!==u.mode||u.result.operation!==u.operation||resolved.operation!==u.operation||canonical(resolved.context)!==canonical(u.context)||u.result.status!==u.status||u.result.utteranceId!==u.id||u.result.latin!==u.latin||u.result.native!==u.native||typeof u.result.ready!=='boolean'||u.status!==LUMA_STATUS[u.mode]||u.mode==='pe'&&(!u.result.ready||!object(u.result.effect))||u.result.blocker&&(!object(u.result.blocker)||typeof u.result.blocker.code!=='string'||typeof u.result.blocker.message!=='string'||u.result.ready))corrupt('language provenance disagrees');}catch{corrupt('unreadable language provenance');}
  }
  for(const [id,g] of Object.entries(s.agents)){if(id!==g.id||!s.players[g.playerId]||!Array.isArray(g.scopes)||!g.scopes.length||new Set(g.scopes).size!==g.scopes.length||g.scopes.some(op=>!COMMAND_SCOPES.includes(op))||!Number.isSafeInteger(g.remaining)||g.remaining<0||g.remaining>1000||typeof g.revoked!=='boolean'||!Number.isSafeInteger(g.expiresAt))corrupt('invalid agent grant');}
  if(!Array.isArray(s.chat)||s.chat.length>80||s.chat.some(c=>!s.players[c.playerId]||typeof c.text!=='string'||c.text.length>280)||!Array.isArray(s.events)||s.events.length>100)corrupt('invalid social history');
  if(!Array.isArray(s.blueprints)||s.blueprints.length>64)corrupt('invalid blueprint shelf');
  const publications=new Set(),authors={};for(const entry of s.blueprints){if(!object(entry)||typeof entry.id!=='string'||publications.has(entry.id)||!s.players[entry.authorId]||!Number.isSafeInteger(entry.publishedAt))corrupt('invalid blueprint attribution');publications.add(entry.id);authors[entry.authorId]=(authors[entry.authorId]||0)+1;if(authors[entry.authorId]>8)corrupt('too many authored publications');try{if(canonical(compileBlueprint(entry.blueprint).blueprint)!==canonical(entry.blueprint))corrupt('noncanonical blueprint');}catch{corrupt('invalid published blueprint');}}
  try{Cosmos.validateCosmos(s);}catch(error){corrupt(error.message);}
  if(Object.values(custody(s).residual).some(value=>value!==0))corrupt('material or currency conservation failed');
  return s;
}

export class SharedRealm {
  constructor({path,now=()=>Date.now(),beforeCommit=null}={}) {
    if(!path)throw Error('An explicit SQLite path is required.');
    this.now=now;this.beforeCommit=beforeCommit;this.presence=new Map();
    if(path!==':memory:'){const full=resolve(path);mkdirSync(dirname(full),{recursive:true,mode:0o700});path=full;}
    this.path=path;
    try {
      const existed=path!==':memory:'&&existsSync(path);this.db=new DatabaseSync(path);
      this.db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=3000;');
      if(path!==':memory:')chmodSync(path,0o600);
      if(existed&&this.db.prepare("SELECT count(*) AS n FROM sqlite_master WHERE type='table' AND name='realm'").get().n===0)fail('CORRUPT_REALM','An existing database is not an Anima shared realm.',503);
      this.db.exec(`CREATE TABLE IF NOT EXISTS realm(id INTEGER PRIMARY KEY CHECK(id=1), state TEXT NOT NULL, checksum TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS secrets(id INTEGER PRIMARY KEY CHECK(id=1), secret TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS credentials(id TEXT PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL, player_id TEXT NOT NULL, role TEXT NOT NULL, expires_at INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS arrivals(key_hash TEXT PRIMARY KEY, name TEXT NOT NULL, credential_id TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS receipts(credential_id TEXT NOT NULL, command_key TEXT NOT NULL, bytes TEXT NOT NULL, receipt TEXT NOT NULL, checksum TEXT NOT NULL, PRIMARY KEY(credential_id,command_key));
        CREATE TABLE IF NOT EXISTS journal(revision INTEGER PRIMARY KEY, at INTEGER NOT NULL, player_id TEXT, credential_id TEXT, op TEXT NOT NULL, transfers TEXT NOT NULL, previous_hash TEXT NOT NULL, hash TEXT NOT NULL);`);
      if(!this.db.prepare('SELECT id FROM realm WHERE id=1').get()){
        if(existed)fail('CORRUPT_REALM','The existing realm has lost its authoritative state.',503);
        this.db.exec('BEGIN IMMEDIATE');try{const state=genesis(this.now());this.write(state);this.db.prepare('INSERT INTO secrets(id,secret) VALUES(1,?)').run(randomBytes(32).toString('hex'));this.db.exec('COMMIT');}catch(error){this.db.exec('ROLLBACK');throw error;}
      }
      const integrity=this.db.prepare('PRAGMA integrity_check').get();if(integrity.integrity_check!=='ok')fail('CORRUPT_REALM','SQLite integrity check failed.',503);
      this.secret=this.db.prepare('SELECT secret FROM secrets WHERE id=1').get()?.secret;if(!/^[a-f0-9]{64}$/.test(this.secret||''))fail('CORRUPT_REALM','The realm credential secret is missing.',503);
      const s=this.read();this.validateJournal(s);this.validateCredentials(s);this.validateReceipts();
    }catch(error){try{this.db?.close();}catch{}throw error;}
  }
  read(){const row=this.db.prepare('SELECT state,checksum FROM realm WHERE id=1').get();if(!row||hash(row.state)!==row.checksum)fail('CORRUPT_REALM','Stored realm checksum does not match; refusing to reset custody.',503);let s;try{s=JSON.parse(row.state);}catch{fail('CORRUPT_REALM','Stored realm JSON cannot be read.',503);}if(object(s)&&!Object.hasOwn(s,'schemaVersion')){s.schemaVersion=2;if(!Object.hasOwn(s,'blueprints'))s.blueprints=[];}if(object(s)&&s.schemaVersion===2){s.schemaVersion=3;if(!Object.hasOwn(s,'gifts'))s.gifts=[];if(!Object.hasOwn(s,'luma'))s.luma={schema:1,utterances:[]};}return assertState(Cosmos.migrateCosmos(s));}
  write(s){assertState(s);const bytes=JSON.stringify(s);this.db.prepare('INSERT INTO realm(id,state,checksum) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET state=excluded.state,checksum=excluded.checksum').run(bytes,hash(bytes));}
  validateCredentials(s){for(const c of this.db.prepare('SELECT * FROM credentials').all())if(!own(s.players,c.player_id)||!['owner','agent'].includes(c.role)||c.role==='agent'&&(!own(s.agents,c.id)||s.agents[c.id].playerId!==c.player_id)||!/^[a-f0-9]{64}$/.test(c.token_hash))fail('CORRUPT_REALM','Credential custody references an unknown principal or grant.',503);for(const a of this.db.prepare('SELECT * FROM arrivals').all()){const c=this.db.prepare('SELECT * FROM credentials WHERE id=?').get(a.credential_id);if(!/^[a-f0-9]{64}$/.test(a.key_hash)||!c||c.role!=='owner'||own(s.players,c.player_id)?.name!==a.name)fail('CORRUPT_REALM','An arrival receipt has lost its owning session.',503);}}
  validateJournal(s){let previous='',expected=1;const balances=new Map(),account=id=>{if(!balances.has(id))balances.set(id,emptyBag());return balances.get(id);};account('treasury').marks=500;for(const node of NODE_DEFINITIONS)account('node:'+node.id)[node.item]=node.initial;
    for(const row of this.db.prepare('SELECT * FROM journal ORDER BY revision').iterate()){
      let transfers;try{transfers=JSON.parse(row.transfers);}catch{fail('CORRUPT_REALM','The command journal cannot be parsed.',503);}
      if(row.revision!==expected++||row.previous_hash!==previous||!Array.isArray(transfers)||hash(canonical({revision:row.revision,at:row.at,playerId:row.player_id,credentialId:row.credential_id,op:row.op,transfers,previous:row.previous_hash}))!==row.hash)fail('CORRUPT_REALM','The durable command journal failed verification.',503);previous=row.hash;
      for(const transfer of transfers){if(!object(transfer)||typeof transfer.from!=='string'||typeof transfer.to!=='string'||!ITEMS.includes(transfer.item)||!Number.isSafeInteger(transfer.quantity)||transfer.quantity<1||account(transfer.from)[transfer.item]<transfer.quantity)fail('CORRUPT_REALM','The custody journal contains an unfunded transfer.',503);account(transfer.from)[transfer.item]-=transfer.quantity;account(transfer.to)[transfer.item]+=transfer.quantity;}
    }
    if(expected-1!==s.revision)fail('CORRUPT_REALM','The durable journal and realm revision disagree.',503);
    const final=new Map([['treasury',s.treasury],...Cosmos.accounts(s)]);for(const p of Object.values(s.players))final.set('player:'+p.id,p.inventory);for(const node of s.nodes)final.set('node:'+node.id,{...emptyBag(),[node.item]:node.remaining});for(const offer of s.offers)final.set('escrow:'+offer.id,{...emptyBag(),...(offer.status==='open'?{[offer.give.item]:offer.give.quantity}:{})});for(const gift of s.gifts)final.set('gift:'+gift.id,{...emptyBag(),...(gift.status==='open'?{[gift.give.item]:gift.give.quantity}:{})});for(const p of s.projects)final.set('project:'+p.id,{...emptyBag(),...p.delivered});
    for(const id of new Set([...balances.keys(),...final.keys()]))if(ITEMS.some(item=>(balances.get(id)?.[item]||0)!==(final.get(id)?.[item]||0)))fail('CORRUPT_REALM','The custody journal does not reconstruct the current asset owners.',503);
  }
  validateReceipts(){for(const saved of this.db.prepare('SELECT * FROM receipts').iterate()){
    if(hash(saved.bytes+'\n'+saved.receipt)!==saved.checksum)fail('CORRUPT_REALM','A durable command receipt failed checksum verification.',503);
    let envelope,receipt;try{envelope=JSON.parse(saved.bytes);receipt=JSON.parse(saved.receipt);}catch{fail('CORRUPT_REALM','A durable receipt cannot be parsed.',503);}
    const row=this.db.prepare('SELECT * FROM journal WHERE revision=?').get(receipt.revision);
    if(!row||row.credential_id!==saved.credential_id||row.op!==receipt.op||envelope.op!==receipt.op||envelope.key!==saved.command_key||receipt.key!==envelope.key)fail('CORRUPT_REALM','A durable receipt does not match its committed command.',503);
  }}
  append(s,actor,op,transfers){const previous=this.db.prepare('SELECT hash FROM journal ORDER BY revision DESC LIMIT 1').get()?.hash||'';const row={revision:s.revision,at:this.now(),playerId:actor?.player_id||null,credentialId:actor?.id||null,op,transfers,previous};this.db.prepare('INSERT INTO journal(revision,at,player_id,credential_id,op,transfers,previous_hash,hash) VALUES(?,?,?,?,?,?,?,?)').run(row.revision,row.at,row.playerId,row.credentialId,op,JSON.stringify(transfers),previous,hash(canonical(row)));}
  transaction(fn){this.db.exec('BEGIN IMMEDIATE');try{const result=fn();if(this.beforeCommit)this.beforeCommit();this.db.exec('COMMIT');return result;}catch(error){this.db.exec('ROLLBACK');throw error;}}
  credential(token,state=this.read()) {
    if(typeof token!=='string'||token.length<32||token.length>256)fail('UNAUTHENTICATED','Create a session or reconnect with its saved token.',401);
    const c=this.db.prepare('SELECT * FROM credentials WHERE token_hash=?').get(hash(token));
    if(!c||c.expires_at<=this.now()||!state.players[c.player_id])fail('UNAUTHENTICATED','This session is unknown or expired.',401);
    if(c.role==='agent'){const grant=state.agents[c.id];if(!grant||grant.revoked||grant.expiresAt<=this.now())fail('AGENT_REVOKED','This agent grant is revoked or expired.',401);}
    this.presence.set(c.player_id,this.now());return c;
  }
  createSession(body) {
    const keyed=object(body)&&Object.hasOwn(body,'key');exact(body,keyed?['name','key']:['name'],'Session');const name=plainText(body.name,1,32,'Name');
    if(keyed&&(typeof body.key!=='string'||!/^[A-Za-z0-9._:-]{16,128}$/.test(body.key)))fail('INVALID_SESSION_KEY','Use a random 16–128 character arrival key.');
    const token=keyed?'ak_'+createHmac('sha256',this.secret).update('session:'+body.key).digest('base64url'):'ak_'+randomBytes(32).toString('base64url');
    return this.transaction(()=>{const s=this.read();
      if(keyed){const saved=this.db.prepare('SELECT * FROM arrivals WHERE key_hash=?').get(hash(body.key));if(saved){if(saved.name!==name)fail('SESSION_KEY_COLLISION','This arrival key belongs to a different name.',409);const c=this.credential(token,s);if(c.id!==saved.credential_id)fail('CORRUPT_REALM','This arrival receipt disagrees with its credential.',503);return {token,playerId:c.player_id,expiresAt:c.expires_at,replayed:true,state:this.view(s,c)};}}
      if(Object.keys(s.players).length>=500)fail('REALM_FULL','This realm has reached its 500-principal limit.',503);
      const now=this.now(),id=randomUUID(),playerId=randomUUID(),expiresAt=now+30*86400*1000;
      const c={id,player_id:playerId,role:'owner',expires_at:expiresAt};
      s.players[playerId]={id:playerId,name,...SPAWN,createdAt:now,lastMoveAt:now,lastGatherAt:now-900,lastChatAt:now-1000,inventory:emptyBag()};
      this.db.prepare('INSERT INTO credentials VALUES(?,?,?,?,?)').run(id,hash(token),playerId,'owner',expiresAt);if(keyed)this.db.prepare('INSERT INTO arrivals VALUES(?,?,?)').run(hash(body.key),name,id);s.revision++;this.append(s,c,'session.create',[]);this.write(s);this.presence.set(playerId,now);
      return {token,playerId,expiresAt,replayed:false,state:this.view(s,c)};
    });
  }
  agentToken(id){return 'aka_'+createHmac('sha256',this.secret).update('agent:'+id).digest('base64url');}
  state(token){const s=this.read();return this.view(s,this.credential(token,s));}
  view(s,c){const p=s.players[c.player_id],agent=c.role==='agent'?s.agents[c.id]:false;
    return {rulesVersion:s.rulesVersion,realmId:s.realmId,revision:s.revision,serverTime:this.now(),cosmos:Cosmos.cosmosView(s,p.id,this.now()),you:{id:p.id,name:p.name,x:p.x,z:p.z,inventory:{...p.inventory},agent:agent?{id:agent.id,scopes:[...agent.scopes],remaining:agent.remaining}:false,expiresAt:c.expires_at},
      world:{bridgeOpen:s.projects.find(p=>p.id==='crossing').complete,bounds:BOUNDS,bridge:BRIDGE,obstacles:OBSTACLES,spawn:SPAWN},
      players:Object.values(s.players).map(p=>({id:p.id,name:p.name,x:p.x,z:p.z,online:(this.presence.get(p.id)||-Infinity)>this.now()-20000})),
      nodes:s.nodes.map(n=>({...n})),offers:s.offers.filter(o=>o.status==='open'||o.sellerId===p.id||o.buyerId===p.id).slice(-200).map(o=>({...o,sellerName:s.players[o.sellerId].name})),
      projects:structuredClone(s.projects),treasury:{...s.treasury},market:MARKET,totals:{...s.totals},ledger:custody(s),chat:structuredClone(s.chat),events:structuredClone(s.events),
      agents:agent?[]:Object.values(s.agents).filter(g=>g.playerId===p.id).map(g=>({...g})),
      blueprints:s.blueprints.map(entry=>({...structuredClone(entry),authorName:s.players[entry.authorId].name})),
      gifts:s.gifts.filter(g=>g.senderId===p.id||g.recipientId===p.id).map(g=>({...structuredClone(g),senderName:s.players[g.senderId].name,recipientName:s.players[g.recipientId].name})),
      luma:{schema:1,utterances:s.luma.utterances.map(u=>({...structuredClone(u),playerName:s.players[u.playerId].name}))}};
  }
  command(token,envelope) {
    exact(envelope,['key','expectedRevision','op','payload'],'Command');
    if(typeof envelope.key!=='string'||!/^[A-Za-z0-9._:-]{8,96}$/.test(envelope.key))fail('INVALID_KEY','Use a unique 8–96 character command key.');
    integer(envelope.expectedRevision,0,Number.MAX_SAFE_INTEGER,'Expected revision');
    if(typeof envelope.op!=='string'||!object(envelope.payload))fail('INVALID_SHAPE','Operation and object payload are required.');
    const bytes=canonical(envelope);
    return this.transaction(()=>{
      const s=this.read(),c=this.credential(token,s),saved=this.db.prepare('SELECT * FROM receipts WHERE credential_id=? AND command_key=?').get(c.id,envelope.key);
      if(saved){if(hash(saved.bytes+'\n'+saved.receipt)!==saved.checksum)fail('CORRUPT_REALM','The retained receipt failed integrity verification.',503);if(!timingSafeEqual(Buffer.from(hash(saved.bytes)),Buffer.from(hash(bytes))))fail('KEY_COLLISION','This command key was already used with different command bytes.',409);const receipt=JSON.parse(saved.receipt);if(receipt.op==='agent.create')receipt.result.token=this.agentToken(receipt.result.agentId);return {receipt:{...receipt,replayed:true},state:this.view(s,c)};}
      if(envelope.expectedRevision!==s.revision)fail('REVISION_CONFLICT','The shared world changed. Refresh before submitting this intent.',409);
      if(c.role==='agent'){const grant=s.agents[c.id];if(!grant.scopes.includes(envelope.op))fail('AGENT_SCOPE','The owner did not grant this command scope.',403);if(grant.remaining<1)fail('AGENT_ALLOWANCE','This agent action allowance is exhausted.',403);}
      const transfers=[],result=this.dispatch(s,c,envelope.op,envelope.payload,transfers);
      if(c.role==='agent')s.agents[c.id].remaining--;
      s.revision++;const receipt={key:envelope.key,op:envelope.op,revision:s.revision,result};
      this.append(s,c,envelope.op,transfers);this.write(s);const receiptBytes=JSON.stringify(receipt);this.db.prepare('INSERT INTO receipts VALUES(?,?,?,?,?)').run(c.id,envelope.key,bytes,receiptBytes,hash(bytes+'\n'+receiptBytes));
      if(envelope.op==='agent.create')result.token=this.agentToken(result.agentId);
      return {receipt:{...receipt,replayed:false},state:this.view(s,c)};
    });
  }
  transfer(s,transfers,fromId,from,toId,to,item,quantity) {
    if(from[item]<quantity)fail('INSUFFICIENT_FUNDS',`The source does not hold ${quantity} ${item}.`,409);
    from[item]-=quantity;to[item]+=quantity;transfers.push({from:fromId,to:toId,item,quantity});
  }
  speak(s,c,payload,transfers){
    exact(payload,['text','bindings'],'Luma statement');
    const resolved=resolveLuma(s,c.player_id,payload.text,payload.bindings),{parsed,operation}=resolved,mode=parsed.mode;
    if(mode==='pe'&&c.role==='agent'&&!s.agents[c.id].scopes.includes(operation))fail('AGENT_SCOPE',`The owner must also grant ${operation} before a Luma undertaking can enact it.`,403);
    const result={mode,status:LUMA_STATUS[mode],operation,ready:true,preview:resolved.preview,utteranceId:s.revision+1,latin:parsed.latin,native:toNative(parsed.latin)};
    if(operation==='experience.record')result.effect={recorded:true};
    else if(mode==='pe')result.effect=this.dispatch(s,c,operation,resolved.payload,transfers);
    else{
      // Resolve reach, stock, capacity and funding against a throwaway state.
      // The resulting readiness is a report; it never reserves any inventory.
      try{const preview=this.dispatch(structuredClone(s),c,operation,resolved.payload,[]);if(operation==='project.contribute'){result.preview.complete=preview.complete;result.preview.reward=preview.reward;}}
      catch(error){if(!(error instanceof RealmError))throw error;result.ready=false;result.blocker={code:error.code,message:error.message};}
    }
    const entry={id:result.utteranceId,at:this.now(),playerId:c.player_id,text:payload.text.trim(),latin:result.latin,native:result.native,mode,status:result.status,operation,context:resolved.context,result:structuredClone(result)};
    s.luma.utterances.push(entry);s.luma.utterances=s.luma.utterances.slice(-80);return result;
  }
  dispatch(s,c,op,payload,transfers) {
    const p=s.players[c.player_id],now=this.now(),owner=()=>{if(c.role!=='owner')fail('OWNER_REQUIRED','Only the owning session can manage grants.',403);};
    const event=text=>{s.events.push({id:s.revision+1,at:now,playerId:p.id,text});s.events=s.events.slice(-100);};
    const near=(point,range)=>{if(distance(p,point)>range)fail('OUT_OF_REACH','Walk closer to this place first.',409);};
    if(op.startsWith('cosmos.')){try{return Cosmos.dispatchCosmos(s,c,op,payload,now,transfers);}catch(error){fail('COSMOS_RULE',error.message,409);}}
    if(op==='luma.speak')return this.speak(s,c,payload,transfers);
    if(op==='move'){
      exact(payload,['dx','dz']);for(const key of ['dx','dz'])if(typeof payload[key]!=='number'||!Number.isFinite(payload[key])||Math.abs(payload[key])>1)fail('INVALID_MOVEMENT','Movement axes must be finite numbers from -1 to 1.');
      moveIntent(p,s.projects.find(p=>p.id==='crossing').complete,payload.dx,payload.dz,now-p.lastMoveAt);p.lastMoveAt=Math.max(p.lastMoveAt,now);return {x:p.x,z:p.z};
    }
    if(op==='gather'){
      exact(payload,['nodeId']);const node=s.nodes.find(n=>n.id===payload.nodeId);if(!node)fail('UNKNOWN_NODE','That resource node does not exist.');near(node,3);
      const cadence=Cosmos.gatheringDelay(s,p.id,now);if(now-p.lastGatherAt<cadence)fail('COOLDOWN',cadence===900?'Gathering takes 0.9 seconds per unit.':`Your current gathering cadence is ${(cadence/1000).toFixed(2)} seconds.`,429);if(node.remaining<1)fail('RESOURCE_EMPTY','This finite deposit is exhausted.',409);
      node.remaining--;p.inventory[node.item]++;p.lastGatherAt=now;transfers.push({from:'node:'+node.id,to:'player:'+p.id,item:node.item,quantity:1});return {item:node.item,quantity:1,remaining:node.remaining};
    }
    if(op==='offer.create'){
      exact(payload,['give','want']);const give=itemAmount(payload.give),want=itemAmount(payload.want);if(give.item===want.item)fail('INVALID_OFFER','Offer different assets on the two sides.');
      if(s.offers.filter(o=>o.status==='open'&&o.sellerId===p.id).length>=12||s.offers.length>=10000)fail('OFFER_LIMIT','The bounded offer book is full.',409);
      if(p.inventory[give.item]<give.quantity)fail('INSUFFICIENT_FUNDS','You do not own the offered quantity.',409);
      const offer={id:randomUUID(),sellerId:p.id,give,want,status:'open',createdAt:now};p.inventory[give.item]-=give.quantity;s.offers.push(offer);transfers.push({from:'player:'+p.id,to:'escrow:'+offer.id,...give});event(`${p.name} offered ${give.quantity} ${give.item} for ${want.quantity} ${want.item}.`);return {offerId:offer.id};
    }
    if(op==='offer.cancel'||op==='offer.fill'){
      exact(payload,['offerId']);const offer=s.offers.find(o=>o.id===payload.offerId);if(!offer)fail('UNKNOWN_OFFER','That offer does not exist.');if(offer.status!=='open')fail('OFFER_CLOSED','That offer is already settled or cancelled.',409);
      if(op==='offer.cancel'){
        if(offer.sellerId!==p.id)fail('NOT_OWNER','Only the seller can cancel this offer.',403);
        p.inventory[offer.give.item]+=offer.give.quantity;offer.status='cancelled';offer.closedAt=now;transfers.push({from:'escrow:'+offer.id,to:'player:'+p.id,...offer.give});return {offerId:offer.id,status:offer.status};
      }
      if(offer.sellerId===p.id)fail('SELF_TRADE','The seller cannot fill their own offer.');
      const seller=s.players[offer.sellerId];this.transfer(s,transfers,'player:'+p.id,p.inventory,'player:'+seller.id,seller.inventory,offer.want.item,offer.want.quantity);
      p.inventory[offer.give.item]+=offer.give.quantity;transfers.push({from:'escrow:'+offer.id,to:'player:'+p.id,...offer.give});offer.status='filled';offer.buyerId=p.id;offer.closedAt=now;event(`${p.name} completed an exchange with ${seller.name}.`);return {offerId:offer.id,status:offer.status};
    }
    if(op==='gift.offer'){
      exact(payload,['recipientId','give']);const recipient=own(s.players,payload.recipientId);if(!recipient)fail('UNKNOWN_RECIPIENT','Select an existing recipient.');if(recipient.id===p.id)fail('SELF_GIFT','Choose another person to receive this gift.');
      const give=itemAmount(payload.give);
      if(s.gifts.filter(g=>g.status==='open'&&g.senderId===p.id).length>=12||s.gifts.filter(g=>g.status==='open'&&g.recipientId===recipient.id).length>=12)fail('GIFT_LIMIT','A person may send and receive at most twelve open gifts at a time.',409);
      if(p.inventory[give.item]<give.quantity)fail('INSUFFICIENT_FUNDS','You do not own the offered gift.',409);
      const gift={id:randomUUID(),senderId:p.id,recipientId:recipient.id,give,status:'open',createdAt:now};
      p.inventory[give.item]-=give.quantity;s.gifts.push(gift);transfers.push({from:'player:'+p.id,to:'gift:'+gift.id,...give});event(`${p.name} offered a gift to ${recipient.name}.`);return {giftId:gift.id,status:gift.status,recipientId:recipient.id};
    }
    if(['gift.accept','gift.decline','gift.cancel'].includes(op)){
      exact(payload,['giftId']);const gift=s.gifts.find(g=>g.id===payload.giftId);if(!gift)fail('UNKNOWN_GIFT','That gift does not exist.');if(gift.status!=='open')fail('GIFT_CLOSED','That gift is already accepted, declined or withdrawn.',409);
      if(op==='gift.cancel'?gift.senderId!==p.id:gift.recipientId!==p.id)fail('NOT_OWNER',op==='gift.cancel'?'Only the sender can withdraw a gift.':'Only the recipient can welcome or decline a gift.',403);
      const accepted=op==='gift.accept',receiver=s.players[accepted?gift.recipientId:gift.senderId];
      receiver.inventory[gift.give.item]+=gift.give.quantity;transfers.push({from:'gift:'+gift.id,to:'player:'+receiver.id,...gift.give});gift.status=accepted?'accepted':op==='gift.decline'?'declined':'cancelled';gift.closedAt=now;
      // A bounded history cannot evict an open escrow, however old it is.
      // Move this settlement to the end so “recent” follows closure order.
      s.gifts=s.gifts.filter(g=>g.id!==gift.id);s.gifts.push(gift);
      const recent=new Set(s.gifts.filter(g=>g.status!=='open').slice(-200).map(g=>g.id));s.gifts=s.gifts.filter(g=>g.status==='open'||recent.has(g.id));
      event(`${p.name} ${accepted?'welcomed':op==='gift.decline'?'declined':'withdrew'} a gift.`);return {giftId:gift.id,status:gift.status};
    }
    if(op==='project.contribute'){
      exact(payload,['projectId','item','quantity']);const project=s.projects.find(p=>p.id===payload.projectId);if(!project)fail('UNKNOWN_PROJECT','That public project does not exist.');near(project,6);
      if(project.complete)fail('PROJECT_COMPLETE','This project is already complete.',409);if(!Object.hasOwn(project.required,payload.item))fail('WRONG_MATERIAL','This project does not require that material.');integer(payload.quantity,1,100,'Quantity');
      if(project.delivered[payload.item]+payload.quantity>project.required[payload.item])fail('OVERFUND','This would exceed the remaining project requirement.',409);
      if(p.inventory[payload.item]<payload.quantity)fail('INSUFFICIENT_FUNDS','You do not own these materials.',409);
      const reward=Math.min(s.treasury.marks,payload.quantity*2);p.inventory[payload.item]-=payload.quantity;project.delivered[payload.item]+=payload.quantity;project.contributors[p.id]=(project.contributors[p.id]||0)+payload.quantity;
      transfers.push({from:'player:'+p.id,to:'project:'+project.id,item:payload.item,quantity:payload.quantity});if(reward)this.transfer(s,transfers,'treasury',s.treasury,'player:'+p.id,p.inventory,'marks',reward);
      project.complete=Object.entries(project.required).every(([item,n])=>project.delivered[item]===n);event(`${p.name} contributed ${payload.quantity} ${payload.item} to ${project.name}${project.complete?' · complete':''}.`);return {projectId:project.id,complete:project.complete,reward};
    }
    if(op==='market.buy'||op==='market.sell'){
      exact(payload,['item','quantity']);near(MARKET,6);if(!MATERIALS.includes(payload.item))fail('UNKNOWN_ITEM','The exchange accepts existing materials.');integer(payload.quantity,1,100,'Quantity');
      const buy=op==='market.buy',price=MARKET[buy?'ask':'bid'][payload.item]*payload.quantity;
      const seller=buy?s.treasury:p.inventory,buyer=buy?p.inventory:s.treasury,sellerId=buy?'treasury':'player:'+p.id,buyerId=buy?'player:'+p.id:'treasury';
      if(seller[payload.item]<payload.quantity||buyer.marks<price)fail('INSUFFICIENT_FUNDS','The exchange has insufficient stock or one party cannot fund this trade.',409);
      this.transfer(s,transfers,sellerId,seller,buyerId,buyer,payload.item,payload.quantity);this.transfer(s,transfers,buyerId,buyer,sellerId,seller,'marks',price);return {item:payload.item,quantity:payload.quantity,marks:price};
    }
    if(op==='chat.send'){
      exact(payload,['text']);const text=plainText(payload.text,1,280,'Message');if(now-p.lastChatAt<1000)fail('CHAT_COOLDOWN','Wait one second between messages.',429);
      const entry={id:s.revision+1,playerId:p.id,name:p.name,text,at:now};s.chat.push(entry);s.chat=s.chat.slice(-80);p.lastChatAt=now;return {messageId:entry.id};
    }
    if(op==='blueprint.publish'){
      exact(payload,['blueprint']);if(s.blueprints.length>=64||s.blueprints.filter(b=>b.authorId===p.id).length>=8)fail('BLUEPRINT_LIMIT','The shelf holds 64 designs, at most eight per principal. Remove one before publishing another.',409);
      let blueprint;try{blueprint=compileBlueprint(payload.blueprint).blueprint;}catch(error){fail('INVALID_BLUEPRINT',error.message);}
      const id=randomUUID();s.blueprints.push({id,authorId:p.id,blueprint,publishedAt:now});event(`${p.name} shared the design ${blueprint.name}.`);return {publicationId:id};
    }
    if(op==='blueprint.remove'){
      exact(payload,['publicationId']);const index=s.blueprints.findIndex(b=>b.id===payload.publicationId);if(index<0)fail('UNKNOWN_BLUEPRINT','This publication is no longer on the shared shelf.',404);
      if(s.blueprints[index].authorId!==p.id)fail('NOT_OWNER','Only the author or their explicitly scoped delegate can remove this publication.',403);
      s.blueprints.splice(index,1);return {publicationId:payload.publicationId,removed:true};
    }
    if(op==='agent.create'){
      owner();exact(payload,['name','scopes','allowance','expiresInSeconds']);const name=plainText(payload.name,1,32,'Agent name');integer(payload.allowance,1,1000,'Allowance');integer(payload.expiresInSeconds,60,86400,'Grant lifetime');
      if(!Array.isArray(payload.scopes)||!payload.scopes.length||new Set(payload.scopes).size!==payload.scopes.length||payload.scopes.some(scope=>!COMMAND_SCOPES.includes(scope)))fail('INVALID_SCOPE','Choose unique scopes from the advertised command list.');
      if(Object.values(s.agents).filter(g=>g.playerId===p.id).length>=32)fail('GRANT_LIMIT','A principal may retain at most 32 agent grants.',409);
      const id=randomUUID(),expiresAt=now+payload.expiresInSeconds*1000;s.agents[id]={id,playerId:p.id,name,scopes:[...payload.scopes],remaining:payload.allowance,revoked:false,expiresAt,createdAt:now};
      this.db.prepare('INSERT INTO credentials VALUES(?,?,?,?,?)').run(id,hash(this.agentToken(id)),p.id,'agent',expiresAt);return {agentId:id,expiresAt};
    }
    if(op==='session.renew'){
      owner();exact(payload,[]);c.expires_at=now+30*86400*1000;this.db.prepare('UPDATE credentials SET expires_at=? WHERE id=?').run(c.expires_at,c.id);return {expiresAt:c.expires_at};
    }
    if(op==='agent.revoke'){
      owner();exact(payload,['agentId']);const g=s.agents[payload.agentId];if(!g||g.playerId!==p.id)fail('NOT_OWNER','Only the owner can revoke this grant.',403);g.revoked=true;return {agentId:g.id,revoked:true};
    }
    fail('UNKNOWN_COMMAND','This operation is not part of the shared realm command surface.');
  }
  close(){this.db.close();}
}
