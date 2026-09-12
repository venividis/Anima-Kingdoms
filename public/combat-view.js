import {MOVES, Creation, combatState} from './realm.js';
import {attackShape,dangerShapes,MOVE_GUIDE} from './combat.js';

// One set of authoritative combat cues for both the 3D and canvas renderers.
export class CombatOverlay {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');}
 draw(s,view,target=null,selected='palm',visible=true){
  const canvas=this.canvas,c=this.ctx;
  if(canvas.width!==innerWidth)canvas.width=innerWidth;
  if(canvas.height!==innerHeight)canvas.height=innerHeight;
  c.clearRect(0,0,canvas.width,canvas.height);if(!visible)return;
  const project=(x,z,y=.08)=>view.project(x,y,z);
  const path=(points,close=false)=>{c.beginPath();points.forEach(([x,z],i)=>{const p=project(x,z);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});if(close)c.closePath();};
  const arc=(x,z,r,angle=0,width=Math.PI*2)=>Array.from({length:41},(_,i)=>{const a=angle-width/2+width*i/40;return[x+Math.sin(a)*r,z+Math.cos(a)*r];});
  const shape=(g,color,fill,alpha)=>{
   c.save();c.globalAlpha=alpha;c.strokeStyle=color;c.fillStyle=color;c.lineWidth=2;
   const points=g.projectile||g.kind==='shot'?[[g.x,g.z],[g.x+Math.sin(g.angle)*g.reach,g.z+Math.cos(g.angle)*g.reach]]:g.arc>=6?arc(g.x,g.z,g.reach):[[g.x,g.z],...arc(g.x,g.z,g.reach,g.angle,g.arc),[g.x,g.z]];
   path(points,!g.projectile&&g.kind!=='shot');c.stroke();if(fill&&points.length>2){c.globalAlpha*=.16;c.fill();}c.restore();
  };
  for(const a of [s.hero,...s.enemies]){
   if(a.dead||a.hp<=0)continue;
   for(const g of dangerShapes(a))shape(g,'#ff776a',true,.5+g.progress*.5);
   const g=attackShape(a,MOVES);
   if(g){const alpha=g.phase==='strike'?1:g.phase==='windup'?.65:.22;shape(g,g.color,true,alpha);
    if(g.kind==='gale'){const ring={...g,reach:g.reach*(g.phase==='windup'?.15+.6*g.progress:Math.min(1,.5+g.progress)),arc:Math.PI*2};shape(ring,g.color,false,alpha);}
    if(g.projectile){const p=project(a.x+Math.sin(g.angle)*.7,a.z+Math.cos(g.angle)*.7,1.3);c.fillStyle=g.color;c.beginPath();c.arc(p.x,p.y,g.phase==='windup'?4+g.progress*15:5,0,Math.PI*2);c.fill();}
   }
   if(a.guard)shape({x:a.x,z:a.z,angle:a.angle,reach:1.3,arc:2.44},'#94e1ee',true,.9);
   if(a.dodge){const safe=a.dodge<=31&&a.dodge>21,angle=a.dodgeAngle??a.angle;shape({x:a.x,z:a.z,angle:angle+Math.PI,reach:1.6,arc:.3},safe?'#bdfcea':'#99c9c6',false,.85);}
  }
  if(target){
   c.strokeStyle='#f5dda3';c.lineWidth=2;path(arc(target.x,target.z,.95));c.stroke();
   const m=(selected==='creation'?Creation.activeMove(s):MOVES[selected])||MOVES.palm,angle=Math.atan2(target.x-s.hero.x,target.z-s.hero.z);
   c.setLineDash([5,6]);shape({x:s.hero.x,z:s.hero.z,angle,reach:Math.min(m.reach,Math.hypot(target.x-s.hero.x,target.z-s.hero.z)),projectile:true},MOVE_GUIDE[selected]?.color||'#eddaa4',false,.45);c.setLineDash([]);
  }
  for(const e of s.effects){const p=project(e.x,e.z,(e.y||1.6)+(35-e.life)*.025);c.save();c.globalAlpha=Math.min(1,e.life/10);c.font='bold 17px system-ui';c.textAlign='center';c.strokeStyle='#0b202c';c.lineWidth=4;c.strokeText(e.text,p.x,p.y);c.fillStyle=e.type==='guard'?'#98ecf4':e.type==='gold'?'#f6d47f':'#fff1de';c.fillText(e.text,p.x,p.y);c.restore();}
 }
}

export function updateCombatHUD(s,target,locked,selected){
 const $=id=>document.getElementById(id),h=s.hero,c=combatState(s),m=c.move;
 document.body.dataset.combatMode=s.activity?.training?'practice':s.mode;
 const phrase=c.phase==='ready'?'Ready':c.phase==='windup'?'Winding up':c.phase==='strike'?'Contact':c.phase==='recovery'?'Recovering':c.phase==='guarding'?'Guarding':c.phase==='evading'?'Evading':c.phase==='down'?'Returning to safety':'Recovering';
 const message=c.feedback||`${m?.name?m.name+' · ':''}${phrase}${c.remaining?' · '+(c.remaining/60).toFixed(1)+'s':''}${c.queued?' → '+(MOVES[c.queued]?.name||'Evade')+' queued':''}`;
 $('combat-readout').textContent=message;$('combat-readout').dataset.phase=c.phase;
 $('combat-progress').style.width=Math.round(c.progress*100)+'%';
 $('target-card').hidden=!target;
 if(target){const distance=Math.hypot(target.x-h.x,target.z-h.z),reach=(selected==='creation'?Creation.activeMove(s):MOVES[selected])?.reach||2.6;$('target-name').textContent=target.name;$('target-detail').textContent=`${locked?'Locked':'Aim assist'} · ${distance.toFixed(1)} m · ${distance<=reach?'In '+(MOVE_GUIDE[selected]?.short||'attack')+' range':'Move closer for '+(MOVE_GUIDE[selected]?.short||'this attack')}`;$('target-health').hidden=target.hp===undefined;if(target.hp!==undefined){$('target-health').max=target.maxHp;$('target-health').value=target.hp;}}
 $('target-cycle').textContent=locked?'Next target · Tab':'Target · Tab';
 for(const b of document.querySelectorAll('[data-action]')){const kind=b.dataset.action,move=MOVES[kind],cost=move?.cost??24;
  b.classList.toggle('selected-move',kind===selected);b.classList.toggle('queued-move',c.queued===kind);b.classList.toggle('active-move',h.action?.kind===kind||kind==='dodge'&&h.dodge>0);b.classList.toggle('low-breath',h.breath<cost);
  b.setAttribute('aria-label',`${move?.name||'Evade'}, ${cost} Breath${h.breath<cost?', need more Breath':''}${c.queued===kind?', queued':''}`);
  const state=b.querySelector('.move-state');if(state){const compact=innerWidth<=650;state.textContent=c.queued===kind?'Queued':h.action?.kind===kind?(compact?'Active':phrase):h.breath<cost?(compact?'Low':'LOW BREATH'):`${cost}${compact?'':' Breath'}`;}
 }
 $('practice-live').hidden=!s.activity?.training;
 if(s.activity?.training){const t=s.activity.training;$('practice-result').textContent=`${t.hits} hits · ${t.damage} damage · ${Object.keys(t.moves).filter(k=>MOVES[k]).length}/4 attacks landed`;
  for(const el of document.querySelectorAll('[data-practice-move]'))el.classList.toggle('complete',!!t.moves[el.dataset.practiceMove]);}
}
