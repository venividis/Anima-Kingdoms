---

# Anima Kingdoms — The First Concord

12 September 2026 · connected-creation release, development build 0.11

The central promise is **imagination that has consequences**. A player can author a score, connect it to a structure, give a creature an actual delivery, and see that delivery change a place. The world already contained expressive parts and bounded behaviors. This release makes several of those creations cooperate through one inspectable, conserved system.

This is a playable local prototype and an engineering foundation. It is not a completed MMORPG, an autonomous language-model society, an exhaustive reconstruction of Blizzard/Nintendo/strategy/fighting/shooter games, or a functioning crypto economy. The historical dossier’s accountability audit and the existing game documentation are retained. No fresh exhaustive game research or empirical human-subject research is claimed for this implementation phase.

## Play the first connection

1. Enter the world, then select **Connect** (N).
2. Walk to Vey’s Exchange. The walk button navigates your real body through collision at ordinary walking speed. Reopen Connect after arrival and buy one crystal at the displayed stock-sensitive price. Its seller, stock and money already exist.
3. Walk to the bridgehead. Reopen Connect and build the connected kit. The guide creates three ordinary, immutable instances: The First Concord instrument, The Listening Span, and Pip, a Lanternwing courier. Their recipes use the same compiler and creation budget as the editor. Kit cost: 10 wood, 3 stone and 1 herb. Nothing is given free by this button.
4. Load one crystal into the instrument. Feed Pip one food. Assign the two-stone hearth request while your body remains at the pickup.
5. Play the score. Close panels to let simulation advance. Notes travel along the wire and charge the walking surface. Pip takes one actual stone from your pack, traverses the crossing, and transfers it to the hearth. The courier returns physically for the next stone.
6. Play again if the return crossing needs power. Two delivered stones become the visible hearth; four previously reserved Marks transfer from the keeper exactly once. There is one finite request, with no repeatable reward faucet.
7. Inspect the event trail. Try a different pitch filter, a permanent deck, or a different authored creature. Editing a recipe does not rewrite an already placed instance. Disconnect before reclaiming connected creations.

The live witness panel tells you what is happening while the world runs. The Connections panel pauses simulation and shows more detailed state. A stalled courier shows its exact pickup address and offers an ordinary walk back to it. It explains its actual blocker: no passable route, missing stone, insufficient energy, or an absent owner at the pickup. The latter prevents a distant creature from silently reaching into your inventory.

## What is especially promising, and why

**Creation can become cooperation.** A useful invention may be a relationship between simple creations: a melody and a span can do something neither does alone. This creates room for engineering, composition, architecture and care to be valuable ways of playing.

**The story has a physical receipt.** “Pip kept a promise” means stone left a pack, occupied its cargo slot, crossed legal ground, arrived, was consumed, and triggered a funded payment. The trace explains a real sequence. It does not manufacture a narrative first and pretend the simulation followed it.

**A failed invention is understandable.** Filter rejection, empty fuel, travel, reception and route transitions have factual events. A player can revise the part that caused a failure. Trace entries carry causal parent IDs; they are not a replacement for inventories or financial custody.

**Human and agent participation can share a contract.** Invited agent commands use the same dispatcher, body, materials, proximity, cooldowns and route solver as the corresponding controls. Revocation invalidates an agent’s old epoch immediately. The distinction is how an intention enters the system, not a free resource or teleport privilege.

**An alternative solution remains valid.** The hearth courier can use a permanent creation deck or a rain-supported route. Musical engineering is an expressive option. An existing permanent bridge does not become power-dependent simply because this new feature ships.

**A small repair in the world can feel like authorship.** The hearth is deliberately modest: its visible change is tied to delivered materials. It establishes a pattern for future community projects without falsely presenting a two-stone object as a civilization simulation.

## The second iteration: reject the easy claims

“Connected” does not mean arbitrary programmable software. The connection vocabulary currently contains instrument sources, pitch-filtered wires, bridge/gate receivers and one courier request. It has no receiver-to-source relays, condition editor, logic loops or arbitrary script execution. Limits are 16 authored instances, 24 wires and 64 mechanical packets.

“Powered” does not mean perfectly realistic energy. A crystal is a discrete game resource with an explicit conversion rate. One loaded crystal creates 24 charge units. Each accepted linked note spends one unit at its source; each receiver charge buys 180 world ticks of an open state. These are tunable design parameters. No experiment here establishes that they are the most fun or economically optimal values.

“Safe closure” currently uses a **safety hold**. On expiry, a structure containing a body or placed creation stays open until its footprint clears. New entrants can still use it during this hold. This prevents ordinary closure from dropping a courier or trapping a player. It can be deliberately held open, so it is unsuitable as a competitive access control or scarce-energy toll mechanism. Actor-specific admission leases remain a future rule change.

“Inspectable causality” means bounded event provenance. Links pin source and receiver blueprint revisions; note events identify source, pitch and note index. Mechanical packet identities persist through saves, while decorative waves may be cleared. The trace retains 120 entries and can refer to older events that are no longer displayed. Courier crossing entries record an actually entered supporting surface over water and its most recent received-note reference. They do not prove that this was the only possible route or that the newest note alone was necessary. There is no persistent performance identity spanning every note in a whole score; receivers filter individual pitches rather than authenticate an ordered melody. Do not market this as melody recognition.

“Same rules” is local gameplay parity, not production security. Browser state and imported saves are controlled by the person running the browser. Local grants and validators are useful product boundaries but cannot secure a hostile multiplayer client. Agent observation exposes the local world state. There is no hidden-information competitive ladder, principal authentication, server authority or proof of agent fairness.

“Durable” means valid local checkpoints and explicit export. On browsers supporting Web Locks, one active game tab owns automatic local saving. If that capability is absent, the UI explicitly disables automatic saving and allows play/export. A rejected old save is preserved and available for recovery export; a new world does not silently overwrite it. Browser/device failure, deleted local storage and remote backup recovery remain outside this guarantee.

“Games inside the game” remains an existing but bounded vocabulary: authored sigil trials, a shooting range, Raincatch, Loom Table, bot capture-the-flag, local two-player duels and PvE encounters. This release connects creation systems; it does not add online tournaments or an unrestricted game editor.

## Whole-game plan: each ambition has an acceptance gate

| Family | Working foundation | Next concrete build gate |
|---|---|---|
| Fantasy, character and combat | Original procedural valley; three disciplines; timed startup/active/recovery; authored relics; PvE boss | Make one ten-minute adventure legible and compelling in observed human sessions; verify animation/contact timing and camera on supported devices |
| Creation | Five blueprint kinds; parts, rules, scores, trials; immutable placement; costs/reclaim; living rehearsals | A person with no instructions can create, test, revise and share a useful design without corrupting a save |
| Connected inventions | Charged sources, filtered wires, bridge/gate collision, factual trace | At least three independently designed useful inventions complete counterfactual tests without resource amplification |
| Creatures and AI | Authored finite rules and cargo; typed invited agent interface | One externally connected agent can propose a bounded creation, obtain review, act, recover from interruption and honor immediate revocation |
| Strategy and civilization | Settlement plots, workers, water, finite supplies and a civic need | Add households consuming real goods and renewing production with measured carrying capacity; close one full production–delivery–consumption cycle |
| Economy and ownership | Stock-sensitive finite NPC trades, conserved Marks, reserved civic payment | Two authenticated principals exchange uniquely held goods atomically under server authority, including concurrent offers and crash recovery |
| PvP and games within games | Bot CTF, local duel, range, pavilions, authored sigil course | Two remote human clients finish a normalized match through reconnect, with one flag custodian and one result |
| Social systems and network effects | Exported recipes, local history, bounded invitation | A small human group maintains one shared invention under explicit edit, repair, ownership and exit rules; measure voluntary return and contribution |
| Crypto | Documentary architecture and local export only | Demonstrate one optional ownership/settlement use that improves player agency relative to an ordinary database; publish costs and failure recovery before issuing assets |
| Art, sound and accessibility | 3D procedural parts and world; same-simulation canvas fallback; timed score audio; HTML controls | Observe keyboard, touch and non-audio completion, then supported-GPU visual QA. Give equivalent functional information in both views |
| Infrastructure and operations | Local deterministic-ish stepping, bounded data, validated checkpoints, source history | Authoritative service, authenticated clients, backups, compatibility tests, crash recovery, telemetry and measured load/cost envelope |
| Deep research | Retained dossier and honest audit; targeted executable experiments | A declared title/version corpus with claim–source mapping and independently reproduced mechanics. “All games, every detail” remains unfulfilled |

The next expansion should earn its complexity by proving a better player experience. A creature society, an economy or a cryptographic protocol is not validated by the volume of its design document. Use measured voluntary engagement, understandable decisions, social reciprocity and recovery from failure as hypotheses to test with people. This release’s automated agents are engineering testers, not substitutes for human research.

## Technical source map

- `public/kingdoms.js`: command envelopes, grants, idempotency receipts, typed wires, packets, finite charge, receiver states, physical civic jobs, import validation.
- `public/creation.js`: blueprint compiler, parts, cost, immutable instances, ordinary creature behavior, score emission, surface/obstacle integration.
- `public/realm.js`: shared world, material ledger, market custody, bounded movement, snapshot migration, command bridge.
- `public/navigation.js`: bounded grid routes with exact segment checks and topology invalidation.
- `public/app.js`, `kingdoms.css`: real buttons, guide, wire controls, witness, agent bench and optional WebMCP tools.
- `public/creation-view.js`, `visual.js`: 3D scene rendering, packets, receiver state and delivered hearth.
- `public/canvas-view.js`: canvas renderer and blueprint preview on devices without WebGL2. It draws live simulation data and has the same commands; it is not a decorative screenshot.
- `app/page.tsx`: supported framework shell containing the playable game at `/play.html`.
- `docs/CREATION-CONTRACT.md`, `WHOLE-GAME-PLAN.md`: retained v0.10 contracts and review, explicitly historical where the new release supersedes them.
- `docs/VERIFICATION-v11.md`: actual automated and browser evidence, failures, repairs and remaining coverage limitations.

## Runtime and custody contracts

The state keeps the v0.10 world profile for migration and adds the versioned `anima-concord-1` connection state. A v0.9 save first receives the established creation migration; an older compatible world then receives a connection state funded only when its keeper has at least four existing Marks. Insufficient legacy keeper funds leave the single request unfunded; no currency is invented.

The six-material ledger still requires zero residual. A crystal moves from pack to spent when converted. A picked-up stone moves from pack to the courier’s single-unit cargo. Delivery moves that stone from cargo to spent. Fulfillment history describes those consumed materials and does not double-count them as separate inventory. Courier feeding consumes food using the established energy system.

Mechanical charge obeys:

`24 × crystals loaded = source charge + in-flight packets + receiver charge + spent charge + dissipated charge`

Every packet carries one unit. Fan-out debits one unit for each accepted wire in stable wire-ID order. Receiver storage is capped at 16; overflow dissipates. Source refueling is capped. Disconnecting destroys only that wire’s in-flight units and records dissipation; reclaiming a disconnected source returns construction investment but not consumed crystal fuel. No feedback relay is implemented.

A command carries world ID, rules version, controller, grant epoch, expected connection revision, unique key, operation and exact payload. It validates before committing a cloned candidate world. Failed commands leave the source world untouched. Repeating an identical retained receipt returns that receipt; reusing its key with different bytes fails. Receipts retain only the last 64 commands, so this is bounded replay protection, not network-wide exactly-once delivery. Imported receipts are internally validated local history, not authenticated evidence that a historical event happened.

The connection clock advances only in the world. Arena time cannot expire a paused powered route. Packets and courier cargo persist in snapshots, unlike decorative effects. Topology changes invalidate navigation caches. Physical movement is bounded even for old saves containing an oversized deck; new placements also validate every rotated physical corner.

## Research and release discipline

Keep the earlier failures. The baseline’s 91 green tests did not catch a legal deck extending beyond the save envelope, a browser without GPU support, or an insecure-context UUID failure. New tests and real clicks found those gaps. A successful build is evidence of a successful build, not a successful game. This release reports each type of evidence separately, including unavailable tests.

The GitHub connector in this session can read and edit accessible repositories but exposes no repository-creation operation. The requested new GitHub repository cannot be honestly reported as created through that interface. The complete named source package and existing Site source history are prepared for an empty `Anima-Kingdoms` repository; publication there requires a repository URL accessible to the connector.


---

# Anima Kingdoms verification — 12 September 2026

This record separates executable simulation scenarios, actual browser interactions, and unverified product claims. An automated browser agent is an agent operating human controls, not an independent human participant.

## Automated evidence

The final retained test run contains **119 tests: 119 passed, zero failed**. These comprise 91 retained world/creation tests, 25 independently authored connected-core scenarios, and three actual-autosave-function regressions. One retained test also evaluates 252 inherited water-allocation fixtures; these are not 252 additional end-to-end games.

Run `node --test tests/*.test.mjs`. The full output is `docs/verification-v11.txt`. Set `KINGDOMS_TEST_EVIDENCE=docs/connection-evidence-v11.json` to collect the connected test evidence. The tests import production simulation modules, advance real simulation ticks and inspect resulting state. Selected UI persistence tests execute the actual extracted save function with a controlled storage harness.

The invited-agent policy starts from a disclosed merchant fixture: the body is placed at the merchant, one existing crystal is purchased through the real quote/trade functions, and the human grants 24 commands. The agent then uses seven typed commands: walk, guide, fuel, feed, perform, assign, and perform again. The courier delivers two physical stones, transfers four reserved Marks once, and returns home. This is real command execution, not browser clicking; the merchant position is explicit test setup.

Other fixtures sometimes move bodies or transfer existing reserves into a test pack to isolate gate, arena or import behavior. They are labeled fixtures, do not create production-game privileges, and are not represented as ordinary player accomplishments.

Coverage includes exact material/charge/Marks conservation; wrong pitch filters; finite fan-out; gate collision/open/safety hold/closure; source and receiver references; duplicate command identity; stale revision; invitation revocation; cancellation before pickup, during cargo and after partial delivery; absent-owner recovery; packet/cargo checkpoints; all four arena checkpoint modes; current and legacy world migration; imported deadline/receipt corruption; bounds; and autosave preservation.

## Defects found and repaired

| Finding | Evidence | Repair |
|---|---|---|
| Accepted extended decks let creatures leave the save envelope | Independent legal-world movement reproduction; old tests had passed | New placement checks every rotated physical corner; runtime ground bounds also constrain legacy decks |
| Failed save could be overwritten by a fresh realm | Actual save/startup source audit | Validate before writing; retain rejected raw bytes; recovery export and explicit replacement |
| A forged receiver deadline could sustain effectively free power | Independent malformed-import scenario | Deadline is bounded to the current connection clock plus one charge period; status/timer consistency validated |
| Saved receipt operation could disagree with its request | Independent malformed-import scenario | Parse and validate exact envelope, operation, result shape, revision order and unique keys; local history remains unauthenticated |
| WebGL2 absence prevented entry | Actual cloud-browser alert | Live canvas world and blueprint fallback using the same simulation |
| Secure-context-only randomUUID prevented Connections opening | Actual clicking-agent console error | Shared bounded ID helper using available random bytes; no secure-context assumption |
| Second instrument could be wired but not fueled by human controls | Independent second design pass | Per-source load/play controls and per-creature feed/assignment controls |
| Canvas gate appearance contradicted collision | Independent second design pass | Fade dormant decks and open gates consistently with the 3D state |
| Canvas camera drag could rotate controls under a fixed map | Independent source inspection | Keep canvas movement aligned to its map; click aim uses the actual pointed ground direction |
| Rejected toast could outlive a later successful action | Actual browser play | Successful changes clear stale error notices; final root clicks verified the error appears on rejection and disappears after a successful walk |
| Courier recovery lacked an address | Independent second design pass | Exact pickup coordinates and real walk-to-pickup action |

The failed initial probes remain in `docs/audit/v11/initial-failures.json`; the reviews and repaired independent run are retained beside them. Repeating a run does not increase the number of distinct tested scenarios.

## Browser evidence

The assigned clicking agent used the supervised browser at `terminal.local:4173/play.html`, clicked the entry screen, authored and saved named creature/instrument recipes, edited score notes, and operated the connection controls. It deliberately attempted a distant purchase, observed rejection and unchanged20 Marks/zero crystal, walked to the exchange, and purchased one crystal:20→12 Marks and0→1 crystal. It then walked to the bridgehead, created the exact kit, loaded one crystal, fed the courier, assigned the request and played scores. A second fuel load without crystal rejected. The courier physically picked up and delivered stone; the journal showed50 total Marks and a balanced material ledger.

The human-style browser journey finished **2/2 deliveries** with the player balance **12→16 Marks**, one four-Mark payment event, and an empty courier cargo slot. The visible typed agent console also passed: invitation24 commands, accepted walk23 remaining, identical replay still 23, revocation epoch2/budget0, and denial of the old request. Full actions and limitations are in `docs/audit/v11/human-click-playtest.md`. Screenshots are observations of the live canvas simulation. They are not generated concept art or evidence of the 3D renderer running.

## Limits that remain

- WebGL2 was unavailable in the cloud browser. The new fallback was exercised; the retained 3D scene, its new connection visuals and GPU-specific behavior were not browser-validated.
- The HTTP preview lacked Web Locks, so it explicitly disabled automatic saving. Browser autosave/reload was not verified there. Snapshot equivalence and actual save-function preservation were tested separately.
- Browser download observation timed out for an attempted JSON export. The final root click review opened the copyable full-world JSON view and parsed its visible textarea successfully; it contained the correct world and connection schemas. This timeout is not reported as a successful download/import test.
- WebMCP tool discovery reported that document modelContext was unavailable. Tools are feature-detected in code, but browser WebMCP registration/execution could not be validated. The typed agent console and pure simulation dispatcher are separate available interfaces.
- Crowded world labels and the live panel overlapped some inventory text in the first playtest. Label separation and inventory placement were adjusted after that observation.
- Cloud gameplay progressed more slowly than wall time. This build caps per-frame catch-up and does not simulate offline time. Canvas resizing was reduced; real-device frame-time and memory profiling remain necessary.
- No remote human multiplayer, production-scale load, real language model, wallet, smart contract, player auction house, renewed ecology or long-lived civilization was run.
- No blind human usability study, objective “best game” measurement, comprehensive device matrix or exhaustive commercial-game mechanics research was performed.

The release provides testable working pieces and preserves their boundaries. These results do not certify that every accepted design or future combination is safe or enjoyable.


---

# AWE — the Dream Foundry

11 September 2026 · release profile `awe-dream-foundry-0.10.0`

The central upgrade is a complete bounded creative loop: **shape → specify behavior → rehearse → place → use → revise or reclaim**. This release adds working creations to the existing First Orchard and repairs failures in its older interactions, recovery, combat boundaries and persistence. It does not complete the original massively multiplayer vision.

## Make your first thing

1. Enter or continue your world. Choose **Create** or press **V**. A fresh world now starts with enough supplies for any one of the five starter designs. Three ore and two herb were moved from the existing world reserve to the starter pack; total supply did not increase. Existing saves keep their inventory.
2. In **Shape**, change the parts, add or duplicate them, or choose **Start with one part** and draw a silhouette. Mirroring is optional. Each drawing sample adds actual orb geometry; it is not an image or a text-to-object model. Adjust depth, dimensions, material roles and rotation with the fields. Undo and redo retain up to 40 editing states.
3. In **Behavior**, author the relevant rules, move, score or course. The right panel shows the compiled limits and the exact construction bill. A shape can be expressive without changing its behavior; change both when you want a mechanically different creation.
4. Choose **Enter a living rehearsal** to use the creation in a disposable practice world. A creature starts fed, a relic starts attuned, an instrument begins its score, and a trial opens its course. Use normal movement; press **T** for an attuned relic, and **E** beside a creation to inspect it. **Return with what you learned** restores your original world and retains a factual experiment summary.
5. **Run a controlled experiment** uses a fixed, stated input policy. Change one quality and run it again; **Experiments** compares the last two outcomes, including timing, and can export their exact recipes and evidence. Interactive trials and automatic policies are labeled separately.
6. **Save this blueprint** preserves the recipe. **Bring it into the world** opens placement. Point at the ground and click, or press **E** at the current ghost; **R** rotates, Escape cancels. The placement spends materials only after all checks pass. For a dry crossing, place Rainstep Span centered in the gap near `(0, -13)`, from the near landing. The Atlas helps orient the world.
7. Approach the instance and press **E**, or inspect it from **Blueprints → Present in your world**. Feed, attune, perform or enter the course as appropriate. Make a variation to keep its ancestry. Reclaim an idle, safely removable instance to recover its invested materials exactly once.

The original game remains available: Q opens the water loom, F releases rain, B opens settlement building, I opens Character, and Settings leads to the Exchange, Journal and activities. The original hydraulic wagon contract still needs the original water-supported crossing. An authored span changes player and worker routes; it does not substitute for that commission's water condition.

## The five creative families

| Family | Choices you author | Executed consequence | Expressive boundary |
|---|---|---|---|
| Creature | Up to 32 geometric parts; up to four ordered condition/action rules; resource; power/reach/tempo | Walks with shared navigation, follows/orbits, guards or gathers, spends food energy and carries actual cargo | All use the same horizontal locomotion. Anatomy is not automatically rigged or turned into biomechanics. Rules are deterministic, not a connected model |
| Relic | Form, bolt/wave/mend/ward, power/reach/tempo | Attuned **T** action with compiled startup, recovery, reach, impact and Breath cost | Visible form does not define exact contact volume. Uses range/arc or projectile rules; visuals are scaled in the hand. Allowed in world/PvE, excluded from normalized exhibitions |
| Structure | Form and placement; rotated solid boxes; ground-level walking decks; lights/ornament | Changes supported ground and collision for bodies, shots and camera | A horizontal collision model with a shared deck height. No arbitrary terrain, stacked floors, structural collapse, universal route-solvability guarantee or generalized wagon pathfinding |
| Instrument | Eight pitches, beat interval, voice, form and placement | One paid score emits timed notes and spatial mend/ward/force waves | Pitch changes sound; voice determines the operation. No rests, note-by-note operations, connected receivers or real acoustic healing physics |
| Trial gate | Form, 3–12 sigil positions, sequence/any-order collection, 15–180 second clock | Opens a playable personal course with actual completion/timeout and one result | A sigil-course maker. It is not an arbitrary fighter, shooter or raid scripting engine |

Drafting and practice are free. Blueprints carry recipes; world instances carry invested matter. Imported recipes cannot bring money, equipment, experience or material stock into a world.

## Repairs made while challenging the upgrade

The first pass found that a non-resource interaction could throw because its dispatch map referenced an undefined `agent`. This prevented real landmarks from opening despite the earlier suite passing. The corrected dispatch is now exercised through the actual application function in a Node unit test. The new Create button had a different event-wiring error: a click event could be mistaken for blueprint data. The callback now explicitly discards the event, and the actual binding is tested.

Crafting and world chords are now rejected in normalized exhibitions. Activity entry rejects a dead body, clears range state and temporary world protection, and return discards respawn invulnerability and airborne state. Local player two now has Gale Break on **U** and running on **Right Shift**. Player one uses **Left Shift**. Touch users have a Run button.

Construction rejects occupied preset plots. Original buildings track their material investment and can be dismantled for 75%, rounded down per material. Removing the last workplace requires resting its workers. A finite emergency exchange transfers six of the keeper's existing fiber for two wood; the keeper can fund two such exchanges. Neither recovery route creates goods. Vey's Exchange now has a stationary visible stall even while Vey travels with the wagon.

New solid parts must leave space around resources, landmarks and safety landings. Authored carriers displaced by a lost crossing return to their entry bank with cargo intact. A* navigation caches failed searches as well as successful paths, and invalidates them when the relevant topology changes. This avoids repeating thousands of failed grid checks every tick. It is bounded navigation, not complete pathfinding or performance proof.

A second adversarial pass caught array-valued colors entering numeric rendering, malformed instance angles, unreachable reclamation at the center of a large wall, irrelevant support dependencies blocking removal, scores catching up too quickly after an arena pause, and misleading far-bank results for a separate trial arena. These were repaired. A subsequent integrated test found a one-tick first-note cadence error and a possible stale-note replay across activities; note schedules and event clearing now have explicit tests.

The editor now provides keyboard X/Z controls for sigils, preserves the selected sigil after changes, restores focus after inspector reconstruction, and catches full-part-budget errors. Modal Tab handling recovers focus when a replaced element no longer exists. Pavilion dialogs have a focus trap and intentional result focus. These are source-level accessibility repairs; they are not a completed assistive-technology or device audit.

## What the experiments actually established

The recorded release suite contains **91 automated test methods**: 61 retained methods and 30 new methods. One retained method compares 252 historical exact-water fixtures; these are not 252 extra gameplay tests. The new tests cover valid creation lifecycles, invalid imports, actual movement/cargo, supported-ground removal, rotated collision, timing, normalized activities, save migration, recovery and selected real application functions.

Six reproducible controlled examples yielded:

| Recipe / policy | Observed result |
|---|---|
| Lanternwing / normal guard rules | Defeated the 34-health nearby target; first impact at tick 32, defeat at 267; spent energy |
| The Far Note / repeated aimed attacks | Defeated that target; first impact at tick 47, defeat at 128 |
| Rainstep Span / walk north | Reached actual far-bank land with the original water bridge closed |
| An Orchard Remembered / perform | Eight timed notes and 24 net healing from a starting 55 health |
| A Letter Written in Footsteps / run to next sigil | Completed all five sigils and ended the activity; no asset reward |
| A patient gatherer / harvest rule | Delivered four existing wood bundles during the 60-second run |

Every example kept zero material-ledger change relative to its lab baseline. The lab itself receives explicitly disposable construction supplies; its snapshot fails the real-world conservation check and cannot be imported as a normal save.

A further **46-scenario sweep** exercised every allowed integer allocation with power + reach + tempo = 12, for the bolt verb, against the same nearby target. All defeated it within the 20-second window, with no material residuals. The fastest in this narrow scene was **5 power / 3 reach / 4 tempo**, defeating it at tick 89, about 1.48 seconds. More power can fail to help when two different damage values still require the same number of hits; delay then matters more. This does not establish a best weapon. The target's attack decisions are delayed, the policy sees state directly, and other encounters, defenses, costs and players change the question.

The exact recipes, method assumptions and rows are available in the downloadable experiment evidence. No browser visual inspection, real audio-device check, human playtest, FPS/load measurement, online test, competitive-balance proof or empirical economy/retention study is claimed. Sites' current workflow reserves browser/visual/E2E QA for an explicit user request; this release did not run that separate workflow. Its absence remains an acceptance gate, not a passed test.

## The strongest design value, and the next iteration

What merits the most enthusiasm is **causal authorship**: the player can make a thing, observe what it does, and change an idea in response. A bridge opens a path. A creature delivers something it actually carried. A melody's waves have a place and arrival time. A course turns movement into a challenge authored by its player. Reclaiming materials makes a failed design an opportunity to try again.

The experiment comparison is the additional gift in this release. It gives curiosity a working instrument. It retains the exact recipe with the result so that a surprising outcome can be inspected, shared or contradicted. It does not predict human behavior or certify novelty. Full experiment reports currently live in the session or an exported evidence file; a short factual memory persists in the world. A searchable permanent museum and creator-written annotations remain proposed.

The next design iteration should connect one authored route to a generalized civic delivery contract; one score to one receptive structure through a conserved charge; and one renewable resource cycle to actual consumption. Each must execute all the way through failure and recovery. The shared MMO, real agent services and optional external settlement follow only when their independent authority, persistence and fairness tests pass. The full coverage matrix and both devil's-advocate passes below keep those obligations visible.


---

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


---

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
