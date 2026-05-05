# Maintenance backlog

One-time tasks that surface during day-to-day maintenance and do not fit into a single content change. Kept in one place so nothing is forgotten. Agents and humans add rows here when they notice something; they work rows off when capacity allows.

This file is the live maintenance backlog (no phase scope).

---

## Format

Each row has:

| Field | Notes |
|-------|-------|
| **Id** | `M-NNNN`, four digits, monotonically increasing. |
| **Title** | One short line describing the task. |
| **Status** | `open`, `in progress`, `done`, or `cancelled`. |
| **Owner** | Person or agent identifier (for example, Gustaf, or a skill name). |
| **Notes** | Context, links, blockers, date added. |

Done rows stay in the backlog for one iteration (until obviously safe to prune), then move to the archive section at the bottom of this file.

---

## Backlog

| Id | Title | Status | Owner | Notes |
|----|-------|--------|-------|-------|
| M-0001 | Centralise Stockholm opening hours | open | skills/operational-facts | Added 2026-04-24. Hours are duplicated in `site/src/components/page-bodies/OppettiderSv.astro`, `OppettiderEn.astro`, and `STOCKHOLM_OPENING_HOURS` in `site/src/lib/chrome/schema-org.ts`. Consider a single `STOCKHOLM_HOURS` export in `stockholm-offers.ts` (or a new `stockholm-hours.ts`) with both schema-ready `OpeningHoursSpecification[]` and localized prose strings; consumed by both page bodies and `schema-org.ts`. Track drift between prose and schema as the driver. |
| M-0002 | Centralise public contact email | open | skills/operational-facts | Added 2026-04-24. `info@andetag.museum` appears in `site/src/lib/ui-logic/booking-embed-contact.ts`, the Museum node in `site/src/lib/chrome/schema-org.ts`, and ~13 page bodies (grep `info@andetag.museum`). Propose a single `STOCKHOLM_CONTACT_EMAIL` export consumed via import; any `mailto:` in page bodies should reference the constant. Decision record lives in `skills/operational-facts/SKILL.md` §Decisions (carries `EX-0010` from the archived `docs/archive/migration-exceptions.md`). |
| M-0003 | Collapse SEO-landing `testimonialItems` onto `STOCKHOLM_FEATURED_REVIEWS` | open | skills/testimonials | Added 2026-04-24. `StockholmSeoLandingSv.astro`, `StockholmSeoLandingEn.astro`, and `StockholmHomeSharedBody.astro` each inline a literal `testimonialItems` array that duplicates the first 3 entries of `STOCKHOLM_FEATURED_REVIEWS` in `site/src/lib/content/stockholm-reviews.ts`. Home pages (`StockholmHomeSv/En.astro`) already `.map` from the catalog — rewrite these three files to do the same. Until then, the testimonials skill must hand-sync on every quote edit (known drift hotspots). |
| M-0004 | Six-month review of `meditation-stockholm` greenfield landing | open | skills/seo | Added 2026-04-28. §17.2b step 5 review for `/sv/stockholm/meditation-stockholm/` + `/en/stockholm/meditation-stockholm/` (greenfield landing for the §2.10 stillness/meditation cluster). Review on 2026-10-28: pass = ≥30 imp / 90d on the meditation cluster in GSC OR one observed citation per quarter in ChatGPT / Claude / Perplexity / Google AI Overviews for an aligned natural-language question. Fail = prune or merge into the closest sibling (Art Yoga, NPF, or `vilken-typ-av-upplevelse`). |
| M-0005 | Site integrity audit 2026-05-05 | done | skills/site-integrity | Added 2026-05-05. Full 8-dimension audit after artworks subsystem launch (feature/artworks). Build: pass (140 pages, 171/171 tests). All 8 dimensions clean. Three informational non-bugs in B.5: root `/` handled by Worker (not _redirects), `/stockholm/aktivitet-inomhus-stockholm/` covered by splat wildcard, `/spotify/` is an ops quicklink 302 in _redirects. |

---

## Archive

| Id | Title | Status | Owner | Notes |
|----|-------|--------|-------|-------|
| _(no rows yet)_ | | | | |
