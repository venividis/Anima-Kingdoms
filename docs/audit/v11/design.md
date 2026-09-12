# Anima Kingdoms — connecting creations without inventing their consequences

Independent read-only design review, 12 September 2026. Reviewed `docs/WHOLE-GAME-PLAN.md`, `docs/CREATION-CONTRACT.md`, and the current v0.10 `creation.js`, `realm.js`, `navigation.js`, `world.js`, `studio.js` and selected `app.js` integration paths. This is a concrete design proposal, not a claim that its features are already implemented. No browser observations or fresh external research were performed by this reviewer. Root owns implementation and release evidence.

## The release promise

The first connected invention should be an intelligible, playable chain:

1. The player authors an instrument's eight-note phrase.
2. The player connects a particular instrument to a particular receptive structure and chooses which pitches it listens for.
3. A funded note sends a visible packet along that connection; the receiver acquires exactly the paid charge that arrives.
4. The receiver uses that charge to activate an actual route. Bodies use the same collision and navigation system as ordinary movement.
5. A created creature carries an actual material lot through that route to a declared settlement destination.
6. The settlement receives the lot, closes a specific need and transfers its reserved payment once.
7. The player can inspect the whole causal chain, change one choice, safely recover from interruption and try again.

“Connected” means downstream mechanics consume upstream results. A line between decorative objects beside a separate delivery button would fail this promise. It is equally important not to force a convoluted chain for its own sake: a permanent bridge, an existing hydraulic crossing or a manually carried delivery may also solve the same actual need. The achievement is that the authored chain works, not that all other solutions were artificially prohibited.

Keep the name **Anima Kingdoms**. It states the user's scope clearly: authored life and inhabited societies. **The First Concord** is a useful chapter name for the first connected-creation journey; it is not a replacement project or a claim of online kingdoms.

## A minimal protocol with room to grow

Connections belong to world instances, not to blueprint identity. A recipe can describe that an instrument has a note output or a structure has a power input, but it cannot import live references to another world's inventory or entities. Existing instantiated blueprints remain immutable copies.

An example connection record:

```json
{
  "id": "link-17",
  "revision": 1,
  "from": {"instance": "instrument-3", "port": "score", "blueprintRevision": 2},
  "to": {"instance": "span-8", "port": "charge", "blueprintRevision": 1},
  "acceptPitches": [0, 7, 12],
  "maximumDistance": 12,
  "enabled": true,
  "createdAt": 900
}
```

Use exact schemas, finite integer fields, unique IDs and explicit bounds. A proposed initial cap of 32 links and 64 live charge packets is enough for the existing 16-instance world; reject or back-pressure the next command before spending. Reject duplicate pitch filters, unsupported ports, nonexistent endpoints and wrong family combinations. Do not silently turn an imported string into a number or supply guessed defaults to malformed saves.

The initial compatible type is `score.note(charge:integer,pitch:integer) -> structure.charge`. A later `structure.routeOpened -> creature.jobAvailable` event may notify a worker, but it cannot manufacture energy, cargo or command authority. Distinguish **signals**, **charge**, **materials** and **rights** even when their animations look related. A signal can be copied; a material or charge packet cannot be copied without subdividing its actual quantity.

Connection preparation reports the source and receiver names, exact pinned revisions, pitch filter, distance/range, receiver capacity and charge cost. The committed record does not retarget itself if the player edits a similarly named blueprint or creates a replacement instance. Replacing an endpoint requires an explicit new connection.

### Tick order and the same event

The present instrument calls `wave(...)` and pushes `creation.notes` on each score tick. Extend that one emission path with a stable performance ID and note index. Do not run a second approximate timer in the graph or UI.

Suggested event ordering in an active world tick:

1. Consume human/agent commands accepted for this tick.
2. Advance existing charge packets; settle arrivals once.
3. Advance receiver charge use and safe closing transitions; bump route topology when traversability changes.
4. Run instrument and creature behavior; emitted notes enqueue their charge packets for a future tick, never synchronously recurse.
5. Run actual body movement and material delivery settlement.
6. Record outcomes and project presentation/audio from the accepted events.

Another ordering is valid if fixed and documented. The essential properties are no recursion, no same-tick feedback amplification, stable arrival semantics, and an explicit rule for an arrival on the receiver's exact expiry tick. For player-friendly behavior, apply arrival before deciding whether a span closes on that tick.

Each packet pins its endpoints, link revision, source note identity, quantity, pitch, departure tick and arrival tick. It is a mechanical record, not the visual particle itself. Graphics frame loss or muting must not lose or duplicate delivery. The packet should travel on the rendered connection at the same progress ratio as the authoritative arrival timer.

## Charge must have a source, a destination and a fate

The current instrument's 40 Breath cost buys its healing/ward/force performance. Breath regenerates, so it is not a finite fuel account. Choose and disclose whether the new machine is intentionally renewable Breath-powered machinery or finite material-powered machinery. For this release, a separate material fuel account is easier to conserve and inspect.

Recommended initial conversion: **one actual crystal -> 24 integer charge units** in a source reservoir. This is a proposed game coefficient, not physical energy science. Tuning it later changes a pinned rules version, not historical packet contents. Loading fuel moves one crystal from `pack` to `spent.crystal`; reclaiming the instrument does not refund burned crystal. Nothing in a copied blueprint carries fuel.

Track charge accounting explicitly:

```text
24 × crystalsBurned
  = chargeInSources
  + chargeInFlight
  + chargeInReceivers
  + chargeSpentActivating
  + chargeDissipated
```

All terms are nonnegative integers. Receiver consumption decrements the receiver and increments spent; overflow increments dissipated; a disconnected packet settles according to one documented cancellation rule. Do not simply delete the packet. An empty source may still play its audible and existing gameplay score, but emits an explicit unfunded connection event instead of opening the route for free.

For understandable branching, each matching outgoing link requests one charge per note, processed in stable link-ID order. Source supply and packet capacity are checked before each individual transfer. Two receivers therefore use two charge units, not two copies of one charge. The UI must show “two receivers: up to 16 charge per eight-note score.” If partial fan-out is undesirable, atomically fund all matching recipients for a note or none; that is an alternative clear rule, but do not mix policies between UI and runtime.

A first implementation can use a 24-unit source capacity and a 12-unit receiver capacity. Each arriving charge supports 90 active simulation ticks, so an eight-note phrase supplies 12 active seconds before other constraints. A normal creature at 2.8 steps/second needs roughly 5.4 seconds to traverse the existing 15-step span, leaving some approach time. These are starting values requiring measured end-to-end traversal, not established balance.

Show charging, committed-in-flight charge, stored charge and dissipated charge separately. At reclamation, unused charge may be explicitly dissipated into the accounting ledger; do not reconvert it to a whole crystal by rounding up. If reclaiming a charged thing destroys useful stored power, tell the player the exact amount before the ordinary reclaim action.

## A powered span is a lifecycle, not an opacity value

An existing permanent walking deck must remain permanent. Wiring it cannot secretly remove previously guaranteed support. Offer an explicit receiver mode chosen at construction or through a disclosed conversion while the deck is unoccupied:

- **Permanent deck:** current v0.10 surface behavior.
- **Resonant span:** ornament is visible while inactive; walkway collision exists only according to the receiver state below.

The state machine is `dormant -> active -> draining -> dormant`, with a possible `suspended` diagnostic when its anchor or data is invalid. On first funded arrival, active charge permits admission. While active, the receiver consumes its agreed charge-time budget. At exhaustion, it stops accepting new crossings but preserves existing occupants until they can leave. Once no dependent body or placed creation remains, it becomes dormant.

There are two honest implementation choices for safe expiry:

1. **Admission and occupant leases.** Give each admitted body a lease; while draining, only those bodies can use the span until they exit. This requires actor-aware movement/navigation; the current `legal(s,x,z,radius)` is not actor-aware and must actually be extended. A global surface that remains present is not an admission lease.
2. **Visible safety hold with no admission claim.** Keep the entire span supportive until empty and say “waiting for occupants to clear.” New bodies can still enter while held, so it may stay open indefinitely if occupied. This is simpler, but it is not a bounded powered lifetime and can bypass the intended fuel tradeoff. Treat the hold as an explicit local safety concession, or impose a disclosed finite grace followed by the game's existing bank-recovery tether.

Do not advertise choice 1 while implementing choice 2. A production public world eventually needs declared emergency exit/recovery rights, not an owner deleting a shared path beneath someone else.

Dependents include the hero, original workers, pet, authored creatures with cargo, ordinary placed creations whose actual support depends on the deck, and any new physical carrier. Checking only distance to the span's center misses wide parts. Reuse the current exact transformed walking boxes and the existing “other support remains” predicate. A body that also stands on original ground or another independent deck need not hold this span open.

Route topology must include a monotonically increasing revision for powered surface activation/closure and relevant solid-gate transitions. `navigation.js` currently hashes structure IDs and the hydraulic bridge boolean; changing a powered receiver without changing its ID otherwise leaves failed routes cached for 240 ticks and may retain invalid paths. Invalidate once per actual traversability change, not once every countdown tick.

The original wagon is still driven by `Rain.tickCargo` and the original hydraulic commission. Do not change its rules by accident. A new authored delivery creature should use `Realm.legal` and navigation, which see the powered span. The civic board should explicitly say which job accepts any physical route and which original commission requires the hydraulic service.

### Why use a powered crossing when a permanent bridge already works?

This is the main design objection to the proposed chain. A permanent deck currently has the same construction bill and no fuel cost. A powered version therefore has no intrinsic economic superiority.

The first release should honestly offer the resonant span as an opt-in creative mechanism. Its immediate distinct use can be a timed traversal puzzle in the player-created world. A second useful receiver, such as a switchable gate with collision changing on a note, would give connected machinery a different spatial consequence. Only add that second receiver if its full lifecycle can be implemented and tested; do not promise an absent solver to justify the first.

Civic orders should accept any legal physical route. The player's song-powered invention earns credit because it moved the goods, not because the quest refused a simpler good solution. Later terrain, leases, retractable access or public-service constraints may give temporary infrastructure practical advantages, but those constraints must genuinely exist.

## A finite settlement need and its actual delivery

The new civic order is a state record with a factual unmet quantity. For a first journey, choose an actual far-bank destination on reachable ground, clear of the ore node, enemies' spawn volumes and existing protected landmarks. An exact destination is part of the order; receiving cargo is not keyed to the player's proximity to a UI panel.

Suggested record:

```json
{
  "id": "orchard-repair-1",
  "revision": 1,
  "destination": {"id": "far-depot", "x": 8, "z": -27},
  "item": "wood",
  "needed": 3,
  "received": 0,
  "reward": 6,
  "status": "open",
  "assignedCarrier": null,
  "paid": false
}
```

Three one-unit deliveries match the current creature cargo limit. Destination coordinates must be confirmed with the actual world geometry before adoption. A repair need should have a visible change after completion, such as repaired depot boards using the delivered material, plus a persistent record. It must not claim ecological renewal, new production or inhabited NPC consumption unless those processes are implemented.

The material moves `pack -> creature.cargo -> civicInventory`. Add civicInventory to `materialLedger`. If the completed repair then consumes it, move civicInventory to `spent`; never count the same units in both. If a receipt record retains a historical count, label that as evidence, not a second inventory account.

Pin reward funds when the need is made available, before the player performs the service. There are currently only 50 Marks total, with a separate immutable 12-Mark original wagon escrow. That escrow must remain dedicated to the wagon. Two implementation paths:

- **Reserved keeper balance:** leave civic money in `rain.balances.keeper`, record outstanding reservations, and make every keeper purchase/trade respect `available = keeper - unspentReservations`. On completion transfer reserved Marks keeper -> human, set paid once and release that reservation. This preserves the original money ledger shape.
- **Separate civic treasury:** explicitly transfer existing keeper funds into a new counted account and widen the total-money invariant and save validator. Do not add a new treasury of free Marks while still displaying “50 / 50.”

The first path has the smaller migration surface but requires touching `Realm.trade`; otherwise the merchant can spend its promised prize on purchases and leave a completed order unpaid. Total reservations must never exceed the keeper's present balance. If an old save has insufficient unreserved Marks, create fewer or smaller funded orders, or mark a proposed need unfunded until funded; importing a v0.10 world must not grant new money.

Closing the order is one atomic transaction: verify receiver proximity and legal destination, verify outstanding quantity, remove cargo, increase actual destination custody/consumption, update received/status, transfer reserved payment if the final lot, and write one receipt. Retrying the same completion returns its original receipt. It cannot pay again or return delivered goods while keeping payment.

## The creature carrier is a concrete job with recovery

Use an explicit job record rather than overload `task`, whose current text is presentation. A job should pin `id`, order ID/revision, source depot/location, destination, reserved remaining lots, phase, and current cargo provenance. It temporarily overrides the creature's normal rules and resumes them when finished or cancelled.

Phases: `toPickup -> pickingUp -> toDestination -> delivering -> toPickup/complete`, with visible `waitingForSupply`, `waitingForRoute`, `waitingForEnergy` and `returningCargo` states. Delivery cargo remains the existing `{item,count:1}` or extends that schema exactly with provenance. Do not let the ordinary `Creation.tick` cargo override send an order's bundle into the player's inventory; current code unconditionally does that whenever any cargo exists.

Recommended contract: assigning reserves a job, not all future inventory. At pickup, the creature must physically reach the player's declared source depot, spend one actual available unit and a disclosed amount of its food-derived energy, then own one lot. If another action spent the last wood before pickup, the creature waits for supply without negative stock. If the player carries supplies instead, the source position must move with them only if that was the explicitly chosen source rule. A fixed depot is easier for a legible transport chain.

If two creatures can help the same order, reserve one outstanding delivery slot atomically when a lot is picked up. `received + committedLots <= needed`. If only one carrier is supported initially, reject the second assignment explicitly. Never have multiple carriers gather extra goods and discover at the destination that the order is already full with nowhere to return them.

Route interruption does not destroy or magically deliver cargo. Show “waiting for a route to the far depot”; retry when route topology changes. Keep the cargo visibly attached. A cancellation with empty hands ends immediately. A cancellation while carrying marks return requested, walks the lot back to its source and returns custody once. If no route exists, support a declared owner recovery action while near the creature that transfers the actual held lot, cancels the commitment and preserves the ledger. Do not require destroying or resetting the creature to escape a blocked job.

Do not consume energy every waiting tick. Deduct defined pickup/work costs at the transaction boundary so route failure does not invisibly starve the carrier. Existing food consumption goes to spent and never comes back on reclaim. Reclaim with job/cargo active must either refuse with a precise recovery action or atomically cancel a zero-cargo reservation; dangling order assignments are invalid saves.

## Human and agent operations share rules, with explicit limits

The existing `aweCreator` permits blueprint preview and human-reviewed proposals. New connected operations should use a common typed command dispatcher rather than a special unrestricted agent setter.

An envelope needs `worldId`, `rulesVersion`, `controllerId`, `grantEpoch`, `expectedRevision`, `idempotencyKey`, `command`, and a bounded exact payload. The observation method returns the revision and permitted IDs necessary to construct the next command. A newly observed blueprint can be previewed without authority; connection changes, fuel spending and job assignment require a specific accepted grant. The local API remains browser-local and user-editable; this is a consistency/authority contract inside the game, not network security.

Use a command revision separate from the continuously advancing simulation tick. If every idle tick makes the full expected revision stale, an agent cannot issue a meaningful command while the world runs. At the same time, resource and endpoint conflicts must invalidate relevant expectations. A simplest bounded rule is a graph/civic revision incremented by accepted graph, fuel and job transactions, with a recheck of actual live stocks at commit.

Revocation increments grantEpoch even if the permission toggles back on later. A command from epoch 4 must fail in epoch 6. Processed idempotency keys retain their payload digest and receipt; the same key and same payload returns the prior receipt, while the same key with changed payload rejects. Bounded receipt retention should be described honestly: a current local cache does not guarantee retries across arbitrary old snapshots. Do not claim durable exactly-once networking without an authoritative server.

Commands should either validate completely before mutating, or apply to a cloned candidate and commit that candidate atomically. A failed stale or insufficient-funds command must leave connection arrays, investments, cargo, charge, reservations and history unchanged. Return a typed reason and a useful fresh observation; do not silently repair the proposal into something the agent did not inspect.

For the requested tests, separate three evidence classes:

1. A browser-driving agent clicks visible controls, reads labels, navigates with human controls and observes actual rendered consequences. That is a simulated user journey, not a human-subject playtest.
2. An agent uses the public typed local API under a grant and passes the same resource/geometry checks.
3. A headless state policy probes timing, conservation and hostile command scenarios. Direct state fixtures used to create a scenario are setup, not proof that a human can perform the same setup through the UI.

Do not count an agent setting a hero's coordinates through JavaScript as clicking or playing like a human. Use normal input and record the difference when privileged setup was necessary. Shared syntax alone does not establish competitive parity; current full-state observations still differ from a player's camera and attention.

## Joyful presentation that explains the mechanism

The player-facing concept is **Connections**. A readable sentence can be the primary editor: “When **Orchard Remembered** plays **C**, send **one charge** to **Rainstep Span**.” Offer a valid receiver dropdown filtered by type/range and let the player inspect its exact place before connecting. Visual lines complement this sentence; they are not the only way to operate it.

Show an authored pitch as a labeled note and shape as well as color. A warm traveling light is the real charge packet. The receiving bridge changes from faint lattice to solid surface on actual activation. A countdown, charge count and state label make expiry legible without sound. If the span is in a safety hold, it must look and read differently from funded operation.

The creature's cargo is drawn from its actual held item. Its label changes to “carrying wood to the far depot,” “waiting for a crossing,” or “returning your wood.” On the final receipt, the settlement improvement occurs where the delivery arrived and the player sees a concise statement of the actual chain: “Your phrase opened the span. Lanternwing carried three wood. The depot used them. Six reserved Marks transferred.” Only include causal links evidenced by the packets and traversal records; another bridge might actually have carried the creature.

A **Follow the consequence** button can focus the camera on a selected packet or carrier without teleporting the hero or granting remote interaction reach. Always provide an immediate return to the hero. If camera-follow is too much for this release, a marker and highlighted connection/route plus a trace panel still provide a concrete accessible equivalent.

An **Explain the wait** control should show the first blocking condition and the exact next available remedy. This is unusually valuable for a creation game: “The span is ready, but Lanternwing has no food energy” is more useful than a generic failed-chain indicator.

The world pauses while editing as before; entering a panel must not spend the remaining crossing time. Paused scores, in-flight packets and charge timers resume consistently after closing a panel, an activity or a saved checkpoint. The player is not punished for reading the explanation.

## Traceability and the useful-mistake gift

Record typed causal events with bounded retention:

`scoreStarted -> noteEmitted -> chargeDispatched -> chargeArrived -> spanOpened -> cargoPickedUp -> spanTraversed -> cargoReceived -> needCompleted -> rewardTransferred`.

Every record has an event ID, tick, command or cause ID, involved instance/order IDs, pinned blueprint revisions, quantities and outcome. Text is a projection from those facts. Material transfers and payment receipts remain authoritative state even after old presentation history is trimmed; a 300-entry log is not a replay database.

The gift worth adding is a **causal comparison** for a failed and successful chain. Save a small experiment recipe plus measured outcome: which score/filter, connection endpoints, charge spent, actual route, delivery time, waiting reasons and residuals. Let the player branch only the filter or tempo and repeat. Do not label a design “better” merely because it is faster: show the dimensions so a slow, economical or expressive creation retains its meaning.

A factual counterfactual can be generated by rerunning the same disposable fixture with one declared intervention, such as removing the connection or changing the pitch filter. It must be labeled an experiment in a cloned world; it must not write results or resources into the live civic state. If the build does not implement the rerun, a timeline comparison of two actual runs is still useful and honest.

## Acceptance scenarios that can reopen the release

| ID | Setup and action | Required observation/invariant |
|---|---|---|
| K01 | Fresh world; use visible editor controls to create instrument, receptive span and creature; fund and connect; assign the funded civic job; play phrase | The normal player journey completes without debug coordinates or hidden prerequisite repair. Actual packets, active surface, walking carrier, received material and one payment are observable |
| K02 | Same source/receiver with a filter excluding every played pitch | Audio/ordinary score still works; no charge leaves source and no powered activation occurs; UI explains nonmatching notes |
| K03 | Two links accept the same note and source has one remaining unit | The declared fan-out policy is followed exactly; never two delivered units from one input; any rejected recipient is visible |
| K04 | Source reservoir empty; player has enough Breath to play | Performance can run but the powered receiver receives no free charge; unfunded state is legible |
| K05 | Receiver at capacity receives another packet | Accepted quantity plus dissipated/returned quantity equals the packet; no negative or uncounted charge |
| K06 | Remove source, target or link with a packet in flight | The chosen cancellation rule settles once; no arrival at a replacement entity with the same name; no lost ledger units |
| K07 | Edit and save the instrument blueprint during an already-started performance | The instance and its note identities remain pinned; later recipe edits do not change already dispatched packets |
| K08 | Match a note that arrives on the exact expiry tick | The fixed tick-order rule produces one deterministic state; no flicker-dependent crossing outcome |
| K09 | Creature with cargo is midway across when charge runs out | Actual safe expiry policy works; cargo stays in one custody account; no instant delivery, silent deletion or drowning through geometry |
| K10 | Put hero, worker, pet and a placed object on separate edge portions of the deck; attempt closure/reclamation | Every true dependent is handled; an independently supported object does not block unnecessarily; no center-distance shortcut |
| K11 | Creature first has no route; then a note activates the span | Navigation re-evaluates from the new topology immediately or within the declared bounded policy, not a stale 240-tick failure cache |
| K12 | Close the route while a creature is approaching; then reopen | The creature waits/uses legal alternate ground and resumes with its same actual cargo; no collision bypass |
| K13 | Reserve civic reward, then sell goods to the keeper until its available balance is exhausted | Merchant respects civic reservations; completing the promised service still transfers its funded reward |
| K14 | Two commands attempt to assign the same carrier or final remaining delivery slot | One accepted commitment, or the explicitly supported bounded division; `received + committed <= needed` |
| K15 | Spend the last source wood after assignment but before creature pickup | Creature waits for supply; no negative inventory, fictional cargo or paid completion |
| K16 | Cancel an empty carrier job, then cancel a carrying job | Empty reservation releases immediately; held cargo returns by the declared physical/recovery path once, with no payment |
| K17 | Save while creature holds the second lot and a packet is in flight; restore; finish | Same lot, commitment, packet identity, charge state and reward reservation survive; no duplicate pickup, replayed first-note funding or extra payment |
| K18 | Save inside an exhibition entered while a score/packet/span was active; restore entrance checkpoint | All world timers pause/shift together; no compressed burst, unfunded expiry or imported exhibition state |
| K19 | Keep settings open and tab hidden through the nominal expiry time | No wall-clock punishment or offline catch-up; active simulation time alone advances machinery |
| K20 | Replay the exact successful delivery command and its receipt key | Original receipt returned, no second material debit and no second reward; changed payload with same key rejects |
| K21 | Agent observes graph revision 8/epoch 3; human changes a link, revokes then reinvites; agent submits old command | Reject before mutation for stale revision/epoch. Check full state equality, not only inventory |
| K22 | Agent has blueprint-proposal permission but no spend/link grant | Preview/propose works; fuel spending, connection editing and assignment are rejected through the same dispatcher |
| K23 | Import malformed packets, unknown ports, NaN/coerced charge, duplicate IDs, dangling assignment, mismatched order totals or fabricated paid flag | Validate the entire candidate before replacing the active world; original world remains unchanged |
| K24 | Import a legitimate v0.10 save whose keeper already spent most Marks | Migration grants no new money/materials; only funded civic commitments are introduced; old permanent decks remain permanent |
| K25 | Solve the civic need using the original hydraulic crossing or a permanent authored bridge | Any-route job accepts the factual delivery; trace credits the route actually used, not the unwitnessed powered span |
| K26 | Repeat the connected experiment in a disposable rehearsal and export its report | Original world materials, charge, money, orders, graph and grants remain unchanged; report contains pinned inputs and labels privileged fixture setup |
| K27 | Play muted, use keyboard only, then use a narrow viewport/touch controls | The complete creation/connection/recovery journey remains operable and readable; graphical lines and sound are not sole sources of required information |
| K28 | Run all existing combat, crafting, water, market, trial, recovery and save tests after connection integration | Existing contracts remain valid; normalized duel/CTF/trial cannot use world machine charge, powers or civic payments |

Headless tests establish invariants; browser-driven agents establish that the required controls actually reach those mechanics. Neither establishes general player enjoyment. Record observed friction and repair it, then repeat the failed journey rather than adding tests that merely mirror a helper function.

## Whole-game integration and extension law

This release advances creation, spatial strategy, transport, a finite service economy, agent permission, recovery and causal memory together. Combat, boss encounters, CTF, duel and authored trials should retain their own solvers and their normalized boundaries. The connection engine is not a reason to turn every genre into the same colored pulse puzzle.

A new connection port may enter the system only when it declares:

1. The exact typed input/output and what cannot connect to it.
2. Its source and fate for every conserved quantity.
3. Its causal latency, execution budget and loop/fan-out policy.
4. Who may connect, command, remove, consume or reclaim it.
5. Its spatial interaction and collision/access consequences.
6. Persistence, version migration, retry and replay behavior.
7. Failure, cancellation, recovery and absence handling.
8. A readable human control and a bounded agent command.
9. At least one complete actual use plus a materially different useful scenario before claiming a general system.
10. A hostile counterexample that would reopen the feature.

Later settlement production must introduce real consumed inputs and growth/production rules before advertising a renewable microeconomy. Later shared human/agent play needs an authoritative service, authenticated roles, command concurrency and restart recovery. Later crypto settlement must separate recipe, attribution, license, instance title, service obligation and money; no current local event trace is an on-chain proof. These remain whole-game gates, not reasons to delay the current local chain.

## Second devil's-advocate pass and precise revisions

**Objection: the chain is an elaborate toy that a permanent bridge makes irrelevant.** Revised promise: allow the simplest real route and make timed machinery an explicit expressive/puzzle choice. Show actual route use. Add a distinctly useful second receiver only after its real solver exists.

**Objection: saving drops charge because the old snapshot clears visual waves.** Revised architecture: mechanical packets live in persistent connection state, separate from ephemeral decorative waves; snapshot validation checks their custody and IDs. The same rule applies to score pause/resume and activities.

**Objection: a safe bridge becomes unlimited free power when someone stands on it.** Revised acceptance: explicitly choose actor admission leases or disclose a safety hold/recovery concession. Never claim a finite powered lifetime when occupancy can maintain a global surface indefinitely.

**Objection: the finite civic job is only a quest template with a sophisticated receipt.** Revised scope: require an actual delivered material account and a visible consumed/materialized result at the destination. A finite initial need is an honest starting point; do not rename it a simulated living society.

**Objection: an agent test bypasses every usability problem by editing state.** Revised evidence: label fixture setup and require a separate visible-control journey with ordinary movement, clicks, waits and failure recovery. Repeat that journey after the implementation fixes discovered by the agent.

**Objection: strict staleness makes a live simulation unusable.** Revised command contract: bind commands to the relevant transactional revision/epoch and recheck actual live resources; do not invalidate every proposal on every harmless animation tick.

**Objection: a growing idea list substitutes for finishing.** Revised definition of this release: the user can author, connect, fund, hear/see, traverse, deliver, inspect, interrupt, recover, save, resume, and revise one real chain; human-style browser and typed agent journeys both exercise it. A future feature list cannot compensate for a broken link in that sequence.

## What is most compelling, if the gates pass

- **A song acquires a consequence someone else can use.** Authorship leaves the editor and changes an actual route at a specific time.
- **An invented creature participates in an economy through physical work.** Cargo remains a thing with custody through waiting, travel, interruption and receipt.
- **The game can explain its own causality.** The player can discover whether the note, funding, route, energy or demand caused a failure, then revise that particular choice.
- **Good recovery makes ambitious creation less frightening.** A closed route or wrong filter produces a lesson and a recoverable object, not a reset or inexplicable lost inventory.
- **Human and agent collaboration can be inspected.** A player can grant bounded assistance, read the proposed action, revoke it and see the exact effect accepted under that authority.
- **Different creations can solve the same factual problem.** The world rewards a real consequence while leaving room for personal invention, efficiency, beauty and playful complication.

These are concrete reasons to be enthusiastic about the design. They are not evidence that the game is a finished MMORPG, a masterpiece, a fair human–AI competition or a commercially sustainable economy.
