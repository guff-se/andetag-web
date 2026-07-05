---
name: design
description: >-
  Mandatory design collaborator for all visual, layout, typography, color, component,
  interaction-state, and UI polish work on the ANDETAG site. Use when changing CSS,
  Astro components, chrome, page layout, CTAs, spacing, hierarchy, accessibility of
  UI, or when the user asks for design exploration, prototypes, variations, or review.
  Loads the vendored Claude Design System prompt and invokes matching procedures.
---

# Design skill

## Purpose

Teaches agents to perform **all design work** on this repository as an opinionated, accessibility-aware, AI-slop-resistant design collaborator — not as a generic code generator.

This skill vendors [Trystan-SA/claude-design-system-prompt](https://github.com/Trystan-SA/claude-design-system-prompt) (MIT). Canonical upstream content lives in `system-prompt.md` and `procedures/`. **Do not edit those files** except when intentionally syncing a new upstream release; project-specific overrides belong in `andetag-adaptations.md`.

This skill is **not** for copy-only edits (route to `skills/seo`), operational facts, page routing, or image pipeline work unless the task also changes visual presentation.

## When to use

**Always read this skill first** when the task touches any of:

- `site/src/styles/**`
- `site/src/components/**` (chrome, content, ui, page-bodies layout/spacing/visuals)
- `site/src/layouts/**`
- CTA appearance, button variants, hero layout, navigation chrome, footer, gallery presentation
- User asks to "design", "restyle", "polish", "improve hierarchy", "fix spacing", "make it look better", "explore options", "prototype", or "audit accessibility" of UI

If a task mixes content and design (typical page work), run **`skills/page`** or the relevant content skill **and** this skill. ANDETAG brand doctrine wins over greenfield aesthetic exploration.

## ANDETAG brand context (read before building)

Existing brand and implementation — **do not invent a new visual language** unless the user explicitly requests exploration:

| Source | What to lift |
|--------|----------------|
| [`docs/Visual Identity.md`](../../docs/Visual%20Identity.md) | Jost headings (uppercase, 0.3em tracking), Baskervville body, palette (`#f7dcea`, `#4a0d2f`, `#d0a4cc`, `#e0e31c`, CTA reds/greens), CTA variant table |
| [`docs/Tone of Voice.md`](../../docs/Tone%20of%20Voice.md) | Copy tone; em dash (U+2014) prohibited in user-facing text |
| [`docs/component-usage.md`](../../docs/component-usage.md) | Component APIs and usage patterns |
| `site/src/styles/components.css` | `.brand-wordmark`, `.link-cta-primary|secondary|outline`, shared tokens |
| `site/src/styles/` | Spacing, typography, color implementation |
| [`docs/responsive-image-workflow.md`](../../docs/responsive-image-workflow.md) | When design work adds or changes photos |

For token extraction from the live codebase, invoke **`design-system-extract`** (procedure below) against these sources — not against memory.

## Files touched

**Read (design context):**

- `skills/design/system-prompt.md` — operating philosophy (20 chapters)
- `skills/design/andetag-adaptations.md` — Cursor/runtime overrides
- `skills/design/procedures/<name>.md` — phased procedure when a trigger matches
- Brand docs and styles listed above

**Write (typical design tasks):**

- `site/src/styles/**`
- `site/src/components/**`
- `site/src/layouts/**`
- Occasionally `docs/Visual Identity.md` or `docs/component-usage.md` when behavior changes (doc/code coherence)

**Do not touch** without the matching content skill: `page-shell-meta.json`, registries, `_redirects`, operational data modules.

## Locale parity

Design tokens and component styling are **universal across languages**. Language changes content, not core styling, unless an approved exception is logged in `docs/seo/decisions.md`.

When a design change affects page body layout in one locale file, update **every paired locale body** in the same task (`*Sv.astro` + `*En.astro`, or Berlin `*De.astro` + `*En.astro`) unless the user scopes to one locale.

## Workflow

1. **Load the system prompt.** Read [`system-prompt.md`](system-prompt.md) in full on first design touch in a session, then follow its workflow (chapters 2–4).
2. **Apply ANDETAG overrides.** Read [`andetag-adaptations.md`](andetag-adaptations.md) — brand precedence, Astro/CSS medium, verification without subagents.
3. **Invoke a procedure when the trigger matches.** Read the matching file from [`procedures/`](procedures/) and follow it. Chapter 20 of `system-prompt.md` lists triggers; summary:

   **Production:** `discovery-questions` · `frontend-aesthetic-direction` (skip when ANDETAG brand applies) · `wireframe` · `make-a-deck` · `make-a-prototype` · `make-tweakable` · `generate-variations`

   **System:** `design-system-extract` · `component-extract`

   **Review:** `accessibility-audit` · `ai-slop-check` · `hierarchy-rhythm-review` · `interaction-states-pass` · `polish-pass`

4. **Build in the real medium.** This site is Astro static export + CSS in `site/src/`. Implement in components and styles — not throwaway standalone HTML unless the user asked for an isolated prototype deck.
5. **Chain reviews before merge.** After substantive visual changes, run **`polish-pass`** (or its constituent audits) in-loop. See Verification.

Typical brand-aware flow on this repo:

```
design-system-extract → implement in site/src → hierarchy-rhythm-review → interaction-states-pass → ai-slop-check → accessibility-audit
```

Greenfield exploration (rare, user-requested only):

```
discovery-questions → wireframe → generate-variations → polish-pass
```

## Verification

From `site/`:

```bash
npm test && npm run build
```

Then:

- **Hierarchy/spacing:** run `hierarchy-rhythm-review` procedure against changed CSS/components.
- **Interaction states:** run `interaction-states-pass` on any new or changed interactive control.
- **AI slop:** run `ai-slop-check` after greenfield or large visual changes.
- **Accessibility:** run `accessibility-audit` before shipping UI changes.
- **Performance-sensitive changes** (new images, hero changes, script-heavy UI): consider `skills/performance-check/SKILL.md`.

Open the Cloudflare preview URL and walk the changed pages at mobile width. For paired locales, spot-check at least one page per affected pair.

Report in the PR: which procedures ran and any unresolved findings.

## When to escalate

- Design change requires new brand colors, fonts, or CTA doctrine → stop; update `docs/Visual Identity.md` with human approval first.
- Berlin locale styling divergence from Stockholm → check `docs/seo/decisions.md` and SEO manual before proceeding.
- Task needs new page routes, redirects, or shell meta → hand off to `skills/page`.
- Copy/metadata changes dominate → `skills/seo`.

## Examples

**Tighten hero spacing on Stockholm home:** Read `system-prompt.md` §7–§9, `design-system-extract` from `components.css`, edit shared hero styles + both `StockholmHomeSv/En.astro` if markup changes, run `hierarchy-rhythm-review` + `npm test && npm run build`.

**New outline CTA on a photo hero:** Match `docs/Visual Identity.md` CTA table, implement via `StyledLink`/`ButtonGroup`, run `interaction-states-pass` + `accessibility-audit`.

**"This block looks generic":** Run `ai-slop-check` on the component, fix tropes, re-verify against ANDETAG palette (no purple-pink gradients, no emoji decoration, no Inter-as-default).

## Attribution

Vendored from [Trystan-SA/claude-design-system-prompt](https://github.com/Trystan-SA/claude-design-system-prompt). See [`ATTRIBUTION.md`](ATTRIBUTION.md) and [`LICENSE`](LICENSE).
