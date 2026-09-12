# Final bounded app/Foundry integration review

Read-only scope: complete current `app.js` and `studio.js`, relevant HTML control declarations and studio overlay CSS, plus narrow source checks of the creation corrections identified by root. No Site edits, Sites calls, browser calls, screenshots, visual tests, DOM automation or end-to-end playtests.

## Outcome

No additional high-impact integration defect remains identified in the inspected source after root's corrections below. This is a bounded source and function-level conclusion, not a claim that the website has been visually or interactively tested in a browser.

## Concrete defects found and correction status

| Finding | Original source path and reproduction | Current correction |
|---|---|---|
| Trial authoring had no keyboard path for moving sigils | `CreationStudio.behavior()` exposed positions solely through a nonfocusable canvas's `onclick`. A keyboard user could select a sigil but could not change its coordinates. | Numeric X/Z inputs now target the selected sigil and invoke the same authored-state edit path. Source inspected. |
| Editing silently reset the selected sigil | Select sigil 4, click its new position. `edit→refresh→behavior` reconstructed the select with no retained selection, so the next click moved sigil 1. | `refresh()` captures `selectedSigil`, restores/clamps it after reconstruction and calls its change handler to refresh coordinate inputs. Source inspected. |
| Inspector reconstruction could discard keyboard focus | A field's onchange rebuilt the inspector containing that field. Focus was not restored; the old focus trap only wrapped from first/last controls. | `refresh()` captures and restores focus by control ID. `trapTab()` recovers focus even if the active element was removed or lies outside the modal controls. Source inspected. |
| Foundry buttons passed MouseEvent as a blueprint | Root independently identified direct `bind(...,openFoundry)` calls, which passed an event into the optional blueprint argument. | Both `open-creator` and `settings-create` now wrap `()=>openFoundry()`. Source inspected; not credited as a new finding by this reviewer. |

## Rehearsal isolation evidence

`app-integration-probes.mjs` extracts the actual `save()` function from the current application and executes it in a minimal Node VM scope with a real ordinary realm and a real issued rehearsal realm. It does not construct a browser or emulate a user journey.

Results in `app-integration-probe-results.json`:

- Saving while rehearsal is active serializes the original world's ID.
- The rehearsal world's ID is not serialized.
- All six material residuals of the serialized original remain zero.
- A tab marked paused writes nothing.
- A caller without the save lock writes nothing.

Source checks agree with that narrow result: world journal import/export and fresh-world replacement explicitly refuse during rehearsal; entering the Foundry refuses nested rehearsal editing; returning from rehearsal restores the original state object before writing memory and saving. Lab inventory is not merged into production inventory. Ordinary creation, feeding, equip, performance, reclaim and authored-trial actions pass through their typed core functions using the current state.

## Wiring and lifecycle checks

- World landmark `agent` now correctly maps to `companion`; the prior shorthand ReferenceError is absent.
- Literal app control references have matching static or generated declarations. Studio's new course inputs are generated through the existing numeric-control helper.
- Foundry close clears modal/input state, restores HUD interaction and focuses the world. Shelf inspection closes the studio before opening an instance detail panel.
- Placement commits recompile/revalidate through `R.create()` at the point of spending. A stale preview cannot authorize an otherwise invalid resource debit or mode transition.
- Rehearsal return resets input, accumulator, save cadence and presentation counters before reopening the original blueprint.
- Imported blueprint files pass compilation/branching before replacement; blueprint names and identifiers are escaped or assigned through text/value properties in the reviewed HTML paths.
- The local agent API returns compiled data and pending-review records. It does not expose a placement/spend function through that API. It remains a local browser API, not an authenticated agent service.
- `node --check` passed for both reviewed modules.

## Root's additional corrections inspected

- Starter ore/herbs are transferred from the finite reserve; the ordinary realm still balances. The first useful creation no longer requires an unexplained prior herb-production loop.
- Creation context now lists original landmarks, resource sites and safety landings as protected placement locations; solid-part placement rejects overlap with their access area.
- Equipped relic instance position is updated from the hero during world ticks, addressing the prior visible-versus-stored-location mismatch.

No new broad testing was added after these direct risks were resolved. Actual browser focus behavior, pointer placement, visual composition, audio, touch ergonomics, game feel and performance remain outside this review's evidence.
