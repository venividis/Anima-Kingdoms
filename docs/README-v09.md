# AWE — The Living Concord

A rebuilt, interconnected local fantasy browser game. Open the website and choose **Enter the living world**. Its complete accountability audit is at `audit.html`.

The current application runs from `dist/index.html` → `app.js`. It has no external JavaScript runtime dependency, account, API key or wallet requirement. WebGL 2 is required. This is an implemented local game; the production MMORPG, connected LLM service and crypto network remain unbuilt.

## Begin exploring

1. Choose Thread, Gale or Stone. Walk with WASD, drag to turn the camera, and jump with Space. The Atlas locates places and resources.
2. Press Q, preview the Mercy Braid, accept its six lasting connections, then pulse rain twice. The first balanced pulse stores four at each destination; the second accumulates enough for the six-water crossing. Close the panel to resume the world.
3. Follow Vey's physical wagon across the crossing. Gather wood, stone or watered plants with E beside resource nodes. Trade at Vey's Exchange in the village.
4. Press B to build a workshop or workplace on an empty marked plot. Assign Mira and Fen to carry resources. Each gathered worker bundle consumes one food. Cargo is counted during transit.
5. Craft gear through Character. Fight with 1/2, shoot with 3, guard with C and evade with R. Explore the far orchard and enter the Root Warden's gate.
6. Visit the Bell Pavilion for Raincatch or Loom Table. Try the Singing Range, Tension Court and Lanternwake Gate. E or Escape opens the return option from an arena.
7. Open World Journal from Settings to inspect accounting, see events, and export/import a world snapshot.

These are suggested actions, not a measured playtest itinerary. Materials and merchant money are finite.

## Controls

| Input | Action |
|---|---|
| WASD; arrows outside a local duel | Camera-relative movement |
| Drag / right-drag / scroll | Orbit / zoom |
| Space / Shift | Jump / run |
| Click or 1 / 2 / 3 / 4 | Palm / Reach / Glass Note / Gale Break |
| C / R | Frontal guard / evade |
| E | Nearby interaction; return panel in activities |
| Q / F | Water loom / manual rain |
| I / J / B | Character / quests / settlement |
| M / Escape | Overhead lens / close or menu |
| Player two: arrows, K/L/O, P, Enter | World-axis movement; Palm/Reach/Note; guard; evade |
| Raincatch: A/D, arrows or drag | Move bowl |

Touch movement, guard, jump and ability buttons are included. Actual devices and keyboard rollover have not been tested. Sound starts after choosing it.

## Source and version boundaries

- `world.js`: inherited exact rain solver, authority, finite funded cargo, shared terrain polygon and bridge.
- `realm.js`: 60 Hz combat, enemies, boss, CTF, local duel, finite resources, quotes, building, physical workers, crafting, quests, pet memory and snapshots.
- `pavilions.js`: Raincatch and the v0.9 shared-port Loom Table variant.
- `engine.js`, `scene.js`, `visual.js`: custom WebGL, geometry, actors, camera, map and state presentation.
- `app.js`, `index.html`, `interface.css`: input, panels, local save lock and activities.
- `audit.html`, `audit.md`: complete audit and all version-specific findings.
- `docs/audit/`: baseline source, reviews and probe results.
- `tests/`: retained water checks and new state/scenario checks.

The archived v0.7 research remains historical. Its architecture and activity protocols are not automatically implemented or wire-compatible here. Old v0.8 sources remain in Git history; unused old entry scripts were removed from served output.

## Saving and simulation

Autosave uses local storage `awe-concord-v09`, guarded by an exclusive Web Lock where supported. The latest snapshot is read after acquiring the lock. Another active tab shows a reload message. Without Web Locks, play/export work but autosave is disabled.

Import replaces one validated snapshot and never merges inventories. It accepts only the new profile. Old v0.8 saves are not migrated or deleted. Activity snapshots return to the original world entrance and discard exhibition bodies/projectiles. Worker cargo and the original wagon lot remain conserved. Panels, pavilion games and hidden tabs pause the world; no offline catch-up.

## Verification

Run `node --test tests/*.test.mjs`. The recorded final run contains 61 methods: 30 retained and 31 new. One retained method includes 252 historical water fixtures; these are not additional gameplay tests. `docs/verification-v09.tap` preserves the output. `docs/boss-scenarios.json` records a failed ranged policy and successful legal melee policy; `tests/boss-scenarios.mjs` reproduces them.

No browser visual QA, actual device check, human playtest, frame-rate measurement, network test, balance proof or economic sustainability evidence is claimed. See the complete audit for unresolved requirements and known limitations.

The deployment is static in `dist`. Serve a separate source copy over HTTP; browser ES modules do not reliably run from `file://`. Source and audit are preserved with the existing Site.
