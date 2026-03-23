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

## Historical baseline (superseded for entry URLs when `/sv/` ships)

- **Option A** in `docs/ia-language-destination-options.md` assumed Swedish at **`/`** without a **`/sv/`** prefix. The entry-routing decision adds **`/sv/stockholm/`** and edge behavior on **`/`**; update that doc when routing is implemented.
- **SEO:** `docs/Andetag SEO Manual.md` will need **`x-default`** and hreflang examples aligned with **`/sv/stockholm/`** and the English hub.
- **Global pages** today sit outside `/stockholm/` and `/berlin/` trees (for example `/om-andetag/`, `/en/about-andetag/`, `/de/ueber-andetag/`).

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

### Hreflang note for global pages (to confirm in SEO manual)

Location pages: alternates are **same city, other languages** only. Global pages: alternates are likely **same topic, sv / en / de** (no Berlin/Stockholm pair because there is not two location variants). Confirm with `docs/Andetag SEO Manual.md` and update examples if we add explicit global-page rules.

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

| Area | Current Phase 4 behavior | What changes |
|------|-------------------------|--------------|
| **`/`** | `site/src/pages/index.astro` serves a **static Swedish home** with full `SiteLayout` and hreflang paired to **`/en/`**. | Production **`/`** is an **edge router**, not the Swedish home document. Keep a static **`/`** only for **local preview without Worker** (optional stub), or document that preview must run the Worker. Swedish home content moves to **`/sv/stockholm/`**. |
| **`page-shell-registry.ts`** | **`SV_EN_PAIRS`** includes **`["/", "/en/"]`**; **`resolveSeo`** uses **`/`** as **`x-default`** for many Swedish pages; **`/en/stockholm/`** uses **`xDefaultPath: "/"`**. | Rebuild pairs and **`resolveSeo`** so **canonical Swedish home** is **`/sv/stockholm/`** (and English hub **`/en/`** has its own hreflang story). Update **`x-default`** and **`/en/stockholm/`** defaults per **`docs/Andetag SEO Manual.md`** after edit. |
| **`layoutVariantsForPath`** | Treats **`/`** and **`/en/`** as special hub variants (`header-192`, `header-918`). | Add **`/sv/stockholm/`** (and any new hub rules); adjust **`/`** if a minimal shell is ever served. |
| **`page-shell-meta.json` / extractor** | Metadata keyed to current paths including **`/`**. | New rows for **`/sv/stockholm/`**, updated **`/en/`** hub; legacy **`/`** may drop out of indexable meta or become router-only. |
| **`public/_redirects`** | Repo rules for **`/de/`**, legacy EN aliases, privacy. | Add **matrix-driven** rules for legacy Swedish home → **`/sv/stockholm/`** (or rely on Worker only for **`/`**; avoid double redirects). |
| **Tests** | `page-shell-registry.test.ts`, `url-matrix-parity.test.ts`, layout fixtures. | Expectation updates for hreflang, **`x-default`**, and any new paths. |
| **`404.astro` / `phase-4-404.md`** | Recovery links include **`/`** as Swedish entry. | Point recovery at **`/sv/stockholm/`**, **`/en/`**, **`/de/berlin/`** as policy dictates. |
| **Worker** | Not in repo Phase 4 scope. | **New** deliverable: cookie, **`Accept-Language`**, bot list, **`302`** rules; extend **`docs/phase-4-redirect-tests.md`** (or successor) for **`/`** and **`/en/`** entry cases. |

**Not reimplemented:** `[...slug].astro` shell pattern, `SiteLayout` + `seo.ts` hreflang **mechanics**, trailing-slash config, global **404** pattern, and existing **`_redirects`** rows that still match policy. Those **stay**; only **data and routing rules** around the **entry URLs** and **new paths** change.

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
