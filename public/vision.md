---

## The whole sky · Luma observatory and complete guide

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


---

## Celestial Atelier · stars and living craft

# The Celestial Atelier

The **Whole Sky edition 2** expands this workshop with 9,096 catalogue stars, ten Solar System objects, a Codex-compatible Ascendant seal, event exploration and an encounter notebook. Read [The whole sky, in Luma](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/WHOLE-SKY-LUMA.md) for the complete current sky contract. The recipe and custody rules below remain active.

Open **Cosmos (O)** in the First Orchard, or the **Cosmos** tab in the Living Commons. The original Luma alphabet appears across a moving sky and in an interactive celestial chart. Walk to the Starforge or Moonwell to turn gathered materials into work with a lasting use. This extends the existing game and both save systems.

## First work

1. Open Cosmos. Choose Star-iron, then **Walk to Starforge**. In the local game, reopen Cosmos on arrival. New local characters already carry enough ore and wood for this work. Shared characters gather their own supplies; the communal crossing opens the mineral deposits on the far bank.
2. Read `pe mi me peli ta "Star-iron" ki fama.` Select **Use native writing** to enact the same sentence in the retained script. Quoted recipe names remain quoted foreign names. `bema` still means stone; this release does not invent a Luma word for metal.
3. Choose **Steady** for crafting without timed input, or **Rhythm** to follow the visible lights and optional sound. Begin reserves the exact displayed materials. An imagined or intended sentence spends nothing; the workshop does not automatically fulfill it later.
4. Let calcining finish, shape the work, then temper it. Choose cooling before entering the final stage. The selected cooling is fixed while that stage runs. Continue each process when ready; there is no failure deadline.
5. Keep the finished work and apply it, or reclaim its ingredients. Furnace fuel stays consumed. A completed object records its source word, three quality grades, starting sky and finishing sky.

| Work | Actual inputs | Processes | Local use | Shared use |
|---|---|---|---|---|
| Star-iron | 2 ore, 1 wood | Calcine, shape, temper | +2 melee damage in the orchard and PvE; exhibition PvP is normalized | Gathering is 70 ms quicker |
| Singing alloy | 2 ore, 1 crystal, 2 wood | Fuse, harmonize, anneal | A town bell speeds the physical food courier by up to 20% and reduces the gathering cooldown from 75 to 60 ticks | Everyone gathers up to 120 ms quicker |
| Moon dew | 2 herb, 1 food | Dissolve, distill, coalesce | Restores health and Breath; cannot be wasted when both are full | Gathering is 100 ms quicker for one server minute; an active dose cannot be overwritten |
| Earth tincture | 2 herb, 1 stone | Grind, circulate, settle | Town biological growth makes 25% more progress per active tick, with the same water, fertility and carrying capacity | Everyone gathers up to 60 ms quicker; deposits remain finite |

The bell and garden are installed within reach of the town hearth. In the Commons their donor and quality are public. Equal or lower quality replacements are refused without consuming the work. Individual finished works remain in their creator's workshop; this release does not yet trade finished objects between players.

## A recorded sky and an authored game

The ephemeris is the original MIT-licensed Astronomy Engine 2.1.19 bundle inside `public/luma/origin.html`, extracted with `scripts/extract-luma.py`. The uploaded HTML and retained alphabet, fonts, dictionary and numeral core remain unchanged. The same extraction preserves the artwork's three named ICRS epoch-2000 reference directions: Vega, Deneb and Altair. Its historical source-access statements are retained provenance, not a claim of new catalog retrieval in this upgrade.

The game sky starts at 2026-09-12 18:00 UTC over an authored town at 38° north, 0° east. One game-clock second advances the ephemeris by 120 seconds. Local time advances only during active orchard simulation; the celestial workshop keeps that simulation running. Other local panels, hidden tabs and arenas pause the celestial clock. The shared sky follows server elapsed time, including time while a player is away. A work never advances to its next process or consumes itself without a command.

Ten Solar System objects use geocentric ecliptic positions and topocentric apparent horizons; the seven classical bodies retain the crafting-aspect role. The three named stars use rotated fixed reference directions; proper motion is not modeled. The panorama is a cylindrical sky chart. The Whole Sky edition replaces the decorative star field with the sourced Yale catalogue. Twenty native Luma markers are an authored ecliptic letter ring. The panorama remains a chart, not a telescope image.

Solar altitude and lunar illumination supply modest, disclosed craft-quality bonuses. Close conjunctions, sextiles, squares, trines and oppositions supply another bounded bonus. Material behavior and these correspondences are invented game rules, not a physical claim about alchemy or metallurgy. Furnace and bath temperatures are simplified process models. Water favors Star-iron and Moon dew; air favors Singing alloy and Earth tincture.

All letters keep their source musical spelling: `q = 5f + u` gives two ordered pitches from `[1, 9/8, 5/4, 3/2, 5/3]` at 220 Hz. Workshop scores follow their stage's word at 80 beats per minute. The same stage clock controls notes and strike cues. One strike per beat can improve quality; steady work has no timing requirement. Sound is opt-in and visual cues remain available. The chart retains the original sixteen articulatory features; the sky's separate sixteen coordinates now embed seven body longitudes plus the Ascendant as eight cosine/sine pairs, matching the Codex.

## Persistence and authority

Local snapshots acquire an empty celestial state on migration. Current work, invested ingredients, individual works and installed effects survive saving. All material custody remains in the existing ledger, including unrecoverable furnace fuel. Growth validation accounts for the accelerated first cycle.

The shared JSON schema advances from 3 to 4 without changing SQL tables, character identity, escrow, recovery keys or command history. Node/SQLite and hosted D1 use the same generated action rules. Commands require the authenticated character's own inventory and station reach. Stage times and strike timestamps come from the server. Clients cannot submit a timestamp, grade, ownership claim or custom recipe cost. Exact retries replay one receipt and do not consume materials or allowance again.

External agents may receive any of `cosmos.start`, `cosmos.strike`, `cosmos.advance`, `cosmos.reclaim`, and `cosmos.use` through the existing optional scopes. Permission to begin work spends the owner's recipe inputs. Permission to use work can install a public town improvement. No new scope is selected by default. Revocation and allowance limits continue to apply.

## Verification and remaining work

`tests/cosmos.test.mjs` exercises retained notes and sky coordinates, rhythm/cooling quality, atomic rejection, mid-stage recovery, every local recipe, actual courier and growth effects, a two-player crossing/mineral/forge/town journey, durable shared custody and delegated action bounds. `tests/cosmos-ui.test.mjs` executes the shipped native-script controls and crafting stages through DOM emulation. `tests/hosted-commons.test.mjs` checks migration and crafting across fresh hosted D1 instances. Canvas and audio are mocked in DOM tests; there is no new human playtest, visual browser review, mobile certification or pronunciation study.

This advances audit obligations C04 (material rules), C10 (production), C12 (ecology), C23 (adaptive sound), and C25/C26 (persistence and authority). It does not close the full MMO, broad crafting economy, autonomous social civilization, live language-model characters, broad scientific research corpus, online combat, raids, multiple regions or blockchain settlement. Those obligations remain open in `docs/audit/broader-review.md`.


---

## Play Luma · website guide

# Luma on the game website

The website opens the First Orchard at `/`, with the same game also available at `/play.html`. Select **Luma**, or press **G**, to compose a phrase, inspect its native writing, hear its letter score, and give a known word a form. Existing device saves use the same storage keys and save migration as the reviewed Luma release.

`/shared.html` opens the Living Commons. Its Luma tab records imagination, intention and personal experience, or enacts a funded contribution or offered gift. To try two characters, use separate browser profiles. Each profile still needs access to this private Site. Local Orchard goods do not fund the Commons.

## What changed for hosting

The website now serves the complete Luma release from GitHub commit `7f74d3ee7007e1afdc546274aa0ea476d2f0bcf9`. Before website adaptations, all 314 source files were compared with their Git blob hashes and matched, including the original HTML and both extracted fonts.

The Node SQLite service remains available through `npm run realm`. Sites runs Cloudflare Workers, so `server/hosted-authority.mjs` implements the same HTTP surface over D1. `scripts/build-hosted-rules.mjs` extracts the actual shared validation, Luma resolution, inventory transfers, action dispatch and state view from the Node authority. It changes only the two credential persistence hooks. Every build regenerates that module; the test gate also checks it for drift. The browser and language code use the reviewed release's rules unchanged.

One D1 transaction conditionally advances the stored realm from the revision the caller saw. Its credential changes, arrival record, resource journal and command receipt all use the winning transaction's unique marker. Losing concurrent commands commit none of those records. The stored arrival key yields the same credential after a lost reply; an exact accepted command replays its receipt. Agent allowance and resource movement remain part of the same stored state.

The D1 schema is the generated migration in `drizzle/`. No runtime code creates or alters tables. The hosting manifest selects the logical `DB` binding; Sites supplies the actual database. This creates a distinct online Commons, and does not upload either a private Node database or the browser's local saves. Redeployments keep the same Site and database binding.

The hosted adapter verifies each state's checksum, its schema and resource conservation, the matching journal head, and a replayed receipt's checksum and journal reference. It does not rerun the Node service's complete historical custody reconstruction on every request. Preserve D1 backups and history when maintaining this site. Approximate presence comes from recent actions and the current request, so it is not an exact online-user count.

Same-origin API checks, 16 KiB JSON bodies, credential validation and principal quotas apply at the request boundary. The existing Site audience remains unchanged. Game display names and session keys identify characters; they do not establish a verified human or wallet identity.

## Verification

The complete test suite passes **287 tests**: the previous 279 plus eight hosted-storage groups. The added groups use an isolated real local D1 runtime to check simultaneous arrivals, two characters gathering and building through native Luma, gifts, exactly-once settlement, losing revision races, complete rollback of a failing batch, agent permissions, session renewal, request limits, and damaged-record refusal. Test clocks are controlled; these are automated integration cases, not fresh human playthroughs.

`scripts/check-hosted-build.mjs` separately loads the emitted Worker and its packaged assets in the Cloudflare runtime, applies the migration to an isolated database, and exercises the actual built routes. Its report and the full test output are retained in `docs/audit/luma/website/`. No verification characters, inventories or credentials are inserted into the live database. Browser rendering, touch controls and pronunciation have not received a new visual or human review in this publication.

The transaction design follows Cloudflare's documented [D1 batch transaction behavior](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch). The production deployment remains the publication gate; a successful local build alone is not a live website.


---

## Luma Origin · current game guide

# Luma Origin in Anima Kingdoms

Open **Luma** in the world to make a word into an object, hear its letters, keep an intention, and return to the consequences of an action. The workshop uses the uploaded Luma Origin alphabet, native signs, dictionary, musical code and feature curves. The [original living artwork](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/public/luma/origin.html) remains available in full from the workshop.

The game adds an authored connection between that language and the existing world: making uses materials, care uses food or crystal, a played score can power a crossing, and a gift enters actual custody. The meanings of the source words remain available outside those game actions.

## Make a first word

1. Open **Luma**, choose **Music**, and read `i mi me peli ta musa.` The workshop shows the native spelling, the word's projected form and its construction cost. This mode is imagination; it spends nothing.
2. Select **Intend** to keep `u mi me peli ta musa.` in Memory. The intention waits without reserving or spending materials.
3. Select **Undertake**. The sentence becomes `pe mi me peli ta musa.` Place the preview on clear supported ground within reach. The accepted action creates an instrument using its displayed bill.
4. Choose that instance under **This creation**, then choose **Play the music**: `pe mi me musi ta musa.` Playing spends 40 Breath and schedules the complete word score. The original four-letter word produces eight notes.
5. Revisit **Memory**. The saved undertaking and matching intention show what was accepted. The world still determines whether the resulting object, sound or delivery was useful.

The **Write in native script** control changes unquoted Luma writing while preserving borrowed names inside quotes. **20 letters** shows each original sign, IPA label, feature values and two-note code. **900 words** searches all 180 roots and their five grammatical forms. **Hear the letters** plays the complete written phrase's letter code; it is a musical rendering, not recorded speech.

## What a sentence does

| Form | Source role | Local workshop behavior |
|---|---|---|
| `i` | Imagination | Preview a supported action or form; no world mutation. |
| `u` | Intention | Save a plan; no goods are reserved or spent. |
| `pe` | Speaker's undertaking | Validate and execute one supported action with current reach, supplies and world conditions. |
| `e` | Inference | Read a model or observation of current state. |
| `a` | Experiential access | Present the speaker's own experience; it cannot report someone else's inner state. |
| `he` | Expressive remainder | Preserve the statement that the expression leaves something unsaid. It adds no numerical power. |

`mi` is the speaker; `me` introduces the predicate; `ta` introduces its theme. `melu` means “with care.” An undertaking belongs to its speaker. This local action register does not execute an undertaking on behalf of another person.

A sentence can be valid Luma without naming a game operation. The game rejects unsupported extra roles, time, aspect, conditions and negation rather than silently dropping them. The reconstructed parser preserves the 41 supplied composition witnesses; it is a bounded register, not a claim that the original language's entire grammar has been implemented.

## Words with world consequences

The following routes are new Anima design. Their noun meanings remain the existing Luma dictionary meanings.

| Theme word | Dictionary meaning | Created family or form |
|---|---|---|
| `musa` | music | Instrument |
| `sona` | sound | Instrument |
| `wuna` | living being | Creature |
| `yuna` | joining | Walking span made of five contiguous decks |
| `tula` | shelter | Shelter with solid walls and an ornamental roof |
| `liha` | light | Relic |
| `tapa` | beginning | Trial gate |
| Other existing nouns | Their own dictionary meanings | Bounded structure with a word-derived inscription |

Use `pe mi me peli ta WORD.` to make or `pe mi me bani ta WORD.` to build. The preview derives the same recipe and bill that normal creation uses. No letter value issues free goods or increases the power budget. For the default forms, `musa` costs two wood and two herb, `yuna` five stone, and `wuna` four wood and one herb. The preview remains authoritative if the recipe changes in a later edition.

Instances retain their word, full creation sentence, retained-coordinate count, recipe and investment. Editing a draft does not mutate an earlier instance. Reclamation uses the existing rules for reachable objects, active performances, cargo, wires and occupied walking surfaces. Repairing a Luma creation with `pe mi me remi melu ta pela.` reclaims and rebuilds it atomically with recorded parent lineage; it must pass those same conditions.

## Let a score carry a crossing

Make an instrument near the near-bank bridgehead and a `yuna` span across the river. A practical layout is an instrument at `(-3, -4)` and span centered at `(0, -13)`, with the player standing near `(0, -4)`. Placement and interaction checks still apply.

Choose the instrument under **This creation** and the span under **Join to**. `pe mi me yuni ta pesa.` converts the unoccupied deck into a powered receiver and connects the two endpoints. Accepted pitches come from the instrument's complete source-word code.

Buy one existing crystal at Vey's Exchange. Then `pe mi me meli ta musa.` with the instrument selected consumes that crystal and supplies 24 units of charge. `pe mi me musi ta musa.` plays the eight timed notes of `musa`. Each matching note sends one existing charge along the wire. Travel takes time; the span becomes active when a packet arrives, and each received charge supplies 180 ticks of support.

Walk across while the receiver is active. The receiver retains a clearing state if its last power expires while a body still depends on it. That safety hold is not renewable charge. A quiet instrument still sounds without fuel, but it cannot issue charge that does not exist. The separate original rain-powered bridge and its water commission retain their own conditions.

Both `musa` and `sona` have complete eight-note world scores. The phrase-listening control can play longer passages. Helper-level checks of longer noun codes do not imply that every noun is an instrument or that a longer score was played in the world.

## Care and delivery

A created `wuna` runs the bounded first-match creature rules from the creation system. With the creature selected, `pe mi me meli ta wuna.` consumes one food and gives it 80 energy when eligible. Care does not create food or confer a model-driven mind.

At the council, `pe mi me temi ta mena.` invites four households into the existing settlement simulation. `pe mi me doni ta #u bama li "households".` offers four food to their depot: `#u` is the exact base-twenty quantity four, and `bama` is food. Tavi still must carry that food to household pantries, where meals are consumed over time. An accepted supply undertaking records the transfer into the depot, not a claim that all residents have already eaten.

A matching `u` sentence can be recorded first. Memory marks the intention when its corresponding undertaking is accepted; that label is narrower than completing every downstream consequence. Release an obsolete local intention from Memory when you choose to let it go.

## The same language in the shared commons

The shared realm has a separate authoritative state and material ledger. Its Luma composer binds a sentence to a named public work or recipient and to an explicit item and quantity. It records Latin and native writing with the actual result. A local pack or created instance is not silently uploaded into that realm.

- `i`, `u` and `e` can record a possibility, intention or model check without enacting the bound transfer. An own-experience sentence such as `a mi me honi ta loma he.` records its speaker's experience.
- `pe mi me bani ta bana.` with a public-work binding contributes only the chosen quantity the authenticated participant holds and the project still needs.
- `pe mi me doni ta dona li ti.` with a recipient binding puts an offered gift into escrow. The recipient can welcome or decline it, and the sender can withdraw it while open. Welcoming transfers the escrow once; declining or withdrawing returns it to the sender.
- An invited agent needs the Luma scope and the underlying action scope. It uses one command allowance for the accepted undertaking. Replaying the exact accepted command does not spend a second allowance or transfer a second gift.

The shared UI offers only the operations it can bind clearly. The authority also has a bounded blueprint-publication route. Publishing a recipe does not instantiate its geometry in the shared world. See [the shared realm contract](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/SHARED-REALM.md) for identity, permissions, escrow, history and persistence limits.

## Letter, number, sound and form

The source alphabet is:

```text
a e i o u p b m f w t d n s l k g h r y
```

Each letter has an ordinal `q` from 0 to 19 and a positive additive value `G = q + 1`. Positional quantities use base twenty. Gematria sums positive letter values; it does not preserve a spelling uniquely. The full Unicode transport code and the celestial two-digit bins are separate encodings.

For the two-note letter code, write `q = 5f + u`. The ratio sequence is `[1, 9/8, 5/4, 3/2, 5/3]`; play ratio `f` followed by ratio `u`, using 220 Hz as the source's reference convention. For `mela`, the source values are `7, 1, 14, 0`; its eight ratios are `9/8, 5/4, 1, 9/8, 5/4, 5/3, 1, 1`, and its positive sum is 26. A shared sum does not make `mela` and `lema` the same word.

The visible form uses the source's 16 declared letter-feature coordinates, 193 samples per curve, first-`d` mask and original sequence of planar rotations. Retaining more coordinates exposes more source data but does not guarantee a visibly different projected curve at each slider step. The projection can overlap and lose information. These coordinates describe an authored representation; they are distinct from the original artwork's eight celestial angles embedded in sixteen cosine/sine coordinates.

The source astronomical engine, cultural studies, seasonal tables, naming witnesses and musical performance models remain in the original artwork. The game does not claim that its new object routing, material costs or action effects are ancient correspondences, astronomical measurements or a test of astrology.

## Review and evidence

The [recovery record](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/luma/recovery.md) explains exactly which original artifacts were recovered and distinguishes earlier lost test reports from fresh checks. The [structural source report](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/luma/source-structure.json) records the artwork hash and layer counts, including all 20 letters, 900 forms, 41 register witnesses, 15 membrane grids and 16 audio records. The reproducible extraction is [scripts/extract-luma.py](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/scripts/extract-luma.py).

The [fresh local play review](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/luma/local-play-review.md) and [complete trace](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/luma/local-journey.json) follow real movement, actual purchases and transfers, timed scores, current-state persistence checkpoints and conserved material/charge accounts. Scripted agent play establishes those observed journeys. Learner comprehension, pronunciation, accessibility across devices and whether someone wants to play again require separate human observation.


---

## Living Commons · current foundation

# Anima Kingdoms — The Living Commons

12 September 2026 · broader-project foundation, development build 0.12

The broader project now has two new working foundations: an inhabited local food economy and a persistent place where independent players can cooperate. These extend the actual First Orchard and First Concord code. The historical honest audit has been reviewed and mapped into a [36-family obligation registry](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/broader-review.md); the larger game and research obligations remain visible.

This release implements the bounded gates below. It does not complete the entire original MMORPG, every research corpus, a language-model society or an onchain economy.

## Play the inhabited First Orchard

Run `pnpm realm` with Node 24 or newer and open `http://127.0.0.1:8787/play.html`. The existing framework command, `pnpm dev`, also runs this local game.

1. Enter the world and open **Life (K)**. Walk to the council and depot, then invite four households. Twelve residents occupy the four existing homes. Invitation supplies no food or money.
2. Transfer food from your pack to the depot and return to the world. Tavi physically picks it up, visits a household doorstep, transfers it into that pantry and returns. The pack, depot, cargo and pantries are separate custodians.
3. Each household eats one shared food lot per 60 active seconds. An empty pantry causes recoverable hunger. The Life panel reports actual meals, shortages, cargo, stock and growth.
4. Weave a Mercy Braid or your own water channels, release two rains and enable automatic rain in Settings. Build a rain garden using four wood and two stone, assign Mira and Fen to food, and enable harvest sharing. Workers bring real food home before it enters the depot; the policy keeps three food in your pack for worker meals.
5. Close the panel to let the simulation run. Renewable wood, food and herb require capacity, routed water, soil fertility and active time. Household and worker meals return compost; slow fallow recovery supplies a declared route back from soil exhaustion. No timer directly awards goods to an inventory.

The material ledger explicitly includes new biological production, delivered food, consumption and cargo. Water has its existing conserved routing and consumption ledger. Growth, compost and fallow rates are bounded game rules, not claims about real ecology. Saving and loading preserves the complete food cycle. Older valid saves receive an inactive civilization schema; the player deliberately opts in.

There are **four households, twelve residents, one food need and one courier**. This is a small working society loop. Immigration, family relationships, housing markets, multiple dietary needs and autonomous social goals are not implemented. Local panels and hidden tabs pause this simulation, and activities do not consume household time.

## Play the shared Commons

Run `pnpm realm` and open `http://127.0.0.1:8787/shared.html`. A second browser profile can join as another principal. The entry page, shared world, work ledger, exchange, people/chat, studio, agents and journal are part of the running browser client.

Start with an empty pack. Walk to a deposit and gather finite material. Offer owned goods for another material, fill another player's funded offer, or contribute to the Joined Span. Eight wood and eight stone open a crossing for everyone. Cross to the far-bank deposits and fund the Concord Beacon. Project rewards move existing Marks from the treasury. The nearby NPC exchange has actual stock, funded buy/sell transactions and explicit prices.

The authority owns positions, items, public construction and trade outcomes. Players send movement direction and specific commands; they cannot submit a replacement world, award themselves inventory or name another acting principal. The browser interpolates presentation while SQLite records accepted state. Human and delegated credentials share the same body's server-timed movement and gathering budget.

The server commits both sides of a trade, the resulting realm, transfer journal, command receipt and agent allowance in one transaction. An offer cannot settle twice. Stable command keys recover an accepted command after a lost response. The browser records a pending envelope before sending it and blocks unrelated commands while the outcome is uncertain. Stale revision rejections permit a refreshed retry; an ambiguous response first retries the original envelope.

Chat contains actual principal-authored text. The Studio publishes a validated immutable Foundry blueprint to a shared shelf, records its publishing principal and lets another player download it for the local Foundry. This circulates designs; it does not turn local creations or balances into shared inventory.

The Agents panel issues explicit scopes, a limited number of accepted actions and an expiry. A real external program can use that bearer credential through the documented HTTP API. Revocation removes its authority. No language model is bundled or represented by a scripted character. See [the service contract](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/SHARED-REALM.md) for all commands and actual limits.

The shared realm is a separate persistent world linked from the local game. Its valley geometry comes from the First Orchard, but it does not synchronize local combat, authored creature instances, water, household society, quests or local saves. Shared deposits are finite. They do not use the new local renewal rules.

## Repairs earned by the audit

- **Guided movement:** guarding, held attacks, committed actions, evasion and airborne movement now interrupt guided travel. The guide no longer bypasses the ordinary combat movement restrictions. Revoking the local connection grant stops the body's queued journey, and that cancellation survives reload.
- **Water stewardship:** newly installed agent channels declare the human as maintainer when created. The human can clear them after revocation, returning salvage only to the agent's fiber account. This repairs future capture of all eight public slots. Unmarked historical channels retain their historical ownership rights; old stranded saves are not silently rewritten.
- **Input integration:** Life opens only in the local world. The K shortcut retains player two's Palm behavior in local duels, and household controls cannot modify a rehearsal or an activity.
- **Courier occupancy:** solid creations cannot be placed through Tavi; a supporting surface cannot be reclaimed beneath the courier, and a powered gate holds open until the courier leaves its footprint.
- **Recovery and custody:** the shared authority checks storage integrity, reconstructs asset custody from its journal, preserves accepted receipts across restart and refuses corrupt storage. The online backup command copies committed WAL state and validates the result before reporting success.

## Current acceptance status

Each row reports an implemented gate within a larger audit family. None means that the whole family is complete.

| Audit families | Gate implemented in this release | Larger requirement retained |
|---|---|---|
| C09, C11, C12 | Funded household food, physical doorstep delivery, actual consumption, bounded renewal and shortage recovery | Broader society, general logistics and ecological interactions |
| C01, C16 | Independent principals, shared movement and projects, finite gathering, atomic player barter and treasury trading | One fully shared game, economic institutions and measured player markets |
| C08, C26 | Authenticated external-agent grants, shared action budgets, expiry, scope and revocation | Live model integration, review workflows and measured human/agent fairness |
| C17, C21 | Prospective public-channel maintenance, shared chat and retrievable Foundry publications | Guilds, shared homes, accepted governance, licensing and factual replay |
| C05, C26 | Combat/guided-travel parity and immediate local journey cancellation | Full combat repertoire and remote competitive combat |
| C25, C26 | SQLite transactions, crash/restart recovery, durable replay and verified online backup | Production deployment, measured capacity, moderation and live operations |
| C27 | Reproducible current tests, pinned scenario evidence and retained unresolved registry | Continued evidence for each subsequent release |

## Verification and its limits

Run `pnpm test` for the complete regression suite and `pnpm build` for the framework build. The final command output and source manifest are retained in `docs/audit/broader/`; the verification report there records exact results.

The household test suite has 20 methods. Its legal 1,000-second journey starts from the ordinary world, uses actual walking, construction and policies, and includes ten successful save/reload checkpoints. It grows **132 new food**, funds **89 food** into the depot, delivers **75 food units**, serves **64 household meals** and **46 worker meals**, and returns **110 compost**. All four households end without hunger or missed meals. All six material residuals and the water residual are zero; total money remains 50. Seventy-five delivered food units is not a claim of 75 courier trips. [Pinned scenario evidence](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/broader/civilization-scenario.json).

The 17 shared-authority tests include two real HTTP clients racing to fill one escrowed offer, full cooperative construction/crossing, agent revocation and budgets, blueprint reuse, service restart and online backup. A child process is actually killed inside an uncommitted trade; reopening retains the pre-trade owners and a retry settles once. Corruption and inconsistent custody histories are rejected. These are executable API and persistence observations.

Nine [DOM and real-HTTP integration journeys](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/broader/shared-ui-review.md) exercise joining, legal gathering, player and NPC exchange, recovery, agent grants and blueprint publication/export. They reproduced and repaired draft loss during polling, hidden uncertain-command recovery and stale responses overwriting a recovered identity. Six transport methods separately cover exact retry behavior and storage failures.

Local invited-agent probes complete the existing connected score–crossing–courier journey through nine authorized commands and six custody checkpoints, with two delivered stone, one funded reward and balanced ledgers. Separate regressions preserve the repaired travel and water-maintenance behavior. Counts from targeted runs overlap the full suite and must not be added to its total.

The available remote browser could not reach the local preview (`ERR_BLOCKED_BY_CLIENT`). No successful new browser playthrough, rendered screenshot inspection, touch-device observation or human enjoyment test is claimed. DOM/event tests emulate the interface and replace the renderer; they establish control and request behavior, not WebGL correctness, layout quality or accessibility conformance. The historical published release's browser evidence does not verify these new screens. C24 remains open.

## Run, preserve and extend this foundation

The service defaults to loopback port 8787 and `data/shared-realm.sqlite`. Keep its database and recovery keys. A lost or expired owner token currently has no account recovery route; creating another name creates another empty principal. The service has explicit finite limits and unpruned durable history. These bounds are not a measured concurrency or capacity claim.

`node server/backup.mjs ./data/shared-realm.sqlite ./backups/realm.sqlite` creates and validates a new backup. Public hosting requires the Node authority behind the configured HTTPS origin, operational storage and the responsibilities documented in the service guide. A static framework deployment alone does not provide the API. This change does not publish a new website.

The next architectural gate is to put one existing authored creation and one gameplay outcome under this same authority, with reconnect and ownership preserved. Remote combat needs its own latency and match-lifecycle design. Broader regions, warfare, additional games, complete worldcraft disciplines, richer art and sound, observed human usability, all nine research families and wallet/onchain integration remain separate open obligations in the registry.

Source additions: `public/civilization.js` and `civilization-view.js` implement the local cycle; `server/authority.mjs` and `index.mjs` implement shared rules and HTTP; `public/shared-rules.js`, `shared-transport.js`, `shared-client.js` and `shared-view.js` connect the rendered client to accepted server state. The existing canvas and 3D local renderers display the household and courier state. Historical source, artwork, archives and audits are preserved in the repository.


---

## Shared realm · authoritative contract

# The shared commons

The published Sites version also provides this commons through a D1 adapter. See [Luma on the game website](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/HOSTED-LUMA.md) for its storage and verification boundaries. The SQLite service and its operational instructions below remain the standalone Node implementation.

This release adds a running, durable multiplayer commons to Anima Kingdoms. Two independent clients can move through the same valley, gather finite materials, exchange escrowed goods, contribute to shared construction, speak, share Foundry designs and authorize external command agents. SQLite determines identities, positions, inventory and settlement. Browser state cannot award items.

The shared commons is a separate authoritative place linked from the First Orchard. The existing local combat, crafted instances, couriers, civilization and saves remain the local game. They are not silently uploaded into this economy. A published Foundry blueprint is a reusable design, not an instantiated shared creature or a minted asset.

## Run

Node 24 is the validated runtime. The service and tests use built-in Node modules; no third-party server package is required.

```sh
PORT=8787 REALM_DB=./data/shared-realm.sqlite node server/index.mjs
```

Open `http://127.0.0.1:8787/shared.html`. A second browser profile can create another principal. The default interface listens on loopback only. `/play.html` serves the original local game; `/` opens the commons.

The database directory is created with private permissions, and the database is mode `0600`. Keep that directory outside the served `public/` tree and outside source control. Preserve the database and its backup: it contains the realm, session credentials, grant-secret material, replay receipts and transfer history. Changing `REALM_DB` selects another realm; it does not migrate the old one.

A non-loopback bind requires `PUBLIC_ORIGIN`. For a public service, configure `PUBLIC_ORIGIN` to the actual HTTPS origin and serve the Node process through that origin. `HOST` may explicitly select another bind address. The service checks browser Origin, Fetch Metadata and Host and does not expose cross-origin API permissions. HTTPS termination, uptime, capacity, abuse operations and secure operator access remain deployment responsibilities. Static-only hosting does not run this Node authority.

## What players can actually complete

1. Arrive with an empty inventory and walk to the nearby wood or stone deposit. Each successful gather transfers one existing unit from that deposit to the authenticated principal.
2. Offer owned goods for another material or Marks. The offered goods immediately leave the seller's pack and enter escrow. Another funded principal can fill the offer, or the seller can cancel an open offer.
3. Carry eight wood and eight stone to **The Joined Span** at `(0, -3)`. Contributions from different principals accumulate in the same project. Completion opens the original valley crossing for everyone. Contributions pay two Marks per material while the treasury can fund the reward.
4. Cross the river and gather ore and crystal on the far bank. The second shared project, **The Concord Beacon**, accepts six wood, four stone, two ore and two crystal at `(0, -28)`. Its completion is shared project progress; it does not claim to simulate local beacon combat effects.
5. Use the finite commons exchange near `(6, 20)`. Its bid/ask prices, material stock and remaining treasury Marks are visible. Players also set their own barter terms independently of that exchange.
6. Publish a valid exported Foundry blueprint to the shared shelf. Other principals can retrieve the same immutable design and import it into their local Foundry. Removal is restricted to its publishing principal or an explicitly scoped delegate.

Names are pseudonymous display labels. They are not verified people, unique usernames or wallet identities. Multiple newly created sessions receive no goods or Marks, so repeated signup is not a funding faucet.

## HTTP contract

Every write accepts `application/json`; request bodies are limited to 16 KiB. Browser API calls use the same origin. Except for health and session creation, use `Authorization: Bearer TOKEN`.

| Endpoint | Input | Result |
|---|---|---|
| `GET /api/health` | None | Readiness, rules version and revision |
| `POST /api/session` | `{ "name": "Ash", "key": "a-random-arrival-key" }` | `{ token, playerId, expiresAt, replayed, state }` |
| `GET /api/state` | Bearer credential | Authorized current state view |
| `POST /api/command` | Exact envelope below | `{ receipt, state }` |

```json
{
  "key": "client-unique-command-0001",
  "expectedRevision": 42,
  "op": "gather",
  "payload": { "nodeId": "grove" }
}
```

The server derives the acting principal from the bearer credential. A payload cannot select another player, claim an inventory, supply movement time or replace the world. Unknown envelope or operation fields are rejected.

The receipt contains `{key, op, revision, result, replayed}`. Errors contain `{error:{code,message}, revision}` where the revision is readable. `REVISION_CONFLICT` is HTTP 409 and commits nothing. A client refreshes and submits an intentional command against the new revision. If a response was lost, retry the **exact original envelope first**: changing its revision or payload is not a retry of its accepted bytes. Accepted keys are retained in durable storage, scoped to the authenticated credential; a different command under the same key fails with `KEY_COLLISION`.

| Operation | Exact payload | Rule |
|---|---|---|
| `move` | `{dx,dz}` | Each axis in `[-1,1]`; normalized speed, server time and terrain |
| `gather` | `{nodeId}` | Within 3 units; one unit per 900 ms; finite stock |
| `offer.create` | `{give:{item,quantity},want:{item,quantity}}` | Distinct existing assets; seller escrow funded immediately |
| `offer.fill` | `{offerId}` | Funded other principal; atomic bilateral settlement |
| `offer.cancel` | `{offerId}` | Open offer belonging to acting principal; escrow returned once |
| `project.contribute` | `{projectId,item,quantity}` | Within 6 units; owned material; no overfunding |
| `market.buy` | `{item,quantity}` | Within 6 units; both parties funded |
| `market.sell` | `{item,quantity}` | Within 6 units; both parties funded |
| `chat.send` | `{text}` | 1–280 plain-text characters; principal-wide 1-second cooldown |
| `blueprint.publish` | `{blueprint}` | Existing `Creation.compile` must accept the complete design |
| `blueprint.remove` | `{publicationId}` | Publishing principal only, including explicitly scoped delegates |
| `agent.create` | `{name,scopes,allowance,expiresInSeconds}` | Owner credential; 1–1000 accepted actions; 60–86400 seconds |
| `agent.revoke` | `{agentId}` | Grant owner's credential only |
| `session.renew` | `{}` | Valid owner credential; extends that same credential another 30 days |

Items are `wood`, `stone`, `ore`, `food`, `herb`, `crystal`, and `marks`. Offer quantities are whole units from 1 to 10,000; market/project commands accept 1 to 100 units and still require real stock and unmet requirements.

The state view contains `rulesVersion`, `realmId`, `revision`, `serverTime`, `you`, `world`, `players`, `nodes`, `offers`, `projects`, `treasury`, `market`, `totals`, `ledger`, `chat`, `events`, `agents`, `blueprints`, `gifts` and `luma`. `you.inventory` is the principal's actual holdings. Other player entries expose display name, position and approximate recent online presence; they do not expose the other player's private inventory or bearer secrets. Owners see their own grants. Agent views identify their scope and remaining allowance.

Shelf entries are `{id,authorId,authorName,blueprint,publishedAt}`. The server generates publication IDs and copies the compiled design. Publication does not import local resource balances or create shared material instances. There are at most eight active designs per principal and 64 in the realm.

## Custody, movement and recovery

The genesis supply is **160 wood, 140 stone, 50 ore, 100 food, 60 herb, 30 crystal and 500 Marks**. Materials begin in resource deposits; Marks begin in the shared treasury. Creating a principal issues nothing.

For every asset:

```text
genesis = deposits + player packs + treasury + open escrow + public construction
```

The exact residual is exposed in `state.ledger.residual`. Every successful command executes inside one SQLite `BEGIN IMMEDIATE` transaction. Both legs of an exchange, the new state, its command receipt, grant allowance and transfer journal commit together. A failed command rolls all of those changes back. Concurrent fillers cannot both acquire the same escrow. The SQLite WAL uses `synchronous=FULL`.

The append-only command journal hashes each entry and records every material/Marks custody transfer. Startup verifies SQLite integrity, realm checksum, state bounds, the complete journal chain, replay-receipt checksums and receipt/journal references. It reconstructs all account balances from genesis and requires them to match the current asset owners. Corruption is refused; no fresh treasury or empty replacement realm is silently created. The hash chain detects inconsistent storage, not a malicious operator who can rewrite the complete database and code.

Movement uses the authoritative timestamp stored per principal, normalized intent, speed 7 units/second, at most 250 ms of elapsed movement per request, and small collision substeps. All credentials of one principal share this movement and gathering budget. Client coordinates, client clocks, delayed bursts, diagonal input and extra agent tokens cannot create additional movement time. Terrain uses the existing orchard land geometry; the shared span has its own funded completion state. This is HTTP movement authority with client presentation, not rollback combat netcode.

A saved owner token reconnects to the same principal after connection loss or service restart. Owner credentials last 30 days and can be renewed while valid. A saved random arrival key and its original name can replay a keyed arrival while that owner credential remains valid. There is no email/password recovery route for an expired credential or a lost token and lost arrival key. Possession of a token grants its authority; protect it as a credential. Display names cannot recover someone else's pack. Assets are retained when a player disconnects; they are not transferred to a new signup.

The service retains at most 500 principals, 12 simultaneously open offers per principal, 10,000 lifetime offers, 32 lifetime agent grants per principal, 80 chat messages and 100 recent display events. Durable receipts and the journal are not pruned; monitor disk growth. The shared resource deposits are deliberately finite. The new local civilization system does not regenerate the shared economy.

## Invited external agents

An owner creates a grant with an explicit command-scope list, accepted-action allowance and expiry. Its returned bearer token authenticates as a delegate of that principal; it cannot choose another owner. An accepted action decrements the allowance once. Failed commands and exact accepted-command retries do not spend another action. Revocation prevents further reads and commands, including old-receipt access. Agents cannot create or revoke grants or renew owner credentials.

Available delegated scopes are movement, gathering, player offers, project contributions, market trading, chat, blueprint publication/removal, `luma.speak`, and the four `gift.*` operations. These scopes permit real changes to the owner's holdings; grant only the intended ones. Agent tokens are deterministically recoverable by replaying the owner's exact successful creation command and do not appear in public state views. Owner session credentials are stored as hashes. The operator-held database also contains the server secret used to derive agent tokens and keyed owner-arrival tokens.

This is an authenticated external-agent command interface. A caller may connect its own planner or model. The service does not contain an autonomous LLM, claim model identity verification, or label the game's scripted actors as language-model participants.

## Luma composition and consentful gifts

The Luma extension adds structured statements to the same authoritative command transaction. Local objects and balances remain separate. The [Luma guide](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/LUMA-GAME.md) explains the source language and its local creation routes.

| Operation | Exact payload | Custody or interpretation |
|---|---|---|
| `luma.speak` | `{text,bindings}` | One explicit `i`, `u`, `e`, `a` or `pe` clause, with its full supported binding. |
| `gift.offer` | `{recipientId,give:{item,quantity}}` | Sender's actual asset enters gift escrow; self-gifts reject. |
| `gift.accept` | `{giftId}` | Only the named recipient; escrow transfers once into that recipient's holdings. |
| `gift.decline` | `{giftId}` | Only the named recipient; escrow returns once to its sender. |
| `gift.cancel` | `{giftId}` | Only the sender; withdraw an open gift and recover its escrow. |

A project binding is `{kind:"project",projectId,item,quantity}`. `bani ta bana`, `bani ta pela` or the project's exact quoted name identifies the action. An optional `la` role must match that project name; an optional `ki` role must match the chosen material and any spoken quantity. Project quantities are whole units from 1 to 100, with ordinary reach, stock and remaining-need checks.

A gift binding is `{kind:"gift",recipientId,item,quantity}`. Its verb is `doni` or `mari`; the theme is `dona`, a matching material name, `bama` for food, or `bema` for stone. The `li` recipient is the pronoun `ti` or the recipient's exact quoted name. A spoken quantity must match the binding. Gift quantities are whole units from 1 to 10,000.

A blueprint binding is `{kind:"blueprint",blueprint}` with `peli ta pela`. It publishes the compiler-validated recipe; its calculated build bill is descriptive and no instance is created. The own-experience binding `{kind:"experience"}` accepts `a mi me honi ta loma he.` The speaker's literal `mi` is required throughout. Unsupported extra roles, negation, aspect, time, qualified participants and mixed modes reject rather than disappear.

`pe` enacts the resolved operation in the same transaction. Other supported modes record their statement and readiness against a cloned state: they do not reserve or spend its material bill. Readiness can contain a real reach, stock or capacity blocker. The source text, Latin text, native text, mode, binding and observed result are retained in the latest 80 Luma records. Recording an intention is not accepting a gift on another person's behalf.

Open gift escrow is included in the complete custody journal and its genesis reconstruction. Each sender and each recipient can have at most 12 open gifts. Every open gift is retained; the state also retains the latest 200 closed gifts in settlement order. Closing a previously old open gift makes that new settlement part of the current closed history. Replay receipts and custody journal entries remain durable outside the recent display window.

An invited agent needs `luma.speak` to submit a statement and, for an undertaking, the resolved operation scope as well. A successful undertaking spends one grant allowance, including its nested operation. Failure and exact accepted-command replay spend no additional allowance.

## Arrival and service boundary

The current client saves a random arrival key before requesting a session. Replaying the same key and name after a lost response returns the same still-valid owner credential and principal, with no new goods or new account. Reusing the key for a different name fails with HTTP 409. The authority accepts a random 16–128-character key using letters, digits, period, underscore, colon or hyphen. Older callers can still use the one-field `{name}` contract, which does not provide this replay recovery.

Authenticated requests share a 1,200-per-minute quota per principal across owner and delegated credentials. Unauthenticated arrival requests have a 12-per-minute quota keyed to the socket address. An untrusted forwarded-address header does not change that identity. These are bounded service controls, not a measured concurrency or load capacity claim.

The original `/luma/origin.html` has a source-specific content-security policy allowing its five exact executable script hashes and embedded font/audio data. This does not authorize arbitrary inline scripts elsewhere. The original HTML itself is preserved byte for byte.

## Back up a running realm

```sh
node server/backup.mjs ./data/shared-realm.sqlite ./backups/realm-2026-09-12.sqlite
```

The CLI uses SQLite's online backup API, including committed WAL data. It refuses to overwrite the destination, then verifies the copied realm, its full custody history and receipts before reporting success. This supports backing up while the service is running. A raw copy of just the main database file while WAL writes are active is not the same operation.

To restore, stop the realm process, retain the previous database, and start with `REALM_DB` pointing to the verified backup. The backup contains credentials as well as holdings; protect it accordingly. Restoring an older backup deliberately restores its earlier world and credential state. Test recovery using a copy before replacing a live service path.

## Earlier baseline evidence and remaining scope

Run:

```sh
node --test tests/shared-authority.test.mjs
```

The retained baseline record reports 17 tests covering complete cooperative gathering/construction/crossing, finite deposit exhaustion, funded barter, treasury buy/sell, forged identity and movement, stale revisions, durable key collisions and replay, agent allowance/scope/revocation/expiry, bounded chat, actual Foundry design reuse and shelf limits, online backup, and corruption refusal. Two actual HTTP clients race for one offer: one settles it and the other receives a revision conflict. A child process is actually killed after mutating the fill inside its transaction and before `COMMIT`; reopening preserves the pre-fill owners, and retry settles exactly once. Restart tests also preserve open escrow and committed fills.

Those tests are reproducible server/API evidence, not browser playtests, human enjoyment studies, load tests or production security certification. They do not establish a complete shared MMORPG. Shared combat, live shared crafted-creature simulation, household society in this authority, matchmaking, production operations, wallet binding and on-chain settlement remain outside this service. The current release's integrated browser and full-project evidence is recorded separately by the main implementation task.

Fresh Luma, gift-custody, arrival-replay and integrated UI evidence is recorded in [the reconstruction audit](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/luma/recovery.md) and its final release verification. The earlier baseline counts above are not the reconstruction total.


---

## Combat and movement · controls

# Combat and movement — September 2026

This release addresses controls that were difficult to aim, combine and understand. It changes the existing playable simulation, its two renderers and the actual keyboard, pointer and touch handlers. It does not introduce a second demonstration combat system.

## Start playing

Open **Controls & practice (H)**, then **Enter combat practice**. The harmless wisp records real hits, damage and which attacks have landed. Practice restores the supplies, health, Breath and combat statistics you brought from the world when you return. It gives no rewards. Breath regenerates faster in practice, explicitly disclosed in the guide.

| Action | Keyboard and mouse | Touch / visible control |
| --- | --- | --- |
| Move | WASD or arrows, relative to the camera | Drag the movement stick; partial deflection walks slowly |
| Run | Hold Shift | Hold Run; keyboard activation of the button toggles it |
| Aim | Point into the world | Tap a visible opponent, or use Target |
| Lock / release target | Tab while the world has focus / X | Target / Release |
| Look | Right-drag | Drag the open world |
| Zoom / center | Wheel / Z | Pinch the open world / Center camera |
| Palm | Press or hold 1; left-click or hold in the world | Press or hold Palm |
| Reach / Note / Gale | 2 / 3 / 4 | Corresponding attack button |
| Evade | R, toward movement or aim when stationary | Evade |
| Guard | Hold C, facing your aim | Hold Guard; keyboard activation of the button toggles it |
| Jump / interact | Space / E | Jump / interaction prompt |
| Attuned relic | T | The existing attuned-power control |

Tab still navigates interface buttons normally. Attack buttons return keyboard focus to the world. Opening a panel, losing focus, changing activity or hiding the tab clears held inputs and pending follow-ups. Numbered attacks use physical digit identity so Shift does not turn them into unrelated punctuation keys.

## Four attacks with different jobs

The table is the normalized base specification, at 60 simulation ticks per second. Outside normalized exhibitions, existing equipment and discipline modifiers still apply.

| Attack | Job | Damage | Breath | Reach | Startup / active / recovery ticks |
| --- | --- | ---: | ---: | ---: | --- |
| Needle Palm | Free, quick close strike; hold to repeat | 6 | 0 | 2.6 m, 1.75 rad arc | 5 / 2 / 11 |
| Tension Reach | Narrow, longer thrust | 14 | 10 | 3.8 m, 1.3 rad arc | 13 / 3 / 19 |
| Glass Note | Aimed projectile stopped by cover | 9 | 12 | 32 m | 11 / 1 / 25 |
| Gale Break | Circular crowd control; radial push on contact | 12 | 30 | 6 m circle | 20 / 3 / 32 |

Base damage, cost and attack timing remain unchanged. Glass Note now travels at 24 m/s, previously 18 m/s, and its final step stops at its declared maximum travel. This makes the projectile faster without silently extending its reach. Palm's free follow-ups no longer postpone Breath regeneration.

An attack commits its aim when accepted. Moving or aiming during its windup cannot rotate an already committed hit into a different direction. Palm has alternating visual strikes; Reach thrusts; Note charges an orb and projects a line; Gale expands into a circular sweep. These cues follow the real attack phases. The visual Palm chain grants no extra damage.

## Input and defensive rules

- A single 12-tick (0.2-second) buffer retains the latest deliberate next action. A press near the end of recovery can begin when legal; an early press expires instead of firing unexpectedly much later.
- Held Palm is a fallback request. It cannot overwrite an explicitly queued special attack. Releasing it removes its uncommitted repeat, while the already committed strike completes.
- Costs are charged once when an action starts, never merely because its button was pressed. Insufficient Breath, queued actions and recovery have visible feedback.
- Evade costs 24 Breath and lasts 36 ticks. Movement is committed for 24 ticks at 9 m/s: 3.6 m of travel before collision constraints. Its existing ten-tick invulnerability window remains limited to the middle of the action.
- Evade may cancel the latter half of attack recovery. It cannot erase startup or an active strike. Direction follows movement even when the character is aiming elsewhere.
- Guard is directional. Blocked or invulnerable contacts do not apply knockback. Gale pushes each successfully struck opponent away from the caster.
- Analog movement preserves magnitude, includes a dead zone and caps diagonal speed. Normal speed is 4.3 m/s, running 6.8 m/s; existing guard, attack and flag-carrier multipliers still apply.
- Target assistance only considers opponents with a visible line of sight. Locking uses the same visibility rule, and the target card reports distance and selected move reach. It does not bypass cover or guarantee a hit.

## Rendering and input architecture

`realm.js` owns action acceptance, movement, contact, cost, guard, immunity and practice isolation. `combat.js` supplies shared input transforms and geometric descriptions. `combat-view.js` renders those descriptions through either camera and updates the visible combat state. Both human handlers and deterministic agent scenarios feed the same simulation input path; local duelists use the same rules.

`visual.js` adds distinct 3D attack poses. `canvas-view.js` supports rotated camera projection, its inverse for aiming, visible arena cover and activity-specific minimaps. `combat-view.js` displays committed attack geometry, guard, evade and damage in both renderers. Boss ring warnings now appear at their real targeted coordinates and radius; phase-three shot warnings show the real spread.

Touch uses pointer capture, cancellation and explicit cleanup. A second world pointer switches to pinch measurement. The movement stick, world look and attack controls remain separate input surfaces. The implementation was informed by the [W3C Pointer Events specification](https://www.w3.org/TR/pointerevents3/) and [MDN's multi-pointer pinch example](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures).

## Verification and limits

The release adds 34 deterministic combat scenarios and three regressions executing the actual registered keyboard handlers. These cover aim commitment, buffer expiry and priority, Shift release order, fractional movement, camera transforms, cover collision, Breath accounting, guard and immunity, radial push, projectile travel, created-relic costs, practice restoration and truthful boss warnings. The full existing suite is retained.

An independent agent used browser buttons and keyboard shortcuts to land all four attacks, cycle and release targets, evade, move, operate the displayed joystick, guard and run, and return to the world with supplies intact. A further compact-layout pass inspected 390 × 844, 320 × 740 and 844 × 390 CSS viewports, found overlaps and corrected them. See [the observed playtest](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/combat/human-control-playtest.md) and [release verification](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/audit/combat/release-verification.md).

These are local simulation and browser checks, not evidence of network PvP latency behavior. The browser available for this review used the canvas fallback. 3D code and shared geometry were checked, but the new WebGL poses were not visually verified on a GPU in this environment. Physical multitouch, pinch on a phone and sustained finger combinations still need device testing; mouse manipulation of a displayed touch control is recorded as such.


---

## First Concord · v0.11 background

# Anima Kingdoms — The First Concord

12 September 2026 · connected-creation release, development build 0.11

This document retains the First Concord contract. The subsequent [Living Commons release](https://github.com/venividis/Anima-Kingdoms/blob/codex/anima-living-commons/docs/BROADER-FOUNDATION.md) adds local households and a separate authenticated shared realm; its current scope and evidence supersede the corresponding future gates below.

The central promise is **imagination that has consequences**. A player can author a score, connect it to a structure, give a creature an actual delivery, and see that delivery change a place. The world already contained expressive parts and bounded behaviors. This release makes several of those creations cooperate through one inspectable, conserved system.

This is a playable local prototype and an engineering foundation. It is not a completed MMORPG, an autonomous language-model society, an exhaustive reconstruction of Blizzard/Nintendo/strategy/fighting/shooter games, or a functioning crypto economy. The historical dossier’s accountability audit and the existing game documentation are retained. No fresh exhaustive game research or empirical human-subject research is claimed for this implementation phase.

## Play the first connection

1. Enter the world, then select **Connect** (N).
2. Walk to Vey’s Exchange. The walk button navigates your real body through collision at ordinary walking speed. Reopen Connect after arrival and buy one crystal at the displayed stock-sensitive price. Its seller, stock and money already exist.
3. Walk to the bridgehead. Reopen Connect and build the connected kit. The guide creates three ordinary, immutable instances: The First Concord instrument, The Listening Span, and Pip, a Lanternwing courier. Their recipes use the same compiler and creation budget as the editor. Kit cost: 10 wood, 3 stone and 1 herb. Nothing is given free by this button.
4. Load one crystal into the instrument. Feed Pip one food. Assign the two-stone hearth request while your body remains at the pickup.
5. Play the score. Close panels to let simulation advance. Notes travel along the wire and charge the walking surface. Pip takes one actual stone from your pack, traverses the crossing, and transfers it to the hearth. The courier returns physically for the next stone.
6. Play again if the return crossing needs power. Two delivered stones become the visible hearth; four previously reserved Marks transfer from the keeper exactly once. There is one finite request, with no repeatable reward faucet.
7. Inspect the event trail. Try a different pitch filter, a permanent deck, or a different authored creature. Editing a recipe does not rewrite an already placed instance. Disconnect before reclaiming connected creations.

The live witness panel tells you what is happening while the world runs. The Connections panel pauses simulation and shows more detailed state. A stalled courier shows its exact pickup address and offers an ordinary walk back to it. It explains its actual blocker: no passable route, missing stone, insufficient energy, or an absent owner at the pickup. The latter prevents a distant creature from silently reaching into your inventory.

## What is especially promising, and why

**Creation can become cooperation.** A useful invention may be a relationship between simple creations: a melody and a span can do something neither does alone. This creates room for engineering, composition, architecture and care to be valuable ways of playing.

**The story has a physical receipt.** “Pip kept a promise” means stone left a pack, occupied its cargo slot, crossed legal ground, arrived, was consumed, and triggered a funded payment. The trace explains a real sequence. It does not manufacture a narrative first and pretend the simulation followed it.

**A failed invention is understandable.** Filter rejection, empty fuel, travel, reception and route transitions have factual events. A player can revise the part that caused a failure. Trace entries carry causal parent IDs; they are not a replacement for inventories or financial custody.

**Human and agent participation can share a contract.** Invited agent commands use the same dispatcher, body, materials, proximity, cooldowns and route solver as the corresponding controls. Revocation invalidates an agent’s old epoch immediately. The distinction is how an intention enters the system, not a free resource or teleport privilege.

**An alternative solution remains valid.** The hearth courier can use a permanent creation deck or a rain-supported route. Musical engineering is an expressive option. An existing permanent bridge does not become power-dependent simply because this new feature ships.

**A small repair in the world can feel like authorship.** The hearth is deliberately modest: its visible change is tied to delivered materials. It establishes a pattern for future community projects without falsely presenting a two-stone object as a civilization simulation.

## The second iteration: reject the easy claims

“Connected” does not mean arbitrary programmable software. The connection vocabulary currently contains instrument sources, pitch-filtered wires, bridge/gate receivers and one courier request. It has no receiver-to-source relays, condition editor, logic loops or arbitrary script execution. Limits are 16 authored instances, 24 wires and 64 mechanical packets.

“Powered” does not mean perfectly realistic energy. A crystal is a discrete game resource with an explicit conversion rate. One loaded crystal creates 24 charge units. Each accepted linked note spends one unit at its source; each receiver charge buys 180 world ticks of an open state. These are tunable design parameters. No experiment here establishes that they are the most fun or economically optimal values.

“Safe closure” currently uses a **safety hold**. On expiry, a structure containing a body or placed creation stays open until its footprint clears. New entrants can still use it during this hold. This prevents ordinary closure from dropping a courier or trapping a player. It can be deliberately held open, so it is unsuitable as a competitive access control or scarce-energy toll mechanism. Actor-specific admission leases remain a future rule change.

“Inspectable causality” means bounded event provenance. Links pin source and receiver blueprint revisions; note events identify source, pitch and note index. Mechanical packet identities persist through saves, while decorative waves may be cleared. The trace retains 120 entries and can refer to older events that are no longer displayed. Courier crossing entries record an actually entered supporting surface over water and its most recent received-note reference. They do not prove that this was the only possible route or that the newest note alone was necessary. There is no persistent performance identity spanning every note in a whole score; receivers filter individual pitches rather than authenticate an ordered melody. Do not market this as melody recognition.

“Same rules” is local gameplay parity, not production security. Browser state and imported saves are controlled by the person running the browser. Local grants and validators are useful product boundaries but cannot secure a hostile multiplayer client. Agent observation exposes the local world state. There is no hidden-information competitive ladder, principal authentication, server authority or proof of agent fairness.

“Durable” means valid local checkpoints and explicit export. On browsers supporting Web Locks, one active game tab owns automatic local saving. If that capability is absent, the UI explicitly disables automatic saving and allows play/export. A rejected old save is preserved and available for recovery export; a new world does not silently overwrite it. Browser/device failure, deleted local storage and remote backup recovery remain outside this guarantee.

“Games inside the game” remains an existing but bounded vocabulary: authored sigil trials, a shooting range, Raincatch, Loom Table, bot capture-the-flag, local two-player duels and PvE encounters. This release connects creation systems; it does not add online tournaments or an unrestricted game editor.

## Whole-game plan: each ambition has an acceptance gate

| Family | Working foundation | Next concrete build gate |
|---|---|---|
| Fantasy, character and combat | Original procedural valley; three disciplines; timed startup/active/recovery; authored relics; PvE boss | Make one ten-minute adventure legible and compelling in observed human sessions; verify animation/contact timing and camera on supported devices |
| Creation | Five blueprint kinds; parts, rules, scores, trials; immutable placement; costs/reclaim; living rehearsals | A person with no instructions can create, test, revise and share a useful design without corrupting a save |
| Connected inventions | Charged sources, filtered wires, bridge/gate collision, factual trace | At least three independently designed useful inventions complete counterfactual tests without resource amplification |
| Creatures and AI | Authored finite rules and cargo; typed invited agent interface | One externally connected agent can propose a bounded creation, obtain review, act, recover from interruption and honor immediate revocation |
| Strategy and civilization | Settlement plots, workers, water, finite supplies and a civic need | Add households consuming real goods and renewing production with measured carrying capacity; close one full production–delivery–consumption cycle |
| Economy and ownership | Stock-sensitive finite NPC trades, conserved Marks, reserved civic payment | Two authenticated principals exchange uniquely held goods atomically under server authority, including concurrent offers and crash recovery |
| PvP and games within games | Bot CTF, local duel, range, pavilions, authored sigil course | Two remote human clients finish a normalized match through reconnect, with one flag custodian and one result |
| Social systems and network effects | Exported recipes, local history, bounded invitation | A small human group maintains one shared invention under explicit edit, repair, ownership and exit rules; measure voluntary return and contribution |
| Crypto | Documentary architecture and local export only | Demonstrate one optional ownership/settlement use that improves player agency relative to an ordinary database; publish costs and failure recovery before issuing assets |
| Art, sound and accessibility | 3D procedural parts and world; same-simulation canvas fallback; timed score audio; HTML controls | Observe keyboard, touch and non-audio completion, then supported-GPU visual QA. Give equivalent functional information in both views |
| Infrastructure and operations | Local deterministic-ish stepping, bounded data, validated checkpoints, source history | Authoritative service, authenticated clients, backups, compatibility tests, crash recovery, telemetry and measured load/cost envelope |
| Deep research | Retained dossier and honest audit; targeted executable experiments | A declared title/version corpus with claim–source mapping and independently reproduced mechanics. “All games, every detail” remains unfulfilled |

The next expansion should earn its complexity by proving a better player experience. A creature society, an economy or a cryptographic protocol is not validated by the volume of its design document. Use measured voluntary engagement, understandable decisions, social reciprocity and recovery from failure as hypotheses to test with people. This release’s automated agents are engineering testers, not substitutes for human research.

## Technical source map

- `public/kingdoms.js`: command envelopes, grants, idempotency receipts, typed wires, packets, finite charge, receiver states, physical civic jobs, import validation.
- `public/creation.js`: blueprint compiler, parts, cost, immutable instances, ordinary creature behavior, score emission, surface/obstacle integration.
- `public/realm.js`: shared world, material ledger, market custody, bounded movement, snapshot migration, command bridge.
- `public/navigation.js`: bounded grid routes with exact segment checks and topology invalidation.
- `public/app.js`, `kingdoms.css`: real buttons, guide, wire controls, witness, agent bench and optional WebMCP tools.
- `public/creation-view.js`, `visual.js`: 3D scene rendering, packets, receiver state and delivered hearth.
- `public/canvas-view.js`: canvas renderer and blueprint preview on devices without WebGL2. It draws live simulation data and has the same commands; it is not a decorative screenshot.
- `app/page.tsx`: supported framework shell containing the playable game at `/play.html`.
- `docs/CREATION-CONTRACT.md`, `WHOLE-GAME-PLAN.md`: retained v0.10 contracts and review, explicitly historical where the new release supersedes them.
- `docs/VERIFICATION-v11.md`: actual automated and browser evidence, failures, repairs and remaining coverage limitations.

## Runtime and custody contracts

The state keeps the v0.10 world profile for migration and adds the versioned `anima-concord-1` connection state. A v0.9 save first receives the established creation migration; an older compatible world then receives a connection state funded only when its keeper has at least four existing Marks. Insufficient legacy keeper funds leave the single request unfunded; no currency is invented.

The six-material ledger still requires zero residual. A crystal moves from pack to spent when converted. A picked-up stone moves from pack to the courier’s single-unit cargo. Delivery moves that stone from cargo to spent. Fulfillment history describes those consumed materials and does not double-count them as separate inventory. Courier feeding consumes food using the established energy system.

Mechanical charge obeys:

`24 × crystals loaded = source charge + in-flight packets + receiver charge + spent charge + dissipated charge`

Every packet carries one unit. Fan-out debits one unit for each accepted wire in stable wire-ID order. Receiver storage is capped at 16; overflow dissipates. Source refueling is capped. Disconnecting destroys only that wire’s in-flight units and records dissipation; reclaiming a disconnected source returns construction investment but not consumed crystal fuel. No feedback relay is implemented.

A command carries world ID, rules version, controller, grant epoch, expected connection revision, unique key, operation and exact payload. It validates before committing a cloned candidate world. Failed commands leave the source world untouched. Repeating an identical retained receipt returns that receipt; reusing its key with different bytes fails. Receipts retain only the last 64 commands, so this is bounded replay protection, not network-wide exactly-once delivery. Imported receipts are internally validated local history, not authenticated evidence that a historical event happened.

The connection clock advances only in the world. Arena time cannot expire a paused powered route. Packets and courier cargo persist in snapshots, unlike decorative effects. Topology changes invalidate navigation caches. Physical movement is bounded even for old saves containing an oversized deck; new placements also validate every rotated physical corner.

## Research and release discipline

Keep the earlier failures. The baseline’s 91 green tests did not catch a legal deck extending beyond the save envelope, a browser without GPU support, or an insecure-context UUID failure. New tests and real clicks found those gaps. A successful build is evidence of a successful build, not a successful game. This release reports each type of evidence separately, including unavailable tests.

The GitHub connector in this session can read and edit accessible repositories but exposes no repository-creation operation. The requested new GitHub repository cannot be honestly reported as created through that interface. The complete named source package and existing Site source history are prepared for an empty `Anima-Kingdoms` repository; publication there requires a repository URL accessible to the connector.


---

## First Concord · v0.11 evidence

# Anima Kingdoms verification — 12 September 2026

This record separates executable simulation scenarios, actual browser interactions, and unverified product claims. An automated browser agent is an agent operating human controls, not an independent human participant.

## Automated evidence

The final retained test run contains **119 tests: 119 passed, zero failed**. These comprise 91 retained world/creation tests, 25 independently authored connected-core scenarios, and three actual-autosave-function regressions. One retained test also evaluates 252 inherited water-allocation fixtures; these are not 252 additional end-to-end games.

Run `node --test tests/*.test.mjs`. The full output is `docs/verification-v11.txt`. Set `KINGDOMS_TEST_EVIDENCE=docs/connection-evidence-v11.json` to collect the connected test evidence. The tests import production simulation modules, advance real simulation ticks and inspect resulting state. Selected UI persistence tests execute the actual extracted save function with a controlled storage harness.

The invited-agent policy starts from a disclosed merchant fixture: the body is placed at the merchant, one existing crystal is purchased through the real quote/trade functions, and the human grants 24 commands. The agent then uses seven typed commands: walk, guide, fuel, feed, perform, assign, and perform again. The courier delivers two physical stones, transfers four reserved Marks once, and returns home. This is real command execution, not browser clicking; the merchant position is explicit test setup.

Other fixtures sometimes move bodies or transfer existing reserves into a test pack to isolate gate, arena or import behavior. They are labeled fixtures, do not create production-game privileges, and are not represented as ordinary player accomplishments.

Coverage includes exact material/charge/Marks conservation; wrong pitch filters; finite fan-out; gate collision/open/safety hold/closure; source and receiver references; duplicate command identity; stale revision; invitation revocation; cancellation before pickup, during cargo and after partial delivery; absent-owner recovery; packet/cargo checkpoints; all four arena checkpoint modes; current and legacy world migration; imported deadline/receipt corruption; bounds; and autosave preservation.

## Defects found and repaired

| Finding | Evidence | Repair |
|---|---|---|
| Accepted extended decks let creatures leave the save envelope | Independent legal-world movement reproduction; old tests had passed | New placement checks every rotated physical corner; runtime ground bounds also constrain legacy decks |
| Failed save could be overwritten by a fresh realm | Actual save/startup source audit | Validate before writing; retain rejected raw bytes; recovery export and explicit replacement |
| A forged receiver deadline could sustain effectively free power | Independent malformed-import scenario | Deadline is bounded to the current connection clock plus one charge period; status/timer consistency validated |
| Saved receipt operation could disagree with its request | Independent malformed-import scenario | Parse and validate exact envelope, operation, result shape, revision order and unique keys; local history remains unauthenticated |
| WebGL2 absence prevented entry | Actual cloud-browser alert | Live canvas world and blueprint fallback using the same simulation |
| Secure-context-only randomUUID prevented Connections opening | Actual clicking-agent console error | Shared bounded ID helper using available random bytes; no secure-context assumption |
| Second instrument could be wired but not fueled by human controls | Independent second design pass | Per-source load/play controls and per-creature feed/assignment controls |
| Canvas gate appearance contradicted collision | Independent second design pass | Fade dormant decks and open gates consistently with the 3D state |
| Canvas camera drag could rotate controls under a fixed map | Independent source inspection | Keep canvas movement aligned to its map; click aim uses the actual pointed ground direction |
| Rejected toast could outlive a later successful action | Actual browser play | Successful changes clear stale error notices; final root clicks verified the error appears on rejection and disappears after a successful walk |
| Courier recovery lacked an address | Independent second design pass | Exact pickup coordinates and real walk-to-pickup action |

The failed initial probes remain in `docs/audit/v11/initial-failures.json`; the reviews and repaired independent run are retained beside them. Repeating a run does not increase the number of distinct tested scenarios.

## Browser evidence

The assigned clicking agent used the supervised browser at `terminal.local:4173/play.html`, clicked the entry screen, authored and saved named creature/instrument recipes, edited score notes, and operated the connection controls. It deliberately attempted a distant purchase, observed rejection and unchanged20 Marks/zero crystal, walked to the exchange, and purchased one crystal:20→12 Marks and0→1 crystal. It then walked to the bridgehead, created the exact kit, loaded one crystal, fed the courier, assigned the request and played scores. A second fuel load without crystal rejected. The courier physically picked up and delivered stone; the journal showed50 total Marks and a balanced material ledger.

The human-style browser journey finished **2/2 deliveries** with the player balance **12→16 Marks**, one four-Mark payment event, and an empty courier cargo slot. The visible typed agent console also passed: invitation24 commands, accepted walk23 remaining, identical replay still 23, revocation epoch2/budget0, and denial of the old request. Full actions and limitations are in `docs/audit/v11/human-click-playtest.md`. Screenshots are observations of the live canvas simulation. They are not generated concept art or evidence of the 3D renderer running.

## Limits that remain

- WebGL2 was unavailable in the cloud browser. The new fallback was exercised; the retained 3D scene, its new connection visuals and GPU-specific behavior were not browser-validated.
- The HTTP preview lacked Web Locks, so it explicitly disabled automatic saving. Browser autosave/reload was not verified there. Snapshot equivalence and actual save-function preservation were tested separately.
- Browser download observation timed out for an attempted JSON export. The final root click review opened the copyable full-world JSON view and parsed its visible textarea successfully; it contained the correct world and connection schemas. This timeout is not reported as a successful download/import test.
- WebMCP tool discovery reported that document modelContext was unavailable. Tools are feature-detected in code, but browser WebMCP registration/execution could not be validated. The typed agent console and pure simulation dispatcher are separate available interfaces.
- Crowded world labels and the live panel overlapped some inventory text in the first playtest. Label separation and inventory placement were adjusted after that observation.
- Cloud gameplay progressed more slowly than wall time. This build caps per-frame catch-up and does not simulate offline time. Canvas resizing was reduced; real-device frame-time and memory profiling remain necessary.
- No remote human multiplayer, production-scale load, real language model, wallet, smart contract, player auction house, renewed ecology or long-lived civilization was run.
- No blind human usability study, objective “best game” measurement, comprehensive device matrix or exhaustive commercial-game mechanics research was performed.

The release provides testable working pieces and preserves their boundaries. These results do not certify that every accepted design or future combination is safe or enjoyable.


---

## Dream Foundry · v0.10 guide

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


---

## Whole-game plan · v0.10 review

# AWE v0.10 — whole-game release review and next gates

11 September 2026 · independent, read-only design review

## What this review establishes

The Dream Foundry source adds a consequential creation layer to the existing local world. A player can compose a three-dimensional object, attach a bounded behavior, rehearse it through the normal simulation, and instantiate it using tracked world materials. This is a substantial change to the game's central promise: the player can now introduce working things rather than only choose among the original building recipes.

This review inspected the current `creation.js`, `rehearsal.js`, `realm.js` and `studio.js`, with selected `app.js` integration paths. “Implemented” below means present in these inspected sources. Final automated evidence is recorded in the release guide and downloadable verification. This independent source review does not certify browser results or player response. It makes no fresh external research claim. The earlier accountability audit remains relevant, with version-specific repairs and changes distinguished from remaining scope.

The source reviewed declares profile `awe-dream-foundry-0.10.0`. It remains a local game. A procedural authoring vocabulary is now present; arbitrary imagination-to-software, massively multiplayer infrastructure, autonomous model participants and crypto settlement are not.

## The six most compelling actual changes

### 1. A player's drawn form can become a persistent world object

The editor supports box, orb, spire and ring parts; position, dimensions, rotation, color and role; duplication and removal; undo/redo; and mirrored silhouette drawing that places actual three-dimensional parts. The same blueprint is compiled for preview and instantiation. Recipes can be saved, branched, exported and imported. Changing a saved recipe does not silently rewrite earlier world instances.

Why this matters: the shape can be the player's own composition, and its presence survives the editing session. This is a concrete beginning for imagination becoming an inhabitant or object of the world. The current bounds are explicit: 1–32 parts, 24 saved recipes and 16 instantiated creations. This is not freeform mesh sculpting, automatic rigging, text-to-anything synthesis or unlimited geometry.

### 2. A created structure can change where bodies and projectiles go

Structure parts can be ornaments, lights, solid boxes or walking decks. Decks contribute actual traversable surfaces; rotated solid boxes participate in movement and projectile obstruction. Placement checks include proximity, original-ground anchoring, protected places, occupied bodies and existing construction. Reclamation refuses to remove a supporting surface when another body or creation depends on it.

Why this matters: architecture acquires consequences. A player can make a crossing or barrier whose function reaches beyond a decorative model. The system still uses a bounded horizontal collision model, and decks all meet the common surface height. It does not simulate structural engineering, collapse, stacked floors or arbitrary terrain. The existing wagon's water qualification remains a separate civic rule, discussed below.

### 3. A creature's ordered rules produce real work and decisions

Players can author up to four first-match rules using `always`, `threat`, `hurt` and `hungry` conditions, and `follow`, `guard`, `harvest`, `orbit` or `rest` actions. Creatures use the common navigation and collision path, spend food-derived energy on guarded combat or gathering, and physically carry a resource from the finite reserve to the player. Their carried bundle is included in material accounting.

Why this matters: a creature is now more than a named shape. The player can change its priorities and watch the consequence. The implementation is a finite rule interpreter. These creatures are not language-model agents, evolving species or simulated conscious beings. Their body parts are expressive geometry; the code does not derive biomechanics from anatomy.

### 4. An authored relic becomes an actual action

Power, reach and tempo share twelve points. The compiled action derives startup, recovery, damage, reach, Breath cost and projectile speed from these choices. Bolt, wave, mend and ward verbs use the common action/wave systems. The action stores a copy of the compiled move when it begins. Authored actions are available in the world and boss encounter, while normalized duel, CTF and authored trials exclude them.

Why this matters: an idea changes timing, distance and effect in real play. A last-second blueprint edit cannot rewrite the already started custom action. The point budget is a bound, not proof of balance. Relic geometry does not define its exact contact volume: collision still follows the compiled range/arc or projectile rules.

### 5. A composed score sends timed effects through space

An instrument has eight pitches, a 12–60 tick beat interval, and a mend, ward or force voice. Performing spends forty Breath, emits notes through the creation tick, and sends expanding waves whose contact produces the corresponding effect. `app.js` plays the emitted notes from that same tick data. Healing is health-limited; wards are capped and expire. The instrument has a recovery period.

Why this matters: music is now coupled to an enacted sequence, with effects arriving through a spatial process. Pitch currently changes sound; voice, power and reach govern the mechanical effect. There are no rests, individual note lengths, per-note operations, receiver wiring or realistic acoustic physics. The phrase “score with an address” currently describes its placed spatial origin, not a connection to a selected building.

### 6. Creation has a repeatable loop of trial, play and revision

The same runtime supports a disposable living rehearsal and a deterministic experiment. Results retain the exact recipe and selected measured outcomes; the editor compares the latest two reports and exports evidence. Separately, a player can author a 3–12 sigil course, choose ordered or any-order collection and a 15–180 second timer, place its gate and enter the resulting local activity. Recipes and trial results do not mint world assets. Instantiated creations hold their invested materials, which can be reclaimed once subject to cargo, performance and surface-dependency checks.

Why this matters: making a second version can respond to something the first version actually did. The player can also author a small playable challenge. The current challenge grammar is sigil collection, not a general fighter/shooter/raid programming environment. Controlled policies use the local simulation's state; their scores are not human playtests or evidence of universal quality.

## Whole-game coverage matrix

Every major family of the user's ambition remains visible here. A next gate is a falsifiable condition for advancing a claim, not a claim that the gate has passed.

| Ambition | Source-present v0.10 scope | Important unfinished scope | Next falsifiable gate |
|---|---|---|---|
| A new genre and imagination becoming reality | Authored form and bounded behavior enter one local world, with rehearsal and consequences | The creative grammar is finite; novelty, emotional effect and “best ever” are unestablished | An unfamiliar player makes, uses and voluntarily revises a creation without a developer explaining every step |
| Inhabited MMORPG world and exploration | First Orchard, near/far banks, authored surfaces, discovery, Atlas, activity clearings | Multiple inhabited regions, online people, world streaming, persistent shared authority | Two independent clients see one placed entity, one inventory transfer and the same recovered world after a server restart |
| Creation across creatures, weapons, buildings, music and games | Five typed creation families, part composition, rules, scores, sigil courses, branch/import/export | Freeform meshes, rigging, richer behaviors, arbitrary mechanics, text-to-function synthesis | Two independent designs per family produce visible and behavioral differences under the same declared test scene |
| Humans and AI as participants | Human editor, rule-based creatures, workers/bots, Serein's bounded water planner, local blueprint-proposal interface | Connected model service, authenticated agent identity, comparable observations, inference budgets and durable controller recovery | A live agent proposes through the same validated command interface; stale, revoked and overspending actions fail without partial mutation |
| Character, abilities and companion progression | Three disciplines, four original timed moves, authored relic action, equipment, consumables, milestones, Lumenling memory | Full avatar creation, 24-ability roster, deep progression, varied movement/voices, learned companion behavior | A new player can identify their build's actual tradeoff and complete a recovery journey without a reset |
| Action combat and fighting-game depth | Sixty-Hz startup/active/recovery, guard/guard break, evade, projectiles, cover, batch duel outcomes, local two-human duel | Combos/cancels, hitboxes tied to detailed animation, rollback, latency fairness, broad matchups | Parameter-extreme builds and multiple legal policies fail to reveal an unintended dominant loop; then observed players can read and punish commitments |
| PvE, quests, dungeons and raids | World enemies, milestone quests, three-phase Root Warden, finite cache | Cooperative raids, encounter portfolio, dialogue-rich quests, ecological dungeon consequences | Distinct plausible play styles complete the boss with readable openings; a first cooperative encounter proves synchronized roles and recoverable failure |
| PvP, shooters and battlegrounds | Bot 2v2 CTF, local duel, physical shooting range, cover and flag lifecycle | Human online teams, matchmaking, ranked ladders, spectators, anti-cheat, shooter variety | Two actual human clients complete a flag match through disconnect/rejoin with exactly one flag carrier, result and body per participant |
| Games inside the game | Raincatch, Loom Table, range, duel, CTF, authored sigil course/gate and entrance return | General game-rule editor, imported games, creator publication/discovery and tournament services | A second player imports a recipe, funds their own gate, completes its pinned rules and returns without inventory or reward duplication |
| Strategy and civilization | Six original plots, five building types, two workers, actual cargo; authored collision and paths; building demolition with partial recovery | Households, consumption society, technology ages, armies, diplomacy, multiple settlements and strategic AI | A constructed route changes a complete production–delivery–consumption chain, including a closure and an alternative route |
| Microeconomy and marketplace | Finite six-material stocks, NPC stock-sensitive quotes, conserved Marks, input-consuming crafting, funded original commission, creation investment/reclaim | Player exchange, market institutions, service contracts, production renewal, measured demand and price behavior | Two independent principals exchange a unique instance/material lot atomically; restart and replay cannot duplicate either consideration |
| Crypto, ownership and portability | Local recipe/world export; original architecture remains documentary | Wallets, chain contracts, verified settlement, title/license enforcement, proof/data availability and actual asset interoperability | One precisely scoped ownership/settlement operation is independently reconstructed from pinned rules and available data; measured failure/cost limits are published |
| Ecology and living creatures | Water allocation, orchard/reed harvest prerequisites, finite resource extraction, food-powered authored helpers | Renewable growth, food webs, reproduction, predators/prey, carrying capacity and migration | One plant/creature cycle has explicit inputs, growth, consumption and bounded replenishment; adversarial loops cannot create unlimited goods |
| Social life, network effects and governance | Local records, invitation/revocation for bounded help, creator lineage labels, co-located play | Chat/guilds, real human relationships, institutions, land/service rights, disputes, moderation, identity and measured network effects | A small group maintains shared infrastructure under accepted repair/removal terms, including an absent owner and a participant's exit |
| Art, animation, audio and accessibility | Procedural world and part models, original panorama, shared scene data, timed notes, HTML controls, touch affordances, focus handling and reduced ambient motion | Production art direction, rich creature rigs, camera/device assurance, screen-reader journey, accessible authoring alternatives and adaptive score | Actual browser/device observation verifies readable controls and effects; keyboard/touch/non-audio users can finish the same creation journey |
| Backend, durability and engineering scale | Single local state, validated snapshots, bounded arrays and recipes, local save ownership, v0.9-to-v0.10 restore path | Authoritative server, authentication, distributed persistence, event replay, observability, deployment rollback, cost/load capacity | Crash at every commit boundary in a shared prototype; recovery yields one accepted result with intact inventories and creation versions |
| Security and adversarial fairness | Typed data compiler, size/bounds checks, no imported executable code, exact investments, approval restrictions, normalized exhibition boundaries | Independent security assessment, hostile network clients, server-enforced rights, adversarial assets and production abuse controls | Fuzz/import/permission and concurrent-spend tests reject malformed or stale work atomically; externally controlled clients cannot bypass authoritative checks |
| Live operations and stewardship | Local pause/settings, export/recovery paths and explicit current limits | Incident handling, moderation operations, backup restores, migrations across a public population, content/rules compatibility | Recover a staging incident with a documented rollback/migration and no silent deletion or inflation of player-created work |
| Exhaustive game and human/crypto research | Recovered 59-chapter dossier, detailed audit, bounded implementation experiments and versioned evidence | Complete Blizzard/Nintendo/title-version corpus; every attack/raid/pet; broader strategy/fighter/shooter coverage; empirical human and market research | Publish the corpus denominator and claim–source–version mapping for one complete family, then independently reproduce selected conclusions; never imply all titles are covered |

## First devil's-advocate pass: challenge the present release

### The authoring system may look broader than it behaves

Five categories exist, but their expressive range is uneven. Structure geometry affects movement directly; creature anatomy does not determine locomotion; a relic's visible blade does not determine its hit volume; instrument pitch does not determine a different operation. These are legitimate bounded abstractions when explained. They become a renewed shortcut if presented as a universal physics compiler.

**Release response:** Explain each family's real degrees of freedom and limits in its editor, use words matching the current implementation, and demonstrate contrasting behaviors rather than count possible combinations.

### A created bridge does not yet mean the same thing to everyone

`Realm.ground` accepts authored walking surfaces and workers use the shared navigation path. The original crossing quest still calls `Rain.bridgeOpen`, and the wagon still advances through `Rain.tickCargo`. Consequently, a player-made dry span can support the player or workers without satisfying the original water-dependent commission.

**Release response:** Preserve the existing water commission's rule explicitly. Do not advertise that any new crossing automatically completes it. The next civic integration should distinguish “physical route available” from “specific hydraulic service fulfilled,” and let each job declare which it needs.

### A numerical budget is not balance

Twelve points cap power/reach/tempo but do not establish equal practical value. Breath regeneration, range, protection stacking, hit safety, existing equipment bonuses and encounter geometry can dominate the nominal budget. The prior boss policies already showed a large gap between a short melee rush and failed ranged kiting.

**Release response:** Retain parameter-extreme and legal-policy failures. Distinguish reaching a valid action, completing a scenario and achieving competitive balance. No balance claim follows from a compiler accepting all twelve-point allocations.

### Rehearsal can mislead even when it is honest code

The bench creates a fresh scene, issues disposable construction resources and disables the nearby target's decision timing. Damage saturates when its target falls. A low damage total can mean no target remains or the policy never reached one. A fast first impact does not establish a universally superior design.

**Release response:** Show the exact recipe, scenario, policy, elapsed ticks and timing metrics alongside totals. Keep interactive rehearsal distinct from controlled policy measurement. Neither may alter or export the disposable material accounts into the world.

### Recovery helps, but the economy still has dead ends

Authored instances return their exact invested matter on safe reclamation. Original buildings return 75% rounded down. Recovery fiber is a finite keeper transfer, and food powers consumptive work. These make experimentation more recoverable but do not create a renewable civilization economy.

**Release response:** Keep free drafting/rehearsal available after depletion. Test recovery from poor allocations without forcing a world reset. Do not call a finite-resource reserve “growth,” “farming sustainability” or measured market demand.

### Source cohesion is not yet proven delight

The code can be internally consistent while controls, placement, silhouettes, camera or tutorial information remain hard to use. It would repeat the earlier failure to substitute more invariant tests for actually observing these interactions.

**Release response:** Report the actual verification and its limits. Browser/device play, first-time comprehension and sustained enjoyment remain separate gates unless observed. Do not issue a finished-art or public-readiness badge based on this read-only review.

## Revised whole-game plan after the first pass

The plan should expand through complete causal journeys. The following six packages have deliverables and failure gates. They are not promised dates or a declaration that one release finishes the original vision.

| Package | Concrete deliverable | Falsifiable acceptance gate |
|---|---|---|
| 1. Reliable creative release | A coherent editor → rehearsal → placement → use → save/restore → revise/reclaim journey for every supported family, with clear actual limits | Malformed inputs, mid-action edits, spent resources, occupied surfaces, interrupted scores and activity return cannot corrupt the world; observed browser interaction confirms that the journey is usable |
| 2. Civic consequences | One generalized route/job contract connects authored surfaces, actual cargo, destination transfer and household consumption; water-specific jobs retain their own declared predicate | Closing the original bridge sends an eligible carrier across a player-built alternative, and real delivery/consumption occurs once; deleting the path produces a truthful blocked/recovery state |
| 3. Richer creative behavior | One compatible receptor/charge contract, one additional creature role and one richer authored challenge objective, all using existing commands and accounting | An authored instrument activates a placed receptive structure; the same paid charge cannot execute twice or amplify around a loop; the new challenge's objective executes rather than appearing only in text |
| 4. Small shared world | Authoritative server for a deliberately bounded group, authenticated principals, pinned rules, atomic inventory/creation commits, reconnect and crash recovery | Two clients and one authenticated scripted/model participant share the same causal history; simultaneous spending, stale grants and crashes preserve one accepted result |
| 5. Living settlement and culture | Explicit renewable resource processes, resident consumption, service contracts, creator attribution/licenses, institution membership and public-work recovery | A complete production cycle remains bounded; an absent builder cannot strand an agreed public route; joining/leaving a community preserves accepted rights and actual assets |
| 6. Production expansion and optional settlement | Measured encounter variety, competitive netcode, larger-world delivery, creator discovery, live operations and a narrowly scoped implemented crypto contract where justified | Target concurrency and latency/cost budgets are measured; restoration and abuse response work; the external settlement operation is independently reconstructable; players choose to return without financial inducement being the sole cause |

Research runs alongside these packages and answers specific design decisions. Complete a named game family/version corpus before claiming it, compare competing mechanics against the implemented need, and distinguish primary-source facts, designer inference and observed experiments. A larger bibliography cannot substitute for the package gates.

## Second devil's-advocate pass: challenge the revised plan

### Objection: six packages can become another impressive document with no inhabited game

That is a real risk. A package is complete only when its entire journey runs and the evidence is attached. The plan should never advance merely because interfaces or schemas have been written.

**Second-pass revision:** End each package with a short executable scenario and an actual user-facing interaction, plus the counterexample that would reopen it. Persist the exact tested source/rules and failed cases. A completed documentation task does not change an absent feature's status.

### Objection: the common engine can erase the diversity of play

Not every interaction should become a colored wave or a resource-transfer puzzle. Fighters need committed timing and contact; strategy needs delayed tradeoffs and information; creatures need differentiated movement and needs; music needs expression as well as function.

**Second-pass revision:** Share authority, resources, history and lifecycle. Permit different mechanical solvers with explicit interfaces. The next law must add a new understandable constraint and two real uses, not only a new particle color.

### Objection: reliable reclamation may remove meaningful commitment

Perfect recovery can turn a world into an endlessly rearranged toolbox; harsh loss can suppress experimentation. One global rule will not serve private expression, ranked competition and public infrastructure equally well.

**Second-pass revision:** Keep the current local foundry's recovery promise intact. Introduce distinct future activity/public-work contracts prospectively, with visible costs and no retroactive confiscation. Trial remains free. Do not introduce hidden upkeep or absence punishment to manufacture retention.

### Objection: human–agent parity is not equal command syntax

An agent may have perfect state, instantaneous reactions, unlimited trials or more capital while a human has a camera and limited attention. Identical command names do not prove fair participation.

**Second-pass revision:** Pin observation scope, timing, reaction limits, experiment budget and accepted controller role per activity. Keep creative collaboration separate from competitive parity claims. Compare outcomes while controlling for skill, capital and controller access.

### Objection: creation and crypto can turn the world into an asset treadmill

A mechanically interesting creation system does not require a tradable reward for every gesture. Financializing every authored thing could make expression subordinate to optimization and imitation.

**Second-pass revision:** Keep recipe expression, material instantiation, title, licensing and payment as separate concepts. Let participants create and play without a purchase or yield premise. Evaluate actual useful exchange before expanding external settlement. These are product decisions, not a claim that economic sustainability has been demonstrated.

### Objection: internal enthusiasm can become a substitute for evidence again

The creator's excitement is a useful source of direction but cannot certify clarity, fun, novelty or public value.

**Second-pass revision:** The six compelling changes above name actual mechanisms and why they matter. Their quality judgment remains revisable. The strongest next signal is a person making a second creation because the first produced a surprising, understandable consequence, followed by observations across people with different abilities and preferences.

## Three proposed ideas, explicitly not current features

| Idea | What it would add | Principal failure mode | Smallest decisive gate |
|---|---|---|---|
| **A song that changes a place** | A player connects selected score events to a receptive structure. One paid charge packet reaches that receiver and activates a civic effect such as a timed shelter or switch | Becomes remote free power, a charge-amplification loop or a cosmetic song beside an unrelated button | One instrument-to-structure transfer uses the same timed event and conserved charge account; removing the receiver or breaking the declared connection produces a legible failure |
| **A settlement that asks for consequences** | Situations arise from actual unmet consumption, transport or habitat conditions; player creations can satisfy them through more than one legal route | Template quests invent gratitude, ignore the world's changed state or mint unlimited payment | A need closes only after its factual predicate changes; the same solved need cannot pay again; two structurally different creations can resolve it |
| **The archive of useful mistakes** | A player keeps earlier recipes, exact bounded experiment evidence and their own annotations, then discovers a different use for a retired design | Becomes a cluttered generated-content feed, falsely certifies novelty or invents the maker's intent | Retrieve and reproduce one earlier trial, branch it into a new useful context, preserve creator-written meaning and show that mechanical similarity does not erase personal value |

## Release wording that can survive scrutiny

“AWE now has a Dream Foundry: compose working creations, try them in a disposable world, and bring them into the First Orchard using actual materials. Creatures follow your rules, relics perform authored actions, structures affect movement and shots, instruments send timed waves, and gates host your sigil courses. The broader shared MMORPG, live model society, renewable civilization and crypto settlement remain development goals.”

That statement should be paired with the independently established final test/observation evidence. It describes what the current code is built to do without claiming the unfinished vision is complete.


---

## Creation contract · v0.10 baseline

# Creation implementation contract

This contract describes the current local implementation. Future shared-server requirements are explicitly separated. Units are world steps and simulation ticks; there are 60 ticks per second.

## One state, several bounded solvers

`world.js` retains the exact water/ownership/commission rules. `realm.js` owns the character, material accounts, actors, combat and activity transitions. `creation.js` validates data and executes authored instances. `navigation.js` supplies cached bounded paths to the same legal-movement predicate. `rehearsal.js` creates an isolated realm and observes its outcomes. `creation-view.js` draws shared part geometry; `studio.js` edits recipes; `app.js` coordinates input, dialogs, audio and local persistence.

No imported code executes. There is no server, database, model connection or blockchain in this release. Local state is editable by its owner; validation is consistency checking, not authentication or anti-cheat.

## Exact recipe surface

The schema is `awe-blueprint-1`. A recipe requires all of these fields and rejects unknown top-level fields:

| Fields | Accepted data |
|---|---|
| `schema`, `id`, `revision`, `parent` | Fixed schema; 1–100-character ID; integer revision 1–10000; null or lineage string up to 120 characters |
| `name`, `kind`, `material` | Plain name 1–64 characters; creature/relic/structure/instrument/trial; wood/stone/ore/herb/crystal |
| `power`, `reach`, `tempo` | Integers 1–8, sum no more than 12 |
| `verb` | bolt/wave/mend/ward |
| `rules`, `resource` | One to four exact `{when,do}` objects; wood/stone/food/herb/ore target |
| `score`, `beat`, `voice` | Exactly eight integer pitches 0–12; 12–60 ticks; mend/ward/force |
| `course`, `seconds`, `order` | 3–12 exact `{x,z}` points, each coordinate −12 through 12; 15–180 seconds; sequence/any |
| `parts` | 1–32 exact part records |

A part requires `shape,x,y,z,w,h,d,color,role,yaw`. Shapes are box/orb/spire/ring. X and Z are −8 through 8; Y is 0 through 8. Dimensions are 0.05–8; yaw is −180 through 180 degrees. Color is a string containing exactly a six-digit hex color. Role is ornament/light/solid/walkway. Solid and walkway roles require a box in a structure recipe. A walkway's top is 0.16 and its height no more than 0.32.

The editor and local API can generate a valid complete example. Fields irrelevant to a family's current runtime are retained for a stable common schema; they do not secretly grant that family another family's powers. These limits do not mean every valid design is useful or artistically successful.

## Derived mechanics and costs

The compiler clones validated recipe data. It never trusts imported cost, damage or runtime code. Estimated material volume sums each part's width × height × depth, multiplied by 1 for a box, 0.53 for an orb, 0.33 for a spire or 0.1 for a ring. These are game cost coefficients, not exact mesh-volume integration.

The chosen material cost is `max(1, ceil(volume / 3 + partCount / 8))`. A creature adds two wood and one herb; a relic adds two ore; an instrument adds two wood; a trial adds two stone; a structure adds one stone. When the selected material matches an added input, the amounts accumulate.

For a relic with power P, reach R and tempo T:

```text
startup = 36 − 3T ticks
active = 2 ticks
recovery = 14 + 2P ticks
base impact = 4 + 3P
reach = 2 + 2R steps
Breath cost = 10 + 2P + R
bolt speed = 10 + 1.5T steps/second
```

The wave attack uses a full-circle range check with ordinary cover obstruction; bolt uses swept projectile collision. Mend/ward actions emit a spatial effect of one quarter of the compiled impact. Existing world discipline/equipment bonuses still apply to relevant damaging actions. The twelve-point budget bounds the base move and is not a competitive balance proof or a guarantee about total equipped damage.

Creature speed is `1.6 + 0.3T`; perception is `3 + R`; a guard hit costs `8 + P` energy, deals `3 + 2P` damage and has `100 − 7T` ticks of cooldown. Harvesting consumes that energy after 100 in-range, supply-ready ticks and transfers one actual resource into cargo. Delivery requires arriving within 1.6 steps of the owner. One food becomes 80 energy, recorded as spent food; feeding rejects when energy exceeds 20. Movement itself currently has no energy cost and creatures do not starve while their player is away.

Creature rules use first-match semantics. `threat` checks a nearby living enemy; `hurt` checks owner health below half maximum; `hungry` checks insufficient energy for its compiled action; `always` always matches. `follow`, `guard`, `harvest`, `orbit` and `rest` are bounded local operations. Cargo temporarily overrides the selected rule with delivery. Guard contact must be unobstructed. No anatomy-derived gait, learned policy or language understanding is implied.

A performed instrument pays 40 Breath up front, starts at the next tick and schedules eight notes separated by its beat. Each emits a wave with strength `1 + P/2` and maximum radius `3 + R`. Radius grows by 0.12 per tick. Each eligible body is affected once as the front reaches it. Mend is capped by maximum health; ward is shared, capped at 30 and expires after 180 ticks; force damages world enemies. These waves do not model realistic acoustics or line-of-sight sound obstruction. Frequency is `220 × 2^(pitch/12)` Hz. Mute suppresses audio, not simulation. Reuse is gated for 720 ticks; normalized activities pause the score and shift its remaining schedule on return.

A trial spawns in its isolated clearing at `(-83,-43)`. A sigil is touched within 1.5 steps. In sequence mode only the next sigil is eligible; in any mode all remaining sigils are eligible. Completion is evaluated before timeout on the exact deadline. One personal result is recorded, with no inventory payment or loot. There are no user-authored course obstacles in this version, and valid points fit inside the circular clearing. A short clock can still make a course impossible; compilation does not prove timed solvability.

## Material custody and transactions

For each material, the accounting invariant is:

```text
pack + merchant + world reserve + permanently spent
+ authored-instance investment + worker cargo + authored-creature cargo
= initial world supply
```

Original building inputs are tracked in `spent` and also recorded per building for reclamation authority; the per-building record is not counted a second time. A saved settlement cannot claim investment greater than its spent account. Original buildings recover floor(0.75 × each invested amount). Authored creations hold their recoverable matter outside spent and recover exactly that amount. Consumed food and fuel do not return.

Instantiation validates recipe, living world body, instance cap, position, geometry and all available inputs before making any debit. It then subtracts the exact bill and creates one instance with an independent blueprint copy and investment bag. A draft edit cannot mutate it. A custom attack similarly pins its compiled move at attack start; an already emitted projectile owns its values.

An instance may be reclaimed only once, within reach of a visible part. Cargo and active performances must finish first. Removing a deck is rejected if an occupant would lose its last original/authored support. Reclamation is allowed when independent support remains. These are local single-owner rules; they do not implement public infrastructure title, consent or an absent-owner dispute process.

Placement requires a center within 16 steps of the living world body and declared world bounds. Ordinary instances require legal supported ground. Structures require original-ground anchoring; solid boxes reject actor overlap, existing construction and proximity to resources, landmarks and safety landings. Complex arrangements can still obstruct routes; the system does not claim universal graph connectivity or structural stability. Reclamation and safe bank recovery remain available within their stated rules.

## Persistence, epochs and isolated practice

World profile `awe-dream-foundry-0.10.0` uses the local key `awe-concord-v10`. A `awe-living-concord-0.9.0` snapshot is cloned, assigned empty creation state, given explicit original-building investments, cleared of leaked respawn invulnerability, then fully validated. This does not grant old worlds the new starter supplies. The old local key remains available as a migration source. v0.8 worlds are not supported by this migration.

There are at most 24 drafts, 16 instances, 160 creation-memory entries, 40 personal trial records and four unapproved proposals. An instance retains blueprint version, investment, position, home, entry bank, energy, cargo, task, cooldown, gathering progress, score cursor and age. Ephemeral note/wave events and unapproved agent proposals are cleared from snapshots. Malformed typed values, inconsistent material totals and unsupported save shapes reject before replacing the active world.

World activities use one entrance checkpoint. Duel/CTF/trial normalize equipment and exclude custom mechanics and world consumables. Returning restores the same world health/equipment and clears exhibition bodies, projectiles and temporary protection. Snapshots taken inside an arena encode that entrance checkpoint, not a duplicate arena inventory.

Autosave is serialized through one exclusive browser Web Lock, with the latest snapshot read after lock acquisition. Without the lock API, automatic saving is disabled and manual export remains available. A persisted browser-history restoration reloads to reacquire ownership. Hidden tabs/panels pause simulation; there is no offline growth or catch-up. This is a local tab contract, not distributed transaction authority.

A rehearsal creates a fresh realm and issues only its disposable construction bill. It never clones editable references from the active world. While it is active, the real world object is retained separately and all automatic save calls serialize that original. World import/export and reset are blocked in rehearsal; return discards the lab and retains only the recipe and factual report. A lab snapshot fails normal material conservation. Controlled results retain recipe, scenario, method, timing and ledger residuals, enabling exact bounded repetition. No synthetic result grants world goods.

## Human and local agent boundary

`globalThis.aweCreator` exposes `schema`, `example(kind)`, `inspect()`, `preview(recipe)` and `propose(recipe)`. This is a browser-local development interface. It is not a remotely authenticated API. `preview` uses the same compiler without spending. `propose` requires the player's invitation, accepts bounded recipe data for review and cannot instantiate or spend. Revoking the invitation clears pending proposals. The human still inspects, edits and performs normal placement with current materials.

The original Serein water planner keeps its separate invitation, grant-epoch and exact-plan acceptance checks. Workers, enemies and authored creatures remain scripted. There is no connected language model, inference budget or fair competition between a camera-limited human and a full-state agent.

## Before this becomes a shared game

An authoritative command envelope must name principal, controller/grant epoch, world/rules version, expected revision, idempotency key and bounded payload. A server must recompile the recipe and atomically validate authority, space and custody before committing event and material transfers. Reconnect retries must return the existing result; stale commands must fail without partial debits. A render client must never decide inventory, title, hit results or permission.

Human and agent commands can share this path while having explicitly different accepted roles. Competitive parity additionally requires matched observation scopes, tick access, reaction limits and experiment budgets. External model latency, inference cost and revocation need measured behavior. Multiple activity solvers may share custody and history without pretending a fighter, a civilization and a song use identical mechanics.

Crypto remains a proposed optional settlement boundary. Recipe identity, authorship attribution, license, instance title, service obligation and payment must be separate records. A digest does not prove originality or make another engine execute an asset. A real settlement feature needs deployed code, available data, independently reproducible outcomes and measured costs/failure recovery before claiming ownership portability or economic benefit.
