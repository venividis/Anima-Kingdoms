import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {combatKey} from '../public/combat.js';

// Execute the actual registered application handlers with synthetic keyboard events.
// This is a deterministic DOM-free regression, not a browser interaction claim.
function controls() {
  const source = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const start = source.indexOf("window.addEventListener('keydown',");
  const end = source.indexOf("window.addEventListener('blur',clearInput)", start);
  assert.ok(start >= 0 && end > start, 'application keyboard handlers must be found');
  const handlers = {}, fired = [], cancelled = [], world = {closest: () => null};
  const ctx = {
    window: {addEventListener: (type, fn) => {handlers[type] = fn;}},
    $: id => id === 'welcome' ? {hidden: true} : world,
    combatKey, keys: {}, modal: null, activity: null, placing: null,
    state: {mode: 'world', activity: null}, pending: {}, pendingP2: {},
    fire: kind => fired.push(kind),
    R: {cancelBufferedAttack: (...args) => cancelled.push(args)},
  };
  vm.createContext(ctx);
  vm.runInContext(source.slice(start, end), ctx);
  const event = (key, code, shiftKey = false) => ({key, code, shiftKey, target: world, repeat: false, preventDefault() {}});
  return {ctx, handlers, fired, cancelled, event};
}

test('Shift plus physical attack digits still triggers all four abilities', () => {
  const {handlers, event, fired} = controls();
  handlers.keydown(event('Shift', 'ShiftLeft', true));
  for (const [key, code] of [['!', 'Digit1'], ['@', 'Digit2'], ['#', 'Digit3'], ['$', 'Digit4']]) {
    handlers.keydown(event(key, code, true));
    handlers.keyup(event(key, code, true));
  }
  assert.deepEqual(fired, ['palm', 'reach', 'note', 'gale']);
});

test('releasing Palm while Shift is held clears held input and its buffered repeat', () => {
  const {ctx, handlers, event, cancelled} = controls();
  handlers.keydown(event('1', 'Digit1'));
  assert.equal(ctx.keys['1'], true);
  handlers.keydown(event('Shift', 'ShiftLeft', true));
  handlers.keyup(event('!', 'Digit1', true));
  assert.equal(ctx.keys['1'], undefined, 'shifted keyup must release the physical Palm key');
  assert.equal(ctx.keys.shiftleft, true, 'releasing Palm must preserve the held run modifier');
  assert.equal(cancelled.length, 1, 'uncommitted held follow-up must be cancelled');
});

test('releasing Shift before Palm also clears the same physical attack key', () => {
  const {ctx, handlers, event, cancelled} = controls();
  handlers.keydown(event('Shift', 'ShiftLeft', true));
  handlers.keydown(event('!', 'Digit1', true));
  handlers.keyup(event('Shift', 'ShiftLeft'));
  handlers.keyup(event('1', 'Digit1'));
  assert.equal(ctx.keys['1'], undefined);
  assert.equal(ctx.keys.shiftleft, undefined);
  assert.equal(cancelled.length, 1);
});
