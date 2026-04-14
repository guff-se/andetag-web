# Phase 8 verification record

Purpose: evidence and Gustaf sign-off for **deployment** and **production cutover** to **`https://www.andetag.museum`**.

Normative checklist: **`docs/phase-8-todo.md`**.

## Status

- Phase 8: **open** (cutover executed **2026-04-14**; post-cutover rows **P8-20**–**P8-26** still in progress).
- **Phase 7:** **closed** with **Gustaf** sign-off **2026-04-09** (**`docs/phase-7-verification-record.md`** §P7-16). **P8-05** checked **2026-04-09**.

## Pre-cutover (dev and staging)

- **P8-05 Phase 7 gate:** **Closed** **2026-04-09** (**Gustaf**; **`docs/phase-7-verification-record.md`** §P7-16).
- **P8-01 Local dev QA:** **Pass 2026-04-12.** Vitest **28** files, **110** tests pass. Astro build **63** pages, no errors. Staging canonical URL spot-check: **10** representative paths return **200** (`/sv/stockholm/`, `/en/stockholm/`, `/de/berlin/`, `/en/`, `/sv/stockholm/biljetter/`, `/en/stockholm/tickets/`, `/sv/stockholm/privacy/`, `/de/berlin/privacy/`, `/en/berlin/`, `/sv/stockholm/om-andetag/`); nonexistent path returns **404**.
- **P8-02 Staging parity:** **Pass 2026-04-12.** `npm run verify:staging-entry` on `https://andetag-web.guff.workers.dev`: all **11** entry-router checks (E1-E11) pass. Table **A** static redirects: **14/14** cases pass (including query preservation, story URL moves, privacy aliases, and `/stockholm/*` splat).
- **P8-03 Old-site URL coverage:** **Pass 2026-04-12.** Matrix audit: **61/61** canonical `keep` URLs have `index.html` in `dist/`. **23/24** redirect rules verified in `_redirects`; remaining `/` is Worker-owned by design (confirmed in E1-E7 entry-router tests). Legacy `site-html/sitemap.xml`: **0** URLs missing from the matrix. Sitemap `sitemap-0.xml`: **61** canonical URLs present, **0** redirect-source URLs. **Backlink cross-reference (completed via P8-08 GSC export):** all **49** GSC-listed page URLs checked against `_redirects` and URL matrix; **5** gaps found and fixed (see §GSC baseline snapshot / Backlink cross-reference). **28/29** redirect rules now in `_redirects` (plus Worker-owned `/`). `/stockholm/*` splat covers remaining `/stockholm/` legacy paths except the explicit `/stockholm/faq/` slug mismatch.
- **P8-08 Search Console baseline:** **Captured 2026-04-12.** GSC property `https://www.andetag.museum` (verified). Export covers 2026-01-11 to 2026-04-10 (90 days). See §GSC baseline snapshot below for full data. **Backlink cross-reference (deferred from P8-03):** all top GSC pages checked against `_redirects` and URL matrix. 5 gaps found and fixed: `/presentkort/` (3,373 imp), `/en/giftcard/` (964 imp), `/stockholm/faq/` slug mismatch (664 imp, splat would 404), `/en/artists-malin-gustaf-tadaa/` slug variant (140 imp), `/music/` (5 imp). Rules added to `_redirects` and `url-matrix.csv`.
- **P8-09 Internal link audit:** **Pass 2026-04-12.** Scanned **63** HTML files in `dist/`, **3,869** internal `<a href>` links. **0** links point to redirect-source paths from `_redirects`. Header, footer, and body links all use canonical paths. No legacy unprefixed Swedish paths or `/privacy/` aliases found in anchors.
- **P8-04 Exception sign-off:** **Approved 2026-04-12.** All active exceptions (**EX-0002** through **EX-0019**) are now **approved** or **resolved**. **EX-0017** revised: Stockholm venue schema includes **`Museum`** + paired **`LocalBusiness`**, **`aggregateRating`**, featured **`Review`** nodes, **`Offer`** nodes, and **four** dated Art Yoga **`Event`** nodes, per **`stockholm-reviews.ts`** / **`stockholm-offers.ts`** / **`art-yoga-next-occurrence.ts`**. Legacy standalone **`ArtGallery`** dropped; **`TouristAttraction`** dual type not used. See current **`docs/migration-exceptions.md`** **EX-0017**.
- **P8-10 Cutover runbook:** Drafted **2026-04-12** at **`docs/phase-8-cutover-runbook.md`**. Covers Workers custom domain binding (preferred), Workers route fallback, rollback procedure, edge cache purge, and post-cutover release discipline (P8-25). DNS TTL reduction date: _pending_ (Gustaf to execute 24-48h before cutover).
- **P8-06 Locale copy (`sv`, `en`, `de` on staging):** Gustaf sign-off dates and scope (checklist used); optional external **`de`** reviewer note

### GSC baseline snapshot (P8-08)

Captured: **2026-04-12** (export date range: 2026-01-11 to 2026-04-10, 90 days; "last 28 days" = 2026-03-14 to 2026-04-10).

| Metric | Value |
|--------|-------|
| Indexed pages | **43** (as of 2026-04-10) |
| Not-indexed pages | **28** |
| Total clicks (90 days) | **7,176** |
| Total impressions (90 days) | **37,223** |
| Average daily clicks (last 28 days) | **72.6** |
| Average daily impressions (last 28 days) | **377** |
| CTR (last 28 days) | **19.3%** |
| Crawl requests/day (90-day avg) | **93** |
| Crawl requests/day (last 28 days) | **115** |
| Avg crawl response time | **650 ms** (90-day), **642 ms** (28-day) |
| Coverage errors | 8 not-found (404), 2 redirect errors |
| Coverage warnings | 0 |

**Crawl response distribution (90 days):** 200 OK **92.3%**, 404 **4.0%**, 301 **2.5%**, 304 **0.7%**, unreachable **0.3%**, 302 **0.2%**.

**Top 10 pages by clicks (90-day export):**

| Page (legacy URL) | Clicks | Impressions | Redirect coverage |
|--------------------|--------|-------------|-------------------|
| `/` | 5,508 | 20,529 | Worker entry route |
| `/en/` | 848 | 16,941 | Worker entry route |
| `/stockholm/oppettider/` | 264 | 5,280 | `/stockholm/*` splat |
| `/stockholm/presentkort/` | 131 | 4,879 | `/stockholm/*` splat |
| `/musik/` | 80 | 7,520 | explicit rule |
| `/stockholm/hitta-hit/` | 77 | 4,649 | `/stockholm/*` splat |
| `/stockholm/dejt/` | 60 | 4,071 | `/stockholm/*` splat |
| `/stockholm/besokaromdomen/` | 55 | 3,403 | `/stockholm/*` splat |
| `/stockholm/tillganglighet/` | 51 | 4,097 | `/stockholm/*` splat |
| `/om-konstnarerna-malin-gustaf-tadaa/` | 50 | 872 | explicit rule |

All top pages are legacy WordPress URLs handled by Worker entry routing or `_redirects` rules. First canonical new-site page in the list is `/de/berlin/` (rank 11, 49 clicks).

**Top 10 queries by impressions (90-day export):**

| Query | Impressions | Clicks | Avg position |
|-------|-------------|--------|--------------|
| andetag museum | 3,804 | 1,528 | 1.9 |
| andetag | 3,316 | 1,618 | 2.1 |
| andetag stockholm | 2,274 | 1,454 | 1.1 |
| företagsevent stockholm | 1,491 | 3 | 13.2 |
| företagsevent | 1,059 | 0 | 25.1 |
| museum hötorget | 699 | 8 | 9.4 |
| företagsfest stockholm | 548 | 0 | 27.5 |
| företagsevent i stockholm | 411 | 0 | 13.1 |
| andetag hötorget | 325 | 217 | 1.0 |
| andetag utställning | 310 | 180 | 1.0 |

**Devices:** mobile **77%** of clicks (5,532), desktop **22%** (1,596), tablet **1%** (48).

**Countries:** Sweden **93%** of clicks (6,682), Germany **1.2%** (88), Finland **0.9%** (62), UK **0.7%** (48).

**Googlebot type distribution:** page resource loads **52.8%**, smartphone **19.5%**, AdsBot **18.4%**, desktop **5.4%**, image **2.3%**.

**Backlink cross-reference (P8-03 completion):** 5 redirect gaps found in GSC top pages and fixed in `_redirects` and `url-matrix.csv`:

| Legacy URL | Impressions | Clicks | Fix |
|------------|-------------|--------|-----|
| `/presentkort/` | 3,373 | 19 | added explicit 301 → `/sv/stockholm/presentkort/` |
| `/en/giftcard/` | 964 | 3 | added explicit 301 → `/en/stockholm/giftcard/` |
| `/stockholm/faq/` | 664 | 11 | added explicit 301 → `/sv/stockholm/fragor-svar/` (splat would 404: slug mismatch) |
| `/en/artists-malin-gustaf-tadaa/` | 140 | 0 | added explicit 301 → `/en/stockholm/about-the-artists-malin-gustaf-tadaa/` |
| `/music/` | 5 | 0 | added explicit 301 → `/en/stockholm/music/` |

### Pre-cutover Lighthouse baseline (staging)

Captured on **`https://andetag-web.guff.workers.dev`**: _pending_

| Page | Mobile perf | Desktop perf | LCP | CLS |
|------|-------------|--------------|-----|-----|
| `/sv/stockholm/` | | | | |
| `/en/stockholm/` | | | | |
| `/sv/stockholm/biljetter/` | | | | |
| `/de/berlin/` | | | | |

## Cutover

- **P8-07 GTM migration:** **Pass 2026-04-14.** **`docs/gtm-consent-migration-runbook.md`** Parts **A–C** published and validated on staging (**`https://andetag-web.guff.workers.dev`**); **Part D** completed on live **`https://www.andetag.museum`** (GTM Preview on **`www`**, **`cmplz_*`** triggers removed from **GA4 - All pages**, **Google ads tag - All pages**, **Meta - All pages**; **All Pages** only; republish).
- **P8-11 / P8-12:** **Pass 2026-04-14.** **`www`** serves Worker + static assets; immediate smoke: representative paths **200** (entry **`/`** **302** to **`/en/`**); **`robots.txt`** and **`sitemap-index.xml`** **200**; no mixed-content failures in Chrome check; **`andetag_entry`** cookie set on **`www`**; **CookieConsent** (CMP) working.
- **P8-13:** **Pass 2026-04-14.** Consent-gated **GA4 / Ads / Meta** behaviour confirmed on **`www`** with live container (same window as runbook Part D).

## Post-cutover (**`www`**)

- **P8-23 SEO and sharing:** **Partial 2026-04-14.** **`curl`** spot-check: **`robots.txt`** includes **`User-agent: *`**, **`Allow: /`**, **`Sitemap: https://www.andetag.museum/sitemap-index.xml`** (plus Cloudflare-managed bot blocks above). **`sitemap-index.xml`** **HTTP 200**. **`/sv/stockholm/`** has **`og:image`** absolute **`https://www.andetag.museum/...jpg`**. **GSC sitemap (operator):** first submit showed **`sitemap-0.xml`** **Hämtning misslyckades** and **0** discovered pages; **removing** the submitted **`sitemap-index.xml`** and **adding it again** fixed processing (child fetch and counts). **Facebook Sharing Debugger**, **Rich Results Test**, and **GSC URL Inspection** on live **`www`**: see §Manual post-cutover checkpoints. **Optional:** repeat URL Inspection for other high-traffic **`www`** URLs; JSON-LD diff vs **`docs/archive/phase-7-todo.md`** §Schema.org / **`docs/Andetag SEO Manual.md`**.
- **P8-20:** **Pass 2026-04-14.** **`STAGING_BASE=https://www.andetag.museum npm run verify:staging-entry`** from **`site/`**: **E1**–**E11** all **ok** (log in **`docs/phase-4-redirect-tests.md`**). Closes **`P5-06`** production entry routing.
- **P8-21 Redirect regression:** **Pass 2026-04-14.** Table **A** **`curl -sI`** on **`https://www.andetag.museum`**: **14/14** cases **301** with expected path-only **`Location`** (see **`docs/phase-4-redirect-tests.md`** execution log).
- **P8-22 Live feature pass:** **Partial 2026-04-14.** **CMP + consent + tags** already **P8-12**/**P8-13**. **Lighthouse** mobile performance-only on **four** template URLs (**`BASE_URL=https://www.andetag.museum`**, **`LIGHTHOUSE_PATHS`** comma list); see table below (local repro: **`site/reports/lighthouse-performance.json`**; **`site/reports/*.json`** is **`.gitignore`**d). **Booking / conversion on `www`:** operator confirms execution **2026-04-14** (§Manual post-cutover checkpoints); maintainer logs outcomes here, not in chat-only form. **Header locale switch** on **`www`**: step **5** in §Manual post-cutover checkpoints. **Berlin Brevo waitlist:** step **6** in §Manual post-cutover checkpoints (**Done**). **Still open:** other **P8-01** items (embeds/forms spot checks not yet listed).
- **P8-25 Release discipline:**

### Manual post-cutover checkpoints (operator)

Maintainer updates this subsection when the operator reports a step **done** (no expectation that the operator edits this file).

| Step | Checklist ref | What | Operator status | Evidence / notes |
|------|---------------|------|-----------------|------------------|
| 1 | **P8-22** | Live **`https://www.andetag.museum`**: post-consent booking path; confirm **`dataLayer`** / GTM or GA4 DebugView on receipt | **Done 2026-04-14** | Outcome text not supplied in thread; amend this row when pass/fail and event names are known. |
| 2 | **P8-23** | [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) on **`https://www.andetag.museum/sv/stockholm/`** (Debug + Scrape Again); **`og:image`** must resolve as image, not HTML | **Done 2026-04-14** | Outcome text not supplied in thread; amend if **`og:image`** URL or scrape warnings need recording. |
| 3 | **P8-23** | [Rich Results Test](https://search.google.com/test/rich-results) URL mode on **`https://www.andetag.museum/sv/stockholm/`** (or agreed alternate **`www`** Stockholm URL) | **Done 2026-04-14** | Critical-issue count not supplied in thread; amend when known. |
| 4 | **P8-23** | **Google Search Console** → **URL Inspection** for **`https://www.andetag.museum/sv/stockholm/`** → **Request indexing** (or confirm already indexed) | **Done 2026-04-14** | GSC UI outcome not supplied in thread; amend if indexing state or queue message should be recorded. |
| 5 | **P8-22** | From **`https://www.andetag.museum/en/stockholm/`**, use the **site language control** → **Swedish** (expect **`/sv/stockholm/...`**); then back to **English** (expect **`/en/stockholm/...`**) | **Done 2026-04-14** | Pass/fail and final URLs not supplied in thread; amend when known. |
| 6 | **P8-22** | **Berlin** Brevo waitlist (**`/en/berlin/`** or **`/de/berlin/`**): submit once; stay on site; checkbox + opt-in copy alignment; in-page success feedback | **Done 2026-04-14** | Initial issues: line break, navigation to **`sibforms.com`**, no success UI. **Shipped:** flex + reset **`text-indent`**, hidden **`iframe`** **`target`**, **`aria-live`** sending + thank-you (**`waitlist-form-feedback.ts`**, commits through **`709acec`**). Operator confirms **step done** post-deploy retest. |

### Production Lighthouse baseline (P8-22)

Captured on **`https://www.andetag.museum`**: **2026-04-14T10:04:05Z** (mobile, performance category only; **`npm run lighthouse:all`**).

| Page | Mobile perf | Desktop perf | LCP | CLS |
|------|-------------|--------------|-----|-----|
| `/sv/stockholm/` | 98 | _not run_ | 2.28 s | 0 |
| `/en/stockholm/` | 98 | _not run_ | 2.21 s | 0 |
| `/sv/stockholm/biljetter/` | 97 | _not run_ | 2.58 s | 0.001 |
| `/de/berlin/` | 100 | _not run_ | 1.60 s | 0 |

### Post-cutover monitoring log (P8-26)

| Date | Indexed pages | Daily clicks | Crawl rate | Coverage errors | Notes |
|------|---------------|--------------|------------|-----------------|-------|
| | | | | | |
| | | | | | |
| | | | | | |

Monitoring period: _pending_ (target: 2-4 weeks post-cutover).
Conclusion: _pending_ (confirm no SEO regression requiring intervention before closure).

## Sign-off

- **Gustaf:** _pending_
- **Date:** _pending_
