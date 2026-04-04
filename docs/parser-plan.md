# Parser Plan - WordPress/Elementor to Static Site

This document describes what the parser will extract from the scraped HTML and CSS files, and what format it will output.

---

## Inputs

- `site-html/*.html`: 47 scraped page files
- `site-html/wp-content/uploads/elementor/css/post-*.css`: 68 Elementor CSS files
- The live site at `andetag.museum` for downloading images

## Outputs

The parser will produce the following in a new `parsed/` directory:

### 1. Content files (`parsed/content/{lang}/{slug}.md`)

One Markdown file per page, with YAML frontmatter and clean body content.

**Frontmatter fields:**

```yaml
---
title: "Frequently Asked Questions about ANDETAG Stockholm"
description: "Answers to frequently asked questions..."
lang: en                      # sv | en | de
slug: stockholm/faq           # path relative to language root
canonicalPath: /en/stockholm/faq/
ogImage: ANDETAG-Tadaa-TERRAN-59311.jpg   # filename only, refers to parsed/images/
headerType: small             # hero | small | brand
headerElementorId: 3305       # for reference/debugging
footerElementorId: 3100       # for reference/debugging
pageElementorId: 3729         # the wp-page elementor ID
hreflang:
  sv: /stockholm/fragor-svar/
  en: /en/stockholm/faq/
  # de: omitted if no German equivalent
understory:                    # null if not present on this page
  language: en
  companyId: 3b3aa7a7c2cd455b8f3a56cd81033110
---
```

**Body content:**

Clean Markdown extracted from the `data-elementor-type="wp-page"` section only. This means:
- Headings (`# h1`, `## h2`, etc.) from `elementor-widget-heading`
- Paragraphs and rich text from `elementor-widget-text-editor` (preserving bold, italic, links)
- Images as `![alt](filename.jpg)`: local filename, not WordPress URL
- Accordion/FAQ blocks as `<details><summary>` HTML in Markdown
- Buttons as Markdown links with a marker: `[Button text](url){.cta-button}`
- Blockquotes preserved as `> quote text`
- Embedded videos noted as a placeholder: `{{< vimeo 1077937338 >}}`
- Google Maps noted as a placeholder: `{{< map >}}`
- Understory widget noted as a placeholder: `{{< understory >}}`
- Spacers, empty containers, and layout wrappers stripped entirely

**What is NOT in the content files:**
- Header/nav HTML (that's a shared component)
- Footer HTML (that's a shared component)
- Elementor CSS classes or wrapper divs
- WordPress/plugin scripts
- Inline styles

### 2. Image manifest and downloads (`parsed/images/`)

**Image manifest** (`parsed/images/manifest.json`):

```json
[
  {
    "originalUrl": "https://www.andetag.museum/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-6074-scaled.jpg",
    "filename": "ANDETAG-Tadaa-Photo-Johan-Eriksson-TERRAN-6074.jpg",
    "usedOn": ["index", "en"],
    "type": "gallery"
  },
  {
    "originalUrl": "https://www.andetag.museum/wp-content/uploads/2024/12/Desktop.mp4",
    "filename": "hero-desktop.mp4",
    "usedOn": ["index", "en", "de"],
    "type": "video"
  }
]
```

This manifest serves double duty:
- Maps old WordPress URLs to new filenames (for setting up redirects from external links)
- Documents where each image is used

The parser will download all images and media to `parsed/images/`, renaming them to clean, human-readable filenames (stripping WordPress upload date paths and duplicate sizing suffixes).

### 3. Navigation structure (`parsed/nav/`)

One JSON file per navigation variant:

- `parsed/nav/sv-main.json`: Swedish full site nav
- `parsed/nav/en-main.json`: English full site nav
- `parsed/nav/en-brand.json`: English brand menu
- `parsed/nav/de-main.json`: German nav

Format:

```json
{
  "lang": "en",
  "type": "main",
  "items": [
    {
      "label": "Visit",
      "url": "/en/",
      "children": [
        {"label": "Tickets", "url": "/en/stockholm/tickets/"},
        {"label": "Season Pass", "url": "/en/stockholm/season-pass/"}
      ]
    },
    {
      "label": "Tickets",
      "url": "/en/stockholm/tickets/",
      "highlight": true
    }
  ]
}
```

Extracted from the `<nav>` elements inside each header template.

### 4. Design reference (`parsed/design/`)

**`parsed/design/tokens.json`**: extracted from all relevant Elementor CSS sources across pages and templates (for example page/post CSS files and shared template CSS), then normalized into one token set:

```json
{
  "colors": {
    "primary": "#4A0D2F",
    "secondary": "#D0A4CC",
    "text": "#111111",
    "accent": "#E0E31C",
    "light": "#FAFAFA",
    "pink": "#F7DCEA"
  },
  "typography": {
    "primary": {
      "family": "Jost",
      "weight": 500,
      "transform": "uppercase",
      "lineHeight": "1.1em",
      "letterSpacing": "0.3em",
      "usage": "h1, buttons, nav items"
    },
    "secondary": {
      "family": "Jost",
      "weight": 500,
      "transform": "none",
      "letterSpacing": "0em",
      "usage": "h2, h3, h4, h5, h6"
    },
    "text": {
      "family": "Baskervville",
      "weight": 400,
      "usage": "body text, paragraphs"
    },
    "accent": {
      "family": "Baskervville",
      "weight": 500,
      "style": "italic",
      "usage": "buttons (accent style), dropdown menus"
    }
  },
  "layout": {
    "containerMaxWidth": "90%",
    "widgetSpacing": "20px",
    "bodyBackground": "#F7DCEA",
    "mobileContainerPadding": "0 20px"
  },
  "buttons": {
    "default": {
      "background": "#4A0D2F",
      "color": "#FAFAFA",
      "fontFamily": "Jost",
      "fontWeight": 500,
      "textTransform": "uppercase",
      "letterSpacing": "0.3em",
      "borderRadius": "5px",
      "padding": "1em 1.3em",
      "boxShadow": "5px 5px 10px rgba(0,0,0,0.5)"
    },
    "outline": {
      "background": "transparent",
      "color": "#FAFAFA",
      "border": "1px solid #FAFAFA",
      "usage": "hero CTA buttons"
    },
    "secondary": {
      "background": "#D0A4CC",
      "color": "#4A0D2F",
      "border": "1px solid #4A0D2F",
      "usage": "in-page CTA buttons"
    }
  }
}
```

**`parsed/design/section-patterns.md`**: a human-readable reference of recurring layout patterns observed across pages, with notes on which pages use them. NOT CSS to import, but a description:

- Full-width section with background image + dark overlay + centered white text (used for: "Boka nu" CTA sections)
- Two-column layout: text left, pricing box right with `#D0A4CC` background and `25px` border-radius (used for: tickets page)
- Accordion FAQ pattern: nested `<details>` elements with `1rem` title font size
- Partner logo grid: 8 columns at 12% width each, wrapping on mobile
- Testimonial carousel on background image with `0.78` overlay opacity
- Image with SVG mask shape (`Andetag-6-1.svg`): decorative blob shape applied to photos
- etc.

### 5. Structured data (`parsed/schema/`)

- `parsed/schema/en.json`: Schema.org JSON-LD from English footer
- `parsed/schema/de.json`: Schema.org JSON-LD from German footer

Extracted as-is from the `elementor-widget-html` widgets in the footers.

### 6. Page registry (`parsed/pages.json`)

A single manifest of all pages with their metadata, for use as the "source of truth" when building the new site:

```json
[
  {
    "sourceFile": "index.html",
    "sourceUrl": "https://www.andetag.museum/",
    "lang": "sv",
    "slug": "",
    "title": "ANDETAG | En stillsam konstupplevelse i Stockholm",
    "headerType": "hero",
    "headerElementorId": 192,
    "footerElementorId": 207,
    "pageElementorId": 2,
    "hreflang": {
      "sv": "/",
      "en": "/en/",
      "de": "/de/berlin/"
    },
    "hasUnderstory": true,
    "outputFile": "content/sv/index.md"
  }
]
```

---

## Parser Implementation Notes

### Step 1: Build page registry
- Parse each HTML file's `<head>` for metadata (title, description, hreflang, OG image, canonical, lang)
- Parse `<body>` to extract header/footer Elementor IDs and determine header type
- Determine language from `<html lang="">` attribute
- Output: `pages.json`

### Step 2: Extract design tokens
- Parse all relevant Elementor CSS files for CSS custom properties and reusable style patterns, do not assume one file is globally authoritative
- Map `--e-global-color-*` and `--e-global-typography-*` variables to named tokens
- Scan key page CSS files (post-2, post-192, post-207, etc.) for recurring patterns: button variants, section backgrounds, special treatments
- Output: `design/tokens.json` and `design/section-patterns.md`

### Step 3: Extract navigation
- For each unique header Elementor ID (192, 918, 2223, 3305, 4287, 4344, and the German small header), parse the `<nav>` elements inside the `<header>` tag
- Build menu tree from `<ul>/<li>/<a>` structure
- Note which items have `highlight` styling (the standalone "Biljetter"/"Tickets" CTA)
- Output: `nav/*.json`

### Step 4: Extract and download images
- Scan all HTML files for image URLs in: `src`, `srcset`, `data-src`, `data-thumbnail`, `og:image` meta tags
- Scan CSS files for `background-image: url(...)` references
- Scan `data-settings` JSON attributes for video URLs
- Deduplicate by original URL
- Download each unique asset
- Generate clean filenames
- Output: `images/` directory + `images/manifest.json`

### Step 5: Extract page content
- For each page, locate the `<div data-elementor-type="wp-page">` element
- Walk the Elementor widget tree inside it
- For each widget, extract content based on `data-widget_type`:
  - `heading.default` → `# heading text` (determine level from actual `<h1>`-`<h6>` tag)
  - `text-editor.default` → convert inner HTML to Markdown (preserve links, bold, italic, lists)
  - `nested-accordion.default` → `<details><summary>title</summary>content</details>`
  - `image.default` → `![alt](local-filename.jpg)` using manifest mapping
  - `button.default` → `[Button text](url){.cta-button}`
  - `html.default` → check for Understory widget → `{{< understory >}}`; check for JSON-LD → extract to schema/; otherwise note as custom HTML
  - `video.default` → `{{< vimeo ID >}}` extracted from data-settings or iframe src
  - `google_maps.default` → `{{< map >}}`
  - `gallery.default` → list of image references
  - `image-carousel.default` → list of image references (mobile variant of gallery)
  - `testimonial-carousel.default` → series of blockquotes with attribution
  - `shortcode.default` → note for manual review (TripAdvisor)
  - `spacer.default` → skip
  - `social-icons.default` → skip (handled in header/footer components)
- Output: `content/{lang}/{slug}.md`

### Step 6: Extract structured data
- Find `<script type="application/ld+json">` in the HTML widgets inside footers
- Extract and save as JSON files
- Output: `schema/*.json`

---

## What we are NOT parsing

- Elementor CSS class names (we read through them to understand design, not to import)
- WordPress/plugin JavaScript
- RSS/oEmbed/wp-json links
- Complianz cookie consent markup
- TripAdvisor review slider content (will be removed from new site)
- WonderPush configuration
- Brevo scripts (except the German signup form HTML, which we'll note for manual rebuild)
- WordPress admin references (wp-admin, xmlrpc, etc.)
