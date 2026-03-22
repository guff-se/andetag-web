# Tracking and Consent Requirements

Purpose: define tracking and consent guardrails before implementation decisions in later phases.

## Reused Inputs

This document extends requirements already stated in:

- `docs/grand-plan.md` (retain GTM, replace Complianz, preserve attribution)
- `docs/existing-site-structure.md` (current integrations and script behavior)

## Scope Decision

- Consent and legal requirements are intentionally unified across markets in pre-launch phases.
- Do not split requirements by country until post-launch or explicit legal review requires divergence.

## 1) Tag Management Requirements (GTM)

- GTM is mandatory as the orchestration layer for analytics and marketing tags.
- GTM container must be environment-aware (`dev`, `staging`, `prod`).
- All non-essential tags must be controlled by consent state.
- Event naming must support funnel mapping in `docs/kpi-measurement-map.md` (Phase 1 deliverable).

Minimum event categories to support:

- Page engagement events
- CTA click events
- Booking widget open and click-through events
- Outbound conversion handoff events

## 2) Brevo Requirements

- Brevo forms/scripts may be included only after consent category checks are evaluated.
- Brevo embed loading behavior must be deterministic:
  - no hidden auto-injection outside approved component slots
  - explicit fallback content when blocked by consent
- Form placement and field mapping must be captured in page-level implementation notes.

## 3) Consent Category Model

Required consent categories:

1. `necessary`
2. `analytics`
3. `marketing`

Policy:

- `necessary` tags load by default and do not require opt-in.
- `analytics` tags load only after explicit consent for analytics.
- `marketing` tags load only after explicit consent for marketing.
- Consent state must persist across pages and language routes.

## 4) Allowed Tags by Category

| Category | Allowed examples | Blocked until consent |
|----------|------------------|-----------------------|
| `necessary` | consent manager runtime, security/session essentials, Understory booking widget runtime | no |
| `analytics` | GA4 via GTM | yes |
| `marketing` | Meta Pixel, Google Ads conversion tags, Brevo marketing tags | yes |

Understory classification rule:

- Understory booking widget is business-critical for primary conversion and must be treated as `necessary` (not blocked behind optional consent categories).

## 5) Compliance and UX Requirements

- Consent UI must provide clear accept/reject controls by category.
- Default state must be privacy-preserving for optional categories.
- User must be able to change consent later from any page.
- Consent log data must be exportable for audit needs.

## 6) Technical Requirements for Static Delivery

- Consent decisions must be readable before tag execution.
- Tag initialization must run after consent state is resolved.
- No optional tag should fire on first paint without consent.
- Consent and tag gating must work across all supported language paths (`/`, `/en/`, `/de/...`).

## 7) Validation Checklist for Platform Selection (Phase 1 and 6)

- Supports category-based prior blocking.
- Supports GTM integration without custom brittle patches.
- Supports multilingual consent UI text.
- Supports audit logs and consent proof output.
- Supports static-hosted site runtime without WordPress dependencies.
