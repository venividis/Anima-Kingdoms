import {createRequire} from 'node:module';
import {dirname,resolve} from 'node:path';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const require=createRequire(import.meta.url);
const {Miniflare}=await import(require.resolve('miniflare',{paths:[dirname(require.resolve('wrangler/package.json'))]}));
const config=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
const modules=['index.js',...readdirSync('dist/server',{recursive:true}).filter(path=>/\.m?js$/.test(path)&&path!=='index.js')].map(path=>({type:'ESModule',path:resolve('dist/server',path)}));
const mf=new Miniflare({modules,modulesRoot:resolve('dist/server'),compatibilityDate:config.compatibility_date,compatibilityFlags:config.compatibility_flags,d1Databases:['DB'],assets:{directory:resolve('dist/client'),routerConfig:{has_user_worker:true}}});
const records=[];
try{
 const db=await mf.getD1Database('DB');
 for(const sql of readFileSync('drizzle/0000_flippant_ego.sql','utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(sql).run();
 for(const path of ['/','/play.html','/shared.html','/luma-view.js','/cosmos.js','/cosmos-view.js','/cosmos.css','/luma/astronomy.js','/luma/stars.js','/luma/Luma-Origin-Prefinal.woff2','/luma/origin.html','/api/health']){
  const response=await mf.dispatchFetch('https://game.example'+path),bytes=new Uint8Array(await response.arrayBuffer());
  records.push({path,status:response.status,bytes:bytes.length,contentType:response.headers.get('content-type')});assert.equal(response.status,200,path);assert.ok(bytes.length>0,path);
  if(path==='/play.html')assert.match(new TextDecoder().decode(bytes),/id="open-luma"/);
  if(path==='/')assert.match(new TextDecoder().decode(bytes),/play\.html/);
 }
 const arrival=await mf.dispatchFetch('https://game.example/api/session',{method:'POST',headers:{'content-type':'application/json',origin:'https://game.example'},body:JSON.stringify({name:'Build verifier',key:randomUUID()})});
 assert.equal(arrival.status,201);const player=await arrival.json();
 assert.equal(player.state.cosmos.workshop.job,null);assert.equal(player.state.cosmos.sky.bodies.length,7);
 const envelope={key:randomUUID(),expectedRevision:player.state.revision,op:'luma.speak',payload:{text:'a mi me honi ta loma he.',bindings:{kind:'experience'}}};
 const response=await mf.dispatchFetch('https://game.example/api/command',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+player.token,origin:'https://game.example'},body:JSON.stringify(envelope)});
 assert.equal(response.status,200);const result=await response.json();assert.equal(result.receipt.result.status,'experienced');assert.equal(result.state.revision,2);
 records.push({path:'/api/session',status:arrival.status,revision:player.state.revision},{path:'/api/command',status:response.status,revision:result.state.revision,operation:result.receipt.op,mode:result.receipt.result.mode});
 mkdirSync('docs/audit/cosmos',{recursive:true});writeFileSync('docs/audit/cosmos/built-worker.json',JSON.stringify({environment:'Local Cloudflare Workers runtime with isolated D1; no production writes',checks:records},null,2)+'\n');
 console.log(JSON.stringify(records,null,2));
}finally{await mf.dispose();}
