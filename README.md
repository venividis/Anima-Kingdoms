# Anima Kingdoms


**Whole Sky edition 2:** open **Cosmos (O)** to explore 9,096 catalogue stars, ten Solar System objects, both hemispheres, the native sixteen-digit sky seal and its music, celestial events, and a persistent intention/reflection notebook. [Read the complete sky & Luma guide](docs/WHOLE-SKY-LUMA.md).

The **Celestial Atelier** connects Luma’s original writing and music to a moving sky, metallurgy, alchemy and town life. Open **Cosmos (O)** in the First Orchard or the **Cosmos** tab in the Living Commons. See the [celestial game guide](docs/CELESTIAL-ATELIER.md) for recipes, sky conventions, persistence and verification.

**A word becomes a world · Luma 0.13**

Open **Luma (G)** to compose with the uploaded language’s twenty original sounds and native characters. Its 180 roots and 900 dictionary forms remain intact. A noun’s sixteen feature coordinates shape a playable creation; the letters supply its exact two-note musical code.

**i** previews a possibility. **u** keeps an intention. **pe** undertakes an act using actual materials and the existing reach, placement and custody rules. **e** makes observations inspectable; **a** expresses the speaker’s own experience. Build a musical instrument, connect it to a powered span, care for a creature or send real food to household doorsteps. The notebook preserves the difference between an accepted undertaking and a completed result.

The shared **Luma** panel supports public-work contributions, gifts that the recipient can welcome or decline, and attributed personal experience. Arrival and command retries recover the same player or receipt after a lost response. The source language and its philosophical distinctions guide the mechanics; they do not grant free resources or numerical power bonuses.

Invite four households into the First Orchard. Grow food using water and soil, let workers bring the harvest home, and watch Tavi carry supper to actual doorsteps. In the new shared Commons, independent players gather, barter, build a crossing together, speak, publish Foundry designs and invite external command agents.

The shared Commons has a Node/SQLite authority and its own economy. The First Orchard keeps its existing local combat, connected creations and saves. The current release does not synchronize that entire local game into multiplayer.

Select **Life (K)** in the local world for households, **Connect (N)** for the musical crossing and courier journey, or **Create (V)** for the five-kind blueprint workshop. Exploration, timed combat, the Root Warden, physical workers, water routing, bot CTF, local two-player duels, the range, Raincatch, Loom Table and authored sigil trials remain playable.

The [game website](https://awe-first-orchard.edwincardenas.chatgpt.site) hosts both the local Orchard and a persistent D1-backed Living Commons. See the [Luma game guide](docs/LUMA-GAME.md) and [recovery and verification record](docs/audit/luma/recovery.md).

## Run and verify

Requires Node 24+ and pnpm. The framework starter and exact pnpm lockfile are included.

```sh
pnpm install --frozen-lockfile
pnpm realm
```

Open `http://127.0.0.1:8787/shared.html`. Use a second browser profile for another player. `/play.html` opens the local game. The shared realm persists at `data/shared-realm.sqlite`; its [service guide](docs/SHARED-REALM.md) explains credentials, commands, backups and hosting.

For the framework development shell and verification:

```sh
pnpm dev
pnpm test
pnpm build
```

The framework development URL opens the local game; it does not run the Commons API. HTTPS or localhost with Web Locks enables automatic single-tab local saving. In contexts without Web Locks, export/import through the World Journal; automatic saving is explicitly disabled. WebGL2 is preferred; a live canvas rendering provides a fallback.

The standard framework uses Vinext and a Workers-compatible production build. The gameplay modules in `public/` are framework-independent ES modules. They can also be served over an appropriate local HTTP server. Source belongs in `public/`; `dist/` is generated build output.

## Documentation and evidence

- [Celestial Atelier: stars, rhythm, alchemy and metallurgy](docs/CELESTIAL-ATELIER.md)
- [Luma game guide: language, shapes, music and accountable acts](docs/LUMA-GAME.md)
- [Original uploaded Living Artwork, preserved byte for byte](public/luma/origin.html)
- [Source extraction and language contracts](public/luma/README.md)
- [Luma recovery record and fresh verification](docs/audit/luma/recovery.md)
- [Release verification](docs/audit/luma/release-verification.md)

- [Living Commons release, journeys and exact remaining scope](docs/BROADER-FOUNDATION.md)
- [Shared service, agent API and recovery contract](docs/SHARED-REALM.md)
- [Current audit registry and repaired failures](docs/audit/broader-review.md)
- [Current combat, movement and practice guide](docs/COMBAT-MOVEMENT.md)
- [Combat release verification](docs/audit/combat/release-verification.md)

- [First Concord game and technical contracts](docs/ANIMA-KINGDOMS.md)
- [Historical First Concord verification](docs/VERIFICATION-v11.md)
- [Historical creation contract](docs/CREATION-CONTRACT.md)
- [Historical accountability audit](docs/ACCOUNTABILITY-AUDIT.md)
- [Retained whole-game review](docs/WHOLE-GAME-PLAN.md)

`public/vision.html` is the readable in-game design guide. `tests/` contains executable regression and scenario coverage. `docs/audit/` retains discovered failures and independent reviews. Do not interpret headless scenarios as human testing or local grants as multiplayer security.

## Controls

O Cosmos · G Luma · K Life · N Connect · V Create · T attuned relic · WASD / arrows move · right-drag look · wheel / pinch zoom · Space jump · Shift run · C guard · R evade · E interact · 1–4 combat moves (hold 1 for Palm) · Tab target · X release · Z center camera · H controls and safe practice · Q worldcraft · F rain · B settlement · I character · J quests · M atlas · Escape menu/close.

Touch uses an analog movement stick, world-drag camera control, and visible attack / guard / run controls. The Controls panel can also show these controls on desktop.

In the local game, the celestial workshop keeps the orchard running while you craft; other panels and hidden tabs pause simulation. Connected destinations have walk buttons using the same movement and collision rules. Manual movement and combat actions cancel guided travel. In the shared Commons, other people continue acting while a panel is open; the server owns positions and goods. Its controls are WASD/arrows or the touch pad, E to gather, world drag to orbit, wheel/pinch to zoom, and Z to center.

## Repository and source history

Source: [venividis/Anima-Kingdoms](https://github.com/venividis/Anima-Kingdoms).

The four development stages are preserved as byte-identical source snapshots in GitHub history. GitHub import commits have new identities; the exact original commit objects are retained in [`archive/Anima-Kingdoms-history.bundle`](archive/Anima-Kingdoms-history.bundle). See [import provenance](docs/SOURCE-IMPORT.md) and [independent import verification](docs/audit/github-import-verification.md).

The repository is private. Importing source does not deploy a new Site or configure automatic deployment. Historical audits describing unavailable repository creation record the earlier release; the owner subsequently supplied this repository.
