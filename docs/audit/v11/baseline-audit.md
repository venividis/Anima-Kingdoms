# Anima Kingdoms connection-layer baseline audit

Read-only reviewer: `kingdoms_core_review`. Reviewed 2026-09-12 from Site commit `056a21b3628e5a588a8a5a38275e2dd7f7f8162c` (`awe-dream-foundry-0.10.0`). The unchanged inspected modules are copied in `baseline/`. The scope is the proposed chain **composed score → powered structure → opened route → creature carries a real delivery → settlement need**, with movement, persistence, collision, economy and agent fairness as priorities. This is not a browser playtest, visual validation, fresh external research, complete production security audit, or claim of exhaustive review of the whole historical project.

## Evidence collected

- Ran the existing `npm test`: **91/91 passed**. Log: `baseline-tests.txt`. One of those tests contains 252 inherited water-allocation fixtures; those are not 252 additional end-to-end game tests.
- Added and executed four independent state probes in `baseline-probes.mjs`; results in `baseline-probe-results.json`.
- Added and executed the legal-gameplay envelope/save regression in `bounds-probe.mjs`.
- No Site code changed. No browser or Sites tool was invoked by this reviewer.

## Confirmed existing high-impact defect

### P0 — A legal authored deck can lead a creature outside the save validator's envelope

`creation.js` placement validates only the instance center in `x [-55,55]`, `z [-62,48]`; box extents may extend farther. Geometry controls legal runtime ground. Creature save validation later requires `x [-60,60]`, `z [-65,55]`, while navigation has a separate world search box `x [-57,57]`, `z [-63,50]`. Direct line navigation bypasses the search bounds.

Reproduction using accepted blueprint parts and real movement ticks:

1. Begin a realm, stand at `(43,14)` on existing ground.
2. Create a structure centered `(55,14)` with five walking boxes at local x `[-8,-4,0,4,8]`, each width/depth4, y0.08/height0.16. Its left deck is anchored to original land, so placement accepts it.
3. Create a following creature at `(42,14)`.
4. Walk east for1500 simulation ticks.
5. Hero stops at x64.93 and creature follows to x62.44. All six material residuals remain zero.
6. `restore(snapshot(s))` throws **Malformed creation instance.**

This is a real accepted-creation/save failure, independent of malicious JSON editing. Recommended fix: one shared physical envelope for runtime legal ground, authored part footprints, actor validation and navigation. Restrict physical structure extents before placement or expand every relevant boundary consistently. Test outermost rotated corners as well as axis-aligned boxes and all four map sides.

### P0 — Failed save recovery overwrites the evidence with a fresh realm

`app.js` save serializes `R.snapshot` without checking whether restore can load it. On startup a rejected save sets `saveFailure=true`, but `begin`/`startNow` creates a new realm and immediately calls save under the same key. Consequently, the preceding legal construction failure can become persistent progress loss, not merely an import error.

Recommended fix: preserve rejected raw bytes in a recovery slot or disable overwriting that key until the player explicitly chooses reset/import. Show an actionable export/recovery path. Do not claim that displaying “not merged” means the prior raw world was preserved. Validate current snapshots at an appropriate save boundary after bounds are unified.

## Existing integration gaps that would break the proposed chain if carried forward

| Priority | Observation and evidence | Connection-layer implication |
|---|---|---|
| P1 | `navigation.js` route topology key includes rain bridge-open, preset IDs and authored structure IDs, but no changing powered/open state. Artificial legal gate probe: cached actor still returns null after the alternate route opens; fresh identical actor finds the path in124 legality calls. | Add a monotonic topology revision or canonical passability key for gate state. Closing and opening must invalidate both successful and failed route caches immediately. |
| P1 | Instrument note events contain only `{pitch,energy}`. Waves lack source instance/performance identity and typed receiver-event provenance. | A receiver must bind a precise instrument and score/performance. Otherwise overlapping unrelated instruments can accidentally complete a score, and provenance cannot explain why a gate opened. |
| P1 | Snapshot clears waves and notes but retains instrument cursor. Probe saved after tick1: cursor index1/next25 survives, first wave disappears. | A receiver waiting for8 arrivals can be left with only7 after reload. Either preserve validated in-flight connection events and receiver progress, or explicitly reset/cancel the incomplete performance on checkpoint. Silent loss is not equivalent behavior. |
| P1 | Current `ground` distinguishes support but `rescue` checks only absent ground, not a newly enabled collision box. | A gate closing while a body is in its footprint can trap that body. Define a clear closing interlock for humans, workers, pets, couriers and parked creations. Do not resolve a routine collision by deleting cargo or teleporting inventory. |
| P1 | Reclamation protects bodies/creations that currently depend on a deck, but there is no connection dependency graph. | Removing a source/receiver must update or reject dependent links, pending requests and shipments explicitly. A removed source cannot remain a ghost signal provider. |
| P1 | Existing creature cargo has exact `{item,count:1}` and always delivers to `s.hero`. Successful physical wood probe gathers at tick375 and arrives at human at tick677, maintaining a zero ledger residual. | Settlement delivery needs a separate destination identity, order/reservation status and custody transition. Moving the hero must not redirect a settlement consignment into the pack. |
| P1 | Realm material ledger includes pack, market, reserve, spent, authored investment/cargo and worker cargo. No settlement-demand inventory exists. | Every added delivered/stored/consumed stock must join the same conservation equation. Debiting the reserve and then also debiting the pack would double-charge; crediting settlement and pack would duplicate. |
| P2 | The original wagon uses `Rain.tickCargo(w,dt)`, hard-coded x0 path and `Rain.walkable`; it has no access to authored surfaces. The bridge probe takes the hero to far-bank z−37.25 while wagon remains waiting z5 and original bridge is closed. | Either deliberately make the new chain use an authored courier and disclose the original wagon contract, or integrate wagon movement with the shared geometry. Do not claim the new bridge opens the wagon's route unless actually implemented/tested. |
| P2 | Existing main activity entry normalizes equipment and clears world transients; creature/instrument simulation pauses outside world. Instrument cursors shift by activity elapsed on return. | Extend this pause/normalization policy to receiver leases, link timers, relay cooldowns and shipments. Arena time cannot silently expire a route beneath a paused courier. |
| P2 | The current public `aweCreator` object allows inspect/preview/proposal only. Proposals require an explicit invitation and spend no materials until human acceptance. | Genuine agent play needs a typed action interface with the same physical action costs, range checks, cooldowns and observation limits as UI actions. Simply exposing arbitrary state mutation would not be agent play. |

## Recommended connected-system contracts

1. **Source identity:** Every note sent into a connection has source instance ID, source blueprint revision, performance ID, note index/pitch, emission tick and spatial position. Wave/arrival identity is distinct from rendered geometry.
2. **Link identity:** A link references existing compatible endpoints and immutable behavior configuration. Changing a recipe does not mutate a placed source. A failed linking operation spends nothing.
3. **Spatial reception:** Reception occurs when the actual wavefront reaches the receiver, not when a UI “play” button fires. Distance and receiver range can cause an explainable failure. Timing units are simulation ticks.
4. **Ordered score:** Bind a receiver to a score or explicit pattern, enforce index order, distinguish repeated notes, and disallow mixed performance completion. Decide whether a missed note resets progress or times out; show the decision to the player.
5. **Safe gate:** Gate collision and visual state use one value. Opening invalidates navigation. Closing is deferred while a dependent body/consignment remains in the footprint or on a surface that would disappear. A lease expiring while blocked should produce an observable “waiting to close” state.
6. **Physical courier:** A creature carries at most the exact allowed load. A shipment reserves a real source unit exactly once, reaches a physical pickup, traverses shared legal ground, then changes custody at the destination. Failed routes retain cargo and display a reason.
7. **Settlement need:** A request has identity, commodity, finite amount, progress, destination and explicit reward source if any. Completion is idempotent. Consumed material is recorded in spent; stored material is recorded in settlement stock. Fulfillment must not produce unbacked money.
8. **Checkpoint equivalence:** A checkpoint around each transition restores either the same eventual outcome or a clearly documented cancellation with conserved custody. Saving after pickup, after note emission, on a gate deck and before fulfillment are mandatory scenarios.
9. **Bounded execution:** Cap links/events/receiver queues. Reject connection loops or give them a bounded, explicit clocked semantics. A decorative feedback loop cannot create an unbounded event storm.
10. **Agent parity:** The agent interface dispatches through the same command validation as UI controls. It can observe its declared world view and receive structured action errors. Rehearsals remain disposable; no API can merge their issued materials into the real world.

## Acceptance scenarios for the next read-only pass

- Complete the exact five-stage chain using human UI actions and separately the typed agent command path, retaining logs for both.
- Deliberately play a wrong note; observe why the receiver does not activate and show how to repair it.
- Play two identical nearby instruments simultaneously; only the bound source/performance can satisfy its link.
- Save/reload at emission, reception7/8, gate open, courier carrying and just before settlement fulfillment; compare inventories and eventual result.
- Close/expire a gate with hero, pet, worker and courier occupying it; no entrapment, erased cargo or unsupported rendered body.
- Remove either endpoint with an active connection and consignment; all remaining references remain valid and materials balance.
- Repeat completion callbacks/action requests; no double delivery, double payment or extra XP.
- Change a blueprint draft while an instance performs; original performance and links keep their agreed revision.
- Run the outer-envelope deck reproduction and rotated variants; every accepted world must survive snapshot/restore.
- Withdraw agent permission during a queued proposal or pending action; invitation revocation has a defined immediate effect.
- Enter and leave duel/CTF/trial/boss during an active network; no world abilities leak into normalized modes and paused route leases stay coherent.
- Introduce an impossible route and reopen it; failed path cache invalidates and the same courier resumes without respawning.

## What is strong in the existing design

The baseline does have substantive foundations: strict pure-data blueprints, copied placed definitions, explicit material investment, physical harvest/cargo/delivery, bounded parts and behavior rules, exact combat costs, normalized exhibitions, conservative local quote custody, and genuine reusable rehearsal simulation. The wood courier probe confirms a real resource→cargo→inventory chain. The most valuable next step is to connect these foundations without weakening their invariants. The confirmed envelope/save regression demonstrates why91 green checks are evidence of those checks only, not proof that every accepted creation is safe.
