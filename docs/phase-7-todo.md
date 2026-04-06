# Phase 7 execution checklist

Purpose: track Scripts, Consent, Analytics, and Launch Hardening deliverables. Normative phase summary: `docs/grand-plan.md` (Phase 7). Exit checks: `docs/definition-of-done.md` (Phase 7).

**Position:** Phases **0–6** are **closed** (Phase 6 closure **2026-04-04**). Phase 7 is the **active** implementation phase before **`www`** cutover (**`docs/phase-8-todo.md`**).

## Identity and sharing (head markup)

- [x] **P7-01 Favicon:** **`site/public/favicon.ico`** (multi-size) plus **`favicon-16x16.png`** / **`favicon-32x32.png`**; master **`andetag-icon.png`** (1024×1024) under **`site/public/`**. Wired from **`SiteLayout.astro`**; no remote icon URLs.
- [x] **P7-02 Touch or mask icons (optional):** **`apple-touch-icon.png`** (180×180) self-hosted; **`site.webmanifest`** with **192** / **512** PNG for install hints. No separate Safari mask icon (optional later).
- [x] **P7-03 Sharing policy (baseline):** Default **`og:image`** / Twitter image: Stockholm hero still **`HERO_SV_ASSETS.poster`** (`site/src/lib/chrome/assets.ts`), large enough for **`summary_large_image`**. **`twitter:card`:** **`summary_large_image`**. **`og:locale` / `og:locale:alternate`:** unchanged from Phase 6 (`site/src/lib/chrome/seo.ts`), aligned with hreflang siblings.
- [x] **P7-04 Implement meta tags:** Title, description, full **`og:*`** and Twitter set from shell; **`og:url`** matches canonical. Optional per-shell **`ogImage`** in **`page-shell-meta.json`** (see **`docs/content-model.md`**).
- [x] **P7-05 Validate previews:** Spot-check major hubs and one deep page per locale with a sharing debugger or card validator; confirm fallback when `ogImage` is null.
  - **2026-04-06:** Parsed built **`dist/`** HTML (`npm run build` in **`site/`**): hubs **`/sv/stockholm/`**, **`/en/`**, **`/en/stockholm/`**, **`/de/berlin/`**; deep **`/sv/stockholm/biljetter/`**, **`/en/stockholm/tickets/`**, **`/de/berlin/musik-von-andetag/`**. Each has **`og:url`** = canonical **`https://www.andetag.museum…`**, **`og:image`** = **`https://www.andetag.museum/wp-content/uploads/2024/11/stockholm-hero-poster-1920w.jpg`** (**`defaultOgImageAbsoluteUrl()`** / **`HERO_SV_ASSETS.poster`**), **`twitter:card`** = **`summary_large_image`**. **`page-shell-meta.json`** has no per-page **`ogImage`** yet, so all shells exercise the null fallback path in **`SiteLayout.astro`**. Staging **`https://andetag-web.guff.workers.dev/sv/stockholm/`** (HTTP 200) matches the same **`og:image`** / **`og:url`** / **`twitter:card`**. Third-party card UIs (for example Facebook Sharing Debugger) remain for **`www`** post-cutover per checklist note below.

## Schema.org

- [x] **P7-06 JSON-LD plan (implemented shape):** **`@graph`** per page: **WebSite**, **WebPage**, **Organization**, **logo** **ImageObject**; Stockholm adds **Museum** + **TouristAttraction** (address, geo, hours, `sameAs` from legacy footer JSON-LD in **`site-html/`**); Berlin pre-opening adds **Place** only (SEO manual §11); privacy routes use minimal graph (no venue entity).
- [x] **P7-07 Implement JSON-LD:** **`site/src/lib/chrome/schema-org.ts`**, one **`application/ld+json`** script from **`SiteLayout.astro`** (off on **`404`**).
- [x] **P7-08 Berlin rules:** Berlin **`destination`** shells use **Place** only until opening protocol; flip to Museum when SEO manual §11 phase 2 is triggered (code comment / future edit in **`schema-org.ts`**).
- [x] **P7-09 Validate structured data:** Rich Results URL test on staging reported **crawl failed** (Google fetch, not JSON-LD parse errors). Equivalent validation: HTTP fetch + JSON parse + **`@graph`** type inventory on four staging URLs; **`schema-org.test.ts`** + **`npm run build`** green. Evidence: **`docs/phase-7-verification-record.md`** §P7-09. Repeat Rich Results on **`www`** after Phase 8 cutover.

## Scripts, consent, analytics (existing Phase 7 scope)

- [x] **P7-10 Tracking (initial wiring):** GTM loader + Google Consent Mode v2 **default denied** in **`TrackingHead.astro`**; container **`GTM-KXJGBL5W`** is version-controlled in tracking components. **GTM admin (staged):** set up what you can on **staging** without breaking **WordPress + Complianz** (optional **dual triggers** per **`docs/kpi-measurement-map.md`** § Staged rollout and checklist **Phase A**). **Finish** **`cmplz_*`** exit, live verification, and **Understory `dataLayer`** checks in **Phase 8** (**P8-13**, **P8-22**). **EX-0018** accepts brief tracking gaps on cutover day. Optional extended KPI taxonomy events remain **optional**.
- [x] **P7-11 Termly:** Resource blocker script is version-controlled in **`TrackingHead.astro`** (**`https://app.termly.io/resource-blocker/45781ec1-8b4c-4a0c-acef-9815cd5eabb3?autoBlock=on`**). **GTM:** complete **`docs/gtm-termly-migration-runbook.md`** on the container and re-verify staging (**`andetag-web.guff.workers.dev`**). **Deferred:** **Termly** + GTM primary production domain focus on **`www.andetag.museum`** after cutover (**`docs/phase-8-todo.md`** **P8-13**).
- [x] **P7-12 Widgets:** Understory, Brevo waitlist, and other approved embeds documented with consent classification in **`docs/tracking-and-consent-requirements.md`** **§2** and **§4a** (2026-04-06). **Brevo:** plain **`POST`** waitlist form, no on-site Brevo cookie, explicit opt-in at submit; **not** behind **Termly** categories. **Follow-up:** if legal or CMP requires **lazy iframes** (Maps, Vimeo, Spotify) to load only after **`marketing`** (or another category), implement deferral and update the inventory table.

## Sitemap, robots, launch

- [x] **P7-13 XML sitemap:** **`@astrojs/sitemap`** in **`site/astro.config.mjs`**: shell pages only, excludes **`/404`** and root **`/`** (redirect-only). Aligns with **`docs/url-migration-policy.md`** (note on root exclusion added there).
- [x] **P7-14 robots.txt:** **`site/public/robots.txt`** → **`sitemap-index.xml`**.
- [x] **P7-15 Final SEO pass:** Metadata parity, hreflang, CWV targets; showcase performance follow-up **EX-0006** after lazy or consent-gated embed patterns if still open.
- [ ] **P7-16 Sign-off:** Pre-launch checklist complete; update `docs/grand-plan.md` or a Phase 7 verification record when the phase closes.
**Production host:** Checks that require **`https://www.andetag.museum`** (for example sitemap fetch at the canonical origin, live GTM validation) are completed or repeated in **`docs/phase-8-todo.md`** after cutover.

## References

- **`Google Tag Manager v15.json`** (repository root): exported live **WordPress** container **v15**; audit and migration checklist in **`docs/kpi-measurement-map.md`**.
- **`docs/gtm-termly-migration-runbook.md`**: GTM UI steps (Termly template, dual triggers, consent, Preview).
- `docs/phase-7-verification-record.md` (evidence log as Phase 7 items close)
- `docs/grand-plan.md` (Phase 7 deliverables and acceptance checks)
- `docs/phase-8-todo.md` (deployment and post-live **`www`** verification)
- `docs/Andetag SEO Manual.md` (schema types, descriptions, Berlin protocol)
- `docs/content-model.md` (frontmatter `ogImage`, shared `seo` contract)
- `docs/tracking-and-consent-requirements.md`, `docs/kpi-measurement-map.md`
- `docs/migration-exceptions.md` (for example **EX-0006** showcase performance)
