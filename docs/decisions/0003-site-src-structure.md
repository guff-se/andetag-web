# ADR 0003: `site/src/` structure and naming (chrome, page-bodies, ui-logic)

Status: Accepted  
Date: 2026-03-24  
Deciders: ANDETAG web repository maintainer (agent-operated)  
Related docs:

- `docs/site-structure-refactor-plan.md`
- `docs/phase-structure-todo.md`
- `AGENTS.md`

## Context

`site/src/` overloaded the words **layout**, **pages**, and **components** across Astro framework folders, chrome UI, route bodies, and TypeScript helpers. The same vocabulary pointed at different layers, which raises cognitive load and error rates for maintainers (including AI agents). Tooling lived under **`site/scripts/`** while browser-oriented TypeScript lived under a different folder under **`site/src/`**, both often called “scripts,” which caused recurring confusion.

## Decision

Execute the phased renames in `docs/site-structure-refactor-plan.md` with these **locked** target names (see refactor plan for rationale):

| Role | Path under `site/src/` |
|------|-------------------------|
| Chrome partials (header, footer, logo) | `components/chrome/` |
| Chrome and document model (navigation, hero, footer, SEO, types, fixtures) | `lib/chrome/` |
| Per-route **body** Astro components | `components/page-bodies/` |
| Body path registry and body-adjacent TS (FAQ modules, `page-body-registry.ts`) | `lib/page-registry/` |
| TypeScript-only UI helpers (not `*.astro` mirrors) | `lib/ui-logic/` |
| Client-bundled behavior modules (accordion, hero parallax) | `client-scripts/` |

**Keep unchanged (this pass):**

- `layouts/SiteLayout.astro` and `src/layouts/` (Astro convention).
- `lib/routes/` (name is already clear; avoid optional rename churn).
- `components/content/` (means reusable **sections/blocks**, not route bodies; optional future rename to `sections/` is out of scope).
- `lib/content/` for shared TS copy and aggregates (not Astro Content Collections `src/content/`; intentional).

**Defer to a later slice (not part of folder renames):**

- Renaming ~50 `*Sv.astro` / `*En.astro` files for slug symmetry.
- `tsconfig` path aliases (`@chrome`, etc.): only after physical paths stabilize, and only if import noise justifies it; verify Vitest and Astro resolution before bulk adoption.
- New barrel files for page bodies: avoid; tree-shaking and explicit imports stay the default.

**Rule:** No new barrel exports for page bodies without a bundle-size check and an explicit ADR or plan update.

## Options considered

### Option A: Feature folders across `site/src/`

- Pros: Scales if the app grows into many vertical features.
- Cons: High churn for a migration codebase; registries and `[...slug].astro` already centralize routing.

### Option B: Name the registry folder **`page-bodies`** under **`lib/`** (mirror Astro)

- Pros: Symmetric naming with `components/page-bodies/`.
- Cons: Two trees named **page-bodies** invite wrong imports from agents and humans; **`lib/page-registry/`** keeps TS registry + body-adjacent modules (`page-body-registry.ts`, FAQ TS) under one unambiguous label.

### Option C: `shell` instead of `chrome` for header/footer folders

- Pros: Neutral product language.
- Cons: Diverges from existing **`chrome-hdr-*`** / **`chrome-ftr-*`** variant ids already in production types and docs.

### Option D: `site/src/browser/` instead of `client-scripts`

- Pros: Short.
- Cons: Easy to confuse with **browser** APIs or test **browser** mocks; **`client-scripts`** states intent (bundled client modules).

## Consequences

### Positive

- One clear term for header/footer data + UI: **chrome**.
- **`pages/`** reads as Astro **routes** only; bodies live under **`page-bodies`**; registry under **`page-registry`**.
- **`lib/ui-logic`** breaks the false parallel with **`components/*.astro`**.

### Negative

- Large import and documentation churn in one side phase.
- Agents must run **stale-path checks** (see refactor plan) after each slice; build alone may not catch string-based paths.

### Operational notes

- **No user input:** The executing agent completes S0–S8 per the refactor plan without waiting on review or optional decisions. **S7** (aliases, `lib/routes` rename) is **skipped** in the default run.
- Record baseline with **`git rev-parse HEAD`** in `docs/phase-structure-todo.md` before S1; run **`cd site && npm test && npm run build`** after each phase or once after batched S1–S6 if the tree stays consistent.
- Update `AGENTS.md`, `CHANGELOG.md` (per plan §6: historical bullets untouched + note + **Unreleased** summary), and `docs/` path references in the same change set as code moves.
- **Commits:** optional one rename per commit for bisect; a **single-session** single commit or PR is acceptable if tests and build pass at the end.

## SEO and migration impact

- **URL impact:** none (file moves only).
- **hreflang/canonical impact:** none.
- **Redirect impact:** none.

## Follow-up actions

- [x] Execute phases S1–S8 per `docs/phase-structure-todo.md`.
- [x] Mark `docs/site-structure-refactor-plan.md` **complete** with date and link to this ADR.
- [ ] Optional: add `npm run` script for stale-path detection if manual search proves error-prone.
