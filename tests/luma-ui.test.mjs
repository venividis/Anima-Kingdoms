// Shipped UI handlers in HappyDOM. Canvas and audio output are explicit mocks;
// local snapshots and the shared HTTP/SQLite authority are real. This does not
// claim browser visual QA, acoustic recognition or a human learning study.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../public/realm.js';
import { ALPHABET, RATIOS } from '../public/luma/data.js';
import { toNative, toLatin, phraseCode } from '../public/luma/language.js';
import { mountLocal, mountShared, service } from './luma-ui-harness.mjs';

const pack = ui => ui.saved().pack;
const ownKey = ui => ui.window.sessionStorage.getItem('anima-commons-token');
const memory = ui => ui.click('[data-luma-tab="memory"]');
const compose = ui => ui.click('[data-luma-tab="compose"]');

test('actual local app exposes twenty audible letter codes and all 900 searchable forms', async()=>{
  const ui=await mountLocal();
  try {
    await ui.begin();ui.key('g');assert.equal(ui.q('#panel').hidden,false);
    ui.click('[data-luma-tab="letters"]');
    assert.equal(ui.document.querySelectorAll('[data-luma-letter]').length,20);
    for(let q=0;q<ALPHABET.length;q++) {
      ui.click(`[data-luma-letter="${ALPHABET[q]}"]`);
      const n=ui.audioNotes.length;ui.click('#luma-letter-listen');await ui.idle();
      assert.deepEqual(ui.audioNotes.slice(n).map(n=>n.frequency),[220*RATIOS[Math.floor(q/5)],220*RATIOS[q%5]],'letter '+ALPHABET[q]);
    }
    ui.click('[data-luma-tab="lexicon"]');
    assert.equal(ui.document.querySelectorAll('[data-luma-word]').length,900);
    ui.input('#luma-search','care');assert.ok(ui.document.querySelector('[data-luma-word="meli"]'));
    ui.input('#luma-search',toNative('mela'));assert.ok(ui.document.querySelector('[data-luma-word="mela"]'));
    ui.input('#luma-search','melo');ui.click('[data-luma-word="melo"]');
    assert.equal(toLatin(ui.q('#luma-text').value),'i mi me gimi ta mela.');
    ui.input('#luma-text','pe mi me doni ta #e bama li "households".');ui.click('#luma-script');
    assert.equal(ui.q('#luma-text').value,toNative('pe mi me doni ta #e bama li "households".'));
    assert.match(ui.q('#luma-text').value,/"households"\.$/);
    const n=ui.audioNotes.length;ui.click('#luma-listen');await ui.idle();
    assert.equal(ui.audioNotes.length-n,phraseCode(ui.q('#luma-text').value).notes.length);
  } finally {await ui.close();}
});

test('actual local composer keeps an intention, restores its dimension and pays only on placement',async()=>{
  const ui=await mountLocal();
  try {
    await ui.begin();ui.click('#open-luma');
    const before=ui.saved(), initialPack=pack(ui);
    ui.click('#luma-enact');await ui.idle();assert.deepEqual(ui.saved(),before);
    ui.input('#luma-dimension',6);ui.click('[data-luma-mode="u"]');ui.click('#luma-enact');
    await ui.wait(()=>ui.saved().luma.intentions.length===1,'save intention');
    assert.deepEqual(pack(ui),initialPack);assert.equal(ui.saved().creation.instances.length,0);
    memory(ui);assert.match(ui.q('#luma-intentions').textContent,/Intention remains open/);
    ui.input('#luma-dimension',16);ui.click('[data-luma-return]');
    assert.equal(ui.q('#luma-dimension').value,'6');
    assert.equal(ui.q('#luma-dimension-value').textContent,'6');
    assert.match(toLatin(ui.q('#luma-text').value),/^pe /);
    const cost=R.previewLuma(R.restore(ui.saved()),ui.q('#luma-text').value,{dimension:6}).cost;
    ui.click('#luma-script');ui.click('#luma-enact');await ui.idle();
    assert.equal(ui.q('#creation-placement').hidden,false);assert.deepEqual(pack(ui),initialPack);
    assert.equal(ui.q('#panel').hidden,true);
    ui.click('#placement-commit');await ui.wait(()=>ui.saved().creation.instances.length===1,'native-word placement');
    for(const k of R.MATERIALS)assert.equal(pack(ui)[k],initialPack[k]-(cost[k]||0));
    assert.equal(ui.saved().creation.instances[0].blueprint.luma.dimension,6);
    assert.ok(ui.saved().luma.intentions[0].fulfilled);
    ui.click('#open-luma');memory(ui);assert.match(ui.q('#luma-intentions').textContent,/Undertaking accepted/);
  } finally {await ui.close();}
});

test('local observation reports saved facts and unsupported actor or released intention moves no assets',async()=>{
  const ui=await mountLocal();
  try {
    await ui.begin();ui.click('#open-luma');
    const before=ui.saved();ui.input('#luma-preset','observe');ui.click('#luma-enact');await ui.idle();
    const displayed=ui.q('#luma-feedback').textContent;
    assert.match(displayed,new RegExp(String(before.hero.hp)));assert.match(displayed,new RegExp(String(before.hero.breath)));
    assert.match(displayed,/wood|pack|materials/i);assert.deepEqual(ui.saved(),before);
    ui.input('#luma-text','pe ni me peli ta musa.');assert.equal(ui.q('#luma-enact').disabled,true);assert.deepEqual(ui.saved(),before);
    ui.input('#luma-text','u mi me peli ta musa.');ui.click('#luma-enact');await ui.wait(()=>ui.saved().luma.intentions.length===1);
    const stock=pack(ui);memory(ui);ui.click('[data-luma-release]');await ui.wait(()=>ui.saved().luma.intentions.length===0,'release saved intention');
    assert.deepEqual(pack(ui),stock);assert.match(ui.q('#luma-intentions').textContent,/wait here/);
  } finally {await ui.close();}
});

test('a full local notebook can release an intention and accept another through the same UI',async()=>{
  const ui=await mountLocal();
  try {
    await ui.begin();ui.click('#open-luma');ui.click('[data-luma-mode="u"]');
    const initialPack=pack(ui);
    for(let i=0;i<16;i++){ui.click('#luma-enact');await ui.wait(()=>ui.saved().luma.intentions.length===i+1,'intention '+(i+1));}
    ui.click('#luma-enact');await ui.idle();assert.equal(ui.saved().luma.intentions.length,16);
    assert.match(ui.q('#luma-feedback').textContent,/16|full|release/i);
    memory(ui);ui.click('[data-luma-release]');await ui.wait(()=>ui.saved().luma.intentions.length===15,'release from full notebook');
    compose(ui);ui.click('#luma-enact');await ui.wait(()=>ui.saved().luma.intentions.length===16,'new intention after release');
    assert.deepEqual(pack(ui),initialPack);
  }finally{await ui.close();}
});

test('repair selects the replacement creation and its full letter score can be performed immediately',async()=>{
  const ui=await mountLocal();
  try {
    await ui.begin();ui.click('#open-luma');ui.click('[data-luma-mode="pe"]');ui.click('#luma-enact');await ui.idle();ui.click('#placement-commit');
    await ui.wait(()=>ui.saved().creation.instances.length===1,'music inscription');
    const old=ui.saved().creation.instances[0],before=pack(ui);ui.click('#open-luma');ui.input('#luma-focus',old.id);ui.input('#luma-preset','repair');ui.click('#luma-enact');
    await ui.wait(()=>ui.saved().creation.instances[0].id!==old.id,'inscription revision');
    const replacement=ui.saved().creation.instances[0];assert.equal(ui.q('#luma-focus').value,replacement.id);assert.deepEqual(pack(ui),before);
    assert.equal(replacement.blueprint.parent,old.blueprint.id+'@'+old.blueprint.revision);
    const breath=ui.saved().hero.breath;ui.input('#luma-preset','perform');ui.click('#luma-enact');await ui.wait(()=>ui.q('#panel').hidden,'performance returns to the world');
    const state=ui.saved();assert.equal(state.hero.breath,breath-40);assert.ok(state.creation.instances[0].performance);
    assert.equal(R.Creation.scoreLength(state.creation.instances[0].blueprint),8);
  }finally{await ui.close();}
});

test('shared Luma i/u preserve materials, pe pays for actual public work, and drafts survive background arrivals',async()=>{
  const server=await service();let ui;
  try {
    ui=await mountShared(server);await ui.join('Luma Builder');
    await ui.walk('[data-walk-node="grove"]');await ui.gather('grove',2);await ui.walk('#walk-project');await ui.tab('luma');
    const token=ownKey(ui),before=await server.state(token);
    ui.input('#luma-item','wood');ui.input('#luma-quantity',2);
    ui.click('#luma-enact');await ui.wait(()=>ui.q('#luma-feedback').textContent.includes('Possibility recorded'));
    ui.click('[data-luma-mode="u"]');ui.click('#luma-enact');await ui.wait(()=>ui.q('#luma-feedback').textContent.includes('Intention recorded'));
    const planned=await server.state(token);assert.deepEqual(planned.you.inventory,before.you.inventory);assert.deepEqual(planned.projects,before.projects);
    const field=ui.q('#luma-text');const draft=toNative('pe mi me bani ta bana.');ui.input('#luma-text',draft);
    await server.newPlayer('A passing listener');ui.q('#commons-world').focus();await ui.poll();
    assert.equal(ui.q('#luma-text'),field,'polling must preserve the composer instance');assert.equal(field.value,draft);assert.equal(ui.q('#luma-quantity').value,'2');
    ui.click('#luma-enact');await ui.wait(()=>ui.inventory('wood')===0,'paid public-work utterance');
    const after=await server.state(token);assert.equal(after.projects[0].delivered.wood,2);assert.equal(after.you.inventory.marks,4);
    assert.ok(Object.values(after.ledger.residual).every(n=>n===0));
    assert.deepEqual(ui.requests.filter(r=>r.body?.op==='luma.speak').map(r=>r.body.payload.bindings.kind),['project','project','project']);
    memory(ui);assert.match(ui.q('#luma-receipts').textContent,/intended|imagined|enacted/);
    compose(ui);ui.input('#luma-preset','awe');assert.equal(ui.q('#luma-material-fields').hidden,true);ui.click('#luma-enact');await ui.wait(()=>ui.q('#luma-feedback').textContent.includes('experience'));
    const experienced=await server.state(token);assert.deepEqual(experienced.you.inventory,after.you.inventory);assert.equal(experienced.luma.utterances.at(-1).status,'experienced');
  }finally{await ui?.close();await server.close();}
});

test('typing a gift in the project preset targets its recipient and preserves their accept/decline choice',async()=>{
  const server=await service();let ui;
  try {
    const receiver=await server.newPlayer('Luma Receiver');
    ui=await mountShared(server);await ui.join('Luma Giver');await ui.walk('[data-walk-node="grove"]');await ui.gather('grove',2);await ui.tab('luma');
    const giver=ownKey(ui);assert.equal(ui.q('#luma-preset').value,'project');
    ui.input('#luma-recipient',receiver.playerId||receiver.state.you.id);ui.input('#luma-item','wood');ui.input('#luma-text','pe mi me doni ta dona li ti.');
    assert.equal(ui.q('#luma-recipient-field').hidden,false);assert.equal(ui.q('#luma-project-field').hidden,true);
    ui.click('#luma-enact');await ui.wait(()=>ui.inventory('wood')===1,'gift escrow');
    const request=ui.requests.find(r=>r.body?.op==='luma.speak');assert.equal(request.body.payload.bindings.kind,'gift');
    assert.equal((await server.state(receiver.token)).you.inventory.wood,0);
    await ui.close();ui=await mountShared(server,{storage:{'anima-commons-token':receiver.token}});await ui.wait(()=>!ui.q('#commons-play').hidden);await ui.tab('luma');memory(ui);
    ui.click('[data-luma-gift="decline"]');await ui.wait(()=>!ui.document.querySelector('[data-luma-gift="decline"]'),'gift decline');
    assert.equal((await server.state(giver)).you.inventory.wood,2);assert.equal(ui.inventory('wood'),0);
    await ui.close();ui=await mountShared(server,{storage:{'anima-commons-token':giver}});await ui.wait(()=>!ui.q('#commons-play').hidden);await ui.tab('luma');
    ui.input('#luma-text',toNative('pe mi me doni ta dona li ti.'));ui.input('#luma-recipient',receiver.playerId||receiver.state.you.id);ui.click('#luma-enact');await ui.wait(()=>ui.inventory('wood')===1,'second gift escrow');
    await ui.close();ui=await mountShared(server,{storage:{'anima-commons-token':receiver.token}});await ui.wait(()=>!ui.q('#commons-play').hidden);await ui.tab('luma');memory(ui);
    ui.click('[data-luma-gift="accept"]');await ui.wait(()=>ui.inventory('wood')===1,'recipient acceptance');
    const final=await server.state(giver);assert.equal(final.you.inventory.wood,1);assert.ok(Object.values(final.ledger.residual).every(n=>n===0));
  }finally{await ui?.close();await server.close();}
});

test('a lost committed Luma reply recovers the same utterance without spending materials twice',async()=>{
  const server=await service();let ui,drop=true;
  try {
    ui=await mountShared(server,{intercept:async(request,response)=>{
      if(drop&&request.body?.op==='luma.speak'&&response.ok){drop=false;await response.arrayBuffer();throw Error('Simulated lost reply after actual Luma commit');}return response;
    }});
    await ui.join('Luma Reply Recovery');await ui.walk('[data-walk-node="grove"]');await ui.gather('grove');await ui.walk('#walk-project');await ui.tab('luma');ui.click('[data-luma-mode="pe"]');ui.click('#luma-enact');
    await ui.wait(()=>!!ui.window.sessionStorage.getItem('anima-commons-pending'),'pending Luma request');await ui.idle();
    const storage=ui.savedStorage(),pending=JSON.parse(storage['anima-commons-pending']),token=ownKey(ui);
    assert.equal((await server.state(token)).projects[0].delivered.wood,1);
    await ui.close();ui=await mountShared(server,{storage});await ui.wait(()=>!ui.q('#commons-play').hidden&&!ui.window.sessionStorage.getItem('anima-commons-pending'),'Luma retry after reload');
    const retries=ui.requests.filter(r=>r.body?.op==='luma.speak');assert.equal(retries.length,1);assert.deepEqual(retries[0].body,pending);
    const state=await server.state(token);assert.equal(state.projects[0].delivered.wood,1);assert.equal(state.you.inventory.wood,0);assert.equal(state.luma.utterances.length,1);
  }finally{await ui?.close();await server.close();}
});

test('arrival retries reuse the persisted name and key after an actual committed reply is lost',async()=>{
  const server=await service();let ui,drop=true;
  try {
    ui=await mountShared(server,{intercept:async(request,response)=>{
      if(drop&&request.path==='/api/session'&&response.ok){drop=false;await response.arrayBuffer();throw Error('Simulated lost arrival reply');}return response;
    }});
    await ui.wait(()=>ui.q('#entry-status').textContent.includes('ready'));ui.input('#wayfarer-name','Arrival Recovery');ui.click('#join-button');await ui.wait(()=>ui.q('#entry-status').textContent.includes('lost arrival'));await ui.idle();
    const storage=ui.savedStorage(),pending=JSON.parse(storage['anima-commons-entry']);assert.equal(pending.name,'Arrival Recovery');assert.ok(pending.key);
    await ui.close();ui=await mountShared(server,{storage});await ui.wait(()=>!ui.q('#commons-play').hidden,'arrival replay');
    assert.equal(ui.q('#player-label').textContent,'Arrival Recovery');assert.deepEqual(ui.requests.find(r=>r.path==='/api/session').body,pending);
    const state=await server.state(ownKey(ui));assert.equal(state.players.filter(p=>p.name==='Arrival Recovery').length,1);assert.equal(ui.window.sessionStorage.getItem('anima-commons-entry'),null);
  }finally{await ui?.close();await server.close();}
});

test('a late arrival response cannot overwrite a player restored after it was sent',async()=>{
  const server=await service();let ui,release;
  try {
    const restored=await server.newPlayer('Restored Luma Player');let held=false;
    ui=await mountShared(server,{intercept:async(request,response)=>{
      if(!held&&request.path==='/api/session'){held=true;await new Promise(resolve=>release=resolve);}return response;
    }});
    await ui.wait(()=>ui.q('#entry-status').textContent.includes('ready'));ui.input('#wayfarer-name','Delayed Arrival');ui.click('#join-button');await ui.wait(()=>held);
    ui.q('#restore-player').open=true;ui.input('#recovery-key',restored.token);ui.click('#restore-session');await ui.wait(()=>ui.q('#player-label').textContent==='Restored Luma Player','explicit restoration');
    release();release=null;await ui.idle();assert.equal(ui.q('#player-label').textContent,'Restored Luma Player');assert.equal(ownKey(ui),restored.token);
  }finally{release?.();await ui?.close();await server.close();}
});

test('a server-rejected arrival name can be corrected without reusing the rejected pending intent',async()=>{
  const server=await service();let ui;
  try {
    ui=await mountShared(server);await ui.wait(()=>ui.q('#entry-status').textContent.includes('ready'));
    ui.input('#wayfarer-name',' ');ui.q('#join-realm').dispatchEvent(new ui.window.Event('submit',{bubbles:true,cancelable:true}));
    await ui.wait(()=>ui.q('#entry-status').textContent.includes('2')||ui.q('#entry-status').textContent.includes('name'));await ui.idle();
    const first=ui.requests.find(r=>r.path==='/api/session');assert.ok(first);assert.equal(ui.window.sessionStorage.getItem('anima-commons-entry'),null);
    ui.input('#wayfarer-name','Corrected Luma Name');ui.click('#join-button');await ui.wait(()=>!ui.q('#commons-play').hidden,'corrected arrival');
    const requests=ui.requests.filter(r=>r.path==='/api/session');assert.equal(requests.length,2);assert.notEqual(requests[0].body.key,requests[1].body.key);assert.equal(ui.q('#player-label').textContent,'Corrected Luma Name');
  }finally{await ui?.close();await server.close();}
});
