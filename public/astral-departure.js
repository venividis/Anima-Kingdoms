import {clamp} from './astral-model.js';
import {multiply,transform} from './engine.js';

const smooth=v=>{v=clamp(v,0,1);return v*v*(3-2*v);};
// Visual transforms only. The saved body, town clock and ordinary camera controls
// never become the flight camera or acquire a temporary position.
export function departurePose(progress,hero,camera){
 const settle=smooth(progress/.18),rise=smooth((progress-.14)/.55),look=smooth((progress-.57)/.38),yaw=camera.yaw;
 const h=hero.y||0,spiritY=h+rise*7;
 const eye=[hero.x+Math.sin(yaw)*8.5*(1-look*.75),h+3+rise*4,hero.z+Math.cos(yaw)*8.5*(1-look*.75)];
 const target=[hero.x, h+1+rise*4+look*35,hero.z-.5-look*2];
 const blend=smooth(progress/.16);
 return {settle,rise,look,spiritY,eye:eye.map((v,i)=>camera.eye[i]+(v-camera.eye[i])*blend),target:target.map((v,i)=>camera.target[i]+(v-camera.target[i])*blend)};
}

export function restingTransform(hero,ground,settle){
 const a=settle*Math.PI/2,c=Math.cos(a),s=Math.sin(a);
 const rx=new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]);
 const around=multiply(multiply(transform(hero.x,ground+.32*settle,hero.z,1,1,1,hero.angle),rx),transform(0,0,0,1,1,1,-hero.angle));
 return multiply(around,transform(-hero.x,-ground,-hero.z));
}
