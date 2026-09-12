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

The Luma extension adds structured statements to the same authoritative command transaction. Local objects and balances remain separate. The [Luma guide](LUMA-GAME.md) explains the source language and its local creation routes.

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

Fresh Luma, gift-custody, arrival-replay and integrated UI evidence is recorded in [the reconstruction audit](audit/luma/recovery.md) and its final release verification. The earlier baseline counts above are not the reconstruction total.
