# Anima Kingdoms: independent connected-core execution

Reviewed2026-09-12 by `kingdoms_core_review`, read-only outside the Site checkout. Final inspected code is preserved in `connected-ready2/`. The root agent implemented all product repairs. This reviewer wrote and executed adversarial tests and agent policies only.

## Result

**25 independent Node tests pass.** The portable deliverables are:

- `portable/tests/kingdoms-connections.test.mjs`
- `portable/tests/fixtures/v10-creature.json`
- `portable/tests/fixtures/v10-overhanging-deck.json`

After copying those paths into the repository, run `node --test tests/kingdoms-connections.test.mjs`. The file imports `../public/realm.js` and has no scratch-path dependency. `KINGDOMS_TEST_EVIDENCE=/chosen/path.json` optionally writes structured scenario results. The25 tests are additional to the retained91 baseline tests; do not count the previous ready1 runs as additional independent scenarios.

Evidence is recorded in `connected-results-ready2.json` and `portable-test-output.txt`. These are state-informed command tests and simulation ticks, **not mouse clicks, screenshots, browser performance measurements or independent human playtesting**. Browser testing belongs to the root/separately assigned browser workflow.

## Actual invited-agent playthrough

The initial fixture places the human at the merchant, purchases one existing crystal using the real quote/trade functions, and grants24 agent commands. Subsequent actions use the public typed command contract with `controller:'agent'`, current world/rules/epoch/revision and unique idempotency keys:

1. Walk to the bridgehead using runtime navigation.
2. Instantiate the three-creation guided kit from actual existing materials.
3. Fuel its source with one crystal.
4. Feed its courier with one food.
5. Perform the score.
6. Assign the two-stone civic request.
7. Perform again after fulfillment so the courier can return across the reactivated span.

The courier physically picked up, carried and delivered both stone. The request completed once and transferred four reserved Marks. The courier returned to the pickup at simulation tick2582. The agent used7 commands and retained17 of its grant. No direct teleport or inventory mutation occurred during this agent-controlled sequence.

At completion:

| Quantity | Observed value |
|---|---:|
| Stone delivered to the hearth | 2 |
| Reward transferred | 4 Marks |
| Human balance after buying crystal and earning reward | 16 Marks |
| Total money | 50 Marks |
| Residual for each of six material ledgers | 0 |
| Charge originally issued by one crystal | 24 |
| Charge remaining at source | 8 |
| Charge buffered at receiver | 4 |
| Charge spent | 12 |
| Charge in flight / dissipated | 0 / 0 |
| Active civic jobs after return | 0 |

This is a bounded agent policy operating the same simulation command layer. It is not an autonomous language model service installed in the game, an online AI participant or a browser-click test.

## Three confirmed defects found and repaired

1. **Legacy-structure save loss remained after new-placement bounds were fixed.** A validv0.10 overhanging deck could still be imported, then permit a creature to walk to x62.44 outside its snapshot validator. The next save became unloadable. The root added the physical envelope to runtime ground legality. The same imported deck now stops the hero at x54.97 and creature at x52.50; restore succeeds and materials remain conserved.
2. **A corrupted receiver deadline could create an unbounded powered lease.** Changing `until` to clock+1,000,000 was accepted. The root added the maximum180-tick deadline and active/status consistency requirements. The corruption is now rejected while ordinary gate use and active checkpoints still pass.
3. **Receipt metadata could contradict its original command.** A receipt whose bytes contained `walk` but whose `op` said `guide` was accepted. The root added parsed envelope/result consistency, revision ordering and key uniqueness checks. The contradictory receipt is now rejected. This is local data integrity, not authenticated historical proof; local save files remain editable.

Two initial test-fixture assumptions were corrected rather than blamed on product code: attempting to positively test replay by feeding an already-fed creature correctly fails, and cancelling before the owner actually walks away may legitimately return cargo before departure. Final tests exercise the intended conditions explicitly.

## What the25 tests establish

- Invalid world/rules/revision, unknown operations, malformed payloads and unauthorized agent commands reject without any runtime state mutation.
- Exact guide and fuel receipt replays do not create duplicates or consume resources twice; conflicting reuse of a key is rejected.
- Agent command budgets and invitation revocation are enforced.
- Both physical stone deliveries produce one four-Mark payment; continued ticks and repeat assignment do not pay again.
- Cancellation before loading spends no stone. Cancellation with cargo returns the actual carried unit. Cancellation after partial fulfillment preserves the consumed first stone and does not pay an unfinished request.
- Cancelled cargo waits at the fixed pickup until the owner actually returns.
- Connected source and active-courier reclamation reject atomically.
- In-flight packets survive save/restore and activate their receiver later.
- Checkpoints at pickup/outbound/first delivery/return/second pickup/final delivery maintain exactly-once fulfillment and material conservation.
- Invalid endpoints, duplicate receivers, impossible charge, unbounded powered deadlines and contradictory receipts are rejected.
- Priorv0.10 property survives migration; the old overhanging-deck progress-loss case stays loadable after walking.
- Connection clocks and packets pause inside activities. Mid-duel, CTF, boss and trial snapshots restore world work correctly at the activity entrance.
- Wrong-pitch filters reject all eight unaccepted notes while preserving all24 source charge.
- Gate passability agrees with its dormant/active/clearing states. An occupied gate waits safely at expiry, remains passable for the body, and closes with collision after vacancy.
- Two accepted notes sent over two links consume exactly four charge units and produce exactly four receiver arrivals; fanout does not duplicate energy.

## Product interpretation and limits

The current musical link accepts **a set of pitches**. It does not recognize an entire ordered melody, and it can activate on the first accepted note. Mechanical arrival is a wired packet whose delay depends on endpoint distance; it is distinct from the instrument's shorter healing/visual sound wave. UI and design claims should use those actual semantics.

The occupancy safety hold allows the route to remain passable while occupied, including new entrants during clearing. It is an explicit permissive safety rule, not a proven admission lease or a mechanism that prevents indefinite occupation. A deliberately parked creation can keep a route occupied; the product should not imply a stricter power economy than this implementation enforces.

One score can finish the two-stone request while leaving the courier on the far bank waiting for a route home. Replaying the score uses remaining fuel and completes the return. This was observed and intentionally handled by the agent policy, not hidden by teleportation.

The original Vey wagon still follows the separate rain-water crossing contract. The new civic delivery uses the authored creature and shared world movement. These should not be presented as the same cargo system.

These checks do not establish combat balance, aesthetic quality, fun, multiplayer authority, a renewable civilization economy, blockchain settlement, browser rendering correctness or full security against edited local saves. They establish concrete causal, persistence and custody behavior for this connected creation layer.
