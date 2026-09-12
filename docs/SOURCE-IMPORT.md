# Anima Kingdoms source import

Date: 2026-09-12. Destination: [venividis/Anima-Kingdoms](https://github.com/venividis/Anima-Kingdoms), a private repository supplied by the owner.

## What is preserved

The recovered release contains 197 source, documentation, test, artwork and browser-evidence files. An independent read-only review verified every file against the original Git checkout and reran the regression suite: **119 passed, 0 failed, 0 skipped**. This import did not repeat browser playtesting or deploy the Site. Retained browser evidence belongs to the prior release.

All four original development snapshots were recreated in order. Each GitHub tree SHA exactly matches its original tree SHA, which verifies file paths, modes and contents across the complete snapshot. GitHub import commits have new IDs because the connector creates commits with new metadata and a required parent; these are not the original commit objects. A bootstrap README commit precedes the imported snapshots.

| Original commit | GitHub import commit | Identical tree | Files |
|---|---|---|---:|
| `7f913b352fbc3ccfbe069fb518951b256cce0b61` | `2a7a6e31fe3f0ba4d105481193c9ccc17248b5a1` | `4e325538b7293d6a636efabac3896150992e133a` | 15 |
| `08d3696151f110d1af49c146c72419fbfe2c3abd` | `94ac798bf2da071d5cf3f2a1564a0b24dd0a0dab` | `a9eeaf1f5a1f2aca0a80e40fa7bcd1e3c9fce443` | 48 |
| `056a21b3628e5a588a8a5a38275e2dd7f7f8162c` | `d1ec563ebfb17ddc803920b5c8b5ce6facb0861a` | `cb24bfc50136f67b32d3bab18ffcdcf13cd15cca` | 74 |
| `04288a1f89ae410e957e2e870a089b0ffb7038bb` | `15ca42b9e8f162974ac710ab9cf3c6a7eaaef75e` | `21c4a41993888bc893083ccfb1615dda95a1d3b0` | 197 |

A final import commit adds this provenance document, an independent review and the exact original history bundle, and updates repository instructions. Gameplay and artwork are unchanged by that documentation commit. Historical documents that describe a missing repository refer to the earlier release, before the owner supplied the destination URL.

## Exact original history

[`archive/Anima-Kingdoms-history.bundle`](../archive/Anima-Kingdoms-history.bundle) retains all four original commit objects, including their original identities and parent relationships. Its main branch ends at `04288a1f89ae410e957e2e870a089b0ffb7038bb`.

Bundle SHA-256: `2608f9b95a4f4ae6cacae72839ceb1c28d3193b9b4fea43eabf9be351b0593db`.

To inspect that original history in a separate directory, from this repository root:

```sh
git bundle verify archive/Anima-Kingdoms-history.bundle
git clone -b main archive/Anima-Kingdoms-history.bundle ../Anima-Kingdoms-original-history
```

The bundle is an archive, not the remote used for ongoing development. Use the GitHub repository for new work. No credentials or installed dependencies are included.

## Product boundary

The First Concord is a playable local browser prototype with connected creations and a shared command contract for human controls and bounded scripted agents. It is not an online MMORPG, connected language-model service, wallet or token network. Repository publication changes source availability to authorized collaborators, not those capabilities. The private playable Site remains at [the existing play URL](https://awe-first-orchard.edwincardenas.chatgpt.site).
