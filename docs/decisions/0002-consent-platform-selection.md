# ADR 0002: Consent Platform Selection

Status: Accepted
Date: 2026-03-22
Amendment: 2026-04-06 (white-label economics; **§ Supplement**); 2026-04-06 (**Termly Pro+** deep-dive); **2026-04-07** (**implementation:** **Termly** embed in **`TrackingHead.astro`**, **`docs/gtm-termly-migration-runbook.md`**)
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

**Original (2026-03-22):** Accepted platform decision: use **CookieYes** as the consent platform for the Astro + Cloudflare implementation (matrix rationale below).

**Superseded for implementation (2026-04-07):** The static site uses **Termly** (**resource blocker** UUID **`45781ec1-8b4c-4a0c-acef-9815cd5eabb3`**, **`autoBlock=on`**) in **`site/src/components/chrome/TrackingHead.astro`**, before **GTM**. **GTM** remains the tag orchestration layer per **`docs/tracking-and-consent-requirements.md`**. Operator steps: **`docs/gtm-termly-migration-runbook.md`**.

**Original CookieYes rationale (historical):**

- Best combined score in the current weighted matrix under Ads-heavy constraints.
- Strong Consent Mode v2 and GTM-oriented integration support with materially lower baseline monthly cost than premium alternatives.
- Adequate fit for current scope (single primary site, limited integration surface, AI-assisted implementation path).

**Original** decision accepted by Gustaf on **2026-03-22**. **Termly** adoption recorded **2026-04-07** (white-label economics and GTM documentation favored **Termly Pro+** over **CookieYes Ultimate**; see **§ Supplement**).

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


| Provider        | Public plan/pricing input                                                                                                 | Cost estimate for current baseline                                               | Notes                                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cookiebot       | Premium Medium: `EUR 30` per domain/month for accounts with fewer than four domains and up to 3,500 subpages              | `~EUR 30/month`                                                                  | Pricing is subpage-based, not pageview-based. Source below is a Cookiebot partner listing because the official Cookiebot pricing page returned `403` from this environment during this session. |
| iubenda         | Advanced: `EUR 21.99/month` (monthly billing) with 50,000 included page views, plus `EUR 0.05` per 1,000 extra page views | `~EUR 22.49/month` at 60,000 page views/month                                    | Overage estimate: 10,000 extra page views => `EUR 0.50`.                                                                                                                                        |
| Osano           | Plus: `USD 199/month` includes 30,000 monthly visitors                                                                    | `>= USD 199/month`, likely higher at current baseline if visitor cap is exceeded | Higher tiers are listed as custom pricing on the same page.                                                                                                                                     |
| CookieYes       | Basic: `$10/month` per domain with 100,000 pageviews included                                                             | `~$10/month`                                                                     | Includes Google Consent Mode v2 and is positioned as Google Certified CMP on pricing/features pages.                                                                                            |
| Termly          | Pro+: `$20/month` monthly or `$15/month` annual                                                                           | `~$20/month` monthly (`~$15/month` annual)                                       | Pro+ includes Consent Mode v2, multi-language support, and regional consent rules.                                                                                                              |
| CookieScript    | Standard: `EUR 7/month`, Plus: `EUR 9/month` (annual subscription terms shown)                                            | `~EUR 7-9/month`                                                                 | Very low-cost options with Consent Mode support, lower assurance posture in this analysis than top choices for Ads-heavy operations.                                                            |
| Custom in-house | No vendor fee                                                                                                             | No reliable fixed monthly amount                                                 | Under AI-assisted delivery, engineering cost is significantly reduced, but legal validation, policy updates, and audit operations remain required.                                              |


Pricing sources used in this document:

- iubenda pricing: [https://www.iubenda.com/en/pricing](https://www.iubenda.com/en/pricing)
- Osano cookie consent plans: [https://www.osano.com/plans/cookie-consent](https://www.osano.com/plans/cookie-consent)
- Cookiebot pricing schedule reference: [https://www.cookieinfo.net/en/cookiebot-pricing/](https://www.cookieinfo.net/en/cookiebot-pricing/)

### Additional lower-cost alternatives (below iubenda baseline)

Baseline for comparison:

- Current iubenda estimate in this ADR is `~EUR 22.49/month` at `~60,000` page views/month.

Alternatives reviewed:


| Provider     | Public pricing (as observed)                                                   | Estimated monthly cost at ~60k PV          | Consent Mode v2 support | Ads-signal reliability view | Notes                                                                                                            |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------------ | ----------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| CookieYes    | Basic: `$10/month` per domain with 100,000 pageviews included                  | `~$10/month`                               | Yes                     | High                        | Google Consent Mode v2 and Google Certified CMP are listed on pricing/features.                                  |
| Termly       | Pro+: `$20/month` monthly or `$15/month` annual                                | `~$20/month` monthly (`~$15/month` annual) | Yes (Pro+)              | Medium-high                 | Good feature coverage including regional rules and multilingual support.                                         |
| CookieScript | Standard: `EUR 7/month`, Plus: `EUR 9/month` (annual subscription terms shown) | `~EUR 7-9/month`                           | Yes                     | Medium                      | Very low cost, but lower confidence than top options for Ads-heavy operations due to platform assurance posture. |


Sources for additional alternatives:

- CookieYes pricing: [https://cookieyes.com/pricing/](https://cookieyes.com/pricing/)
- Termly pricing: [https://termly.io/pricing/](https://termly.io/pricing/)
- CookieScript pricing: [https://cookie-script.com/features.html](https://cookie-script.com/features.html)

Additional alternatives recommendation:

- If minimizing spend while keeping strong Ads-oriented confidence, `CookieYes` is the best low-cost candidate.
- `Termly` is a viable second low-cost option if you prefer its broader bundled compliance tooling.
- `CookieScript` is the lowest-cost path, but with a higher operational confidence discount for Ads-heavy usage.


| Criteria                                           | Weight  | Cookiebot | iubenda  | Osano    | CookieYes | Termly   | CookieScript | Custom   |
| -------------------------------------------------- | ------- | --------- | -------- | -------- | --------- | -------- | ------------ | -------- |
| Category-based prior blocking                      | 20      | 5         | 5        | 5        | 5         | 4        | 4            | 4        |
| GTM integration simplicity                         | 15      | 5         | 4        | 4        | 5         | 4        | 4            | 4        |
| Google Ads + Consent Mode v2 operational readiness | 25      | 4         | 5        | 5        | 5         | 4        | 3            | 3        |
| Multilingual UX support                            | 10      | 4         | 5        | 4        | 4         | 4        | 4            | 4        |
| Audit logs and consent proof                       | 10      | 4         | 4        | 5        | 3         | 3        | 3            | 4        |
| Static-site implementation speed                   | 10      | 5         | 4        | 3        | 5         | 4        | 4            | 4        |
| Relative total cost of ownership                   | 10      | 3         | 4        | 2        | 5         | 4        | 5            | 5        |
| **Weighted total (/5)**                            | **100** | **4.35**  | **4.55** | **4.25** | **4.70**  | **3.90** | **3.75**     | **3.85** |


Recommendation from matrix:

- `CookieYes` is the strongest low-cost performer in this matrix, combining strong Ads-readiness scoring with clearly lower baseline monthly cost.
- `iubenda` remains the highest-confidence premium option for Ads-heavy operations when you prioritize established operational assurance over minimum spend.
- `Cookiebot` and `Osano` remain strong technical options with weaker cost efficiency in this project context.
- `Custom` becomes materially more viable under AI-assisted build and maintenance, but still trails top managed CMP options for Ads-heavy operations.

Decision note for this project:

- **Implemented CMP:** **Termly** (see **Decision** section amendment).
- Historical matrix primary: **CookieYes** (superseded for embed; retained in tables below for comparison).
- Keep **`iubenda`** as fallback reference if **Termly** testing reveals unacceptable Ads signal loss or GTM gating complexity.

## Supplement: White-label requirement (2026-04-06)

### New explicit criterion

**Requirement:** No visible vendor **“Powered by”** (or equivalent) attribution in the **cookie consent UI** on the public site. Treat this as **white-label banner** parity, not merely color or copy tweaks.

**Why this changes the economics:** The **2026-03-22** matrix scored **CookieYes** strongly in part on **Basic**-tier list pricing (~**USD 10**/month per domain, **100k** page views). That tier **does not** satisfy the white-label requirement below.

### Vendor feature gates (banner branding removal)

Primary sources checked for this amendment: CookieYes documentation, Termly pricing page, iubenda pricing and help, CookieScript help center. **Confirm at purchase time:** vendors change plans and feature gates.


| Provider                     | Minimum plan that supports removing banner “Powered by” / vendor mark (per vendor docs or pricing page)                                                                                                                      | Indicative list price for that white-label capability                                                                                                                                                                | Notes                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CookieYes**                | **Ultimate** only: admin toggle **“Disable CookieYes branding”**                                                                                                                                                             | **~USD 55**/month per domain (list; EUR checkout may differ, **VAT** may apply; stakeholder observation **~EUR 55**/month aligned with Ultimate positioning)                                                         | [CookieYes: disable branding](https://www.cookieyes.com/documentation/how-to-disable-cookieyes-branding-from-your-cookie-consent-banner/) states **Ultimate plan only**. **Free** and **Basic** do **not** include this.                                                                                                                                                          |
| **Termly**                   | **Pro+** includes **“Remove Termly logo”**                                                                                                                                                                                   | **USD 20**/month per website (monthly billing) or **USD 15**/month (annual billing)                                                                                                                                  | [Termly pricing](https://termly.io/pricing/) lists **Remove Termly logo** under **Pro+**. Also lists **Google Consent Mode v2**, **IAB TCF 2.3**, **custom banner styles**.                                                                                                                                                                                                       |
| **iubenda**                  | **Ultimate** for **full** branding removal on embeds (privacy policy button and strip); **Advanced** described as **minimal** branding only for cookie solution in vendor comparison materials                               | **EUR 89,99**/month or **USD 119,99**/month (monthly); lower on annual commitment (**EUR 79,99** / **USD 99,99** equivalent)                                                                                         | [iubenda pricing](https://www.iubenda.com/en/pricing) includes row **iubenda branding removal** on paid tiers; [Remove iubenda branding](https://www.iubenda.com/en/help/166/) centers on **Ultimate**. Some hosted legal pages may still require a **service-provider** disclaimer ([example FAQ](https://www.iubenda.com/en/help/2848/)), separate from the cookie banner mark. |
| **CookieScript**             | **Lite** and above: **Copyrights removed** (banner)                                                                                                                                                                          | **Lite** public list was **~EUR 7**/month and **Standard ~EUR 9**/month (**annual** billing only per vendor; see [pricing plans help](https://help.cookie-script.com/en/articles/30255-free-and-paid-pricing-plans)) | **Critical caveat:** same article states **“Lite and Standard plans do not offer full GDPR compliance … Plus plan is required.”** For an **EEA**-primary museum site, **Plus** (not Lite) may be the defensible tier; **Plus** still includes **Copyrights removed** but at higher cost (see [CookieScript pricing](https://cookie-script.com/pricing)).                          |
| **Cookiebot** (Usercentrics) | **Unclear** from official support excerpt reviewed in this session: premium plans advertise **banner customization** and custom HTML or CSS banners, but a plan-gated **“remove Powered by”** line was **not** verified here | **Premium** tiers from public price pages (often **EUR** mid-tens per domain for smaller sites)                                                                                                                      | Do **not** rely on third-party **CSS hide** recipes for branding: may conflict with **terms** and does not change contractual branding obligations. **Verify** with Cookiebot or Usercentrics before selecting for white-label.                                                                                                                                                   |
| **Osano**                    | **Not verified** in this amendment (public plan tables did not state banner white-label clearly)                                                                                                                             | **Plus** from **USD 199**/month (30k visitors) in prior ADR snapshot                                                                                                                                                 | Confirm with Osano if **Plus** removes all consumer-visible Osano marks on the default banner.                                                                                                                                                                                                                                                                                    |


### Repriced comparison at ~60k page views/month (single domain)

Rough **monthly-equivalent** cost **if** white-label is mandatory:


| Option                                                 | Order-of-magnitude monthly cost                                                | White-label fit                                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Termly Pro+**                                        | **USD 15–20**/site                                                             | Strong on price; must re-validate **GTM**, **Consent Mode v2**, **Ads**, and category blocking vs **docs/tracking-and-consent-requirements.md** (see **Termly Pro+ deep-dive** below). |
| **CookieScript Plus** (if GDPR-complete tier required) | **Above Lite** (annual billing; see vendor pricing)                            | **Copyrights removed**; validate **Google-certified CMP** and **Ads** posture vs current stack.                                                    |
| **CookieYes Ultimate**                                 | **~USD 55**/domain (EUR may approximate **~EUR 55** with tax or regional list) | Keeps existing **CookieYes** integration path; pay **5×+** vs Basic for branding removal alone.                                                    |
| **iubenda Ultimate**                                   | **~EUR 90**/month (monthly)                                                    | Premium; strongest bundle if iubenda legal and cookie stack is desired end-to-end.                                                                 |
| **CookieYes Basic** (prior economic anchor)            | **~USD 10**/domain                                                             | **Fails** white-label requirement.                                                                                                                 |


### Matrix impact (conceptual)

If **white-label** were added as a **gated** criterion (must pass **Ultimate**-equivalent or explicit **remove logo** feature, not CSS tricks):

- **CookieYes** **cost score** collapses unless the budget assumes **Ultimate**.
- **Termly Pro+** and **CookieScript** (at the **GDPR-appropriate** tier) become **much more competitive** on **price vs white-label**.
- **iubenda** remains **high assurance** at **high cost**.

### Termly Pro+ deep-dive: can it replace CookieYes here?

**Verdict:** **Yes, as a credible alternative** for this stack **if** you accept a full **GTM + embed** revalidation pass. Official sources line up with the project’s **GTM-first**, **Consent Mode v2**, and **Google Ads** posture. Nothing in this research replaces **legal** sign-off or **staging** proof (Tag Assistant, conversion checks, **Meta** if used).

#### Credentials and first-party documentation

- **Google lists Termly** in Tag Manager Help: [Set up Termly to obtain user consent](https://support.google.com/tagmanager/answer/14563172) (container template, UUID, **Advanced Consent Mode Settings**).
- Termly states **Google CMP Partner (Gold)** and **Consent Mode v2** on [Google Consent Mode CMP by Termly](https://termly.io/features/google-consent-mode/).
- **Pro+** (white-label tier here) also advertises **IAB TCF 2.3** on [Termly pricing](https://termly.io/pricing/) and [IAB TCF 2.3](https://termly.io/features/iab-tcf/). **Starter** is **not** sufficient for **Remove Termly logo** or the full **Pro+** CMP feature row in that same comparison.

#### How Termly fits Astro + static hosting

- Install: copy the **CMP snippet** into **`<head>`**, **first script** on the page (same pattern as other CMPs). [How to install your consent banner](https://support.termly.io/hc/en-us/articles/30710498593297-How-to-install-your-consent-banner/).
- **Google Tag Manager:** [How to use Termly with Google Tag Manager](https://support.termly.io/hc/en-us/articles/30710480660881-How-to-use-Termly-with-Google-Tag-Manager) prescribes:
  - **Community Template Gallery** tag **“Termly Consent Management Platform”**.
  - Triggers: **`Consent Initialization - All Pages`**, custom event **`userPrefUpdate`** (fires when preferences change), and **`Termly.consentSaveDone`** for tags that must **re-evaluate** after consent updates (including non-Google tags that lack built-in consent).
  - **Per-tag** configuration via GTM **Additional Consent Checks** (or rely on built-in checks on Google tags), using Termly’s **category-to-consent-type** mapping in that article’s table.
  - **Important:** Termly **does not recommend** enabling **Auto Blocker** when using **GTM**, because it **can interfere** with GTM serving scripts. This project already routes optional tags through **GTM**, so plan on **consent checks + Consent Mode**, not Auto Blocker + GTM together.

#### Consent Mode v2 behavior (Advanced vs Basic)

[Google Consent Mode and Termly CMP](https://support.termly.io/en/articles/7904735-google-consent-mode-and-termly-cmp) documents two integration paths (**dashboard** vs **GTM template**) and warns to keep **defaults aligned** if both are used.

- **Advanced Consent Mode:** Google tags may load immediately and **respect** consent flags (Termly notes **gtags** can be **exempt** from Auto Blocker when Consent Mode is enabled in the dashboard path).
- **Basic-style gating via GTM:** configure **Additional Consent Checks** so Google tags **do not** fire until the right Termly category is accepted.

Pick one coherent pattern per container and validate with **Tag Assistant** (same article links [Google’s consent debugging](https://developers.google.com/tag-platform/security/guides/consent-debugging)).

#### Operational validation tooling

- [How to validate Termly’s Integration with Google Tag Manager](https://support.termly.io/hc/en-us/articles/38969163235857): dashboard **GCM Compliance Scanner** checks defaults before Google tags load and after returning-user consent. **Scope:** **root URL** and configured extra URLs only (not a full-site crawl).

#### EU data and consent records

- [Does Termly store my user data in the EU?](https://support.termly.io/hc/en-us/articles/34627226576145-Does-Termly-store-my-user-data-in-the-EU): **EU storage** is configurable; **new EU accounts** default to EU; endpoints **`eu.consent.api.termly.io`** vs **`us.consent.api.termly.io`**. Restrictive **CSP** must allow the correct host (article suggests wildcard **`*.termly.io`** if you want to avoid future breakage).
- [Consent Management Platform](https://termly.io/products/consent-management-platform/) and the **FAQ** on that page state **Pro+** includes **securely stored user consent logs** (aligns with **`docs/tracking-and-consent-requirements.md`** expectation of auditability).

#### Category model vs this repo’s three labels

Project norm: **`necessary`**, **`analytics`**, **`marketing`** (`docs/tracking-and-consent-requirements.md` **§3**).

Termly uses **six** scanner categories: **Essential**, **Performance and Functionality**, **Analytics and Customization**, **Advertising**, **Social Networking**, **Unclassified** ([How do I categorize my cookies?](https://support.termly.io/hc/en-us/articles/30710505701649-How-do-I-categorize-my-cookies)). Operational approach:

- Map **policy text** and preference-center UX so visitors understand **analytics** vs **marketing** (and optional **social**), even though Termly’s internal taxonomy is finer-grained.
- In **GTM**, map **Additional Consent Checks** to the **GCM types** Termly drives (**`analytics_storage`**, **`ad_storage`**, **`ad_user_data`**, **`ad_personalization`**, etc.) per Termly’s GTM article.

**Quirk:** the same categorization article states that **recategorizing cookies in the dashboard does not impact Auto Blocker behavior** (it affects **cookie policy** and **preference center** presentation). For a **GTM + no Auto Blocker** setup, the practical gate is still **GTM consent configuration**, not that quirk, but **legal** should agree that disclosure matches what you block.

#### Non-Google tags (example: Meta)

Legacy container used **Complianz** custom events; **CookieYes** uses a different shape. **Termly** expects **`Termly.consentSaveDone`** (and consent checks) so **Meta**, **non-gtag** pixels, and similar tags **re-fire** when consent changes. Plan a **new** trigger story in GTM (not a drop-in reuse of **`cmplz_*`** or CookieYes-specific events).

#### Risks and gaps to close in a pilot

1. **End-to-end staging:** GA4, **Google Ads**, **linker**, **Understory** `dataLayer` conversions, and any **Meta** tag, under **EEA** test profiles.
2. **Multilingual** banner strings vs **sv/en/de** (Pro+ lists **multi-language** and **regional** rules on [pricing](https://termly.io/pricing/)).
3. **TCF** only if you actually need **IAB** string behavior for your ad stack; otherwise keep disabled to reduce UX weight unless **Google** or partners require it.
4. **Migration cost:** replace **`TrackingHead.astro` / `TrackingBody.astro`** embeds, publish **`docs/gtm-termly-migration-runbook.md`**, and update **`docs/kpi-measurement-map.md`** event naming notes.

### Recommended next actions (stakeholder)

1. **Resolved (2026-04-07):** **Termly** embed in **`TrackingHead.astro`**; complete **GTM** work in **`docs/gtm-termly-migration-runbook.md`** and re-run **P7-11**-class checks on staging and **`www`** (supersedes the prior **CookieYes Ultimate vs migrate** fork in this supplement).
2. **Legal or compliance review** for **Termly**: category model, **Consent Mode v2**, **logs**, and **Google Ads** readiness.
3. If CMP changes again, update **docs/tracking-and-consent-requirements.md**, **docs/kpi-measurement-map.md**, **site/src/components/chrome/TrackingHead.astro** / **TrackingBody.astro**, and **docs/gtm-termly-migration-runbook.md** in the **same** change set.

**Status note:** The **2026-03-22** matrix choice (**CookieYes**) remains in the ADR body for history; **implementation** is **Termly** (**Decision** amendment **2026-04-07**). This supplement still documents repriced **white-label** tradeoffs vs **CookieYes Ultimate**.

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
- [x] **2026-04-07:** Implement **Termly** embed + **`docs/gtm-termly-migration-runbook.md`** (replaces **CookieYes** in **`TrackingHead.astro`**). **Cloudflare Zaraz** ruled out while **GTM** + **Understory** remain (**`docs/cmp-vendor-matrix-seo-white-label.md`**).

