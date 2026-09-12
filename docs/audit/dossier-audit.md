# AWE dossier audit: what was incomplete, substituted, insufficiently tested, or previously wrong

Audit date: 11 September 2026. Scope: the recovered complete project through v0.7. The later live v0.8 Site is being audited separately; findings below must not be automatically attributed to its implementation.

The substantive failure was repeated delivery of a much smaller artifact than the requested scope: a representative research synthesis, extensive implementation specifications, and bounded local experiments in place of exhaustive game mastery and an integrated inhabited MMORPG. Much of this was disclosed inside the dossier. Disclosure makes the record more honest; it does not complete the missing work. The evidence does not establish intentional cheating, fabricated research, or falsified test results. The appropriate admission is incomplete delivery, overbroad completion framing where used, and specific defects later repaired.

## What this audit actually read

Read all 3,268 lines of `PROJECT/v07/documentation/report-source.md`, covering all 59 chapters, in sequential prose chunks. Read all four `CONTEXT` files, `PROJECT/v07/research/evidence-gap-matrix.md`, v0.7 README and exact rain contract, implementation manifest and compatibility manifest, verification notes, selected source-check record, and specification changes. Inspected all source-ledger verification metadata; the 260 claim contexts are repetitions of the paragraphs in the full report already read. Did not re-fetch every external source, watch the unavailable videos, play every referenced commercial game, rerun every inherited test, or inspect the later Site implementation in this bounded audit.

Useful source evidence:

- The v0.7 ledger contains **260 claim records and 257 distinct URLs**: 246 records explicitly inherited without fresh v0.7 retrieval; four marked independently checked by root; ten marked checked by a research lane. One inherited URL is reused in the new chapter.
- Every ledger record has `access_date: 2026-09-06`, including the 246 marked inherited. This is not evidence of 260 fresh source inspections that day. The verification-scope field must accompany any date claim.
- Ledger fields contain title, URL, chapter, claim paragraph, date and verification scope. They contain no dedicated source-content hash, retrieval timestamp, page, paragraph or quoted-excerpt field. The ledger is a citation map, not a complete reproducible retrieval archive.
- Approximate whitespace-delimited body lengths illustrate the mismatch: WoW chapter 06 has 1,338 tokens under this simple word-count method; Blizzard chapter 07 has 1,233; Nintendo chapter 08 has 903; AoE II chapter 03 has 1,310; Civilization chapter 04 has 1,187; fighter chapter 41 has 1,329; shooter chapter 42 has 974. These are useful essays, not all-mechanic encyclopedias. Word count alone is not a quality measure.
- `PROJECT/implementation_v04/slice-manifest.json` explicitly says `build_specification_not_rendered`, `new_labs_are_wire_compatible: false` and selects six M1 discipline techniques. `compatibility-manifest.json` marks every listed adapter `conformance_passed: false`, with null implementation/dependency hashes.
- The recovered `PROJECT` tree has 35 Markdown, 180 JSON, 84 Python, eight text, 14 CSV and one HTML file. That inventory contains no Rust engine source, Unreal project, production animation assets or deployed smart-contract implementation. The later v0.8 Site is outside this inventory.

## A. Missing research depth against the actual request

| ID | Where depth was missing | Evidence and precise limit | Work needed to close it |
|---|---|---|---|
| R01 | No complete game corpus | Ch02 says the exhaustive Blizzard/Nintendo/every-attack/all-crypto corpus is not completed and no agreed denominator of releases, patches, platforms or regional variants exists. | Build the title/version inventory before claiming exhaustive coverage; record each examined mechanic and its evidence. |
| R02 | WoW attack-level mechanics | Ch06 uses one Legion Mage preview and selected dated tuning changes. No every-class/spec/attack database; threat, weapon skill, armor, coefficients, proc interactions and comprehensive rotations are absent. | Pin branches/builds; collect spell/item data and interaction tests with event-level captures. |
| R03 | WoW expansion breadth | Ch06 explicitly marks Wrath/Cataclysm dedicated audits, BFA mechanics, full Shadowlands systems, full current Midnight content, Hardcore and SoD economies as open. | Separate expansion/branch studies with complete system and encounter indexes. |
| R04 | WoW PvE and raid depth | Flex raid rationale, Delves and dungeon structure are examined; every boss phase, scaling rule, loot/reset behavior, raid composition and strategy are not reconstructed. | Encounter state machines, logs, mechanics matrices and failure/reset reproductions. |
| R05 | WoW marketplace depth | Commodity regionalization, Dragonflight orders and historical Token FAQ are covered. Full order/auction rounding, fees, cancellation, cross-branch markets, commodity time series and economic causality are not. | Versioned transaction rules and empirical market datasets with explicit units and time windows. |
| R06 | Pets and animation | Ch06 pet evidence is principally a three-pet event page; animation evidence is a 2017 developer account. No complete pet ability/breed/battle corpus or measured animation frames. | Enumerate pets and interactions; capture cast/hit/recovery markers and movement variants. |
| R07 | All Blizzard | Ch07 provides selected Warcraft III, StarCraft, Diablo, Overwatch, Hearthstone, Heroes, Rumble and arcade cases. Warcraft I/II are light; Diablo I/Hellfire, all cards, rosters, matchups and patches are explicitly open. | Family-by-family catalogs and mechanical reconstructions, not representative anecdotes alone. |
| R08 | All Nintendo | Ch08 explicitly leaves F-Zero, Star Fox, Yoshi, Luigi's Mansion, Kid Icarus, ARMS, Advance Wars, EarthBound, Golden Sun, Paper Mario, Mario RPG/sports, Rhythm Heaven and older/portable/mobile catalogs open. | Track complete internal and partner-studio corpus, versions, mechanics and play evidence. |
| R09 | Nintendo systemic depth | Selected developer interviews explain affordances and assistance. Full BOTW chemistry, Pokémon damage rounding, Mario movement models, Zelda/Metroid generations, complete minigame catalogs and Smash frame data are not reconstructed. | Concrete action/state/interaction models and sampled reproductions. |
| R10 | AoE II | Ch03 is materially more specific than a store description, but no full September 2026 unit/civilization/tech database or frame capture exists. June is the latest patch deeply examined, not an asserted latest patch overall. | Pin DE build and DLC; enumerate all units, classes, bonuses, economy, pathing and AI exceptions. |
| R11 | Civilization breadth versus depth | Ch04 covers every numbered generation with unequal depth; manuals and diaries do not become every expansion coefficient. The broader comparison remains selected. | Versioned rule catalogs, expansion deltas and empirical replay cases; define selection criteria for comparable games. |
| R12 | Wider strategy | Ch02/05 say AoE I/III, Rise of Nations, Supreme Commander, Total War, full Endless Space II, Songs of Syx and deeper expansions were located/considered, not deeply completed. | Dedicated mechanical studies where they can change AWE decisions. |
| R13 | Fighting games | Ch41 covers selected mechanics. Blocked Capcom pages were not fully read; there is no verified current Ryu frame table or full MK/Smash/Tekken/Guilty Gear roster/interaction database. | Obtain pinned build data and reproducible training captures; enumerate assist, cancel, collision and timing edge cases. |
| R14 | Shooters | Ch42 covers selected Quake, UT2004, Halo, CS:GO, VALORANT, TF2, Overwatch and Splatoon mechanisms. Every COD/Apex/Fortnite generation, weapon table and movement/network profile is not studied. | Comparative weapon, geometry, information, netcode and objective datasets. |
| R15 | Battlegrounds and small games | Ch43 uses several WSG variants; unavailable legacy WSG guide leaves timing gaps. Lanternwake's timers are authored AWE proposals. The full Nintendo Land/WarioWare/FFXIV activity corpus is not covered. | Complete rules and variant provenance; keep imported lessons separate from original constants. |
| R16 | Human nature and network effects | Ch09/34 synthesize selected studies in unrelated tasks and populations. Proposed useful-relationship models are not fitted laws. No AWE participant study, observed retention, voluntary social network or causally measured enjoyment exists. | Formative playtests followed by appropriately designed studies, with null/adverse results and transfer measures. |
| R17 | All crypto and microeconomic mathematics | Ch10/25/31 provide relevant capabilities, accounting identities and selected standards. They do not survey every protocol, prove an equilibrium, estimate demand, solve Sybils, measure liquidity or implement the chosen verification architecture. | Threat/workload-specific protocol comparisons and empirical or calibrated economic research, plus actual implementations. |
| R18 | Source recency and completeness | Ch02, selected-check files and the ledger disclose inherited references and blocked/full-video limits. Mutable `/latest`, repository `main`, evergreen pages and unpinned SDK revisions remain. | Preserve actual retrieval dates, immutable revisions, excerpts/page locators and refreshed material claims; never equate citation count with completed mastery. |

## B. Implementation missing from the recovered game, not merely missing prose

These are baseline-through-v0.7 findings. The rebuilding agent must mark any that v0.8 or the current work actually implements with new evidence.

| ID | Missing or reduced implementation | Anchor | Why the prior output did not satisfy the larger request |
|---|---|---|---|
| I01 | A continuous inhabited MMORPG | Ch01/12/53/54/59 | The current executable was a twelve-manual-pulse, local single-session graph episode; it did not run a continuous world with other participants. |
| I02 | Body/company/settlement/realm embodiment | Ch12/32/59 R1 | Three schematic lenses did not implement four playable scales, one body, camera transitions, troop command or rights-aware strategic exploration. |
| I03 | Production engine | Ch26; implementation manifest | Rust, Unreal, PostgreSQL, QUIC and content storage were selected architecture, not integrated runtime dependencies. |
| I04 | First valley and geography | Ch01/17/36 | 1,024×1,024 m, sixteen avatars and ninety-six troops were workload targets. No measured engine, complete collision landscape or navigation workload existed. |
| I05 | Original power-to-place mechanism | Ch13/24/50/54/59 | Catch applied a radius-trigger root; Tension Arch used an authored recipe/load proxy. Neither derived a load-bearing bridge from the actual combat force relation. |
| I06 | Full worldcraft vocabulary | Ch13/59 | Weave/Shape/Pulse/Listen and Thread/Gale/Stone/Tide/Ember/Echo were not four complete interactive verbs and six implemented material families. Water allocation is one actual bounded law. |
| I07 | Full combat | Ch14/36/46 | Twenty-four abilities were a catalog; M1 selected six. Schema/timing/static-contact tests were not an action combat runtime with hitboxes, movement, animation and opponents. |
| I08 | Character creation and equipment | Ch11/14/23/32 | Body, voice, gait, culture, costume, progression and loadouts were design requirements, not completed character systems and assets. |
| I09 | Pets and independent agents | Ch23/30/56 | Lumenling behavior/memory/learning was largely specification. The invited helper was a deterministic script, not a live LLM participant, trained opponent or independent model society. |
| I10 | Shared agent integration | Ch29/30; compatibility manifest | No production identity, real MCP/A2A adapter, model service, secure public agent interface, measured invocation cost or live human-agent study. |
| I11 | Living civilization population | Ch15/16/59 R2 | Twelve households, labor, needs, immigration and housing were catalog/isolated simulation work, not a single persistent population inhabiting the rendered world. |
| I12 | Construction economy | Ch15/16/18 | Twelve buildings and twelve technologies were authored data. The full legal in-world start-to-farm/mill/research/bridge chain was explicitly not executed by a game engine. |
| I13 | Real delivery and consumption | Ch54/59 R2 | v0.7 used two safe pulses to qualify an instantaneous origin→destination change; no physical wagon movement, loading, distribution or household eating. |
| I14 | Ecology | Ch11/16/54/57 | Orchard/habitat saturation did not mint fruit, consume water physiologically, move wildlife, carry pollen or create the described biome/market changes. |
| I15 | NPC narrative | Ch11/21/57 | Iria, Vey and Oru had authored identities, not general dialogue/behavior. At most three factual templates are not a quest/world social simulation. |
| I16 | Six-region world | Ch11 | Pelagic Choir, Glasswake, Hushed Canopy, Ember Archive and Wandering Citadels were places in text; no populated playable regions or migrating city-beast existed in this archive. |
| I17 | Raids and expeditions | Ch21/22 | Cathedral That Walks had phase designs and timing targets, but no enemy/encounter runtime, four/eight/twelve-player sessions, full loot tables or raid validation. |
| I18 | Company warfare and diplomacy | Ch19/20/27 | Eight troop archetypes, formations, relay campaign, seat budgets, treaty signing and supply rules were not one integrated campaign engine. The relay laboratory used supply eligibility, not physical ownership capture. |
| I19 | Marketplace | Ch16/17/25/39 | The isolated zero-fee one-resource/depot book did not provide the realm exchange, commissioned craft, physical delivery system or funded starter world market. The first-valley genesis had no Marks allocation. |
| I20 | Homes and communities | Ch20/23/25 | Functional player homes, workshops, companies, neighborhoods, institutions, creator discovery, social communication and community control were not delivered as a live shared world. |
| I21 | Games inside the same world | Ch40/44/52/59 R5 | Raincatch, LoomTable and Lanternwake had separate local references. Their shared world departure/one-body/return adapter was not integrated into the v0.7 graph episode. |
| I22 | Complete game portfolio | Ch40/45–47 | Lanternwake had objective state only, no integrated shooter; Tension Duel had static witnesses; Skyweave/BellThrow had no physics/runtime. Raincatch had no original rendered client; LoomTable/Afterimage lacked their proposed embodied venue. |
| I23 | True creator runtime | Ch24/31/44 | Typed grammar and WebAssembly direction did not implement a production compiler, instruction-metered sandbox, arbitrary creator module hosting or secure exports. |
| I24 | Dream Foundry/Atlas continuity | Ch22/24/38/51/55 | Local branches and board reachability witnesses did not provide the imagined 3D rehearsal, live material promotion, walking factual replay or social circulation of Playable Letters. |
| I25 | Durable world ownership | Ch26/28/35/54 | Local caller names and local replay are not authentication, distributed single-writer authority, crash-safe persistent settlement, concurrent service recovery or externally verifiable history. |
| I26 | Onchain game | Ch31/36/44/59 R7 | No deployed proof/dispute system, reconstruction/DA guarantee, finality UI, smart account, NFT transfer adapter, external settlement or correct world proving benchmark. |
| I27 | Full artistic production | Ch32/48/57 | Art direction, animation markers and dimension tables were specifications. The v0.7 interface was SVG presentation, and three data-driven tones were not the composed adaptive soundtrack or complete character/architecture art library. |
| I28 | Browser and access verification | Ch32/58; verification-notes.md | JavaScript syntax and 12 HTTP checks did not exercise rendered layout, camera, keyboard/touch, actual interaction, visual cues, controller comfort or accessibility in a browser. The failed browser installation was disclosed. |
| I29 | Production capacity and operations | Ch26/29/35/44 | 60 FPS, p95 tick/ack targets, capsule ceilings, recovery and moderation were targets or local models. No actual client/network/load/production security benchmark met them. |

## C. Scope reductions, substitutions and presentation shortcomings

| ID | Change | Was it silent? | Audit judgment |
|---|---|---|---|
| S01 | “All games/every detail” became representative design research | Explicit in ch02, but broad delivery framing can still obscure it | A major unmet part of the instruction; not a completed exhaustive corpus. |
| S02 | “Complete technical document” became an implementation baseline with unresolved gates | Explicit definition in ch02 | Useful specification, but many crucial runtime choices remain unimplemented, not merely written down. |
| S03 | Continuous civilization became a twelve-pulse rain episode | Explicit in ch53/54 | A prototype is legitimate evidence; repeatedly substituting it for the requested whole game leaves the request unfulfilled. |
| S04 | Combat-derived force construction became authored mapping, then water-flow surrogate | Explicit correction in ch13/50/54 | The original central fantasy was not implemented. Water is a useful addition, not a completed replacement of the original force-based requirement. |
| S05 | Six disciplines/twenty-four abilities became six selected M1 techniques, with M1 itself unrendered | Explicit ch14/36 and manifest | Scope reduction was documented, but cannot support a claim of complete action combat. |
| S06 | Civilization doctrines reduced to one rooted settlement/mobile caravan | Explicit ch12 | Avoiding shallow faction copies is sensible; it still leaves multiple civilizational forms unbuilt. |
| S07 | PvP 3v3 deferred; pavilion first; then living crossing first | Explicit ch22/36/50/52/53/59; ten changes recorded for v0.7 | Not silent deletion; repeated roadmap revision means user-facing delivery must enumerate what remains unavailable. |
| S08 | Humans and AI agents became trusted local human/agent/keeper roles | Explicit ch54/56 | Shared legal actions are real. They do not establish actual autonomous external agent participation, equal authority in all roles, or competitive fairness. |
| S09 | Causally generated story became exact templates and bounded graphs | Explicit ch57 | Truthful and useful, but not general emergent narrative, an expressive cast, or the proposed living history experience. |
| S10 | “New genre/no one conceived it” became an original integration hypothesis | Explicit ch05/24/31/37/51/53 | Correctly limited: replay takeover, worlds, ports, agent towns and artifact games have prior art. No historical priority or best-ever claim is established. |
| S11 | Complete ZIP preserved deliverables, not every chat artifact | CONTEXT/Conversation_Brief.md and Scope_and_Coverage.md | The archive excludes unavailable assistant/tool turns, raw transcript, full external source texts/videos, every historical PDF and final art. “All knowledge in the chat” cannot be claimed byte-for-byte. |
| S12 | Older chapter voice remains inside new edition | Ch40 says “This document is edition 0.5” inside the v0.7 dossier; protocol examples in ch54–58 contain typesetting spaces such as `0.7. 0` | Historic semantics are preserved, but editorial ambiguity remains. Keep version-indexed profiles authoritative and clean executable identifiers in current prose. |

## D. Previously wrong behavior or assumptions that the project itself records

These are **historical findings**, not a claim that every delivered version remains broken. The audit record should show the fix and distinguish algorithm repair, schema repair, proposal clarification and remaining implementation work.

| ID | Earlier defect or inadequate assumption | Recorded correction / remaining limit | Anchor |
|---|---|---|---|
| H01 | Equal-tick interrupt/attack result depended on iteration | Freeze due releases; full engine integration still missing | Ch37/39/50; semantics lab |
| H02 | Shared shields and same-tick healing insufficiently defined | Proportional allocation, exact remainders, bounded healing and batched deaths tested locally | Ch27/37/39 |
| H03 | Work intent omitted physical sources/hauling/rehearsal detail | Typed variants added; production scheduler remains a build task | Ch29/37 |
| H04 | Escrow implicitly freed physical space | Keep input occupancy and reserve output headroom; reproduced mill deadlock | Ch16/37/39 |
| H05 | Global-minute job completion altered throughput | Exact due ticks replace global accounting rounding; integrated workload can expose other races | Ch16/37/39 |
| H06 | Minimum-fill changes left executable orders unmatched | Drain activation queue to closure; multi-party aggregate fills remain a different contract | Ch17/37/39 |
| H07 | Timed movement effect could expire before use | Phase-aware start and exclusive end; local tests | Ch27/37/39 |
| H08 | Cross-region same-tick authority unspecified | One coordinator for first valley; truly distributed causality remains unbuilt | Ch26/37 |
| H09 | “Sorted JSON” insufficient for unambiguous hashing | Strict custom Unicode/integer serialization, vectors and malformed-input rejection | Ch27/37 |
| H10 | Whole-actor revision could invalidate ordinary moving casts | Admission revision plus relevant execution predicates; actual moving-cast integration still untested | Ch27/37 |
| H11 | Catalog validator admitted negative/contradictory values | Meaningful bounds and regression mutations added | Ch37 |
| H12 | Relay funding and revoked standing orders lacked exact boundaries | Exclusive supply intervals and phase-1 cancellation; physical campaign absent | Ch20/37/39 |
| H13 | Ecology robustness was partly tautological | Exact observed growth cancels algebraically; lag/bias/overshoot sweep added | Ch33/39 |
| H14 | Raw recurring fees might be called money sinks | Transfers distinguished from actual destruction in accounting tests | Ch25/33 |
| H15 | Concave per-account reward treated as resistance to replicas | Square-root splitting and pool-capture counterexamples retained | Ch25/33 |
| H16 | Native fighter windows rounded into 30-Hz world clock | Fifteen false punish positives among 900 pairs; retain native 60 Hz | Ch41/49 |
| H17 | Global respawn wave could revive immediately | Minimum 90-tick absence; near-ten-second cutoff discontinuity remains | Ch45/49 |
| H18 | Dropped objectives could stop pressure | Clock follows both lights away, including dropped state | Ch45/49 |
| H19 | Ordinary resource cap could prevent refunds | Separate bounded recovery fuel; disappeared authority still unresolved | Ch44/49/50/52 |
| H20 | Endpoint collision missed fast shots/thin cover | Swept intersection added for supplied frozen rectangles; circle-corner/moving-target limits retained | Ch49 |
| H21 | Queue reports crashed on no/fully censored arrivals | Null means and censoring retained instead of fabricated zero wait | Ch49 |
| H22 | Participant A's reused token blocked participant B | Scope request identity to principal/actor plus token | Ch50/52 |
| H23 | Cached retries padded history without revision progress | Require actual revision progress and bounded record counts | Ch50/52 |
| H24 | Fighter verifier accepted unsupported semantics but helper used hardcoded rules | Reject incompatible profile contracts; still not full fighter runtime | Ch50/52 |
| H25 | Teams could differ after accepted terms | Freeze four-seat roster and carry through replay-derived settlement | Ch50/52 |
| H26 | Publication rights did not bind all source parties and branch maker | Bind full consent registry and actual authorship; local trust remains | Ch50/51/52 |
| H27 | Boolean equaled integer at evidence boundary | Compare canonical typed bytes | Ch50/52 |
| H28 | Tutorial introduced Catch outside selected M1 kit | Teach telegraph/evade/selected defense; Catch deferred | Ch21/50 |
| H29 | Supply proxy could be mistaken for physical capture | Explicitly separate relay supply eligibility and actual ownership-capture | Ch20/39/50 |
| H30 | Zero-startup admission timing was not fully specified | Clarified T release/T+1 locomotion; this is a spec clarification, not executed engine fix | Ch27/50 |
| H31 | Bridge need 5 appeared solved while caravan needed 6 | Bridge shortage target corrected to 6; ecology remains 5 | Ch54/58 |
| H32 | Search grammar manufactured an unavoidable tradeoff | Permit legal second bridge input; Mercy Braid exposes grammar exclusion | Ch55/58 |
| H33 | One completed quest hid later failed bridge service | Added ongoing/late safe-pulse diagnostics after seeing result | Ch55/58 |
| H34 | Repair assumed 18 fiber when only 15 available after salvage | Preserve failed attempt; implement partner repair and different solo route | Ch57/58 |
| H35 | Literal reserved edge did not preserve desired contribution | Helper avoids other incoming routes; raw API can still bypass the semantic intent | Ch56/58 |
| H36 | Execution could use a different helper plan than preview | Bind exact world/revision/epoch and accept only the viewed first action | Ch56/58 |
| H37 | Authorized absent builder can occupy all scarce public slots with weak channels | Revocation does not grant removal; prospective lease/easement recovery is still missing | Ch56/58/59 |
| H38 | Cart appeared partly across while its whole cargo remained at origin | Keep cart at origin during qualification; physical movement remains missing | Ch54/58 |
| H39 | Genesis/final narration implied nonexistent past/future pulses | Explicit genesis and read-only terminal episode; no next-step prompt after completion | Ch57/58 |
| H40 | Delivery narrative could imply eating/gratitude without those systems | Restrict factual templates to actual delivery/ownership/payment/events | Ch54/57/58 |

## E. Why impressive experiment totals did not prove the game

| ID | Actual evidence | What cannot be inferred |
|---|---|---|
| E01 | 65 v0.7 test methods; 252 graph/priority oracle cases; 6,312 finite search cases; 61 selected fresh world validations; 12 HTTP checks | These units cannot be added together as independent tests or players. They do not measure enjoyment, player skill, a full MMO, browser usability or economic sustainability. |
| E02 | 280 v0.6 tests include 98 retained/import-adapted and 182 additional | Adding the historical 187 again inflates the distinct test claim. Older unchanged files can retain known historical defects. |
| E03 | v0.7 graph oracle compares 42 graphs × six priorities to an independent cut method | Strong evidence for this bounded transport evaluator, not all possible material laws or a physical fluid model. |
| E04 | Mercy Braid beats all 408 equal-cost candidates in a restricted balanced-weather grammar | Search excludes dual-parent sinks initially, odd capacities, changed feeders, adaptive edits, temporary channels and partners. It does not establish global optimality. |
| E05 | Braid wins original storm/reversal delivery/ecology objectives | A one-shot delivery objective missed later bridge failure. New service diagnostics were added after observation; they were not preregistered. |
| E06 | 61 World validations reproduce selected finite cases | Selected cases are not an independent exhaustive validation of every candidate or real-user preference. |
| E07 | The invited helper supplies useful legal one-junction plans | It cannot discover Mercy Braid by design; limited search failure is not proof that no solution exists. No LLM was tested. |
| E08 | 200 seeds and later 3,600 ecological runs | All use assumed growth/demand/noise/compliance. They omit prices, player adaptation, substitutes and many disturbances. Percentiles are simulation variation, not player confidence intervals. |
| E09 | Queue study uses 287,462 synthetic arrivals per split across seeds | Fixed demand, FIFO batching and unlimited concurrent match capacity do not predict AWE population, retention, actual waits, geography, MMR or abandonment. |
| E10 | Lanternwake completes legal captures against idle/noncontesting scripts | Reachability and settlement integration are real; challenge, competitive balance, actual shooter geometry and fun are not established. Symmetric stress scripts had zero captures. |
| E11 | Raincatch scripts score public cues; holding shelter passes | Appropriate tutorial state machine, no competitive depth or human-equivalent agent behavior proved. |
| E12 | Fighter graph has 12 paths, three edges, 32-health maximum contact arithmetic | Assumes legal contacts land. No full fighter simulation, usable spacing, actual combos, opponent choice or balance. |
| E13 | Projectile sweep exact for square against frozen axis-aligned rectangles | Conservative for circle corners; no moving-target sweep, rotated cover, full candidate query or measured networking. |
| E14 | LoomTable 2,000 geometric boards agree across connectivity implementations | These boards need not be legal match states. The 32 scripted games did not optimize to win; their 31 draws do not establish balanced strategic play. |
| E15 | Playable Letter enumerates roots plus one opponent reply | Two-ply completeness is not full-game solving or guaranteed safety after later replies. A late eligible position and selected contrast can bias apparent interest. |
| E16 | Afterimage alternate wins versus historical actions but often draws versus one reactive policy | Useful causal counterexample, not prediction of the original person or optimal opposition. Its short fixture starts at a constructed checkpoint. |
| E17 | Hashes, local replay, canonical serialization and finite payment pools verify bounded invariants | No external authenticity, independent onchain transition proof, live authentication, Sybil fairness or market demand follows. |
| E18 | No new defect in the final 16-method adversarial suite | Means none found within that suite and source revision; not proof of no defects. Two harness representation fixes were correctly not claimed as kernel repairs. |
| E19 | HTTP API and JavaScript syntax checks passed; browser installation timed out | Neither tests actual visible interaction. New live build should not repeat this evidence substitution. |
| E20 | Formative/confirmatory human protocols and future scenario banks are detailed | They are planned studies, not observed participant results. “No human study” remains true through this archived baseline. |

## F. What genuinely deserves preservation

The archive is not empty theater. It contains executable algorithms, exact rules, conservation tests, finite search outputs, failed scenarios, multiple versions and explicit corrections. Important work includes the independent small-network oracle, output-space deadlock witness, order reactivation closure, exact phase/timing corrections, one-shot funded settlement, request-scope repairs, recorded-versus-reactive alternatives, and the legal counterexample to a restricted design grammar. Do not discard these and replace them with buttons that merely increment counters or decorative menus.

The most valuable creative thread is one stable entity acquiring new functions and history through real action. Rebuild around that, while preserving the larger action, settlement, society and games portfolio. The user can reasonably reject another narrow rain puzzle as the entire answer. More written names alone will not close the gap either: each claimed implemented system needs a visible state change, a player-controllable action, failure/return behavior, and evidence from the actual rendered application.

## G. Required honesty for the current rebuild

1. Lead with the concrete missing work, not an invented confession of intentional deception.
2. Distinguish baseline defects, fixes already made, current missing systems and new verified repairs.
3. Review the v0.8 Site before repeating any v0.7 missing-feature claim against it.
4. Preserve full prior requirements in a visible coverage matrix: implemented, partial, designed, and not started. Do not relabel an isolated laboratory as a website feature.
5. The live website must be an actual game to explore and play. Cards describing raids or agent societies do not implement them.
6. If the delivered website remains single-player with scripted actors, say that plainly even while adding substantially richer action, construction, economy, places and nested games.
7. No “entire MMORPG complete,” “all research mastered,” “fully onchain,” “live AI society,” “best game,” or “visual QA passed” claim without the corresponding evidence.
8. A new factual archive should preserve this audit, current source, latest design changes, exact commands/results, and the distinction between visible chat and a raw platform export.

## H. Highest-value corrective play scenarios

- Start empty, acquire materials through actual actions, create a traversable bridge, cross it, move a conserved cargo lot, fulfill one funded agreement, and consume/distribute that cargo through a real world process.
- Use one material relation in traversal and combat, then in a structure; show actual shared events and counterexamples. Keep water routing as its own law if force remains unimplemented.
- Enter a nested game from the world, freeze the same body, finish/leave/reconnect, and return with exact inventory and one factual record. No duplicated world actions while seated.
- Let a scripted agent propose work from observed state, reserve a human contribution, stale the preview, revoke authority, and verify that no stale or unwanted work completes. Add real model integration only through actual supported infrastructure.
- Build an installation under a prospective public maintenance agreement; simulate absent builder and resolve access/salvage under those already accepted terms.
- Finish the delivery by favoring the bridge, observe independent ecological consequences, then recover through genuinely different solo and partnered routes without free materials or repeat payouts.
- Play a readable defensive combat exchange, a complete objective match against a responsive opponent, a table game, and a short festival game; verify controls and full terminal/return behavior in the actual browser.
- Save, reload, branch history, return to current state, export a record, and ensure no branch duplications or historical payout replay. Keep local persistence clearly distinct from shared durable authority.

This audit is exhaustive over the enumerated material findings extracted from the recovered 59-chapter prose and named metadata, not an assertion that every source, every code path, every inaccessible chat turn or the entire game corpus has now been audited.
