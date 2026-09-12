// DOM emulation with mocked canvas contexts and actual loopback HTTP/SQLite.
// These tests execute the shipped module and DOM handlers; they are not a real
// browser, visual render, accessibility certification, or human playtest.
import test from 'node:test';
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

async function service() {
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

async function mount(server, {storage = {}, intercept = null} = {}) {
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
    window, document: window.document, requests,
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

test('DOM form creates a player, rejects remote gathering, walks legally and enforces real gather timing', async () => {
  const server = await service(); let ui;
  try {
    ui = await mount(server); await ui.join('<b>Wayfarer</b>');
    assert.equal(ui.q('#player-label').children.length, 0, 'display name must stay text');
    ui.click('[data-gather="grove"]');
    await ui.wait(() => ui.q('#commons-notice').textContent.includes('closer'));
    assert.equal(ui.inventory('wood'), 0);
    await ui.walk('[data-walk-node="grove"]');
    const p = ui.position(); assert.ok(Math.hypot(p.x + 9, p.z - 17) < 0.9);
    await ui.gather('grove');
    const nodeCard = ui.q('[data-gather="grove"]').closest('article');
    assert.match(nodeCard.textContent, /159 wood remain/);
    ui.click('[data-gather="grove"]');
    await ui.wait(() => ui.q('#commons-notice').textContent.includes('0.9 seconds'));
    assert.equal(ui.inventory('wood'), 1);
    await ui.tab('people');
    assert.equal(ui.q('#dock-content .player-row span').querySelector('b'), null, 'name markup cannot become elements');
    for (const panel of ['exchange', 'works', 'people', 'agents', 'journal', 'studio', 'works']) await ui.tab(panel);
    const moves = ui.requests.filter(r => r.body?.op === 'move');
    assert.ok(moves.length > 5, 'route uses repeated HTTP movement commands');
    for (const r of moves) { assert.deepEqual(Object.keys(r.body.payload).sort(), ['dx', 'dz']); assert.ok(Math.hypot(r.body.payload.dx, r.body.payload.dz) <= 1.000001); }
    const token = await ui.recovery(), state = await server.state(token);
    assert.ok(Object.values(state.ledger.residual).every(n => n === 0));
    assert.ok(Math.hypot(state.you.x, state.you.z - 16) <= moves.length * SPEED * 0.1 + 0.001);
  } finally { await ui?.close(); await server.close(); }
});

test('two DOM-created players gather their own goods, escrow and complete an exchange, then restore custody', async () => {
  const server = await service(); let ui;
  try {
    ui = await mount(server); await ui.join('DOM Maker');
    await ui.walk('[data-walk-node="grove"]'); await ui.gather('grove', 2);
    const makerKey = await ui.recovery();
    await ui.tab('exchange');
    ui.input('#give-quantity', 3); ui.click('#offer-form button[type="submit"]');
    await ui.wait(() => ui.q('#commons-notice').textContent.includes('do not own'));
    assert.equal(ui.inventory('wood'), 2);
    ui.input('#give-quantity', 1); ui.click('#offer-form button[type="submit"]');
    await ui.wait(() => !!ui.document.querySelector('[data-cancel-offer]'));
    assert.equal(ui.inventory('wood'), 1);
    const offerId = ui.q('[data-cancel-offer]').dataset.cancelOffer;
    await ui.close(); ui = null;
    ui = await mount(server); await ui.join('DOM Receiver');
    await ui.walk('[data-walk-node="quarry"]'); await ui.gather('quarry');
    await ui.tab('exchange');
    ui.click(`[data-fill-offer="${offerId}"]`);
    await ui.wait(() => ui.inventory('wood') === 1 && ui.inventory('stone') === 0, 'player exchange');
    assert.equal(ui.document.querySelector(`[data-fill-offer="${offerId}"]`), null);
    await ui.close(); ui = null;
    ui = await mount(server, {storage: {'anima-commons-token': makerKey}});
    await ui.wait(() => !ui.q('#commons-play').hidden, 'player restore');
    assert.equal(ui.q('#player-label').textContent, 'DOM Maker');
    assert.equal(ui.inventory('wood'), 1); assert.equal(ui.inventory('stone'), 1);
    const result = await server.state(makerKey);
    assert.ok(Object.values(result.ledger.residual).every(n => n === 0));
    assert.equal(result.offers.find(o => o.id === offerId).status, 'filled');
  } finally { await ui?.close(); await server.close(); }
});

test('polling preserves edited offer fields both while focused and after focus moves to the world', async () => {
  const server = await service(); let ui;
  try {
    ui = await mount(server); await ui.join('DOM Drafter'); await ui.tab('exchange');
    ui.input('#give-item', 'herb'); ui.input('#give-quantity', 7); ui.input('#want-item', 'marks'); ui.input('#want-quantity', 9);
    await server.newPlayer('Background arrival one'); await ui.poll();
    assert.equal(ui.q('#give-quantity').value, '7'); assert.equal(ui.q('#want-quantity').value, '9');
    ui.q('#commons-world').focus();
    await server.newPlayer('Background arrival two'); await ui.poll();
    assert.equal(ui.q('#give-item').value, 'herb'); assert.equal(ui.q('#give-quantity').value, '7');
    assert.equal(ui.q('#want-item').value, 'marks'); assert.equal(ui.q('#want-quantity').value, '9');
  } finally { await ui?.close(); await server.close(); }
});

test('uncertain committed offer remains recoverable after polling and reload without duplicate escrow', async () => {
  const server = await service(); let ui, drop = true;
  try {
    ui = await mount(server, {intercept: async (request, response) => {
      if (drop && request.body?.op === 'offer.create' && response.ok) { drop = false; await response.arrayBuffer(); throw Error('Simulated lost response after actual HTTP commit'); }
      return response;
    }});
    await ui.join('DOM Recovery'); await ui.walk('[data-walk-node="grove"]'); await ui.gather('grove'); await ui.tab('exchange');
    ui.click('#offer-form button[type="submit"]');
    await ui.wait(() => !ui.q('#pending-action').hidden, 'uncertain action prompt');
    await ui.poll();
    assert.equal(ui.q('#pending-action').hidden, false, 'ordinary polling must not conceal an unresolved action');
    const persisted = ui.savedStorage();
    const exactPending = JSON.parse(persisted['anima-commons-pending']);
    await ui.close(); ui = null;
    ui = await mount(server, {storage: persisted});
    await ui.wait(() => !ui.q('#commons-play').hidden && !ui.window.sessionStorage.getItem('anima-commons-pending'), 'reload recovery');
    await ui.tab('exchange');
    assert.equal(ui.document.querySelectorAll('[data-cancel-offer]').length, 1);
    assert.equal(ui.inventory('wood'), 0);
    const retries = ui.requests.filter(r => r.body?.op === 'offer.create');
    assert.equal(retries.length, 1); assert.deepEqual(retries[0].body, exactPending);
    ui.click('[data-cancel-offer]'); await ui.wait(() => ui.inventory('wood') === 1, 'cancel recovered offer');
  } finally { await ui?.close(); await server.close(); }
});

test('a delayed old-player refresh cannot overwrite the player restored through the recovery form', async () => {
  const server = await service(); let ui, releaseOld;
  try {
    const oldPlayer = await server.newPlayer('Old DOM Player'), currentPlayer = await server.newPlayer('Current DOM Player');
    let held = false;
    ui = await mount(server, {storage: {'anima-commons-token': oldPlayer.token}, intercept: async (request, response) => {
      if (!held && request.path === '/api/state' && request.token === 'Bearer ' + oldPlayer.token) {
        held = true; await new Promise(resolve => { releaseOld = resolve; });
      }
      return response;
    }});
    await ui.wait(() => held, 'delayed old session poll');
    ui.q('#restore-player').open = true; ui.input('#recovery-key', currentPlayer.token); ui.click('#restore-session');
    await ui.wait(() => ui.q('#player-label').textContent === 'Current DOM Player', 'recovery-key submission');
    releaseOld(); releaseOld = null; await ui.idle();
    assert.equal(ui.q('#player-label').textContent, 'Current DOM Player');
    assert.equal(ui.window.sessionStorage.getItem('anima-commons-token'), currentPlayer.token);
  } finally { releaseOld?.(); await ui?.close(); await server.close(); }
});

test('market buttons use the correct sale/purchase API and conserve actual stock, prices and Marks', async () => {
  const server = await service(); let ui;
  try {
    ui = await mount(server); await ui.join('DOM Merchant');
    await ui.walk('[data-walk-node="grove"]'); await ui.gather('grove', 2); await ui.tab('exchange');
    ui.click('#market-form button[value="sell"]');
    await ui.wait(() => ui.q('#commons-notice').textContent.includes('closer'));
    assert.equal(ui.inventory('wood'), 2); assert.equal(ui.inventory('marks'), 0);
    await ui.walk('#walk-market');
    ui.click('#market-form button[value="sell"]');
    await ui.wait(() => ui.inventory('wood') === 1 && ui.inventory('marks') === 1, 'market sale');
    assert.match(ui.q('#market-price').textContent, /Buy: 2 Marks · sell: 1 Marks · stock: 1/);
    ui.click('#market-form button[value="buy"]');
    await ui.wait(() => ui.q('#commons-notice').textContent.includes('insufficient'));
    assert.equal(ui.inventory('wood'), 1); assert.equal(ui.inventory('marks'), 1);
    ui.click('#market-form button[value="sell"]');
    await ui.wait(() => ui.inventory('wood') === 0 && ui.inventory('marks') === 2, 'second market sale');
    ui.click('#market-form button[value="buy"]');
    await ui.wait(() => ui.inventory('wood') === 1 && ui.inventory('marks') === 0, 'market purchase');
    const actualOps = ui.requests.filter(r => r.body?.op?.startsWith('market.')).map(r => r.body.op);
    assert.deepEqual(actualOps, ['market.sell', 'market.sell', 'market.buy', 'market.sell', 'market.buy']);
    const token = await ui.recovery(), state = await server.state(token);
    assert.ok(Object.values(state.ledger.residual).every(n => n === 0));
    assert.equal(state.treasury.wood, 1);
  } finally { await ui?.close(); await server.close(); }
});

test('agent invitation form issues selected scopes and the revoke button disables its actual API key', async () => {
  const server = await service(); let ui;
  try {
    ui = await mount(server); await ui.join('DOM Inviter'); await ui.tab('agents');
    ui.input('#agent-name', '<i>Pathfinder</i>'); ui.input('#agent-budget', 2);
    ui.click('input[name="scope"][value="gather"]');
    ui.click('#agent-form button[type="submit"]');
    await ui.wait(() => !ui.q('#agent-key-wrap').hidden && ui.q('#agent-key').textContent.startsWith('aka_'), 'agent invitation');
    const key = ui.q('#agent-key').textContent;
    assert.equal(ui.q('#dock-content').querySelector('h3 i'), null, 'agent names are escaped');
    assert.match(ui.q('#dock-content').textContent, /2 commands left/);
    const state = await server.state(key); assert.deepEqual(state.you.agent.scopes, ['move']);
    server.advance(100);
    const move = await nativeFetch(server.origin + '/api/command', {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + key}, body: JSON.stringify({key: 'dom-agent-move-1', expectedRevision: state.revision, op: 'move', payload: {dx: 1, dz: 0}})});
    assert.equal(move.status, 200);
    await ui.poll(); assert.match(ui.q('#dock-content').textContent, /1 commands left/);
    const current = await server.state(key);
    const denied = await nativeFetch(server.origin + '/api/command', {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + key}, body: JSON.stringify({key: 'dom-agent-denied-1', expectedRevision: current.revision, op: 'gather', payload: {nodeId: 'grove'}})});
    assert.equal(denied.status, 403);
    assert.equal((await server.state(key)).you.agent.remaining, 1);
    ui.click('[data-revoke-agent]');
    await ui.wait(() => ui.document.querySelectorAll('[data-revoke-agent]').length === 0, 'agent revocation');
    const revoked = await nativeFetch(server.origin + '/api/state', {headers: {Authorization: 'Bearer ' + key}});
    assert.equal(revoked.status, 401);
    assert.match(ui.q('#dock-content').textContent, /Revoked/);
  } finally { await ui?.close(); await server.close(); }
});

test('Studio file input publishes a compiled design and emits the correct downloadable JSON without markup execution', async () => {
  const server = await service(); let ui;
  try {
    ui = await mount(server); await ui.join('DOM Blueprint Maker'); await ui.tab('studio');
    const blueprint = seed('creature'); blueprint.name = 'Lantern <test>';
    const upload = () => { const transfer = new ui.window.DataTransfer(); transfer.items.add(new ui.window.File([JSON.stringify(blueprint)], 'lantern.json', {type: 'application/json'})); ui.q('#blueprint-file').files = transfer.files; ui.q('#blueprint-file').dispatchEvent(new ui.window.Event('change', {bubbles: true})); };
    upload();
    await ui.wait(() => ui.q('#blueprint-review').textContent.includes('plain-text'), 'invalid-name rejection');
    assert.equal(ui.q('#publish-blueprint').disabled, true);
    blueprint.name = 'Lantern & Light'; upload();
    await ui.wait(() => !ui.q('#publish-blueprint').disabled, 'blueprint file review');
    assert.equal(ui.q('#blueprint-review').querySelector('test'), null);
    ui.click('#publish-blueprint');
    await ui.wait(() => !!ui.document.querySelector('[data-blueprint-download]'), 'blueprint publication');
    assert.equal(ui.q('#dock-content').querySelector('h3 test'), null);
    assert.match(ui.q('#dock-content').textContent, /Lantern & Light/);
    const downloads = [], ordinaryClick = ui.window.HTMLAnchorElement.prototype.click;
    ui.window.HTMLAnchorElement.prototype.click = function() { if (this.download) downloads.push({href: this.href, name: this.download}); else ordinaryClick.call(this); };
    ui.click('[data-blueprint-download]');
    assert.equal(downloads.length, 1); assert.equal(downloads[0].name, 'Lantern---Light.json');
    assert.ok(downloads[0].href.startsWith('blob:'));
    const result = await nativeFetch(downloads[0].href);
    assert.equal(result.headers.get('content-type'), 'application/json');
    assert.deepEqual(await result.json(), compile(blueprint).blueprint);
    const page = await nativeFetch(server.origin + '/shared.html');
    assert.match(page.headers.get('content-security-policy'), /script-src 'self'/);
    assert.ok(!(await page.text()).includes('onclick='), 'entry markup does not depend on inline script handlers');
    ui.click('[data-blueprint-remove]');
    await ui.wait(() => !ui.document.querySelector('[data-blueprint-download]'), 'shelf removal');
    assert.equal(ui.inventory('wood'), 0, 'sharing a design cannot mint construction materials');
  } finally { await ui?.close(); await server.close(); }
});

test('an old-session auth failure cannot discard a different valid recovery key', async () => {
  const server = await service(); let ui, releaseOld;
  try {
    const current = await server.newPlayer('DOM Valid Recovery');
    const expiredKey = 'ak_synthetic_unknown_credential_for_dom_test'; let held = false;
    ui = await mount(server, {storage: {'anima-commons-token': expiredKey}, intercept: async (request, response) => {
      if (!held && request.path === '/api/state' && request.token === 'Bearer ' + expiredKey) { held = true; await new Promise(resolve => { releaseOld = resolve; }); }
      return response;
    }});
    await ui.wait(() => held);
    ui.q('#restore-player').open = true; ui.input('#recovery-key', current.token); ui.click('#restore-session');
    await ui.wait(() => ui.q('#player-label').textContent === 'DOM Valid Recovery');
    releaseOld(); releaseOld = null; await ui.idle();
    await ui.poll();
    assert.equal(ui.q('#commons-entry').hidden, true);
    assert.equal(ui.q('#player-label').textContent, 'DOM Valid Recovery');
    assert.equal(ui.window.sessionStorage.getItem('anima-commons-token'), current.token);
  } finally { releaseOld?.(); await ui?.close(); await server.close(); }
});
