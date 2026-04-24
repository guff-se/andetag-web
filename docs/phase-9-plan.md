# Phase 9 plan, maintenance program

Purpose: transition this repository from a phased build and migration project into an operational maintenance project for the live **`www.andetag.museum`** stack. Phase 9 is the **last** phase. When it closes there are no further phases, and build-era artifacts are archived so future agents work only with current, operational documentation.

**Status:** Scoped **2026-04-24** after Phase 8 closure **2026-04-14**. Expands and supersedes the placeholder scope in **`docs/phase-9-todo.md`** and the Phase 9 section of **`docs/grand-plan.md`**. **`docs/phase-9-todo.md`** is kept as a living checklist that reflects the work-stream ids in this plan; this plan is the normative reference.

---

## North-star user and operating model

Phase 9 must make this project safely and efficiently maintainable by **non-technical collaborators**, specifically the Stockholm and Berlin museum directors. Directors will not edit files directly. They interact with the repo through **agents**:

- **Path A:** **Cloud Claude Code** (Claude Code running in the cloud, tied to the repo). The agent opens PRs directly.
- **Path B:** **OpenClaw** (multi-platform agent, Peter Steinberger) reached from chat or messaging. OpenClaw invokes a **local Claude Code** subprocess through its ISession interface and opens PRs on behalf of the collaborator.

All collaborators have **full create and approve** rights on PRs. There is no separate review or approval hierarchy. Merge protection is the **Cloudflare commit-preview URL** auto-posted as a PR comment; that is treated as sufficient.

**Policy:** No direct pushes to `main`. All changes ship via PR. Approving a PR is near-zero friction and acceptable for any maintainer.

---

## Exit criteria (Phase 9 is done when)

1. A **collaborator onboarding guide** exists and has been validated by at least one non-maintainer director using one of the two paths above.
2. **Skills** cover every routine maintenance workflow (see §Skills). They live in **`/skills/`** with dual-compat pointers to **`.claude/skills/`** and **`.cursor/rules/`**.
3. An **agent can read GSC and GA4 data from this repository** without a human in the loop, via a bridge to the andetag-stats CLI.
4. **P9-26** organic monitoring window has closed with no unresolved regression, or any regression has a documented resolution.
5. All **build-era and migration-era docs** have been moved to **`docs/archive/`**. Active **`docs/`** contains only maintenance references.
6. **`AGENTS.md`** has been rewritten to describe the repo as a maintenance project. The word "phase" no longer appears in forward-facing docs.
7. **ADRs** **`decisions/0001-static-stack-selection.md`** and **`decisions/0002-consent-platform-selection.md`** are archived.
8. **`docs/phase-9-verification-record.md`** records sign-off (and is itself renamed or archived as part of §H).

---

## Work streams

Ids keep existing **P9-XX** numbers where they map, and add new ones for new work. Existing **P9-00**, **P9-10 to P9-15**, **P9-20 to P9-22**, **P9-25**, **P9-26** are re-scoped below. **P9-01** was previously merged into **P9-25**; new ids resume at **P9-02**.

### A. Governance and collaborator onboarding

- **P9-00** Governance is defined by publishing this plan: sole maintainer (Gustaf) plus directors as collaborators, all with create and approve rights; Berlin-specific work deferred to post-Phase 9.
- **P9-02** New file **`docs/collaborator-guide.md`** aimed at museum directors: what they can change, how to reach an agent (Path A or Path B), how to preview a change, how to merge, who to contact if something breaks. Written to be readable without dev background.
- **P9-03** Validate the guide with one Stockholm test run (director opens a small content PR via their chosen path). Record outcome in the verification record.

### B. Skills library

**Location and format:**

- Canonical source: **`/skills/<name>/SKILL.md`** (markdown with YAML frontmatter; Claude Code skill format).
- Claude Code pointer: **`.claude/skills/<name>/SKILL.md`** (symlink or stub that references the canonical file).
- Cursor pointer: **`.cursor/rules/<name>.mdc`** (thin frontmatter that includes or references the canonical file).

**Skill template must include:** purpose, trigger conditions, files read and written, locale parity rules that apply, verification commands (tests, build, lighthouse recipe where relevant), when to escalate, and example tasks.

**Priority order** (highest leverage for directors first):

- **P9-12** **Page skill:** add, edit, move, or remove pages. Covers file-based routes, page-shell-registry, page-body-registry, shell meta, content model, responsive image wiring per **`docs/responsive-image-workflow.md`**, navigation and chrome consistency, locale parity rules (**sv + en** for Stockholm pages, **en + de** for Berlin pages). Includes story-style and blog-style pages (no separate skill needed).
- **P9-16** **FAQ skill:** add, update, remove FAQ entries. Parity rule: Stockholm FAQ is **sv + en**, Berlin FAQ is **en + de**. No cross-location parity.
- **P9-17** **Events skill:** add, update, remove events. Uses existing event component model and Understory booking patterns.
- **P9-18** **Operational facts skill:** opening hours, ticket prices, public contact info. Single source updates that propagate to schema, page copy, and footer or header where relevant.
- **P9-19** **Image suggestion skill:** reads **`assets/images/photos.yaml`** (version 1; per-file sv + en + de alt text plus tags). Given page content, suggests a count and selection balancing relevance and variation. Outputs candidate filenames with rationale. Wires selected images through the responsive-image workflow.
- **P9-14** **Testimonials and reviews skill:** single source **`site/src/lib/content/stockholm-reviews.ts`**. Updates flow through to JSON-LD, aggregate strip, page bodies, and **`TestimonialCarousel`**.
- **P9-30** **Emergency content rollback skill:** revert a page or commit safely; verify routing, schema, and locale parity before merge; document exactly what was reverted.
- **P9-31** **Site integrity skill:** internal consistency and link-health checks. Covers: internal link resolution (every `<a href>` in built `dist/` resolves to a live route or documented redirect); external link health (HEAD-check, flag broken, permanent redirects, or long chains); locale parity (Stockholm **sv + en** pages symmetric, Berlin **en + de** symmetric); canonical and hreflang integrity (self-canonical, symmetric hreflang pairs, `x-default` where required); registry coherence (**`page-shell-registry`**, **`page-body-registry`**, navigation, **`_redirects`**, **`url-matrix.csv`** agree); image reference integrity (files referenced from page bodies, **`photos.yaml`**, and CSS exist on disk and resolve through the responsive pipeline); sitemap only lists canonical indexable routes; redirect chains are single-hop. Runs on demand and before release-sensitive merges; outputs a structured report that agents reference when fixing issues.
- **P9-10** **Performance check recipe:** when to run **`npm test`**, **`npm run build`**, **`npm run lighthouse:all`** (or **`LIGHTHOUSE_PATHS`** subset), how to read **`docs/performance-improvement-plan.md`**, what counts as pass. Referenced from every other skill.
- **P9-13** **SEO skill:** canonicals, hreflang, metadata, structured data. **Preceded by a short OSS skill survey** (public Claude Code skills, Cursor rules, community catalogs) to adopt any reusable baseline before authoring.
- **P9-11, P9-15** **Publish and index:** maintain a single **`/skills/README.md`** that lists every skill with a one-line purpose. Pointer files in **`.claude/skills/`** and **`.cursor/rules/`** are added when each skill is published. Add a pointer from **`AGENTS.md`** (and its maintenance-era successor).

### C. Stats and GSC integration

- **P9-40** Wire **`../stats/cli`** so agents in this repo can query GSC and GA4 without a human. Concrete form decided at implementation time; likely a documented shell recipe plus a helper script (for example **`site/scripts/stats.sh`**) or an MCP bridge. Auth uses the stats project's own **`.env`** and Supabase credentials; this repo holds no extra secrets.
- **P9-41** Document the recipe in the **performance** and **SEO** skills directly. No standalone integration doc; if one is needed temporarily, it goes in the skill folder and is removed when the skill is stable.

### D. Organic monitoring (P9-26 continuation)

- **P9-26** Monitoring window 2026-04-14 to between 2026-04-28 (2 weeks) and 2026-05-12 (4 weeks). Maintainer takes over the log. Backfill daily rows from 2026-04-14 through today, then bi-weekly through window end. Once **`docs/phase-9-verification-record.md`** exists, move the Organic monitoring log there from **`docs/phase-8-verification-record.md`**. Escalate if organic traffic drops **>30%** for **3+ consecutive days** without external cause.

### E. PR-gate convention (P9-20 to P9-22, simplified)

No CI Lighthouse budget. No human-gated checklist. Convention only.

- **P9-20** The agent performing a change runs the relevant skill's verification commands before requesting merge. If a check is skipped, the agent notes it in the PR body with a reason.
- **P9-21** Standing exceptions (for example a page that structurally cannot meet a performance target) get an **`EX-NNNN`** row in **`docs/migration-exceptions.md`** with owner and rationale. That file stays live post-Phase 9 under a neutral name if needed (see §H).
- **P9-22** No additional CI work unless a concrete need emerges; recorded and deferred.

### F. Release discipline (P9-25 continuation)

- **P9-25** PR-only workflow is documented in the collaborator guide (§A) and in the maintenance-era **`AGENTS.md`** (§H). Cloudflare commit-preview URL is the merge signal. No GitHub branch protection is configured; policy plus small team size is judged sufficient.

### G. Maintenance backlog

- **P9-50** Create **`docs/maintenance-backlog.md`**, a running list of one-time tasks that surface during Phase 9 and after. Format: short rows with id, title, status, owner, notes. Replaces ad hoc TODOs scattered in other docs.

### H. Archive sweep (final; runs after A through G are closed)

Objective: future agents must not confuse maintenance with migration. Any doc whose primary purpose was phased delivery moves to **`docs/archive/`**; only operational references remain in **`docs/`**.

- **P9-90** Move to **`docs/archive/`** the remaining phase and migration artifacts. Candidates (confirmed at execution time):
  - **`docs/phase-8-todo.md`**, **`docs/phase-8-verification-record.md`**, **`docs/phase-8-cutover-runbook.md`**
  - **`docs/phase-4-redirect-tests.md`**, **`docs/phase-4-routing-reopen.md`**
  - **`docs/phase-9-todo.md`** (superseded by this plan and the verification record)
  - **`docs/gtm-consent-migration-runbook.md`**, **`docs/cookieconsent-migration-plan.md`**
  - **`docs/decisions/0001-static-stack-selection.md`**, **`docs/decisions/0002-consent-platform-selection.md`**
  - **`docs/seo-backlink-opportunities.md`** if stale
  - **`docs/grand-plan.md`** (history; replaced by a short project-overview doc)
- **P9-91** Rewrite **`AGENTS.md`** as a maintenance guide: what the project is now (live site, two locations, three languages), collaborator model, skill index, operational docs list, conventions, testing commands. Phase vocabulary removed.
- **P9-92** Replace **`docs/grand-plan.md`** with **`docs/project-overview.md`**: current-state description suitable as the agent's mental model. Archived grand plan retained for history.
- **P9-93** Decide the disposition of mixed-use docs on a case-by-case basis. Keep live where content is ongoing (for example **`docs/phase-3-component-usage.md`** may be renamed to **`docs/component-usage.md`** and kept). Keep live in any case: **`Andetag SEO Manual.md`**, **`Tone of Voice.md`**, **`Visual Identity.md`**, **`content-model.md`**, **`url-migration-policy.md`** (pruned to current behavior), **`responsive-image-workflow.md`**, **`performance-improvement-plan.md`**, **`tracking-and-consent-requirements.md`**, **`kpi-measurement-map.md`**, **`changelog-standards.md`**, **`definition-of-done.md`** (rewritten as steady-state gates or archived), **`meta-texts-catalog.md`**, **`url-matrix.csv`** (if still used) or archived with a redirect note.
- **P9-94** **`docs/migration-exceptions.md`**: review every open **`EX-NNNN`** row. Close any that no longer apply; for rows that still matter in steady state, either keep the file under a neutral name (**`docs/exceptions.md`**) or fold the remaining rows into the relevant skill folder.
- **P9-95** Update **`CHANGELOG.md`** with the transition entry. Scan remaining live docs for references to archived files; repoint or remove.
- **P9-96** Remove **`docs/phase-9-todo.md`** from live docs after archiving it; this plan plus the verification record are the only Phase 9 references after closure, and they are themselves renamed or archived per **P9-99**.

### I. Phase 9 closure

- **P9-99** Create (or complete, if opened earlier) **`docs/phase-9-verification-record.md`**. Record Gustaf sign-off. Rename or archive the record to drop the phase label from forward-facing content. Announce closure in **`CHANGELOG.md`**.

---

## Ordering and dependencies

1. **Now (PR 1):** This plan doc plus `CHANGELOG.md` unreleased entry. No code.
2. **PR 2:** **P9-02** collaborator guide draft, **P9-50** backlog file.
3. **PR 3+:** **P9-40** stats bridge recipe in parallel with first skill work.
4. **Skill PRs** in priority order: **P9-12**, **P9-16**, **P9-17**, **P9-18**, **P9-19**, **P9-14**, **P9-30**, **P9-10**, **P9-13**, publishing via **P9-11** and **P9-15** at each step.
5. **Stream D monitoring** runs in the background throughout; closes with the 4-week window.
6. **PR for P9-03** validation after the first skills are usable.
7. **Final PR(s):** **P9-90** through **P9-99** archive sweep and closure.

---

## Non-goals

- No new product features unrelated to routine content updates (no booking flow changes, no new embeds, no admin UI).
- No Berlin launch work. Berlin-specific routing, copy, and schema changes happen **post-Phase 9**.
- No CI enforcement beyond current tests and build.
- No migration of content to an external CMS. Content stays in the repo.

---

## Open questions tracked

Resolved inside the relevant work item, not in this section.

- OSS SEO skill baseline choice: resolved during **P9-13**.
- Exact stats CLI bridge shape (shell, helper script, or MCP): resolved during **P9-40**.
- Which **`EX-NNNN`** rows survive into steady state: resolved during **P9-94**.
- Final live-doc list: resolved during **P9-93**.
