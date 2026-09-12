# Anima Kingdoms verification — 12 September 2026

This record separates executable simulation scenarios, actual browser interactions, and unverified product claims. An automated browser agent is an agent operating human controls, not an independent human participant.

## Automated evidence

The final retained test run contains **119 tests: 119 passed, zero failed**. These comprise 91 retained world/creation tests, 25 independently authored connected-core scenarios, and three actual-autosave-function regressions. One retained test also evaluates 252 inherited water-allocation fixtures; these are not 252 additional end-to-end games.

Run `node --test tests/*.test.mjs`. The full output is `docs/verification-v11.txt`. Set `KINGDOMS_TEST_EVIDENCE=docs/connection-evidence-v11.json` to collect the connected test evidence. The tests import production simulation modules, advance real simulation ticks and inspect resulting state. Selected UI persistence tests execute the actual extracted save function with a controlled storage harness.

The invited-agent policy starts from a disclosed merchant fixture: the body is placed at the merchant, one existing crystal is purchased through the real quote/trade functions, and the human grants 24 commands. The agent then uses seven typed commands: walk, guide, fuel, feed, perform, assign, and perform again. The courier delivers two physical stones, transfers four reserved Marks once, and returns home. This is real command execution, not browser clicking; the merchant position is explicit test setup.

Other fixtures sometimes move bodies or transfer existing reserves into a test pack to isolate gate, arena or import behavior. They are labeled fixtures, do not create production-game privileges, and are not represented as ordinary player accomplishments.

Coverage includes exact material/charge/Marks conservation; wrong pitch filters; finite fan-out; gate collision/open/safety hold/closure; source and receiver references; duplicate command identity; stale revision; invitation revocation; cancellation before pickup, during cargo and after partial delivery; absent-owner recovery; packet/cargo checkpoints; all four arena checkpoint modes; current and legacy world migration; imported deadline/receipt corruption; bounds; and autosave preservation.

## Defects found and repaired

| Finding | Evidence | Repair |
|---|---|---|
| Accepted extended decks let creatures leave the save envelope | Independent legal-world movement reproduction; old tests had passed | New placement checks every rotated physical corner; runtime ground bounds also constrain legacy decks |
| Failed save could be overwritten by a fresh realm | Actual save/startup source audit | Validate before writing; retain rejected raw bytes; recovery export and explicit replacement |
| A forged receiver deadline could sustain effectively free power | Independent malformed-import scenario | Deadline is bounded to the current connection clock plus one charge period; status/timer consistency validated |
| Saved receipt operation could disagree with its request | Independent malformed-import scenario | Parse and validate exact envelope, operation, result shape, revision order and unique keys; local history remains unauthenticated |
| WebGL2 absence prevented entry | Actual cloud-browser alert | Live canvas world and blueprint fallback using the same simulation |
| Secure-context-only randomUUID prevented Connections opening | Actual clicking-agent console error | Shared bounded ID helper using available random bytes; no secure-context assumption |
| Second instrument could be wired but not fueled by human controls | Independent second design pass | Per-source load/play controls and per-creature feed/assignment controls |
| Canvas gate appearance contradicted collision | Independent second design pass | Fade dormant decks and open gates consistently with the 3D state |
| Canvas camera drag could rotate controls under a fixed map | Independent source inspection | Keep canvas movement aligned to its map; click aim uses the actual pointed ground direction |
| Rejected toast could outlive a later successful action | Actual browser play | Successful changes clear stale error notices; final root clicks verified the error appears on rejection and disappears after a successful walk |
| Courier recovery lacked an address | Independent second design pass | Exact pickup coordinates and real walk-to-pickup action |

The failed initial probes remain in `docs/audit/v11/initial-failures.json`; the reviews and repaired independent run are retained beside them. Repeating a run does not increase the number of distinct tested scenarios.

## Browser evidence

The assigned clicking agent used the supervised browser at `terminal.local:4173/play.html`, clicked the entry screen, authored and saved named creature/instrument recipes, edited score notes, and operated the connection controls. It deliberately attempted a distant purchase, observed rejection and unchanged20 Marks/zero crystal, walked to the exchange, and purchased one crystal:20→12 Marks and0→1 crystal. It then walked to the bridgehead, created the exact kit, loaded one crystal, fed the courier, assigned the request and played scores. A second fuel load without crystal rejected. The courier physically picked up and delivered stone; the journal showed50 total Marks and a balanced material ledger.

The human-style browser journey finished **2/2 deliveries** with the player balance **12→16 Marks**, one four-Mark payment event, and an empty courier cargo slot. The visible typed agent console also passed: invitation24 commands, accepted walk23 remaining, identical replay still 23, revocation epoch2/budget0, and denial of the old request. Full actions and limitations are in `docs/audit/v11/human-click-playtest.md`. Screenshots are observations of the live canvas simulation. They are not generated concept art or evidence of the 3D renderer running.

## Limits that remain

- WebGL2 was unavailable in the cloud browser. The new fallback was exercised; the retained 3D scene, its new connection visuals and GPU-specific behavior were not browser-validated.
- The HTTP preview lacked Web Locks, so it explicitly disabled automatic saving. Browser autosave/reload was not verified there. Snapshot equivalence and actual save-function preservation were tested separately.
- Browser download observation timed out for an attempted JSON export. The final root click review opened the copyable full-world JSON view and parsed its visible textarea successfully; it contained the correct world and connection schemas. This timeout is not reported as a successful download/import test.
- WebMCP tool discovery reported that document modelContext was unavailable. Tools are feature-detected in code, but browser WebMCP registration/execution could not be validated. The typed agent console and pure simulation dispatcher are separate available interfaces.
- Crowded world labels and the live panel overlapped some inventory text in the first playtest. Label separation and inventory placement were adjusted after that observation.
- Cloud gameplay progressed more slowly than wall time. This build caps per-frame catch-up and does not simulate offline time. Canvas resizing was reduced; real-device frame-time and memory profiling remain necessary.
- No remote human multiplayer, production-scale load, real language model, wallet, smart contract, player auction house, renewed ecology or long-lived civilization was run.
- No blind human usability study, objective “best game” measurement, comprehensive device matrix or exhaustive commercial-game mechanics research was performed.

The release provides testable working pieces and preserves their boundaries. These results do not certify that every accepted design or future combination is safe or enjoyable.
