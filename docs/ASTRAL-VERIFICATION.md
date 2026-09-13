# Astral travel verification · 13 September 2026

- 28 targeted checks passed: astral model and shipped DOM handlers; existing Cosmos mechanics/UI; whole-sky model/UI.
- All 38 world records, 91 landmarks, eight planets, parent links, routes, original Luma words and referenced textures were validated.
- Geometry was checked for finite coordinates, normals and colors at every landmark. Flight remains above terrain and within the scene bounds.
- The shipped DOM handlers were exercised with a mocked graphics context: launch from Cosmos, search for Europa, travel, enter Chaos terrain, fly, record a reflection, return to town, reopen and retain the memory. Hero, inventory and town time remained unchanged. This is DOM testing, not browser visual QA.
- Both real GLSL shader programs compiled and linked in a native EGL context. Earth orbit and Mars, Jupiter, Sun and Europa landscape scenes rendered with no OpenGL errors and were visually inspected. This verifies shader rendering, not the complete browser composition or a physical mobile device.
- Legacy save migration, transactional malformed-input rejection, duplicate update behavior, all 91 maximum-size reflections, snapshot/restore and material conservation passed.
- The production build completed successfully.
- A broader all-tests run did not finish: automatic approval review rejected HTTPS activity to a Cloudflare Workers destination from the hosting test runtime because the destination and payload were not sufficiently established. That run is not reported as passing. The 28 targeted checks above do not require that runtime and passed separately.

## Practical boundaries

Device-local single-player astral travel; no claim of shared multiplayer travel. Finite authored landscape patches, scenic companion positions, scaled sizes and travel, and animated weather rather than live ephemerides or full planetary elevation reconstruction. WebGL 2 is required; the error state retains Return to town. Texture retention is bounded to the current world and its parent, and graphics resources are released when the journey closes.
