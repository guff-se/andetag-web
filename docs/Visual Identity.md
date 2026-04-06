# ANDETAG

MALIN & GUSTAF TADAA

## Headings

Use Jost (Google Font) for names and headings, in UPPERCASE, with 0.3em letter spacing. The brand name ANDETAG should *always* be written this way.

Jost:
https://fonts.google.com/specimen/Jost

## Body Text

Use Baskervville for body text.
https://fonts.google.com/specimen/Baskervville


## Colors

- Background: light pink `#f7dcea` or black
- Other colors: aubergine `#4a0d2f` and lavender `#d0a4cc`
- Accent color: yellow-green `#e0e31c` (must not be used on black)
- Buttons:
  - Red `#bc2026`
  - Green `#5ebf84`

## CTA buttons (component library)

Three variants in `ButtonGroup` / `StyledLink` (`cta-primary`, `cta-secondary`, `cta-outline`). Map to implementation tokens `primary`, `secondary`, `outline`.

| Version | Token | Use |
|--------|--------|-----|
| **1** | `primary` | Default CTA: works on **light or dark** backgrounds (lavender fill `#d0a4cc` / `rgb(208, 164, 204)`, aubergine text and border `#4a0d2f`). |
| **2** | `secondary` | **Light backgrounds only** (for example page pink `#f7dcea`): aubergine fill with light text for **extra emphasis**. Do not use on aubergine or black bands where it disappears or clashes. |
| **3** | `outline` | **Photo or busy backgrounds** (for example image-cover hero): transparent fill, light text and border so the control stays readable over imagery. |

Implementation lives in `site/src/styles/components.css` (classes `.link-cta-primary`, `.link-cta-secondary`, `.link-cta-outline`). Production layouts on dark surfaces should follow the table above.
