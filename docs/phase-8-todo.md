# Phase 8 execution checklist, deployment and production cutover

Purpose: move the rebuilt site from **staging** (**`https://andetag-web.guff.workers.dev`**, Workers static assets + entry Worker) to **canonical production** (**`https://www.andetag.museum`**), with full verification before and after DNS or host cutover.

Normative phase summary: **`docs/grand-plan.md`** (Phase 8). Exit checks: **`docs/definition-of-done.md`** (Phase 8).

**Staging vs production:** Until cutover, **`www`** may still serve the legacy WordPress site. **Pushes to `main`** redeploy **staging** (**`https://andetag-web.guff.workers.dev`**). Gustaf approves **staging → `www`** when the maintainer reports Phase 7 + Phase 8 pre-cutover gates (**including P8-06 locale copy**) are met. All **pre-cutover** URL and entry checks run against **dev** (`npm run dev` / local build) and **staging**; **post-cutover** checks run against **`www`** when it serves this stack.

**After `www` cutover:** Use **pull requests** only for routine changes (no direct **`main`** pushes); each PR gets a **Cloudflare preview URL**; **merge** updates **`www`** (see **P8-25**).

## Moved here from earlier phases

| Source | What |
|--------|------|
| **`P5-06`** (production leg) | **Production enable** of entry Worker traffic on **`www`**, table **B** on **`https://www.andetag.museum`**, Gustaf sign-off (**`docs/phase-4-redirect-tests.md`**). Staging leg of **`P5-06`** stays as today: **`npm run verify:staging-entry`** on **`andetag-web.guff.workers.dev`**. |
| **`docs/grand-plan.md`** **Entry routing and URL expansion schedule** | Row **Production enable** of the entry Worker (DNS or custom domain binding so **`www`** hits this deployment). |
| **Grand-plan dependency rule** | Re-run table **B** on **`www`** after cutover; log evidence. |

**Phase 7 (closed):** in-repo scripts, **Termly** embed, **Consent Mode** defaults, sitemap, schema, favicon, sharing metadata, and staging-documented validation (**`docs/phase-7-verification-record.md`**). **GTM** container migration (**`docs/gtm-termly-migration-runbook.md`**) is **Phase 8 · P8-07**, timed **just before** cutover. Phase 8 re-runs the **live** checks that depend on **`www`** (and closes **`P5-06`** production).

## Pre-cutover: dev and staging

- [ ] **P8-01 Local dev QA:** On **`npm run dev`** (or agreed local preview after **`npm run build`**), exercise **routing** (entry paths, locale switches, **`301`** chains from **`docs/url-matrix.csv`** / **`site/public/_redirects`**), **scripts** (GTM, Termly, embeds per Phase 7; after **P8-07**, re-check tag firing in **GTM Preview** on staging), **cookies** (**`andetag_entry`**, consent categories), **forms** (Brevo waitlist, booking embeds), and **core conversion paths**. Fix regressions or log **`docs/migration-exceptions.md`** with Gustaf approval.
- [ ] **P8-02 Staging parity:** Confirm staging (**`https://andetag-web.guff.workers.dev`**) matches expected behavior after merge to **`main`** (auto-deploy). Re-run **`npm run verify:staging-entry`** after any Worker, **`_redirects`**, or entry-policy change; append **`docs/phase-4-redirect-tests.md`** if you use manual **`curl`** instead.
- [ ] **P8-03 Old-site URL coverage:** Every **must-keep** URL from the legacy live site (source: **`docs/url-matrix.csv`**, sitemap or inventory from **`spider.py`**, and agreed aliases) **resolves** on dev and staging as **200** (or agreed **301** to canonical), per **`docs/url-migration-policy.md`**. Gaps are **not** silent: record in **`docs/migration-exceptions.md`** and get **Gustaf confirmation** before cutover.
- [ ] **P8-04 Exception sign-off:** No undocumented deviations: all intentional differences vs the old live site are listed, approved, and owned.
- [x] **P8-05 Phase 7 gate (or waiver):** Phase 7 checklist (**`docs/phase-7-todo.md`**) is **closed** with **Gustaf** sign-off **2026-04-09** (**`docs/phase-7-verification-record.md`** §P7-16). Deferred work (**GTM** container migration) is **P8-07**, logged; no waiver required. **Promotion to `www`** still requires **P8-06** and the remaining Phase 8 pre-cutover rows.
- [ ] **P8-06 Locale copy sign-off (staging, blocks production):** Gustaf explicitly approves **final user-visible text** for **`sv`**, **`en`**, and **`de`** on **staging** (use an agreed checklist: hubs, one inner page per destination per locale, legal or privacy, and nav or chrome strings if needed). Optional: external reviewer for **`de`**; Gustaf still signs **`de`**. Record dates and scope in **`docs/phase-8-verification-record.md`**. **Do not** treat staging as **ready for `www`** until **P8-06** is complete.
- [ ] **P8-07 GTM + Termly container migration (just before production cutover):** Execute **`docs/gtm-termly-migration-runbook.md`** end to end in **`GTM-KXJGBL5W`** (Termly gallery template, **`userPrefUpdate`**, dual or replacement triggers so the static site is not **`cmplz_*`**-only, tag consent, **`Termly.consentSaveDone`** as needed, linker review). **Publish** and **GTM Preview** on **`https://andetag-web.guff.workers.dev`**. **Intended timing:** immediately before **`P8-11`** (after **P8-06** and other pre-cutover gates), so the container is not left half-migrated during a long staging window. **EX-0018** and **`docs/kpi-measurement-map.md`** § Staged rollout apply. **Live** domain focus and re-verify: **P8-13**, **P8-22**.

## Cutover

- [ ] **P8-10 Runbook:** Written steps for DNS, Cloudflare **custom domain** / **Workers** (or Pages) binding, TLS, and rollback (revert DNS or detach domain). Align with **`docs/url-migration-policy.md`** and hosting account reality.
- [ ] **P8-11 Execute cutover:** Point **`www.andetag.museum`** (and apex policy if applicable) at this deployment so the **entry Worker** and static assets serve production traffic.
- [ ] **P8-12 Immediate smoke:** Right after cutover, spot-check **`/`**, **`/en/`**, **`/sv/stockholm/`**, sample inner pages, and one **Berlin** path; confirm **HTTPS** and no accidental **mixed content** for first-party assets.
- [ ] **P8-13 Consent or tag primary domain switch:** After **`P8-07`** and **`P8-11`**, in **Termly** and GTM admin, switch primary production domain references from staging to **`www.andetag.museum`**, publish, then verify banner load and consent-gated tag behavior on live **`www`**. Reconfirm **GA4 / Ads / Meta** fire after consent (not only on legacy **`cmplz_*`** triggers); see **`docs/kpi-measurement-map.md`** § GTM migration checklist.

## Post-cutover: live **`www`**

- [ ] **P8-20 Entry routing on production:** Run table **B** against **`https://www.andetag.museum`** (for example **`STAGING_BASE=https://www.andetag.museum npm run verify:staging-entry`** from **`site/`**, or manual **`curl`** per **`docs/phase-4-redirect-tests.md`**). **Log** date and result; this closes **`P5-06`** production.
- [ ] **P8-21 Redirect and matrix regression:** Execute or extend **`docs/phase-4-redirect-tests.md`** table **A** (and any CI link checks) against **`www`** where they are host-sensitive.
- [ ] **P8-22 Live feature pass:** Repeat **P8-01** scope on **`www`**: consent, tags, embeds, cookies, critical forms, and locale switching. Include a booking test that **`on_receipt`** (or equivalent) still reaches conversion tags if you rely on legacy Understory **`dataLayer`** wiring (**`docs/kpi-measurement-map.md`**).
- [ ] **P8-23 SEO and sharing on live URLs:** Sitemap and **`robots.txt`** at production origin; spot-check **Open Graph** / card validators and **JSON-LD** on representative **`www`** URLs (**`docs/phase-7-todo.md`** cross-check). After **`www`** serves this stack, run **[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)** (and **Scrape Again** if needed) on key **`https://www.andetag.museum/...`** URLs: confirm **`og:image`** resolves with **`image/jpeg`** (or another image **`Content-Type`**), not HTML (**invalid content type** usually means **`404`** or wrong host before cutover). Default share image path is documented in **`site/src/lib/chrome/assets.ts`** (**`HERO_SV_ASSETS.poster`**); absolute URL uses **`https://www.andetag.museum`** via **`site/src/lib/chrome/seo.ts`**.
- [ ] **P8-24 Closure:** Update **`docs/grand-plan.md`** Phase 8 status, **`docs/phase-8-verification-record.md`** with evidence and Gustaf sign-off, and **`CHANGELOG.md`**.
- [ ] **P8-25 Post-cutover release discipline:** Document in the **P8-10** runbook (and **`AGENTS.md`** if needed): **no direct pushes to `main`** for routine work; **PRs** with **Cloudflare preview deployments** per branch; **merge to `main`** promotes **`www`**. Align branch protection and Workers or Pages project settings with this flow.

## References

- **`docs/grand-plan.md`** (Phase 8, entry schedule, rollout order)
- **`docs/url-migration-policy.md`**, **`docs/phase-4-routing-reopen.md`**, **`docs/phase-4-redirect-tests.md`**
- **`docs/phase-7-todo.md`** (Phase 7 **closed**; **GTM** runbook: **P8-07**)
- **`docs/kpi-measurement-map.md`**, **`docs/tracking-and-consent-requirements.md`** (GTM + **Termly** cutover, **`cmplz_*`** trigger replacement, Understory **`dataLayer`**)
- **`docs/migration-exceptions.md`**
- **`AGENTS.md`** (Routing and entry URLs)
