# Luma on the game website

The website opens the First Orchard at `/`, with the same game also available at `/play.html`. Select **Luma**, or press **G**, to compose a phrase, inspect its native writing, hear its letter score, and give a known word a form. Existing device saves use the same storage keys and save migration as the reviewed Luma release.

`/shared.html` opens the Living Commons. Its Luma tab records imagination, intention and personal experience, or enacts a funded contribution or offered gift. To try two characters, use separate browser profiles. Each profile still needs access to this private Site. Local Orchard goods do not fund the Commons.

## What changed for hosting

The website now serves the complete Luma release from GitHub commit `7f74d3ee7007e1afdc546274aa0ea476d2f0bcf9`. Before website adaptations, all 314 source files were compared with their Git blob hashes and matched, including the original HTML and both extracted fonts.

The Node SQLite service remains available through `npm run realm`. Sites runs Cloudflare Workers, so `server/hosted-authority.mjs` implements the same HTTP surface over D1. `scripts/build-hosted-rules.mjs` extracts the actual shared validation, Luma resolution, inventory transfers, action dispatch and state view from the Node authority. It changes only the two credential persistence hooks. Every build regenerates that module; the test gate also checks it for drift. The browser and language code use the reviewed release's rules unchanged.

One D1 transaction conditionally advances the stored realm from the revision the caller saw. Its credential changes, arrival record, resource journal and command receipt all use the winning transaction's unique marker. Losing concurrent commands commit none of those records. The stored arrival key yields the same credential after a lost reply; an exact accepted command replays its receipt. Agent allowance and resource movement remain part of the same stored state.

The D1 schema is the generated migration in `drizzle/`. No runtime code creates or alters tables. The hosting manifest selects the logical `DB` binding; Sites supplies the actual database. This creates a distinct online Commons, and does not upload either a private Node database or the browser's local saves. Redeployments keep the same Site and database binding.

The hosted adapter verifies each state's checksum, its schema and resource conservation, the matching journal head, and a replayed receipt's checksum and journal reference. It does not rerun the Node service's complete historical custody reconstruction on every request. Preserve D1 backups and history when maintaining this site. Approximate presence comes from recent actions and the current request, so it is not an exact online-user count.

Same-origin API checks, 16 KiB JSON bodies, credential validation and principal quotas apply at the request boundary. The existing Site audience remains unchanged. Game display names and session keys identify characters; they do not establish a verified human or wallet identity.

## Verification

The complete test suite passes **287 tests**: the previous 279 plus eight hosted-storage groups. The added groups use an isolated real local D1 runtime to check simultaneous arrivals, two characters gathering and building through native Luma, gifts, exactly-once settlement, losing revision races, complete rollback of a failing batch, agent permissions, session renewal, request limits, and damaged-record refusal. Test clocks are controlled; these are automated integration cases, not fresh human playthroughs.

`scripts/check-hosted-build.mjs` separately loads the emitted Worker and its packaged assets in the Cloudflare runtime, applies the migration to an isolated database, and exercises the actual built routes. Its report and the full test output are retained in `docs/audit/luma/website/`. No verification characters, inventories or credentials are inserted into the live database. Browser rendering, touch controls and pronunciation have not received a new visual or human review in this publication.

The transaction design follows Cloudflare's documented [D1 batch transaction behavior](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch). The production deployment remains the publication gate; a successful local build alone is not a live website.
