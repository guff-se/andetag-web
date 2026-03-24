# Site structure and naming refactor (side phase)

Purpose: record how `site/src/` is organized after disambiguating overloaded words (**layout**, **pages**, **components**), plus the execution sequence and **documentation sweep** that keeps the repo coherent.

Status: **complete** (2026-03-24). Checklist: **`docs/phase-structure-todo.md`**. Normative names: **`docs/decisions/0003-site-src-structure.md`**.

**Agent execution (historical note):** The maintainer agent ran **S0 through S8** without stakeholder scheduling. **CHANGELOG policy** and **S7 skip** were fixed in §6 below so nothing blocked mid-run.

**Locked names (summary):** `components/chrome`, `lib/chrome`, `components/page-bodies`, `lib/page-registry`, `lib/ui-logic`, `site/src/client-scripts`. See ADR 0003 for rationale and deferred items.

Scope: primarily `site/src/` and references across `docs/`, `CHANGELOG.md`, and `AGENTS.md`. Out of scope unless explicitly added: parser (`spider.py`), `site-html/`, Cloudflare Worker behavior beyond path references in docs.

---

## 1. Goals

1. **Disambiguate** overloaded words (**layout**, **pages**, **components**) so new contributors know where code belongs.
2. **Reduce cognitive load** when tracing a feature (routing → shell → body → shared UI).
3. **Keep Astro conventions** (`src/pages/`, `src/layouts/`) intact where they match the framework.
4. **Preserve regression safety**: existing Vitest tests and `npm run build` stay green after each migration slice.
5. **Update documentation in the same effort** so paths in specs, verification records, and AGENTS stay truthful.

Non-goals for an initial pass:

- Rewriting all page body markup or changing URL contracts.
- Moving to a feature-folder architecture across the entire repo (optional future evolution).

---

## 2. Current structure (`site/src/`)

### 2.1 High-level tree

| Area | Role |
|------|------|
| `pages/` | File-based routes: `index.astro`, `[...slug].astro`, `404.astro`, preview routes. |
| `layouts/` | Document-level wrapper: `SiteLayout.astro` (imports global CSS, head, chrome slots). |
| `components/chrome/` | **Chrome UI**: `SiteHeader.astro`, `SiteFooter.astro`, `AndetagHeaderLogo.astro`. |
| `components/content/` | Reusable page sections: `HeroSection`, `ContentSection`, `AccordionSection`, etc. |
| `components/embeds/` | Third-party or heavy embeds: booking, maps, video, waitlist. |
| `components/ui/` | Small primitives: `BrandWordmark`, `StyledLink`. |
| `components/page-bodies/` | **Per-route body** Astro components (PascalCase, often `*Sv.astro` / `*En.astro`). Central map in `[...slug].astro`. |
| `lib/chrome/` | **Chrome and document model data**: `navigation.ts`, `hero-*.ts`, `footer-*.ts`, `page-layout.ts`, `seo.ts`, `types.ts`, `variants.ts`, `assets.ts`, `fixtures.ts`, plus co-located `*.test.ts`. |
| `lib/routes/` | **Routing registry and URL logic**: `page-shell-registry.ts`, `chrome-navigation-resolve.ts`, `url-matrix-parity.test.ts`, etc. |
| `lib/page-registry/` | **Body gating**: `page-body-registry.ts` (`PAGE_CUSTOM_BODY_PATHS`) and `stockholm-marketing-faq-*.ts`; tests co-located. |
| `lib/content/` | Shared copy or aggregates (for example `stockholm-testimonial-aggregate.ts`). |
| `lib/ui-logic/` | **TypeScript-only helpers** used by Astro components (booking contact HTML, carousel logic, understory, presentation). |
| `lib/fonts/` | `sources.json` for `npm run fonts:sync`. |
| `data/` | `page-shell-meta.json` (generated; script in `site/scripts/`). |
| `styles/` | Global `layout.css`, `components.css`, `fonts.css`. |
| `client-scripts/` | **Client-side** modules imported from components (accordion behavior, hero parallax). |

### 2.2 Scripts outside `src/` (`site/`)

| Path | Role |
|------|------|
| `site/scripts/*.mjs`, `*.sh` | **Node / shell build utilities** (meta extraction, font sync, encoding). |

**Naming:** **`site/scripts/`** is build tooling; **`site/src/client-scripts/`** holds browser-bundled TypeScript. They are no longer easy to confuse.

### 2.3 Tests

All **15** Vitest files live **next to implementation** under `site/src/lib/**`. There is **no** top-level `tests/` folder in the web workspace today (differs from `AGENTS.md`’s generic parser example).

### 2.4 Naming patterns in `components/page-bodies/`

- **Language suffix**: `DejtSv.astro` / `DejtEn.astro` (consistent suffix).
- **Slug vs English naming mix**: for example `OptiskFibertextilSv.astro` vs `OpticalFibreTextileEn.astro` (same URL pair, different component base names).
- **Shared templates**: `StockholmSeoLandingSv.astro` / `StockholmSeoLandingEn.astro` wrapped by thin route-specific files (good pattern).
- **Large central import list**: `[...slug].astro` imports every body component explicitly (clear for static analysis, heavy to maintain; optional future refactor to a generated map or barrel with care for tree-shaking).

---

## 3. Problem statement (historical; resolved by this refactor)

### 3.1 Three different “layout” concepts (before)

The same word **layout** pointed at the Astro document template (`layouts/`), at header or footer partials under **`components/`**, and at chrome model TypeScript under **`lib/`**. That overload is why chrome UI and chrome data now live under explicit **`chrome`** folder names.

### 3.2 Three different “pages” concepts (before)

**`pages/`** meant routes, while main-column Astro lived in another folder, and the path registry lived under **`lib/`** with a misleading name. Bodies and registry are now **`page-bodies`** and **`page-registry`**.

### 3.3 TS “components” vs Astro components (before)

TypeScript helpers lived under a **`lib/`** subtree whose name suggested a mirror of **`components/*.astro`**. That tree is now **`lib/ui-logic/`**.

### 3.4 Dual “scripts” directories (before)

**`site/scripts/`** (tooling) and a client folder under **`site/src/`** both invited the label “scripts.” The client folder is now **`client-scripts/`**.

---

## 4. Best practices and reference models

These are **common patterns** in Astro and TS codebases (not mandatory standards). Use them as design pressure, not dogma.

### 4.1 Astro project structure

- Official docs encourage `src/pages/` for routes and `src/layouts/` for reusable page wrappers. Keeping those names preserves tutorial and ecosystem alignment.
- UI pieces are usually under `src/components/` with subfolders by **kind** (ui, sections, blocks) or by **feature** (rare for small sites).
- Astro starters sometimes use `src/content/` for [content collections](https://docs.astro.build/en/guides/content-collections/). This project keeps shared marketing copy and aggregates in **`lib/content/`** by choice; do not relocate it to `src/content/` without an explicit ADR.

### 4.2 Separate “route” from “page body”

In this project, **routes are data-driven** (`[...slug].astro` + registry). Bodies are not children of `pages/`; they are **injected components**. Naming folders **`page-bodies`**, **`bodies`**, or **`views`** signals that distinction.

### 4.3 Name domain layers after what they contain

- **Chrome / shell**: words used in browser devtools and design docs for “around the main content.”
- **Routing / navigation resolution**: `routes`, `routing`, or `url` (already partially used in `lib/routes/`).

### 4.4 Colocated tests

Co-located `*.test.ts` next to `*.ts` is idiomatic for Vitest and should **stay** unless you adopt a policy change.

### 4.5 Optional: path aliases

**Default:** none in the first execution pass (ADR 0003). If deep imports become noisy **after** S1–S6 stabilize, add TypeScript path aliases in `site/tsconfig.json` (for example `@chrome/*`). Astro 5 supports this pattern; verify Vitest and any IDE tooling. Add one smoke import before bulk adoption.

---

## 5. Target structure (locked, applied)

**Authoritative detail:** `docs/decisions/0003-site-src-structure.md`.

### 5.1 Final folder roles

| Path | Rationale |
|------|-----------|
| `components/chrome/` | Avoid clash with `layouts/` and `lib/chrome`. Matches variant ids (`chrome-hdr-*`, `chrome-ftr-*`). |
| `lib/chrome/` | Single concept: data + types for chrome and SEO helpers. |
| `components/page-bodies/` | Not Astro routes; name reflects body-slot content. |
| `lib/page-registry/` | Registry + body-adjacent TS (`page-body-registry.ts`, FAQ modules). Avoids a second folder literally named `page-bodies` under `lib/`. |
| `lib/routes/` | **keep** (already clear). |
| `lib/ui-logic/` | Breaks the false parallel with `components/*.astro`. |
| `site/src/client-scripts/` | Distinguish from `site/scripts/` (Node tooling). |

**Intentionally unchanged this pass:** `components/content/` (section-level blocks; not route bodies). Optional later rename to `components/sections/` is out of scope unless a new ADR opens it.

**`layouts/SiteLayout.astro`**: keep path and name (Astro convention).

**`styles/`**: keep; optionally add `styles/chrome.css` split later (out of scope unless needed).

### 5.2 Import path churn

Renaming **`lib/chrome`** consumers touched many files (`createPageLayoutModel`, types, SEO). **Intermediate commits** were optional. A **single-session** batch was allowed if **`npm test && npm run build`** passed once at the end and imports were fixed immediately after each **`git mv`**.

### 5.3 Optional later improvement: body registry as data

Not required for folder rename: replace the giant `pageBodies` map in `[...slug].astro` with:

- a generated `page-body-imports.ts`, or
- explicit lazy dynamic import pattern (measure bundle impact),

only if maintenance pain justifies the tooling cost.

### 5.4 Optional later improvement: component file naming convention

Document a single rule, for example:

- `PageBody` + `StockholmHome` + `Sv` → `PageBodyStockholmHomeSv.astro`, or
- kebab-case folder per canonical slug segment under `page-bodies/stockholm/home/Sv.astro`.

Pick **one** convention in this phase’s decision log; renaming ~50 files is a separate slice from folder moves.

---

## 6. Execution plan (phased, completed)

**CHANGELOG (fixed policy):** Do **not** rewrite historical `CHANGELOG.md` entries. Older bullets may still mention paths from before **2026-03-24**. **`[Unreleased]`** carries a maintainer-facing path summary and a short **historical paths** note.

### 6.1 Verification (closure)

From the **repo root** (`web/`): `cd site && npm test && npm run build`.

**Docs and agent guide:** `docs/` and **`AGENTS.md`** must describe only the **post-refactor** paths in ADR 0003. **`CHANGELOG.md`** may retain legacy path strings inside dated history only.

**AI maintainer note:** build and Vitest do not catch every **string** or **comment** reference; search the tree when you touch imports or docs.

### Phase S0: Guardrails (pre-S1)

1. **ADR:** `docs/decisions/0003-site-src-structure.md` (**Accepted**).
2. From repo root, run `git rev-parse HEAD` and record the full hash in `docs/phase-structure-todo.md` under **Baseline**.
3. Run `cd site && npm test && npm run build` (must be green before renames).

### Phase S1: Chrome partials folder

1. `git mv` the folder under **`components/`** to **`chrome`**.
2. Update imports in `SiteLayout.astro`, page bodies, and tests if any reference paths in strings.
3. `npm test && npm run build`.

### Phase S2: Chrome model TS folder

1. `git mv` the chrome data folder under **`lib/`** to **`chrome`**.
2. Bulk update relative imports across `site/src` and path strings in docs.
3. `npm test && npm run build`.

### Phase S3: Page body Astro folder

1. `git mv` the body folder under **`components/`** to **`page-bodies`**.
2. Update `[...slug].astro` imports and any cross-imports between bodies.
3. `npm test && npm run build`.

### Phase S4: Page registry TS folder

1. `git mv` the registry folder under **`lib/`** to **`page-registry`** and update imports from `[...slug].astro`, tests, and content imports.
2. **Separation:** `components/page-bodies/` = Astro bodies; `lib/page-registry/` = TS registry and body-adjacent modules only.

### Phase S5: UI logic TS folder

1. `git mv` the TS helper folder under **`lib/`** to **`ui-logic`** and update all imports.
2. `npm test && npm run build`.

### Phase S6: Client scripts folder

1. `git mv` the client TS folder under **`site/src/`** to **`client-scripts`**.
2. Update imports in Astro components that reference those files.
3. Document the distinction next to `site/scripts/` in AGENTS and this plan.
4. `npm test && npm run build`.

### Phase S7: Skipped in default execution (no user decision)

**Do not** rename `lib/routes/` or add `tsconfig` path aliases during this refactor run. Those stay deferred per ADR 0003 until a separate ADR or task reopens them.

### Phase S8: CI and verification (automated only)

1. Confirm `.github/workflows/ci.yml` needs no path changes (it uses `working-directory: site`).
2. From `site/`: `npm test` and `npm run build` (required).
3. Run **§6.1** checks; confirm **`docs/`** and **`AGENTS.md`** match ADR 0003 paths.
4. **Route and registry correctness:** rely on existing Vitest (`page-body-registry.test.ts`, `url-matrix-parity`, related). No manual browser pass was required for sign-off.
5. **Docs links:** if the repo defines a markdown link command (for example in `package.json` or CI), run it; otherwise rely on tests, build, and path review.

---

## 7. Documentation update checklist (comprehensive)

Update paths and prose in **the same change set** as code moves.

### 7.1 Core agent and changelog

| File | What to update |
|------|----------------|
| `AGENTS.md` | **Code Layout** section (`site/` tree): folder names; **Documentation Overview** table: this plan, **`docs/phase-structure-todo.md`**, ADR 0003; fix `tests/` wording if still implying a root `tests/` for the Astro app. |
| `CHANGELOG.md` | Under **Unreleased**: maintainer-facing path summary and **historical paths** note (do not rewrite old bullets). |

### 7.2 Content and architecture contracts

| File | What to update |
|------|----------------|
| `docs/content-model.md` | Paths for chrome SEO (`lib/chrome/seo.ts`), `page-shell-registry`, types, chrome variant ids. |
| `docs/parser-plan.md` | Only if it references Astro paths (usually unchanged). |

### 7.3 Phase and verification docs (path references are dense)

When editing phase or verification docs, align paths with **`site/src/`** as in §2 and ADR 0003:

- `docs/phase-2-todo.md`
- `docs/phase-3-todo.md`
- `docs/phase-3-fixture-strategy.md`
- `docs/phase-3-component-usage.md`
- `docs/phase-3-verification-record.md` (if applicable)
- `docs/phase-4-todo.md`
- `docs/phase-4-route-coverage.md`
- `docs/phase-4-verification-record.md`
- `docs/phase-5-todo.md`
- `docs/phase-5-verification-record.md`
- `docs/phase-6-todo.md`
- `docs/phase-6-verification-record.md`
- `docs/phase-7-todo.md` (if present)
- `docs/grand-plan.md` (any pointers to implementation locations)
- `docs/design-extraction-method.md` (fonts path)
- `docs/migration-exceptions.md` (if file paths appear in entries)

### 7.4 Decisions

| File | What to update |
|------|----------------|
| `docs/decisions/README.md` | Index ADR 0003. |

### 7.5 In-repo comments

- File-level comments in `[...slug].astro` and registry modules that mention old paths.
- Any `README` under `site/` if one is added or exists.

### 7.6 Verification command references

Prefer “run **`npm test`** in **`site/`**” over hard-coding deep paths in prose.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Missed import after `git mv` | `npm run build` and Vitest; path review in **`site/src`**. |
| Missed **dynamic** or string-based paths | Search `site/src` when adding glob imports or string-built paths. |
| Doc link checker false positives | Lychee scans `docs/`; update markdown paths in the same change set. |
| Merge conflicts | Sync the default branch before large moves. |
| Aliases break tooling | Defer aliases by default (ADR 0003); if added, confirm Vitest, Astro, and editor resolution. |
| Barrel files hurt tree-shaking | Do not add barrels for page bodies in this pass. |
| Wrong body wired to route (logic bug) | Rely on **`page-body-registry` tests**, URL matrix parity tests, and registry Vitest coverage. |
| **AI session boundaries** | Keep **ADR 0003**, this plan, and **AGENTS.md** current whenever paths change. |
| **CHANGELOG edits** | Never rewrite historical bullets; add the **historical paths** note and **Unreleased** path summary only. |

---

## 9. Success criteria

1. Chrome UI and chrome model use **`components/chrome/`** and **`lib/chrome/`**; Astro **`layouts/`** remains the document template.
2. **`pages/`** means **routes**; **page bodies** live under **`components/page-bodies/`**.
3. **`npm test` and `npm run build`** pass on `site/`.
4. **`docs/`** and **`AGENTS.md`** describe post-refactor paths only (see ADR 0003). **`CHANGELOG.md`** may retain legacy path strings inside dated history; the **historical paths** note under **`[Unreleased]`** is present.
5. This document’s **status** is **complete** with completion date and link to **ADR 0003**.

---

## 10. Deferred follow-ups (not blocking execution)

1. **Body component file names:** slug-symmetric naming or folder-per-route conventions (~50 files); separate slice after folder renames land (see §5.4).
2. **`tsconfig` path aliases:** optional after S6; see ADR 0003 and §4.5.
3. **Rename `components/content/` → `components/sections/`:** optional clarity pass; not required for chrome or page-body disambiguation.
4. **Generated `page-body-imports.ts`:** optional replacement for the large static import map in `[...slug].astro` (§5.3); measure bundle impact first.

---

*Completed: 2026-03-24. ADR: `docs/decisions/0003-site-src-structure.md`. Checklist: `docs/phase-structure-todo.md`.*
