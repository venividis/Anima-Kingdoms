import { ALPHABET, FEATURES, LETTERS, LEXICON, DICTIONARY, RATIOS, RATIO_NAMES } from './data.js';
import { LumaNumbers } from './numbers.js';

// The alphabet, dictionary and numeral core are retained source data. This small
// parser is Anima's declared register adapter, checked against 41 source ASTs.
// It never removes an unrecognized token to make an action executable.
export const PARTICLES = Object.freeze({
  a:'marks direct experience',e:'marks inference',i:'marks imagination',u:'marks intention',
  hu:'leaves the source unspecified',mu:'marks reported information',mi:'I',ti:'you',
  ni:'we, including the listener',pi:'we, excluding the listener',si:'one other',sa:'others',
  me:'marks the predicate',ta:'introduces the theme',li:'introduces a recipient or beneficiary',
  su:'introduces a companion',ki:'introduces a means',la:'introduces a location',
  ra:'introduces a purpose',ri:'introduces a source',ru:'introduces a cause',
  wi:'introduces a containing whole',lu:'introduces an analogy',di:'introduces an origin',
  du:'introduces a destination',to:'introduces a time anchor',ba:'introduces a comparison',
  le:'every member of the relevant domain',we:'plural',wo:'some',ke:'marks a question',
  pe:'marks an undertaking',fa:'marks an invitation',so:'marks a directive',
  nu:'negates the predicate, or refuses in a response',te:'accepts in a response',
  na:'at the reference time',pa:'before the reference time',wa:'after the reference time',
  do:'ongoing',go:'completed',ro:'habitual',he:'acknowledges an expressive remainder',
  ne:'and',ha:'inclusive or',re:'associated with',mo:'more',fo:'less',ma:'the question variable',
  yi:'the head of this relative clause',ya:'opens a dictated bracket',ye:'closes a dictated bracket',
  ho:'marks a dictated sentence boundary',gi:'begins an alphabetic numeral',
  ge:'begins a numeric numeral',gu:'ends a spoken numeral'
});
const BY_WORD = new Map(DICTIONARY.map(row => [row.word, row]));
const BY_LETTER = new Map(LETTERS.map(row => [row.letter, row]));
const CLASSES = {a:'noun',e:'quality',i:'verb',o:'agent',u:'manner'};
const ENDINGS = Object.fromEntries(Object.entries(CLASSES).map(([k,v])=>[v,k]));
const PRONOUNS = new Set(['mi','ti','ni','pi','si','sa','ma','yi']);
const ROLES = new Set(['ta','li','su','ki','la','ra','ri','ru','wi','lu','di','du','to','ba']);
const FORCES = new Set(['pe','ke','fa','so']);
const STANCES = new Set(['a','e','i','u','hu','mu']);
const TIMES = new Set(['na','pa','wa']);
const ASPECTS = new Set(['do','go','ro']);
const MAX_CHARS = 512, MAX_TOKENS = 128, MAX_DEPTH = 8;

export class LumaError extends Error {
  constructor(message, code = 'INVALID_LUMA') { super(message); this.name = 'LumaError'; this.code = code; }
}
function fail(message) { throw new LumaError(message); }
function validText(text, limit = 8192) {
  if (typeof text !== 'string') fail('Luma writing must be text.');
  if ([...text].length > limit) fail(`Use at most ${limit} characters.`);
  for (const c of text) { const n=c.codePointAt(0); if(n>=0xD800&&n<=0xDFFF) fail('Unpaired Unicode surrogate.'); }
  return text;
}

// normalizeWritten preserves every JSON-quoted spelling. Compact numerals are
// accepted only within # blocks. Conversion is separate from grammar validation.
export function toLatin(text) {
  validText(text);
  const normalized = LumaNumbers.normalizeWritten(text);
  let quoted=false, escaped=false, number=false;
  for (const c of normalized) {
    if (quoted) { if(c==='"'&&!escaped) quoted=false; escaped=c==='\\'&&!escaped; continue; }
    if(c==='"') { quoted=true; escaped=false; number=false; continue; }
    if(c==='#') { number=true; continue; }
    if(/\s/u.test(c)||'[]().?!'.includes(c)) number=false;
    if(ALPHABET.includes(c)||/\s/u.test(c)||'.[](),?!#-/:;+=\''.includes(c)) continue;
    if(number&&ALPHABET.includes(c.toLowerCase())) continue;
    fail(`Unsupported unquoted character ${JSON.stringify(c)}. Preserve a borrowed name in JSON quotes.`);
  }
  if(quoted) fail('A quotation needs its closing double quote.');
  return normalized;
}
export function toNative(text) {
  return LumaNumbers.nativeSentence(toLatin(text));
}
export function letter(value) {
  const latin=toLatin(value);
  return [...latin].length===1 ? BY_LETTER.get(latin)??null : null;
}
export function inspectWord(value) {
  const word=toLatin(value);
  const row=BY_WORD.get(word);
  if(row) return {...row,native:toNative(word)};
  if(Object.hasOwn(PARTICLES,word)) return {word,root:null,ending:null,class:'particle',domain:'Grammar',gloss:PARTICLES[word],native:toNative(word)};
  return null;
}
function sourceWord(word) {
  const row=BY_WORD.get(word);
  if(!row) fail(`Unknown Luma word ${JSON.stringify(word)}. Use an existing dictionary form or quote a name.`);
  return {type:'word',stems:[row.root],class:row.class};
}
function spellingOf(head) {
  if(!head) return null;
  if(head.type==='word') return head.stems.join('-')+(ENDINGS[head.class]??'');
  if(head.type==='pronoun') return head.value;
  return null;
}

function tokenize(input, limit = MAX_CHARS) {
  validText(input,limit);
  const text=toLatin(input), tokens=[];
  let i=0;
  const push=t=>{ tokens.push(t); if(tokens.length>MAX_TOKENS) fail(`Use at most ${MAX_TOKENS} tokens.`); };
  while(i<text.length) {
    if(/\s/u.test(text[i])) { i++; continue; }
    const start=i, c=text[i];
    if(c==='"') {
      i++; let escaped=false,closed=false;
      while(i<text.length) { const x=text[i++]; if(x==='"'&&!escaped) {closed=true;break;} escaped=x==='\\'&&!escaped; }
      if(!closed) fail('A quotation needs its closing double quote.');
      const raw=text.slice(start,i); let value;
      try { value=JSON.parse(raw); } catch { fail('Names must use valid JSON quotation and escaping.'); }
      validText(value);
      push({type:'name',value,raw,start,end:i}); continue;
    }
    if('[]?.!'.includes(c)) { i++;push({type:c,value:c,raw:c,start,end:i});continue; }
    if(c==='#') {
      i++;
      while(i<text.length&&!/[\s\[\].?!"]/u.test(text[i])) i++;
      const raw=text.slice(start,i);let value;
      try { value=LumaNumbers.parseLuma(raw); } catch(e) { fail(e.message); }
      push({type:'number',value,raw,start,end:i});continue;
    }
    if(ALPHABET.includes(c)) {
      i++;while(i<text.length&&ALPHABET.includes(text[i])) i++;
      const raw=text.slice(start,i);push({type:'word',value:raw,raw,start,end:i});continue;
    }
    fail(`Unsupported grammar at ${JSON.stringify(text.slice(start,start+16))}. No text was ignored.`);
  }
  return {text,tokens};
}

export function parseDocument(input) {
  const {tokens}=tokenize(input); let at=0;
  const peek=()=>tokens[at];
  const take=()=>tokens[at++];
  const wordIn=set=>peek()?.type==='word'&&set.has(peek().value);
  function expect(value) { if(peek()?.value!==value) fail(`Expected ${value}${peek()?`, received ${peek().raw}`:' at the end of the phrase'}.`); return take(); }
  function nounPhrase(depth) {
    if(depth>MAX_DEPTH) fail(`Use at most ${MAX_DEPTH} bracket levels.`);
    if(peek()?.type==='[') {take();const nested=document(depth+1,true);expect(']');return nested;}
    let quantifier=null;
    if(peek()?.type==='number') { const v=take().value;quantifier={type:'number',numerator:v.n.toString(),denominator:v.d.toString(),notation:'alphabetic'}; }
    const t=take();if(!t) fail('A role or subject needs a noun, pronoun, quoted name, or bracketed clause.');
    let head;
    if(t.type==='name') head={type:'name',value:t.value};
    else if(t.type==='word'&&PRONOUNS.has(t.value)) head={type:'pronoun',value:t.value};
    else if(t.type==='word') { head=sourceWord(t.value); if(!['noun','agent'].includes(head.class)) fail('A noun phrase needs a noun or agent form.'); }
    else fail('A noun phrase needs a noun, pronoun, or quoted name.');
    const adjectives=[];
    while(peek()?.type==='word'&&BY_WORD.get(peek().value)?.class==='quality') adjectives.push(sourceWord(take().value));
    return {type:'nounPhrase',quantifier,head,adjectives,relatives:[]};
  }
  function clause(depth) {
    const force=wordIn(FORCES)?take().value:null;
    const stance=wordIn(STANCES)?take().value:null;
    const time=wordIn(TIMES)?take().value:null;
    const aspect=wordIn(ASPECTS)?take().value:null;
    const subject=nounPhrase(depth);
    if(subject.type!=='nounPhrase') fail('This register requires a noun-phrase subject.');
    expect('me');
    const negated=peek()?.type==='word'&&peek().value==='nu';if(negated) take();
    const verb=take();if(verb?.type!=='word') fail('The predicate needs a Luma verb.');
    const word=sourceWord(verb.value);if(word.class!=='verb') fail('The predicate needs an existing verb ending in i.');
    const manner=[];
    while(peek()?.type==='word'&&BY_WORD.get(peek().value)?.class==='manner') manner.push(sourceWord(take().value));
    const roles={};
    while(wordIn(ROLES)) {
      const role=take().value;
      if(Object.hasOwn(roles,role)) fail(`The role ${role} appears twice; no earlier value was discarded.`);
      roles[role]=nounPhrase(depth);
    }
    const expressiveRemainder=peek()?.type==='word'&&peek().value==='he';if(expressiveRemainder) take();
    return {type:'clause',vocative:null,force,stance,time,aspect,subject,
      predicate:{word,negated,manner},roles,expressiveRemainder};
  }
  function document(depth=0,nested=false) {
    const statements=[];
    while(at<tokens.length&&(!nested||peek().type!==']')) {
      statements.push(clause(depth));
      if(['.','?','!'].includes(peek()?.type)) {take();continue;}
      if(at===tokens.length||nested&&peek()?.type===']') break;
      fail(`Unsupported or misplaced grammar ${JSON.stringify(peek().raw)}. No condition was discarded.`);
    }
    if(!statements.length) fail('Write at least one complete Luma clause.');
    return {type:'document',statements};
  }
  const ast=document();
  if(at!==tokens.length) fail('Unexpected trailing grammar.');
  return ast;
}
export function parse(input) {
  const ast=parseDocument(input);
  if(ast.statements.length!==1) fail('One game action needs one complete clause. Keep a longer composition in the reading view.');
  const c=ast.statements[0],latin=toLatin(input).trim();
  return {schema:'anima-luma-register-1',mode:c.force??c.stance,subject:c.subject,
    verb:spellingOf(c.predicate.word),manner:c.predicate.manner.map(spellingOf),roles:c.roles,
    remainder:c.expressiveRemainder,force:c.force,stance:c.stance,time:c.time,aspect:c.aspect,
    negated:c.predicate.negated,source:input,latin,native:toNative(latin),ast};
}
function role(input,key) {
  if(key!==undefined) return input?.roles?.[key]??input?.ast?.statements?.[0]?.roles?.[key]??null;
  return input?.type==='nounPhrase'?input:null;
}
export function roleWord(input,key) { return spellingOf(role(input,key)?.head); }
export function roleName(input,key) { const h=role(input,key)?.head;return h?.type==='name'?h.value:null; }
export function roleQuantity(input,key) { const q=role(input,key)?.quantifier;return q?.type==='number'?{n:BigInt(q.numerator),d:BigInt(q.denominator)}:null; }

function codeForLetters(text,words) {
  const letters=[...text].map(c=>BY_LETTER.get(c));
  if(letters.some(l=>!l)) fail('Letter code needs only the twenty Luma letters.');
  const q=letters.map(l=>l.ordinal),pairs=q.map(n=>[Math.floor(n/5),n%5]);
  const ratioIndices=pairs.flat(),ratios=ratioIndices.map(n=>RATIOS[n]);
  const notes=letters.flatMap((l,index)=>pairs[index].map((pitch,pairIndex)=>({
    letter:l.letter,q:l.ordinal,letterIndex:index,pairIndex,pitch,ratio:RATIOS[pitch],
    ratioName:RATIO_NAMES[pitch],frequency:220*RATIOS[pitch]
  })));
  return {letters,q,G:q.reduce((s,n)=>s+n+1,0),letterCount:letters.length,words,pairs,
    ratioIndices,ratios,ratioNames:ratioIndices.map(n=>RATIO_NAMES[n]),notes,
    featureCounts:FEATURES.map((_,i)=>letters.reduce((s,l)=>s+l.featureVector[i],0)),
    referenceHz:220,scope:'unquoted Luma word tokens; quantities and quoted labels excluded'};
}
export function wordCode(input) {
  const word=toLatin(input);
  if(!word||![...word].every(c=>BY_LETTER.has(c))) fail('A word code needs a nonempty Luma spelling.');
  return {word,latin:word,native:toNative(word),...codeForLetters(word,[word])};
}
export function phraseCode(input) {
  const {text,tokens}=tokenize(input);
  const words=tokens.filter(t=>t.type==='word').map(t=>t.value);
  for(const word of words) if(!BY_WORD.has(word)&&!Object.hasOwn(PARTICLES,word)) fail(`Unknown Luma word ${JSON.stringify(word)}.`);
  return {source:input,latin:text,native:toNative(text),...codeForLetters(words.join(''),words)};
}
export function quantityCode(input) {
  const value=typeof input==='bigint'?LumaNumbers.rational(input):
    typeof input==='object'&&typeof input?.n==='bigint'?LumaNumbers.rational(input.n,input.d??1n):LumaNumbers.parse(String(input));
  const info=LumaNumbers.analyze(value);
  return {...info,value,digits:LumaNumbers.digits(LumaNumbers.abs(value.n)),G:null,kind:'exact-quantity'};
}

export function transportUnits(input) {
  validText(input);
  const core=ALPHABET+' .[]',units=[];
  for(const scalar of input) {
    const q=core.indexOf(scalar);
    if(q>=0) units.push(q);
    else { const bytes=new TextEncoder().encode(scalar);units.push(24,bytes.length-1);
      for(const b of bytes) units.push(Math.floor(b/25),b%25); }
  }
  return units;
}
export function encodeText(input) {
  return transportUnits(input).reduce((n,u)=>25n*n+BigInt(u),1n).toString();
}
export function decodeText(input) {
  if(typeof input!=='string'&&typeof input!=='bigint') fail('Use the exact decimal transport integer.');
  const str=String(input);
  if(!/^[1-9][0-9]*$/.test(str)||str.length>100000) fail('Invalid transport integer.');
  let n=BigInt(str),units=[];
  while(n>=25n) { units.push(Number(n%25n));n/=25n; }
  if(n!==1n) fail('Transport framing sentinel is missing.');
  units.reverse();const core=ALPHABET+' .[]';let out='';
  for(let i=0;i<units.length;) {
    const unit=units[i++];
    if(unit<24) {out+=core[unit];continue;}
    const length=units[i++]+1;
    if(!Number.isInteger(length)||length<1||length>4||i+2*length>units.length) fail('Invalid Unicode escape length.');
    const bytes=[];
    for(let j=0;j<length;j++) {const b=25*units[i++]+units[i++];if(b>255) fail('Unicode byte is out of range.');bytes.push(b);}
    let scalar;
    // FEFF is an encoded character here, not an optional stream marker.
    try {scalar=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(Uint8Array.from(bytes));}catch {fail('Invalid UTF-8 escape.');}
    if([...scalar].length!==1) fail('An escape must represent one Unicode scalar.');
    out+=scalar;
  }
  if(encodeText(out)!==str) fail('Noncanonical transport escape.');
  return out;
}
export function toneScore(input,{transport=false}={}) {
  const score=transport?{units:transportUnits(input)}:
    [...toLatin(input)].length===1&&letter(input)?wordCode(input):phraseCode(input);
  const pairs=transport?score.units.map(u=>[Math.floor(u/5),u%5]):score.pairs;
  const events=pairs.flatMap((pair,i)=>pair.map((pitch,j)=>({
    start:i*.39+j*.16,duration:.145,frequency:220*RATIOS[pitch],pitch,
    unit:transport?score.units[i]:score.q[i],unitIndex:i,pairIndex:j,
    letter:transport?null:score.letters[i].letter
  })));
  return {...score,events,duration:pairs.length*.39,kind:transport?'unicode-transport':'luma-word-music'};
}
