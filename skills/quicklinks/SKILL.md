---
name: quicklinks
description: Manages 302 shortlink rules in the Quicklinks section of site/public/_redirects (e.g. /spotify, /presskit, print UTM codes). Triggers include "add a shortlink", "change the Spotify redirect", "retarget /z6ch", "remove the oneyear quicklink", "update quicklinks", or any request that adds, edits, or removes Pretty Links–style 302 paths. Does not own legacy 301 path migrations, the /stockholm/* splat, entry routing, or any line outside the Quicklinks block in _redirects.
---

## Purpose

Maintain **302 quicklinks** in **`site/public/_redirects`**: short first-party paths (campaigns, print codes, press kit, external destinations) with flexible retargeting. Per **`docs/url-migration-policy.md`** (Pretty Links–style paths), these live in a **comment-marked block immediately before** the **`/stockholm/*`** rule.

**Hard scope — `_redirects` file:** The agent may **only** change text **inside the Quicklinks section** of **`site/public/_redirects`**. It must **never** add, delete, or edit any line **outside** that section (all legacy **301** rules, **`/display`**, the **`/stockholm/*`** splat, the Worker/entry `index` comment at EOF, or any other line).

**Not for:** canonical URL moves (**301**), new content pages, **`docs/url-migration-policy.md`** edits, or **Worker** / **entry-router** behavior. Those belong to **`skills/page/SKILL.md`**, **SEO** / **site-integrity** workflows, or infra owners.

## When to use

- Add, remove, or retarget a **302** short path (`/spotify`, `/presskit`, `/?utm_…` campaign slugs, etc.).
- User names **`_redirects`**, "shortlink", "quicklink", "Pretty Links", or points at the block above **`/stockholm/*`**.

**Stop and use another skill (or ask):** the change belongs to the **non–quicklink** portion of **`_redirects`**, or to **`url-matrix.csv` / registries** for a **301** page rename.

## The Quicklinks section (bounds)

**File:** `site/public/_redirects` (repo root; path under `site/` is `site/public/_redirects`).

**Start:** The first line that is exactly:

```text
# -----------------------------------------------------------------------------
```

**that begins the banner whose next non-empty comment line is `# Quicklinks`** (the standard banner already in the file).

**End:** The last non-blank line **before** the **`/stockholm/* /sv/stockholm/:splat 301`** rule. Everything from that banner through the blank line(s) immediately above **`/stockholm/*`** is the editable region, including:
- the `# Quicklinks` / `# Quicklinks (302)` comments;
- all **`/… 302`** rule lines;
- internal blank lines used for readability.

**Immutable fence — do not touch:**

- **Above** the start banner: the entire legacy **301** block, privacy rules, **WordPress** archive redirects, and every other line.
- **At or below** `/stockholm/*` through end of file: the splat rule and trailing comments (e.g. Worker note).

If the file structure ever changes, re-locate the block using: **"comment block immediately before `/stockholm/*`"** and still **do not** edit anything outside the quicklinks `302` group.

## Format rules (inside the section)

- **Status:** **`302`** for all quicklink rows (retargeting-friendly), unless product explicitly requests **301** for a *permanent* public URL policy change (rare; confirm with **SEO** / policy owner).
- **Pairs:** For each path, keep **two** lines—**without** and **with** trailing slash—same target and code, matching existing entries:

  ```text
  /mylink https://example.com/target 302
  /mylink/ https://example.com/target 302
  ```

- **Whitespace:** One space between source, destination, and code; no tabs unless the file already uses them (it does not).
- **Destinations:** Use real **https:** URLs the user (or ticket) provided. Do not invent **Drive**, **Brevo**, or third-party IDs.
- **Ordering:** Add new entries next to related rows or alphabetically by path; do not reorder unrelated legacy **301** rules (they are out of scope anyway).

## Workflow

1. Open **`site/public/_redirects`**. Scroll to **`/stockholm/*`**. The Quicklinks block is **directly above** it.
2. **Confirm** you are only editing lines between the **Quicklinks** banner and the blank line(s) before **`/stockholm/*`**. If the edit would touch any other line, **stop** and route to the correct skill or owner.
3. Apply add/remove/retarget. Preserve slash pairs for new paths.
4. **New path** (not just changing a target on an existing slug): add a matching **`docs/url-matrix.csv`** row with **`status=redirect`**, **`redirect_type=302`**, and **`notes`** describing the ops/campaign quicklink, following nearby rows (e.g. `spotify`, `z6ch`, `presskit`). **Retargeting an existing URL only:** update the matrix **`canonical_url`** (destination) column if the matrix documented the old absolute target.
5. If the user asked for a link used in **printed materials**, confirm the slug and target before merging.

## Verification

- Eyeball: quicklinks block contains only **302** rules (and `#` comments; no **301** in that block).
- Confirm the **`/stockholm/* /sv/stockholm/:splat 301`** line is still present **once** and unmodified.
- `cd site && npm run build` — should succeed; `_redirects` is copied to **`dist/_redirects`**.

Deeper redirect audits: **`skills/site-integrity/SKILL.md`**. Policy context: **`docs/url-migration-policy.md`** (Pretty Links–style paths).

## When to escalate

- Need to add or change a **301** rule, **splat** behavior, or **entry** routing.
- Unsure whether a path should be a **302** quicklink or a **canonical** site URL (use **page** / **SEO**).
- User cannot provide a destination URL for an external or form link.

## Examples

- **"Point `/spotify` at a new album":** In the Quicklinks block only, update both `/spotify` and `/spotify/` lines to the new **https** URL; if **`url-matrix.csv`** listed the old Spotify URL as destination, update that cell.
- **"Add `/summer` → our newsletter signup":** In the Quicklinks block, add the slash pair with **302**; add a **`url-matrix.csv`** **redirect** row for **`https://www.andetag.museum/summer/`** (and matching destination).
