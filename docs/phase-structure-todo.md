# Side phase: `site/src/` structure refactor (execution checklist)

**Authority:** `docs/decisions/0003-site-src-structure.md` (locked names) and `docs/site-structure-refactor-plan.md` (inventory, risks, doc sweep, **no user input** policy).

**Single-session rule:** The maintainer agent completes **S0–S8** in one run when possible. Do not pause for stakeholder review, browser QA, or optional choices: **CHANGELOG** handling and **S7 skip** are fixed in the plan §6.

**After each phase (or once after S1–S6 if doing a single batch):** `cd site && npm test && npm run build`, then the stale-path steps in `docs/site-structure-refactor-plan.md` **§6.1**. Update docs in the same change set as code.

## Baseline (S0, before S1)

- [ ] Record baseline commit: run `git rev-parse HEAD` from the **repo root** and paste the full hash on the line below when executing.
  - Baseline hash: *(agent fills on execution)*
- [ ] `cd site && npm test && npm run build` (green)

## Phases

- [ ] **S1** — `git mv` `site/src/components/layout` → `site/src/components/chrome`; fix imports; test + build + stale grep
- [ ] **S2** — `git mv` `site/src/lib/layout` → `site/src/lib/chrome`; fix imports + doc paths; test + build + stale grep
- [ ] **S3** — `git mv` `site/src/components/pages` → `site/src/components/page-bodies`; fix `[...slug].astro` and cross-imports; test + build + stale grep
- [ ] **S4** — `git mv` `site/src/lib/pages` → `site/src/lib/page-registry`; fix imports; test + build + stale grep
- [ ] **S5** — `git mv` `site/src/lib/components` → `site/src/lib/ui-logic`; fix imports; test + build + stale grep
- [ ] **S6** — `git mv` `site/src/scripts` → `site/src/client-scripts`; fix client imports; test + build + stale grep
- [ ] **S7** — **N/A (default):** do not add `tsconfig` aliases or rename `lib/routes/` in this run (see plan §6 Phase S7)
- [ ] **S8** — CI check (workflow paths), `npm test` + `npm run build`, final §6.1 `rg` on `site/src` + `docs` + `AGENTS.md`; Vitest registry parity; optional repo link script if defined

## Closure

- [ ] `docs/site-structure-refactor-plan.md`: status **complete**, completion date, link to ADR 0003
- [ ] `CHANGELOG.md` **Unreleased**: historical-paths note + maintainer-facing path summary (do not rewrite old changelog bullets)
- [ ] `AGENTS.md`: Code Layout tree and doc table rows match final paths
- [ ] Grep: zero stale old-path strings in `docs/` and `AGENTS.md` (per plan; `CHANGELOG` history exempt)
