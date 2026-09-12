# Creation core adversarial review

Scope: initial uncommitted v0.10 `creation.js`, `rehearsal.js`, `navigation.js`, their `realm.js` integration, and the raw-data rendering path in `creation-view.js`. App/UI integration was deliberately excluded because root was still authoring it. No Site modifications, browser calls, screenshots or visual/E2E tests were performed by this reviewer.

This is a record of findings as they were discovered during parallel implementation. Root has already repaired some of them. It must not be copied into release notes as a list of still-open defects without checking the final source/test results.

## Confirmed defects sent to root

| ID | Finding | Evidence and effect | Repair direction |
|---|---|---|---|
| CR01 | Blueprint color accepts an array | `parts[0].color=['#ff0000']` passed the regular expression through coercion. Renderer RGB parsing then produces NaN components. | Require a string before regex. **Root fixed this; a fresh Node probe now rejects it.** |
| CR02 | Imported instance angle poisons runtime | A balanced saved creature with an extra `angle:'bad'` field restored. One ordinary tick converted its yaw to NaN, even with an always/rest rule. | Exact instance fields and optional finite angle validation. **Root fixed this; a fresh Node restore probe now rejects it.** |
| CR03 | Failed navigation cache is not honored | On an unchanged blocked target, three consecutive `waypoint()` calls each made 4,354 legality checks. Cached empty paths fall through into another A* search. | Cache failure until a bounded retry deadline or topology/target change; preserve invalidation when a route becomes possible. |
| CR04 | Rehearsal assumes every structure is a bridge | A valid one-box solid village sculpture compiles, but `measure()` places it at `(0,-13)` and rejects it for lacking a land anchor. | Try a valid original-ground site for nonspanning structures and distinguish static structure/collision trials from crossing trials. |
| CR05 | A valid creation can make its own reclaim anchor unreachable | Build eight half-unit-thick wall segments at x/z ±8 around `(0,0)`. Placement succeeds; nearest legal outside approach is 8.55 from its anchor, but reclaim requires ≤8. | Measure proximity to actual parts or provide an always-reachable reclaim affordance; do not require crossing the object's own solid boundary. |
| CR06 | Reclaim misidentifies original bridge support as dependency | A pet standing on the open original rain bridge prevents reclaim of a redundant authored span because `ctx.baseGround` is `Rain.land`, which excludes the bridge. | Evaluate support after removal using the original currently walkable bridge plus all other authored surfaces; only reject removal that would actually remove occupied support. |
| CR07 | Paused instrument performance compresses into a burst | Play first note at tick1; enter a local duel for 600 ticks; leave. The remaining seven notes play at ticks 602–608, instead of their authored 24-tick spacing. `performance.next` is global while instances pause in activities. | Shift paused deadlines by elapsed activity time, or use a world-active creation clock. Include creation cooldowns in the same declared policy. |
| CR08 | Rehearsal falsely reports far-bank traversal in a trial arena | Default trial completes at z below −19 in a separate arena, causing `report().farBank=true` even though no island crossing occurred. | Restrict the metric to the original world and the actual far-island predicate. |

CR03 evidence used a deliberately small navigation domain: x/z from −20 to 20, legal x<7, actor at (0,0) and target (15,0). Legal-call counts are reproducible algorithm work, not a browser frame-rate measurement. Measured CPU durations of roughly 2–4 ms per call on this runtime must not be presented as device performance guarantees.

CR05 used supported part dimensions and actual compiled material cost: wood 23 + stone 1. Test setup moved this existing quantity from reserve to pack; conservation remained zero. Walls were placed around original ground, with all current bodies clear. This is an authored-data corner case, not malformed-save editing.

## Positive behavioral probes

The normal `measure(seed(kind),1800)` path was executed for all five creation families through the actual shared realm tick:

| Creation family | Observed behavior | Boundary |
|---|---|---|
| Creature | Dealt 34 damage; energy 80 →32 | Scripted guardian rules against the rehearsal target, not a general AI intelligence measure. |
| Relic | Dealt 34 damage using the authored attack | Automatic pilot aimed at the rehearsal target. |
| Structure | Physical body crossed the originally closed gap; far-bank result true; travel 50.95 | The default authored span, not proof that every arbitrary structure is navigable. |
| Instrument | Emitted exactly 8 pitches and raised current HP by 24 | Net HP change, not a general lifetime healing counter or audio-quality test. |
| Trial | Completed all five authored sigils in 426 ticks; travel 48.28 | Automatic movement pilot, not human difficulty or enjoyment. |

Every family returned zero delta for all six material residuals relative to its explicitly issued rehearsal inventory. The lab is deliberately granted extra resources; zero **delta** does not mean the lab is an ordinary economically valid production world.

Additional actual lifecycle probe:

1. Created a harvesting creature from finite reserve-backed materials.
2. Saved and edited its draft name, color and power. The live instance's complete blueprint JSON remained byte-for-byte unchanged.
3. Fed it once. Exactly one food moved from pack to spent and energy became 80. An immediate repeated feed was rejected without spending food.
4. Simulated 4,000 ticks. The creature physically harvested, carried and delivered five bundles in the observed window, with another cycle accounted for. Maximum absolute material-ledger residual was 0 at every tick.
5. Exported and restored a snapshot while the creature carried one resource. Cargo remained exactly one; no inventory merge or duplicate occurred.
6. Let the final carried bundle finish. Reclaimed the instance; the original invested materials returned with zero ledger change. A second reclaim was rejected because the instance no longer existed.
7. Attempted to import a rehearsal snapshot as a normal world. `R.restore()` rejected it with `Material ledger does not balance`.

These checks support the core invention: independently edited drafts, actual material-backed instances, finite creature work, physical surfaces, real spell effects and authored playable trials. They do not certify rendering, ergonomics, long-term balance, production economics, authorship or online security.

## Source-level cautions

- **Held relic position:** the renderer carries the equipped relic with the hero but the instance's x/z remains at its attunement site. Reclaim/support checks still use that old position. Make this a deliberate tethered-relay fiction or give held objects an explicit body-relative custody/location state. Otherwise the object seen in the player's hand and the object checked for reclaim can disagree.
- **Live immutability is copy isolation:** compiling and instantiating deep-copies a draft. Normal draft editing therefore does not rewrite an existing instance. The objects are not cryptographically authenticated or recursively frozen; a user controlling local JavaScript or JSON can alter their own world. Preserve this distinction.
- **Rehearsal limits:** `measure(raw,ticks)` should clamp/validate its tick budget if the value can come from a user-facing field or external agent. It currently relies on the caller passing a bounded integer; blueprint compilation itself does not bound that second argument.
- **Typed safety is not legitimate-play proof:** fields such as personal trial records or authored energy can be edited in a local save. Schema validation should prevent crashes and forbidden operations, while the material ledger prevents accidental duplication in ordinary transitions. Neither proves honest prior play.
- **Spatial interpretation remains planar:** authored solid boxes have correct rotated horizontal footprints; walkway tops are fixed at 0.16. Decorative forms may be three-dimensional, while general stacked walkable floors, gravity, structural stresses and arbitrary creature anatomy are not implemented. Describe the current system precisely.
- **Resource validity versus design feasibility:** some valid very large blueprints cost more material than this finite valley contains. They should remain visibly unaffordable drafts rather than silently receiving issued production materials. The rehearsal is allowed to issue isolated lab resources; the world is not.

## Follow-up verification after root repairs

A fresh run of `creation-probes.mjs` against the now-repaired working tree confirms all eight reported regressions have been addressed in these bounded cases: array colors and bad instance angles reject; repeated failed routes drop from 4,354 legality checks to 21 on each later call (direct-path check only); a land sculpture rehearses; the closed wall and redundant span reclaim; resumed notes retain 24-tick spacing (624 then 648); authored trials no longer claim far-bank traversal. The five positive family behaviors and the full draft/feed/cargo/reclaim lifecycle still pass with zero material deltas. Complete latest output is `creation-probe-results.json`. This is not final-browser or final-release verification.
