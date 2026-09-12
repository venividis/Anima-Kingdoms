# AWE First Orchard v0.8: independent source audit

Audit date: 2026-09-11. Read-only baseline: Git commit `7f913b352fbc3ccfbe069fb518951b256cce0b61` of `/workspace/sites/awe-first-orchard`. The root builder is responsible for subsequent edits. This report audits the available browser implementation, documentation and tests; it does not claim access to unseen messages or prove intentional deception. Most large omissions were explicitly disclosed in README and UPGRADE-v08; that disclosure makes them honest scope cuts, but they still fail to fulfill the user's larger request.

## The central delivery shortfall

The shipped artifact is a small single-player water-network puzzle in an authored 3D scene, plus one 45-second 2D catching activity. It is a real functioning prototype. It is not an implemented MMORPG, civilization simulator, fighting game, shooter, agent civilization, marketplace or crypto game. The prior final reply itself called it a prototype and disclosed lack of browser playtesting. The issue is the distance between the requested whole-game experience and the delivered slice, not evidence that the finite water arithmetic was fabricated.

## Reproduced correctness findings

Severity here concerns this local prototype's behavior, not financial security. Saved worlds are explicitly editable local state.

| ID | Severity | Finding and evidence | Required repair |
|---|---|---|---|
| D01 | High | `world.js:propose/acceptProposal` returns a mutable plan and acceptance checks only numeric revision and grant epoch. A probe changed the displayed west→bridge plan to east→habitat at larger capacity; acceptance executed the altered plan. | Bind an immutable plan to a particular world/session and issue ID. Acceptance must resolve the stored plan and reject changed data. |
| D02 | Medium | The same acceptance function accepts a proposal generated for another world with matching revision/epoch. A probe generated a proposal in world B and accepted it in independent world C. | Include world identity or use a world-scoped proposal registry, not matching counters alone. |
| D03 | Medium | `game.js:save` exports only player x/z/angle; the load expression sets `bank` to far only when z < −19. A player who entered the bridge from the far bank and reloads while z=−13 now has `bank='near'`. On closure, `rescuePlayer` returns them to the wrong side. The exact saved/restored expressions were reproduced. | Persist and validate the entry bank along with physical pose; rescue and save should be one coherent transition. |
| D04 | Medium | `scene.js:makeScene` selects whole 2.4-unit terrain quads by midpoint, while `world.js:land` checks analytic ellipse/cleft boundaries. Geometry probe: (10, −6.8) is walkable with no rendered earth at y=0; (10, −18.8) has rendered earth but is not walkable. | Derive visible traversable ground and collision from the same clipped mesh or exact shared polygonal domain. |
| D05 | Medium | `world.js:setPriority(first)` exposes only three of the water solver's six permutations. It cannot produce orchard→habitat→bridge, habitat→orchard→bridge or bridge→habitat→orchard. This narrows the economic choices used in the retained research. | Expose and validate the full order, with readable reorder controls or six named permutations. |

Executed evidence is in `audit-probes.mjs` and `audit-probe-results.json`. These contain six probe records (including the two terrain witnesses); they are not six browser playtests. Baseline source needed to reproduce the probes is preserved outside the Site in `source-audit-baseline`.

## Additional source-established defects and weak interfaces

| ID | Severity | Finding and evidence | Classification |
|---|---|---|---|
| D06 | High | `game.js` storage listener reacts only when `started` is true. A second tab opened on the arrival screen keeps an old in-memory world while the first tab progresses. On entering later, `enter()` immediately saves that old world, overwriting the newer snapshot. | Persistence race established by event conditions; not exercised in a browser in this audit. |
| D07 | Medium | Two active tabs save every three simulation seconds, each treating the other's ordinary save as a lock event. Closely timed saves can lock both; there is no lease, compare-and-swap version or ownership election. | Coordination design flaw; precise browser scheduling remains untested. |
| D08 | Medium | `game.js:doPulse` calls `mutate` (which saves) before `rescuePlayer`, so a closing pulse first persists an invalid player location. Reload before the periodic save falls back to default spawn, rather than persisting the actual safety rescue. | Save transaction does not include the player consequence. |
| D09 | Medium | Global `keydown` prevents Space's default action whenever no panel is open, even before entering. A focused native button cannot use its normal Space activation; in-game Space instead jumps. Enter remains available. | Keyboard accessibility defect; guard native interactive targets. |
| D10 | Medium | `canMove` tests a point against terrain plus four circular hut obstacles. Most visible trees, stones, posts, NPCs, node bowls and pavilion supports have no collision. Camera goals have no collision/occlusion check. | Simplified spatial simulation, capable of visibly walking/camera-clipping through objects. Exact visual failures need browser observation. |
| D11 | Low | Pet fallback sets `(player.x+1, player.z+1)` without checking that destination. At a rim or bridge side it can place the follower outside walkable ground. Pet movement also ignores hut obstacles that the player respects. | Cosmetic companion pathing defect. |
| D12 | Low | The About close button says “Close and enter the world” before play, but calls only `closePanel`; the separate Enter button is still required. | Inaccurate action label. |
| D13 | Low | Oru/node sound actions call `toggleSound` when muted (which already plays `townScore`) and then call `townScore` again, doubling the first score. | Audio polish defect. |

## Missing depth, mapped to the request

These are implementation omissions, not all bugs. The documentation candidly lists many of them.

| ID | Requested area | What the v0.8 source actually implements | Missing depth |
|---|---|---|---|
| O01 | MMO / people | One browser-local world and one body; no application server, sockets or presence transport. | Real players, shared authority, persistent shared world, parties, guilds, chat, trading between players, scale/load evidence. |
| O02 | Combat, every attack and balance | No attack state machine, targets, health, damage, guard, dodge, aim or projectile authority. Jump only changes vertical pose. | Any playable combat discipline, frame windows, hit confirmation, counterplay, progression balance or meaningful combat tests. |
| O03 | PvE quests and raids | One fixed crossing task and dynamic text based on water/cargo; no enemy encounters. | Quest chains, dungeon structure, boss mechanics, roles, failure/recovery, loot and raid coordination. |
| O04 | PvP / Warsong-like play | No opponents or networked matches. | Capture-the-flag, team identity, respawn, objective carrying, tie/timeout logic, ranking and anti-cheat. |
| O05 | Fighting games and shooters | No fighting or shooting mode. | Their requested distinct mechanics rather than a generic activity selector. |
| O06 | Games within the world | One solo 45-second Raincatch overlay. It is real input and scoring, but is not the prior Raincatch protocol. | More than one activity, reusable capsule boundaries, tournament/social context, the designed Lanternwake/Loom/Table/duel modes. |
| O07 | Civilization / AoE / strategy | Same-world overhead camera, eight fixed water links and scarce construction stock. | Citizens, work scheduling, production chains, armies, formations, research, culture, diplomacy, settlement planning, war. |
| O08 | Marketplace / microeconomy | Five conserved ledgers; one fixed four-food lot; one reserved 12-Mark payout. No buy/sell action exists. | Orders, offers, price discovery, production/consumption, regional supply, demand, taxes, arbitrage, sinks, participant behavior. |
| O09 | Crypto | No wallet, chain, token, ownership contract, settlement or proof. | The requested crypto layer and an explicit technically tested integration boundary. Omission is disclosed and prevents false financial claims, but the requested feature was not implemented. |
| O10 | AI agents | Serein is an invited scripted repair proposer. It checks up to one feeder/sink path per junction and always chooses the first candidate, with capacity four. | Actual language-model/runtime integration, tool authentication, observation/action protocol, strategy learning, independent agent personas, human-agent ecology. |
| O11 | Companions and characters | A small follower mesh and four authored people, all humans drawn from the same body mesh with different tint. Three stationary NPCs plus Vey's scripted wagon offset. | Pet bond/progression/abilities, independent needs/schedules, character creation, equipment, distinctive rigging, behavior animation. |
| O12 | Worldcraft / magic | “Weave” and “Shape” create the same channel geometry in the same eight slots; they differ in resource and lifetime. “Pulse” performs water allocation; “Listen” opens text/state panels. | Geometry shaping, physics manipulation, combat-worldcraft transfer, elemental interaction, material discovery and creative construction beyond fixed links. |
| O13 | Living ecology | Orchard/reeds use storage thresholds to tint immutable meshes. Fruit is visibly present in the fixed mesh; harvesting is explicitly disabled. | Growth, consumption, harvest, reproduction, population and trophic systems. |
| O14 | Animation / art | Flat triangle meshes, one directional light, fog, sinusoidal sway, translated limb animation and a sky image. Bridge open/closed geometry swaps immediately. | Production character art/rigging, attack/casting animation, growth/folding interpolation, shadow maps, camera collision, level dressing, performance adaptation. This is source-established simplicity, not a claim to have visually judged the site. |
| O15 | Long-term play | No new fiber or Focus is produced. Removing installed fiber loses half. No new quest delivery appears after the sole lot arrives. | A repeatable, balanced daily/long-session progression loop. Irreversible experimentation can exhaust useful stock and force a full reset. |
| O16 | Coauthor recovery | Agent-installed channels cannot be removed by the human even after revocation; the agent has no removal UI/action. | Prospectively agreed lease or repair/relinquish protocol. The prior documentation explicitly acknowledges this unresolved worksite problem. |
| O17 | History and portability | Latest 160 events plus editable local snapshot; JSON export but no import. | Complete action replay, trustworthy shared history, cloud/account saves and restoration of exported worlds. |
| O18 | Physical transport | Wagon travels along x=0 at constant speed until z=−28; support is threshold and longitudinal footprint. | Route finding, vehicle steering, physical cargo interaction, loading/unloading choices, multi-route logistics. The movement and one-shot custody change are real, but not a general transport engine. |
| O19 | World breadth | Two clipped ellipses, four discoverable places, four small huts and a cleft. Distant scenery has no explorable continuation. | The requested whole civilization and broad unknown world. The city-beast is an animated visual suggestion, not a living terrain system. |

## Testing shortcuts and what existing tests actually prove

1. `tests/world.test.mjs` contains 30 Node tests. This count is genuine. One contains 252 inherited Python fixtures. The fixtures should not be advertised as 252 independent gameplay tests.
2. The test named **“bridge visual selection and walkability share the six-water predicate”** only calls `bridgeOpen` and `walkable`. It never exercises the renderer or rendered deck. Shared source usage is helpful, but this test does not prove visual correctness.
3. The finite-geometry test uses a fake renderer, checks finite values/nonempty arrays, and counts fewer than one million vertices. It does not compile the shaders, render images, measure FPS or verify surfaces agree with collision. D04 passes those existing tests.
4. The proposal test verifies no immediate mutation and the resulting actor's fiber, but never changes a plan, uses another world, checks a registered identity or asserts a stored plan fingerprint. D01 and D02 pass it.
5. World-save tests validate cargo snapshots and malformed account totals, but never load/save the separate player state or multiple tabs. D03, D06 and D08 are outside their coverage.
6. No tests exercise `game.js` keyboard/pointer handlers, panel focus transitions, physical player movement, complete Raincatch rounds, character interaction prompts or the browser UI. The 30-test number is not evidence of playability on an actual device.
7. The asset-reference test mainly scans quoted local `src`/`href` and checks a short explicit file list. It is not a full dependency, runtime import, GPU capability or deployed-route test.
8. A single camera-target projection assertion verifies basic matrix consistency. It does not establish an unobstructed, comfortable third-person camera across the world.
9. No measured player study establishes fun, clarity, willingness to return, multiplayer fairness, willingness to pay, macroeconomic stability or novelty. The earlier large finite search supports a narrow water-topology result; it cannot prove “best MMORPG” quality.
10. The README and final response explicitly disclose that browser visual QA and human playtesting were not performed. Keep that distinction: it was an important incomplete verification step, not a falsely reported browser test.

## Recommended rebuild acceptance gates

- Preserve and explain the material water kernel; expose its full choice space.
- Implement a complete small adventure loop: meaningful combat, encounter completion, reward, equipment/crafting decision and a second objective, with consequences visible in the scene.
- Implement actual finite stock trading and production/consumption; do not label a displayed number an economy.
- Add a genuinely different game within the world with its own legal actions, start, end and return contract; label local AI opponents truthfully.
- Give construction visible placement and a shared collision/navigation representation.
- Fix proposal identity, atomic player/cargo persistence and cross-tab ownership before promising faithful continuation.
- Provide character/avatar accessibility controls and readable HUD; do not globally steal native button activation.
- Run the real browser journey on the actual application when authorized: start, movement, camera, interact, battle, build, trade, activity, save/reload. Record failures and fixes rather than substituting Node checks.
- Publish a feature status ledger that separates implemented, simulated locally, documented-only and not started. The whole MMO cannot honestly be declared complete merely by adding menu entries.
