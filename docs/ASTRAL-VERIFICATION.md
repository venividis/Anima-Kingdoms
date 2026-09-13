# Astral travel verification · 13 September 2026

- 32 targeted checks passed: astral model and shipped DOM handlers; existing Cosmos mechanics/UI; whole-sky model/UI.
- All 38 world records, 91 landmarks, eight planets, parent links, routes, original Luma words and referenced textures were validated.
- Geometry was checked for finite coordinates, normals and colors at every landmark. Flight remains above terrain and within the scene bounds.
- The shipped DOM handlers were exercised with a mocked graphics context: depart from the body, automatically open the sky, switch hemispheres to find Jupiter, follow its Europa path, enter Chaos terrain, fly, record a reflection, return to the sky, return to the body, reopen and retain the memory. Dragging, keyboard look, interface hiding, the destination search fallback, and a world renderer failure were exercised. Hero, inventory and town time remained unchanged. This is DOM testing, not browser visual QA.
- Across desktop, portrait phone and landscape phone dimensions, both hemispheres together expose all 9,096 stars and all eleven solar lights/path markers. Every one of the 38 destinations is reachable through those markers or the Earth thread. Zenith, nadir, the azimuth seam, zoom limits and nearest-planet picking were checked.
- The actual Canvas 2D sky renderer was run with native Skia at desktop and phone dimensions, and in an immersive look direction; the resulting sky images were inspected. A software projection of the actual character meshes and departure transforms was also inspected for visible body/soul separation and the upward camera turn. These are native rendering checks, not complete browser composition or physical-device testing.
- Both real GLSL shader programs compiled and linked in a native EGL context. Earth orbit and Mars, Jupiter, Sun and Europa landscape scenes rendered with no OpenGL errors and were visually inspected. This verifies shader rendering, not the complete browser composition or a physical mobile device.
- Legacy save migration, transactional malformed-input rejection, duplicate update behavior, all 91 maximum-size reflections, snapshot/restore and material conservation passed.
- The production build completed successfully.
- A broader all-tests run did not finish: automatic approval review rejected HTTPS activity to a Cloudflare Workers destination from the hosting test runtime because the destination and payload were not sufficiently established. That run is not reported as passing. The targeted checks above do not require that runtime and passed separately.

## Practical boundaries

Device-local single-player astral travel; no claim of shared multiplayer travel. Finite authored landscape patches, scenic companion positions, scaled sizes and travel, and animated weather rather than live ephemerides or full planetary elevation reconstruction. The whole sky is available through Canvas 2D without WebGL; the globe and landscape scenes require WebGL 2. The error state retains the sky and Return to body. Texture retention is bounded to the current world and its parent, and graphics resources are released when the journey closes.
