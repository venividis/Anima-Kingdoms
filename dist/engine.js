/* Small dependency-free WebGL renderer: lit indexed world geometry and camera math. */
export const V={add:(a,b)=>a.map((v,i)=>v+b[i]),sub:(a,b)=>a.map((v,i)=>v-b[i]),mul:(a,s)=>a.map(v=>v*s),dot:(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm:a=>{let l=Math.hypot(...a)||1;return a.map(v=>v/l);}};
export function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
export function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
export function lookAt(eye,target){const z=V.norm(V.sub(eye,target)),x=V.norm(V.cross([0,1,0],z)),y=V.cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-V.dot(x,eye),-V.dot(y,eye),-V.dot(z,eye),1]);}
export function transform(x=0,y=0,z=0,sx=1,sy=1,sz=1,ry=0){let c=Math.cos(ry),s=Math.sin(ry);return new Float32Array([c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,x,y,z,1]);}
export function project(p,m,w,h){const v=[...p,1],o=[0,0,0,0];for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[r]+=m[k*4+r]*v[k];return{x:(o[0]/o[3]*.5+.5)*w,y:(-.5*o[1]/o[3]+.5)*h,visible:o[3]>0&&Math.abs(o[0]/o[3])<1.1&&Math.abs(o[1]/o[3])<1.1};}
export class Geometry{
 constructor(){this.data=[];}
 tri(a,b,c,color){let n=V.norm(V.cross(V.sub(b,a),V.sub(c,a)));for(const p of[a,b,c])this.data.push(...p,...n,...color);return this;}
 quad(a,b,c,d,col){this.tri(a,b,c,col);this.tri(a,c,d,col);return this;}
 box(x,y,z,sx,sy,sz,c){const p=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(a=>[x+a[0]*sx/2,y+a[1]*sy/2,z+a[2]*sz/2]);for(const f of[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]])this.quad(...f.map(i=>p[i]),c);return this;}
 cone(a,b,r1,r2,c,n=8){const axis=V.norm(V.sub(b,a)),u=V.norm(V.cross(axis,Math.abs(axis[1])>.9?[1,0,0]:[0,1,0])),v=V.cross(axis,u);for(let i=0;i<n;i++){let t=i/n*Math.PI*2,t2=(i+1)/n*Math.PI*2;const point=(p,r,t)=>V.add(p,V.add(V.mul(u,Math.cos(t)*r),V.mul(v,Math.sin(t)*r)));let p=point(a,r1,t),q=point(a,r1,t2),r=point(b,r2,t2),s=point(b,r2,t);this.quad(p,q,r,s,c);this.tri(a,q,p,c);this.tri(b,s,r,c);}return this;}
 sphere(x,y,z,rx,ry,rz,c,n=10,m=6){const p=(i,j)=>{let t=i/n*2*Math.PI,f=j/m*Math.PI;return[x+Math.sin(f)*Math.cos(t)*rx,y+Math.cos(f)*ry,z+Math.sin(f)*Math.sin(t)*rz];};for(let j=0;j<m;j++)for(let i=0;i<n;i++)this.quad(p(i,j),p(i+1,j),p(i+1,j+1),p(i,j+1),c);return this;}
 ring(x,y,z,r,thick,c,n=36){for(let i=0;i<n;i++){let a=i/n*Math.PI*2,b=(i+1)/n*Math.PI*2;this.cone([x+Math.cos(a)*r,y,z+Math.sin(a)*r],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],thick,thick,c,5);}return this;}
}
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 position;layout(location=1) in vec3 normal;layout(location=2) in vec3 color;
uniform mat4 vp;uniform mat4 model;uniform float time;uniform float sway;
out vec3 world;out vec3 n;out vec3 c;
void main(){vec3 p=position;p.x+=sin(time*1.2+p.x*.7+p.z*.3)*max(0.,p.y)*sway;vec4 w=model*vec4(p,1.);world=w.xyz;n=normalize(mat3(model)*normal);c=color;gl_Position=vp*w;}`;
const FS=`#version 300 es
precision highp float;in vec3 world;in vec3 n;in vec3 c;uniform vec3 eye;uniform vec3 tint;uniform float glow;uniform float alpha;out vec4 frag;
void main(){vec3 N=normalize(n);float sun=max(0.,dot(N,normalize(vec3(-.35,.8,.45))));float sky=.4+.17*max(0.,N.y);float rim=pow(1.-max(0.,dot(N,normalize(eye-world))),3.)*.15;vec3 col=c*tint*(sky+sun*.55+glow)+vec3(.15,.33,.31)*rim;float fog=1.-exp(-length(eye-world)*.0055);col=mix(col,vec3(.13,.28,.29),fog);col=pow(max(col,vec3(0.)),vec3(.88));frag=vec4(col,alpha);}`;
export class Renderer{
 constructor(canvas){const gl=canvas.getContext('webgl2',{antialias:true,alpha:true,powerPreference:'high-performance'});if(!gl)throw Error('This world needs WebGL 2. Try an up-to-date Chrome, Edge, Firefox or Safari with hardware acceleration enabled.');this.gl=gl;this.canvas=canvas;this.meshes=[];const shader=(type,src)=>{let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};this.program=gl.createProgram();gl.attachShader(this.program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(this.program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(this.program));gl.useProgram(this.program);this.u={};for(const k of['vp','model','time','sway','eye','tint','glow','alpha'])this.u[k]=gl.getUniformLocation(this.program,k);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);this.dpr=Math.min(devicePixelRatio||1,1.6);}
 mesh(g){const gl=this.gl,vao=gl.createVertexArray(),buffer=gl.createBuffer();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(g.data),gl.STATIC_DRAW);for(let i=0;i<3;i++){gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,3,gl.FLOAT,false,36,i*12);}const m={vao,buffer,count:g.data.length/9};this.meshes.push(m);return m;}
 dispose(m){this.gl.deleteBuffer(m.buffer);this.gl.deleteVertexArray(m.vao);this.meshes=this.meshes.filter(x=>x!==m);}
 begin(eye,target,t,ortho=false){const gl=this.gl,w=Math.round(innerWidth*this.dpr),h=Math.round(innerHeight*this.dpr);if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);this.vp=multiply(perspective(ortho?.8:1.02,w/h,.15,450),lookAt(eye,target));gl.uniformMatrix4fv(this.u.vp,false,this.vp);gl.uniform3fv(this.u.eye,eye);gl.uniform1f(this.u.time,t);}
 draw(mesh,m=transform(),opts={}){const gl=this.gl;gl.bindVertexArray(mesh.vao);gl.uniformMatrix4fv(this.u.model,false,m);gl.uniform3fv(this.u.tint,opts.tint||[1,1,1]);gl.uniform1f(this.u.glow,opts.glow||0);gl.uniform1f(this.u.sway,opts.sway||0);gl.uniform1f(this.u.alpha,opts.alpha??1);gl.drawArrays(gl.TRIANGLES,0,mesh.count);}
}
