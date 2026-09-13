# Whole Sky edition 2 — release verification

13 September 2026. Extends the existing Celestial Atelier in Anima Kingdoms.

## Delivered behavior

- 9,096 positioned Yale BSC entries, all 88 constellation classifications, 333 HR entries annotated from the pinned IAU naming witness; raw source files, definitions, hashes and reproducible compiler retained.
- Ten computed Solar System objects; topocentric horizon views; catalogue proper motion, precession and nutation; both hemispheres and observer/date study controls.
- True Ascendant in the eighth Codex cell, model lunar illumination, exact fixed-width native seal and unchanged Luma pitch code.
- The 20/12/60 and 27/4/108 circle constructions, tithi, seasonal terms, osculating lunar nodes, refined phase/season events and unequal planetary hours.
- Shared-clock landscape, observatory and workshop; study time cannot become a crafting or notebook timestamp.
- Owner-authenticated live encounter notebook, preserved intentions and reflection revisions, actual workshop use links, detailed stage-quality provenance and old-save compatibility.
- A 20-chapter, approximately 6,345-word guide, also integrated into the full-game guide.

## Verification completed

The full automated suite passed **310 of 310** tests. After final refinements, the affected sky and UI groups passed again (**12 of 12**); the broader combined sky/Atelier run also passed (**22 of 22**). Logs are retained alongside this record. The test counts are groups, not a claim that each assertion is an independent empirical experiment.

New mathematical checks cover all 400 exact decimal bin boundaries and immediate IEEE neighbours, including signed wraparound and extremely small inputs; the 108-cell common refinement; the original Greenwich planetary reference; origin-invariant phase/tithi and non-invariant yoga; cosine/sine masks; polar absence; horizon-plane and eastern-intersection conditions; star catalogue coverage and horizon transforms; principal-event residuals; valid UTC dates; and stage/notebook persistence.

The UI checks execute the shipped handlers for searching Vega, southern and polar study skies, rings and coordinate controls, actual two-character native cells, saved local intentions/reflections, shared server-timed notebooks and retained crafting. Canvas and audio are mocked in those DOM checks. The actual pure canvas drawing functions were also rendered with a local canvas implementation and visually inspected for the dome, rings and coordinate views; ring-label overlap was corrected. This is not a browser layout review or human playtest.

The final emitted Worker was exercised with an isolated local D1 database. Nineteen requested pages, code/data/font assets and the health route returned 200. Session arrival returned 201, the retained Luma experience action succeeded, the new sky observation succeeded, and a supplied client timestamp was rejected with 409. The exact path/status records are in `built-worker.json`. No test characters or test commands were written to the production realm.

All eleven changed/new static sky artifacts checked in the staging comparison matched their source files byte-for-byte. The original uploaded artwork remains unchanged, SHA-256:

`86f7c110a82587eb50f302def2261b5ae9b431a41cdabf46b8f48a6c7a8f0668`.

## Independent numerical comparison

`swiss-comparison.json` retains all inputs, numeric references, conventions and differences from Swiss Ephemeris using its explicit Moshier option. Swiss Ephemeris was installed only in a scratch validation environment; the product does not bundle or call it.

| Comparison | Cases | Maximum difference |
|---|---:|---:|
| Body longitude at the same stated UT | 70 | 2.355552 arcminutes |
| Body longitude with TT controlled to the game model | 70 | 0.581077 arcminute |
| Ascendant | 168 | 3.828205 arcseconds |
| Midheaven | 168 | 1.910864 arcseconds |

Body dates span 1800, 1900, 2000, 2024, 2026, 2100 and 2200. Angle cases span eight latitudes from −75° to +75° and three longitudes. These are sampled comparisons between models, not certification of absolute observational accuracy across every date. The larger future-UT discrepancy remains visible; the controlled TT comparison is separately labelled.

## Corrections made during this work

1. Replaced sidereal angle with the actual Ascendant in the eight-angle seal, while retaining sidereal angle as metadata.
2. Replaced the elongation-only brightness approximation with the model's illuminated fraction.
3. Gave fixed-width native cells their own formatter after testing exposed ordinary numeral canonicalization removing a leading zero.
4. Quantized signed decimal angles with integer modulo arithmetic, preserving half-open boundaries even when ordinary floating-point wrapping would lose a tiny negative input.
5. Counted genuinely available coordinate pairs at polar singularities rather than treating an empty pair slot as a completed angle.
6. Kept the workshop's sound/caption strip in ordinary document flow after moving its original chart, and added navigation within the longer workspace.

## Limits preserved

This is a sourced bright-star atlas and educational planetarium, not a complete deep-sky catalogue, calibrated visibility simulator, telescope image, full astrological calendar or reconstruction of every cultural sky. Fixed-frame stellar approximations, the older naming witness, model time scales, quantization loss and authored game effects are identified in the guide and export. Human language learning, chant intelligibility, accessibility with real assistive technology, mobile layout and subjective experience still require human encounters. Existing material custody, shared authentication, optional agent grants and save-lease rules remain active.
