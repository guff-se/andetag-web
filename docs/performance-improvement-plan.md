# Performance improvement plan (mobile PageSpeed / Lighthouse)

**Context:** Mobile [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-andetag-web-guff-workers-dev-sv-stockholm/k65a1sv9n7?form_factor=mobile) reported **~61** performance for `https://andetag-web.guff.workers.dev/sv/stockholm/` (report dated 2026-04-04). The public PageSpeed API was unavailable (quota), so this plan is grounded in a **reproducible Lighthouse 11** run against the same URL (score **67** on this machine; treat scores as ±5–10 between runs and lab vs field).

**Primary lab signals from that run:**

| Metric | Value | Notes |
|--------|------:|------|
| Performance score | 67 | PSI showed ~61; both are “needs work” |
| LCP | ~8.1 s | Dominant issue (score ~2) |
| TBT | ~370 ms | Moderate |
| CLS | 0 | Good |
| FCP | ~1.0 s | Good |
| Total transfer | ~10.3 MB | Very heavy for one page load |

**Largest Contentful Paint (baseline audit):** Driven by the **video hero poster** and other **large JPEGs** under `/wp-content/uploads/`. Before P0, the legacy poster JPEG was ~**1.4 MB** in lab.

---

## Implementation status (rolling)

| Track | Status | What shipped / notes |
|-------|--------|----------------------|
| **P0** Hero poster | **Done** | Responsive **AVIF / WebP / JPEG** (`stockholm-hero-poster-{960,1920}w.*`), `<picture>` under video + **CSS fade-in** on `playing`, **`preload`** of **`960w.webp`** for LCP. **`HERO_SV_ASSETS.poster`** → **`1920w.jpg`** for default **`og:image`** / JSON-LD (must be served on **`www`** after Phase 8; see **`docs/phase-8-todo.md`** **P8-23** Facebook Sharing Debugger). |
| **P1** Gallery / body images | **Open** | **`GallerySection`** thumbs still load **full-size JPEGs**; high byte weight on Stockholm home and SEO landings. Next: **`srcset` + `sizes`** and/or **WebP/AVIF** variants (ImageMagick batch), optional **`@astrojs/image`**. Intro **`<img>`** on home (`andrum-looking.jpg`, hero book band, etc.) same pattern. |
| **P2** Third-party + first-party JS | **Partial** | **`BookingEmbed`:** **`defer`** on Understory script. **Gallery lightbox:** **vanilla** **`site/src/client-scripts/gallery-lightbox.ts`** (removed jQuery from **`GallerySection.astro`**). **jQuery** still used by **`hero-cover-parallax.ts`** (**`HeroSection`**). **GTM** / CookieYes unchanged (Partytown or **`load`** deferral still optional). |
| **P3** Booking API compression | **Vendor** | Ask Understory for **gzip/Brotli** on API Gateway JSON. |
| **P4** Fonts | **Open** | Audit **`fonts.css`** / **`sources.json`**. |
| **P5** CSS | **Open** | Hygiene only. |
| **Cloudflare zone** | **Open** | Polish, HTTP/3, cache rules per playbook below. |

**Regression checks run in-repo:** **`npm test`**, **`npm run build`**. Lab Lighthouse (mobile, `serve dist`): performance moved **~67 → ~86** and LCP **~12 s → ~3.7 s** on one machine (variable); re-run after P1.

---

## How this aligns with broader guidance (Cloudflare + static sites)

This project is a **static export** (Astro `output: "static"`) served from **Cloudflare Workers** with **`dist/`** as static assets ([ADR 0001](decisions/0001-static-stack-selection.md)). That matches the common pattern Cloudflare describes for fast sites: **pre-built HTML/CSS/JS**, **edge caching**, and **fewer server round-trips** than a dynamic CMS per request.

### Cloudflare Learning: [Tips to improve website speed](https://www.cloudflare.com/en-gb/learning/performance/speed-up-a-website/)

The article’s checklist maps to this codebase as follows (gaps are where we still have work):

| Cloudflare recommendation | This stack | Notes / action |
|---------------------------|------------|----------------|
| **Measure first** (Core Web Vitals, TTFB, DNS, TTI) | Lighthouse / PSI + optional **Cloudflare Observatory** (dashboard) | Use the same canonical URL (staging vs `www`) when comparing runs. |
| **Optimize images** (dimensions, resolution, compression) | Partially | Hero poster and gallery JPEGs are the main gap; see P0–P1. |
| **Limit HTTP requests** | Partially | Lab run showed **~63 requests** on Stockholm home; third parties multiply trips; audit duplicates and lazy third-party load. |
| **Browser caching** (`Cache-Control`, etc.) | Strong for fingerprints | `site/public/_headers` covers `/_astro/*`, fonts, uploads; HTML remains the usual “short TTL or no cache” tradeoff. |
| **Remove render-blocking JS** | Mixed | GTM in head; Understory booking script uses **`defer`** (**P2** partial). |
| **Limit external scripts** | Understory, GTM, CookieYes | Defer, lazy-load, or isolate (Partytown) where tags allow; reduces **layout shift** risk from late-injected widgets. |
| **Limit redirects** | Policy-heavy | Entry **`/`** / **`/en/`** routing is intentional ([`url-migration-policy.md`](url-migration-policy.md)); avoid **chains** and extra hops on marketing landing URLs. |
| **Minify CSS/JS** | Default via Astro build | Still verify no large inline blocks; marginal gains but standard hygiene. |
| **Fast hosting / DNS / CDN** | Workers + Cloudflare DNS | TTFB for HTML is edge + Worker path; static assets benefit from POP proximity. |
| **Security without slowing users** | Zone + Worker | Tune bot/WAF rules so legitimate traffic is not over-challenged on HTML and assets. |

**Core Web Vitals:** Cloudflare’s article highlights **LCP**, **FID**, and **CLS**. In Google’s current CWV set, **Interaction to Next Paint (INP)** has **replaced FID** as the responsiveness metric; Lighthouse still surfaces **Total Blocking Time (TBT)** as a lab proxy. Your measured run had **good CLS** and **weak LCP**; watch **INP** in the field after JS deferral changes.

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
3. **Cloudflare Observatory:** In the Cloudflare dashboard for the zone, use **Observatory** (Speed / observability features vary by plan) to cross-check lab results against edge-oriented signals; useful after toggling Polish, HTTP/3, or cache rules.
4. **Chrome DevTools:** Performance + Network, throttle to “Slow 4G”; confirm **LCP element** and **TTFB** on the HTML document. Slow TTFB often points to **DNS**, **TLS**, **Worker logic**, or **cold edge**, not image bytes.
5. **WebPageTest** (optional): Filmstrip and multi-region runs for **redirect chains** and first-byte timing on real networks.

---

## Prioritized pain points and mitigations

### How priority was chosen (read this first)

Lighthouse’s **performance score** weights **LCP** heavily; your lab run showed **LCP ~8.1 s** versus **TBT ~370 ms** and **CLS 0**. So **anything that is literally the LCP asset** (hero poster) comes **first**, then **other multi-megabyte images** that dominate **transfer size and decode**.

After that, order is **execution leverage**, not only raw Lighthouse “savings ms” estimates:

| Priority | Theme | Rationale |
|----------|--------|-----------|
| **P0** | Hero poster / above-the-fold media | Directly drives **LCP**; ~1.4 MB JPEG in lab. |
| **P1** | Gallery and body images | Bulk of remaining **bytes** and responsive-format audits; still image-bound work. |
| **P2** | Third-party **JavaScript** (Understory, GTM, jQuery) | **Parser-blocking** booking script and early GTM compete with the main thread; fixes are **in-repo** and shippable without waiting on vendors. Improves **TBT** and can unblock the critical path even when LCP is image-based. |
| **P3** | Booking **API** JSON compression | Large **uncompressed** payloads (~150–190 KB per month request in lab) inflate **total download** and the “text compression” audit, but traffic typically starts **after** the widget loads; **Understory/AWS must enable encoding** (or you add a Worker proxy). Often **parallel** with P2 in calendar time, but **lower than P2** for *sequential* execution if engineering time is serial. |
| **P4** | Fonts | Seven files; smaller impact than P0–P3 when **LCP is a poster**, not text. |
| **P5** | CSS weight / minification | Lighthouse did not flag render-blocking CSS as failing; **hygiene** after bigger wins. |
| **Playbook** | Cloudflare zone (DNS, HTTP/3, Polish, cache) | **Parallel** with P0–P1; do not let dashboard tuning **replace** fixing megabyte images. If **FCP/TTFB** are already good, image work still dominates **LCP**. |

**Note:** On routes **without** the booking embed, P2’s booking-script items matter less; **GTM/jQuery** still apply site-wide.

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

**Status: not started** (largest remaining byte win on Stockholm home after P0).

**What Lighthouse said:** Multiple `/wp-content/uploads/...` JPEGs **1.0–1.5 MB** each; large “wasted bytes” for responsive and format audits.

**Plan:**

1. **Responsive images:** For each large photo used in page bodies, add **`srcset` + `sizes`** (or Astro `<Image />` if you introduce `@astrojs/image` / sharp pipeline) so mobile never downloads 2000 px-wide masters. Extend **`GallerySection`** `GalleryImage` with optional **`srcset` / `sizes`** when variants exist; **`fullSrc`** (lightbox) can stay on the **full-resolution** file.
2. **Formats:** Prefer **WebP** (minimum) or **AVIF** for photos; keep JPEG/PNG fallbacks where required.
3. **Workflow:** Batch-optimize new uploads before commit; document max dimensions per layout slot in a short internal note (optional) so content stays bounded.
4. **Request count:** Cloudflare’s guidance to **limit HTTP requests** applies even when each file is small: every request pays **RTT + scheduling** (worse on mobile). After image work, re-count requests in DevTools; merge tiny icons into **SVG sprites** or inline only if it net-reduces bytes; avoid loading widgets on pages that do not need them.

**Files:** Page bodies under `site/src/components/page-bodies/` that reference `/wp-content/uploads/...`, shared components like `GallerySection.astro`, `HeroSection.astro` (hero background uses `loading="lazy"` but still benefits from smaller files).

---

### P2 — Third-party JavaScript: Understory + GTM (+ jQuery chunk)

**Status: partial** (see table).

**What Lighthouse said:** “Reduce unused JavaScript”; third-party summary highlights **understory.io** (main-thread + blocking time) and **Google Tag Manager**; **`jquery`** was bundled for **gallery lightbox** and **hero parallax**.

**Why before P3:** In-repo script loading improves **TBT** without waiting on Understory API changes.

**Plan:**

1. **Booking widget script:** **Done:** **`defer`** on **`BookingEmbed.astro`** script tag.
2. **Lazy bootstrap:** Load the Understory script only when the booking embed **enters the viewport** (`IntersectionObserver`) or after **`requestIdleCallback`** with a short timeout fallback. **Open.**
3. **GTM:** After consent work stabilizes (you already default-deny then load GTM), consider loading GTM **after** `load` or first interaction, or **Partytown**. **Open.**
4. **jQuery:** **Done** for gallery: **`gallery-lightbox.ts`** (vanilla). **Open:** **`hero-cover-parallax.ts`** still imports **`jquery`**; replace with **`scroll`/`ResizeObserver`** or drop parallax under **`prefers-reduced-motion`** only.

**Files:** `site/src/components/embeds/BookingEmbed.astro`, `site/src/client-scripts/gallery-lightbox.ts`, `site/src/client-scripts/hero-cover-parallax.ts`, `site/src/components/chrome/TrackingHead.astro`.

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

- [x] **P0** Lighthouse mobile LCP improved materially (re-run after each wave); target **&lt; 2.5 s** lab when throttled.
- [ ] **P1** Total byte weight for Stockholm home **well under** ~10 MB baseline (aim **&lt; 3–4 MB** excluding third parties); **P3** shrinks API transfer in Network panel.
- [x] Booking widget still functions after **`defer`** (dates, language, checkout handoff).
- [x] Gallery lightbox (open / close / Escape) after removing jQuery.
- [ ] GTM + consent: tags still fire correctly after any future load deferral.
- [x] Visual parity on hero poster and video fade (stakeholder sign-off when possible).
- [ ] **Production `www`:** Facebook Sharing Debugger on key URLs after cutover (**`docs/phase-8-todo.md`** **P8-23**).

---

## Summary

The original score in the 60s was driven by **LCP and bytes**: a **huge hero poster**, **multi-megabyte gallery JPEGs**, **uncompressed booking JSON**, and **heavy third-party JS**. **P0** and part of **P2** address the hero and script loading; **P1** (gallery and inline content images) and **P3** (API compression) remain the main **transfer-size** levers. **jQuery** is no longer required for the gallery lightbox; **hero parallax** is the remaining **jquery** consumer in **`site/src`**.

Keep validating **LCP**, **INP** (field), and **CLS**, not only the synthetic score. **Social:** default **`og:image`** targets **`https://www.andetag.museum`**; confirm with **Facebook Sharing Debugger** on **`www`** after Phase 8 (**P8-23**).
