# Combat and movement — September 2026

This release addresses controls that were difficult to aim, combine and understand. It changes the existing playable simulation, its two renderers and the actual keyboard, pointer and touch handlers. It does not introduce a second demonstration combat system.

## Start playing

Open **Controls & practice (H)**, then **Enter combat practice**. The harmless wisp records real hits, damage and which attacks have landed. Practice restores the supplies, health, Breath and combat statistics you brought from the world when you return. It gives no rewards. Breath regenerates faster in practice, explicitly disclosed in the guide.

| Action | Keyboard and mouse | Touch / visible control |
| --- | --- | --- |
| Move | WASD or arrows, relative to the camera | Drag the movement stick; partial deflection walks slowly |
| Run | Hold Shift | Hold Run; keyboard activation of the button toggles it |
| Aim | Point into the world | Tap a visible opponent, or use Target |
| Lock / release target | Tab while the world has focus / X | Target / Release |
| Look | Right-drag | Drag the open world |
| Zoom / center | Wheel / Z | Pinch the open world / Center camera |
| Palm | Press or hold 1; left-click or hold in the world | Press or hold Palm |
| Reach / Note / Gale | 2 / 3 / 4 | Corresponding attack button |
| Evade | R, toward movement or aim when stationary | Evade |
| Guard | Hold C, facing your aim | Hold Guard; keyboard activation of the button toggles it |
| Jump / interact | Space / E | Jump / interaction prompt |
| Attuned relic | T | The existing attuned-power control |

Tab still navigates interface buttons normally. Attack buttons return keyboard focus to the world. Opening a panel, losing focus, changing activity or hiding the tab clears held inputs and pending follow-ups. Numbered attacks use physical digit identity so Shift does not turn them into unrelated punctuation keys.

## Four attacks with different jobs

The table is the normalized base specification, at 60 simulation ticks per second. Outside normalized exhibitions, existing equipment and discipline modifiers still apply.

| Attack | Job | Damage | Breath | Reach | Startup / active / recovery ticks |
| --- | --- | ---: | ---: | ---: | --- |
| Needle Palm | Free, quick close strike; hold to repeat | 6 | 0 | 2.6 m, 1.75 rad arc | 5 / 2 / 11 |
| Tension Reach | Narrow, longer thrust | 14 | 10 | 3.8 m, 1.3 rad arc | 13 / 3 / 19 |
| Glass Note | Aimed projectile stopped by cover | 9 | 12 | 32 m | 11 / 1 / 25 |
| Gale Break | Circular crowd control; radial push on contact | 12 | 30 | 6 m circle | 20 / 3 / 32 |

Base damage, cost and attack timing remain unchanged. Glass Note now travels at 24 m/s, previously 18 m/s, and its final step stops at its declared maximum travel. This makes the projectile faster without silently extending its reach. Palm's free follow-ups no longer postpone Breath regeneration.

An attack commits its aim when accepted. Moving or aiming during its windup cannot rotate an already committed hit into a different direction. Palm has alternating visual strikes; Reach thrusts; Note charges an orb and projects a line; Gale expands into a circular sweep. These cues follow the real attack phases. The visual Palm chain grants no extra damage.

## Input and defensive rules

- A single 12-tick (0.2-second) buffer retains the latest deliberate next action. A press near the end of recovery can begin when legal; an early press expires instead of firing unexpectedly much later.
- Held Palm is a fallback request. It cannot overwrite an explicitly queued special attack. Releasing it removes its uncommitted repeat, while the already committed strike completes.
- Costs are charged once when an action starts, never merely because its button was pressed. Insufficient Breath, queued actions and recovery have visible feedback.
- Evade costs 24 Breath and lasts 36 ticks. Movement is committed for 24 ticks at 9 m/s: 3.6 m of travel before collision constraints. Its existing ten-tick invulnerability window remains limited to the middle of the action.
- Evade may cancel the latter half of attack recovery. It cannot erase startup or an active strike. Direction follows movement even when the character is aiming elsewhere.
- Guard is directional. Blocked or invulnerable contacts do not apply knockback. Gale pushes each successfully struck opponent away from the caster.
- Analog movement preserves magnitude, includes a dead zone and caps diagonal speed. Normal speed is 4.3 m/s, running 6.8 m/s; existing guard, attack and flag-carrier multipliers still apply.
- Target assistance only considers opponents with a visible line of sight. Locking uses the same visibility rule, and the target card reports distance and selected move reach. It does not bypass cover or guarantee a hit.

## Rendering and input architecture

`realm.js` owns action acceptance, movement, contact, cost, guard, immunity and practice isolation. `combat.js` supplies shared input transforms and geometric descriptions. `combat-view.js` renders those descriptions through either camera and updates the visible combat state. Both human handlers and deterministic agent scenarios feed the same simulation input path; local duelists use the same rules.

`visual.js` adds distinct 3D attack poses. `canvas-view.js` supports rotated camera projection, its inverse for aiming, visible arena cover and activity-specific minimaps. `combat-view.js` displays committed attack geometry, guard, evade and damage in both renderers. Boss ring warnings now appear at their real targeted coordinates and radius; phase-three shot warnings show the real spread.

Touch uses pointer capture, cancellation and explicit cleanup. A second world pointer switches to pinch measurement. The movement stick, world look and attack controls remain separate input surfaces. The implementation was informed by the [W3C Pointer Events specification](https://www.w3.org/TR/pointerevents3/) and [MDN's multi-pointer pinch example](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures).

## Verification and limits

The release adds 34 deterministic combat scenarios and three regressions executing the actual registered keyboard handlers. These cover aim commitment, buffer expiry and priority, Shift release order, fractional movement, camera transforms, cover collision, Breath accounting, guard and immunity, radial push, projectile travel, created-relic costs, practice restoration and truthful boss warnings. The full existing suite is retained.

An independent agent used browser buttons and keyboard shortcuts to land all four attacks, cycle and release targets, evade, move, operate the displayed joystick, guard and run, and return to the world with supplies intact. A further compact-layout pass inspected 390 × 844, 320 × 740 and 844 × 390 CSS viewports, found overlaps and corrected them. See [the observed playtest](audit/combat/human-control-playtest.md) and [release verification](audit/combat/release-verification.md).

These are local simulation and browser checks, not evidence of network PvP latency behavior. The browser available for this review used the canvas fallback. 3D code and shared geometry were checked, but the new WebGL poses were not visually verified on a GPU in this environment. Physical multitouch, pinch on a phone and sustained finger combinations still need device testing; mouse manipulation of a displayed touch control is recorded as such.
