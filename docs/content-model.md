# Content model

Current-state contract for how page data, shared modules, and component props are organized on the Astro site. For implementation detail on individual components, see `docs/component-usage.md`.

The migration-era **frontmatter + Elementor mapping** contract lives in `docs/archive/content-model-v1-contract.md` (reference only; not implemented in `site/`).

---

## Locale synchronization rule

Editorial copy updates are locale-synchronized by default. When a logical page exists in multiple locales (Stockholm `sv` + `en`, Berlin `de` + `en`), copy edits must be applied to every available locale in the same task unless the requester explicitly asks for a single-locale change.

---

## Where page data lives

| Layer | Path | Role |
|-------|------|------|
| Shell metadata | `site/src/data/page-shell-meta.json` | Curated `<title>`, meta description, optional `ogImage` per shell path |
| Shell routing | `site/src/lib/routes/page-shell-registry.ts` | Hreflang pairs, canonical overrides (`seoCanonicalPath`), chrome layout variants |
| Page bodies | `site/src/components/page-bodies/*.astro` | Editorial HTML for routes in `PAGE_CUSTOM_BODY_PATHS` |
| Body registry | `site/src/lib/page-registry/page-body-registry.ts` | Set of paths with dedicated body components |
| Catch-all route | `site/src/pages/[...slug].astro` | Maps shell paths to layout + body |
| Artworks (dynamic) | `site/src/pages/en/artworks/[slug].astro`, `site/src/pages/sv/konstverk/[slug].astro` | Per-artwork pages; metadata via `artworkShellRoute()` (`SEO-0022`) |
| Entry `/` (local preview) | `site/src/pages/index.astro` | `301` → `/sv/stockholm/`; production `/` uses `site/workers/entry-router.ts` |

**Scale (re-verify after large routing edits):** **67** shell paths in `page-shell-meta.json`, **66** entries in `PAGE_CUSTOM_BODY_PATHS`, **141** HTML files in a full `npm run build` (includes dynamic artwork routes).

---

## Shell metadata (`page-shell-meta.json`)

Each key under `pages` is a canonical path with trailing slash (for example `/en/stockholm/faq/`).

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Document title before site suffix |
| `description` | string | Meta description; may include pricing tokens resolved at build time (see `page-shell-meta-tokens.ts`) |
| `ogImage` | string (optional) | Root-relative path override for Open Graph / Twitter |

Robots, hreflang, canonical host, and layout chrome come from `page-shell-registry.ts` + `site/src/lib/chrome/seo.ts`, not from this file. Documented SEO overrides: `docs/seo/decisions.md`. The `/en/` hub is `noindex,follow` (`SEO-0021`).

---

## Shared data modules

Single-source modules consumed by page bodies, schema, and chrome. Edit the module, not downstream copies.

| Domain | Module |
|--------|--------|
| Tickets, prices, daytime window, Art Yoga | `site/src/lib/content/stockholm-offers.ts` |
| Corporate pricing + FAQ | `site/src/lib/content/stockholm-corporate.ts` |
| FAQ entries | `site/src/lib/content/stockholm-faq.ts` |
| Reviews + TripAdvisor figures | `site/src/lib/content/stockholm-reviews.ts` |
| Artworks catalogue | `site/src/lib/content/artworks.ts` |
| Photo catalogue (trilingual alt) | `assets/images/photos.yaml` |
| Hours, address, geo (schema) | `site/src/lib/chrome/schema-org.ts` (+ prose drift hotspots in page bodies; see `docs/maintenance-backlog.md` M-0001, M-0002) |
| Navigation labels + URLs | `site/src/lib/chrome/navigation.ts`, locale hero/footer modules under `site/src/lib/chrome/` |
| Responsive image paths | `site/src/lib/content/stockholm-body-responsive-images.ts`, `stockholm-marketing-gallery.ts` |

---

## Chrome variant ids

Stable ids (not WordPress Elementor post ids). Source: `site/src/lib/chrome/types.ts`, `variants.ts`, `page-shell-registry.ts` `layoutVariantsForPath`.

**Headers:**

| Id | Role |
|----|------|
| `chrome-hdr-sv-stockholm-hero` | Swedish Stockholm full hero (video) |
| `chrome-hdr-sv-stockholm-small` | Swedish Stockholm small hero |
| `chrome-hdr-en-stockholm-hero` | English Stockholm hub hero |
| `chrome-hdr-en-header-selector` | English entry `/en/`: full-viewport video hero, Stockholm and Berlin CTAs only (no nav strip, no main/footer) |
| `chrome-hdr-en-stockholm-small` | English Stockholm small header |
| `chrome-hdr-en-berlin-hero` | English Berlin hub hero |
| `chrome-hdr-en-berlin-small` | English Berlin small header (non-hub `/en/berlin/...`) |
| `chrome-hdr-de-berlin-hero` | German Berlin hero |
| `chrome-hdr-de-berlin-small` | German Berlin small header (non-hub `/de/berlin/...`) |

**Footers:** `chrome-ftr-sv-stockholm`, `chrome-ftr-en-stockholm`, `chrome-ftr-en-berlin`, `chrome-ftr-de-berlin`.

**Legacy alias (tests only):** `header-4136` → `chrome-hdr-en-berlin-hero` via `getResolvedHeaderVariantId`.

---

## Head tags and tracking

`SiteLayout.astro` emits canonical, hreflang, Open Graph, and Twitter tags via `site/src/lib/chrome/seo.ts`. Default share image: Stockholm hero still (`HERO_SV_ASSETS.poster`). GTM container: `GTM-KXJGBL5W` (`site/src/lib/chrome/tracking-constants.ts`). Consent: self-hosted CookieConsent; see `docs/tracking-and-consent-requirements.md`.

---

## Component props

Approved prop contracts for page-body components: `docs/component-usage.md`. Migration-era inventory: `docs/archive/phase-3-component-inventory.md`.
