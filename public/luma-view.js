import {ITEMS} from './shared-rules.js';
import {ALPHABET, LETTERS, DICTIONARY, FEATURES, RATIOS} from './luma/data.js';
import {parse, toNative, toLatin, phraseCode, wordCode, roleWord, inspectWord} from './luma/language.js';
import {projectLetter, drawGlyph} from './luma/geometry.js';
import {paintBlueprint} from './canvas-view.js';

const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MODES=[['i','Imagine','A possibility'],['u','Intend','Remember a plan'],['pe','Undertake','Choose an act'],['e','Observe','An inference'],['a','Experience','Your own experience']];
const PRESETS=[
 ['music','Music','i mi me peli ta musa.'],['sound','Sound','i mi me peli ta sona.'],
 ['creature','Living being','i mi me peli melu ta wuna.'],['joining','Joining · a span','i mi me bani ta yuna.'],
 ['shelter','Shelter','i mi me bani ta tula.'],['light','Light','i mi me peli ta liha.'],
 ['beginning','Beginning','i mi me peli ta tapa.'],['care','Care for a creation','pe mi me meli ta pela.'],
 ['perform','Play the music','pe mi me musi ta musa.'],['connect','Join the parts','pe mi me yuni ta pesa.'],
 ['invite','Welcome a household','pe mi me temi ta mena.'],['give','Offer food to households','pe mi me doni ta #e bama li "households".'],
 ['repair','Repair a creation','pe mi me remi melu ta pela.'],['observe','Observe the creation','e mi me wedi ta pela.'],
 ['awe','Awe at the sky','a mi me honi ta loma he.']
];
const SHARED_PRESETS=[['project','Our public work','i mi me bani ta bana.'],['gift','A gift','i mi me doni ta dona li ti.'],['awe','My experience','a mi me honi ta loma he.']];

/** One persistent composer for either the local world or its shared commons. */
export function mountLumaAtelier(host, config) {
 const shared=!!config.shared, presets=shared?SHARED_PRESETS:PRESETS;
 let disposed=false, native=false, selectedLetter='a', currentWord='musa', page='compose', audio=null, voices=[], preview=null, selectedIntention=null;
 const $=id=>host.querySelector('#luma-'+id);
 const state=()=>config.state();
 host.classList.add('luma-atelier');
 host.innerHTML=`<div class="luma-intro"><span class="luma-eyebrow">LUMA ORIGIN · A LANGUAGE OF MAKING</span><p>A word takes form. An intention waits for your action.</p></div>
  <nav class="luma-tabs" aria-label="Language workshop">${[['compose','Compose'],['letters','20 letters'],['lexicon','900 words'],['memory','Memory']].map(([id,label])=>`<button type="button" data-luma-tab="${id}" aria-pressed="${id==='compose'}">${label}</button>`).join('')}</nav>
  <div class="luma-layout"><div class="luma-work">
   <section data-luma-page="compose">
    <label for="luma-preset">Begin with a phrase</label><select id="luma-preset">${presets.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select>
    <div class="luma-modes" aria-label="What your sentence does">${MODES.map(([id,label,hint])=>`<button type="button" data-luma-mode="${id}" aria-pressed="false" title="${hint}"><b>${id}</b>${label}</button>`).join('')}</div>
    <div class="luma-writing-label"><label for="luma-text">Your sentence</label><button id="luma-script" type="button">Write in native script</button></div>
    <textarea id="luma-text" maxlength="${shared?512:384}" spellcheck="false" rows="3" aria-describedby="luma-meaning luma-feedback"></textarea>
    <p id="luma-other-script" class="luma-native" aria-label="The same sentence in the other script"></p>
    <p id="luma-meaning" class="luma-meaning"></p>
    <div class="luma-dimension"><label for="luma-dimension">Retained coordinates <output id="luma-dimension-value">16</output> / 16</label><input id="luma-dimension" type="range" min="1" max="16" step="1" value="16"><small>The letters’ original feature curves shape the drawing.</small></div>
    ${shared?'<div id="luma-shared-bindings"><div id="luma-project-field"><label for="luma-project">Public work</label><select id="luma-project"></select></div><div id="luma-recipient-field"><label for="luma-recipient">Recipient of “you”</label><select id="luma-recipient"></select></div><div id="luma-material-fields" class="luma-two"><div><label for="luma-item">Material</label><select id="luma-item">'+ITEMS.map(k=>`<option>${k}</option>`).join('')+'</select></div><div><label for="luma-quantity">Whole quantity</label><input id="luma-quantity" type="number" min="1" max="100" value="1"></div></div></div>':'<div class="luma-two"><div><label for="luma-focus">This creation</label><select id="luma-focus"></select></div><div><label for="luma-target">Join to</label><select id="luma-target"></select></div></div>'}
    <div class="luma-actions"><button id="luma-enact" class="luma-primary" type="button">Read the possibility</button><button id="luma-listen" type="button">Hear the letters</button><button id="luma-stop" type="button" aria-label="Stop the letter music">Stop</button></div>
    <p id="luma-feedback" role="status" aria-live="polite"></p>
    <details><summary>How the words become an act</summary><p><b>i</b> imagines. <b>u</b> keeps an intention. <b>pe</b> undertakes an action using the goods you actually hold. <b>e</b> offers an inference; <b>a</b> speaks of your own experience. Another person keeps their own choices.</p><p>The original twenty letters supply the shapes and two notes per letter. Their values do not increase a creation’s power.</p></details>
   </section>
   <section data-luma-page="letters" hidden><h3>Twenty sounds, twenty signs</h3><p>Choose a letter to see its original features and hear its two-note code.</p><div class="luma-letter-grid">${LETTERS.map(l=>`<button type="button" data-luma-letter="${l.letter}" aria-label="${l.letter}, ${escapeHTML(l.ipa)}"><span class="luma-native">${toNative(l.letter)}</span><b>${l.letter}</b></button>`).join('')}</div><div id="luma-letter-detail"></div><button id="luma-letter-listen" type="button">Hear this letter’s code</button></section>
   <section data-luma-page="lexicon" hidden><h3>The existing dictionary</h3><label for="luma-search">Find a word, meaning, or native spelling</label><input id="luma-search" type="search" placeholder="care · mela"><p class="luma-small">180 roots, five grammatical forms each. Choose a form to compose a thought about its noun.</p><p id="luma-word-count"></p><div id="luma-words" class="luma-word-list"></div></section>
   <section data-luma-page="memory" hidden><h3>${shared?'Words in the commons':'Return to your intention'}</h3><div id="luma-intentions"></div><div id="luma-gifts"></div><div id="luma-receipts"></div></section>
  </div><aside class="luma-form"><canvas id="luma-form" width="640" height="480" aria-label="A projection of the chosen word’s feature curves"></canvas><div class="luma-form-caption"><span id="luma-form-native" class="luma-native"></span><h3 id="luma-form-word"></h3><p id="luma-form-info"></p></div><div id="luma-code" class="luma-small"></div><a class="luma-source" href="./luma/origin.html" target="_blank" rel="noopener">Explore the original Luma artwork ↗</a></aside></div>`;
 function feedback(text,error=false){if(disposed)return;$('feedback').textContent=text;$('feedback').classList.toggle('luma-error',error);}
 function context(){const c={dimension:Number($('dimension').value)};if(!shared){if($('focus').value)c.focusId=$('focus').value;if($('target').value)c.targetId=$('target').value;if(selectedIntention)c.intentionId=selectedIntention;}return c;}
 function bindings(p){
  if(p.mode==='a'&&p.verb==='honi'&&roleWord(p,'ta')==='loma')return {kind:'experience'};
  const quantity=Number($('quantity').value), item=$('item').value;
  if(['doni','mari'].includes(p.verb))return {kind:'gift',recipientId:$('recipient').value,item,quantity};
  if(p.verb==='bani')return {kind:'project',projectId:$('project').value,item,quantity};
  throw Error('Choose a public-work, gift, or own-experience phrase for the commons.');
 }
 function updateBindingVisibility(p){if(!shared)return;const gift=['doni','mari'].includes(p?.verb),project=p?.verb==='bani';$('project-field').hidden=!project;$('recipient-field').hidden=!gift;$('material-fields').hidden=!(gift||project);$('dimension').closest('.luma-dimension').hidden=true;}
 function setText(value){if(disposed)return;$('text').value=native?toNative(value):toLatin(value);read();}
 function read(){
  if(disposed)return;preview=null;
  try{
   const text=$('text').value, p=parse(text), latin=toLatin(text), code=phraseCode(text), word=roleWord(p,'ta');
   $('text').classList.toggle('luma-native',native);$('other-script').classList.toggle('luma-native',!native);$('other-script').textContent=native?latin:toNative(text);
   for(const b of host.querySelectorAll('[data-luma-mode]'))b.setAttribute('aria-pressed',String(b.dataset.lumaMode===p.mode));
   const verb=inspectWord(p.verb)?.gloss||p.verb, theme=word?(inspectWord(word)?.gloss||word):'';
   $('meaning').textContent=`${({i:'I imagine',u:'I intend',pe:'I undertake',e:'I infer',a:'I experience'})[p.mode]||'I'} · ${verb}${theme?' · '+theme:''}${p.remainder?' · some experience remains unsaid':''}`;
   updateBindingVisibility(p);
   $('enact').textContent=({i:'Read the possibility',u:shared?'Record this intention':'Keep this intention',pe:shared?'Undertake this act':'Undertake this act',e:'Read the observation',a:shared?'Record my experience':'Read my experience'})[p.mode]||'Read the sentence';
   if(!shared)preview=config.preview(text,context());else bindings(p);
   if(word&&[...word].every(c=>ALPHABET.includes(c)))currentWord=word;
   $('code').textContent=`${code.letterCount} letters · ${code.notes.length} notes · G ${code.G}. Positive letter sums and musical codes retain their separate meanings.`;
   draw();
   if(preview){const cost=Object.entries(preview.cost||{}).filter(([,n])=>n).map(([k,n])=>`${n} ${k}`).join(' · ');const o=preview.observation;feedback([preview.message,cost?'Materials: '+cost:'',o?`Health ${Math.ceil(o.body.hp)} / ${o.body.maxHp} · Breath ${Math.floor(o.body.breath)} · ${o.creations} creations.\nPack: ${Object.entries(o.pack).map(([k,n])=>n+' '+k).join(' · ')}`:''].filter(Boolean).join(' '));}
   else feedback(p.mode==='pe'?'The realm will check this exact act and its material cost.':'Your sentence is ready to inspect.');
   $('enact').disabled=false;
   return p;
  }catch(error){$('enact').disabled=true;feedback(error.message,true);draw();return null;}
 }
 function draw(){
  if(disposed)return;const canvas=$('form'),ctx=canvas.getContext('2d');if(!ctx)return;
  const word=page==='letters'?selectedLetter:currentWord,d=Number($('dimension').value),w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#102c31';ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(w/2,h/2);
  for(let i=0;i<60;i++){const a=i*Math.PI/30,r=i%5?175:167;ctx.strokeStyle=i%5?'#acb8a733':'#ddc39488';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*181,Math.sin(a)*181);ctx.stroke();}
  for(let i=0;i<20;i++){const a=i*Math.PI/10-Math.PI/2;drawGlyph(ctx,ALPHABET[i],Math.cos(a)*205,Math.sin(a)*205,18);}
  ctx.restore();
  if(preview?.blueprint&&page==='compose'){
   const b=preview.blueprint,extent=Math.max(4,...b.parts.map(p=>Math.max(Math.abs(p.x)+p.w,Math.abs(p.z)+p.d,p.y+p.h))),scale=130/extent;
   paintBlueprint(ctx,b,(x,y,z)=>({x:w/2+x*scale,y:h/2+35+z*scale*.6-y*scale}),0,0,.25);
  }else for(let k=0;k<word.length;k++){
   const points=projectLetter(word[k],d,k),angle=k*Math.PI*2/word.length;
   ctx.strokeStyle=k%2?'#a1d8cc':'#e2c18e';ctx.lineWidth=1.4;ctx.beginPath();
   points.forEach(([x,y,z],n)=>{const px=w/2+(x*Math.cos(angle)-y*Math.sin(angle))*110,py=h/2+(x*Math.sin(angle)+y*Math.cos(angle))*110+z*26;n?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();
  }
  $('form-native').textContent=toNative(word);$('form-word').textContent=word;
  $('form-info').textContent=(inspectWord(word)?.gloss||LETTERS.find(l=>l.letter===word)?.description||'')+` · ${d} retained coordinates`;
 }
 function letterDetail(){const l=LETTERS.find(x=>x.letter===selectedLetter),code=wordCode(selectedLetter);$('letter-detail').innerHTML=`<h3>${l.letter} <span>${escapeHTML(l.ipa)}</span></h3><p>${escapeHTML(l.description)}</p><p>q ${l.ordinal} · G ${l.ordinal+1} · ratios ${code.ratioNames.join(' → ')}</p><div class="luma-features">${l.featureVector.map((n,i)=>`<span class="${n?'present':''}">${escapeHTML(typeof FEATURES[i]==='string'?FEATURES[i]:FEATURES[i]?.name||i)} ${n}</span>`).join('')}</div>`;draw();}
 function searchWords(){const q=$('search').value.replace(/[\uE000-\uE013]/g,c=>ALPHABET[c.codePointAt(0)-0xE000]).toLowerCase().trim(),rows=DICTIONARY.filter(e=>`${e.word} ${e.gloss} ${e.domain} ${e.class}`.toLowerCase().includes(q));$('word-count').textContent=`${rows.length} of 900 forms`;$('words').innerHTML=rows.map(e=>`<button type="button" data-luma-word="${e.word}"><span class="luma-native">${toNative(e.word)}</span><span><b>${e.word}</b><small>${escapeHTML(e.gloss)} · ${e.class}</small></span></button>`).join('');for(const b of $('words').querySelectorAll('[data-luma-word]'))b.onclick=()=>{const e=DICTIONARY.find(e=>e.word===b.dataset.lumaWord);setPage('compose');setText('i mi me gimi ta '+e.root+'a.');};}
 function stop(){for(const v of voices){try{v.stop();v.disconnect();}catch{}}voices=[];}
 async function listen(text){try{stop();const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error('Audio is unavailable in this browser.');audio??=new AC();await audio.resume();if(disposed)return;const code=typeof text==='string'&&text.length===1&&ALPHABET.includes(text)?wordCode(text):phraseCode(text);for(const [i,n] of code.notes.entries()){const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.16;o.type='sine';o.frequency.value=n.frequency;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.035,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.145);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.155);voices.push(o);}feedback(`${code.notes.length} notes at the original 220 Hz reference. The code is musical; it is not a spoken pronunciation.`);}catch(e){feedback(e.message,true);}}
 function refreshBindings(){
  const s=state();function options(el,rows){const value=el.value;el.innerHTML=rows.map(([id,name])=>`<option value="${escapeHTML(id)}">${escapeHTML(name)}</option>`).join('');if(rows.some(([id])=>String(id)===value))el.value=value;}
  if(shared){options($('project'),(s?.projects||[]).map(p=>[p.id,p.name]));options($('recipient'),(s?.players||[]).filter(p=>p.id!==s?.you?.id).map(p=>[p.id,p.name]));}
  else{const rows=[['','Choose a creation'],...(s?.creation?.instances||[]).map(e=>[e.id,`${e.blueprint.name} · ${e.blueprint.kind} · ${e.id}`])];options($('focus'),rows);options($('target'),rows);}
 }
 function refreshMemory(){
  if(disposed)return;const s=state(),intentions=config.intentions?.()||s?.luma?.intentions||[],receipts=config.events?.()||s?.luma?.utterances||s?.luma?.receipts||[];
  $('intentions').innerHTML=shared?'':intentions.map(e=>`<article class="luma-memory"><span>${e.fulfilled?'Undertaking accepted':'Intention remains open'}</span><p class="luma-native">${escapeHTML(toNative(e.source))}</p><p>${escapeHTML(toLatin(e.source))}</p>${!e.fulfilled?`<button type="button" data-luma-return="${escapeHTML(e.id)}">Return to this intention</button>`:''}<button type="button" data-luma-release="${escapeHTML(e.id)}">Release it</button></article>`).join('')||'<p>Your saved intentions will wait here.</p>';
  $('receipts').innerHTML=[...receipts].reverse().slice(0,32).map(e=>`<article class="luma-memory"><span>${escapeHTML(e.playerName||e.mode||'')} · ${escapeHTML(e.status||e.operation||'')}</span><p class="luma-native">${escapeHTML(e.native||toNative(e.source||e.text||e.latin||''))}</p><p>${escapeHTML(e.latin||toLatin(e.source||e.text||''))}</p><small>${escapeHTML(e.summary||'')}</small></article>`).join('')||'<p>Accepted words and actions will appear here.</p>';
  for(const b of $('intentions').querySelectorAll('[data-luma-return]'))b.onclick=()=>{const e=intentions.find(e=>String(e.id)===b.dataset.lumaReturn);if(!e)return;selectedIntention=e.id;for(const [key,value] of Object.entries(e.context||{})){const name={focusId:'focus',targetId:'target',dimension:'dimension'}[key];if(name&&$(name))$(name).value=value;}$('dimension-value').textContent=$('dimension').value;setPage('compose');setText(toLatin(e.source).replace(/^u\s+/,'pe '));};
  for(const b of $('intentions').querySelectorAll('[data-luma-release]'))b.onclick=async()=>{try{await config.release(Number(b.dataset.lumaRelease));refreshMemory();}catch(e){feedback(e.message,true);}};
  if(shared){const gifts=(s?.gifts||[]).filter(g=>g.status==='open');$('gifts').innerHTML=gifts.map(g=>`<article class="luma-memory"><span>A gift awaiting a choice</span><p>${g.give.quantity} ${escapeHTML(g.give.item)} · ${escapeHTML(g.senderName||g.senderId)} → ${escapeHTML(g.recipientName||g.recipientId)}</p>${g.recipientId===s.you.id?`<button type="button" data-luma-gift="accept" data-id="${escapeHTML(g.id)}">Welcome this gift</button><button type="button" data-luma-gift="decline" data-id="${escapeHTML(g.id)}">Decline</button>`:`<button type="button" data-luma-gift="cancel" data-id="${escapeHTML(g.id)}">Withdraw the gift</button>`}</article>`).join('');for(const b of $('gifts').querySelectorAll('[data-luma-gift]'))b.onclick=async()=>{try{await config.gift(b.dataset.lumaGift,b.dataset.id);refreshMemory();}catch(e){feedback(e.message,true);}};}
 }
 function setPage(next){page=next;for(const s of host.querySelectorAll('[data-luma-page]'))s.hidden=s.dataset.lumaPage!==next;for(const b of host.querySelectorAll('[data-luma-tab]'))b.setAttribute('aria-pressed',String(b.dataset.lumaTab===next));if(next==='lexicon')searchWords();if(next==='letters')letterDetail();if(next==='memory')refreshMemory();draw();}
 for(const b of host.querySelectorAll('[data-luma-tab]'))b.onclick=()=>setPage(b.dataset.lumaTab);
 for(const b of host.querySelectorAll('[data-luma-mode]'))b.onclick=()=>setText(b.dataset.lumaMode+' '+toLatin($('text').value).replace(/^(?:pe|i|u|e|a)\s+/,''));
 for(const b of host.querySelectorAll('[data-luma-letter]'))b.onclick=()=>{selectedLetter=b.dataset.lumaLetter;letterDetail();};
 $('preset').onchange=()=>{selectedIntention=null;setText(presets.find(p=>p[0]===$('preset').value)[2]);};
 $('script').onclick=()=>{const latin=toLatin($('text').value);native=!native;$('script').textContent=native?'Write in Latin letters':'Write in native script';setText(latin);};
 $('text').oninput=read;$('dimension').oninput=()=>{$('dimension-value').textContent=$('dimension').value;read();};
 for(const id of shared?['project','recipient','item','quantity']:['focus','target'])$(id).onchange=read;
 $('search').oninput=searchWords;$('listen').onclick=()=>listen($('text').value);$('letter-listen').onclick=()=>listen(selectedLetter);$('stop').onclick=stop;
 $('enact').onclick=async()=>{
  const p=read();if(!p)return;const text=$('text').value,c=context();$('enact').disabled=true;
  try{
   if(!shared&&p.mode==='pe'&&preview?.blueprint&&['peli','bani'].includes(p.verb)){config.place({text,context:c,blueprint:preview.blueprint});return;}
   if(!shared&&['i','e','a'].includes(p.mode)){return;}
   const result=await config.enact(text,shared?bindings(p):c);if(!result)throw Error('The act has not been confirmed.');if(disposed)return;
   refreshBindings();const id=result.result?.instanceId;if(!shared&&id&&[...$('focus').options].some(o=>o.value===id))$('focus').value=id;
   refreshMemory();const blocker=result.blocker;feedback(result.summary||blocker?.message||({imagined:'Possibility recorded. No materials moved.',intended:'Intention recorded. No materials moved.',experienced:'Your experience is recorded.',enacted:'The act is accepted.'})[result.status]||'Your words are remembered.',!!blocker);
   config.after?.(result,p);
  }catch(e){feedback(e.message,true);}finally{if(!disposed)$('enact').disabled=false;}
 };
 refreshBindings();setText(config.initial||presets[0][2]);
 return {setText,refresh(){refreshBindings();refreshMemory();},refreshMemory,dispose(){if(disposed)return;disposed=true;stop();audio?.close?.();host.classList.remove('luma-atelier');}};
}
