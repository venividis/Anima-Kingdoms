# Luma in Anima Kingdoms

The game retains the uploaded Luma Origin 3.4 alphabet, dictionary, glyph drawings,
native fonts and exact numeral core. The physical constructions and executable
game register are Anima's new adaptation. Luma words keep their source meanings.

`origin.html` is the complete, byte-identical uploaded living artwork. Its SHA-256
is `86f7c110a82587eb50f302def2261b5ae9b431a41cdabf46b8f48a6c7a8f0668`.
Run `python scripts/extract-luma.py` from the repository to reproduce the retained
data, numeral module, fonts and 41 source examples. No remote request or execution
of the uploaded artwork is involved in extraction.

The source inventory has 20 letters in the order `aeioupbmfwtdnslkghry`, 180 roots
and 900 dictionary forms. A root's final vowel selects its existing noun (`a`),
quality (`e`), verb (`i`), agent (`o`) or manner (`u`) form. Native letters occupy
U+E000–U+E013; compact numeral digits occupy U+E100–U+E113. Load `font.css` to use
the retained “Luma Origin Prefinal” font. Quoted names preserve their exact spelling
and are displayed with the surrounding interface's fallback font.

`data.js` contains the full source letter records (including IPA, 16 feature bits
and structured glyph commands), all root glosses, generated dictionary rows and
source conventions. `source-register.json` retains all 41 source examples, native
spellings, glosses, ASTs, word music and values. The two source numerical AST
witnesses contain JSON numbers; the runtime represents exact numeral components
as decimal strings. Tests make only this explicit normalization when comparing.

`language.js` provides:

- `parseDocument(text)`: a source-shaped document AST for the supported written
  register, including bracketed clauses.
- `parse(text)`: one clause with its typed subject and roles, verb, manners, mode,
  original input, Latin/native writing and complete document AST.
- `roleWord(parsed, role)`, `roleName(parsed, role)` and `roleQuantity(parsed, role)`:
  separate access to ordinary words/pronouns, JSON-quoted names and exact `{n,d}`
  BigInt quantities. Each helper can also receive a noun phrase directly.
- `toNative`, `toLatin`, `inspectWord`, `letter`, `wordCode`, `phraseCode`,
  `quantityCode`, `encodeText`, `decodeText` and `toneScore`.

The parser is a bounded adapter checked against every retained source AST. It is
not the unpublished full Luma grammar. It supports source noun phrases, exact
quantities, quoted names, quality modifiers, bracketed clauses, force/stance,
time/aspect, negation, manner, named roles and expressive remainder. Unimplemented
conjunction, relative and vocative constructions fail explicitly. Input is limited
to 512 Unicode characters, 128 tokens and eight bracket levels. It never drops
unrecognized grammar or replaces an unknown word with the closest command.

Parsing does not authorize an action. The local and shared executors require the
current speaker's typed `mi` pronoun and their own permitted verb, mode, roles and
resource checks. A quoted name `"mi"` remains a name. A plural `ni` remains plural.
Time, aspect, negation, extra roles and qualifications remain inspectable so an
executor can refuse to act on conditions it does not implement. `pe` is an
undertaking; its presence does not imply that an action has already completed.

The letter index `q` is 0–19. Its positive additive value is `G=q+1`. For music,
`q=5f+u` selects two ordered pitches from `[1, 9/8, 5/4, 3/2, 5/3]` at a 220 Hz
reference. `phraseCode` and ordinary `toneScore` include unquoted Luma word tokens;
they exclude quoted names and exact numeric blocks. A single-letter `toneScore`
supports keyboard listening. This is the source musical spelling convention, not
a recording of speech. `toneScore(text,{transport:true})` explicitly selects the
separate complete Unicode transport score.

`numbers.js` is the exact original BigInt rational core extracted unchanged. It
retains signed base-twenty numerals, rational reduction, compact digits, arithmetic,
carry demonstrations and projections. `encodeText`/`decodeText` are the separate
base-25 full Unicode transport: 20 letters, space, period and brackets are direct
units; unit 24 introduces one UTF-8 scalar escape. They preserve names, punctuation,
controls and native writing exactly. These transport integers are not quantities
or measures of a person's intention.

The recovery verification in `tests/luma-language.test.mjs` checks exact source
data and font bytes, all 900 forms, all 41 source ASTs in both scripts, quantities,
mode/actor distinctions, grammar failures, word music and full Unicode round trips.
During reconstruction the Unicode tests exposed that a default UTF-8 decoder
discarded U+FEFF when decoding one escape. The decoder now retains it explicitly.
These checks validate the software contracts; human pronunciation, comprehension
and glyph-learning studies remain separate work.
