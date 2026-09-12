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
