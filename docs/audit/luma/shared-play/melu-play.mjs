// Melu's choices only. Rema is operated independently by another agent.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {Player,evidenceDir} from './play-client.mjs';
import {toNative} from '../../../../public/luma/language.js';
const player=await Player.open('Melu',{relay:true}),stage=process.argv[2];
const reportPath=join(evidenceDir,'melu-decisions.json');let report;
try{report=JSON.parse(await readFile(reportPath,'utf8'));}catch{report={actor:'Melu',startedAt:new Date().toISOString(),scope:'One independently operated player using the actual HTTP API.',stages:[]};}
await player.arrive();
const projectBinding={kind:'project',projectId:'crossing',item:'wood',quantity:8};
const say=(text,bindings)=>player.command('luma.speak',{text:toNative(text),bindings});
const inventory=()=>structuredClone(player.state.you.inventory);
const bridge=()=>player.state.projects.find(p=>p.id==='crossing');
let result={stage,startedAt:new Date().toISOString()};
if(stage==='gather'){
  await player.snapshot('arrival');const before=inventory();
  const thought=await say('i mi me bani ta bana ki #f "wood".',projectBinding);
  assert.equal(thought.body.receipt.result.mode,'i');assert.equal(thought.body.receipt.result.ready,false);
  assert.deepEqual(inventory(),before);
  result.earlyImagination={status:thought.body.receipt.result.status,blocker:thought.body.receipt.result.blocker,inventoryUnchanged:true};
  result.walkToGrove=await player.walk(-9,17);result.gathered=await player.gather('grove',8);
  assert.equal(player.state.you.inventory.wood,8);await player.snapshot('gathered');
  result.walkToProject=await player.walk(0,0);await player.snapshot('project-ready');
}else if(stage==='project'){
  await player.refresh();const before=inventory(),delivered=bridge().delivered.wood;
  assert.equal(before.wood,8);result.modes=[];
  for(const mode of ['i','u']){
    const spoken=await say(`${mode} mi me bani ta bana ki #f "wood".`,projectBinding);
    assert.equal(spoken.body.receipt.result.ready,true);assert.deepEqual(inventory(),before);assert.equal(bridge().delivered.wood,delivered);
    result.modes.push({mode,receipt:spoken.body.receipt,inventoryUnchanged:true,deliveredWoodUnchanged:true});
  }
  const undertaking=await say('pe mi me bani ta bana ki #f "wood".',projectBinding);
  assert.equal(player.state.you.inventory.wood,0);assert.equal(bridge().delivered.wood,8);assert.equal(player.state.you.inventory.marks,16);
  result.undertaking=undertaking.body.receipt;const after=inventory();
  const replay=await player.replay(undertaking.envelope);assert.equal(replay.status,200);assert.equal(replay.body.receipt.replayed,true);assert.equal(replay.body.receipt.revision,undertaking.body.receipt.revision);assert.deepEqual(inventory(),after);
  result.exactReplay={envelope:undertaking.envelope,receipt:replay.body.receipt,noAdditionalAssetsTransferred:true};
  await player.snapshot('contributed');
}else if(stage==='cross'){
  await player.refresh();assert.equal(player.state.world.bridgeOpen,true);result.crossing=await player.walk(0,-22);assert.ok(player.state.you.z<=-21.5);await player.snapshot('crossed');
}else if(stage==='offer-decline'||stage==='offer-accept'){
  await player.refresh();const recipient=player.state.players.find(p=>p.name==='Rema');assert.ok(recipient);
  const before=inventory(),spoken=await say('pe mi me doni ta dona li "Rema".',{kind:'gift',recipientId:recipient.id,item:'marks',quantity:1});
  assert.equal(player.state.you.inventory.marks,before.marks-1);result.offer=spoken.body.receipt;await player.snapshot(stage);
}else if(stage==='accept-incoming'){
  await player.refresh();const gift=player.state.gifts.find(g=>g.recipientId===player.playerId&&g.senderName==='Rema'&&g.status==='open');assert.ok(gift,'Rema has independently offered an open gift.');
  const before=inventory(),accepted=await player.command('gift.accept',{giftId:gift.id});assert.equal(player.state.you.inventory.marks,before.marks+gift.give.quantity);
  result.acceptance=accepted.body.receipt;await player.snapshot('accepted-incoming');
}else if(stage==='experience'){
  const before=inventory(),spoken=await say('a mi me honi ta loma he.',{kind:'experience'});
  assert.equal(spoken.body.receipt.result.status,'experienced');assert.deepEqual(inventory(),before);result.experience=spoken.body.receipt;await player.snapshot('experience');
}else if(stage==='final'){
  await player.snapshot('final');assert.ok(Object.values(player.state.ledger.residual).every(v=>v===0));
  result.final={revision:player.state.revision,position:{x:player.state.you.x,z:player.state.you.z},inventory:inventory(),project:bridge(),treasury:player.state.treasury,gifts:player.state.gifts,conservation:player.state.ledger};
}else throw Error('Choose gather, project, cross, offer-decline, offer-accept, accept-incoming, experience or final.');
result.finishedAt=new Date().toISOString();report.stages.push(result);await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
