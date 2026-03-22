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
- Hosting: Cloudflare Pages

Decision accepted by Gustaf on 2026-03-22 after reviewing current route hierarchy, navigation complexity, media weight profile, and expected traffic envelope.

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

## SEO and migration impact

- URL impact: low if redirect rules are implemented exactly as policy.
- hreflang/canonical impact: low if metadata generation is route-driven and deterministic.
- Redirect impact: medium operational risk if edge config drifts between environments.

## Follow-up actions

- [x] Gustaf approves framework and hosting choice.
- [ ] Create environment and redirect configuration plan in implementation docs.
- [ ] Add stack-specific CI checks once framework repo structure is initialized.
