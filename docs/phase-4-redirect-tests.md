# Phase 4 Redirect Test List

Purpose: manual or automated checks for **(A)** repo-owned path redirects in **`site/public/_redirects`** and **(B)** **`/`** and **`/en/`** entry routing in the Cloudflare Worker (**`site/workers/entry-router.ts`**, **`site/wrangler.jsonc`**).

Environment: run **(A)** against any deploy that serves **`dist/_redirects`**. Run **(B)** when the Worker + static assets are deployed (**`site/wrangler.jsonc`**, **`run_worker_first`** **`true`**): use **`npx wrangler dev`** after **`npm run build`**, or the **staging** host **`https://andetag-web.guff.workers.dev`** (auto-deploy on push to **`main`**). **`https://www.andetag.museum`** serves this stack after **Phase 8** cutover (**`P8-11`**, **2026-04-14**); re-run tables **A** and **B** on **`www`** for production evidence (**`docs/phase-8-todo.md`** **P8-20**, **P8-21**). Local **`astro preview`** does not run the Worker or evaluate **`_redirects`**.

## A) Static `_redirects` cases

| # | Request path | Expected status | Expected location (path) | Query preservation |
|---|----------------|-----------------|---------------------------|--------------------|
| 1 | `/de/` | 301 | `/de/berlin/` | yes |
| 2 | `/de/?utm_source=test` | 301 | `/de/berlin/?utm_source=test` | yes |
| 3 | `/en/berlin-en/` | 301 | `/en/berlin/` | yes |
| 4 | `/en/stockholm/art-yoga-en/` | 301 | `/en/stockholm/art-yoga/` | yes |
| 5 | `/privacy-policy/` | 301 | `/sv/stockholm/privacy/` | yes |
| 5b | `/privacy/` | 301 | `/sv/stockholm/privacy/` | yes |
| 8 | `/stockholm/biljetter/` | 301 | `/sv/stockholm/biljetter/` | yes |
| 9 | `/musik/` | 301 | `/sv/stockholm/musik/` | yes |
| 10 | `/optisk-fibertextil/` | 301 | `/sv/stockholm/optisk-fibertextil/` | yes |
| 11 | `/en/music/` | 301 | `/en/stockholm/music/` | yes |
| 12 | `/sv/musik/` | 301 | `/sv/stockholm/musik/` | yes |

## B) Entry router (Worker) cases

Normative rules: **`docs/url-migration-policy.md`**. Use **`curl -sI`**; send **`User-Agent`** as noted.

| # | Request | Headers / notes | Expected status | Expected `Location` (path + query) |
|---|---------|-----------------|-----------------|-------------------------------------|
| E1 | `/` | `User-Agent: Googlebot` | 302 | `/en/stockholm/` |
| E2 | `/` | Human UA, no `Cookie`, no `Accept-Language` | 302 | `/en/` |
| E3 | `/` | Human UA, `Accept-Language: sv` | 302 | `/sv/stockholm/`; response includes **`Set-Cookie: andetag_entry=v1:sv`** |
| E4 | `/` | Human UA, `Accept-Language: de` | 302 | `/de/berlin/`; **`Set-Cookie: andetag_entry=v1:de`** |
| E5 | `/` | Human UA, `Accept-Language: fr` | 302 | `/en/` |
| E6 | `/` | `Cookie: andetag_entry=v1:en-b` | 302 | `/en/berlin/` |
| E7 | `/?utm_source=test` | Same as E2 | 302 | `/en/?utm_source=test` |
| E8 | `/en` | Human UA | 301 | `/en/` |
| E9 | `/en/` | `User-Agent: Googlebot` | 302 | `/en/stockholm/` |
| E10 | `/en/` | Human UA, `Cookie: andetag_entry=v1:en-s` | 302 | `/en/stockholm/` |
| E11 | `/en/` | Human UA, no routing cookie | 200 | (static English hub HTML) |

## Execution log

| date | environment | operator | result |
|------|-------------|----------|--------|
| 2026-04-14 | `https://www.andetag.museum/` | AI agent (Phase 8 **P8-20**/**P8-21**): **`STAGING_BASE=https://www.andetag.museum npm run verify:staging-entry`** + **`curl -sI`** table **A** | **Pass:** table **B** **11/11**; table **A** **14/14** **301** with path-only **`Location`** (including **`/de/?utm_source=test`** query preservation). Closes **`P5-06`** production entry routing per **`docs/phase-8-todo.md`**. |
| 2026-04-12 | `https://andetag-web.guff.workers.dev/` | AI agent (Phase 8 P8-01/P8-02): **`npm run verify:staging-entry`** (E1–E11 pass) + **`curl`** table **A** all 14 cases | **Pass:** table **B** 11/11 entry-router checks; table **A** 14/14 static redirect checks (`/de/`, `/en/berlin-en/`, `/en/stockholm/art-yoga-en/`, `/privacy-policy/`, `/privacy/`, `/stockholm/biljetter/`, `/musik/`, `/optisk-fibertextil/`, `/en/music/`, `/sv/musik/`, `/en/about-andetag/`, `/om-andetag/`, `/de/ueber-andetag/`, query preservation). |
| 2026-04-04 | `https://andetag-web.guff.workers.dev/` | AI agent: **`curl -sI`** (table **B** E1–E11) + **`npm run verify:staging-entry`** in **`site/`** | **Pass:** entry router **`302`**/**`301`**/**`200`** and **`Location`** match table **B**; E3/E4 **`Set-Cookie`** present. Static **`_redirects`** spot-check: **`/de/`**, **`/privacy/`**, **`/musik/`** → expected **`301`** targets. |
| 2026-03-23 | `https://andetag-web.guff.workers.dev/` (Cloudflare Workers static assets) | automated `curl -sI` | **Pass (historical)**: cases 1–5 as **then** defined; **`/privacy-policy/`** target was **`/privacy/`** before **2026-03-28** routing. |
| 2026-03-23 | Repo `site/public/_redirects` and `site/dist/_redirects` (post `/sv/` rollout) | review + `HEAD` probe | **Pass (historical rules)**: see note below. |
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

### Evidence: static cases 8–12 (repo rules, 2026-03-28)

Rules in `site/public/_redirects` (copied to `site/dist/_redirects` on build):

| Case | Rule (source → target) |
|------|-------------------------|
| 8 | `/stockholm/*` → `/sv/stockholm/:splat` `301` |
| 9 | `/musik/` → `/sv/stockholm/musik/` `301` |
| 10 | `/optisk-fibertextil/` → `/sv/stockholm/optisk-fibertextil/` `301` |
| 5, 5b | `/privacy-policy/`, `/privacy/` → `/sv/stockholm/privacy/` `301` |
| 11 | `/en/music/` → `/en/stockholm/music/` `301` |
| 12 | `/sv/musik/` → `/sv/stockholm/musik/` `301` |

**Note:** Entry routing for **`/`** is **not** in `_redirects` (comment in `site/public/_redirects`). **`/`** is handled by **`site/workers/entry-router.ts`**.

Related rules in the same file: legacy English global story paths (`/en/about-andetag/`, …), flat German story paths (`/de/ueber-andetag/`, …), unprefixed Swedish (`/om-andetag/`, …). Full list: **`docs/url-matrix.csv`** **`redirect`** rows.

Note: `location` is path-only (relative). Clients resolve it against the request host, which matches Cloudflare static asset redirect behavior.

When re-running **static** rules, use:

Default **`BASE`** for pre-production checks (same Worker build as CI deploy):

```bash
BASE="https://andetag-web.guff.workers.dev"
curl -sI "$BASE/de/"
curl -sI "$BASE/de/?utm_source=test"
curl -sI "$BASE/en/berlin-en/"
curl -sI "$BASE/en/stockholm/art-yoga-en/"
curl -sI "$BASE/privacy-policy/"
curl -sI "$BASE/privacy-policy/?utm_source=test"
curl -sI "$BASE/privacy/"
curl -sI "$BASE/stockholm/biljetter/"
curl -sI "$BASE/musik/"
curl -sI "$BASE/optisk-fibertextil/"
curl -sI "$BASE/en/music/"
curl -sI "$BASE/sv/musik/"
```

**Entry router (table B):** on **staging**, from **`site/`** run **`npm run verify:staging-entry`** (uses **`fetch`**; override host with **`STAGING_BASE=...`**). Or set **`BASE="https://andetag-web.guff.workers.dev"`** and run **`curl -sI`** per table **B** (vary **`User-Agent`** and **`Cookie`**). Locally: **`npx wrangler dev`** after **`npm run build`**.
