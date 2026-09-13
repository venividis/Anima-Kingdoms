# The whole sky, in Luma

**Anima Kingdoms · Whole Sky edition 2 · 13 September 2026**

Open **Cosmos (O)** in the First Orchard, or the **Cosmos** tab in the Living Commons. The observatory, the sky over the landscape, and the Celestial Atelier use the same town clock. The sky can be explored, inscribed, heard, used as a creative context, and revisited after an action.

The connection has five parts. Astronomy supplies a position. A declared coordinate system gives it an address. Luma writes and sounds that address using its existing alphabet. A person chooses an interpretation and intention. An actual action changes the world. The saved record lets you follow those parts again.

## 1. What is now playable

The sky contains **9,096 usable entries from the Yale Bright Star Catalogue**, with stars across all **88 IAU constellations**. Fourteen removed entries in the source have no position and are explicitly omitted. The observatory can show either hemisphere, filter by constellation and magnitude, and locate stars by name, Bayer/Flamsteed designation, or HR number. The IAU naming table supplies an attributed label where a match exists; it does not replace the star's catalogue identity or coordinates.

Ten Solar System objects are calculated: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto. The Sun is a star, the Moon a satellite, and Pluto a dwarf planet. Their shared presence in an interface is not a claim that they are the same physical kind. Uranus, Neptune and Pluto remain inspectable even when they would be difficult or impossible to see with the unaided eye.

Three complementary views are available:

| View | What it shows | What to try |
|---|---|---|
| The visible sky | A zenith-centred or nadir-centred chart, with the horizon at the rim | Find Vega, switch to the southern sky, and compare which stars are above the horizon |
| Circles & cycles | Planetary longitudes; twenty letter positions; twelve signs; twenty-seven divisions and 108 quarters | Change the longitude origin and watch sector labels change while the actual horizon positions remain fixed |
| 1 → 16 coordinates | The eight ordered cosine/sine pairs of the sky seal | Retain three coordinates, then four, to see what the Moon's missing sine restores |

You can also listen to an individual seal cell or the complete sequence, inspect upcoming events, keep an intention with the town sky, save later reflections, and export the complete chart and score. A study date changes the observatory. Crafting continues to use the actual town clock.

## 2. A first encounter

1. Open Cosmos and leave **Town sky · live** selected. Read the solar altitude and lunar illumination before choosing an interpretation.
2. Search for **Vega**. Its name, HR designation, constellation, magnitude, catalogue coordinates, proper motion, altitude and azimuth appear together. A star below the horizon can still be found; select the lower hemisphere to locate it on the chart.
3. Choose **Circles & cycles**. The Moon occupies one longitude, while several different divisions describe that longitude. A label belongs to its chosen ring.
4. Select **Play the seal**. Eight angle cells produce thirty-two notes. Select Saturn's cell and notice that its initial zero is still a real digit with a real place in the score.
5. Choose a practice such as **Mars · Repair**. Read the intention, including its native writing. Keep the town sky if you want to record this encounter.
6. Use the workshop or another part of the world to do something concrete. Repair, build, give, tend, or learn. Applying a finished workshop object is linked to the latest encounter automatically; this is a record of an in-game action, not a judgment about whether you fulfilled your intention.
7. Return to that encounter and write what changed. The original intention stays visible. Another reflection adds a revision rather than replacing what you previously wrote.

The notebook retains the latest 24 encounters, with up to eight reflections per encounter. Export before beginning more encounters if you want to retain the entire history outside that bounded notebook. Reflections can describe activities outside the game, but those descriptions remain the speaker's report.

## 3. The world clock and the study clock

The town begins at **12 September 2026, 18:00 UTC**, at **38° north, 0° east, elevation 150 metres**. This is an authored town location. The game does not infer your location or request device geolocation.

One active game second advances the astronomical clock by 120 seconds. Twelve active minutes therefore advance one mean solar day of 86,400 seconds. That arithmetic does not make the stellar rotation period exactly the same as the solar day.

In the local Orchard, celestial time advances with active world simulation. Cosmos keeps the world running while you work. Other panels, arenas and hidden tabs retain the existing pause rules. The shared Commons uses server elapsed time, including time while a player is absent. A shared craft still waits for commands to advance its stages; elapsed time never spends additional materials by itself.

The live ephemeris is sampled once per real second, corresponding to two simulated minutes. Beat timing continues to use the finer work clock. This avoids recalculating ten-body astronomy on every animation frame while keeping a reproducible timestamp for each chart.

**Travel through time & place** accepts a UTC date and time, latitude and longitude. The study observer uses elevation zero; the southern preset preserves the town's 150-metre elevation. Dates from 1800 through 2200 are supported. Invalid calendar dates are rejected rather than normalized into a different day. Six-hour and one-day controls advance the study date. Event buttons move directly to a computed event.

**Return to town sky** restores the live observer and tropical origin. A study chart can be exported, but it cannot be submitted as a more favourable crafting time or as the timestamp of a live encounter. The shared authority chooses its own clock and observer. No client timestamp is accepted by the notebook command.

## 4. Reading the sphere

Altitude measures angle above or below the chosen horizon. Azimuth increases from north through east. At 0° altitude an object is on the mathematical horizon; at +90° it is overhead. The chart places the zenith at its centre and uses radius proportional to zenith distance. North is up and east is left, following a common convention for looking up at a sky map.

This is an **azimuthal equidistant projection**. It preserves angular distance from the centre. It does not preserve every distance or area across the chart. The lower-hemisphere view uses the nadir at its centre with the same stated azimuth orientation. It helps reveal the rest of the sphere; the ground would hide that part of a real sky.

Three reference great circles are drawn:

| Guide | Meaning | Display |
|---|---|---|
| Ecliptic | The selected date's ecliptic plane, projected into the horizon | Gold |
| Celestial equator | The date's equatorial plane | Blue |
| Galactic equator | The galactic coordinate plane transformed from the engine's J2000 basis | Violet |

The galactic guide is a coordinate line, not a photograph or a brightness reconstruction of the Milky Way. The observatory uses **chart light** so you can study stars even in daytime. The landscape panorama fades catalogue stars according to the town's daylight as an artistic visibility treatment. Neither treatment is a calibrated model of sky brightness, extinction, light pollution, eyesight, terrain or weather.

Planet symbols are enlarged. The Moon's icon is a phase diagram: its lit area follows the computed illuminated fraction, with a diagrammatic waxing or waning orientation. Its size and orientation are not a telescope simulation. Rise and set calculations refer to a body's limb and conventional atmospheric refraction, not to the enlarged screen symbol.

## 5. Where the stars come from

The source is **Bright Star Catalogue, 5th Revised Edition**, Hoffleit and Warren, distributed by CDS as **V/50**. The raw catalogue, its column definitions, a pinned IAU naming witness, hashes and the compiler are retained with the project. The generated browser catalogue contains each usable HR entry once. It is about 654 KB before transport compression.

For each entry the game retains its HR number, published designation, right ascension and declination, V magnitude, B−V colour index, right-ascension and declination proper motions, spectral type, and matching names. Blank proper-motion fields remain distinguishable from measured zeros. The display holds an absent component fixed rather than inventing a measurement.

The catalogue coordinates are **FK5 J2000, epoch 2000.0**. The IAU naming witness separately describes ICRS positions; those positions are not substituted into the BSC data. In particular, a proper name may identify one component of a multiple system whose BSC row describes a different combination of light. Name and system designation therefore remain visible together.

For right ascension α and declination δ, the initial unit direction is:

```text
v = (cos δ cos α, cos δ sin α, sin δ)
east  = (−sin α, cos α, 0)
north = (−sin δ cos α, −sin δ sin α, cos δ)
```

The published right-ascension proper motion already includes cos δ. The tangent displacement uses the east and north basis vectors, converts arcseconds per year to radians per year, multiplies by elapsed Julian years, and normalizes the displaced vector. The horizon transformation then includes the engine's precession and nutation.

This is a useful educational proper-motion model. It omits stellar parallax, annual aberration, radial perspective acceleration, binary orbits and variability. It does not resolve all FK5/ICRS frame subtleties into modern high-precision astrometry. The source precision is retained, but many printed decimals are not a claim of equivalent observational accuracy.

The naming table is explicitly the **2022-04-04 witness** used by the original Luma materials. It annotates 333 HR entries in the compilation. Newer IAU naming decisions exist; this edition does not label the older table as the current complete naming authority. Unnamed objects retain their catalogue designations.

The constellation classification uses the bundled Astronomy Engine implementation of the IAU boundary system. The catalogue spans all 88 constellations. The filter classifies catalogue reference directions; it does not draw a universal cultural set of stick figures. Historical asterisms, modern boundary regions, zodiac signs and lunar divisions remain different objects.

## 6. The Solar System and its frames

The engine is **Astronomy Engine 2.1.19**, at the original pinned commit `865d3da7d8112bbc7911238052c6af4aaf877181`. Its MIT-licensed implementation was already preserved inside the original Luma artwork. The source artwork and the extracted engine remain unchanged.

Geocentric longitudes are calculated with `GeoVector(body, time, true)` followed by `Ecliptic`. The resulting longitude and latitude use the true ecliptic and equinox of date. Planetary and solar branches include light-time and aberration. The upstream Moon branch returns its geometric lunar model; that distinction remains part of the export.

Altitude and azimuth use a topocentric equatorial position for the chosen observer, then `Horizon` with conventional refraction. Thus longitude and altitude deliberately have different origins. A position measured from Earth's centre should not silently acquire a topocentric label merely because the same card displays an altitude.

The model treats UTC approximately as UT1, and uses an Espenak–Meeus polynomial to relate UT and TT. The export preserves Julian UT, Julian TT and TT−UT seconds. Future Earth rotation is not known exactly; a polynomial is a model, not an observed future correction.

The displayed motion is a centred longitude difference over ±0.01 day, with circular unwrapping. A negative speed is retrograde. A speed with absolute value below 0.001° per day receives a near-station label. Retrograde describes the apparent geocentric direction of motion, not a physical reversal of a planet's orbit or a claim about a person's prospects.

## 7. The horizon gives the eighth angle

The Codex seal orders **Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Ascendant**. The earlier Atelier used local sidereal angle in the eighth position. This edition repairs that difference. Sidereal angle is still calculated and exported as a useful intermediate value; it is no longer substituted for the Ascendant.

The Ascendant is the eastern intersection of the horizon and ecliptic planes. A vector construction avoids a hidden 180° quadrant error. Transform the local zenith and east directions from equatorial to ecliptic coordinates. If the transformed zenith is z, a horizon/ecliptic intersection direction is `v = (−z_y, z_x, 0)`. Choose its sign so that its dot product with the local east direction is positive. The longitude is obtained with `atan2`.

The Midheaven comes from intersecting the meridian plane with the ecliptic and choosing the upper-meridian direction. It is displayed separately in the cycle view. It does not replace the Ascendant and is not an additional seal cell.

At the geographic poles, a unique diurnal rising direction is unavailable. Other tangential or coincident-plane degeneracies can also prevent a unique Ascendant. The model returns `null`, a reason, and a coordinate mask. The seal leaves that cell empty and the score leaves four timed note slots silent. A missing angle is never converted to a zero-degree longitude or the invalid pair `(0,0)`.

The present whole-sky interface displays ASC and MC. It does not add a house-system selector. The whole-sign and equal-house constructions described in the original Codex can be studied in the retained source artwork; this observatory does not imply implementation of additional house systems.

## 8. Sixteen coordinates, eight angular variables

Each longitude λ is represented by `(cos λ, sin λ)`. Trigonometric functions receive radians. The pair varies continuously across zodiac zero. The unit-circle identity `x² + y² = 1` means the two coordinates carry one angular degree of freedom.

Eight pairs give sixteen ambient coordinates. The family of independently chosen angles is a product of eight circles. When an observer is fixed and time alone changes, an ephemeris traces a one-parameter path through that larger family. None of these statements implies sixteen independent physical dimensions.

| Retained coordinates | Completed pairs | Newly exposed information |
|---|---:|---|
| 1 / 2 | 0 / 1 | Sun cosine / complete Sun longitude |
| 3 / 4 | 1 / 2 | Moon cosine / complete Moon longitude |
| 5 / 6 | 2 / 3 | Mercury cosine / complete Mercury longitude |
| 7 / 8 | 3 / 4 | Venus cosine / complete Venus longitude |
| 9 / 10 | 4 / 5 | Mars cosine / complete Mars longitude |
| 11 / 12 | 5 / 6 | Jupiter cosine / complete Jupiter longitude |
| 13 / 14 | 6 / 7 | Saturn cosine / complete Saturn longitude |
| 15 / 16 | 7 / 8 | Ascendant cosine / complete Ascendant, when defined |

At an odd step, the chart shows the retained cosine and two possible locations on the circle. At a cosine extremum the two possibilities coincide. At an even step, the sine selects the orientation. The underlying complete chart stays intact when the slider changes its projection.

Luma's original letters also have sixteen articulatory feature coordinates. Those features belong to the language's drawing system. They are not the eight celestial angles under a new name. The original feature curves remain available in their own section beneath the workshop. This separation allows the letter sculpture and sky seal to coexist without corrupting either definition.

## 9. The exact inscription

A circle is divided into 400 equal bins. Each bin has width 0.9°. For a normalized longitude:

```text
b = floor(400 λ / 360)
h = floor(b / 20)
u = b mod 20
```

The cell writes `h,u` as two existing Luma base-twenty digits, with a numeric marker. Eight cells use sixteen native digit characters plus eight markers. Cell order gives each pair its role. This is a structured inscription, not an undifferentiated sixteen-digit ordinary integer.

The interval is `[0.9b, 0.9(b+1))`. Its opening boundary belongs to the cell and its closing boundary belongs to the next one. A midpoint reconstruction has at most 0.45° circular quantization error. That bound concerns encoding alone; it does not include ephemeris, observer or input-time uncertainty.

The implementation evaluates the bin with integer arithmetic from the input number's shortest decimal representation. The rational endpoints are exported as numerators over ten. No hidden epsilon nudges a nearby value across a boundary. Tests include all 400 endpoints and their immediate IEEE floating-point neighbours, including wraparound.

The fixed-width native renderer matters. Luma's ordinary numeral renderer correctly canonicalizes leading zeros away. The sky-seal formatter instead retains both characters in each named cell. It changes the presentation contract for this record, not the language's ordinary number grammar.

At the initial town moment the alphabetic cells are:

| Angle | Model longitude | Bin | Luma cell |
|---|---:|---:|---|
| Sun | 169.994237° | 188 | `#wf` |
| Moon | 190.100321° | 211 | `#td` |
| Mercury | 183.459124° | 203 | `#to` |
| Venus | 211.525075° | 235 | `#dk` |
| Mars | 110.742060° | 123 | `#bo` |
| Jupiter | 136.114959° | 151 | `#md` |
| Saturn | 12.938735° | 14 | `#al` |
| Ascendant | 346.501011° | 385 | `#yp` |

The first digit of Saturn's cell is the zero-valued letter `a`. It remains present in both native writing and sound. The six displayed decimal places above reproduce a rounded model value; they do not establish six-decimal-place accuracy.

## 10. How the sky becomes music

The retained alphabet is `aeioupbmfwtdnslkghry`. Every letter has its existing index q from zero through nineteen. Split that index into `q = 5f + u`. Play the ratio at index f, then the ratio at index u, from:

| Ratio index | Ratio | Frequency at the retained 220 Hz reference |
|---:|---:|---:|
| 0 | 1 | 220 Hz |
| 1 | 9/8 | 247.5 Hz |
| 2 | 5/4 | 275 Hz |
| 3 | 3/2 | 330 Hz |
| 4 | 5/3 | 366.666… Hz |

Each digit therefore produces two ordered notes. Two digits per angle give four notes; eight angles give thirty-two. The seal player uses 0.24 seconds between note onsets, a soft sine tone and an explicit play/stop control. It starts only after an action requesting sound. Missing angles retain their timing as silence.

The workshop uses the same letter-to-note code for its stage words at the existing 750-millisecond beat interval, or 80 beats per minute. The seal sequence and workshop rhythm have different declared timing because they serve different activities. Their pitch alphabet is unchanged.

Positive additive gematria is still G = q + 1 per letter. It is not the same as the base-twenty place value of a seal cell. The reversible Unicode transport integers in the original language are different again. A compact seal intentionally loses angular precision; it is not a reversible full chart or a measure of a person's worth.

Quoted names such as “Mercury” remain attributed names rather than newly invented Luma phonemes. The sound comes from the written Luma digits or a chosen existing word. A planet does not supply a unique human vowel spectrum, and a number in the score does not establish a healing effect.

## 11. Several circles can describe one direction

The letter ring divides the ecliptic into twenty authored sectors of 18°. The sign ring has twelve sectors of 30°. A uniform common refinement has sixty ticks of 6°: three ticks per letter sector and five per sign. The width ratio `30/18 = 5/3` equals one of the retained musical ratios. This is an explicit compositional relation with visible premises.

The union of the original letter and sign boundary sets would have only 28 boundaries and unequal spacings. Sixty is the answer to a different, stated question: the smallest **uniform** grid compatible with both divisions. A useful game should let a learner see why a number appears rather than present it as a concealed decree.

The modern equal-sector lunar ring has twenty-seven divisions. One circle contains 21,600 arcminutes; each division contains 800 and each quarter 200. Twelve 30° signs contain nine quarters each, while twenty-seven lunar divisions contain four each:

```text
12 × 9 = 27 × 4 = 108
```

The tropical study labels these as equal lunar divisions. Selecting the explicit custom offset allows the modern Aśvinī-first names to be displayed with that convention identified. The offset is fixed for the displayed chart. It is not a computed Lahiri, Raman or other named ayanāṃśa. It does not gain such a name by being close to a rounded contemporary value.

The 27 names follow the order documented in the supplied Codex, pages 24–25. Abhijit is not inserted as a fabricated twenty-eighth equal sector. Historical 28-member arrangements, Chinese xiù, Arabic mansion practices and visible stellar groups need their own source and boundary conventions. The shared English phrase “lunar mansion” does not make their geometries identical.

Likewise, the constellation shown on a body card is a boundary-region classification. The zodiac sign is an equal-longitude sector. The app can display both without treating a 30° sign as the outline of a visible constellation.

## 12. Lunar relation, illumination and nodes

The instantaneous elongation is `E = wrap(λ_Moon − λ_Sun)` using the same longitudes displayed in the chart. The tithi is `1 + floor(E/12)`, from one through thirty. The first fifteen belong to the waxing half and the second fifteen to the waning half. Each tithi covers twelve degrees, not a fixed twenty-four clock hours.

Subtracting the same origin offset from Moon and Sun leaves their difference unchanged. Tithi therefore stays invariant when the longitude origin changes. The yoga construction uses a sum and changes by twice the offset. The software keeps these two kinds of relationship distinct. An instantaneous index is not a complete regional festival-date calculation.

The illuminated fraction comes from the engine's Sun–Moon–observer geometry. It need not equal `(1 − cos E)/2` based solely on ecliptic elongation. Lunar latitude and the relevant distances matter. This edition replaces the earlier Atelier's elongation-only brightness approximation with the actual model illumination result.

The ascending and descending node directions are calculated from the Moon's instantaneous geocentric position and velocity. Their cross product determines the osculating orbital plane; its intersection with the date's ecliptic supplies opposite node directions. They are labelled **osculating tropical longitudes** even when a separate ring uses a custom offset.

The upcoming-node event uses the upstream lunar latitude-zero search. A node crossing alone is not an eclipse prediction: alignment with the Sun and the relevant shadow geometry also matter. Rāhu and Ketu can be studied as sourced historical annotations, but this interface does not render them as two extra solid planets.

## 13. Seasons, events and unequal hours

The seasonal ring uses twenty-four solar terms at successive 15° tropical longitudes. Traditional Chinese names remain visible with pinyin and a brief English gloss. These names carry a historical climatic setting; “snow” and “heat” are not global weather forecasts for every player location. The equal-angle rule and term ordering follow the Hong Kong Observatory's presentation.

The event list includes the next sunrise, sunset, moonrise and moonset within a bounded two-day search; the next four principal lunar phases; the next solar-term crossing; and the next lunar-node crossing. Missing horizon events remain unavailable. Polar night and midnight sun are not patched with a fictional six-o'clock sunrise.

Principal lunar events are refined to the chart's own Moon-minus-Sun convention. The upstream phase helper uses a slightly different solar correction. Starting from an upstream bracket and refining the displayed subtraction keeps the event and chart consistent. The seasonal crossing is likewise refined to the displayed solar longitude.

Unequal planetary hours begin at the preceding sunrise. Daylight from sunrise to sunset is divided into twelve equal parts; sunset to the following sunrise into twelve more. Their lengths usually differ. The first ruler follows the weekday at sunrise under the explicitly selected UTC convention; subsequent rulers follow Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon.

Before sunrise, the current interval belongs to the previous sunrise's sequence. A valid hour must actually bracket the instant. The local civil-time conventions used by other traditions are not silently substituted. The present display uses a fixed offset of zero minutes and records it.

The ruler can suggest a practice to explore, but it does not make a compulsory decision or give an undisclosed gameplay advantage. Solar altitude, lunar illumination and classical aspects already have their own bounded workshop rules.

## 14. The grammar carries the interpretation

Luma retains its twenty phonemes, native characters, 180 roots and 900 dictionary forms. This sky edition does not add arbitrary letters to make the alphabet match a different historical inventory. It extends what can be composed with the language already delivered.

| Form | Kind of statement | Role in a sky encounter |
|---|---|---|
| `e` | Inference or model-based statement | A calculated position with its model and instant |
| `i` | Imagination | A disclosed analogy or possible creation |
| `u` | Intention | The notebook's selected direction for a future act |
| `a` | Experiential access | The speaker's own awe or experience |
| `pe` | Undertaking by the speaker | An executable workshop command that spends specified materials |
| `he` | Expressive remainder | Acknowledgment that an expression has not exhausted an experience |

The notebook stores intentions with `u`. Keeping a sky neither completes a creation nor spends ingredients. Beginning a workshop recipe with `pe` is an actual action within the game's established bounded grammar. Changing a recipe sentence to imagination or intention records a reading or possibility without reserving materials.

Seven practices follow the authored selections in the supplied Codex, pages 48 and 52–53:

| Lens | Existing word | Intention in Luma | Creative direction |
|---|---|---|---|
| Sun | `liha`, light | `u mi me wedi ta pela.` | Attend to what becomes visible |
| Moon | `yema`, memory | `u mi me yemi ta mela.` | Remember care |
| Mercury | `lina`, learning | `u mi me lini ta pela.` | Learn about creation |
| Venus | `mela`, care | `u mi me peli melu ta pela.` | Create with care |
| Mars | `rema`, repair | `u mi me remi ta pela.` | Repair the creation |
| Jupiter | `dona`, gift | `u mi me doni ta dona li ti.` | Give to the actual addressee |
| Saturn | `pelama`, commitment | `u mi me pelami ta [mi me meli ta pela].` | Sustain care for a creation |

These are original constructive practices drawing on historical planetary themes. They are not a translation of every ancient signification. `mela` continues to mean care outside a Venus reflection. The recipient in the Jupiter sentence is the person addressed; do not silently conscript an absent person into a relation. A speaker's reported experience does not claim access to somebody else's inner life.

## 15. How the town responds

The sky's gameplay effects remain modest, explicit and shared between the local and hosted authority code. They do not grant stock, ownership or permission. The recipe inputs still come from the player's inventory, and a player must reach the appropriate worksite.

| Work | Inputs | Processes | Existing material consequence |
|---|---|---|---|
| Star-iron | 2 ore, 1 wood | Calcine, shape, temper | A stronger local melee weapon; quicker shared gathering |
| Singing alloy | 2 ore, 1 crystal, 2 wood | Fuse, harmonize, anneal | A town bell that helps physical delivery and gathering |
| Moon dew | 2 herb, 1 food | Dissolve, distill, coalesce | Local restoration or a temporary shared gathering refresh |
| Earth tincture | 2 herb, 1 stone | Grind, circulate, settle | Faster local biological progress or quicker shared gathering |

Daylight is the clamped factor `(solarAltitude + 10)/35`. Metal stages receive `round(8 × daylight)`. Alchemical stages receive `round(8 × illuminatedFraction)`. The strongest qualifying classical aspect supplies up to four more grade points. This quality interpretation is an authored game rule, not a statement about actual furnace metallurgy or spiritual transmutation.

Classical aspects are calculated among the seven classical bodies. Their longitude targets are 0°, 60°, 90°, 120° and 180°, with an explicitly retained maximum residual of 6°. The strongest is the one with smallest residual. Outer planets are calculated for study but do not silently expand the existing crafting bonus system.

Each stage begins with 58 points. Steady work adds eight rhythm points without timed input. Rhythm work can earn up to eighteen, based on the accepted beat accuracies. The stage then adds its solar or lunar bonus, aspect bonus, and cooling component. Before the last stage the cooling component is eight; the final stage earns eight for the recipe's preferred method and zero for the other method. The total is capped at 100, although the current component maxima sum to 96.

Water favours Star-iron and Moon dew; air favours Singing alloy and Earth tincture. Cooling is fixed once the final stage begins. Every accepted beat, input cost, timing window and action remains governed by the current game rules. There is no requirement to wait for an ideal sky: steady work remains possible throughout the cycle.

Completed work now retains its beginning and finishing sky records and the available evidence for every stage: time, quality components, solar altitude, lunar illumination and selected aspect. A work begun in an older release can have an explicitly absent beginning record or absent earlier stage evidence. Those gaps are not retrospectively filled with invented certainty.

Applying a work retains its existing effects and custody accounting. Furnace wood remains consumed when metal work is reclaimed. Installed bell or garden improvements cannot also remain as owned inventory. Equal or lower quality replacements are refused. The sky itself does not create resources, bypass a crossing, forgive a cost, alter a recovery key or transfer somebody else's creation.

## 16. The alchemical circulation

The supplied Codex treats circulation as a compositional method: experience, tentative expression, pattern, concrete act, observed consequence and revision. The notebook gives that return a place in the playable world. An attractive final seal does not by itself answer whether a creation became clearer or kinder; a later reflection can address that question.

Ripley's twelve-gate order, as documented in the Codex from the 1591 printed contents, offers a longer optional reflection. The workshop's short process sequences remain their own authored game recipes; they are not advertised as a literal laboratory reconstruction of all twelve gates.

| Gate | A practical question for this encounter |
|---|---|
| Calcination | What assumption should be examined before it hardens into form? |
| Dissolution | Which attachment to an earlier form can I reconsider? |
| Separation | Which part serves the purpose, and which part needs another place? |
| Conjunction | What can meet while each contribution remains recognizable? |
| Putrefaction | Which exhausted form can end without discarding what it taught? |
| Congelation | What can now become a coherent and usable form? |
| Cibation | What does this work need to continue, and who can freely offer it? |
| Sublimation | What does another scale or perspective make visible? |
| Fermentation | What needs time, rest or another person's contribution? |
| Exaltation | Which quality deserves emphasis because it serves the whole? |
| Multiplication | What can be shared while keeping its source and obligations visible? |
| Projection | How can the finished form meet the world and remain open to response? |

The wording and constructive use are Luma's authored reflection, following the supplied practice atlas on pages 54–56. Historical operation names provide a source vocabulary. They do not prove that a visual loop, a chant or a simulated bath performs an actual chemical or supernatural transformation.

## 17. What an export preserves

**Export this sky & score** writes a JSON record containing the selected chart context, UTC, observer, model and pinned commit, frames, origin offset, time-scale values, eight ordered unquantized angles, sixteen coordinates and absence mask, seal cells, exact rational bin boundaries, all ten body records, cycle indices, node model, event list, planetary hour convention, star-catalogue provenance, display choices, score timing, notebook and completed-work records.

If a catalogue star is selected, the export includes its HR identity, published reference coordinates and motions, magnitude, colour index, spectral type, constellation and calculated horizon position. It does not pretend the screen coordinates are the original astrometric data.

The written seal is intentionally lossy. The accompanying values allow it to be regenerated without trying to recover a precise chart from two digits. The catalogue manifest and source hashes make the data revision identifiable. A local export is a record of the model and session, not a signed certificate of observational truth.

## 18. Persistence and shared authority

Old local saves remain readable. The existing workshop schema accepts the new typed optional provenance and notebook fields while retaining the exact legacy field set for older work. No account reset, world reset or SQL table migration is needed for this extension.

In the Commons, the authenticated owning session can keep or reflect on its own encounter. These personal notebook operations are not new grantable agent scopes. The request names a practice or an existing observation plus reflection text. It cannot submit its own sky, grade, timestamp, observer, ownership or invented material cost.

The existing command envelope, expected revision, exact-retry receipt and D1 atomic commit rules continue to apply. Concurrent commands do not bypass the state revision. Exact retries replay their existing result. Reflections and action links are retained in that player's workshop record. Other players' personal notebook text is not added to the public town event feed.

Local automatic saving continues to follow the game's existing single-tab save lease. Where Web Locks are unavailable, use the World Journal export/import flow. The shared realm remains distinct from the device world; local materials cannot be imported into shared custody.

## 19. How to test the relationships yourself

Try these as short explorations before judging the whole experience:

1. **A full sphere.** Find a northern star, then switch to latitude −38°. Its horizon position should change. Use the lower hemisphere to locate something the ground hides.
2. **A changing origin.** Hold the study date and location, then select the custom offset. Planetary altitude and azimuth should stay fixed. Sector labels and seal cells may change; tithi must remain the same.
3. **Missing information.** Hold three sky coordinates. The Moon has only a cosine. Add the fourth and see its orientation become determined. At a geographic pole, the Ascendant cell stays absent at every slider position.
4. **An exact address.** Inspect a native seal cell with a leading zero. It must still contain two digit glyphs. Its four notes follow the same two-note code as any other Luma letters.
5. **An event with a reason.** Explore a quarter-phase event and inspect the Moon-minus-Sun elongation. It should be near the corresponding multiple of 90° under the displayed convention.
6. **A chosen act.** Keep a repair intention, make a concrete improvement, and return to record its consequences. A favourable sky does not replace the affected person's response.
7. **A durable creation.** Begin a work, save or reconnect, finish it, and inspect the recorded quality and provenance. Material custody must remain balanced throughout.

Automated verification checks source coverage, exact bin boundaries, coordinate masks, horizon geometry, reference planetary values, event residuals, origin invariance, old-save compatibility, notebook persistence, native cell width and shipped UI handlers. Canvas and audio are mocked in the DOM tests. These checks do not establish human chant intelligibility, visual comfort, mobile usability or a participant's experience of awe. The release audit identifies the actual verification performed.

The independent Swiss Ephemeris comparison covers 70 body/date cases from 1800 through 2200 and 168 Ascendant/Midheaven cases across northern and southern latitudes. The largest longitude difference is 2.356 arcminutes at the same stated UT, and 0.581 arcminute when TT is matched. The largest Ascendant difference is 3.828 arcseconds and Midheaven difference 1.911 arcseconds. These are sampled comparisons of mathematical models, not measurements of absolute truth. The raw numeric results and time conventions are retained in `docs/audit/sky/swiss-comparison.json`.

## 20. Sources and the scope of this edition

The **supplied Luma Origin / Celestial Codex, Prefinal 3.4**, provides the conceptual and language contracts used here. Relevant locations are pages 18–19 for alchemical circulation and gates; pages 23–29 for origins, equal lunar divisions and naming distinctions; pages 36–46 for the eight-angle embedding and seal; and pages 47–60 for the composition register and practices. The original interactive artwork remains accessible in the game's Luma materials.

New catalogue retrieval in this edition is documented separately from the Codex's historical access statements:

- [CDS V/50 catalogue distribution and column definitions](https://cdsarc.cds.unistra.fr/ftp/V/50/) — Yale Bright Star Catalogue data, missing-value rules and proper-motion convention.
- [NOIRLab/Kitt Peak's Bright Star Catalogue presentation](https://www-kpno.kpno.noirlab.edu/Info/Caches/Catalogs/BSC5/bsc5.html) — institutional context for the 9,110-entry source catalogue.
- [IAU working-group naming witness, 2022-04-04](https://www.pas.rochester.edu/~emamajek/WGSN/IAU-CSN.txt) — attributed names, identifiers, coordinate notes and reuse statement.
- [IAU announcement of additional names in 2026](https://www.iau.org/IAU/IAU/News/Ann2026/New-Star-Names-2026.aspx) — evidence that the pinned older naming witness is not the latest complete list.
- [Astronomy Engine pinned source](https://github.com/cosinekitty/astronomy/blob/865d3da7d8112bbc7911238052c6af4aaf877181/source/js/astronomy.ts) — model implementation, frames, Moon branch, illumination, transformations, searches and constellation classification.
- [Hong Kong Observatory: the 24 solar terms](https://www.hko.gov.hk/en/gts/time/24solarterms.htm) — modern 15° rule and seasonal ordering.
- [Swiss Ephemeris programming interface](https://www.astro.com/swisseph/swephprg.htm) — independently implemented reference conventions used where identified in the verification record.

“Whole sky” here means coverage around the complete celestial sphere and a coherent set of playable relationships, not an exhaustive inventory of every astronomical object or every culture's interpretation. The current catalogue does not include all faint stars, deep-sky objects, comets, satellites or transient events. The observatory does not reconstruct every historical mansion geometry or implement a complete regional ritual calendar. Those additions should extend the data and declare their conventions without rewriting the existing language or earlier saved artworks.

The aesthetic intention is continuity: the same moment can be a visible sky, a mathematical address, a native inscription, a short score and a context for making something. Its practical consequence remains available for another person to encounter and question.
