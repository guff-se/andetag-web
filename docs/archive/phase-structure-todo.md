# Side phase: `site/src/` structure refactor (execution checklist)

**Authority:** `docs/decisions/0003-site-src-structure.md` (locked names) and `docs/site-structure-refactor-plan.md` (inventory, risks, doc sweep, **no user input** policy).

**Single-session rule:** The maintainer agent completes **S0–S8** in one run when possible. Do not pause for stakeholder review, browser QA, or optional choices: **CHANGELOG** handling and **S7 skip** are fixed in the plan §6.

**After each phase (or once after S1–S6 if doing a single batch):** `cd site && npm test && npm run build`, then the stale-path steps in `docs/site-structure-refactor-plan.md` **§6.1**. Update docs in the same change set as code.

## Baseline (S0, before S1)

- [x] Record baseline commit: run `git rev-parse HEAD` from the **repo root** and paste the full hash on the line below when executing.
  - Baseline hash: `9e187b65ee63db8a62183cf029740c527c329408`
- [x] `cd site && npm test && npm run build` (green)

## Phases

- [x] **S1**: Renamed the chrome Astro folder under **`site/src/components/`** to **`chrome`**; imports updated; test + build + stale grep
- [x] **S2**: Renamed chrome model TS under **`site/src/lib/`** to **`chrome`**; imports and docs updated; test + build + stale grep
- [x] **S3**: Renamed per-route body Astro folder to **`page-bodies`** under **`site/src/components/`**; **`[...slug].astro`** and cross-imports updated; test + build + stale grep
- [x] **S4**: Renamed body registry TS folder under **`site/src/lib/`** to **`page-registry`**; imports updated; test + build + stale grep
- [x] **S5**: Renamed TS UI helpers folder under **`site/src/lib/`** to **`ui-logic`**; imports updated; test + build + stale grep
- [x] **S6**: Renamed client-side TS folder under **`site/src/`** to **`client-scripts`**; Astro imports updated; test + build + stale grep
- [x] **S7**: **N/A (default):** do not add `tsconfig` aliases or rename `lib/routes/` in this run (see plan §6 Phase S7)
- [x] **S8**: CI check (workflow paths), `npm test` + `npm run build`, final §6.1 verification on `site/src` + `docs` + `AGENTS.md`; Vitest registry parity; optional repo link script if defined

## Closure

- [x] `docs/site-structure-refactor-plan.md`: status **complete**, completion date, link to ADR 0003
- [x] `CHANGELOG.md` **Unreleased**: historical-paths note + maintainer-facing path summary (do not rewrite old changelog bullets)
- [x] `AGENTS.md`: Code Layout tree and doc table rows match final paths
- [x] Grep: zero stale old-path strings in `docs/` and `AGENTS.md` (per plan; `CHANGELOG` history exempt)
