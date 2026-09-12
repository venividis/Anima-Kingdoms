# Combat release verification

Verified on 2026-09-12 against the source accompanying this report.

## Automated checks

- **156 tests passed; zero failed, cancelled or skipped.** Full output is in [automated-tests.txt](automated-tests.txt).
- 34 new combat scenarios cover committed aim, single-slot buffering, held-input priority, cancellation, analog movement, directional evade, collisions, guard, immunity, resource accounting, projectile reach, practice isolation and camera projection.
- Three additional tests execute the actual application key handlers with Shift/digit events. They verify all four attacks and both release orders. These are deterministic event-handler tests, not physical keyboard measurements.
- All six changed JavaScript modules passed `node --check`.

## Browser observations

The [independent playtest](human-control-playtest.md) used actual visible controls. All four attack buttons and all four unmodified keyboard shortcuts landed, for 8 hits and 82 normalized damage. Movement, targeting, evade, displayed touch controls, guard/run activation and world restoration were exercised.

After the held-input and camera changes, the root repeated all four attack buttons in a compact landscape viewport: 4 hits, 41 damage, 4/4 attacks landed. A later Shift+1 browser press landed exactly one Palm hit (6 damage). Other shifted shortcuts are covered by the actual-handler regressions; hot reload interrupted the later browser sequence, so it is not counted as a completed browser pass.

Responsive inspection used a temporary local iframe harness at 390 × 844, 320 × 740 and 844 × 390 CSS pixels. The harness was removed from the shipping source. It exposed health/stick, narrow-label and landscape practice/control overlaps. The final compact layouts separate controls and shorten visible move labels while preserving full accessible names.

## Retained visual evidence

- [Four attacks in practice](four-attacks-practice.jpg), independent desktop pass.
- [Displayed touch controls](touch-controls-practice.jpg), mouse-based joystick pass.
- [Restored world](returned-world-controls.jpg), independent return check.
- [Final 320-pixel portrait layout](portrait-controls-final.jpg).
- [Final 844-pixel landscape layout](landscape-controls-final.jpg).

The screenshots show the cartographic fallback available in the test browser. They do not establish WebGL animation quality, physical multitouch behavior, network latency performance or mobile-device frame rates. Shared geometry, inverse camera projection and movement direction were covered by deterministic tests. Physical phone and GPU visual checks remain follow-up work.

## Review findings repaired

The independent audit identified disappearing recovery input, aim rotating during windup, evade following facing instead of movement, full-speed analog input, invulnerable knockback, misleading fallback boss warnings and invisible arena cover. A final review found Shift could change number-key release identity and leave Palm held. All were repaired; the reviewer found no remaining blockers within its stated input/combat scope.

The standard production build and source publication are completed by the release workflow after these source checks. A hosted release is only reported to the user once the deployment service confirms success.
