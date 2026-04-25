# Content Model Contract v1

Purpose: define the versioned content contract for page data, shared data, and component props used by static rendering.

Contract version: `1.0.0`

## Reused Inputs

This contract reuses known extraction and structure findings from:

- `docs/archive/parser-plan.md`
- `docs/archive/existing-site-structure.md`
- `docs/seo/url-architecture.md`

## 1) Page Frontmatter Contract

All page content files must include this frontmatter schema.

```yaml
contractVersion: "1.0.0"
title: string
description: string
lang: sv | en | de
slug: string                     # path relative to language root, no leading slash
canonicalPath: string            # canonical path with leading and trailing slash
canonicalUrl: string             # absolute canonical URL
pageType: content | landing | legal | utility
destination: stockholm | berlin | shared
headerType: hero | small | brand
headerVariantId: string                 # Phase 6: stable `chrome-hdr-*` ids (see Chrome variant ids below)
footerVariantId: string                 # Phase 6: stable `chrome-ftr-*` ids
pageElementorId: integer
ogImage: string | null           # local asset filename
hreflang:
  sv: string | null
  en: string | null
  de: string | null
xDefaultPath: string | null      # path with slashes; emitted as link rel="alternate" hreflang="x-default" when non-null (see site/src/lib/chrome/seo.ts)
seo:
  robots: "index,follow" | "noindex,follow"
  ogType: website | article
tracking:
  understory:
    enabled: boolean
    companyId: string | null
    language: sv | en | de | null
```

### Required field rules

- `canonicalPath` must match the path portion of `canonicalUrl`.
- `hreflang` entries must be absolute paths, nullable when no equivalent exists.
- `xDefaultPath` must be a root-relative path with trailing slash when set, and should follow `docs/Andetag SEO Manual.md` and Phase 4 routing decisions (typically the Swedish canonical for Stockholm pairs, or `/de/berlin/` for Berlin-only pages).
- `lang` must match the language segment of `canonicalPath` where applicable.
- `pageType=legal` should use destination `shared`.

## 2) Shared Data Contracts

### `nav` contract

```json
{
  "contractVersion": "1.0.0",
  "lang": "en",
  "variant": "main",
  "items": [
    {
      "label": "Tickets",
      "url": "/en/stockholm/tickets/",
      "highlight": true,
      "children": []
    }
  ]
}
```

### `footer` contract

```json
{
  "contractVersion": "1.0.0",
  "lang": "en",
  "variant": "default",
  "columns": [],
  "legalLinks": [],
  "socialLinks": [],
  "schemaRef": "schema/en.json"
}
```

### `seo` contract

```json
{
  "contractVersion": "1.0.0",
  "titleTemplate": "%s | ANDETAG",
  "defaultOgImage": "default-og.jpg",
  "siteName": "ANDETAG",
  "canonicalHost": "https://www.andetag.museum"
}
```

**Emitted head tags (Phase 6–7):** `SiteLayout.astro` outputs canonical, hreflang alternates, Open Graph and Twitter (`og:title`, `og:description` when present, `og:url`, `og:type`, `og:site_name`, `og:locale`, `og:locale:alternate`, `og:image`, `twitter:card` as **`summary_large_image`**). Default share image: Stockholm hero still (`HERO_SV_ASSETS.poster`, absolute URL via `site/src/lib/chrome/seo.ts`). Optional per-shell override: `page-shell-meta.json` field **`ogImage`** (root-relative path, same contract as frontmatter `ogImage`), wired through **`page-shell-registry.ts`** as **`ogImage`** on the shell route.

### `tracking` contract

```json
{
  "contractVersion": "1.0.0",
  "gtmContainerId": "GTM-KXJGBL5W",
  "consentCategories": ["necessary", "analytics", "marketing"],
  "tagsByCategory": {
    "necessary": ["site-core"],
    "analytics": ["ga4"],
    "marketing": ["meta-pixel", "google-ads"]
  }
}
```

## 2.5) Chrome variant ids (Phase 6)

Site shell uses **stable** ids (not WordPress Elementor post ids). Source of truth: **`site/src/lib/chrome/types.ts`**, **`variants.ts`**, **`page-shell-registry.ts`** **`layoutVariantsForPath`**.

**Headers (`headerVariantId`):**

| Id | Role |
|----|------|
| `chrome-hdr-sv-stockholm-hero` | Swedish Stockholm full hero (video) |
| `chrome-hdr-sv-stockholm-small` | Swedish Stockholm small hero |
| `chrome-hdr-en-stockholm-hero` | English Stockholm hub hero |
| `chrome-hdr-en-header-selector` | English entry **`/en/`**: full-viewport video hero, Stockholm and Berlin CTAs only (no nav strip, no main/footer) |
| `chrome-hdr-en-stockholm-small` | English Stockholm small header (includes story pages; no separate “brand” header) |
| `chrome-hdr-en-berlin-hero` | English Berlin hub hero |
| `chrome-hdr-en-berlin-small` | English Berlin small header (non-hub **`/en/berlin/...`** pages) |
| `chrome-hdr-de-berlin-hero` | German Berlin hero |
| `chrome-hdr-de-berlin-small` | German Berlin small header (non-hub **`/de/berlin/...`** pages) |

**Footers (`footerVariantId`):** `chrome-ftr-sv-stockholm`, `chrome-ftr-en-stockholm`, `chrome-ftr-en-berlin`, `chrome-ftr-de-berlin`.

**Implementation (labels and internal URLs):** Swedish Stockholm chrome menu and footer columns live in **`site/src/lib/chrome/hero-sv.ts`** and **`footer-sv.ts`**. English Stockholm shared hero and footer (for **`chrome-hdr-en-stockholm-hero`**, **`chrome-hdr-en-stockholm-small`**, **`chrome-ftr-en-stockholm`**) live in **`hero-en-stockholm.ts`** and **`footer-en-stockholm.ts`**, aligned with **`docs/url-matrix.csv`** and **`navigation.ts`** **`en-main`**. **`chrome-hdr-en-header-selector`** (**`/en/`**) reuses the English hero media and top bar in **`SiteHeader.astro`**, omits the menu strips, and uses **`SiteLayout.astro`** **`headerSelectorOnly`** so there is no **`<main>`** or footer. **`STOCKHOLM_SV_EN_PAIRS`** in **`page-shell-registry.ts`** includes NPF, the four Swedish SEO landings, and **story** paths under **`/sv/stockholm/...`** ↔ **`/en/stockholm/...`**. English Berlin uses **`navigation.ts`** **`en-main-berlin`** with **`chrome-hdr-en-berlin-small`** on non-hub routes (**`layoutVariantsForPath`**). The legacy **`en-brand`** / **`chrome-hdr-en-stockholm-brand`** pair was **removed** (**2026-03-28**).

**Legacy alias (tests / EX-0005 only):** `header-4136` → resolves to `chrome-hdr-en-berlin-hero` via **`getResolvedHeaderVariantId`**.

**Old WordPress ids (retired as contracts):** `header-192`, `header-918`, `header-4344`, `header-2223`, `header-3305`, `header-4287`, `footer-207`, `footer-3100`, `footer-4229`.

### Site workspace: shells, bodies, and entry (as implemented)

These counts match **`site/`** at Phase 6 closure; re-verify after large routing or registry edits.

| Artifact | Role | Current scale |
|----------|------|----------------|
| **`site/src/data/page-shell-meta.json`** | Title and description for each shell (curated; see **`docs/seo/decisions.md`** for documented overrides) | **61** paths under **`pages`** |
| **`site/src/lib/routes/page-shell-registry.ts`** | Shell layout, hreflang, **`seoCanonicalPath`** (Berlin English stories) | Aligned with matrix shells |
| **`site/src/lib/page-registry/page-body-registry.ts`** **`PAGE_CUSTOM_BODY_PATHS`** | Routes with a dedicated page body component | **60** paths (**`/en/`** hub is **not** in the set) |
| **`site/src/pages/[...slug].astro`** | Renders each shell and maps custom bodies | Single catch-all |
| **`site/src/pages/index.astro`** | **`301`** → **`/sv/stockholm/`** for **local** static preview; production **`/`** uses **`site/workers/entry-router.ts`** | |

## 3) Component Prop Contracts

### `HeroSection`

```ts
type HeroSectionProps = {
  heading?: string;
  body?: string;
  eyebrow?: string;
  /** Full-bleed image + overlay, or omit for solid aubergine band only. */
  backgroundImage?: string;
  headingLevel?: "h1" | "h2";
  ctas: Array<{
    label: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
    external?: boolean;
  }>;
  /** When `heading` is omitted, use for `aria-label` on the section. */
  ariaLabel?: string;
};
```

### `RichTextSection`

```ts
type RichTextSectionProps = {
  heading?: string;
  markdown: string;
};
```

### `AccordionSection`

```ts
type AccordionSectionProps = {
  items: Array<{ title: string; body?: string; bodyHtml?: string }>;
};
```

### `ButtonGroup`

```ts
type ButtonGroupProps = {
  buttons: Array<{ label: string; href: string; variant: "primary" | "secondary" | "outline" }>;
};
```

### `MediaEmbed`

```ts
type MediaEmbedProps = {
  kind: "vimeo" | "map" | "understory" | "custom-html";
  value: string;
};
```

## 4) Elementor Widget Family Mapping

| Elementor `data-widget_type` family | Target contract/component |
|--------------------------------------|---------------------------|
| `heading.default` | `HeroSection` heading or `RichTextSection` heading |
| `text-editor.default` | `RichTextSection` |
| `nested-accordion.default` | `AccordionSection` |
| `button.default` | `ButtonGroup` |
| `image.default` | media block (`HeroSection`/content image) |
| `gallery.default` + `image-carousel.default` | gallery component contract (Phase 3 detail) |
| `video.default` | `MediaEmbed(kind="vimeo")` |
| `google_maps.default` | `MediaEmbed(kind="map")` |
| `html.default` | `MediaEmbed(kind="understory")` or schema extraction path |
| `testimonial-carousel.default` | testimonial component contract (Phase 3 detail) |

## 5) Sample Page Spec (Validation Reference)

This sample includes all required frontmatter fields for contract validation.

```yaml
contractVersion: "1.0.0"
title: "Frequently Asked Questions about ANDETAG Stockholm"
description: "Answers to frequently asked questions about tickets, timing, and practical information."
lang: en
slug: stockholm/faq
canonicalPath: /en/stockholm/faq/
canonicalUrl: https://www.andetag.museum/en/stockholm/faq/
pageType: content
destination: stockholm
headerType: small
headerVariantId: chrome-hdr-en-stockholm-small
footerVariantId: chrome-ftr-en-stockholm
pageElementorId: 3729
ogImage: andetag-faq-og.jpg
hreflang:
  sv: /sv/stockholm/fragor-svar/
  en: /en/stockholm/faq/
  de: null
seo:
  robots: index,follow
  ogType: website
tracking:
  understory:
    enabled: false
    companyId: null
    language: null
```

## Contract Lifecycle

- Breaking changes to required fields require a major version bump.
- New optional fields require a minor version bump.
- Text clarifications only require a patch version bump.
