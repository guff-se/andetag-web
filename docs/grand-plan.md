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

- ANDETAG is an immersive museum with current operations in Stockholm and Berlin opening in fall.
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

**Phase 4 follow-up (entry routing, `/sv/`, parity):** Original Phase 4 delivered static shells and repo redirects against the matrix at closure. The expanded model in `docs/url-migration-policy.md` ( **`andetag_entry`**, **`/`** and **`/en/`** edge routing, **`Accept-Language`**, verified bots to **`/en/stockholm/`**) and Berlin or Stockholm parity is **scheduled below** so it does not block Phase 5 start on Swedish pages.

### Entry routing and URL expansion schedule (decided)

Source: `docs/phase-4-routing-reopen.md` and `docs/url-migration-policy.md`. This table is the implementation authority for *when* relative to phased delivery.

| Deliverable | Phase | Rationale |
|-------------|-------|-----------|
| **`url-matrix.csv`**, `phase-4-route-coverage.md`, and registry updates for **`/sv/stockholm/`**, legacy **`/`** Swedish home handling, and **Berlin or Stockholm parity paths** (shells first) | **Phase 5, early** | Edge logic must not **302** to missing routes. Add or adjust static Astro routes and documented redirects before turning on production Worker behavior. |
| **English hub** page at **`/en/`** (chooser content and layout) and **Swedish Stockholm home** at **`/sv/stockholm/`** (migrated content, not placeholder-only) | **Phase 5, early-to-mid** | Humans and bots depend on real **200** responses at hub and bot landing targets. |
| **Berlin parity**: new routes and migrated **English Berlin** pages needed for launch | **Phase 5, mid** (continue as needed) | Parity is content plus routing; prioritize after core Swedish Stockholm migration wave is underway, unless business gates launch on Berlin sooner. |
| **Berlin parity**: **German** Berlin pages and locale QA | **Phase 6** | Matches existing rule: non-Swedish locale rollout after Swedish Phase 5 completion; English Berlin can precede or overlap per launch plan. |
| **Cloudflare Worker** (or equivalent edge) implementing **`/`**, **`/en/`**, cookie **set or read**, **`Accept-Language`** parsing, **verified-bot** branch | **Phase 5, late** | Ship when static targets above are **200** in production builds and staging tests pass; avoids redirecting into empty shells. |
| **Production enable** of entry Worker (if staged earlier) | **Phase 5 exit or Phase 6 open** | Prefer enabling when hub, **`/sv/stockholm/`**, and **`/en/stockholm/`** are content-approved and critical Berlin **`/en/berlin/`** paths exist; exact gate is Gustaf sign-off on entry UX smoke test. |
| **CookieYes** listing for **`andetag_entry`** as **`necessary`** (essential or functional) | **Phase 7** | Aligns with consent platform go-live and audit checklist; cookie may already be set by the Worker in Phase 5 or 6. |
| **Sitemap and `robots.txt`** including new canonical entry URLs | **Phase 7** | Sitemap is already a Phase 7 deliverable; ensure **`/sv/stockholm/`**, hub, and parity URLs appear only as canonical **keep** rows. |
| **`docs/Andetag SEO Manual.md`** and hreflang or **`x-default`** examples for new entry behavior | **Phase 5 late or Phase 6** (content) **and Phase 7** (final audit) | Update when routes go live; revalidate in launch hardening. |

**Dependency rule:** do not point production **`/`** or **`/en/`** entry traffic through the Worker until the **minimum static targets** for that configuration return **200** (at least **`/en/`**, **`/en/stockholm/`**, **`/sv/stockholm/`**, **`/de/berlin/`**, **`/en/berlin/`**).

### Phase 5, Page Migration and Iterative Approval

Goal: migrate page content in controlled batches with design review feedback loops.
Execution checklist: `docs/phase-5-todo.md`

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

Goal: localize approved Swedish structures and content into planned non-Swedish locales after Phase 5 sign-off.

Deliverables:
- Localized page-content rollout for approved routes in `en` and `de`, based on Swedish-approved components and page structures.
- Localized header and navigation content rollout using the shared design system and approved variant mappings.
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
- **Open Graph and sharing metadata:** document and implement a minimum tag set for social previews. Use shared defaults from the site `seo` contract in `docs/content-model.md` (`defaultOgImage`, `siteName`, `canonicalHost`). Allow per-page overrides via page frontmatter (`ogImage`, `seo.ogType`, title and description already on the page model). Decisions to lock before implementation:
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

Task-level checklist: `docs/phase-7-todo.md`.

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

- Stack and hosting were decided after Phase 1 analysis and accepted in `docs/decisions/0001-static-stack-selection.md` (Astro + Cloudflare Pages).
- Post-launch content operations are pull-request based, with one staging instance per PR for verification before merge.
- Rollout order is fixed: Swedish Stockholm production first, then Phase 6 localization rollout, then final launch hardening.

### SEO and URL Policy

- Must-keep URL source will be generated from the full sitemap XML downloaded by `spider.py`, then reviewed for aliases/legacy paths.
- Trailing slash policy: use trailing slashes on canonical URLs for content pages (for example `/en/stockholm/faq/`), keep a single canonical form, and 301-redirect non-canonical variants.
- Canonical policy: each indexable page points to its own canonical production URL, with hreflang links for `sv`, `en`, and `de` equivalents where available.
- IA policy for future expansion: support both destination and language variants without changing published URL contracts.

### Integrations and Compliance

- Retain and reimplement: Google Tag Manager and Brevo.
- Replace Complianz with CookieYes and enforce category-based tag gating (`necessary`, `analytics`, `marketing`) in static runtime.
- Understory booking widget is classified as `necessary` and must remain available without optional consent opt-in.
- No urgency widgets or upsell modules required in the initial conversion implementation.

### Design and UX

- Visual direction is modernized-but-familiar: unified component-based UI, not pixel-perfect Elementor parity.
- Design language is universal across locales: language affects content and variant selection, but core design system styles stay shared across `sv`, `en`, and `de` unless an approved exception exists.
- Conversion UX should prioritize fast path to standard ticket booking and event ticket booking.
- Component selection policy: evaluate patterns across all pages and keep only reusable components needed for the unified UI system.

## Remaining Inputs Needed

### Platform and Delivery

- Final static stack selection after Phase 1: resolved to Astro (see `docs/decisions/0001-static-stack-selection.md`).
- Hosting/deployment target after Phase 1: resolved to Cloudflare Pages (see `docs/decisions/0001-static-stack-selection.md`).
- Required environments (dev/stage/prod) and who approves promotions.

### SEO and URL Policy

- Which existing SEO tooling/output must be replicated exactly versus improved.
- Sitemap ingestion policy details: how to treat query-string URLs, parameterized pages, and non-HTML endpoints.

### Design and UX

- Priority pages for first migration wave.
- Responsive baseline follows current source behavior with two layout buckets, desktop/tablet and mobile, with mobile-first QA support in iOS Safari and Chrome (iOS), plus desktop Chrome and Safari.
- Destination and language selector UX pattern is resolved to separate controls for future multi-city rollout.

### Integrations and Compliance

- Consent/legal requirements by market.
- Access to analytics/tag containers and verification process.
- Preferred cookie platform replacement: resolved to CookieYes (see `docs/decisions/0002-consent-platform-selection.md`).

### Content Operations

- Content ownership and review model (who signs off content and translations).
- Translation policy for future updates (manual, agent-assisted, external reviewer).
- Operational workflow for recurring event schedule updates (frequency, reviewer, and publish SLA).

## Practical Next Steps

1. Execute Phase 5 Swedish Stockholm page migration: define first-wave page order, then migrate and approve per page using `docs/phase-3-component-usage.md` and shells from `site/src/lib/routes/page-shell-registry.ts`.
2. Address **EX-0007** when `/en/stockholm/` is migrated with correct English hub metadata (or earlier if live WordPress fixes Yoast output).
3. Keep localization work paused until Swedish Phase 5 completion, then start Phase 6 localization rollout.
4. Validate CookieYes and GTM consent behavior in staging ahead of Phase 7 launch hardening.
5. Track showcase performance follow-up under **EX-0006** when consent-gated and lazy embed loading lands in Phase 7.

Phase 3 closure (2026-03-22): component library, showcase, usage docs, and verification record are complete; see `docs/phase-3-todo.md` and `docs/phase-3-verification-record.md`.

Phase 4 closure (2026-03-23): routing, shells, redirects, hreflang, 404, and CI are complete; stakeholder sign-off recorded in `docs/phase-4-verification-record.md` and `docs/phase-4-todo.md`. Artifacts: `docs/phase-4-redirect-tests.md`, `docs/phase-4-route-coverage.md`, `docs/phase-4-404.md`. CI runs `npm test` and `npm run build` in `site/` on `main`.

Follow-up (routing): Phase 4 remains **closed**. `docs/phase-4-routing-reopen.md` tracks location versus language, Berlin and Stockholm page parity, and global (non-destination) pages. **Implementation timing** is fixed in the **Entry routing and URL expansion schedule** under Phase 4 in this document (Phase 5 through 7).
