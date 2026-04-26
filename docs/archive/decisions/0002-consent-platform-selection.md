# ADR 0002: Consent Platform Selection

Status: Accepted
Date: 2026-03-22
Amendment: 2026-04-08 (implementation locked to **CookieConsent**; historical vendor research compressed)
Deciders: Gustaf, AI agent
Related docs:

- docs/tracking-and-consent-requirements.md
- docs/cmp-vendor-matrix-seo-white-label.md
- docs/grand-plan.md
- docs/phase-1-analysis-schema.md
- docs/migration-exceptions.md

## Context

Complianz is WordPress-dependent and cannot be reused as-is in the static stack. The migration requires category-based prior blocking (`necessary`, `analytics`, `marketing`) and consent auditability.

## Decision

**Implemented (2026-04-08):** The static site uses **CookieConsent** (self-hosted via `vanilla-cookieconsent`) in **`site/src/components/chrome/TrackingHead.astro`** and **`site/src/client-scripts/cookie-consent-init.ts`**. **GTM** remains the tag orchestration layer per **`docs/tracking-and-consent-requirements.md`**. Operator steps: **`docs/gtm-consent-migration-runbook.md`**.

**Third-party CMP:** **Termly is not used** (no third-party commercial CMP scripts, subscription, or GTM gallery dependency). Any interim commercial CMP evaluation that appeared in earlier git revisions was superseded by CookieConsent.

**Original (2026-03-22) matrix winner:** **CookieYes** was the strongest scored option in the short matrix below. That choice informed research but does **not** match the final implementation (CookieConsent was adopted for white-label economics, bundle weight, and self-hosting).

**Original CookieYes rationale (historical):**

- Best combined score in the weighted matrix under Ads-heavy constraints.
- Strong Consent Mode v2 and GTM-oriented integration support with materially lower baseline monthly cost than premium alternatives.
- Adequate fit for current scope (single primary site, limited integration surface, AI-assisted implementation path).

## Options considered

### Option A: Cookiebot

- Pros:
  - Mature category-based blocking and audit capability.
  - Good fit for static hosted sites.
- Cons:
  - Vendor lock-in and subscription overhead.

### Option B: iubenda

- Pros:
  - Compliance tooling breadth and localization support.
- Cons:
  - More configuration complexity for tag orchestration patterns.

### Option C: Osano

- Pros:
  - Strong compliance positioning and governance tooling.
- Cons:
  - Potentially higher cost and heavier operational setup.

### Option D: Custom in-house module

- Pros:
  - Full control over UX and tag integration behavior.
- Cons:
  - Legal validation, policy maintenance, and audit defensibility still require explicit governance even if engineering effort is AI-assisted.

## Short Decision Matrix

Scoring model:

- Scale: `1` (weak) to `5` (strong)
- Weights reflect current project priorities from `docs/tracking-and-consent-requirements.md`
- This matrix is for decision support and still requires legal/commercial confirmation
- Cost scoring is relative total cost of ownership at current expected traffic (`~2k` page views/day average, `~6k` peak day), including subscription, implementation effort, and ongoing operations.
- Google Ads scoring reflects practical readiness for Consent Mode v2 signals (`ad_user_data`, `ad_personalization`) and certified-CMP-friendly operating model for EEA traffic.
- Custom solution scoring assumes state-of-the-art AI agent implementation and maintenance for a limited-scope static site.

### Actual Cost Snapshot (reference values)

Pricing snapshot date: 2026-03-22.

Assumptions for comparability:

- One production domain.
- Traffic baseline around `~60,000` page views per month.
- Need for multilingual support and Google Ads-compatible consent handling.


| Provider                      | Public plan/pricing input                                                                                                 | Cost estimate for current baseline                                               | Notes                                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cookiebot                     | Premium Medium: `EUR 30` per domain/month for accounts with fewer than four domains and up to 3,500 subpages              | `~EUR 30/month`                                                                  | Pricing is subpage-based, not pageview-based. Source below is a Cookiebot partner listing because the official Cookiebot pricing page returned `403` from this environment during this session. |
| iubenda                       | Advanced: `EUR 21.99/month` (monthly billing) with 50,000 included page views, plus `EUR 0.05` per 1,000 extra page views | `~EUR 22.49/month` at 60,000 page views/month                                    | Overage estimate: 10,000 extra page views => `EUR 0.50`.                                                                                                                                        |
| Osano                         | Plus: `USD 199/month` includes 30,000 monthly visitors                                                                    | `>= USD 199/month`, likely higher at current baseline if visitor cap is exceeded | Higher tiers are listed as custom pricing on the same page.                                                                                                                                     |
| CookieYes                     | Basic: `$10/month` per domain with 100,000 pageviews included                                                             | `~$10/month`                                                                     | Includes Google Consent Mode v2 and is positioned as Google Certified CMP on pricing/features pages.                                                                                            |
| Commercial SaaS CMP (example) | Mid-tier Pro+ style plans from public US vendor pricing (2026 snapshot)                                                   | `~USD 15–20/month` site-equivalent                                               | Used only as a cost anchor in research; **not** the implemented CMS.                                                                                                                            |
| CookieScript                  | Standard: `EUR 7/month`, Plus: `EUR 9/month` (annual subscription terms shown)                                            | `~EUR 7-9/month`                                                                 | Very low-cost options with Consent Mode support, lower assurance posture in this analysis than top choices for Ads-heavy operations.                                                            |
| Custom in-house               | No vendor fee                                                                                                             | No reliable fixed monthly amount                                                 | Under AI-assisted delivery, engineering cost is significantly reduced, but legal validation, policy updates, and audit operations remain required.                                              |


Pricing sources used in this document:

- iubenda pricing: [https://www.iubenda.com/en/pricing](https://www.iubenda.com/en/pricing)
- Osano cookie consent plans: [https://www.osano.com/plans/cookie-consent](https://www.osano.com/plans/cookie-consent)
- Cookiebot pricing schedule reference: [https://www.cookieinfo.net/en/cookiebot-pricing/](https://www.cookieinfo.net/en/cookiebot-pricing/)

### Additional lower-cost alternatives (below iubenda baseline)

Baseline for comparison:

- Current iubenda estimate in this ADR is `~EUR 22.49/month` at `~60,000` page views/month.

Alternatives reviewed:


| Provider                      | Public pricing (as observed)                                                   | Estimated monthly cost at ~60k PV | Consent Mode v2 support | Ads-signal reliability view | Notes                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------ | --------------------------------- | ----------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| CookieYes                     | Basic: `$10/month` per domain with 100,000 pageviews included                  | `~$10/month`                      | Yes                     | High                        | Google Consent Mode v2 and Google Certified CMP are listed on pricing/features.                                  |
| Commercial SaaS CMP (example) | Mid-tier Pro+ style plans (2026 snapshot)                                      | `~USD 15–20/month`                | Yes (typical Pro+)      | Medium-high                 | Research-only row; **not** the live stack.                                                                       |
| CookieScript                  | Standard: `EUR 7/month`, Plus: `EUR 9/month` (annual subscription terms shown) | `~EUR 7-9/month`                  | Yes                     | Medium                      | Very low cost, but lower confidence than top options for Ads-heavy operations due to platform assurance posture. |


Sources for additional alternatives:

- CookieYes pricing: [https://cookieyes.com/pricing/](https://cookieyes.com/pricing/)
- CookieScript pricing: [https://cookie-script.com/features.html](https://cookie-script.com/features.html)

Additional alternatives recommendation:

- If minimizing spend while keeping strong Ads-oriented confidence, `CookieYes` is the best low-cost candidate.
- `CookieScript` is the lowest-cost path, but with a higher operational confidence discount for Ads-heavy usage.


| Criteria                                           | Weight  | Cookiebot | iubenda  | Osano    | CookieYes | Commercial CMP (research) | CookieScript | Custom   |
| -------------------------------------------------- | ------- | --------- | -------- | -------- | --------- | ------------------------- | ------------ | -------- |
| Category-based prior blocking                      | 20      | 5         | 5        | 5        | 5         | 4                         | 4            | 4        |
| GTM integration simplicity                         | 15      | 5         | 4        | 4        | 5         | 4                         | 4            | 4        |
| Google Ads + Consent Mode v2 operational readiness | 25      | 4         | 5        | 5        | 5         | 4                         | 3            | 3        |
| Multilingual UX support                            | 10      | 4         | 5        | 4        | 4         | 4                         | 4            | 4        |
| Audit logs and consent proof                       | 10      | 4         | 4        | 5        | 3         | 3                         | 3            | 4        |
| Static-site implementation speed                   | 10      | 5         | 4        | 3        | 5         | 4                         | 4            | 4        |
| Relative total cost of ownership                   | 10      | 3         | 4        | 2        | 5         | 4                         | 5            | 5        |
| **Weighted total (/5)**                            | **100** | **4.35**  | **4.55** | **4.25** | **4.70**  | **3.90**                  | **3.75**     | **3.85** |


Recommendation from matrix:

- `CookieYes` is the strongest low-cost performer in this matrix, combining strong Ads-readiness scoring with clearly lower baseline monthly cost.
- `iubenda` remains the highest-confidence premium option for Ads-heavy operations when you prioritize established operational assurance over minimum spend.
- `Cookiebot` and `Osano` remain strong technical options with weaker cost efficiency in this project context.
- `Custom` becomes materially more viable under AI-assisted build and maintenance, but still trails top managed CMP options for Ads-heavy operations.

Decision note for this project:

- **Implemented CMP:** **CookieConsent** (see **Decision**).
- Historical matrix primary: **CookieYes** (superseded for embed; retained in tables below for comparison).
- Keep **iubenda** as fallback reference if alternative testing reveals unacceptable Ads signal loss or GTM gating complexity.

## Historical material

Long-form vendor pricing tables, white-label gate analysis, and third-party CMP integration deep-dives were **removed from this ADR** in 2026-04-08 so active documentation does not carry retired vendor URLs or implementation prose. Recover from **git history** (file state before this edit) if audit or legal review requires the original text.

## Consequences

### Positive

- Locks a concrete platform before implementation hardening, reducing late-phase integration churn.
- Keeps consent architecture aligned with selected stack and Ads-oriented tracking requirements.

### Negative

- Introduces vendor dependency and future migration cost if platform needs change.
- Requires strict staging validation to ensure category mapping and Consent Mode signals behave as intended.

### Operational notes

- Rollout implications: no optional marketing/analytics tags can be launched without selected platform and tested category gates.
- Validation/check requirements: platform must pass all checklist items in tracking requirements doc.

## SEO and migration impact

- URL impact: none.
- hreflang/canonical impact: none direct.
- Redirect impact: none.

## Follow-up actions

- [x] Select platform: CookieYes (historical matrix).
- Validate category-level prior blocking in staging.
- [x] Update this ADR status to `Accepted`.
- [x] **2026-04-08:** Implement **CookieConsent** in **`TrackingHead.astro`** / **`cookie-consent-init.ts`**. **GTM** steps in **`docs/gtm-consent-migration-runbook.md`:** **Phase 8 · P8-07**. **Cloudflare Zaraz** ruled out while **GTM** + **Understory** remain (**`docs/cmp-vendor-matrix-seo-white-label.md`**).
