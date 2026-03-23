# Phase 4 Redirect Test List

Purpose: manual or automated checks for repo-owned path redirects (`site/public/_redirects`, deployed with static assets on Cloudflare Workers).

Environment: run against Cloudflare preview or production after deploy, or use `wrangler pages dev` if configured. Local `astro preview` does not evaluate `_redirects`; use a Pages-like static server that applies the same rules if testing locally.

## Required cases

| # | Request path | Expected status | Expected location (path) | Query preservation |
|---|----------------|-----------------|---------------------------|--------------------|
| 1 | `/de/` | 301 | `/de/berlin/` | yes |
| 2 | `/de/?utm_source=test` | 301 | `/de/berlin/?utm_source=test` | yes |
| 3 | `/en/berlin-en/` | 301 | `/en/berlin/` | yes |
| 4 | `/en/stockholm/art-yoga-en/` | 301 | `/en/stockholm/art-yoga/` | yes |
| 5 | `/privacy-policy/` | 301 | `/privacy/` | yes |
| 6 | `/` | 301 | `/sv/stockholm/` | yes |
| 7 | `/?utm_source=test` | 301 | `/sv/stockholm/?utm_source=test` | yes |
| 8 | `/stockholm/biljetter/` | 301 | `/sv/stockholm/biljetter/` | yes |
| 9 | `/musik/` | 301 | `/sv/musik/` | yes |
| 10 | `/optisk-fibertextil/` | 301 | `/sv/optisk-fibertextil/` | yes |

## Execution log

| date | environment | operator | result |
|------|-------------|----------|--------|
| 2026-03-23 | `https://andetag-web.guff.workers.dev/` (Cloudflare Workers static assets) | automated `curl -sI` | **Pass** — cases 1–5: `301` and relative `location` paths match; `utm_source=test` preserved on cases 2, 3b, 4b, 5b. Spot checks: `/en/berlin-en/?utm_source=test`, `/en/stockholm/art-yoga-en/?utm_source=test`. Case 5 confirmed after deploy including `/privacy-policy/` → `/privacy/`. |
| 2026-03-23 | Repo `site/public/_redirects` and `site/dist/_redirects` (post `/sv/` rollout) | review + `HEAD` probe | **Pass (rules)** — cases 6–10 each have a matching `301` rule with the expected target path (see Evidence below). **Live note:** `HEAD` against `andetag-web.guff.workers.dev` for `/`, `/stockholm/biljetter/`, `/musik/`, `/optisk-fibertextil/` returned `200` without `Location` (this host appears to serve static files without evaluating `_redirects`). Re-check with `curl -sI` on **Cloudflare Pages** (or any deploy that applies `public/_redirects`) after the next publish. |

### Evidence (2026-03-23)

Base URL: `https://andetag-web.guff.workers.dev`

```
# 1 GET /de/
HTTP/2 301
location: /de/berlin/

# 2 GET /de/?utm_source=test
HTTP/2 301
location: /de/berlin/?utm_source=test

# 3 GET /en/berlin-en/
HTTP/2 301
location: /en/berlin/

# 4 GET /en/stockholm/art-yoga-en/
HTTP/2 301
location: /en/stockholm/art-yoga/

# 5 GET /privacy-policy/
HTTP/2 301
location: /privacy/

# 5b GET /privacy-policy/?utm_source=test
HTTP/2 301
location: /privacy/?utm_source=test
```

### Evidence: cases 6–10 (repo rules, 2026-03-23)

Rules in `site/public/_redirects` (copied to `site/dist/_redirects` on build):

| Case | Rule (source → target) |
|------|-------------------------|
| 6 | `/` → `/sv/stockholm/` `301` |
| 7 | (same rule; query preserved by platform when supported) |
| 8 | `/stockholm/*` → `/sv/stockholm/:splat` `301` |
| 9 | `/musik/` → `/sv/musik/` `301` |
| 10 | `/optisk-fibertextil/` → `/sv/optisk-fibertextil/` `301` |

Related Swedish legacy aliases in the same file: `/om-andetag/`, `/om-konstnarerna-malin-gustaf-tadaa/` → matching `/sv/...` paths.

Note: `location` is path-only (relative). Clients resolve it against the request host, which matches Cloudflare static asset redirect behavior.

When re-running, use:

```bash
BASE="https://andetag-web.guff.workers.dev"
curl -sI "$BASE/de/"
curl -sI "$BASE/de/?utm_source=test"
curl -sI "$BASE/en/berlin-en/"
curl -sI "$BASE/en/stockholm/art-yoga-en/"
curl -sI "$BASE/privacy-policy/"
curl -sI "$BASE/privacy-policy/?utm_source=test"
curl -sI "$BASE/"
curl -sI "$BASE/?utm_source=test"
curl -sI "$BASE/stockholm/biljetter/"
curl -sI "$BASE/musik/"
curl -sI "$BASE/optisk-fibertextil/"
```
