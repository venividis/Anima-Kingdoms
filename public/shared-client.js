import {mountLumaAtelier} from './luma-view.js';
import {compile} from './creation.js';
import {paintBlueprint} from './canvas-view.js';
import {RealmConnection} from './shared-transport.js';
import {SharedView} from './shared-view.js';
import {ITEMS, MATERIALS, traversable, BOUNDS} from './shared-rules.js';
import {waypoint, clearRoute} from './navigation.js';

const $=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const view=new SharedView($('commons-world'));
let state=null,tab='works',journey=null,keys={},touch=[0,0],active=false,noticeTimer,
  polling=false,walking=false,lastPoll=0,lastFrame=0,lastDock='',lastDockPlayer=null,lastStep=null,stalled=0,
  agentCredential=null,disconnected=false,uploadDraft=null,lumaAtelier=null,sessionIntent=0;
const routeActor={x:0,z:16};
let savedToken='';
try {savedToken=sessionStorage.getItem('anima-commons-token')||'';} catch { /* The entry form will explain unavailable storage. */ }
const connection=new RealmConnection({token:savedToken,onState:acceptState,onStatus:setStatus});

function notice(message) {
  $('commons-notice').textContent=message;
  $('commons-notice').hidden=false;
  clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>$('commons-notice').hidden=true,4500);
}
function setStatus(status) {
  const labels={connected:'Realm connected',confirming:'Confirming',uncertain:'Recover action',offline:'Reconnecting'};
  $('connection-status').dataset.status=status;
  $('connection-status').querySelector('span').textContent=labels[status]||status;
  $('pending-action').hidden=status!=='uncertain';
  if(status==='connected')disconnected=false;
}
function progressHTML(project) {
  return Object.entries(project?.required||{}).map(([item,n])=>`<div class="project-progress"><label><span>${esc(item)}</span><span>${project.delivered[item]||0} / ${n}</span></label><progress value="${project.delivered[item]||0}" max="${n}" aria-label="${esc(project.name)} ${esc(item)} delivered"></progress></div>`).join('');
}
function acceptState(next) {
  if(state&&(state.you.id!==next.you.id||state.realmId!==next.realmId)) {
    agentCredential=null;uploadDraft=null;journey=null;keys={};touch=[0,0];lastDock='';lumaAtelier?.dispose();lumaAtelier=null;
  }
  state=next;
  active=true;
  $('commons-entry').hidden=true;$('service-unavailable').hidden=true;$('commons-play').hidden=false;
  $('player-label').textContent=next.you.name;
  const project=next.projects.find(p=>!p.complete)||next.projects.at(-1);
  $('chapter-title').textContent=next.world.bridgeOpen?'A light beyond the river.':'The river between us.';
  $('chapter-copy').textContent=next.world.bridgeOpen?'Carry the valley’s materials to the far-bank beacon. Your shared work has already made the crossing permanent.':'A crossing needs eight wood and eight stone. Every piece comes from someone’s hands.';
  $('chapter-progress').innerHTML=progressHTML(project);
  $('walk-project').textContent=project?.complete?'Walk to our completed beacon ↗':next.world.bridgeOpen?'Walk to the beacon ↗':'Walk to the bridgehead ↗';
  $('chapter-witness').textContent=next.players.filter(p=>p.online).length+' wayfarer(s) nearby · work persists after you leave';
  $('commons-inventory').innerHTML=ITEMS.map(item=>`<div class="inventory-item" data-item="${item}"><b>${next.you.inventory[item]}</b><small>${item}</small></div>`).join('');
  $('position-label').textContent=`${next.you.z<-19?'THE FAR BANK':'THE NEAR BANK'} · ${next.you.x.toFixed(1)}, ${next.you.z.toFixed(1)}`;
  const nearest=next.nodes.filter(n=>n.remaining>0&&distance(n,next.you)<=3).sort((a,b)=>distance(a,next.you)-distance(b,next.you))[0];
  $('gather-near').disabled=!nearest||connection.busy||!!connection.pending;
  $('gather-near').textContent=nearest?'Gather '+nearest.item+' · E':'Approach a resource';
  const currentFocus=document.activeElement;
  if(tab==='luma'||!currentFocus?.matches('input,select,textarea')||!currentFocus.closest('#dock-content'))renderDock();
}
function inventoryOptions(selected='wood',marks=true) {
  return (marks?ITEMS:MATERIALS).map(item=>`<option value="${item}"${item===selected?' selected':''}>${item[0].toUpperCase()+item.slice(1)}</option>`).join('');
}
function actionLabel(op) {return {'gather':'Material gathered.','offer.create':'Your offer is open. Its goods are held for the buyer.','offer.fill':'Exchange complete. Both inventories settled together.','offer.cancel':'Offer cancelled. Your goods returned.','project.contribute':'Your materials became part of this place.','market.buy':'Purchase complete.','market.sell':'Sale complete.','agent.revoke':'Agent access revoked.','chat.send':'Message shared.','blueprint.publish':'Your blueprint is on the shared shelf.','blueprint.remove':'Your blueprint was removed from the shelf.'}[op]||'Saved in the shared realm.';}
async function act(op,payload={},quiet=false) {
  try {
    const result=await connection.command(op,payload);
    if(!quiet)notice(actionLabel(op));
    if(op!=='move')renderDock(true);
    return result;
  } catch(error) {
    if(!quiet||connection.pending)notice(error.message);
    if(error.status===401){active=false;$('commons-entry').hidden=false;$('commons-play').hidden=true;$('entry-status').textContent='This session expired. Restore a valid recovery key or enter as a new wayfarer.';}
    return null;
  }
}
function travel(point,label) {
  if(!state||!traversable(state.world.bridgeOpen,point.x,point.z)){notice('The river has no crossing yet. Complete The Joined Span first.');return;}
  journey={x:point.x,z:point.z,label};clearRoute(routeActor);keys={};touch=[0,0];stalled=0;lastStep=null;
  $('journey-label').textContent='Walking to '+label+' · movement keys stop this journey';
  if(innerWidth<780)collapseDock(true);
  $('commons-world').focus();
}
function collapseDock(collapsed) {
  const dock=document.querySelector('.commons-dock');dock.classList.toggle('collapsed',collapsed);
  $('toggle-dock').textContent=collapsed?'+':'−';$('toggle-dock').setAttribute('aria-expanded',String(!collapsed));
  $('toggle-dock').setAttribute('aria-label',collapsed?'Expand activities':'Collapse activities');
}
function renderDock(force=false) {
  if(!state)return;
  if(tab==='luma'){
    if(!lumaAtelier){
      $('dock-content').innerHTML='<div id="luma-commons"></div>';
      lumaAtelier=mountLumaAtelier($('luma-commons'),{
        shared:true,state:()=>state,events:()=>state.luma?.utterances||[],
        enact:async(text,bindings)=>{const response=await connection.command('luma.speak',{text,bindings});return response.receipt.result;},
        gift:async(kind,giftId)=>{const response=await connection.command('gift.'+kind,{giftId});notice(kind==='accept'?'The gift is yours.':kind==='decline'?'The gift returned to its giver.':'Your gift returned to you.');return response.receipt.result;}
      });
    }else lumaAtelier.refresh();
    lastDock='';lastDockPlayer=state.you.id;return;
  }
  lumaAtelier?.dispose();lumaAtelier=null;
  const signature=JSON.stringify({tab,player:state.you.id,inventory:state.you.inventory,offers:state.offers,projects:state.projects,nodes:state.nodes.map(n=>[n.id,n.remaining]),chat:state.chat,agents:state.agents,players:state.players.map(p=>[p.id,p.name,p.online]),ledger:state.ledger,treasury:state.treasury,blueprints:state.blueprints});
  if(!force&&signature===lastDock)return;
  // A background update may refresh offers or arrivals after focus leaves a
  // field. Preserve unsent form values; only explicit actions/tabs reset them.
  const drafts=!force&&lastDockPlayer===state.you.id?[...$('dock-content').querySelectorAll('input,select,textarea')].filter(el=>el.type!=='file').map(el=>({id:el.id,name:el.name,type:el.type,value:el.value,checked:el.checked})):[];
  lastDock=signature;
  lastDockPlayer=state.you.id;
  let html='';
  if(tab==='works') {
    html='<p class="dock-intro">A shared place, built piece by piece. Gather nearby materials, then bring them to the worksite.</p>';
    html+=state.projects.map(p=>`<article class="commons-card"><span class="card-tag">${p.complete?'A promise kept':'Public work'}</span><h3>${esc(p.name)}</h3>${progressHTML(p)}${p.complete?'<p class="complete-seal">Completed for everyone ✓</p>':`<p>${p.id==='crossing'?'Build a permanent crossing to the far orchard.':'Raise a light where our two banks meet.'} Contributions earn 2 Marks per piece while the treasury can fund them.</p><div class="row">${Object.entries(p.required).filter(([item,n])=>(p.delivered[item]||0)<n).map(([item])=>`<button class="quiet-button" data-contribute="${esc(p.id)}" data-material="${item}"${state.you.inventory[item]<1?' disabled':''}>Give 1 ${item}</button>`).join('')}</div>`}<button class="quiet-button" data-walk-project="${esc(p.id)}">Walk to ${esc(p.name)} ↗</button></article>`).join('');
    html+='<h3 class="eyebrow">GATHERING PLACES</h3>'+state.nodes.map(n=>`<article class="commons-card"><h3>${esc(n.name)}</h3><p>${n.remaining} ${esc(n.item)} remain in this shared reserve.</p><div class="row"><button class="quiet-button" data-walk-node="${esc(n.id)}">Walk here ↗</button><button class="quiet-button" data-gather="${esc(n.id)}"${n.remaining?'':' disabled'}>Gather one</button></div></article>`).join('');
  } else if(tab==='exchange') {
    html='<p class="dock-intro">Trade the actual goods you hold. An open offer reserves the seller’s goods until it is filled or cancelled.</p><article class="commons-card"><h3>Make an offer</h3><form id="offer-form"><div class="field"><label for="give-item">You give</label><div class="two-fields"><select id="give-item">'+inventoryOptions('wood')+'</select><input id="give-quantity" type="number" min="1" max="100" value="1" aria-label="Quantity to give" required></div></div><div class="field"><label for="want-item">You receive</label><div class="two-fields"><select id="want-item">'+inventoryOptions('stone')+'</select><input id="want-quantity" type="number" min="1" max="100" value="1" aria-label="Quantity to receive" required></div></div><button class="gold-button" type="submit">Place funded offer</button></form></article>';
    const offers=state.offers.filter(o=>o.status==='open');
    html+='<h3 class="eyebrow">OPEN PLAYER OFFERS</h3>'+(offers.length?offers.map(o=>`<article class="commons-card"><span class="card-tag">${esc(o.sellerName)} offers</span><h3>${o.give.quantity} ${esc(o.give.item)} <span aria-hidden="true">⇄</span> ${o.want.quantity} ${esc(o.want.item)}</h3>${o.sellerId===state.you.id?`<button class="danger-button" data-cancel-offer="${esc(o.id)}">Cancel & recover goods</button>`:`<button class="gold-button" data-fill-offer="${esc(o.id)}"${state.you.inventory[o.want.item]<o.want.quantity?' disabled':''}>Give ${o.want.quantity} ${esc(o.want.item)} · receive ${o.give.quantity} ${esc(o.give.item)}</button>`}</article>`).join(''):'<p class="dock-intro">No open offers. Place one for the next wayfarer.</p>');
    if(state.market)html+='<article class="commons-card"><span class="card-tag">FINITE TOWN STOCK</span><h3>The Commons Exchange</h3><p>The keeper trades from a finite treasury. Walk to the stall before buying or selling.</p><button class="quiet-button" id="walk-market">Walk to the Exchange ↗</button><form id="market-form"><div class="field"><label for="market-item">Material</label><select id="market-item">'+inventoryOptions('wood',false)+'</select></div><div class="row"><button class="gold-button" name="side" value="buy">Buy one</button><button class="quiet-button" name="side" value="sell">Sell one</button></div><p class="form-caption" id="market-price"></p></form></article>';
  } else if(tab==='people') {
    html='<p class="dock-intro">Other wayfarers move through the same shared commons. Display names are chosen freely; they are not verified identities.</p>'+state.players.map(p=>`<div class="player-row"><div class="player-gem">${esc(p.name.slice(0,1).toUpperCase())}</div><span>${esc(p.name)}${p.id===state.you.id?' · you':''}<small>${p.online?'Here now':'Away · their work remains'}</small></span></div>`).join('');
    html+='<article class="commons-card"><h3>By the fireside</h3><div id="chat-history">'+(state.chat.length?state.chat.slice(-12).map(m=>`<div class="chat-line"><b>${esc(m.name)}</b>${esc(m.text)}</div>`).join(''):'<p>The first words are still unwritten.</p>')+'</div><form id="chat-form"><label for="chat-text" class="eyebrow">A message to the commons</label><textarea id="chat-text" maxlength="280" required placeholder="What shall we build together?"></textarea><button class="quiet-button" type="submit">Share message ↗</button></form></article>';
  } else if(tab==='studio') {
    html='<p class="dock-intro">Share the designs you make in the Dream Foundry. Other wayfarers can download a blueprint, explore it in rehearsal, and build it with their own materials.</p><article class="commons-card"><h3>Leave an invention</h3><label class="field" for="blueprint-file">Choose an exported Foundry blueprint</label><input id="blueprint-file" type="file" accept=".json,application/json"><p id="blueprint-review" class="form-caption"></p><button id="publish-blueprint" class="gold-button" disabled>Share this blueprint</button><p class="form-caption">This publishes your design with your player name. Your inventory and placed creations stay in their original world.</p><a href="./play.html" class="quiet-button">Open your Dream Foundry ↗</a></article>';
    html+='<h3 class="eyebrow">OUR BLUEPRINT SHELF</h3>'+((state.blueprints||[]).length?(state.blueprints||[]).map(p=>`<article class="commons-card"><span class="card-tag">${esc(p.blueprint.kind)} · by ${esc(p.authorName)}</span><h3>${esc(p.blueprint.name)}</h3><canvas class="shelf-preview" data-blueprint-preview="${esc(p.id)}" width="270" height="150" aria-label="${esc(p.blueprint.name)} blueprint preview"></canvas><p>Revision ${p.blueprint.revision} · ${p.blueprint.parts.length} authored parts</p><button class="quiet-button" data-blueprint-download="${esc(p.id)}">Download & create your own ↗</button>${p.authorId===state.you.id?`<button class="danger-button" data-blueprint-remove="${esc(p.id)}">Remove from shared shelf</button>`:''}</article>`).join(''):'<p class="dock-intro">The shelf is waiting for its first invention.</p>');
  } else if(tab==='agents') {
    html=`<p class="dock-intro">Invite an external agent to act through your own body and inventory. You choose its abilities, command budget, and duration. Revoke it here whenever you choose.</p><article class="commons-card"><h3>A bounded invitation</h3><form id="agent-form"><div class="field"><label for="agent-name">Agent name</label><input id="agent-name" value="My pathfinder" maxlength="24" required></div><label class="scope-choice"><input type="checkbox" name="scope" value="move" checked>Walk</label><label class="scope-choice"><input type="checkbox" name="scope" value="gather" checked>Gather</label><label class="scope-choice"><input type="checkbox" name="scope" value="project.contribute">Contribute my materials</label><label class="scope-choice"><input type="checkbox" name="scope" value="offer.create">Place offers using my goods</label><label class="scope-choice"><input type="checkbox" name="scope" value="luma.speak">Speak in Luma</label><label class="scope-choice"><input type="checkbox" name="scope" value="gift.offer">Offer my goods as gifts</label><label class="scope-choice"><input type="checkbox" name="scope" value="gift.accept">Welcome gifts to me</label><label class="scope-choice"><input type="checkbox" name="scope" value="gift.decline">Decline gifts to me</label><label class="scope-choice"><input type="checkbox" name="scope" value="gift.cancel">Withdraw my pending gifts</label><label class="scope-choice"><input type="checkbox" name="scope" value="blueprint.publish">Publish a blueprint</label><div class="row"><div class="field"><label for="agent-budget">Command budget</label><input id="agent-budget" type="number" min="1" max="1000" value="100" required></div><div class="field"><label for="agent-duration">Duration</label><select id="agent-duration"><option value="600">10 minutes</option><option value="3600">1 hour</option><option value="86400">1 day</option></select></div></div><button class="gold-button" type="submit">Create this invitation</button></form><p class="form-caption">This connects your external agent through the API. No language model runs inside this page.</p><div id="agent-key-wrap"${agentCredential?'':' hidden'}><p class="form-caption">Give this key only to your chosen agent. It can spend resources only through the scopes you selected.</p><pre id="agent-key"></pre></div></article>`;
    html+=state.agents.map(a=>`<article class="commons-card"><h3>${esc(a.name)}</h3><p>${esc(a.scopes.join(' · '))}</p><p>${a.revoked?'Revoked':a.expiresAt<state.serverTime?'Expired':a.remaining+' commands left'}</p>${a.revoked?'':`<button class="danger-button" data-revoke-agent="${esc(a.id)}">Revoke ${esc(a.name)}</button>`}</article>`).join('');
  } else {
    html='<p class="dock-intro">Your possessions have one custodian. The realm checks its material and money totals after each committed change.</p><article class="commons-card"><h3>A conserved world</h3>'+ITEMS.map(item=>`<div class="ledger-line"><span>${esc(item)}</span><b>${state.ledger.residual[item]===0?'Balanced ✓':esc(state.ledger.residual[item])}</b></div>`).join('')+'</article><article class="commons-card"><h3>Return to this body</h3><p>This tab remembers your player. Keep a recovery key to return from another tab or browser before the session expires. Whoever has this key can use this player’s possessions.</p><button id="show-recovery" class="quiet-button">Reveal my recovery key</button><p id="my-recovery" class="recovery-copy" hidden></p><p class="form-caption">Your goods belong to this realm’s service. The First Orchard’s local save is a different world and cannot fund shared trades.</p></article><article class="commons-card"><h3>Continue the wider world</h3><a class="quiet-button" href="./play.html">Creation, combat & living settlement ↗</a><br><a class="quiet-button" href="./audit.html">Read the retained accountability audit ↗</a></article>';
  }
  $('dock-content').innerHTML=html;
  const fields=[...$('dock-content').querySelectorAll('input,select,textarea')];
  for(const draft of drafts){const el=fields.find(el=>draft.id?el.id===draft.id:el.name===draft.name&&el.type===draft.type&&el.value===draft.value);if(el){el.value=draft.value;if(['checkbox','radio'].includes(el.type))el.checked=draft.checked;}}
  for(const el of document.querySelectorAll('[data-walk-node]'))el.onclick=()=>{const n=state.nodes.find(n=>n.id===el.dataset.walkNode);travel(n,n.name);};
  for(const el of document.querySelectorAll('[data-walk-project]'))el.onclick=()=>{const p=state.projects.find(p=>p.id===el.dataset.walkProject);travel(p,p.name);};
  for(const el of document.querySelectorAll('[data-gather]'))el.onclick=()=>act('gather',{nodeId:el.dataset.gather});
  for(const el of document.querySelectorAll('[data-contribute]'))el.onclick=()=>act('project.contribute',{projectId:el.dataset.contribute,item:el.dataset.material,quantity:1});
  for(const el of document.querySelectorAll('[data-fill-offer]'))el.onclick=()=>act('offer.fill',{offerId:el.dataset.fillOffer});
  for(const el of document.querySelectorAll('[data-cancel-offer]'))el.onclick=()=>act('offer.cancel',{offerId:el.dataset.cancelOffer});
  for(const el of document.querySelectorAll('[data-revoke-agent]'))el.onclick=()=>act('agent.revoke',{agentId:el.dataset.revokeAgent});
  if($('offer-form'))$('offer-form').onsubmit=e=>{e.preventDefault();act('offer.create',{give:{item:$('give-item').value,quantity:Number($('give-quantity').value)},want:{item:$('want-item').value,quantity:Number($('want-quantity').value)}});};
  if($('market-form')) {
    const price=()=>{const item=$('market-item').value;$('market-price').textContent='Buy: '+state.market.ask[item]+' Marks · sell: '+state.market.bid[item]+' Marks · stock: '+state.treasury[item];};price();
    $('market-item').onchange=price;$('walk-market').onclick=()=>travel(state.market,state.market.name);
    $('market-form').onsubmit=e=>{e.preventDefault();act('market.'+(e.submitter?.value||'buy'),{item:$('market-item').value,quantity:1});};
  }
  if($('chat-form'))$('chat-form').onsubmit=async e=>{e.preventDefault();const text=$('chat-text').value;if(await act('chat.send',{text}))renderDock(true);};
  if($('agent-form')) {
    if(agentCredential)$('agent-key').textContent=agentCredential;
    $('agent-form').onsubmit=async e=>{e.preventDefault();const result=await act('agent.create',{name:$('agent-name').value,scopes:[...document.querySelectorAll('input[name=scope]:checked')].map(el=>el.value),allowance:Number($('agent-budget').value),expiresInSeconds:Number($('agent-duration').value)});if(result){agentCredential=result.receipt.result.token;renderDock(true);}};
  }
  if($('blueprint-file')) {
    if(uploadDraft){$('blueprint-review').textContent=uploadDraft.name+' · '+uploadDraft.kind+' · '+uploadDraft.parts.length+' parts';$('publish-blueprint').disabled=false;}
    $('blueprint-file').onchange=async e=>{
      uploadDraft=null;$('publish-blueprint').disabled=true;
      try{const file=e.target.files[0];if(!file)return;if(file.size>12000)throw Error('Choose a blueprint smaller than 12 KiB.');uploadDraft=compile(JSON.parse(await file.text())).blueprint;$('blueprint-review').textContent=uploadDraft.name+' · '+uploadDraft.kind+' · '+uploadDraft.parts.length+' parts';$('publish-blueprint').disabled=false;}catch(error){$('blueprint-review').textContent=error.message;}
    };
    $('publish-blueprint').onclick=async()=>{if(uploadDraft&&await act('blueprint.publish',{blueprint:uploadDraft})){uploadDraft=null;renderDock(true);}};
    for(const el of document.querySelectorAll('[data-blueprint-preview]')){const p=state.blueprints.find(p=>p.id===el.dataset.blueprintPreview),b=p.blueprint,extent=Math.max(4,...b.parts.map(p=>Math.max(Math.abs(p.x)+p.w,Math.abs(p.z)+p.d,p.y+p.h))),scale=130/(extent*2);paintBlueprint(el.getContext('2d'),b,(x,y,z)=>({x:135+x*scale,y:112+z*scale*.68-y*scale}),0,0,.25);}
    for(const el of document.querySelectorAll('[data-blueprint-download]'))el.onclick=()=>{
      const p=state.blueprints.find(p=>p.id===el.dataset.blueprintDownload);const url=URL.createObjectURL(new Blob([JSON.stringify(p.blueprint,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=p.blueprint.name.replace(/[^a-zA-Z0-9-]/g,'-')+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    };
    for(const el of document.querySelectorAll('[data-blueprint-remove]'))el.onclick=()=>act('blueprint.remove',{publicationId:el.dataset.blueprintRemove});
  }
  if($('show-recovery'))$('show-recovery').onclick=()=>{$('my-recovery').textContent=connection.token;$('my-recovery').hidden=false;};
}
function pendingArrival(){
 const raw=sessionStorage.getItem('anima-commons-entry');if(!raw)return null;
 const p=JSON.parse(raw);if(!p||typeof p.name!=='string'||typeof p.key!=='string')throw Error('The saved arrival request is unreadable.');return p;
}
async function enter(name) {
 const intent=++sessionIntent;$('join-button').disabled=true;let pending=null;
 try {
  if(connection.pending)throw Error('Recover your pending action before changing players.');
  sessionStorage.setItem('anima-storage-check','1');sessionStorage.removeItem('anima-storage-check');
  pending=pendingArrival()||{name,key:crypto.randomUUID()};
  sessionStorage.setItem('anima-commons-entry',JSON.stringify(pending));
  $('wayfarer-name').value=pending.name;
  const result=await connection.request('/api/session',pending);
  if(intent!==sessionIntent)return;
  sessionStorage.setItem('anima-commons-token',result.token);connection.token=result.token;
  sessionStorage.removeItem('anima-commons-entry');connection.accept(result.state);$('commons-world').focus();
 }catch(error){
  if(intent!==sessionIntent)return;
  if(error.status===400&&['INVALID_TEXT','INVALID_SHAPE','INVALID_SESSION_KEY'].includes(error.code)&&pending){try{if(pendingArrival()?.key===pending.key)sessionStorage.removeItem('anima-commons-entry');}catch{}}
  $('entry-status').textContent=error.message;
 }finally{if(intent===sessionIntent)$('join-button').disabled=false;}
}
async function connect() {
 const intent=sessionIntent;$('entry-status').textContent='Finding the realm…';
 try {
  await connection.request('/api/health');if(intent!==sessionIntent)return;
  $('service-unavailable').hidden=true;
  if(connection.token){
   try{await connection.refresh();if(connection.pending)await connection.recover();return;}
   catch(error){if(intent!==sessionIntent)return;if(error.status!==401){setStatus(connection.pending?'uncertain':'offline');$('entry-status').textContent=error.message;return;}connection.token='';}
  }
  const pending=pendingArrival();if(pending){await enter(pending.name);return;}
  $('commons-entry').hidden=false;$('entry-status').textContent='The realm is ready. Begin with empty hands; gather what you need.';setStatus('connected');
 }catch{if(intent!==sessionIntent)return;$('commons-entry').hidden=true;$('service-unavailable').hidden=false;setStatus('offline');}
}
async function movementStep() {
  if(!active||!state||walking||connection.busy||connection.pending||document.hidden)return;
  let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+touch[0];
  let dz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+touch[1];
  if(dx||dz)journey=null;
  else if(journey) {
    if(distance(state.you,journey)<.8){notice('Arrived at '+journey.label+'.');journey=null;}
    else {
      Object.assign(routeActor,{x:state.you.x,z:state.you.z});
      const nav={kingdoms:{topology:state.world.bridgeOpen?1:0},mode:'world',rain:{storage:{bridge:state.world.bridgeOpen?6:0}},structures:[],creation:{instances:[]},tick:Math.floor(state.serverTime/16.667)};
      const target=waypoint(nav,routeActor,journey,(_s,x,z)=>traversable(state.world.bridgeOpen,x,z),{minX:BOUNDS.xMin,maxX:BOUNDS.xMax,minZ:BOUNDS.zMin,maxZ:BOUNDS.zMax});
      if(!target){notice('There is no open route. Build the crossing or choose another place.');journey=null;}
      else {const d=distance(state.you,target);dx=(target.x-state.you.x)/Math.max(.001,d);dz=(target.z-state.you.z)/Math.max(.001,d);}
    }
  }
  if(!journey)$('journey-label').textContent='WASD / arrows · move';
  if(!dx&&!dz)return;
  walking=true;
  try {
    if(lastStep&&distance(state.you,lastStep)<.015)stalled++;else stalled=0;
    lastStep={x:state.you.x,z:state.you.z};
    if(stalled>16&&journey){notice('This route is blocked. Try another approach.');journey=null;return;}
    const length=Math.max(1,Math.hypot(dx,dz));
    await act('move',{dx:dx/length,dz:dz/length},true);
  } finally {walking=false;}
}

$('join-realm').onsubmit=e=>{e.preventDefault();enter($('wayfarer-name').value.trim());};
$('retry-service').onclick=connect;
$('restore-session').onclick=async()=>{
 if(connection.pending){notice('Recover your existing pending action first.');return;}
 const token=$('recovery-key').value.trim();if(!token)return;
 const intent=++sessionIntent,previous=connection.token;connection.token=token;$('join-button').disabled=false;
 try{await connection.refresh();if(intent!==sessionIntent)return;sessionStorage.setItem('anima-commons-token',token);sessionStorage.removeItem('anima-commons-entry');$('recovery-key').value='';}
 catch(error){if(intent!==sessionIntent)return;connection.token=previous;$('entry-status').textContent=error.message;}
};
$('recover-action').onclick=async()=>{try{const result=await connection.recover();if(result){$('pending-action').hidden=true;notice('Your original action is confirmed.');}}catch(error){notice(error.message);}};
$('connection-status').onclick=()=>connection.pending?$('recover-action').click():connect();
$('walk-project').onclick=()=>{const p=state.projects.find(p=>!p.complete)||state.projects.at(-1);travel(p,p.name);};
$('gather-near').onclick=()=>{const n=state?.nodes.filter(n=>n.remaining&&distance(n,state.you)<=3).sort((a,b)=>distance(a,state.you)-distance(b,state.you))[0];if(n)act('gather',{nodeId:n.id});};
$('center-view').onclick=()=>{view.overview=false;view.yaw=.12;view.pitch=.59;view.distance=23;};
$('atlas-view').onclick=()=>{view.overview=!view.overview;};
$('toggle-dock').onclick=()=>collapseDock(!document.querySelector('.commons-dock').classList.contains('collapsed'));
for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>{tab=b.dataset.tab;for(const el of document.querySelectorAll('[data-tab]'))el.setAttribute('aria-pressed',String(el===b));journey=null;keys={};touch=[0,0];renderDock(true);};
for(const button of document.querySelectorAll('[data-direction]')) {
  const direction={up:[0,-1],left:[-1,0],down:[0,1],right:[1,0]}[button.dataset.direction];
  button.onpointerdown=e=>{e.preventDefault();touch=direction;journey=null;button.setPointerCapture(e.pointerId);};
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>touch=[0,0]);
  button.onclick=e=>{if(e.detail===0){const p=state.you;travel({x:p.x+direction[0]*1.2,z:p.z+direction[1]*1.2},'your chosen step');}};
}
window.addEventListener('keydown',e=>{
  if(!active||e.target.matches('input,textarea,select')||e.ctrlKey||e.metaKey||e.altKey)return;
  const key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){e.preventDefault();keys[key]=true;journey=null;}
  if(key==='e'&&!e.repeat)$('gather-near').click();if(key==='z')$('center-view').click();if(key==='escape'){journey=null;keys={};touch=[0,0];collapseDock(true);}
});
window.addEventListener('keyup',e=>delete keys[e.key.toLowerCase()]);
function releaseMovement(){keys={};touch=[0,0];journey=null;}
window.addEventListener('blur',releaseMovement);document.addEventListener('visibilitychange',releaseMovement);
const pointers=new Map();let drag=null,lastTap=0,pinch=null;
const canvas=view.canvas;
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};if(pointers.size===2){const[a,b]=[...pointers.values()];pinch={gap:Math.hypot(a.x-b.x,a.y-b.y),distance:view.distance};}});
canvas.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2&&pinch){const[a,b]=[...pointers.values()];view.distance=Math.max(5,Math.min(85,pinch.distance*pinch.gap/Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))));}
  else if(drag){view.yaw-=(e.clientX-drag.x)*.006;view.pitch=Math.max(.25,Math.min(1.3,view.pitch+(e.clientY-drag.y)*.004));drag.x=e.clientX;drag.y=e.clientY;}
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{if(event==='pointerup'&&drag&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<6&&pointers.size===1){const now=performance.now();if(now-lastTap<320){view.distance=view.distance<9?25:Math.max(5,view.distance*.65);lastTap=0;}else lastTap=now;}pointers.delete(e.pointerId);drag=null;pinch=null;});
canvas.addEventListener('wheel',e=>{e.preventDefault();view.distance=Math.max(5,Math.min(85,view.distance*Math.exp(e.deltaY*.001)));},{passive:false});
const labels=new Map();
function labelFrame() {
  const entries=state?[...state.nodes.map(n=>({...n,label:n.name})),...state.projects.map(p=>({...p,label:p.name})),...state.players.filter(p=>p.id!==state.you.id&&p.online).map(p=>({...p,label:p.name,player:true}))]:[];
  for(const e of entries){let el=labels.get(e.id);if(!el){el=document.createElement('span');el.className='world-label'+(e.player?' player':'');$('commons-labels').append(el);labels.set(e.id,el);}el.textContent=e.label;const p=view.project(e.x,e.player?2.5:2,e.z);el.hidden=!p.visible||!view.overview&&distance(e,state.you)>26;el.style.left=p.x+'px';el.style.top=p.y+'px';}
  for(const[id,el]of labels)if(!entries.some(e=>e.id===id)){el.remove();labels.delete(id);}
}
function frame(ms) {
  const t=ms/1000,dt=Math.min(.1,(ms-lastFrame)/1000||.016);lastFrame=ms;
  if(!document.hidden){view.render(state,t,dt,journey);labelFrame();}
  if(active&&!document.hidden&&!polling&&ms-lastPoll>750){polling=true;lastPoll=ms;connection.refresh().catch(error=>{disconnected=true;setStatus(connection.pending?'uncertain':'offline');if(error.status===401){active=false;$('commons-entry').hidden=false;$('commons-play').hidden=true;$('entry-status').textContent='Session expired. Restore your player key to return.';}}).finally(()=>polling=false);}
  requestAnimationFrame(frame);
}
if(innerWidth<780)collapseDock(true);
setInterval(movementStep,100);requestAnimationFrame(frame);connect();
