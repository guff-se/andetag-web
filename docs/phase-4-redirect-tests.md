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
| 5 | `/privacy-policy/` | 301 | `/sv/stockholm/privacy/` | yes |
| 5b | `/privacy/` | 301 | `/sv/stockholm/privacy/` | yes |
| 6 | `/` | 301 | `/sv/stockholm/` | yes |
| 7 | `/?utm_source=test` | 301 | `/sv/stockholm/?utm_source=test` | yes |
| 8 | `/stockholm/biljetter/` | 301 | `/sv/stockholm/biljetter/` | yes |
| 9 | `/musik/` | 301 | `/sv/stockholm/musik/` | yes |
| 10 | `/optisk-fibertextil/` | 301 | `/sv/stockholm/optisk-fibertextil/` | yes |
| 11 | `/en/music/` | 301 | `/en/stockholm/music/` | yes |
| 12 | `/sv/musik/` | 301 | `/sv/stockholm/musik/` | yes |

## Execution log

| date | environment | operator | result |
|------|-------------|----------|--------|
| 2026-03-23 | `https://andetag-web.guff.workers.dev/` (Cloudflare Workers static assets) | automated `curl -sI` | **Pass (historical)** — cases 1–5 as **then** defined; **`/privacy-policy/`** target was **`/privacy/`** before **2026-03-28** routing. |
| 2026-03-23 | Repo `site/public/_redirects` and `site/dist/_redirects` (post `/sv/` rollout) | review + `HEAD` probe | **Pass (historical rules)** — see note below. |
| 2026-03-28 | Repo `site/public/_redirects` | review | **Pending live re-run:** location-scoped story URLs and privacy (**`docs/routing-location-scoped-global-pages-plan.md`**). Required cases **5**, **5b**, **9**, **10** and new **11**–**12** targets updated in the table above. Re-execute **`curl -sI`** on the deploy that applies **`public/_redirects`** after publish. |

### Evidence (2026-03-23, historical)

Base URL: `https://andetag-web.guff.workers.dev`. Privacy and Swedish story targets in this block are **superseded** by **2026-03-28** (see **Required cases**).

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

# 5 GET /privacy-policy/  (before 2026-03-28)
HTTP/2 301
location: /privacy/

# 5b GET /privacy-policy/?utm_source=test
HTTP/2 301
location: /privacy/?utm_source=test
```

### Evidence: cases 6–12 (repo rules, 2026-03-28)

Rules in `site/public/_redirects` (copied to `site/dist/_redirects` on build):

| Case | Rule (source → target) |
|------|-------------------------|
| 6 | `/` → `/sv/stockholm/` `301` |
| 7 | (same rule; query preserved by platform when supported) |
| 8 | `/stockholm/*` → `/sv/stockholm/:splat` `301` |
| 9 | `/musik/` → `/sv/stockholm/musik/` `301` |
| 10 | `/optisk-fibertextil/` → `/sv/stockholm/optisk-fibertextil/` `301` |
| 5, 5b | `/privacy-policy/`, `/privacy/` → `/sv/stockholm/privacy/` `301` |
| 11 | `/en/music/` → `/en/stockholm/music/` `301` |
| 12 | `/sv/musik/` → `/sv/stockholm/musik/` `301` |

Related rules in the same file: legacy English global story paths (`/en/about-andetag/`, …), flat German story paths (`/de/ueber-andetag/`, …), unprefixed Swedish (`/om-andetag/`, …). Full list: **`docs/url-matrix.csv`** **`redirect`** rows.

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
curl -sI "$BASE/privacy/"
curl -sI "$BASE/"
curl -sI "$BASE/?utm_source=test"
curl -sI "$BASE/stockholm/biljetter/"
curl -sI "$BASE/musik/"
curl -sI "$BASE/optisk-fibertextil/"
curl -sI "$BASE/en/music/"
curl -sI "$BASE/sv/musik/"
```
