# Phase 5 TODO, Page Migration and Iterative Approval

Purpose: migrate real page content and design in controlled batches, complete static targets required by the **Entry routing and URL expansion schedule** in `docs/grand-plan.md`, and ship entry edge behavior only when those targets return **200**.

**Prerequisites:** Phase 3 complete (2026-03-22). Phase 4 complete and closed (2026-03-23). Use `docs/phase-3-component-usage.md`, `docs/content-model.md`, `site/src/lib/routes/page-shell-registry.ts`, and `docs/phase-4-route-coverage.md` as primary inputs.

**Routing rule:** Before changing Astro routes, `docs/url-matrix.csv`, `site/public/_redirects`, registry, or any entry Worker, read **`docs/phase-4-routing-reopen.md`** and **`docs/url-migration-policy.md`** (see **`AGENTS.md`**, Routing and entry URLs).

**Localization rule:** No localized page content or localized header and footer rollout until Swedish Phase 5 is complete and approved (`docs/grand-plan.md`, Phase 6).

**English locale deferral (2026-03-24):** English **page bodies** (**`/en/`** hub, **`/en/stockholm/`**, and other **`/en/...`** migration) are **out of scope for Phase 5** until **Phase 6**, together with **localized header and footer** content. **`/en/`** keeps the Phase 4 **shell** (placeholder main) until then.

Status: **complete** (2026-03-24). **Swedish migration milestone:** all **`/sv/...`** pages in `page-shell-meta.json` migrated and design-approved (**23** custom bodies). **`P5-05`–`P5-07`** (Worker, production enable, SEO manual live entry) and optional **Berlin body parity** remain **open** under **`docs/phase-6-todo.md`** carry-forward and do not block Phase 6 localization start.

## Exit Criteria

Phase 5 **closed 2026-03-24** on the **Swedish page migration milestone** below. **`P5-05`–`P5-07`** are **carry-forward** (see **`docs/phase-6-todo.md`**).

- **`docs/definition-of-done.md` Phase 5** gates are met for approved migrated pages, with **EX-0014** for Lighthouse simulated mobile on conversion-priority pages.
- Swedish Stockholm page set is migrated, reviewed, and explicitly approved batch by batch. **`/en/stockholm/`** and English hub **body** migration (**EX-0007** and **`P5-02`**) are **Phase 6** together with localized header and footer (see **English locale deferral** above and `docs/grand-plan.md`).
- **Entry routing and URL expansion schedule** (`docs/grand-plan.md`): static **`200`** shells exist for matrix routes; **production Worker** traffic (**`/`**, **`/en/`**) remains **carry-forward** (**`docs/phase-6-todo.md`**, **`P5-05`–`P5-06`**) until staging and sign-off.
- English Berlin parity for launch (if required by business) is implemented to the agreed scope; German Berlin pages remain Phase 6 unless plan changes.
- Stakeholder sign-off and evidence live in **`docs/phase-5-verification-record.md`** (create when closing Phase 5).
- Each page reaches **final design approval** before the next **unless** an explicit **batch exception** is recorded (see **Design approval gate**; post first-wave alphabetical `/sv/` queue uses batch approval after the list is built).

## Design approval gate (sequential)

For **each** page in **Swedish Stockholm migration order (agreed)** (and the same rule for any later page in Phase 5):

- **Stop:** Do not begin the next page until Gustaf has approved the **final design** of the current page at the agreed breakpoints (layout, typography, spacing, imagery, states, and key interactions). Final means signed off as the production target for that URL, not an interim draft.
- **Record:** Log approval in the Phase 5 verification trail (for example dated note in `docs/phase-5-verification-record.md` once that file exists, or an agreed interim log until then).

**Batch exception (post first-wave Swedish queue only):** For **Swedish alphabetical remainder** (second batch list below), the agent **implements the full queue one URL at a time** (each page **finished** before the next: body component, `page-body-registry`, `[...slug].astro` map, tests if applicable, shared styles or docs when behavior changes). **Design approval is deferred until Gustaf has reviewed the whole batch** (or signs off per URL during that pass). This overrides the per-page stop rule above **only** for that ordered list, unless Gustaf rescopes mid-batch.

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
- **Design approval gate:** Gustaf approves final design; only then move to the next page (**except** second-batch alphabetical `/sv/` queue: see **Batch exception** above).

## Swedish Stockholm migration order (agreed)

**Rationale:** Start with simpler pages, then increase complexity. Canonical paths use the **`/sv/`** language prefix; they match `site/src/lib/routes/page-shell-registry.ts` and **`keep`** canonical URLs in `docs/url-matrix.csv`.

**Swedish home URL:** **`/sv/stockholm/`** is the canonical Swedish Stockholm home (content from legacy **`/`** in `site-html/`). **`/`** **`301`**s to **`/sv/stockholm/`** in static deploys; production **`/`** is also the **edge entry router** per **`docs/url-migration-policy.md`** and **`docs/phase-4-routing-reopen.md`**.

**First wave (strict order): complete (migrated + design-approved, 2026-03-23, Gustaf):**

1. ~~`/sv/stockholm/gruppbokning/`~~ (group bookings; legacy **`/stockholm/gruppbokning/`** **`301`**s here)
2. ~~`/sv/stockholm/foretagsevent/`~~
3. ~~`/sv/optisk-fibertextil/`~~ (shared Swedish; English pair **`/en/optical-fibre-textile/`**)
4. ~~`/sv/stockholm/art-yoga/`~~
5. ~~`/sv/stockholm/biljetter/`~~
6. ~~`/sv/stockholm/dejt/`~~
7. ~~`/sv/stockholm/fragor-svar/`~~
8. ~~**`/sv/stockholm/`**~~: Swedish Stockholm home. Static **`/`** redirects to this path.

**Second batch (alphabetical, all remaining `/sv/` shells in `site/src/data/page-shell-meta.json`):** Canonical paths below are the full set of **defined and routed** Swedish locale pages not yet wired to custom body content in `site/src/lib/page-registry/page-body-registry.ts`. **Order is strict A–Z by path string.** Use **`docs/phase-3-component-usage.md`**, **`docs/phase-3-component-inventory.md`**, and the same patterns as the first eight pages (`ContentSection`, `HeroSection`, `AccordionSection`, `BookingEmbed`, `ButtonGroup`, `GallerySection`, grids in `components.css`, and so on). **One page at a time:** complete migration for URL *n* before editing URL *n+1*. **Do not** pause between URLs for stakeholder sign-off; record approvals in **`docs/phase-5-verification-record.md`** when Gustaf finishes the batch review.

| # | Canonical path | Primary `site-html/` source |
|---|----------------|----------------------------|
| 1 | `/sv/musik/` | `musik.html`: **migrated** + design-approved 2026-03-24 (`MusikSv.astro`) |
| 2 | `/sv/om-andetag/` | `om-andetag.html`: **migrated** + design-approved 2026-03-24 (`OmAndetagSv.astro`) |
| 3 | `/sv/om-konstnarerna-malin-gustaf-tadaa/` | `om-konstnarerna-malin-gustaf-tadaa.html`: **migrated** + design-approved 2026-03-24 (`OmKonstnarernaSv.astro`) |
| 4 | `/sv/stockholm/aktivitet-inomhus-stockholm/` | `stockholm-aktivitet-inomhus-stockholm.html`: **migrated** + design-approved 2026-03-24 (`StockholmAktivitetInomhusSv.astro` + `StockholmSeoLandingSv`) |
| 5 | `/sv/stockholm/att-gora-stockholm/` | `stockholm-att-gora-stockholm.html`: **migrated** + design-approved 2026-03-24 (`StockholmAttGoraSv.astro` + `StockholmSeoLandingSv`) |
| 6 | `/sv/stockholm/besokaromdomen/` | `stockholm-besokaromdomen.html`: **migrated** + design-approved 2026-03-24 (`BesokaromdomenSv.astro`; TripAdvisor slider omitted **EX-0012**) |
| 7 | `/sv/stockholm/hitta-hit/` | `stockholm-hitta-hit.html`: **migrated** + design-approved 2026-03-24 (`HittaHitSv.astro`) |
| 8 | `/sv/stockholm/museum-stockholm/` | `stockholm-museum-stockholm.html`: **migrated** + design-approved 2026-03-24 (`StockholmMuseumSv.astro` + `StockholmSeoLandingSv`) |
| 9 | `/sv/stockholm/npf-stockholm/` | `stockholm-npf-stockholm.html`: **migrated** + design-approved 2026-03-24 (`NpfStockholmSv.astro`) |
| 10 | `/sv/stockholm/oppettider/` | `stockholm-oppettider.html`: **migrated** + design-approved 2026-03-24 (`OppettiderSv.astro`) |
| 11 | `/sv/stockholm/presentkort/` | `stockholm-presentkort.html`: **migrated** + design-approved 2026-03-24 (`PresentkortSv.astro`) |
| 12 | `/sv/stockholm/sasongskort/` | `stockholm-sasongskort.html`: **migrated** + design-approved 2026-03-24 (`SasongskortSv.astro`) |
| 13 | `/sv/stockholm/tillganglighet/` | `stockholm-tillganglighet.html`: **migrated** + design-approved 2026-03-24 (`TillganglighetSv.astro`) |
| 14 | `/sv/stockholm/utstallning-stockholm/` | `stockholm-utstallning-stockholm.html`: **migrated** + design-approved 2026-03-24 (`StockholmUtstallningSv.astro` + `StockholmSeoLandingSv`) |
| 15 | `/sv/stockholm/vilken-typ-av-upplevelse/` | `stockholm-vilken-typ-av-upplevelse.html`: **migrated** + design-approved 2026-03-24 (`VilkenTypAvUpplevelseSv.astro`) |

**Out of this table:** **`/privacy/`** (shell; not under **`/sv/`** prefix). **English and German locale bodies** (**`/en/`**, **`/en/stockholm/`**, **`EX-0007`**, **`P5-02`**): **Phase 6** with localized header and footer (not Phase 5). Berlin routes and remaining Phase 5 scope per **`docs/grand-plan.md`**.

**After the second batch:** Any newly added **`keep`** Swedish URLs follow the same checklist; restore the default **design approval gate** (approve before next) unless a new batch exception is agreed.

## Task Board

## P5, Must Complete in Phase 5

- [x] **P5-00 Confirm Phase 5 scope, first-wave order, and approval rhythm**
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

- [x] **P5-01 Close early entry-schedule static targets (matrix, registry, redirects, shells)**
  - Owner: AI agent
  - Inputs:
    - `docs/url-matrix.csv`
    - `docs/phase-4-route-coverage.md`
    - `site/public/_redirects`
    - `site/src/lib/routes/page-shell-registry.ts`
  - Include:
    - Static **`/sv/stockholm/`** as **200** Swedish home content target; **`/`** aligned with **`docs/phase-4-routing-reopen.md`** (edge router or preview stub, not a second Swedish home document). Berlin or Stockholm parity paths per the schedule: routes and redirects must not send entry **`302`** traffic to missing pages.
  - Done when: builds and redirect tests show **200** (or intentional redirect chains per policy) for the minimum static targets required before Worker enablement (`docs/grand-plan.md` dependency rule).
  - **Closed 2026-03-24:** `npm run build` produces **`dist/`** for all **`PAGE_SHELL_PATHS`**; **`/`** → **`/sv/stockholm/`** via `index.astro` and **`_redirects`**; matrix and **`docs/phase-4-route-coverage.md`** aligned. Evidence: **`docs/phase-5-verification-record.md`** (P5-01).

- [x] **P5-02 Swedish Stockholm home at `/sv/stockholm/` with real migrated content** (done); **English hub `/en/` deferred to Phase 6**
  - Owner: Gustaf + AI agent
  - Inputs:
    - Source pages in `site-html/` and SEO drafts in `seo-content/` where applicable
    - `docs/Tone of Voice.md`
  - Include:
    - **`/sv/stockholm/`:** real migrated content and design from the current Swedish home at legacy **`/`** (source-backed), using Phase 3 components. **Complete** (design-approved).
    - **`/en/`:** **Phase 6** together with localized header and footer; **`/en/`** remains shell placeholder through Phase 5 per stakeholder decision (2026-03-24).
  - Done when: **`/sv/stockholm/`** is approved (**done**). **`/en/`** body is **Phase 6** (reopen under Phase 6 checklist when Swedish Phase 5 is closed).

- [x] **P5-03 Execute Swedish Stockholm page migration in approved order**
  - Owner: Gustaf + AI agent
  - Inputs:
    - **Swedish Stockholm migration order (agreed):** first wave (**done**); second batch **alphabetical table** (`/sv/` remainder in `page-shell-meta.json`)
    - `docs/phase-3-component-usage.md`
  - Include:
    - **First wave:** complete (8 URLs).
    - **Second batch:** implement the 15-row alphabetical table **sequentially**; **batch design approval** after the queue is built (see **Batch exception** under Design approval gate).
    - Apply **component-first change rule** for all fixes and polish.
    - **`EX-0007`** (**`/en/stockholm/`**) and other English bodies: **Phase 6** (not a Phase 5 exit requirement after English deferral 2026-03-24).
  - Done when: all Swedish **`/sv/`** shells in `page-shell-meta.json` plus agreed extras (for example **`/privacy/`** if in scope) are migrated and approved per the per-page checklist above.
  - **Closed 2026-03-24:** every **`/sv/...`** key in **`page-shell-meta.json`** has a custom body in **`page-body-registry.ts`**. **`/privacy/`** remains **shell-only** (not **`/sv/`**; body migration out of this milestone).

- [x] **P5-04 Berlin English parity (scope per launch plan)**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/grand-plan.md` (schedule: Phase 5 mid, continue as needed)
    - `docs/url-matrix.csv` and route coverage
  - Include:
    - Routes and migrated English Berlin pages required for launch, unless business defers Berlin.
  - Done when: agreed Berlin English paths are **200** with approved content or explicitly deferred with logged exception and owner.
  - **Closed 2026-03-24 for Phase 5 scope:** **`/en/berlin/`**, **`/de/berlin/`**, and related matrix **`keep`** routes return **200** as **static shells** with real head metadata. **Migrated English Berlin main content** (beyond placeholder) is **carry-forward** in **`docs/phase-6-todo.md`** if launch requires it.

- [ ] **P5-05 Implement Cloudflare Worker (or equivalent) for entry routing (staging first)**
  - Owner: AI agent (+ Gustaf for account or DNS as needed)
  - Inputs:
    - `docs/url-migration-policy.md` (`andetag_entry`, **`/`**, **`/en/`**, **`Accept-Language`**, verified bots)
    - `docs/phase-4-routing-reopen.md`
  - Include:
    - Staging validation: no redirect into empty shells; cookie set or read per policy.
  - Done when: Worker matches policy in staging and is ready for production enable decision.
  - **Carry-forward:** **`docs/phase-6-todo.md`** (not closed in Phase 5).

- [ ] **P5-06 Production enable of entry Worker and entry UX smoke test sign-off**
  - Owner: Gustaf
  - Inputs:
    - Completed `P5-02`, `P5-03` to agreed gate, and critical **`/en/berlin/`** paths per `docs/grand-plan.md`
  - **Staging (pre-`www` cutover):** Worker deploy at **`https://andetag-web.guff.workers.dev`** (push to **`main`**); run **`docs/phase-4-redirect-tests.md`** table **B** there and log results.
  - **Production:** **`https://www.andetag.museum`** remains the legacy site until cutover; repeat table **B** on **`www`** when this stack replaces it, then sign off.
  - **Carry-forward:** **`docs/phase-6-todo.md`**.

- [ ] **P5-07 Update SEO manual and examples for live entry behavior**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/Andetag SEO Manual.md`
    - Live or staging URL behavior after `P5-06`
  - Include:
    - Hreflang and **`x-default`** examples consistent with shipped routes; final audit remains Phase 7.
  - Done when: manual examples match implementation or gaps are explicitly noted for Phase 7.
  - **Carry-forward:** **`docs/phase-6-todo.md`** (depends on **`P5-06`**).

- [x] **P5-08 Validate Phase 5 quality gates on conversion-priority migrated pages**
  - Owner: AI agent
  - Inputs:
    - `docs/definition-of-done.md` Phase 5 (Lighthouse Performance mobile >= 85 on conversion-priority pages, single blocking redirect hop, and other gates)
  - Done when: representative pages meet DoD or approved exceptions are logged with remediation owners.
  - **Closed 2026-03-24:** **`docs/phase-5-verification-record.md`** Lighthouse notes; **EX-0014** for simulated mobile **< 85** vs provided throttling.

- [x] **P5-09 Phase 5 verification record, grand-plan status, and changelog**
  - Owner: AI agent
  - Outputs:
    - `docs/phase-5-verification-record.md` (evidence, Lighthouse or manual QA summary, stakeholder sign-off)
    - `docs/grand-plan.md` Phase 5 status **complete** with date
    - `CHANGELOG.md` under `Unreleased`
    - This file: status **complete**; **`P5-05`–`P5-07`** explicitly listed in **`docs/phase-6-todo.md`**
  - Done when: Phase 6 can start localization without ambiguous Phase 5 carry-over (Swedish bodies and static shells documented).

## Working Rhythm

- One checkpoint per completed migration batch or infrastructure milestone (Worker staging, hub, home).
- **First wave:** per page, implement then **final design** approved before the next URL.
- **Second batch (alphabetical `/sv/` remainder):** per URL, implement completely before the next; **stakeholder approval** after the full 15-page queue (unless Gustaf rescopes).
- Prefer shared components and shared styles over page-only CSS or one-off markup; log justified one-offs in `docs/migration-exceptions.md`.
- Log URL or content deviations in `docs/migration-exceptions.md` before treating them as done.
- Re-read entry policy when touching **`/`**, **`/en/`**, cookies, or bot handling.

## Immediate next (Phase 6)

1. Open **`docs/phase-6-todo.md`**: localization (**`en`**, **`de`**) and carry-forward (**Worker**, SEO manual, optional Berlin bodies).
2. Re-read **`docs/grand-plan.md`** Phase 6 and **`docs/url-migration-policy.md`** before changing **`/en/`** or entry routing.
