# AWE — the Dream Foundry

A local fantasy browser game with working creation. Play from the existing website and press **V** or choose **Create**. The complete guide, whole-game plan and evidence are at `vision.html`; the retained accountability record is at `audit.html`.

## What you can make

Compose up to 32 parts into a creature, relic, structure, instrument or trial gate. Author its bounded rules, move, score or sigil course. Rehearse in a disposable world, compare actual outcomes, save/branch/share the recipe, and instantiate it with real materials. Reclaim its invested matter safely once. Five individually affordable starter recipes are supplied in a fresh world.

The existing world contains exploration, exact water allocation, finite trading/crafting, original settlement plots and physical workers, timed combat, a Root Warden encounter, bot CTF, local two-player duels, a shooting range, Raincatch and Loom Table. This is not yet an online MMORPG, connected LLM society, renewable civilization or crypto network.

## Controls

| Input | Action |
|---|---|
| V / T | Creation workshop / attuned relic |
| WASD / drag / wheel | Move / orbit / zoom |
| Space / Left Shift | Jump / run |
| 1 or click / 2 / 3 / 4 | Palm / Reach / Note / Gale |
| C / R / E | Guard / evade / nearby interaction |
| Q / F / B / I / J | Water loom / rain / settlement / character / quests |
| M / Escape | Atlas lens / close or menu |
| Placement: E / R / Escape | Commit current ghost / rotate / cancel |
| Player two: arrows, K/L/O/U, P, Enter, Right Shift | Move; Palm/Reach/Note/Gale; guard; evade; run |

Touch buttons are included; devices, visual fidelity and keyboard rollover are not verified. Panels and hidden tabs pause simulation. No offline catch-up.

## Implementation and evidence

- `docs/UPGRADE-v10.md`: guide, repairs, measurements and limits.
- `docs/CREATION-CONTRACT.md`: exact schema, mechanics, custody, activities and persistence.
- `docs/WHOLE-GAME-PLAN.md`: all major original ambitions, two critical passes and next acceptance gates.
- `dist/creation.js`, `navigation.js`, `rehearsal.js`: bounded data/runtime modules.
- `dist/creation-view.js`, `studio.js`, `studio.css`: shared procedural geometry and editing interface.
- `dist/realm.js`, `world.js`, `pavilions.js`: connected original world solvers.
- `tests/creation.test.mjs`: meaningful lifecycle, regression and selected application-function tests.
- `tests/creation-scenarios.mjs`: six family experiments plus 46 full-budget bolt allocations.
- `docs/verification-v10.txt`, `docs/creation-scenarios-v10.json`: exact recorded evidence.

Run `npm test`. Reproduce the bounded experiments with `node tests/creation-scenarios.mjs`. Documentation builders accept an installed `marked` ES-module path; generated pages have no runtime dependency on it. Plain static output is `dist`; WebGL 2 and HTTP module serving are required. There is no external runtime dependency, wallet or API key.

The release records 91 automated methods (61 retained plus 30 new). One retained method contains 252 historical water fixtures; those are not extra gameplay tests. Tests do not establish browser usability, fun, balance, frame rate, online capacity or economic sustainability.

## Persistence

The v0.10 profile accepts its own snapshots and migrates valid v0.9 snapshots. Rehearsal autosave always serializes the separately retained original world; lab supplies never merge. World import replaces a validated snapshot. Web Locks serialize active local saving where available; without them, play/export remain available and autosave is disabled. No shared-server or external ownership authority is implied. Earlier v0.8 worlds are not migrated.

The old README is preserved at `docs/README-v09.md`. Current and historical source/reviews remain versioned with this Site.
