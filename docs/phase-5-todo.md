# Phase 5 TODO, Page Migration and Iterative Approval

Purpose: migrate real page content and design in controlled batches, complete static targets required by the **Entry routing and URL expansion schedule** in `docs/grand-plan.md`, and ship entry edge behavior only when those targets return **200**.

**Prerequisites:** Phase 3 complete (2026-03-22). Phase 4 complete and closed (2026-03-23). Use `docs/phase-3-component-usage.md`, `docs/content-model.md`, `site/src/lib/routes/page-shell-registry.ts`, and `docs/phase-4-route-coverage.md` as primary inputs.

**Routing rule:** Before changing Astro routes, `docs/url-matrix.csv`, `site/public/_redirects`, registry, or any entry Worker, read **`docs/phase-4-routing-reopen.md`** and **`docs/url-migration-policy.md`** (see **`AGENTS.md`**, Routing and entry URLs).

**Localization rule:** No localized page content or localized header rollout until Swedish Phase 5 is complete and approved (`docs/grand-plan.md`, Phase 6).

Status: **open** (not started).

## Exit Criteria

Phase 5 is complete only when all items marked `P5` are done and approved:

- **`docs/definition-of-done.md` Phase 5** gates are met for approved migrated pages (performance, SEO head, accessibility, visual parity sign-off, conversion paths).
- Swedish Stockholm page set is migrated, reviewed, and explicitly approved batch by batch; **EX-0007** is resolved when **`/en/stockholm/`** carries source-backed migrated content and metadata (see `docs/migration-exceptions.md`).
- **Entry routing and URL expansion schedule** (`docs/grand-plan.md`): static **`200`** targets exist before production Worker traffic on **`/`** or **`/en/`**; Worker behavior matches policy; production enable is signed off when hub, **`/sv/stockholm/`**, **`/en/stockholm/`**, and critical Berlin **`/en/berlin/`** paths meet the agreed gate (stakeholder entry UX smoke test).
- English Berlin parity for launch (if required by business) is implemented to the agreed scope; German Berlin pages remain Phase 6 unless plan changes.
- Stakeholder sign-off and evidence live in **`docs/phase-5-verification-record.md`** (create when closing Phase 5).
- Each page in the migration order reaches **final design approval** before work starts on the next (see below).

## Design approval gate (sequential)

For **each** page in **Swedish Stockholm migration order (agreed)** (and the same rule for any later page in Phase 5):

- **Stop:** Do not begin the next page until Gustaf has approved the **final design** of the current page at the agreed breakpoints (layout, typography, spacing, imagery, states, and key interactions). Final means signed off as the production target for that URL, not an interim draft.
- **Record:** Log approval in the Phase 5 verification trail (for example dated note in `docs/phase-5-verification-record.md` once that file exists, or an agreed interim log until then).

## Component-first change rule

When migrating or tuning a page, if something does not match source or intent:

1. **First:** Decide whether the fix belongs in a **shared component**, shared layout pattern, or shared styles (for example `site/src/styles/components.css` and existing component APIs per `docs/phase-3-component-usage.md`). Prefer this so the next pages inherit the correction.
2. **Second:** Only if it is genuinely unique to that URL, use **page-specific** markup or scoped styles. Log non-obvious one-offs in `docs/migration-exceptions.md`.

## Per-Page Checklist (repeat for each migrated page)

Use `docs/phase-3-component-qa-checklist.md` and `docs/phase-3-component-usage.md` as the baseline. For each page:

- Route exists and matches `docs/url-matrix.csv` and route coverage expectations.
- Body content and layout parity use approved components; deviations are logged in `docs/migration-exceptions.md`.
- Adjustments follow **Component-first change rule** above.
- Title, description, canonical, hreflang, indexability, and (where applicable) Open Graph fields match `docs/content-model.md` and `docs/Andetag SEO Manual.md`.
- Custom embeds, maps, booking, or lead paths behave and link correctly.
- **Design approval gate:** Gustaf approves final design; only then move to the next page.

## Swedish Stockholm migration order (agreed)

**Rationale:** Start with simpler pages, then increase complexity. Canonical paths use the **`/sv/`** language prefix; they match `site/src/lib/routes/page-shell-registry.ts` and **`keep`** canonical URLs in `docs/url-matrix.csv`.

**Swedish home URL:** **`/sv/stockholm/`** is the canonical Swedish Stockholm home (content from legacy **`/`** in `site-html/`). **`/`** **`301`**s to **`/sv/stockholm/`** in static deploys; production **`/`** is also the **edge entry router** per **`docs/url-migration-policy.md`** and **`docs/phase-4-routing-reopen.md`**.

**First wave (strict order):**

1. `/sv/stockholm/gruppbokning/` (group bookings; legacy **`/stockholm/gruppbokning/`** **`301`**s here)
2. `/sv/stockholm/foretagsevent/`
3. `/sv/optisk-fibertextil/` (shared Swedish; English pair **`/en/optical-fibre-textile/`**)
4. `/sv/stockholm/art-yoga/`
5. `/sv/stockholm/biljetter/`
6. `/sv/stockholm/dejt/`
7. `/sv/stockholm/fragor-svar/`
8. **`/sv/stockholm/`** — Swedish Stockholm home (final step of this wave). Migrate and approve content and design; static **`/`** already redirects to this path.

**After the first wave:** All other Swedish Stockholm (and remaining `keep`) pages may be migrated in **any order**, still using the per-page checklist, **design approval gate**, and **component-first change rule**.

## Task Board

## P5, Must Complete in Phase 5

- [ ] **P5-00 Confirm Phase 5 scope, first-wave order, and approval rhythm**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/grand-plan.md` (Phase 5 and Entry routing and URL expansion schedule)
    - `docs/definition-of-done.md`
    - `docs/phase-4-routing-reopen.md`
    - `docs/url-migration-policy.md`
  - Include:
    - First-wave order is published in **Swedish Stockholm migration order (agreed)** above.
    - Confirm **design approval gate** (final design per page before next) and where approvals are recorded (verification record or interim log).
    - Confirm **component-first change rule** is the default for implementation work.
  - Done when: approval rhythm and recording location are explicit; no open blockers on sequencing.

- [ ] **P5-01 Close early entry-schedule static targets (matrix, registry, redirects, shells)**
  - Owner: AI agent
  - Inputs:
    - `docs/url-matrix.csv`
    - `docs/phase-4-route-coverage.md`
    - `site/public/_redirects`
    - `site/src/lib/routes/page-shell-registry.ts`
  - Include:
    - Static **`/sv/stockholm/`** as **200** Swedish home content target; **`/`** aligned with **`docs/phase-4-routing-reopen.md`** (edge router or preview stub, not a second Swedish home document). Berlin or Stockholm parity paths per the schedule: routes and redirects must not send entry **`302`** traffic to missing pages.
  - Done when: builds and redirect tests show **200** (or intentional redirect chains per policy) for the minimum static targets required before Worker enablement (`docs/grand-plan.md` dependency rule).

- [ ] **P5-02 Ship English hub at `/en/` and Swedish Stockholm home at `/sv/stockholm/` with real migrated content**
  - Owner: Gustaf + AI agent
  - Inputs:
    - Source pages in `site-html/` and SEO drafts in `seo-content/` where applicable
    - `docs/Tone of Voice.md`
  - Include:
    - **`/sv/stockholm/`:** real migrated content and design from the current Swedish home at legacy **`/`** (source-backed), using Phase 3 components.
    - **`/en/`:** replace placeholder-only hub shell with reviewed content and design parity.
  - Done when: both URLs return **200** with stakeholder-approved content and head metadata.

- [ ] **P5-03 Execute Swedish Stockholm page migration in approved order**
  - Owner: Gustaf + AI agent
  - Inputs:
    - **Swedish Stockholm migration order (agreed)** (first wave, then remainder in any order)
    - `docs/phase-3-component-usage.md`
  - Include:
    - One page at a time in first-wave order: **final design approval** before starting the next.
    - Apply **component-first change rule** for all fixes and polish.
    - Resolve **EX-0007** when **`/en/stockholm/`** is fully migrated with source-backed metadata and body.
  - Done when: all Swedish Stockholm pages in scope for Phase 5 are approved per the per-page checklist above.

- [ ] **P5-04 Berlin English parity (scope per launch plan)**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/grand-plan.md` (schedule: Phase 5 mid, continue as needed)
    - `docs/url-matrix.csv` and route coverage
  - Include:
    - Routes and migrated English Berlin pages required for launch, unless business defers Berlin.
  - Done when: agreed Berlin English paths are **200** with approved content or explicitly deferred with logged exception and owner.

- [ ] **P5-05 Implement Cloudflare Worker (or equivalent) for entry routing (staging first)**
  - Owner: AI agent (+ Gustaf for account or DNS as needed)
  - Inputs:
    - `docs/url-migration-policy.md` (`andetag_entry`, **`/`**, **`/en/`**, **`Accept-Language`**, verified bots)
    - `docs/phase-4-routing-reopen.md`
  - Include:
    - Staging validation: no redirect into empty shells; cookie set or read per policy.
  - Done when: Worker matches policy in staging and is ready for production enable decision.

- [ ] **P5-06 Production enable of entry Worker and entry UX smoke test sign-off**
  - Owner: Gustaf
  - Inputs:
    - Completed `P5-02`, `P5-03` to agreed gate, and critical **`/en/berlin/`** paths per `docs/grand-plan.md`
  - Done when: Gustaf signs off entry UX smoke test; production traffic behavior matches policy.

- [ ] **P5-07 Update SEO manual and examples for live entry behavior**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/Andetag SEO Manual.md`
    - Live or staging URL behavior after `P5-06`
  - Include:
    - Hreflang and **`x-default`** examples consistent with shipped routes; final audit remains Phase 7.
  - Done when: manual examples match implementation or gaps are explicitly noted for Phase 7.

- [ ] **P5-08 Validate Phase 5 quality gates on conversion-priority migrated pages**
  - Owner: AI agent
  - Inputs:
    - `docs/definition-of-done.md` Phase 5 (Lighthouse Performance mobile >= 85 on conversion-priority pages, single blocking redirect hop, and other gates)
  - Done when: representative pages meet DoD or approved exceptions are logged with remediation owners.

- [ ] **P5-09 Phase 5 verification record, grand-plan status, and changelog**
  - Owner: AI agent
  - Outputs:
    - `docs/phase-5-verification-record.md` (evidence, Lighthouse or manual QA summary, stakeholder sign-off)
    - `docs/grand-plan.md` Phase 5 status **complete** with date
    - `CHANGELOG.md` under `Unreleased`
    - This file: checkboxes for all `P5` items set to done and status line set to **complete**
  - Done when: Phase 6 can start localization without ambiguous Phase 5 carry-over.

## Working Rhythm

- One checkpoint per completed migration batch or infrastructure milestone (Worker staging, hub, home).
- Per page: implement, iterate until **final design** is approved, then advance in the list.
- Prefer shared components and shared styles over page-only CSS or one-off markup; log justified one-offs in `docs/migration-exceptions.md`.
- Log URL or content deviations in `docs/migration-exceptions.md` before treating them as done.
- Re-read entry policy when touching **`/`**, **`/en/`**, cookies, or bot handling.

## Immediate Next 3 Actions

1. Run **`P5-00`**: confirm approval logging only (first-wave order is fixed above).
2. Run **`P5-01`** and **`P5-02`** in parallel where possible so entry redirects never target empty shells.
3. Begin **`P5-03`** on **`/sv/stockholm/gruppbokning/`**, then continue the first wave in listed order.
