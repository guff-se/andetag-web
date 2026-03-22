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
- Validate each major milestone with Gustaf before proceeding to the next phase.
- Build Swedish Stockholm first, complete and approve it before localization and Berlin rollout work.

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

Deliverables:
- Unified header/footer architecture with variant support by language and context.
- Navigation data model and render logic for all current menu structures.
- Language switcher behavior defined and implemented for static routing.
- Footer legal/metadata/script slots designed for safe reuse.

Acceptance checks:
- Snapshot review of each header/footer variant on desktop and mobile.
- Link parity checks against current nav and footer destinations.

### Phase 3, Design Component Library and Verification Page

Goal: build a reusable component system with explicit visual approval workflow.

Deliverables:
- Reusable components with stable APIs (button, hero, section wrappers, testimonial, FAQ, gallery, embeds, booking module, info boxes, map block, etc).
- Dedicated internal component showcase page that renders all variants/states.
- Documentation per component: purpose, props, content constraints, and usage examples.

Acceptance checks:
- Gustaf signs off component showcase before page-by-page migration starts.
- Responsive checks completed for each approved component.

### Phase 4, Routing and URL Preservation

Goal: implement complete route coverage and migration-safe URL handling.

Deliverables:
- Static route tree covering all existing paths (including language prefixes).
- Redirect rules for aliases, legacy patterns, and unavoidable route changes.
- Canonical and hreflang generation wired for all routes.
- 404 strategy and language-aware fallback behavior.

Acceptance checks:
- Route coverage report showing 100% mapping of known URLs.
- Redirect test list validated.

### Phase 5, Page Migration and Iterative Approval

Goal: migrate page content in controlled batches with design review feedback loops.

Approach:
- Migrate one page at a time (or small approved batches).
- Validate content parity, component usage, SEO metadata, and behavior.
- Collect feedback from Gustaf, adjust components if needed, then approve page.
- Migrate Swedish Stockholm core conversion pages first before any localization wave.

Deliverables per page:
- Route implemented.
- Content migrated and reviewed.
- Metadata (title/description/canonical/hreflang/Open Graph) set.
- Any custom script/embed behavior validated.

Acceptance checks:
- Explicit approval recorded before moving to next page.
- No unresolved high-priority visual or functional issues.

### Phase 6, Scripts, Consent, Analytics, and Launch Hardening

Goal: reintroduce required third-party scripts safely and compliantly.

Deliverables:
- Tracking stack setup (analytics/tag manager/pixel where required).
- Cookie consent and script gating according to policy and legal requirements.
- External widgets finalized (Understory, Brevo if retained, others as approved).
- Final SEO and performance validation (sitemaps, robots, metadata parity, Core Web Vitals targets).

Acceptance checks:
- Consent behavior tested by category (functional, analytics, marketing).
- Pre-launch checklist completed and signed off.

## Cross-Cutting Best Practices

- Keep content, routes, and component configuration in versioned source files, not in hidden CMS state.
- Use deterministic extraction/mapping from `site-html/`, avoid ad hoc manual copy when possible.
- Add regression checks for URL mapping, nav integrity, and metadata output.
- Run structured QA on three levels: visual parity, technical SEO, and accessibility.
- Keep a migration log of exceptions, with rationale and approval status.

## Suggested Build Cadence

- Milestone reviews at the end of each phase.
- Design approvals at component level first, then per-page approvals.
- Weekly or bi-weekly release slices to reduce big-bang launch risk.

## Decisions Captured

### Platform and Delivery

- Stack and hosting are intentionally decided after Phase 1 analysis, not before.
- Post-launch content operations are pull-request based, with one staging instance per PR for verification before merge.
- Rollout order is fixed: Swedish Stockholm production first, then localization and Berlin destination expansion.

### SEO and URL Policy

- Must-keep URL source will be generated from the full sitemap XML downloaded by `spider.py`, then reviewed for aliases/legacy paths.
- Trailing slash policy: use trailing slashes on canonical URLs for content pages (for example `/en/stockholm/faq/`), keep a single canonical form, and 301-redirect non-canonical variants.
- Canonical policy: each indexable page points to its own canonical production URL, with hreflang links for `sv`, `en`, and `de` equivalents where available.
- IA policy for future expansion: support both destination and language variants without changing published URL contracts.

### Integrations and Compliance

- Retain and reimplement: Google Tag Manager and Brevo.
- Replace Complianz with a static-site-compatible consent solution that can gate tags by consent category.
- No urgency widgets or upsell modules required in the initial conversion implementation.

### Design and UX

- Visual direction is modernized-but-familiar: unified component-based UI, not pixel-perfect Elementor parity.
- Conversion UX should prioritize fast path to standard ticket booking and event ticket booking.
- Component selection policy: evaluate patterns across all pages and keep only reusable components needed for the unified UI system.

## Remaining Inputs Needed

### Platform and Delivery

- Final static stack selection after Phase 1 (Astro, Next static export, Eleventy, other).
- Hosting/deployment target after Phase 1 (Netlify, Vercel, Cloudflare Pages, custom).
- Required environments (dev/stage/prod) and who approves promotions.

### SEO and URL Policy

- Which existing SEO tooling/output must be replicated exactly versus improved.
- Sitemap ingestion policy details: how to treat query-string URLs, parameterized pages, and non-HTML endpoints.

### Design and UX

- Priority pages for first migration wave.
- Approved responsive breakpoints and browser support baseline.
- Destination selector versus language selector UX pattern for future multi-city rollout.

### Integrations and Compliance

- Consent/legal requirements by market.
- Access to analytics/tag containers and verification process.
- Preferred cookie platform replacement (for example Cookiebot, iubenda, Osano, or custom in-house consent module).

### Content Operations

- Content ownership and review model (who signs off content and translations).
- Translation policy for future updates (manual, agent-assisted, external reviewer).
- Operational workflow for recurring event schedule updates (frequency, reviewer, and publish SLA).

## Practical Next Steps

1. Complete Phase 1 analysis and produce the sitemap-derived must-keep URL matrix.
2. Confirm stack + hosting immediately after Phase 1.
3. Select consent replacement and legal category mapping for tag gating.
4. Define first-wave Stockholm Swedish page order by conversion priority (homepage, tickets, opening hours, find us, FAQ, events, corporate/private).
5. Start with Phases 2 and 3 in parallel where possible (shared layout + component system).
6. Approve component showcase before any full page migration wave.
7. Begin page migration in priority order with explicit approval checkpoints.
