import {CanvasWorldView} from '../public/canvas-view.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../public/realm.js';
import * as C from '../public/combat.js';

// Independent behavioral regressions. No browser, performance, or human-play claims.
const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-8, message || `${actual} != ${expected}`);
const advance = (s, frames, input = {}) => { for (let i = 0; i < frames; i++) R.tick(s, typeof input === 'function' ? input(i) : input); };
function duel() {
  const s = R.newRealm();
  R.enterActivity(s, 'duel', true);
  Object.assign(s.hero, {x: -83, z: 16, angle: 0});
  Object.assign(s.enemies[0], {x: -83, z: 18, angle: Math.PI});
  return s;
}
function queueLate(s, kind = 'palm') {
  R.tick(s, {attack: 'reach', aim: 0});
  advance(s, 26);
  R.tick(s, {attack: kind, aim: 0});
  assert.equal(R.combatState(s).queued, kind);
}

test('strafe during projectile windup preserves committed zero-radian aim', () => {
  const s = duel();
  R.tick(s, {attack: 'note', aim: 0, move: [1, 0]});
  advance(s, R.MOVES.note.startup - 1, {move: [1, 0]});
  assert.ok(s.hero.x > -83, 'body should still strafe');
  assert.equal(s.bolts.length, 1);
  close(s.bolts[0].dx, 0);
  close(s.bolts[0].dz, 1);
  close(s.hero.action.angle, 0);
});

test('later aim input cannot spin an active melee swing into a different target', () => {
  const s = duel();
  R.tick(s, {attack: 'palm', aim: 0});
  advance(s, R.MOVES.palm.startup - 1, {aim: Math.PI});
  assert.equal(s.enemies[0].hp, 94);
  close(s.hero.angle, 0);
});

test('a late buffered attack starts exactly once and charges only on acceptance', () => {
  const s = duel();
  queueLate(s, 'note');
  assert.equal(s.hero.breath, 90, 'queued shot must not prepay');
  advance(s, 8);
  assert.equal(s.hero.action.kind, 'note');
  assert.equal(s.hero.breath, 78);
  assert.equal(R.combatState(s).queued, null);
  advance(s, 40);
  assert.equal(s.stats.shots, 1);
  assert.equal(s.hero.action, null);
});

test('early follow-up expires instead of firing long after the original press', () => {
  const s = duel();
  R.tick(s, {attack: 'gale'});
  R.tick(s, {attack: 'note'});
  advance(s, C.COMBAT.buffer + 1);
  assert.equal(R.combatState(s).queued, null);
  assert.match(R.combatState(s).feedback, /early/i);
  advance(s, 60);
  assert.equal(s.stats.shots, 0);
  assert.ok(s.hero.breath >= 70, 'normal regeneration is allowed; an expired shot must never spend Breath');
});

test('the buffer holds one newest intention, never a backlog of attacks', () => {
  const s = duel();
  queueLate(s, 'palm');
  R.tick(s, {attack: 'note'});
  advance(s, 8);
  assert.equal(s.hero.action.kind, 'note');
  advance(s, 50);
  assert.equal(s.stats.shots, 1);
  assert.equal(s.enemies[0].hp, 77, 'one Reach and one Note, without the replaced Palm');
});

for (const method of ['clear', 'cancel', 'guard']) test(`${method} cancels buffered combat without refunding committed actions`, () => {
  const s = duel();
  queueLate(s, 'note');
  if (method === 'clear') R.clearCombatInput(s);
  else R.tick(s, method === 'cancel' ? {cancelCombat: true} : {guard: true});
  assert.equal(R.combatState(s).queued, null);
  advance(s, 45);
  assert.equal(s.stats.shots, 0);
  assert.ok(s.hero.breath >= 90, 'only the accepted Reach costs Breath');
});

test('activity exit and restored snapshots cannot retain pending combat', () => {
  const s = duel();
  queueLate(s, 'note');
  const copy = R.restore(R.snapshot(s));
  assert.equal(R.combatState(copy).queued, null);
  assert.equal(copy.hero.action, null);
  assert.equal(copy.hero.dodge, 0);
  assert.equal(copy.bolts.length, 0);
  R.leaveActivity(s);
  assert.equal(R.combatState(s).queued, null);
  advance(s, 20);
  assert.equal(s.stats.shots, 0);
});

test('death cancels an attack queued before the lethal contact', () => {
  const s = duel();
  queueLate(s, 'note');
  s.hero.hp = 1;
  const e = s.enemies[0];
  e.z = s.hero.z + 2;
  R.attack(s, 'palm', e);
  advance(s, 5);
  assert.equal(s.hero.hp, 0);
  assert.equal(R.combatState(s).queued, null);
});

test('fractional movement remains proportional and diagonal magnitude is capped', () => {
  const a = duel(), b = duel(), c = duel();
  R.tick(a, {move: [0.2, 0]});
  R.tick(b, {move: [1, 0]});
  R.tick(c, {move: [1, 1]});
  close(a.hero.x + 83, (b.hero.x + 83) * 0.2);
  close(Math.hypot(c.hero.x + 83, c.hero.z - 16), b.hero.x + 83);
  for (const raw of [[NaN, 0], [Infinity, 0], [1], null]) {
    const s = duel();
    R.tick(s, {move: raw});
    close(s.hero.x, -83);
    close(s.hero.z, 16);
  }
});

test('stick dead zone and camera-relative movement preserve a usable magnitude', () => {
  assert.deepEqual(C.stickVector(2, 0), [0, 0]);
  const half = C.stickVector(24, 0), full = C.stickVector(100, 0);
  assert.ok(half[0] > 0 && half[0] < 1);
  close(Math.hypot(...full), 1);
  close(Math.hypot(...C.movementVector(1, 1, Math.PI / 4)), 1);
  close(Math.hypot(...C.movementVector(0.25, 0, Math.PI / 2)), 0.25);
});

test('evade commits to requested movement despite aiming or steering elsewhere', () => {
  const s = duel();
  R.tick(s, {move: [1, 0], aim: 0, dodge: true});
  advance(s, C.COMBAT.dodgeTravel - 1, {move: [-1, 0], aim: Math.PI});
  close(s.hero.x + 83, C.COMBAT.dodgeSpeed * C.COMBAT.dodgeTravel / 60);
  close(s.hero.z, 16);
  close(s.hero.breath, 100 - C.COMBAT.dodgeCost);
});

test('held attack input and paid moves use the same rules for both local duelists', () => {
  const s = duel();
  advance(s, 60, {attack: 'palm', aim: 0, p2: {attack: 'palm', aim: Math.PI}});
  assert.equal(s.hero.hp, s.enemies[0].hp);
  assert.ok(s.hero.hp <= 76, 'holding an attack must produce repeated legal swings');
  assert.equal(s.hero.breath, s.enemies[0].breath);
  const a = duel();
  R.tick(a, {attack: 'gale', aim: 0, p2: {attack: 'gale', aim: Math.PI}});
  assert.equal(a.hero.breath, 70);
  assert.equal(a.enemies[0].breath, 70);
});

test('fast evade still collides with arena cover without tunneling through it', () => {
  const s = R.newRealm();
  R.enterActivity(s, 'ctf');
  Object.assign(s.hero, {x: 83, z: 42, angle: Math.PI / 2});
  R.tick(s, {dodge: true, move: [1, 0]});
  advance(s, C.COMBAT.dodgeTravel - 1);
  assert.ok(s.hero.x > 83);
  assert.ok(s.hero.x <= 84.500001, 'pillar centered at x87 must stop the body at its near edge');
  assert.ok(R.legal(s, s.hero.x, s.hero.z));
});

test('neutral evade follows facing, while a late recovery cancel spends exactly once', () => {
  const s = duel();
  assert.equal(R.attack(s, 'reach'), true);
  assert.equal(R.dodge(s), false, 'startup cannot be cancelled');
  advance(s, 26);
  assert.equal(R.dodge(s, s.hero, Math.PI / 2), true);
  assert.equal(s.hero.action, null);
  assert.equal(s.hero.breath, 100 - R.MOVES.reach.cost - C.COMBAT.dodgeCost);
  assert.equal(R.dodge(s), false);
  const neutral = duel();
  neutral.hero.angle = Math.PI;
  R.tick(neutral, {dodge: true});
  assert.ok(neutral.hero.z < 16);
});

test('invulnerable targets take neither damage nor knockback', () => {
  const s = duel(), e = s.enemies[0];
  e.invuln = 100;
  R.attack(s, 'reach');
  advance(s, R.MOVES.reach.startup + R.MOVES.reach.active);
  assert.equal(e.hp, 100);
  close(e.z, 18);
});

test('guard blocks directional contact and its knockback at the real Breath cost', () => {
  const s = duel(), e = s.enemies[0];
  R.attack(s, 'reach');
  advance(s, R.MOVES.reach.startup, {p2: {guard: true, aim: Math.PI}});
  assert.equal(e.hp, 97);
  assert.equal(e.breath, 88);
  close(e.z, 18);
});

test('evade immunity exists only inside its middle window', () => {
  for (const [remainingBeforeTick, immune] of [[33, false], [32, true], [23, true], [22, false]]) {
    const s = duel(), e = s.enemies[0];
    s.hero.dodge = remainingBeforeTick;
    s.hero.dodgeAngle = 0;
    R.attack(s, 'palm', e);
    e.action.frame = R.MOVES.palm.startup - 1;
    R.tick(s);
    assert.equal(s.hero.hp, immune ? 100 : 94, `remaining ${remainingBeforeTick}`);
  }
});

test('Gale pushes targets radially away on both sides of its caster', () => {
  const s = R.newRealm();
  Object.assign(s.hero, {x: 0, z: 10, angle: 0});
  for (const [i, x] of [[0, -2], [1, 2]]) Object.assign(s.enemies[i], {x, z: 10, homeX: x, homeZ: 10, nextAI: 1e9});
  R.attack(s, 'gale');
  advance(s, R.MOVES.gale.startup);
  close(s.enemies[0].x, -2.8);
  close(s.enemies[1].x, 2.8);
  close(s.enemies[0].z, 10);
  close(s.enemies[1].z, 10);
});

test('emitted Glass Note traverses its full declared range and then expires', () => {
  const s = R.newRealm();
  Object.assign(s.hero, {x: -20, z: 35, angle: Math.PI / 2});
  s.enemies = [];
  R.attack(s, 'note');
  advance(s, R.MOVES.note.startup);
  assert.equal(s.bolts.length, 1);
  const bolt = s.bolts[0];
  for (let n = 0; s.bolts.length && n < 200; n++) R.tick(s);
  close(bolt.x + 20, R.MOVES.note.reach);
  assert.equal(s.bolts.length, 0);
});

test('last projectile step is clipped to remaining reach before collision tests', () => {
  for (const [distance, hit] of [[1.5, true], [1.8, false]]) {
    const s = duel(), e = s.enemies[0];
    Object.assign(e, {x: -83 + distance, z: 16});
    s.bolts.push({id: 'reach-bound', owner: 'human', team: 'human', x: -83, z: 16, dx: 1, dz: 0, speed: 240, remaining: 1, life: 1, damage: 9});
    R.tick(s);
    assert.equal(e.hp, hit ? 91 : 100);
    assert.equal(s.bolts.length, 0);
  }
});

test('aim assistance excludes friendly actors and targets behind cover', () => {
  const s = R.newRealm();
  R.enterActivity(s, 'ctf');
  Object.assign(s.hero, {x: 83, z: 42});
  Object.assign(s.enemies[0], {x: 84, z: 42});
  Object.assign(s.enemies[1], {x: 93, z: 42});
  const visible = R.combatTargets(s);
  assert.ok(!visible.some(t => t.id === s.enemies[0].id), 'ally cannot be targeted');
  assert.ok(!visible.some(t => t.id === s.enemies[1].id), 'pillar must block aim assistance');
  assert.equal(R.aimTarget(s, {angle: Math.PI / 2, targetId: s.enemies[1].id, assist: false}), null);
});

test('all four base attacks reject insufficient Breath and charge their declared cost once', () => {
  for (const [kind, move] of Object.entries(R.MOVES)) {
    const s = duel();
    s.hero.breath = move.cost;
    assert.equal(R.attack(s, kind), true, kind);
    assert.equal(s.hero.breath, 0);
    assert.equal(R.attack(s, kind), false);
    assert.equal(s.hero.breath, 0);
    if (move.cost > 0) {
      const low = duel();
      low.hero.breath = move.cost - 1;
      R.tick(low, {attack: kind});
      assert.equal(low.hero.action, null);
      assert.equal(R.combatState(low).queued, null);
      assert.match(R.combatState(low).feedback, /Breath/);
    }
  }
});

test('a created relic uses its compiled cost and stays unavailable in normalized practice', () => {
  const s = R.newRealm(), b = R.Creation.seed('relic');
  const e = R.create(s, b, 2, 12);
  R.Creation.equip(s, e.id);
  const move = R.Creation.activeMove(s);
  const before = s.hero.breath;
  assert.equal(R.attack(s, 'creation'), true);
  assert.equal(s.hero.breath, before - move.cost);
  R.enterTraining(s);
  assert.equal(R.Creation.activeMove(s), null);
  const breath = s.hero.breath;
  assert.equal(R.attack(s, 'creation'), false);
  assert.equal(s.hero.breath, breath);
});

test('practice normalizes equipment and restores all world supplies and combat statistics', () => {
  const s = R.newRealm('stone');
  s.hero.equipment.blade = true;
  s.hero.hp = 77;
  s.hero.breath = 43;
  s.stats.shots = 7;
  const before = structuredClone({hp: s.hero.hp, breath: s.hero.breath, maxHp: s.hero.maxHp, equipment: s.hero.equipment, items: s.hero.items, pack: s.pack, reserve: s.reserve, balances: s.rain.balances, stats: s.stats, bests: s.bests});
  R.enterTraining(s);
  assert.equal(s.hero.maxHp, 100);
  assert.deepEqual(s.hero.equipment, {});
  assert.throws(() => R.consume(s, 'tonic'));
  assert.equal(R.attack(s, 'note'), true);
  assert.equal(s.hero.breath, 88, 'practice attacks still pay up front');
  advance(s, 40);
  assert.equal(s.activity.training.moves.note, 1);
  assert.equal(s.activity.training.damage, 9, 'world equipment and discipline do not leak');
  R.leaveActivity(s);
  assert.deepEqual({hp: s.hero.hp, breath: s.hero.breath, maxHp: s.hero.maxHp, equipment: s.hero.equipment, items: s.hero.items, pack: s.pack, reserve: s.reserve, balances: s.rain.balances, stats: s.stats, bests: s.bests}, before);
  assert.ok(Object.values(R.materialLedger(s)).every(n => n === 0));
});

test('practice target recovers from defeat without awarding a duel win', () => {
  const s = R.newRealm();
  R.enterTraining(s);
  s.enemies[0].hp = R.MOVES.palm.damage;
  R.tick(s, {attack: 'palm', aim: Math.PI});
  advance(s, 4);
  assert.equal(s.activity.training.hits, 1);
  assert.equal(s.enemies[0].hp, 100);
  assert.equal(s.enemies[0].dead, 0);
  assert.equal(s.activity.winner, null);
  assert.equal(s.bests.duel, 0);
});

test('danger geometry preserves targeted ring coordinates and phase-three shot directions', () => {
  const actor = {x: 75, z: -38, angle: 0.4, phase: 3, telegraph: {kind: 'ring', x: 80, z: -29, radius: 3, timer: 45, total: 90}};
  const ring = C.dangerShapes(actor);
  assert.equal(ring.length, 1);
  assert.equal(ring[0].x, 80);
  assert.equal(ring[0].z, -29);
  assert.equal(ring[0].reach, 3);
  close(ring[0].progress, 0.5);
  actor.telegraph.kind = 'shot';
  const shots = C.dangerShapes(actor);
  assert.equal(shots.length, 3);
  close(shots[0].angle, 0.18);
  close(shots[2].angle, 0.62);
});


test('holding the free basic strike does not prevent Breath recovery',()=>{
 const s=duel();s.hero.breath=10;s.hero.lastSpend=s.tick;s.enemies[0].x=-73;
 advance(s,240,{attackHeld:'palm'});
 assert.ok(s.hero.breath>40,'zero-cost Palm kept Breath locked');
});
test('held Palm cannot overwrite an intentional buffered special attack',()=>{
 const s=duel();R.attack(s,'palm');advance(s,10);
 R.tick(s,{attack:'reach',attackHeld:'palm'});
 advance(s,8,{attackHeld:'palm'});
 assert.equal(s.hero.action.kind,'reach');assert.equal(s.hero.breath,90);
});
test('releasing held Palm cancels only its uncommitted follow-up',()=>{
 const s=duel();R.attack(s,'palm');advance(s,10);R.tick(s,{attackHeld:'palm'});
 R.cancelBufferedAttack(s);advance(s,25);
 assert.equal(s.enemies[0].hp,94);assert.equal(s.hero.action,null);
});
test('practice position reset preserves measured progress and clears old projectiles',()=>{
 const s=R.newRealm();R.enterTraining(s);R.attack(s,'palm');advance(s,18);
 const before=structuredClone(s.activity.training);s.hero.x-=5;R.attack(s,'note');advance(s,12);R.resetTraining(s);
 assert.deepEqual(s.activity.training,before);assert.equal(s.bolts.length,0);assert.equal(s.hero.x,-83);assert.equal(s.hero.action,null);
});


test('camera-relative ground targeting round-trips at every tested camera angle',()=>{
 const view=new CanvasWorldView({width:1000,height:700,getContext:()=>({})});view.cx=12;view.cz=-7;view.scale=17;
 for(const yaw of [0,.7,Math.PI/2,Math.PI,4.7]){view.yaw=yaw;for(const [x,z]of [[12,-7],[20,2],[-1,8]]){const pixel=view.project(x,0,z),world=view.groundPoint(pixel.x,pixel.y);close(world.x,x);close(world.z,z);}}
});
test('screen-right movement remains screen-right after camera rotation',()=>{
 const view=new CanvasWorldView({width:1000,height:700,getContext:()=>({})});view.cx=0;view.cz=0;view.scale=17;
 for(const yaw of [0,.7,Math.PI/2,Math.PI,4.7]){view.yaw=yaw;const [x,z]=C.movementVector(0,1,yaw),p=view.project(x,0,z),origin=view.project(0,0,0);close(p.x-origin.x,17);close(p.y,origin.y);}
});
