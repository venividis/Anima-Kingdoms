// Agent-driven state tests through exported legal actions. No browser/human claim.
// node docs/audit/broader/probes.mjs [path-to-public] [output-file]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';

const source = path.resolve(process.argv[2] || 'public');
const output = path.resolve(process.argv[3] || 'docs/audit/broader/current-probe-results.json');
const R = await import(pathToFileURL(path.join(source, 'realm.js')));
const hashes = Object.fromEntries(['realm.js', 'kingdoms.js', 'world.js', 'creation.js', 'navigation.js'].map(name => [name, crypto.createHash('sha256').update(fs.readFileSync(path.join(source, name))).digest('hex')]));
let sequence = 0;
const command = (s, op, payload = {}, controller = 'human') => R.command(s, {
  world: s.id, rules: R.Kingdoms.RULES, controller,
  epoch: s.kingdoms.grant.epoch, revision: s.kingdoms.revision,
  key: `broader-probe-${++sequence}`, op, payload
});
const tick = (s, n, input = {}) => { for (let i = 0; i < n; i++) R.tick(s, input); };
const until = (s, predicate, max = 6000) => {
  for (let i = 0; i < max; i++) { if (predicate()) return i; R.tick(s); }
  throw Error(`Legal policy did not finish within ${max} ticks.`);
};
const failText = fn => { try { fn(); return null; } catch (error) { return error.message; } };
const cases = [];

for (const mode of ['guard', 'held-palm']) {
  const manual = R.newRealm(), guided = R.newRealm();
  command(guided, 'walk', {x: 0, z: 0});
  const input = mode === 'guard' ? {guard: true} : {attackHeld: 'palm'};
  tick(manual, 10, {...input, move: [0, -1]});
  tick(guided, 10, input);
  const manualTravel = 16 - manual.hero.z, guidedTravel = 16 - guided.hero.z;
  cases.push({id: `guided-${mode}`, invariant: 'A queued route must not bypass combat movement limits.',
    manualTravel, guidedTravel, ratio: guidedTravel / manualTravel, activeJourney: guided.kingdoms.journey,
    status: guidedTravel <= manualTravel + 1e-8 ? 'passed' : 'defect reproduced'});
}

{
  const s = R.newRealm();
  command(s, 'grant', {enabled: true, limit: 3});
  command(s, 'walk', {x: 0, z: 0}, 'agent');
  R.tick(s);
  command(s, 'grant', {enabled: false, limit: 0});
  const atRevocation = {x: s.hero.x, z: s.hero.z};
  tick(s, 60);
  const movementAfterRevocation = Math.hypot(s.hero.x - atRevocation.x, s.hero.z - atRevocation.z);
  cases.push({id: 'revoked-journey', invariant: 'The strengthened revoke control cancels accepted single-body queued walking.',
    atRevocation, after: {x: s.hero.x, z: s.hero.z}, movementAfterRevocation, journey: s.kingdoms.journey,
    status: movementAfterRevocation < 1e-8 ? 'passed' : 'prior cancellation contract gap reproduced'});
}

{
  const s = R.newRealm();
  R.agentGrant(s, true);
  for (const [from, to] of R.Rain.PAIRS) R.Rain.channel(s.rain, from, to, 1, 'installed', 'agent');
  R.agentGrant(s, false);
  const removalErrors = R.Rain.KEYS.map(key => failText(() => R.Rain.removeChannel(s.rain, key)));
  const braidError = failText(() => R.buildBraid(s));
  for (let n = 0; n < 20; n++) R.rainPulse(s);
  cases.push({id: 'H37-public-channel-lock', invariant: 'Prospectively accepted stewardship must permit recovery of scarce public infrastructure after its builder leaves.',
    agentOwnedSlots: Object.values(s.rain.channels).filter(c => c.owner === 'agent').length,
    removalErrors: [...new Set(removalErrors)], braidError, storage: s.rain.storage,
    deliveries: s.rain.deliveries, ledger: R.Rain.ledger(s.rain), reloads: !!R.restore(R.snapshot(s)),
    status: removalErrors.every(Boolean) ? 'known current unresolved requirement reproduced' : 'maintenance now available; inspect terms and custody'});
}

{
  let s = R.newRealm();
  command(s, 'grant', {enabled: true, limit: 20});
  const actions = [], checkpoints = [];
  const agent = (op, payload = {}) => {
    const receipt = command(s, op, payload, 'agent');
    actions.push({op, tick: s.tick, result: receipt.result});
    return receipt;
  };
  agent('walk', {x: 6, z: 20});
  until(s, () => !s.kingdoms.journey);
  agent('buy_crystal');
  agent('walk', {x: 0, z: -4});
  until(s, () => !s.kingdoms.journey);
  const kit = agent('guide').result;
  agent('fuel', {id: kit.source});
  agent('feed', {id: kit.carrier});
  agent('perform', {id: kit.source});
  agent('assign', {carrier: kit.carrier});
  let lastPhase = '';
  for (let n = 0; n < 6000 && !s.kingdoms.order.paid; n++) {
    R.tick(s);
    const phase = `${s.kingdoms.order.delivered}:${s.kingdoms.jobs[0]?.phase}`;
    if (phase !== lastPhase) {
      lastPhase = phase;
      s = R.restore(R.snapshot(s));
      checkpoints.push({phase, tick: s.tick, materials: R.materialLedger(s)});
    }
  }
  if (!s.kingdoms.order.paid) throw Error('The invited-agent delivery did not complete.');
  agent('perform', {id: kit.source});
  until(s, () => !s.kingdoms.jobs.length);
  s = R.restore(R.snapshot(s));
  const materialResidual = R.materialLedger(s), charge = R.Kingdoms.chargeLedger(s);
  const balanced = Object.values(materialResidual).every(v => v === 0) &&
    charge.issued === charge.source + charge.flight + charge.receiver + charge.spent + charge.dissipated &&
    R.Rain.ledger(s.rain).money === 50;
  cases.push({id: 'legal-agent-connected-creation', invariant: 'An invited command policy completes real purchase, construction, cargo, consumption, payment and physical return without fixture mutation.',
    status: balanced ? 'passed' : 'conservation failure', finalTick: s.tick, agentCommands: actions.length,
    remainingGrant: s.kingdoms.grant.remaining, actions, checkpoints, order: s.kingdoms.order,
    money: R.Rain.ledger(s.rain).money, materialResidual, charge,
    limitation: 'This is a scripted policy with complete local-state access. It is not an installed model service, browser interaction or a human study.'});
}

fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, JSON.stringify({source, hashes, evidence: 'Deterministic agent and legal core-function probes; no browser or human testing.', cases}, null, 2) + '\n');
console.log(JSON.stringify({output, results: cases.map(({id, status}) => ({id, status}))}, null, 2));
