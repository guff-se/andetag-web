# GTM + Termly operator runbook

Purpose: **exact UI steps** in **Google Tag Manager** to move off **Complianz-only** firing while the same container (**`GTM-KXJGBL5W`**) may still load on **WordPress + Complianz** until **`www`** cutover. The static site loads **Termly** (resource blocker) **before** **GTM** in **`TrackingHead.astro`**. Strategy and risk acceptance: **`docs/kpi-measurement-map.md`** § Staged rollout, **`docs/migration-exceptions.md`** **EX-0018**.

**When to run (schedule):** Maintainer executes this runbook in **Phase 8** as **`docs/phase-8-todo.md`** **P8-07** — **just before production cutover** (**`P8-11`**), after **P8-06** locale sign-off (unless Gustaf agrees a different slot). **Phase 7** delivers the **Termly** embed, **Consent Mode** defaults, **GTM** loader in source, and documentation; it does **not** require this container work to be finished.

**Prerequisites**

- GTM **edit** access to container **`GTM-KXJGBL5W`** (**`www.andetag.museum`** in exports).
- **Termly** dashboard access (**Pro+** or plan that includes **Google Consent Mode** and **remove logo** if you need white-label).
- Official references: [Set up Termly to obtain user consent](https://support.google.com/tagmanager/answer/14563172) (Google), [How to use Termly with Google Tag Manager](https://support.termly.io/hc/en-us/articles/30710480660881-How-to-use-Termly-with-Google-Tag-Manager), [Google Consent Mode and Termly CMP](https://support.termly.io/en/articles/7904735-google-consent-mode-and-termly-cmp).

**Auto Blocker vs GTM**

The site embed uses Termly **resource blocker** with **`autoBlock=on`**. Termly’s GTM documentation often says **not** to enable **Auto Blocker** when using **GTM**, because it can interfere with how GTM serves scripts. If you see missing tags or broken Preview, switch the embed to **`autoBlock=off`** in **`TrackingHead.astro`** and rely on **GTM Consent Initialization**, the **Termly** community template, **Additional Consent Checks**, and **`Termly.consentSaveDone`** triggers (below).

---

## 0) Safety

1. In GTM, open **Admin → Container → Export Container** (or use a **new Workspace** named e.g. `termly-dual-triggers`) so you can revert.
2. Work in a **workspace**, **Preview** before **Submit** → **Publish**.

---

## 1) Know what the legacy container does

From **`Google Tag Manager v15.json`** (repo root), these tags depend on **Complianz custom events**:

| Tag (legacy name) | Legacy trigger | Consent on tag (export) |
|-------------------|----------------|-------------------------|
| **GA4 - All pages** | **`cmplz_event_statistics`** | **`analytics_storage`** required |
| **Google ads tag - All pages** | **`cmplz_event_statistics`** | **`analytics_storage`** required |
| **Meta - All pages** | **`cmplz_event_marketing`** | **`ad_storage`** required |

Until you change this, **Termly-only** pages **never** fire those tags if they still fire **only** on **`cmplz_*`**, because those events do not exist on the static site.

---

## 2) Termly dashboard and site embed

1. In **Termly**, enable **Google Consent Mode** for the relevant regions and map Termly purposes to **`analytics_storage`**, **`ad_storage`**, **`ad_user_data`**, **`ad_personalization`** as your setup allows ([Termly GCM article](https://support.termly.io/en/articles/7904735-google-consent-mode-and-termly-cmp)).
2. Ensure domains include **staging** (**`andetag-web.guff.workers.dev`**) and **`www.andetag.museum`** for production (**`docs/phase-8-todo.md`** **P8-13**).
3. The Astro site loads the **resource blocker** script from **`TrackingHead.astro`** (UUID **`45781ec1-8b4c-4a0c-acef-9815cd5eabb3`**). Do **not** inject a **second** full Termly CMP load via GTM unless Termly support says otherwise.

**Check on staging:** after accepting categories, use **GTM Preview** and (if needed) **Tag Assistant** to confirm consent updates propagate to Google tags.

---

## 3) GTM: Termly Consent Management Platform template

Per [Termly’s GTM guide](https://support.termly.io/hc/en-us/articles/30710480660881-How-to-use-Termly-with-Google-Tag-Manager):

1. **Templates → Search Gallery →** add **Termly Consent Management Platform**.
2. Create a **Custom Event** trigger: event name **`userPrefUpdate`**, **All Custom Events**.
3. Add a **Tag** of type **Termly Consent Mode** (or the gallery name shown), with **Triggers:** **Consent Initialization – All Pages** **and** **`userPrefUpdate`**.
4. Optionally use **Inject Termly consent management platform script tag** + **Website UUID** only if you are **not** already loading Termly in **`TrackingHead.astro`** (avoid double load).

Align **default** consent between the **Termly dashboard** and **GTM** if you use both paths ([same article](https://support.termly.io/en/articles/7904735-google-consent-mode-and-termly-cmp)).

---

## 4) GTM: open the tags that use `cmplz_*` triggers

For each of:

- **GA4 - All pages**
- **Google ads tag - All pages**
- **Meta - All pages**

### 4a) Confirm consent on the tag

1. **Advanced Settings** → **Consent Settings** (or tag **Consent** section).
2. Keep **Require additional consent** as in the export (**`analytics_storage`** for GA4/Ads “all pages”, **`ad_storage`** for Meta unless policy says otherwise).

### 4b) Add a second firing trigger (dual-trigger pattern, Phase A)

**Goal:** tag still fires on **WordPress** when **`cmplz_event_*`** runs, **and** can fire on **static + Termly** when consent is granted.

1. **Triggering →** add **All Pages** (or **Initialization – All Pages** / **Consent Initialization**, per your GTM version and Consent Mode setup).
2. **Save**.

With **consent** required on the tag, **All Pages** only schedules evaluation; **Termly** + **Consent Mode** still gate execution.

**Double-counting check (WordPress):** In **Preview** on a legacy WP URL, accept cookies and confirm **one** sensible **page_view**, not two.

### 4c) Non-Google tags and consent changes

For tags that must **re-run** when the user changes preferences, add or use a trigger on custom event **`Termly.consentSaveDone`** (see Termly GTM article). It may fire twice on load in some cases; that is expected per Termly.

Repeat **4a–4c** as needed for your container.

---

## 5) Conversion linker

**Tag:** **Conversion linker - All pages**.

- Confirm linker domains (**`andetag.museum`**, **`andetag.understory.io`**, **`checkout.stripe.com`**, **`guff.workers.dev`**, etc.) still match **`www`** and staging.
- Set **consent** per Google guidance (often **`ad_storage`**-related); align with **`docs/tracking-and-consent-requirements.md`** after Termly.

---

## 6) Understory conversion and ecommerce tags

These listen for **`dataLayer`** events, not **`cmplz_*`**:

- **`on_receipt`** → Ads / Meta conversions
- **`understory_*`** → GA4 ecommerce-style events

**GTM Preview** on ticket pages; confirm **`on_receipt`** and funnel events. Failures here are **Understory → `dataLayer`**, not Termly.

---

## 7) Optional engagement tags

Legacy tags with **`consentStatus`: `NOT_SET`**: set **Consent Settings** or pause tags per **`docs/tracking-and-consent-requirements.md`**.

---

## 8) Validate (before Publish)

1. **GTM → Preview** on **`https://andetag-web.guff.workers.dev/...`**
2. Exercise **Termly** banner; confirm **GA4** / **Ads** / **Meta** after consent.
3. If **`www`** still serves **WordPress**, repeat **Preview** there.
4. **Publish** when satisfied.

---

## 9) After **`www`** serves the static stack (Phase B)

1. Remove **`cmplz_*`**-only triggers when WordPress no longer needs them.
2. **Preview** on **`https://www.andetag.museum`**; complete **`docs/phase-8-todo.md`** **P8-13** and **P8-22**.

---

## Quick reference

| Where | What to do |
|-------|------------|
| **Termly** | GCM configured; domains include staging + **`www`**; resource blocker UUID matches **`TrackingHead.astro`** |
| **GTM** | Termly **gallery template** + **`userPrefUpdate`** + **Consent Initialization**; **`Termly.consentSaveDone`** where needed |
| **GA4 / Ads / Meta “all pages”** | Keep **`cmplz_*`** **or** add **All Pages** during dual-stack; keep **consent required** |
| **Linker** | Domains match **`www`**, Understory, Stripe |
| **Understory** | Preview **`on_receipt`** / funnel **`dataLayer`** events |

Deeper context: **`docs/kpi-measurement-map.md`**, **`docs/tracking-and-consent-requirements.md`**, **`docs/decisions/0002-consent-platform-selection.md`** (Termly deep-dive).
