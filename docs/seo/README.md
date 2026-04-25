# SEO doctrine

This directory holds the **ongoing** SEO doctrine for `andetag.museum`. Migration-era files (`docs/url-migration-policy.md`, `docs/migration-exceptions.md`) are reference-only and are archived at Phase 9 closure; their durable SEO substance lives here.

## Files

| File | Purpose |
|------|---------|
| [`url-architecture.md`](url-architecture.md) | Canonical URL rules, redirect rules, language and destination routing, location-scoped story URLs, entry routing + `andetag_entry` cookie contract, SEO landing page policy, privacy URLs, query/non-HTML/asset-locality rules, Berlin transition, sitemap and canonicalization. |
| [`decisions.md`](decisions.md) | Durable SEO decisions log: deviations from default rules (canonical override, schema parent type, on-page copy override). Successor to the SEO-relevant rows of `docs/migration-exceptions.md`; IDs preserved as `SEO-NNNN`. |

## When to read what

| Question | Read |
|----------|------|
| What URL pattern should this page have? | `url-architecture.md` §1 (canonical), §3 (language/destination), §5 (SEO landings) |
| Why does Berlin English canonical to Stockholm English? | `decisions.md` `SEO-0016` |
| Why does Stockholm have `Museum + LocalBusiness` paired? | `decisions.md` `SEO-0017` |
| What does `/` and `/en/` do at the edge? | `url-architecture.md` §4 |
| How does the sitemap pick what to include? | `url-architecture.md` §11 |
| How do I add a new SEO-relevant deviation? | `decisions.md` "How to add a row" |

## Sister doctrine docs

These are not in `docs/seo/` because they pre-date the migration and survive Phase 9 closure as-is:

- `docs/Andetag SEO Manual.md` — page intent, keyword strategy, hreflang baseline, schema strategy, Berlin rollout, internal linking, locked positioning.
- `docs/Tone of Voice.md` — copy register, banned words, locale handling.
- `docs/Visual Identity.md` — typography, colour, CTA mapping (referenced when copy crosses into UI).

## Workflow

The skill that owns SEO edits is `skills/seo/SKILL.md`. Page edits go through `skills/page/SKILL.md` first; the SEO skill's `§H` is invoked for pre-merge page-pair review. Site-wide audits live in `skills/site-integrity/SKILL.md`.

## Source integrity

- Never invent canonicals, redirects, or schema patterns. Anchor every change in this directory + the SEO Manual.
- `site-html/` is **legacy WordPress scrape** — reference only.
- The runtime contract is `site/src/lib/routes/page-shell-registry.ts` + `site/src/lib/chrome/schema-org.ts` + `site/src/lib/chrome/seo.ts`. When this directory and the runtime disagree, fix one to match the other deliberately.
