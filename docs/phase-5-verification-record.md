# Phase 5 Verification Record

Purpose: track Phase 5 evidence, per-page design approvals, and exit sign-off per `docs/phase-5-todo.md` and `docs/definition-of-done.md` Phase 5.

Status: **open** (Phase 5 in progress).

## Scope confirmation (P5-00)

Recorded 2026-03-23:

- **First-wave order:** `docs/phase-5-todo.md`, section **Swedish Stockholm migration order (agreed)**.
- **Design approval gate:** final design per page at agreed breakpoints before starting the next page; owner Gustaf.
- **Where to record approvals:** this file, dated notes per URL.
- **Component-first rule:** default for fixes during migration (`docs/phase-5-todo.md`).

## Migrated pages (body content)

| Canonical path | Source HTML | Design approved | Notes |
|----------------|-------------|-----------------|-------|
| `/sv/stockholm/gruppbokning/` | `site-html/stockholm-gruppbokning.html` (wp-post 393) | **Yes** (2026-03-23, Gustaf) | `site/src/components/pages/GruppbokningSv.astro`. |
| `/sv/stockholm/foretagsevent/` | `site-html/stockholm-foretagsevent.html` (wp-page 2651) | **Yes** (2026-03-23, Gustaf) | `ForetagseventSv.astro`. |
| `/sv/musik/` | `site-html/musik.html` (wp-page 2162) | **Pending** (second batch review) | `MusikSv.astro`; **`content-section`** **`h1`** + prose; Spotify album **`iframe`** in **`embed-shell`** (same embed **`src`** as legacy). |
| `/sv/optisk-fibertextil/` | `site-html/optisk-fibertextil.html` (wp-page 3637) | **Yes** (2026-03-23, Gustaf) | `OptiskFibertextilSv.astro`; weaving photos under `site/public/wp-content/uploads/2026/02/` (**EX-0008** resolved). |
| `/sv/stockholm/art-yoga/` | `site-html/stockholm-art-yoga.html` (wp-page 2519) | **Yes** (2026-03-23, Gustaf) | `ArtYogaSv.astro`; **EX-0009**; mid-page `HeroSection` (legacy photo + outline "Boka Yoga") before practical block. |
| `/sv/stockholm/biljetter/` | `site-html/stockholm-biljetter.html` (wp-page 2780) | **Yes** (2026-03-23, Gustaf) | `BiljetterSv.astro`; **`InfoFrame`** (single priser callout); **`BookingEmbed`** (Understory, default **`.booking-embed-contact`**, **EX-0010**); säsongskort CTA links canonical `/sv/stockholm/sasongskort/` (legacy button had no `href`). |
| `/sv/stockholm/dejt/` | `site-html/stockholm-dejt.html` (wp-page 2693) | **Yes** (2026-03-23, Gustaf) | `DejtSv.astro`; intro + photo (**`--page-aside-width` 480px**); central copy merged into intro; testimonial **`HeroSection`** + parallax; **`InfoFrame`** + accordion + **`BookingEmbed`** (default **`.booking-embed-contact`**, **EX-0010**, **Kontakta** … **`info@andetag.museum`**). |
| `/sv/stockholm/fragor-svar/` | `site-html/stockholm-fragor-svar.html` (wp-page 2881) | **Yes** (2026-03-23, Gustaf) | `FragorSvarSv.astro`; **`ContentSection`** h1; two **`AccordionSection`** columns (**`bodyHtml`**, **`.page-faq-accordions`**); internal links canonical **`/sv/stockholm/...`**. |
| `/sv/stockholm/` | `site-html/index.html` (wp-page 2) | **Yes** (2026-03-23, Gustaf) | `StockholmHomeSv.astro`; intro + FAQ (**`AccordionSection`**, **`initialOpenIndex={null}`**); gallery; biljett/säsong/privat; booking hero; Art Yoga; **`TestimonialCarousel`** (TripAdvisor shortcode omitted per **EX-0002**); Vimeo; **`PartnersSection`**; map **`#hitta`**; aside image **`Andetag-18-058-copy2-1024x683.jpg`** in **`site/public/`**. **First-wave item 8** closed. |
| `/sv/om-andetag/` | `site-html/om-andetag.html` (wp-page 2945) | **Pending** (second batch review) | `OmAndetagSv.astro`. |
| `/sv/om-konstnarerna-malin-gustaf-tadaa/` | `site-html/om-konstnarerna-malin-gustaf-tadaa.html` (wp-page 2627) | **Pending** (second batch review) | `OmKonstnarernaSv.astro`; duo column grid (**`components.css`**). |
| `/sv/stockholm/aktivitet-inomhus-stockholm/` | `stockholm-aktivitet-inomhus-stockholm.html` (4511) | **Pending** (second batch review) | `StockholmAktivitetInomhusSv.astro` → **`StockholmSeoLandingSv`**. |
| `/sv/stockholm/att-gora-stockholm/` | `stockholm-att-gora-stockholm.html` (4507) | **Pending** (second batch review) | `StockholmAttGoraSv.astro` → **`StockholmSeoLandingSv`**. |
| `/sv/stockholm/besokaromdomen/` | `stockholm-besokaromdomen.html` (3700) | **Pending** (second batch review) | `BesokaromdomenSv.astro`; WP TripAdvisor slider omitted (**EX-0012**); outbound TripAdvisor link retained. |
| `/sv/stockholm/hitta-hit/` | `stockholm-hitta-hit.html` (2826) | **Pending** (second batch review) | `HittaHitSv.astro`; **`MapEmbed`** (Google Maps **`src`** same as home). |
| `/sv/stockholm/museum-stockholm/` | `stockholm-museum-stockholm.html` (4492) | **Pending** (second batch review) | `StockholmMuseumSv.astro` → **`StockholmSeoLandingSv`**. |
| `/sv/stockholm/npf-stockholm/` | `stockholm-npf-stockholm.html` (4384) | **Pending** (second batch review) | `NpfStockholmSv.astro`; **`InfoFrame`** “Praktisk information”. |
| `/sv/stockholm/oppettider/` | `stockholm-oppettider.html` (2754) | **Pending** (second batch review) | `OppettiderSv.astro`; hours **`InfoFrame`** + **`AccordionSection`**. |
| `/sv/stockholm/presentkort/` | `stockholm-presentkort.html` (2213) | **Pending** (second batch review) | `PresentkortSv.astro`; Understory gift card external link; biljett CTA **`/sv/stockholm/biljetter/#book`**. |
| `/sv/stockholm/sasongskort/` | `stockholm-sasongskort.html` (2804) | **Pending** (second batch review) | `SasongskortSv.astro`. |
| `/sv/stockholm/tillganglighet/` | `stockholm-tillganglighet.html` (2850) | **Pending** (second batch review) | `TillganglighetSv.astro`. |
| `/sv/stockholm/utstallning-stockholm/` | `stockholm-utstallning-stockholm.html` (4483) | **Pending** (second batch review) | `StockholmUtstallningSv.astro` → **`StockholmSeoLandingSv`**; legacy H1 typo **konstutställing** preserved in wrapper. |
| `/sv/stockholm/vilken-typ-av-upplevelse/` | `stockholm-vilken-typ-av-upplevelse.html` (2930) | **Pending** (second batch review) | `VilkenTypAvUpplevelseSv.astro`; single **`h1`** (fixes nested **`h2`** in Elementor); hero still **`TADAA-LONG-V1...Still008-2-1024x576.jpg`**; **`GallerySection`** + “Vad det är, konkret” copy verbatim from source. |

## Handoff snapshot (for the next session)

- **First-wave status:** Items **1–8** are implemented and design-approved (**`/sv/stockholm/`** signed off 2026-03-23, Gustaf). First wave is **closed**.
- **Second batch (`docs/phase-5-todo.md` alphabetical table):** All **15** rows are **implemented** and wired (**`page-body-registry.ts`**, **`[...slug].astro`**, Vitest count **23** migrated paths). **Batch design approval** is the next gate (todo **Batch exception**).
- **Next:** Gustaf reviews the second batch at agreed breakpoints; log approvals in this file. Then continue **`P5-02`** / **`P5-01`** / **`EX-0007`** per **`docs/phase-5-todo.md`**.
- **Shared components recently aligned:** **`AccordionSection`** uses **`button.accordion-item-toggle`**, **`.is-open`**, **`accordion-section-exclusive.ts`** (one open per section), and **`.accordion-item-expand-inner`** bottom padding only when open (see **`docs/phase-3-component-usage.md`**). **`BookingEmbed`** ships default **`.booking-embed-contact`** (**`booking-embed-contact.ts`**, **`showContact`**, **EX-0010**). Hero language row: **`.shared-hero-lang-top`** in **`layout.css`** (**Jost**, uppercase).
- **Parser / source docs:** Legacy FAQ and accordions in **`site-html/`** remain **`<details>`**; that is source truth. The **Astro** FAQ implementation is **`FragorSvarSv.astro`** + **`AccordionSection`** (not raw **`<details>`** in output).
- **Changelog:** Notable Phase 5 and component work is under **`CHANGELOG.md`** **Unreleased**.

## Quality gates (representative pages)

Deferred until enough conversion-priority pages are migrated (`P5-08`).

### Lighthouse / LCP notes (local, 2026-03-24)

- **Observed:** CLI Lighthouse 12, **`/sv/stockholm/`**, mobile profile with **simulated** throttling (`npm run build` + `astro preview`): LCP ~**9s** with the **hero CTA** as LCP node and almost all time in **render-delay** phase. The same URL with **`--throttling-method=provided`** (no CPU/network slowdown) scored **~100** performance with **sub-second** LCP, so lab **simulated** mobile is a harsh stress case; production and field data still matter (`P5-08`, Phase 7 CWV).
- **Changes applied (hero + head):** For **`header-192`** only (`[...slug].astro`): **preload** hero poster JPEG and **Jost 500** Latin WOFF2 (`SiteLayout` **`lcpImagePreloadHref`** / **`lcpFontPreloadHref`**). **`SiteHeader`:** hero **autoplay video** on **all** breakpoints with **`preload="none"`** and **`poster`**; **`(max-width: 900px)`** loads **`stockholm-hero-mobile.mp4`**, wider viewports **`stockholm-hero-desktop.mp4`** (H.264 faststart, re-encoded 2026-03-24; **`site/scripts/encode-stockholm-hero-videos.sh`**). **Why:** smaller transfers than legacy **`Desktop.mp4`**, earlier poster fetch and CTA font when fonts exist under **`site/public/fonts/`** (run **`npm run fonts:sync`** if preloads 404 locally).
- **Follow-up:** Re-check PageSpeed Insights after deploy; third-party embeds and Phase 7 script/consent work remain the main lever for staging **`workers.dev`** scores.

## Stakeholder sign-off

Pending Phase 5 closure.
