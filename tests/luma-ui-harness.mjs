// DOM emulation with mocked canvas contexts and actual loopback HTTP/SQLite.
// These tests execute the shipped module and DOM handlers; they are not a real
// browser, visual render, accessibility certification, or human playtest.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {Window} from 'happy-dom';
import {createRealmServer} from '../server/index.mjs';
import {SharedRealm} from '../server/authority.mjs';
import {SPEED, NODE_DEFINITIONS} from '../public/shared-rules.js';
import {seed, compile} from '../public/creation.js';

const nativeFetch = globalThis.fetch;
const nativeSetTimeout = globalThis.setTimeout;
const nativeClearTimeout = globalThis.clearTimeout;
const nextTurn = () => new Promise(resolve => setImmediate(resolve));
let moduleSequence = 0;
const html = await fs.readFile(new URL('../public/shared.html', import.meta.url), 'utf8');

export async function service() {
  let clock = 1_800_000_000_000;
  const realm = new SharedRealm({path: ':memory:', now: () => clock});
  const server = createRealmServer({realm});
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  return {
    origin, advance: milliseconds => { clock += milliseconds; },
    async state(token) { return (await nativeFetch(origin + '/api/state', {headers: {Authorization: 'Bearer ' + token}})).json(); },
    async newPlayer(name) { return (await nativeFetch(origin + '/api/session', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name})})).json(); },
    async close() { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); realm.close(); }
  };
}

export async function mountShared(server, {storage = {}, intercept = null} = {}) {
  const window = new Window({url: server.origin + '/shared.html', settings: {disableCSSFileLoading: true, disableJavaScriptFileLoading: true, disableJavaScriptEvaluation: true}});
  window.document.write(html);
  Object.defineProperty(window.document, 'hidden', {value: false});
  for (const [key, value] of Object.entries(storage)) window.sessionStorage.setItem(key, value);
  const ctx = new Proxy({}, {get(target, key) {
    if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({addColorStop() {}});
    if (key === 'measureText') return () => ({width: 12});
    return target[key] ?? (() => {});
  }, set(target, key, value) { target[key] = value; return true; }});
  window.HTMLCanvasElement.prototype.getContext = function(kind) { return kind === '2d' ? ctx : null; };
  window.HTMLElement.prototype.setPointerCapture = () => {};
  window.HTMLElement.prototype.releasePointerCapture = () => {};
  const audioNotes = installAudio(window);
  const requests = [], intervals = new Map(), frames = [], timers = new Set(), originals = new Map();
  let pending = 0, intervalSequence = 0, animationTime = 0;
  const setGlobal = (key, value) => {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {configurable: true, writable: true, value});
  };
  setGlobal('window', window); setGlobal('document', window.document);
  setGlobal('sessionStorage', window.sessionStorage);
  setGlobal('innerWidth', 1280); setGlobal('innerHeight', 800);
  setGlobal('matchMedia', window.matchMedia.bind(window));
  setGlobal('requestAnimationFrame', callback => { frames.push(callback); return frames.length; });
  setGlobal('setInterval', (callback, duration) => { const id = ++intervalSequence; intervals.set(id, {callback, duration}); return id; });
  setGlobal('clearInterval', id => intervals.delete(id));
  setGlobal('setTimeout', (callback, duration, ...args) => { const id = nativeSetTimeout(callback, duration, ...args); id.unref?.(); timers.add(id); return id; });
  setGlobal('fetch', async (url, options = {}) => {
    const request = {path: String(url), method: options.method || 'GET', token: options.headers?.Authorization || '', body: options.body ? JSON.parse(options.body) : null};
    requests.push(request); pending++;
    try {
      const response = await nativeFetch(new URL(url, server.origin), options);
      return intercept ? await intercept(request, response) : response;
    } finally { pending--; }
  });
  const ui = {
    window, document: window.document, requests, audioNotes,
    q(selector) { const el = window.document.querySelector(selector); assert.ok(el, `Missing DOM control ${selector}`); return el; },
    click(selector) { this.q(selector).click(); },
    input(selector, value) { const el = this.q(selector); el.focus(); el.value = String(value); el.dispatchEvent(new window.Event('input', {bubbles: true})); el.dispatchEvent(new window.Event('change', {bubbles: true})); return el; },
    async wait(predicate, message = 'DOM transition', max = 400) {
      for (let i = 0; i < max; i++) { if (predicate()) return; await new Promise(resolve => nativeSetTimeout(resolve, 3)); }
      throw Error(message + ' did not complete. Notice: ' + window.document.querySelector('#commons-notice')?.textContent + '; entry: ' + window.document.querySelector('#entry-status')?.textContent);
    },
    async idle() { let settled = 0; for (let i = 0; i < 600 && settled < 4; i++) { await nextTurn(); if (pending) settled = 0; else settled++; } assert.equal(pending, 0, 'HTTP requests did not settle'); await nextTurn(); },
    async poll() { server.advance(1000); animationTime += 1000; const fn = frames.shift(); assert.ok(fn, 'Missing frame callback'); fn(animationTime); await this.idle(); },
    async step(count = 1) { for (let i = 0; i < count; i++) { server.advance(100); const loop = [...intervals.values()].find(v => v.duration === 100); assert.ok(loop); await loop.callback(); await this.idle(); } },
    inventory(item) { return Number(this.q(`[data-item="${item}"] b`).textContent); },
    position() { const match = this.q('#position-label').textContent.match(/(-?[\d.]+), (-?[\d.]+)$/); assert.ok(match); return {x: Number(match[1]), z: Number(match[2])}; },
    async tab(name) { this.click(`[data-tab="${name}"]`); await this.idle(); assert.equal(this.q(`[data-tab="${name}"]`).getAttribute('aria-pressed'), 'true'); },
    async join(name) { await this.wait(() => this.q('#entry-status').textContent.includes('ready')); this.input('#wayfarer-name', name); this.click('#join-button'); await this.wait(() => !this.q('#commons-play').hidden, 'new-player form'); await this.idle(); assert.equal(this.q('#player-label').textContent, name); },
    async walk(selector) { this.click(selector); assert.match(this.q('#journey-label').textContent, /Walking/); for (let n = 0; n < 600 && this.q('#journey-label').textContent.startsWith('Walking'); n++) await this.step(); assert.match(this.q('#commons-notice').textContent, /Arrived/); },
    async gather(node = 'grove', count = 1) {
      const item = NODE_DEFINITIONS.find(n => n.id === node).item;
      for (let n = 0; n < count; n++) { server.advance(1000); const before = this.inventory(item); this.click(`[data-gather="${node}"]`); await this.wait(() => this.inventory(item) === before + 1, 'gather'); await this.idle(); }
    },
    async recovery() { await this.tab('journal'); this.click('#show-recovery'); return this.q('#my-recovery').textContent; },
    savedStorage() { return Object.fromEntries(Array.from({length: window.sessionStorage.length}, (_, i) => { const key = window.sessionStorage.key(i); return [key, window.sessionStorage.getItem(key)]; })); },
    async close() { await this.idle(); for (const id of timers) nativeClearTimeout(id); for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } await window.happyDOM.close(); }
  };
  await import(new URL(`../public/shared-client.js?dom-test=${++moduleSequence}`, import.meta.url));
  return ui;
}

function installAudio(window) {
  const notes=[];
  const gain={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};
  window.AudioContext=class {
    currentTime=0;destination={};
    async resume(){} async close(){}
    createGain(){return {gain,connect(){},disconnect(){}};}
    createOscillator(){const oscillator={frequency:{value:0},connect(){},disconnect(){},stop(){},start(at){notes.push({frequency:oscillator.frequency.value,at,type:oscillator.type});}};return oscillator;}
  };
  return notes;
}

export async function mountLocal({snapshot=null}={}) {
  const content=await fs.readFile(new URL('../public/play.html',import.meta.url),'utf8');
  const window=new Window({url:'http://localhost/play.html',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true}});
  window.document.write(content);
  if(snapshot)window.localStorage.setItem('awe-concord-v10',JSON.stringify(snapshot));
  const originals=new Map(),timers=new Set(),frames=[];
  const setGlobal=(key,value)=>{originals.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});};
  const ctx=new Proxy({}, {get(target,key){
    if(key==='createLinearGradient'||key==='createRadialGradient')return ()=>({addColorStop(){}});
    if(key==='measureText')return text=>({width:String(text).length*7});
    return target[key]??(()=>{});
  },set(target,key,value){target[key]=value;return true;}});
  window.HTMLCanvasElement.prototype.getContext=function(kind){return kind==='2d'?ctx:null;};
  window.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({x:0,y:0,left:0,top:0,width:1280,height:800,right:1280,bottom:800});
  window.HTMLElement.prototype.setPointerCapture=()=>{};
  window.HTMLElement.prototype.releasePointerCapture=()=>{};
  for(const [key,value] of Object.entries({window,document:window.document,localStorage:window.localStorage,sessionStorage:window.sessionStorage,
    navigator:{locks:{request:async(_name,_options,callback)=>callback({})}},location:window.location,
    HTMLElement:window.HTMLElement,HTMLInputElement:window.HTMLInputElement,innerWidth:1280,innerHeight:800,devicePixelRatio:1,
    matchMedia:window.matchMedia.bind(window),requestAnimationFrame:fn=>{frames.push(fn);return frames.length;},
    cancelAnimationFrame:()=>{},setTimeout:(fn,time,...args)=>{const id=nativeSetTimeout(fn,time,...args);id.unref?.();timers.add(id);return id;}
  }))setGlobal(key,value);
  const audioNotes=installAudio(window);
  const ui={window,document:window.document,audioNotes,
    q(selector){const el=window.document.querySelector(selector);assert.ok(el,`Missing DOM control ${selector}`);return el;},
    click(selector){this.q(selector).click();},
    input(selector,value){const el=this.q(selector);el.focus();el.value=String(value);el.dispatchEvent(new window.Event('input',{bubbles:true}));el.dispatchEvent(new window.Event('change',{bubbles:true}));return el;},
    async wait(predicate,message='local DOM transition',max=400){for(let i=0;i<max;i++){if(predicate())return;await new Promise(resolve=>nativeSetTimeout(resolve,3));}throw Error(message+' did not complete. Notice: '+this.q('#notice').textContent+'; Luma: '+window.document.querySelector('#luma-feedback')?.textContent);},
    async idle(){await nextTurn();await nextTurn();},
    saved(){const raw=window.localStorage.getItem('awe-concord-v10');assert.ok(raw,'The actual game did not save');return JSON.parse(raw);},
    key(value){this.q('#world').focus();this.q('#world').dispatchEvent(new window.KeyboardEvent('keydown',{key:value,bubbles:true}));this.q('#world').dispatchEvent(new window.KeyboardEvent('keyup',{key:value,bubbles:true}));},
    async begin(){this.click(snapshot?'#continue':'#begin');await this.wait(()=>this.q('#welcome').hidden);await this.idle();},
    async close(){window.dispatchEvent(new window.Event('pagehide'));for(const timer of timers)nativeClearTimeout(timer);for(const [key,descriptor]of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}await window.happyDOM.close();}
  };
  try{await import(new URL(`../public/app.js?luma-dom=${++moduleSequence}`,import.meta.url));}catch(error){await ui.close();throw error;}
  return ui;
}
