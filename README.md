# AWE — The First Orchard

An embodied, explorable browser slice of the AWE / The Unwritten project. This continues the 59-chapter v0.7 design; it is a new rules profile, not a claim that the full MMO, fighting game, civilization engine or crypto network has been implemented.

Open the live Site and choose **Enter the world**. This static application has no external JavaScript dependencies, accounts, API keys or wallet requirement. It uses a small WebGL 2 renderer, authored geometry and one generated panorama.

## First journey

1. Walk with WASD / arrows; drag the scene to look; scroll to zoom. Space jumps; Shift runs. Touch devices have directional controls and drag camera movement.
2. Open **Shape (B)**. Preview the Mercy Braid, accept its six lasting connections, then choose **Pulse**. The first balanced rain delivers four water to each destination and raises the crossing.
3. Close the panel and walk north across the bridge. Vey's wagon makes its own physical journey and pays the reserved commission only on arrival at the far depot.
4. Walk through the orchard and archive. Listen to Oru, Iria and Vey. The Lumenling follows your footsteps.
5. Return to the Bell Pavilion east of the village. Approach its center, press E and play the 45-second Raincatch activity.
6. Start a fresh experiment from Settings to try temporary weaving, drought, different priorities or Serein's invited proposals. A reset explicitly replaces this browser's world; it never merges resources.

## Controls

| Input | Result |
|---|---|
| WASD / arrows | Move the one player body |
| Drag scene / mouse wheel | Orbit / zoom |
| Space / Shift | Jump / run |
| Q / B | Temporary Weave / lasting Shape |
| F | One manual rain evaluation |
| E | Listen / interact with a nearby person or place |
| M / J / Escape | Same-world overhead lens / journal / close or settings |

Rain is manual. Panels, the pavilion and hidden browser tabs pause physical travel. There is no offline catch-up, automatic resource regeneration or absence penalty. Animation is presentation, not a separate source of outcomes.

## Architecture

- `dist/world.js`: conserved water solver, channel authority and costs, bridge entity, physical cargo, finite commission, permission epochs, proposals, validation.
- `dist/engine.js`: matrices, procedural triangle meshes, WebGL shaders and drawing.
- `dist/scene.js`: terrain, architecture, plants, characters, Lumenling, wagon and shared bridge geometry.
- `dist/game.js`: fixed simulation steps, controls, camera, interaction, snapshots, journal, sound and pavilion.
- `dist/style.css` / `dist/index.html`: game interface, touch controls and accessible HTML panels.
- `tests/world.test.mjs`: 30 tests, including 252 exact inherited Python water fixtures in one parity test.
- `docs/UPGRADE-v08.md`: version boundary, design decisions and unimplemented production systems.

Run the meaningful kernel and geometry checks with `node --test tests/world.test.mjs`. The deployment is buildless; authored static output is in `dist`. For a separate local copy, serve `dist` over HTTP; browser modules do not run reliably from `file://`.

The included checks are mathematical, state, geometry-data and source-reference checks. Browser visual QA, actual device performance and human playtesting were not performed in this build. No visual or latency benchmark is claimed.

## Scope

This is a local single-player simulator with a disclosed scripted companion planner. It contains real input, state transitions and conservation, but does not provide multiplayer synchronization, a production AI/LLM service, cryptographic execution proofs, blockchain assets or financial returns. Browser snapshots are editable local state, not authoritative accounts.

All source is preserved with the Site. The previous complete project remains a separate historical artifact; this source does not silently replace its v0.7 laboratory or research evidence.
