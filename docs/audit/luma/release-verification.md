# Luma 0.13 release verification

The reconstructed Luma upgrade connects the retained language to the existing local game and shared Commons. Its source inventory, original font, parser witnesses, world actions, interface handlers and independent play records are included in this branch.

## Verified on this reconstruction

| Gate | Observed result |
|---|---|
| `pnpm test` | 279 test groups passed; zero failed, skipped or cancelled. |
| `pnpm build` | Framework production build completed. Its route classifier retains the existing “unknown” informational notice. |
| Source identity | The recovered original artwork is byte-identical: SHA-256 `86f7c110a82587eb50f302def2261b5ae9b431a41cdabf46b8f48a6c7a8f0668`. All 247 files of the recovered published baseline initially matched their Git blob hashes. |
| Language | 20 original letters, 180 roots and 900 forms; all 41 source AST witnesses match in Latin and native writing; original TTF and WOFF2 bytes; exact numerals, Unicode transport and musical codes. |
| Source geometry | 960 projection comparisons, all 20 original glyph records and compilation of all 180 noun forms. Retained coordinates can remain invisible after projection. |
| New local actions | Sixteen test groups covering modes, own-speaker grammar, real costs, atomic rejection, exact retry, save/restore, typed contexts, connected sound, care, household delivery and revision lineage. |
| Shared authority | Thirteen new groups covering real funded contributions, gifts and recipient choice, custody, scope, schema migration, exact retries, recovery, origins, quotas and the original artwork's CSP. |
| Shipped interface | Eleven new DOM test groups execute the actual local app and shared client, real local saves and real HTTP/SQLite transactions. Canvas and audio output are explicit mocks. |

The 55 new groups extend the previous 224. The final [test output](final-tests.txt) and [build output](final-build.txt) are the fresh records. The earlier report of 282 tests belonged to the implementation deleted by cleanup; it is not reused as this release's result.

## Independent play

The [local journey](local-journey.json) records 26 accepted actions, six actual walks, five current-state snapshot/restores and 5,127 ticks (85.45 seconds). It includes two full source scores with 16 timed notes, a powered crossing while the rain bridge remains closed, creature care, lineage repair, four doorstep food deliveries and four observed household meals. Three intentions matched accepted undertakings. All six material residuals and the water residual ended at zero; total money remained 50; issued charge balanced as 24 = 8 spent + 16 dissipated. An earlier [insufficient-funds attempt](local-journey-insufficient-funds.json) is preserved. The successful distinct world funded its purchases with an actual ore sale.

Two independently operated players completed the [fresh shared journey](shared-play/README.md) through the actual HTTP/SQLite service and real wall-clock movement. Melu supplied eight wood and Rema eight stone, both crossed the completed span, two gifts were welcomed and one declined/refunded, and both recorded their own native experience. At settled revision 94 each held 16 Marks, the treasury held 468, and every one of the seven custody residuals was zero. Exact construction retries moved no further goods or money. The shared report identifies the two movement receipts recovered from the server after their raw HTTP records were found missing; it does not fabricate those responses.

## Corrections made during reconstruction

- Single-letter listening now uses the letter code, so consonants such as `m` sound correctly.
- Dictionary meaning searches accept ordinary English while native spellings remain searchable.
- Returning to an intention restores the retained-coordinate control and its displayed value; accepted intentions can also be released from a full notebook.
- An observation shows actual health, Breath, inventory and creation count. Repair selects its newly created instance before another performance.
- Shared action binding follows the parsed verb even when the preset menu still names a different example; recipients keep the choice to welcome or decline a gift.
- Background updates preserve the current composer and its draft. Lost arrival responses reuse a persisted request key; later explicit player recovery wins over an older response. Rejected names can be corrected.
- Closed gift history is ordered by settlement time; all still-open custody is retained. The three-gift live journey did not exercise the 200-closed-record boundary; its dedicated test does.

## Practical limits

These checks establish the stated source, arithmetic, simulation, persistence and handler contracts. Browser/WebGL appearance, mobile layout, recorded pronunciation and human comprehension have not been newly verified. The approved remote browser could not reach the earlier local preview; DOM emulation is disclosed throughout.

The original PDF and Atlas were read before cleanup, but their local copies were not recovered. Their recorded identities and the fresh-versus-inherited reading distinction remain in [recovery.md](recovery.md). The complete uploaded HTML is retained. Historical access statements inside it remain the source author's records, not a fresh visit to those external sources.

The local orchard and shared Commons remain separate authorities. This source update is reviewable in the existing PR; it does not merge main or deploy the previously published Site. Run Node 24+ with `pnpm realm`, then open `/play.html` and choose **Luma (G)**, or open `/shared.html` and choose **Luma**.
