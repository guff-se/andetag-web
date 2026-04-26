# ADR 0001: Static Stack and Hosting Selection

Status: Accepted
Date: 2026-03-22
Deciders: Gustaf, AI agent
Related docs:
- docs/grand-plan.md
- docs/phase-1-todo.md
- docs/url-migration-policy.md
- docs/phase-1-analysis-schema.md

## Context

Phase 1 requires a selected static framework and hosting target before Phase 2 can start. The migration must preserve URL contracts, support deterministic metadata generation, and enable edge-level redirects.

## Decision

- Framework: Astro
- Hosting: Cloudflare, with static site build output from **`site/`** (**`npm run build`** → **`dist`**)
- Edge delivery: **Workers + static assets** from **`site/wrangler.jsonc`** for staging and production so **`/`** and **`/en/`** entry routing is correct (not Pages-only **`_redirects`** for those paths)

The original choice was framed as **Cloudflare Pages**; operational reality matches **Workers with assets binding** (see **Operational notes**). Decision accepted by Gustaf on 2026-03-22 after reviewing current route hierarchy, navigation complexity, media weight profile, and expected traffic envelope.

## Options considered

### Option A: Astro + Cloudflare Pages
- Pros:
  - Content-driven static architecture fits page-by-page migration and component-driven rendering.
  - Strong performance baseline with minimal client-side JS by default.
  - Straightforward static route generation for current URL structure.
  - Cloudflare edge routing is strong for canonical and alias redirects.
- Cons:
  - Team familiarity may be lower if previous projects used React-first app patterns.
  - Some third-party integrations may require explicit client island boundaries.

### Option B: Next.js static export + Vercel
- Pros:
  - Familiar React ecosystem and strong deployment tooling.
  - Easy path to later dynamic expansion if needed.
- Cons:
  - Static export constraints can complicate some routing/redirect edge cases.
  - Runtime defaults can lead to unnecessary client JS unless controlled carefully.

### Option C: Eleventy + Netlify
- Pros:
  - Very lean static output and simple template model.
  - Reliable static hosting workflow.
- Cons:
  - Component ergonomics may be slower for complex shared variants.
  - Less direct alignment with modern component-based design system needs.

## Consequences

### Positive
- Unblocks Phase 2 layout and routing implementation planning.
- Aligns hosting behavior with redirect and canonical policy requirements.
- Keeps migration stack focused on performance and maintainability.

### Negative
- Requires explicit consent and tracking integration patterns for third-party scripts.
- Requires shared agreement on component authoring patterns before large-scale page migration.

### Operational notes
- Rollout implications: set up `dev`, `staging`, and `prod` environments with consistent redirect behavior.
- Validation/check requirements: verify redirect policy, canonical emission, and hreflang output before Phase 4 completion.
- **Deploy path (authoritative today):** build from repo root **`site/`** with **`npm run build`**, output **`dist`**. **Staging and production** use **Cloudflare Workers with static assets** per **`site/wrangler.jsonc`**: **`wrangler deploy`** from **`site/`**, **`main`** **`site/workers/entry-router.ts`**, **`assets.directory`** **`./dist`**, **`run_worker_first`** **`true`** so **`/`** and **`/en/`** entry routing runs before the asset handler (see **`AGENTS.md`**, Cloudflare). A Cloudflare **Pages**-style project may still be configured with root **`site`**, build **`npm run build`**, output **`dist`**; entry behavior on **`www`** depends on this Worker + assets setup, not on static **`_redirects`** alone for **`/`**.

## SEO and migration impact

- URL impact: low if redirect rules are implemented exactly as policy.
- hreflang/canonical impact: low if metadata generation is route-driven and deterministic.
- Redirect impact: medium operational risk if edge config drifts between environments.

## Follow-up actions

- [x] Gustaf approves framework and hosting choice.
- [x] Create environment and redirect configuration plan in implementation docs (**`docs/url-migration-policy.md`**, **`docs/phase-4-redirect-tests.md`**, **`site/public/_redirects`**, **`site/workers/`**).
- [x] Add stack-specific CI checks (**`.github/workflows/ci.yml`**, **`npm test`** and **`npm run build`** in **`site/`**).
