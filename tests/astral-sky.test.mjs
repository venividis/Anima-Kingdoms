import test from 'node:test';
import assert from 'node:assert/strict';
import {skyAt} from '../public/cosmos.js';
import {WORLDS} from '../public/astral-data.js';
import {stellarField} from '../public/sky-observer.js';
import {skyCamera,skyProject,skyPaths,pathWorlds,AstralSky} from '../public/astral-sky.js';
import {departurePose,restingTransform} from '../public/astral-departure.js';

test('two full hemispheres expose the complete existing catalogue and every Solar System path',()=>{
 const sky=skyAt(0),field=stellarField(sky),above=skyCamera(),below={...above,pitch:-90};
 assert.equal(field.length,9096);assert.equal(new Set(field.map(s=>s.star.constellation)).size,88);
 for(const [w,h]of [[1280,800],[390,844],[844,390]])for(const s of [...field,...skyPaths(sky)]){
  const a=skyProject(s,above,w,h),b=skyProject(s,below,w,h);assert.ok(a||b,s.star?.name||s.name);
  for(const p of [a,b].filter(Boolean))assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=w&&p.y>=0&&p.y<=h);
 }
 const reachable=new Set(['earth',...skyPaths(sky).map(p=>p.id)].flatMap(id=>pathWorlds(id).map(w=>w.id)));
 assert.deepEqual([...reachable].sort(),WORLDS.map(w=>w.id).sort());
 for(const body of sky.bodies){const path=skyPaths(sky).find(p=>p.id===body.name.toLowerCase());assert.equal(path.altitude,body.altitude);assert.equal(path.azimuth,body.azimuth);}
});

test('the sky projection survives looking straight up, below, around the seam, and zooming; hit picking prefers the nearest planet',()=>{
 for(const pitch of [-90,-89.5,0,89.5,90])for(const yaw of [0,180,359.99,360])for(const zoom of [.65,1,4])for(const point of [{azimuth:0,altitude:90},{azimuth:359.99,altitude:0},{azimuth:180,altitude:-90}]){
  const p=skyProject(point,{pitch,yaw,zoom,dome:false},390,844);if(p)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
 }
 assert.equal(skyProject({azimuth:0,altitude:90},skyCamera(),1280,800).y,800*.48);
 const picker={targets:[{id:'star',type:'star',x:10,y:10,radius:8},{id:'jupiter',type:'world',x:12,y:10,radius:24},{id:'mars',type:'world',x:25,y:10,radius:24}]};
 assert.equal(AstralSky.prototype.pick.call(picker,11,10).id,'jupiter');assert.equal(AstralSky.prototype.pick.call(picker,25,10).id,'mars');assert.equal(AstralSky.prototype.pick.call(picker,500,500),null);
});

test('departure rests the rendered body and lifts its soul without mutating the body or camera',()=>{
 const hero={x:17,z:-11,y:0,angle:.7},camera={eye:[20,6,-1],target:[17,1,-11],yaw:.4},before=structuredClone({hero,camera});
 const start=departurePose(0,hero,camera);assert.deepEqual(start.eye,camera.eye);assert.deepEqual(start.target,camera.target);
 for(let i=0;i<=100;i++){const p=departurePose(i/100,hero,camera);assert.ok(p.eye.every(Number.isFinite)&&p.target.every(Number.isFinite));assert.ok(p.spiritY>=0&&p.spiritY<=7);assert.ok(restingTransform(hero,0,p.settle).every(Number.isFinite));assert.ok(Math.hypot(...p.eye.map((n,j)=>n-p.target[j]))>1);}
 const separate=departurePose(.58,hero,camera);assert.ok(separate.spiritY>5);assert.equal(separate.settle,1);
 const m=restingTransform(hero,0,1),head=[hero.x,1.8,hero.z,1],y=m[1]*head[0]+m[5]*head[1]+m[9]*head[2]+m[13];assert.ok(Math.abs(y-.32)<.00001,'The resting head lies just above the ground.');
 assert.deepEqual({hero,camera},before);
});
