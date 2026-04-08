# GTM + CookieConsent operator runbook

Purpose: exact GTM operator steps to complete consent-trigger migration for the static site before production cutover.

When to run: Phase 8, `docs/phase-8-todo.md` P8-07, immediately before `P8-11` cutover to `www.andetag.museum`.

Related:
- `docs/kpi-measurement-map.md`
- `docs/tracking-and-consent-requirements.md`
- `docs/phase-8-todo.md`

## 1) Preconditions

- GTM edit access to `GTM-KXJGBL5W`.
- Static site already ships CookieConsent + Consent Mode defaults in `TrackingHead.astro`.
- Validate on staging first: `https://andetag-web.guff.workers.dev`.

## 2) Current-state reminder

Legacy container behavior still depends on Complianz event triggers (`cmplz_event_statistics`, `cmplz_event_marketing`) for some tags.

CookieConsent does not emit those events. Consent updates are sent through:
- `gtag("consent", "default", ...)` (denied defaults)
- `gtag("consent", "update", ...)` from CookieConsent callbacks

## 3) GTM trigger migration

For key tags (`GA4 - All pages`, `Google Ads - All pages`, `Meta - All pages`):

1. Keep tag-level consent checks enabled:
   - GA4 and Ads: `analytics_storage`
   - Meta: `ad_storage`
2. Add `All Pages` (or `Consent Initialization - All Pages`) trigger.
3. Keep legacy `cmplz_*` triggers temporarily only if you still need dual-stack continuity.
4. Plan cleanup: remove `cmplz_*`-only dependency once WordPress is retired from `www`.

## 4) Validate in GTM Preview (staging)

- Accept analytics only:
  - GA4 `page_view` fires
  - marketing tags do not fire
- Accept marketing:
  - Meta/Ads tags fire per consent checks
- Reject all:
  - no analytics/marketing tag firing
- Confirm `andetag_entry` cookie behavior is unchanged

Publish only after these pass.

## 5) Production follow-up

After `P8-11` cutover:

- Re-run GTM Preview checks on `https://www.andetag.museum`.
- Complete `P8-13` and `P8-22` in `docs/phase-8-todo.md`.
- Remove remaining legacy `cmplz_*` coupling if still present.
