# The Celestial Atelier

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

Seven classical bodies use geocentric ecliptic positions and topocentric apparent horizons. The three named stars use rotated fixed reference directions; proper motion is not modeled. The panorama is a cylindrical sky chart. Its decorative stars and twenty native Luma asterisms are authored artwork, visibly distinct from the three named catalog stars. It is not a telescope image or a newly researched star atlas.

Solar altitude and lunar illumination supply modest, disclosed craft-quality bonuses. Close conjunctions, sextiles, squares, trines and oppositions supply another bounded bonus. Material behavior and these correspondences are invented game rules, not a physical claim about alchemy or metallurgy. Furnace and bath temperatures are simplified process models. Water favors Star-iron and Moon dew; air favors Singing alloy and Earth tincture.

All letters keep their source musical spelling: `q = 5f + u` gives two ordered pitches from `[1, 9/8, 5/4, 3/2, 5/3]` at 220 Hz. Workshop scores follow their stage's word at 80 beats per minute. The same stage clock controls notes and strike cues. One strike per beat can improve quality; steady work has no timing requirement. Sound is opt-in and visual cues remain available. The chart retains the original sixteen articulatory features; the sky's separate sixteen coordinates embed seven body longitudes plus sidereal angle as eight cosine/sine pairs.

## Persistence and authority

Local snapshots acquire an empty celestial state on migration. Current work, invested ingredients, individual works and installed effects survive saving. All material custody remains in the existing ledger, including unrecoverable furnace fuel. Growth validation accounts for the accelerated first cycle.

The shared JSON schema advances from 3 to 4 without changing SQL tables, character identity, escrow, recovery keys or command history. Node/SQLite and hosted D1 use the same generated action rules. Commands require the authenticated character's own inventory and station reach. Stage times and strike timestamps come from the server. Clients cannot submit a timestamp, grade, ownership claim or custom recipe cost. Exact retries replay one receipt and do not consume materials or allowance again.

External agents may receive any of `cosmos.start`, `cosmos.strike`, `cosmos.advance`, `cosmos.reclaim`, and `cosmos.use` through the existing optional scopes. Permission to begin work spends the owner's recipe inputs. Permission to use work can install a public town improvement. No new scope is selected by default. Revocation and allowance limits continue to apply.

## Verification and remaining work

`tests/cosmos.test.mjs` exercises retained notes and sky coordinates, rhythm/cooling quality, atomic rejection, mid-stage recovery, every local recipe, actual courier and growth effects, a two-player crossing/mineral/forge/town journey, durable shared custody and delegated action bounds. `tests/cosmos-ui.test.mjs` executes the shipped native-script controls and crafting stages through DOM emulation. `tests/hosted-commons.test.mjs` checks migration and crafting across fresh hosted D1 instances. Canvas and audio are mocked in DOM tests; there is no new human playtest, visual browser review, mobile certification or pronunciation study.

This advances audit obligations C04 (material rules), C10 (production), C12 (ecology), C23 (adaptive sound), and C25/C26 (persistence and authority). It does not close the full MMO, broad crafting economy, autonomous social civilization, live language-model characters, broad scientific research corpus, online combat, raids, multiple regions or blockchain settlement. Those obligations remain open in `docs/audit/broader-review.md`.
