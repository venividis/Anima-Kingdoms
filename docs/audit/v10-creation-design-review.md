# AWE — creation as the structure of the whole game

Independent design review · 11 September 2026 · v1.0 proposal

This is a design and source review, not an implementation completion report. It reads the current accountability audit, v0.9 implementation contract and relevant `realm.js`, `visual.js`, `app.js` and `pavilions.js` paths against the recovered dossier, especially chapters 53–59. No new external research or browser playtest is claimed. Numerical choices below are proposed starting rules, not measured balance optima. Root must distinguish the parts it implements from the production contracts that remain design work.

## 1. The central correction

The foundational promise should be **a world that can acquire new working things from its participants**. A new name, color, lore paragraph or unlocked preset is not sufficient. A player must choose some of an object's form, some of its behavior and where it belongs; see it act; encounter its limits; and be able to change their mind without losing the entire world.

The current world already has usable pieces: timed attacks, finite inputs, embodied workers, a water network, bounded permissions, a companion, local activities and save validation. The mistake would be to put a separate decorative “creation simulator” next to them. Creation must produce entities and rules consumed by the same combat, collision, resource, activity and save systems.

A shared lifecycle should govern every authored object:

1. **Draft:** Change form and behavior without spending world resources.
2. **Compile:** Translate a bounded, explicit vocabulary into an executable recipe. Unsupported intentions stay visibly unresolved.
3. **Understand:** Show the cost, material sources, capability limits, affected space and a faithful preview.
4. **Trial:** Run the same recipe in an isolated practice state, with no world resource or score export.
5. **Instantiate:** Check the exact recipe, authority, world revision, legal position and available inputs; commit one atomic transition.
6. **Inhabit:** Render, animate and simulate the resulting entity through common rules. Its creation enters the factual history.
7. **Revise or reclaim:** Retain lineage. Recover only that instance's tracked recoverable matter, once. Changes never silently rewrite earlier history.

The critical distinction is between **a recipe**, which may be copied freely according to its license, and **an instance**, whose material and world consequences cannot be duplicated by copying a recipe. A third distinction is **a trial**, whose outcomes never manufacture money or materials in the inhabited world.

## 2. A coherent browser release, with acceptance gates

The browser release should offer all five requested families through one Creation Atelier, while being exact about each family's expressive limits. It should not imply that arbitrary natural language has become arbitrary software.

| Family | Player-authored degrees of freedom | Minimum executed consequence | Evidence required |
|---|---|---|---|
| Creature | Body silhouette, appendages, material/color, locomotion, one learned response, useful role | It moves with visible anatomy, follows a selected policy, performs a real bounded service and can be stopped | Two differently authored creatures demonstrably behave differently under the same scene; cargo/ward/service is real |
| Weapon | Form, reach, tempo, delivery shape, one secondary behavior | Actual attack startup/recovery/reach/projectile parameters follow the compiled recipe | A short fast weapon and long slow weapon produce different legal hit windows; no mid-swing recipe mutation |
| Structure | Footprint, elevation/silhouette, function, orientation, material | Shared render/collision footprint; selected service changes a world predicate or transfer | It cannot intersect the player, block a protected route or grant service before construction commits |
| Instrument | Tone sequence, rhythm, voice and one resonant operation | Heard/visible score and operation use the same timed note events and finite charge | Silence affects only sound, not access; an interrupted or unpaid note does not issue an effect |
| Game | Objective, arena layout, target/obstacle placement, timer, movement/attack constraints | A playable challenge is compiled and terminates under its authored rules | Different rules generate different success conditions; entering/returning preserves exactly one world body |

Creation success should require **visible difference plus behavioral difference**. Passing only one side is a partial feature. An excellent process produces helpful failures: a slow creature struggles to keep up, a long weapon gets punished in recovery, a shelter is useful only within its boundary. Those are understandable consequences of authored decisions.

The first release can use procedural forms and parameter controls. It must call these what they are. “Describe” can be a transparent vocabulary assistant that populates form fields; unsupported clauses should be highlighted. A parser that picks “cat” from a sentence cannot claim to understand an entire imagined creature. Sketch-to-rig, arbitrary sculpting, imported meshes and connected model synthesis remain separate capabilities until they run.

## 3. The common blueprint contract

A recipe needs stable semantics rather than a growing bag of display strings:

```json
{
  "schema": "awe-blueprint/1",
  "kind": "creature",
  "name": "The Orchard Listener",
  "form": {"body": "moth", "size": 2, "appendages": 4, "hue": 42},
  "behavior": {"locomotion": "hover", "role": "guide", "response": "wait-near-danger"},
  "limits": {"activeInstances": 1},
  "parentRecipe": null,
  "creatorLabel": "Local player"
}
```

This example is proposed, not a promise that current imports accept it. Keep authored values separate from compiled values. A compiler returns validated form, finite cost, derived mechanical values, runtime budget, compatible activity modes and an explanation of each derivation. Imported clients must not be permitted to supply authoritative derived damage or cost.

Important contracts:

- The compiler is a pure operation: the same validated recipe and rules version produce the same mechanics and cost. Name and hue cannot affect damage or scarcity by accident.
- Bounds apply before allocation or recursion. Reject nonfinite numbers, unknown fields, excessive strings, nested payload bombs and prototype keys.
- Canonicalization pins ordering, numeric units and enum meanings. A local digest supports identity and accidental corruption checks; it is not authenticated authorship or external proof.
- Every instance holds its immutable compiled version, unique local ID, recipe ID, invested inputs, remaining recoverable inputs, runtime state and actual position.
- A draft may change while a previous instance remains alive. Existing instances keep their old recipe until an explicit revision transition succeeds.
- The engine receives a finite set of typed actions, never `eval`, imported JavaScript, arbitrary network URLs or a free-running user callback.
- A cosmetic-only edit should not silently recalculate the physical budget. A physical edit must account for material differences and incompatible equipment/placement.
- Numbers shown in the editor, what the renderer draws, and what the simulation consumes all come from the same compiled record.

For production, blueprint lineage and contributor attribution need explicit rights. A digest of a recipe does not establish originality, ownership, license permission, or another engine's ability to execute it.

## 4. Creature authorship: another way of living, not a pet skin

The smallest meaningful creature combines a visible body grammar, a locomotion policy and one bounded role. The player should be able to make at least recognizably different quadruped, winged/hovering and rooted forms. Legs should move when a ground creature moves; a hovering creature's body should not advertise grounding it does not simulate. Cosmetic wings must not imply unrestricted collision bypass.

Recommended browser roles:

| Role | Exact service | Cost and failure continuation |
|---|---|---|
| Guide | Travels toward a selected reachable landmark, waits when the player falls behind, marks the path it actually found | No invented map knowledge; blocked routes produce a visible wait or alternative |
| Carrier | Moves one identified resource lot between actual source and destination | Holds cargo in its own ledger account; cannot deposit from a distance; recall with cargo returns first |
| Sentinel | Warns about a threat inside its declared perception radius; optional bounded intercept/ward | Warning is based on actual visible threat; ward has finite charge and cooldown |
| Gardener | Performs an assigned harvest stage after arriving at the resource and meeting water/input conditions | Consumes the same service inputs as the job contract; does not conjure fruit |
| Listener | Stores a small set of witnessed event types, follows or waits, and reacts when one recurs | Remembered event references must exist; portrayal does not assert consciousness |

One role per instance at first prevents an all-purpose mandatory pet. A creature need not have combat damage to be useful. Cosmetic size should not grant invisible combat advantages: either its collision/hit shape changes visibly and within a declared envelope, or the editor clearly separates aesthetic scale from competitive normalization.

For a credible first implementation, deterministic state machines are enough: `idle → notice → travel → arrive → act → recover`, with `wait`, `recall` and `blocked` branches. These are scripted creature behaviors. Do not label them connected AI agents.

An authored response rule can initially be a constrained, legible pair: “When the nearby crossing is closed, wait here” or “When my owner is hurt, offer stored protection.” A cooldown, trigger provenance and operation budget prevent event loops. Giving the player those causal choices matters more than producing elaborate text about a creature's personality.

The future ecosystem requires actual food webs, replenishment processes, births/deaths, habitat carrying capacity and movement. The existing orchard water gate does not implement these. Introduce a single renewable plant species with explicit water use, growth timing and seed/reproductive inputs before claiming a whole ecology. Avoid charging a creature a hidden starvation debt while its player is absent; absence behavior is an explicit world mode and care agreement.

## 5. Weapon authorship: expressive tradeoffs on the existing combat clock

Authored weapons should compile to the same sixty-Hz action lifecycle as the four existing moves. Their model silhouette and effective contact region must agree. The existing separate equipment booleans are insufficient for many authored instances; select one equipped immutable weapon instance and derive attacks from its compiled profile.

A simple starting grammar can expose three independent choices:

- **Reach:** short, medium, long.
- **Tempo:** swift, poised, committed.
- **Delivery:** arc, thrust, note projectile.

Each choice must change at least one actual parameter, with a visible consequence. Longer reach costs slower startup/recovery and/or Breath. Wider arcs trade precision or single-target damage for contact coverage. Fast moves should not simultaneously have the best range, damage, safety and stamina efficiency.

Do not treat a single point budget as proof of balance. Use it to rule out obviously unbounded inputs, then examine the resulting Pareto frontier. For every authored weapon, report startup/active/recovery, damage, range, Breath cost and contact shape. Display sustained theoretical damage only with its assumptions; it is not expected match performance.

Most important implementation contract: **snapshot the compiled move at attack start**. Editing a blueprint or changing equipment while an attack is active cannot extend its hit window, recharge it, reset its hit set or transform an existing projectile. A projectile owns its source action/version and damage at emission.

Exhibitions need an honest policy. A normalized default mode can run authored visuals with a pinned common moveset; an experimental “open creations” mode can use compiled mechanics under a shared ceiling. Do not label an arena normalized while secretly preserving custom damage, reach, guard or cooldown. A choice to exclude custom mechanics must be visible before entry.

A useful later shared law is **resonance storage**: a weapon may store a bounded amount of charge from a paid operation and release it either in a strike or into a receptive structure. That would repair part of the original power-to-place promise. It needs a real transfer event, same charge account and explicit dissipation; renaming attack damage as a construction resource would repeat the prior shortcut.

## 6. Structure authorship: the world should answer spatially

Authored structures should start in clearly defined creation parcels with protected access paths. The current six fixed plots are legible, but changing a roof on them is not the full construction promise. A bounded placement field with rotation and an exact ghost footprint would add materially different authorship without requiring arbitrary terrain editing.

Browser structure grammar:

| Function | Visible form | Actual rule |
|---|---|---|
| Shelter | Roof/canopy with a marked footprint | Provides its declared protection/recovery service only to eligible occupants inside its radius |
| Resonator | Ring, spire or bell assembly | Stores a finite compatible charge and exposes a typed activation port |
| Habitat | Pool, garden or nesting structure | Provides one declared habitat condition; needs explicit resource input before service |
| Workshop variant | Work surface plus material-dependent supports | Unlocks or hosts an actual recipe/process; no merely decorative production icon |
| Game gate | Player-authored frame and score plaque | Opens the exact saved authored game version, preserving entry/return contracts |

Do not make every structure a colored healing circle. Each function needs a distinct relation to place, time and another system. A shelter should change occupancy decisions; a resonator should connect a timed operation; a habitat should support a modeled need; a game gate should host actual rules.

Use the same footprint to draw the placement ghost, reject overlap, generate collision and update navigation. Construction must reject overlap with actors, resource nodes, required spawn safety, public service access and activity gates. Root should verify future placement against both current and recoverable bridge states; an open bridge is not permission to trap the far bank when it closes.

Creation recovery needs ownership and material bookkeeping from the beginning. Public infrastructure requires preaccepted removal/repair terms, because the recovered dossier already demonstrates legal slot capture by an absent owner. A private prototype can give the single local player all instance removal authority. Production cannot pretend that local authority solves community governance.

## 7. Instruments: music that is also an inspectable act

An instrument can connect aesthetics and mechanics more deeply than ambient background audio if **the score is executable timing data**. Offer a short note grid, tempo, note length and voice. The same note events drive sound, visible pulses and any declared gameplay operation.

Start with a bounded eight-step score. Empty steps are meaningful rests. A note event contains its step index, start tick, duration, pitch enum and operation enum. Global audio mute suppresses sound only; captions and visible pulses preserve playability.

Two layers should remain distinct:

1. **Expression:** Freely play or record the score; it consumes no scarce world material and grants no tradable yield.
2. **Enactment:** Spend the declared Breath/charge to run an operation through the score at a compatible target. Cost is paid atomically when the enactment begins, or per note using a clearly displayed rule. No sound-only callback may issue a world effect.

Initial operations could be ward, reveal and awaken-resonator. “Reveal” must display an existing game fact or detectable object rather than invent hidden truth. “Awaken” transfers charge into an actual receptive object. “Ward” creates one capped, expiring protection account. All three need operation-specific limits; a generic damage/healing slider would invite burst and stacking exploits.

A particularly coherent invention is a **place score**: a player composes a phrase and connects three notes to three actual civic services. When performed at a resonator, the phrase reads the current bridge/orchard/habitat state and allocates one paid charge packet among compatible services. A dry service produces a visibly unanswered note. This evolves the historical factual town sonification into authored interaction. It is still a designed game law, not a claim about real cymatic healing or higher-dimensional physics.

The rhythm need not turn into a compulsory timing test. Provide step mode and a simple “perform score” control. Accessibility does not mean granting less creative authority.

## 8. Games inside the game: author a promise and play it

The local game maker should compile a declarative capsule. A first capsule can use the existing movement, projectile, cover and target mechanics, so an authored challenge benefits from the same improvements as world combat.

Minimum parameters:

- A legal arena bounds template.
- A finite list of obstacle/target/control-point positions, placed visibly.
- An objective: hit all targets, survive a duration, collect and return an object, or reach ordered checkpoints.
- A timer and finish rule, with simultaneous success/failure precedence.
- Allowed actions and a normalized participant loadout.
- A clearly declared script opponent or two local humans where supported.

A rule is not executable merely because its description appears on a card. If the player chooses “return the bell,” the engine must spawn the bell, track custody, define dropping/returning, and test the named destination. If the implementation currently supports only target courses, call it a target-course creator and leave other objective controls unavailable with clear scope text.

Creation-time validation should reject objectives outside the arena, targets fully enclosed by impenetrable cover, missing spawns and unreachable required checkpoints. Where exact reachability is unavailable, the tool can provide a lower-strength geometric check plus a required local practice completion. A practice completion is still not a universal solvability proof, especially across permitted avatars/controllers.

Authored games issue personal scores initially. A future paid competition must reserve a real prize pool before accepting participants. Closing a game, deleting a gate or revising a recipe cannot mint rewards or invalidate another entrant's already accepted rules. Keep the match pinned to its rules digest and participant custody epoch.

## 9. The economy of making and unmaking

The v0.9 ledger uses `pack + market + reserve + spent + workerCargo` for each material. Its aggregate `spent` account currently combines transformed goods and structures. That is adequate for conservation but insufficient by itself for safe instance reclamation.

Track invested and recoverable inputs per creation. Two viable implementations are:

- Introduce a separate `embodied` account and move inputs from `pack` to `embodied` on instantiation. Every live instance owns part of that balance. Permanent losses move to `spent`.
- Retain aggregate `spent` for compatibility but record per-instance invested inputs and, on reclamation, reduce `spent` by the exact returned amount before increasing `pack`. Prove each salvage ID is consumed only once and never refer to an unrelated aggregate balance as authority to return goods.

The first is clearer; the second is a smaller migration. Both require the sum of per-instance recoverable amounts to be consistent with the ledger. `floor(input × recoveryFraction)` is a suggested deterministic salvage formula, not a necessary design choice. Recovery fraction should be shown before construction. A string of create/reclaim operations must never increase resource totals or restore already consumed fuel.

Designing a recipe should be free. Trial should be free. Instantiation spends actual inputs. Revising an instantiated object should show the cost difference and salvage consequence before committing. Protect expression from total dead ends: permit a free intangible draft, a training instance in the trial space and a return route even when all materials are exhausted.

Do not sell a promise of future earnings as the reason to create. World resources support material decisions; money supports voluntary transfer; authored recipes support culture and expression. They are different objects. A local finite NPC shop does not establish a human marketplace, creator demand, income, or a sustainable token economy.

Production trading contracts should distinguish recipe license, instance title, service agreement and creator royalty. A transfer of one does not automatically transfer the others. Rights should be inspectable before acquiring a creation. Crypto becomes useful only for specific persistence, settlement or ownership requirements that are actually implemented, measured and enforceable.

## 10. Humans and agents share commands, not imaginary equality

The right interface for both humans and software participants is a finite, typed command surface. The same compiler and validation path should accept a human-created draft and an agent-proposed draft. Do not let the agent write internal state directly while the human must gather resources and traverse distance.

Suggested command contract:

```text
observe(scope, sinceRevision)
draft(kind, fields)
compile(draft, rulesVersion)
trial(recipe, scenarioSeed)
proposeInstantiate(recipeId, position, costCeiling, expectedRevision)
acceptProposal(proposalId, grantEpoch)
stop(controllerEpoch)
reclaim(instanceId, expectedRevision)
```

These are proposed interfaces, not existing network APIs. Observations name their scope and freshness; trials state their assumptions; all mutations name current authority and exact expected state. Permissions need maximum spending, instance count, space, duration and allowed operations. Revocation prevents future commands and invalidates pending proposals. It does not retroactively erase valid ownership or consume another principal's property.

Preserve a chosen human contribution without forcing everyone to work manually. A player can reserve the last placement, ask for alternatives, accept full assistance, or work alone. The helper should offer mechanically different solutions when requested. Three palette changes of the same optimum should not count as three distinct solutions.

A browser script can provide useful constrained design proposals without becoming a live model participant. Any later model adapter needs real credentials, model runtime, latency/error behavior, public observations, expense budget and durable controller identity. Label the current controller truthfully.

## 11. Whole-game integration: a causal journey worth testing

A coherent first journey could be:

1. Arrive with Lumenling and notice a crossing, a working settlement and an unresolved need.
2. Draft a small Listener creature; see its silhouette and selected response in the trial room.
3. Instantiate it with materials, then ask it to guide you to a real accessible resource.
4. Shape a short or long weapon, practice its timing, then use it against a world threat.
5. Gather enough inputs for a shelter or resonator; place it without blocking the bridge route.
6. Compose a short score, enact one paid ward/charge effect and inspect why it succeeded or failed.
7. Author a target course around the same movement and note-shot rules; enter, complete or fail it, then return to the unchanged world inventory.
8. Revise one thing in response to experience. Reclaim another. Export recipes and save the inhabited world.

This is a proposed journey, not an observed thirty-minute playtest. Its lesson is ownership of a causal chain, not a compulsory tutorial march. Each step should be optional, and the Atlas/Atelier should make returning to an earlier creation easy.

The Warden can become a test of creations rather than a disconnected prize machine. A shelter can offer a positional respite; a Listener can announce a witnessed warning; a weapon exposes a timing tradeoff; a resonator accepts a finite score. Each should help in a limited way without reducing the fight to one mandatory build. The existing 12.33-second melee rush and failed ranged policy argue for fixing encounter pacing before advertising a balanced boss.

## 12. Adversarial scenarios that could overturn the design

These tests concern complete causal journeys or cross-system risks rather than merely repeating a helper's arithmetic.

| Scenario | Required invariant / decision |
|---|---|
| Edit a weapon between startup and contact | The existing action keeps its original move snapshot and single-hit set |
| Equip a long weapon just as a projectile hits | The emitted projectile retains its original recipe/damage; no retroactive advantage |
| Create, export, import and reclaim the same instance repeatedly | World import replaces a whole compatible state; recipe import creates no matter; reclaim consumes one instance once |
| Reclaim a carrier while it holds three ore | Cargo returns legally or reclamation waits; neither loss nor duplication occurs |
| Build at the actor's feet, on a resource, or around every gate | Placement rejects unsafe/critical obstruction; the player retains a recoverable exit |
| Close the water bridge while a creature/worker carries goods | Entry-bank rescue or waiting preserves actual cargo ownership and progress |
| Delete a resonator during the third note of its score | Committed effects retain provenance; unpaid future effects cannot execute; charged resources have declared disposition |
| Mute audio and use reduced motion | Identical gameplay rules remain available through captions/quiet cues |
| Create two wards and alternate them forever | Shared stacking rule and finite paid charge prevent an unintended invulnerable loop |
| Author a target behind a sealed wall | Validation rejects it or clearly requires a feasible route/shot; no false “solvable” badge |
| Set a game timer below its travel-time minimum | Warn or reject under the declared validation strength; leave artistic impossible challenges explicitly labeled if supported |
| End a match on the same tick as the last hit | A pinned precedence rule resolves once; no double result or payout |
| Enter an authored game with a wounded body and rare equipped item | Exactly one checkpoint exists; normalization and restoration are explicit; game rewards cannot duplicate inventory |
| Two tabs instantiate the last available crystal | Actual browser lock/authority serializes them; source inspection alone does not establish this |
| The agent proposal is approved after a blueprint edit or grant revocation | Reject the stale exact proposal without partially consuming resources |
| A recipe imports enormous geometry counts, unknown operations or numeric NaN | Reject before allocation; retain the existing world intact |
| Exhaust the finite economy before making any useful item | Free drafting/trial and a safe return still work; evaluate whether reclamation creates a satisfying recovery path |
| Maximize every allowed weapon and creature attribute | The compiler enforces bounds; empirical policies then test domination rather than declaring point-budget balance |
| A helper supplies a visually novel but behaviorally identical recipe | Describe it as an aesthetic variant; do not count it as a new causal solution |
| Reload a world containing five different creation families | Every supported instance restores its recipe/version, invested inputs, activity boundary and usable behavior |

For deterministic scenario comparison, drive both old and revised recipes with the same public input script and scene seed. Preserve failure outcomes. A headless perfect-information policy is not a human or a fair agent observation study.

## 13. The strongest additional inventions

These are valuable because they deepen existing systems, not because the names are novel.

### The Second Life Bench

A failed invention can be disassembled or revised into something useful elsewhere. A long slow weapon becomes a receptive resonator mast; a carrier's frame becomes a game obstacle; an unused score becomes a village motif. This requires real compatible transformation recipes and retained matter/lineage. It should never merely rename an item while pretending its old physics transferred.

Why it matters: experimenting becomes less punitive, and the world records discovery through changed use rather than only improved numerical power. Acceptance: one supported transformation visibly and mechanically works, with no net matter gain and a traceable parent instance.

### The Counterfactual Window

At the Atelier, split the same small seeded scenario into two trials: the current creation and a proposed revision. Let the player compare actual trajectories, damage windows, deliveries or charge use. Every predicted outcome is labeled a trial under stated assumptions, never a prophecy about other people.

Why it matters: it makes experimentation intelligible and gives imagination feedback. Acceptance: the world remains byte-for-byte unchanged; identical recipes give identical results under identical inputs; changed inputs can disprove the designer's preferred recipe.

### A Song With an Address

An instrument's phrase can name a placed receptive structure through an explicit connection. Performing the phrase sends a finite charge packet to that structure, whose world effect occurs at the right note. Distance, obstruction or a missing receiver gives a legible failure rather than an invented success.

Why it matters: music, architecture and magic become one authorable relation. Acceptance: one real effect uses the same event as the heard note; disabling audio changes no mechanical authority; a charge loop cannot amplify itself.

### The Museum of Useful Mistakes

Collect retired recipes with their player's note and an actual trial/result snapshot. An awkward creature or inefficient bridge can be kept for affection or a different challenge. Search/group mechanically similar designs separately from subjective aesthetic collections.

Why it matters: creativity is broader than optimization, and personal history can have cultural value without token speculation. Acceptance: a player can retrieve the earlier recipe and replay its bounded trial; the system does not fabricate the reason its maker loved it.

Do not ship all four as prose-only “features.” The root should implement at least the concrete foundation it chooses and mark the rest as proposals. The first two provide the strongest immediate practical value if time permits.

## 14. Review of the review: how this plan can still fail

**Failure: a form-filling menu masquerades as unlimited creation.** Remedy: visibly expose the vocabulary and unsupported ideas; prove mechanical differences; retain a path to richer geometry/behavior editors. Do not call a fifty-preset library “anything you can imagine.”

**Failure: five categories create five shallow demos.** Remedy: one shared entity contract and at least one cross-category interaction, with a complete save/reclaim journey. Depth requires connections, not just five tabs.

**Failure: safeguards erase expression.** Remedy: permit broad free drafting and trial while making world placement consequences explicit. Competitive constraints belong to accepted activity rules, not every private artwork.

**Failure: every creation is economically optimal in the same way.** Remedy: roles with different contexts, shared resource costs, personal artistic value and counterexample scenes. Do not force all value into damage-per-second or coins.

**Failure: the same creator dominates through automation and capital.** Remedy: scoped permissions, private creative spaces, public-work agreements and accessible solo paths. None of these proves production fairness; population experiments are required.

**Failure: the game is technically coherent but unpleasant.** Remedy: actual browser interaction, visual inspection, multiple device/input modes and observed first-time play. Automated invariants are necessary evidence for correctness, insufficient evidence for delight.

**Failure: the upgrade again claims a complete MMO.** Remedy: an implementation matrix with four statuses—running and tested, running but unobserved, designed, absent—and exact evidence. The current release remains local until real online services and humans/agents participate.

## 15. What merits enthusiasm, and what would make me revise that judgment

These are design judgments, not claims of personal human emotion or public acclaim.

| Promising element | Why it deserves enthusiasm | Evidence that would weaken the judgment |
|---|---|---|
| Form and behavior authored together | A player's idea becomes recognizably theirs and changes what can happen | Players cannot perceive a mechanical difference between their designs |
| One blueprint from preview through world use | Trust grows when the thing tested is the thing placed | Trial and world silently use different rules |
| Instruments with real timed effects | Art becomes a working interaction without requiring speculative physics | Music is a cosmetic track beside unrelated cooldown buttons |
| Reclamation and second uses | Failure can lead to a better idea instead of a world reset | Recycling becomes a tedious tax or a duplication exploit |
| Games made from the world's own verbs | A familiar action can acquire a new social purpose | Authored modes are unplayable, indistinct or fragment all participation |
| Companion policies with remembered evidence | Relationship can develop through witnessed activity and chosen roles | The pet blocks movement, automates every decision or invents sentimental events |
| Counterfactual trials | Curiosity has a concrete experimental instrument | The tool conceals assumptions or rewards only one optimizer |
| Honest remaining scope | Future work can accumulate on reliable contracts | New names and test counts again stand in for unbuilt behavior |

The quality threshold is not endless declarations of wonder. It is a working creative loop that invites a real person to make a second thing because the first one surprised them in an understandable way. That claim needs people playing; it cannot be settled by the author congratulating the design.

## Sources inside the recovered project

- `docs/ACCOUNTABILITY-AUDIT.md`: direct omissions, current coverage matrix, 61-method evidence statement, failed boss policies and remaining recovery/economy limits.
- `docs/UPGRADE-v09.md`: one local state, actual combat/cargo/trading/pavilion and save contracts.
- `dist/realm.js`: current attack timing and per-hit sets, finite materials, quote binding, fixed plots, scripted workers and arena normalization.
- `dist/visual.js`: current procedural scene and state-driven presentation entry points.
- `dist/app.js`: current modal workflows, input, local persistence and separation of world/activity state.
- `dist/pavilions.js`: current deterministic bounded board/catching rules.
- Recovered `PROJECT/v07/documentation/report-source.md`, chapters 53–59: causal authorship, common-law boundaries, exact rain allocation, constrained agent proposals, public-slot capture, factual chronicle, sonification and production integration requirements.

No fresh exhaustive Blizzard/Nintendo/strategy/fighter/shooter/crypto study is implied by this design review.
