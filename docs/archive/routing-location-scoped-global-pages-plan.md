# Plan: location-scoped routes for story or global pages

Purpose: step-by-step migration from **English global paths** (for example `/en/music/`, `/en/about-andetag/`) to **dual location-prefixed English URLs** (for example `/en/stockholm/music/`, `/en/berlin/music/`), with **legacy redirects**, **SEO canonical** from Berlin English to Stockholm English, and **no separate English global chrome**. Extend the same **slug split** to **Swedish** and **German** where product rules require, and keep **one content source** per logical page.

Status: **implemented** (2026-03-28). **`docs/url-matrix.csv`**, **`docs/url-migration-policy.md`**, and **`docs/phase-4-routing-reopen.md`** updated in the same delivery; **`CHANGELOG.md`** records the routing slice.

---

## Locked decisions (2026-03-28)

These replace open questions in the sections below.

| Topic | Decision |
|-------|----------|
| **Slug tails** | Keep **page slugs from the old** (live) **site**; **only** add the **location** segment (**`/stockholm/`** or **`/berlin/`**) after the language prefix. Same spelling per locale as today (Swedish, English, German), except where the old site never had a URL (**Redirect scope**). |
| **Location in path** | **Every** normal HTML page URL includes a **location** segment. **Exceptions:** **`/`** (root entry router) and **`/en/`** (English hub) per **`docs/url-migration-policy.md`**. No other location-less content pages. |
| **Swedish story pages** | **`/sv/stockholm/{slug}/`** with the same **`{slug}`** as legacy **`/sv/{slug}/`** where that path existed. |
| **German story pages** | **`/de/berlin/{slug}/`** with **`{slug}`** matching the **old** site’s German slug for that page (e.g. **`musik/`** under Berlin for music if that is the live slug; do not invent never-live slugs). |
| **English story pages** | **`/en/stockholm/{slug}/`** = **SEO canonical**; **`/en/berlin/{slug}/`** = same body, Berlin chrome, **`rel="canonical"`** → Stockholm English. **`{slug}`** unchanged from legacy English global paths. |
| **`hreflang` and internal language links** | **Same location only:** Stockholm **sv ↔ en**; Berlin **de ↔ en**. No Swedish Berlin or German Stockholm. |
| **Scope (story)** | **Four** topics: about ANDETAG, artists, music, optical fibre textile. |
| **Privacy** | **No** shared **`/privacy/`**. **Four** location pages (two languages × two locations): **`/sv/stockholm/privacy/`**, **`/en/stockholm/privacy/`**, **`/de/berlin/privacy/`**, **`/en/berlin/privacy/`**. Berlin copies get **rewritten** privacy copy for that market; treat like normal location shells (chrome, **`hreflang`** per side, matrix rows). |
| **English chrome** | **`chrome-hdr-en-stockholm-brand`** and **`en-brand`** nav: **remove fully**; story pages use the same header or footer families as other location English pages. |
| **`x-default`** | **Stockholm-side** pages: **`x-default`** → **Swedish** URL for that topic. **Berlin-side** pages: **`x-default`** → **German** URL for that topic. |
| **Legacy English global URLs** | **`301`** from **`/en/music/`**-style paths **only** to matching **`/en/stockholm/...`**, **one hop** (see **Single-hop redirects**). |
| **`/en/` hub** | **Unchanged** (city chooser per policy). |
| **Rollout** | **Single delivery** (all four story topics + privacy split + redirects + docs + tests in one wave). |
| **`hreflang` vs Berlin English `canonical`** | Ship the current design; **revisit** after **Search Console** and real indexing data (**no** extra spec now). |

### Redirect scope (normative)

Add **`public/_redirects`** (and matrix **redirect** rows) **only** for URLs that **actually existed** on the **original** live site: primary evidence **`site-html/sitemap.xml`** (and the same inventory behind **`docs/url-matrix.csv`** when it reflects real published URLs).

- **Do not** add **`301`** rules for paths that **never** appeared on the original sitemap or were never published (for example a migration-only slug such as **`/de/musik-von-andetag/`** if it was **not** a real legacy URL).
- When **`docs/url-matrix.csv`** lists a URL that was never live, **fix or remove** the row during this migration rather than inventing a redirect chain for it.

### Single-hop redirects (normative)

- **Never** rely on **two** (or more) **`301`** hops to reach the final URL for the same user request: each legacy URL must map **directly** to its **final** canonical path in **`_redirects`** (and edge config, if any).
- **Example:** if both **`/musik/`** and **`/sv/musik/`** were real legacy URLs, each gets its **own** rule straight to **`/sv/stockholm/musik/`** (not **`/musik/`** → **`/sv/musik/`** only, leaving a second hop).
- Legacy **`/privacy/`** (if in sitemap): **one** **`301`** to the matrix-agreed target (default candidate **`/sv/stockholm/privacy/`**; record the chosen URL in **`docs/url-matrix.csv`**).

---

## 1. Lock the URL contract (before code)

1. **Affected logical pages:** the **four** story topics plus **privacy** (four URLs); paths enumerated in **`docs/url-matrix.csv`** and **`site/src/lib/routes/chrome-navigation-resolve.ts`** after the move.
2. **Canonical paths:** per **Locked decisions** (Swedish **`/sv/stockholm/...`**, German **`/de/berlin/...`**, English Stockholm canonical + Berlin duplicate with **`seoCanonicalPath`**).
3. **Trailing slashes and slug rules:** **`docs/url-migration-policy.md`**.
4. **Redirect status codes:** **`301`** for permanent legacy retirement (**Redirect scope** applies).

Deliverable: updated **`docs/url-matrix.csv`** (and **`docs/phase-4-route-coverage.md`**) consistent with **Redirect scope**.

---

## 2. Routing and static generation

1. **`site/src/data/page-shell-meta.json`**
   - Add **new shell keys** for every new URL Astro must serve (Stockholm and Berlin variants per topic per language as applicable).
   - Regenerate via **`site/scripts/extract-page-shell-meta.mjs`** from **`site-html/`** when matching scraped files exist; otherwise add **documented manual** title or description rows and log source in **`docs/migration-exceptions.md`** if you cannot source from HTML yet.
2. **`site/src/lib/routes/page-shell-registry.ts`**
   - Replace **`STOCKHOLM_SV_EN_PAIRS`** entries that still point English global paths (for example `/en/music/`) with **`/en/stockholm/...`** paths; add **Berlin English** paths as separate shell rows.
   - Update **`languageAndDestinationForPath`** so **`/en/stockholm/...`** maps to destination **stockholm** and **`/en/berlin/...`** story paths map to **berlin** (not only the Berlin home subtree).
   - Remove or narrow **`EN_BRAND_PATHS`** once global English chrome is retired (see section 4).
   - Extend **`resolveSeo`**:
     - **hreflang:** **same location only** (see **Locked decisions**): Stockholm shells list **sv + en** Stockholm paths; Berlin shells list **de + en** Berlin paths. **Berlin English** still uses **`seoCanonicalPath`** → Stockholm English for the **`rel="canonical"`** tag (section 3).
     - **Berlin English duplicate:** supply **`seoCanonicalPath`** so the HTML canonical tag points at Stockholm English while the **requested path** stays Berlin.
3. **`site/src/pages/[...slug].astro`**
   - Map **new paths** to the **same** body components as today (single source): either **reuse** `MusikEn` for both `/en/stockholm/music/` and `/en/berlin/music/`, or introduce a thin wrapper that delegates to one component.
4. **`site/src/lib/page-registry/page-body-registry.ts`**
   - Register custom bodies for all **new** paths that need them; keep **one** Astro component per logical page where possible.
5. **Privacy**
   - Remove the special-case **single** **`/privacy/`** shell from the **old** model; add **four** shells (**Locked decisions**). Update **`page-shell-registry.ts`** **`resolveSeo`** (today **`/privacy/`** is a single triple-**`hreflang`** row): replace with **Stockholm** and **Berlin** clusters ( **`hreflang`** + **`x-default`** per **Locked decisions**). Berlin English privacy is **self-canonical** unless you later align with a duplicate policy.
   - Implement **four** bodies or shared layout with location-specific copy; **Berlin** German and English text is **rewritten** for that market.
6. **Edge entry routing** (`docs/url-migration-policy.md`)
   - Confirm **`andetag_entry`** refresh rules still apply when visitors land on new **`/en/stockholm/...`** paths (they should).

Verification: **`npm test`** in **`site/`**; extend **`page-shell-registry.test.ts`** so every **`page-shell-meta.json`** key has valid **`getPageShellRoute`** output including new Berlin English story paths.

---

## 3. SEO: canonical override, hreflang, sitemap, GSC

1. **Canonical URL in HTML**
   - Today **`createPageLayoutModel`** uses **`buildCanonicalUrl(canonicalPath)`** (`site/src/lib/chrome/page-layout.ts`), so the visible path is always self-canonical.
   - **Change:** for Berlin English duplicates, pass **`seoCanonicalPath`** (Stockholm English) into the layout model while **`canonicalPath`** remains the **actual request path** for nav resolution and active states.
   - Thread the field through **`SiteLayout.astro`** props from **`[...slug].astro`** via **`getPageShellRoute`** (or a small helper).
2. **`hreflang`**
   - Emit alternates per **Locked decisions** (location-scoped language pairs). Implement **`x-default`** per location (Stockholm cluster → Swedish, Berlin cluster → German).
   - **Berlin English story pages:** **`rel="canonical"`** → Stockholm English while **`hreflang`** stays location-scoped; **ship as decided** and **revisit** after **GSC** (see **Locked decisions**). Document briefly in **`docs/Andetag SEO Manual.md`**.
3. **Sitemap (Phase 7 or earlier if partial)**
   - Include **only** canonical URLs for indexable HTML; **omit** Berlin English **story** duplicates if they canonicalize to Stockholm. **Privacy:** include all **four** URLs if each is **self-canonical** and indexable.
4. **Search Console**
   - After launch, monitor **canonical** selection and **hreflang**; **revisit** Berlin English story behaviour if **GSC** reports issues.

---

## 4. Header and menu design

1. **Retire English global chrome**
   - Remove use of **`chrome-hdr-en-stockholm-brand`** and **`en-brand`** navigation for story pages (`site/src/lib/chrome/types.ts`, **`variants.ts`**, **`navigation.ts`**).
   - Story pages in English on Stockholm use the **same** header or footer family as other **`/en/stockholm/...`** content (for example **`chrome-hdr-en-stockholm-small`** + **`en-main`** or agreed equivalent).
   - Story pages in English on Berlin use **Berlin English** chrome (**`chrome-hdr-en-berlin-small`** or hero rules consistent with other Berlin English pages).
2. **Desktop and mobile parity**
   - Update **`SiteHeader.astro`** only if structure or props change; keep **selector rules** from **`docs/phase-4-routing-reopen.md`** (language and destination controls).
3. **Phase 3 fixtures**
   - Refresh **`site/src/lib/chrome/fixtures.ts`** and related tests that assert **`en-brand`** for global English pages.

---

## 5. Chrome resolver and topic map

1. **`site/src/lib/routes/chrome-navigation-resolve.ts`**
   - Extend **`GLOBAL_TRILINGUAL_TOPICS`** (or replace with a clearer name) so each topic includes:
     - **`svStockholm`**, **`enStockholm`**, **`englishBerlin`**, **`germanBerlin`** as needed.
   - Replace **`enStockholm: "/en/music/"`** with **`/en/stockholm/music/`** (or final slugs); add **`englishBerlin: "/en/berlin/music/"`** (or final slugs).
   - Replace **`PRIVACY_TOPIC`** (single **`/privacy/`** for all four slots) with **four** paths: **`/sv/stockholm/privacy/`**, **`/en/stockholm/privacy/`**, **`/de/berlin/privacy/`**, **`/en/berlin/privacy/`** so language or destination switches stay on the privacy topic.
2. **Tests**
   - Add or update tests so **language** and **destination** switches from a story page land on the **matching** path for the same topic (not on legacy global paths).

---

## 6. Internal linking

1. **Chrome data**
   - **`navigation.ts`**, **`footer-en-stockholm.ts`**, **`hero-en-stockholm.ts`**, and any **`en-brand`** item lists: replace **`/en/music/`**, **`/en/about-andetag/`**, etc., with **location-aware** targets (Stockholm chrome → Stockholm paths; Berlin chrome → Berlin paths).
2. **Page bodies**
   - Grep **`site/src/components/page-bodies/`** for hard-coded **`/en/...`** global paths; update to **`/en/stockholm/...`** or relative strategies.
3. **Repo prose and snapshots**
   - **`site-md/`**, **`seo-content/`**, and **docs** examples: update links so internal references match canonical paths (avoid reintroducing legacy URLs except in redirect docs).
4. **Structured data**
   - If any JSON-LD or Open Graph builders embed URLs, align them with **canonical** URLs for SEO (Stockholm English for duplicated topics).

---

## 7. Forwarding and redirects

1. **`site/public/_redirects`**
   - Add **`301`** rules **only** per **Redirect scope** in **Locked decisions**: legacy paths that **existed** on the original site (e.g. **`/en/music/`** → **`/en/stockholm/music/`**, **`/sv/musik/`** → **`/sv/stockholm/musik/`** when **`/sv/musik/`** was live).
   - **Do not** add redirects for URLs that were **never** on the original sitemap (no chain for fictional migration slugs).
   - Obey **Single-hop redirects**: every legacy URL maps **once** to its **final** path (no intentional multi-hop chains).
2. **`docs/url-matrix.csv`**
   - For each moved URL: set **redirect** row or update **keep** target URL; keep **source** column aligned with live policy.
3. **`docs/phase-4-redirect-tests.md`**
   - Add rows for every new rule; execute and log.
4. **Cloudflare Worker** (when present)
   - Ensure **no double-hop** conflicts between Worker **`302`** entry rules and static **`301`** legacy rules; document order in **`docs/url-migration-policy.md`**.
5. **External references**
   - No code change: optional checklist for **Brevo**, **ads**, and **third-party** bios if they still point at old URLs (marketing uses location-specific URLs going forward).

---

## 8. Documentation updates (completeness checklist)

Mark each when done:

| Doc | What to change |
|-----|----------------|
| **`docs/url-migration-policy.md`** | New canonical patterns, redirect list, sitemap rules for duplicates, any Worker notes. |
| **`docs/phase-4-routing-reopen.md`** | Replace Option 1 recommendation for global English with **location-scoped** model; update global page examples. |
| **`docs/ia-language-destination-options.md`** | Remove “shared `/en/about-andetag/`” style wording; describe nested **`/en/stockholm/...`** and **`/en/berlin/...`** story paths. |
| **`docs/Andetag SEO Manual.md`** | Examples for hreflang, canonical, **`x-default`**, sitemap, and section 12 global page list URLs. |
| **`docs/url-matrix.csv`** | All affected rows; **`docs/phase-4-route-coverage.md`** shell mapping. |
| **`docs/content-model.md`** | Header variant table: drop or redefine **`chrome-hdr-en-stockholm-brand`**; note **`seoCanonicalPath`** if it becomes part of the contract. |
| **`docs/phase-6-todo.md`** / **`docs/phase-6-verification-record.md`** | New wave or slice for this migration; sign-off scope. |
| **`docs/phase-7-todo.md`** | Sitemap generation tasks referencing **canonical-only** URLs. |
| **`docs/phase-1-analysis-schema.md`** / **`docs/phase-3-fixture-strategy.md`** | Only if **`en-brand`** or header ids change in a way that affects inventories or fixtures. |
| **`CHANGELOG.md`** | User-visible routing and SEO impact. |
| **`docs/grand-plan.md`** | Entry routing or URL expansion schedule if this migration shifts phase boundaries. |
| **`docs/phase-4-todo.md`** | Reopen or add exit checks if Phase 4 verification must be re-run for routing. |
| **`docs/kpi-measurement-map.md`** | If GTM or analytics use **path-based** triggers, update dimensions or filters for new URLs. |
| **`AGENTS.md`** | If new normative rules belong in the guide (optional; this plan doc remains the execution checklist). |

---

## 8b. Analytics and third-party (optional but recommended)

1. Review **`docs/kpi-measurement-map.md`** and live GTM containers for **URL path** conditions that assume **`/en/music/`** or other legacy paths.
2. Update **internal dashboards** or **UTM playbooks** so campaign docs reference **location-prefixed** landing URLs only.

---

## 9. Suggested rollout order

1. Reconcile **`docs/url-matrix.csv`** with **`site-html/sitemap.xml`** and **Redirect scope**; drop or fix never-live rows.
2. Implement **`seoCanonicalPath`**, registry, **`hreflang`**, **`x-default`**, meta, **`[...slug]`** body maps, chrome resolver, **`_redirects`**, and **en-brand** removal for **all four** topics in one delivery.
3. Run **`npm test`** and **`npm run build`**; extend redirect tests only for **real** legacy URLs.
4. Update all listed documentation; execute **`docs/phase-4-redirect-tests.md`** for new rules.
5. Stakeholder QA: Stockholm vs Berlin chrome on the same body, language switcher, destination switcher, sample legacy URLs that **were** published.

---

## 10. Completeness self-audit

| Area | Covered in this plan |
|------|----------------------|
| Routing (`page-shell-meta`, registry, `[...slug]`, page-body registry) | Yes |
| SEO canonical vs URL bar path | Yes (explicit implementation gap called out) |
| hreflang and x-default | Yes |
| Header or menu removal of English global variant | Yes |
| **`chrome-navigation-resolve`** topic slots | Yes |
| Internal links (chrome, bodies, content) | Yes |
| **`_redirects`**, matrix, redirect tests, Worker safety | Yes (original sitemap only) |
| Documentation list | Yes |
| Tests | Yes |
| Single source of truth (one body, two routes) | Yes |
| Sitemap or GSC follow-up | Yes |
| Cookies or entry policy side effects | Yes (spot check) |
| Analytics or GTM path rules | Yes (section 8b) |
| **`spider.py` / `site-html/`** | If new pages need scraped titles: crawl or manual meta; not automatic in Astro-only work |
| **Privacy (four shells)** | Yes (section 2) |
| **Single-hop legacy redirects** | Yes (**Locked decisions**) |

**Residual risk (post-ship):** monitor **Search Console** for Berlin English story URLs vs Stockholm canonicals (**Locked decisions**). **Privacy:** if Berlin legal copy is still duplicated from another shell, log in **`docs/migration-exceptions.md`** until market-specific text is approved.
