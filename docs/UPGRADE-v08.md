# From a world diagram to a place you can inhabit

The first embodied AWE build realizes a single promise: **guide the rain, raise a crossing, walk over your own consequence**. It applies the earlier world's care to one coherent playable slice rather than using a camera movement to claim that many unfinished production systems exist.

## Continuity with the complete chat project

The inherited design contains 59 chapters spanning WoW and Blizzard, Nintendo, Age of Empires II and Civilization, fighting games, shooters, games within worlds, motivation, economic behavior, agent permission, crypto and implementation experiments. This implementation was directed by that project's concrete First Orchard, not by an unrelated game template.

| Earlier concern | Embodied decision |
|---|---|
| MMO place, quest and community | A walkable inhabited landscape, three authored people, one carrier, an orchard and reeds with independent needs |
| Nintendo-like readable verbs and surprising consequence | Four verbs with distinct functions; a visible bridge consequence the player can traverse |
| AoE / Civilization systems legibility | An overhead lens over the same entities, finite materials and explicit water priorities |
| Games inside the game | A real local Raincatch pavilion that captures the controlled presence and safely returns it |
| Human and agent collaboration | Serein's invitation, exact viewed plan, own material stock, revision and grant-epoch checks |
| Microeconomics | Scarce construction stock, irreversible salvage loss, one transported lot and finite reserved commission |
| Crypto / rights | No token theater. Authority and custody are explicit; a local save is never sold as a cryptographic proof |
| Character and animation | A controlled hooded traveler, articulated walk, jump, cloak forms, following Lumenling, breathing distant city-beast and flowing accepted channels |
| Factual memory | Recent accepted events, material sonification and world-state export |

The tiny sound-storing creature is the **Lumenling**. **Serein** is the separate invited traveler. Iria is the bridgewright, Vey the caravan keeper, and Oru the keeper of small things.

## An explicit new profile

`awe-first-orchard-0.8.0` retains the v0.7 rain allocation and conservation arithmetic. It changes the experience boundaries deliberately:

| Rule | v0.7 laboratory | v0.8 explorer |
|---|---|---|
| Camera and body | Schematic diagram | Third-person controlled body and same-world overhead lens |
| Bridge | Abstract supported-load value | One named `living-crossing` entity; geometry and route predicate use its shared bounds and six-water threshold |
| Cargo | At origin until abstract qualification | A canonical position moves across the route; the lot travels with the wagon |
| Delivery | Two safe evaluations, by pulse eight | Entire wagon reaches the far depot; no deadline in this exploration profile |
| Episode | Twelve manual pulses, then terminal | Manual pulses continue; no hidden old action cap |
| Retained history | Bounded complete laboratory journal | Latest 160 presentation events; snapshot export, no full-replay claim |
| Activity | Prior deterministic laboratory protocols | New 45-second solo Raincatch variant, explicitly not a protocol-compatible port |

The rain supplies are balanced 12, drought 6 and storm 18 for the next manually chosen pulse. Unlike the previous laboratory's named 12-element sequences, storm here is a chosen constant supply until changed. Weather changes are part of the local experiment, not a governance or production-weather service.

## Material laws

The only eight legal slots are spring to west/east and either junction to each of bridge/orchard/habitat. Capacities are exact integers 1–6. A slot has one channel. Reverse edges and duplicate channels reject.

Water allocation lexicographically maximizes the chosen sink-order delivery tuple, with each destination receiving at most six and source/junction conservation. Equal outcomes choose the smallest flow vector in sorted edge-key order. The JavaScript solver is checked against 252 fixtures produced by the inherited Python implementation, including all six priority orders over 42 varied graphs.

Each destination starts with four water. After a pulse:

`held = min(12, old_storage + delivered)`

`new_storage = held - min(2, held)`

Excess source and storage water are counted as overflow; loss is counted. Post-evaluation storage cannot exceed ten. The crossing opens at six; orchard and reeds flourish at five. Equal temporary and installed graphs transport equal water.

Human fiber 24, Serein fiber 12 and keeper fiber 12 remain a total 48 when installed stock and scrap are included. A lasting channel spends its capacity in fiber. Removal by the owner returns floor(capacity/2); the remainder becomes scrap. Temporary channels cost capacity in Focus and expire after exactly three evaluations. Initial Focus is 12 each for human and partner; it does not regenerate.

The Mercy Braid costs the human's 24 fiber: spring→west6, spring→east6, west→bridge2, east→bridge2, west→habitat4, east→orchard4. In balanced rain its deliveries are 4/4/4. It does not defeat drought scarcity. A preview applies the exact proposed changes and one rain to a clone, then binds acceptance to the current revision; preview geometry never spends live resources.

## Embodied route and finite settlement

The canonical crossing spans z = −7 to −19, x = −3.2 to 3.2. Both the actual rendered deck and walkability use the named bridge contract. Closed wood folds visibly below the route; the player cannot jump across its absent traversable state. Player motion uses bounded 1/60-second steps and a checked walkable domain, with circular building obstacles.

The wagon center starts at (0,5), moves at 1.9 world units per active simulation second, and settles at z = −28. Its 3-unit canonical safety footprint must clear the bridge. If the crossing closes while the wagon overlaps it, a stated safety tether returns it to the near-bank anchor. A wagon fully beyond the far end continues to the depot. The player is rescued to the bank from which they entered. Rescue does not mint, refund or duplicate resources.

There is one four-food lot, carrier-owned until physical arrival. Arrival atomically changes title to keeper, reduces escrow from 12 to zero and credits carrier 12. The sum of money stays 50: human20 + keeper18 + escrow12 at genesis, plus zero agent/carrier. No repeated tick or loaded settled snapshot pays again. Delivered food remains at the parked depot wagon; eating, harvesting and production are not simulated.

Browser input events and simulation ticks execute serially. A manually requested pulse commits before the next physical step. At most six 1/60-second steps are advanced from a frame, using a clamped elapsed interval; hidden tabs advance none. Panels and the pavilion pause physical travel. No automatic rain occurs inside a modal and no real-world elapsed time is caught up on return.

## Partner and player agency

Serein is a small disclosed scripted planner. It considers one-junction feeder-and-destination repairs, prefers low stored-water places and previews one future rain. It does not discover every possible topology or claim language-model intelligence.

An invitation must be active. A viewed proposal carries the world revision, grant epoch, exact plan and forecast. Accepted plans use Serein's own fiber and validate all changes on a clone before commit. Any intervening material event or revoke/regrant cycle makes the old proposal stale. Both bridge inlets can be reserved for the human, preventing the earlier loophole where a helper completed the same intended contribution through the other inlet.

Serein cannot advance rain, set allocation priorities, take player channels or spend human fiber. Revocation does not confiscate already built partner property. The simulator honestly exposes that limitation; a future production worksite needs a prospectively agreed lease or recovery rule.

## A small gift: the missing voice

The bridge, orchard and reeds contribute 220, 330 and 440 Hz respectively. A voice sounds only when the corresponding last rain delivered water, with duration equal to delivered/6 seconds. Sound is explicitly enabled by the player. A silent reed voice is a legible material absence; repairing the network changes the place and the melody together.

There is no invented reward for listening. Foliage condition comes from storage, music from last deliveries, and history from accepted events. These are deliberately different views of the same system rather than identical decorative success meters.

## Pavilion contract

Raincatch is solo and lasts 45 active seconds. A bowl moves under player input. Amber notes add one; pale rain subtracts one with a floor of zero. Missing a note has no penalty. The world avatar stays at the actual pavilion entry position; input does not continue moving the body underneath the activity. Held input clears at transitions and focus loss.

The best score is local. No canonical money, transferable prize or inventory item is created. This is not ranked PvP and has no opponent disguised as a human. Reopening a page resumes the saved world body, not an unfinished activity. Mobile pointer movement and keyboard movement use the same bowl position.

## Visual direction and implementation

The art direction is charcoal mineral, pale living bark, muted sea green, amber sap and quiet predawn depth. The near-bank settlement and far orchard sit on the ancient city-beast. The distant head, horns and breathing flank suggest a larger unknown world, while the traversable slice has a concrete boundary.

Geometry is authored with a dependency-free WebGL 2 renderer. A single generated 2172×724 panorama supplies the distant atmosphere; it is not represented as a screenshot of the running game. The world uses flat-shaded meshes, directional light, depth fog, articulated traveler parts, channel packets, restrained motes, vegetation sway and a motion-reduction setting. No external font or rendering CDN is required.

This is an original functional scene, not a licensed recreation of Blizzard or Nintendo art. It is still an early visual prototype: hand-authored production animation, advanced character rigs, shadow maps, professional level dressing and device optimization remain future work.

## Verification and practical limits

Executed: 30 automated tests, with 252 inherited water fixtures within one parity test. Checks cover conservation, physical arrival, repeated settlement, bridge threshold and endpoints, wagon footprint rescue, future travel after closure, before/after-arrival snapshot restoration, atomic failure, salvage, temporary expiry, permission and reservation boundaries, stale epochs, 1,500 consecutive rain evaluations, malformed saves, camera projection, finite scene geometry and local asset references. All passed.

Not executed: browser visual QA, browser interaction automation, user playtests, real device FPS/latency measurement or production load tests. No such evidence is implied by passing Node tests. The renderer requires WebGL 2 and the live Site must be opened in a compatible browser. Local storage can be unavailable or cleared; the interface reports save failure and supports JSON export. Export is a record, not a resumable import feature in this build.

A second browser tab that observes a save change pauses and requests reload, avoiding silent merging or repeated account creation. Saves validate conserved totals, fields, grant state, cargo ownership and the settlement relationship. These are defensive consistency checks, not a security boundary against someone editing their own browser.

Still unimplemented: networked players, a production LLM agent runtime, deterministic multiplayer combat, PvP matchmaking, raids, pet progression, citizen simulation, market orders, blockchain settlement and an independently verifiable on-chain transition protocol. Those ambitions belong to the retained full design and need their own substantive vertical slices.
