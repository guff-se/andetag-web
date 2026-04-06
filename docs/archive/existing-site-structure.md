# Existing Site Structure - andetag.museum

This document describes the architecture of the current WordPress/Elementor site at andetag.museum, as analysed from the scraped HTML in `site-html/`. It serves as a reference for the migration to a static site.

---

## Overview

- **CMS**: WordPress 6.9.1 with Hello Elementor theme
- **Page builder**: Elementor 3.35.3 + Elementor Pro 3.35.0
- **Core plugins**: Polylang (multilingual), Complianz (GDPR/cookie consent), Yoast SEO, WP TripAdvisor Review Slider, Brevo (email/CRM), WonderPush (push notifications), Site Kit (Google Analytics)
- **Languages**: Swedish (default), English, German
- **Content type**: All static pages, no blog posts, no user accounts, no forms (except Brevo email signup on German pages)
- **Ticket booking**: Understory.io widget (external script embed)
- **Fonts**: Jost, Baskervville (self-hosted via Elementor Google Fonts)

---

## Page Inventory

### Swedish (`/`) - Stockholm, fully operational

| URL path | Slug in site-html | Page ID | Description |
|---|---|---|---|
| `/` | `index.html` | 2 | Homepage (hero header) |
| `/stockholm/biljetter/` | `stockholm-biljetter.html` | 2780 | Tickets + booking widget |
| `/stockholm/sasongskort/` | `stockholm-sasongskort.html` |  | Season pass |
| `/stockholm/presentkort/` | `stockholm-presentkort.html` |  | Gift cards |
| `/stockholm/oppettider/` | `stockholm-oppettider.html` |  | Opening hours |
| `/stockholm/hitta-hit/` | `stockholm-hitta-hit.html` |  | How to find us |
| `/stockholm/tillganglighet/` | `stockholm-tillganglighet.html` |  | Accessibility |
| `/stockholm/fragor-svar/` | `stockholm-fragor-svar.html` | 2881 | FAQ |
| `/stockholm/vilken-typ-av-upplevelse/` | `stockholm-vilken-typ-av-upplevelse.html` |  | What kind of experience |
| `/stockholm/dejt/` | `stockholm-dejt.html` | 2693 | Date at ANDETAG |
| `/stockholm/art-yoga/` | `stockholm-art-yoga.html` |  | Art Yoga |
| `/musik/` | `musik.html` |  | The music |
| `/stockholm/gruppbokning/` | `stockholm-gruppbokning.html` |  | Group bookings |
| `/stockholm/foretagsevent/` | `stockholm-foretagsevent.html` |  | Corporate events |
| `/om-andetag/` | `om-andetag.html` |  | About ANDETAG |
| `/optisk-fibertextil/` | `optisk-fibertextil.html` |  | The textile |
| `/om-konstnarerna-malin-gustaf-tadaa/` | `om-konstnarerna-malin-gustaf-tadaa.html` |  | About the artists |
| `/stockholm/besokaromdomen/` | `stockholm-besokaromdomen.html` |  | Visitor reviews |
| `/privacy/` | `privacy.html` |  | Privacy policy |

### English (`/en/`) - Stockholm, fully operational

| URL path | Slug in site-html | Page ID | Description |
|---|---|---|---|
| `/en/` | `en.html` | 907 | Homepage (hero header) |
| `/en/stockholm/tickets/` | `en-stockholm-tickets.html` | 2789 | Tickets + booking widget |
| `/en/stockholm/season-pass/` | `en-stockholm-season-pass.html` |  | Season pass |
| `/en/stockholm/giftcard/` | `en-stockholm-giftcard.html` |  | Gift cards |
| `/en/stockholm/opening-hours/` | `en-stockholm-opening-hours.html` | 2762 | Opening hours |
| `/en/stockholm/how-to-find-us/` | `en-stockholm-how-to-find-us.html` |  | How to find us |
| `/en/stockholm/accessibility/` | `en-stockholm-accessibility.html` |  | Accessibility |
| `/en/stockholm/faq/` | `en-stockholm-faq.html` | 3729 | FAQ |
| `/en/stockholm/what-kind-of-experience/` | `en-stockholm-what-kind-of-experience.html` |  | What kind of experience |
| `/en/stockholm/date/` | `en-stockholm-date.html` |  | Date at ANDETAG |
| `/en/stockholm/art-yoga-en/` | `en-stockholm-art-yoga-en.html` | 3493 | Art Yoga |
| `/en/music/` | `en-music.html` |  | The music |
| `/en/stockholm/group-bookings/` | `en-stockholm-group-bookings.html` |  | Group bookings |
| `/en/stockholm/corporate-events/` | `en-stockholm-corporate-events.html` |  | Corporate events |
| `/en/about-andetag/` | `en-about-andetag.html` | 2953 | About ANDETAG (brand menu) |
| `/en/optical-fibre-textile/` | `en-optical-fibre-textile.html` | 3653 | The textile (brand menu) |
| `/en/about-the-artists-malin-gustaf-tadaa/` | `en-about-the-artists-malin-gustaf-tadaa.html` | 2640 | About the artists (brand menu) |
| `/en/stockholm/visitor-reviews/` | `en-stockholm-visitor-reviews.html` |  | Visitor reviews |
| `/en/berlin-en/` | `en-berlin-en.html` |  | ANDETAG Berlin |

### German (`/de/`) - Berlin, pre-launch teaser

| URL path | Slug in site-html | Page ID | Description |
|---|---|---|---|
| `/de/` and `/de/berlin/` | `de.html` / `de-berlin.html` | 4323 | Homepage (hero header, same page for both URLs) |
| `/de/ueber-andetag/` | `de-ueber-andetag.html` |  | About ANDETAG |
| `/de/musik-von-andetag/` | `de-musik-von-andetag.html` |  | The music |
| `/de/optische-fasertextil/` | `de-optische-fasertextil.html` |  | The textile |
| `/de/die-kuenstler-malin-gustaf-tadaa/` | `de-die-kuenstler-malin-gustaf-tadaa.html` |  | The artists |

The German site has no ticketing: it uses a Brevo email signup form for early access instead.

---

## Elementor Template Architecture

Every page follows this nesting structure:

```
<body>
  <header data-elementor-type="header" data-elementor-id="{HEADER_ID}">
    ... navigation, logo, language switcher ...
  </header>

  <div data-elementor-type="single-page" data-elementor-id="203">
    <!-- Shared single-page template, used by ALL pages -->
    <div data-elementor-type="wp-page" data-elementor-id="{PAGE_ID}">
      <!-- Per-page content sections -->
    </div>
  </div>

  <footer data-elementor-type="footer" data-elementor-id="{FOOTER_ID}">
    ... footer links, copyright, social icons ...
  </footer>
</body>
```

The single-page template wrapper (ID 203) is shared across all pages. It contains a `theme-post-content` widget that loads each page's unique content.

---

## Header Templates

There are 7 header templates:

### Hero Headers (fullscreen video background)

| Elementor ID | Language | Used on | Background videos |
|---|---|---|---|
| **192** | Swedish | `/` | Desktop: `wp-content/uploads/2024/12/Desktop.mp4`, Mobile: `wp-content/uploads/2024/12/Mobile_4.mp4` |
| **918** | English | `/en/` | Same videos |
| **4344** | German | `/de/`, `/de/berlin/` | Same videos |

Each hero header contains **two containers**: one for desktop/tablet (hidden on mobile) and one for mobile (hidden on desktop/tablet). Both have:
- Background `<video>` element with autoplay, muted, playsinline, loop
- Inline SVG logo ("ANDETAG / MALIN & GUSTAF TADAA") wrapped in `<a class="andetag-logo">`
- Social icons (Instagram, Facebook, Pinterest)
- Polylang language switcher
- CTA button linking to `#book` ("Hitta biljetter" / "Find Tickets" / "FUR FRUHBUCHER-TICKETS ANMELDEN")
- Sticky navigation menu

The header container has `id="andetag-header"`.

### Small Headers (navigation bar only)

| Elementor ID | Language | Used on |
|---|---|---|
| **2223** | Swedish | All Swedish subpages |
| **3305** | English | Most English subpages |
| *(German small)* | German | German subpages |

Same elements as hero headers but **no video background**, no hero section. Just logo + nav + social + language switcher. Has a parallax motion effect on the background (`translateY`).

### Brand Menu Header

| Elementor ID | Language | Used on |
|---|---|---|
| **4287** | English | `/en/about-andetag/`, `/en/optical-fibre-textile/`, `/en/about-the-artists-...` |

This is a special header for brand/art content pages. On **desktop** it shows a simplified flat navigation with 5 items: About ANDETAG, The Artists, The Music, The Textile, Locations (with sub-items Stockholm/Berlin). On **mobile** it falls back to the full site navigation.

---

## Footer Templates

| Elementor ID | Language | Contents |
|---|---|---|
| **207** | Swedish | 3-column nav links (Besok/Upplevelsen/Grupper & Om), copyright "2026 Tadaa Art AB", privacy link, social icons (Instagram, Facebook, Pinterest, Spotify) |
| **3100** | English | Same structure in English, plus Schema.org JSON-LD structured data |
| **4229** | German | Same structure in German, plus Schema.org JSON-LD |

Note: the footer uses a double `<footer>` nesting: the outer Elementor location footer and an inner semantic `<footer>` element.

---

## Content Widget Types

| Widget class | Elementor type | Usage |
|---|---|---|
| `elementor-widget-heading` | `heading.default` | Section titles (h1-h4) |
| `elementor-widget-text-editor` | `text-editor.default` | Body text paragraphs (the bulk of all content) |
| `elementor-widget-nested-accordion` | `nested-accordion.default` | FAQ sections using `<details>/<summary>` elements |
| `elementor-widget-image` | `image.default` | Photos with `srcset` for responsive loading |
| `elementor-widget-gallery` | `gallery.default` | 4-column image grid with lightbox (homepage only) |
| `elementor-widget-image-carousel` | `image-carousel.default` | Swiper mobile carousel (homepage only) |
| `elementor-widget-video` | `video.default` | Vimeo embed, consent-blocked by Complianz |
| `elementor-widget-button` | `button.default` | CTA links |
| `elementor-widget-html` | `html.default` | Custom HTML: Understory widget, Brevo form, SVG logo, JSON-LD |
| `elementor-widget-google_maps` | `google_maps.default` | Embedded map, consent-blocked |
| `elementor-widget-testimonial-carousel` | `testimonial-carousel.default` | Visitor quotes in Swiper carousel (homepage) |
| `elementor-widget-shortcode` | `shortcode.default` | TripAdvisor review slider (homepage) |
| `elementor-widget-social-icons` | `social-icons.default` | Instagram, Facebook, Pinterest, Spotify |
| `elementor-widget-nav-menu` | `nav-menu.default` | Navigation menus |
| `elementor-widget-polylang-language-switcher` | `polylang-language-switcher.default` | Language toggle |
| `elementor-widget-spacer` | `spacer.default` | Empty spacing elements |

---

## Understory Booking Widget

The ticket booking is handled by an external Understory.io widget. It's always embedded inside an `elementor-widget-html` widget using this pattern:

```html
<!-- Understory Widget Code -->
<script src="https://widgets.understory.io/widgets/understory-booking-widget.js"></script>
<div class="understory-booking-widget"
  data-company-id="3b3aa7a7c2cd455b8f3a56cd81033110"
  data-language="sv|en"></div>
<!-- End Understory Widget Code -->
```

**Pages with embedded widget:**
- Swedish homepage (inside container with `id="book"`)
- Swedish tickets page (`stockholm-biljetter`)
- Swedish date page (`stockholm-dejt`)
- English tickets page (`en-stockholm-tickets`)

**Pages with link to Understory (no embed):**
- Art Yoga pages link to `https://andetag.understory.io/experience/cc2f4ed4e1709b93a454a1e5abad6595`

**German pages:** No Understory. Uses Brevo (Sendinblue) email signup form instead (pre-launch).

The site CSS includes `.understory-1sgodub { display: none; }` to hide some default Understory UI element.

---

## Navigation Menu Structure

### Swedish (full site nav)

```
Besok
  Biljetter
  Sasongskort
  Presentkort
  Oppettider
  Hitta till oss
  Tillganglighet
  Vanliga fragor
Upplevelsen
  Dejt pa ANDETAG
  Art Yoga
  Musiken
Grupper
  Foretagsevent
Om ANDETAG
  Textilen
  Om konstnarerna
  ANDETAG Berlin
Biljetter (standalone CTA, yellow text)
[Language: English / Deutsch]
```

### English (full site nav)

```
Visit
  Tickets
  Season Pass
  Gift Cards
  Opening Hours
  How to Find Us
  Accessibility
  FAQ
The Experience
  Romantic Date
  Art Yoga
  The Music
Groups
  Corporate Events
About ANDETAG
  The Textile
  About the Artists
  ANDETAG Berlin
Tickets (standalone CTA, yellow text)
[Language: Svenska / Deutsch]
```

### English Brand Menu (desktop only)

```
About ANDETAG
The Artists
The Music
The Textile
Locations
  ANDETAG Stockholm
  ANDETAG Berlin
[Language: Svenska / Deutsch]
```

### German

```
ANDETAG Berlin
  ANDETAG Stockholm
Kunst
Musik
Textil
Kunstler
[Language: Svenska / English / Deutsch]
```

---

## External Integrations & Scripts

| Integration | Purpose | Implementation |
|---|---|---|
| **Google Analytics (GA4)** | Analytics | `GT-K5M2C5KK` via gtag.js |
| **Google Tag Manager** | Tag management | `GTM-KXJGBL5W`, loaded via Complianz on consent |
| **Facebook Meta Pixel** | Marketing/retargeting | ID `2136168740166860`, consent-blocked via Complianz (`type="text/plain"`) |
| **Complianz GDPR** | Cookie consent | Cookie banner with categories: functional, marketing. Blocks FB pixel, Google Maps, Vimeo until consent. |
| **Brevo (Sendinblue)** | Email CRM | mailin-front.js loaded on all pages; email signup form on German pages |
| **WonderPush** | Push notifications | Web SDK, webKey `3857d58...` |
| **TripAdvisor Review Slider** | Reviews widget | WP plugin, renders via shortcode on homepage |
| **Understory.io** | Ticket booking | External widget script (see above) |

---

## Image & Media Assets

### Background Videos (header)
- Desktop: `https://www.andetag.museum/wp-content/uploads/2024/12/Desktop.mp4`
- Mobile: `https://www.andetag.museum/wp-content/uploads/2024/12/Mobile_4.mp4`

### Gallery Images (homepage, 8 photos)
- `wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-6074-scaled.jpg`
- `wp-content/uploads/2024/11/Andetag-13-35-copy-2.jpg`
- `wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-5983-scaled.jpg`
- `wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-6038-scaled.jpg`
- `wp-content/uploads/2024/11/Andetag-10-53-copy-2.jpg`
- `wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-59311-scaled.jpg`
- `wp-content/uploads/2024/11/Andetag-19-508-copy.jpg`
- `wp-content/uploads/2024/11/Andetag-10-69-copy.jpg`

### Content Images
- `wp-content/uploads/2024/11/Andetag-18-058-copy2.jpg` (homepage hero photo)
- `wp-content/uploads/2026/02/ANDETAG-After-Hours-1-photo-Pekka-Paakko.jpg` (German homepage)
- `wp-content/uploads/2026/02/malin-vaver.jpg` (textile page)
- `wp-content/uploads/2026/02/malin-vaver2.jpg` (textile page)
- `wp-content/uploads/2025/04/ANDETAG-Art-Week-Opening-2-photo-by-Gustaf-Tadaa.jpg` (artists page)
- `wp-content/uploads/2024/12/Malin-Tadaa-Andetag-2025-face-1.jpg` (artists page)
- `wp-content/uploads/2024/12/Gustaf-Tadaa-Andetag-2025-face-1.jpg` (artists page)
- `wp-content/uploads/2026/01/date1-copy-e1769692334982.jpeg` (date page)

### Partner Logos (homepage)
- `wp-content/uploads/2024/11/SVGOMG-Image-1.svg` (Atelje Lyktan)
- `wp-content/uploads/2024/11/Toniton-1.svg` (Toniton)
- `wp-content/uploads/2024/12/Fogia-Logo.png` (Fogia)
- `wp-content/uploads/2024/11/g1036.png.png` (Dot Audio)
- `wp-content/uploads/2024/11/download.svg` (Stoddard)
- `wp-content/uploads/2024/11/kvadrat-1024x217.png` (Kvadrat)
- `wp-content/uploads/2024/12/Object-Carpet-Logo.svg` (Object Carpet)
- `wp-content/uploads/2024/12/uniqorna-black.svg` (Uniqorna)

### Other
- `wp-content/uploads/2024/11/andetag-logo-white-shadow.png` (logo, used in Schema.org)
- `wp-content/uploads/2024/12/Desktop.00_00_03_10.Still001.jpg` (favicon/OG image)

Images use WordPress srcset with variants at 300w, 768w, 1024w, 1200w, and sometimes 1536w and 2048w.

---

## SEO & Metadata

### Per-page metadata (from `<head>`)
- `<title>`: page title
- `<meta name="description">`: meta description
- `<link rel="canonical">`: canonical URL
- `<link rel="alternate" hreflang="sv|en|de">`: language alternates (Polylang)
- `<meta property="og:title|description|image|url|locale">`: Open Graph
- `<meta name="twitter:card">`: Twitter card (summary_large_image)

### Structured Data (Schema.org JSON-LD)
Found in the English and German footers (inside an HTML widget), declaring the site as:
- `Museum`
- `ArtGallery`
- `TouristAttraction`
- `LocalBusiness`

With properties including name, address, image, logo, URL.

---

## Parsing Strategy Notes

To extract content from the scraped HTML:

1. **Content boundary**: extract the contents of `<div data-elementor-type="wp-page" data-elementor-id="{PAGE_ID}">`: this is the per-page content, excluding header and footer.
2. **Metadata**: parse from `<head>`: title, description, hreflang links, OG tags.
3. **Header/footer assignment**: determine which header and footer template each page uses by reading the `data-elementor-id` on the `<header>` and `<footer>` elements.
4. **Widget extraction**: within the content area, each Elementor widget has `data-widget_type` attributes (`heading.default`, `text-editor.default`, etc.) that identify the content type.
5. **Images**: collect all `src`, `data-src`, and `data-thumbnail` URLs pointing to `wp-content/uploads/`.
6. **Understory widgets**: look for `<div class="understory-booking-widget">` with its `data-company-id` and `data-language` attributes.
7. **Background images**: these are NOT in inline styles: they're in Elementor's generated CSS files referenced in `<head>` (e.g., `elementor-post-{id}-css`). These will need to be handled separately or extracted from the CSS files.
