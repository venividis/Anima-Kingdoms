# Anima Kingdoms — second implementation design challenge

12 September 2026. Read-only review of implemented `public/kingdoms.js`, the Connections interface in `public/app.js`, `public/canvas-view.js`, `public/creation-view.js`, and relevant creation, realm, navigation and save integration. This pass did not edit the Site or use a browser. Findings below are source-established behavior and design judgments; the browser-driving agent supplies separate observed evidence.

## What actually became connected

The implementation has moved beyond a decorative graph. `Creation.tick` emits notes from the same score cursor used for sound, then `Kingdoms.emit` spends one existing source charge for each matching link. Persistent packets travel according to the Kingdoms simulation clock. Their arrival supplies receiver charge; receiver state changes the surfaces/obstacles used by normal movement and navigation. A typed courier job takes one actual stone from the pack, physically walks, consumes it into the spent-material account at the hearth, and transfers four already reserved Marks after the second delivery.

The original design's important boundaries are present:

- Permanent structures change only through an explicit receiver conversion.
- Structures containing both solid gates and decks reject conversion, avoiding ambiguous combined collision semantics.
- There are two genuinely different receivers: a walking span and an opening solid gate.
- Packets persist outside the transient wave array that snapshots clear.
- A separate world-only clock pauses machines during exhibitions without compressing their remaining timers.
- Navigation includes `kingdoms.topology`.
- Human and invited agent transactions share an exact-envelope, clone-before-commit dispatcher.
- Current connection revision, grant epoch, bounded command budget and saved retained receipts are checked.
- The keeper's trading affordability subtracts the civic reservation.
- The source, in-flight, receiver, spent and dissipated charge accounts balance against burned crystals.
- Original water delivery and its separate twelve-Mark commission remain distinct.

The rule has changed from the preliminary design's 90 ticks per charge to **180 ticks / three seconds per charge**. The actual code therefore supplies up to 24 seconds of powered interval from an eight-note performance before occupancy holds; documentation must use the implemented coefficient. One crystal supplies 24 charge, allowing three eight-note single-receiver performances, subject to storage/fan-out and Breath. The source cap is effectively 72 units: fueling is allowed while its prior level is at most 48, then adds 24. Receiver storage is capped at sixteen units. These are finite local game coefficients, not evidence of balance or physical energy.

## Priority issue 1: the normal human interface only fuels the first instrument

In `connections()`, the source card is always selected with `k.sources[0]`. Its fuel and perform bindings then capture that first source's ID. The independent wiring dropdown can select another instrument, but changing it does not select that instrument for fueling. The world `creationDetails()` panel lets the player play a second instrument, but offers no fuel action. The public agent command can fuel any valid nearby connected instrument.

Consequently, the implemented data model supports multiple sources and up to twenty-four links while the normal human path can leave the second source permanently unfunded. A player who successfully builds a second creative network may believe its wiring is broken. The one-kit browser journey will not detect this.

**Small complete repair:** add explicit selected instrument/carrier/receiver controls for the operational cards, or place per-source fuel/play buttons beside each connected instrument in the wiring list. Selection must survive `connections()` refreshes and refer to a still-existing instance. The card should display that source's own charge, while a separate total can continue to show network-wide charge. Do not use the aggregate charge to imply that the selected instrument is fueled.

**Decisive browser case:** build/connect two instruments, choose the second, walk beside it, load one actual crystal into it, and play it. Confirm the first source's charge remains unchanged and the second's selected receiver receives the packet. Repeat after opening/closing the panel. An API-only second-source test is insufficient for this issue.

Related lower-priority asymmetry: the courier card selects an active job's carrier or otherwise the first creature. Human assignment has no alternative-creature selector, while the agent can name any legal carrier. If controls are being generalized, the same explicit-selection pattern should cover the carrier.

## Priority issue 2: the fallback renderer visually reverses gate state

The WebGL creation renderer handles receiver types separately: a dormant bridge fades, while an active/clearing gate fades. This corresponds to an absent walkway and an opened solid wall respectively.

The Canvas renderer currently uses `r?.status === 'dormant' ? .2 : 1` for every receiver. It therefore fades a closed blocking gate and makes an open nonblocking gate opaque. This is a direct contradiction between visible feedback and collision. It is particularly harmful in a creation game that asks the player to learn rules from their own construction.

**Small complete repair:** use the same type-and-state predicate in both renderers, ideally a shared pure presentation helper. A dormant bridge fades; an active or clearing gate fades; an active bridge and dormant gate are solid. The cartographic renderer should continue to identify itself explicitly as a different representation of the same world.

**Decisive case:** in forced Canvas mode, create and power a gate. Confirm its blocked/open movement state and its visual opacity change in the same direction as WebGL. Also check clearing: the opening stays visibly open while occupied.

## A small gift with direct practical value: “take me back to my promise”

Each job pins an exact pickup location, and the player's body must be within three steps to load the next stone or recover cancelled cargo. The interface says pickup stays where assigned and tells the player to return, but the only ready walking destinations are bridgehead and hearth. For a custom assignment made elsewhere, neither button identifies the actual pickup.

Add the exact pickup coordinates plus **Walk to this courier's pickup**, dispatching the existing normal `walk` operation to `j.pickup`. The player and agent then use the same actual navigation, the panel closes to let time progress, and manual movement can still cancel. This makes an otherwise invisible obligation legible and gives interrupted work a compassionate recovery affordance without inventing goods or teleporting.

If the route is still blocked, retain the actual cargo and state precisely what remains blocked. A button is not a promise of guaranteed path existence. A future nearby cargo-handoff operation would make fully interrupted recovery stronger, but it is beyond this smallest gift.

## Safety hold: honest now, mechanically permissive

The implementation deliberately chooses a global occupancy hold. `occupied()` tests the hero, pet, workers, living enemies and other creations against the receiver's collision footprint with an 0.8 margin. Once charge is exhausted, occupied receivers enter `clearing`. Both active and clearing bridges provide support; active and clearing gates remain open. No actor-specific admission lease exists.

The Connections copy accurately says that an occupied structure stays open until clear and that the safety hold also permits entry. That disclosure matters. Do not abbreviate this into “the bridge expires after three seconds per charge” without mentioning the hold.

The implementation is even more conservative than true support dependence: an adjacent body with independent original-ground support, or a placed object on a grounded portion of a long span, can keep the entire receiver in clearing indefinitely. This is not an inflation bug because the hold is declared; it does mean powered uptime is not a strict fuel-limited quantity. A creature parked on the bridge or an object placed after activation can hold a route open forever. No claim of a balanced energy economy should rely on span uptime under this rule.

For this release, retain the safety promise and disclose its permissiveness. A later improvement can distinguish genuine last-support dependency from proximity, or implement actor-aware admissions. Changing the rule later must not unexpectedly strand an accepted occupant or delete a placed creation.

## The first journey's costs are coherent; its freedom is narrower than the headline

The guided kit's code compiles three actual recipe instances and charges their actual costs transactionally. The stated bill, ten wood, three stone and one herb, matches the intended default composition: a stone instrument, wood span and wood creature. The fresh pack can afford those construction costs, retain two stones for the request, and feed the courier. Crystal purchase has a displayed actual market quote and a physical approach requirement; loading crystal and feeding are separate commands.

That is good onboarding: it creates a real setup through the same compiler rather than seeding a fake free success. It must still be described as a prepared starting composition. The guide only works when there are no existing authored instances. A returning v0.10 maker can therefore lose access to the easiest guided route merely by having any prior creation. Their real path is the more advanced custom wiring section. Browser evidence should cover at least one returning-world/manual-assembly case or disclose that the guided onboarding was tested only from an empty field.

The guide creates immutable instances, not automatically saved editable draft recipes. “Its three recipes remain editable in Create” is true only through inspecting an instance and creating a variation, not through finding all three as already saved shelf drafts. Prefer a direct “Create a variation” affordance per card, or wording that explains the exact existing route. A beginner should not need to infer blueprint/instance identity merely to change their starter melody.

Fan-out really spends finite fuel in stable link-ID order, but “divides finite fuel” can be misunderstood as splitting a single unit fractionally. One matching note requests one whole charge per link. Two accepting receivers therefore cost two charge for that note; if supply is short, earlier links consume it first. Say that explicitly in the advanced UI or contract. The fixed thirty-two-step connection range is independent of the instrument's ordinary wave reach and shape; do not present it as acoustic propagation through the world.

## One completed hearth is a chapter, not a living society

The civic implementation is exactly one fixed order: two stones at `(8,-27)`, four reserved Marks, one active consignment, two one-unit trips, one payment. Delivered stone is consumed into `spent.stone`, and a visible hearth appears. The creature's return trip remains part of its job after payment, which preserves a useful physical sense of completing the work.

There are no generated resident needs, repeated consumption, renewable production, competing settlements or endogenous demand in this increment. That finite request is honest and useful as a complete journey. Calling it a living society, dynamic market demand or a self-sustaining microeconomy would overstate it.

Migration can initialize the order unfunded if the old keeper has fewer than four Marks. That avoids minting money, but there is no later command that replenishes/reserves this initially unfunded order after the keeper earns more. The UI should say it is unfunded rather than offer a circular “feed then assign” instruction that must fail. A later explicit fund-order transaction can reserve four currently unreserved Marks; until implemented, do not imply all old worlds have a funded new quest.

The current request accepts any legal physical route through shared navigation. Keep that property. A permanent bridge or original hydraulic route may be the player's better solution. The connected machinery is valuable for expression, timed routes and gates, not because the economy has proved permanent bridges inferior.

## Traceability is useful but does not yet prove the entire story

The typed trace correctly retains note causes, arrival causes, receiver state, material pickup, delivery and payment. It is more useful than a celebratory generic event list. However, a courier's delivery cause points back to its pickup/previous delivery, not to a recorded traversal of a particular powered receiver. The trace does not currently certify that the paid stone crossed the Listening Span rather than a simultaneous permanent/hydraulic bridge.

Therefore the UI may present adjacent factual events, but release wording must not claim a full provenance proof of “this exact note made this exact paid delivery possible.” A small later route-witness event can record the actual receiver crossed and its open-state cause, then attach that witness to the carried lot. Even then, actual use and counterfactual necessity are different claims. Showing that a creature crossed one span does not prove no alternate route existed.

Trace retention is 120 events; public inspection shows the latest 24. Old cause IDs can therefore point to events no longer retained. This is a bounded explanation aid, not complete replay history. Account state and pinned receipts are the mechanical authority. A complete experiment/export should state when older explanatory events were truncated.

## Fallback art and control limitations to record

The cartographic fallback is worthwhile because it keeps the actual simulation playable when WebGL cannot initialize. It draws the authored parts, packets, links, cargo, combat bodies, surfaces and hearth rather than replacing the game with a static mockup.

It is a projection with simplified shapes, not the full 3D art experience. Its blueprint click rotates the display in discrete steps, with no WebGL-style orbit/zoom manipulation. State that plainly when assessing artistic completeness.

One additional source-level input concern deserves browser attention: world dragging changes `view.yaw`, and `toInput()` uses that yaw to rotate movement/aim, while `CanvasWorldView.project()` ignores yaw and leaves the map fixed. After dragging, keyboard directions and attack aim may rotate relative to an unchanged view. Either disable camera rotation in cartographic mode and keep explicit map-space controls, or rotate the projection consistently. This is independent of the gate-opacity correction and should be checked by the browser-driving agent before calling the fallback comfortably playable.

## What is worth celebrating after the fixes

The strongest advance is **a connected invention with custody and recovery**. A composed note can fund a real route; a created creature can use actual movement to carry a limited good; the recipient can consume that good and pay from a reserved balance. A stale agent request, a muted speaker or a saved checkpoint need not break the underlying accounting.

The second receiver, a switchable gate, matters because it adds a different spatial use rather than merely recoloring a bridge. The accurate safety-hold disclosure matters because it turns an edge-case concession into a visible rule a player can reason about. The proposed pickup-return button matters because small acts of care for a lost player are part of making an ambitious creation system usable.

Do not use these accomplishments to erase the unfinished shared-world, live model, renewable civilization and crypto settlement gates. The right final claim is that **Anima Kingdoms now contains its first complete local connected-creation chapter**, accompanied by separate human-style browser and typed-agent evidence, with exact limits and retained failure cases.
