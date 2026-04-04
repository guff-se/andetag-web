# Phase 7 execution checklist

Purpose: track Scripts, Consent, Analytics, and Launch Hardening deliverables. Normative phase summary: `docs/grand-plan.md` (Phase 7). Exit checks: `docs/definition-of-done.md` (Phase 7).

**Position:** Phases **0–6** are **closed** (Phase 6 closure **2026-04-04**). Phase 7 is the **active** implementation phase before **`www`** cutover (**`docs/phase-8-todo.md`**).

## Identity and sharing (head markup)

- [x] **P7-01 Favicon:** `site/public/favicon.svg` retained; **`/favicon.jpg`** added (JPEG is the current live **`/favicon.ico`** redirect target from WordPress, 150×150, self-hosted). Layout references both; no remote icon URLs.
- [ ] **P7-02 Touch or mask icons (optional):** If brand guidelines require them, add `apple-touch-icon` and any mask-icon link; keep assets self-hosted.
- [x] **P7-03 Sharing policy (baseline):** Default **`og:image`** / Twitter image: Stockholm hero still **`HERO_SV_ASSETS.poster`** (`site/src/lib/chrome/assets.ts`), large enough for **`summary_large_image`**. **`twitter:card`:** **`summary_large_image`**. **`og:locale` / `og:locale:alternate`:** unchanged from Phase 6 (`site/src/lib/chrome/seo.ts`), aligned with hreflang siblings.
- [x] **P7-04 Implement meta tags:** Title, description, full **`og:*`** and Twitter set from shell; **`og:url`** matches canonical. Optional per-shell **`ogImage`** in **`page-shell-meta.json`** (see **`docs/content-model.md`**).
- [ ] **P7-05 Validate previews:** Spot-check major hubs and one deep page per locale with a sharing debugger or card validator; confirm fallback when `ogImage` is null.

## Schema.org

- [x] **P7-06 JSON-LD plan (implemented shape):** **`@graph`** per page: **WebSite**, **WebPage**, **Organization**, **logo** **ImageObject**; Stockholm adds **Museum** + **TouristAttraction** (address, geo, hours, `sameAs` from legacy footer JSON-LD in **`site-html/`**); Berlin pre-opening adds **Place** only (SEO manual §11); privacy routes use minimal graph (no venue entity).
- [x] **P7-07 Implement JSON-LD:** **`site/src/lib/chrome/schema-org.ts`**, one **`application/ld+json`** script from **`SiteLayout.astro`** (off on **`404`**).
- [x] **P7-08 Berlin rules:** Berlin **`destination`** shells use **Place** only until opening protocol; flip to Museum when SEO manual §11 phase 2 is triggered (code comment / future edit in **`schema-org.ts`**).
- [ ] **P7-09 Validate structured data:** Run Rich Results Test or equivalent on representative URLs; fix errors before sign-off.

## Scripts, consent, analytics (existing Phase 7 scope)

- [x] **P7-10 Tracking (initial wiring):** GTM loader + Google Consent Mode v2 **default denied** in **`TrackingHead.astro`**; container **`GTM-KXJGBL5W`** (legacy) with optional **`PUBLIC_GTM_CONTAINER_ID`**. **Remaining:** map **`docs/kpi-measurement-map.md`** events in GTM, verify gating in preview and staging.
- [ ] **P7-11 CookieYes:** Optional script when **`PUBLIC_COOKIEYES_CLIENT_ID`** is set (**`site/.env.example`**). **Remaining:** configure CMP, categories, and GTM integration; validate by category on staging.
- [ ] **P7-12 Widgets:** Understory, Brevo (if retained), and other approved embeds finalized with consent classification documented.

## Sitemap, robots, launch

- [x] **P7-13 XML sitemap:** **`@astrojs/sitemap`** in **`site/astro.config.mjs`**: shell pages only, excludes **`/404`** and root **`/`** (redirect-only). Aligns with **`docs/url-migration-policy.md`** (note on root exclusion added there).
- [x] **P7-14 robots.txt:** **`site/public/robots.txt`** → **`sitemap-index.xml`**.
- [ ] **P7-15 Final SEO pass:** Metadata parity, hreflang, CWV targets; showcase performance follow-up **EX-0006** after lazy or consent-gated embed patterns if still open.
- [ ] **P7-16 Sign-off:** Pre-launch checklist complete; update `docs/grand-plan.md` or a Phase 7 verification record when the phase closes.
**Production host:** Checks that require **`https://www.andetag.museum`** (for example sitemap fetch at the canonical origin, live GTM validation) are completed or repeated in **`docs/phase-8-todo.md`** after cutover.

## References

- `docs/grand-plan.md` (Phase 7 deliverables and acceptance checks)
- `docs/phase-8-todo.md` (deployment and post-live **`www`** verification)
- `docs/Andetag SEO Manual.md` (schema types, descriptions, Berlin protocol)
- `docs/content-model.md` (frontmatter `ogImage`, shared `seo` contract)
- `docs/tracking-and-consent-requirements.md`, `docs/kpi-measurement-map.md`
- `docs/migration-exceptions.md` (for example **EX-0006** showcase performance)
