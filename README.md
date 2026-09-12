# Anima Kingdoms

**The Living Commons** — the first broader Anima Kingdoms foundation.

Invite four households into the First Orchard. Grow food using water and soil, let workers bring the harvest home, and watch Tavi carry supper to actual doorsteps. In the new shared Commons, independent players gather, barter, build a crossing together, speak, publish Foundry designs and invite external command agents.

The shared Commons has a Node/SQLite authority and its own economy. The First Orchard keeps its existing local combat, connected creations and saves. The current release does not synchronize that entire local game into multiplayer.

Select **Life (K)** in the local world for households, **Connect (N)** for the musical crossing and courier journey, or **Create (V)** for the five-kind blueprint workshop. Exploration, timed combat, the Root Warden, physical workers, water routing, bot CTF, local two-player duels, the range, Raincatch, Loom Table and authored sigil trials remain playable.

The [previously published First Concord](https://awe-first-orchard.edwincardenas.chatgpt.site) remains the earlier deployment. This repository update has not deployed the new Commons service. See the [release contract and audit status](docs/BROADER-FOUNDATION.md).

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

K Life · N Connect · V Create · T attuned relic · WASD / arrows move · right-drag look · wheel / pinch zoom · Space jump · Shift run · C guard · R evade · E interact · 1–4 combat moves (hold 1 for Palm) · Tab target · X release · Z center camera · H controls and safe practice · Q worldcraft · F rain · B settlement · I character · J quests · M atlas · Escape menu/close.

Touch uses an analog movement stick, world-drag camera control, and visible attack / guard / run controls. The Controls panel can also show these controls on desktop.

In the local game, panels and hidden tabs pause simulation. Connected destinations have walk buttons using the same movement and collision rules. Manual movement and combat actions cancel guided travel. In the shared Commons, other people continue acting while a panel is open; the server owns positions and goods. Its controls are WASD/arrows or the touch pad, E to gather, world drag to orbit, wheel/pinch to zoom, and Z to center.

## Repository and source history

Source: [venividis/Anima-Kingdoms](https://github.com/venividis/Anima-Kingdoms).

The four development stages are preserved as byte-identical source snapshots in GitHub history. GitHub import commits have new identities; the exact original commit objects are retained in [`archive/Anima-Kingdoms-history.bundle`](archive/Anima-Kingdoms-history.bundle). See [import provenance](docs/SOURCE-IMPORT.md) and [independent import verification](docs/audit/github-import-verification.md).

The repository is private. Importing source does not deploy a new Site or configure automatic deployment. Historical audits describing unavailable repository creation record the earlier release; the owner subsequently supplied this repository.
