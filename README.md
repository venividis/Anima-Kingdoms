# Anima Kingdoms

**The First Concord** — a playable fantasy world where authored creations cooperate.

Compose a score. Wire it to a powered crossing. Give a creature a real delivery. Follow the actual material and charge that make the promise possible.

Play: https://awe-first-orchard.edwincardenas.chatgpt.site

Select **Connect (N)** for the connected-creation journey. **Create (V)** opens the five-kind blueprint workshop. The game includes exploration, timed combat, a PvE boss, physical workers and trading, water routing, bot CTF, local two-player duels, a shooting range, Raincatch, Loom Table and authored sigil trials. Local browser world; no online MMO, connected language model, wallet or token network is claimed.

## Run and verify

Requires Node22.13+ and pnpm. The supported framework starter and exact pnpm lockfile are included.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
```

Open the local development URL, or `/play.html` for the standalone game. HTTPS or localhost with Web Locks enables automatic single-tab local saving. In contexts without Web Locks, export/import through the World Journal; automatic saving is explicitly disabled. WebGL2 is preferred; a live canvas rendering of the same simulation provides a hardware-independent fallback.

The standard framework uses Vinext and a Workers-compatible production build. The gameplay modules in `public/` are framework-independent ES modules. They can also be served over an appropriate local HTTP server. Source belongs in `public/`; `dist/` is generated build output.

## Documentation and evidence

- [Current game, whole-game plan and technical contracts](docs/ANIMA-KINGDOMS.md)
- [Observed verification and limitations](docs/VERIFICATION-v11.md)
- [Historical creation contract](docs/CREATION-CONTRACT.md)
- [Historical accountability audit](docs/ACCOUNTABILITY-AUDIT.md)
- [Retained whole-game review](docs/WHOLE-GAME-PLAN.md)

`public/vision.html` is the readable in-game design guide. `tests/` contains executable regression and scenario coverage. `docs/audit/` retains discovered failures and independent reviews. Do not interpret headless scenarios as human testing or local grants as multiplayer security.

## Controls

N Connect · V Create · T attuned relic · WASD move · drag look · wheel zoom · Space jump · Shift run · C guard · R evade · E interact · 1–4 combat moves · Q worldcraft · F rain · B settlement · I character · J quests · M atlas · Escape menu/close.

Panels and hidden tabs pause simulation. Connected destinations also have genuine walk buttons that use the same movement and collision rules. Manual movement cancels their journey.

## Repository and source history

Source: [venividis/Anima-Kingdoms](https://github.com/venividis/Anima-Kingdoms).

The four development stages are preserved as byte-identical source snapshots in GitHub history. GitHub import commits have new identities; the exact original commit objects are retained in [`archive/Anima-Kingdoms-history.bundle`](archive/Anima-Kingdoms-history.bundle). See [import provenance](docs/SOURCE-IMPORT.md) and [independent import verification](docs/audit/github-import-verification.md).

The repository is private. Importing source does not deploy a new Site or configure automatic deployment. Historical audits describing unavailable repository creation record the earlier release; the owner subsequently supplied this repository.
