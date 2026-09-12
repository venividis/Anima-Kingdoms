import {createServer} from 'node:http';
import {readFile,realpath,stat} from 'node:fs/promises';
import {resolve,relative,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {SharedRealm,RealmError} from './authority.mjs';

const ROOT=fileURLToPath(new URL('../public/',import.meta.url));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.woff2':'font/woff2','.mp3':'audio/mpeg','.wav':'audio/wav','.glb':'model/gltf-binary'};
function bearer(req){const auth=req.headers.authorization;if(typeof auth!=='string'||!auth.startsWith('Bearer '))throw new RealmError('UNAUTHENTICATED','A bearer session is required.',401);return auth.slice(7);}
async function body(req){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>16384)throw new RealmError('BODY_TOO_LARGE','Requests are limited to 16 KiB.',413);chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new RealmError('INVALID_JSON','Send a JSON object.',400);}}
function send(res,status,payload){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(payload));}

export function createRealmServer({realm,dbPath,publicOrigin=process.env.PUBLIC_ORIGIN,publicRoot=ROOT}={}) {
  realm ||= new SharedRealm({path:dbPath||resolve(process.env.REALM_DB||'data/shared-realm.sqlite')});
  const rate=new Map();
  const server=createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Resource-Policy','same-origin');
    // Inline styles support the existing orchard shell; shared JS is served locally.
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; media-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'");
    try{
      const host=req.headers.host;if(!host)throw new RealmError('INVALID_HOST','A Host header is required.',400);
      let requestURL;try{requestURL=new URL(req.url,`http://${host}`);}catch{throw new RealmError('INVALID_URL','The request URL is invalid.',400);}
      const configured=publicOrigin?new URL(publicOrigin):null;
      if(!['localhost','127.0.0.1','[::1]'].includes(requestURL.hostname)&&requestURL.host!==configured?.host)throw new RealmError('INVALID_HOST','Set PUBLIC_ORIGIN before serving this realm on a public hostname.',403);
      if(req.headers.origin&&req.headers.origin!==(configured?.origin||requestURL.origin))throw new RealmError('CROSS_ORIGIN','Only this realm origin may issue browser requests.',403);
      if(req.headers['sec-fetch-site']==='cross-site')throw new RealmError('CROSS_ORIGIN','Cross-site requests are not accepted.',403);
      const pathname=requestURL.pathname;
      if(pathname.startsWith('/api/')){
        if(req.method==='GET'&&pathname==='/api/health'){const s=realm.read();return send(res,200,{ok:true,rulesVersion:s.rulesVersion,revision:s.revision,authority:'sqlite',mode:'shared-commons'});}
        if(req.method==='GET'&&pathname==='/api/state')return send(res,200,realm.state(bearer(req)));
        if(req.method==='POST'&&(pathname==='/api/session'||pathname==='/api/command')){
          if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))throw new RealmError('CONTENT_TYPE','Use application/json.',415);
          const token=pathname==='/api/command'?bearer(req):null;
          const ip=req.socket.remoteAddress||'unknown',bucketKey=`${pathname}:${ip}`;
          const now=Date.now(),limit=pathname==='/api/session'?12:12000;
          if(rate.size>4096)for(const [key,b] of rate)if(b.until<now)rate.delete(key);
          let bucket=rate.get(bucketKey);if(!bucket||bucket.until<now){bucket={until:now+60000,count:0};rate.set(bucketKey,bucket);}
          if(++bucket.count>limit)throw new RealmError('RATE_LIMIT','This address has reached the one-minute request limit.',429);
          const parsed=await body(req),result=token?realm.command(token,parsed):realm.createSession(parsed);
          return send(res,token?200:201,result);
        }
        throw new RealmError('NOT_FOUND','This API endpoint does not exist.',404);
      }
      if(req.method!=='GET'&&req.method!=='HEAD')throw new RealmError('METHOD_NOT_ALLOWED','Use GET for public assets.',405);
      let decoded;try{decoded=decodeURIComponent(pathname);}catch{throw new RealmError('INVALID_URL','The URL encoding is invalid.',400);}
      if(decoded.includes('\0')||decoded.includes('\\'))throw new RealmError('NOT_FOUND','Asset not found.',404);
      const requested=decoded==='/'?'shared.html':decoded.replace(/^\/+/,''),candidate=resolve(publicRoot,requested),root=await realpath(publicRoot);
      let file;try{file=await realpath(candidate);}catch{throw new RealmError('NOT_FOUND','Asset not found.',404);}
      const inside=relative(root,file);if(inside==='..'||inside.startsWith('..'+sep)||inside.startsWith(sep)||!MIME[extname(file)]||(await stat(file)).isDirectory())throw new RealmError('NOT_FOUND','Asset not found.',404);
      const bytes=await readFile(file);res.writeHead(200,{'Content-Type':MIME[extname(file)],'Cache-Control':'no-cache','Content-Length':bytes.length});res.end(req.method==='HEAD'?undefined:bytes);
    }catch(error){
      if(res.headersSent){res.destroy();return;}
      let revision;try{revision=realm.read().revision;}catch{}
      const known=error instanceof RealmError;
      send(res,known?error.status:500,{error:{code:known?error.code:'INTERNAL_ERROR',message:known?error.message:'The server could not complete this request. No custody was committed.'},...(Number.isSafeInteger(revision)?{revision}:{})});
      if(!known)process.stderr.write(`Shared realm request failed: ${error.message}\n`);
    }
  });
  server.realm=realm;server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=5000;server.maxHeadersCount=50;
  return server;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const port=Number(process.env.PORT||8787),host=process.env.HOST||'127.0.0.1';
  if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT must be from 1 to 65535.');
  const server=createRealmServer();server.listen(port,host,()=>process.stdout.write(`Anima shared commons: http://${host}:${port}/shared.html\nSQLite custody: ${server.realm.path}\n`));
  const stop=()=>{server.close(()=>{server.realm.close();process.exit(0);});server.closeIdleConnections();};
  process.once('SIGINT',stop);process.once('SIGTERM',stop);
}
