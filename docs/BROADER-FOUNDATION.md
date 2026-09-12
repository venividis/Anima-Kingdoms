# Anima Kingdoms — The Living Commons

12 September 2026 · broader-project foundation, development build 0.12

The broader project now has two new working foundations: an inhabited local food economy and a persistent place where independent players can cooperate. These extend the actual First Orchard and First Concord code. The historical honest audit has been reviewed and mapped into a [36-family obligation registry](audit/broader-review.md); the larger game and research obligations remain visible.

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

The Agents panel issues explicit scopes, a limited number of accepted actions and an expiry. A real external program can use that bearer credential through the documented HTTP API. Revocation removes its authority. No language model is bundled or represented by a scripted character. See [the service contract](SHARED-REALM.md) for all commands and actual limits.

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

The household test suite has 20 methods. Its legal 1,000-second journey starts from the ordinary world, uses actual walking, construction and policies, and includes ten successful save/reload checkpoints. It grows **132 new food**, funds **89 food** into the depot, delivers **75 food units**, serves **64 household meals** and **46 worker meals**, and returns **110 compost**. All four households end without hunger or missed meals. All six material residuals and the water residual are zero; total money remains 50. Seventy-five delivered food units is not a claim of 75 courier trips. [Pinned scenario evidence](audit/broader/civilization-scenario.json).

The 17 shared-authority tests include two real HTTP clients racing to fill one escrowed offer, full cooperative construction/crossing, agent revocation and budgets, blueprint reuse, service restart and online backup. A child process is actually killed inside an uncommitted trade; reopening retains the pre-trade owners and a retry settles once. Corruption and inconsistent custody histories are rejected. These are executable API and persistence observations.

Nine [DOM and real-HTTP integration journeys](audit/broader/shared-ui-review.md) exercise joining, legal gathering, player and NPC exchange, recovery, agent grants and blueprint publication/export. They reproduced and repaired draft loss during polling, hidden uncertain-command recovery and stale responses overwriting a recovered identity. Six transport methods separately cover exact retry behavior and storage failures.

Local invited-agent probes complete the existing connected score–crossing–courier journey through nine authorized commands and six custody checkpoints, with two delivered stone, one funded reward and balanced ledgers. Separate regressions preserve the repaired travel and water-maintenance behavior. Counts from targeted runs overlap the full suite and must not be added to its total.

The available remote browser could not reach the local preview (`ERR_BLOCKED_BY_CLIENT`). No successful new browser playthrough, rendered screenshot inspection, touch-device observation or human enjoyment test is claimed. DOM/event tests emulate the interface and replace the renderer; they establish control and request behavior, not WebGL correctness, layout quality or accessibility conformance. The historical published release's browser evidence does not verify these new screens. C24 remains open.

## Run, preserve and extend this foundation

The service defaults to loopback port 8787 and `data/shared-realm.sqlite`. Keep its database and recovery keys. A lost or expired owner token currently has no account recovery route; creating another name creates another empty principal. The service has explicit finite limits and unpruned durable history. These bounds are not a measured concurrency or capacity claim.

`node server/backup.mjs ./data/shared-realm.sqlite ./backups/realm.sqlite` creates and validates a new backup. Public hosting requires the Node authority behind the configured HTTPS origin, operational storage and the responsibilities documented in the service guide. A static framework deployment alone does not provide the API. This change does not publish a new website.

The next architectural gate is to put one existing authored creation and one gameplay outcome under this same authority, with reconnect and ownership preserved. Remote combat needs its own latency and match-lifecycle design. Broader regions, warfare, additional games, complete worldcraft disciplines, richer art and sound, observed human usability, all nine research families and wallet/onchain integration remain separate open obligations in the registry.

Source additions: `public/civilization.js` and `civilization-view.js` implement the local cycle; `server/authority.mjs` and `index.mjs` implement shared rules and HTTP; `public/shared-rules.js`, `shared-transport.js`, `shared-client.js` and `shared-view.js` connect the rendered client to accepted server state. The existing canvas and 3D local renderers display the household and courier state. Historical source, artwork, archives and audits are preserved in the repository.
