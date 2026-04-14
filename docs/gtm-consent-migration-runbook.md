# GTM consent migration (operator checklist)

Container ID: **GTM-KXJGBL5W**  
Staging URL for tests: **https://andetag-web.guff.workers.dev**  
Live URL for tests after cutover: **https://www.andetag.museum**

---

## Before you start

1. Open **https://tagmanager.google.com**
2. Sign in with the Google account that can edit this container
3. Click the container named **andetag.museum** (or the row that shows **GTM-KXJGBL5W**)

---

## Part A: Add an “All Pages” trigger to three tags

Do this for each tag below. The names must match exactly.

### A1. Tag **GA4 - All pages**

1. Left sidebar: **Tags**
2. Click **GA4 - All pages**
3. Scroll to **Triggering**
4. Click **+** (add trigger)
5. Choose **All Pages** (under **Page View**). If you do not see it: **Trigger Configuration** → **Page View** → **All Pages**
6. Save the trigger dialog, then **Save** the tag

### A2. Tag **Google ads tag - All pages**

1. **Tags** → click **Google ads tag - All pages**
2. **Triggering** → **+**
3. Add **All Pages**
4. **Save**

### A3. Tag **Meta - All pages**

1. **Tags** → click **Meta - All pages**
2. **Triggering** → **+**
3. Add **All Pages**
4. **Save**

### A4. Check consent boxes on those same three tags

For **GA4 - All pages**:

1. Open the tag
2. Open **Advanced Settings** (or **Consent Settings**, depending on GTM UI)
3. Set **Require additional consent for tag to fire** to **Yes**
4. Add consent type **analytics_storage**
5. **Save**

For **Google ads tag - All pages**:

1. Same path: **Consent Settings** (or under **Advanced Settings**)
2. **Require additional consent** → **Yes**
3. Add **analytics_storage**
4. **Save**

For **Meta - All pages**:

1. Same path
2. **Require additional consent** → **Yes**
3. Add **ad_storage**
4. **Save**

If any of these already show the correct consent types, change nothing, only **Save** if you edited triggers.

---

## Part B: Test on staging (do not publish until this passes)

1. Top right: **Preview**
2. Enter **https://andetag-web.guff.workers.dev** → **Connect**
3. When the site opens, complete these four passes. After each pass, look at the **Tag Assistant** panel (left or connected window) and check which tags fired.

**Pass 1 — Reject all optional cookies**

1. Use the cookie banner to reject analytics and marketing (or only accept “necessary”)
2. Reload the page
3. Confirm **GA4 - All pages**, **Google ads tag - All pages**, and **Meta - All pages** do **not** show as fired (or show blocked / consent not granted)

**Pass 2 — Accept analytics only**

1. Open cookie settings, accept **analytics** (or equivalent), do **not** accept marketing
2. Reload or navigate once
3. Confirm **GA4 - All pages** and **Google ads tag - All pages** can fire
4. Confirm **Meta - All pages** does **not** fire

**Pass 3 — Accept marketing**

1. Accept marketing as well
2. Reload or navigate once
3. Confirm **Meta - All pages** fires

**Pass 4 — Booking page (optional but recommended)**

1. Open a page with the booking widget (for example tickets page)
2. With marketing accepted, run a short booking flow if you can
3. In Tag Assistant, note whether Understory-related tags still appear when you expect (add_to_cart, begin_checkout, etc., if configured)

4. Close Preview when done

---

## Part C: Publish

1. Top right: **Submit**
2. **Version name:** e.g. `P8-07 CookieConsent All Pages triggers`
3. **Version description:** optional
4. **Publish**

---

## Part D: After `www` serves the new static site only

1. Repeat **Part B** using **https://www.andetag.museum** instead of staging (Preview → connect to live URL)
2. In GTM **Tags**, open **GA4 - All pages**, **Google ads tag - All pages**, and **Meta - All pages** again
3. Under **Triggering**, **remove** any trigger whose name contains **cmplz** (for example **Custom - cmplz_event_statistics** or **Custom - cmplz_event_marketing**)
4. Leave only **All Pages** on those three tags
5. **Save** each tag
6. **Submit** → **Publish** again

---

## Reference (other docs)

- **`docs/kpi-measurement-map.md`** — background on this container  
- **`docs/phase-8-todo.md`** — P8-07 (before cutover), P8-13 and P8-22 (after live)
