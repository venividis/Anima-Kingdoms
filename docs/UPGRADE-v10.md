# AWE — the Dream Foundry

11 September 2026 · release profile `awe-dream-foundry-0.10.0`

The central upgrade is a complete bounded creative loop: **shape → specify behavior → rehearse → place → use → revise or reclaim**. This release adds working creations to the existing First Orchard and repairs failures in its older interactions, recovery, combat boundaries and persistence. It does not complete the original massively multiplayer vision.

## Make your first thing

1. Enter or continue your world. Choose **Create** or press **V**. A fresh world now starts with enough supplies for any one of the five starter designs. Three ore and two herb were moved from the existing world reserve to the starter pack; total supply did not increase. Existing saves keep their inventory.
2. In **Shape**, change the parts, add or duplicate them, or choose **Start with one part** and draw a silhouette. Mirroring is optional. Each drawing sample adds actual orb geometry; it is not an image or a text-to-object model. Adjust depth, dimensions, material roles and rotation with the fields. Undo and redo retain up to 40 editing states.
3. In **Behavior**, author the relevant rules, move, score or course. The right panel shows the compiled limits and the exact construction bill. A shape can be expressive without changing its behavior; change both when you want a mechanically different creation.
4. Choose **Enter a living rehearsal** to use the creation in a disposable practice world. A creature starts fed, a relic starts attuned, an instrument begins its score, and a trial opens its course. Use normal movement; press **T** for an attuned relic, and **E** beside a creation to inspect it. **Return with what you learned** restores your original world and retains a factual experiment summary.
5. **Run a controlled experiment** uses a fixed, stated input policy. Change one quality and run it again; **Experiments** compares the last two outcomes, including timing, and can export their exact recipes and evidence. Interactive trials and automatic policies are labeled separately.
6. **Save this blueprint** preserves the recipe. **Bring it into the world** opens placement. Point at the ground and click, or press **E** at the current ghost; **R** rotates, Escape cancels. The placement spends materials only after all checks pass. For a dry crossing, place Rainstep Span centered in the gap near `(0, -13)`, from the near landing. The Atlas helps orient the world.
7. Approach the instance and press **E**, or inspect it from **Blueprints → Present in your world**. Feed, attune, perform or enter the course as appropriate. Make a variation to keep its ancestry. Reclaim an idle, safely removable instance to recover its invested materials exactly once.

The original game remains available: Q opens the water loom, F releases rain, B opens settlement building, I opens Character, and Settings leads to the Exchange, Journal and activities. The original hydraulic wagon contract still needs the original water-supported crossing. An authored span changes player and worker routes; it does not substitute for that commission's water condition.

## The five creative families

| Family | Choices you author | Executed consequence | Expressive boundary |
|---|---|---|---|
| Creature | Up to 32 geometric parts; up to four ordered condition/action rules; resource; power/reach/tempo | Walks with shared navigation, follows/orbits, guards or gathers, spends food energy and carries actual cargo | All use the same horizontal locomotion. Anatomy is not automatically rigged or turned into biomechanics. Rules are deterministic, not a connected model |
| Relic | Form, bolt/wave/mend/ward, power/reach/tempo | Attuned **T** action with compiled startup, recovery, reach, impact and Breath cost | Visible form does not define exact contact volume. Uses range/arc or projectile rules; visuals are scaled in the hand. Allowed in world/PvE, excluded from normalized exhibitions |
| Structure | Form and placement; rotated solid boxes; ground-level walking decks; lights/ornament | Changes supported ground and collision for bodies, shots and camera | A horizontal collision model with a shared deck height. No arbitrary terrain, stacked floors, structural collapse, universal route-solvability guarantee or generalized wagon pathfinding |
| Instrument | Eight pitches, beat interval, voice, form and placement | One paid score emits timed notes and spatial mend/ward/force waves | Pitch changes sound; voice determines the operation. No rests, note-by-note operations, connected receivers or real acoustic healing physics |
| Trial gate | Form, 3–12 sigil positions, sequence/any-order collection, 15–180 second clock | Opens a playable personal course with actual completion/timeout and one result | A sigil-course maker. It is not an arbitrary fighter, shooter or raid scripting engine |

Drafting and practice are free. Blueprints carry recipes; world instances carry invested matter. Imported recipes cannot bring money, equipment, experience or material stock into a world.

## Repairs made while challenging the upgrade

The first pass found that a non-resource interaction could throw because its dispatch map referenced an undefined `agent`. This prevented real landmarks from opening despite the earlier suite passing. The corrected dispatch is now exercised through the actual application function in a Node unit test. The new Create button had a different event-wiring error: a click event could be mistaken for blueprint data. The callback now explicitly discards the event, and the actual binding is tested.

Crafting and world chords are now rejected in normalized exhibitions. Activity entry rejects a dead body, clears range state and temporary world protection, and return discards respawn invulnerability and airborne state. Local player two now has Gale Break on **U** and running on **Right Shift**. Player one uses **Left Shift**. Touch users have a Run button.

Construction rejects occupied preset plots. Original buildings track their material investment and can be dismantled for 75%, rounded down per material. Removing the last workplace requires resting its workers. A finite emergency exchange transfers six of the keeper's existing fiber for two wood; the keeper can fund two such exchanges. Neither recovery route creates goods. Vey's Exchange now has a stationary visible stall even while Vey travels with the wagon.

New solid parts must leave space around resources, landmarks and safety landings. Authored carriers displaced by a lost crossing return to their entry bank with cargo intact. A* navigation caches failed searches as well as successful paths, and invalidates them when the relevant topology changes. This avoids repeating thousands of failed grid checks every tick. It is bounded navigation, not complete pathfinding or performance proof.

A second adversarial pass caught array-valued colors entering numeric rendering, malformed instance angles, unreachable reclamation at the center of a large wall, irrelevant support dependencies blocking removal, scores catching up too quickly after an arena pause, and misleading far-bank results for a separate trial arena. These were repaired. A subsequent integrated test found a one-tick first-note cadence error and a possible stale-note replay across activities; note schedules and event clearing now have explicit tests.

The editor now provides keyboard X/Z controls for sigils, preserves the selected sigil after changes, restores focus after inspector reconstruction, and catches full-part-budget errors. Modal Tab handling recovers focus when a replaced element no longer exists. Pavilion dialogs have a focus trap and intentional result focus. These are source-level accessibility repairs; they are not a completed assistive-technology or device audit.

## What the experiments actually established

The recorded release suite contains **91 automated test methods**: 61 retained methods and 30 new methods. One retained method compares 252 historical exact-water fixtures; these are not 252 extra gameplay tests. The new tests cover valid creation lifecycles, invalid imports, actual movement/cargo, supported-ground removal, rotated collision, timing, normalized activities, save migration, recovery and selected real application functions.

Six reproducible controlled examples yielded:

| Recipe / policy | Observed result |
|---|---|
| Lanternwing / normal guard rules | Defeated the 34-health nearby target; first impact at tick 32, defeat at 267; spent energy |
| The Far Note / repeated aimed attacks | Defeated that target; first impact at tick 47, defeat at 128 |
| Rainstep Span / walk north | Reached actual far-bank land with the original water bridge closed |
| An Orchard Remembered / perform | Eight timed notes and 24 net healing from a starting 55 health |
| A Letter Written in Footsteps / run to next sigil | Completed all five sigils and ended the activity; no asset reward |
| A patient gatherer / harvest rule | Delivered four existing wood bundles during the 60-second run |

Every example kept zero material-ledger change relative to its lab baseline. The lab itself receives explicitly disposable construction supplies; its snapshot fails the real-world conservation check and cannot be imported as a normal save.

A further **46-scenario sweep** exercised every allowed integer allocation with power + reach + tempo = 12, for the bolt verb, against the same nearby target. All defeated it within the 20-second window, with no material residuals. The fastest in this narrow scene was **5 power / 3 reach / 4 tempo**, defeating it at tick 89, about 1.48 seconds. More power can fail to help when two different damage values still require the same number of hits; delay then matters more. This does not establish a best weapon. The target's attack decisions are delayed, the policy sees state directly, and other encounters, defenses, costs and players change the question.

The exact recipes, method assumptions and rows are available in the downloadable experiment evidence. No browser visual inspection, real audio-device check, human playtest, FPS/load measurement, online test, competitive-balance proof or empirical economy/retention study is claimed. Sites' current workflow reserves browser/visual/E2E QA for an explicit user request; this release did not run that separate workflow. Its absence remains an acceptance gate, not a passed test.

## The strongest design value, and the next iteration

What merits the most enthusiasm is **causal authorship**: the player can make a thing, observe what it does, and change an idea in response. A bridge opens a path. A creature delivers something it actually carried. A melody's waves have a place and arrival time. A course turns movement into a challenge authored by its player. Reclaiming materials makes a failed design an opportunity to try again.

The experiment comparison is the additional gift in this release. It gives curiosity a working instrument. It retains the exact recipe with the result so that a surprising outcome can be inspected, shared or contradicted. It does not predict human behavior or certify novelty. Full experiment reports currently live in the session or an exported evidence file; a short factual memory persists in the world. A searchable permanent museum and creator-written annotations remain proposed.

The next design iteration should connect one authored route to a generalized civic delivery contract; one score to one receptive structure through a conserved charge; and one renewable resource cycle to actual consumption. Each must execute all the way through failure and recovery. The shared MMO, real agent services and optional external settlement follow only when their independent authority, persistence and fairness tests pass. The full coverage matrix and both devil's-advocate passes below keep those obligations visible.
