# The Living Concord: implementation contract

The audit is authoritative for scope and evidence. This file describes the executable v0.9 profile; it does not supersede historical protocols without an implementation.

## One local state

`realm.js` owns one body, six-material stock accounts, finite merchant inventory, buildings, two worker bodies/cargo, enemies, companion memory, milestones and history. The nested rain state retains its exact finite-flow profile. `materialLedger` includes carried worker goods and consumed/constructed material accounts. Money remains the original total of 50 Marks. World food is a separately declared finite reserve; the inherited wagon's four-unit food lot is not silently duplicated into it.

Each player attack runs at 60 Hz through startup, active frames and recovery. Damage is queued before batch resolution. Projectiles use nearest swept segment-circle collision; horizontal cover blocks them. Arena health/equipment normalize for CTF/duels; the same movement function handles both local humans. Enemy decisions are scripted heuristics.

## Concrete loops

- Gather → build a real colliding structure → assign a worker → travel → spend one food → move up to three units from reserve into carried cargo → travel home → deposit.
- Buy/sell: inspect finite stock price → quote exact quantity/price → accept only that unchanged world-bound quote → transfer goods and Marks atomically.
- Craft: require workshop and resources → transfer ingredients to consumed account → equip once or add one consumable.
- Rain: install/recover finite channels → allocate exact source water → accumulate/consume at terminals → bridge service and harvest eligibility → wagon progression and existing commission.
- Resonance: beacon + 40 Breath → largest-remainder allocation of exactly twelve units from terminal delivery proportions → temporary bridge protection, harvest acceleration and pet ward. Expires after 300 ticks.
- Boss: three health phases, warnings, adds, death/reset → actual defeat → claim one existing three-crystal cache once.
- Lanternwake: one human plus three bots, 2v2 → carry enemy flag while own is home → first three or 14,400 ticks → explicit return. Flag drops on death and returns after 900 ticks; respawn is 240 ticks with 120 ticks of cancelable immunity.
- Duel: one bot or two humans on one keyboard → normalized 100 health → batch winner/draw → explicit return.
- Range: eight actual moving targets hit by physical Glass Note bolts, 3,600 ticks, personal score.
- Raincatch: seeded 45-second catching game, personal score.
- Loom Table: alternating placements among three rotatable reciprocal-port shapes; west/east versus north/south on shared 5×5 board; simultaneous paths or full-board nonconnection draw. New variant, not old finite-inventory conformance.

## Persistence contract

Save snapshots validate the full retained shape and conservation. Local editable state is not an authenticated account. Activity exports resume at the world entrance; mid-match bodies, projectiles and targets do not export. The original equipment is restored, inventory mutations persist, and no exhibition money is created. No offline simulation or save migration from v0.8 runs.

## Source repair boundary

The source also repairs mutable and cross-world agent previews, positive proposal-wrapper acceptance, far-bank rescue persistence, shared terrain/collision vertices, stale initial-tab save acquisition, lock-message layering, native keyboard activation, local player-two movement, simultaneous knockouts, expired pet ward and flag-pickup position. The complete audit distinguishes executable test evidence from source-only inspection.

The source-only deployment does not establish browser usability or production performance. Server authority, online humans, live model agents, smart contracts, raids, deep civilization/character systems and the exhaustive requested research remain open.
