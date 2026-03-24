# Customer testimonials and social proof: research and options

**Status:** Option A in production for Swedish Stockholm home and SEO landings: **`testimonial-block`** paints one **`backgroundImage`** behind quotes **and** aggregate, with one light overlay across the **entire** band. The aggregate uses self-hosted Tripadvisor **`tripadvisor-5dots.png`** and **`tripadvisor-logo.svg`** under **`/assets/tripadvisor/`** (see **`TestimonialCarousel`**). Internal **fictional** layout preview (same carousel client as production): **`/preview/testimonial-mock-quotes/`** (`testimonial-mockup-items.ts`).  
**Date:** 2026-03-24 (updated 2026-03-24)  
**Objective:** Rethink how ANDETAG presents visitor feedback to support trust and conversion, using strong real reviews (including a ~4.9 average) without clashing with brand tone or migration constraints.

---

## 1. Context in this project

### Current implementation (summary)

- **`TestimonialCarousel`** (`site/src/components/content/TestimonialCarousel.astro`): full-bleed image background, rotating quotes, prev/next, autoplay, `aria-live="polite"` on the viewport, `prefers-reduced-motion` handling in CSS. Content is **data-driven** (quotes + optional author).
- **TripAdvisor WordPress shortcode** is **not** migrated as runtime integration (**EX-0002**, **EX-0012** in `docs/migration-exceptions.md`). Follow-up noted: optional native review module later; static copy and carousel on SEO landings; outbound TripAdvisor link on the dedicated reviews-oriented page.

### Brand and content constraints

- **`docs/Tone of Voice.md`:** calm, invitational, not salesy; avoid hype and pressure. Social proof should feel **credible and quiet**, not like a hard sell.
- **`AGENTS.md` (source integrity):** Do not fabricate quotes, URLs, or review metadata. Any star average, counts, and excerpts must be **verifiable** against a real source (platform export, screenshot archive, or editorial sign-off).

### What “4.9 average” implies for design

A strong aggregate score is a **high-trust anchor** if presented with **source and date/context** (which platform, approximate review count, last updated). Without that, skeptical visitors may discount it as marketing.

---

## 2. Research synthesis (best practices)

### Credibility and trust signals (common patterns)

Patterns seen across reputable review surfaces (e.g. Trustpilot-style UIs) and UX commerce literature:

| Signal | Why it helps |
|--------|----------------|
| **Aggregate score + count** | “4.9 from 500+ reviews” reads as social proof, not a single cherry-picked quote. |
| **Platform or verification context** | Ties the number to a third party or clear collection method. |
| **Specific excerpts** | Concrete language beats generic praise; short is fine if authentic. |
| **Attribution** | Name (and optionally role/context: “visited with family”) increases believability; balance with privacy/GDPR. |
| **Link to full reviews** | Transparency: “Read more on …” supports users who want depth. |

**Caveat:** ANDETAG is experience-led, not e-commerce checkout. Patterns should be **adapted**: smaller typography, less “badge clutter,” alignment with calm visual identity.

### Accessibility and motion (carousels)

Authoritative guidance (W3C WAI carousel tutorials and APG examples; summarized in industry writeups) stresses:

- **Pause, stop, hide (WCAG 2.2.2):** Autoplaying testimonial rotators should be **pausable**; respect **`prefers-reduced-motion`** (you already shorten transitions; a visible pause control is still worth considering if autoplay stays).
- **Keyboard and focus:** Prev/next must be fully keyboard-operable with visible focus.
- **Live regions:** `aria-live="polite"` helps; some patterns add an **“Slide x of y”** polite announcement for screen reader context.
- **Alternative to carousel:** A **static row of 2–3 quotes** (no rotation) removes a class of issues and often performs well for “proof at a glance.”

### SEO and structured data (orientation only)

- If you ever expose aggregate ratings in **schema.org** markup, Google has strict **eligibility and honesty** rules for review/rating rich results; **wrong or unverifiable structured data is worse than none**. Any future schema work needs a dedicated check against current Google documentation and your real third-party profile data.
- This doc does **not** prescribe schema; it flags the topic for a later Phase 7 or content task if you choose Option B-style public aggregates.

### Multilingual and destinations

Stockholm is live in **sv/en/de**; Berlin is a separate track. Social proof copy and any “reviews on platform X” links may need **per-locale** treatment (same score vs platform availability, language of quoted reviews, hreflang consistency on pages that carry proof blocks).

---

## 3. Three strategic options

Each option can mix elements later; they are framed as **primary** strategies for discussion.

### Option A — **Curated first-party proof band (evolve the carousel)**

**Idea:** Keep a strong visual band on key pages, but treat it as **editorial curation**: 3–8 approved quotes in the carousel (or a reduced set), plus a **single calm line** of aggregate proof if sourced (e.g. “4.9 på TripAdvisor · baserat på X omdömen” with a footnote link).

**Pros**

- Fits current component investment; familiar layout for returning visitors migrating from WordPress-era storytelling.
- Full control of typography and calm art direction; no third-party script or cookie surface.
- Aligns with **EX-0002 / EX-0012** (static content, no plugin).

**Cons**

- Quotes require **ongoing maintenance** to stay fresh (unless you consciously keep a stable “greatest hits” set with a reviewed date).
- Carousels still carry **accessibility and autoplay** scrutiny unless you add pause or reduce motion further.
- Aggregate line must stay **strictly source-backed** per `AGENTS.md`.

**Best when:** You want maximum brand control and a **heroic** proof moment on Stockholm home and selected landings, with compliance-friendly static data.

---

### Option B — **Trust strip + optional single featured quote (minimal motion)**

**Idea:** Replace or complement the rotating carousel with:

1. A **compact trust strip**: stars (decorative + numeric), short aggregate text, link “Läs alla omdömen” / “Read reviews.”
2. **At most one** featured quote on the homepage (or none), static.

**Pros**

- Strong **scannability**; the 4.9 story lands in **two seconds** without waiting for autoplay.
- Fewer moving parts for **WCAG** and cognitive load; matches **calm** tone (no “rotating sales wall”).
- Easy to repeat **consistently** across templates (footer, booking-adjacent column, etc.).

**Cons**

- Less **emotional** storytelling than a full-screen quote over imagery.
- Strip can feel utilitarian if not **designed** to match ANDETAG’s poetic restraint (needs careful typography and spacing).

**Best when:** You prioritize **clarity, accessibility, and low maintenance** while still leading with the 4.9 story.

---

### Option C — **Hub-first: dedicated reviews page as canonical depth**

**Idea:** Treat **`/sv/stockholm/besokaromdomen/`** (and en/de equivalents when they exist) as the **main** social proof destination: longer excerpts, categories of praise (optional), clear outbound links to TripAdvisor/Google/etc., maybe FAQ about how reviews are collected. On the homepage and other landings, use only a **light** inline element: trust strip (Option B) or **one** quote + link.

**Pros**

- Matches **information scent**: users who care deeply know where to go; homepage stays **quieter** (tone win).
- SEO: captures intent for “reviews / omdömen” queries on a page built for that job.
- Scales if you later add **more** quotes without cluttering every page.

**Cons**

- **Lower immediate proof** on pages that never get a second scroll (unless the strip is present).
- The hub page must be **maintained** and kept trustworthy (dates, links, no empty states).

**Best when:** You want the **4.9 narrative** to live in a **purpose-built** place and keep marketing pages minimal.

---

## 4. Comparison matrix (quick reference)

| Criterion | A — Evolved carousel | B — Trust strip + static quote | C — Hub-first |
|-----------|----------------------|--------------------------------|---------------|
| Emotional impact | High | Medium | Medium (on hub) |
| Accessibility / motion risk | Higher | Lower | Lower on landings |
| Maintenance | Quotes (+ optional stats) | Stats + short copy | Hub content + landings |
| Tone fit (calm) | Good if restrained | Very good | Very good on landings |
| Fit with EX-0002 / EX-0012 | Strong | Strong | Strong |

---

## 5. Open questions for your review

1. **Primary platform:** Is the 4.9 figure **TripAdvisor**, **Google**, or blended? That choice drives copy, links, and any future structured data.
2. **Languages:** Should English/German pages show **translated** excerpts, original-language quotes, or a mix?
3. **Privacy:** Are reviewers’ display names and cities OK to show as in the source platform, or do you want initials only?
4. **Homepage weight:** Do you want the Stockholm home to remain a **full-bleed testimonial moment** (favors A) or shift toward **strip + link** (B/C)?
5. **Pause control:** If autoplay remains, are you comfortable adding an explicit **pause** control for WCAG 2.2.2 alignment?

---

## 6. Recommendation (for discussion, not a decision)

A **pragmatic path** that respects tone and constraints: **combine B + C** as the default direction—**trust strip** (source-backed 4.9 + link) on high-traffic templates, **richer content on besökaromdömen**, and **retain the carousel only where** full-bleed emotion is still desired (or replace carousel slides with a **static** three-quote layout using the same visual shell). This keeps the strong number visible immediately while reducing motion and maintenance risk.

You may prefer **Option A** if the full-bleed rotating quote is central to brand storytelling; the research mainly suggests **hardening** it (pause, slide counts, fewer slides, verified aggregates).

---

## References and further reading

- W3C WAI: [Carousel functionality](https://www.w3.org/WAI/tutorials/carousels/functionality/) and [APG carousel example](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-1-prev-next/) (accessible carousel patterns).
- Chrome for Developers: [Accessible carousels](https://developer.chrome.com/blog/accessible-carousel) (overview tying WCAG criteria to implementation).
- Internal: `docs/migration-exceptions.md` (**EX-0002**, **EX-0012**), `docs/Tone of Voice.md`, `docs/phase-3-component-usage.md` (`TestimonialCarousel`).

---

*Next step after you pick a direction: translate the chosen option into component/data requirements and, if needed, a short migration-exception or verification note for any new aggregate claims shown on site.*
