# AWE whole-source review for the creation rebuild

Reviewed baseline: `08d3696151f110d1af49c146c72419fbfe2c3abd`, local profile `awe-living-concord-0.9.0`.

This is a read-only engineering review of every current runtime source file: `app.js`, `realm.js`, `world.js`, `pavilions.js`, `visual.js`, `scene.js`, `engine.js`, `index.html`, and `interface.css`. The short physical line counts disguise large minified functions; the complete contents were read, including input, import, rendering, activity and timing branches. Findings apply to this exact v0.9 baseline, not automatically to root's subsequent v0.10 repairs.

Bounded Node probes are in `whole-code-probes.mjs`; their complete output is `whole-code-probe-results.json`. A copy of the inspected runtime is in `v09-review-baseline/`, so the probes remain reproducible after the main checkout changes. Some setup fixtures transfer material from the finite reserve to the pack, retaining the material ledger; these fixtures are not claims that a human completed the entire travel loop. A separate legal 18-scenario worker check covered each workplace type on every plot, described below. No Site was edited by this reviewer. No browser, screenshot, visual, performance or end-to-end tests were run.

## Priority findings

### C01 — Critical: every physical landmark interaction throws before dispatch

`app.js` `interact()` constructs:

```js
const map={loom,market,settlement,games,agent,quests,journal,pet:companion,...};
```

There is no variable or function named `agent`; the defined function is `companion()`. Shorthand evaluation throws `ReferenceError: agent is not defined` for any non-resource world landmark before `map[near.kind]` runs. Gathering returns before this line, so gathering can work while NPC/gate/pavilion interaction fails. Top navigation calls a separate, correctly mapped dispatcher, masking parts of the failure.

Reproduction: extract the actual `interact()` function into a Node VM context with `state.mode='world'`, `near.kind='loom'`, and stubs for the other declared handlers. The exact function throws the error above. This is a lexical/runtime proof; it does not rely on a browser surrogate.

Repair: `agent:companion`; add a meaningful exported landmark-dispatch mapping check or source-level scope lint so all existing and creation landmarks resolve.

### C02 — High: crafting bypasses normalized duel/CTF rules and can destroy newly crafted equipment

`realm.js` `craft()` has no world-mode restriction. `app.js` permits the I/Character panel inside activities. Activity entry clears equipped items to normalize combat; a world-owned item therefore appears craftable again in the arena. Crafting consumes real world materials and grants live arena power. `leaveActivity()` restores the original equipment object, losing equipment newly made inside the activity.

Probe: construct workshop; transfer eight existing reserve herbs; craft a coat in the world; enter a two-human duel. Hero starts normalized at 100 maximum HP and no equipment. Crafting the same coat again succeeds, consumes four additional herbs, and raises maximum HP to 125 versus the other human's 100. Leaving restores the originally owned coat. The redundant cost remains consumed. Without an original coat, the newly crafted arena coat disappears entirely on leaving. All material arithmetic still balances: conservation alone cannot detect this gameplay violation.

Repair: gate world crafting at the core and UI; never use a temporary normalized body as the durable equipment ledger.

### C03 — High: world resonance gives a one-sided advantage inside normalized exhibitions

`chord()` has no mode restriction. Q opens the water loom inside a duel or CTF; its chord button invokes `R.chord()` directly. A built world beacon and a prior Mercy Braid rain produce an eight-point Lumenling ward inside a normalized duel. That ward protects only the hero. A preexisting world ward also enters the exhibition because activity entry does not clear/suspend resonance.

Probe: construct beacon from finite resources; install Mercy Braid; pulse; enter two-human duel; call `chord()`. State is `mode='duel'`, hero Breath 60, pet ward 8, chord 4/4/4. The other human has no equivalent function.

Repair: world-only core gate plus an explicit boundary policy for already-active effects. Suspend/restore world effects or discard them symmetrically. A UI-only disabled button is insufficient.

### C04 — High: construction can permanently trap a working person

`construct()` checks proximity to the hero, not workers or the pet. Movement refuses every small step if its endpoint remains inside an obstacle. There is no depenetration or dismantle path.

Legal runtime reproduction: new world; construct lumber camp at plot5; assign Mira to wood; tick 220. Mira is at approximately `(-8.63782,20.20057)`, crossing plot0. Construct a workshop on plot0 while the hero remains at spawn. The construction succeeds. After another 1,800 ticks Mira is at precisely the same position, `phase='traveling'`, and `R.legal()` returns false. All materials balance.

Repair: reject placement if any physical actor/cargo would overlap, or relocate occupants to a verified reachable safe position in the same atomic placement transaction. Apply the same rule to player-created objects and terrain, not just six preset buildings.

### C05 — High: filling the six plots creates a permanent progression dead end

There is no demolition, conversion or building replacement. The UI permits six farms (or any six duplicate non-workshops). All remaining recipes and beacon/chord creation then become unavailable forever in that world. Export/import only helps if the player prepared an earlier snapshot; starting fresh is not an in-world recovery mechanic.

Probe: enough finite gathered wood/stone for six farms; construct all six; workshop construction throws because every plot is occupied. This is not an insufficient-resource problem.

Repair: reversible dismantling with precisely recorded per-building material custody and explicit worker reassignment. Full or partial salvage must debit the correct existing material account; do not refund unrelated historical recipe expenditure from one shared `spent` counter.

### C06 — High: permitted experimentation can permanently remove access to the far bank

Installed-channel salvage returns only floor(capacity/2); temporary Focus is finite and unrecoverable. Keeper fiber 12 and agent Focus 12 have no usable recovery path. Agent-owned channels cannot be removed even after its invitation is withdrawn.

Probe using supported operations: build and remove 24 capacity-one human installed channels, then build and remove 12 capacity-one temporary channels. Human fiber and Focus are now zero. Invite Serein; reserve bridge contributions; accept its two legal proposals, using all 12 agent fiber on spring→west, west→orchard, west→habitat. Pulse repeatedly. The bridge remains closed; no human build stock remains; no agent proposal fits. Ledger still reads water residual 0, money 50, fiber 48, Focus 24, food 4.

This is a legitimate sequence of experiments, not malformed save editing. The game advertises an invitation to create, but irrevocably consumes the tools needed to undo learning mistakes.

Repair: recoverable design materials, an in-world refabrication loop with explicit conservation, or a guaranteed feasible rescue graph funded by existing reserves. Agent ownership needs a clear consensual removal/reclamation policy. Verify recovery from arbitrary exhausted and partitioned states, not only the happy-path Mercy Braid.

### C07 — High: respawn invulnerability crosses the exhibition boundary

CTF sets `invuln=120` on respawn. `leaveActivity()` clears death/action/dodge/guard but does not clear invulnerability. `snapshot()` also retains hero invulnerability. Thus CTF respawn protection becomes a world buff and survives export/reload.

Probe: enter CTF; seed a legitimate end-of-respawn state (`hp=0`, `dead=1`); tick; leave; snapshot/restore. Values are arena 120 → world 120 → restored 120.

Repair: explicitly enumerate transient combat state, including invulnerability, jump y/vy, stagger/recovery, ward/resonance, lastSpend and mode-local timers. For each field, choose restore, clear, pause or continue; do not rely on a partial hand-maintained list.

### C08 — Medium: entering an activity during world death can award a false defeat

Activity entry restores HP but does not clear or reject `hero.dead`. World keyboard E and menus are not blocked while dead. A dying player near a gate can enter a duel during the150-frame recovery window. The remaining countdown later awards the rival a win although the hero has100 HP.

Probe: world hero HP 0, dead 100; enter local duel; tick 100. Result: HP 100, dead0, winner `teal`.

Repair: reject entry while recovering, or use a deliberate complete transition that resets all applicable state. Prefer the same central actor eligibility rule for creation placement, crafting, and activity entry.

### C09 — Medium: the range challenge expires while its world is paused in another arena

Range stores a world-global `start` tick. Entering a duel/CTF/boss does not end or pause the range. Its targets do not step outside world mode, but the global tick advances. Returning after 60 seconds instantly finishes it.

Probe: start range at its physical location; enter a two-human duel; tick 3,601 with no actions; range is unfinished during arena; leave and tick once; it finishes immediately at elapsed 3,602.

Repair: explicitly end the range when entering another activity, or use a range-local active clock. Creation trial mode needs the same unambiguous one-body rule.

### C10 — Medium: local two-human duel has unequal controls

P1 can use Gale Break through 4 and sprint via Shift. P2's input only maps K/L/O to Palm/Reach/Note, with no Gale or run field. P2 has been given guard/dodge parity in prior repairs, but not the complete action set. P1 is camera-relative and P2 world-relative; this difference should at least be explained or made configurable.

Evidence: `app.js` `toInput()`, keydown mapping, activity help copy. This is not a claim of balanced match outcomes.

Repair: complete both action maps, including distinct left/right Shift handling if using one keyboard, and surface all controls. A fair ruleset needs equal available actions; ergonomic fairness still needs human/device testing.

### C11 — Medium: autosave cadence belongs to the old world after reset/import

`frame()` uses `state.tick-saveAt>=180`, while reset/import swaps `state` without resetting `saveAt`. If the old world was at tick 100,000 and the new/imported world is at tick 0, the initial `change()` saves it, but routine movement autosaves do not resume until nearly 28 minutes of active time have passed. Actions routed through `change()` can mask this by saving independently.

Evidence: reset and import callbacks only assign `state`; `saveAt` is initialized once and changes only when the frame threshold is met. `lastHistory`, `lastDiscovered` and `lastResult` also retain the old world's presentation state.

Repair: one `replaceWorld()` path resetting frame accumulator, autosave deadline, cached event/discovery/result counters, input and previews. Use a monotonic frontend elapsed timer for save cadence, not an imported world's tick origin.

### C12 — Medium, source-inferred lifecycle risk: bfcache restoration can retain a released save lock

`pagehide` calls `releaseLock?.()` but leaves `saveLock=true`. There is no `pageshow` handler to reacquire/revalidate a Web Lock. If the page is retained in the browser's back-forward cache and restored after a different tab acquires the lock, the restored page can continue believing it owns autosave.

This is source-inferred, not a browser-reproduced race. It must not be presented as verified under actual browser lifecycle behavior.

Repair: mark ownership false immediately on release; on pageshow persisted, reacquire and reread or require a clear reload. Keep a single lock acquisition/replacement function rather than a boot-only closure.

## Accessibility and presentation gaps from static source

### A01 — Keyboard import action is not reliably reachable

The visible Import control is a label for a `hidden` file input. The label has no tabindex/button semantics, and the panel focus trap only selects buttons, anchors, inputs and selects. A keyboard user cannot focus that visible import control. Use a normal button that calls the input's click handler, with a visible focus state.

### A02 — Pavilion and result overlays do not have the panel's focus containment

`#pavilion` and `#pavilion-result` are plain sections/divs with no modal role/inert treatment. Keydown checks `activity` only after recording keys, and no Tab trap targets pavilion controls. Result presentation does not move focus to its heading/actions. Keyboard focus can wander into covered world elements. This is a static focus-architecture gap; actual tab order/device behavior requires browser verification.

### A03 — Welcome/pavilion can clip at short viewports or increased zoom

Body overflow is hidden. Welcome is a full-height absolute flex container without overflow auto; its content includes a large heading, paragraphs, three path cards, actions and audit link. The max-height 550 rule reduces text sizes but does not ensure all content fits. Pavilion similarly places header, board and score at fixed percentages. Add explicit scrollable areas/layout constraints and verify at 200% zoom and small landscape heights. Do not claim clipped screenshots without obtaining them.

### A04 — Mobile movement lacks the desktop sprint option

Touch controls offer a D-pad, guard and jump; there is no run input. The difference is material to travel and CTF flag play. Introduce a visible toggle/hold control or a deliberate normalized speed policy. Mobile duel itself is currently a shared-keyboard mode, so do not imply touch two-player support.

### A05 — Motion settings only partly cover what they imply

Reduced ambient motion stops ambient world animation, but camera following still eases, creation of labels/popups remains dynamic, and rain catch stays animated as a required game mechanic. The setting is correctly called reduced ambient motion, which is narrower than an accessibility-wide reduced motion mode. Extend only if the product intends a stronger promise; do not silently relabel.

## System contradictions and bounded limitations

1. **The merchant's body and its interaction location disagree.** Visual Vey follows the cart (starts around (2.4, 5.6) and travels far-bank), while Vey's Exchange is an invisible static landmark at (6, 20). A stationary trade stall or a distinct named shopkeeper should make the persistent market interface physically intelligible.
2. **Companion following is collision rejection, not pathfinding.** The Lumenling tries a direct step toward the hero and otherwise stays put. The code's notification that it will follow legal paths can imply obstacle navigation it does not do. A U-turn around a house can strand it on the wrong side. Creation placement will increase these obstacles, so pathfinding/recovery matters more now.
3. **Actual mechanics are mostly horizontal-plane rules with decorative jumping.** Projectiles and melee ignore hero y, cover checks are circles, jumping cannot clear cover/gaps, and most trees/stones are noncolliding. This is a coherent stylized implementation if made legible; it is not deep three-dimensional physical construction.
4. **Renderer translucency lacks a separate transparency pass.** `Renderer.draw()` always draws with depth writes enabled; translucent channels/water/shadows/effects can write depth before later actors/effects. Correct compositing is not established. Rendering all islands and decorative meshes every frame also gives no evidence of mobile performance. These are code-based visual risks, not observed screenshots or measured frame rates.
5. **The finite material world eventually consumes its entire ecological reserve.** Food/wood/ore reserves never replenish; worker food is permanently moved to spent. This is explicitly finite in UI, but cannot support an ongoing civilization economy indefinitely. A creation game needs a purposeful loop for decomposition/reuse, production and resource regeneration, with bounded accounting. Do not solve it by hiding an unlimited currency/material faucet.
6. **Local validation is not authenticity.** Imported JSON may be edited to award boss completion, progression, items or surviving health while preserving checked totals. Exported saves have no trusted server authority, chain proof or authenticated history. This is normal for a local creative game, and should remain a documented boundary. New blueprint validation must make data safe to load and execute; it cannot honestly certify authorship, scarcity or legitimate play.
7. **Research and local exhibition scope remain separate from production claims.** Scripted bots are not connected model agents; local keyboard duels are not online PvP; a finite merchant is not a multi-party order book; a boss is not a network raid. The current UI usually labels these limits correctly. Preserve that honesty while connecting creation to actual runtime behavior.

## What survived meaningful checks

- All eight primary state probes preserved the existing material/water accounting where applicable; their failures show that conservation is necessary but not sufficient for a playable game.
- An additional 18 scenarios constructed each of lumber/quarry/farm on each of the six plots before workers departed, installed and watered the Mercy Braid, assigned Mira, and simulated 6,000 ticks. Every scenario completed actual deliveries: lumber and quarry 4 each (then exhausted initial worker food); farm 2 each in the allotted time. This narrows C04 to construction over an already-present actor, not a blanket claim that worker navigation never works.
- The exact quote/proposal WeakMap binding design is a useful local anti-staleness property. The newly found failures do not invalidate those prior tests.
- Pavilion rules are actual local rule engines with real outcomes. They are not placeholder scoring buttons; they still need human evaluation for interest and fairness.

## Integration requirements for the creation engine

The bounded blueprint design should make its limits explicit and connect them to these findings:

- A draft may be edited freely; an instantiated object must retain the exact accepted design/revision and per-instance material escrow.
- Trial worlds must clone state and consume no durable resources. Accepting a successful trial must revalidate the exact draft, placement, costs and world revision. A headless trial is not a visual or fun endorsement.
- Placement checks must include bodies, workers, path access and recovery exits. At minimum reject overlap and preserve each essential gate/resource interaction; eventually verify topology, including the bridge.
- Every constructed object needs a recoverable lifecycle. Deleting or revising a design must not silently delete existing instances or duplicate their materials.
- The mode boundary should be a documented state-field policy. Combat, range, pet, creation trial, exhibition, crafting and save behavior must agree about which body and which clock are active.
- Safe bounded data can support creative diversity without arbitrary imported JavaScript. Validation of shape/limits/effects is a capability boundary, not authenticated provenance.
- Technical iteration should be followed by actual browser playtesting when explicitly authorized. The baseline's blocking `agent` ReferenceError is evidence that 61 automated checks did not establish the ordinary player journey.
