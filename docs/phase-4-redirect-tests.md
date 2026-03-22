# Phase 4 Redirect Test List

Purpose: manual or automated checks for repo-owned path redirects (`site/public/_redirects` on Cloudflare Pages).

Environment: run against Cloudflare preview or production after deploy, or use `wrangler pages dev` if configured. Local `astro preview` does not evaluate `_redirects`; use a Pages-like static server that applies the same rules if testing locally.

## Required cases

| # | Request path | Expected status | Expected location (path) | Query preservation |
|---|----------------|-----------------|---------------------------|--------------------|
| 1 | `/de/` | 301 | `/de/berlin/` | yes |
| 2 | `/de/?utm_source=test` | 301 | `/de/berlin/?utm_source=test` | yes |
| 3 | `/en/berlin-en/` | 301 | `/en/berlin/` | yes |
| 4 | `/en/stockholm/art-yoga-en/` | 301 | `/en/stockholm/art-yoga/` | yes |

## Execution log

| date | environment | operator | result |
|------|-------------|----------|--------|
| | | | |

When executed, paste HTTP response lines (`curl -sI`) or platform logs into the project journal or extend this table.
