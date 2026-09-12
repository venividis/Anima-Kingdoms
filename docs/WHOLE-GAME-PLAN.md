# AWE v0.10 — whole-game release review and next gates

11 September 2026 · independent, read-only design review

## What this review establishes

The Dream Foundry source adds a consequential creation layer to the existing local world. A player can compose a three-dimensional object, attach a bounded behavior, rehearse it through the normal simulation, and instantiate it using tracked world materials. This is a substantial change to the game's central promise: the player can now introduce working things rather than only choose among the original building recipes.

This review inspected the current `creation.js`, `rehearsal.js`, `realm.js` and `studio.js`, with selected `app.js` integration paths. “Implemented” below means present in these inspected sources. Final automated evidence is recorded in the release guide and downloadable verification. This independent source review does not certify browser results or player response. It makes no fresh external research claim. The earlier accountability audit remains relevant, with version-specific repairs and changes distinguished from remaining scope.

The source reviewed declares profile `awe-dream-foundry-0.10.0`. It remains a local game. A procedural authoring vocabulary is now present; arbitrary imagination-to-software, massively multiplayer infrastructure, autonomous model participants and crypto settlement are not.

## The six most compelling actual changes

### 1. A player's drawn form can become a persistent world object

The editor supports box, orb, spire and ring parts; position, dimensions, rotation, color and role; duplication and removal; undo/redo; and mirrored silhouette drawing that places actual three-dimensional parts. The same blueprint is compiled for preview and instantiation. Recipes can be saved, branched, exported and imported. Changing a saved recipe does not silently rewrite earlier world instances.

Why this matters: the shape can be the player's own composition, and its presence survives the editing session. This is a concrete beginning for imagination becoming an inhabitant or object of the world. The current bounds are explicit: 1–32 parts, 24 saved recipes and 16 instantiated creations. This is not freeform mesh sculpting, automatic rigging, text-to-anything synthesis or unlimited geometry.

### 2. A created structure can change where bodies and projectiles go

Structure parts can be ornaments, lights, solid boxes or walking decks. Decks contribute actual traversable surfaces; rotated solid boxes participate in movement and projectile obstruction. Placement checks include proximity, original-ground anchoring, protected places, occupied bodies and existing construction. Reclamation refuses to remove a supporting surface when another body or creation depends on it.

Why this matters: architecture acquires consequences. A player can make a crossing or barrier whose function reaches beyond a decorative model. The system still uses a bounded horizontal collision model, and decks all meet the common surface height. It does not simulate structural engineering, collapse, stacked floors or arbitrary terrain. The existing wagon's water qualification remains a separate civic rule, discussed below.

### 3. A creature's ordered rules produce real work and decisions

Players can author up to four first-match rules using `always`, `threat`, `hurt` and `hungry` conditions, and `follow`, `guard`, `harvest`, `orbit` or `rest` actions. Creatures use the common navigation and collision path, spend food-derived energy on guarded combat or gathering, and physically carry a resource from the finite reserve to the player. Their carried bundle is included in material accounting.

Why this matters: a creature is now more than a named shape. The player can change its priorities and watch the consequence. The implementation is a finite rule interpreter. These creatures are not language-model agents, evolving species or simulated conscious beings. Their body parts are expressive geometry; the code does not derive biomechanics from anatomy.

### 4. An authored relic becomes an actual action

Power, reach and tempo share twelve points. The compiled action derives startup, recovery, damage, reach, Breath cost and projectile speed from these choices. Bolt, wave, mend and ward verbs use the common action/wave systems. The action stores a copy of the compiled move when it begins. Authored actions are available in the world and boss encounter, while normalized duel, CTF and authored trials exclude them.

Why this matters: an idea changes timing, distance and effect in real play. A last-second blueprint edit cannot rewrite the already started custom action. The point budget is a bound, not proof of balance. Relic geometry does not define its exact contact volume: collision still follows the compiled range/arc or projectile rules.

### 5. A composed score sends timed effects through space

An instrument has eight pitches, a 12–60 tick beat interval, and a mend, ward or force voice. Performing spends forty Breath, emits notes through the creation tick, and sends expanding waves whose contact produces the corresponding effect. `app.js` plays the emitted notes from that same tick data. Healing is health-limited; wards are capped and expire. The instrument has a recovery period.

Why this matters: music is now coupled to an enacted sequence, with effects arriving through a spatial process. Pitch currently changes sound; voice, power and reach govern the mechanical effect. There are no rests, individual note lengths, per-note operations, receiver wiring or realistic acoustic physics. The phrase “score with an address” currently describes its placed spatial origin, not a connection to a selected building.

### 6. Creation has a repeatable loop of trial, play and revision

The same runtime supports a disposable living rehearsal and a deterministic experiment. Results retain the exact recipe and selected measured outcomes; the editor compares the latest two reports and exports evidence. Separately, a player can author a 3–12 sigil course, choose ordered or any-order collection and a 15–180 second timer, place its gate and enter the resulting local activity. Recipes and trial results do not mint world assets. Instantiated creations hold their invested materials, which can be reclaimed once subject to cargo, performance and surface-dependency checks.

Why this matters: making a second version can respond to something the first version actually did. The player can also author a small playable challenge. The current challenge grammar is sigil collection, not a general fighter/shooter/raid programming environment. Controlled policies use the local simulation's state; their scores are not human playtests or evidence of universal quality.

## Whole-game coverage matrix

Every major family of the user's ambition remains visible here. A next gate is a falsifiable condition for advancing a claim, not a claim that the gate has passed.

| Ambition | Source-present v0.10 scope | Important unfinished scope | Next falsifiable gate |
|---|---|---|---|
| A new genre and imagination becoming reality | Authored form and bounded behavior enter one local world, with rehearsal and consequences | The creative grammar is finite; novelty, emotional effect and “best ever” are unestablished | An unfamiliar player makes, uses and voluntarily revises a creation without a developer explaining every step |
| Inhabited MMORPG world and exploration | First Orchard, near/far banks, authored surfaces, discovery, Atlas, activity clearings | Multiple inhabited regions, online people, world streaming, persistent shared authority | Two independent clients see one placed entity, one inventory transfer and the same recovered world after a server restart |
| Creation across creatures, weapons, buildings, music and games | Five typed creation families, part composition, rules, scores, sigil courses, branch/import/export | Freeform meshes, rigging, richer behaviors, arbitrary mechanics, text-to-function synthesis | Two independent designs per family produce visible and behavioral differences under the same declared test scene |
| Humans and AI as participants | Human editor, rule-based creatures, workers/bots, Serein's bounded water planner, local blueprint-proposal interface | Connected model service, authenticated agent identity, comparable observations, inference budgets and durable controller recovery | A live agent proposes through the same validated command interface; stale, revoked and overspending actions fail without partial mutation |
| Character, abilities and companion progression | Three disciplines, four original timed moves, authored relic action, equipment, consumables, milestones, Lumenling memory | Full avatar creation, 24-ability roster, deep progression, varied movement/voices, learned companion behavior | A new player can identify their build's actual tradeoff and complete a recovery journey without a reset |
| Action combat and fighting-game depth | Sixty-Hz startup/active/recovery, guard/guard break, evade, projectiles, cover, batch duel outcomes, local two-human duel | Combos/cancels, hitboxes tied to detailed animation, rollback, latency fairness, broad matchups | Parameter-extreme builds and multiple legal policies fail to reveal an unintended dominant loop; then observed players can read and punish commitments |
| PvE, quests, dungeons and raids | World enemies, milestone quests, three-phase Root Warden, finite cache | Cooperative raids, encounter portfolio, dialogue-rich quests, ecological dungeon consequences | Distinct plausible play styles complete the boss with readable openings; a first cooperative encounter proves synchronized roles and recoverable failure |
| PvP, shooters and battlegrounds | Bot 2v2 CTF, local duel, physical shooting range, cover and flag lifecycle | Human online teams, matchmaking, ranked ladders, spectators, anti-cheat, shooter variety | Two actual human clients complete a flag match through disconnect/rejoin with exactly one flag carrier, result and body per participant |
| Games inside the game | Raincatch, Loom Table, range, duel, CTF, authored sigil course/gate and entrance return | General game-rule editor, imported games, creator publication/discovery and tournament services | A second player imports a recipe, funds their own gate, completes its pinned rules and returns without inventory or reward duplication |
| Strategy and civilization | Six original plots, five building types, two workers, actual cargo; authored collision and paths; building demolition with partial recovery | Households, consumption society, technology ages, armies, diplomacy, multiple settlements and strategic AI | A constructed route changes a complete production–delivery–consumption chain, including a closure and an alternative route |
| Microeconomy and marketplace | Finite six-material stocks, NPC stock-sensitive quotes, conserved Marks, input-consuming crafting, funded original commission, creation investment/reclaim | Player exchange, market institutions, service contracts, production renewal, measured demand and price behavior | Two independent principals exchange a unique instance/material lot atomically; restart and replay cannot duplicate either consideration |
| Crypto, ownership and portability | Local recipe/world export; original architecture remains documentary | Wallets, chain contracts, verified settlement, title/license enforcement, proof/data availability and actual asset interoperability | One precisely scoped ownership/settlement operation is independently reconstructed from pinned rules and available data; measured failure/cost limits are published |
| Ecology and living creatures | Water allocation, orchard/reed harvest prerequisites, finite resource extraction, food-powered authored helpers | Renewable growth, food webs, reproduction, predators/prey, carrying capacity and migration | One plant/creature cycle has explicit inputs, growth, consumption and bounded replenishment; adversarial loops cannot create unlimited goods |
| Social life, network effects and governance | Local records, invitation/revocation for bounded help, creator lineage labels, co-located play | Chat/guilds, real human relationships, institutions, land/service rights, disputes, moderation, identity and measured network effects | A small group maintains shared infrastructure under accepted repair/removal terms, including an absent owner and a participant's exit |
| Art, animation, audio and accessibility | Procedural world and part models, original panorama, shared scene data, timed notes, HTML controls, touch affordances, focus handling and reduced ambient motion | Production art direction, rich creature rigs, camera/device assurance, screen-reader journey, accessible authoring alternatives and adaptive score | Actual browser/device observation verifies readable controls and effects; keyboard/touch/non-audio users can finish the same creation journey |
| Backend, durability and engineering scale | Single local state, validated snapshots, bounded arrays and recipes, local save ownership, v0.9-to-v0.10 restore path | Authoritative server, authentication, distributed persistence, event replay, observability, deployment rollback, cost/load capacity | Crash at every commit boundary in a shared prototype; recovery yields one accepted result with intact inventories and creation versions |
| Security and adversarial fairness | Typed data compiler, size/bounds checks, no imported executable code, exact investments, approval restrictions, normalized exhibition boundaries | Independent security assessment, hostile network clients, server-enforced rights, adversarial assets and production abuse controls | Fuzz/import/permission and concurrent-spend tests reject malformed or stale work atomically; externally controlled clients cannot bypass authoritative checks |
| Live operations and stewardship | Local pause/settings, export/recovery paths and explicit current limits | Incident handling, moderation operations, backup restores, migrations across a public population, content/rules compatibility | Recover a staging incident with a documented rollback/migration and no silent deletion or inflation of player-created work |
| Exhaustive game and human/crypto research | Recovered 59-chapter dossier, detailed audit, bounded implementation experiments and versioned evidence | Complete Blizzard/Nintendo/title-version corpus; every attack/raid/pet; broader strategy/fighter/shooter coverage; empirical human and market research | Publish the corpus denominator and claim–source–version mapping for one complete family, then independently reproduce selected conclusions; never imply all titles are covered |

## First devil's-advocate pass: challenge the present release

### The authoring system may look broader than it behaves

Five categories exist, but their expressive range is uneven. Structure geometry affects movement directly; creature anatomy does not determine locomotion; a relic's visible blade does not determine its hit volume; instrument pitch does not determine a different operation. These are legitimate bounded abstractions when explained. They become a renewed shortcut if presented as a universal physics compiler.

**Release response:** Explain each family's real degrees of freedom and limits in its editor, use words matching the current implementation, and demonstrate contrasting behaviors rather than count possible combinations.

### A created bridge does not yet mean the same thing to everyone

`Realm.ground` accepts authored walking surfaces and workers use the shared navigation path. The original crossing quest still calls `Rain.bridgeOpen`, and the wagon still advances through `Rain.tickCargo`. Consequently, a player-made dry span can support the player or workers without satisfying the original water-dependent commission.

**Release response:** Preserve the existing water commission's rule explicitly. Do not advertise that any new crossing automatically completes it. The next civic integration should distinguish “physical route available” from “specific hydraulic service fulfilled,” and let each job declare which it needs.

### A numerical budget is not balance

Twelve points cap power/reach/tempo but do not establish equal practical value. Breath regeneration, range, protection stacking, hit safety, existing equipment bonuses and encounter geometry can dominate the nominal budget. The prior boss policies already showed a large gap between a short melee rush and failed ranged kiting.

**Release response:** Retain parameter-extreme and legal-policy failures. Distinguish reaching a valid action, completing a scenario and achieving competitive balance. No balance claim follows from a compiler accepting all twelve-point allocations.

### Rehearsal can mislead even when it is honest code

The bench creates a fresh scene, issues disposable construction resources and disables the nearby target's decision timing. Damage saturates when its target falls. A low damage total can mean no target remains or the policy never reached one. A fast first impact does not establish a universally superior design.

**Release response:** Show the exact recipe, scenario, policy, elapsed ticks and timing metrics alongside totals. Keep interactive rehearsal distinct from controlled policy measurement. Neither may alter or export the disposable material accounts into the world.

### Recovery helps, but the economy still has dead ends

Authored instances return their exact invested matter on safe reclamation. Original buildings return 75% rounded down. Recovery fiber is a finite keeper transfer, and food powers consumptive work. These make experimentation more recoverable but do not create a renewable civilization economy.

**Release response:** Keep free drafting/rehearsal available after depletion. Test recovery from poor allocations without forcing a world reset. Do not call a finite-resource reserve “growth,” “farming sustainability” or measured market demand.

### Source cohesion is not yet proven delight

The code can be internally consistent while controls, placement, silhouettes, camera or tutorial information remain hard to use. It would repeat the earlier failure to substitute more invariant tests for actually observing these interactions.

**Release response:** Report the actual verification and its limits. Browser/device play, first-time comprehension and sustained enjoyment remain separate gates unless observed. Do not issue a finished-art or public-readiness badge based on this read-only review.

## Revised whole-game plan after the first pass

The plan should expand through complete causal journeys. The following six packages have deliverables and failure gates. They are not promised dates or a declaration that one release finishes the original vision.

| Package | Concrete deliverable | Falsifiable acceptance gate |
|---|---|---|
| 1. Reliable creative release | A coherent editor → rehearsal → placement → use → save/restore → revise/reclaim journey for every supported family, with clear actual limits | Malformed inputs, mid-action edits, spent resources, occupied surfaces, interrupted scores and activity return cannot corrupt the world; observed browser interaction confirms that the journey is usable |
| 2. Civic consequences | One generalized route/job contract connects authored surfaces, actual cargo, destination transfer and household consumption; water-specific jobs retain their own declared predicate | Closing the original bridge sends an eligible carrier across a player-built alternative, and real delivery/consumption occurs once; deleting the path produces a truthful blocked/recovery state |
| 3. Richer creative behavior | One compatible receptor/charge contract, one additional creature role and one richer authored challenge objective, all using existing commands and accounting | An authored instrument activates a placed receptive structure; the same paid charge cannot execute twice or amplify around a loop; the new challenge's objective executes rather than appearing only in text |
| 4. Small shared world | Authoritative server for a deliberately bounded group, authenticated principals, pinned rules, atomic inventory/creation commits, reconnect and crash recovery | Two clients and one authenticated scripted/model participant share the same causal history; simultaneous spending, stale grants and crashes preserve one accepted result |
| 5. Living settlement and culture | Explicit renewable resource processes, resident consumption, service contracts, creator attribution/licenses, institution membership and public-work recovery | A complete production cycle remains bounded; an absent builder cannot strand an agreed public route; joining/leaving a community preserves accepted rights and actual assets |
| 6. Production expansion and optional settlement | Measured encounter variety, competitive netcode, larger-world delivery, creator discovery, live operations and a narrowly scoped implemented crypto contract where justified | Target concurrency and latency/cost budgets are measured; restoration and abuse response work; the external settlement operation is independently reconstructable; players choose to return without financial inducement being the sole cause |

Research runs alongside these packages and answers specific design decisions. Complete a named game family/version corpus before claiming it, compare competing mechanics against the implemented need, and distinguish primary-source facts, designer inference and observed experiments. A larger bibliography cannot substitute for the package gates.

## Second devil's-advocate pass: challenge the revised plan

### Objection: six packages can become another impressive document with no inhabited game

That is a real risk. A package is complete only when its entire journey runs and the evidence is attached. The plan should never advance merely because interfaces or schemas have been written.

**Second-pass revision:** End each package with a short executable scenario and an actual user-facing interaction, plus the counterexample that would reopen it. Persist the exact tested source/rules and failed cases. A completed documentation task does not change an absent feature's status.

### Objection: the common engine can erase the diversity of play

Not every interaction should become a colored wave or a resource-transfer puzzle. Fighters need committed timing and contact; strategy needs delayed tradeoffs and information; creatures need differentiated movement and needs; music needs expression as well as function.

**Second-pass revision:** Share authority, resources, history and lifecycle. Permit different mechanical solvers with explicit interfaces. The next law must add a new understandable constraint and two real uses, not only a new particle color.

### Objection: reliable reclamation may remove meaningful commitment

Perfect recovery can turn a world into an endlessly rearranged toolbox; harsh loss can suppress experimentation. One global rule will not serve private expression, ranked competition and public infrastructure equally well.

**Second-pass revision:** Keep the current local foundry's recovery promise intact. Introduce distinct future activity/public-work contracts prospectively, with visible costs and no retroactive confiscation. Trial remains free. Do not introduce hidden upkeep or absence punishment to manufacture retention.

### Objection: human–agent parity is not equal command syntax

An agent may have perfect state, instantaneous reactions, unlimited trials or more capital while a human has a camera and limited attention. Identical command names do not prove fair participation.

**Second-pass revision:** Pin observation scope, timing, reaction limits, experiment budget and accepted controller role per activity. Keep creative collaboration separate from competitive parity claims. Compare outcomes while controlling for skill, capital and controller access.

### Objection: creation and crypto can turn the world into an asset treadmill

A mechanically interesting creation system does not require a tradable reward for every gesture. Financializing every authored thing could make expression subordinate to optimization and imitation.

**Second-pass revision:** Keep recipe expression, material instantiation, title, licensing and payment as separate concepts. Let participants create and play without a purchase or yield premise. Evaluate actual useful exchange before expanding external settlement. These are product decisions, not a claim that economic sustainability has been demonstrated.

### Objection: internal enthusiasm can become a substitute for evidence again

The creator's excitement is a useful source of direction but cannot certify clarity, fun, novelty or public value.

**Second-pass revision:** The six compelling changes above name actual mechanisms and why they matter. Their quality judgment remains revisable. The strongest next signal is a person making a second creation because the first produced a surprising, understandable consequence, followed by observations across people with different abilities and preferences.

## Three proposed ideas, explicitly not current features

| Idea | What it would add | Principal failure mode | Smallest decisive gate |
|---|---|---|---|
| **A song that changes a place** | A player connects selected score events to a receptive structure. One paid charge packet reaches that receiver and activates a civic effect such as a timed shelter or switch | Becomes remote free power, a charge-amplification loop or a cosmetic song beside an unrelated button | One instrument-to-structure transfer uses the same timed event and conserved charge account; removing the receiver or breaking the declared connection produces a legible failure |
| **A settlement that asks for consequences** | Situations arise from actual unmet consumption, transport or habitat conditions; player creations can satisfy them through more than one legal route | Template quests invent gratitude, ignore the world's changed state or mint unlimited payment | A need closes only after its factual predicate changes; the same solved need cannot pay again; two structurally different creations can resolve it |
| **The archive of useful mistakes** | A player keeps earlier recipes, exact bounded experiment evidence and their own annotations, then discovers a different use for a retired design | Becomes a cluttered generated-content feed, falsely certifies novelty or invents the maker's intent | Retrieve and reproduce one earlier trial, branch it into a new useful context, preserve creator-written meaning and show that mechanical similarity does not erase personal value |

## Release wording that can survive scrutiny

“AWE now has a Dream Foundry: compose working creations, try them in a disposable world, and bring them into the First Orchard using actual materials. Creatures follow your rules, relics perform authored actions, structures affect movement and shots, instruments send timed waves, and gates host your sigil courses. The broader shared MMORPG, live model society, renewable civilization and crypto settlement remain development goals.”

That statement should be paired with the independently established final test/observation evidence. It describes what the current code is built to do without claiming the unfinished vision is complete.
