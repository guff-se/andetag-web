# Phase 7 execution checklist

Purpose: track Scripts, Consent, Analytics, and Launch Hardening deliverables. Normative phase summary: `docs/grand-plan.md` (Phase 7). Exit checks: `docs/definition-of-done.md` (Phase 7).

## Identity and sharing (head markup)

- [ ] **P7-01 Favicon:** Add `favicon.ico` and/or `icon.svg` (and optional PNG sizes) under `site/public/`, referenced from the root layout. No remote icon URLs.
- [ ] **P7-02 Touch or mask icons (optional):** If brand guidelines require them, add `apple-touch-icon` and any mask-icon link; keep assets self-hosted.
- [ ] **P7-03 Sharing policy:** Record chosen default `og:image` asset (path under `site/public/`, target aspect ratio, min size). Confirm `twitter:card` strategy (`summary_large_image` versus `summary`). Align `og:locale` and optional `og:locale:alternate` with `docs/Andetag SEO Manual.md` and BCP47 hreflang usage.
- [ ] **P7-04 Implement meta tags:** Wire title and description plus `og:*` and Twitter tags from page model; resolve `og:image` and `og:url` to absolute production URLs. Use shared defaults from `docs/content-model.md` (`seo.defaultOgImage`, `siteName`, `canonicalHost`); use per-page `ogImage` when a distinct preview is required.
- [ ] **P7-05 Validate previews:** Spot-check major hubs and one deep page per locale with a sharing debugger or card validator; confirm fallback when `ogImage` is null.

## Schema.org

- [ ] **P7-06 JSON-LD plan:** List which types appear globally (for example Organization) versus per destination (Place, Museum, TouristAttraction for Stockholm per `docs/Andetag SEO Manual.md` section 6).
- [ ] **P7-07 Implement JSON-LD:** Emit valid JSON-LD from Astro layouts or data modules; avoid duplicate conflicting entities on one URL.
- [ ] **P7-08 Berlin rules:** Pre-opening Berlin pages use Place only; switch to Museum (and parallel Stockholm structure) only when the Berlin opening protocol in the SEO manual is triggered.
- [ ] **P7-09 Validate structured data:** Run Rich Results Test or equivalent on representative URLs; fix errors before sign-off.

## Scripts, consent, analytics (existing Phase 7 scope)

- [ ] **P7-10 Tracking:** GTM and related tags per `docs/tracking-and-consent-requirements.md` and `docs/kpi-measurement-map.md`; category gating verified.
- [ ] **P7-11 CookieYes:** Banner and preference center behavior validated by category.
- [ ] **P7-12 Widgets:** Understory, Brevo (if retained), and other approved embeds finalized with consent classification documented.

## Sitemap, robots, launch

- [ ] **P7-13 XML sitemap:** Canonical URLs only, per `docs/url-migration-policy.md`; exclude `noindex` and non-HTML routes.
- [ ] **P7-14 robots.txt:** References sitemap; matches crawl policy.
- [ ] **P7-15 Final SEO pass:** Metadata parity, hreflang, CWV targets; showcase performance follow-up **EX-0006** after lazy or consent-gated embed patterns if still open.
- [ ] **P7-16 Sign-off:** Pre-launch checklist complete; update `docs/grand-plan.md` or a Phase 7 verification record when the phase closes.

## References

- `docs/grand-plan.md` (Phase 7 deliverables and acceptance checks)
- `docs/Andetag SEO Manual.md` (schema types, descriptions, Berlin protocol)
- `docs/content-model.md` (frontmatter `ogImage`, shared `seo` contract)
- `docs/tracking-and-consent-requirements.md`, `docs/kpi-measurement-map.md`
- `docs/migration-exceptions.md` (for example **EX-0006** showcase performance)
