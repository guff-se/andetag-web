# Phase 8 cutover runbook

Purpose: step-by-step procedure for pointing **`www.andetag.museum`** at the Workers deployment, with rollback plan.

References: **`docs/phase-8-todo.md`** (P8-10, P8-11, P8-12), **`docs/phase-9-todo.md`** (**P9-25** release discipline), **`docs/url-migration-policy.md`**, **`site/wrangler.jsonc`**, **`site/workers/entry-router.ts`**.

---

## Prerequisites (complete before cutover day)

- [x] **P8-01 through P8-09** pass (verification record updated).
- [x] **P8-06** Gustaf locale copy sign-off for `sv`, `en`, `de` on staging (2026-04-12).
- [x] **P8-07** GTM container migration published and validated on staging; live **Part D** complete **2026-04-14** (see **`docs/phase-8-verification-record.md`** §Cutover).
- [x] **P8-08** GSC baseline exported and recorded (2026-04-12).
- [x] **DNS TTL reduction:** `www.andetag.museum` and `andetag.museum` TTL lowered to **60 seconds** at Websupport.se (2026-04-12). Original TTL: ______.
- [x] **DNS migration to Cloudflare** (see step 0 below): zone **`andetag.museum`** on Cloudflare; Worker custom domain and redirects operational **2026-04-14**.

---

## Current architecture

| Component | Value |
|-----------|-------|
| Worker name | `andetag-web` |
| Staging URL | `https://andetag-web.guff.workers.dev` |
| Production target | `https://www.andetag.museum` |
| `wrangler.jsonc` | `run_worker_first: true`, assets from `dist/` |
| Deploy command | `cd site && npm run worker:deploy` |
| Current DNS host | Websupport.se (migrating to Cloudflare) |

---

## Step 0: Migrate DNS to Cloudflare (before cutover day)

This step moves nameservers to Cloudflare. It does **not** change where `www` points yet; the site continues serving from WordPress throughout.

1. **Cloudflare dashboard** > Add a site > `andetag.museum` (Free plan is sufficient).
2. Cloudflare will scan existing DNS records. **Review carefully:**
   - Verify all records match what is currently at Websupport.se (A, AAAA, CNAME, MX, TXT/SPF/DKIM, etc.).
   - Ensure `www` points to the **current WordPress host** (same IP or CNAME as today).
   - Set `www` to **proxied** (orange cloud). This enables Cloudflare edge TLS immediately after NS propagation.
   - Set non-web records (MX, TXT, etc.) to **DNS only** (grey cloud).
3. Cloudflare provides two nameservers (e.g. `xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`).
4. **Websupport.se** > Domain settings > Change nameservers to the Cloudflare pair.
5. **Wait for NS propagation** (typically 1-24 hours, can take up to 48h).
6. **Verify:** Cloudflare dashboard shows the zone as **Active**. Run `dig andetag.museum NS` and confirm Cloudflare nameservers.
7. **Verify site still works:** `https://www.andetag.museum/` still serves WordPress via Cloudflare proxy. No downtime expected.
8. **Cloudflare SSL/TLS** > Set mode to **Full (strict)** if the WordPress host has a valid cert, or **Full** if it uses a self-signed cert. This ensures HTTPS works end-to-end during the interim period.
9. **Set TTL to 60s** for the `www` record in Cloudflare DNS (should already be low from Websupport, but confirm).

**Timing:** Do this at least **24 hours before cutover day** so NS propagation is fully settled and Cloudflare edge cert is provisioned.

**Rollback:** If anything goes wrong during NS migration, revert nameservers at Websupport.se back to the original values.

---

## Cutover steps (P8-11)

With DNS now on Cloudflare, use the custom domain approach:

1. **Cloudflare dashboard** > Workers & Pages > `andetag-web` > Settings > Domains & Routes.
2. Add **Custom Domain**: `www.andetag.museum`.
   - Cloudflare will update the DNS record to route `www` traffic to the Worker and provision TLS automatically.
   - If a conflicting DNS record exists (pointing to WordPress), Cloudflare will prompt to replace it. Confirm the replacement.
3. Confirm the custom domain shows **Active** status and TLS certificate is provisioned.
4. If apex `andetag.museum` should also resolve: add a **Redirect Rule** from apex to `www` (301), or add the apex as a second custom domain.

### After any option

5. **Wait for DNS propagation** (should be fast with reduced TTL).
6. Verify `https://www.andetag.museum/` loads and responds from the Worker (check response headers for `cf-ray` or similar Cloudflare markers).

---

## Immediate smoke test (P8-12)

Run within **15 minutes** of cutover:

```bash
# Quick status checks
for path in "/" "/en/" "/sv/stockholm/" "/en/stockholm/" "/de/berlin/" \
  "/sv/stockholm/biljetter/" "/en/stockholm/tickets/" "/en/berlin/"; do
  echo "$(/usr/bin/curl -s -o /dev/null -w '%{http_code}' "https://www.andetag.museum${path}") ${path}"
done
```

Expected: `/` and `/en/` return **302** (entry router); all others return **200**.

Also verify:
- [ ] HTTPS only (no mixed content warnings in browser console).
- [ ] `robots.txt` at `https://www.andetag.museum/robots.txt` returns correct rules.
- [ ] Sitemap at `https://www.andetag.museum/sitemap-index.xml` resolves.
- [ ] Cookie: visit `/sv/stockholm/`, check `andetag_entry` cookie is set.
- [ ] CookieConsent banner appears on first visit.

---

## Edge cache purge

If the Cloudflare zone previously cached WordPress responses:

1. **Cloudflare dashboard** > Caching > Purge Everything (or targeted purge for `www.andetag.museum`).
2. Re-check representative URLs to confirm fresh Worker responses.

---

## Rollback procedure

If critical issues are found after cutover:

### Quick rollback (< 5 minutes)

1. **Workers custom domain:** Remove `www.andetag.museum` from the Worker's custom domains in Cloudflare dashboard.
2. **Cloudflare DNS:** Update the `www` record back to the old WordPress host IP or CNAME (proxied). Since DNS is now on Cloudflare, this change takes effect within seconds at the edge.
3. **Cache:** Purge Cloudflare edge cache to clear any cached new-site responses.

**Note:** Record the current WordPress host IP/CNAME value before cutover so rollback is instant. Write it here: ______.

### After rollback

- Investigate the issue on staging.
- Re-attempt cutover after fix is deployed and verified on staging.

---

## Post-cutover release discipline (Phase 9 · **P9-25**)

After `www` is live on this stack:

1. **No direct pushes to `main`** for routine work.
2. Create feature branches and open **pull requests**.
3. Each PR automatically gets a **Cloudflare preview URL** (Workers preview deployments) for review.
4. **Merging to `main`** triggers CI and redeploys `www` via the existing `wrangler deploy` flow.
5. Configure **branch protection** on `main`:
   - Require PR reviews.
   - Require CI status checks to pass (`npm test`, `npm run build`).

### Cloudflare Workers preview deployments

To enable per-PR preview URLs, add a GitHub Actions workflow or use Cloudflare's built-in Git integration:

- **Option:** In the Workers & Pages project settings, connect the GitHub repository. Cloudflare will create preview deployments for each PR branch automatically.
- **Alternative:** Add `wrangler deploy --env preview` in a CI step for PR branches.

---

## DNS TTL restoration

After cutover is confirmed stable (**P9-26** checklist **closed** **2026-04-25** — [`docs/phase-9-verification-record.md`](phase-9-verification-record.md) — or earlier if Gustaf agrees risk is acceptable):

- Restore DNS TTL to its original value (typically 3600-86400 seconds).

---

## Checklist summary

| Step | When | Owner | Status |
|------|------|-------|--------|
| DNS TTL reduction | 24-48h before cutover | Gustaf | Done (60s, 2026-04-12) |
| Step 0: Migrate NS to Cloudflare | 24h+ before cutover | Gustaf | Done (2026-04-12) |
| Verify zone active + site works via CF proxy | After NS propagation | Gustaf | Pending |
| Record WordPress host IP for rollback | Before cutover | Gustaf | Pending |
| P8-07 GTM migration | Just before P8-11 | Gustaf (GTM UI) | Pending |
| P8-11 Custom domain binding | Cutover day | Gustaf | Pending |
| P8-12 Smoke test | Immediately after | Maintainer + Gustaf | Pending |
| Edge cache purge | If needed | Gustaf or maintainer | Pending |
| P8-13 GTM domain switch | Same day after smoke | Gustaf (GTM UI) | Pending |
| P9-25 Branch protection | Same day or next | Gustaf or maintainer | Done 2026-04-25 |
| DNS TTL restoration | After P9-26 closed **2026-04-25** (or agreed early) | Gustaf | Pending |
