# AI Changelog Standards

Maintain a human-readable changelog for meaningful repository changes.

## File and format

- Use `CHANGELOG.md` at repo root.
- Follow Keep a Changelog categories: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- Keep an `Unreleased` section at the top.
- For releases, use reverse chronological order and ISO date format (`YYYY-MM-DD`).
- Link versions and relevant PRs/issues when available.

## Entry quality

- Write for humans, not commit logs, and summarize user-visible impact.
- Group related changes; avoid noisy internal-only notes unless they affect behavior or operations.
- Include migration notes when URL behavior, schema fields, or contracts change.
- Explicitly call out breaking changes and deprecations before removals.
- Include verification notes for major changes (tests run, deterministic checks, or manual validation scope).

## AI-specific rules

- Include a short "why" statement for each notable entry.
- Record scope precisely with file paths or subsystem names (for example parser, docs, SEO metadata, routing).
- If uncertainty remains (for example missing source data), document assumptions and follow-up actions.
- Keep changelog entries consistent with commit intent (`feat`, `fix`, and breaking changes) for future automation.

## Release workflow

1. During work: add notable items under `Unreleased`.
2. On release: move `Unreleased` items into a new version heading with date.
3. After release: reset `Unreleased` with empty category headings.
