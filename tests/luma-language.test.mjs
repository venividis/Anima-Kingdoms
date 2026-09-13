import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ALPHABET, FEATURES, LETTERS, ROOTS, DICTIONARY, LEXICON, GLYPHS, RATIOS, PROVENANCE } from '../public/luma/data.js';
import * as L from '../public/luma/language.js';
import N from '../public/luma/numbers.js';

const original=readFileSync(new URL('../public/luma/origin.html',import.meta.url),'utf8');
const scripts=[...original.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
const source=JSON.parse(scripts[0][2]);
const witnesses=JSON.parse(readFileSync(new URL('../public/luma/source-register.json',import.meta.url),'utf8')).records;
function exactAst(value) {
  if(Array.isArray(value))return value.map(exactAst);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,['numerator','denominator'].includes(k)?String(v):exactAst(v)]));
  return value;
}

test('Luma inventory retains all source letters, features, glyphs and 900 dictionary forms',()=>{
  assert.equal(createHash('sha256').update(original).digest('hex'),PROVENANCE.sourceSha256);
  assert.equal(ALPHABET,'aeioupbmfwtdnslkghry');
  assert.deepEqual(LETTERS,source.alphabet.letters);
  assert.deepEqual(FEATURES,source.alphabet.featureOrder);
  assert.deepEqual(GLYPHS,source.glyphs);
  assert.deepEqual(LEXICON,source.lexicon.roots);
  assert.equal(ROOTS.length,180);assert.equal(DICTIONARY.length,900);
  assert.equal(new Set(DICTIONARY.map(r=>r.word)).size,900);
  for(const row of DICTIONARY) {
    assert.equal(row.gloss,source.lexicon.roots[row.root][row.ending]);
    assert.equal(L.inspectWord(L.toNative(row.word)).word,row.word);
    assert.equal(L.toLatin(L.toNative(row.word)),row.word);
  }
  assert.equal(L.inspectWord('mimi'),null);
  assert.equal(L.inspectWord('meli').gloss,'care for');
  assert.equal(L.inspectWord('peli').gloss,'create');
});

test('Luma font files are byte-identical to both font payloads in the source',()=>{
  const ttf=Buffer.from(source.nativeFontTtf.split(',')[1],'base64');
  const woff=Buffer.from(original.match(/data:font\/woff2;base64,([A-Za-z0-9+/=]+)/)[1],'base64');
  assert.deepEqual(readFileSync(new URL('../public/luma/Luma-Origin-Prefinal.ttf',import.meta.url)),ttf);
  assert.deepEqual(readFileSync(new URL('../public/luma/Luma-Origin-Prefinal.woff2',import.meta.url)),woff);
  assert.equal(ttf.length,12812);assert.equal(woff.length,3300);
});

test('all 41 source register witnesses retain AST, native writing and positive word values',()=>{
  assert.equal(witnesses.length,41);
  for(const row of witnesses) {
    const expected=exactAst(row.ast);
    assert.deepEqual(L.parseDocument(row.latin),expected,row.path);
    assert.deepEqual(L.parseDocument(row.native),expected,row.path+' native');
    assert.equal(L.toNative(row.latin),row.native,row.path+' writing');
    assert.equal(L.phraseCode(row.latin).G,row.G,row.path+' G');
    assert.equal(L.phraseCode(row.latin).letterCount,row.letterCount,row.path+' count');
    const pairs=L.phraseCode(row.latin).pairs;
    assert.deepEqual(pairs,row.wordMusic.map(x=>x.pairIndices));
  }
});

test('native conversion preserves exact JSON quoted names and separates letter and numeral glyphs',()=>{
  const text='pe mi me doni ta #e bama li "Melu \\"quoted\\" 🌱  #e".';
  const native=L.toNative(text);
  assert.equal(native.slice(native.indexOf('"')),text.slice(text.indexOf('"')));
  assert.equal(L.toLatin(native),text);
  assert.match(native,/#\uE101/u);
  assert.equal(L.roleName(L.parse(native),'li'),'Melu "quoted" 🌱  #e');
  assert.equal(L.toNative('#eb'),'#\uE101\uE106');
  assert.throws(()=>L.toLatin('\uE101'),/inside a #/);
  assert.throws(()=>L.toNative('Mercury'),/Unsupported unquoted/);
  assert.throws(()=>L.toNative('"unterminated'),/closing/);
  assert.throws(()=>L.parse('pe mi me peli ta "bad\\xname".'),/JSON/);
});

test('exact quantities preserve signed values, rational reduction, carries and positional projection',()=>{
  assert.deepEqual(N.parseLuma('#eb'),{n:26n,d:1n});
  assert.deepEqual(N.parseLuma('#-eb/i'),{n:-13n,d:1n});
  assert.deepEqual(N.parseLuma('#uprphd/knta'),{n:13746351n,d:125000n});
  const p=L.parse('pe mi me doni ta #e/i bama li "households".');
  assert.deepEqual(L.roleQuantity(p,'ta'),{n:1n,d:2n});
  assert.equal(L.roleWord(p,'ta'),'bama');
  assert.equal(L.roleName(p,'li'),'households');
  assert.equal(L.roleQuantity(p,'li'),null);
  const sum=N.arithmetic(N.rational(19n),'+',N.rational(1n));
  assert.equal(N.spelling(sum),'#ea');
  assert.deepEqual(N.additionTrace(19n,1n).resultDigits,[1,0]);
  const projection=N.projection(-1n,2);assert.equal(projection.visibleRemainder,'399');assert.equal(projection.omittedQuotient,'-1');
  assert.equal(N.expansion(N.rational(1n,3n),20).status,'repeating');
  for(const text of ['#','#e/a','#e//i','#e garbage','12.2x']) assert.throws(()=>N.parse(text));
});

test('mode, actor, qualification and nonexecuted grammar remain explicitly visible to the game',()=>{
  for(const mode of ['i','u','pe','e','a']) {
    const p=L.parse(mode+' mi me peli melu ta pela.');
    assert.equal(p.mode,mode);assert.equal(p.subject.head.type,'pronoun');assert.equal(p.subject.head.value,'mi');
    assert.equal(p.verb,'peli');assert.deepEqual(p.manner,['melu']);
  }
  assert.equal(L.parse('pe "mi" me peli ta pela.').subject.head.type,'name');
  assert.equal(L.parse('pe ni me peli ta pela.').subject.head.value,'ni');
  assert.equal(L.parse('pe mi me nu peli ta pela.').negated,true);
  assert.equal(L.parse('pe u mi me peli ta pela.').stance,'u');
  assert.equal(L.parse('pe pa mi me peli ta pela.').time,'pa');
  assert.equal(L.parse('pe mi mele me peli ta pela.').subject.adjectives.length,1);
  assert.equal(L.parse('pe #i mi me peli ta pela.').subject.quantifier.numerator,'2');
  assert.equal(L.parse('pe mi me pelami ta [mi me meli ta pela].').roles.ta.type,'document');
  assert.throws(()=>L.parse('pe mi me peli ta pela. pe mi me peli ta pela.'),/One game action/);
});

test('unsupported words, duplicate roles, grammar tails and unreasonable inputs fail closed',()=>{
  for(const text of [
    'pe mi me creation ta pela.',
    'pe mi me pela ta pela.',
    'pe mi me peli ta pela ta wuna.',
    'pe mi me peli ta pela if free.',
    'pe mi me peli ta pela ne ni me bani ta bana.',
    'pe mi me peli ta #e.',
    'pe mi me peli ta pela ]',
    'pe mi me peli ta pela; dona',
    'mi '.repeat(260),
    '\ud800'
  ]) assert.throws(()=>L.parse(text),undefined,text.slice(0,70));
  const deep='pe mi me pelami ta ['.repeat(10)+'mi me huri'+']'.repeat(10)+'.';
  assert.throws(()=>L.parse(deep),/bracket levels/);
});

test('word music retains each letter pair at 220 Hz and excludes names and quantities',()=>{
  const code=L.wordCode('mela');
  assert.deepEqual(code.q,[7,1,14,0]);assert.equal(code.G,26);
  assert.deepEqual(code.pairs,[[1,2],[0,1],[2,4],[0,0]]);
  assert.deepEqual(code.ratioNames,['9/8','5/4','1','9/8','5/4','5/3','1','1']);
  assert.deepEqual(code.notes.map(n=>n.frequency),code.ratioIndices.map(i=>220*RATIOS[i]));
  assert.equal(L.wordCode('lema').G,26);
  assert.notDeepEqual(L.wordCode('lema').q,code.q);
  const p=L.phraseCode('pe mi me doni ta #e bama li "Mela mela".');
  const {source:originalSource,...originalCode}=p;
  const {source:nativeSource,...nativeCode}=L.phraseCode(L.toNative('pe mi me doni ta #e bama li "Mela mela".'));
  assert.notEqual(originalSource,nativeSource);
  assert.deepEqual(originalCode,nativeCode);
  assert.deepEqual(p.words,['pe','mi','me','doni','ta','bama','li']);
  assert.equal(L.toneScore('m').events.length,2);
  assert.equal(L.toneScore('mela').events.length,8);
  assert.equal(L.phraseCode('mela "mela" #mela').G,26);
});

test('the separate full Unicode transport is reversible and rejects malformed encodings',()=>{
  for(const text of ['',ALPHABET,'a 🌱 "Melu"\n[care]','\u0000\uFEFF\u{10FFFF}',L.toNative('pe mi me meli ta pela.')]) {
    const number=L.encodeText(text);assert.equal(L.decodeText(number),text);
    assert.equal(number,[...L.transportUnits(text)].reduce((n,u)=>25n*n+BigInt(u),1n).toString());
  }
  assert.notEqual(L.encodeText('mela'),String(L.wordCode('mela').G));
  assert.notEqual(L.encodeText('mela'),L.encodeText(L.toNative('mela')));
  assert.throws(()=>L.encodeText('\ud800'),/surrogate/);
  assert.throws(()=>L.decodeText('0'));
  assert.throws(()=>L.decodeText('2'),/sentinel/);
  const bad=[24,0,10,6].reduce((n,u)=>25n*n+BigInt(u),1n).toString();
  assert.throws(()=>L.decodeText(bad),/byte/);
  assert.equal(L.toneScore('a 🌱',{transport:true}).events.length,L.transportUnits('a 🌱').length*2);
});
