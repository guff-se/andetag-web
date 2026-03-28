# Phase 4 reopen: location, language, and global pages

Purpose: working notes while revisiting routing and navigation after Phase 4 closure (2026-03-23). **Normative routing and cookie rules** adopted for implementation are in **`docs/url-migration-policy.md`** (entry routing section). This file keeps rationale, open product questions, and parity notes.

Status: **draft** for remaining stakeholder questions; **decided** items for entry routing and consent are reflected in policy (owner: Gustaf + migration team). **When to build:** see **Entry routing and URL expansion schedule** in `docs/grand-plan.md` (Phase 5 early through Phase 7).

## Why reopen

Phase 4 shipped shells, redirects, and hreflang against the then-current matrix. New product direction tightens the model:

1. **Location and language are independent dimensions.**
   - Stockholm: **sv** and **en**.
   - Berlin (German market site): **de** and **en**.
2. **Launch target:** **1/1 page parity** between Stockholm and Berlin (create Berlin counterparts for pages that exist only for Stockholm today).
3. **Global (non-location) pages** already exist in three languages (examples: optical fibre textile, about ANDETAG, about the artists, music). They are not duplicated per destination. Navigation and routing rules for them need an explicit story alongside location-scoped pages.

## Business objective (routing lens)

Primary goal: **drive ticket sales** for two museums with **separate markets and audiences**.

Implications for IA:

- **Location-scoped journeys** (hours, tickets, how to visit, local programming) should dominate primary navigation and CTAs so each market sees a clear local path to conversion.
- **Global story pages** (artists, music, materials, brand story) support trust and depth but should not compete with local ticket paths in the same visual band without intentional hierarchy.
- **English** is shared across destinations but serves different intent: `/en/stockholm/` vs `/en/berlin/` must stay unambiguous (no accidental cross-selling of the wrong city).

## Decided: entry routing summary (see policy for full spec)

Source of truth: **`docs/url-migration-policy.md`**, section **Entry routing, `Accept-Language`, and the `andetag_entry` cookie**.

| Topic | Decision |
|-------|----------|
| Cookie name and shape | **`andetag_entry=v1:<token>`** with tokens **`sv`**, **`de`**, **`en-s`**, **`en-b`** |
| Consent | **`necessary`** only; documented in `docs/tracking-and-consent-requirements.md` |
| Attributes | `Path=/`, `Secure`, `HttpOnly`, `SameSite=Lax`, **180-day** Max-Age, refreshed on qualifying navigation |
| **`/`** without cookie | **Verified bots:** **`302`** → **`/en/stockholm/`** (no cookie). **Humans:** **missing or empty `Accept-Language`** → **`/en/`** hub (English default, no cookie). **Otherwise** by `q`: **`sv`** → **`/sv/stockholm/`**, **`de`** → **`/de/berlin/`**, else → **`/en/`** hub |
| **`/`** with cookie | **`302`** to the path mapped from the token (see policy table) |
| **`/en/`** | Cookie **`en-s`** / **`en-b`** → **`302`** to that city; **`sv`** / **`de`** → **`302`** to matching English city; else **static hub** **`200`** |
| Deep links | Only **`/`** and exact **`/en/`** are entry routers; **`/en/*`** and other paths unchanged |
| Implementation | **Edge** (Worker or equivalent) in front of static HTML; **not** client-only for `/` or `/en/` routing |
| Crawlers | **`/`** and (by default) **`/en/`:** verified bots **`302`** → **`/en/stockholm/`**, **omit** `Set-Cookie`, **ignore** `Accept-Language` |

**Swedish Stockholm home (target):** **`/sv/stockholm/`** (introduces `/sv/`; legacy **`/`** and **`/stockholm/...`** need matrix-driven redirects when implemented).

## Decided: site chrome switcher (Phase 6, 2026-03-24)

Applies to **header** (and any mirrored controls): **edge** entry routing stays in **`docs/url-migration-policy.md`**; this section is the **in-site** language and destination control.

| Rule | Behavior |
|------|----------|
| Visibility | **All three** languages (**`sv`**, **`en`**, **`de`**) and **both** destinations (**Stockholm**, **Berlin**) are **always** available in the chrome. |
| Pick **`sv`** on a **Berlin** path | Navigate to **Stockholm** in Swedish: same **global** or **location** topic when a mapped path exists, otherwise **`/sv/stockholm/`** or agreed fallback from the matrix. |
| Pick **`de`** on a **Stockholm** path | Navigate to **Berlin** in German: same topic rule, otherwise **`/de/berlin/`** or agreed fallback. |
| Pick **Stockholm** while language is **`de`** | Set language to **`en`** and navigate to the **English Stockholm** equivalent path (Stockholm has no German site tree). |
| Pick **Berlin** while language is **`sv`** | Set language to **`en`** and navigate to the **English Berlin** equivalent path. |
| Implementation | **One** shared resolver (current path or page key + target language + target destination) so header, mobile nav, and tests do not duplicate special cases. |

## Historical baseline (superseded for entry URLs when `/sv/` ships)

- **`docs/ia-language-destination-options.md`** now records explicit **`/sv/`** as the Swedish language prefix; legacy unprefixed paths **`301`** to **`/sv/...`** (matrix + **`_redirects`**).
- **SEO:** `docs/Andetag SEO Manual.md` will need **`x-default`** and hreflang examples aligned with **`/sv/stockholm/`** and the English hub.
- **Story pages (four topics) and privacy:** as of **2026-03-28**, canonicals live under location trees (**`/sv/stockholm/...`**, **`/en/stockholm/...`**, **`/de/berlin/...`**, plus English Berlin duplicates with Stockholm canonical in HTML). Legacy global and flat URLs **`301`** to those paths per **`docs/url-matrix.csv`**. Spec: **`docs/routing-location-scoped-global-pages-plan.md`**.

## Global pages: navigation and routing options

### Option 1 — Keep canonical URLs, split navigation bands (recommended starting point)

- **Routing:** No path change; preserve inbound links and matrix rows.
- **Navigation:** Primary nav = **Visit Stockholm** and **Visit Berlin** (labels TBD) with location-scoped links. Secondary band (footer, mega-menu section, or “About the work”) holds global pages in the **current** language only.
- **Pros:** Minimal SEO and redirect risk; fastest to align with ticket-first goals; matches existing trilingual global URLs.
- **Cons:** Users must learn that some items are “whole brand” vs “this city” (mitigate with labels).

### Option 2 — Dedicated global prefix (e.g. `/global/` or `/andetag/`)

- **Routing:** New path family with redirects from legacy URLs.
- **Pros:** Very explicit information architecture; one place for “non-destination” content.
- **Cons:** Large redirect surface; hreflang and matrix churn; higher implementation and verification cost before launch.

### Option 3 — Duplicate global pages under each destination

- **Routing:** e.g. `/stockholm/om-andetag/` and `/berlin/...` with duplicated or synced content.
- **Pros:** Everything lives under one destination tree.
- **Cons:** Content duplication, canonical/hreflang complexity, and weaker alignment with “one global story” (and conflicts with “no cross-location hreflang” patterns unless carefully designed).

**Working recommendation:** **Option 1** unless analytics or stakeholder input shows users cannot find global pages. Option 2 remains a later refactor if the split nav is insufficient.

**Note (2026-03-28):** URL shape for the **four trilingual story topics** and **privacy** no longer matches “global paths unchanged”; those routes are **location-scoped** with **`301`** from old URLs. Navigation bands (primary = visit city, secondary = depth topics) still follow the Option 1 intent.

### Hreflang note for global pages (to confirm in SEO manual)

Location pages: alternates are **same city, other languages** only. The **four story topics** and **privacy** are now **location-scoped URLs**: alternates are **same location only** (Stockholm **sv**↔**en**, Berlin **de**↔**en**), not cross-city trilingual triples. Other depth pages may still follow the older “same topic across languages” pattern where the matrix says so. Confirm with `docs/Andetag SEO Manual.md` and update examples as needed.

## Berlin and Stockholm parity

- **Inventory:** Diff current `docs/url-matrix.csv` (and `docs/phase-4-route-coverage.md`) Stockholm vs Berlin rows; list missing Berlin paths for each language.
- **Implementation:** New shells and content sources for Berlin-only routes; update `page-shell-registry` / metadata extraction as needed; add **`/sv/stockholm/`** and redirects from legacy Swedish entry URLs.
- **Launch gate:** parity is a **content + routing** commitment: every kept Stockholm visitor-facing page has a Berlin equivalent in **de** and **en** (and Stockholm remains **sv** + **en** per direction above).

## Impacts on other docs (when decisions are final)

- `docs/phase-4-todo.md` — reopen status and new exit criteria for this slice.
- `docs/phase-4-route-coverage.md` — new rows, Worker-owned routes, hreflang notes.
- `docs/url-matrix.csv` — legacy `/`, `/sv/stockholm/`, and any new paths.
- `docs/ia-language-destination-options.md` — `/sv/` and entry routers vs Option A wording.
- `docs/content-model.md` — nav variants, `header` / `footer` ids, or page “scope” (`location` | `global`).
- `docs/Andetag SEO Manual.md` — `x-default`, hub, and bot-stable defaults.
- `CHANGELOG.md` — record approved routing or policy changes.

## Phase 4 implementation delta (when entry routing ships)

Phase 4 remains **valid for the closed matrix** until you flip production entry behavior. Nothing must be torn out **immediately** solely because policy was updated. The items below are **reimplementation or realignment** work triggered when **`/sv/stockholm/`**, the **`/en/`** hub model, the **Worker**, and matrix updates go live.

| Area | Current repo behavior | What changes when the entry Worker ships |
|------|-------------------------|--------------|
| **`/`** | **`index.astro`** and **`_redirects`** **`301`** to **`/sv/stockholm/`**; Swedish home is a normal shell route. | Production **`/`** becomes an **edge router** (`302` by policy). Coordinate so static **`301`** and Worker **`302`** do not chain incorrectly. |
| **`page-shell-registry.ts`** | **`/sv/stockholm/...`** canonicals; **`SV_EN_PAIRS`** pairs **`/sv/stockholm/`** with **`/en/`**; **`x-default`** for paired pages points at Swedish **`/sv/...`** paths. | SEO manual examples and any **`x-default`** policy tweaks after live URLs settle. |
| **`layoutVariantsForPath`** | Hub variants for **`/sv/stockholm/`** and **`/en/`**. | Adjust only if hub set grows. |
| **`page-shell-meta.json` / extractor** | Keys use **`/sv/...`**; run **`npm run page-shell:meta`** after **`site-html/`** updates. | None beyond ongoing extraction. |
| **`public/_redirects`** | Swedish legacy paths **`301`** to **`/sv/...`**; see **`docs/url-matrix.csv`**. | Avoid duplicate redirects with Worker for **`/`** if both apply. |
| **Tests** | Registry and matrix parity tests enforce **`keep`** paths vs shells. | Add or extend tests when Worker behavior is testable in CI if desired. |
| **`404.astro` / `phase-4-404.md`** | Recovery links use **`/sv/stockholm/`**. | None. |
| **Worker** | Not in repo yet. | **New** deliverable: cookie, **`Accept-Language`**, bot list, **`302`** rules; extend **`docs/phase-4-redirect-tests.md`** for **`/`** and **`/en/`** entry cases. |

**Stable:** `[...slug].astro` shell pattern, `SiteLayout` + `seo.ts` hreflang **mechanics**, trailing-slash config, global **404** pattern. **Evolving:** Worker versus static ownership of **`/`** and query preservation at the edge.

## Clarifying questions for stakeholders

Answer inline in this doc or in thread; numbered for reference.

1. **Stockholm and German:** Confirm there is **no** primary `de` tree for Stockholm at launch (only sv/en for Stockholm, de/en for Berlin). If partial exceptions exist (e.g. one legal page), list them.
2. **Global page hreflang:** Should global pages expose **all three** language alternates in `<link rel="alternate">`, with `x-default` still on Swedish default home or on a chosen global hub?
3. ~~**English default for Berlin**~~ **Resolved:** hub at **`/en/`** with cookie and edge **`302`**; see **`docs/url-migration-policy.md`**.
4. **Parity scope:** Does 1/1 parity include **SEO landing pages** that are Stockholm-specific in policy (`docs/url-migration-policy.md` SEO landing list), or should Berlin get analogous **different** slugs/intent rather than mirrored paths?
5. **Separate menu:** Is “separate menu” a **visual** requirement (distinct footer vs header section), or a **URL** requirement (only acceptable if answered toward Option 2)?
6. **Tickets CTA:** Should global pages repeat **both** ticket deep-links (Stockholm + Berlin), only the link for **current location context**, or a single **neutral** tickets hub?

## Decision log

| Date | Decision | Notes |
|------|----------|--------|
| 2026-03-23 | English entry: hub + preference cookie (proposed) | Evolved into full `andetag_entry` spec. |
| 2026-03-23 | Cookie + `/` + `/en/` routing | **`andetag_entry`**, **`necessary`** consent, **`Accept-Language`** on `/`, English hub when no signal for **humans**; **verified bots** on **`/`** (and typically **`/en/`**) → **`/en/stockholm/`**. Policy: `docs/url-migration-policy.md`. Consent table: `docs/tracking-and-consent-requirements.md`. |
| 2026-03-24 | Site chrome: language + destination switcher | **Always** show **`sv`**, **`en`**, **`de`** and **Stockholm**, **Berlin**. Coupling: **`sv`** on Berlin → Stockholm; **`de`** on Stockholm → Berlin; Stockholm while **`de`** → **`en`** + Stockholm; Berlin while **`sv`** → **`en`** + Berlin. One shared URL resolver. See **Decided: site chrome switcher**; Phase 6: **`docs/phase-6-todo.md`**. |
