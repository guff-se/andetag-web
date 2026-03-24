# Site structure and naming refactor (side phase)

Purpose: record the **current** Astro workspace layout, name collisions, and a **target** structure aligned with common Astro and TypeScript practice, plus an execution sequence and **documentation sweep** so the repo stays coherent.

Status: **ready for execution** (decisions locked). Track slices in **`docs/phase-structure-todo.md`**. Normative names live in **`docs/decisions/0003-site-src-structure.md`**. When S1–S8 are done, set status here to **complete** with completion date.

**Agent execution (no user input):** The maintainer agent runs **S0 through S8** to completion without waiting on stakeholder review, browser spot-checks, or scheduling. Decisions are in ADR 0003; **CHANGELOG policy** and **S7 scope** below are fixed so nothing is left for the product owner to decide mid-run.

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

## 2. Current state (inventory)

### 2.1 High-level tree (`site/src/`)

| Area | Role today |
|------|------------|
| `pages/` | File-based routes: `index.astro`, `[...slug].astro`, `404.astro`, preview routes. |
| `layouts/` | Document-level wrapper: `SiteLayout.astro` (imports global CSS, head, chrome slots). |
| `components/layout/` | **Chrome UI**: `SiteHeader.astro`, `SiteFooter.astro`, `AndetagHeaderLogo.astro`. |
| `components/content/` | Reusable page sections: `HeroSection`, `ContentSection`, `AccordionSection`, etc. |
| `components/embeds/` | Third-party or heavy embeds: booking, maps, video, waitlist. |
| `components/ui/` | Small primitives: `BrandWordmark`, `StyledLink`. |
| `components/pages/` | **Per-route body** Astro components (PascalCase, often `*Sv.astro` / `*En.astro`). ~50 files; central map in `[...slug].astro`. |
| `lib/layout/` | **Chrome and document model data**: `navigation.ts`, `hero-*.ts`, `footer-*.ts`, `page-layout.ts`, `seo.ts`, `types.ts`, `variants.ts`, `assets.ts`, `fixtures.ts`, plus co-located `*.test.ts`. |
| `lib/routes/` | **Routing registry and URL logic**: `page-shell-registry.ts`, `chrome-navigation-resolve.ts`, `url-matrix-parity.test.ts`, etc. |
| `lib/pages/` | **Body gating**: `page-body-registry.ts` (`PAGE_CUSTOM_BODY_PATHS`) and `stockholm-marketing-faq-*.ts`; tests co-located. |
| `lib/content/` | Shared copy or aggregates (for example `stockholm-testimonial-aggregate.ts`). |
| `lib/components/` | **TypeScript-only helpers** used by Astro components (not mirrored as `components/*`): booking contact HTML, carousel logic, understory, presentation. |
| `lib/fonts/` | `sources.json` for `npm run fonts:sync`. |
| `data/` | `page-shell-meta.json` (generated; script in `site/scripts/`). |
| `styles/` | Global `layout.css`, `components.css`, `fonts.css`. |
| `scripts/` | **Client-side** modules imported from components (accordion behavior, hero parallax). |

### 2.2 Scripts outside `src/` (`site/`)

| Path | Role |
|------|------|
| `site/scripts/*.mjs`, `*.sh` | **Node / shell build utilities** (meta extraction, font sync, encoding). |

This **splits “scripts”** between `site/scripts/` (tooling) and `site/src/scripts/` (browser-oriented TS). The names are identical, which is a common source of confusion.

### 2.3 Tests

All **15** Vitest files live **next to implementation** under `site/src/lib/**`. There is **no** top-level `tests/` folder in the web workspace today (differs from `AGENTS.md`’s generic parser example).

### 2.4 Naming patterns in `components/pages/`

- **Language suffix**: `DejtSv.astro` / `DejtEn.astro` (consistent suffix).
- **Slug vs English naming mix**: for example `OptiskFibertextilSv.astro` vs `OpticalFibreTextileEn.astro` (same URL pair, different component base names).
- **Shared templates**: `StockholmSeoLandingSv.astro` / `StockholmSeoLandingEn.astro` wrapped by thin route-specific files (good pattern; folder naming does not yet reflect it).
- **Large central import list**: `[...slug].astro` imports every body component explicitly (clear for static analysis, heavy to maintain; optional future refactor to a generated map or barrel with care for tree-shaking).

---

## 3. Problem statement

### 3.1 Three different “layout” concepts

1. **`layouts/`**: Astro “layout” (HTML document template).
2. **`components/layout/`**: site chrome (header/footer).
3. **`lib/layout/`**: data and functions that **feed** that chrome and SEO.

The same word points to **framework**, **UI**, and **domain model**, which does not scale as the team grows.

### 3.2 Three different “pages” concepts

1. **`pages/`**: URLs and `getStaticPaths`.
2. **`components/pages/`**: main column content for a shell.
3. **`lib/pages/`**: which paths use custom bodies and ancillary TS content.

Again, one word, three meanings.

### 3.3 `lib/components/` vs `src/components/`

Both are “components” in the English sense; only the latter are Astro files. New contributors assume symmetry that does not exist.

### 3.4 Dual `scripts/` directories

`site/scripts` vs `site/src/scripts` requires explanation every time.

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

## 5. Target structure (locked)

The following preserves Astro defaults and **renames only where ambiguity hurts**. **Authoritative detail:** `docs/decisions/0003-site-src-structure.md`.

### 5.1 Rename map (final)

| Current | Target | Rationale |
|---------|--------|-----------|
| `components/layout/` | `components/chrome/` | Avoid clash with `layouts/` and `lib/layout`. Matches variant ids (`chrome-hdr-*`, `chrome-ftr-*`). |
| `lib/layout/` | `lib/chrome/` | Single concept: data + types for chrome and SEO helpers. |
| `components/pages/` | `components/page-bodies/` | Not Astro routes; name reflects body-slot content. |
| `lib/pages/` | `lib/page-registry/` | Registry + body-adjacent TS (`page-body-registry.ts`, FAQ modules). Avoids a second folder literally named `page-bodies` under `lib/` (reduces wrong-import risk for agents and humans). |
| `lib/routes/` | **keep** | Already clear; optional `lib/routing/` rename dropped to limit churn. |
| `lib/components/` | `lib/ui-logic/` | Breaks the false parallel with `components/*.astro`. |
| `site/src/scripts/` | `site/src/client-scripts/` | Distinguish from `site/scripts/` (Node tooling). |

**Intentionally unchanged this pass:** `components/content/` (section-level blocks; not route bodies). Optional later rename to `components/sections/` is out of scope unless a new ADR opens it.

**`layouts/SiteLayout.astro`**: keep path and name (Astro convention).

**`styles/`**: keep; optionally add `styles/chrome.css` split later (out of scope unless needed).

### 5.2 Import path churn

A full rename of `lib/layout` → `lib/chrome` touches **many** files (every consumer of `createPageLayoutModel`, types, SEO). **Intermediate commits:** optional (one per phase helps bisect); **not required** for human gates. For a **single-session run**, you may apply S1–S6 in one working tree and run **`npm test && npm run build` once** after all moves and import fixes, as long as the tree never references both old and new paths at once. Prefer fixing imports immediately after each `git mv` so the workspace is never left broken between saves.

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

## 6. Execution plan (phased)

**When:** The executing agent chooses a moment when the working tree is clean enough to avoid merge collisions (rebase or sync first if other work landed). No need to wait for explicit stakeholder scheduling.

Order minimizes circular dependencies and keeps tests green. **Checklist:** `docs/phase-structure-todo.md`.

**CHANGELOG (fixed policy, no user choice):** Do **not** rewrite historical `CHANGELOG.md` entries. Leave older bullets mentioning legacy paths as-is. Add a single short note under **`[Unreleased]`** (or immediately below the version heading) stating that entries dated **before** the refactor completion date may reference pre-rename paths. Update **`[Unreleased]`** with the maintainer-facing path summary when the refactor completes.

### 6.1 Stale path detection (mandatory)

From the **repo root** (`web/`), after **every** phase: `cd site && npm test && npm run build`, then run **at least** the ripgrep lines relevant to completed work. Goal: no stale **import paths** or **doc paths** pointing at removed directories.

**Per-phase (quick):** search for the **old** path segment you just renamed under `site/src/`:

| After phase | Example `rg` (adjust if your shell needs path quoting) |
|-------------|----------------------------------------------------------|
| S1 | `rg 'components/layout' site/src docs AGENTS.md` |
| S2 | `rg 'lib/layout' site/src docs AGENTS.md` |
| S3 | `rg 'components/pages' site/src docs AGENTS.md` |
| S4 | `rg 'lib/pages' site/src docs AGENTS.md` — review hits: exclude `page-bodies` false positives if any |
| S5 | `rg 'lib/components' site/src docs AGENTS.md` — review hits: must not reference old `lib/components/` package path (allow English prose “components” only if unrelated) |
| S6 | `rg 'src/scripts' site/src docs AGENTS.md` — allow `site/scripts` (tooling); disallow client imports still pointing at `site/src/scripts/` |

**Final sweep (after S6 or at S8):** combine patterns; **zero** matches in `site/src`, `docs/`, and `AGENTS.md`. **Do not** require `CHANGELOG.md` to be free of legacy path strings: keep historical bullets verbatim and follow the **CHANGELOG** rule in the §6 intro.

```bash
rg 'components/layout|lib/layout|components/pages|lib/pages|site/src/lib/components/|site/src/scripts/' site/src docs AGENTS.md
```

Also search relative imports that omit the `site/` prefix (for example `from '../lib/layout'`) by running the same patterns against **`site/src` only**, or use `rg 'lib/layout' site/src` after S2 and confirm hits are only in comments or new `lib/chrome` paths (should be none). The obsolete TS tree is the directory **`site/src/lib/components/`**.

**AI maintainer note:** build and Vitest do not catch every **string** or **comment** reference; the grep pass is part of the definition of done for each slice.

### Phase S0: Guardrails (pre-S1)

1. **ADR:** `docs/decisions/0003-site-src-structure.md` (**Accepted**).
2. From repo root, run `git rev-parse HEAD` and record the full hash in `docs/phase-structure-todo.md` under **Baseline**.
3. Run `cd site && npm test && npm run build` (must be green before renames).

### Phase S1: Rename `components/layout` → `components/chrome`

1. `git mv` the folder.
2. Update imports in `SiteLayout.astro`, any page bodies, and tests if any reference paths in strings.
3. `npm test && npm run build`.

### Phase S2: Rename `lib/layout` → `lib/chrome`

1. `git mv` the folder.
2. Bulk update relative imports across `site/src` (and any string paths in docs that embed full paths).
3. `npm test && npm run build`.

### Phase S3: Rename `components/pages` → `components/page-bodies`

1. `git mv` the folder.
2. Update `[...slug].astro` imports and any cross-imports between bodies.
3. `npm test && npm run build`.

### Phase S4: Rename `lib/pages` → `lib/page-registry`

1. `git mv` and update imports from `[...slug].astro`, tests, and content imports.
2. **Separation:** `components/page-bodies/` = Astro bodies; `lib/page-registry/` = TS registry and body-adjacent modules only.

### Phase S5: Rename `lib/components` → `lib/ui-logic`

1. `git mv` and update all imports.
2. `npm test && npm run build`.

### Phase S6: Rename `site/src/scripts` → `site/src/client-scripts`

1. `git mv` the folder.
2. Update imports in Astro components that reference those files.
3. Document the distinction next to `site/scripts/` in AGENTS and this plan.
4. `npm test && npm run build`.

### Phase S7: Skipped in default execution (no user decision)

**Do not** rename `lib/routes/` or add `tsconfig` path aliases during this refactor run. Those stay deferred per ADR 0003 until a separate ADR or task reopens them. Mark S7 **N/A** in `docs/phase-structure-todo.md` when closing.

### Phase S8: CI and verification (automated only)

1. Confirm `.github/workflows/ci.yml` needs no path changes (it uses `working-directory: site`).
2. From `site/`: `npm test` and `npm run build` (required).
3. Run **§6.1** final combined `rg` on `site/src`, `docs/`, `AGENTS.md` (exclude `CHANGELOG.md` from the zero-match requirement).
4. **Route and registry correctness:** rely on existing Vitest (for example `page-body-registry.test.ts`, `url-matrix-parity` and related). No manual browser pass is required to call the refactor complete.
5. **Docs links:** if the repo defines a markdown link command (for example in `package.json` or CI), run it; if not, **§6.1** `rg` plus updated paths in edited files is sufficient without asking a human.

---

## 7. Documentation update checklist (comprehensive)

Update paths and prose in **the same PR series** as code moves. Use ripgrep to find stale strings after each rename.

### 7.1 Core agent and changelog

| File | What to update |
|------|----------------|
| `AGENTS.md` | **Code Layout** section (`site/` tree): new folder names; **Documentation Overview** table: rows for this plan, **`docs/phase-structure-todo.md`**, and ADR 0003; fix `tests/` wording if still implying a root `tests/` for the Astro app. |
| `CHANGELOG.md` | Under **Unreleased**: maintainer-facing path summary. Add the **historical paths** note per §6 (do not rewrite old bullets). |

### 7.2 Content and architecture contracts

| File | What to update |
|------|----------------|
| `docs/content-model.md` | Paths pointing at chrome SEO modules (today `lib/layout/seo.ts`; after refactor `lib/chrome/seo.ts`), `page-shell-registry`, types, chrome variant ids. |
| `docs/parser-plan.md` | Only if it references Astro paths (usually unchanged). |

### 7.3 Phase and verification docs (path references are dense)

Search for `site/src/lib/layout`, `site/src/lib/pages`, `site/src/lib/components`, `components/pages`, `components/layout`, `site/src/scripts/` (client), and post-refactor equivalents if any doc is updated mid-flight:

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
| `docs/decisions/README.md` | Index the new ADR if you add one. |

### 7.5 In-repo comments

- File-level comments in `[...slug].astro` and registry modules that mention old paths.
- Any `README` under `site/` if one is added or exists.

### 7.6 Verification command references

Any doc that says “run tests in `site/src/lib/layout`” should be generalized to “run `npm test` in `site/`” or updated to the new paths.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Missed import after `git mv` | `npm run build` and Vitest; **§6.1** `rg` pass after each phase (imports, comments, docs). |
| Missed **dynamic** or string-based paths | Search for old path fragments in `site/src` and `docs/`; watch `import.meta.glob` and similar if introduced later. |
| Doc link checker false positives | Lychee scans `docs/`; update markdown paths in the same change set. |
| Merge conflicts | Before starting, sync the default branch and ensure a clean tree; if another actor is editing `site/src`, pause until merged or rebased. No stakeholder “quiet window” is required. |
| Aliases break tooling | Defer aliases by default (ADR 0003); if added, confirm Vitest, Astro, and editor resolution; one smoke import first. |
| Barrel files hurt tree-shaking | Do not add barrels for page bodies in this pass; keep explicit imports unless a later ADR approves bundle analysis. |
| Wrong body wired to route (logic bug) | Build may still pass; rely on **`page-body-registry` tests**, URL matrix parity tests, and any registry coverage in Vitest. No manual URL spot-check is required for sign-off. |
| **AI session boundaries** | New chats may assume old paths; keep **ADR 0003**, this plan, and **AGENTS.md** updated **in the same PR** as each slice so repo state is self-describing. |
| **Partial refactors** | If a session stops mid-run, resume from the first unchecked item in `docs/phase-structure-todo.md`; do not ask the user how to continue. |
| **CHANGELOG edits** | Never rewrite historical bullets; add the **historical paths** note per §6 and the new **Unreleased** path summary only. |
| **`rg` false positives** | `lib/pages` may match prose; review hits. Prefer path-shaped patterns (`site/src/lib/pages/`) where possible. |

---

## 9. Success criteria

1. **No remaining** `components/layout` or `lib/layout` used for chrome in live code or current docs (Astro `layouts/` for `SiteLayout.astro` remains).
2. **`pages/`** in conversation means **routes**; **page bodies** live under an unambiguous folder name.
3. **`npm test` and `npm run build`** pass on `site/`.
4. **Grep** for old path prefixes across `docs/` and `AGENTS.md` returns **zero** stale references. **`CHANGELOG.md`** may still contain legacy path strings inside dated history; the **historical paths** note under **`[Unreleased]`** must be present after closure (see §6).
5. This document’s **status** updated to **complete** with completion date and link to **ADR 0003**.

---

## 10. Deferred follow-ups (not blocking execution)

1. **Body component file names:** slug-symmetric naming or folder-per-route conventions (~50 files); separate slice after folder renames land (see §5.4).
2. **`tsconfig` path aliases:** optional after S6; see ADR 0003 and §4.5.
3. **Rename `components/content/` → `components/sections/`:** optional clarity pass; not required for chrome or page-body disambiguation.
4. **Generated `page-body-imports.ts`:** optional replacement for the large static import map in `[...slug].astro` (§5.3); measure bundle impact first.

---

*Last updated: 2026-03-24 (agent-only execution policy, S7 default skip, CHANGELOG rule in §6; ADR 0003; checklist: `docs/phase-structure-todo.md`).*
