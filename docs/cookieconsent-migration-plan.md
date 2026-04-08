# Implementation plan: Termly to CookieConsent migration

Status: **draft**
Date: 2026-04-08
Deciders: Gustaf, AI agent
Related: `docs/decisions/0002-consent-platform-selection.md`, `docs/tracking-and-consent-requirements.md`, `docs/performance-improvement-plan.md`

## Goal

Replace the **Termly** SaaS consent manager (~163 KB, $15-20/month) with the open-source **vanilla-cookieconsent** library (~23 KB JS + CSS, $0/month, self-hosted on Cloudflare). Preserve Google Consent Mode v2 signals, GTM integration, and the existing consent category model (`necessary`, `analytics`, `marketing`). Improve mobile Lighthouse performance by eliminating the measured ~14-point Termly+GTM penalty as much as possible (Termly's share is roughly half of that).

## Why CookieConsent

| Criterion | Termly (current) | CookieConsent (target) |
|-----------|-------------------|------------------------|
| JS payload | ~163 KB (SaaS CDN) | ~23 KB UMD (self-hosted) |
| CSS | loaded from `app.termly.io` | ~32 KB (splittable, self-hosted) |
| Third-party requests | DNS + TLS + fetch to `app.termly.io` + chained consent API calls | Zero: served from same origin |
| Consent Mode v2 | Yes (via dashboard + GTM template) | Yes (via `onConsent`/`onChange` callbacks) |
| GTM integration | Community Template + `userPrefUpdate` + `Termly.consentSaveDone` | Direct `gtag('consent', 'update', ...)` from callbacks |
| Multilingual | Dashboard-managed | Config-driven (sv/en/de strings in repo) |
| Consent storage | Server-side logs (Termly) | `localStorage` (browser-only) |
| Branding | Removed on Pro+ | None (your own CSS) |
| Monthly cost | $15-20 | $0 |
| Audit logs | Yes | No (not needed per business decision) |

## Cookie inventory (from Termly scan, April 2026)

Source: Termly automatic scan on `andetag-web.guff.workers.dev`. The scan ran with Termly active, so some cookies below belong to Termly itself and will disappear after migration. Others are third-party cookies set inside iframes (Vimeo, Spotify) that the site does not directly control but must disclose.

### Mapped to CookieConsent categories

**`necessary`** (always enabled, not toggleable)

| Cookie / storage key | Domain | Set by | Notes |
|----------------------|--------|--------|-------|
| `andetag_entry` | first-party | Entry Worker | Language and location preference. See `docs/url-migration-policy.md`. |
| `cc_cookie` | first-party | CookieConsent | Stores the visitor's consent choices. **Replaces** Termly's `TERMLY_API_CACHE`. |
| `__cf_bm` | `.vimeo.com` | Cloudflare (Vimeo) | Bot management cookie set by Cloudflare in front of Vimeo. Third-party, inside Vimeo iframe context. Not controllable by us, but disclosed as essential/functional. |

**`analytics`** (opt-in required)

| Cookie / storage key | Domain | Set by | Notes |
|----------------------|--------|--------|-------|
| `_ga` | first-party | GA4 (via GTM) | Google Analytics client ID. |
| `_ga_*` | first-party | GA4 (via GTM) | GA4 session cookie (container-specific suffix). |
| `vuid` | `.vimeo.com` | Vimeo | Vimeo analytics tracking cookie. Set inside the Vimeo iframe when the video plays. Termly classified this as analytics; keep that classification. |
| `s7` | `.spotify.com` | Spotify | Termly labeled this "Adobe Analytics" but the domain is `.spotify.com`, so this is Spotify's internal analytics. Set inside the Spotify embed iframe on the Musik pages only. |

**`marketing`** (opt-in required)

| Cookie / storage key | Domain | Set by | Notes |
|----------------------|--------|--------|-------|
| `_gcl_au` | first-party | Google Ads (via GTM) | Google Ads experiment cookie for conversion measurement. |
| `_gcl_ls` | first-party | Google Ads (via GTM) | Google Ads linker storage. |

### Removed after migration (Termly artifacts)

These cookies and storage entries exist only because Termly is loaded. They will not appear after migration. Confirmed by running `site/scripts/audit-cookies.mjs` with Termly URLs blocked: only `andetag_entry` remains.

| Cookie / storage key | Domain | Set by | Why it disappears |
|----------------------|--------|--------|-------------------|
| `csrf_token` | first-party | Termly | UUID-formatted CSRF token set by Termly's resource-blocker script (confirmed: disappears when `*termly.io*` is blocked). Not set by our Worker or any first-party JS. |
| `TERMLY_API_CACHE` | first-party (localStorage) | Termly | Termly's consent result cache. Replaced by CookieConsent's `cc_cookie`. |
| `_cfuvid` | `.app.termly.io` | Cloudflare (Termly) | Cloudflare security cookie for the Termly CDN origin. No Termly requests means no cookie. |

### Vimeo localStorage entries (not cookies)

Termly flagged these as "Essential" but they are `localStorage` keys set by the Vimeo player inside its iframe, not first-party cookies. They persist in the Vimeo iframe's storage origin (`player.vimeo.com`), not on our domain. We cannot clear or control them. They do not need consent gating (they are scoped to Vimeo's origin), but we can mention them in the cookie policy for transparency.

| Storage key | Origin | Notes |
|-------------|--------|-------|
| `LOCAL_STORAGE_ID_PICOX_ID` | `player.vimeo.com` | Vimeo internal player state. |
| `LOCAL_STORAGE_ID_VIMEO_PLAYER` | `player.vimeo.com` | Vimeo internal player preferences. |

### Third-party infrastructure cookies (disclosed but not controllable)

| Cookie | Domain | Set by | Category |
|--------|--------|--------|----------|
| `_cfuvid` | `.vimeo.com` | Cloudflare (Vimeo) | `necessary` (Cloudflare security infrastructure in the Vimeo iframe context, similar to `__cf_bm`). |

### Resolved investigation: `csrf_token`

Termly's scan labeled `csrf_token` as "Django / Essential". Testing confirms **Termly itself sets this cookie** (UUID value, 30-day expiry, `SameSite=None`). When Termly URLs are blocked via `Network.setBlockedURLs`, the cookie does not appear. It is not set by our Worker, not by any first-party JS, and not via any HTTP `Set-Cookie` header from our origin. Termly's "Django" label is a misclassification (the resource-blocker script uses a Django-style CSRF token internally). **This cookie will disappear after migration.**

### Summary: what goes into the CookieConsent config

The live audit (`site/scripts/audit-cookies.mjs`) on staging confirmed only **2 first-party cookies** before consent: `andetag_entry` (ours) and `csrf_token` (Termly, will vanish). Zero third-party cookies before consent, confirming consent gating works correctly. `TERMLY_API_CACHE` is the only localStorage entry (also Termly, will vanish).

```
categories:
  necessary:       andetag_entry, cc_cookie
  analytics:       _ga, _ga_*
  marketing:       _gcl_au, _gcl_ls

cookie_table (disclosure, not blocking):
  necessary:       __cf_bm (.vimeo.com), _cfuvid (.vimeo.com)
  analytics:       vuid (.vimeo.com), s7 (.spotify.com)
  marketing:       (Meta Pixel and other GTM-injected cookies are transient;
                    declare them by vendor name rather than cookie name)
```

Third-party iframe cookies (Vimeo, Spotify, Cloudflare infrastructure) are set outside our domain by those services. CookieConsent cannot block or clear them because they live in the iframe's origin. We disclose them in the cookie table for transparency. Actual blocking of Vimeo/Spotify would require suppressing the iframe until consent is granted (deferred from P7-12, see out-of-scope section).

---

## Execution steps

Work is ordered so the site is never left in a broken consent state, each step is independently verifiable, and there is a clean commit point after each numbered step. The agent must pass every gate before proceeding. Steps within a single numbered step may run in parallel where noted.

### Step 0: baseline (before any code changes)

Capture measurements so the migration has a concrete before/after comparison.

| Task | Command | Output |
|------|---------|--------|
| Cookie audit | `cd site && node scripts/audit-cookies.mjs` | Expect: `andetag_entry`, `csrf_token` (Termly), `TERMLY_API_CACHE` (localStorage, Termly). Zero third-party cookies. |
| Lighthouse batch | `cd site && npm run build && npm run lighthouse:all` | Record per-route performance scores, FCP, LCP, TBT, CLS. |
| Third-party impact | `cd site && npm run perf:impact` | Record score delta between full, no-Termly, and no-tracking scenarios. |

**Gate:** Baseline data is saved (paste summary into this section or a linked report). Do not proceed until recorded.

---

### Step 1: install package and write config

All new files; no existing files are modified yet. The site still runs Termly.

**1a. Install the npm package**

```
cd site && npm install vanilla-cookieconsent
```

Pin the version in `package.json`. No additional server infrastructure needed.

**1b. Create the CookieConsent config module**

New file: `site/src/lib/chrome/cookie-consent-config.ts`

Responsibilities:
- Define three consent categories matching `docs/tracking-and-consent-requirements.md` section 3:
  - `necessary` (always enabled, not toggleable)
  - `analytics` (opt-in)
  - `marketing` (opt-in)
- Provide Swedish, English, and German UI strings for the banner and preferences modal. Copy should be **as short as possible**, following `docs/Tone of Voice.md` (calm, invitational, no legalese).
- Wire `onFirstConsent`, `onConsent`, and `onChange` callbacks that call `gtag('consent', 'update', {...})` with the correct Consent Mode v2 signals:
  - `analytics` accepted: `analytics_storage: 'granted'`
  - `marketing` accepted: `ad_storage: 'granted'`, `ad_user_data: 'granted'`, `ad_personalization: 'granted'`
- Declare known cookies per the **Cookie inventory** section above. The config's `cookieTable` (disclosure rows shown in the preferences modal) should list first-party cookies by name and third-party cookies by vendor, grouped under the matching category.
- **Consent storage:** Use `cookie` mode (not `localStorage`). `www.andetag.museum` is the only serving domain (bare domain redirects to `www`), so `localStorage` would also work, but cookie is more robust against future domain changes.

**1c. Create the CookieConsent initialization script**

New file: `site/src/client-scripts/cookie-consent-init.ts`

Responsibilities:
- Import `vanilla-cookieconsent` and the config module
- Call `CookieConsent.run(config)` with the current page language (read from `<html lang="...">`), selecting the matching translation
- Export nothing (side-effect module, loaded from `TrackingHead.astro`)

**1d. Style the banner** (can run in parallel with 1b/1c)

CookieConsent ships modular CSS files. Import only what is needed:
- `cookieconsent.css` (full, ~32 KB) or the split files (`consent-modal.css` + `preferences-modal.css` + `base.css`)
- Add custom overrides in `site/src/styles/` to match the ANDETAG visual identity (`docs/Visual Identity.md`): colors, typography, button styles

**Layout:** Agent decides. Match the site's calm, minimal aesthetic. Bottom bar is a reasonable default (unobtrusive, doesn't cover content), but a small centered box is also fine if it looks better with the site's design. Preferences modal (opened from footer) can be a standard centered dialog.

**Color direction:** Derive from `docs/Visual Identity.md`. Likely: light pink `#f7dcea` or aubergine `#4a0d2f` background, lavender `#d0a4cc` accents, Jost for button labels, Baskervville for body text. Use `cta-primary` token pattern (lavender fill, aubergine text) for the accept button.

**Design decision (resolved):** Keep all consent and tracking logic in `TrackingHead.astro` (matching the current pattern). CookieConsent JS and CSS are loaded via Astro's client-side script bundling from the init script in 1c.

**Gate:** `npm run build` succeeds. Termly is still loaded (new files exist but are not wired). No functional change.

---

### Step 2: swap Termly for CookieConsent (the atomic switch)

This is the core change. All edits in this step form one logical unit. After this step, Termly is gone and CookieConsent is live.

**2a. Replace Termly in `TrackingHead.astro`**

Current state:
1. Synchronous consent defaults (lines 27-42): **keep unchanged**
2. Termly CMP injection after LCP (lines 44-69): **replace** with CookieConsent initialization
3. GTM deferred to `window.load` (lines 72-85): **keep unchanged**

The consent defaults block is already CMP-agnostic (it sets all Google consent types to `denied` with `wait_for_update: 500`). This block stays exactly as-is. CookieConsent's callbacks will call `gtag('consent', 'update', ...)` when the user accepts, the same signal path Termly used.

Remove:
- The `termlyResourceBlockerSrc` constant
- The entire LCP-deferred Termly injection script

Add:
- CookieConsent JS/CSS loading. Since CookieConsent is much lighter (~23 KB vs ~163 KB), it can load earlier than Termly did. Two options:
  - **Eager async** (recommended): load CookieConsent JS as a regular async Astro client script. At ~23 KB self-hosted, this is smaller than many hero images and will not regress LCP.
  - **Deferred after LCP**: keep the same `PerformanceObserver` pattern if measurements show it helps.

**2b. Remove Termly dns-prefetch from `SiteLayout.astro`**

Remove:
```
<link rel="dns-prefetch" href="https://app.termly.io" />
```

Keep the `googletagmanager.com` dns-prefetch (GTM is unchanged).

**2c. Update the consent preferences link in `SiteFooter.astro`**

Current: `<a href="#" class="termly-display-preferences">`

Replace with a button that opens the CookieConsent preferences modal:

```html
<button type="button" onclick="CookieConsent.showPreferences()">{label}</button>
```

Or keep it as an `<a>` with an `onclick` handler and `href="#"` for progressive enhancement.

**2d. Update footer data modules** (can run in parallel with 2c)

Files: `footer-en-berlin.ts`, `footer-sv.ts`, `footer-de-berlin.ts`, `footer-en-stockholm.ts`

- Remove JSDoc references to "Termly" and `termly-display-preferences`
- The `consentPreferencesLabel` field and its locale strings stay the same (only the rendering mechanism changes)

**Gate:** All three must pass before proceeding.

```
cd site && npm test && npm run build
```

If tests or build fail, fix before continuing. Do not proceed with a broken build.

**Commit point:** This is the first commit. Message should reflect "Replace Termly CMP with self-hosted CookieConsent".

---

### Step 3: automated verification (agent-run)

These checks can all be run by the AI agent without operator intervention.

**3a. Cookie audit (denied state)**

Run on staging (after deploying the Step 2 build, or against local `dist/`):

```
cd site && node scripts/audit-cookies.mjs
AUDIT_URL=https://andetag-web.guff.workers.dev/sv/stockholm/ node scripts/audit-cookies.mjs
AUDIT_URL=https://andetag-web.guff.workers.dev/en/stockholm/ node scripts/audit-cookies.mjs
AUDIT_URL=https://andetag-web.guff.workers.dev/de/berlin/ node scripts/audit-cookies.mjs
```

Verify:
- `csrf_token` cookie is **gone** (was Termly)
- `TERMLY_API_CACHE` localStorage entry is **gone** (was Termly)
- `andetag_entry` cookie is **still present** (our Worker, unchanged)
- `cc_cookie` may or may not appear yet (CookieConsent creates it on first user interaction)
- Zero third-party cookies (consent still denied by default)
- No **unknown** category cookies appear

**3b. Existing test suite**

```
cd site && npm test
```

All 107 tests must pass. If any footer or tracking tests fail, fix before continuing.

**Gate:** All checks green. If cookie audit shows unexpected results, debug before proceeding.

---

### Step 4: manual verification (requires operator)

These checks require a human in the browser. The agent should report what to check and wait for confirmation.

**4a. Consent UX checks**

- [ ] Consent banner appears on first visit in **sv**, **en**, and **de**
- [ ] "Accept all" grants analytics + marketing
- [ ] "Reject all" (or closing the banner with only necessary) leaves analytics + marketing denied
- [ ] Preferences modal opens from the footer link on all footer variants
- [ ] Preferences modal shows three categories with correct labels and cookie tables
- [ ] Consent persists across page navigation and language switches
- [ ] Consent persists across sessions (close tab, reopen)

**4b. GTM and tag verification (requires GTM Preview)**

- [ ] After accepting **analytics**: GA4 `page_view` fires in GTM Preview
- [ ] After accepting **marketing**: Meta pixel fires in GTM Preview
- [ ] After rejecting all: no analytics or marketing tags fire
- [ ] `andetag_entry` cookie is unaffected
- [ ] Booking widget (Understory) loads regardless of consent state
- [ ] Vimeo video facade works (poster click triggers iframe)

**4c. Cookie audit (after consent granted)**

In Chrome DevTools (Application tab) after accepting all categories:
- [ ] `_ga`, `_ga_*` (analytics) appear
- [ ] `_gcl_au`, `_gcl_ls` (marketing) appear
- [ ] `cc_cookie` in localStorage or cookies with correct category state

**Gate:** Operator confirms all checks pass. If GTM tags do not fire, debug the consent callback timing before proceeding (see Risks section).

---

### Step 5: performance measurement

Run after Step 3 passes. Can run in parallel with Step 4 (performance does not depend on operator GTM checks).

**5a. Lighthouse batch**

```
cd site && npm run build && npm run lighthouse:all
```

**5b. Third-party impact comparison**

```
cd site && npm run perf:impact
```

**5c. Evaluate results**

Expected improvements (based on `docs/performance-improvement-plan.md`):
- Termly contributed ~163 KB download + ~280 ms main thread (under 4x CPU throttle)
- CookieConsent should contribute ~23 KB download + significantly less execution time
- **Expected**: 3-8 point Lighthouse improvement on mobile, ~0.5-1.5 s LCP reduction
- Remaining gap (~5-7 points) is GTM's irreducible cost (~151 KB, ~100 ms main thread)

**5d. Staging PSI check** (after deploying to `andetag-web.guff.workers.dev`)

Run PageSpeed Insights on representative URLs for real-network comparison.

**Gate:** Performance is not worse than baseline. If scores regressed, investigate CookieConsent load timing before proceeding.

---

### Step 6: update perf tooling scripts

Dev-only tooling updates. Not required for correctness, but keeps the scripts functional for future use.

**6a. Update `site/scripts/perf-consent-timing.mjs`**

Replace all `termly.io` URL pattern matching with the CookieConsent script path (local `/_astro/...`). Since CookieConsent is self-hosted, several metrics become trivial (no DNS/TLS cost, no chained requests). Consider simplifying the script.

**6b. Update `site/scripts/perf-third-party-impact.mjs`**

Replace the `no-termly` A/B scenario with a `no-cmp` scenario (or remove it if the CMP cost is negligible). Rename the scenario label.

**6c. Update `site/scripts/perf-render-blocking-audit.mjs`**

Remove the `termly.io` head-position checks (`termly-before-preloads`, `termly-before-gtm`). Replace with equivalent checks for CookieConsent if relevant, or remove if CookieConsent loads via Astro's bundled client scripts.

**Gate:** `npm run build` still succeeds.

**Commit point:** "Update perf tooling scripts for CookieConsent".

---

### Step 7: GTM container changes (operator, in GTM admin UI)

This is manual work in the GTM web UI, not code. The agent writes the runbook; the operator executes it.

**Current GTM state (confirmed):** P8-07 was **never started**. The GTM container (`GTM-KXJGBL5W`) still only has **Complianz** triggers (`cmplz_event_statistics`, `cmplz_event_marketing`). No Termly Community Template, no `userPrefUpdate`, no `Termly.consentSaveDone` were ever added. This means Step 7 is a **fresh consent setup**, not a Termly-to-CookieConsent migration inside GTM.

**Consent signal flow with CookieConsent:**
1. Page loads, consent defaults fire (synchronous, in `TrackingHead.astro`)
2. CookieConsent initializes, reads stored consent from `localStorage`
3. If user previously consented, `onConsent` callback fires immediately and calls `gtag('consent', 'update', ...)`
4. GTM loads at `window.load`, sees updated consent state, fires permitted tags
5. If user changes preferences later, `onChange` fires and calls `gtag('consent', 'update', ...)`

**What to change in GTM (`GTM-KXJGBL5W`):**
- **Replace or supplement** the `cmplz_event_statistics` and `cmplz_event_marketing` custom event triggers: add `All Pages` (or `Consent Initialization - All Pages`) as a firing trigger on GA4, Google Ads, and Meta tags. With `Additional Consent Checks` set on each tag (`analytics_storage` for GA4/Ads, `ad_storage` for Meta), the tags will only execute when CookieConsent grants the corresponding category. The `cmplz_*` triggers can be removed once WordPress is fully retired from `www`.
- **Keep:** Tag-level `Additional Consent Checks` (CMP-agnostic, already in the export)
- **Keep:** All tag configurations (GA4, Google Ads, Meta) with their consent requirements
- **No Termly artifacts to remove** (they were never added)

**Validation:** GTM Preview on staging after Publish.

**Gate:** Tags fire correctly on staging with CookieConsent. Operator confirms.

---

### Step 8: documentation updates (agent, parallelizable batch)

All doc updates are independent and can be executed in parallel. Each is a text replacement or addition; none affects runtime behavior.

**Critical docs (update these first):**

| File | What to change |
|------|---------------|
| `docs/decisions/0002-consent-platform-selection.md` | Add amendment: CookieConsent replaces Termly (date, rationale, what was kept/dropped) |
| `docs/gtm-termly-migration-runbook.md` | Rename to `docs/gtm-consent-migration-runbook.md` and rewrite for CookieConsent. Old content in git history. |
| `docs/tracking-and-consent-requirements.md` | Replace Termly row in embed inventory (section 4a), update CMP references (1a), confirm technical requirements (6) |
| `docs/kpi-measurement-map.md` | Replace Termly references, simplify Complianz trigger coupling, update GTM migration checklist |
| `docs/phase-8-todo.md` | P8-01: replace Termly; P8-07: reference new runbook; P8-13: remove dashboard domain switch; P8-22: update live pass |

**Remaining docs (update in any order):**

| File | What to change |
|------|---------------|
| `docs/performance-improvement-plan.md` | Update P2 status, staging results table, achievable ceiling estimate, perf script descriptions |
| `docs/grand-plan.md` | Phase 7 status note, Decisions Captured (Integrations), Resolved inputs |
| `docs/definition-of-done.md` | Phase 7 and Phase 8 exit criteria: replace "Termly" with "CookieConsent" |
| `docs/url-migration-policy.md` | CMP listing for `andetag_entry`: update vendor name |
| `docs/migration-exceptions.md` | EX-0018: update to reflect CookieConsent |
| `AGENTS.md` | Doc table: update runbook name and ADR description |
| `CHANGELOG.md` | Add entry for CMP migration |

**Archive docs** (`docs/archive/`) reference Termly historically. Do not update; they are closed-phase records. Git history preserves the Termly era.

**Gate:** `npm test && npm run build` still passes (doc changes should not break anything, but verify).

**Commit point:** "Update documentation for CookieConsent migration".

---

### Step 9: cleanup

**9a. Cancel Termly Pro+ subscription** (operator)

- Optionally export consent logs before cancellation (for records, though not legally required per business decision)
- Remove the Termly staging domain (`andetag-web.guff.workers.dev`) from the Termly dashboard
- Cancel billing

**9b. Final cookie audit on staging**

```
cd site && node scripts/audit-cookies.mjs
```

Confirm the post-migration steady state matches expectations from Step 3a.

## Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| CookieConsent callbacks fire too late for GTM `wait_for_update: 500` | Tags fire with denied consent, then re-fire after update (double counting or missed first pageview) | Test timing with GTM Preview; increase `wait_for_update` if needed; CookieConsent reads localStorage synchronously so returning users get instant consent |
| Google Ads conversion attribution degrades without a "certified CMP" | Lost ad signal data | CMP certification is a publisher requirement (AdSense/Ad Manager), not an advertiser requirement. Consent Mode v2 signals are CMP-agnostic. Validate with Tag Assistant on staging. |
| CookieConsent localStorage consent does not persist across subdomains | Consent lost between `www.andetag.museum` and `andetag.museum` | **Resolved:** Using cookie storage. Bare domain redirects to `www`, so this is belt-and-suspenders. |
| Missing consent audit trail | Regulatory exposure | Accepted risk per business decision. localStorage consent is adequate for SEO-focused compliance appearance. |
| Breaking change in CookieConsent npm package | Build failure | Pin exact version; update deliberately |

## Tooling

**`site/scripts/audit-cookies.mjs`** -- headless Chrome cookie and localStorage audit. Navigates to a target URL, scrolls to trigger lazy embeds, waits for third-party scripts, then reports every cookie and localStorage entry with domain, expiry, size, and probable setter (auto-classified into `necessary` / `analytics` / `marketing` / `unknown`).

Usage:
```
cd site && node scripts/audit-cookies.mjs
AUDIT_URL=https://www.andetag.museum/sv/stockholm/ node scripts/audit-cookies.mjs
```

Run this after migration to confirm:
- `TERMLY_API_CACHE` (localStorage) is gone
- `csrf_token` cookie is gone
- `cc_cookie` (CookieConsent) appears after user interaction
- No unexpected new cookies appear
- Third-party cookies (GA4, Ads) only appear after consent is granted

## Out of scope

- Changing the GTM container ID or tag configurations beyond trigger updates
- Changing the consent category model (stays as `necessary`, `analytics`, `marketing`)
- Adding new tracking tags or pixels
- Changing the `andetag_entry` cookie behavior
- Iframe-level consent gating for Vimeo/Spotify/Maps (deferred from P7-12, unchanged)
