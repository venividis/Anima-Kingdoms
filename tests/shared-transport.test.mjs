import test from 'node:test';
import assert from 'node:assert/strict';
import {RealmConnection} from '../public/shared-transport.js';

function storage() {
  const rows=new Map();
  return {getItem:key=>rows.get(key)||null,setItem:(key,value)=>rows.set(key,value),removeItem:key=>rows.delete(key)};
}
const state=revision=>({realmId:'transport-realm',revision});
const reply=(value,status=200)=>({ok:status<400,status,json:async()=>value});
const conflict=()=>reply({error:{code:'REVISION_CONFLICT',message:'Changed state'}},409);

test('an uncertain committed trade survives reload and recovers the identical command once',async()=>{
  const persisted=storage(),envelopes=[];let committed=0;
  const fetcher=async(path,request)=>{
    if(path==='/api/state')return reply(state(committed));
    const envelope=JSON.parse(request.body);envelopes.push(envelope);
    if(!committed){committed=1;throw Error('Connection lost after commit');}
    return reply({receipt:{key:envelope.key,replayed:true},state:state(1)});
  };
  const first=new RealmConnection({fetcher,storage:persisted,token:'test-player'});
  await assert.rejects(first.command('offer.fill',{offerId:'reserved-wood'}),/lost after commit/);
  assert.ok(first.pending);assert.ok(persisted.getItem('anima-commons-pending'));
  const reloaded=new RealmConnection({fetcher,storage:persisted,token:'test-player'});
  await assert.rejects(reloaded.command('offer.fill',{offerId:'different-offer'}),/Recover your pending/);
  const result=await reloaded.recover();assert.equal(result.receipt.replayed,true);
  assert.deepEqual(envelopes[0],envelopes[1]);assert.equal(committed,1);
  assert.equal(reloaded.pending,null);assert.equal(persisted.getItem('anima-commons-pending'),null);
});

test('an explicit conflict refreshes revision while preserving operation payload and idempotency key',async()=>{
  const calls=[];let observed=4;
  const c=new RealmConnection({storage:storage(),fetcher:async(path,request)=>{
    if(path==='/api/state')return reply(state(observed));
    const e=JSON.parse(request.body);calls.push(e);
    if(calls.length===1){observed=7;return conflict();}
    return reply({receipt:{key:e.key,replayed:false},state:state(8)});
  }});
  await c.command('project.contribute',{projectId:'crossing',item:'wood',quantity:2});
  assert.equal(calls.length,2);assert.equal(calls[0].key,calls[1].key);
  assert.equal(calls[0].expectedRevision,4);assert.equal(calls[1].expectedRevision,7);
  assert.deepEqual(calls[0].payload,calls[1].payload);assert.equal(c.state.revision,8);
});

test('out-of-order state polling cannot replace a newer committed inventory view',()=>{
  const seen=[];const c=new RealmConnection({storage:storage(),onState:s=>seen.push(s.revision)});
  c.accept(state(9));c.accept(state(4));c.accept(state(10));
  assert.deepEqual(seen,[9,10]);assert.equal(c.state.revision,10);
});

test('storage failure prevents a mutation before it can spend any goods',async()=>{
  let mutations=0;const c=new RealmConnection({storage:{getItem:()=>null,setItem:()=>{throw Error('quota');}},
    fetcher:async()=>{mutations++;return reply({});}});
  c.accept(state(1));await assert.rejects(c.command('offer.create',{}),/cannot preserve/);
  assert.equal(mutations,0);assert.equal(c.pending,null);
});

test('unreadable successful response and server failures retain exact recovery intent',async()=>{
  for(const response of [{ok:true,status:200,json:async()=>{throw Error('truncated');}},reply({error:{code:'INTERNAL_ERROR',message:'disk error'}},500)]){
    const c=new RealmConnection({storage:storage(),fetcher:async()=>response});c.accept(state(2));
    await assert.rejects(c.command('offer.cancel',{offerId:'held'}));assert.ok(c.pending);assert.equal(c.pending.op,'offer.cancel');assert.equal(c.busy,false);
  }
});

test('business rejection leaves no pending mutation, while another active command is refused',async()=>{
  let finish;
  const c=new RealmConnection({storage:storage(),fetcher:async()=>new Promise(resolve=>{finish=resolve;})});c.accept(state(1));
  const pending=c.command('offer.fill',{offerId:'funded'});
  await assert.rejects(c.command('offer.fill',{offerId:'another'}),/still being confirmed/);
  finish(reply({error:{code:'INSUFFICIENT_GOODS',message:'Not enough stone'}},409));
  await assert.rejects(pending,/Not enough stone/);assert.equal(c.pending,null);assert.equal(c.busy,false);
});
