# Independent combat control browser playtest

Tested the running local preview in browser tab 1, `http://terminal.local:4173/`, using visible buttons, native key presses and a pointer drag. No application state injection, synthetic DOM event dispatch or source modifications were used. Browser inspection was limited to visible DOM, accessibility attributes, layout dimensions and screenshots.

## Observed successes

- Entered the living world, opened Character, recorded inventory, opened Controls & practice, and entered the harmless combat practice through the UI.
- Each attack button landed. The counter advanced from 0 hits / 0 damage / 0 of 4 to 4 hits / 41 damage / 4 of 4: Palm added 6 damage, Reach 14, Note 9, and Gale 12. These are observed values for this level-one Thread character, not a claim about every build.
- All four attack keyboard shortcuts also landed; the final counter was 8 hits / 82 damage / 4 of 4 after one button activation and one keyboard activation of each move.
- Winding-up, Recovering and Evading feedback appeared after applicable inputs. Longer attacks resolved after their visible windup rather than necessarily before the immediate DOM read.
- Release target button and X changed the target display from Locked to Aim assist. Target / Next target buttons and Tab reacquired the practice wisp. Only one target exists in this practice, so selection order among multiple enemies was not tested.
- Evade showed `Evading · 0.5s` and moved the character from 2.4 m to 1.2 m away from the wisp while standing still and aiming toward it.
- Repeated native S key pulses produced a measurable backstep, from 2.3 m to 2.4 m. A drag on the visible joystick produced movement from 2.3 m to 2.5 m.
- H opened the controls help after prior combat button interactions. Z was accepted without an error; no rotated-camera comparison was performed.
- Enabling Show touch controls exposed the joystick and Run / Guard / Jump controls. Their desktop layout did not overlap the attack bar, movement toolbar, or practice return controls in the inspected screenshots.
- Space on the focused Guard button changed `aria-pressed` to true and the visible status to Guarding; another Space returned it to false. Space similarly toggled the focused Run button's pressed state true and false. A pointer click released these held controls immediately, as expected for a click.
- Return to world restored the First Orchard. Inventory remained wood 10, stone 8, ore 3, food 4, herb 2, crystal 0; Tonic x2, Meal x1; level 1 and 0 experience. The HUD still showed 20 Marks and 100 health / 100 Breath.
- A second enter / return cycle completed. Touch controls were returned to their original unchecked setting and Guard / Run were off when this test ended.

## Limits and findings

- The preview rendered the supported cartographic fallback, not WebGL 3D. This playtest verifies its input and gameplay behavior, not 3D animation quality.
- Sustained key holds, simultaneous real touch fingers, pinch zoom and held-button auto-repeat were not reliably exercisable through the documented browser interface; no claims are made about their feel on a physical phone or keyboard.
- Run's toggle state was observed, but a sustained run speed comparison was not performed. Practice is harmless, so guard damage reduction and evade invulnerability were not tested against incoming attacks here.
- Two bounded Control-plus key attempts did not change the observed viewport dimensions (1363 x 936). Control-0 was sent to restore default zoom. This is not a phone-size layout test.
- No reproducible control failure or overlay collision was observed within the exercised scope. The initially attempted Character click occurred while the world entry dialog was still loading; after entering the world the control worked.
- The browser showed the pre-existing cross-tab save-lock warning: play and export available, automatic saving disabled. Persistence across reload was not claimed.

## Evidence

- `four-attacks-practice.jpg`: 4 hits, 41 damage, all four attacks checked; practice and combat toolbars visible without overlap.
- `touch-controls-practice.jpg`: forced touch joystick and Run / Guard / Jump controls visible alongside combat controls.
- `returned-world-controls.jpg`: First Orchard, original resource counts and exploration controls after returning.

The root agent subsequently planned an additional held-Palm queue-priority change. That later change is outside this independent browser pass and requires the root's final verification.
