# Shared Commons: DOM and real HTTP integration review

12 September 2026. **15 methods pass: nine new UI integration methods and six retained transport methods.** The exact command is `node --test tests/shared-ui.test.mjs tests/shared-transport.test.mjs`; output is preserved in `shared-ui-results.txt`. The initial run's three genuine failures remain in `shared-ui-initial-failures.txt`.

These tests mount the actual `shared.html` in happy-dom 20.14.0, import the shipped `shared-client.js` with its normal module dependencies, and submit forms/click controls through DOM events. Requests go over real loopback HTTP to `createRealmServer` and `SharedRealm` using an isolated SQLite database. Player supplies begin empty. Movement requests use the normal server validation and a deliberately advanced trusted test clock; no player position or inventory is injected.

Canvas contexts are mocked. Animation/movement scheduling is driven by the test harness. This is **DOM emulation, not an actual browser, visual rendering, human playtesting, measured performance or accessibility certification**. The configured remote browser could not reach localhost, and this work did not bypass that restriction. Generated credentials belong only to disposable test players.

## Three reproduced product defects and their fixes

| Finding | Actual failing behavior | Repair and positive evidence |
|---|---|---|
| Unsent offer reset during polling | A player selected herb/7 for Marks/9. While an input was focused the values survived, but moving focus to the world allowed a background arrival to reset the offer to wood/1 for stone/1. | Background panel replacement preserves current values and checkbox selections. Explicit actions and tab changes retain their intentional reset behavior. The focused and blurred cases now pass. |
| Recovery prompt concealed by a successful poll | An offer was committed by the real service, then its response was deliberately dropped. The recovery prompt initially appeared, but a successful state poll hid it even though the retained command still blocked new actions. | Transport acceptance retains `uncertain`/`confirming` status while a pending command exists. The prompt survives polling; reloading replays the identical envelope, leaves exactly one escrowed offer, and cancellation returns the one original wood. |
| Prior-player poll overwrote a recovered identity | The initial player's state response was delayed. A different valid recovery key was submitted through the visible entry form. Releasing the old response then changed the player label back to the old identity despite the stored key belonging to the new player. | Each refresh binds its response and authentication failure to the token that requested it. After a token change, stale success/error cannot replace the current identity or clear the valid session. Principal changes also reset private panel state and participate in panel invalidation. |

## Successful journeys

- A real new-player form, escaped display name, rejected remote gathering, repeated legal walk commands, one actual wood gathered, displayed reserve decrement and immediate gathering-cooldown rejection. All six tabs reopen correctly.
- Two separately mounted DOM-created players gather wood and stone through their respective controls. An unfunded offer rejects; a funded offer escrows the seller's wood; the other player fills it; restoring the first player's key shows the received stone. All shared custody residuals remain zero.
- The NPC Exchange rejects a distant sale, accepts a local sale, displays the correct bid/ask/stock, rejects an unfunded purchase, then completes a second sale and funded purchase with the actual `market.sell`/`market.buy` operations.
- The agent invitation form issues only the selected scope and budget. Its generated key performs a legal external movement command, rejects an ungranted gathering action without spending allowance, and becomes unauthorized after the DOM revoke button.
- The Studio file input rejects an invalid blueprint name and reviews a valid compiled creature. The publish button places the design on the actual shared shelf; removal deletes that publication without creating player materials. The download control emits the correct JSON Blob, filename and MIME type. The test intercepts the download anchor to inspect its bytes; it does not establish a real browser's file-download behavior or CSP enforcement. The server's actual CSP header and absence of inline HTML event handlers are also checked.
- Both a stale successful state response and a stale authentication failure are released after another recovery key has succeeded. The current player's identity and stored credential remain intact.

The initial Studio test fixture used `Lantern <test>`, which the existing compiler correctly rejects. That test was corrected to first assert the rejection, then upload `Lantern & Light`. This was a fixture correction, not a product repair or a reason to weaken name validation.

## Source fingerprints for this run

| File | SHA-256 |
|---|---|
| `public/shared-client.js` | `61c44a8c4539a7003dab1d5beefa23282545b988bed616e61f96958fb46bb2ab` |
| `public/shared-transport.js` | `d6d343548c428f3a3d40a1a3f46d80d68210dd834e43a1ffdfa2f40a12cf2537` |
| `public/shared-view.js` | `98a81127cb7cd5f9f108eed72882ff100fe44eff6756e8b4c68826031adf40c0` |
| `public/shared-rules.js` | `40347955146ce68d6d32ae946bc5aa13eb3863964a340250b486d4be55fdfbbb` |
| `server/authority.mjs` | `4fd6815e7268c72cd8c3bcde5bffe87da039b20fd8ab52de5e318d272840338b` |
| `server/index.mjs` | `d11773437845cfc6e270932650e377d204f8dbeedc2ac13b1930894ed5bbfb09` |
| `tests/shared-ui.test.mjs` | `cd54738a4354cdeab2062ffaff0b64ae2151e90c0c63978d0e38029ac515297d` |

The six retained transport methods are included in the reported 15. They must not be counted again as additional UI journeys or human participants. Full-suite/build/publication evidence belongs to the final release record.
