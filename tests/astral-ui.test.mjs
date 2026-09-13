// Runs shipped game DOM handlers. Graphics calls are mocked; shader rendering is checked separately.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mountLocal} from './luma-ui-harness.mjs';

test('the game opens astral travel, pauses the town, visits a landscape, saves a Luma memory and returns home',async()=>{
 const ui=await mountLocal(),originalImage=globalThis.Image,originalPerformance=globalThis.performance,eyes=[];
 const gl=new Proxy({}, {get(_t,k){if(k==='getShaderParameter'||k==='getProgramParameter')return()=>true;if(k==='isContextLost')return()=>false;if(k==='getExtension')return()=>null;if(k==='getUniformLocation')return(_p,n)=>n;if(k==='uniform3fv')return(n,v)=>{if(n==='eye')eyes.push([...v]);};if(/^[A-Z0-9_]+$/.test(k))return 1;return()=>({});}});
 try{
  await ui.begin();globalThis.Image=class {set src(value){this.path=value;}};globalThis.performance={now:()=>0};
  const get=ui.window.HTMLCanvasElement.prototype.getContext;ui.window.HTMLCanvasElement.prototype.getContext=function(kind){return kind==='webgl2'&&this.classList.contains('astral-canvas')?gl:get.call(this,kind);};
  const before=ui.saved();ui.click('#open-cosmos');ui.click('[data-astral-launch]');assert.ok(ui.q('#panel').classList.contains('astral-panel'));assert.equal(ui.q('.astral-shell').dataset.mode,'departure');await ui.frames(14);assert.match(ui.q('[data-departure-copy]').textContent,/soul rises|body come to rest/);assert.deepEqual(ui.saved().hero,before.hero);ui.click('[data-look-up]');assert.equal(ui.q('.astral-shell').dataset.mode,'sky');
  await ui.frames(2);if(ui.q('[data-light="jupiter"]').hidden){ui.click('[data-other-sky]');await ui.frames(2);}assert.equal(ui.q('[data-light="jupiter"]').hidden,false);ui.click('[data-light="jupiter"]');assert.ok(ui.q('[data-follow="europa"]'));ui.click('[data-follow="europa"]');await ui.frames(50);assert.equal(ui.q('[data-name]').textContent,'Europa');
  ui.click('[data-site="chaos"]');ui.click('[data-descend]');await ui.frames(40);assert.equal(ui.q('[data-surface]').getAttribute('aria-pressed'),'true');
  const eye=eyes.at(-1);ui.q('.astral-canvas').dispatchEvent(new ui.window.KeyboardEvent('keydown',{key:'w',bubbles:true}));await ui.frames(10);ui.q('.astral-canvas').dispatchEvent(new ui.window.KeyboardEvent('keyup',{key:'w',bubbles:true}));assert.notDeepEqual(eyes.at(-1),eye,'Flight moves the view');
  ui.click('[data-reading]');ui.input('[data-note]','I followed the broken ice.');ui.click('[data-remember]');const saved=ui.saved();assert.deepEqual(saved.cosmos.astral.encounters,[{world:'europa',site:'chaos',clock:before.cosmos.clock,note:'I followed the broken ice.'}]);assert.deepEqual(saved.hero,before.hero);assert.equal(saved.tick,before.tick);assert.deepEqual(saved.pack,before.pack);
  ui.click('[data-night-sky]');assert.equal(ui.q('.astral-shell').dataset.mode,'sky');ui.click('[data-return]');assert.equal(ui.q('#panel').hidden,true);assert.equal(ui.document.body.classList.contains('astral-active'),false);assert.equal(ui.q('#hud').inert,false);ui.click('#open-astral');assert.equal(ui.q('[data-journal-count]').textContent.startsWith('1 places remembered'),true);ui.click('[data-return]');
 }finally{globalThis.Image=originalImage;globalThis.performance=originalPerformance;await ui.close();}
});

test('whole sky works without WebGL, hides its interface, and still returns safely after a world renderer fails',async()=>{
 const ui=await mountLocal();try{
  await ui.begin();const before=ui.saved();ui.click('#open-astral');ui.click('[data-look-up]');await ui.frames(2);
  assert.equal(ui.q('.astral-shell').dataset.mode,'sky');assert.doesNotMatch(ui.q('[data-status]').textContent,/WebGL/);
  ui.click('[data-clear-sky]');assert.equal(ui.q('.astral-shell').classList.contains('astral-uncluttered'),true);assert.equal(ui.q('[data-clear-sky]').textContent,'Show paths');ui.click('[data-clear-sky]');
  ui.click('[data-home-light]');ui.click('[data-follow="earth"]');assert.match(ui.q('[data-status]').textContent,/WebGL 2/);assert.equal(ui.q('.astral-shell').dataset.mode,'sky');
  ui.click('[data-atlas]');assert.equal(ui.document.querySelectorAll('[data-world]').length,38);ui.input('[data-search]','europa');assert.equal(ui.document.querySelectorAll('[data-world]').length,1);
  ui.click('[data-return]');assert.equal(ui.q('#panel').hidden,true);assert.deepEqual(ui.saved(),before);
 }finally{await ui.close();}
});

test('departure completes into the full sky and keyboard, dragging and both hemispheres leave the body untouched',async()=>{
 const ui=await mountLocal();try{
  await ui.begin();const before=ui.saved();ui.click('#open-astral');await ui.frames(72);assert.equal(ui.q('.astral-shell').dataset.mode,'sky');
  const canvas=ui.q('.astral-sky-canvas'),event=(name,x,y,id=1)=>canvas.dispatchEvent(new ui.window.PointerEvent(name,{clientX:x,clientY:y,pointerId:id,bubbles:true}));
  event('pointerdown',500,300);event('pointermove',560,340);event('pointerup',560,340);await ui.frames(2);assert.equal(ui.q('[data-whole-sky]').getAttribute('aria-pressed'),'false');
  ui.click('[data-whole-sky]');await ui.frames(2);const above=[...ui.document.querySelectorAll('[data-light]')].filter(b=>!b.hidden).map(b=>b.dataset.light);ui.click('[data-other-sky]');await ui.frames(2);const below=[...ui.document.querySelectorAll('[data-light]')].filter(b=>!b.hidden).map(b=>b.dataset.light);assert.equal(new Set([...above,...below]).size,11);
  canvas.dispatchEvent(new ui.window.KeyboardEvent('keydown',{key:'w',bubbles:true}));await ui.frames(5);canvas.dispatchEvent(new ui.window.KeyboardEvent('keyup',{key:'w',bubbles:true}));assert.equal(ui.q('[data-whole-sky]').getAttribute('aria-pressed'),'false');
  ui.click('[data-return]');assert.deepEqual(ui.saved().hero,before.hero);assert.equal(ui.saved().cosmos.clock,before.cosmos.clock);assert.equal(ui.q('#hud').inert,false);
 }finally{await ui.close();}
});
