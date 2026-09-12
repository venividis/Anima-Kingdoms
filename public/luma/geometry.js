/* Luma Origin's authored articulatory curves, adapted to inhabited objects.
   Sixteen features are coordinates in a drawing, not physical dimensions. */
import {ALPHABET, LETTERS, LEXICON, RATIOS} from './data.js';
import {parse, roleWord, toLatin} from './language.js';
import {seed} from '../creation.js';

export const SCHEMA = 'luma-creation-1';
export const SEGMENTS = 192;
export const CATALOG_TO_SCENE = Object.freeze([
  [0.8440076809988357,0.41440351018522054,0.34047138669958105],
  [-0.5215380221167146,0.4860793873214503,0.7012310038124304],
  [0.12509646638316005,-0.7694131269788496,0.6263819235347358]
].map(Object.freeze));
export const GEOMETRY_CONTRACT = Object.freeze({
  source:'origin.html: main script, rebuild/rotationsAt/vectorProject',
  formula:'x_j(t)=(0.25+b_j)*cos((j+1)*t+0.43*j+0.37*k)/4',
  segments:SEGMENTS, featureCount:16, mask:'First d coordinates; omitted coordinates set to zero before rotation.',
  rotationDegrees:105, phaseSeconds:0, celestialFrame:'Source ICRS catalogue orientation, epoch 2000.0; an artistic orientation.'
});
const byLetter = new Map(LETTERS.map(row=>[row.letter,row]));
const fail = message => {throw Error(message);};
const finite = x => typeof x==='number'&&Number.isFinite(x);
const dimension = d => {if(!Number.isInteger(d)||d<1||d>16)fail('Choose 1 to 16 retained feature coordinates.');return d;};
const noun = word => {
  if(typeof word!=='string'||word.length>24||!word.endsWith('a')||!Object.hasOwn(LEXICON,word.slice(0,-1))||![...word].every(c=>byLetter.has(c)))fail('Use an existing Luma dictionary noun for this form.');
  return word;
};
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
const round = n => Math.round(n*1e6)/1e6;
const part = (shape,x,y,z,w,h,d,color='#9cd7d4',role='ornament',yaw=0) => ({shape,x:round(x),y:round(y),z:round(z),w:round(w),h:round(h),d:round(d),color,role,yaw:round(yaw)});

export function rotationsAt(phase=0,rotation=105){
  if(!finite(phase)||!finite(rotation))fail('The projection needs finite rotation and phase values.');
  const angle=rotation*Math.PI/180, rotations=[];
  for(let j=0;j<15;j++){const q=.14*j+angle*(.31+.043*j)+phase*(.021+.001*j);rotations.push([j,j+1,Math.cos(q),Math.sin(q)]);}
  for(let j=0;j<8;j++){const q=.27*j+angle*.21;rotations.push([j,j+8,Math.cos(q),Math.sin(q)]);}
  return rotations;
}
export function featurePoint(letter,t,index=0){
  const row=byLetter.get(letter);if(!row||!finite(t)||!Number.isInteger(index)||index<0||index>512)fail('A curve needs a Luma letter, finite phase and a nonnegative character index.');
  return row.featureVector.map((b,j)=>(.25+b)*Math.cos((j+1)*t+.43*j+.37*index)/4);
}
export function vectorProject(vector,d=16,options={}){
  dimension(d);if(!Array.isArray(vector)||vector.length!==16||!vector.every(finite))fail('Project exactly sixteen finite feature coordinates.');
  const {phase=0,rotation=105,yaw=0,pitch=0}=options;if(![phase,rotation,yaw,pitch].every(finite))fail('Choose finite projection controls.');
  const a=vector.map((v,j)=>j<d?v:0);
  for(const[j,k,c,s]of rotationsAt(phase,rotation)){const x=a[j],y=a[k];a[j]=c*x-s*y;a[k]=s*x+c*y;}
  const first=a.slice(0,3).map(x=>x*2),v=CATALOG_TO_SCENE.map(row=>row.reduce((sum,x,j)=>sum+x*first[j],0));
  const c=Math.cos(yaw),s=Math.sin(yaw),x=c*v[0]+s*v[2],z=-s*v[0]+c*v[2],cp=Math.cos(pitch),sp=Math.sin(pitch);
  return[x,cp*v[1]-sp*z,sp*v[1]+cp*z];
}
export function letterCurve(letter,index=0){return Array.from({length:SEGMENTS+1},(_,n)=>featurePoint(letter,2*Math.PI*n/SEGMENTS,index));}
export function projectLetter(letter,d=16,index=0,options={}){dimension(d);return letterCurve(letter,index).map(v=>vectorProject(v,d,options));}
export function prefixClasses(d=16){dimension(d);return new Set(LETTERS.map(row=>row.featureVector.slice(0,d).join(''))).size;}

export function drawGlyph(ctx,letter,x=0,y=0,size=48){
  const row=byLetter.get(letter);if(!row||!finite(size)||size<=0)fail('Choose a source letter and a positive glyph size.');
  ctx.save();ctx.translate(x,y);ctx.scale(size/116,size/116);ctx.translate(8,8);ctx.lineWidth=2.8;ctx.lineCap='round';ctx.lineJoin='round';
  for(const stroke of row.glyph.strokes){ctx.beginPath();if(stroke.kind==='circle'){ctx.arc(stroke.cx,stroke.cy,stroke.r,0,Math.PI*2);if(stroke.filled)ctx.fill();ctx.stroke();continue;}
    for(const[op,...n]of stroke.commands){if(op==='M')ctx.moveTo(...n);else if(op==='L')ctx.lineTo(...n);else if(op==='Q')ctx.quadraticCurveTo(...n);else if(op==='C')ctx.bezierCurveTo(...n);else fail('Unsupported source glyph path.');}ctx.stroke();
  }ctx.restore();
}

export function lumaScoreNotes(word){
  noun(word);return [...word].flatMap((letter,letterIndex)=>{const q=ALPHABET.indexOf(letter);return [Math.floor(q/5),q%5].map((pitch,pairIndex)=>({pitch,frequency:220*RATIOS[pitch],ratio:RATIOS[pitch],code:'luma',letter,letterIndex,pairIndex}));});
}
export function kindForWord(word){noun(word);return word==='musa'||word==='sona'?'instrument':word==='wuna'?'creature':word==='liha'?'relic':word==='tapa'?'trial':'structure';}

export function validateInscription(luma){
  if(!luma||typeof luma!=='object'||Array.isArray(luma)||Object.keys(luma).sort().join()!=='dimension,schema,sentence,word'||luma.schema!==SCHEMA)fail('A Luma inscription needs its source word, sentence and retained dimension.');
  noun(luma.word);dimension(luma.dimension);
  if(typeof luma.sentence!=='string'||luma.sentence.length>384)fail('Keep the complete creation sentence within 384 characters.');
  const p=parse(luma.sentence);
  if(!['peli','bani'].includes(p.verb)||roleWord(p,'ta')!==luma.word)fail('The inscription must name this word as the theme of making or building.');
  return luma;
}
function identity(text){let n=2166136261;for(const c of text){n^=c.codePointAt(0);n=Math.imul(n,16777619);}return(n>>>0).toString(16).padStart(8,'0');}

export function blueprintForWord(word,sentence=`pe mi me peli ta ${word}.`,d=16){
  noun(word);dimension(d);const luma={schema:SCHEMA,word,sentence,dimension:d};validateInscription(luma);
  const b=seed(kindForWord(word));b.id='luma-'+word+'-'+d+'-'+identity(toLatin(sentence));b.name=word+' · '+LEXICON[word.slice(0,-1)].a;b.name=b.name.slice(0,64);b.luma=luma;
  const notes=lumaScoreNotes(word);b.power=4;b.reach=4;b.tempo=4;b.score=Array.from({length:8},(_,i)=>notes[i%notes.length].pitch);
  const points=[...word].map((c,i)=>vectorProject(featurePoint(c,2*Math.PI*((19+i*29)%SEGMENTS)/SEGMENTS,i),d));
  const marks=points.map((v,i)=>part(i%2?'spire':'orb',clamp(v[0]*1.7,-2,2),1.4+clamp(v[1],-.65,1),clamp(v[2]*1.7,-2,2),.18,.32,.18,'aeiou'.includes(word[i])?'#9cd7d4':'#e7c58c','light'));
  if(word==='yuna'){
    b.material='stone';b.parts=Array.from({length:5},(_,i)=>part('box',0,.08,(i-2)*3,3,.16,3,'#b9cbd3','walkway'));
    b.parts.push(...marks.map((p,i)=>({...p,x:i%2?1.35:-1.35,z:round(-6+12*i/Math.max(1,marks.length-1))})));
  }else if(word==='tula'){
    b.material='wood';b.parts=[part('box',-1.7,1.2,0,.25,2.4,3,'#a6b5a3','solid'),part('box',1.7,1.2,0,.25,2.4,3,'#a6b5a3','solid'),part('box',0,1.2,-1.4,3.2,2.4,.25,'#a6b5a3','solid'),part('box',0,2.7,0,3.9,.25,3.5,'#77b8b0'),...marks];
  }else if(b.kind==='instrument'){
    b.parts=[part('box',0,.18,0,2.7,.35,1.6,'#8b9caf'),...points.flatMap((v,i)=>notes.slice(i*2,i*2+2).map((note,j)=>part('spire',(i-(points.length-1)/2)*.47+(j-.5)*.16,.8+note.pitch*.16+v[1]*.12,v[2]*.25,.12,.9+note.pitch*.3,.12,j?'#e7c58c':'#9cd7d4','light')))];
  }else if(b.kind==='structure'){
    b.material='stone';b.parts=[part('box',0,.15,0,2.5,.3,2.5,'#7e9696'),...marks];
  }else{
    b.parts=b.parts.map((p,i)=>{if(p.role==='solid'||p.role==='walkway')return p;const v=points[i%points.length];return {...p,x:round(clamp(p.x+v[0]*.22,-8,8)),y:round(clamp(p.y+v[1]*.15,.05,8)),z:round(clamp(p.z+v[2]*.22,-8,8))};});
    b.parts.push(...marks);
  }
  return b;
}

// These are the very same local curves for both the canvas and 3D renderers.
const curveCache=new Map();
export function inscriptionCurves(luma){
  if(!luma)return[];noun(luma.word);dimension(luma.dimension);const key=luma.word+':'+luma.dimension;
  if(!curveCache.has(key)){
    const curves=[...luma.word].map((letter,index)=>({letter,index,points:projectLetter(letter,luma.dimension,index).map(p=>[p[0]*1.55,1.65+p[1]*.8,p[2]*1.55])}));
    if(curveCache.size>=128)curveCache.delete(curveCache.keys().next().value);curveCache.set(key,curves);
  }return curveCache.get(key);
}
