// The same recorded API client can be used by separate agents. It never creates
// or acts as a second player; each caller supplies its own name and decisions.
import {readFile,writeFile,appendFile,rename,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const evidenceDir=fileURLToPath(new URL('.',import.meta.url));
export const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clean=value=>{
  if(Array.isArray(value))return value.map(clean);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,/^(token|authorization)$/i.test(k)?'[redacted]':clean(v)]));
  return value;
};
export class Player {
  static async open(name,{relay=process.env.PLAY_RELAY==='1'}={}){
    const config=JSON.parse(await readFile('/tmp/anima-luma-shared-play-current.json','utf8'));
    const self=new Player(name,config,relay);
    try{const saved=JSON.parse(await readFile(self.privatePath,'utf8'));self.token=saved.token;self.playerId=saved.playerId;}catch{}
    return self;
  }
  constructor(name,config,relay){this.name=name;this.config=config;this.relay=relay;this.privatePath=join(config.runDir,name.toLowerCase()+'.credentials.json');this.tracePath=join(evidenceDir,name.toLowerCase()+'.http.jsonl');this.state=null;}
  async request(path,method='GET',body){
    const at=new Date().toISOString(),headers={'Content-Type':'application/json'};
    if(this.token)headers.Authorization='Bearer '+this.token;
    const request={path,method,headers,...(body===undefined?{}:{body})};let result;
    if(this.relay){
      const file=`${Date.now()}-${this.name}-${randomUUID()}.json`,target=join(this.config.runDir,'requests',file);
      await writeFile(target+'.partial',JSON.stringify(request));await rename(target+'.partial',target);
      const deadline=Date.now()+15000,responsePath=join(this.config.runDir,'responses',file);
      while(Date.now()<deadline){try{result=JSON.parse(await readFile(responsePath,'utf8'));await rm(responsePath);break;}catch{await pause(35);}}
      if(!result)throw Error('HTTP relay timed out');
    }else{
      const response=await fetch(this.config.base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
      result={status:response.status,body:await response.json(),receivedAt:new Date().toISOString()};
    }
    await appendFile(this.tracePath,JSON.stringify({at,actor:this.name,transport:this.relay?'file relay to HTTP':'HTTP',request:clean(request),response:clean(result)})+'\n');
    if(result.transportError)throw Error(result.transportError);
    if(result.body.state)this.state=result.body.state;else if(path==='/api/state'&&result.status===200)this.state=result.body;
    return result;
  }
  async arrive(){
    if(this.token)return this.refresh();
    const result=await this.request('/api/session','POST',{name:this.name,key:'live-play-'+this.name+'-'+randomUUID()});
    if(result.status!==201)throw Error(JSON.stringify(result));
    this.token=result.body.token;this.playerId=result.body.playerId;
    await writeFile(this.privatePath,JSON.stringify({token:this.token,playerId:this.playerId}),{mode:0o600});
    return result.body;
  }
  async refresh(){const result=await this.request('/api/state');if(result.status!==200)throw Error(JSON.stringify(result));return this.state;}
  async command(op,payload,{key='play-'+this.name+'-'+randomUUID(),expectedError=null}={}){
    for(let attempt=0;attempt<8;attempt++){
      await this.refresh();const envelope={key,expectedRevision:this.state.revision,op,payload};
      const result=await this.request('/api/command','POST',envelope);
      if(result.body.error?.code==='REVISION_CONFLICT'){await pause(20+attempt*35);continue;}
      if(expectedError){if(result.body.error?.code!==expectedError)throw Error('Expected '+expectedError+': '+JSON.stringify(result));return {envelope,...result};}
      if(result.status!==200)throw Error(JSON.stringify(result));
      return {envelope,...result};
    }
    throw Error('Could not submit after eight genuine concurrent revision changes.');
  }
  async replay(envelope){return this.request('/api/command','POST',envelope);}
  async walk(x,z){
    await this.refresh();const began=Date.now();let commands=0;
    while(Math.hypot(x-this.state.you.x,z-this.state.you.z)>.35){
      if(++commands>180)throw Error('Waypoint remained unreachable: '+JSON.stringify({x,z,at:this.state.you}));
      const dx=x-this.state.you.x,dz=z-this.state.you.z,d=Math.hypot(dx,dz),scale=Math.min(1,d/1.75);
      await pause(265);await this.command('move',{dx:dx/d*scale,dz:dz/d*scale});
    }
    return {target:{x,z},arrived:{x:this.state.you.x,z:this.state.you.z},commands,elapsedMs:Date.now()-began};
  }
  async gather(nodeId,quantity){for(let i=0;i<quantity;i++){if(i)await pause(935);await this.command('gather',{nodeId});}return this.state.you.inventory;}
  async snapshot(name){await this.refresh();await writeFile(join(evidenceDir,this.name.toLowerCase()+'-'+name+'.json'),JSON.stringify({recordedAt:new Date().toISOString(),state:this.state},null,2)+'\n');return this.state;}
}
