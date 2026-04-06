# Phase 7 Verification Record

Purpose: evidence for Phase 7 items in **`docs/phase-7-todo.md`** and **`docs/definition-of-done.md`** Phase 7. Phase 7 is **closed**; **`www`** cutover and live-only checks are **Phase 8**.

**Status:** **closed** (**Gustaf** sign-off **2026-04-09**; maintainer record **2026-04-08**). **`www`**-dependent checks continue in **`docs/phase-8-todo.md`** (**P8-07** GTM, **P8-13**, **P8-22**, …).

## P7-09 · Validate structured data

**Date:** 2026-04-06.

**Google Rich Results Test (URL mode):** Run against staging Stockholm hub **`https://andetag-web.guff.workers.dev/sv/stockholm/`**. The tool reported **crawl failed** (Google could not complete a live fetch of the page). That blocks in-tool parsing of markup and is treated as an **environment or crawler reachability** limitation for **`*.workers.dev`**, not as proof of invalid JSON-LD in the Astro output.

**Equivalent checks (passed):**

1. **HTTP fetch + extract:** For each URL below, the first **`script type="application/ld+json"`** block was **`json.loads`**-parseable, **`@context`** was **`https://schema.org`**, and **`@graph`** **`@type`** values matched **`docs/phase-7-todo.md`** **P7-06** / **`site/src/lib/chrome/schema-org.ts`** (Stockholm **Museum** + **TouristAttraction**, Berlin **Place** only, privacy minimal graph without venue types).

   | URL |
   |-----|
   | `https://andetag-web.guff.workers.dev/sv/stockholm/` |
   | `https://andetag-web.guff.workers.dev/en/stockholm/tickets/` |
   | `https://andetag-web.guff.workers.dev/de/berlin/` |
   | `https://andetag-web.guff.workers.dev/sv/stockholm/privacy/` |

2. **Unit tests:** **`npm test -- --run src/lib/chrome/schema-org.test.ts`** in **`site/`** (green).

3. **Build:** **`npm run build`** in **`site/`** (green).

**Follow-up:** After **`www.andetag.museum`** serves this static stack (**`docs/phase-8-todo.md`**), repeat **Rich Results Test** in URL mode on representative **`www`** URLs to confirm Google’s fetch and any eligible rich result classes.

### Legacy vs rebuilt schema comparison (representative parity audit)

**Date:** 2026-04-06.

Compared legacy JSON-LD in **`site-html/`** against rebuilt JSON-LD in built **`site/dist/`** for representative routes:

| Legacy source | Rebuilt route |
|-----|-----|
| `site-html/en-stockholm-tickets.html` | `/en/stockholm/tickets/` |
| `site-html/en.html` | `/en/stockholm/` |
| `site-html/de-berlin.html` | `/de/berlin/` |
| `site-html/de-ueber-andetag.html` | `/de/berlin/ueber-andetag/` |

**Observed deltas:**

- Stockholm English pages: rebuilt adds explicit **`Organization`**, removes legacy **`ArtGallery`**, **`LocalBusiness`**, and **`Event`**.
- Berlin pages: rebuilt uses **`Place`** only and removes legacy **`Museum`** and **`TouristAttraction`** on pre-opening Berlin pages.
- Rebuilt Stockholm venue nodes omit legacy optional commerce or social-proof fields (**`aggregateRating`**, **`review`**, **`offers`**).

These are treated as intentional schema-policy deviations and logged as **`EX-0017`** in **`docs/migration-exceptions.md`**.

## P7-12 · Widgets and consent classification

**Date:** 2026-04-06.

**Deliverable:** Embed inventory and consent labels in **`docs/tracking-and-consent-requirements.md`**:

- **§2** Brevo waitlist: HTML **`POST`** only (**`WaitlistFormEmbed.astro`**), no Brevo script or cookie on page load; required **`OPT_IN`** checkbox and privacy link; **outside CMP category gating** (separate Brevo **tracking** tags via GTM remain **`marketing`** if introduced).
- **§4a** Table: Understory booking (**`necessary`**), Brevo waitlist (not CMP-gated), Vimeo (**`marketing`**), Google Maps (**`marketing`**), Spotify (**`marketing`**), GTM + CMP (**Termly** after **2026-04-07**) roles noted.

**Verification:** Doc-only; no runtime change. **`npm test -- --run`** in **`site/`** (2026-04-06): green (**25** files, **98** tests).

## P7-11 · CMP + GTM (CookieYes closure, Termly embed)

**Dates:** 2026-04-06 (staging sign-off on **CookieYes**); **2026-04-07** (embed switch to **Termly**).

**Historical (through 2026-04-06):** **`TrackingHead.astro`** loaded **CookieYes** (**`cdn-cookieyes.com`**, client **`fce30d588ad80c2888014047a65067c1`**) with Consent Mode v2 **default denied** before GTM (**`GTM-KXJGBL5W`**). **Gustaf sign-off:** category model (**`necessary`**, **`analytics`**, **`marketing`**) and GTM consent gating matched **`docs/tracking-and-consent-requirements.md`**; banner and preferences checked on **`https://andetag-web.guff.workers.dev`**. **`andetag_entry`** documented as **necessary** per **`docs/url-migration-policy.md`**. Understory: no cookie observed in manual check; classification **`necessary`** (**§4** / **§4a**).

**Current in-repo wiring (2026-04-07):** **`TrackingHead.astro`** loads **Termly** resource blocker (**`app.termly.io/resource-blocker/45781ec1-8b4c-4a0c-acef-9815cd5eabb3?autoBlock=on`**) after inline consent defaults and before GTM; **`TrackingBody.astro`** holds GTM **`noscript`** only; **`SiteFooter.astro`** includes **`termly-display-preferences`**. **GTM** container migration (**`docs/gtm-termly-migration-runbook.md`**) is **deferred** to **Phase 8 · P8-07** (just before **`P8-11`**). **Re-verify** banner, categories, and consent-gated tags on staging after **P8-07** publish and on **`www`** after **P8-13** / **P8-22**.

## P7-15 · Final SEO pass (metadata, hreflang, CWV, EX-0006)

**Date:** 2026-04-06.

### Metadata parity

- **`page-shell-meta.json`** is the single source for shell **`title`** and **`description`**; **`PAGE_SHELL_PATHS`** is **`Object.keys(meta.pages)`**, so every indexed shell has meta rows.
- **`site/src/lib/routes/page-shell-registry.test.ts`** asserts non-empty **`title`**, non-empty trimmed **`description`**, and **`canonicalPath`** identity for all **61** shells.

### Hreflang and canonical

- Existing registry tests: self **`hreflang`** per shell language, no cross-location **`sv`↔Berlin** mixing, **`/en/`** hub expectations, Berlin English **`x-default`** to **`/de/berlin/`**.
- **EX-0016:** New test builds **`createPageLayoutModel`** for the four Berlin English story shells and asserts **`canonicalUrl`** equals **`buildCanonicalUrl(seoCanonicalPath)`** (Stockholm English index target), matching **`SiteLayout.astro`** **`link rel="canonical"`** and **`og:url`**.

### CWV and Lighthouse (lab)

- **`docs/definition-of-done.md`** Phase 7: mobile Lighthouse Performance **>= 85**, desktop **>= 95** on key conversion pages; shared gates cite field-style CWV (LCP, INP, CLS).
- Evidence on hand: **`site/reports/lighthouse-performance.json`** (**2026-04-05**, mobile, local static serve): **performance** score **minimum 88** across all listed routes; lowest observed **LCP** lab timings exceed **2.5 s** on some long-form shells (for example English Stockholm privacy), consistent with **EX-0014** lab variance notes. **Desktop** category sweep not stored in-repo in this artifact; repeat on **`www`** or add a desktop sweep in Phase 8 if required.

### EX-0006 follow-up

- Internal **`/component-showcase/`** remains removed. **P7-15** documents that production pages do not stack the full embed set; **`docs/migration-exceptions.md`** **EX-0006** **`follow_up`** updated accordingly. Optional lazy or consent-gated iframes stay under **P7-12** inventory follow-up.

**Verification:** **`npm test`** and **`npm run build`** in **`site/`** (2026-04-06) after registry test extension.

## Documentation · Legacy GTM export and Termly migration

**Date:** 2026-04-06 (audit); runbook path **2026-04-07** (**`docs/gtm-termly-migration-runbook.md`**).

Repository root **`Google Tag Manager v15.json`** (live WordPress container **v15**) audited; findings and maintainer checklist recorded in **`docs/kpi-measurement-map.md`**. **`docs/tracking-and-consent-requirements.md`** §1a summarizes Complianz trigger coupling and Understory **`dataLayer`** parity. **GTM** admin execution: **Phase 8 · P8-07** (not Phase 7).

## P7-16 · Phase 7 closure

**Maintainer record:** **2026-04-08.** All **`docs/phase-7-todo.md`** rows **checked** for in-repo and staging-documented deliverables. **Explicit deferral:** full **GTM** container work (**`docs/gtm-termly-migration-runbook.md`**) is **Phase 8 · P8-07**, just before **`P8-11`** (**`docs/phase-8-todo.md`**).

**Verification:** **`npm test -- --run`** and **`npm run build`** in **`site/`** green; **`docs/grand-plan.md`** Phase 7 **Status** set to **complete**.

**Stakeholder sign-off (Phase 7):** **Gustaf** approved **closure of Phase 7** **2026-04-09**. Phase 7 is **done**; **staging → `www`** promotion and **Phase 8** pre-cutover gates (**P8-05**, **P8-06**, **P8-07**, …) are **separate** and **not** implied by this sign-off alone.
