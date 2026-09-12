# Luma recovery and evidence scope

This record distinguishes the recovered sources, the reconstruction, and the checks that were actually rerun. It is not a replacement for the final release verification.

## What happened

A workspace cleanup removed the unpublished Luma implementation and its local verification artifacts. Before that loss, the conversation reported 282 passing tests and several agent play journeys. Those reports describe the earlier build. Their deleted logs and traces have not been recreated from memory, and their counts do not certify the reconstruction.

The existing shared-commons baseline was recovered from `codex/anima-living-commons`, at commit `30914343b90fb55a8c9a83fdefc241600b986bf8`. The uploaded living artwork was recovered byte for byte as `public/luma/origin.html`, from Git blob `afd177011399c89ac63b469a43b3fad9d4fb4929`. The reconstruction uses that source rather than a shortened alphabet or substitute dictionary.

A private recovery checkpoint, `codex/luma-recovery-checkpoint` at `29367d9`, preserves the exact artwork. A subsequent checkpoint `82c22d7` also preserves the reconstructed language, geometry and local action source files. That checkpoint initially contains the artwork, not the completed reconstructed game. Publication or deployment of the finished upgrade is a separate action.

## Attachment identity and availability

| Attachment | Recorded identity | Recovery status |
|---|---|---|
| `Luma_Origin_Living_Artwork(2).html` | 5,613,428 UTF-8 bytes; SHA-256 `86f7c110a82587eb50f302def2261b5ae9b431a41cdabf46b8f48a6c7a8f0668` | Recovered exactly at `public/luma/origin.html`; fresh source review and structural checks are documented below. |
| `Luma_Origin_Celestial_Codex(2).pdf` | 409,476 bytes; 69 pages; previously recorded SHA-256 `4a37fa1934e1aa767910ea484bb70d3177c1dd7d8c65bee0d4ca667fddbe5b6e` | The original local copy is unavailable during this reconstruction. All 69 pages were reported read before cleanup; this is inherited reading, not renewed PDF access. |
| `Luma_Origin_Celestial_Atlas(2).png` | 409,235 bytes; 1,760 × 1,580 pixels; previously recorded SHA-256 `5028f70c32e896dd63a109e4809045465819ac68b1907bbea788eb6f1da1a6f5` | The original local copy is unavailable during this reconstruction. The atlas was reported inspected before cleanup; no replacement image is presented as that original. |

The PDF/PNG identities above are retained earlier records. Only the HTML identity has been recomputed from recovered attachment bytes here. Excerpts of the Codex remain in conversation context; they are not a restored complete PDF.

## Reading and byte checks are different evidence

The surviving [pre-cleanup file inventory](pre-cleanup-file-inventory.json) names 174 supporting repository files and their byte counts and hashes. A fresh comparison immediately after recovery found all 174 present with matching hashes. It covers the framework/UI components, build scripts, historical documentation and audit fixtures that the earlier review had read. Hash equality preserves that source identity; it does not turn earlier reading into a new semantic review. Subsequent edits can legitimately differ. [compare-inventory.py](compare-inventory.py) records the current comparison without replacing the earlier inventory.

Fresh source reading in this reconstruction was divided among independent agents:

- The language agent read every one of the 20 letter entries, including IPA, descriptions, all 16 feature values and complete glyph commands; all 180 roots and all five glosses per root; the entire source numeral core; and all 41 retained register AST records. A truncated root-read output was reread before declaring completion.
- The form agent read the complete 64,888-character main executable script, including geometry, native writing, number/gematria handling, transport, membrane and performance handlers, together with the current creation and rendering modules.
- The audit agent read executable scripts 03–06 completely: the embedded Astronomy Engine library, the celestial engine, generated magic-square implementation and celestial UI. The audit agent also read the complete 147,131-character review representation of markup/CSS and embedded historical numeral articles, with script bodies reviewed separately and encoded font data decoded separately. All 1,645 distinct string values in the historical/celestial reference datasets were reviewed with their first source path; repeated occurrences are counted separately in the structural audit.
- The audit agent freshly reread the active Anima, broader foundation, shared realm, combat, creation-contract and whole-game guides; the source-import/publishing guides; all build/install/runtime scripts; and the local Luma view, action and geometry modules. The root agent covers application and shared-client integration. Other game agents cover the local and shared simulation changes.

The mathematical JSON traversal visits every numeric value and checks finite values. The 16 encoded WAV records are decoded and all PCM samples traversed; this is audio-data inspection, not a claim of fresh listening or pronunciation validation. Historical web-access statements embedded in the source remain the source author's access records; their inclusion does not mean those websites were revisited in this reconstruction.

## Exact source layers

[inspect-source.py](inspect-source.py) generates [source-structure.json](source-structure.json) directly from the recovered HTML:

```sh
python docs/audit/luma/inspect-source.py
python docs/audit/luma/compare-inventory.py
```

| Layer | Fresh structural result |
|---|---|
| HTML | 5,613,428 UTF-8 bytes; 5,607,626 Unicode code points |
| Script blocks | 7 total: 2 JSON blocks and 5 executable blocks; each has its own SHA-256 in the report |
| Language | 20 letters; 16 feature values each; 180 roots; 900 distinct grammatical forms |
| Native assets | 20 native letter entries and 20 compact numeral entries; original font bytes retained by the extraction script |
| Composition witnesses | 41 source register records with native text and AST witnesses |
| Historical/celestial references | 68 source records; 2,888 string occurrences; 1,645 distinct string values |
| Lunar table | 27 equal sectors; 108 quarters; 19 selected naming-witness differences; pictorial-emblem fields deliberately unset |
| Seasonal table | 24 solar terms |
| Membrane data | 15 grids of 53 × 65 values, 51,675 samples in total; time-RMS displacement, not a sand-node simulation |
| Audio data | 16 mono, 16-bit, 24,000-Hz WAV records; 1,500,000 PCM samples in total |
| JSON numeric traversal | 60,683 numeric values visited; all finite |

These are source contracts. They do not establish astrological effects, learner comprehension, musical delight, observational accuracy, or the success of the gameplay extension.

## Design distinctions retained during recovery

The retained sixteen feature coordinates describe an authored drawing. They are separate from the source's eight celestial angles embedded as sixteen cosine/sine coordinates. The source projection is deliberately lossy: retaining an additional coordinate need not visibly alter the final projection. In particular, changing coordinate 16 alone does not change the first three projected components under the source's fixed rotation order. The implementation preserves that source behavior.

The language parser reconstructed for the game is a bounded register that matches the retained source witnesses. It is not represented as a recovered complete implementation of all possible Luma grammar. The full original artwork remains accessible alongside it.

Gematria, positional quantities, Unicode transport integers, musical codes and celestial bins remain distinct operations. New mappings from words to game objects and actions are Anima game design. They do not retroactively change the source dictionary or claim that a word's numerical value causes physical power.

## Fresh gameplay and release evidence

The fresh [local play review](local-play-review.md) and [complete local trace](local-journey.json) are saved here. The passing journey contains 26 accepted actions, six legal walks, five current-state persistence checkpoints, 16 actual note events, a powered crossing, creature care, four physical food deliveries and four meals. It retains a separate earlier insufficient-funds failure. Final build/test and shared-play output are recorded separately as they complete. Each journey identifies the actual source hashes, commands, simulation ticks, costs, observed state and conservation residuals. A journey is a scripted interaction with the real APIs, not a human usability study. Genuine snapshot/restore checkpoints retain the current earned state; a reset or fabricated favorable state is not an acceptable continuation.

Retained v0.8–v0.12 audit files, screenshots and test counts belong to those earlier releases. They are preserved history. The final reconstruction report must name the files and commands rerun against the current source and must not reuse the deleted 282-test or play totals as fresh evidence.
