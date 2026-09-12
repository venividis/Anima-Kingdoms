import * as W from './source-audit-baseline/dist/world.js';
import {makeScene} from './source-audit-baseline/dist/scene.js';
import fs from 'node:fs';
const results={baselineCommit:'7f913b352fbc3ccfbe069fb518951b256cce0b61',probes:[]};
const a=W.genesis(); W.grant(a,true); const p=W.propose(a); const viewed=structuredClone(p.plan); p.plan=[['spring','east',6],['east','habitat',6]]; W.acceptProposal(a,p);
results.probes.push({id:'mutable-plan',viewed,executed:Object.values(a.channels).map(c=>[c.from,c.to,c.capacity]),acceptedUnviewedPlan:true});
const b=W.genesis(),c=W.genesis();W.grant(b,true);W.grant(c,true);const fromB=W.propose(b);W.acceptProposal(c,fromB);
results.probes.push({id:'cross-world-plan',acceptedFromOtherWorld:true,channelCount:Object.keys(c.channels).length});
const savedPlayer={x:0,z:-13,angle:0,bank:'far'};const serialized={x:savedPlayer.x,z:savedPlayer.z,angle:savedPlayer.angle};const restoredBank=serialized.z<-19?'far':'near';
results.probes.push({id:'entry-bank-save',before:savedPlayer.bank,after:restoredBank,serialized});
const meshes=[];makeScene({mesh:g=>{meshes.push(g.data);return{count:g.data.length/9};}});const earth=meshes[0];
function covered(x,z){for(let i=0;i<earth.length;i+=27){const vs=[0,9,18].map(o=>[earth[i+o],earth[i+o+1],earth[i+o+2]]);if(vs.some(v=>Math.abs(v[1])>1e-8))continue;const sign=(p,a,b)=>(p[0]-b[0])*(a[2]-b[2])-(a[0]-b[0])*(p[2]-b[2]);const s=vs.map((v,j)=>sign([x,0,z],v,vs[(j+1)%3]));if(!(s.some(v=>v< -1e-8)&&s.some(v=>v>1e-8)))return true;}return false;}
for(const [x,z] of [[10,-6.8],[10,-18.8]])results.probes.push({id:'terrain-vs-collision',x,z,walkableAtGenesis:W.walkable(W.genesis(),x,z),renderedEarthAtY0:covered(x,z)});
const priorities=W.SINKS.map(first=>{let w=W.genesis();W.setPriority(w,first);return w.priority.join(',');});
results.probes.push({id:'priority-order-ui',reachableOrders:priorities,reachableCount:new Set(priorities).size,solverSupports:6});
fs.writeFileSync(new URL('./audit-probe-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
