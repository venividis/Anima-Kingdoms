import test from 'node:test';
import assert from 'node:assert/strict';
import * as W from '../public/world.js';

const copy = value => JSON.parse(JSON.stringify(value));
const conserved = w => assert.deepEqual(W.ledger(w), {water: 0, money: 50, fiber: 48, focus: 24, food: 4});
const reload = w => W.validateSave(copy(w));
const agent = (w, from, to, capacity, kind = 'installed') => W.channel(w, from, to, capacity, kind, 'agent');

test('new public maintenance recovers all eight agent-held slots without taking agent fiber', () => {
  let w = W.genesis();
  W.grant(w, true);
  for (const [from, to] of W.PAIRS) agent(w, from, to, 1);
  assert.equal(Object.keys(w.channels).length, 8);
  assert.equal(w.fiber.agent, 4);
  for (const c of Object.values(w.channels)) {
    assert.equal(c.owner, 'agent');
    assert.equal(c.maintainer, 'human');
  }
  W.grant(w, false);
  w = reload(w);
  const humanBefore = w.fiber.human;
  for (const key of W.KEYS) {
    W.removeChannel(w, key);
    conserved(w);
  }
  assert.equal(Object.keys(w.channels).length, 0);
  assert.equal(w.fiber.human, humanBefore);
  assert.equal(w.fiber.agent, 4, 'capacity-one salvage is zero, not a transfer to the caretaker');
  assert.equal(w.scrap, 8);
  W.installBraid(w);
  W.pulse(w);
  assert.equal(W.bridgeOpen(w), true, 'a funded legal route can be rebuilt after maintenance');
  assert.equal(w.deliveries.bridge, 4);
  w = reload(w);
  assert.equal(W.bridgeOpen(w), true);
  for (let n = 0; n < 3000 && w.cargo.status !== 'delivered'; n++) W.tickCargo(w, 1 / 60);
  assert.equal(w.cargo.status, 'delivered');
  assert.equal(w.balances.carrier, 12);
  conserved(w);
  reload(w);
});

test('odd-capacity caretaker salvage returns rounded-down recovery only to the original owner', () => {
  const w = W.genesis();
  W.grant(w, true);
  agent(w, 'spring', 'west', 5);
  const humanBefore = w.fiber.human;
  W.removeChannel(w, 'spring>west');
  assert.equal(w.fiber.agent, 9);
  assert.equal(w.fiber.human, humanBefore);
  assert.equal(w.scrap, 3);
  assert.match(w.events.at(-1).text, /2 fiber returned to Serein/);
  const after = JSON.stringify(w);
  assert.throws(() => W.removeChannel(w, 'spring>west'), /salvaged/);
  assert.equal(JSON.stringify(w), after, 'repeated removal cannot refund twice');
  conserved(w);
  reload(w);
});

test('legacy unmarked agent channels retain ownership through load, revoke and re-invitation', () => {
  let w = W.genesis();
  W.grant(w, true);
  agent(w, 'spring', 'west', 4);
  // This is an explicit historical-save fixture, not a legal new installation.
  delete w.channels['spring>west'].maintainer;
  const historical = copy(w.channels['spring>west']);
  w = reload(w);
  W.grant(w, false);
  W.grant(w, true);
  W.grant(w, false);
  assert.deepEqual(w.channels['spring>west'], historical);
  const before = JSON.stringify(w);
  assert.throws(() => W.removeChannel(w, 'spring>west'), /agreed human maintenance/);
  assert.equal(JSON.stringify(w), before);
  conserved(w);
  reload(w);
});

test('human channel shape and original salvage behavior stay unchanged', () => {
  const w = W.genesis();
  W.channel(w, 'spring', 'west', 5);
  assert.deepEqual(w.channels['spring>west'], {from: 'spring', to: 'west', capacity: 5, kind: 'installed', owner: 'human', remaining: null});
  W.removeChannel(w, 'spring>west');
  assert.equal(w.fiber.human, 21);
  assert.equal(w.fiber.agent, 12);
  assert.equal(w.scrap, 3);
  conserved(w);
  reload(w);
});

test('a saved maintainer marker is valid only for the exact human-caretaker agent-owner contract', () => {
  const w = W.genesis();
  W.grant(w, true);
  agent(w, 'spring', 'west', 4);
  reload(w);
  for (const mutation of [
    c => { c.maintainer = 'agent'; },
    c => { c.maintainer = 'keeper'; },
    c => { c.maintainer = true; },
    c => { c.maintainer = null; },
    c => { c.owner = 'human'; },
    c => { c.owner = 'keeper'; },
    c => { c.owner = true; },
    c => { c.caretaker = 'human'; },
    c => { c.remaining = 1; }
  ]) {
    const invalid = copy(w);
    mutation(invalid.channels['spring>west']);
    assert.throws(() => W.validateSave(invalid), /Invalid channel record/);
  }
});

test('caretaker removal of a temporary channel does not refund spent Focus or create fiber', () => {
  let w = W.genesis();
  W.grant(w, true);
  agent(w, 'spring', 'west', 5, 'temporary');
  W.grant(w, false);
  w = reload(w);
  const fiber = copy(w.fiber), focus = copy(w.focus), spent = w.focusSpent, water = copy(w.storage);
  W.removeChannel(w, 'spring>west');
  assert.deepEqual(w.fiber, fiber);
  assert.deepEqual(w.focus, focus);
  assert.equal(w.focusSpent, spent);
  assert.deepEqual(w.storage, water);
  assert.equal(w.scrap, 0);
  conserved(w);
  reload(w);
});

test('marked temporary channels still expire on their third rain pulse', () => {
  let w = W.genesis();
  W.grant(w, true);
  agent(w, 'spring', 'west', 6, 'temporary');
  agent(w, 'west', 'bridge', 6, 'temporary');
  for (let i = 0; i < 2; i++) { W.pulse(w); w = reload(w); }
  assert.equal(Object.keys(w.channels).length, 2);
  W.pulse(w);
  assert.equal(Object.keys(w.channels).length, 0);
  assert.equal(w.focus.agent, 0);
  assert.equal(w.focusSpent, 12);
  assert.equal(w.fiber.agent, 12);
  conserved(w);
  reload(w);
});

test('maintenance invalidates a previously inspected proposal and a fresh proposal remains legal', () => {
  const w = W.genesis();
  W.grant(w, true);
  agent(w, 'spring', 'west', 4);
  const old = W.propose(w), oldRevision = w.revision;
  W.removeChannel(w, 'spring>west');
  assert.ok(w.revision > oldRevision);
  const before = JSON.stringify(w);
  assert.throws(() => W.acceptProposal(w, old), /world changed/i);
  assert.equal(JSON.stringify(w), before);
  const fresh = W.propose(w);
  W.acceptProposal(w, fresh);
  for (const [from, to] of fresh.plan) {
    const c = w.channels[`${from}>${to}`];
    assert.equal(c.owner, 'agent');
    assert.equal(c.maintainer, 'human');
  }
  conserved(w);
  reload(w);
});
