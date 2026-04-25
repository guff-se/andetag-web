---
name: performance-check
description: Use when running the performance workflow on the ANDETAG Astro site (site/) — before a release-sensitive merge, after image/header/CSS changes, or when a director asks for a performance check. Triggers include "run lighthouse", "check perf", "is the site fast enough", "what is the LCP on the home page", "do we regress on CLS", "verify perf before merging". Drives the existing npm scripts (npm run build, npm run lighthouse:all, perf:impact / perf:blocking / perf:consent), reads docs/performance-improvement-plan.md for current targets, and produces a pass / needs-exception decision.
---

## Purpose

Run the performance workflow consistently and decide whether a change passes. This skill is the **recipe**; the substance lives in `docs/performance-improvement-plan.md` (rolling targets, historical baseline, completed tracks, open hygiene). Other skills — `page`, `images`, `testimonials`, `rollback` — reference this recipe from their §Verification sections.

Also contains the **P9-40 stats bridge recipe** (per **P9-41**: no standalone doc; the recipe lives inside the skills that actually use it). Agents here can query GSC / GA4 through the sibling `andetag-stats` CLI; see §E.

This skill is **not** for:

- Writing or extending new performance optimisations (that is content / chrome work in the responsible skill; this skill only measures).
- Editing `docs/performance-improvement-plan.md` substance — the skill reads it; updates to the plan happen when a track moves from "Open" → "Done" in a content PR.
- Vendor-side asks (Understory gzip/Brotli **P3** etc.); those are tracked in the improvement plan, not here.

## When to use

- A PR is about to merge to `main` that touches image wiring, hero assets, header chrome, CSS bundles, JS bundles, or third-party integrations.
- A PR is about to merge to `main` that adds or renames pages (new routes go through the full Lighthouse sweep).
- Weekly or monthly audit: "how is performance trending".
- A finding from `skills/site-integrity/SKILL.md` or a GSC alert points at a performance regression.
- Before asking for a waiver: append a dated note to `docs/performance-improvement-plan.md` (Summary section), or open a Phase 9 verification note.

## Files touched

Read-only except the reports directory. The skill runs commands and reports; it does not edit source.

- `docs/performance-improvement-plan.md` — **read first**. Current lab picture, targets, LCP / TBT / CLS expectations, completed tracks.
- `site/package.json` → `scripts.lighthouse:all`, `scripts.perf:impact`, `scripts.perf:blocking`, `scripts.perf:consent`.
- `site/scripts/lighthouse-all-pages.mjs` — the batch runner; reads flags via env vars (`BASE_URL`, `LIGHTHOUSE_OUT`, `LIGHTHOUSE_MAX`, `LIGHTHOUSE_MIN`, `LIGHTHOUSE_PATHS`).
- `site/reports/lighthouse-performance.json` — batch output (gitignored); overwritten each run.
- `site/scripts/perf-third-party-impact.mjs`, `perf-render-blocking-audit.mjs`, `perf-consent-timing.mjs` — targeted drilldowns.

## Locale parity rules

Performance is measured per URL. A regression on `sv` with `en` clean (or vice versa) is still a regression and must be flagged; do not wave it through because the pair's other locale is fine.

## Workflow

### A. Decide the scope

Match the change shape to the run shape. Bigger scope = bigger cost; run what the change demands.

| Change shape | Run |
|--------------|-----|
| Single body edit (copy, FAQ entry) | `npm test` + `npm run build`. No Lighthouse unless the edit touches images or heavy scripts. |
| Image wiring (new figure, hero swap, gallery change) | §B subset (`LIGHTHOUSE_PATHS=<affected paths>`). |
| Chrome change (header, nav, fonts, CSS) | §B full (`npm run lighthouse:all`). |
| Third-party change (GTM, Consent Mode, new embed) | §B full + §D (third-party / render-blocking / consent-timing drilldowns). |
| Structural change (new route, rename, registry rewire) | §B full + `skills/site-integrity/SKILL.md` audit. |
| Release-sensitive audit (monthly / pre-merge of anything large) | §B full + §C aggregate review + §D if third-party changed. |

### B. Run Lighthouse

```bash
cd site
npm run build
npm run lighthouse:all        # 63–65 routes, mobile config, performance only
```

Output: `site/reports/lighthouse-performance.json` (gitignored; overwritten each run).

For a **subset**, pass `LIGHTHOUSE_PATHS`:

```bash
LIGHTHOUSE_PATHS=/sv/stockholm/,/en/stockholm/ npm run lighthouse:all
```

For a **hard gate** (fail the run if any route scores below N):

```bash
LIGHTHOUSE_MIN=85 npm run lighthouse:all
```

`LIGHTHOUSE_MIN=85` is the baseline threshold per `docs/performance-improvement-plan.md`. Lab noise may require occasional threshold tweaks — when in doubt, re-run once rather than lower the gate.

To measure against a deployed origin (preview or `www`) instead of local `serve`:

```bash
BASE_URL=https://<preview-url>.pages.dev LIGHTHOUSE_MIN=85 npm run lighthouse:all
```

### C. Read the report

The JSON contains one entry per URL. Aggregate picture to produce:

- **Score distribution** (min / mean / max across all URLs) and list any `score < LIGHTHOUSE_MIN`.
- **Slowest LCP** top 5 URLs with their LCP values.
- **CLS outliers** (anything above 0.05).
- **TBT outliers** (anything above 150 ms lab — PSI / real devices typically worse).

Compare against the table in `docs/performance-improvement-plan.md` §Current lab picture. Flag anything that moved **worse** by more than local-noise margin (treat a single-URL 1-point drop as noise; a consistent 3+ point drop across multiple URLs in the same family is real).

### D. Targeted drilldowns (when needed)

Run only when §B flagged a candidate and you need to identify cause.

- **Third-party impact**: `npm run perf:impact` → `site/scripts/perf-third-party-impact.mjs`. Useful after GTM, Consent Mode, or embed changes.
- **Render-blocking audit**: `npm run perf:blocking` → identifies scripts / CSS blocking first paint.
- **Consent timing**: `npm run perf:consent` → measures FCP / LCP with different consent choices (accept vs reject).

These are diagnostic, not gates. Use their output to write the fix; do not attach them to a PR unless a reviewer asks.

### E. P9-40 stats bridge — GSC / GA4 / sales queries via `andetag-stats` CLI

The sibling project at `../stats/` (separate Git repo `andetag-data`, sparse-checkoutable to `cli/`) owns credentials and the Supabase schema. This repo holds **no** extra secrets. Usage:

1. **Locate the CLI.** It may be cloned as a sibling of this repo (`../stats/`), or be absent. If absent, the user can clone it per the `cli/README.md` sparse-checkout recipe — do not attempt to reconstruct the schema from this repo.
2. **Run read-only queries.** Example commands (details in `../stats/cli/README.md`):

   ```bash
   cd ../stats/cli
   node dist/index.js kpis --days 30                      # top-line KPIs
   node dist/index.js query "traffic by source"           # GA4
   node dist/index.js query "top keywords"                # GSC
   node dist/index.js compare revenue "this month" "last month"
   ```

3. **When this skill uses the bridge:**
   - To verify that a performance regression correlates (or does not) with an organic-traffic anomaly in GSC.
   - To confirm that a route flagged by `skills/site-integrity/SKILL.md` still receives traffic (worth fixing) vs. is dead (lower priority).
4. **Guardrails:** The CLI is read-only. Do not pipe its output into repo files without the user's direction — query results are not source artifacts.

If `../stats/cli` is not installed, do **not** block the perf check; note in the report that the GSC/GA4 correlation step was skipped and why.

## Verification

The perf run is itself a verification. To confirm this skill was followed, a PR note or release entry should include:

- Commit SHA of the build measured.
- Run mode (`npm run lighthouse:all` full / subset with `LIGHTHOUSE_PATHS=…` / against `BASE_URL=…` origin).
- One-line aggregate (score min / mean, slowest LCP, CLS outliers if any).
- Pass / needs-exception decision.

Example:

> Perf: `abc1234` on `dist/` local serve — `npm run lighthouse:all` 65 URLs, min 88, mean 93, slowest LCP `/en/stockholm/privacy/` 3.8 s, CLS clean. Pass.

### Pass vs needs-exception

- **Pass** — no URL below `LIGHTHOUSE_MIN` (85 baseline), no new CLS outlier > 0.05 that was not already flagged, no regression > 3 points mean vs. the previous documented run in `docs/performance-improvement-plan.md`.
- **Needs exception** — any of the above, or a third-party / consent timing anomaly from §D that cannot be resolved in-PR. Log the waiver as a dated note in `docs/performance-improvement-plan.md` Summary (owner Gustaf, commit SHA), or in a Phase 9 verification note. Linked from the PR.

## When to escalate

Stop and ask before proceeding if:

- Lighthouse exits cleanly but several URLs drop >5 points relative to the current documented run, with no obvious culprit in the touched files. This is usually vendor drift (GTM, CMP, Understory) — flag to Gustaf before blaming the PR.
- `LIGHTHOUSE_MIN=85` fails on a URL that is already listed as an open item in `docs/performance-improvement-plan.md` (e.g. privacy, music, optical-fibre) — check whether the existing notes cover the regression; if yes, note that rather than escalating.
- The run crashes on headless Chrome or lighthouse itself (not a site issue). Retry once; if it recurs, escalate — the batch runner is the infrastructure, not the change.
- The user asks for a **PSI** (PageSpeed Insights, real Google) run. That is a manual browser step, not an npm script; the PSI URL and expected variance are documented in `docs/performance-improvement-plan.md` §Historical baseline. Offer the link and explain the difference from local `serve`.
- GSC / GA4 data requested but `../stats/cli` is not installed or authenticated. Do not fabricate numbers; report the gap.

## Examples

### Example 1: image swap on Stockholm home

Action:

1. `cd site && npm test && npm run build` — must pass first.
2. `LIGHTHOUSE_PATHS=/sv/stockholm/,/en/stockholm/ LIGHTHOUSE_MIN=85 npm run lighthouse:all`.
3. Compare the two scores + LCP against the table in `docs/performance-improvement-plan.md` §Current lab picture.
4. Pass note in PR: `Perf: Stockholm home pair lab run, min 94 / LCP 2.7 s — within current envelope.`

### Example 2: GTM or consent change

Action:

1. Full §B.
2. §D: `npm run perf:impact && npm run perf:blocking && npm run perf:consent`.
3. Read the three outputs; identify whether FCP / LCP shifted materially. Compare against the "P2 Third-party + first-party JS" row of `docs/performance-improvement-plan.md`.
4. If FCP regresses past ~1.7 s on Stockholm home, flag — that is the documented recovery point. Either fix in-PR or open an exception row.

### Example 3: monthly audit

Action:

1. §B full. §C aggregate review.
2. §E if you want to correlate with GSC/GA4: `stats query "traffic by source"` + `stats query "top keywords"` for this month vs last.
3. Summarise into a maintenance-backlog row (`M-NNNN`, owner `skills/performance-check`) with the run date and one-line summary; attach the JSON path if it was saved.
