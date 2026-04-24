# Phase 9 execution checklist, maintenance program (placeholder)

Purpose: track the transition from **migration** (phased rebuild, URL parity, locale rollout) to **maintenance** (ongoing updates on live **`www`**). Normative phase summary: **`docs/grand-plan.md`** (Phase 9).

**Status:** **Phase 8 closed** **2026-04-14** (**`docs/phase-8-verification-record.md`** §Closure). **Active carries from Phase 8:** **P9-25** (post-cutover release discipline), **P9-26** (post-cutover organic monitoring, former **P8-26**). The **Agent Skills**, **production PR gate**, and **P9-00** governance rows remain **TBD** until Gustaf scopes them.

## Governance and scope (TBD)

- [ ] **P9-00** Document maintenance scope: what lives in this repo vs external tools; who approves content, **`de`** copy, and analytics changes.
- [ ] **P9-25** **Post-cutover release discipline** (carried from Phase 8 **P8-25** **2026-04-14**): Keep **`docs/phase-8-cutover-runbook.md`** **Post-cutover release discipline** section accurate; extend **`AGENTS.md`** if needed. **No direct pushes to `main`** for routine work; **PRs** with **Cloudflare preview deployments** per branch; **merge to `main`** promotes **`www`**. Align **GitHub** branch protection and **Cloudflare Workers** (or **Pages**) project settings with this flow.
- [ ] **P9-26** **Post-cutover organic monitoring** (carried from Phase 8 **P8-26** **2026-04-14**): For **2–4 weeks** after **`www`** cutover (**2026-04-14** baseline), monitor **GSC** coverage (new **404**s, soft **404**s, crawl anomalies), organic traffic trend vs **P8-08** baseline (**`docs/phase-8-verification-record.md`** §GSC baseline snapshot), indexed page count, and **Core Web Vitals** field data. Check **Google cache** (URL Inspection **View Crawled Page**) on key pages. Log dated rows in **`docs/phase-8-verification-record.md`** §Organic monitoring log (this file stays the cutover-era record until **`docs/phase-9-verification-record.md`** exists). Cadence: daily the first week, then bi-weekly through week **4**. If organic traffic drops **>30%** for **3+ consecutive days** without external cause, investigate and escalate. Check this row when the window is complete and there is no unresolved SEO regression, or document resolution in **`docs/migration-exceptions.md`** / verification notes with owner.

## Performance optimization Agent Skill

- [ ] **P9-10** Author a **Cursor Agent Skill** (or agreed equivalent) for **`site/`** performance work: when to run **`npm run build`**, **`npm test`**, **`npm run lighthouse:all`** (or **`LIGHTHOUSE_PATHS=...`** subset), how to read **`docs/performance-improvement-plan.md`**, and what counts as pass or needs exception.
- [ ] **P9-11** Publish the skill in the agreed location (maintainer **Cursor** skills directory, or repo-local **`.cursor/rules`**, plus a pointer in **`AGENTS.md`**).

## Content, SEO, and trust Agent Skills

- [x] **P9-12** Author a skill for **adding, editing, renaming, or removing pages** on **`site/`** (page shells, body registry, file-based routes, responsive images per **`docs/responsive-image-workflow.md`**, navigation/chrome, locale parity). Canonical file: **`skills/page/SKILL.md`**. Pointers: **`.claude/skills/page/SKILL.md`** (symlink) and **`.cursor/rules/page.mdc`**. Index row in **`skills/README.md`**; **`AGENTS.md`** layout + doc table updated.
- [ ] **P9-13** Author a **Cursor Agent Skill** for **SEO-related changes**: canonicals, hreflang, metadata, structured data, and alignment with **`docs/Andetag SEO Manual.md`**, **`docs/Tone of Voice.md`**, and **`docs/url-migration-policy.md`**. **First**, survey **open-source** Agent Skills (for example **Cursor** plugin skills, public skill repositories, or vendor skill catalogs) aimed at technical or content SEO; **install or adopt** a suitable baseline where license and fit allow, then extend with this project's docs and **source integrity** rules (no fabricated URLs or metadata; use agreed **`seo-content/`**, crawler artifacts, or approved source only).
- [ ] **P9-14** Author a **Cursor Agent Skill** for **updating testimonials and review data**: single source of truth is **`site/src/lib/content/stockholm-reviews.ts`** (`STOCKHOLM_RATING`, `STOCKHOLM_FEATURED_REVIEWS`, `STOCKHOLM_TRIPADVISOR_URL`). Skill covers: updating TripAdvisor numbers and featured reviews, verifying that changes propagate to JSON-LD schema (**`schema-org.ts`**), visual `TestimonialCarousel` (via page bodies), aggregate strip (**`stockholm-testimonial-aggregate.ts`**), and besökaromdömen page body content. Include verification steps: `npm test`, `npm run build`, spot-check `dist/` JSON-LD output. Reference **`docs/content-model.md`**, component usage, and **`docs/Andetag SEO Manual.md`** §6 (`aggregateRating` rule).
- [ ] **P9-15** Publish **P9-12**–**P9-14** in the same agreed locations as **P9-11** and add pointers in **`AGENTS.md`** (or a single maintenance-skills index if preferred).

## Production PR gate

- [ ] **P9-20** Define **mandatory** pre-merge checks for PRs that deploy to **`www`**: at minimum, the performance workflow from **P9-10** must run and pass unless waived (logged in **`docs/migration-exceptions.md`** or a Phase 9 verification note with owner).
- [ ] **P9-21** Optional: add or extend **CI** (GitHub Actions) for a performance budget or Lighthouse smoke on **`site/`** so the gate is not only manual.
- [ ] **P9-22** Record evidence model (where PRs or releases note “performance pass completed”).

## Verification record (when Phase 9 starts)

- [ ] Create **`docs/phase-9-verification-record.md`** when the program is no longer placeholder and sign-off is required (mirror Phase 8 record pattern). Until then, **P9-26** monitoring rows live under **`docs/phase-8-verification-record.md`** §Organic monitoring log.
