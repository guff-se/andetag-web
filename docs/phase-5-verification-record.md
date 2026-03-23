# Phase 5 Verification Record

Purpose: track Phase 5 evidence, per-page design approvals, and exit sign-off per `docs/phase-5-todo.md` and `docs/definition-of-done.md` Phase 5.

Status: **open** (Phase 5 in progress).

## Scope confirmation (P5-00)

Recorded 2026-03-23:

- **First-wave order:** `docs/phase-5-todo.md`, section **Swedish Stockholm migration order (agreed)**.
- **Design approval gate:** final design per page at agreed breakpoints before starting the next page; owner Gustaf.
- **Where to record approvals:** this file, dated notes per URL.
- **Component-first rule:** default for fixes during migration (`docs/phase-5-todo.md`).

## Migrated pages (body content)

| Canonical path | Source HTML | Design approved | Notes |
|----------------|-------------|-----------------|-------|
| `/sv/stockholm/gruppbokning/` | `site-html/stockholm-gruppbokning.html` (wp-post 393) | **Yes** (2026-03-23, Gustaf) | `site/src/components/pages/GruppbokningSv.astro`. |
| `/sv/stockholm/foretagsevent/` | `site-html/stockholm-foretagsevent.html` (wp-page 2651) | **Yes** (2026-03-23, Gustaf) | `ForetagseventSv.astro`. |
| `/sv/optisk-fibertextil/` | `site-html/optisk-fibertextil.html` (wp-page 3637) | **Yes** (2026-03-23, Gustaf) | `OptiskFibertextilSv.astro`; weaving photos under `site/public/wp-content/uploads/2026/02/` (**EX-0008** resolved). |
| `/sv/stockholm/art-yoga/` | `site-html/stockholm-art-yoga.html` (wp-page 2519) | **Yes** (2026-03-23, Gustaf) | `ArtYogaSv.astro`; **EX-0009**; mid-page `HeroSection` (legacy photo + outline "Boka Yoga") before practical block. |
| `/sv/stockholm/biljetter/` | `site-html/stockholm-biljetter.html` (wp-page 2780) | **Yes** (2026-03-23, Gustaf) | `BiljetterSv.astro`; **`InfoFrame`** (single priser callout); **`BookingEmbed`** (Understory, default **`.booking-embed-contact`**, **EX-0010**); säsongskort CTA links canonical `/sv/stockholm/sasongskort/` (legacy button had no `href`). |
| `/sv/stockholm/dejt/` | `site-html/stockholm-dejt.html` (wp-page 2693) | **Yes** (2026-03-23, Gustaf) | `DejtSv.astro`; intro + photo (**`--page-aside-width` 480px**); central copy merged into intro; testimonial **`HeroSection`** + parallax; **`InfoFrame`** + accordion + **`BookingEmbed`** (default **`.booking-embed-contact`**, **EX-0010**, **Kontakta** … **`info@andetag.museum`**). |
| `/sv/stockholm/fragor-svar/` | `site-html/stockholm-fragor-svar.html` (wp-page 2881) | **Yes** (2026-03-23, Gustaf) | `FragorSvarSv.astro`; **`ContentSection`** h1; two **`AccordionSection`** columns (**`bodyHtml`**, **`.page-faq-accordions`**); internal links canonical **`/sv/stockholm/...`**. **Next first-wave:** **`/sv/stockholm/`** (Swedish Stockholm home). |

## Handoff snapshot (for the next session)

- **First-wave status:** Items **1–7** in **`docs/phase-5-todo.md`** (**Swedish Stockholm migration order**) are migrated and design-approved (rows above). **Item 8** is next: **`/sv/stockholm/`** from legacy **`/`** (`site-html/index.html` or agreed canonical scrape). Read **`docs/phase-4-routing-reopen.md`**, **`docs/url-migration-policy.md`**, **`docs/url-matrix.csv`**, and **`site/src/lib/routes/page-shell-registry.ts`** before changing routes, **`page-body-registry`**, or **`site/public/_redirects`**.
- **Shared components recently aligned:** **`AccordionSection`** uses **`button.accordion-item-toggle`**, **`.is-open`**, **`accordion-section-exclusive.ts`** (one open per section), and **`.accordion-item-expand-inner`** bottom padding only when open (see **`docs/phase-3-component-usage.md`**). **`BookingEmbed`** ships default **`.booking-embed-contact`** (**`booking-embed-contact.ts`**, **`showContact`**, **EX-0010**). Hero language row: **`.shared-hero-lang-top`** in **`layout.css`** (**Jost**, uppercase).
- **Parser / source docs:** Legacy FAQ and accordions in **`site-html/`** remain **`<details>`**; that is source truth. The **Astro** FAQ implementation is **`FragorSvarSv.astro`** + **`AccordionSection`** (not raw **`<details>`** in output).
- **Changelog:** Notable Phase 5 and component work is under **`CHANGELOG.md`** **Unreleased**.

## Quality gates (representative pages)

Deferred until enough conversion-priority pages are migrated (`P5-08`).

## Stakeholder sign-off

Pending Phase 5 closure.
