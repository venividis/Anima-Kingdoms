// Actual shipped DOM handlers. Canvas/audio are mocks; this is not visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mountLocal,mountShared,service} from './luma-ui-harness.mjs';
import {toNative,toLatin} from '../public/luma/language.js';
import {RECIPES} from '../public/cosmos.js';

test('the local Cosmos control pays in native Luma, keeps the world clock moving and finishes a saved work',async()=>{
 let ui=await mountLocal();
 try{
  await ui.begin();ui.key('o');assert.equal(ui.q('#panel').hidden,false);assert.equal(ui.document.querySelectorAll('[data-recipe]').length,4);
  ui.click('[data-script]');assert.equal(ui.q('[data-cosmos-phrase]').value,toNative('pe mi me peli ta "Star-iron" ki fama.'));
  ui.click('[data-begin]');await ui.idle();assert.equal(ui.saved().pack.ore,1);assert.ok(ui.saved().cosmos.workshop.job);assert.equal(ui.q('[data-advance]').disabled,true);
  await ui.frames(30);const saved=ui.saved();await ui.close();ui=await mountLocal({snapshot:saved});await ui.begin();ui.click('#open-cosmos');
  ui.click('[data-sound]');assert.equal(ui.q('[data-sound]').getAttribute('aria-pressed'),'true');
  for(const duration of [6500,6500,3500]){await ui.frames(duration/100);assert.equal(ui.q('[data-advance]').disabled,false);ui.click('[data-advance]');await ui.idle();}
  assert.equal(ui.saved().cosmos.workshop.products.length,1);assert.equal(ui.q('[data-sound]').getAttribute('aria-pressed'),'true');assert.ok(ui.audioNotes.length>8);
  ui.click('[data-use]');await ui.idle();assert.ok(ui.saved().cosmos.blade);assert.equal(ui.saved().cosmos.workshop.products.length,0);
 }finally{await ui.close();}
});

test('the shared Cosmos UI walks to the Moonwell, crafts a tincture and records it for the town',async()=>{
 const server=await service();let ui;
 try{
  ui=await mountShared(server);await ui.join('Sky gardener');await ui.tab('works');await ui.walk('[data-walk-node="reeds"]');await ui.gather('reeds',2);await ui.walk('[data-walk-node="quarry"]');await ui.gather('quarry',1);
  await ui.tab('cosmos');await ui.walk('[data-walk="alembic"]');ui.click('[data-recipe="earth"]');assert.match(toLatin(ui.q('[data-cosmos-phrase]').value),/"Earth tincture"/);
  ui.click('[data-script]');ui.click('[data-begin]');await ui.wait(()=>!!ui.document.querySelector('[data-work-stage]'),'shared work started');await ui.idle();assert.equal(ui.inventory('herb'),0);
  for(const stage of RECIPES.earth.stages){server.advance(stage[2]);await ui.poll();await ui.poll();assert.equal(ui.q('[data-advance]').disabled,false);ui.click('[data-advance]');await ui.idle();}
  await ui.wait(()=>!!ui.document.querySelector('[data-use]'),'shared product');await ui.walk('[data-walk="town"]');ui.click('[data-use]');await ui.idle();
  const token=ui.window.sessionStorage.getItem('anima-commons-token'),state=await server.state(token);assert.ok(state.cosmos.town.garden);assert.equal(state.cosmos.workshop.products.length,0);assert.match(ui.q('.cosmos-town').textContent,/nourishes/);
  const calls=ui.requests.filter(r=>r.body?.op==='cosmos.start');assert.equal(calls.length,1);assert.match(calls[0].body.payload.text,/[\uE000-\uE013]/);
 }finally{await ui?.close();await server.close();}
});
