# ANDETAG adaptations to the vendored design system prompt

These overrides apply **on top of** `system-prompt.md` for work in this repository. When they conflict, this file and [`docs/Visual Identity.md`](../../docs/Visual%20Identity.md) win.

## Medium

- **Target:** Astro components (`.astro`) and CSS in `site/src/styles/`, not standalone HTML artifacts — unless the user explicitly asks for a deck, wireframe file, or isolated prototype.
- **Deploy path:** static export to Cloudflare Workers. Prefer existing component primitives (`StyledLink`, `ButtonGroup`, `HeroSection`, `ResponsiveInlinePicture`, etc.) over one-off markup.
- **Assets:** root-relative paths under `site/public/`; no hotlinks. New photos follow `docs/responsive-image-workflow.md`.

## Brand exists — skip greenfield aesthetic

ANDETAG has a live visual identity. For routine maintenance:

- **Do not** invoke `frontend-aesthetic-direction` to invent a new look.
- **Do** invoke `design-system-extract` against `docs/Visual Identity.md`, `site/src/styles/`, and relevant components.
- `ai-slop-check` rule 9 (default editorial-warm house style) still applies: reject cream/serif/terracotta templates that are not ANDETAG's established palette.

## Verification (Cursor / no subagent)

Upstream `system-prompt.md` references verifier subagents. In this environment:

- Run review procedures **in-loop** by reading and executing `procedures/<name>.md` yourself.
- After substantive visual changes, execute **`polish-pass`** (which chains accessibility, slop, interaction, and hierarchy reviews).
- Confirm with `npm test && npm run build` from `site/`.
- Use Cloudflare preview URLs for visual walkthrough; do not spam chat with screenshots unless the user asked.

## Copy and SEO constraints

- User-facing copy: [`docs/Tone of Voice.md`](../../docs/Tone%20of%20Voice.md) — banned words, no em dashes.
- Metadata/canonical/hreflang: [`skills/seo/SKILL.md`](../seo/SKILL.md) when titles, descriptions, or shell meta change.
- Locale parity: paired body components must stay structurally aligned across languages.

## Maintenance vocabulary

This is a **maintenance repository**, not a greenfield product build. Prefer minimal diffs that solve the stated design problem. No speculative redesigns bundled into unrelated tasks.
