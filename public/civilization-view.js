import * as R from './realm.js';

const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
const facts = rows => `<table class="facts">${rows.map(([a,b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</table>`;

export function civilizationSummary(state) {
  const c = R.Civilization.inspect(state);
  if (!c.active) return {title: 'A place for twelve people', detail: 'Visit the council and invite four households to begin the living food cycle.'};
  const fed = c.households.filter(h => h.hunger === 0).length;
  return {title: `${fed}/4 households nourished · ${c.ledger.consumed} meals served`,
    detail: `Tavi: ${c.courier.phase}${c.courier.cargo ? ` · carrying ${c.courier.cargo.count} food` : ''}. Depot ${c.depot.food}/32 · soil ${c.soil}/24 · compost ${c.compost}/40.`};
}

/** state may be a getter, so replacing/importing a world never leaves stale UI.
 * change(fn) is the app's error-reporting/save wrapper and returns false on error.
 * walk({x,z}) requests ordinary navigation and returns false on error; this view
 * closes only after an accepted walk. refresh() updates the owner's HUD, if any.
 * water() and settlement() are optional existing navigation-panel callbacks.
 */
export function mountCivilization({state, openPanel, change, refresh = () => {}, closePanel, walk, water, settlement}) {
  const current = () => typeof state === 'function' ? state() : state;
  const run = (op, payload = {}) => {
    if (change(() => R.civilize(current(), op, payload)) !== false) { refresh(); render(); }
  };
  const bind = (id, fn) => document.getElementById(id)?.addEventListener('click', fn);
  function render() {
    const s = current(), c = R.Civilization.inspect(s);
    const atCouncil = s.mode === 'world' && Math.hypot(s.hero.x, s.hero.z - 23) <= 4;
    const summary = civilizationSummary(s);
    const garden = s.structures.some(b => b.type === 'farm');
    const emptyPlots = R.PLOTS.filter(p => !s.structures.some(b => b.plot === p.id));
    openPanel('The living households', 'ANIMA KINGDOMS · LIFE IN THE FIRST ORCHARD', `
      <p class="quote">A kingdom begins with supper.</p>
      <div class="concord-status"><strong>${esc(summary.title)}</strong><br>${esc(summary.detail)}</div>
      <p class="small">This panel pauses the world. Close it to watch Tavi travel and the orchards grow. A household meal is one shared food lot every 60 active seconds.</p>
      <div class="concord-actions"><button id="life-council" class="button subtle">Walk to the council & depot</button><button id="life-watch" class="button primary">Return to the living world</button></div>
      ${!c.active ? `
        <div class="card"><h3>Invite four households</h3><p>Twelve residents live in the four existing homes. Their pantries begin empty. You decide which food to place in the depot and whether new farm harvests should support them.</p>
        <button id="life-invite" class="button primary full" ${atCouncil ? '' : 'disabled'}>Invite households at the council</button>
        <p class="small">No goods or money are added by the invitation. Missed meals cause recoverable hunger.</p></div>` : `
        <h3>The depot · food in actual custody</h3>
        ${facts([['Your pack', `${s.pack.food} food`], ['Stored at the depot', `${c.depot.food} / 32 food`], ['Carried by Tavi', `${c.courier.cargo?.count || 0} food`], ['Household pantries', `${c.households.reduce((n,h) => n+h.pantry, 0)} food`], ['Actually eaten', `${c.ledger.consumed} food`]])}
        <div class="grid-two"><div class="field"><label for="life-food-count">Food to transfer</label><input id="life-food-count" type="number" min="1" max="20" value="${Math.max(1, Math.min(4, s.pack.food))}"></div><div class="field"><label for="life-auto-depot">Fresh harvest destination</label><select id="life-auto-depot" ${atCouncil ? '' : 'disabled'}><option value="false" ${c.depot.harvest ? '' : 'selected'}>Keep worker harvests in my pack</option><option value="true" ${c.depot.harvest ? 'selected' : ''}>Supply households with new harvests</option></select></div></div>
        <div class="concord-actions"><button id="life-supply" class="button primary" ${atCouncil ? '' : 'disabled'}>Move pack food into depot</button><button id="life-withdraw" class="button subtle" ${atCouncil ? '' : 'disabled'}>Return stored food to pack</button><button id="life-courier" class="button subtle" ${atCouncil ? '' : 'disabled'}>${c.courier.enabled ? 'Rest Tavi & return undelivered cargo' : 'Resume Tavi’s deliveries'}</button></div>
        <p class="small">Harvest sharing applies only when workers physically bring new food home; three food remain in your pack for their meals. The courier takes food from the depot, visits a real doorstep, then returns. Empty pantries receive food first.</p>
        <h3>Twelve residents · four homes</h3><div class="grid-two">${c.households.map(h => `<div class="card"><h4>${esc(h.name)}</h4><p><strong>${esc(h.status)}</strong> · ${h.pantry}/3 food in pantry</p><progress value="${6-h.hunger}" max="6" aria-label="${esc(h.name)} nourishment" style="width:100%;accent-color:${h.hunger >= 3 ? '#df987b' : '#82bea0'}"></progress><p class="small">${h.consumed} meals eaten · ${h.missed} missed · next meal in ${Math.ceil(h.mealIn/60)}s</p><button class="button subtle" data-life-home="${esc(h.id)}">Walk to this household</button></div>`).join('')}</div>
        <h3>Renew the harvest</h3><p>The seed canopies remain alive when the wild stock reaches zero. Cultivation adds explicitly sourced biological goods only while there is room, water and soil fertility.</p>
        <div class="grid-two">${c.patches.map(p => `<div class="card"><h4>${esc(p.name)}</h4><p><strong>${p.stock}/${p.capacity} ${p.item}</strong> · ${esc(p.status)}</p><progress value="${p.progress}" max="${p.ticks}" style="width:100%;accent-color:#82bea0" aria-label="${esc(p.name)} growth progress"></progress><p class="small">Up to ${p.yield} ${p.item} per ${p.ticks/60}s. Costs ${p.waterCost} ${p.water} water per harvest batch, plus one soil fertility per new good. ${p.produced} new ${p.item} grown.</p><button class="button subtle" data-life-growth="${p.item}" ${atCouncil ? '' : 'disabled'}>${p.enabled ? 'Let this patch rest' : 'Resume cultivation'}</button><button class="button subtle" data-life-patch="${p.item}">Walk to harvest</button></div>`).join('')}</div>
        <h3>Soil, water and a way back</h3>${facts([['Soil fertility', `${c.soil}/24`], ['Compost bin', `${c.compost}/40`], ['Returned through compost', c.ledger.compostReturned], ['Slow fallow recovery', c.ledger.recovered], ['Plant water used', `${c.ledger.water.orchard} orchard · ${c.ledger.water.habitat} habitat`], ['Current routed water', `${s.rain.storage.orchard} orchard · ${s.rain.storage.habitat} habitat`]])}
        <p class="small">Meals and worker food produce compost. Every ten active seconds, up to two compost return to soil. Unharvested ground cover slowly restores one fertility per minute while below capacity, so exhaustion has a recovery path. These are stated game rules, not a biological-physics model.</p>
        <div class="grid-two"><div class="field"><label for="life-compost-item">Organic material in your pack</label><select id="life-compost-item"><option value="herb">Herb</option><option value="wood">Wood</option><option value="food">Food</option></select></div><div class="field"><label for="life-compost-count">Quantity</label><input id="life-compost-count" type="number" min="1" max="20" value="1"></div></div><button id="life-compost" class="button subtle full" ${atCouncil ? '' : 'disabled'}>Put these actual goods into compost</button>
        <h3>Connect farming to the households</h3>
        <ol><li>Weave the Mercy Braid or your own channels, release two rains, and enable automatic rain in Settings.</li><li>Build a rain garden and assign Mira and Fen to food. They need an open crossing and food in your pack for their gathering meals.</li><li>Enable harvest sharing above. The farmers bring food home; Tavi carries depot food to the households.</li><li>Close this panel. Inspect the receipts after a few active minutes to see growing, delivering, eating and composting.</li></ol>
        ${!garden && emptyPlots.length ? `<div class="grid-two"><select id="life-garden-plot" aria-label="Rain garden building plot">${emptyPlots.map(p => `<option value="${p.id}">Plot ${p.id+1}</option>`).join('')}</select><button id="life-garden" class="button primary" ${atCouncil ? '' : 'disabled'}>Build rain garden · 4 wood + 2 stone</button></div>` : ''}
        ${s.workers.map(w => `<div class="field"><label for="life-worker-${w.id}">${esc(w.name)} · ${esc(w.phase)}${w.cargo ? ` · ${w.cargo.count} ${w.cargo.item} carried` : ''}</label><select id="life-worker-${w.id}" data-life-worker="${w.id}" ${atCouncil ? '' : 'disabled'}>${['rest','food','wood','stone'].map(job => `<option value="${job}" ${w.job === job ? 'selected' : ''}>${job === 'rest' ? 'Rest' : `${job} production`}</option>`).join('')}</select></div>`).join('')}
        <div class="concord-actions">${water ? '<button id="life-water" class="button subtle">Open water weaving</button>' : ''}${settlement ? '<button id="life-settlement" class="button subtle">Open settlement construction</button>' : ''}</div>
        <details class="concord-details"><summary>Follow the goods · recent receipts</summary>${[...c.trace].reverse().slice(0,32).map(e => `<div class="history"><small>${Math.floor(e.clock/60)} ACTIVE SECONDS · ${esc(e.type.toUpperCase())}</small><p>${esc(e.text)}</p></div>`).join('')}<p class="small">The latest 100 civilization events are retained. Inventories and ledgers retain cumulative totals.</p></details>
      `}
      ${!atCouncil ? '<p class="small">Walk within four steps of the council to change policies, build, assign workers or transfer supplies.</p>' : ''}
    `, 'civilization');
    const go = point => {
      if (!walk) return;
      if (walk({x: point.x, z: point.z}) !== false) closePanel();
    };
    bind('life-council', () => go(R.Civilization.COUNCIL));
    bind('life-watch', closePanel);
    bind('life-invite', () => run('invite'));
    bind('life-supply', () => run('supply', {count: Number(document.getElementById('life-food-count').value)}));
    bind('life-withdraw', () => run('withdraw', {count: Number(document.getElementById('life-food-count').value)}));
    bind('life-courier', () => run('courier', {enabled: !current().civilization.courier.enabled}));
    document.getElementById('life-auto-depot')?.addEventListener('change', e => run('harvest', {enabled: e.target.value === 'true'}));
    bind('life-compost', () => run('compost', {item: document.getElementById('life-compost-item').value, count: Number(document.getElementById('life-compost-count').value)}));
    bind('life-garden', () => run('garden', {plot: Number(document.getElementById('life-garden-plot').value)}));
    bind('life-water', () => water?.());
    bind('life-settlement', () => settlement?.());
    document.querySelectorAll('[data-life-growth]').forEach(button => button.addEventListener('click', () => {
      const item = button.dataset.lifeGrowth;
      run('production', {item, enabled: !current().civilization.patches[item].enabled});
    }));
    document.querySelectorAll('[data-life-patch]').forEach(button => button.addEventListener('click', () => go(R.Civilization.PATCHES[button.dataset.lifePatch])));
    document.querySelectorAll('[data-life-home]').forEach(button => button.addEventListener('click', () => go(R.Civilization.HOMES.find(h => h.id === button.dataset.lifeHome))));
    document.querySelectorAll('[data-life-worker]').forEach(select => select.addEventListener('change', e => run('assign', {worker: select.dataset.lifeWorker, job: e.target.value})));
  }
  render();
  return {render};
}
