# Fresh local Luma play journey

The current [executable journey](local-journey.mjs) passed using one new ordinary realm, the public local APIs, legal guided walking and actual simulation ticks. [The complete trace](local-journey.json) records its source hashes, every command and before/after custody, all emitted notes, checkpoints and final ledgers. It is a scripted agent interaction, not a browser or human playtest.

## Observed result

| Observation | Result |
|---|---:|
| Accepted actions | 26 |
| Actual guided walks | 6 |
| Current-state persistence checkpoints | 5 |
| Simulation elapsed | 5,127 ticks / 85.45 seconds |
| Complete world scores | `musa` and `sona`, eight notes each |
| Actual note events | 16 |
| Matched intentions | 3 |
| Food carried by Tavi to doors | 4 |
| Household meals consumed | 4, with no missed first meals |
| Six material residuals | All zero |
| Water residual | Zero |
| Money including existing escrow | 50 Marks |
| Charge | 24 issued = 8 spent + 16 dissipated; nothing remaining or in flight |

The player actually walked to the market and council, bought a crystal and three herb, sold one held ore, and bought one food. The five food available were split into one creature meal and four depot food. Tavi's deliveries and household consumption occurred through subsequent ticks. The final player balance was one Mark; the merchant held 37 and the original water-world escrow still held 12.

At the bridgehead, an intended `musa` became a funded instrument, `yuna` became a funded walking span and `wuna` became a funded creature. One food gave the creature 80 energy. A second unnecessary feeding was rejected without any state change. The instrument connected to the unoccupied span, consumed one crystal and sent charge on the exact timed source notes. The player crossed to the far bank while the original rain bridge remained closed, then walked back.

The trace retains every note's source letter, pair index, ratio, frequency and tick. `musa` emitted at ticks 544, 568, 592, 616, 640, 664, 688 and 712. `sona` emitted at ticks 1062, 1086, 1110, 1134, 1158, 1182, 1206 and 1230. Both scores used their complete existing four-letter words and the original 220-Hz ratio convention. No longer noun is represented as a played instrument.

A connected repair was rejected atomically. After a legal unlink, the instrument was rebuilt with new instance and blueprint identities, unchanged invested material cost, its original inscription and a parent lineage reference. Its 16 unused source-charge units dissipated during detachment; the eight charge units already sent were eventually spent by the receiver.

Checkpoints used only `R.snapshot` followed by `R.restore` of the current earned state. The comparison checked holdings, body position/health/Breath, creature energy/cargo, performance cursors and household custody. A mid-score checkpoint preserved the first-note cursor and in-flight packet. No test fixture changed the player position, initial supplies, health, creature energy, courier position or completion state.

The accepted performance command was replayed after persistence with exactly its original source and context. Its receipt returned without a second score or cost. A genuine native-script own-experience sentence was also accepted without changing world state.

## The earlier budget failure is retained

The [first attempt](local-journey-insufficient-funds.json), run by [its saved script](local-journey-insufficient-funds.mjs), stopped at a real market constraint. Buying crystal and three herb left three Marks; the additional food cost four. The rejected purchase changed no goods. This was a planning error in the agent policy, not a failed conservation rule.

The passing trace is a distinct fresh ordinary world whose plan sells one actual ore to fund that food. It does not restore an earlier favorable checkpoint from the failed attempt, and the failed record has not been rewritten as success.

## Reproduce and interpret

```sh
node docs/audit/luma/local-journey.mjs
```

This writes a new trace with its own real world/instance identities and current source hashes. Simulation ticks and the selected policy are deterministic within the tested source; generated identities are not fixed. The historical failed script remains separately reproducible with an explicit output path, for example `node docs/audit/luma/local-journey-insufficient-funds.mjs docs/audit/luma/insufficient-funds-rerun.json`. Its saved runner retains the exact earlier bytes; the original trace records that runner under its then-current name, `local-journey.mjs`.

The assertions establish this full legal journey and its resource accounting. They do not establish human comprehension, pronunciation, browser layout, acoustic playback quality, broad gameplay balance, accessibility on physical devices or ongoing player enjoyment.
