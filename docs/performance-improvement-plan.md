# Performance improvement plan (mobile PageSpeed / Lighthouse)

## Current lab picture (April 2026)

After **P0** (hero poster), **P1** (gallery, marketing bodies, small header, about-the-artists lead aside, optical-fibre figures), and **P2** partial (lazy booking script, vanilla gallery and parallax), a **full-site batch** run helps avoid tuning only the Stockholm home URL.

**Batch method:** `cd site && npm run build && npm run lighthouse:all` (see **How to re-verify** below). **Lighthouse 11**, **mobile** configuration, **performance** category only, **`dist/`** served locally (random `127.0.0.1` port). **63** HTML routes; report example **`site/reports/lighthouse-performance.json`** (gitignored).

**Aggregate from one representative run (`generatedAt` 2026-04-05, local `serve`):**

| Aggregate | Value | Notes |
|-----------|------:|------|
| Performance score | **88–98** per URL | **Lowest 88**, **highest 98**, **mean ~93** |
| LCP (lab) | **~2.4–3.9 s** | **Mean ~3.1 s**; still above the **2.5 s** “good” CWV line on many routes |
| TBT (lab) | **~0–1 ms** typical | Main-thread blocking is **light** in this headless run; **PSI / real devices** can look worse (GTM, Termly, cache state) |
| CLS | **0** on most URLs | **Four** routes logged **CLS above 0.05** in the same run (see **Lighthouse batch insights** below) |

**Interpretation:** Image and header work moved the **score distribution** into the high 80s and 90s locally. **LCP** remains the main gap versus **2.5 s** good, clustered on routes with **small header + heavy first paint** (privacy, some Stockholm shells, optical-fibre, Berlin hub). **Do not** treat local **`serve dist`** as identical to **staging Worker** or **PSI** (TLS, `workers.dev` headers, third-party variance).

---

## Historical baseline (why this doc exists)

Mobile [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-andetag-web-guff-workers-dev-sv-stockholm/k65a1sv9n7?form_factor=mobile) reported **~61** performance for `https://andetag-web.guff.workers.dev/sv/stockholm/` (report dated **2026-04-04**). A matching **Lighthouse** run on one machine scored **~67** with **LCP ~8.1 s**, **TBT ~370 ms**, **CLS 0**, and **~10.3 MB** transfer. **LCP** was driven by a **~1.4 MB** hero poster JPEG and other **large JPEGs** under `/wp-content/uploads/`. That baseline justified **P0** and **P1** image work; the sections below keep the original technical notes as **completed specs**.

---

## Implementation status (rolling)

| Track | Status | What shipped / notes |
|-------|--------|----------------------|
| **P0** Hero poster | **Done** | Responsive **AVIF / WebP / JPEG** (`stockholm-hero-poster-{960,1920}w.*`), `<picture>` under video + **CSS fade-in** on `playing`. **LCP preload** uses **art-directed AVIF** (`lcpImagePreloads` in **`[...slug].astro`**, **`SiteLayout`**) so the preloaded file matches the **first** `<source>` (Chrome picks **AVIF**, not legacy **`960w.webp`** preload). **`HERO_SV_ASSETS.poster`** → **`1920w.jpg`** for default **`og:image`** / JSON-LD (must be served on **`www`** after Phase 8; see **`docs/phase-8-todo.md`** **P8-23** Facebook Sharing Debugger). |
| **P1** Gallery / body images | **Done** | **Gallery** (**`stockholm-marketing-gallery.ts`**). **Marketing bodies:** **`stockholm-body-responsive-images.ts`** (home, SEO, book **`HeroSection`**, **Art Yoga** / **Dejt** covers, **Berlin** After Hours teaser, default **`TestimonialCarousel`** band, **about-the-artists** lead aside **`artWeekOpeningLeadAside`**, **optical-fibre** **`malinVaver*`**) with **`{640,960}w` WebP** + **`960w` JPEG** beside sources. **`ResponsiveInlinePicture`** (**`fetchpriority`** optional for LCP candidates), **`HeroSection`** / **`TestimonialCarousel`** responsive modes. **Small header (`shared-hero-header.is-small`):** portrait mobile still (**`Mobile-BG.*-header-mobile-*`**) AVIF/WebP/JPEG; desktop uses same **`stockholm-hero-poster-*`** stack as the video hero; **`HEADER_SMALL_LCP_PRELOAD_WEBP`** with **`media=(max-width:767px)`**; **`fetchpriority=high`** on fallback **`img`**. **Optional hygiene:** circular **portrait** JPEGs on about-the-artists (**`1024x1024`**) still ship as single files; batch derivatives if a future sweep flags them. |
| **P2** Third-party + first-party JS | **Done** | **`BookingEmbed`:** Understory script **`defer`** via **`booking-embed-lazy.ts`** (viewport **`IntersectionObserver`**, ~**`400px`** **`rootMargin`**). **Gallery lightbox:** vanilla **`gallery-lightbox.ts`**. **Hero parallax:** vanilla **`hero-cover-parallax.ts`**; **`jquery`** dependency **removed** from **`site/package.json`**. **Termly** resource blocker switched to **`async`** + **`autoBlock=off`** (consent gated by GTM Consent Mode, not Termly auto-blocker). **GTM** deferred to **`window.load`** event. **`SiteLayout`** now places **`<link rel="preconnect">`** for `app.termly.io` and `googletagmanager.com` and **LCP preloads** above **`<TrackingHead />`** so the preload scanner discovers them before any script. **FCP recovered from ~2.7 s to ~1.66 s** (lab) on Stockholm home. |
| **P3** Booking API compression | **Vendor** | Ask Understory for **gzip/Brotli** on API Gateway JSON. |
| **P4** Fonts | **Partial** | **`fonts.css`** unchanged; **`SiteLayout`** adds optional **`lcpBodyFontPreloadHref`** (Baskervville 400 Latin WOFF2) on text-heavy shells (privacy all locales, music sv/en/de Berlin, corporate events, visitor reviews) wired from **`[...slug].astro`**. |
| **P5** CSS | **Open** | Hygiene only. |
| **Cloudflare zone** | **Open** | Polish, HTTP/3, cache rules per playbook below. |

**Regression checks run in-repo:** **`npm test`**, **`npm run build`**. Optional **`npm run lighthouse:all`** after meaningful image or header changes; use **`LIGHTHOUSE_MIN=85`** for a hard gate (lab noise may require occasional threshold tweaks).

---

## Lighthouse batch insights (April 2026)

**Slowest LCP (same run as § Current lab picture):** **`/en/stockholm/privacy/`** (~**3.92 s**), **`/sv/stockholm/musik/`** (~**3.91 s**), **`/en/stockholm/visitor-reviews/`** (~**3.81 s**), **`/sv/stockholm/foretagsevent/`** (~**3.79 s**), then **Berlin hub**, **Art Yoga**, **optical-fibre** (sv/en/de) around **3.45–3.65 s**.

**Lowest performance scores in that run:** **88** on **`/en/stockholm/privacy/`**, **`/sv/stockholm/foretagsevent/`**, **`/sv/stockholm/musik/`**; **89** on **`/de/berlin/die-kuenstler-malin-gustaf-tadaa/`** and **`/en/stockholm/visitor-reviews/`**.

**CLS outliers (lab):**

| Path | Approx. CLS | Comment |
|------|------------:|---------|
| `/de/berlin/die-kuenstler-malin-gustaf-tadaa/` | **~0.12** | **Mitigation (2026-04-05):** hero **`figure`** **`aspect-ratio: 1024 / 683`** + **`object-fit: cover`** (shared **`page-om-konstnarerna-sv__figure--hero`** CSS). Re-run Lighthouse to confirm. |
| `/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/` | **~0.09** | Same as DE artists page. |
| `/en/stockholm/accessibility/` | **~0.08** | **Mitigation (2026-04-05):** single **`ContentSection`** (one column, no inter-section gap). |
| `/sv/stockholm/tillganglighet/` | **~0.08** | Same as EN accessibility. |

**LCP tail (same batch):** **Mitigation (2026-04-05):** **`lcpBodyFontPreloadHref`** on privacy, music (sv/en + Berlin de/en), corporate events, visitor reviews. **Musik** / **`musik-von-andetag`:** Spotify **`.page-musik-sv__spotify`** **`min-height: 652px`** to limit embed paint shift.

**What the sweep does *not* prove:** **INP**, real **CrUX** field data, **`www`** vs **`workers.dev`**, or **GTM** under consent banners on cold visits. Re-validate high-traffic URLs on **staging** and **PSI** after each wave.

**Additional fixes suggested by patterns (not all implemented):**

1. **Privacy and long text pages:** LCP may still be **text** or **first large block**; re-audit **LCP element** after **Baskervville** route preload; **`font-display`** and **`sources.json`** hygiene remain open (**P4**).
2. **Visitor reviews / Musik / Företagsevent:** **Jost + Baskervville** preloads now ship on those shells; confirm in DevTools that LCP is not a deferred image; adjust **`HeroSection`** **`loading`** only if fold estimates are wrong.
3. **Mid-page `HeroSection` covers:** Default **`loading="lazy"`** is correct for below-the-fold bands; if the fold is mis-estimated on some viewports, switch to **`eager`** only for those routes (narrow change, test in Lighthouse).
4. **Optical-fibre `malin-vaver2`:** **`960w` WebP** was once **larger than the JPEG** in a build-time check; re-encode (**`magick` quality / method**) or rely on **`640w`** in **`srcset`** only if mobile LCP still picks the heavy candidate.
5. **`en/berlin/` hub (score ~90):** Treat like other **Berlin hero** pages if video or poster differs from Stockholm tuning.

---

## How this aligns with broader guidance (Cloudflare + static sites)

This project is a **static export** (Astro `output: "static"`) served from **Cloudflare Workers** with **`dist/`** as static assets ([ADR 0001](decisions/0001-static-stack-selection.md)). That matches the common pattern Cloudflare describes for fast sites: **pre-built HTML/CSS/JS**, **edge caching**, and **fewer server round-trips** than a dynamic CMS per request.

### Cloudflare Learning: [Tips to improve website speed](https://www.cloudflare.com/en-gb/learning/performance/speed-up-a-website/)

The article’s checklist maps to this codebase as follows (gaps are where we still have work):

| Cloudflare recommendation | This stack | Notes / action |
|---------------------------|------------|----------------|
| **Measure first** (Core Web Vitals, TTFB, DNS, TTI) | Lighthouse / PSI + optional **Cloudflare Observatory** (dashboard) | Use the same canonical URL (staging vs `www`) when comparing runs. |
| **Optimize images** (dimensions, resolution, compression) | Strong for shipped P1 | Hero poster (P0), gallery, small header, marketing **`picture`** / covers, testimonial, about-artists lead, optical-fibre (**done**). Remaining: **portrait duo** **`1024x1024`** on about-the-artists, optional **WebP tuning** for **`malin-vaver2`**, route-specific LCP preloads only after DevTools confirmation. |
| **Limit HTTP requests** | Partially | Lab run showed **~63 requests** on Stockholm home; third parties multiply trips; audit duplicates and lazy third-party load. |
| **Browser caching** (`Cache-Control`, etc.) | Strong for fingerprints | `site/public/_headers` covers `/_astro/*`, fonts, uploads (**`/wp-content/uploads/*`** ~**30d** `max-age` + long **`stale-while-revalidate`** for large video or poster repeat visits; replace-in-place at the same URL should use a new filename per **`AGENTS.md`**). HTML stays short TTL or revalidate. |
| **Remove render-blocking JS** | Mixed | GTM in head; Understory booking script uses **`defer`** (**P2** partial). |
| **Limit external scripts** | Understory, GTM, Termly | Defer, lazy-load, or isolate (Partytown) where tags allow; reduces **layout shift** risk from late-injected widgets. |
| **Limit redirects** | Policy-heavy | Entry **`/`** / **`/en/`** routing is intentional ([`url-migration-policy.md`](url-migration-policy.md)); avoid **chains** and extra hops on marketing landing URLs. |
| **Minify CSS/JS** | Default via Astro build | Still verify no large inline blocks; marginal gains but standard hygiene. |
| **Fast hosting / DNS / CDN** | Workers + Cloudflare DNS | TTFB for HTML is edge + Worker path; static assets benefit from POP proximity. |
| **Security without slowing users** | Zone + Worker | Tune bot/WAF rules so legitimate traffic is not over-challenged on HTML and assets. |

**Core Web Vitals:** Cloudflare’s article highlights **LCP**, **FID**, and **CLS**. In Google’s current CWV set, **Interaction to Next Paint (INP)** has **replaced FID** as the responsiveness metric; Lighthouse still surfaces **Total Blocking Time (TBT)** as a lab proxy. The **April 2026** batch had **weak LCP** versus **2.5 s** on many URLs and **mostly CLS ~0**, with **four** routes above **0.05** (see [Lighthouse batch insights](#lighthouse-batch-insights-april-2026)); watch **INP** in the field after JS and consent changes.

**Related Cloudflare Learning links** worth skimming for static sites: [What is JAMstack?](https://www.cloudflare.com/en-gb/learning/performance/what-is-jamstack/), [Static site generator](https://www.cloudflare.com/en-gb/learning/performance/static-site-generator/), [Lazy loading](https://www.cloudflare.com/en-gb/learning/performance/what-is-lazy-loading/), [HTTP/2 vs HTTP/1.1](https://www.cloudflare.com/en-gb/learning/performance/http2-vs-http1.1/), [What is HTTP/3?](https://www.cloudflare.com/en-gb/learning/performance/what-is-http3/).

### Static-site–specific practices (beyond the article)

1. **Shift cost to build time:** Image variants, minification, and sitemap generation belong in **`npm run build`**, not the browser (consider `@astrojs/image` or a small Sharp script for `srcset` if you want automation).
2. **Immutable hashed assets:** Astro’s `/_astro/*` filenames are ideal for **`immutable`** caching (already in `_headers`); avoid caching HTML aggressively unless deploy purges are reliable.
3. **Prefetch discipline:** Astro/client **prefetch** of internal links helps perceived speed but **adds bytes and CPU** on mobile; enable only where it matches product goals.
4. **Third parties are the new “origin”:** API Gateway JSON and widgets bypass your static optimizations; treat them like slow origins (compression **P3**, script loading **P2**, lazy load).
5. **Video hero:** `preload="none"` on the hero video is good for **data**; LCP is then **poster-driven**, so poster weight dominates (P0).

---

## How to re-verify (you or CI)

1. **PageSpeed Insights:** Paste the exact URL (with trailing slash if that is canonical) and compare Mobile vs Desktop. Prefer **field data** (CrUX) when available; lab scores fluctuate.
2. **Chrome Lighthouse** (same engine as PSI): DevTools → Lighthouse, or CLI (Lighthouse 11+ uses **`--form-factor=mobile`**, not **`--preset=mobile`**):
   ```bash
   cd site && npx lighthouse@11 "https://andetag-web.guff.workers.dev/sv/stockholm/" \
     --only-categories=performance --form-factor=mobile --output=json --output-path=./lh.json
   ```
   For a **local** `dist/` check: `npx serve dist -l 4321` then point Lighthouse at **`http://127.0.0.1:4321/sv/stockholm/`**.
   **Batch (every built route):** `cd site && npm run build && npm run lighthouse:all`. Serves **`dist/`** on a random port, runs **mobile** performance-only Lighthouse per page, writes **`site/reports/lighthouse-performance.json`** (ignored by git via **`site/reports/lighthouse-*.json`**). Env: **`BASE_URL`** to hit staging or production instead; **`LIGHTHOUSE_PATHS=/de/berlin/foo/,/sv/stockholm/bar/`** for a subset; **`LIGHTHOUSE_MIN=85`** to exit **1** if any score is below the threshold (CI gate).
3. **Cloudflare Observatory:** In the Cloudflare dashboard for the zone, use **Observatory** (Speed / observability features vary by plan) to cross-check lab results against edge-oriented signals; useful after toggling Polish, HTTP/3, or cache rules.
4. **Chrome DevTools:** Performance + Network, throttle to “Slow 4G”; confirm **LCP element** and **TTFB** on the HTML document. Slow TTFB often points to **DNS**, **TLS**, **Worker logic**, or **cold edge**, not image bytes.
5. **WebPageTest** (optional): Filmstrip and multi-region runs for **redirect chains** and first-byte timing on real networks.

---

## Prioritized pain points and mitigations

### How priority was chosen (read this first)

**Historical (pre-P0):** Lighthouse weighted **LCP** heavily; one run showed **LCP ~8.1 s**, **TBT ~370 ms**, **CLS 0**. That ordered work as **hero poster first**, then **other large JPEGs**, then **JS**, then **API**, then **fonts/CSS**.

**After P0–P1 and the April 2026 batch:** **TBT** in local headless runs is often **negligible**; **LCP ~3 s** band is now the usual **lab** bottleneck versus the **2.5 s** good line. **CLS** is mostly **0** but **four** URLs showed **layout shift** in one batch (see [Lighthouse batch insights](#lighthouse-batch-insights-april-2026)).

**Original track map (still valid as labels):**

| Priority | Theme | Rationale (original) |
|----------|--------|----------------------|
| **P0** | Hero poster / above-the-fold media | Drove **LCP** when poster was ~**1.4 MB** JPEG. **Done.** |
| **P1** | Gallery and body images | Bulk **bytes** and format audits. **Done** for scoped marketing routes; **optional** portrait derivatives remain. |
| **P2** | Third-party **JavaScript** (Understory, GTM) | Booking script **lazy** + **defer** **done**; **GTM** / Termly **open**. Improves **TBT** and critical path on **real** visits more than in minimal headless lab. |
| **P3** | Booking **API** JSON compression | **Vendor**; large uncompressed JSON; parallel track. |
| **P4** | Fonts | Smaller than image work; matters more when **LCP is text** (privacy, dense copy). |
| **P5** | CSS weight / minification | Hygiene after bigger wins. |
| **Playbook** | Cloudflare zone | **Parallel**; does not fix wrong-sized origin images. |

---

### Next actions (reprioritized, April 2026)

Use this order when **serial** engineering time is limited. **Parallel** items (P3, Playbook) can overlap.

| Order | Focus | Why now |
|------:|--------|---------|
| **1** | **LCP tail to 2.5 s (lab)** | Batch **mean LCP ~3.1 s**; worst URLs cluster on **small header + body** (privacy, musik, företagsevent, visitor-reviews, optical-fibre, some Berlin). Use **DevTools → Performance** on **one representative URL per pattern**; fix **confirmed** LCP element (font vs image vs lazy). Avoid blind preloads. |
| **2** | **CLS on four routes** | **Die Künstler (de)**, **Om konstnärerna (sv)**, **accessibility / tillgänglighet** pair. Reproduce in **mobile** viewport; check **font swap**, **`picture`**, **embeds**. |
| **3** | ~~GTM / consent load strategy (complete P2)~~ **Done** | Termly `async` + `autoBlock=off`; GTM deferred to `window.load`; preconnect hints and LCP preloads moved above tracking in `<head>`. FCP recovered ~1 s on Stockholm home (lab). Re-check PSI after `www` cutover. |
| **4** | **Portrait images on about-the-artists** | **Malin / Gustaf** **`1024x1024`** circles still single JPEGs; add **`{640,960}w` WebP** + **`960w` JPEG** if byte audits warrant. |
| **5** | **P3** Booking API **gzip/Brotli** | Still **vendor**; unchanged rationale. |
| **6** | **P4** Fonts | Subset, drop unused weights, align **`preload`** with actual **LCP text** face on **small-header** routes. |
| **7** | **P5** CSS + **Cloudflare playbook** | **Polish** / **HTTP/3** / cache rules: validate on **`www`** after cutover; watch **Mirage** vs explicit **`loading`**. |

**Dropped as primary focus:** **jQuery removal** (**done**). **Hero poster megabyte** crisis (**done**). Do not re-open unless **regression** or **new hero asset** ships without derivatives.

---

### P0 — Hero poster and above-the-fold imagery (LCP)

**Status: implemented** (see **Implementation status** table). The following was the original spec; file paths today are **`stockholm-hero-poster-*`** and **`SiteHeader.astro`** uses a **`<picture>`** layer instead of a single **`video poster=`** JPEG.

**What Lighthouse said (pre-fix):** “Properly size images”, “Serve images in next-gen formats”, “Efficiently encode images” with the **hero poster** at the top of each list (~1.4 MB legacy JPEG).

**Original root cause:** One full-size JPEG preloaded for LCP.

**Plan (completed):**

1. **Produce optimized poster assets** (keep provenance: export from the same source frame, do not invent imagery):
   - **Mobile width** (e.g. 800–1200 px wide) WebP + AVIF (or WebP-only if AVIF tooling is heavy).
   - **Desktop** wider variant if needed (still avoid 2K+ sources if the hero never displays that wide).
2. **Use `<picture>`** on the hero (or swap `poster=` to a smaller default and upgrade via media): `source type="image/avif"`, `source type="image/webp"`, `img` fallback JPEG for ancient browsers.
3. **Keep** `rel=preload` but point it at the **smallest correct candidate** for the **first paint** (often the mobile WebP/AVIF if CSS hides a large desktop crop on small screens), or use **responsive preload** only if you can match real breakpoints (preload is single-URL; prefer matching the default LCP viewport).
4. **Recompress legacy JPEG** if you must keep a single URL: quality ~70–80, 4:2:0, strip metadata; target **well under 200 KB** for mobile poster where possible.

**Files / code touchpoints:** `site/src/lib/chrome/assets.ts`, `site/src/components/chrome/SiteHeader.astro`, `site/src/pages/[...slug].astro` (`lcpImagePreloadHref`), assets under `site/public/wp-content/uploads/...`.

---

### P1 — Gallery and content images (bytes + decode cost)

**Status: done** for scoped marketing and story routes (including **small header**, **about-the-artists** lead aside, **optical-fibre** figures). **Exit gap:** circular **portrait** **`1024x1024`** JPEGs on about-the-artists duo columns remain single-file; treat as **P4-style** hygiene unless a sweep flags them.

**What Lighthouse said:** Multiple `/wp-content/uploads/...` JPEGs **1.0–1.5 MB** each; large “wasted bytes” for responsive and format audits.

**Shipped (gallery):**

1. Eight marketing photos (Stockholm home, SEO landings, Vilken typ): **`.../*-gallery-{640,960}w.webp`**, **`*-gallery-960w.jpg`**.
2. **`GallerySection`** + **`stockholm-marketing-gallery.ts`**.

**Shipped (bodies, covers, testimonial band):**

1. **`stockholm-body-responsive-images.ts`:** **`andrumLookingBody`**, **`andrumMeditationBody`**, **`introAside18_058Body`**, **`artYogaHeroCover`**, **`dejtTestimonialHeroCover`**, **`berlinAfterHoursBody`**, **`testimonialCarouselDefaultBg`** (**`Andetag-27-037-copy-scaled`** derivatives). Book band: **`STOCKHOLM_BOOK_HERO_COVER`** in **`assets.ts`**.
2. **`ResponsiveInlinePicture.astro`**; **`HeroSection`** + **`TestimonialCarousel`** accept **`BodyPictureSources`** or legacy string URLs.
3. **`components.css`:** **`.component-hero-cover-picture`**, **`.testimonial-block__bg--picture`**, figure **`picture`** rules.

**Ongoing workflow:** Batch-optimize new uploads before commit; add entries to **`stockholm-body-responsive-images.ts`** (or split module if it grows) when introducing new large marketing photos.

**Files:** `site/src/components/ui/ResponsiveInlinePicture.astro`, `site/src/lib/content/stockholm-body-responsive-images.ts`, `site/src/components/content/HeroSection.astro`, `site/src/components/content/TestimonialCarousel.astro`, `site/src/lib/ui-logic/hero-cover-image.ts`, `site/src/lib/chrome/assets.ts`, `GallerySection` / gallery module as before, assets under `site/public/wp-content/uploads/...`.

---

### P2 — Third-party JavaScript: Understory + GTM

**Status: done.**

**What Lighthouse said (historical):** “Reduce unused JavaScript”; **understory.io** and **GTM** highlighted. **`jquery`** was removed (**2026-04**); **gallery** and **hero parallax** are vanilla.

**April 2026 regression diagnosis:** A/B Lighthouse testing (`npm run perf:impact`) confirmed the synchronous Termly resource-blocker `<script>` in `<head>` was the primary regression: it blocked the HTML parser for ~1.7 s (DNS + TLS + download + execute), adding ~1.2 s to FCP and ~1.3 s to LCP versus a no-Termly baseline. GTM added another ~1 s to LCP. Combined, tracking scripts cost ~14 performance points and ~1.9 s LCP on the Stockholm home page.

**Shipped fixes (April 2026):**

1. **Booking widget script:** **Done:** **`defer`** injection via **`booking-embed-lazy.ts`** when the embed nears the viewport (**`IntersectionObserver`**, **`rootMargin` ~400px**); without **`IntersectionObserver`**, load immediately.
2. **Termly `async` + `autoBlock=off`:** Resource-blocker loads with `async` so it no longer blocks the parser. `autoBlock=off` because GTM Consent Mode handles tag gating. FCP recovered from ~2.7 s to ~1.66 s (lab, Stockholm home).
3. **GTM deferred to `window.load`:** GTM bootstrap wrapped in `addEventListener("load", ...)`. Consent defaults (`denied`) set synchronously before either script.
4. **Preconnect hints:** `<link rel="preconnect">` for `app.termly.io` and `googletagmanager.com` as first elements in `<head>`.
5. **LCP preloads above tracking:** Image and font preloads moved before `<TrackingHead />` in `SiteLayout.astro`.
6. **jQuery:** **Done:** vanilla DOM; `jquery` is not in `site/package.json`.

**After-fix lab results (Stockholm home, mobile, 3-run median):** Perf 76 → 81, FCP 2.71 s → 1.66 s, render-blocking requests 3 → 2, render-blocking ms 1963 → 852. Berlin home: 80 → 93. Visitor reviews: 86 → 93.

**Files:** `site/src/components/embeds/BookingEmbed.astro`, `site/src/client-scripts/booking-embed-lazy.ts`, `site/src/client-scripts/gallery-lightbox.ts`, `site/src/client-scripts/hero-cover-parallax.ts`, `site/src/components/chrome/TrackingHead.astro`.

---

### P3 — Third-party payload: booking API JSON (compression)

**What Lighthouse said:** “Enable text compression” with **large JSON** responses from `*.execute-api.eu-west-1.amazonaws.com/.../upcoming?...` (~150–190 KB each **uncompressed** in lab).

**Why after P2:** High impact on **total bytes** and the compression audit, but requests usually run **after** the widget’s script executes; fixing **depends on the vendor** (or a bespoke edge proxy). Track in parallel with P2 if two owners exist.

**Plan:**

1. **Vendor / backend:** Ask Understory (or whoever owns the API Gateway) to enable **gzip and/or Brotli** on API responses (`Content-Encoding: br` or `gzip`). This is the correct fix; you cannot set headers on their origin from Cloudflare alone unless traffic is **proxied through your zone** with a transforming Worker.
2. **App-level mitigation (optional):** Reduce **parallel month fetches** if the widget requests many ranges at once; fewer requests help mobile CPUs and contention (requires Understory widget support or custom integration).
3. **Advanced (only if product agrees):** A **Cloudflare Worker** on your hostname could cache normalized calendar JSON at the edge with short TTL; only if data freshness and terms allow.

---

### P4 — Fonts (seven font files)

**Diagnostics:** ~7 font requests on the home page.

**Plan:**

1. **Audit** `site/src/styles/fonts.css` and `sources.json`: drop unused weights/styles; prefer **variable fonts** if one file replaces many.
2. **Subset** Latin + required glyphs only for display faces.
3. **Continue** selective `preload` for the **one** face used in the LCP text (you already preload Jost 500 on the Stockholm hero path).

---

### P5 — CSS weight and minification hygiene (secondary)

**Observation:** Multiple large CSS files ship minified and compressed (~47–59 KB uncompressed per file in lab); Lighthouse did not flag render-blocking as failing in this run.

**Plan:**

1. Longer-term **critical CSS** or **route-level splitting** if Astro/CSS pipeline allows; lower priority than images and third parties.
2. **Minification:** Astro production builds already minify JS/CSS; Cloudflare’s article still recommends this as baseline hygiene. Avoid large **inline** scripts and styles unless they are tiny or intentionally critical-path.

---

## Cloudflare configuration playbook (for you)

These apply to the **zone** that serves `www.andetag.museum` (and any hostname that orange-clouds through Cloudflare). **`*.workers.dev`** uses Workers + static assets; some zone features only apply when the **custom hostname** is routed through Cloudflare with the right setup.

Cloudflare’s overview ([speed up a website](https://www.cloudflare.com/en-gb/learning/performance/speed-up-a-website/)) assumes a classic **origin + CDN**. Here the **Worker + `ASSETS`** combo *is* the delivery path: DNS and edge still matter; “origin” is Cloudflare’s asset pipeline plus any **Worker CPU** on the request path.

### Already in repo

- **`site/public/_headers`:** Long cache for `/_astro/*`, fonts, uploads. Good baseline for **Workers static assets** ([Workers static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/)). This implements the article’s **browser HTTP caching** recommendation for static paths.

### DNS and TTFB (easy wins, often overlooked)

1. Use **Cloudflare as DNS** for the production zone with **proxied** (`orange cloud`) records as intended. Slow DNS undermines every first visit.
2. Keep **TLS** modern (Full Strict); stale clients are rare; botched TLS modes add retries and latency.
3. **Worker path length:** Entry routing that does extra lookups or redirects adds **TTFB**; keep the **`200`** path for locale HTML as direct as possible (see [`url-migration-policy.md`](url-migration-policy.md)).

### Recommended dashboard checks (Speed → Optimization)

1. **Brotli / compression:** Ensure responses are compressed at the edge. For **Workers**, responses your Worker returns must opt into compression where applicable; **static assets** from `assets.directory` are served by Cloudflare and typically compress well. Re-test HTML/CSS/JS `Content-Encoding` in DevTools.
2. **HTTP/2 and HTTP/3:** Cloudflare supports **HTTP/2** by default; enable **HTTP/3 (QUIC)** on the zone for high-latency mobile ([HTTP/3 learning article](https://www.cloudflare.com/en-gb/learning/performance/what-is-http3/)). Multiplexing (HTTP/2+) also addresses the classic **many small requests** penalty versus HTTP/1.1 ([HTTP/2 vs HTTP/1.1](https://www.cloudflare.com/en-gb/learning/performance/http2-vs-http1.1/)).
3. **Early Hints (103):** Optional; can help preconnect/preload hints for critical origins (evaluate with care so you do not hint stale URLs).
4. **Polish** (image optimization): Matches Cloudflare’s **image optimization** bullet: automatic WebP/AVIF derivation for **JPEG/PNG** on eligible proxied traffic. **Caveats:** Verify visual quality for brand photography; **does not replace** deliberate art direction and responsive `srcset` in markup. Confirm it applies to your **production** route (Worker + custom domain vs `workers.dev`).
5. **Mirage** (mobile optimization): Optional deferred loading; can conflict with your **explicit** `loading` and LCP tuning. If enabled, **re-run LCP** tests ([lazy loading](https://www.cloudflare.com/en-gb/learning/performance/what-is-lazy-loading/) is better done explicitly for LCP images).

### Cache Rules (Caching → Cache Rules)

- **Long TTL** for immutable build assets (you already use `immutable` on `/_astro/*`).
- **Shorter TTL** for HTML if you need fast content updates, or purge on deploy.
- For **HTML** on aggressive cache, ensure **no stale** `andetag_entry` or locale cookies break personalization (likely N/A for this static site).

### Argo / Tiered Cache

- **Tiered Cache** can reduce origin load; mostly relevant if you had an origin server. For **Workers + R2/static**, benefit varies; optional.

### Security vs speed

- **DDoS / bot** protections should filter abuse **without** heavy friction for normal browsers on HTML and static assets; aggressive challenges on every asset hurt LCP and INP. Tune Super Bot Fight Mode / WAF rules after cutover and re-check Lighthouse.

### What Cloudflare will **not** fix alone

- **Understory AWS API** missing `Content-Encoding` (third-party origin).
- **Oversized images** in `public/` (must fix bytes at source or via build pipeline).
- **Blocking third-party scripts** without code changes (`async`/`defer`, lazy load).
- **Redirect chains** in your own marketing or legacy links (fix at source; Cloudflare cannot remove extra hops inside a long chain without URL normalization rules you maintain).

---

## Verification checklist (after changes)

- [x] **P0** Lighthouse mobile LCP improved materially vs **~8 s** baseline; **full-site batch** **mean LCP ~3.1 s** (local) still above **2.5 s** good (see [Next actions](#next-actions-reprioritized-april-2026) **item 1**).
- [x] **P1** Stockholm home and marketing routes no longer ship **multi-megabyte** unoptimized JPEGs for scoped **`picture`** / gallery / header paths; re-check **Network** total after **GTM** completes if comparing to legacy **~10 MB** anecdotes.
- [ ] **LCP ≤ 2.5 s** (lab, throttled) on **worst batch URLs** (privacy, musik, företagsevent, visitor-reviews) after targeted fixes.
- [ ] **CLS** regression check on **four** URLs flagged in [Lighthouse batch insights](#lighthouse-batch-insights-april-2026).
- [x] Booking widget still functions after **`defer`** (dates, language, checkout handoff).
- [x] Gallery lightbox (open / close / Escape) without jQuery.
- [ ] GTM + consent: tags still fire correctly after any future load deferral (**P2** completion).
- [x] Visual parity on hero poster and video fade (stakeholder sign-off when possible).
- [ ] **P3** API responses carry **`Content-Encoding`** when Understory enables compression (verify in Network).
- [ ] **Production `www`:** Facebook Sharing Debugger on key URLs after cutover (**`docs/phase-8-todo.md`** **P8-23**).

---

## Summary

The original **60s** scores were driven by **LCP and bytes**: a **very large hero poster**, **multi-megabyte gallery JPEGs**, **uncompressed booking JSON**, and **heavy third-party JS**. **P0**, **P1** (including **small header**, **about-the-artists** lead, **optical-fibre** figures), and **P2** partial (**lazy** booking, **vanilla** gallery and parallax, **no jQuery**) address most of that. A **April 2026** **`lighthouse:all`** sweep over **63** routes (local **`dist`**) landed **performance ~88–98** with **mean ~93**, but **mean LCP ~3.1 s** shows **room to the 2.5 s** line, plus **four** **CLS** outliers to investigate.

**Next leverage:** **LCP tail** (per-route DevTools), **CLS** fixes, then **GTM** load strategy, **P3** API compression, **fonts**, **CSS**, and **Cloudflare** playbook. Keep validating **LCP**, **INP** (field), and **CLS**, not only the synthetic score. **Social:** default **`og:image`** targets **`https://www.andetag.museum`**; confirm with **Facebook Sharing Debugger** on **`www`** after Phase 8 (**P8-23**).
