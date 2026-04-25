---
name: rollback
description: Use when a recent content change on the ANDETAG Astro site (site/) needs to be reverted — for example a page copy regression on live www.andetag.museum, an incorrect FAQ entry, a broken event block, a wrong price on a landing page, a bad image wiring, or a regretted testimonial update. Triggers include "revert that last change", "undo yesterday's FAQ edit", "roll back the ticket price bump", "pull the Art Yoga one-off block off the home page", "the new hero looks wrong on live — take it down". Produces a safe, auditable revert via git + PR + Cloudflare preview, verified before merge.
---

## Purpose

Cleanly roll back a recent content change using Git — creating a new commit that inverts the regression, opening a pull request, verifying the revert on a Cloudflare preview, and merging to promote the fix to `www`. The skill is written for the post-cutover release discipline (Phase 9 · **P9-25**): no direct pushes to `main`, every change lands via PR + preview + merge.

This skill is **not** for:

- **Infrastructure rollback** (DNS, Workers custom domain, TLS). That lives in `docs/phase-8-cutover-runbook.md` §Rollback procedure and requires Cloudflare dashboard access; escalate.
- **Schema-wide migrations** or anything that would force-push `main` — out of scope; escalate to Gustaf.
- **Amending or rebasing shipped commits.** Rollback is always *additive* (a new commit that inverts a prior one). Never rewrite history on `main`.
- Re-doing an edit the way it should have been done the first time — that is a regular content skill (`page`, `faq`, `events`, `operational-facts`, `images`, `testimonials`). Use rollback only to get back to a known-good state first; forward fixes follow separately.

## When to use

- A merged PR shipped a regression visible on `www` (copy, FAQ, event, price, image, testimonial).
- A multi-file edit introduced a partial break (JSON-LD invalid, build error only surfaced post-merge, layout regression on one locale).
- The user says "undo", "revert", "roll back", "take it off", "hide it", "pull it down" — or names a specific recent commit or PR.
- A content decision was reversed ("actually keep the old price", "restore the removed section").

## Files touched

Rollback touches whatever the original commit touched. The skill does not list specific site files; it **lists the git operations** and **the non-negotiable post-revert checks**. Auxiliary files that usually need parallel edits:

- `CHANGELOG.md` — add a `### Removed` or `### Fixed` entry under `[Unreleased]` naming the reverted PR/commit and the reason. One short bullet.
- `docs/seo/decisions.md` — if the reverted change had a `SEO-NNNN` decision row, append a dated note to the row ("reverted 2026-04-24 in commit abc1234"). For domain-specific decisions (operational facts, testimonials), check the §Decisions section of the relevant skill instead. Migration-era `EX-NNNN` rows in `docs/migration-exceptions.md` only matter for archived deviations.
- `docs/maintenance-backlog.md` — open a row (`M-NNNN`) describing the forward fix that needs to happen, if any.

## Locale parity rules

- If the original commit edited Stockholm `sv + en` bodies together, the revert must include **both**. Do not revert only one locale.
- Same for Berlin `en + de`. No cross-location parity (reverting a Stockholm FAQ does not imply touching Berlin).
- If the original commit included `site/public/_redirects` updates (a page rename), reverting the body alone is not enough — the redirect entry must also come out (or the rename's destination URL has to keep working). Check the full diff of the target commit carefully.

## Workflow

### A. Identify the commit to revert

1. Ask the user what they want rolled back. Preferred specificity: a PR number, a commit SHA, a merge commit, or a description narrow enough to grep.
2. Find the commit:

   ```bash
   git log --oneline -20                              # recent commits
   git log --oneline --grep "<keyword>" -10           # by message
   git log --oneline -- site/src/components/page-bodies/FaqSv.astro | head
   ```

3. Inspect the full diff before reverting:

   ```bash
   git show <sha> --stat        # overview
   git show <sha>               # full diff
   ```

4. Decide the scope:
   - **Full commit revert** — the whole commit was bad. Proceed to §B.
   - **Partial revert** — only some files in the commit should be inverted. Proceed to §C.
   - **Revert a range** — several recent commits must go. Proceed to §D.

### B. Full-commit revert (the common case)

1. Branch off `main` (assume we are at or can reach `main`; if not, escalate).

   ```bash
   git checkout main && git pull
   git checkout -b revert/<descriptive-slug>
   ```

2. Revert the commit. `git revert` creates a new commit whose diff is the inverse of the target; it does not rewrite history.

   ```bash
   git revert <sha>
   ```

   Git opens an editor with a default message of the form `Revert "<original subject>"`. Extend it to include **why** (e.g. `Revert "feat(site): update Art Yoga hero" — new hero washes out on mobile; will re-roll with lighter crop`). Keep the `This reverts commit <sha>.` trailer.

3. Inspect the resulting diff vs `main`:

   ```bash
   git diff main..HEAD          # should mirror the inverse of <sha>
   ```

4. Proceed to §E (verification).

### C. Partial revert (only some files from a commit)

1. Branch off `main`.

   ```bash
   git checkout main && git pull
   git checkout -b revert/<slug>
   ```

2. Revert without committing, then unstage the files you want to keep:

   ```bash
   git revert --no-commit <sha>
   git restore --staged --worktree -- path/to/file/that/should/stay
   ```

3. Review remaining staged hunks:

   ```bash
   git diff --staged
   ```

4. Commit with a descriptive message explaining **what was reverted** and **what was intentionally left in place**:

   ```bash
   git commit -m "Revert bad X from <sha>; keep Y which is still wanted"
   ```

5. Proceed to §E.

### D. Revert a range of commits

If merge order matters (usually the case for shipped content), revert **newest first**:

```bash
git revert <newer-sha> <older-sha>   # two separate commits, or
git revert -n <newer-sha> <older-sha> # single combined commit (prefer separate)
```

Prefer separate commits — they are easier to re-invert if you change your mind. Confirm `git log --oneline -5` shows the reverts in the expected order before pushing.

### E. Verify locally before pushing

Run from `site/`:

```bash
npm test          # 29 files, 134 tests at time of writing
npm run build     # 65 pages
```

Both must exit 0. If the revert resurrects old code that fails a test that is new (added after the bad commit), treat that as a separate test-maintenance item — escalate and discuss before forcing through.

Spot-check `dist/`:

- **Page-level regressions** — open the built `dist/<locale>/<path>/index.html` and confirm the reverted copy appears.
- **JSON-LD regressions** — grep `dist/<locale>/<path>/index.html` for the affected schema node and confirm it matches the old-and-correct form.
- **Locale pair** — check both `sv` and `en` (Stockholm) or `en` and `de` (Berlin) built outputs.
- **Redirects** — if `_redirects` was part of the revert, compare `dist/_redirects` to `site/public/_redirects`.

### F. Open PR, review preview, merge

1. Push the branch.

   ```bash
   git push -u origin revert/<slug>
   ```

2. Open a PR against `main` via `gh pr create`. Title template: `Revert: <short description>`. Body template:

   ```
   ## What this reverts

   - Commit `<sha>` ("<subject>") — shipped <when>.

   ## Why

   <one or two sentences — user-visible symptom, not speculative root cause>.

   ## Verification

   - [ ] `npm test` from `site/` — pass
   - [ ] `npm run build` from `site/` — pass
   - [ ] Cloudflare preview URL — affected page(s) spot-checked in `sv` and `en`

   ## Forward fix

   <linked maintenance-backlog id M-NNNN, or "re-land with corrected <thing>">
   ```

3. Wait for the Cloudflare preview deployment. Open the preview URL(s) of the affected page(s) and confirm the reverted state visually.
4. Merge to `main` once CI is green and the preview matches expectations. `main` → `www` via the existing `wrangler deploy` flow (see `docs/phase-8-cutover-runbook.md` §Post-cutover release discipline).

### G. Document the revert

1. Add a `CHANGELOG.md` entry under `[Unreleased]` — `### Removed` if the feature was taken back out, `### Fixed` if the revert corrected a visible regression. One bullet, link the original subject, name the reverting commit or PR.
2. If the reverted commit had a `SEO-NNNN` row in `docs/seo/decisions.md` or a §Decisions entry in a domain skill (e.g. `skills/operational-facts/SKILL.md`), append a dated note there.
3. If a forward fix is planned, open a `docs/maintenance-backlog.md` row (`M-NNNN`) with owner and notes.

## Verification

Covered inline in §E. Additional checks for specific revert shapes:

- **FAQ revert** — `npm test` covers `FAQPage mainEntity` count bounds in `schema-org.test.ts`; if the bad commit changed the FAQ count, the revert must restore the old count and the test must still pass.
- **Offer / price revert** — `schema-org.test.ts` pins the regular ticket price and offer-count lower bound; ensure the revert restores expected values.
- **Events revert** — check `art-yoga-next-occurrence.test.ts` for occurrence cadence or count assumptions.
- **Testimonials revert** — schema-org test has loose bounds; usually no test edit needed. Hand-sync the SEO-landing drift hotspots (see `skills/testimonials/SKILL.md` §Files touched) if the reverted commit had updated quote arrays.
- **Redirects revert** — `dist/_redirects` must match `site/public/_redirects`; there is no automated redirect test beyond the build itself.

## When to escalate

Stop and ask before proceeding if:

- The revert would remove a change that Gustaf explicitly approved (check `AGENTS.md` §Decision authority and `docs/phase-8-verification-record.md` §Closure sign-off lineage).
- The target commit has been built upon by many later commits and a revert would introduce a cascade of conflicts — treat as a forward fix instead; escalate for a plan.
- The regression is on **DNS, Workers custom domain, TLS, or edge caching** — that is the cutover-runbook rollback procedure, not this skill.
- The user requests a **force-push** or **amend** on `main`. Branch protection (Phase 9 · **P9-25**) forbids this; escalate.
- The target commit includes a database-style migration (content structure change in `page-shell-meta.json`, registry moves, hreflang pair changes). Coordinate with `skills/page/SKILL.md` — a naïve revert can orphan routes.
- The revert would leave `www` in a state inconsistent with external decisions already communicated (pricing announcement, event marketing). Confirm the user's intent before merging.
- The user needs an **urgent content takedown** that cannot wait for a Cloudflare preview cycle. Escalate — this may warrant a direct `main` push with Gustaf's explicit authorisation and a follow-up PR for cleanup.

## Examples

### Example 1: revert yesterday's FAQ copy edit that broke the English parity

Action:

1. `git log --oneline --grep "FAQ" -5` → `abc1234 content(site): refine "What is ANDETAG?" English copy`.
2. `git show abc1234` — confirm the bad commit touched only `site/src/lib/page-registry/stockholm-what-is-andetag-faq-copy.ts`.
3. `git checkout main && git pull && git checkout -b revert/faq-what-is-andetag-copy`.
4. `git revert abc1234`. Message: `Revert "content(site): refine ..." — English copy no longer mirrors Swedish; will re-roll after Malin's review`.
5. `cd site && npm test && npm run build`. Grep `dist/en/stockholm/faq/index.html` and `dist/en/stockholm/index.html` for the restored prose.
6. Push, open PR, verify on Cloudflare preview, merge.
7. `CHANGELOG.md` under `### Fixed`: `Reverted FAQ copy refinement (abc1234) pending review.`

### Example 2: partial revert — keep the correct price rise, undo the wrong daytime-price tweak from the same commit

Action:

1. Target commit `def5678` updated both the regular ticket price (correct) and the daytime-price variant (wrong).
2. `git checkout -b revert/daytime-price-only`.
3. `git revert --no-commit def5678`. The staged revert inverts both changes.
4. `git restore --staged --worktree -- site/src/lib/content/stockholm-offers.ts` for the section that *should* stay reverted, or selectively re-apply the regular-ticket hunk with `git checkout def5678 -- <path>` for the part that should stay.
5. Inspect with `git diff --staged`. Confirm only the daytime-price change is being inverted.
6. Commit with message: `Partial revert of def5678: undo daytime-price change; keep regular-ticket bump`.
7. Verify (`npm test && npm run build`), push, PR, preview, merge.

### Example 3: the new home hero image looks wrong on mobile

Action:

1. Likely commit touched `site/src/lib/content/stockholm-body-responsive-images.ts` and `StockholmHomeSv.astro` / `StockholmHomeEn.astro`.
2. Full revert: §B.
3. Derivatives still on disk — no cleanup needed; file bloat is negligible. Leave them. Note in CHANGELOG that the new hero is on hold.
4. Open `docs/maintenance-backlog.md` → new row `M-NNNN`: "Re-wire home hero with mobile-safe crop; candidate file and derivatives already exist at /wp-content/uploads/…".
5. PR → preview → merge.
