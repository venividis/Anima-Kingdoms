import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as R from '../public/realm.js';
const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const save=app.split('\n').find(l=>l.startsWith('function save('));
function context(){const writes=[];return {writes,ctx:{started:true,saveLock:true,pausedByTab:false,recoveryRaw:null,rehearsal:null,state:R.newRealm(),SAVE:'world',R,localStorage:{setItem:(...args)=>writes.push(args)},saveFailure:false,notice:()=>{}}};}
test('actual autosave rejects an invalid candidate before touching the last valid stored world',()=>{const {writes,ctx}=context();ctx.state.pack.wood++;vm.runInNewContext(save+';save();',ctx);assert.equal(writes.length,0);assert.equal(ctx.saveFailure,true);});
test('actual autosave cannot overwrite preserved rejected raw data with a fresh world',()=>{const {writes,ctx}=context();ctx.recoveryRaw='unreadable prior world';vm.runInNewContext(save+';save();',ctx);assert.equal(writes.length,0);assert.equal(ctx.recoveryRaw,'unreadable prior world');});
test('actual autosave writes a reloadable world after validation',()=>{const {writes,ctx}=context();vm.runInNewContext(save+';save();',ctx);assert.equal(writes.length,1);assert.equal(R.restore(JSON.parse(writes[0][1])).id,ctx.state.id);});
