import {HostedRealm,RealmError} from './hosted-authority.mjs';
import {hash} from './hosted-rules.mjs';

function json(status,value){return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
function bearer(request){const value=request.headers.get('authorization');if(!value?.startsWith('Bearer '))throw new RealmError('UNAUTHENTICATED','A bearer session is required.',401);return value.slice(7);}
async function body(request){
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')||''))throw new RealmError('CONTENT_TYPE','Send application/json.',415);
 const reader=request.body?.getReader();let size=0;const chunks=[];
 if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>16384){await reader.cancel();throw new RealmError('BODY_TOO_LARGE','Requests are limited to 16 KiB.',413);}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new RealmError('INVALID_JSON','Send a JSON object.',400);}
}
export async function handleCommons(request,db,options={}){
 let realm;
 try{
  const url=new URL(request.url),origin=request.headers.get('origin');
  if(origin&&origin!==url.origin||request.headers.get('sec-fetch-site')==='cross-site')throw new RealmError('ORIGIN_REJECTED','Use the game from its own website.',403);
  const route=url.pathname,method=request.method;
  if(!['GET','POST'].includes(method))return json(405,{error:{code:'METHOD_NOT_ALLOWED',message:'This method is not available.'}});
  realm=new HostedRealm(db,options);
  if(route==='/api/health'&&method==='GET'){const {state}=await realm.load();return json(200,{ok:true,rulesVersion:state.rulesVersion,revision:state.revision});}
  if(route==='/api/session'&&method==='POST'){
   const principal=request.headers.get('oai-authenticated-user-id')||request.headers.get('cf-connecting-ip')||'site-arrival';
   await realm.rateLimit('arrival:'+hash(principal),12);
   return json(201,await realm.createSession(await body(request)));
  }
  if(route!=='/api/state'&&route!=='/api/command')return json(404,{error:{code:'NOT_FOUND',message:'This game endpoint does not exist.'}});
  const token=bearer(request),loaded=await realm.load(),actor=await realm.credential(token,loaded.state);
  await realm.rateLimit('player:'+actor.player_id,1200);
  if(route==='/api/state'&&method==='GET')return json(200,realm.view(loaded.state,actor));
  if(route==='/api/command'&&method==='POST')return json(200,await realm.command(token,await body(request)));
  return json(405,{error:{code:'METHOD_NOT_ALLOWED',message:'This method is not available.'}});
 }catch(error){
  let revision;try{revision=(await realm?.load())?.state.revision;}catch{}
  if(!(error instanceof RealmError))console.error('Commons storage request failed',error?.message);
  return json(error instanceof RealmError?error.status:503,{error:{code:error instanceof RealmError?error.code:'SERVICE_UNAVAILABLE',message:error instanceof RealmError?error.message:'The shared world is temporarily unavailable. Your last accepted actions remain saved.'},...(revision===undefined?{}:{revision})});
 }
}
