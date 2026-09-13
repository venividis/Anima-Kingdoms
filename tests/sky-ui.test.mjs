// Shipped controls in DOM emulation. These checks do not claim a browser playtest.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mountLocal,mountShared,service} from './luma-ui-harness.mjs';

function input(ui,selector,value,type='input'){const el=ui.q(selector);el.value=value;el.dispatchEvent(new ui.window.Event(type,{bubbles:true}));}

test('the whole-sky controls explore both hemispheres, missing Ascendant, cycles and native fixed-width cells',async()=>{
  const ui=await mountLocal();try{
    await ui.begin();ui.key('o');assert.equal(ui.document.querySelectorAll('[data-play-cell]').length,8);
    assert.equal(ui.document.querySelectorAll('[data-body-table] tr').length,10);
    input(ui,'[data-star-search]','Vega');ui.click('[data-select-light="HR 7001"]');assert.match(ui.q('[data-selected-light]').textContent,/Vega/);
    ui.click('[data-south]');assert.match(ui.q('[data-sky-clock-mode]').textContent,/Study/);assert.equal(ui.q('[data-keep-sky]').disabled,true);
    input(ui,'[data-study-lat]','90');input(ui,'[data-study-date]','2026-06-21T12:00');ui.click('[data-study-apply]');
    assert.equal(ui.q('[data-play-cell="7"]').disabled,true);assert.match(ui.q('[data-play-cell="7"]').textContent,/undefined/);
    ui.click('[data-sky-view="coordinates"]');input(ui,'[data-sky-dimension]','3');assert.match(ui.q('[data-coordinate-caption]').textContent,/Moon has only its cosine/);
    ui.click('[data-sky-view="rings"]');assert.match(ui.q('[data-map-caption]').textContent,/108/);
    ui.click('[data-live-sky]');assert.equal(ui.q('[data-keep-sky]').disabled,false);
    for(const el of ui.document.querySelectorAll('[data-play-cell] .luma-native'))assert.match(el.textContent,/^#[\uE000-\uE013]{2}$/);
    assert.equal(ui.saved().cosmos.workshop.observations,undefined);
  }finally{await ui.close();}
});

test('a live Luma intention and safely rendered reflection survive local reopening',async()=>{
  let ui=await mountLocal();try{
    await ui.begin();ui.key('o');input(ui,'[data-practice]','Mars','change');ui.click('[data-keep-sky]');await ui.idle();
    assert.equal(ui.saved().cosmos.workshop.observations[0].practice,'Mars');
    const text='I repaired <the invitation> & asked the recipient what remained unclear.';
    input(ui,'[data-reflection="1"]',text);ui.click('[data-save-reflection="1"]');await ui.idle();
    assert.equal(ui.saved().cosmos.workshop.observations[0].reflections[0].text,text);
    const snapshot=ui.saved();await ui.close();ui=await mountLocal({snapshot});await ui.begin();ui.key('o');
    assert.ok(ui.q('[data-sky-notebook]').textContent.includes(text));assert.equal(ui.document.querySelector('[data-sky-notebook] the'),null);
  }finally{await ui.close();}
});

test('the shared notebook takes the server sky, survives polling and excludes the study timestamp from commands',async()=>{
  const server=await service();let ui;try{
    ui=await mountShared(server);await ui.join('Sky witness');await ui.tab('cosmos');ui.click('[data-keep-sky]');await ui.idle();
    const token=ui.window.sessionStorage.getItem('anima-commons-token'),state=await server.state(token);assert.equal(state.cosmos.workshop.observations.length,1);
    input(ui,'[data-reflection="1"]','I made room for another reader.');ui.click('[data-save-reflection="1"]');await ui.idle();await ui.poll();
    const after=await server.state(token);assert.equal(after.cosmos.workshop.observations[0].reflections.length,1);assert.deepEqual(state.you.inventory,after.you.inventory);
    ui.click('[data-sky-step="86400000"]');assert.equal(ui.q('[data-keep-sky]').disabled,true);
    const requests=ui.requests.filter(r=>r.body?.op==='cosmos.observe');assert.equal(requests.length,1);assert.deepEqual(Object.keys(requests[0].body.payload),['practice']);
  }finally{await ui?.close();await server.close();}
});
