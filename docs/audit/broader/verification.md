# Living Commons release verification

12 September 2026. Base repository commit: `29951dce51d98babffd88d781435ec3f8a172488`.

The final source passes **224 test methods with zero failures, cancellations or skips**. `pnpm build` exits successfully. This report accompanies [the release contract](../../BROADER-FOUNDATION.md) and [the broader audit registry](../broader-review.md).

| Command | Result | Evidence |
|---|---|---|
| `pnpm test` | Exit 0; 224 passed; 6.143 seconds reported by Node | [Full test output](final-tests.txt) |
| `pnpm build` | Exit 0; framework client/server bundles built | [Full build output](final-build.txt) |
| `node docs/audit/broader/probes.mjs public docs/audit/broader/current-probe-results.json` | Exit 0; post-repair control, stewardship and legal invited-agent observations recorded | [Pinned probe results](current-probe-results.json) |
| `git diff --check` | Exit 0 | Local whitespace check before publication |

Captured logs normalize trailing whitespace; diagnostic text is retained.

Runtime: Node `v24.19.0`, pnpm `11.19.0`. The project now requires Node 24 or newer for its built-in SQLite service and online backup. The pnpm lockfile includes happy-dom 20.14.0 for the interface tests; the authority needs no third-party server dependency.

The full count comprises the 156 retained baseline methods and 68 new methods: 20 civilization, eight guided-control, eight water-stewardship, 17 shared-authority, six transport and nine UI methods. The retained legacy-channel ownership test now explicitly uses an unmarked historical channel. Targeted run counts overlap this total; neither scenario checkpoints nor the 252 inherited water fixtures are added as separate test methods.

## Behavior established

- Legal production, carrying, doorstep delivery, household meals, compost, shortage/recovery and ten save/reload checkpoints retain balanced goods, water and money. The 1,000-second household scenario and source fingerprints are in [civilization-scenario.json](civilization-scenario.json).
- A new courier cannot be built into, stranded by reclaiming its supporting creation, or caught by closing a powered gate. Three focused regressions reproduced the omitted body checks before repair. Their isolated fixture phases are identified in the test source.
- Two independently authenticated HTTP clients gather and fund projects and trades; concurrent fill attempts produce one settlement. An actual child-process kill inside an uncommitted trade preserves pre-trade ownership, and restart/retry yields one committed result. Online backup includes committed WAL state and is validated on opening.
- Agent scope, allowance, expiry and revocation are enforced by the shared authority. Local guided walking also yields to combat and cancels on grant revocation. These are distinct authority models and are documented separately.
- Nine DOM/real-HTTP journeys exercise actual forms and event handlers. Polling no longer destroys an unsent offer, conceals uncertain-action recovery or substitutes the player from an old-token response. [The interface review](shared-ui-review.md) preserves the initial failures and precise test boundaries.
- The original connected score, powered span and physical courier journey still completes through nine authorized local agent commands and six custody checkpoints, with one funded reward and balanced ledgers.

## Limits that remain

The remote browser could not load the local preview (`ERR_BLOCKED_BY_CLIENT`). DOM tests use emulated browser APIs, mocked canvas contexts and a driven trusted test clock. They do not verify real WebGL rendering, camera comfort, mobile layout, actual browser downloads, accessibility conformance or human enjoyment. Those acceptance gates remain open.

The build emits its environment proxy warning and Vinext's existing “Unknown” static route-classification notice; neither prevents compilation. A successful framework build does not host the Node Commons authority. No public deployment, production load test, independent security certification or human playtest occurred in this release.

The shared Commons is a separate persistent place. Local combat, household simulation and authored creature instances are not yet synchronized between players. Full MMORPG scope, research corpora, live language models and onchain settlement remain unfulfilled obligations, as recorded in the registry.

`source-manifest.json` pins the current executable source, interface files, lockfile and test/evidence inputs. Earlier targeted reports apply to their own recorded hashes. The repository preserves the original source archives and artwork; GitHub publication is based on the original remote tree and commit parent.
