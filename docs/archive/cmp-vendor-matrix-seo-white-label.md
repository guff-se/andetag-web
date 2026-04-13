# CMP vendor matrix: white-label, implementation, price, technical SEO

Purpose: single place to compare consent platforms against **your** criteria:

1. **White-label:** no visible vendor **“Powered by”** / logo in the live consent UI (contractual toggle or plan feature, not CSS hacks).
2. **Ease of use / implementation:** effort to ship on a **static** site (**Astro**) with **GTM** as the tag router.
3. **Price:** rough monthly cost for a **single** production site at about **~60k page views/month** (or closest published limit); normalize where vendors bill on **sessions**, **consents**, or **domains**.
4. **SEO (technical only):** how the CMP **implementation** can affect **Core Web Vitals**, **crawler rendering**, and **perceived quality** (not legal compliance).

**Not covered here:** legal adequacy, DPA terms, or jurisdiction. **Always confirm** plan gates and prices on the vendor checkout page before buying.

**Research snapshot:** 2026-04-06. Vendors change plans often.


**Termly is not used** on the live site; production CMP is **CookieConsent** (self-hosted). This file is a frozen vendor research snapshot from 2026-04; it does not describe the current stack.

---

## How to read “SEO impact” (technical)

CMPs usually add **third-party JavaScript** early in `**head`**. That can affect:


| Factor                         | What to watch                                                                                                                                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **LCP / FCP**                  | Extra script parse and network to vendor origins on first load. Mitigation: keep hero content independent of CMP, avoid synchronous chains.                                                                                                |
| **CLS**                        | Banners that inject late or change height cause layout shift. Mitigation: fixed **bottom** bar, reserved space, avoid full-screen flash without skeleton.                                                                                  |
| **INP**                        | Heavy preference modals or main-thread work on first click. Mitigation: defer non-critical work, simple first layer.                                                                                                                       |
| **Crawling / indexing**        | Google generally renders JS; CMPs rarely block **HTML** content unless you configure an aggressive **wall** or overlay that hides primary copy. Misconfigured **paywall / consent wall** products can harm **UX signals** if users bounce. |
| **First-party vs third-party** | Serving the CMP script from **your own subdomain** (where offered) can reduce third-party count and sometimes **CSP** friction; it does not remove the script cost entirely.                                                               |


**Ratings in the table:** **Low** / **Medium** / **High** **SEO implementation risk** means **risk if you use default snippets and heavy modals**, not a measured Lighthouse score for your site.

---

## Master comparison table

Sorted alphabetically. **WL** = white-label (no vendor mark in UI, per vendor marketing or docs).


| Vendor                              | WL: minimum plan / notes                                                                                                  | Ballpark price @ ~60k PV equivalent¹                                                                                               | Implementation ease²                                                                      | SEO technical risk³                                                                                                    | Primary sources (2026-04-06)                                                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ABconsent** (Sirdata)             | **Unclear** on **Smart**; **Partner** program for agencies                                                                | **~€25/mo** Smart (up to **10M PV**/mo stated)                                                                                     | Medium                                                                                    | Medium                                                                                                                 | [sirdata.com ABconsent pricing](https://www.sirdata.com/en/ABconsent-Pricing)                                                                                                     |
| **Acceptrics**                      | **Unknown**; customize appearance                                                                                         | **Unknown** (free WP plugin entry; paid unclear)                                                                                   | **Easy** (Google documents GTM path)                                                      | Medium                                                                                                                 | [GTM: Set up Acceptrics](https://support.google.com/tagmanager/answer/16293571), [acceptrics.com](https://acceptrics.com/)                                                        |
| **Axeptio** (often spelled Axeptio) | **Agency / Enterprise** for reseller-style WL; consumer plans emphasize customization                                     | **~€69/mo** **Medium** (100k PV/mo band)                                                                                           | Easy                                                                                      | Medium (modal-style UX can add **CLS** if not tuned)                                                                   | [axept.io pricing](https://www.axept.io/pricing)                                                                                                                                  |
| **Clickio Consent**                 | **Enterprise** (quote): **“White label solution”** not on Free/Pro/Pro+                                                   | **Pro+ ~£35**/site/mo (up to **1.5M** PV/account); **WL** needs **Enterprise**                                                     | Medium–high (publisher stack, paywall options)                                            | Medium–high (paywall/consent modes can affect **UX** if misused)                                                       | [clickio.com consent_compare_plans](https://clickio.com/consent_compare_plans/)                                                                                                   |
| **Concord**                         | **Unclear** for full removal; strong **custom branding** (logo, colors, fonts) in docs                                    | **~$29/mo** **Essentials** (20k **sessions** on pricing page) or **$9** Lite if session cap fits                                   | Easy–medium                                                                               | Medium                                                                                                                 | [concord.tech pricing](https://concord.tech/pricing), [custom branding docs](https://concord.tech/docs/setting-up-custom-branding-logos-colors)                                   |
| **consentmanager.net**              | **Whitelabel on Free and all paid tiers** (list says **Whitelabel** even on **€0**)                                       | **~€23/mo** **Starter** (**100k** views/mo); Free is **3k** views/mo only                                                          | Easy (GCM v2, TCF, large install base)                                                    | Medium (**auto-blocking** can interact with tag timing; optional **WL domain** may help **CSP** and third-party count) | [consentmanager.net/pricing](https://www.consentmanager.net/pricing/), [whitelabel domains help](https://help.consentmanager.net/books/cmp/page/working-with-whitelabeld-domains) |
| **Cookiebot** (Usercentrics)        | **Plan for “Powered by” removal not verified** in official excerpts (avoid CSS-only hiding)                               | **~€30/mo** **Premium Medium** band (subpage limits, not PV)                                                                       | Easy                                                                                      | Medium                                                                                                                 | [cookiebot.com pricing](https://www.cookiebot.com/en/pricing)                                                                                                                     |
| **CookieFirst**                     | **White label banner** on **Basic** and **Plus**                                                                          | **€9/mo** Basic or **€19/mo** Plus                                                                                                 | Easy                                                                                      | Medium                                                                                                                 | [cookiefirst.com CMP](https://cookiefirst.com/consent-management-platform/)                                                                                                       |
| **CookieHub**                       | **Remove branding** row on [compare plans](https://www.cookiehub.com/compare-plans) (**confirm** tier; not inferred here) | **~Basic** tier band: **30k sessions** (~**500k** PV equivalent in their table); **see live pricing**                              | Easy (**GTM** docs)                                                                       | **Low–medium** (session-based billing can mean **fewer** loads than per-pageview CMPs for multi-page sessions)         | [cookiehub.com/compare-plans](https://www.cookiehub.com/compare-plans)                                                                                                            |
| **CookieScript**                    | **Copyrights removed** from **Lite** up; **“full GDPR”** in vendor copy points to **Plus**                                | **Plus** annual (see vendor); **Lite ~€7–9**/mo annual in prior ADR snapshot                                                       | Easy; **self-hosted script** option on paid tiers (may reduce third-party **dependency**) | **Low–medium** if self-hosted                                                                                          | [help: pricing plans](https://help.cookie-script.com/en/articles/30255-free-and-paid-pricing-plans)                                                                               |
| **CookieTractor**                   | **Unclear** full WL; **partner** program                                                                                  | **€400/year** **Medium** (**15k pages**, unlimited visitors)                                                                       | Easy                                                                                      | Medium                                                                                                                 | [cookietractor.com/pricing](https://www.cookietractor.com/pricing)                                                                                                                |
| **CookieYes**                       | **Ultimate** only: disable branding                                                                                       | **~USD 55**/mo per domain                                                                                                          | Easy (current repo integration)                                                           | Medium                                                                                                                 | [CookieYes disable branding](https://www.cookieyes.com/documentation/how-to-disable-cookieyes-branding-from-your-cookie-consent-banner/)                                          |
| **Didomi**                          | **Not published**; expect **enterprise**                                                                                  | **Sales / demo**                                                                                                                   | Medium–high                                                                               | Medium (full SDK; verify **weight** in your build)                                                                     | [didomi.io Google Consent Mode](https://www.didomi.io/google-consent-mode-v2)                                                                                                     |
| **Enzuzo**                          | **Remove logo** from **Starter** upward; **Agency** for deeper WL                                                         | **~$7/mo** Starter (annual billing shown on site)                                                                                  | Easy                                                                                      | Medium                                                                                                                 | [enzuzo.com/pricing](https://www.enzuzo.com/pricing)                                                                                                                              |
| **iubenda**                         | **Ultimate** for full removal; **Advanced** = **minimal** branding in vendor comparison story                             | **~€90/mo** monthly **Ultimate** (lower if annual)                                                                                 | Medium                                                                                    | Medium                                                                                                                 | [iubenda pricing](https://www.iubenda.com/en/pricing), [help 166](https://www.iubenda.com/en/help/166/)                                                                           |
| **Lawwwing**                        | **Remove logo / WL not documented** in public docs (design customization only)                                            | **€9.90–49.90**/mo per domain                                                                                                      | Easy                                                                                      | Medium                                                                                                                 | [lawwwing.com/prices](https://lawwwing.com/en/prices/), [docs theme](https://docs.lawwwing.com/en/configuration/theme/)                                                           |
| **OneTrust**                        | **Custom / enterprise** positioning; banner CSS customization docs exist                                                  | **Contact sales**                                                                                                                  | **Hard** (enterprise workflow)                                                            | **High** (typical enterprise bundle weight; validate on **staging**)                                                   | [onetrust cookie consent](https://www.onetrust.com/products/cookie-consent/)                                                                                                      |
| **Osano**                           | **Unclear** in public blurbs for default banner mark                                                                      | **~$199/mo** **Plus** (30k **visitors** in prior snapshots)                                                                        | Medium                                                                                    | Medium                                                                                                                 | [osano.com plans](https://www.osano.com/plans/cookie-consent)                                                                                                                     |
| **Secure Privacy**                  | **White Label Banner** from **Small**                                                                                     | **$14/mo** Small (**5k consents**); **$49/mo** Business (**50k consents**) fits **~60k** traffic better if consents track visitors | Easy                                                                                      | Medium                                                                                                                 | [secureprivacy.ai/pricing](https://secureprivacy.ai/pricing)                                                                                                                      |
| **Seers**                           | **Unclear**; **conflicting** public price tables (bundle vs CMP)                                                          | **Verify on [seers.ai/price-plan](https://seers.ai/price-plan)**                                                                   | Unknown                                                                                   | Unknown until product confirmed                                                                                        | [seers.ai price-plan](https://seers.ai/price-plan)                                                                                                                                |
| **Vendor W**                          | **Pro+**: **Remove vendor logo**                                                                                          | **USD 15–20**/site/mo                                                                                                              | Easy (**Google** + vendor **GTM** template docs)                                          | Medium                                                                                                                 | Pricing and GTM docs: use vendor site (anonymized row; see git history for original links).              |
| **TrustArc**                        | **Unclear**                                                                                                               | **Custom**                                                                                                                         | Medium–hard                                                                               | Medium–high                                                                                                            | [trustarc.com](https://trustarc.com/)                                                                                                                                             |
| **TRUENDO**                         | **WL not explicit**; customization + partner program                                                                      | **Plus ~€490/year** (**~€41/mo**), **50k unique visitors**/mo                                                                      | Easy                                                                                      | Medium                                                                                                                 | [truendo pricing](https://www.truendo.com/en-UK/pricing)                                                                                                                          |
| **UniConsent**                      | **WL not in public pricing**; likely **Enterprise**                                                                       | **£50/mo** **Value** (**500k** users/mo)                                                                                           | Medium                                                                                    | Medium                                                                                                                 | [uniconsent.com/pricing](https://www.uniconsent.com/pricing)                                                                                                                      |
| **Usercentrics** (main CMP)         | **“Brand integration”** on **Pro**; **full** removal of all marks **not confirmed** here                                  | **€30/mo Pro** (15k **sessions** band on pricing page)                                                                             | Easy–medium                                                                               | Medium                                                                                                                 | [usercentrics.com/pricing](https://usercentrics.com/pricing/)                                                                                                                     |


¹ **Normalize carefully:** “page view”, “session”, “consent event”, and “visitor” differ. Use vendor definitions at checkout.

² **Ease:** **Easy** = snippet + documented GTM / Consent Mode; **Medium** = more config or scanner work; **Hard** = enterprise onboarding.

³ **SEO technical risk:** heuristic for **default** implementations.

---

## Vendors already analyzed in depth elsewhere in this repo


| Topic                                                                                                                              | Where                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **CookieYes** vs **Complianz** GTM events, **CookieYes Ultimate** branding economics, **Vendor W Pro+** GTM + Consent Mode deep-dive | `**docs/decisions/0002-consent-platform-selection.md`** (original matrix + **Supplement** + **Vendor W** section) |
| Category model (**necessary / analytics / marketing**), embed inventory                                                            | `**docs/tracking-and-consent-requirements.md`**                                                                 |
| GTM migration steps for current stack | **docs/gtm-consent-migration-runbook.md**, **docs/kpi-measurement-map.md** |


---

## Shortlist aligned with your three criteria (non-legal)

**Strong WL + moderate price + reasonable implementation**

- **consentmanager.net Starter (~€23/mo):** **Whitelabel** explicitly on plan list; high feature density; validate **auto-blocking** vs your **LCP** on staging.
- **CookieFirst Basic/Plus (€9–19):** explicit **white label banner** at low price.
- **Secure Privacy Business (~$49/mo)** if **consent volume** maps to your traffic; **WL** on lower tier with smaller consent cap.
- **Vendor W Pro+ (~USD 15–20):** **WL** + **documented GTM** path + **Google** help article.
- **Enzuzo Starter (~$7):** **remove logo** at low price; confirm **GTM** + **Ads** fit for your container.

**If budget is secondary and you want editor-friendly enterprise tooling**

- **OneTrust**, **Didomi**, **TrustArc**: expect **custom** pricing and **heavier** implementation; **SEO** risk is **configuration-dependent**, usually **higher** script and tag surface.

**If you stay on CookieYes**

- **Ultimate (~USD 55)** is the **WL** gate; **implementation** stays **easiest** for this repository’s current wiring.

**Treat as “verify before shortlisting”**

- **Seers** (pricing confusion), **Lawwwing** (WL unclear), **UniConsent** (WL unclear), **Usercentrics/Cookiebot** (confirm **contractual** branding removal tier, not CSS), **Clickio** (WL only **Enterprise**), **Acceptrics** (pricing + WL).

---

## Third-party reviews: “Clear WL at moderate cost” shortlist

Snapshot **2026-04-06**. Star ratings move; open the links before decisions.


| Vendor                 | Where reviewed                                                                                                                                                                                                                                                                                                       | Headline signal                                                                                              | Caveats                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Vendor W** | [Trustpilot vendor.example](https://www.trustpilot.com/review/vendor.example) (~**4.7**/5, **hundreds** of reviews); [G2 CookieYes vs Vendor W](https://www.g2.com/compare/cookieyes-vs-vendorw) (~**4.3**/5, **~38** CMP-related reviews on G2 for Vendor W) | Broadly **positive**; support often praised | Trustpilot notes **paid** use of the platform; reviews mix **policies + CMP**, not CMP-only |
| **consentmanager.net** | [Trustpilot consentmanager.net](https://www.trustpilot.com/review/consentmanager.net) (~**3.9**/5, **~27** reviews); [OMR Reviews](https://omr.com/en/reviews/product/consentmanager) (~**3.9**/5, **~27**; **ease of use** / **meets requirements** often **~8**/10 in that listing) | Solid **feature** reputation; **ease of setup** often rated **high** in OMR-style breakdowns | **Fewer** English reviews than Vendor W; read **recent** 1★ themes yourself |
| **CookieFirst** | [Trustpilot cookiefirst.com](https://www.trustpilot.com/review/cookiefirst.com) (~**4.3**/5, **~8** reviews) | **Very positive** where present | **Small sample** |
| **Secure Privacy** | [Trustpilot secureprivacy.ai](https://www.trustpilot.com/review/secureprivacy.ai) (~**4.8**/5, **~53** reviews) | **Strong** on **speed of setup** and **ease** in many reviews | Still **modest** N vs Vendor W |
| **Enzuzo** | [G2](https://www.g2.com/) (vendor cites **~4.6**/5 and **100+** reviews; verify live G2 product page); [Trustpilot enzuzo.com](https://www.trustpilot.com/review/enzuzo.com) (**~1** review at time of check) | **G2** cluster looks **healthy** if reproduced on G2 | **Trustpilot** is **thin** |


**Interpretation:** For **review depth + CMP-relevant breadth**, **Vendor W** wins. **Secure Privacy** is next on **Trustpilot** quality-per-review at **mid-size** N. **consentmanager** is **credible** but with **more mixed** aggregate stars and **smaller** N. **CookieFirst** and **Enzuzo** need **trial** validation more than star averages.

---

## Fit vs ANDETAG overall needs (not legal)

Normative stack requirements come from **docs/tracking-and-consent-requirements.md** and **docs/kpi-measurement-map.md**: **GTM** as orchestration, **Consent Mode v2**, **Google Ads** readiness, optional **Meta**, **necessary** / **analytics** / **marketing** categories, **multilingual** routes (**sv / en / de**), **static** Astro, **Understory** as **necessary**, **consent logs** exportable, **white-label** UI.


| Need                                | Vendor W **Pro+**                                                                                                                                                                                                                                                                                           | consentmanager **Starter**                                                                                                   | CookieFirst **Basic+**                                                                   | Secure Privacy **Business**                       | Enzuzo **Starter+**                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| **White-label**                     | **Yes** (remove logo)                                                                                                                                                                                                                                                                                     | **Yes** (plan list)                                                                                                          | **Yes** (WL banner)                                                                      | **Yes** (WL banner tier)                          | **Yes** (remove logo from Starter in vendor copy)          |
| **GTM + Google** | **Excellent**: [Google Tag Manager Help](https://support.google.com/tagmanager/answer/14563172) plus vendor-specific GTM docs (anonymized row; see git history for URLs); repo context in **docs/decisions/0002-consent-platform-selection.md** | **Strong**: GCM v2 + TCF on [pricing](https://www.consentmanager.net/pricing/); expect standard snippet + GTM consent wiring | **Good** (CMP positioning); less **first-party** documentation depth in-repo than Vendor W | **Good** (GTM + GCM documented in knowledge base) | **Confirm** in trial: GCM v2 + your **container** patterns |
| **Non-Google tags (e.g. Meta)** | Vendor **`consentSaveDone`**-style hook + consent checks (per vendor docs) | Plan on **custom** triggers; verify against your **GTM** export | Verify | Verify | Verify |
| **Multilingual**                    | **Pro+** lists multi-language / regional rules                                                                                                                                                                                                                                                            | Strong **language** features on paper                                                                                        | Multiple languages on **Basic+**                                                         | **40+** languages on higher tiers                 | **25+** languages cited                                    |
| **Consent logs / audit**            | **Pro+** FAQ mentions **stored** logs                                                                                                                                                                                                                                                                     | Verify export for your tier                                                                                                  | Verify                                                                                   | **Strong** feature matrix                         | Verify                                                     |
| **SEO (technical)**                 | **Medium** risk default; **no** Auto Blocker + **GTM** per vendor                                                                                                                                                                                                                                         | **Medium**; **auto-blocking** timing + optional **WL domain**                                                                | **Medium**                                                                               | **Medium**                                        | **Medium**                                                 |
| **Migration effort from CookieYes** | **New** embed + **GTM** retune (same class of work as any CMP swap)                                                                                                                                                                                                                                       | Same                                                                                                                         | Same                                                                                     | Same                                              | Same                                                       |
| **Third-party confidence**          | **Highest** review volume                                                                                                                                                                                                                                                                                 | **Moderate**                                                                                                                 | **Low** (small N)                                                                        | **Good** (mid N, high average)                    | **G2** OK, **Trustpilot** weak                             |


---

## Recommendation (all things considered)

**Among the “Clear WL at moderate cost” list only:** choose **Vendor W Pro+** (**USD 15–20**/site/month, **USD 15** on annual billing).

**Why it edges the others for this project**

1. **Third-party signal:** strongest **breadth** of reviews (**Trustpilot** scale) plus a **decent G2** footprint, without relying on **tiny** samples (**CookieFirst**) or **split** G2 vs Trustpilot (**Enzuzo**).
2. **Implementation risk:** **Google’s** own GTM setup doc names **Vendor W**, and this repository already has a **Vendor W-specific** integration analysis (**ADR 0002** supplement), which shortens unknowns versus **consentmanager**, **CookieFirst**, **Secure Privacy**, and **Enzuzo** for **your** exact **GTM-KXJGBL5W** migration story.
3. **Price vs CookieYes Ultimate:** **Vendor W Pro+** undercuts **CookieYes Ultimate (~USD 55)** while meeting **WL**.
4. **Product fit:** **IAB TCF 2.3** and **GCM v2** are explicit on **Pro+**; **EU storage** story is documented for **EU** accounts.

**Runner-up:** **consentmanager.net Starter (~€23)** if you want **maximum** features per euro and accept **smaller** review N and a **busier** product (A/B tests, crawls, **whitelabel domain** option for **CSP** nerds). Run a **two-week** parallel staging check against **Vendor W**.

**If review average matters more than price:** **Secure Privacy Business (~USD 49)** has **strong** Trustpilot density for its size; you pay more than **Vendor W** or **consentmanager** at **~60k**-class traffic.

**Honorable mention (budget):** **CookieFirst** at **€9–19** is tempting, but **third-party** evidence is **too thin** to recommend as **primary** without your own **staging** proof.

**Enzuzo:** viable **budget** path only after you **reproduce** the **G2** scores on the live **G2** page and complete the same **GTM + Ads + Meta** staging checklist as for Vendor W.

**Outside this shortlist but in-repo:** staying on **CookieYes** and paying **Ultimate** remains the **lowest** **code + doc** churn if **~USD 55** is acceptable and you do not want to reopen **CMP** choice.

### Stakeholder direction (record)

- **Cloudflare Zaraz** is **out of scope:** **Understory** and the rest of the stack assume **GTM**; Zaraz does **not** govern tags that live inside **GTM** (see **§ Cloudflare Zaraz** and [Zaraz FAQ](https://developers.cloudflare.com/zaraz/faq/)).
- **Historical (2026-04-07):** interim **Vendor W** resource blocker in **`site/src/components/chrome/TrackingHead.astro`**. **Current (2026-04-08 onward):** **CookieConsent**; **Termly is not used.** **GTM** container steps in **`docs/gtm-consent-migration-runbook.md`** run in **Phase 8 · P8-07** (**`docs/phase-8-todo.md`**).

---

## Cloudflare Zaraz (platform-native alternative)

You already host on **Cloudflare** (**Workers + static assets**, see **`site/wrangler.jsonc`**). **Zaraz** is Cloudflare’s **third-party tool loader** and includes a **built-in CMP** with **Google Consent Mode v2** support. It is a **real** alternative, but it collides with how this repository is specified today.

### What Zaraz gives you


| Topic                      | Summary                                                                                                                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CMP**                    | Dashboard-configured **consent modal**, **purposes** mapped to **Zaraz tools**; preferences in a **first-party cookie** (JSON map of purpose IDs). [Consent management](https://developers.cloudflare.com/zaraz/consent-management/)                                    |
| **Google Consent Mode v2** | Automatic when the right properties exist; defaults and updates via settings or `google_consent_default` / `google_consent_update`. [Google Consent Mode](https://developers.cloudflare.com/zaraz/advanced/google-consent-mode/)                                        |
| **IAB TCF**                | Optional; **CMP ID 433** per [IAB TCF compliance](https://developers.cloudflare.com/zaraz/consent-management/iab-tcf-compliance/)                                                                                                                                       |
| **Execution model**        | Tools run **server-side** from the browser’s perspective (fewer client tags, often better **performance** than a large **GTM** client bundle). [FAQ: extensions / server-side](https://developers.cloudflare.com/zaraz/faq/)                                            |
| **Price**                  | **1,000,000** **Zaraz Events**/month **free** per account, then **USD 5** per extra **1,000,000** events. [Pricing](https://developers.cloudflare.com/zaraz/pricing-info/)                                                                                              |
| **Hosting fit**            | Intended for hostnames **proxied** on your **Cloudflare zone** (production **www.andetag.museum**). If **staging** uses **\*.workers.dev** only, **Zaraz may not mirror** production behavior; confirm in dashboard or docs before relying on staging for CMP tests. |


### White-label and “powered by”

- There is **no separate cookie-CMP vendor** fee or **“Powered by CookieYes”**-style mark in the same category as SaaS CMPs.
- Customization is **copy**, **languages**, and **[Custom CSS](https://developers.cloudflare.com/zaraz/consent-management/custom-css/)** on the modal. Docs do **not** describe **full** white-label (own CMP domain, complete removal of any **Cloudflare** association). For **strict** “no vendor footprint” branding policy, treat Zaraz as **partial**: you style the UI, but the stack is visibly **Cloudflare Zaraz** to anyone who inspects the loader.

### Critical conflict: GTM is mandatory in this repo

**docs/tracking-and-consent-requirements.md** states **GTM is mandatory** and points CMP migration work at **docs/gtm-consent-migration-runbook.md**.

Cloudflare’s **Zaraz FAQ** is explicit:

> **“Can I use Google Tag Manager together with Zaraz?”** You **can** load GTM using Zaraz, but it is **not recommended**. **Tools configured inside Google Tag Manager cannot be optimized by Zaraz, and cannot be restricted by the Zaraz privacy controls.** … **If you are currently using Google Tag Manager, we recommend replacing it with Zaraz** by configuring your tags directly as Zaraz tools.

Source: [Zaraz FAQ → Tools → Custom HTML](https://developers.cloudflare.com/zaraz/faq/).

**Implication:** **Zaraz CMP gates only what runs as Zaraz tools.** If **GA4**, **Ads**, **Meta**, **Brevo** tags stay inside **GTM**, **Zaraz consent does not govern those tags** in the way Cloudflare intends. A **Zaraz-first** architecture means **migrating off GTM** (native Zaraz integrations + **triggers** for custom events).

### Fit vs ANDETAG-specific needs


| Need                                               | Zaraz fit                                                                                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **GTM as orchestration**                           | **Poor** unless you **change policy** and **replace GTM** with Zaraz (large project).                                                                  |
| **Legacy container `Google Tag Manager v15.json`** | **Reimplemented** as Zaraz tools/triggers, not a port-by-click.                                                                                        |
| **Understory `dataLayer` events** | Today consumed by **GTM**. Zaraz would need **`zaraz.track`** (or equivalent) and **new triggers** for parity. The **booking embed** can stay a **first-party** lazy script (**`BookingEmbed.astro`**) and need not become a Zaraz **tool**. |
| **Multilingual sv / en / de**                      | Zaraz CMP supports **multiple languages** per [enable consent](https://developers.cloudflare.com/zaraz/consent-management/enable-consent-management/). |
| **Consent logs / export**                          | **Different** product surface than CookieYes; validate against your **audit** expectations in dashboard / support.                                     |
| **Technical SEO**                                  | **Potential upside** if client third-party JS drops; **downside** if misconfigured **purposes** leave tools firing without consent.                    |
| **Cost**                                           | **Very low** cash cost at **~60k** visits if event counts stay inside **free** tier; **engineering** cost to leave **GTM** is the dominant term.       |


### Verdict

- **As a drop-in next to today’s stack:** **Zaraz is not a good fit** while **GTM remains** the source of truth for **analytics and marketing** tags.
- **As a strategic replatform:** **Zaraz + Zaraz CMP** can be **excellent** on **Cloudflare** (cost, performance story, Consent Mode v2, optional TCF), **if** you accept a **GTM retirement** project and rebuild **Understory** and **conversion** instrumentation in **Zaraz**.

**Practical path if you are curious:** enable Zaraz on a **sandbox hostname** under the **andetag.museum** zone, map **one** non-production path or subdomain, and prove **GA4 + one Ads tag + Consent Mode** before touching **`TrackingHead.astro`**. Do **not** run **GTM inside Zaraz** for the real site if you want consent to **actually** gate those tags.

---

## Maintenance

When you **choose** a vendor, update `**docs/decisions/0002-consent-platform-selection.md`** (or a new ADR) and implementation docs in the **same** change set as `**TrackingHead.astro` / `TrackingBody.astro`** and **GTM** references.