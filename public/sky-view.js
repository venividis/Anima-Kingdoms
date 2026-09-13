import * as S from './sky-model.js';
import {CATALOG,CATALOG_META,CONSTELLATIONS,stellarField,skyGuides,domePoint,starColor,selectedStarRecord} from './sky-observer.js';
import {ALPHABET} from './luma/data.js';
import {toNative} from './luma/language.js';
import {drawGlyph} from './luma/geometry.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const native=s=>`<span class="luma-native">${esc(toNative(s))}</span>`;
const angle=n=>n===null?'Unavailable':n.toFixed(2)+'°';
const dateLabel=s=>s?s.replace('T',' · ').replace(/\.\d{3}Z$/,' UTC'):'No event in this search';
const phaseName=p=>['New Moon','Waxing crescent','First quarter','Waxing gibbous','Full Moon','Waning gibbous','Last quarter','Waning crescent'][Math.floor(S.wrap(p+22.5)/45)];

export class SealPlayer{
  constructor(){this.context=null;this.voices=[];this.timer=null;}
  stop(){for(const voice of this.voices){try{voice.stop();}catch{}}this.voices=[];clearTimeout(this.timer);}
  async play(cells,onNote=()=>{}){
    this.stop();const Engine=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Engine)throw Error('Audio is unavailable in this browser. The written score remains available.');
    this.context??=new Engine();await this.context.resume();const notes=cells.flatMap(c=>c?c.notes:[null,null,null,null]),start=this.context.currentTime+.06;
    notes.forEach((note,i)=>{if(!note)return;const oscillator=this.context.createOscillator(),gain=this.context.createGain(),at=start+i*.24;
      oscillator.type='sine';oscillator.frequency.value=note.frequency;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.028,at+.015);gain.gain.exponentialRampToValueAtTime(.0001,at+.2);
      oscillator.connect(gain);gain.connect(this.context.destination);oscillator.start(at);oscillator.stop(at+.22);this.voices.push(oscillator);
    });
    onNote(`${notes.filter(Boolean).length} notes · 220 Hz reference · two notes per Luma digit`);
    this.timer=setTimeout(()=>{this.voices=[];onNote('The seal has finished.');},notes.length*240+150);
  }
  dispose(){this.stop();this.context?.close?.();}
}

export function mountWholeSky(root,api){
  let view='dome',study=null,offset=0,hemisphere='above',magnitude=6,constellation='',selected='Moon',dimension=16,
      lastKey='',lastNotebook='',events=[],eventKey='',hour=null,sky=null,field=[],hitTargets=[],busy=false,disposed=false,caption='',lastTick=-Infinity;
  const audio=new SealPlayer(),$=s=>root.querySelector(s);
  root.innerHTML=`<section class="whole-sky" aria-label="Luma whole-sky observatory">
    <header class="sky-heading"><div><span class="eyebrow">LUMA · THE WHOLE SKY</span><h3>A moment, written in stars.</h3><p>9,096 catalogued stars · all 88 constellations · one shared sky</p></div><span data-sky-clock-mode class="sky-live-pill">Town sky · live</span></header>
    <div class="sky-tabs" role="tablist" aria-label="Sky view"><button role="tab" data-sky-view="dome" aria-selected="true">The visible sky</button><button role="tab" data-sky-view="rings" aria-selected="false">Circles & cycles</button><button role="tab" data-sky-view="coordinates" aria-selected="false">1 → 16 coordinates</button></div>
    <div class="sky-controls"><label>Hemisphere<select data-hemisphere><option value="above">Above the horizon</option><option value="below">Below the horizon</option></select></label><label>Stars through magnitude <output data-mag-value>6.0</output><input data-magnitude type="range" min="2" max="8" step=".5" value="6"></label><label>Constellation<select data-constellation><option value="">All 88 constellations</option>${CONSTELLATIONS.map(n=>`<option>${esc(n)}</option>`).join('')}</select></label></div>
    <div class="sky-canvas-frame"><canvas data-sky-map width="900" height="500" role="img" aria-label="All-sky star chart. Use Find a light for keyboard selection."></canvas><p data-map-caption class="sky-map-caption"></p></div>
    <div class="sky-facts" data-sky-facts></div>
    <div class="sky-discovery"><div><label for="sky-search">Find a light</label><input id="sky-search" data-star-search type="search" autocomplete="off" placeholder="Moon, Sirius, Vega, HR 7001…"><div data-star-results class="sky-search-results"></div><div class="sky-body-picks">${S.BODY_NAMES.map(n=>`<button data-pick-body="${n}" aria-pressed="${n===selected}">${n==='Sun'?native('sola'):n==='Moon'?native('luna'):esc(n)}</button>`).join('')}</div></div><article data-selected-light class="sky-light-card"></article></div>
    <details class="sky-study"><summary>Travel through time & place</summary><p>Study a different sky. Return to the town whenever you want to craft or keep a live encounter.</p>
      <div class="sky-study-fields"><label>UTC date and time<input data-study-date type="datetime-local" step="1" min="1800-01-01T00:00" max="2200-12-31T23:59:59"></label><label>Latitude · north positive<input data-study-lat type="number" min="-90" max="90" step=".0001" value="38"></label><label>Longitude · east positive<input data-study-lon type="number" min="-180" max="180" step=".0001" value="0"></label></div>
      <div class="sky-button-row"><button data-study-apply>Explore this sky</button><button data-sky-step="-21600000">−6 sky hours</button><button data-sky-step="21600000">+6 sky hours</button><button data-sky-step="86400000">+1 sky day</button><button data-south>Southern sky</button><button data-live-sky>Return to town sky</button></div>
      <label>Longitude origin<select data-offset><option value="0">Tropical · true equinox of date</option><option value="24.2">Custom fixed offset · 24.2°</option></select></label><p class="sky-small">The offset rotates sector labels and the seal. The stars and planets stay in the same places. This custom comparison is not a named ayanāṃśa.</p>
    </details>
    <section class="sky-seal"><div class="sky-section-title"><h4>The sixteen-digit sky seal</h4><button data-play-seal>Play the seal</button><button data-stop-seal>Stop</button></div><div data-sky-seal class="sky-seal-cells"></div><p class="sky-small">Eight named angles, two base-twenty digits each. Select a cell to hear its four notes. A missing angle leaves a silent cell.</p><p data-seal-audio role="status" class="sky-small"></p><label class="sky-dimension-control">Retain <output data-sky-dimension-value>16</output> sky coordinates<input data-sky-dimension type="range" min="1" max="16" value="16"></label><p data-coordinate-caption class="sky-small"></p></section>
    <div class="sky-two-columns"><section><h4>The next encounters</h4><div data-sky-events class="sky-events"></div></section><section><h4>Cycles within this moment</h4><div data-sky-cycles class="sky-cycles"></div><p data-planetary-hour class="sky-small"></p></section></div>
    <details><summary>Read all ten bodies</summary><div class="sky-table-scroll"><table><thead><tr><th>Body</th><th>Longitude</th><th>Altitude</th><th>Motion</th><th>Constellation</th></tr></thead><tbody data-body-table></tbody></table></div><p class="sky-small">Longitude uses the selected ecliptic origin. Altitude uses your observer. Uranus, Neptune and Pluto are included as computed objects; their chart symbols do not imply naked-eye visibility.</p></details>
    <section class="sky-encounter"><span class="eyebrow">OBSERVE · INTEND · ACT · RETURN</span><h4>Give this moment a consequence.</h4><div class="sky-study-fields"><label>Choose an authored practice<select data-practice>${Object.entries(S.PRACTICES).map(([name,p])=>`<option value="${name}">${name} · ${p.title}</option>`).join('')}</select></label><div data-practice-text></div></div><p class="sky-small">Jupiter’s “you” means the person you address. These are your choices; a sky position does not make a promise for you.</p><button data-keep-sky class="cosmos-primary">Keep the town sky & my intention</button><p data-sky-message role="status" aria-live="polite"></p><div data-sky-notebook></div></section>
    <footer class="sky-footer"><button data-export-sky>Export this sky & score</button><a href="/sky-guide.html" target="_blank" rel="noopener">Read the complete sky & Luma guide ↗</a><details><summary>Sources & calculation record</summary><p>Yale Bright Star Catalogue, CDS V/50. IAU names use the pinned 2022 table. The star layer advances published proper motion, precession and nutation. Sizes and colors help you read the chart.</p><p data-sky-provenance></p><p><a href="https://cdsarc.cds.unistra.fr/ftp/V/50/" target="_blank" rel="noopener">Catalogue & column definitions</a> · <a href="https://www.pas.rochester.edu/~emamajek/WGSN/IAU-CSN.txt" target="_blank" rel="noopener">IAU name witness</a></p></details></footer>
  </section>`;
  const status=text=>{if(!disposed)$('[data-sky-message]').textContent=text;};
  const fail=e=>status(e.message||String(e));
  function select(id){selected=id;$('[data-star-results]').innerHTML='';lastKey='';tick(true);}
  function currentSky(){const live=api.sky();return study?S.calculateSky(study.date,study.observer,offset):offset?S.calculateSky(live.utc,live.observer,offset):live;}
  function enterStudy(date,observer=sky.observer){
    const check=S.checkInput(date,observer);study={date:check.date.toISOString(),observer:check.observer};lastKey='';eventKey='';tick(true);syncStudyFields();
  }
  function syncStudyFields(){if(!sky)return;$('[data-study-date]').value=sky.utc.slice(0,19);$('[data-study-lat]').value=sky.observer.latitude;$('[data-study-lon]').value=sky.observer.longitude;}
  root.querySelectorAll('[data-sky-view]').forEach(b=>b.onclick=()=>{view=b.dataset.skyView;root.querySelectorAll('[data-sky-view]').forEach(t=>t.setAttribute('aria-selected',String(t===b)));paint();});
  root.querySelectorAll('[data-pick-body]').forEach(b=>b.onclick=()=>select(b.dataset.pickBody));
  $('[data-hemisphere]').onchange=e=>{hemisphere=e.target.value;paint();};
  $('[data-magnitude]').oninput=e=>{magnitude=+e.target.value;$('[data-mag-value]').textContent=magnitude.toFixed(1);paint();};
  $('[data-constellation]').onchange=e=>{constellation=e.target.value;paint();};
  $('[data-sky-dimension]').oninput=e=>{dimension=+e.target.value;$('[data-sky-dimension-value]').textContent=dimension;updatePrefix();paint();};
  $('[data-star-search]').oninput=e=>{
    const q=e.target.value.trim().toLowerCase();if(!q){$('[data-star-results]').innerHTML='';return;}
    const candidates=[...S.BODY_NAMES.map(name=>({id:name,name,words:name==='Sun'?'sola':name==='Moon'?'luna':''})),...CATALOG.map(s=>({id:s.id,name:s.name,words:s.id+' '+s.designation+' '+s.names.join(' ')}))];
    const matches=candidates.filter(c=>(c.name+' '+c.words).toLowerCase().includes(q)).slice(0,12);
    $('[data-star-results]').innerHTML=matches.length?matches.map(c=>`<button data-select-light="${esc(c.id)}">${esc(c.name)} <small>${esc(c.id)}</small></button>`).join(''):'<p>No catalogue match. Try a name or HR number.</p>';
    root.querySelectorAll('[data-select-light]').forEach(b=>b.onclick=()=>select(b.dataset.selectLight));
  };
  $('[data-study-apply]').onclick=()=>{try{let value=$('[data-study-date]').value;if(value.length===16)value+=':00';enterStudy(value+'Z',{latitude:Number($('[data-study-lat]').value),longitude:Number($('[data-study-lon]').value),elevation:0});}catch(e){fail(e);}};
  root.querySelectorAll('[data-sky-step]').forEach(b=>b.onclick=()=>{try{enterStudy(new Date(+new Date(sky.utc)+Number(b.dataset.skyStep)));}catch(e){fail(e);}});
  $('[data-south]').onclick=()=>{try{enterStudy(sky.utc,{latitude:-38,longitude:0,elevation:150});hemisphere='above';$('[data-hemisphere]').value='above';paint();}catch(e){fail(e);}};
  $('[data-live-sky]').onclick=()=>{study=null;offset=0;$('[data-offset]').value='0';eventKey='';lastKey='';tick(true);syncStudyFields();};
  $('[data-offset]').onchange=e=>{offset=+e.target.value;lastKey='';tick(true);};
  $('[data-play-seal]').onclick=()=>audio.play(sky.seal.map(x=>x.cell),s=>{if(!disposed)$('[data-seal-audio]').textContent=s;}).catch(fail);
  $('[data-stop-seal]').onclick=()=>{audio.stop();$('[data-seal-audio]').textContent='Stopped.';};
  $('[data-sky-map]').onclick=e=>{const rect=e.currentTarget.getBoundingClientRect(),x=(e.clientX-rect.left)*900/rect.width,y=(e.clientY-rect.top)*500/rect.height;
    const hit=hitTargets.map(h=>({...h,d:Math.hypot(h.x-x,h.y-y)})).filter(h=>h.d<14).sort((a,b)=>a.d-b.d)[0];if(hit)select(hit.id);};
  function practice(){const name=$('[data-practice]').value,p=S.PRACTICES[name],phrase=S.practicePhrase(name);$('[data-practice-text]').innerHTML=`<p>${esc(p.question)}</p><p>${native(phrase)}</p><p class="sky-small">${esc(phrase)}</p>`;}
  $('[data-practice]').onchange=practice;practice();
  async function action(op,payload){if(busy)return;busy=true;try{const result=await api.action(op,payload);if(!result)throw Error('The action did not complete.');lastNotebook='';refreshNotebook();status(result.message||'Your encounter is recorded.');}catch(e){fail(e);}finally{busy=false;}}
  $('[data-keep-sky]').onclick=()=>{if(study||offset!==0)return status('Return to the town sky to keep a live encounter. You can export a study chart.');action('observe',{practice:$('[data-practice]').value});};
  $('[data-export-sky]').onclick=()=>{
    const object=sky.bodies.find(b=>b.name===selected)||field.find(s=>s.star.id===selected);
    const data={schema:'luma-sky-export-2',context:study?'study':'town',sky:S.skyRecord(sky),selected:object?.star?selectedStarRecord(object):object,
      allBodies:sky.bodies,relations:sky.relations,nodes:sky.nodes,events,planetaryHour:hour,catalogue:CATALOG_META,
      display:{view,hemisphere,magnitude,constellation,retainedCoordinates:dimension,projection:'Zenith/nadir-centered azimuthal equidistant; north up, east left'},
      score:{referenceHz:220,ratios:[1,9/8,5/4,3/2,5/3],secondsPerNote:.24,rule:'q = 5f + u; ratio[f] then ratio[u]; four silent note slots for an absent angle'},
      notebook:api.state().workshop.observations||[],works:api.state().workshop.records};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Luma_Sky_'+sky.utc.slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Your sky, score, source values and notebook are exported.');
  };
  function refreshNotebook(){
    const observations=api.state().workshop.observations||[],key=JSON.stringify(observations);if(key===lastNotebook)return;lastNotebook=key;
    $('[data-sky-notebook]').innerHTML=observations.length?observations.slice().reverse().map(o=>`<details class="sky-notebook-entry"><summary>${esc(S.PRACTICES[o.practice].title)} · ${esc(o.sky.utc.slice(0,16).replace('T',' '))} UTC</summary><p>${native(o.phrase)}</p><p class="sky-small">${esc(o.phrase)}</p><p>${esc(S.PRACTICES[o.practice].question)}</p>${o.actions.length?`<p class="sky-small">Workshop actions linked to this encounter: ${o.actions.map(a=>`${esc(api.recipeName(a.recipe))} applied · quality ${a.quality}`).join('; ')}.</p>`:'<p class="sky-small">No applied workshop object is linked to this encounter yet.</p>'}${o.reflections.map((r,i)=>`<blockquote><b>Reflection ${i+1}</b><p>${esc(r.text)}</p></blockquote>`).join('')}<label>What changed after you acted?<textarea data-reflection="${o.id}" maxlength="600" rows="3" placeholder="Describe the result, what stayed difficult, and what you would revise."></textarea></label><button data-save-reflection="${o.id}" ${o.reflections.length>=8?'disabled':''}>Save reflection</button></details>`).join(''):'<p class="sky-small">Your latest 24 encounters will remain here with their original sky, intention, and up to eight reflections each.</p>';
    root.querySelectorAll('[data-save-reflection]').forEach(b=>b.onclick=()=>action('reflect',{id:Number(b.dataset.saveReflection),text:$(`[data-reflection="${b.dataset.saveReflection}"]`).value}));
  }
  function updatePrefix(){const p=S.coordinatePrefix(sky.coordinates16,dimension);$('[data-coordinate-caption]').textContent=`${dimension} ambient coordinates · ${p.completePairs} complete angular pairs${p.unpaired?' · '+p.unpaired+(p.unpairedAvailable?' has only its cosine; two directions normally remain possible':' is undefined; its cosine is unavailable'):''}. Full sky: up to eight angular variables in sixteen coordinates. The original letter-feature coordinates remain a separate drawing system.`;}
  function updateLight(){
    const b=sky.bodies.find(b=>b.name===selected),f=field.find(x=>x.star.id===selected);root.querySelectorAll('[data-pick-body]').forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.pickBody===selected)));
    if(b){$('[data-selected-light]').innerHTML=`<span class="eyebrow">${esc(b.kind)} · ${b.altitude>=0?'ABOVE':'BELOW'} THE HORIZON</span><h4>${b.word?native(b.word)+' ':''}${b.name}</h4><p>${angle(b.altitude)} high · azimuth ${angle(b.azimuth)}</p><p>${S.SIGNS[S.sectorIndex(b.longitude,12)]} ${angle(b.longitude%30)} · ${esc(b.constellation)} constellation</p><p class="sky-small">${b.stationary?'Near station':b.retrograde?'Retrograde':'Direct'} · ${b.speed.toFixed(3)}° / day · ${b.distanceAu.toFixed(4)} AU from Earth</p><p class="sky-small">${b.name==='Moon'?`${(b.illumination*100).toFixed(1)}% illuminated · ${phaseName(sky.phase)}`:b.name==='Sun'?'The Sun’s altitude shapes the town’s daylight.':`Model visual magnitude ${b.magnitude.toFixed(1)}. Chart symbols are enlarged.`}</p>`;}
    else if(f){const s=f.star;$('[data-selected-light]').innerHTML=`<span class="eyebrow">${esc(s.id)} · ${f.altitude>=0?'ABOVE':'BELOW'} THE HORIZON</span><h4>${native('sira')} ${esc(s.name)}</h4><p>${angle(f.altitude)} high · azimuth ${angle(f.azimuth)}</p><p>${esc(s.constellation)} · magnitude ${s.mag.toFixed(2)} · ${esc(s.spectral)}</p><p class="sky-small">Catalogue J2000: RA ${(s.ra/15).toFixed(4)}h · Dec ${angle(s.dec)}. Proper motion ${s.pmRA??'unset'}, ${s.pmDec??'unset'} arcsec / year.</p><p class="sky-small">${s.names.length?'IAU name witness: '+esc(s.names.join(', '))+'. A name can refer to a component of this catalogue system.':'The HR designation is preserved; no proper name has been invented.'}</p>`;}
  }
  function updateEvents(){
    const key=JSON.stringify([Math.floor(Date.parse(sky.utc)/1800000),sky.observer]);
    if(key!==eventKey||events.some(e=>e.utc&&Date.parse(e.utc)<=Date.parse(sky.utc))){eventKey=key;events=S.skyEvents(sky.utc,sky.observer);
      $('[data-sky-events]').innerHTML=events.map(e=>`<button data-sky-event="${e.utc||''}" ${e.utc?'':'disabled'} title="${esc(e.scope)}"><span>${esc(e.title)}</span><small>${dateLabel(e.utc)}</small>${e.utc?'<em>Explore ↗</em>':''}</button>`).join('');
      root.querySelectorAll('[data-sky-event]').forEach(b=>b.onclick=()=>{try{enterStudy(b.dataset.skyEvent);}catch(e){fail(e);}});
    }
    if(!hour||hour.locationKey!==JSON.stringify(sky.observer)||Date.parse(sky.utc)<Date.parse(hour.start)||Date.parse(sky.utc)>=Date.parse(hour.end)||!hour.available){hour={...S.planetaryHour(sky.utc,sky.observer,0),locationKey:JSON.stringify(sky.observer)};}
    $('[data-planetary-hour]').textContent=hour.available?`Unequal hour ${hour.number}: ${hour.ruler} · ${hour.minutes.toFixed(1)} sky minutes. Weekday convention: UTC at sunrise. An authored practice may follow this ruler.`:'Planetary hour unavailable: '+hour.reason;
  }
  function tick(force=false){
    if(disposed)return;const ms=api.now();if(!force&&Math.abs(ms-lastTick)<450)return;lastTick=ms;
    try{
      const next=currentSky(),key=JSON.stringify([next.utc,next.observer,offset,selected]);if(!force&&key===lastKey){refreshNotebook();return;}lastKey=key;sky=next;field=stellarField(sky);
      $('[data-sky-clock-mode]').textContent=study?'Study sky · held':offset?'Town sky · custom origin':'Town sky · live';$('[data-sky-clock-mode]').classList.toggle('studying',!!study||offset!==0);
      $('[data-keep-sky]').disabled=!!study||offset!==0;
      $('[data-sky-facts]').innerHTML=`<span><b>${angle(sky.solarAltitude)}</b><small>Sun above horizon</small></span><span><b>${(sky.moonLight*100).toFixed(1)}%</b><small>Moon illuminated</small></span><span><b>${sky.relations.tithi}</b><small>Instantaneous tithi</small></span><span><b>${sky.utc.slice(11,16)}</b><small>${sky.utc.slice(0,10)} UTC</small></span>`;
      if(!$('[data-play-cell]')){
        $('[data-sky-seal]').innerHTML=sky.seal.map((s,i)=>`<button data-play-cell="${i}"><small>${s.body}</small><span class="luma-native"></span><code></code><small data-bin></small></button>`).join('');
        root.querySelectorAll('[data-play-cell]').forEach(b=>b.onclick=()=>audio.play([sky.seal[+b.dataset.playCell].cell],s=>{if(!disposed)$('[data-seal-audio]').textContent=s;}).catch(fail));
      }
      root.querySelectorAll('[data-play-cell]').forEach(b=>{const cell=sky.seal[+b.dataset.playCell].cell;b.disabled=!cell;b.querySelector('.luma-native').textContent=cell?cell.native:'∅';b.querySelector('code').textContent=cell?.latin||'undefined';b.querySelector('[data-bin]').textContent=cell?'bin '+cell.bin:'no rising angle';});
      const r=sky.relations,term=S.SOLAR_TERMS[r.solarTerm];
      $('[data-sky-cycles]').innerHTML=`<p><b>${phaseName(sky.phase)}</b><br>Elongation ${angle(sky.phase)} · ${r.waxing?'waxing':'waning'} half</p><p><b>${term[0]} · ${term[1]}</b><br>${term[2]} · solar sector ${r.solarTerm+1} of 24</p><p><b>${offset?S.NAKSHATRAS[r.nakshatra]:'Equal lunar division '+(r.nakshatra+1)}</b><br>Quarter ${r.pada} · 108-cell address ${r.address} · ${offset?'custom offset, modern Aśvinī-first convention':'tropical geometry study'}</p><p><b>Moon’s letter sector ${r.letter+1}</b> ${native(ALPHABET[r.letter])}<br>20 letters × 18°; 12 signs × 30°; one uniform 60-tick grid.</p><p class="sky-small">Ascending node ${angle(sky.nodes.ascending)} · descending node ${angle(sky.nodes.descending)} · osculating tropical longitudes. Paired crossings, not additional planets.</p>`;
      $('[data-body-table]').innerHTML=sky.bodies.map(b=>`<tr><td>${b.name}</td><td>${angle(b.longitude)}</td><td>${angle(b.altitude)}</td><td>${b.stationary?'Near station':b.retrograde?'Retrograde':'Direct'}</td><td>${esc(b.constellation)}</td></tr>`).join('');
      $('[data-sky-provenance]').textContent=`${S.SKY_MODEL.engine}; ${sky.offsetDefinition}. Observer ${sky.observer.latitude}°, ${sky.observer.longitude}°, ${sky.observer.elevation} m. TT−UT ${sky.time.deltaTSeconds.toFixed(2)} s under the recorded time model. Moon coordinates follow the upstream geometric branch. Stellar astrometry is an educational approximation; parallax and annual aberration are not modeled.`;
      updateLight();updatePrefix();updateEvents();refreshNotebook();paint();
    }catch(e){fail(e);}
  }
  function paint(){
    if(!sky)return;const canvas=$('[data-sky-map]'),c=canvas.getContext('2d');if(!c)return;hitTargets=[];c.clearRect(0,0,900,500);
    const g=c.createRadialGradient(450,245,5,450,245,440);g.addColorStop(0,'#17283e');g.addColorStop(.65,'#0a1426');g.addColorStop(1,'#040a15');c.fillStyle=g;c.fillRect(0,0,900,500);
    if(view==='dome'){hitTargets=paintDome(c,sky,field,{hemisphere,magnitude,constellation,selected});caption=`${hemisphere==='above'?'Zenith':'Nadir'} at centre · horizon at rim · north up, east left · chart light reveals stars even in daytime. Ecliptic in gold; equator in blue; galactic equator in violet.`;}
    else if(view==='rings'){paintRings(c,sky,selected);caption='One circle, several readings: 20 Luma letters, 12 signs, 27 divisions and 108 quarters. The common letter/sign grid has 60 uniform ticks.';}
    else {paintCoordinates(c,sky,dimension);caption='Each even step completes another longitude. At an odd step, the next cosine leaves two possible directions. Grey coordinates are omitted.';}
    $('[data-map-caption]').textContent=caption;
  }
  tick(true);syncStudyFields();return {tick,refresh:refreshNotebook,dispose(){disposed=true;audio.dispose();root.innerHTML='';}};
}

export function paintDome(c,sky,field,{hemisphere='above',magnitude=6,constellation='',selected='Moon'}={}){
  const cx=450,cy=247,r=210,below=hemisphere==='below',hits=[];
  c.lineWidth=1;c.strokeStyle='#8faec529';
  for(const radius of [r/3,2*r/3,r]){c.beginPath();c.arc(cx,cy,radius,0,Math.PI*2);c.stroke();}
  for(let a=0;a<360;a+=30){const p=domePoint(a,0,cx,cy,r,below);c.beginPath();c.moveTo(cx,cy);c.lineTo(...p);c.stroke();}
  c.textAlign='center';c.font='12px system-ui';c.fillStyle='#9eb8cf';
  for(const [az,name] of [[0,'N'],[90,'E'],[180,'S'],[270,'W']]){const p=domePoint(az,0,cx,cy,r+18,below);c.fillText(name,p[0],p[1]+4);}
  const guides=skyGuides(sky);
  guides.forEach((guide,i)=>{c.strokeStyle=['#b7985666','#7aabd655','#ad87db44'][i];c.beginPath();let connected=false;
    for(const p of guide.points){const xy=domePoint(p.azimuth,p.altitude,cx,cy,r,below);if(xy){connected?c.lineTo(...xy):c.moveTo(...xy);connected=true;}else connected=false;}c.stroke();});
  let count=0;
  for(const f of field){const s=f.star;if(s.mag>magnitude||constellation&&s.constellation!==constellation)continue;const p=domePoint(f.azimuth,f.altitude,cx,cy,r,below);if(!p)continue;count++;
    c.fillStyle=starColor(s.bv);c.globalAlpha=Math.max(.25,Math.min(1,1.15-s.mag*.1));c.beginPath();c.arc(...p,Math.max(.45,2.1-s.mag*.24),0,Math.PI*2);c.fill();hits.push({id:s.id,x:p[0],y:p[1]});
    if(s.id===selected||s.mag<1.1&&s.names.length){c.globalAlpha=1;c.font=s.id===selected?'bold 13px system-ui':'11px system-ui';c.textAlign='left';c.fillText(s.name,p[0]+7,p[1]-7);}
    if(s.id===selected){c.strokeStyle='#ffe7b5';c.beginPath();c.arc(...p,8,0,Math.PI*2);c.stroke();}
  }
  c.globalAlpha=1;
  for(const b of sky.bodies){const p=domePoint(b.azimuth,b.altitude,cx,cy,r,below);if(!p)continue;
    c.fillStyle=b.color;c.shadowColor=b.color;c.shadowBlur=b.name==='Sun'?18:7;c.beginPath();c.arc(...p,b.name==='Sun'?7:b.name==='Moon'?6:3,0,Math.PI*2);c.fill();c.shadowBlur=0;
    if(b.name==='Moon')paintMoon(c,p[0],p[1],6,b.illumination,sky.relations.waxing);
    c.fillStyle=b.color;c.font='12px system-ui';c.textAlign='left';c.fillText(b.name,p[0]+9,p[1]+13);hits.push({id:b.name,x:p[0],y:p[1]});
    if(b.name===selected){c.strokeStyle='#ffe7b5';c.beginPath();c.arc(...p,11,0,Math.PI*2);c.stroke();}
  }
  c.fillStyle='#90adc3';c.textAlign='left';c.font='12px system-ui';c.fillText(`${count.toLocaleString()} catalogue stars in this view`,20,25);
  c.fillText(`${sky.observer.latitude}° latitude · ${sky.observer.longitude}° longitude`,20,46);
  c.textAlign='right';c.fillText(below?'The ground hides this hemisphere':'Above your selected horizon',880,25);
  return hits;
}
// An enlarged phase diagram. Lit area is exactly k times the projected disc;
// waxing/waning orientation is diagrammatic, not a telescope position angle.
export function paintMoon(c,x,y,r,k,waxing){
  c.save();c.translate(x,y);if(!waxing)c.scale(-1,1);c.fillStyle='#152033';c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();
  c.fillStyle='#d2e7ff';c.beginPath();c.arc(0,0,r,-Math.PI/2,Math.PI/2);
  for(let i=0;i<=40;i++){const yy=1-i/20;c.lineTo((1-2*k)*Math.sqrt(Math.max(0,1-yy*yy))*r,yy*r);}c.closePath();c.fill();c.restore();
}
export function paintRings(c,sky,selected){
  const cx=450,cy=247,r=180,point=(deg,radius)=>[cx+Math.sin(deg*S.DEG)*radius,cy-Math.cos(deg*S.DEG)*radius];
  c.font='11px system-ui';c.textAlign='center';c.lineWidth=1;
  for(const [radius,count] of [[222,20],[190,12],[151,27],[132,108]]){
    c.strokeStyle='#8bb1ce44';c.beginPath();c.arc(cx,cy,radius,0,Math.PI*2);c.stroke();
    for(let i=0;i<count;i++){const a=i*360/count,p=point(a,radius),q=point(a,radius-10);c.beginPath();c.moveTo(...p);c.lineTo(...q);c.stroke();
      if(count===20){const xy=point(a+9,radius+10);c.strokeStyle='#d6e4ec';c.fillStyle='#d6e4ec';drawGlyph(c,ALPHABET[i],xy[0]-10,xy[1]-10,20);c.strokeStyle='#8bb1ce44';}
      if(count===12){const xy=point(a+15,radius-17);c.fillStyle='#b9c3d6';c.fillText(S.SIGNS[i].slice(0,3),...xy);}
    }
  }
  for(let i=0;i<60;i++){c.strokeStyle=i%5===0?'#e0bd8577':'#80aacc33';const p=point(i*6,203),q=point(i*6,208);c.beginPath();c.moveTo(...p);c.lineTo(...q);c.stroke();}
  for(const aspect of sky.aspects){const a=sky.bodies.find(b=>b.name===aspect.a),b=sky.bodies.find(b=>b.name===aspect.b);c.strokeStyle=`rgba(158,188,223,${.08+aspect.strength*.24})`;c.beginPath();c.moveTo(...point(a.longitude,111));c.lineTo(...point(b.longitude,111));c.stroke();}
  for(const [i,b] of sky.bodies.entries()){const p=point(b.longitude,111);c.fillStyle=b.color;c.beginPath();c.arc(...p,b.name===selected?5:3,0,Math.PI*2);c.fill();c.font='12px system-ui';c.textAlign='left';c.fillText(b.name,713,100+i*27);c.textAlign='right';c.fillText(b.longitude.toFixed(1)+'°',878,100+i*27);if(b.name===selected){c.strokeStyle='#eed6a1';c.beginPath();c.arc(...p,9,0,Math.PI*2);c.stroke();}c.textAlign='center';}
  for(const [name,a] of [['ASC',sky.angles.ascendant],['MC',sky.angles.midheaven]])if(a!==null){const p=point(S.wrap(a-sky.offset),196);c.fillStyle='#f2d598';c.fillText(name,...p);}
  c.textAlign='left';c.fillStyle='#d3bf96';c.font='12px system-ui';c.fillText('0° at the top',24,144);c.fillStyle='#9db5cc';c.fillText('20 × 18°',24,50);c.fillText('12 × 30°',24,71);c.fillText('27 × 13°20′',24,92);c.fillText('108 × 3°20′',24,113);c.fillText(sky.offset?'Custom 24.2° offset':'Tropical',24,456);
}
export function paintCoordinates(c,sky,d){
  c.textAlign='center';c.font='13px system-ui';
  for(let i=0;i<8;i++){const cx=110+(i%4)*225,cy=130+Math.floor(i/4)*228,r=67,x=sky.coordinates16[2*i],y=sky.coordinates16[2*i+1],hasX=2*i<d,hasY=2*i+1<d;
    c.strokeStyle='#7596b444';c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.moveTo(cx-r,cy);c.lineTo(cx+r,cy);c.moveTo(cx,cy-r);c.lineTo(cx,cy+r);c.stroke();c.fillStyle='#a1b6ca';c.fillText(S.SEAL_ORDER[i],cx,cy-r-17);
    if(x===null){c.fillStyle='#bdadce';c.fillText('undefined',cx,cy+5);continue;}
    if(hasX&&!hasY){c.strokeStyle='#ddc48a';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+x*r,cy);c.stroke();for(const sign of [-1,1]){c.beginPath();c.arc(cx+x*r,cy+sign*Math.sqrt(Math.max(0,1-x*x))*r,4,0,Math.PI*2);c.stroke();}}
    if(hasY){c.strokeStyle='#9adddc';c.fillStyle='#cef3e9';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+x*r,cy-y*r);c.stroke();c.beginPath();c.arc(cx+x*r,cy-y*r,4,0,Math.PI*2);c.fill();}
    c.fillStyle=hasX?'#d0dfeb':'#6c809a';c.font='12px system-ui';c.fillText(`${hasX?x.toFixed(3):'omitted'} · ${hasY?y.toFixed(3):'omitted'}`,cx,cy+r+23);
  }
}
