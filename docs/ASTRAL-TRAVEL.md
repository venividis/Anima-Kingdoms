# Astral travel · the Solar System

Open **Astral travel** in the game toolbar, or **Cosmos → Begin astral travel**.

38 destinations and 91 authored landmarks. All eight planets, the Sun, 20 selected moons, seven asteroids, Ceres and Pluto are included. This is a curated explorable selection, not a catalogue of every known moon and minor body.

## Play

- **Worlds:** choose any destination or follow one of four paths. Travel requires no currency or unlock.
- **Orbit:** drag to rotate the view; scroll or pinch to approach. Double tap/click enters the selected landmark.
- **Explore:** enter the selected landscape. Drag to look; WASD or arrows fly; Q/E lower/rise; Shift increases speed. Touch flight pads provide the same movement.
- **Places to explore:** choose a landmark and enter it. The panel starts collapsed on smaller screens.
- **Drift:** optional slow orbit or forward flight. **Listen:** the destination's existing Luma letter sequence, with its original two pitches per letter.
- **Encounter:** after entering a landmark, save a personal reflection of up to 1,200 characters. Revisit it to read or revise it. World export/import retains these encounters.
- **Return to town:** closes the journey and restores the game controls. Escape closes an open drawer, then returns to town.

The local town simulation pauses during travel. The hero's position, health, belongings and work clock remain unchanged. Memories live in the existing device-local world save; no cloud synchronization or multiplayer astral mode is claimed.

## World register

| World | Kind | Landmarks | Authored Luma resonance |
|---|---|---|---|
| Sun | star | The granulation sea; Coronal arches; The polar crown | liha · light |
| Mercury | planet | Caloris basin; The contraction scarps; Polar shadows | rasa · rest |
| Venus | planet | The cloud ocean; Maxwell Montes; Volcanic plains | dema · change |
| Earth | planet | The orchard meridian; Pacific light; The northern curtain | mela · care |
| Moon | moon | Sea of Tranquility; Tycho; The southern highlands | yema · memory |
| Mars | planet | Olympus Mons; Valles Marineris; The northern ice | rema · repair |
| Phobos | moon | Stickney; Grooved ground | leda · difference detection |
| Deimos | moon | The quiet regolith; A small world’s edge | rasa · rest |
| Ceres | dwarf | Occator; Ahuna Mons; The old northern ground | tula · shelter |
| Vesta | asteroid | Rheasilvia; Equatorial troughs | bana · building |
| Pallas | asteroid | Inclined passage; Ancient impact ground | fila · choice |
| Hygiea | asteroid | The dark hemisphere; The rounded horizon | yara · inquiry |
| Psyche | asteroid | Metal and stone; An unknown basin | pela · creation |
| Eros | asteroid | The saddle; Boulder country | leda · difference detection |
| Bennu | asteroid | Nightingale region; The equatorial ridge | yema · memory |
| Itokawa | asteroid | Between the lobes; A smooth gathering place | yuna · joining |
| Jupiter | planet | The Great Red Spot; The belt boundary; Polar vortices | dona · gift |
| Io | moon | Pele region; Loki region; Broken mountains | dema · change |
| Europa | moon | The crossing fractures; Chaos terrain; The ice horizon | tula · shelter |
| Ganymede | moon | Galileo Regio; The grooved country | mena · community |
| Callisto | moon | Valhalla; The ancient surface | yema · memory |
| Saturn | planet | The ring crossing; The northern hexagon; Golden cloud belts | pelama · commitment |
| Mimas | moon | Herschel; Old icy ground | leda · difference detection |
| Enceladus | moon | Tiger stripes; The fractured shell | wesa · growth |
| Dione | moon | The bright cliffs; Cratered plains | leda · difference detection |
| Rhea | moon | The impact basin; Frozen highlands | rasa · rest |
| Titan | moon | Kraken Mare; Equatorial dunes; The high haze | yara · inquiry |
| Iapetus | moon | The equatorial wall; Dark meets bright | lemada · comparison |
| Uranus | planet | The tilted pole; The narrow rings; Cyan cloud passage | fila · choice |
| Miranda | moon | Verona Rupes; The patchwork corona | rema · repair |
| Ariel | moon | The long chasm; Ridge country | yuna · joining |
| Umbriel | moon | Wunda region; The dark highlands | yara · inquiry |
| Titania | moon | Messina Chasma; Ancient highlands | pelama · commitment |
| Oberon | moon | Hamlet region; The outer horizon | yema · memory |
| Neptune | planet | The wandering storm; High white clouds; The faint ring arcs | yara · inquiry |
| Triton | moon | The southern plumes; Cantaloupe terrain | dema · change |
| Pluto | dwarf | Sputnik Planitia; The water-ice mountains; The distant blue limb | hona · awe |
| Charon | moon | The dark northern cap; The great fracture | yuna · joining |

## Representation

The global images use the credited planetary map textures where available. Unmapped small bodies have authored materials. Local scenes use deterministic 3D terrain, not measured elevation datasets. Landmarks evoke named geology; detailed terrain, weather, storm positions, companions in the local sky and Luma associations are authored. Gas and ice giant destinations are cloud flights; the Sun is a plasma flight, with no solid-surface landing claim. Ring and globe views compress distances and sizes. Rotation is animated for visual exploration; this view does not calculate current orbital positions.

The original Luma vocabulary, native font, glyphs and 220 Hz reference pitch ratios are reused. Planet names remain quoted proper names. Resonance assignments are game composition, not measured sounds travelling through vacuum.

## Sources and textures

- Physical summaries: the NASA Science world pages linked in each destination.
- Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus and Neptune maps: [Solar System Scope / INOVE](https://www.solarsystemscope.com/textures/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), based on NASA imagery/elevation. Maps include adjusted colors and filled gaps. Retained local copies are resized/reencoded derivatives.
- Ceres, Vesta, Io, Europa, Ganymede and Callisto maps: NASA Science 3D model resources; NASA/JPL and mission partners. Extracted map textures were reencoded as JPEG.
- Enceladus, Titan and Pluto maps: NASA/JPL-Caltech/Space Science Institute and NASA/JHUAPL/SwRI mission products; retained image source metadata is in public/assets/astral/credits.json.

## Implementation boundaries

WebGL 2 is required for this journey. Failure preserves a working Return to town control. Camera bounds keep flight inside each 360-unit local landscape and above its terrain. Display scale has no kilometre-per-unit promise. These authored patches are finite; they are not entire navigable planetary surfaces. Saving uses the realm's transactional Cosmos command and existing save validation. Legacy saves receive an empty astral journal without losing existing fields. Imported malformed, duplicate or future-clock records are rejected.
