// An isolated live realm and an optional local-file HTTP relay. This helper never
// controls players and never changes authority clocks, resources, or world state.
import {mkdtemp,mkdir,writeFile,readdir,readFile,rename,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRealmServer} from '../../../../server/index.mjs';

const runDir=await mkdtemp(join(tmpdir(),'anima-luma-shared-play-'));
await mkdir(join(runDir,'requests'));await mkdir(join(runDir,'responses'));
const server=createRealmServer({dbPath:join(runDir,'realm.sqlite')});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=server.address(),base=`http://127.0.0.1:${address.port}`;
const config={runDir,base,startedAt:new Date().toISOString(),clock:'Date.now',authority:'HTTP / SQLite',requestLimit:16384};
await writeFile(join(runDir,'config.json'),JSON.stringify(config,null,2));
await writeFile('/tmp/anima-luma-shared-play-current.json',JSON.stringify(config,null,2));
console.log(JSON.stringify(config));
let closing=false;
async function relay(){
  for(const file of (await readdir(join(runDir,'requests'))).filter(f=>f.endsWith('.json')).sort()){
    const path=join(runDir,'requests',file);
    let request;try{request=JSON.parse(await readFile(path,'utf8'));}catch{continue;}
    let result;
    try{
      if(!['GET','POST'].includes(request.method)||!/^\/api\/(state|session|command|health)$/.test(request.path))throw Error('Relay only accepts the existing realm API.');
      const response=await fetch(base+request.path,{method:request.method,headers:request.headers,body:request.body===undefined?undefined:JSON.stringify(request.body)});
      result={status:response.status,body:await response.json(),receivedAt:new Date().toISOString()};
    }catch(error){result={transportError:error.message,receivedAt:new Date().toISOString()};}
    await writeFile(join(runDir,'responses',file+'.partial'),JSON.stringify(result));
    await rename(join(runDir,'responses',file+'.partial'),join(runDir,'responses',file));
    await rm(path);
  }
}
async function loop(){while(!closing){await relay();await new Promise(resolve=>setTimeout(resolve,25));}}
async function stop(){closing=true;server.closeIdleConnections();await new Promise(resolve=>server.close(resolve));server.realm.close();process.exit(0);}
process.once('SIGINT',stop);process.once('SIGTERM',stop);
await loop();
