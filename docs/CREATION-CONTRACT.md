# Creation implementation contract

This contract describes the current local implementation. Future shared-server requirements are explicitly separated. Units are world steps and simulation ticks; there are 60 ticks per second.

## One state, several bounded solvers

`world.js` retains the exact water/ownership/commission rules. `realm.js` owns the character, material accounts, actors, combat and activity transitions. `creation.js` validates data and executes authored instances. `navigation.js` supplies cached bounded paths to the same legal-movement predicate. `rehearsal.js` creates an isolated realm and observes its outcomes. `creation-view.js` draws shared part geometry; `studio.js` edits recipes; `app.js` coordinates input, dialogs, audio and local persistence.

No imported code executes. There is no server, database, model connection or blockchain in this release. Local state is editable by its owner; validation is consistency checking, not authentication or anti-cheat.

## Exact recipe surface

The schema is `awe-blueprint-1`. A recipe requires all of these fields and rejects unknown top-level fields:

| Fields | Accepted data |
|---|---|
| `schema`, `id`, `revision`, `parent` | Fixed schema; 1–100-character ID; integer revision 1–10000; null or lineage string up to 120 characters |
| `name`, `kind`, `material` | Plain name 1–64 characters; creature/relic/structure/instrument/trial; wood/stone/ore/herb/crystal |
| `power`, `reach`, `tempo` | Integers 1–8, sum no more than 12 |
| `verb` | bolt/wave/mend/ward |
| `rules`, `resource` | One to four exact `{when,do}` objects; wood/stone/food/herb/ore target |
| `score`, `beat`, `voice` | Exactly eight integer pitches 0–12; 12–60 ticks; mend/ward/force |
| `course`, `seconds`, `order` | 3–12 exact `{x,z}` points, each coordinate −12 through 12; 15–180 seconds; sequence/any |
| `parts` | 1–32 exact part records |

A part requires `shape,x,y,z,w,h,d,color,role,yaw`. Shapes are box/orb/spire/ring. X and Z are −8 through 8; Y is 0 through 8. Dimensions are 0.05–8; yaw is −180 through 180 degrees. Color is a string containing exactly a six-digit hex color. Role is ornament/light/solid/walkway. Solid and walkway roles require a box in a structure recipe. A walkway's top is 0.16 and its height no more than 0.32.

The editor and local API can generate a valid complete example. Fields irrelevant to a family's current runtime are retained for a stable common schema; they do not secretly grant that family another family's powers. These limits do not mean every valid design is useful or artistically successful.

## Derived mechanics and costs

The compiler clones validated recipe data. It never trusts imported cost, damage or runtime code. Estimated material volume sums each part's width × height × depth, multiplied by 1 for a box, 0.53 for an orb, 0.33 for a spire or 0.1 for a ring. These are game cost coefficients, not exact mesh-volume integration.

The chosen material cost is `max(1, ceil(volume / 3 + partCount / 8))`. A creature adds two wood and one herb; a relic adds two ore; an instrument adds two wood; a trial adds two stone; a structure adds one stone. When the selected material matches an added input, the amounts accumulate.

For a relic with power P, reach R and tempo T:

```text
startup = 36 − 3T ticks
active = 2 ticks
recovery = 14 + 2P ticks
base impact = 4 + 3P
reach = 2 + 2R steps
Breath cost = 10 + 2P + R
bolt speed = 10 + 1.5T steps/second
```

The wave attack uses a full-circle range check with ordinary cover obstruction; bolt uses swept projectile collision. Mend/ward actions emit a spatial effect of one quarter of the compiled impact. Existing world discipline/equipment bonuses still apply to relevant damaging actions. The twelve-point budget bounds the base move and is not a competitive balance proof or a guarantee about total equipped damage.

Creature speed is `1.6 + 0.3T`; perception is `3 + R`; a guard hit costs `8 + P` energy, deals `3 + 2P` damage and has `100 − 7T` ticks of cooldown. Harvesting consumes that energy after 100 in-range, supply-ready ticks and transfers one actual resource into cargo. Delivery requires arriving within 1.6 steps of the owner. One food becomes 80 energy, recorded as spent food; feeding rejects when energy exceeds 20. Movement itself currently has no energy cost and creatures do not starve while their player is away.

Creature rules use first-match semantics. `threat` checks a nearby living enemy; `hurt` checks owner health below half maximum; `hungry` checks insufficient energy for its compiled action; `always` always matches. `follow`, `guard`, `harvest`, `orbit` and `rest` are bounded local operations. Cargo temporarily overrides the selected rule with delivery. Guard contact must be unobstructed. No anatomy-derived gait, learned policy or language understanding is implied.

A performed instrument pays 40 Breath up front, starts at the next tick and schedules eight notes separated by its beat. Each emits a wave with strength `1 + P/2` and maximum radius `3 + R`. Radius grows by 0.12 per tick. Each eligible body is affected once as the front reaches it. Mend is capped by maximum health; ward is shared, capped at 30 and expires after 180 ticks; force damages world enemies. These waves do not model realistic acoustics or line-of-sight sound obstruction. Frequency is `220 × 2^(pitch/12)` Hz. Mute suppresses audio, not simulation. Reuse is gated for 720 ticks; normalized activities pause the score and shift its remaining schedule on return.

A trial spawns in its isolated clearing at `(-83,-43)`. A sigil is touched within 1.5 steps. In sequence mode only the next sigil is eligible; in any mode all remaining sigils are eligible. Completion is evaluated before timeout on the exact deadline. One personal result is recorded, with no inventory payment or loot. There are no user-authored course obstacles in this version, and valid points fit inside the circular clearing. A short clock can still make a course impossible; compilation does not prove timed solvability.

## Material custody and transactions

For each material, the accounting invariant is:

```text
pack + merchant + world reserve + permanently spent
+ authored-instance investment + worker cargo + authored-creature cargo
= initial world supply
```

Original building inputs are tracked in `spent` and also recorded per building for reclamation authority; the per-building record is not counted a second time. A saved settlement cannot claim investment greater than its spent account. Original buildings recover floor(0.75 × each invested amount). Authored creations hold their recoverable matter outside spent and recover exactly that amount. Consumed food and fuel do not return.

Instantiation validates recipe, living world body, instance cap, position, geometry and all available inputs before making any debit. It then subtracts the exact bill and creates one instance with an independent blueprint copy and investment bag. A draft edit cannot mutate it. A custom attack similarly pins its compiled move at attack start; an already emitted projectile owns its values.

An instance may be reclaimed only once, within reach of a visible part. Cargo and active performances must finish first. Removing a deck is rejected if an occupant would lose its last original/authored support. Reclamation is allowed when independent support remains. These are local single-owner rules; they do not implement public infrastructure title, consent or an absent-owner dispute process.

Placement requires a center within 16 steps of the living world body and declared world bounds. Ordinary instances require legal supported ground. Structures require original-ground anchoring; solid boxes reject actor overlap, existing construction and proximity to resources, landmarks and safety landings. Complex arrangements can still obstruct routes; the system does not claim universal graph connectivity or structural stability. Reclamation and safe bank recovery remain available within their stated rules.

## Persistence, epochs and isolated practice

World profile `awe-dream-foundry-0.10.0` uses the local key `awe-concord-v10`. A `awe-living-concord-0.9.0` snapshot is cloned, assigned empty creation state, given explicit original-building investments, cleared of leaked respawn invulnerability, then fully validated. This does not grant old worlds the new starter supplies. The old local key remains available as a migration source. v0.8 worlds are not supported by this migration.

There are at most 24 drafts, 16 instances, 160 creation-memory entries, 40 personal trial records and four unapproved proposals. An instance retains blueprint version, investment, position, home, entry bank, energy, cargo, task, cooldown, gathering progress, score cursor and age. Ephemeral note/wave events and unapproved agent proposals are cleared from snapshots. Malformed typed values, inconsistent material totals and unsupported save shapes reject before replacing the active world.

World activities use one entrance checkpoint. Duel/CTF/trial normalize equipment and exclude custom mechanics and world consumables. Returning restores the same world health/equipment and clears exhibition bodies, projectiles and temporary protection. Snapshots taken inside an arena encode that entrance checkpoint, not a duplicate arena inventory.

Autosave is serialized through one exclusive browser Web Lock, with the latest snapshot read after lock acquisition. Without the lock API, automatic saving is disabled and manual export remains available. A persisted browser-history restoration reloads to reacquire ownership. Hidden tabs/panels pause simulation; there is no offline growth or catch-up. This is a local tab contract, not distributed transaction authority.

A rehearsal creates a fresh realm and issues only its disposable construction bill. It never clones editable references from the active world. While it is active, the real world object is retained separately and all automatic save calls serialize that original. World import/export and reset are blocked in rehearsal; return discards the lab and retains only the recipe and factual report. A lab snapshot fails normal material conservation. Controlled results retain recipe, scenario, method, timing and ledger residuals, enabling exact bounded repetition. No synthetic result grants world goods.

## Human and local agent boundary

`globalThis.aweCreator` exposes `schema`, `example(kind)`, `inspect()`, `preview(recipe)` and `propose(recipe)`. This is a browser-local development interface. It is not a remotely authenticated API. `preview` uses the same compiler without spending. `propose` requires the player's invitation, accepts bounded recipe data for review and cannot instantiate or spend. Revoking the invitation clears pending proposals. The human still inspects, edits and performs normal placement with current materials.

The original Serein water planner keeps its separate invitation, grant-epoch and exact-plan acceptance checks. Workers, enemies and authored creatures remain scripted. There is no connected language model, inference budget or fair competition between a camera-limited human and a full-state agent.

## Before this becomes a shared game

An authoritative command envelope must name principal, controller/grant epoch, world/rules version, expected revision, idempotency key and bounded payload. A server must recompile the recipe and atomically validate authority, space and custody before committing event and material transfers. Reconnect retries must return the existing result; stale commands must fail without partial debits. A render client must never decide inventory, title, hit results or permission.

Human and agent commands can share this path while having explicitly different accepted roles. Competitive parity additionally requires matched observation scopes, tick access, reaction limits and experiment budgets. External model latency, inference cost and revocation need measured behavior. Multiple activity solvers may share custody and history without pretending a fighter, a civilization and a song use identical mechanics.

Crypto remains a proposed optional settlement boundary. Recipe identity, authorship attribution, license, instance title, service obligation and payment must be separate records. A digest does not prove originality or make another engine execute an asset. A real settlement feature needs deployed code, available data, independently reproducible outcomes and measured costs/failure recovery before claiming ownership portability or economic benefit.
