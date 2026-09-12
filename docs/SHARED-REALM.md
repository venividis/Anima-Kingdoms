# The shared commons

This release adds a running, durable multiplayer commons to Anima Kingdoms. Two independent clients can move through the same valley, gather finite materials, exchange escrowed goods, contribute to shared construction, speak, share Foundry designs and authorize external command agents. SQLite determines identities, positions, inventory and settlement. Browser state cannot award items.

The shared commons is a separate authoritative place linked from the First Orchard. The existing local combat, crafted instances, couriers, civilization and saves remain the local game. They are not silently uploaded into this economy. A published Foundry blueprint is a reusable design, not an instantiated shared creature or a minted asset.

## Run

Node 24 is the validated runtime. The service and tests use built-in Node modules; no third-party server package is required.

```sh
PORT=8787 REALM_DB=./data/shared-realm.sqlite node server/index.mjs
```

Open `http://127.0.0.1:8787/shared.html`. A second browser profile can create another principal. The default interface listens on loopback only. `/play.html` serves the original local game; `/` opens the commons.

The database directory is created with private permissions, and the database is mode `0600`. Keep that directory outside the served `public/` tree and outside source control. Preserve the database and its backup: it contains the realm, session credentials, grant-secret material, replay receipts and transfer history. Changing `REALM_DB` selects another realm; it does not migrate the old one.

For a public service, configure `PUBLIC_ORIGIN` to the actual HTTPS origin and serve the Node process through that origin. `HOST` may explicitly select another bind address. The service checks browser Origin, Fetch Metadata and Host and does not expose cross-origin API permissions. HTTPS termination, uptime, capacity, abuse operations and secure operator access remain deployment responsibilities. Static-only hosting does not run this Node authority.

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
| `POST /api/session` | `{ "name": "Ash" }` | `{ token, playerId, expiresAt, state }` |
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

The state view contains `rulesVersion`, `realmId`, `revision`, `serverTime`, `you`, `world`, `players`, `nodes`, `offers`, `projects`, `treasury`, `market`, `totals`, `ledger`, `chat`, `events`, `agents` and `blueprints`. `you.inventory` is the principal's actual holdings. Other player entries expose display name, position and approximate recent online presence; they do not expose the other player's private inventory or bearer secrets. Owners see their own grants. Agent views identify their scope and remaining allowance.

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

A saved owner token reconnects to the same principal after connection loss or service restart. Owner credentials last 30 days and can be renewed while valid. A lost or expired token has no email/password recovery route in this release. Possession of a token grants its authority; protect it as a credential. Display names cannot recover someone else's pack. Assets are retained when a player disconnects; they are not transferred to a new signup.

The service retains at most 500 principals, 12 simultaneously open offers per principal, 10,000 lifetime offers, 32 lifetime agent grants per principal, 80 chat messages and 100 recent display events. Durable receipts and the journal are not pruned; monitor disk growth. The shared resource deposits are deliberately finite. The new local civilization system does not regenerate the shared economy.

## Invited external agents

An owner creates a grant with an explicit command-scope list, accepted-action allowance and expiry. Its returned bearer token authenticates as a delegate of that principal; it cannot choose another owner. An accepted action decrements the allowance once. Failed commands and exact accepted-command retries do not spend another action. Revocation prevents further reads and commands, including old-receipt access. Agents cannot create or revoke grants or renew owner credentials.

Available delegated scopes are movement, gathering, player offers, project contributions, market trading, chat and blueprint publication/removal. These scopes permit real changes to the owner's holdings; grant only the intended ones. Agent tokens are deterministically recoverable by replaying the owner's exact successful creation command and do not appear in public state views. Owner session credentials are stored as hashes. The operator-held database also contains the server secret used to derive agent tokens.

This is an authenticated external-agent command interface. A caller may connect its own planner or model. The service does not contain an autonomous LLM, claim model identity verification, or label the game's scripted actors as language-model participants.

## Back up a running realm

```sh
node server/backup.mjs ./data/shared-realm.sqlite ./backups/realm-2026-09-12.sqlite
```

The CLI uses SQLite's online backup API, including committed WAL data. It refuses to overwrite the destination, then verifies the copied realm, its full custody history and receipts before reporting success. This supports backing up while the service is running. A raw copy of just the main database file while WAL writes are active is not the same operation.

To restore, stop the realm process, retain the previous database, and start with `REALM_DB` pointing to the verified backup. The backup contains credentials as well as holdings; protect it accordingly. Restoring an older backup deliberately restores its earlier world and credential state. Test recovery using a copy before replacing a live service path.

## Evidence and remaining scope

Run:

```sh
node --test tests/shared-authority.test.mjs
```

The 17 tests cover complete cooperative gathering/construction/crossing, finite deposit exhaustion, funded barter, treasury buy/sell, forged identity and movement, stale revisions, durable key collisions and replay, agent allowance/scope/revocation/expiry, bounded chat, actual Foundry design reuse and shelf limits, online backup, and corruption refusal. Two actual HTTP clients race for one offer: one settles it and the other receives a revision conflict. A child process is actually killed after mutating the fill inside its transaction and before `COMMIT`; reopening preserves the pre-fill owners, and retry settles exactly once. Restart tests also preserve open escrow and committed fills.

Those tests are reproducible server/API evidence, not browser playtests, human enjoyment studies, load tests or production security certification. They do not establish a complete shared MMORPG. Shared combat, live shared crafted-creature simulation, household society in this authority, matchmaking, production operations, wallet binding and on-chain settlement remain outside this service. The current release's integrated browser and full-project evidence is recorded separately by the main implementation task.
