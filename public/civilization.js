/* The First Orchard's local household economy.
 * Quantities are game goods and soil-fertility units, not a claim about biomass
 * chemistry. Biological goods are explicitly issued by growth. No Marks issue.
 * The only advance is one world tick; arenas, panels and offline time add none.
 */
export const SCHEMA = 'anima-households-1';
export const COUNCIL = Object.freeze({x: 0, z: 23});
export const DEPOT = Object.freeze({x: 0, z: 23, capacity: 32});
export const SOIL_CAPACITY = 24, INITIAL_SOIL = 12, COMPOST_CAPACITY = 40;
export const MEAL_TICKS = 3600, COMPOST_TICKS = 600, FALLOW_TICKS = 3600;
export const COURIER_SPEED = 4.5, COURIER_CAPACITY = 2, PANTRY_CAPACITY = 3;
export const HOMES = Object.freeze([
  {id: 'hearth', name: 'Hearth household', residents: 3, x: 11, z: 25},
  {id: 'lantern', name: 'Lantern household', residents: 3, x: 21, z: 31.6},
  {id: 'bough', name: 'Bough household', residents: 3, x: -21, z: 26.6},
  {id: 'reed', name: 'Reed household', residents: 3, x: -6, z: 31}
]);
// Existing wild reserve + new growth share one carrying capacity at each node.
export const PATCHES = Object.freeze({
  food: {name: 'Orchard canopy', node: 'fruit', x: 16, z: -32, capacity: 60, yield: 4, ticks: 1200, water: 'orchard', waterCost: 2},
  herb: {name: 'Silverleaf beds', node: 'reeds', x: -26, z: 4, capacity: 38, yield: 2, ticks: 2400, water: 'habitat', waterCost: 1},
  wood: {name: 'Coppice grove', node: 'grove', x: -17, z: 18, capacity: 120, yield: 3, ticks: 1800, water: 'habitat', waterCost: 1}
});
const ITEMS = Object.keys(PATCHES);
const exact = (o, keys) => o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).sort().join() === [...keys].sort().join();
const integer = (n, min = 0, max = 1e9) => Number.isSafeInteger(n) && n >= min && n <= max;
const fail = message => { throw Error(message); };
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const zeroes = () => Object.fromEntries(ITEMS.map(item => [item, 0]));
const canonical = value => JSON.stringify(value, function (_key, node) {
  return node && typeof node === 'object' && !Array.isArray(node)
    ? Object.fromEntries(Object.entries(node).sort(([a],[b]) => a.localeCompare(b))) : node;
});

export function state() {
  return {
    schema: SCHEMA, active: false, revision: 0, clock: 0, serial: 0,
    depot: {food: 0, harvest: false},
    courier: {x: DEPOT.x, z: DEPOT.z, angle: 0, enabled: true, phase: 'rest', cargo: null, target: null},
    households: HOMES.map((home, i) => ({id: home.id, pantry: 0, hunger: 0, due: MEAL_TICKS + i * 450, received: 0, consumed: 0, missed: 0})),
    patches: Object.fromEntries(ITEMS.map(item => [item, {enabled: true, progress: 0, cycles: 0, produced: 0}])),
    soil: INITIAL_SOIL, compost: 0, compostClock: 0, fallowClock: 0,
    ledger: {produced: zeroes(), water: {orchard: 0, habitat: 0}, soilUsed: 0, recovered: 0,
      compostCreated: 0, compostReturned: 0, compostDiscarded: 0, donated: zeroes(), workerMeals: 0,
      funded: 0, withdrawn: 0, delivered: 0, consumed: 0},
    trace: []
  };
}

function event(s, type, text, item = null, count = 0, household = null) {
  const c = s.civilization;
  c.trace.push({id: ++c.serial, clock: c.clock, type, text, item, count, household});
  if (c.trace.length > 100) c.trace.shift();
}

export function biologicalIssued(s, item) { return s.civilization?.ledger.produced[item] || 0; }
export function held(s, item) {
  if (item !== 'food' || !s.civilization) return 0;
  const c = s.civilization;
  return c.depot.food + (c.courier.cargo?.count || 0) + c.households.reduce((sum, home) => sum + home.pantry, 0);
}

function addCompost(s, count) {
  const c = s.civilization, stored = Math.min(count, COMPOST_CAPACITY - c.compost);
  c.ledger.compostCreated += count;
  c.compost += stored;
  c.ledger.compostDiscarded += count - stored;
}

// Existing workers eat one actual pack food at gathering. Its organic remainder
// becomes compost only after households have opted into this new local system.
export function workerMeal(s) {
  if (!s.civilization?.active) return;
  s.civilization.ledger.workerMeals++;
  addCompost(s, 1);
}

// Invited policy: only the food just physically brought home can enter the depot.
// Three pack food are retained for the existing workers' next gathering meals.
export function workerDelivery(s, worker, item, count) {
  const c = s.civilization;
  if (!c?.active || !c.depot.harvest || item !== 'food' || distance(worker, DEPOT) > 4) return;
  const funded = Math.min(count, Math.max(0, s.pack.food - 3), DEPOT.capacity - c.depot.food);
  if (!funded) return;
  s.pack.food -= funded;
  c.depot.food += funded;
  c.ledger.funded += funded;
  event(s, 'deposit', `${worker.name} brought ${funded} harvested food into the household depot.`, 'food', funded);
}

export function growthStatus(s, item) {
  const c = s.civilization, patch = c.patches[item], rule = PATCHES[item];
  if (!c.active) return 'Awaiting the council invitation';
  if (!patch.enabled) return 'Resting by your choice';
  if (s.reserve[item] >= rule.capacity) return 'Reserve at carrying capacity';
  if (!c.soil) return 'Waiting for compost or fallow recovery';
  if (s.rain.storage[rule.water] < rule.waterCost) return `Needs ${rule.waterCost} ${rule.water} water`;
  return 'Growing';
}

function grow(s) {
  const c = s.civilization;
  // Food gets first claim on scarce fertility; herb and wood share habitat water.
  for (const item of ITEMS) {
    const patch = c.patches[item], rule = PATCHES[item];
    if (growthStatus(s, item) !== 'Growing') continue;
    if (++patch.progress < rule.ticks) continue;
    const count = Math.min(rule.yield, rule.capacity - s.reserve[item], c.soil);
    patch.progress = 0;
    patch.cycles++;
    patch.produced += count;
    c.ledger.produced[item] += count;
    c.soil -= count;
    c.ledger.soilUsed += count;
    // Plant use belongs to the established water sink ledger, never disappears.
    s.rain.storage[rule.water] -= rule.waterCost;
    s.rain.losses += rule.waterCost;
    s.rain.revision++;
    c.ledger.water[rule.water] += rule.waterCost;
    s.reserve[item] += count;
    event(s, 'growth', `${rule.name} renewed ${count} ${item}; used ${rule.waterCost} water and ${count} soil fertility.`, item, count);
  }
}

function soilCycle(s) {
  const c = s.civilization;
  if (c.compost > 0 && c.soil < SOIL_CAPACITY) {
    if (++c.compostClock >= COMPOST_TICKS) {
      const count = Math.min(2, c.compost, SOIL_CAPACITY - c.soil);
      c.compost -= count;
      c.soil += count;
      c.ledger.compostReturned += count;
      c.compostClock = 0;
      event(s, 'compost', `${count} compost returned ${count} soil fertility.`, null, count);
    }
  } else c.compostClock = 0;
  // Slow unharvested ground-cover recovery prevents an exhausted economy from
  // needing food to manufacture its first food. This is a named game source of
  // fertility, not conserved mineral mass or real-world growth-rate data.
  if (c.soil < SOIL_CAPACITY) {
    if (++c.fallowClock >= FALLOW_TICKS) {
      c.soil++;
      c.ledger.recovered++;
      c.fallowClock = 0;
      event(s, 'fallow', 'Unharvested ground cover restored one soil fertility.', null, 1);
    }
  } else c.fallowClock = 0;
}

function householdMeals(s) {
  const c = s.civilization;
  for (const home of c.households) {
    if (c.clock < home.due) continue;
    home.due = c.clock + MEAL_TICKS;
    const name = HOMES.find(h => h.id === home.id).name;
    if (home.pantry > 0) {
      home.pantry--;
      home.consumed++;
      c.ledger.consumed++;
      s.spent.food++;
      home.hunger = Math.max(0, home.hunger - 2);
      addCompost(s, 1);
      event(s, 'meal', `${name} ate one delivered food; one compost returned to the cycle.`, 'food', 1, home.id);
    } else {
      home.missed++;
      home.hunger = Math.min(6, home.hunger + 1);
      event(s, 'shortage', `${name} missed a meal. Deliver food to recover; nobody is permanently lost.`, 'food', 0, home.id);
    }
  }
}

function drive(s, ctx, target, phase) {
  const courier = s.civilization.courier;
  const before = {x: courier.x, z: courier.z};
  ctx.steer(s, courier, target, COURIER_SPEED);
  courier.phase = distance(before, courier) < 1e-8 ? 'route blocked' : phase;
}

function courierStep(s, ctx) {
  const c = s.civilization, courier = c.courier;
  if (courier.cargo) {
    const home = c.households.find(h => h.id === courier.cargo.household);
    const door = HOMES.find(h => h.id === home.id);
    if (!courier.enabled) {
      if (distance(courier, DEPOT) > .6) { drive(s, ctx, DEPOT, 'returning cargo'); return; }
      if (c.depot.food + courier.cargo.count > DEPOT.capacity) { courier.phase = 'depot full'; return; }
      c.depot.food += courier.cargo.count;
      event(s, 'return', `Undelivered ${courier.cargo.count} food returned physically to the depot.`, 'food', courier.cargo.count, home.id);
      courier.cargo = null;
      courier.target = null;
      courier.phase = 'rest';
      return;
    }
    if (distance(courier, door) > .6) { drive(s, ctx, door, 'carrying'); return; }
    const count = courier.cargo.count;
    if (home.pantry + count > PANTRY_CAPACITY) { courier.phase = 'pantry full'; return; }
    home.pantry += count;
    home.received += count;
    c.ledger.delivered += count;
    event(s, 'delivery', `${door.name} received ${count} food at its door.`, 'food', count, home.id);
    courier.cargo = null;
    courier.target = null;
    courier.phase = 'returning';
    return;
  }
  if (distance(courier, DEPOT) > .6) { drive(s, ctx, DEPOT, 'returning'); return; }
  courier.target = null;
  if (!courier.enabled) { courier.phase = 'rest'; return; }
  if (!c.depot.food) { courier.phase = 'depot empty'; return; }
  // Greatest shortage first; then earliest meal and stable household identity.
  const next = [...c.households].filter(h => h.pantry < 2)
    .sort((a, b) => a.pantry - b.pantry || b.hunger - a.hunger || a.due - b.due || a.id.localeCompare(b.id))[0];
  if (!next) { courier.phase = 'pantries supplied'; return; }
  // Empty homes receive their first meal before any home receives a stockpile.
  const count = Math.min(next.pantry === 0 ? 1 : COURIER_CAPACITY, c.depot.food, PANTRY_CAPACITY - next.pantry);
  c.depot.food -= count;
  courier.cargo = {item: 'food', count, household: next.id};
  courier.target = next.id;
  courier.phase = 'carrying';
  event(s, 'pickup', `Tavi collected ${count} food from the depot for ${HOMES.find(h => h.id === next.id).name}.`, 'food', count, next.id);
}

export function tick(s, ctx) {
  if (s.mode !== 'world' || !s.civilization.active) return;
  s.civilization.clock++;
  soilCycle(s);
  grow(s);
  householdMeals(s);
  courierStep(s, ctx);
}

function near(s, place, name) {
  if (s.mode !== 'world' || s.hero.dead || s.hero.hp <= 0) fail('Return to your living world body first.');
  if (distance(s.hero, place) > 4) fail(`Walk to ${name} before changing its supplies or policy.`);
}

const payloads = {invite: [], supply: ['count'], withdraw: ['count'], production: ['item', 'enabled'],
  courier: ['enabled'], harvest: ['enabled'], compost: ['item', 'count'], garden: ['plot'], assign: ['worker', 'job']};

export function command(s, op, payload = {}, ctx = {}) {
  if (!Object.hasOwn(payloads, op) || !exact(payload, payloads[op])) fail('Use the exact household command fields.');
  if ('count' in payload && !integer(payload.count, 1, 20)) fail('Choose a whole quantity from one to twenty.');
  if ('enabled' in payload && typeof payload.enabled !== 'boolean') fail('Choose whether this policy is enabled.');
  if ('item' in payload && !ITEMS.includes(payload.item)) fail('Choose wood, food or herb.');
  if (op === 'garden' && !integer(payload.plot, 0, 5)) fail('Choose a valid settlement plot.');
  if (op === 'assign' && (!['mira', 'fen'].includes(payload.worker) || !['rest', 'wood', 'stone', 'food'].includes(payload.job))) fail('Choose an existing worker and workplace.');
  const location = ['supply', 'withdraw', 'compost'].includes(op) ? DEPOT : COUNCIL;
  near(s, location, location === DEPOT ? 'the household depot beside the council' : 'the council');
  if (op !== 'invite' && !s.civilization.active) fail('Invite the households at the council first.');
  const next = structuredClone(s), c = next.civilization;
  if (op === 'invite') {
    if (c.active) fail('The households have already joined.');
    c.active = true;
    event(next, 'invite', 'Four households, twelve residents, joined the food-and-soil cycle. Their pantries begin empty.');
  }
  if (op === 'supply') {
    if (next.pack.food < payload.count) fail('Your pack does not contain that much food.');
    if (c.depot.food + payload.count > DEPOT.capacity) fail('The depot holds at most thirty-two food.');
    next.pack.food -= payload.count;
    c.depot.food += payload.count;
    c.ledger.funded += payload.count;
    event(next, 'deposit', `You moved ${payload.count} pack food into the depot.`, 'food', payload.count);
  }
  if (op === 'withdraw') {
    if (c.depot.food < payload.count) fail('Only food still inside the depot can be withdrawn.');
    c.depot.food -= payload.count;
    next.pack.food += payload.count;
    c.ledger.withdrawn += payload.count;
    event(next, 'withdraw', `You withdrew ${payload.count} stored food. In-transit and household food remain in custody.`, 'food', payload.count);
  }
  if (op === 'production') {
    c.patches[payload.item].enabled = payload.enabled;
    event(next, 'policy', `${PATCHES[payload.item].name}: ${payload.enabled ? 'cultivation resumed' : 'left to rest'}.`);
  }
  if (op === 'courier') {
    c.courier.enabled = payload.enabled;
    event(next, 'policy', payload.enabled ? 'Tavi resumed household deliveries.' : 'Tavi will return any undelivered cargo to the depot, then rest.');
  }
  if (op === 'harvest') {
    c.depot.harvest = payload.enabled;
    event(next, 'policy', payload.enabled ? 'New food carried home by workers will supply the depot, retaining three pack food for worker meals.' : 'New worker harvests will stay in your pack.');
  }
  if (op === 'compost') {
    if (next.pack[payload.item] < payload.count) fail('Bring those actual organic goods in your pack.');
    if (c.compost + payload.count > COMPOST_CAPACITY) fail('Let the compost bin process its existing material first.');
    next.pack[payload.item] -= payload.count;
    next.spent[payload.item] += payload.count;
    c.ledger.donated[payload.item] += payload.count;
    addCompost(next, payload.count);
    event(next, 'donation', `${payload.count} ${payload.item} entered the compost bin.`, payload.item, payload.count);
  }
  if (op === 'garden') {
    if (typeof ctx.construct !== 'function') fail('Settlement construction is unavailable.');
    ctx.construct(next, 'farm', payload.plot);
  }
  if (op === 'assign') {
    if (typeof ctx.assign !== 'function') fail('Worker assignment is unavailable.');
    ctx.assign(next, payload.worker, payload.job);
  }
  c.revision++;
  validate(next);
  if (ctx.record) ctx.record(next, `Households: ${op}.`, 'civilization');
  Object.assign(s, next);
}

export function inspect(s) {
  const c = s.civilization;
  return structuredClone({...c, population: c.active ? 12 : 0,
    heldFood: held(s, 'food'),
    households: c.households.map(h => ({...h, ...HOMES.find(home => home.id === h.id),
      status: h.hunger >= 3 ? 'starving · can recover' : h.hunger ? 'hungry' : h.consumed ? 'fed' : 'awaiting first meal',
      mealIn: Math.max(0, h.due - c.clock)})),
    patches: ITEMS.map(item => ({item, ...PATCHES[item], ...c.patches[item], stock: s.reserve[item], status: growthStatus(s, item)}))
  });
}

export function validate(s) {
  const c = s.civilization, bad = () => fail('Malformed household, delivery or renewable-growth state.');
  if (!exact(c, ['schema', 'active', 'revision', 'clock', 'serial', 'depot', 'courier', 'households', 'patches', 'soil', 'compost', 'compostClock', 'fallowClock', 'ledger', 'trace']) || c.schema !== SCHEMA || typeof c.active !== 'boolean') bad();
  for (const key of ['revision', 'clock', 'serial']) if (!integer(c[key])) bad();
  if (c.clock > s.tick || !integer(c.soil, 0, SOIL_CAPACITY) || !integer(c.compost, 0, COMPOST_CAPACITY) || !integer(c.compostClock, 0, COMPOST_TICKS - 1) || !integer(c.fallowClock, 0, FALLOW_TICKS - 1)) bad();
  if (!exact(c.depot, ['food', 'harvest']) || !integer(c.depot.food, 0, DEPOT.capacity) || typeof c.depot.harvest !== 'boolean') bad();
  if (!exact(c.patches, ITEMS)) bad();
  for (const item of ITEMS) {
    const p = c.patches[item], rule = PATCHES[item];
    if (!exact(p, ['enabled', 'progress', 'cycles', 'produced']) || typeof p.enabled !== 'boolean' || !integer(p.progress, 0, rule.ticks - 1) || !integer(p.cycles, 0, Math.floor(c.clock / rule.ticks)) || !integer(p.produced, p.cycles, p.cycles * rule.yield)) bad();
  }
  if (!Array.isArray(c.households) || c.households.length !== HOMES.length || new Set(c.households.map(h => h.id)).size !== HOMES.length) bad();
  for (const h of c.households) {
    const ix = HOMES.findIndex(home => home.id === h.id);
    if (!exact(h, ['id', 'pantry', 'hunger', 'due', 'received', 'consumed', 'missed']) || ix < 0 || !integer(h.pantry, 0, PANTRY_CAPACITY) || !integer(h.hunger, 0, 6) || !integer(h.due, c.clock, c.clock + MEAL_TICKS + 1350) || !integer(h.received) || !integer(h.consumed) || !integer(h.missed)) bad();
    const meals = Math.max(0, Math.floor((c.clock - ix * 450) / MEAL_TICKS));
    if (h.received !== h.pantry + h.consumed || h.consumed + h.missed !== meals || h.due !== (meals + 1) * MEAL_TICKS + ix * 450 || h.hunger > Math.min(6, h.missed)) bad();
  }
  const courier = c.courier;
  if (!exact(courier, ['x', 'z', 'angle', 'enabled', 'phase', 'cargo', 'target']) || typeof courier.enabled !== 'boolean' || !Number.isFinite(courier.x) || !Number.isFinite(courier.z) || Math.abs(courier.x) > 55 || courier.z < -62 || courier.z > 48 || !Number.isFinite(courier.angle)) bad();
  if (!['rest', 'carrying', 'returning', 'returning cargo', 'route blocked', 'depot empty', 'depot full', 'pantries supplied', 'pantry full'].includes(courier.phase)) bad();
  if (courier.cargo !== null) {
    if (!exact(courier.cargo, ['item', 'count', 'household']) || courier.cargo.item !== 'food' || !integer(courier.cargo.count, 1, COURIER_CAPACITY) || !HOMES.some(h => h.id === courier.cargo.household) || courier.target !== courier.cargo.household) bad();
    if (c.households.find(h => h.id === courier.cargo.household).pantry + courier.cargo.count > PANTRY_CAPACITY) bad();
  } else if (courier.target !== null) bad();
  const l = c.ledger;
  if (!exact(l, ['produced', 'water', 'soilUsed', 'recovered', 'compostCreated', 'compostReturned', 'compostDiscarded', 'donated', 'workerMeals', 'funded', 'withdrawn', 'delivered', 'consumed']) || !exact(l.produced, ITEMS) || !exact(l.donated, ITEMS) || !exact(l.water, ['orchard', 'habitat'])) bad();
  for (const n of [...Object.values(l.produced), ...Object.values(l.donated), ...Object.values(l.water), ...Object.entries(l).filter(([,v]) => typeof v !== 'object').map(([,v]) => v)]) if (!integer(n)) bad();
  for (const item of ITEMS) if (l.produced[item] !== c.patches[item].produced) bad();
  if (l.soilUsed !== Object.values(l.produced).reduce((a,b) => a+b, 0) || c.soil !== INITIAL_SOIL + l.compostReturned + l.recovered - l.soilUsed || l.recovered > Math.floor(c.clock / FALLOW_TICKS)) bad();
  if (l.water.orchard !== c.patches.food.cycles * PATCHES.food.waterCost || l.water.habitat !== c.patches.herb.cycles + c.patches.wood.cycles || l.water.orchard + l.water.habitat > s.rain.losses) bad();
  if (c.compost !== l.compostCreated - l.compostReturned - l.compostDiscarded || l.compostCreated !== l.consumed + l.workerMeals + Object.values(l.donated).reduce((a,b) => a+b, 0) || l.compostReturned > 2 * Math.floor(c.clock / COMPOST_TICKS)) bad();
  if (l.delivered !== c.households.reduce((n,h) => n+h.received, 0) || l.consumed !== c.households.reduce((n,h) => n+h.consumed, 0) || l.funded - l.withdrawn !== held(s, 'food') + l.consumed) bad();
  if (l.consumed + l.workerMeals + l.donated.food > s.spent.food || l.donated.wood > s.spent.wood || l.donated.herb > s.spent.herb) bad();
  if (!Array.isArray(c.trace) || c.trace.length > 100 || c.trace.some((e,i) => !exact(e, ['id', 'clock', 'type', 'text', 'item', 'count', 'household']) || !integer(e.id, 1, c.serial) || (i && e.id <= c.trace[i-1].id) || !integer(e.clock, 0, c.clock) || typeof e.type !== 'string' || !['invite','deposit','withdraw','policy','donation','growth','compost','fallow','meal','shortage','pickup','delivery','return'].includes(e.type) || typeof e.text !== 'string' || e.text.length > 400 || (e.item !== null && !ITEMS.includes(e.item)) || !integer(e.count, 0, 20) || (e.household !== null && !HOMES.some(h => h.id === e.household)))) bad();
  if ((c.trace.length ? c.trace.at(-1).id !== c.serial : c.serial !== 0)) bad();
  if (!c.active && canonical(c) !== canonical(state())) bad();
  return c;
}
