# Phase 9 verification record

Purpose: evidence and maintainer sign-off for Phase 9 checklist items that are not fully captured in the (now archived) `docs/archive/phase-9-todo.md` row text alone.

Normative plan (archived): `docs/archive/phase-9-plan.md`. Execution checklist (archived): `docs/archive/phase-9-todo.md`.

## Status

- **P9-20**–**P9-22** (PR-gate convention): **complete** **2026-04-25** — see §PR-gate convention (P9-20–P9-22).
- **P9-26** (post-cutover organic monitoring): **complete** **2026-04-25** — see §P9-26 (post-cutover organic monitoring).
- **P9-90**–**P9-99** (archive sweep and program closure): **complete** **2026-04-25** — see §Archive sweep and closure (P9-90–P9-99).

This record is itself archived as part of P9-99; forward-facing references should use `docs/project-overview.md` and `docs/seo/url-architecture.md` instead.

---

## PR-gate convention (P9-20–P9-22)

Normative definition (archived): `docs/archive/phase-9-plan.md` §E.

- **P9-20** The agent performing a change runs that skill's **Verification** steps (and any related commands in `AGENTS.md`) before requesting merge. If a check is skipped, the agent states that in the PR body with a short reason.
- **P9-21** Standing exceptions (for example a route that cannot meet a performance target without structural work) live as `EX-NNNN` rows in `docs/archive/migration-exceptions.md` (kept for archived deviations) or, for ongoing SEO-specific decisions, as `SEO-NNNN` rows in `docs/seo/decisions.md` with owner and rationale.
- **P9-22** No **in-repo CI Lighthouse budget**; optional GitHub Actions performance work stays **deferred** until a concrete need is recorded.

This record is the evidence model for "convention documented."

---

## P9-26 (post-cutover organic monitoring)

**Checklist complete 2026-04-25.**

The cutover baseline is **2026-04-14** (`docs/archive/phase-8-verification-record.md` §Closure). The 2–4 week observation window is **closed** for checklist purposes.

The §Organic monitoring log table in `docs/archive/phase-8-verification-record.md` was **not** filled with dated GSC rows. **Going forward**, read-only **GSC** / **GA4** spot work for agents uses the `andetag-stats` / `../stats/cli` bridge described in `skills/performance-check/SKILL.md` §E and `skills/seo/SKILL.md`.

No unresolved organic SEO regression was reported to the maintainer in the post-cutover period that would block this closure. If anomalies appear later, treat them as routine operations (and document standing constraints in `docs/seo/decisions.md` as needed).

---

## Archive sweep and closure (P9-90–P9-99)

**Closed 2026-04-25.** Phase 9 (and the migration program as a whole) is **complete**.

### P9-90 — archive build-era and migration-era docs

Moved to `docs/archive/`:

- `phase-3-component-inventory.md`, `phase-3-component-qa-checklist.md`, `phase-3-component-usage.md` (renamed at P9-93), `phase-3-verification-record.md`, `phase-3-todo.md`
- `phase-4-redirect-tests.md`, `phase-4-route-coverage.md`, `phase-4-routing-reopen.md`, `phase-4-todo.md`, `phase-4-verification-record.md`, `phase-4-404.md`
- `phase-5-todo.md`, `phase-5-verification-record.md`
- `phase-6-todo.md`, `phase-6-verification-record.md`
- `phase-7-todo.md`, `phase-7-verification-record.md`
- `phase-8-todo.md`, `phase-8-cutover-runbook.md`, `phase-8-verification-record.md`
- `phase-9-plan.md`, `phase-9-todo.md` (this verification record archived alongside them at P9-99)
- `grand-plan.md`, `url-migration-policy.md`, `migration-exceptions.md`, `definition-of-done.md`
- `gtm-consent-migration-runbook.md`, `cookieconsent-migration-plan.md`
- `seo-backlink-opportunities.md`
- `decisions/0001-static-stack-selection.md`, `decisions/0002-consent-platform-selection.md` (under `docs/archive/decisions/`; the empty `docs/decisions/` directory was removed)
- Earlier scaffolding: `parser-plan.md`, `existing-site-structure.md`, `phase-1-analysis-schema.md`, `design-extraction-method.md`, `routing-location-scoped-global-pages-plan.md`, `url-matrix-schema.md`

### P9-91 — `AGENTS.md` rewrite

`AGENTS.md` rewritten as a maintenance guide. Phase vocabulary removed; doc table now points at `docs/project-overview.md`, `docs/seo/url-architecture.md`, `docs/seo/decisions.md`, `docs/component-usage.md`, the live tone/visual identity/content-model/performance/tracking/KPI/responsive-image/maintenance-backlog/meta-texts docs, and `skills/README.md`.

### P9-92 — project overview replaces grand plan

`docs/project-overview.md` created as the current-state mental model (live host, audiences, locales, stack, what-lives-where, operating model, doctrine docs, where-to-start). Replaces the role of `docs/archive/grand-plan.md`, which is kept for historical reference only.

### P9-93 — mixed-use disposition

- `docs/phase-3-component-usage.md` → renamed to `docs/component-usage.md`. Reference repointed in `site/src/lib/content/stockholm-marketing-gallery.ts`, `site/src/components/embeds/BookingEmbed.astro`, `docs/responsive-image-workflow.md`.
- `docs/url-migration-policy.md` archived; SEO substance lives in `docs/seo/url-architecture.md`. References repointed in `site/astro.config.mjs`, `site/workers/entry-routing-logic.ts`, `site/public/_redirects`, `site/src/lib/routes/chrome-navigation-resolve.ts`, `site/src/lib/chrome/seo.ts`, `docs/Andetag SEO Manual.md`, `docs/content-model.md`, `docs/performance-improvement-plan.md`, `skills/site-integrity/SKILL.md`, `skills/page/SKILL.md`.
- `docs/phase-4-redirect-tests.md` archived; the live runner is `site/scripts/verify-staging-entry-routing.mjs`. Reference in that script and `docs/Andetag SEO Manual.md` repointed to the archived path.
- `docs/phase-4-routing-reopen.md`, `docs/phase-4-route-coverage.md`, `docs/phase-4-todo.md` archived; chrome-navigation-resolve and `seo.ts` references repointed to `docs/seo/url-architecture.md`.
- `docs/definition-of-done.md` archived (no live successor; live coherence rules are in `AGENTS.md` and per-skill verification sections).

### P9-94 — migration-exceptions disposition

`docs/migration-exceptions.md` archived. Active SEO-relevant rows already migrated to `docs/seo/decisions.md` as `SEO-NNNN` (IDs preserved from `EX-NNNN` for mental link continuity). Active operational decisions migrated to `skills/operational-facts/SKILL.md` §Decisions (`EX-0010` public contact email). Phase-only deviations (build, scaffolding, deployment) remain in the archived file. References to `EX-NNNN` rows in skills and live docs now point at `docs/archive/migration-exceptions.md` for traceability.

### P9-95 — references repointed in remaining live docs and skills

Repointed (non-exhaustive): `docs/Andetag SEO Manual.md`, `docs/content-model.md`, `docs/component-usage.md`, `docs/maintenance-backlog.md`, `docs/kpi-measurement-map.md`, `docs/performance-improvement-plan.md`, `docs/responsive-image-workflow.md`, `docs/tracking-and-consent-requirements.md`, `docs/seo/README.md`, `docs/seo/url-architecture.md`, `docs/seo/decisions.md`, `skills/README.md`, `skills/page/SKILL.md`, `skills/operational-facts/SKILL.md`, `skills/rollback/SKILL.md`, `skills/seo/SKILL.md`, `skills/site-integrity/SKILL.md`, plus the site-code paths listed under P9-93. CHANGELOG entry added.

### P9-96 — phase-9-todo removal

`docs/phase-9-todo.md` archived. Day-to-day backlog work tracks in `docs/maintenance-backlog.md`.

### P9-99 — closure

This verification record updated with archive-sweep evidence (above) and archived as `docs/archive/phase-9-verification-record.md`. Closure announced in `CHANGELOG.md`. From this point forward the project operates as a maintenance repository: routine work flows via skills, PR previews, and merge-to-`main`; doctrine lives in the live docs listed in `docs/project-overview.md` §Doctrine docs.

---

## Sign-off

- **Gustaf:** **Approved** (P9-26 monitoring, P9-20–P9-22 PR-gate convention, and P9-90–P9-99 archive sweep + program closure recorded **2026-04-25**).
- **Date:** **2026-04-25**
