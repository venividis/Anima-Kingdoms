import {mountWholeSky} from './sky-view.js';
import {stellarField,skyGuides,starColor} from './sky-observer.js';
import * as C from './cosmos.js';
import {ALPHABET,LETTERS} from './luma/data.js';
import {drawGlyph,projectLetter} from './luma/geometry.js';
import {toNative} from './luma/language.js';
import {Geometry,transform} from './engine.js';

const TAU=Math.PI*2,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const costText=r=>Object.entries(r.cost).map(([k,n])=>`${n} ${k}`).join(' · ');
const native=word=>`<span class="luma-native">${esc(toNative(word))}</span>`;
const phraseFor=r=>`pe mi me peli ta ${JSON.stringify(r.name)} ki ${r.kind==='metal'?'fama':'wela'}.`;

/** Authored Luma asterisms are visibly separate from retained named catalogue
 * stars. The horizon panorama is a cylindrical chart, not a camera plate. */
export class CosmicSky{
  constructor(canvas){this.canvas=canvas;this.ctx=canvas?.getContext('2d');this.last=-Infinity;this.lastYaw=null;}
  draw(ms,yaw=0,reduced=false){
    if(!this.ctx||Math.abs(ms-this.last)<33&&yaw===this.lastYaw)return;this.last=ms;this.lastYaw=yaw;
    const c=this.ctx,w=innerWidth,h=innerHeight,dpr=Math.min(globalThis.devicePixelRatio||1,1.5);
    if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);}
    c.setTransform(dpr,0,0,dpr,0,0);const sky=C.skyAt(ms),t=reduced?0:ms/1000,night=1-sky.daylight;
    c.clearRect(0,0,w,h);const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,sky.daylight>.5?'#102c50':'#030718');g.addColorStop(.53,sky.daylight>.5?'#476d85':'#17243f');g.addColorStop(1,'#263e45');c.fillStyle=g;c.fillRect(0,0,w,h);
    c.globalCompositeOperation='screen';
    for(let i=0;i<4;i++){const x=w*(.2+i*.24),y=h*(.08+i*.025),r=w*.36;const nebula=c.createRadialGradient(x,y,0,x,y,r);nebula.addColorStop(0,['#25245826','#1d46772c','#40286525','#16577820'][i]);nebula.addColorStop(1,'#06112900');c.fillStyle=nebula;c.fillRect(0,0,w,h*.72);}
    for(const f of stellarField(sky)){
      const star=f.star;if(f.altitude<0||star.mag>(reduced?5:5.8))continue;
      const x=((f.azimuth/360-yaw/TAU+1)%1)*w,y=h*(.52-f.altitude/90*.45);
      c.globalAlpha=Math.max(.08,1-star.mag*.11)*(.03+.97*night);c.fillStyle=starColor(star.bv);c.beginPath();c.arc(x,y,Math.max(.4,2-star.mag*.23),0,TAU);c.fill();
    }
    // Twenty authored letter markers follow the ecliptic at equal sectors.
    const ecliptic=skyGuides(sky)[0].points;
    for(let i=0;i<20;i++){
      const p=ecliptic[i*9],active=sky.word.includes(ALPHABET[i]);if(p.altitude<0)continue;
      const x=((p.azimuth/360-yaw/TAU+1)%1)*w,y=h*(.52-p.altitude/90*.45);
      c.globalAlpha=(active?.6:.18)*(.2+.8*night);c.strokeStyle=active?'#d9cba5':'#7796b7';c.fillStyle=c.strokeStyle;
      drawGlyph(c,ALPHABET[i],x-12,y-12,active?26:20);
    }
    c.shadowBlur=0;c.globalAlpha=1;
    for(const star of sky.stars.filter(s=>s.altitude>0)){
      const x=((star.azimuth/360-yaw/TAU+1)%1)*w,y=h*(.5-star.altitude/90*.43);c.fillStyle='#e5f6ff';c.globalAlpha=.35+.65*night;c.shadowColor='#6dd5ff';c.shadowBlur=14;c.shadowBlur=0;c.font='12px system-ui';c.fillText(star.name,x+9,y-7);
    }
    for(const body of sky.bodies.filter(b=>b.altitude>0)){
      const x=((body.azimuth/360-yaw/TAU+1)%1)*w,y=h*(.52-body.altitude/90*.45);c.fillStyle=body.color;c.globalAlpha=body.name==='Sun'?1:.8;c.shadowColor=body.color;c.shadowBlur=body.name==='Sun'?35:20;c.beginPath();c.arc(x,y,body.name==='Sun'?11:body.name==='Moon'?8:2.7,0,TAU);c.fill();
    }
    c.shadowBlur=0;c.globalAlpha=1;c.globalCompositeOperation='source-over';
  }
}

export class CosmicMeshes{
  constructor(r){this.r=r;
    const forge=new Geometry(),stone=[.17,.21,.30],metal=[.45,.37,.29],gold=[.9,.65,.34];
    forge.cone([0,.02,0],[0,.18,0],2.3,2.3,stone,12);forge.ring(0,.21,0,2.05,.035,gold,48);
    forge.cone([0,.18,0],[0,.95,0],.85,.65,stone,8);forge.cone([0,.96,0],[0,1.22,0],.76,.87,metal,12);
    forge.cone([0,1.23,0],[0,1.24,0],.70,.70,[1,.28,.09],24);
    for(let i=0;i<4;i++){const a=i*TAU/4+.8,x=Math.cos(a)*1.9,z=Math.sin(a)*1.9;forge.cone([x,.2,z],[x,3.6,z],.12,.065,metal,6);forge.cone([x,3.6,z],[0,4.4,0],.07,.04,gold,6);}
    forge.ring(0,3.6,0,1.9,.07,gold,36);forge.box(1.45,.9,0,.65,.3,1.2,stone);forge.box(1.45,1.15,0,.9,.2,1.5,metal);this.forge=r.mesh(forge);
    const well=new Geometry();well.cone([0,.02,0],[0,.18,0],1.9,1.9,stone,12);well.ring(0,.2,0,1.65,.035,[.35,.7,.85],40);
    for(let i=0;i<3;i++){const a=i*TAU/3,x=Math.cos(a)*.9,z=Math.sin(a)*.9;well.cone([x,.2,z],[x*.55,2.4,z*.55],.06,.04,gold,6);}
    well.sphere(0,1.45,0,.65,.68,.65,[.2,.57,.62],16,10);well.cone([0,1.8,0],[0,2.8,0],.24,.16,[.58,.78,.84],12);well.cone([0,2.8,0],[1,2.4,0],.09,.08,gold,8);well.cone([1,2.4,0],[1,1.1,0],.07,.07,gold,8);well.sphere(1,.8,0,.32,.4,.32,[.4,.7,.78],12,8);this.well=r.mesh(well);
    const bell=new Geometry();for(const x of [-1.1,1.1])bell.cone([x,0,0],[x,3.3,0],.14,.09,stone,8);bell.cone([-1.1,3.3,0],[1.1,3.3,0],.10,.10,gold,8);bell.cone([0,1.6,0],[0,2.7,0],.78,.30,gold,20);bell.ring(0,1.6,0,.77,.07,gold,40);bell.sphere(0,1.5,0,.1,.18,.1,stone,8,6);this.bell=r.mesh(bell);
    this.orb=r.mesh(new Geometry().sphere(0,0,0,.17,.17,.17,[.75,.9,1],10,6));this.ring=r.mesh(new Geometry().ring(0,.02,0,1,.02,[.5,.83,1],48));
  }
  draw(cosmos,now){const r=this.r,beat=C.beatAt(now),pulse=1-beat.phase,town=cosmos?.town;
    r.draw(this.forge,transform(C.WORKSITES.forge.x,0,C.WORKSITES.forge.z));r.draw(this.well,transform(C.WORKSITES.alembic.x,0,C.WORKSITES.alembic.z));
    for(const [id,p] of Object.entries(C.WORKSITES).filter(([id])=>id!=='town')){
      const active=cosmos?.workshop?.job&&C.RECIPES[cosmos.workshop.job.recipe].station===id;
      r.draw(this.orb,transform(p.x,1.5,p.z,active?2+pulse:1,active?2+pulse:1,active?2+pulse:1),{glow:active?1.4:.45,tint:id==='forge'?[1,.5,.2]:[.5,.8,1]});
    }
    if(town?.bell){r.draw(this.bell,transform(2,0,25));r.draw(this.ring,transform(2,.08,25,1+beat.phase*3,1,1+beat.phase*3),{glow:.7,alpha:pulse*.6});}
    if(town?.garden)for(let i=0;i<6;i++)r.draw(this.orb,transform(-2+Math.sin(i)*.9,.4+pulse*.12,25+Math.cos(i)*.9,.6,.8,.6),{tint:[.45,1,.7],glow:.7});
  }
}

export function mountCosmos(root,api){
  let observatory=null;
  let recipeId='iron',mode='steady',cooling='water',dimension=16,signature='',disposed=false,busy=false,beatSignature='';
  const $=s=>root.querySelector(s),state=()=>api.state(),now=()=>api.now();
  const message=text=>{const el=$('[data-cosmos-message]');if(el)el.textContent=text;};
  async function act(op,payload){if(busy)return;busy=true;try{const result=await api.action(op,payload);if(!result)throw Error('The action did not complete. Check the realm connection.');refresh(true);message(result.product?`${C.RECIPES[result.product.recipe].name} finished · quality ${result.product.quality}.`:result.message||'Your work is recorded.');}catch(e){message(e.message);}finally{busy=false;}}
  function refresh(force=false){
    if(disposed)return;const s=state(),w=s.workshop,signatureNow=JSON.stringify([w,s.town,s.pack]);
    if(!force&&signatureNow===signature)return;signature=signatureNow;
    const preservedSky=$('[data-whole-sky]');preservedSky?.remove();
    const oldDraft=$('[data-cosmos-phrase]')?.value,focused=root.contains(document.activeElement)?[...document.activeElement.attributes].find(a=>a.name.startsWith('data-'))?.name:null;
    const recipe=C.RECIPES[recipeId],job=w.job,working=job&&C.RECIPES[job.recipe];
    root.innerHTML=`<div class="cosmos-workshop"><div class="cosmos-heading"><span class="eyebrow">THE CELESTIAL ATELIER</span><h2>As above, a world below.</h2><p>The sky has a voice. Give it a place in your hands.</p></div>
      <nav class="cosmos-nav" aria-label="Celestial workspace"><button data-cosmos-jump="[data-whole-sky]">Observe the sky</button><button data-cosmos-jump=".cosmos-columns">Craft at the Atelier</button><button data-cosmos-jump=".sky-encounter">My encounters</button></nav><div data-whole-sky></div><div class="cosmos-rhythm-strip"><div class="cosmos-sky-caption"><strong data-sky-word></strong><span data-sky-phase></span></div><button data-sound class="cosmos-sound" aria-pressed="false">Listen to the sky</button></div>
      <div class="cosmos-alignment" data-sky-alignment></div>
      <div class="cosmos-world-actions"><button data-walk="forge">Walk to Starforge</button><button data-walk="alembic">Walk to Moonwell</button><button data-walk="town">Walk to town hearth</button></div>
      <div class="cosmos-columns"><section><h3>${job?'Your work is alive':'Choose what becomes real'}</h3>
      ${job?`<div class="cosmos-job"><span class="eyebrow">${esc(working.name)}</span><h4 data-work-stage></h4><p data-work-copy></p><progress data-work-progress max="1" value="0" aria-label="Current process progress"></progress><div class="cosmos-readings"><span><b data-temperature></b><small>${working.kind==='metal'?'Furnace model':'Bath model'}</small></span><span><b data-work-score></b><small>work quality</small></span><span>${native(working.word)}<small>${esc(working.word)}</small></span></div><div class="cosmos-beats" data-beats></div>${job.mode==='rhythm'?'<button data-strike class="cosmos-primary full">Strike with the light</button>':'<p class="cosmos-small">Steady work completes without timed input. Watch the light or listen as it changes.</p>'}<label>Cooling method<select data-cooling><option value="water">Water · rapid quench</option><option value="air">Air · slow anneal</option></select></label><button data-advance class="cosmos-primary full" disabled>Continue when ready</button><button data-reclaim-job class="cosmos-link">Reclaim this work</button></div>`:
      `<div class="cosmos-recipes">${Object.entries(C.RECIPES).map(([id,r])=>`<button data-recipe="${id}" aria-pressed="${id===recipeId}">${native(r.word)}<span>${esc(r.name)}<small>${r.kind==='metal'?'METALLURGY':'ALCHEMY'}</small></span></button>`).join('')}</div><p class="cosmos-use">${esc(api.shared?sharedUse(recipeId):recipe.use)}</p><p class="cosmos-cost">${costText(recipe)}</p><label>Your way of working<select data-work-mode><option value="steady">Steady · no timed input</option><option value="rhythm">Rhythm · follow each light and note</option></select></label><label>Say it in Luma<textarea data-cosmos-phrase rows="2" spellcheck="false">${esc(phraseFor(recipe))}</textarea></label><div class="cosmos-native-phrase" data-native-phrase>${native(phraseFor(recipe))}</div><button data-script class="cosmos-link">Use native writing</button><button data-begin class="cosmos-primary full">Begin ${esc(recipe.name)}</button><p class="cosmos-small">${recipe.kind==='metal'?'Fire changes the ore; shaping arranges it; cooling determines its temper.':'Dissolution, circulation, and settling bring your ingredients into a new form.'} Materials come from your pack.</p>`}
      <p data-cosmos-message role="status" aria-live="polite" class="cosmos-message"></p></section><section><h3>What your hands have made</h3><div class="cosmos-products">${w.products.length?w.products.map(p=>`<article><div>${native(C.RECIPES[p.recipe].word)}<span><strong>${esc(C.RECIPES[p.recipe].name)}</strong><small>Quality ${p.quality} · ${p.mode}</small></span></div><p>${esc(api.shared?sharedUse(p.recipe):C.RECIPES[p.recipe].use)}</p><button data-use="${p.id}" class="cosmos-primary">${['alloy','earth'].includes(p.recipe)?'Give this to the town':p.recipe==='iron'?'Temper my tool':'Drink moon dew'}</button><button data-reclaim="${p.id}" class="cosmos-link">Reclaim materials</button></article>`).join(''):'<p class="cosmos-empty">Your first work will appear here, carrying its own rhythm, sky, and quality.</p>'}</div><h3>The town answers</h3><div class="cosmos-town"><p>${s.town.bell?'A singing bell is installed. Its rhythm helps the town work.':'The hearth is waiting for a bell of singing alloy.'}</p><p>${s.town.garden?'Earth tincture nourishes the town’s rhythm of growth.':'Earth tincture can tend the town garden.'}</p></div><details><summary>Luma’s original letter-feature curves</summary><div class="sky-letter-surface"><canvas data-cosmos-chart aria-label="Original Luma articulatory feature projection" role="img"></canvas></div><label>Retained coordinates <output data-dimension-value>${dimension}</output> / 16<input data-dimension type="range" min="1" max="16" value="${dimension}"></label><p class="cosmos-small">Each original Luma letter carries sixteen articulatory features. This curve reveals their projections. The pitches keep the source spelling.</p><p data-sky-date class="cosmos-small"></p><p class="cosmos-small">Recorded sky: ${C.SKY_MODEL.engine}. Town: 38° north, 0° east. Twelve ${api.shared?'server':'active'} minutes make a sky day. Luma asterisms and the effects on crafting are authored game rules. Temperatures are simplified craft models.</p></details></section></div></div>`;
    if(preservedSky)$('[data-whole-sky]').replaceWith(preservedSky);
    else observatory=mountWholeSky($('[data-whole-sky]'),{...api,sky:()=>C.skyAt(now()),recipeName:id=>C.RECIPES[id].name});
    observatory?.refresh();
    if(oldDraft&&!job)$('[data-cosmos-phrase]').value=oldDraft;
    $('[data-work-mode]')?.addEventListener('change',e=>{mode=e.target.value;});if($('[data-work-mode]'))$('[data-work-mode]').value=mode;
    $('[data-cooling]')?.addEventListener('change',e=>{cooling=e.target.value;});if($('[data-cooling]')){$('[data-cooling]').value=job.stage===2?job.cooling:cooling;$('[data-cooling]').disabled=job.stage===2;$('[data-cooling]').parentElement.firstChild.textContent=job.stage===2?'Cooling in progress':'Cooling for the final stage';}
    root.querySelectorAll('[data-recipe]').forEach(b=>b.onclick=()=>{recipeId=b.dataset.recipe;signature='';const area=$('[data-cosmos-phrase]');if(area)area.value=phraseFor(C.RECIPES[recipeId]);refresh(true);});
    root.querySelectorAll('[data-cosmos-jump]').forEach(b=>b.onclick=()=>$ (b.dataset.cosmosJump)?.scrollIntoView({behavior:api.reduced?.()?'instant':'smooth',block:'start'}));
    root.querySelectorAll('[data-walk]').forEach(b=>b.onclick=()=>api.walk(C.WORKSITES[b.dataset.walk]));
    $('[data-begin]')?.addEventListener('click',()=>act('start',{recipe:recipeId,mode,text:$('[data-cosmos-phrase]').value}));
    $('[data-cosmos-phrase]')?.addEventListener('input',()=>{try{$('[data-native-phrase]').innerHTML=native($('[data-cosmos-phrase]').value);}catch{}});
    $('[data-script]')?.addEventListener('click',()=>{try{const el=$('[data-cosmos-phrase]');el.value=toNative(el.value);}catch(e){message(e.message);}});
    $('[data-strike]')?.addEventListener('click',()=>act('strike',{}));
    $('[data-advance]')?.addEventListener('click',()=>act('advance',{cooling}));
    $('[data-reclaim-job]')?.addEventListener('click',()=>act('reclaim',{id:null}));
    root.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>act('use',{id:Number(b.dataset.use)}));
    root.querySelectorAll('[data-reclaim]').forEach(b=>b.onclick=()=>act('reclaim',{id:Number(b.dataset.reclaim)}));
    $('[data-dimension]')?.addEventListener('input',e=>{dimension=Number(e.target.value);$('[data-dimension-value]').textContent=dimension;});
    $('[data-sound]')?.addEventListener('click',()=>{const on=api.sound();$('[data-sound]').setAttribute('aria-pressed',String(on));$('[data-sound]').textContent=on?'Sky music on':'Listen to the sky';});
    const soundOn=!!api.soundEnabled?.();$('[data-sound]').setAttribute('aria-pressed',String(soundOn));$('[data-sound]').textContent=soundOn?'Sky music on':'Listen to the sky';
    beatSignature='';tick();if(focused)$(`[${focused}]`)?.focus();
  }
  function tick(){
    if(disposed)return;observatory?.tick();const ms=now(),sky=C.skyAt(ms),work=C.workStatus(state().workshop,ms);
    const word=work?.word||sky.word;
    $('[data-sky-word]').innerHTML=`${native(word)} <small>${word}</small>`;
    $('[data-sky-phase]').textContent=`${sky.daylight>.5?'Solar':'Nocturnal'} rhythm · 80 beats / minute`;
    $('[data-sky-alignment]').textContent=sky.alignment?`${sky.alignment.a} · ${sky.alignment.name} · ${sky.alignment.b} | orb ${sky.alignment.orb.toFixed(1)}° · +${Math.round(sky.alignment.strength*4)} craft quality`:'The sky is between close alignments. Your work can still begin.';
    $('[data-sky-date]').textContent=`${sky.utc.replace('T',' · ')} · solar craft +${sky.forgeBonus} · lunar craft +${sky.alchemyBonus}`;
    if(work){
      $('[data-work-stage]').textContent=`${work.job.stage+1} / 3 · ${work.name}`;
      $('[data-work-copy]').textContent=work.ready?'The process is ready. Continue when you choose.':`${Math.max(0,(work.duration-work.age)/1000).toFixed(1)} seconds · ${work.job.mode==='rhythm'?'Follow the light; each beat accepts one strike.':'Your work follows a steady rhythm.'}`;
      $('[data-work-progress]').value=work.phase;$('[data-temperature]').textContent=work.temperature+'°';$('[data-work-score]').textContent=work.quality??'—';
      const slots=Math.floor(work.duration/C.BEAT_MS),nextSignature=JSON.stringify([work.job.stage,Math.round(work.age/C.BEAT_MS),work.job.strikes]);if(nextSignature!==beatSignature){beatSignature=nextSignature;$('[data-beats]').innerHTML=Array.from({length:slots},(_,i)=>`<i class="${work.job.strikes.some(s=>s.slot===i+1)?'hit':Math.round(work.age/C.BEAT_MS)===i+1?'current':''}">${native(work.notes[i%work.notes.length].letter)}</i>`).join('');}
      const b=$('[data-advance]');b.disabled=!work.ready||busy;b.textContent=work.ready?(work.job.stage===2?'Finish & keep this work':'Continue to '+work.recipe.stages[work.job.stage+1][0]):'Let the process finish';
    }
    paintChart($('[data-cosmos-chart]'),sky,word,work?Math.max(0,ms-work.job.stageAt-C.BEAT_MS):ms,dimension,!!api.reduced?.());
  }
  refresh();return {refresh,tick,dispose(){disposed=true;observatory?.dispose();root.innerHTML='';}};
}
function sharedUse(id){return {iron:'Temper your gathering tool. Each gathering action becomes 0.07 seconds quicker.',alloy:'Hang a bell for everyone: up to 0.12 seconds quicker gathering, and a visible song over the hearth.',dew:'Drink for one minute of refreshed gathering: 0.10 seconds quicker per action.',earth:'Tend the town garden. Everyone gathers up to 0.06 seconds quicker. Deposits remain finite.'}[id];}

function paintChart(canvas,sky,word,ms,dimension,reduced=false){
  const c=canvas?.getContext('2d');if(!c)return;const w=720,h=350;if(canvas.width!==w){canvas.width=w;canvas.height=h;}c.clearRect(0,0,w,h);
  const cx=360,cy=175,r=140,beat=C.beatAt(ms),t=reduced?0:ms/1000;
  const glow=c.createRadialGradient(cx,cy,2,cx,cy,210);glow.addColorStop(0,'#43619955');glow.addColorStop(.45,'#28334d33');glow.addColorStop(1,'#040b1c00');c.fillStyle=glow;c.fillRect(0,0,w,h);
  c.strokeStyle='#7799c62d';c.lineWidth=1;
  for(const radius of [50,90,140,156]){c.beginPath();c.arc(cx,cy,radius,0,TAU);c.stroke();}
  for(let i=0;i<20;i++){const a=i/20*TAU-Math.PI/2;c.strokeStyle='#7799c637';c.beginPath();c.moveTo(cx+Math.cos(a)*140,cy+Math.sin(a)*140);c.lineTo(cx+Math.cos(a)*147,cy+Math.sin(a)*147);c.stroke();c.strokeStyle=word.includes(ALPHABET[i])?'#e7d0a1':'#66829d';c.fillStyle=c.strokeStyle;drawGlyph(c,ALPHABET[i],cx+Math.cos(a)*174-10,cy+Math.sin(a)*157-10,20);}
  for(const pair of sky.aspects){const a=sky.bodies.find(b=>b.name===pair.a),b=sky.bodies.find(b=>b.name===pair.b),pa=a.longitude*Math.PI/180,pb=b.longitude*Math.PI/180;c.strokeStyle=`rgba(153,183,245,${.08+pair.strength*.2})`;c.beginPath();c.moveTo(cx+Math.cos(pa)*r,cy+Math.sin(pa)*r);c.lineTo(cx+Math.cos(pb)*r,cy+Math.sin(pb)*r);c.stroke();}
  for(const b of sky.bodies){const a=b.longitude*Math.PI/180,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;c.fillStyle=b.color;c.shadowColor=b.color;c.shadowBlur=10;c.beginPath();c.arc(x,y,b.name==='Sun'?4.5:3,0,TAU);c.fill();c.shadowBlur=0;c.font='12px system-ui';c.textAlign=x<cx?'right':'left';c.fillText(b.name,x+(x<cx?-8:8),y-8);}
  let index=0;for(const letter of word){const points=projectLetter(letter,dimension,index,{phase:t*.05}),color=['#a5deff','#d4bafa','#f1d59e','#8ff1e3'][index%4];c.strokeStyle=color;c.lineWidth=1.25;c.globalAlpha=.65;c.beginPath();points.forEach(([x,y],i)=>{const px=cx+x*47,py=cy+y*47;i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();index++;}
  c.globalAlpha=1;const notes=C.score(word),note=notes[beat.index%notes.length];c.strokeStyle='#e5f7ff';c.fillStyle='#e5f7ff';c.shadowColor='#aad7ff';c.shadowBlur=12;drawGlyph(c,note.letter,cx-22,cy-24,44);c.shadowBlur=0;
  c.strokeStyle='#c1e9ff';c.globalAlpha=(1-beat.phase)*.7;c.beginPath();c.arc(cx,cy,25+beat.phase*35,0,TAU);c.stroke();c.globalAlpha=1;
}
