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

## 2) Brevo (waitlist) Requirements

The Berlin early-bird waitlist is implemented as **`WaitlistFormEmbed.astro`**: a **server-rendered HTML form** that **`POST`s** to Brevo’s form endpoint. There is **no Brevo JavaScript** on the page and **no Brevo cookie** set by that flow on first-party page load.

- **Consent:** The user gives **explicit consent** via the **required** opt-in checkbox (**`OPT_IN`**) and linked privacy policy before submit. This is treated as **outside CookieYes category gating** (same category model still applies to any separate **Brevo tracking or remarketing tags** if those are added later via GTM).
- **Determinism:** Markup lives only in approved embed slots; **`unavailable`** shows deterministic fallback copy.
- **Placement and fields:** Berlin EN/DE bodies; email + opt-in; locale hidden field. Adjust **`formAction`** only when the Brevo form endpoint changes.

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
| `necessary` | consent manager runtime, security/session essentials, Understory booking widget runtime, **`andetag_entry` routing cookie** (see `docs/url-migration-policy.md` entry routing section) | no |
| `analytics` | GA4 via GTM | yes |
| `marketing` | Meta Pixel, Google Ads conversion tags, **Brevo tracking or remarketing tags** (via GTM), not the waitlist HTML form | yes |

Understory classification rule:

- Understory booking widget is business-critical for primary conversion and must be treated as `necessary` (not blocked behind optional consent categories).

## 4a) Approved third-party embed inventory (P7-12)

Normative consent **category** labels match **§3** (`necessary`, `analytics`, `marketing`). **Implementation note:** only GTM and tags behind CookieYes are category-gated today; third-party **iframes** below load with **`loading="lazy"`** where applicable but are **not** automatically suppressed until a category toggles (deferring iframe loads on consent is a follow-up if legal or CMP configuration requires it).

| Embed | Where | Component / mechanism | Consent classification | Notes |
|-------|--------|------------------------|---------------------------|--------|
| Understory booking | Stockholm (and related) pages | **`BookingEmbed.astro`** + **`booking-embed-lazy.ts`** | **`necessary`** | Lazy script injection when the shell nears the viewport; same rule as **§4** table. |
| Brevo waitlist | Berlin EN/DE home | **`WaitlistFormEmbed.astro`** | **Not CookieYes-gated** | Plain **`POST`** form; explicit opt-in at submit; see **§2**. |
| Vimeo promo video | Stockholm home/SEO, Berlin home | **`VideoEmbed.astro`** | **`marketing`** (third-party player) | Iframe to Vimeo; treat like other optional media embeds for policy. |
| Google Maps | Stockholm home, Hitta hit, SEO landings | **`MapEmbed.astro`** | **`marketing`** (third-party map) | Google may set cookies in the iframe context; align CMP disclosure with your legal review. |
| Spotify album | Musik pages (SV/EN/DE) | Inline **`iframe`** in page bodies | **`marketing`** | Lazy-loaded where wired; third-party Spotify player. |
| Google Tag Manager | All pages (when tracking on) | **`TrackingHead.astro`**, **`TrackingBody.astro`** | **`analytics` / `marketing`** for tags inside GTM; loader **after** consent default | Consent Mode v2 default denied before interaction; see Phase 7 tracking checklist. |
| CookieYes | All pages (when configured) | **`TrackingHead.astro`** | **`necessary`** | CMP runtime. |

Out-of-scope for this inventory: **first-party** media (hero video poster, gallery, self-hosted MP4), **external links** (for example Understory gift card URL opened in a new tab), and **Worker `andetag_entry`** (cookie policy in **`docs/url-migration-policy.md`**).

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
