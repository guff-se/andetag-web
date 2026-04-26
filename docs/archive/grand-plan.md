# ANDETAG Rebuild Grand Plan

Purpose: rebuild `https://andetag.museum` as a lightweight static site with preserved URLs, similar visual design, and AI-agent-managed updates.

## Success Criteria

- All important current URLs remain live with no SEO regression.
- The new site is materially lighter and faster than the current WordPress/Elementor setup.
- Visual identity, tone, and core UX patterns remain recognizably ANDETAG.
- Content and structure are maintainable through clear source files and agent workflows.
- Primary business KPI is improved completed-ticket-purchase outcomes.

## Non-Negotiables

- Preserve existing URL paths when possible, and add redirects when path changes are unavoidable.
- Keep multilingual architecture (`sv`, `en`, `de`) and hreflang relationships coherent.
- Treat `site-html/` as canonical migration input for deterministic extraction and rebuild.
- Self-host all first-party assets in the rebuilt Astro site, never reference old-site absolute asset URLs for internal JS, CSS, images, video, fonts, or other media.
- Validate each major milestone with Gustaf before proceeding to the next phase.
- Build Swedish Stockholm first, complete and approve it before localization and Berlin rollout work.
- Localization sequencing rule: defer all localization work, including content and header localization, until Swedish content migration is completed and approved through Phase 5.

## Business Objectives and Conversion Strategy

### Business Context

- ANDETAG is an immersive museum with current operations in Stockholm and **Berlin opening in fall 2026**.
- Ticket sales are the core business model, with regular admission representing 80 to 90 percent of revenue.
- Events (Art Yoga now, Breathwork later) are recurring and use the same external ticketing platform.
- Private and corporate event requests route to email (lead flow, not direct checkout).

### Primary KPI and Funnel Model

- Primary conversion is completed purchase only.
- Website role is funnel optimization into the booking widget and event-specific ticket flows.
- Booking and purchase metrics are measured in the ticketing platform, while source attribution is preserved via GTM.
- No urgency mechanics and no upsell mechanics are required in this phase.

### Audience and Demand Priorities

- Core audience today is locals, with increased tourist capture as a strategic growth goal.
- Secondary search/funnel intents include couples, companies, and mindfulness/yoga audiences.
- Market planning assumption: Berlin demand target is roughly 2x Stockholm volume over time.

### Commercial Offer Structure

- Standard tickets: adult, child, reduced (student/retiree), with daytime pricing and full-price evening/weekend.
- Event-specific tickets are separate products in the same ticket system.
- Corporate/private event conversion path is a direct email contact flow.

### Rollout and Localization Strategy

- Build order: Swedish Stockholm first, then language and destination expansion.
- Localization execution timing: complete Phases 2 through 5 for Swedish content first, then start localization waves (`en`, `de`) including localized headers and page content.
- Target language and destination model after first release:
  - Stockholm: Swedish and English
  - Berlin: German and English
- Information architecture should support language plus destination selection to avoid future IA rewrites.

### Tracking and Attribution

- GTM is the required tag orchestration layer.
- Keep attribution coverage for analytics, Meta, and Google Ads through GTM.
- Rebuild consent gating compatible with static delivery and GTM-controlled tags.

## Recommended Delivery Phases

### Phase 0, Foundations and Guardrails

Goal: create the project guardrails before building pages.
Execution checklist: `docs/phase-0-todo.md`
Status: complete (approved on 2026-03-22).

Deliverables:
- URL migration policy: direct mapping + redirect handling strategy.
- Content model definition (page frontmatter, shared data, component props).
- Definition of done for each phase (performance, SEO, accessibility, visual parity).

Acceptance checks:
- Agreed architecture document.
- Initial CI checks (build, lint, link validation if available).

### Phase 1, Existing Site Analysis and Documentation

Goal: complete source-of-truth documentation of current site behavior and structure.
Starting point note: review existing analysis first in `docs/existing-site-structure.md` and `docs/parser-plan.md`, then extend and validate rather than redoing from scratch.
Execution checklist: `docs/phase-1-todo.md`
Status: complete (approved on 2026-03-22).

Deliverables:
- Inventory of all pages, locales, URL paths, templates, and integrations.
- Header/footer variants and menu structures documented.
- Design token baseline (colors, typography, spacing, breakpoints, shadows) extracted from CSS across all relevant page and template files, not from a single CSS file assumption.
- Component inventory from real pages (buttons, hero/video, embeds, testimonials, booking widget, info boxes, maps, FAQ accordions).
- Final static stack and hosting decision documented after analysis (framework, build/deploy flow, and platform constraints).
- Source-backed manifests based on preliminary docs:
  - Template variant registry (hero headers, small headers, brand header, language-specific footers).
  - Widget coverage matrix (`data-widget_type` families and page usage).
  - Integration retention map (keep, remove, replace) aligned with business decisions.

Acceptance checks:
- Every URL in current page inventory mapped to a planned static route.
- Gaps/unknowns explicitly listed (no invented behavior).
- Phase 1 exit gate: static stack and hosting must be selected before Phase 2 starts.

### Phase 2, Shared Layout System (Headers, Footers, Navigation)

Goal: build robust shared layout variants before page implementation.
Execution checklist: `docs/phase-2-todo.md`
Status: complete (final sign-off 2026-03-22, Gustaf). Sign-off record: `docs/phase-2-todo.md` (Final sign-off section).

Deliverables:
- Unified header/footer architecture with a Swedish-first working baseline, and no localized header rollout before Swedish Phase 5 completion.
- Navigation data model and render logic for all current menu structures.
- Language switcher behavior defined and implemented for static routing.
- Footer legal/metadata/script slots designed for safe reuse.
- Internal media references localized to Astro-hosted paths with source-backed files in the project asset structure.

Acceptance checks:
- Snapshot review of each header/footer variant on desktop/tablet and mobile.
- Mobile-first cross-browser QA for layout sign-off on iOS Safari and Chrome (iOS), plus desktop Chrome and Safari.
- Link parity checks against current nav and footer destinations.

Key outcomes (carry-forward to later phases):
- Shared Swedish hero and small-header variants are source-backed, approved for current visual baseline, and wired through shared layout primitives.
- Shared Swedish footer variant parity is established with source-backed route targets and legal/social structure.
- Layout-level accessibility baseline is in place (landmarks, skip-to-main, keyboard focus treatment, and mobile menu focus behavior).
- Layout parity checks are complete for approved variants and no absolute old-site internal media/CSS/JS asset URL dependencies remain in layout source.

### Phase 3, Design Component Library and Verification Page

Goal: build a reusable component system with explicit visual approval workflow.
Execution checklist: `docs/phase-3-todo.md`
Status: complete (approved 2026-03-22).

Deliverables:
- Reusable components with stable APIs (button, hero, section wrappers, testimonial, FAQ, gallery, embeds, booking module, info boxes, map block, etc).
- Internal consolidated verification route for all variants/states (historical; route removed after 2026-03-22 sign-off).
- Documentation per component: purpose, props, content constraints, and usage examples.

Acceptance checks:
- Gustaf signed off the consolidated component verification pass before page-by-page migration starts.
- Responsive checks completed for each approved component.

Verification record: `docs/phase-3-verification-record.md`. Showcase Lighthouse Performance on mobile may fall below the nominal Phase 3 DoD target because all embeds and media load on one internal page; see **EX-0006** in `docs/migration-exceptions.md`. Migrated pages remain subject to Phase 5 performance gates.

Carry-forward to Phase 4 and Phase 5:
- Implement routes and redirects using stable component contracts from `docs/phase-3-component-usage.md` and `docs/content-model.md`.
- Migrate pages using Phase 3-validated components; avoid duplicating one-off styles outside `site/src/styles/components.css` unless logged as a migration exception.
- Revisit global performance when consent-gated and lazy embed loading lands in Phase 7.

### Phase 4, Routing and URL Preservation

Goal: implement complete route coverage and migration-safe URL handling.
Execution checklist: `docs/phase-4-todo.md`
Status: **complete** (approved 2026-03-23). Redirects verified on Workers; see `docs/phase-4-verification-record.md` and `docs/phase-4-redirect-tests.md`.

Deliverables:
- Static route tree covering all existing paths (including language prefixes), each route with shared layout and real head metadata; main page content and design parity are Phase 5.
- Redirect rules for aliases, legacy patterns, and unavoidable route changes.
- Canonical and hreflang generation wired for all routes.
- 404 strategy and language-aware fallback behavior.
- XML sitemap generation is deferred to Phase 7 (canonical URLs only, per URL policy).

Acceptance checks:
- Route coverage report showing 100% mapping of known URLs.
- Redirect test list validated.

**Phase 4 follow-up (entry routing, `/sv/`, parity):** **As of 2026-04**, the expanded model is **implemented** in **`site/workers/`**, **`site/public/_redirects`**, **`docs/url-matrix.csv`**, and **`page-shell-registry`**. Live contracts: **`docs/url-migration-policy.md`** (**Current routing architecture** and **Entry routing**), **`site/workers/entry-router.ts`**, and **`docs/phase-4-redirect-tests.md`**.

### Entry routing and URL expansion schedule (historical delivery map)

Source: `docs/phase-4-routing-reopen.md` and `docs/url-migration-policy.md`. This table recorded **when** work landed relative to phased delivery; use it for audit context. For **current** behavior, read **`docs/url-migration-policy.md`** (**Current routing architecture**).

| Deliverable | Phase | Rationale |
|-------------|-------|-----------|
| **`url-matrix.csv`**, `phase-4-route-coverage.md`, and registry updates for **`/sv/stockholm/`**, legacy **`/`** Swedish home handling, and **Berlin or Stockholm parity paths** (shells first) | **Phase 5, early** | Edge logic must not **302** to missing routes. Add or adjust static Astro routes and documented redirects before turning on production Worker behavior. |
| **Swedish Stockholm home** at **`/sv/stockholm/`** (migrated content, not placeholder-only) | **Phase 5, early-to-mid** | Humans and bots depend on a real **200** Swedish home; completed for Swedish. |
| **English hub** at **`/en/`** and **English locale page bodies** (including **`/en/stockholm/`**), with **localized header and footer** content | **Phase 6** | Stakeholder decision 2026-03-24: ship English **main content** together with **localized chrome** after Swedish Phase 5; **`/en/`** may stay shell-only **200** in Phase 5 where policy allows until Phase 6. |
| **Berlin parity**: new routes and migrated **English Berlin** pages needed for launch | **Phase 5, mid** (continue as needed) | Parity is content plus routing; prioritize after core Swedish Stockholm migration wave is underway, unless business gates launch on Berlin sooner. |
| **Berlin parity**: **German** Berlin pages and locale QA | **Phase 6** | Matches existing rule: non-Swedish locale rollout after Swedish Phase 5 completion; English Berlin can precede or overlap per launch plan. |
| **Cloudflare Worker** (or equivalent edge) implementing **`/`**, **`/en/`**, cookie **set or read**, **`Accept-Language`** parsing, **verified-bot** branch | **In repo 2026-04-04** (**`site/workers/`**, **`wrangler deploy`**) | Staging or preview verification: **`docs/phase-4-redirect-tests.md`** table **B**. Static **200** targets were satisfied before enable (Phase 6 English or Berlin bodies closed). |
| **Production enable** of entry Worker on **`www.andetag.museum`** (DNS or custom domain to this stack) | **Phase 8** | Staging verification (**`P5-06`** on **`andetag-web.guff.workers.dev`**) precedes cutover; **`www`** table **B** and Gustaf sign-off are **`docs/phase-8-todo.md`**. |
| **CMP** listing for **`andetag_entry`** as **`necessary`** (essential or functional) | **Phase 7** embed + **Phase 8** GTM (**P8-07**) | Aligns with consent platform go-live and audit checklist; cookie may already be set by the Worker in Phase 5 or 6. |
| **Sitemap and `robots.txt`** including new canonical entry URLs | **Phase 7** | Sitemap is already a Phase 7 deliverable; ensure **`/sv/stockholm/`**, hub, and parity URLs appear only as canonical **keep** rows. |
| **`docs/Andetag SEO Manual.md`** and hreflang or **`x-default`** examples for new entry behavior | **Shipped in repo 2026-04-04** (sections 12, 14, **`/`** and **`/en/`** live behavior table); **Phase 7** final audit remains | Examples match **`docs/url-migration-policy.md`** and **`site/workers/entry-router.ts`**. |

**Dependency rule:** the **Worker implementation** (**`site/workers/entry-router.ts`**, **`site/wrangler.jsonc`**) is in-repo **2026-04-04**. **`P5-06` staging:** run table **B** on **`https://andetag-web.guff.workers.dev`** (auto-deploy on **`main`**). **`P5-06` production** and **`www`** cutover: **`docs/phase-8-todo.md`**. Minimum static **200** targets for **`/en/stockholm/`**, **`/en/`**, **`/en/berlin/`**, **`/sv/stockholm/`**, **`/de/berlin/`** are met in **`site/`** builds (Phase 6 closure).

### Phase 5, Page Migration and Iterative Approval

Goal: migrate page content in controlled batches with design review feedback loops.
Status: **complete (Swedish migration milestone, 2026-03-24)**. Evidence: `docs/phase-5-verification-record.md`. **Scope:** at closure, all **`/sv/...`** shells in `page-shell-meta.json` carried migrated, design-approved bodies (**23** paths). **Later (Phase 6, 2026-03-28):** Swedish story and privacy canonicals moved under **`/sv/stockholm/...`** with **`301`** from legacy URLs; privacy gained a migrated body on four locale or location shells (see **`docs/url-matrix.csv`**). English and German localization completed per **`docs/phase-6-todo.md`**. **Carry-forward closed in repo (2026-04-04):** Cloudflare **Worker** entry routing source (**`P5-05`**); verify on **staging** **`https://andetag-web.guff.workers.dev`** (**`P5-06`** table **B**); **`P5-07`** SEO manual **`/`** and **`/en/`** alignment. **`P5-04`** (Berlin English bodies) superseded by Phase 6 Wave 2. **`P5-06`** **production** pass and **`www`** enable: **`docs/phase-8-todo.md`** (legacy site may remain on **`www`** until Phase 8 cutover).
Execution checklist: `docs/phase-5-todo.md` (historical; closure recorded there).

Carry-forward: complete **static routes and real pages** required by the **Entry routing and URL expansion schedule** (above) before or in parallel with the first migration wave, so entry **`302`** targets never 404.

**Standing reminder:** any routing, matrix, registry, `_redirects`, or Worker work must revisit **`docs/phase-4-routing-reopen.md`** and the entry section of **`docs/url-migration-policy.md`** (see **`AGENTS.md`**, Routing and entry URLs).

Approach:
- Migrate one page at a time (or small approved batches).
- Validate content parity, component usage, SEO metadata, and behavior.
- Collect feedback from Gustaf, adjust components if needed, then approve page.
- Complete Swedish Stockholm content migration and approval first, then hand off localization work to Phase 6 (content plus headers).

Deliverables per page:
- Route implemented.
- Content migrated and reviewed.
- Metadata (title/description/canonical/hreflang/Open Graph) set.
- Any custom script/embed behavior validated.

Acceptance checks:
- Explicit approval recorded before moving to next page.
- No unresolved high-priority visual or functional issues.

### Phase 6, Localization Rollout (After Swedish Completion)

**Status (2026-04-04):** **P6-00** through **P6-06** **closed** (Gustaf sign-off on **P6-00**–**P6-03** packages; **P6-04**–**P6-06** maintainer closure: metadata, documented exceptions, records). Evidence: **`docs/phase-6-verification-record.md`**. **P6-00:** Swedish **`sv` / Stockholm** chrome package (stable ids, **`resolveChromeNavigationHref`**, selectors, hero destination row). **P6-01:** English Stockholm + location-scoped story URLs and privacy (**54** custom body paths in **`PAGE_CUSTOM_BODY_PATHS`** at P6-01 closure; **`/en/`** hub is a header-selector shell and is not in that set). **P6-02:** English Berlin chrome and **`/en/berlin/...`** bodies (**55** paths in **`PAGE_CUSTOM_BODY_PATHS`** at P6-02 closure). **P6-03:** German Berlin chrome and **`/de/berlin/...`** bodies (**60** paths in **`PAGE_CUSTOM_BODY_PATHS`** at P6-03 closure). **Routing alignment:** **`docs/routing-location-scoped-global-pages-plan.md`** **implemented** **2026-03-28** (matrix **61** shells, single-hop legacy **`301`**, Berlin English story **`seoCanonicalPath`**, **`en-brand`** removed). **P6-04**–**P6-06:** Baseline Open Graph and Twitter card tags in **`SiteLayout.astro`** ( **`og:url`** matches canonical; default **`og:image`** from Stockholm hero still); hreflang regression tests; **`docs/Andetag SEO Manual.md`** §5 Open Graph notes; **`EX-0016`** Berlin English story canonical consolidation in **`docs/migration-exceptions.md`**. **Next:** Phase 7 launch hardening (`docs/phase-7-todo.md`), then Phase 8 deployment (`docs/phase-8-todo.md`). See **`docs/phase-6-todo.md`**.

Goal: localize approved Swedish structures and content into planned non-Swedish locales after Phase 5 sign-off.

Deliverables:
- Localized page-content rollout for approved routes in `en` and `de`, based on Swedish-approved components and page structures (includes **`/en/`** hub, **`/en/stockholm/`**, **`/en/stockholm/...`** story URLs, and remaining locale paths per **`docs/url-matrix.csv`**).
- Localized header, **footer**, and navigation content rollout using the shared design system and approved variant mappings (required before or alongside English page bodies per 2026-03-24 deferral).
- Locale-level metadata and copy QA pass to confirm source intent and tone alignment.
- Localization exception tracking where source parity or market adaptation requires approved divergence.

Acceptance checks:
- Swedish Phase 5 page set is complete and approved before any localized page goes live.
- Localized pages pass language-content review and link integrity checks for their locale.
- No unapproved design forks are introduced during localization work.

### Phase 7, Scripts, Consent, Analytics, and Launch Hardening

Goal: reintroduce required third-party scripts safely and compliantly, and close launch-facing head markup (identity in tabs, sharing previews, structured data).

Deliverables:
- Tracking stack setup (analytics/tag manager/pixel where required).
- Cookie consent and script gating according to policy and legal requirements.
- External widgets finalized (Understory, Brevo if retained, others as approved).
- **Favicon and touch icons:** ship self-hosted favicon (and optional `apple-touch-icon` and mask icon) under `site/public/`, wired from the root layout so every indexable route resolves icons without third-party URLs.
- **Open Graph and sharing metadata:** Phase 6 ships a baseline tag set in `site/src/layouts/SiteLayout.astro` (see `docs/Andetag SEO Manual.md` section 5 and `docs/content-model.md` `seo` contract). Phase 7 locks and implements per-page overrides via frontmatter (`ogImage`, `seo.ogType`), validates default versus locale-specific `og:image` assets, and runs card validators. Use shared defaults from the site `seo` contract in `docs/content-model.md` (`defaultOgImage`, `siteName`, `canonicalHost`). Decisions to lock before Phase 7 completion:
  - Default `og:image` asset (dimensions, safe cropping, locale-neutral versus locale-specific variants if needed).
  - Whether `twitter:card` is `summary_large_image` sitewide or mixed by template.
  - Required properties: at minimum `og:title`, `og:description`, `og:image` (absolute URL), `og:url`, `og:type`, `og:site_name`, and `og:locale` (and `og:locale:alternate` where hreflang equivalents exist).
- **Schema.org (JSON-LD):** emit structured data aligned with `docs/Andetag SEO Manual.md` section 6 (Organization, Place, Museum, TouristAttraction for Stockholm; Event only when applicable). Follow Berlin protocol in the same manual (Place only pre-opening; Museum when Berlin opens). Validate with Rich Results or equivalent checks on representative URLs per locale.
- XML sitemap(s) at canonical production URLs listing only canonical indexable HTML routes (exclude redirect aliases, `noindex` internal or preview tools, and non-HTML endpoints per `docs/url-migration-policy.md`).
- `robots.txt` and final SEO validation (metadata parity, hreflang, Core Web Vitals targets) aligned with policy.

Acceptance checks:
- Consent behavior tested by category (functional, analytics, marketing).
- Sitemap URLs match only canonical indexable routes; `robots.txt` references the sitemap and matches crawl policy.
- Favicon and default sharing image requests return `200` on production; spot-check sharing debugger or card validators on hub and sample inner pages (with and without per-page `ogImage`).
- JSON-LD parses without errors and matches the SEO manual entity rules for Stockholm (and Berlin phase as applicable).
- Pre-launch checklist completed and signed off.

**Status:** **complete** (**Gustaf** sign-off **2026-04-09**; maintainer closure **2026-04-08**). **Shipped in repo / staging evidence:** **CookieConsent** runtime, **Consent Mode v2** defaults, **GTM** loader (**`TrackingHead.astro`** / **`TrackingBody.astro`**), favicon and sharing metadata, JSON-LD, sitemap, **`robots.txt`**, final SEO pass per **`docs/phase-7-todo.md`**. **Deferred to Phase 8:** **GTM** container migration (**`docs/gtm-consent-migration-runbook.md`**, **`docs/phase-8-todo.md`** **P8-07**) immediately before **`www`** cutover (**`P8-11`**); live tag and domain verification (**P8-13**, **P8-22**). **Promotion to `www`** requires **Phase 8** gates (**P8-05**, **P8-06**, **P8-07**, …); Phase 7 closure does **not** by itself authorize cutover.

Task-level checklist: `docs/phase-7-todo.md`.

### Phase 8, Deployment and production cutover

Goal: verify the rebuilt site end-to-end on **dev** and **staging**, obtain **final locale copy approval** on staging, then cut over **`https://www.andetag.museum`** from the legacy host to this stack (**`andetag-web.guff.workers.dev`** equivalent in production), and re-verify everything on **live** **`www`**. After cutover, adopt **pull-request** releases with **per-PR preview URLs** (see deliverables).

**Status:** **Complete** **2026-04-14** (**Gustaf** sign-off **`docs/phase-8-verification-record.md`** §Closure). **Post-cutover organic monitoring** (**P9-26**): **complete** **2026-04-25** — [`docs/phase-9-verification-record.md`](phase-9-verification-record.md) §P9-26 (carried from **P8-26**).

Deliverables:

- **Pre-cutover:** Full QA on local dev and on **`https://andetag-web.guff.workers.dev`**: routing, scripts, cookies, consent, embeds, forms, and locale behavior. **URL parity:** every must-keep path from the legacy live site (per **`docs/url-matrix.csv`** and agreed inventory) resolves on dev and staging as expected (**200** or policy **301**). Any exception is recorded in **`docs/migration-exceptions.md`** and **confirmed with Gustaf**. **Internal link audit:** all internal `<a href>` links on the rebuilt site target canonical URLs, not redirect-source URLs.
- **SEO baseline:** Export **Google Search Console** data (indexed pages, top queries and pages by clicks, crawl stats, coverage report) before cutover (**P8-08**) as the reference for detecting SEO regression.
- **Locale copy gate (staging):** Gustaf explicitly approves **final user-visible text** for **`sv`**, **`en`**, and **`de`** on staging before the stack is treated as **ready for `www`**. Optional: external reviewer for **`de`** before Gustaf signs German. Log evidence in **`docs/phase-8-verification-record.md`** (see **`docs/phase-8-todo.md`**, **P8-06**).
- **Cutover:** DNS or Cloudflare configuration so **`www`** (and apex per policy) serves the Workers deployment with the entry Worker and static assets; documented runbook and rollback (including DNS TTL reduction and cache-purge plan). **Promotion rule until cutover:** pushes to **`main`** redeploy **staging**; Gustaf approves **staging → production** when the maintainer reports Phase 7 + Phase 8 pre-cutover gates are met.
- **Post-cutover:** Repeat automated and manual checks on **`https://www.andetag.museum`**, including **`docs/phase-4-redirect-tests.md`** table **B** (closes **`P5-06`** production), redirect matrix checks, live GTM or consent validation, and SEO or sharing spot-checks as in **`docs/phase-7-todo.md`** where they require the canonical host. Verify **`robots.txt`** allows crawling and references the production sitemap; **submit** sitemap to GSC; request indexing of highest-value pages.
- **Post-cutover organic monitoring (2-4 weeks):** Checklist **P9-26** **closed** **2026-04-25** — **`docs/phase-9-verification-record.md`** §P9-26. Ongoing: stats bridge and skills (**`skills/performance-check/SKILL.md`**, **`skills/seo/SKILL.md`**). Original intent: GSC coverage, traffic vs baseline, indexed pages, Core Web Vitals field data vs **P8-08** (**`docs/phase-8-verification-record.md`**).
- **Post-cutover release discipline:** Stop using **direct pushes to `main`** for day-to-day changes. Ship via **pull requests**; each PR gets a **Cloudflare preview URL** for review; **merging** the PR updates **`www`** (or the agreed production branch). Capture the exact wiring in the cutover runbook and Phase 9 checklist (**`docs/phase-8-cutover-runbook.md`**, **`docs/phase-9-todo.md`** **P9-25**).

Acceptance checks:

- Staging entry verification (**`npm run verify:staging-entry`**) passes before cutover; production table **B** passes on **`www`** after cutover, logged in **`docs/phase-4-redirect-tests.md`** or the Phase 8 verification record.
- **P8-06** complete: Gustaf has signed off **all three** locales on staging (and external **`de`** review if used).
- No unapproved URL or behavior gaps vs the legacy site scope agreed for launch.
- **P9-26** monitoring period complete (Phase 9): **closed 2026-04-25** in **`docs/phase-9-verification-record.md`**; ongoing checks via stats bridge and skills; see record for baseline and escalation context.
- Gustaf sign-off on **`docs/phase-8-verification-record.md`** (Phase 8 closure **2026-04-14**).

Task-level checklist: `docs/phase-8-todo.md`.

### Phase 9, Maintenance program (post-migration)

Goal: transition this repository from a **migration project** (scrape-driven parity, phased URL and locale rollout) to a **maintenance project** (ongoing content, performance, and compliance work on a live **`www`** stack). Normative scope and governance: **`docs/phase-9-plan.md`**; execution checklist: **`docs/phase-9-todo.md`**.

**Status:** **Substantively active on execution checklist, archive sweep still open** (**2026-04-14**; normative plan **`docs/phase-9-plan.md`** scoped **2026-04-24**). **Phase 8** is **complete**. **P9-00** governance is **satisfied** by the published plan. **P9-25** (release discipline) is **complete** **2026-04-25**. **P9-26, P9-20, P9-21, P9-22** and the **Phase 9 verification record** are **complete 2026-04-25** — **`docs/phase-9-verification-record.md`**. **Agent Skills** landed per **`docs/phase-9-todo.md`**. **Exit criteria** not yet all met: **`docs/phase-9-plan.md`** (archive sweep **P9-90+**, `AGENTS.md` rewrite, etc.).

**Direction (to be expanded):**

- **Operating model:** clear ownership for content updates, locale QA, analytics or consent changes, and infra (Workers, DNS, Cloudflare).
- **Regression discipline:** keep **`npm test`**, **`npm run build`**, and documented routing checks as non-negotiable; extend with maintenance-specific gates as needed.
- **Performance:** treat **`docs/performance-improvement-plan.md`** as the living lab playbook; re-run batch or targeted Lighthouse when **`site/`** performance-sensitive areas change.

**Deliverables (initial, non-exhaustive):**

- **Performance optimization Agent Skill:** author a **Cursor Agent Skill** (or equivalent team artifact) that instructs agents to run the agreed performance checks (for example local **`npm run build`**, targeted or batch **`npm run lighthouse:all`**, and review against **`docs/performance-improvement-plan.md`**) before treating **`site/`** work as merge-ready. Skill location and naming TBD (global Cursor skills vs repo-local **`.cursor/rules`** or **`docs/`** companion); the skill text should be concrete enough that runs are repeatable.
- **Content and SEO Agent Skills:** author skills (or equivalents) for **adding pages** (routes, registry, responsive images, navigation), **SEO work** (metadata, hreflang, schema, SEO manual alignment), and **updating testimonials**. For SEO, evaluate **open-source** Agent Skills to **install or adopt** as a baseline before customizing. Task IDs **P9-12**–**P9-15** in **`docs/phase-9-todo.md`**.
- **Production PR gate:** **Convention (P9-20–P9-22)** is **recorded 2026-04-25** in **`docs/phase-9-verification-record.md`** and **`docs/phase-9-plan.md`** §E: agents run skill **Verification** before merge; **EX-NNNN** for standing waivers; no in-repo CI Lighthouse budget yet. **Cloudflare** preview + merge: **`docs/phase-9-todo.md`** **P9-25**.

**Acceptance checks (placeholder):**

- Phase 9 checklist (**`docs/phase-9-todo.md`**) exists and is updated as the maintenance program is specified.
- Performance skill is written, discoverable, and referenced from **`AGENTS.md`** or maintainer onboarding.
- Page, SEO, and testimonials skills (**P9-12**–**P9-15**) are written, discoverable, and referenced the same way when those maintenance workflows are in scope.
- Production PR policy is documented and followed (no silent skips).

Task-level checklist: `docs/phase-9-todo.md`.

## Cross-Cutting Best Practices

- Keep content, routes, and component configuration in versioned source files, not in hidden CMS state.
- Use deterministic extraction/mapping from `site-html/`, avoid ad hoc manual copy when possible.
- Do not import legacy WordPress CSS or JS bundles directly, recreate styles and behavior in local Astro source using maintained dependencies where needed.
- Add regression checks for URL mapping, nav integrity, and metadata output.
- Run structured QA on three levels: visual parity, technical SEO, and accessibility.
- Keep a migration log of exceptions, with rationale and approval status.

### Phase 2 Header and Footer Implementation Insights

- Preserve one shared design system across locales, treat language as content and variant selection, not a style fork.
- Model desktop/tablet and mobile navigation as distinct interaction systems when source behavior differs, especially around sticky and hamburger patterns.
- For sticky transitions, use measured element positions to define trigger points, this avoids visual jumps from container-based threshold guesses.
- Localize assets and fonts before visual fine tuning, parity work is more stable when external network dependencies are removed.
- Keep a direct preview route for each actively tuned variant to speed approval loops and reduce side effects during iteration.

## Suggested Build Cadence

- Milestone reviews at the end of each phase.
- Design approvals at component level first, then per-page approvals.
- Weekly or bi-weekly release slices to reduce big-bang launch risk.

## Decisions Captured

### Platform and Delivery

- Stack and hosting were decided after Phase 1 analysis and accepted in **`docs/decisions/0001-static-stack-selection.md`** (Astro + Cloudflare; **Workers + static assets** from **`site/`** for staging and production entry routing, see ADR operational notes and **`AGENTS.md`**).
- **Until `www` cutover:** pushes to **`main`** redeploy **staging** (**`andetag-web.guff.workers.dev`**); Gustaf approves **staging → production** when the maintainer confirms readiness.
- **After `www` cutover:** content and code changes ship via **pull requests** only; each PR gets a **Cloudflare preview URL**; merging to **`main`** updates **`www`** (document exact project settings in **`docs/phase-8-cutover-runbook.md`** and **`docs/phase-9-todo.md`** **P9-25**).
- Rollout order is fixed: Swedish Stockholm production first, then Phase 6 localization rollout, then Phase 7 launch hardening (in-repo scripts, **CookieConsent** embed, sitemap, schema; maintainer closure **2026-04-08**), then Phase 8 cutover of **`www.andetag.museum`** to this stack (**P8-07** **GTM** runbook just before **`P8-11`**; Phase 8 **complete** **2026-04-14**), then Phase 9 maintenance program (migration-to-operations handoff, **P9-25** **complete**, **P9-26** **complete 2026-04-25**, performance skill, production PR gate convention **P9-20**–**P9-22**).

### SEO and URL Policy

- Must-keep URL source will be generated from the full sitemap XML downloaded by `spider.py`, then reviewed for aliases/legacy paths.
- Trailing slash policy: use trailing slashes on canonical URLs for content pages (for example `/en/stockholm/faq/`), keep a single canonical form, and 301-redirect non-canonical variants.
- Canonical policy: each indexable page points to its own canonical production URL, with hreflang links for `sv`, `en`, and `de` equivalents where available.
- IA policy for future expansion: support both destination and language variants without changing published URL contracts.
- **Post-migration SEO:** deliberate **improvements** to titles, structured data, and body copy are **in scope** after launch, including **AI-assisted** workflows in-repo. **URLs, redirects, and inbound media paths** stay **conservative** so external links and rankings are not broken; substantive URL moves need matrix updates, **`301`s**, and **`docs/migration-exceptions.md`** when needed.
- **XML sitemap:** maintainer implements **`P7-13`** per **`docs/url-migration-policy.md`** (**Sitemap, canonicalization, and inbound links**): canonical HTML only, matrix-aligned, **no orphaning** of legacy entry points.

### Integrations and Compliance

- Retain and reimplement: Google Tag Manager and Brevo.
- Replace Complianz with CookieConsent and enforce category-based tag gating (`necessary`, `analytics`, `marketing`) in static runtime.
- Understory booking widget is classified as `necessary` and must remain available without optional consent opt-in.
- No urgency widgets or upsell modules required in the initial conversion implementation.

### Design and UX

- Visual direction is modernized-but-familiar: unified component-based UI, not pixel-perfect Elementor parity.
- Design language is universal across locales: language affects content and variant selection, but core design system styles stay shared across `sv`, `en`, and `de` unless an approved exception exists.
- Conversion UX should prioritize fast path to standard ticket booking and event ticket booking.
- Component selection policy: evaluate patterns across all pages and keep only reusable components needed for the unified UI system.

## Remaining inputs (open decisions)

These items are **still open** for governance nuance. **SEO evolution** (allow improvements, AI-assisted work) and **sitemap / inbound-link rules** are **resolved** in **Decisions captured** and **`docs/url-migration-policy.md`**. **Staging vs production promotion** was **Phase 8** (see **`docs/phase-8-todo.md`**, **closed** **2026-04-14**). **Post-`www` PR workflow** (previews, merge to **`main`**, branch protection) was **Phase 9 · P9-25** (**`docs/phase-9-todo.md`**, **complete 2026-04-25**). Items that Phase 1 or later already decided stay in **Resolved inputs** below for audit trail only.

### Platform and delivery

- **Resolved for this migration:** **dev** (local), **staging** (auto-deploy on **`main`** to **`andetag-web.guff.workers.dev`**), **production** (**`www`** after cutover). Gustaf approves promoting staging to **`www`** when the maintainer reports Phase 7 + Phase 8 pre-cutover checks and **P8-06** locale copy sign-off are met.
- **Hosting note (Workers + static assets):** The site is still a **static `dist`** from Astro. The Worker runs **first** only for routes that need **entry logic** (**`/`**, **`/en/`**, cookie refresh, **`Accept-Language`**, verified bots). Static HTML, assets, and most paths are served from the **same deployment’s asset handler** at the edge, similar to Pages. On Cloudflare’s **free** tier, **Workers** includes a **daily request allowance** (see [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) and [Workers pricing](https://workers.cloudflare.com/pricing)); a typical museum marketing site usually stays within it, but **monitor the dashboard** after launch. **Speed:** the entry Worker adds **small** CPU time per request it handles; static files behave like other edge-cached assets. **Maintenance:** you maintain **`site/workers/`**, **`wrangler.jsonc`**, and deploy commands (**`AGENTS.md`**); slightly more moving parts than **Pages-only**, but required for correct **`/`** and **`/en/`** behavior with **`andetag_entry`**.

### Design and UX

- Responsive baseline follows current source behavior with two layout buckets, desktop/tablet and mobile, with mobile-first QA support in iOS Safari and Chrome (iOS), plus desktop Chrome and Safari.
- Destination and language selector UX is implemented as separate controls; any future multi-city expansion still needs product confirmation when new destinations ship.

### Integrations and compliance

- Consent and legal requirements by market (operational detail for Phase 7 go-live).
- Access to analytics and tag containers and the verification process owners expect.

### Content operations

- Content ownership and review model (who signs off content and translations) for broader org or off-repo translation workflows; **for changes in this repository**, maintainer + director collaborators and PR rights are set in **`docs/phase-9-plan.md`** (**P9-00**).
- Translation policy for future updates (manual, agent-assisted, external reviewer).
- Operational workflow for recurring event schedule updates (frequency, reviewer, and publish SLA).

## Resolved inputs (historical)

- **Static stack:** Astro (ADR **`docs/decisions/0001-static-stack-selection.md`**).
- **Hosting and edge delivery:** Cloudflare with static build output from **`site/`**; staging and production use **Workers + static assets** and the entry router described in **`AGENTS.md`** ( **`site/wrangler.jsonc`**, **`site/workers/entry-router.ts`** ). ADR 0001 operational notes align with this deploy path.
- **Cookie and consent platform:** CookieConsent replacing Complianz and superseding any interim commercial CMP trial (evaluated CookieYes first; **`docs/decisions/0002-consent-platform-selection.md`**). **Termly is not used.**
- **Swedish migration wave order and closure:** Phase 5 milestone 2026-03-24; evidence **`docs/phase-5-verification-record.md`**.
- **Localization sequencing:** Phases 5 then 6; Phase 6 closed 2026-04-04 (**`docs/phase-6-verification-record.md`**).
- **IA for language plus destination:** Decisions in **`docs/phase-4-routing-reopen.md`**, **`docs/phase-6-todo.md`**, and **`docs/url-migration-policy.md`**.
- **SEO after migration:** Gustaf **allows ongoing improvement** (metadata, structured data, copy) and **AI-assisted** site work; no long-term lock to legacy Yoast parity. **URL and redirect discipline** remains strict (**`docs/url-migration-policy.md`**, matrix, **`migration-exceptions.md`**) to protect inbound links and rankings.
- **Published XML sitemap:** rules and inbound-link safeguards are **maintainer-owned** in **`docs/url-migration-policy.md`** (**Sitemap, canonicalization, and inbound links**); **`P7-13`** implements them.

## Practical next steps (current)

As of **2026-04-14**, Phases **0 through 8** are **closed**. **`https://www.andetag.museum`** is on this stack; evidence **`docs/phase-8-verification-record.md`**. Default execution focus:

1. **Phase 9 (checklist, execution):** **P9-25**, **P9-26, P9-20, P9-21, P9-22** and **`docs/phase-9-verification-record.md`** are **complete 2026-04-25**. Ongoing: stats bridge, skills, **`docs/maintenance-backlog.md`**.
2. **Phase 9 (exit work still open):** **`docs/phase-9-plan.md`** — **P9-90+** (archive sweep, **`AGENTS.md`** rewrite, **`project-overview`**, final **P9-99** closure) per §H.
3. **Routing hygiene:** Before changing **`docs/url-matrix.csv`**, **`site/public/_redirects`**, registry, or **`site/workers/`**, read **`docs/phase-4-routing-reopen.md`** and **`docs/url-migration-policy.md`**; after entry changes, run **`npm run verify:staging-entry`** from **`site/`** (see **`docs/phase-4-redirect-tests.md`**); on **`www`**, use **`STAGING_BASE=https://www.andetag.museum`** for production table **B**.
4. **Carry-forward:** **EX-0006** Phase 7 embed-pattern follow-up is closed in **P7-15** (**`docs/phase-7-verification-record.md`**); optional lazy iframe deferral for marketing embeds remains **P7-12** in **`docs/phase-7-todo.md`** (historical backlog).

### Phase closure references (historical)

- **Phase 8** (**Gustaf** **2026-04-14**): **`docs/phase-8-todo.md`** (**closed**), **`docs/phase-8-verification-record.md`** §Closure.
- **Phase 7** (**Gustaf** **2026-04-09**; maintainer **2026-04-08**): **`docs/phase-7-todo.md`**, **`docs/phase-7-verification-record.md`** (**GTM** runbook: **Phase 8 · P8-07**).
- **Phase 3** (2026-03-22): **`docs/phase-3-todo.md`**, **`docs/phase-3-verification-record.md`**.
- **Phase 4** (2026-03-23): **`docs/phase-4-verification-record.md`**, **`docs/phase-4-todo.md`**, **`docs/phase-4-redirect-tests.md`**, **`docs/phase-4-route-coverage.md`**, **`docs/phase-4-404.md`**. CI runs **`npm test`** and **`npm run build`** in **`site/`** on **`main`**.
- **Routing follow-up:** Phase 4 stays **closed**; location, language, and parity nuance live in **`docs/phase-4-routing-reopen.md`**. **Implementation timing** for entry URLs is in **Entry routing and URL expansion schedule** under Phase 4 above (through Phase 8 for production **`www`**).
