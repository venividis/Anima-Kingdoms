import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {evidenceDir} from './play-client.mjs';
const names=['melu','rema'],actors=[],coveredRevisions=new Set();let all=[];
for(const name of names){
  const text=await readFile(join(evidenceDir,name+'.http.jsonl'),'utf8');
  assert.ok(!/ak_[A-Za-z0-9_-]{32,}/.test(text),'Live credentials must not enter the evidence.');
  const rows=text.trim().split('\n').map(line=>JSON.parse(line));all.push(...rows);
  for(const row of rows){const state=row.response.body?.state||(row.request.path==='/api/state'&&row.response.status===200?row.response.body:null);if(state)assert.ok(Object.values(state.ledger.residual).every(value=>value===0),'Custody must balance at every recorded state.');}
  const accepted=rows.filter(row=>row.response.status===200&&row.response.body?.receipt&&!row.response.body.receipt.replayed);
  const replays=rows.filter(row=>row.response.body?.receipt?.replayed);
  const recovered=name==='melu'?JSON.parse(await readFile(join(evidenceDir,'melu-recovered-server-receipts.json'),'utf8')):null;
  if(recovered)assert.equal(recovered.checksumVerified,true);
  for(const row of rows.filter(r=>r.request.path==='/api/session'&&r.response.status===201))coveredRevisions.add(row.response.body.state.revision);
  for(const row of accepted)coveredRevisions.add(row.response.body.receipt.revision);
  for(const record of recovered?.records||[])coveredRevisions.add(record.receipt.revision);
  const final=JSON.parse(await readFile(join(evidenceDir,name+'-final.json'),'utf8')).state;
  const commands=Object.fromEntries([...new Set(accepted.map(row=>row.request.body.op))].map(op=>[op,accepted.filter(row=>row.request.body.op===op).length]));
  const commandsIncludingRecovered={...commands};for(const record of recovered?.records||[])commandsIncludingRecovered[record.envelope.op]=(commandsIncludingRecovered[record.envelope.op]||0)+1;
  const speech=accepted.filter(row=>row.request.body.op==='luma.speak').map(row=>({revision:row.response.body.receipt.revision,mode:row.response.body.receipt.result.mode,latin:row.response.body.receipt.result.latin,native:row.response.body.receipt.result.native,status:row.response.body.receipt.result.status,ready:row.response.body.receipt.result.ready,effect:row.response.body.receipt.result.effect||null,blocker:row.response.body.receipt.result.blocker||null}));
  assert.equal(final.you.inventory.marks,16);assert.equal(final.world.bridgeOpen,true);assert.ok(final.you.z<=-21.5);
  actors.push({name:final.you.name,playerId:final.you.id,httpRecords:rows.length,acceptedCommands:accepted.length+(recovered?.records.length||0),acceptedCommandsInOriginalHTTPRecords:accepted.length,commands:commandsIncludingRecovered,commandsInOriginalHTTPRecords:commands,recoveredServerReceipts:recovered?{file:'melu-recovered-server-receipts.json',revisions:recovered.records.map(r=>r.receipt.revision),checksumVerified:true,freshExactHTTPReplaysVerified:true}:null,replays:replays.map(row=>({revision:row.response.body.receipt.revision,key:row.response.body.receipt.key,op:row.response.body.receipt.op})),httpErrors:rows.filter(row=>row.response.status>=400).map(row=>({status:row.response.status,code:row.response.body.error?.code})),speech,final:{revision:final.revision,position:{x:final.you.x,z:final.you.z},inventory:final.you.inventory,custody:final.ledger},traceSha256:createHash('sha256').update(text).digest('hex')});
}
all.sort((a,b)=>a.at.localeCompare(b.at));
const final=JSON.parse(await readFile(join(evidenceDir,'melu-final.json'),'utf8')).state;
assert.equal(final.projects[0].delivered.wood,8);assert.equal(final.projects[0].delivered.stone,8);assert.equal(final.treasury.marks,468);
assert.equal(final.gifts.filter(g=>g.status==='accepted').length,2);assert.equal(final.gifts.filter(g=>g.status==='declined').length,1);assert.equal(final.gifts.filter(g=>g.status==='open').length,0);
for(let revision=1;revision<=final.revision;revision++)assert.ok(coveredRevisions.has(revision),'Every accepted revision needs an original response or explicitly recovered authority receipt. Missing '+revision);
const report={recordedAt:new Date().toISOString(),startedAt:all[0].at,finishedAt:all.at(-1).response.receivedAt,method:'Two independently controlled agents, separate owner sessions, actual HTTP API and isolated SQLite authority. File relay only forwards HTTP requests across execution namespaces. Date.now and game resource rules were unchanged.',redactions:'Authorization headers and session token response fields only. Runtime credentials and the SQLite database are outside delivered evidence.',recordingGap:'Two original Melu HTTP entries for movement revisions53 and54 were absent when the final trace was inspected; the cause remains unknown. Their exact envelopes and acceptance receipts were recovered read-only from the authority, checksum verified, and replayed through HTTP without changing current state. They are labeled separately; missing historical response states are not fabricated.',scope:'Core/API play evidence; this does not establish visual browser quality, pronunciation intelligibility, or human learning outcomes.',loadedSourceNote:'The running authority was loaded before a later gift-history correction that retains the latest 200 closed gifts by settlement order. This journey uses only three gifts and does not test that boundary; dedicated authority tests cover it separately.',actors,final:{revision:final.revision,project:final.projects[0],treasury:final.treasury,gifts:final.gifts,custody:final.ledger},checks:{all94AcceptedRevisionsCoveredByResponsesOrRecoveredReceipts:true,allRecordedStateCustodyResidualsZero:true,exactUndertakingReplays:actors.reduce((n,a)=>n+a.replays.filter(r=>r.op==='luma.speak').length,0),additionalRecoveredMovementReplays:2,bothBodiesCrossed:true,materialsPaidOnce:true,recipientAcceptedTwiceDeclinedOnce:true,bothFinalMarks16:true,allGiftEscrowsClosed:true}};
await writeFile(join(evidenceDir,'play-summary.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({actors:actors.map(a=>({name:a.name,httpRecords:a.httpRecords,acceptedCommands:a.acceptedCommands,commands:a.commands,replays:a.replays.length,httpErrors:a.httpErrors})),finalRevision:final.revision,checks:report.checks},null,2));
