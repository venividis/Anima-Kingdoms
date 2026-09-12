// Shared presentation and input mathematics. Values are world units / 60 Hz ticks.
export const COMBAT = Object.freeze({buffer:12, dodgeCost:24, dodgeFrames:36, dodgeTravel:24, dodgeSpeed:9, dodgeSafeMin:22, dodgeSafeMax:31});
export const MOVE_GUIDE = Object.freeze({
 palm:{short:'Palm',role:'Quick close strike',help:'Hold 1 or the Palm button to keep striking. Release to stop. Costs no Breath.',color:'#efd192'},
 reach:{short:'Reach',role:'Long thrust',help:'A deliberate thrust. Keep your target inside the narrow golden reach.',color:'#f5a66e'},
 note:{short:'Note',role:'Aimed projectile',help:'Aim at a target, then release a glass bolt. Cover stops it.',color:'#8ce4ee'},
 gale:{short:'Gale',role:'Radial crowd control',help:'Strike every foe within the ring and push them away. Save Breath for escape.',color:'#bba5fa'},
 creation:{short:'Relic',role:'Your authored power',help:'Uses the actual range, timing and Breath cost of your attuned creation.',color:'#a7e6bd'}
});
export function movementVector(forward,side,yaw=0){
 const length=Math.hypot(forward,side),scale=length>1?1/length:1;
 return [(side*Math.cos(yaw)-forward*Math.sin(yaw))*scale,(-side*Math.sin(yaw)-forward*Math.cos(yaw))*scale];
}
export function stickVector(dx,dy,radius=48){
 const length=Math.hypot(dx,dy),dead=.13;
 if(length<radius*dead)return [0,0];
 const magnitude=Math.min(1,(length/radius-dead)/(1-dead));
 return [dx/length*magnitude,dy/length*magnitude];
}
export function actionPhase(actor,moves){
 const a=actor.action,m=a&&(a.move||moves[a.kind]);
 if(actor.dead||actor.hp<=0)return {phase:'down',remaining:actor.dead||0,progress:0};
 if(actor.dodge)return {phase:actor.dodge>12?'evading':'recovering',remaining:actor.dodge,progress:1-actor.dodge/COMBAT.dodgeFrames};
 if(!a)return {phase:actor.guard?'guarding':'ready',remaining:0,progress:1};
 if(!m)return {phase:'staggered',remaining:Math.max(0,24-a.frame),progress:a.frame/24};
 const total=m.startup+m.active+m.recovery;
 return {phase:a.frame<m.startup?'windup':a.frame<m.startup+m.active?'strike':'recovery',remaining:Math.max(0,total-a.frame),progress:a.frame/total,move:m,kind:a.kind};
}
export function attackShape(actor,moves){
 const a=actor.action,m=a&&(a.move||moves[a.kind]);if(!m)return null;
 const phase=actionPhase(actor,moves),angle=a.angle??actor.angle;
 return {x:actor.x,z:actor.z,angle,kind:a.kind,verb:m.verb,phase:phase.phase,progress:phase.progress,reach:m.reach,arc:m.arc??.08,projectile:a.kind==='note'||!!m.projectile,color:MOVE_GUIDE[a.kind]?.color||MOVE_GUIDE.creation.color};
}
export function dangerShapes(actor){
 const g=actor.telegraph;if(!g)return [];
 const base={x:g.x,z:g.z,angle:actor.angle,progress:1-g.timer/g.total};
 if(g.kind==='ring')return [{...base,kind:'ring',reach:g.radius,arc:Math.PI*2}];
 if(g.kind==='sweep')return [{...base,kind:'sweep',reach:5,arc:2.6}];
 return (actor.phase===3?[-.22,0,.22]:[0]).map(offset=>({...base,kind:'shot',angle:actor.angle+offset,reach:25,arc:.055}));
}

// Shift changes event.key to punctuation on number keys; identity must survive release.
export function combatKey(event){return /^Digit[0-9]$/.test(event.code||'')?event.code.slice(5):String(event.key||'').toLowerCase();}
