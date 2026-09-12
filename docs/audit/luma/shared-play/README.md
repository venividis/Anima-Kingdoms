# Fresh shared Luma play, 12 September 2026

Melu and Rema were operated by two independent agents in a newly created, isolated HTTP/SQLite realm. They gathered finite resources, walked with the real movement cadence, and used native Luma statements to build the Joined Span and exchange gifts. The clock was `Date.now`; no fixture, inventory grant, direct world edit, or accelerated simulation funded this journey.

This record was generated after the workspace recovery. It does not reconstruct the deleted earlier play traces.

| Observed action | Actual result |
| --- | --- |
| Melu imagined construction while still at arrival | The sentence was recorded as imagination with an `OUT_OF_REACH` readiness explanation; inventory stayed empty. |
| Melu gathered eight wood; Rema gathered eight stone | Each player walked to the appropriate finite node and waited through the existing gathering cooldown. |
| Native `i`, `u`, and `e` construction statements at the project | Readiness and the eight-unit cost were reported; the statements did not deliver materials or pay a reward. |
| Melu's native `pe` construction, revision 57 | Eight wood transferred into the span; sixteen existing treasury Marks transferred to Melu. |
| Rema's native `pe` construction, revision 58 | Eight stone transferred into the span, completing it; sixteen existing treasury Marks transferred to Rema. |
| Both exact construction envelopes replayed | The original receipt returned with `replayed: true`; no second cost or reward occurred. |
| Both bodies walked across | Each player used thirteen real movement commands from the project approach to approximately `(0, -22)`. |
| Rema offered a one-Mark gift and Melu welcomed it | The offer first funded escrow; the recipient's acceptance transferred it. |
| Melu offered one Mark and Rema declined | The recipient stayed at fifteen Marks; the escrow returned to Melu, restoring seventeen Marks. |
| Melu offered another Mark and Rema welcomed it | Both players finished with sixteen Marks. All three gift escrows were closed. |
| Each player recorded `a mi me honi ta loma he.` | The speaker's own experience was recorded without transferring assets. |

At the settled revision 94, the span held eight wood and eight stone, the treasury held 468 Marks, and each player held sixteen Marks. Every recorded state balanced all seven custody residuals: wood, stone, ore, food, herb, crystal, and Marks.

The canonical summary is [play-summary.json](play-summary.json). The credential-redacted HTTP records are [melu.http.jsonl](melu.http.jsonl) and [rema.http.jsonl](rema.http.jsonl). Final observations are [melu-final.json](melu-final.json) and [rema-final.json](rema-final.json); intermediate snapshots retain the physical and financial states before and after each stage.

Final inspection found two absent Melu HTTP entries, for the last approach movements at revisions 53 and 54. Their cause remains unknown. The exact envelopes and acceptance receipts were recovered read-only from the authority's retained receipt table, their integrity checksums were verified, and both envelopes were replayed through HTTP. The returned old receipts did not move the final body or change revision 94. [melu-recovered-server-receipts.json](melu-recovered-server-receipts.json) labels this recovery separately; the missing historical response states were not recreated. Original responses plus these two retained receipts account for every accepted revision from 1 through 94.

`relay-server.mjs` starts a fresh realm and forwards optional file-queued requests into its actual HTTP API. The relay exists because separate agent tool sessions can have isolated loopback networks. It does not choose player actions. `play-client.mjs` manages one named player's credentials, records every HTTP request and response, and waits for the real movement/gathering cadence. Credentials and the temporary SQLite database stay outside this evidence folder; only bearer headers and token response fields are redacted from the traces. `melu-play.mjs` records Melu's choices; Rema's decisions were made by the other agent. `summarize-play.mjs` verifies the recorded custody results and generates the summary.

This is core/API play evidence. It does not establish browser appearance, sound intelligibility, or learning outcomes with people. The loaded authority preceded a later correction that orders the latest 200 closed gifts by settlement time. This three-gift journey does not exercise that boundary; the dedicated authority tests cover that correction separately.
