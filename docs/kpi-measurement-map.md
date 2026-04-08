# KPI Measurement Map

Purpose: align conversion goals with **GTM** behavior, consent, and optional event instrumentation. Normative consent categories: **`docs/tracking-and-consent-requirements.md`**.

## Reused Inputs

- `docs/grand-plan.md`
- `docs/tracking-and-consent-requirements.md`
- `docs/existing-site-structure.md`
- `docs/phase-1-analysis-schema.md`

## Primary KPI

- Completed purchase in the external ticketing flow (Understory checkout completion).

## Minimum viable measurement (operator default)

Many stacks only need:

1. **Page views:** usually **GA4** automatic **`page_view`** when the GA4 **Google tag** fires after **`analytics_storage`** consent (or equivalent **Termly** + Consent Mode wiring). No custom `dataLayer` events are strictly required for a basic page-count.
2. **Conversions:** **Google Ads** conversion tags, **GA4** conversion events, and/or **Meta** **Purchase** / **PageView**, configured in GTM and gated by the right consent types.

The **extended taxonomy** below (§ Event taxonomy) is **optional** for reporting. Keep or drop tags in GTM based on product need; do not treat every row as mandatory for launch.

## Staged rollout: staging now, finish at production cutover

**Accepted approach (Gustaf):** **Phase 7** ships the **Termly** embed and **GTM** loader in **`TrackingHead.astro`**; **full GTM container migration** (this runbook) is **Phase 8 · P8-07**, timed **just before** **`P8-11`** cutover (**`docs/phase-8-todo.md`**). Optional early **dual triggers** on **staging** while **`www`** still runs **WordPress + Complianz** remains allowed but is **not** required before Phase 7 closure. **Complete** removal of **`cmplz_*`**-only dependence and full **Termly + Consent Mode** verification on **`www`** land in **Phase 8** (**P8-07**, **P8-13**, **P8-22**).

**Risk:** On **cutover day**, if the container is updated before legacy traffic is gone, **WordPress** tags that still rely only on **`cmplz_*`** can misbehave; if the container is updated after static **`www`** goes live, **static** pages may have **gaps** in analytics or marketing tags until GTM is published. **Brief tracking loss during the migration window is acceptable** (not a launch blocker). Prefer **dual triggers** (Complianz **or** Termly / consent path) if you want continuity on both stacks until WordPress is retired; see § Complianz trigger coupling.

**Logged:** **`docs/migration-exceptions.md`** **EX-0018**.

## Legacy GTM container export (live WordPress, v15)

**Artifact:** repository root **`Google Tag Manager v15.json`** (export **2026-04-06**), container **`GTM-KXJGBL5W`**, site name **`www.andetag.museum`**. Same **`publicId`** as **`site/src/components/chrome/TrackingHead.astro`**.

Use this export when reconciling **staging static site + Termly** with what production used on WordPress.

### Complianz trigger coupling (must fix for Termly)

On the legacy site, **GA4** and the **Google Ads** “all pages” **Google tag** do **not** fire on a generic “All Pages” load alone. They fire on the **custom event** **`cmplz_event_statistics`** (Complianz “statistics” acceptance).

**Meta** “all pages” **PageView** fires on **`cmplz_event_marketing`**.

**Termly** does **not** emit **`cmplz_*`** event names. If GTM triggers are left unchanged after CMP swap, **GA4 / Ads / Meta may never fire**.

**Required maintainer action:**

- Reconfigure GTM so tags fire under **CookieConsent + Google Consent Mode v2** per **`docs/gtm-consent-migration-runbook.md`** (consent-aware triggers, tag consent checks), **or**
- Replace **`cmplz_*`** custom-event triggers with **Consent Initialization** / **All Pages** plus **tag-level consent** settings that match **`analytics_storage`**, **`ad_storage`**, etc.

Re-verify in **GTM Preview** on **`andetag-web.guff.workers.dev`** after **P8-07** publish, again on **`www`** after **P8-13**.

### Understory `dataLayer` events (already wired in legacy GTM)

Understory pushes **parent-page** `dataLayer` events that GTM already maps to **GA4** (and some to Ads/Meta). These are **not** implemented in Astro source today; they depend on the **Understory** runtime posting to **`window.dataLayer`**.

| `dataLayer` event (legacy names) | GTM tag role (summary) |
|----------------------------------|-------------------------|
| **`understory_add_to_cart`** | GA4 **`add_to_cart`** (ecommerce params via DLVs) |
| **`understory_view_item`** | GA4 **`view_item`** |
| **`understory_begin_checkout`** | GA4 **`begin_checkout`** |
| **`on_receipt`** | **Google Ads** conversion (**Understory booking**), **Meta Purchase** |

If these events stop appearing on the new site, **funnel and conversion tags** that depend on them will go quiet even though the widget still works. Confirm with **GTM Preview** on a ticket page after booking flow steps.

### Cross-domain linker and session overrides

- **Conversion linker** tag lists linker domains including **`andetag.museum`**, **`andetag.understory.io`**, **`checkout.stripe.com`**, **`guff.workers.dev`**. Update if production or staging host lists change.
- **GA4 Google tag** config passes **`client_id`** and **`session_id`** from dataLayer (**`ga_client_id`**, **`ga_session_id`**) via custom JavaScript variables. If Understory or the parent page no longer sets those keys, **session stitching** vs the old site may change; validate with analytics if continuity matters.

### Engagement tags (optional)

Legacy container includes **outbound link**, **file download**, **tel/mailto**, **YouTube** (**`youTubeTrack`**), **copy text** / **copied email** (custom events). Many use **`consentStatus`: `NOT_SET`** in the export. Decide whether to keep, remove, or re-gate them under **Termly** + Consent Mode.

### Consent-type nuances to verify

- **Google Ads** “all pages” tag in the export lists **`analytics_storage`** as required consent; **Meta** lists **`ad_storage`**. Confirm against current Google and Meta guidance for your use case.

## GTM migration checklist (static site + Termly)

**Phase 7 (in-repo, closed):** **Termly** resource blocker + **Consent Mode** defaults + **GTM** bootstrap in **`TrackingHead.astro`** (**`docs/phase-7-todo.md`** **P7-10**, **P7-11**).

**Phase 8 · P8-07 (scheduled operator work, just before `P8-11`):**

**Operator steps (click-by-click):** **`docs/gtm-consent-migration-runbook.md`**.

1. In **GTM**, add the **Termly** gallery template and **Consent Mode**-compatible triggers **alongside** or **instead of** legacy **`cmplz_*`** triggers so **static staging** can fire tags (same container as **WordPress** until cutover).
2. **Dual-trigger** or **replace** pattern per runbook §4 for **GA4**, **Ads**, **Meta**.
3. **GTM Preview** on **`andetag-web.guff.workers.dev`**: consent flow + minimum **page_view** / conversion path smoke test; watch **WordPress** for double-counting if both stacks still share the container.

**Phase 8 (post-cutover and live finish, **`docs/phase-8-todo.md`**):**

4. **Replace or narrow** **`cmplz_*`**-only triggers once **`www`** serves the static stack (or keep dual triggers until WP is fully off **`www`**).
5. **Confirm Understory** still emits **`understory_*`** and **`on_receipt`** on parent **`dataLayer`** on Astro pages.
6. **Review conversion linker** domain list for **`www`**, Understory, Stripe, and preview hosts.
7. **Audit tags** with **`consentStatus`: `NOT_SET`** for alignment with **`docs/tracking-and-consent-requirements.md`**.
8. **P8-13** and **P8-22:** switch **Termly** / GTM primary domain focus to **`www`**, publish, live verification.

Staged acceptance of cutover-day gaps: **`docs/migration-exceptions.md`** **EX-0018** and § **Staged rollout** above.

## Funnel Stages (conceptual)

1. Discover and land on route.
2. Engage with conversion-oriented content.
3. Trigger booking intent (open widget or click booking CTA).
4. Handoff to external ticketing flow.
5. Completed purchase (measured via external platform integration or approved proxy signal).

## Event taxonomy (optional extended model)

These names were planned for a richer funnel than **page_view + conversions**. Implement only if you add matching **`dataLayer.push`** calls from the app or keep equivalent GTM auto-event tags.

| event_name | stage | trigger | pages | category | required_params | consent_category |
|------------|-------|---------|-------|----------|-----------------|------------------|
| `page_view_route` | 1 | route render | all | engagement | `route`, `lang`, `destination` | analytics |
| `cta_click_primary` | 2-3 | click on primary CTA buttons | homepage, tickets, date, group/corporate pages | engagement | `route`, `lang`, `cta_label`, `cta_target` | analytics |
| `booking_widget_visible` | 3 | booking widget enters viewport | pages with embedded Understory | conversion_proxy | `route`, `lang`, `widget_type` | analytics |
| `booking_widget_interaction` | 3 | interaction inside booking widget frame shell | pages with embedded Understory | conversion_proxy | `route`, `lang`, `interaction_type` | analytics |
| `booking_handoff_click` | 4 | outbound click to Understory flow | widget pages and Art Yoga external booking links | conversion_proxy | `route`, `lang`, `destination`, `outbound_url` | analytics |
| `brevo_form_submit` | 3-4 | Berlin waitlist form submit | German pre-launch pages | lead | `route`, `lang`, `form_id` | marketing |
| `consent_updated` | support | user changes consent categories | all | compliance | `analytics_allowed`, `marketing_allowed` | necessary |

## Mapping to Business KPI

| business_goal | primary_signal | backup_signal | owner_system |
|---------------|----------------|---------------|--------------|
| Completed purchase | external checkout completion event from ticketing integration | **`on_receipt`**-driven Ads/Meta tags (legacy GTM) or GA4 ecommerce events from Understory | ticketing platform + analytics |
| Improve conversion rate from key pages | purchase completion attributed to route group | Optional proxy events from § taxonomy if implemented | GTM + analytics |
| Berlin pre-launch demand capture | qualified waitlist submissions | Brevo form completions | Brevo + optional GTM |

## GTM Implementation Requirements

- Use one event naming standard across sv/en/de routes when you add custom events.
- Include `lang` and `destination` on custom conversion and proxy events if you implement them.
- Treat Understory booking widget runtime as `necessary` so conversion path is never blocked by optional consent categories.
- Keep optional tag firing behind consent categories:
  - analytics: **`analytics_storage`**
  - marketing / ads: **`ad_storage`** (and related flags per tag vendor)
- Prevent duplicate event firing when both widget load and route hydration occur.

## Validation Plan

**Minimum (aligned with § Minimum viable measurement):**

1. GTM Preview on staging: after analytics consent, **GA4** receives **`page_view`** (or equivalent).
2. After marketing consent where applicable, **Meta** / **Ads** behave as expected; without consent, restricted behavior matches policy.
3. Complete a test purchase or sandbox flow: **`on_receipt`** (or your chosen conversion signal) still reaches Ads/GA4/Meta if you rely on legacy tags.

**Extended (only if you keep optional tags or custom taxonomy):**

4. Verify custom taxonomy events per locale route if implemented.
5. Berlin waitlist: optional **Brevo**-related GTM tags only with **marketing** consent.
6. Compare staging vs production event counts in a dry-run window after **`www`** cutover.

## Open Measurement Dependencies

- Understory continues to expose **`dataLayer`** events on the parent page for parity with **`Google Tag Manager v15.json`** (or you deliberately remove dependent tags).
- Purchase completion and ecommerce parameters depend on Understory and GTM variable mapping in the container.
- Final tag and trigger edits happen in **GTM admin**, not only in this repository.
