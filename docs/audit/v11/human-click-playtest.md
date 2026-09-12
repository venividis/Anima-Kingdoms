# Anima Kingdoms — actual browser click playtest

Date: 2026-09-12. Agent: kingdoms_click_play. Preview: http://terminal.local:4173/play.html. Browser tab 2. Root owns all source and hosting. This agent made no source edits, no application-state mutations through evaluate, no Sites calls, and no direct application API calls.

## Verified human journey

1. Clicked Enter the living world. Started with 20 Marks, 10 wood, 8 stone, 4 food, 2 herb, and no crystal.
2. Clicked Connect N. Initially failed with `TypeError: crypto.randomUUID is not a function`; reported to root. Root fixed source. Reloaded once and restarted fresh, then verified Connect opens.
3. Clicked Buy 1 crystal while still at spawn. Rejected with “Walk to Vey’s Exchange first.” Visible 20 Marks and no crystal preserved.
4. Clicked Walk to Vey’s Exchange. Closed panel automatically, body physically moved. Reopened Connect near Vey at 5.5, 19.7. Bought 1 existing crystal; visible balance became 12 Marks and 1 crystal.
5. Clicked Walk to bridgehead. Premature build at 3.4,10.5 rejected; no materials spent. Closed panel and allowed actual simulation movement until 0.1,-3.5.
6. Built connected kit. Created The First Concord, The Listening Span, and Pip. Stone8→5, wood10→0, herb2→1. No crystal or food spent by the kit.
7. Loaded 1 crystal. Crystal1→0 and source charge0→24. Clicked load again: rejected, source charge remained24.
8. Fed courier. Food4→3. Assigned hearth request. Actual stone custody reduced pack5→4; courier had stone cargo and68 energy (after12 energy pickup). Before power, HUD explicitly reported no passable route.
9. Clicked Play connected score. Source24→16 after8 notes; span ACTIVE. Observed charge ledger24=16 source+7 stored+1 spent and actual note/arrival/route trace.
10. Closed all panels and let the courier physically travel. HUD changed0/2→1/2 and returning to pickup. Marks remained12.
11. Clicked Play connected score a second time after cooldown. Source16→8. Courier returned, picked up second actual stone, pack4→3, and traveled back across the span.
12. Observed HUD “A small promise, kept.” Connection panel confirmed2/2 stones delivered,4 Marks paid once, hero balance12→16, courier56 energy/empty cargo. Trace#56 actual second delivery followed by#57 four reserved Marks transferred once. Charge ledger at this observation24=8 source+6 stored+10 spent. Later screenshot24=8+5+11 as simulation advanced.

The complete human chain used ordinary visible buttons and real simulation time. No debug teleport, tick stepping, state injection, or authored result fabrication was used.

## Workshop exercised before the one necessary reload

Opened Create V, named a creature “Zephyr Courier,” clicked Save this blueprint. Created a new instrument, named it “Zephyr Canon,” edited Note1 to2 and Note2 to5 through spinbuttons, saved it, opened Blueprints. Both named recipes appeared at revision1. Did not instantiate these optional recipes or consume materials. The later reload intentionally discarded them because automatic saving was unavailable in this HTTP browser. This was reported to root.

## Typed agent console exercised through real UI

After2/2 delivery, expanded Invite an agent. Clicked Invite agent24commands. Visible grant epoch1/budget24.

Read the generated textarea value through a DOM-only element read. It was a walk to(0,-4), controlleragent, rulesanima-concord-1, epoch1, revision14, and a generated idempotency key. Clicked Execute agent command. Panel closed; budget became23 on reopening.

Filled the textarea with the identical previously accepted envelope and clicked Execute. Reopened panel: budget still23, proving the UI-visible duplicate did not consume another command.

Clicked Revoke agent access. Epoch advanced2/budget0. Filled the identical old envelope and clicked Execute. Rejected with “The human has not granted this agent authority, or revoked its grant.” Panel confirmed not invited/epoch2/budget0 and “state was preserved.”

These were actual UI interactions with the typed agent command surface. This is separate from the root/core agent’s direct command integration tests. It is not a WebMCP invocation.

## Observed defects and limitations

- Blocker fixed and retested: randomUUID unavailable in HTTP preview. Root added fallback IDs; Connect opened after reload.
- Persistent stale error toast after subsequent successful operations. Reported; root says fixed in latest source. This agent did not reload to validate that later patch.
- Simulation advanced much slower than wall time in this cloud browser;15wallseconds of walking produced roughly7worldunits. Reported. Root subsequently removed repeated canvas resizing; this agent’s completed chain ran older loaded code, so performance improvement is not validated here.
- This browser used the explicit cartographic Canvas fallback. **3D rendering, animation quality, WebGL performance and audio quality were not validated.** Screenshot shows overlapping world labels near the span and courier; root should improve crowded label placement.
- HTTP preview lacks cross-tab save locks; automatic saving was explicitly disabled by the game. No automatic reload-persistence claim is made.
- Clicked Journal→Export your world with download-event listener, but browser event timed out after3seconds, no application console error. Export/import roundtrip was not verified. Did not reload completed world.
- WebMCP capability documentation was read. `fetchTools()` reported `WebMCP modelContext is unavailable in the current page.` No WebMCP tools were called; no alternative unsafe app-state mutation was used.
- No mobile viewport setter was advertised in the browser controls; mobile layout was not exercised.
- Two-player combat, minigames, manual shape geometry, and arbitrary wiring were outside this bounded connection-focused playtest.

## Evidence and handoff

- `/workspace/scratch/anima-click-play-02-active-chain.jpg`: active span, real cargo, trace.
- `/workspace/scratch/anima-click-play-03-promise-kept.jpg`: world, span, returning courier,16Marks and completion HUD.
- `/workspace/scratch/anima-click-play-04-delivery-receipt.jpg`: actual2/2 delivery/payment trace and balanced charge ledger.

All three files were verified nonempty in the main filesystem. Initial screenshot01 did not synchronize and should not be linked.

Tab2 remains at the exact preview URL above, Connect panel open and simulation paused. Agent invitation revoked. World completed2/2; courier returning to pickup. Source loaded in the tab predates root’s later toast/performance/UI patches. Root may now resume browser ownership; this agent has stopped interactions.
