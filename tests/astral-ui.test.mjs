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
  const before=ui.saved();ui.click('#open-cosmos');ui.click('[data-astral-launch]');assert.ok(ui.q('#panel').classList.contains('astral-panel'));assert.equal(ui.q('[data-name]').textContent,'Earth');
  ui.click('[data-atlas]');assert.equal(ui.document.querySelectorAll('[data-world]').length,38);ui.input('[data-search]','europa');assert.equal(ui.document.querySelectorAll('[data-world]').length,1);ui.click('[data-world="europa"]');await ui.frames(50);assert.equal(ui.q('[data-name]').textContent,'Europa');
  ui.click('[data-site="chaos"]');ui.click('[data-descend]');await ui.frames(40);assert.equal(ui.q('[data-surface]').getAttribute('aria-pressed'),'true');
  const eye=eyes.at(-1);ui.q('.astral-canvas').dispatchEvent(new ui.window.KeyboardEvent('keydown',{key:'w',bubbles:true}));await ui.frames(10);ui.q('.astral-canvas').dispatchEvent(new ui.window.KeyboardEvent('keyup',{key:'w',bubbles:true}));assert.notDeepEqual(eyes.at(-1),eye,'Flight moves the view');
  ui.click('[data-reading]');ui.input('[data-note]','I followed the broken ice.');ui.click('[data-remember]');const saved=ui.saved();assert.deepEqual(saved.cosmos.astral.encounters,[{world:'europa',site:'chaos',clock:before.cosmos.clock,note:'I followed the broken ice.'}]);assert.deepEqual(saved.hero,before.hero);assert.equal(saved.tick,before.tick);assert.deepEqual(saved.pack,before.pack);
  ui.click('[data-return]');assert.equal(ui.q('#panel').hidden,true);assert.equal(ui.q('#hud').inert,false);ui.click('#open-astral');assert.equal(ui.q('[data-journal-count]').textContent.startsWith('1 places remembered'),true);ui.click('[data-return]');
 }finally{globalThis.Image=originalImage;globalThis.performance=originalPerformance;await ui.close();}
});

test('a browser without WebGL reports the requirement and keeps Return to town working',async()=>{const ui=await mountLocal();try{await ui.begin();ui.click('#open-astral');assert.match(ui.q('[data-status]').textContent,/WebGL 2/);ui.click('[data-return]');assert.equal(ui.q('#panel').hidden,true);}finally{await ui.close();}});
