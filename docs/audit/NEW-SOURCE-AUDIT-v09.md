# v0.9 in-progress source review

Read-only review of root-authored realm.js, pavilions.js, visual.js and the relevant app.js integration, before the root's announced worker, simultaneous-hit, input, and equipment-normalization patches. Findings below refer to this intermediate source, not the final release. No Site files were edited.

## Urgent independent findings

1. **Partial import validation can crash or inject markup.** `restore` accepts missing enemies/workers (next tick throws), nonnumeric hero.y (camera arithmetic becomes invalid), arbitrary discipline text (character panel interpolates it into innerHTML), plus unchecked pet, items, equipment, options, cooldowns, bests and combat fields. Validate every retained schema field or normalize from an allowlisted schema. Escape user/import-originating strings in HTML even after validation.
2. **Web Lock still permits stale overwrite after waiting at welcome.** The snapshot is loaded once at module initialization. Successful lock acquisition calls `startNow`, which saves that stale state. Re-read and validate current saved bytes inside the successful lock callback before starting. Reproduce: tab B waits at welcome, tab A progresses and closes, B enters and acquires the now-free lock.
3. **Two-player duel locomotion differs.** The p2 branch omits guard slowdown, recovery slowdown and actual dodge movement. Guarded motion measured at 0.03225 units/tick for hero versus 0.0716667 for p2. Over 24 follow-up ticks after simultaneous dodge, hero moved 3.45 units and p2 moved zero. Share one actor-input locomotion function.
4. **Companion ward outlives the five-second chord.** `damage` consumes pet.ward without checking resonance.expires. A legal sequence (buy crystal, build beacon, install braid, pulse, sound chord) produced ward 8 at tick 0 and still ward 8 at tick 301, although expiry is tick 300. Clear expired ward or gate its damage reduction by the same expiry.
5. **Ensure advertised discipline bonuses are implemented.** Current welcome copy promises Thread +2 melee and Gale +2 projectile, while the sampled `stepAction` only adds equipment bonuses. Root's planned combat patch may already address this.
6. **Queued double KO needs explicit result resolution.** Once simultaneous hits are queued, resolve duel victory after the entire batch. Current `die` immediately gives human victory when the opponent dies and postpones hero loss for 150 ticks, so merely queuing hits would mis-score a double KO.

## Areas that held up in focused probes

- Modified quote totals were rejected.
- Another world's quote was rejected.
- A full 14,400-tick unattended CTF simulation terminated at the expected four-minute limit. No carried flag referenced a dead/missing actor at any checked tick; exactly two flags remained; all material residuals stayed zero and money stayed 50. This is one scripted simulation, not broad CTF balance evidence.
- The Loom Table's traversable-port adjacency uses both outgoing and reciprocal incoming ports. Shared ownership is intentionally allowed. Simultaneous completed routes are explicitly resolved as a draw. This is a new simplified local ruleset without the inherited finite piece inventory/pie-swap protocol; describe that version boundary.

Probe source and captured intermediate modules are in `new-source-probes/`; `results.json` records the malformed-import and duel/quote probes. These are executable Node probes, not browser observations. Root's known worker/production, hit-queue, zero-angle input and equipment-normalization fixes were not duplicated or edited by this reviewer.
