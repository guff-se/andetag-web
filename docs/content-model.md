# Content Model Contract v1

Purpose: define the versioned content contract for page data, shared data, and component props used by static rendering.

Contract version: `1.0.0`

## Reused Inputs

This contract reuses known extraction and structure findings from:

- `docs/parser-plan.md`
- `docs/existing-site-structure.md`
- `docs/url-migration-policy.md`

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
headerVariantId: string
footerVariantId: string
pageElementorId: integer
ogImage: string | null           # local asset filename
hreflang:
  sv: string | null
  en: string | null
  de: string | null
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

### `tracking` contract

```json
{
  "contractVersion": "1.0.0",
  "gtmContainerId": "GTM-XXXXXXX",
  "consentCategories": ["necessary", "analytics", "marketing"],
  "tagsByCategory": {
    "necessary": ["site-core"],
    "analytics": ["ga4"],
    "marketing": ["meta-pixel", "google-ads"]
  }
}
```

## 3) Component Prop Contracts

### `HeroSection`

```ts
type HeroSectionProps = {
  heading: string;
  body?: string;
  eyebrow?: string;
  /** Full-bleed image + overlay, or omit for solid aubergine band only. */
  backgroundImage?: string;
  headingLevel?: "h1" | "h2";
  ctas: Array<{ label: string; href: string; variant: "primary" | "secondary" | "outline" }>;
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
  items: Array<{ title: string; body: string }>;
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
headerVariantId: header-3305
footerVariantId: footer-3100
pageElementorId: 3729
ogImage: andetag-faq-og.jpg
hreflang:
  sv: /stockholm/fragor-svar/
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
