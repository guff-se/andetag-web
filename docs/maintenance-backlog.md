# Maintenance backlog

One-time tasks that surface during day-to-day maintenance and do not fit into a single content change. Kept in one place so nothing is forgotten. Agents and humans add rows here when they notice something; they work rows off when capacity allows.

This file is not a phase doc. It survives Phase 9 closure.

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
| M-0002 | Centralise public contact email | open | skills/operational-facts | Added 2026-04-24. `info@andetag.museum` appears in `site/src/lib/ui-logic/booking-embed-contact.ts`, the Museum node in `site/src/lib/chrome/schema-org.ts`, and ~13 page bodies (grep `info@andetag.museum`). Propose a single `STOCKHOLM_CONTACT_EMAIL` export consumed via import; any `mailto:` in page bodies should reference the constant. Decision record lives in `docs/migration-exceptions.md` EX-0010. |

---

## Archive

| Id | Title | Status | Owner | Notes |
|----|-------|--------|-------|-------|
| _(no rows yet)_ | | | | |
