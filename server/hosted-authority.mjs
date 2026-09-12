import {createHmac,randomBytes,randomUUID} from 'node:crypto';
import {HostedRules,RealmError,genesis,assertState,canonical,hash,exact,object,plainText,integer,fail} from './hosted-rules.mjs';

export {RealmError};

// One instance per request. D1 is authoritative; no game state is kept in a Worker global.
export class HostedRealm extends HostedRules {
 constructor(db,{now=()=>Date.now(),beforeCommit=null}={}){
  super();if(!db)fail('SERVICE_UNAVAILABLE','The shared world is temporarily unavailable.',503);
  this.db=db;this.now=now;this.beforeCommit=beforeCommit;this.presence=new Map();this.credentialWrites=[];
 }
 sql(query,...args){const statement=this.db.prepare(query);return args.length?statement.bind(...args):statement;}
 async load(){
  let row=await this.sql('SELECT * FROM commons_realm WHERE id=1').first();
  if(!row){
   const state=JSON.stringify(genesis(this.now()));
   await this.sql(`INSERT OR IGNORE INTO commons_realm(id,state,checksum,revision,secret,head_hash,commit_id)
    SELECT 1,?,?,0,?,'',? WHERE NOT EXISTS(SELECT 1 FROM commons_credentials)
    AND NOT EXISTS(SELECT 1 FROM commons_arrivals) AND NOT EXISTS(SELECT 1 FROM commons_receipts)
    AND NOT EXISTS(SELECT 1 FROM commons_journal)`,state,hash(state),randomBytes(32).toString('hex'),randomUUID()).run();
   row=await this.sql('SELECT * FROM commons_realm WHERE id=1').first();
  }
  if(!row||hash(row.state)!==row.checksum||!/^[a-f0-9]{64}$/.test(row.secret))fail('CORRUPT_REALM','The shared record failed verification; its resources have not been reset.',503);
  let state;try{state=assertState(JSON.parse(row.state));}catch(error){if(error instanceof RealmError)throw error;fail('CORRUPT_REALM','The shared record cannot be read.',503);}
  if(state.revision!==row.revision)fail('CORRUPT_REALM','The shared revision does not match its record.',503);
  if(row.revision){const last=await this.sql('SELECT hash FROM commons_journal WHERE revision=?',row.revision).first();if(!last||last.hash!==row.head_hash)fail('CORRUPT_REALM','The shared history does not match its record.',503);}
  this.secret=row.secret;return {row,state};
 }
 saveCredential(c){this.credentialWrites.push({kind:'insert',...c});}
 renewCredential(c){this.credentialWrites.push({kind:'renew',...c});}
 async credential(token,s){
  if(typeof token!=='string'||token.length<32||token.length>256)fail('UNAUTHENTICATED','Create a session or reconnect with its saved token.',401);
  const c=await this.sql('SELECT * FROM commons_credentials WHERE token_hash=?',hash(token)).first();
  if(!c||c.expires_at<=this.now()||!Object.hasOwn(s.players,c.player_id))fail('UNAUTHENTICATED','This session is unknown or expired.',401);
  if(c.role==='agent'){const grant=s.agents[c.id];if(!grant||grant.revoked||grant.expiresAt<=this.now())fail('AGENT_REVOKED','This agent grant is revoked or expired.',401);}
  else if(c.role!=='owner')fail('CORRUPT_REALM','The session role is invalid.',503);
  for(const p of Object.values(s.players))this.presence.set(p.id,Math.max(p.createdAt,p.lastMoveAt,p.lastGatherAt,p.lastChatAt));
  this.presence.set(c.player_id,this.now());return c;
 }
 async state(token){const {state}=await this.load();return this.view(state,await this.credential(token,state));}
 async commit(row,s,c,op,transfers,{arrival=null,envelope=null,result=null}={}){
  assertState(s);if(s.revision!==row.revision+1)fail('CORRUPT_REALM','A command must advance exactly one revision.',503);
  const commitId=randomUUID(),bytes=JSON.stringify(s),journal={revision:s.revision,at:this.now(),playerId:c.player_id,credentialId:c.id,op,transfers,previous:row.head_hash};
  const journalHash=hash(canonical(journal)),guard='EXISTS(SELECT 1 FROM commons_realm WHERE id=1 AND commit_id=?)';
  const queries=[this.sql(`UPDATE commons_realm SET state=?,checksum=?,revision=?,head_hash=?,commit_id=? WHERE id=1 AND revision=? AND commit_id=?`,bytes,hash(bytes),s.revision,journalHash,commitId,row.revision,row.commit_id)];
  for(const write of this.credentialWrites){
   if(write.kind==='insert')queries.push(this.sql(`INSERT INTO commons_credentials(id,token_hash,player_id,role,expires_at) SELECT ?,?,?,?,? WHERE ${guard}`,write.id,write.token_hash,write.player_id,write.role,write.expires_at,commitId));
   else queries.push(this.sql(`UPDATE commons_credentials SET expires_at=? WHERE id=? AND ${guard}`,write.expires_at,write.id,commitId));
  }
  if(arrival)queries.push(this.sql(`INSERT INTO commons_arrivals(key_hash,name,credential_id) SELECT ?,?,? WHERE ${guard}`,arrival.keyHash,arrival.name,c.id,commitId));
  queries.push(this.sql(`INSERT INTO commons_journal(revision,at,player_id,credential_id,op,transfers,previous_hash,hash) SELECT ?,?,?,?,?,?,?,? WHERE ${guard}`,s.revision,journal.at,c.player_id,c.id,op,JSON.stringify(transfers),row.head_hash,journalHash,commitId));
  let receipt;
  if(envelope){
   receipt={key:envelope.key,op,revision:s.revision,result};const requestBytes=canonical(envelope),receiptBytes=JSON.stringify(receipt);
   queries.push(this.sql(`INSERT INTO commons_receipts(credential_id,command_key,bytes,receipt,checksum) SELECT ?,?,?,?,? WHERE ${guard}`,c.id,envelope.key,requestBytes,receiptBytes,hash(requestBytes+'\n'+receiptBytes),commitId));
  }
  if(this.beforeCommit)await this.beforeCommit();
  // D1 batch is a single transaction. Every dependent write has the same CAS guard.
  const outcome=await this.db.batch(queries);
  if(outcome[0].meta.changes!==1)fail('REVISION_CONFLICT','The shared world changed. Refresh before submitting this intent.',409);
  return receipt;
 }
 async createSession(body){
  const keyed=object(body)&&Object.hasOwn(body,'key');exact(body,keyed?['name','key']:['name'],'Session');const name=plainText(body.name,1,32,'Name');
  if(keyed&&(typeof body.key!=='string'||!/^[A-Za-z0-9._:-]{16,128}$/.test(body.key)))fail('INVALID_SESSION_KEY','Use a random 16–128 character arrival key.');
  for(let attempt=0;attempt<4;attempt++){
   this.credentialWrites=[];const {row,state:s}=await this.load();
   const token=keyed?'ak_'+createHmac('sha256',this.secret).update('session:'+body.key).digest('base64url'):'ak_'+randomBytes(32).toString('base64url');
   if(keyed){const saved=await this.sql('SELECT * FROM commons_arrivals WHERE key_hash=?',hash(body.key)).first();if(saved){
    if(saved.name!==name)fail('SESSION_KEY_COLLISION','This arrival key belongs to a different name.',409);
    const fresh=await this.load(),c=await this.credential(token,fresh.state);if(c.id!==saved.credential_id)fail('CORRUPT_REALM','The arrival record disagrees with its session.',503);
    return {token,playerId:c.player_id,expiresAt:c.expires_at,replayed:true,state:this.view(fresh.state,c)};
   }}
   if(Object.keys(s.players).length>=500)fail('REALM_FULL','This realm has reached its 500-principal limit.',503);
   const now=this.now(),playerId=randomUUID(),c={id:randomUUID(),player_id:playerId,role:'owner',expires_at:now+30*86400*1000};
   // Use the same genesis spawn and empty inventory as the canonical game.
   const {SPAWN,emptyBag}=await import('../public/shared-rules.js');
   s.players[playerId]={id:playerId,name,...SPAWN,createdAt:now,lastMoveAt:now,lastGatherAt:now-900,lastChatAt:now-1000,inventory:emptyBag()};
   this.saveCredential({...c,token_hash:hash(token)});s.revision++;
   try{await this.commit(row,s,c,'session.create',[],{arrival:keyed?{keyHash:hash(body.key),name}:null});}
   catch(error){if(error.code==='REVISION_CONFLICT'&&attempt<3)continue;throw error;}
   this.presence.set(playerId,now);return {token,playerId,expiresAt:c.expires_at,replayed:false,state:this.view(s,c)};
  }
 }
 async replay(token,c,envelope){
  const saved=await this.sql('SELECT * FROM commons_receipts WHERE credential_id=? AND command_key=?',c.id,envelope.key).first();
  if(!saved)return null;
  if(hash(saved.bytes+'\n'+saved.receipt)!==saved.checksum)fail('CORRUPT_REALM','The retained receipt failed verification.',503);
  if(saved.bytes!==canonical(envelope))fail('KEY_COLLISION','This command key was already used with different command bytes.',409);
  const receipt=JSON.parse(saved.receipt),journal=await this.sql('SELECT credential_id,op FROM commons_journal WHERE revision=?',receipt.revision).first();
  if(!journal||journal.credential_id!==c.id||journal.op!==envelope.op||receipt.key!==envelope.key)fail('CORRUPT_REALM','The receipt does not match its history.',503);
  if(receipt.op==='agent.create')receipt.result.token=this.agentToken(receipt.result.agentId);
  return {receipt:{...receipt,replayed:true},state:await this.state(token)};
 }
 async command(token,envelope){
  exact(envelope,['key','expectedRevision','op','payload'],'Command');
  if(typeof envelope.key!=='string'||!/^[A-Za-z0-9._:-]{8,96}$/.test(envelope.key))fail('INVALID_KEY','Use a unique 8–96 character command key.');
  integer(envelope.expectedRevision,0,Number.MAX_SAFE_INTEGER,'Expected revision');
  if(typeof envelope.op!=='string'||!object(envelope.payload))fail('INVALID_SHAPE','Operation and object payload are required.');
  this.credentialWrites=[];const {row,state:s}=await this.load(),c=await this.credential(token,s),saved=await this.replay(token,c,envelope);if(saved)return saved;
  if(envelope.expectedRevision!==s.revision)fail('REVISION_CONFLICT','The shared world changed. Refresh before submitting this intent.',409);
  if(c.role==='agent'){const grant=s.agents[c.id];if(!grant.scopes.includes(envelope.op))fail('AGENT_SCOPE','The owner did not grant this command scope.',403);if(grant.remaining<1)fail('AGENT_ALLOWANCE','This agent action allowance is exhausted.',403);}
  const transfers=[],result=this.dispatch(s,c,envelope.op,envelope.payload,transfers);
  if(c.role==='agent')s.agents[c.id].remaining--;s.revision++;
  let receipt;try{receipt=await this.commit(row,s,c,envelope.op,transfers,{envelope,result});}
  catch(error){if(error.code==='REVISION_CONFLICT'){const duplicate=await this.replay(token,c,envelope);if(duplicate)return duplicate;}throw error;}
  if(envelope.op==='agent.create')result.token=this.agentToken(result.agentId);
  return {receipt:{...receipt,replayed:false},state:this.view(s,c)};
 }
 async rateLimit(principal,limit){
  const window=Math.floor(this.now()/60000);
  const count=await this.sql(`INSERT INTO commons_limits(principal,window,count) VALUES(?,?,1)
    ON CONFLICT(principal) DO UPDATE SET window=excluded.window,count=CASE WHEN commons_limits.window=excluded.window THEN commons_limits.count+1 ELSE 1 END RETURNING count`,principal,window).first();
  if(count.count>limit)fail('RATE_LIMIT','Please pause briefly before trying again.',429);
 }
}
