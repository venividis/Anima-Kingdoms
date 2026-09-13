import {WORLDS,world,ROUTES} from './astral-data.js';
import {AstralRenderer} from './astral-renderer.js';
import {clamp,flightStep,encounterReading} from './astral-model.js';
import {AstralSky,skyCamera,pathWorlds} from './astral-sky.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const group=w=>w.id==='sun'?'The Sun':w.kind==='planet'?'The planets':w.kind==='moon'?'Moons':'Asteroids & dwarf planets';
export function mountAstral(root,api){
 let current=world('earth'),selected=current.sites[0],routeId='solar',disposed=false,last=0,renderer,transition=null,frameId,audio=null,sounding=false,notesAt=0,noteIndex=0,reading=encounterReading('earth'),keys={},pointers=new Map(),auto=false,routeIndex=0;
 const v={mode:'departure',yaw:-.75,pitch:.2,distance:36,targetDistance:36,flight:{x:0,y:22,z:65,yaw:0,pitch:-.16},parent:null,travel:0};
 const skyView=skyCamera();let sky,skySelection=null,departureStart=null,skyDown=null;
 const $=s=>root.querySelector(s),bind=(s,event,fn)=>$(s).addEventListener(event,fn),announce=t=>{$('[data-status]').textContent=t;};
 const entries=()=>api.state().encounters,known=()=>entries().some(e=>e.world===current.id&&e.site===selected.id);
 root.innerHTML=`<div class="astral-shell"><canvas class="astral-canvas" tabindex="0" aria-label="Astral flight. Drag to look, pinch or scroll to zoom. W A S D to fly, Q and E to descend and rise."></canvas>
 <canvas class="astral-sky-canvas" tabindex="0" aria-label="The whole Luma night sky. Drag to look around, scroll or pinch to zoom. Select a planet light to travel, or a star to learn its name."></canvas>
 <div class="astral-sky-lights" aria-label="Lights and paths in this sky"></div>
 <div class="astral-departure"><p class="astral-eyebrow">THE BODY RESTS. THE SOUL REMEMBERS.</p><h1>Become the traveller.</h1><p data-departure-copy>Your silver thread holds the way home.</p><button data-look-up>Look up ↑</button></div>
 <div class="astral-sky-intro" hidden><p class="astral-eyebrow">LUMA · THE WHOLE NIGHT SKY</p><h1>Where does your soul wander?</h1><p>Touch a light. Follow its worlds.</p></div>
 <aside class="astral-sky-selection" hidden aria-label="Selected light"><button data-clear-light aria-label="Close selected light">×</button><p data-light-kind class="astral-eyebrow"></p><h2 data-light-name></h2><p data-light-copy></p><div data-light-worlds></div></aside>
 <div class="astral-sky-toolbar" hidden><div><button data-whole-sky aria-pressed="true">Whole sky</button><button data-other-sky>Through Earth ↓</button><button data-sky-labels aria-pressed="true">Names</button><button data-clear-sky aria-pressed="false">Just the stars</button></div><p data-sky-help>Drag to look around · touch a planet · pinch to draw closer</p><button data-home-light>✧ Silver thread · Earth</button></div>
 <header class="astral-header"><button data-return>← Return to body</button><span class="astral-brand">LUMA <i>✧</i> ASTRAL TRAVEL</span><button data-atlas aria-expanded="false">Worlds <span>${WORLDS.length}</span></button></header>
 <div class="astral-heading"><p data-location class="astral-eyebrow"></p><h1 data-name></h1><p data-caption></p></div>
 <aside class="astral-atlas" hidden><div class="astral-atlas-top"><h2>Where shall we go?</h2><button data-close-atlas aria-label="Close destinations">×</button></div><label>Find a world<input data-search type="search" placeholder="Planet, moon or asteroid…"></label><div data-world-list></div><label>A path through the sky<select data-route>${ROUTES.map(r=>`<option value="${r.id}">${r.name}</option>`).join('')}</select></label><button data-start-route class="astral-primary">Follow this path</button><p class="astral-fine">Choose any destination freely. Paths are optional.</p></aside>
 <aside class="astral-places"><div class="astral-places-top"><button data-toggle-places aria-expanded="true">Places to explore <span>−</span></button></div><div data-places-content><div data-sites></div><div class="astral-site-detail"><h2 data-site-name></h2><p data-site-copy></p><button data-descend class="astral-primary">Enter this place</button></div></div></aside>
 <div class="astral-travel-label" hidden><span>Follow your silver thread</span><strong data-travel-name></strong></div>
 <div class="astral-reticle" hidden aria-hidden="true">⊹</div>
 <div class="astral-touch" hidden><div class="astral-steer" aria-label="Flight directions"><button data-flight="forward" aria-label="Fly forward">↑</button><button data-flight="left" aria-label="Fly left">←</button><button data-flight="back" aria-label="Fly back">↓</button><button data-flight="right" aria-label="Fly right">→</button></div><div><button data-flight="up" aria-label="Rise">Rise</button><button data-flight="down" aria-label="Descend">Lower</button></div></div>
 <footer class="astral-footer"><div class="astral-controls"><button data-night-sky>Night sky ↑</button><button data-orbit aria-pressed="true">Orbit</button><button data-surface aria-pressed="false">Explore</button><span></span><button data-drift aria-pressed="false">Drift</button><button data-listen aria-pressed="false">Listen</button><button data-reading>Encounter</button></div><div class="astral-flight-info"><p data-help>Drag to orbit · pinch or scroll to approach</p><button data-next>Next world →</button></div></footer><p class="astral-announcement" data-status role="status" aria-live="polite"></p>
 <section class="astral-reading" hidden aria-label="Luma encounter journal"><header><p class="astral-eyebrow">YOUR ENCOUNTER</p><button data-close-reading aria-label="Close encounter">×</button></header><h2 data-encounter-title></h2><p class="luma-native" data-native></p><p data-phrase class="astral-fine"></p><p data-resonance></p><canvas data-cymatics width="500" height="100" aria-label="A visual response to the Luma score"></canvas><label>What will you bring back?<textarea data-note maxlength="1200" rows="3" placeholder="A thought, a memory, a question…"></textarea></label><button data-remember class="astral-primary">Remember this place</button><p data-journal-count class="astral-fine"></p><details><summary>About this world</summary><p data-science></p><a data-source target="_blank" rel="noopener">Read the NASA world guide ↗</a><p class="astral-fine">Astral landscapes, weather, sky companions and Luma associations are authored game scenes. Orbit imagery uses planetary maps where available. Sizes and travel time are scaled for exploration.</p><a href="./astral-guide.html" target="_blank" rel="noopener">World guide & image credits ↗</a></details></section></div>`;
 const canvas=$('.astral-canvas'),skyCanvas=$('.astral-sky-canvas');
 function focusCanvas(){(v.mode==='sky'?skyCanvas:v.mode==='departure'?$('[data-look-up]'):canvas).focus();}
 function setMode(){
  const inSky=v.mode==='sky',departing=v.mode==='departure',visiting=!inSky&&!departing;
  if(visiting){$('.astral-shell').classList.remove('astral-uncluttered');$('[data-clear-sky]').setAttribute('aria-pressed','false');$('[data-clear-sky]').textContent='Just the stars';}
  $('.astral-shell').dataset.mode=v.mode;root.closest('#panel')?.classList.toggle('astral-departing',departing);
  canvas.hidden=!visiting;skyCanvas.hidden=visiting;$('.astral-sky-lights').hidden=!inSky;
  $('.astral-departure').hidden=!departing;$('.astral-sky-intro').hidden=!inSky||!!skySelection;
  $('.astral-sky-toolbar').hidden=!inSky;$('.astral-sky-selection').hidden=!inSky||!skySelection;
  for(const selector of ['.astral-heading','.astral-places','.astral-footer'])$(selector).hidden=!visiting;
  $('.astral-reticle').hidden=v.mode!=='surface';$('.astral-touch').hidden=v.mode!=='surface';
 }
 function showSky(){
  if(transition)return;v.mode='sky';keys={};pointers.clear();auto=false;skyCanvas.style.opacity='1';
  $('.astral-reading').hidden=true;$('.astral-atlas').hidden=true;$('[data-atlas]').setAttribute('aria-expanded','false');
  if(sounding){sounding=false;audio?.suspend();$('[data-listen]').setAttribute('aria-pressed','false');$('[data-listen]').textContent='Listen';}
  setMode();paintSky();skyCanvas.focus();announce('Choose a light in the sky. Planet paths include their moons.');
 }
 function selectLight(target){
  if(v.mode!=='sky'||transition)return;skySelection=target;$('.astral-sky-selection').hidden=false;$('.astral-sky-intro').hidden=true;
  const record=target.record||world(target.id),isStar=target.type==='star';
  $('[data-light-name]').textContent=isStar?record.star.name:record.name;
  $('[data-light-kind]').textContent=isStar?record.star.constellation:target.type==='gate'?'AN ASTRAL PATH':'FOLLOW THIS LIGHT';
  $('[data-light-copy]').textContent=isStar?`${record.star.constellation} · magnitude ${record.star.mag.toFixed(1)}. A distant star in the Luma sky. Our journey explores the Solar System.`:target.type==='gate'?'The wandering stones. This Luma gate gathers paths to the asteroids and Ceres.':target.id==='earth'?'Your home world. Follow its landscapes or the Moon.':`${world(target.id)?.summary||''}${pathWorlds(target.id).length>1?' Choose this world or follow one of its moons.':''}`;
  $('[data-light-worlds]').innerHTML=isStar?'':pathWorlds(target.id).map(w=>`<button data-follow="${w.id}"${w.id===target.id?' class="astral-primary"':''}>${w.id===target.id?'Travel to ':''}${esc(w.name)} <span>↗</span></button>`).join('');
  for(const b of root.querySelectorAll('[data-follow]'))b.onclick=()=>travel(b.dataset.follow);
  announce(isStar?'You are looking at '+record.star.name+'.':'Follow '+record.name+' to choose your destination.');
 }
 function paintSky(){
  if(!sky)return;$('[data-other-sky]').textContent=skyView.pitch<0?'Above Earth ↑':'Through Earth ↓';const clean=$('.astral-shell').classList.contains('astral-uncluttered');
  if(!sky.draw({...skyView,labels:skyView.labels&&!clean},skySelection))return;
  const width=skyCanvas.clientWidth||innerWidth,height=skyCanvas.clientHeight||innerHeight,placed=[];
  for(const b of root.querySelectorAll('[data-light]')){
   const point=sky.positions.find(p=>p.id===b.dataset.light);b.hidden=!point;if(!point)continue;
   const bw=point.type==='gate'?128:92,bh=38,x=clamp(point.x+14,12,width-bw-12);
   let y=clamp(point.y-18,90,height-170);
   for(const offset of [0,40,-40,80,-80,120,-120,160,-160]){const candidate=clamp(point.y-18+offset,90,height-170);if(!placed.some(p=>x<p.x+p.w+6&&x+bw+6>p.x&&candidate<p.y+bh&&candidate+bh>p.y)){y=candidate;break;}}
   placed.push({x,y,w:bw});b.style.left=x+'px';b.style.top=y+'px';b.style.width=bw+'px';b.setAttribute('aria-pressed',skySelection?.id===point.id);
   if(!clean){const c=sky.c;c.strokeStyle='#bcd5e13b';c.lineWidth=.6;c.beginPath();c.moveTo(point.x,point.y);c.lineTo(x,y+18);c.stroke();}
  }
 }
 bind('[data-look-up]','click',showSky);bind('[data-night-sky]','click',showSky);
 bind('[data-clear-light]','click',()=>{skySelection=null;setMode();skyCanvas.focus();});
 bind('[data-home-light]','click',()=>selectLight({id:'earth',type:'world',record:world('earth')}));
 bind('[data-whole-sky]','click',()=>{Object.assign(skyView,skyCamera());$('[data-whole-sky]').setAttribute('aria-pressed','true');$('[data-other-sky]').textContent='Through Earth ↓';$('[data-sky-labels]').setAttribute('aria-pressed','true');skyCanvas.focus();});
 bind('[data-other-sky]','click',()=>{skyView.pitch=skyView.pitch<0?90:-90;skyView.yaw=180;skyView.dome=true;skyView.zoom=1;$('[data-whole-sky]').setAttribute('aria-pressed','true');$('[data-other-sky]').textContent=skyView.pitch<0?'Above Earth ↑':'Through Earth ↓';announce(skyView.pitch<0?'The other half of the sky. Earth is transparent to your soul.':'The complete sky above your resting body.');skyCanvas.focus();});
 bind('[data-sky-labels]','click',()=>{skyView.labels=!skyView.labels;$('[data-sky-labels]').setAttribute('aria-pressed',skyView.labels);});
 bind('[data-clear-sky]','click',()=>{const clean=$('.astral-shell').classList.toggle('astral-uncluttered');$('[data-clear-sky]').setAttribute('aria-pressed',clean);$('[data-clear-sky]').textContent=clean?'Show paths':'Just the stars';skySelection=null;sky.signature=null;setMode();});
 bind('.astral-sky-canvas','pointerdown',e=>{if(v.mode!=='sky'||transition)return;skyCanvas.setPointerCapture(e.pointerId);skyCanvas.focus();pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});skyDown={x:e.clientX,y:e.clientY,moved:false,multi:pointers.size>1};});
 bind('.astral-sky-canvas','pointermove',e=>{
  const old=pointers.get(e.pointerId);if(!old||!skyDown||v.mode!=='sky')return;const before=[...pointers.values()];pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){const after=[...pointers.values()],distance=a=>Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);skyView.zoom=clamp(skyView.zoom*distance(after)/Math.max(1,distance(before)),.65,4);skyView.dome=false;skyDown.multi=true;}
  else {if(Math.hypot(e.clientX-skyDown.x,e.clientY-skyDown.y)>6)skyDown.moved=true;if(!skyDown.moved)return;skyView.dome=false;skyView.yaw=(skyView.yaw-(e.clientX-old.x)*.2/skyView.zoom+360)%360;skyView.pitch=clamp(skyView.pitch+(e.clientY-old.y)*.2/skyView.zoom,-89.5,89.5);}
  $('[data-whole-sky]').setAttribute('aria-pressed','false');
 });
 bind('.astral-sky-canvas','pointerup',e=>{if(!pointers.has(e.pointerId))return;if(skyDown&&!skyDown.moved&&!skyDown.multi){const rect=skyCanvas.getBoundingClientRect(),target=sky.pick(e.clientX-rect.left,e.clientY-rect.top);if(target)selectLight(target);}pointers.delete(e.pointerId);});
 for(const event of ['pointercancel','lostpointercapture'])bind('.astral-sky-canvas',event,e=>{pointers.delete(e.pointerId);skyDown=null;});
 bind('.astral-sky-canvas','wheel',e=>{e.preventDefault();if(v.mode!=='sky'||transition)return;skyView.dome=false;skyView.zoom=clamp(skyView.zoom*Math.exp(-e.deltaY*.001),.65,4);$('[data-whole-sky]').setAttribute('aria-pressed','false');});
 function atlas(){const query=$('[data-search]').value.toLowerCase(),groups=['The Sun','The planets','Moons','Asteroids & dwarf planets'];$('[data-world-list]').innerHTML=groups.map(g=>{const items=WORLDS.filter(w=>group(w)===g&&(w.name+' '+w.parent).toLowerCase().includes(query));return items.length?`<section><h3>${g}</h3>${items.map(w=>`<button data-world="${w.id}" aria-current="${w.id===current.id}"><i style="--world-color:${w.color}"></i><span>${w.name}<small>${w.kind==='moon'?world(w.parent)?.name:w.kind==='dwarf'?'Dwarf planet':w.kind}</small></span>${entries().some(e=>e.world===w.id)?'<b aria-label="Remembered">✧</b>':''}</button>`).join('')}</section>`:'';}).join('')||'<p>No matching world.</p>';for(const b of root.querySelectorAll('[data-world]'))b.onclick=()=>travel(b.dataset.world);}
 function toggleAtlas(open){$('.astral-atlas').hidden=!open;$('[data-atlas]').setAttribute('aria-expanded',open);if(open){atlas();$('[data-search]').focus();}else focusCanvas();}
 function update(){
  setMode();
  const w=current;$('[data-name]').textContent=w.name;$('[data-location]').textContent=v.mode==='surface'?'ASTRAL EXPLORATION · '+selected.name:(w.kind==='moon'?world(w.parent)?.name+' · MOON':w.kind==='star'?'THE HEART OF OUR SOLAR SYSTEM':w.kind==='dwarf'?'DWARF PLANET':w.kind.toUpperCase());
  $('[data-caption]').textContent=v.mode==='surface'?(['gas','sun'].includes(w.style)?'Drift through '+(w.style==='sun'?'plasma and light':'the cloud realm')+'.':'Your silver thread remembers the way home.'):`${w.radius.toLocaleString()} km mean radius${w.kind==='moon'?' · '+world(w.parent)?.name+' system':''}`;
  $('[data-sites]').innerHTML=w.sites.map(s=>`<button data-site="${s.id}" aria-pressed="${s.id===selected.id}">${s.name}<span>${entries().some(e=>e.world===w.id&&e.site===s.id)?'✧':'↗'}</span></button>`).join('');for(const b of root.querySelectorAll('[data-site]'))b.onclick=()=>selectSite(b.dataset.site);
  $('[data-site-name]').textContent=selected.name;$('[data-site-copy]').textContent=selected.description;$('[data-descend]').textContent=v.mode==='surface'?'Return to the landmark':'Enter this place';
  $('[data-orbit]').setAttribute('aria-pressed',v.mode==='orbit');$('[data-surface]').setAttribute('aria-pressed',v.mode==='surface');$('[data-help]').textContent=v.mode==='orbit'?'Drag to orbit · pinch or scroll to approach':'Drag to look · WASD / arrows fly · Q / E lower / rise · Shift faster';
  $('.astral-reticle').hidden=v.mode!=='surface';$('.astral-touch').hidden=v.mode!=='surface';reading=encounterReading(w.id);
  $('[data-encounter-title]').textContent=w.name+' · '+selected.name;$('[data-native]').textContent=reading.native;$('[data-phrase]').textContent=reading.phrase;$('[data-resonance]').textContent='Luma resonance: '+w.word+' ('+reading.meaning+') · each letter keeps its original pair of notes.';$('[data-note]').value=entries().find(e=>e.world===w.id&&e.site===selected.id)?.note||'';$('[data-remember]').textContent=known()?'Save reflection':'Remember this place';$('[data-remember]').disabled=v.mode!=='surface';
  $('[data-science]').textContent=w.summary;$('[data-source]').href=w.source;$('[data-journal-count]').textContent=entries().length+' places remembered on this device'+(v.mode==='surface'?'':'. Enter a place to record your encounter.');
  const route=ROUTES.find(r=>r.id===routeId);routeIndex=route.worlds.indexOf(w.id);$('[data-next]').textContent='Next: '+world(route.worlds[(routeIndex+1)%route.worlds.length]).name+' →';
 }
 function selectSite(id){selected=current.sites.find(s=>s.id===id)||current.sites[0];if(v.mode==='surface')enter();else{update();announce(selected.name+' selected. Enter this place to fly through it.');}}
 function switchWorld(id){current=world(id)||world('earth');selected=current.sites[0];v.mode='orbit';v.parent=world(current.parent);v.distance=v.targetDistance=current.ring?62:36;v.pitch=.2;v.yaw=-.75;renderer.setWorld(current);update();}
 function travel(id){if(!world(id)||transition)return;if(v.mode==='departure')showSky();try{if(!renderer){renderer=new AstralRenderer(canvas,announce);renderer.setWorld(current);}}catch(e){announce(e.message+' You can still explore the whole sky.');return;}toggleAtlas(false);$('.astral-reading').hidden=true;keys={};auto=false;$('[data-drift]').setAttribute('aria-pressed','false');if(api.reduced?.()){switchWorld(id);canvas.focus();return;}transition={start:performance.now(),duration:1700,action:()=>switchWorld(id),done:false};$('.astral-travel-label').hidden=false;$('[data-travel-name]').textContent=world(id).name;announce('Travelling to '+world(id).name+'.');}
 function enter(){if(!renderer||transition||!['orbit','surface'].includes(v.mode))return;const action=()=>{v.mode='surface';const terrain=renderer.setSite(selected);v.flight={x:0,z:65,y:Math.max(18,terrain.height(0,65)+12),yaw:0,pitch:-.16};if(['storm','hexagon','basin','crater','salt','chaos','lake'].includes(selected.kind)){v.flight.y=Math.max(v.flight.y,45);v.flight.pitch=-.55;}if(['volcano','mountain','flare'].includes(selected.kind))v.flight.pitch=.04;update();announce('You have arrived at '+selected.name+'. Explore freely, or open Encounter to remember it.');};if(api.reduced?.())action();else{transition={start:performance.now(),duration:1000,action,done:false};$('.astral-travel-label').hidden=false;$('[data-travel-name]').textContent=selected.name;}canvas.focus();}
 function orbit(){if(!renderer||transition||!['orbit','surface'].includes(v.mode))return;v.mode='orbit';v.distance=v.targetDistance=current.ring?62:36;update();canvas.focus();}
 function playNotes(time){if(!sounding||!audio||document.hidden)return;if(time-notesAt<.65)return;notesAt=time;const note=reading.notes[noteIndex++%reading.notes.length],o=audio.createOscillator(),gain=audio.createGain();o.type='sine';o.frequency.value=note.frequency;gain.gain.setValueAtTime(0,audio.currentTime);gain.gain.linearRampToValueAtTime(.035,audio.currentTime+.1);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+1.8);o.connect(gain);gain.connect(audio.destination);o.start();o.stop(audio.currentTime+2);o.onended=()=>{o.disconnect();gain.disconnect();};}
 async function listen(){try{if(!audio){const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)throw Error('Sound is unavailable in this browser.');audio=new Audio();}await audio.resume();sounding=!sounding;$('[data-listen]').setAttribute('aria-pressed',sounding);$('[data-listen]').textContent=sounding?'Silence':'Listen';if(!sounding)await audio.suspend();}catch(e){announce(e.message);}}
 function cymatics(time){if($('.astral-reading').hidden)return;const c=$('[data-cymatics]').getContext('2d'),w=500,h=100;c.clearRect(0,0,w,h);c.strokeStyle=current.color;c.lineWidth=1;for(let k=0;k<4;k++){c.globalAlpha=.7-k*.13;c.beginPath();for(let x=0;x<w;x++){const y=h/2+Math.sin(x*.026+time*(sounding?1:0)+k*.7)*Math.sin(x/w*Math.PI)*28+Math.sin(x*.061-time)*5; x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}c.globalAlpha=1;}
 function loop(ms){
  if(disposed)return;const elapsed=Math.max(0,ms-last),dt=Math.min(.05,elapsed/1000||0);last=ms;
  if(!document.hidden){
   if(v.mode==='departure'){
    departureStart??=ms;const p=clamp((ms-departureStart)/(api.reduced?.()?1200:6200),0,1);
    api.departure?.(api.reduced?.()?.52:p,dt);skyCanvas.style.opacity=api.reduced?.()?'0':String(clamp((p-.61)/.34,0,1));
    $('[data-departure-copy]').textContent=p<.28?'Let your body come to rest.':p<.65?'Your soul rises. The silver thread stays with you.':'Lift your gaze. The whole sky is opening.';
    if(p===1)showSky();
   }
   if(transition){const p=clamp((ms-transition.start)/transition.duration,0,1);v.travel=Math.sin(p*Math.PI);if(p>=.5&&!transition.done){transition.done=true;transition.action();}if(p===1){transition=null;v.travel=0;$('.astral-travel-label').hidden=true;focusCanvas();}}
   if(v.mode==='sky'||v.mode==='departure'){
    if(v.mode==='sky'&&!transition){const x=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),y=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0);if(x||y){skyView.dome=false;skyView.yaw=(skyView.yaw+x*dt*45+360)%360;skyView.pitch=clamp(skyView.pitch+y*dt*45,-89.5,89.5);$('[data-whole-sky]').setAttribute('aria-pressed','false');}}
    paintSky();
   }else if(renderer){
    if(v.mode==='orbit'){if(auto&&!api.reduced?.())v.yaw+=dt*.1;v.distance+=(v.targetDistance-v.distance)*(1-Math.exp(-dt*9));}
    else if(renderer.terrain&&!transition)flightStep(v.flight,{forward:(keys.w||keys.arrowup||keys.forward?1:0)-(keys.s||keys.arrowdown||keys.back?1:0)+(auto?.3:0),right:(keys.d||keys.arrowright||keys.right?1:0)-(keys.a||keys.arrowleft||keys.left?1:0),up:(keys.e||keys.up?1:0)-(keys.q||keys.down?1:0),fast:keys.shift},dt,renderer.terrain);
    renderer.render(v,api.reduced?.()?0:ms/1000);playNotes(ms/1000);cymatics(api.reduced?.()?0:ms/1000);
   }
  }else if(departureStart!==null)departureStart+=elapsed;
  frameId=requestAnimationFrame(loop);
 }
 sky=new AstralSky(skyCanvas,api.sky());
 $('.astral-sky-lights').innerHTML=sky.paths.map(p=>`<button data-light="${p.id}" style="--light-color:${p.color||'#dbe4e8'}" aria-label="${p.name}${p.type==='gate'?', choose an asteroid path':', choose a world to visit'}"><span>${p.type==='gate'?'◇':'✧'}</span><b>${esc(p.name)}</b></button>`).join('');
 for(const b of root.querySelectorAll('[data-light]'))b.onclick=()=>selectLight({id:b.dataset.light,type:sky.paths.find(p=>p.id===b.dataset.light).type,record:sky.paths.find(p=>p.id===b.dataset.light)});
 update();paintSky();api.departure?.(api.reduced?.()?.52:0,0);
 bind('[data-return]','click',()=>api.close());bind('[data-atlas]','click',()=>toggleAtlas($('.astral-atlas').hidden));bind('[data-close-atlas]','click',()=>toggleAtlas(false));bind('[data-search]','input',atlas);bind('[data-route]','change',e=>{routeId=e.target.value;});bind('[data-start-route]','click',()=>travel(ROUTES.find(r=>r.id===routeId).worlds[0]));bind('[data-next]','click',()=>{const r=ROUTES.find(r=>r.id===routeId);travel(r.worlds[(r.worlds.indexOf(current.id)+1)%r.worlds.length]);});
 bind('[data-toggle-places]','click',()=>{const content=$('[data-places-content]');content.hidden=!content.hidden;$('[data-toggle-places]').setAttribute('aria-expanded',!content.hidden);$('[data-toggle-places] span').textContent=content.hidden?'+':'−';});bind('[data-descend]','click',enter);bind('[data-surface]','click',enter);bind('[data-orbit]','click',orbit);bind('[data-drift]','click',()=>{auto=!auto;$('[data-drift]').setAttribute('aria-pressed',auto);});bind('[data-listen]','click',listen);bind('[data-reading]','click',()=>{$('.astral-reading').hidden=!$('.astral-reading').hidden;});bind('[data-close-reading]','click',()=>{$('.astral-reading').hidden=true;});bind('[data-remember]','click',()=>{try{if(v.mode!=='surface')throw Error('Enter a place before remembering it.');api.remember(current.id,selected.id,$('[data-note]').value);update();announce('Your encounter with '+current.name+' is saved in your world.');}catch(e){announce(e.message);}});
 bind('.astral-canvas','pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.focus();});bind('.astral-canvas','pointermove',e=>{const old=pointers.get(e.pointerId);if(!old)return;const before=[...pointers.values()];pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const after=[...pointers.values()],dist=a=>Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),ratio=dist(before)/Math.max(1,dist(after));if(v.mode==='orbit')v.targetDistance=clamp(v.targetDistance*ratio,13,110);else if(renderer?.terrain) v.flight.y=clamp(v.flight.y+(ratio-1)*30,renderer.terrain.height(v.flight.x,v.flight.z)+2,100);}else if(v.mode==='orbit'){v.yaw-=(e.clientX-old.x)*.006;v.pitch=clamp(v.pitch+(e.clientY-old.y)*.006,-1.35,1.35);}else if(v.mode==='surface'){v.flight.yaw+=(e.clientX-old.x)*.004;v.flight.pitch=clamp(v.flight.pitch-(e.clientY-old.y)*.004,-1.35,1.35);}});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])bind('.astral-canvas',type,e=>pointers.delete(e.pointerId));bind('.astral-canvas','wheel',e=>{e.preventDefault();if(v.mode==='orbit')v.targetDistance=clamp(v.targetDistance*Math.exp(e.deltaY*.001),13,110);else if(renderer?.terrain) v.flight.y=clamp(v.flight.y+e.deltaY*.02,renderer.terrain.height(v.flight.x,v.flight.z)+2,100);});bind('.astral-canvas','dblclick',()=>v.mode==='orbit'?enter():orbit());
 for(const b of root.querySelectorAll('[data-flight]')){const clear=()=>delete keys[b.dataset.flight];b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys[b.dataset.flight]=true;});for(const t of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(t,clear);}
 const down=e=>{if(disposed)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(!$('.astral-atlas').hidden)toggleAtlas(false);else if(!$('.astral-reading').hidden)$('.astral-reading').hidden=true;else if(v.mode==='sky'&&skySelection){skySelection=null;setMode();skyCanvas.focus();}else api.close();return;}if(e.target.closest('input,textarea,select,button,a'))return;const k=e.key.toLowerCase();if(['w','a','s','d','q','e','shift','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)){e.preventDefault();e.stopImmediatePropagation();keys[k]=true;}};
 const up=e=>delete keys[e.key.toLowerCase()],clear=()=>{keys={};pointers.clear();};window.addEventListener('keydown',down,true);window.addEventListener('keyup',up,true);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
 if(innerWidth<850){$('[data-places-content]').hidden=true;$('[data-toggle-places]').setAttribute('aria-expanded','false');$('[data-toggle-places] span').textContent='+';}
 frameId=requestAnimationFrame(loop);$('[data-look-up]').focus();
 return {inspect:()=>({world:current.id,site:selected.id,mode:v.mode,flight:{...v.flight},sky:{...skyView,selected:skySelection?.id,stars:sky.stars.length},encounters:entries().length}),dispose(){disposed=true;cancelAnimationFrame(frameId);window.removeEventListener('keydown',down,true);window.removeEventListener('keyup',up,true);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);audio?.close();renderer?.dispose();api.restore?.();root.innerHTML='';}};
}
