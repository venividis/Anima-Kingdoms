import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../public/realm.js';

let sequence = 0;
const command = (s, op, payload = {}, controller = 'human', overrides = {}) => R.command(s, {
  world: s.id,
  rules: R.Kingdoms.RULES,
  controller,
  epoch: s.kingdoms.grant.epoch,
  revision: s.kingdoms.revision,
  key: `guided-authority-${++sequence}`,
  op,
  payload,
  ...overrides
});
const advance = (s, frames, input = {}) => {
  for (let i = 0; i < frames; i++) R.tick(s, input);
};
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);

test('ordinary guided walking uses normal speed and finishes at its legal destination', () => {
  const s = R.newRealm();
  command(s, 'walk', {x: 0, z: 0});
  advance(s, 60);
  close(16 - s.hero.z, 4.3);
  assert.ok(s.kingdoms.journey);
  for (let n = 0; n < 1000 && s.kingdoms.journey; n++) R.tick(s);
  assert.equal(s.kingdoms.journey, null);
  assert.ok(Math.hypot(s.hero.x, s.hero.z) < 0.6);
  assert.ok(R.legal(s, s.hero.x, s.hero.z));
});

test('guarding stops a guided walk and keeps manual guarded movement at its real speed', () => {
  const s = R.newRealm(), manual = R.newRealm();
  command(s, 'walk', {x: 0, z: 0});
  R.tick(s, {guard: true, aim: Math.PI / 2});
  assert.equal(s.kingdoms.journey, null);
  close(s.hero.z, 16);
  close(s.hero.angle, Math.PI / 2);
  advance(s, 10, {guard: true, move: [0, -1]});
  advance(manual, 10, {guard: true, move: [0, -1]});
  close(s.hero.z, manual.hero.z);
  close(16 - s.hero.z, 4.3 * 0.45 * 10 / 60);
});

test('holding Palm cancels guided travel without adding movement during its commitment', () => {
  const s = R.newRealm();
  command(s, 'walk', {x: 0, z: 0});
  advance(s, 10, {attackHeld: 'palm', aim: Math.PI / 2});
  assert.equal(s.kingdoms.journey, null);
  close(s.hero.x, 0);
  close(s.hero.z, 16);
  assert.equal(s.hero.action.kind, 'palm');
  close(s.hero.action.angle, Math.PI / 2);
});

test('a walk requested during a committed action cannot bypass attack movement rules', () => {
  const guided = R.newRealm(), manual = R.newRealm();
  assert.equal(R.attack(guided, 'reach'), true);
  assert.equal(R.attack(manual, 'reach'), true);
  command(guided, 'walk', {x: 0, z: 0});
  R.tick(guided);
  R.tick(manual);
  assert.equal(guided.kingdoms.journey, null);
  close(guided.hero.x, manual.hero.x);
  close(guided.hero.z, manual.hero.z);
  advance(guided, 10, {move: [0, -1]});
  advance(manual, 10, {move: [0, -1]});
  close(guided.hero.z, manual.hero.z);
  close(16 - guided.hero.z, 4.3 * 0.55 * 10 / 60);
});

test('evading with a queued route gets one physical movement step', () => {
  const guided = R.newRealm(), manual = R.newRealm();
  R.dodge(guided, guided.hero, 0);
  R.dodge(manual, manual.hero, 0);
  command(guided, 'walk', {x: 0, z: 0});
  advance(guided, 24);
  advance(manual, 24);
  assert.equal(guided.kingdoms.journey, null);
  close(guided.hero.x, manual.hero.x);
  close(guided.hero.z, manual.hero.z);
  close(guided.hero.z - 16, 3.6);
});

test('jumping yields control and a fresh route cannot add travel while airborne', () => {
  const s = R.newRealm();
  command(s, 'walk', {x: 0, z: 0});
  R.tick(s, {jump: true});
  assert.ok(s.hero.y > 0);
  assert.equal(s.kingdoms.journey, null);
  close(s.hero.z, 16);
  command(s, 'walk', {x: 0, z: 0});
  R.tick(s);
  assert.equal(s.kingdoms.journey, null);
  close(s.hero.z, 16);
});

test('revocation stops an accepted agent walk and rejects its stale epoch without mutation', () => {
  const s = R.newRealm();
  command(s, 'grant', {enabled: true, limit: 3});
  const oldEpoch = s.kingdoms.grant.epoch;
  command(s, 'walk', {x: 0, z: 0}, 'agent');
  advance(s, 10);
  const before = {x: s.hero.x, z: s.hero.z};
  command(s, 'grant', {enabled: false, limit: 0});
  assert.equal(s.kingdoms.journey, null);
  advance(s, 60);
  close(s.hero.x, before.x);
  close(s.hero.z, before.z);
  const state = JSON.stringify(s);
  assert.throws(() => command(s, 'walk', {x: 0, z: 0}, 'agent', {epoch: oldEpoch}), /revoked|authority/i);
  assert.equal(JSON.stringify(s), state);
  const restored = R.restore(R.snapshot(s));
  assert.equal(restored.kingdoms.journey, null);
  assert.equal(restored.kingdoms.grant.enabled, false);
});

test('revocation deliberately stops the single-body queued walk even when human-started', () => {
  const s = R.newRealm();
  command(s, 'walk', {x: 0, z: 0});
  command(s, 'grant', {enabled: false, limit: 0});
  advance(s, 60);
  assert.equal(s.kingdoms.journey, null);
  close(s.hero.x, 0);
  close(s.hero.z, 16);
});
