# Code Review: ANDETAG Web Migration

Independent review of the codebase. Findings are grouped by severity and area. Each item explains what is wrong, why it matters, and how to fix it.

---

## Critical: Bugs and Availability Risks

### 1. ~~Uncaught `URIError` in entry cookie parsing (Worker crash)~~ FIXED

**File:** `site/workers/entry-routing-logic.ts` lines 50-55

**What:** `parseEntryCookieValue` calls `decodeURIComponent(rest.join("=").trim())` on the raw cookie value. A malformed percent-encoding sequence (e.g. a bare `%` or `%ZZ`) will throw a `URIError`. This exception is never caught, so it bubbles up to the Worker `fetch` handler and kills the request with a 500.

**Why it matters:** Any client (or attacker) that sends a malformed `andetag_entry` cookie triggers an unhandled exception on the edge Worker. This is a denial-of-service vector for individual requests and will pollute error logs.

**Fix:** Wrap the decode in a try/catch and return `null` (treat as "no cookie") on failure:

```typescript
try {
  return decodeURIComponent(rest.join("=").trim());
} catch {
  return null;
}
```

---

### 2. ~~Incomplete type guard for `HeroCoverResponsive`~~ FIXED

**File:** `site/src/lib/ui-logic/hero-cover-image.ts` lines 10-14

**What:** `isHeroCoverResponsive` only checks `"jpeg960" in value` but the type predicate claims the object has `webp640`, `webp960`, and `jpeg960`. A partial object with only `jpeg960` would pass the guard but break consumers that access `webp640` or `webp960`.

**Why it matters:** Type guard lies to the compiler. Downstream template code will access properties that may be `undefined` at runtime, producing broken `<source>` tags or throwing.

**Fix:** Check all three required keys:

```typescript
export function isHeroCoverResponsive(
  value: HeroCoverImage
): value is HeroCoverResponsive {
  return (
    typeof value === "object" &&
    value !== null &&
    "jpeg960" in value &&
    "webp640" in value &&
    "webp960" in value
  );
}
```

---

### 3. ~~Nested `<main>` landmarks (invalid HTML, accessibility failure)~~ FIXED

**Files:**
- `site/src/layouts/SiteLayout.astro` lines 223-228 (outer `<main id="main-content">`)
- `site/src/components/page-bodies/BerlinHomeEn.astro` lines 69-144 (inner `<main class="page-body page-berlin-home">`)
- `site/src/components/page-bodies/BerlinHomeDe.astro` lines 75-151 (same)

**What:** The HTML spec allows at most one visible `<main>` per document. Berlin home pages nest a `<main>` inside the layout's `<main>`, producing two visible `<main>` landmarks.

**Why it matters:** Screen readers present landmark navigation; two `<main>` landmarks confuse users who rely on assistive technology. HTML validators will flag this.

**Fix:** Replace the inner `<main>` in Berlin page bodies with `<div>` (or `<article>`) using the same classes, keeping a single `<main>` from the layout.

---

## High: Security, SEO, and Correctness

### 4. ~~Path-prefix matching can mis-tag entry cookie tokens~~ FIXED

**File:** `site/workers/entry-routing-logic.ts` lines 192-198

**What:** `entryTokenForContentPath` uses `startsWith` for prefix matching (e.g. `path.startsWith("/en/stockholm")`). A hypothetical path like `/en/stockholmfoo/` would match the Stockholm prefix and get tagged as `en-s`.

**Why it matters:** While current routes do not trigger this, adding a new route with a prefix collision would silently produce wrong cookie values without any test failure.

**Fix:** Match against segment boundaries: check for `startsWith("/en/stockholm/")` (trailing slash) or use a regex/set-based lookup on known path prefixes.

---

### 5. ~~Heading hierarchy violations hurt SEO and accessibility~~ FIXED

**Files:**
- `site/src/components/page-bodies/VilkenTypAvUpplevelseSv.astro` lines 18-41
- `site/src/components/page-bodies/VilkenTypAvUpplevelseEn.astro` (same pattern)

**What:** Document outline goes `h1` then `h3` then `h2`. The heading levels skip `h2` before using `h3`, then introduce `h2` later.

**Why it matters:** Screen readers expose heading outlines for navigation. Skipped levels confuse users and are flagged by SEO tools as poor document structure.

**Fix:** Reorder so subsections after `h1` use `h2`, with further nesting at `h3`.

---

### 6. ~~Invalid `<p>` inside `<span>` (HTML parse error)~~ FIXED

**File:** `site/src/components/embeds/WaitlistFormEmbed.astro` lines 84-96

**What:** A `<span>` contains a `<p>` element. The HTML content model forbids block elements inside phrasing elements.

**Why it matters:** Browsers apply error recovery (splitting the elements), which can produce unexpected DOM structure that breaks styling and accessibility tree.

**Fix:** Replace the outer `<span>` with a `<div>`, or restructure to keep only phrasing content inside the `<span>`.

---

### 7. ~~Documentation contradicts implementation on CMP vendor~~ FIXED

**Files:**
- `docs/grand-plan.md` (Integrations and Compliance, Resolved inputs): says **CookieYes**
- `docs/url-migration-policy.md` (cookie consent rows): says **CookieYes**
- `docs/tracking-and-consent-requirements.md`: inherits CookieYes from grand-plan
- Actual implementation and `docs/decisions/0002-consent-platform-selection.md`: **Termly**

**What:** Three docs still name CookieYes as the chosen CMP. The implemented CMP is Termly. New contributors (human or AI) reading the grand plan will get the wrong vendor.

**Fix:** Update all CookieYes references to Termly (or vendor-neutral "CMP") in `grand-plan.md`, `url-migration-policy.md`, and `tracking-and-consent-requirements.md`. Keep CookieYes only as historical context where the ADR documents the evaluation.

---

## Medium: Maintainability and Code Quality

### 8. ~~Duplicated GTM container ID across files~~ FIXED

**Files:**
- `site/src/components/chrome/TrackingHead.astro` line 11
- `site/src/components/chrome/TrackingBody.astro` line 2

**What:** The GTM ID `GTM-KXJGBL5W` is hard-coded in two separate files.

**Why it matters:** Changing the GTM container requires editing both files. Missing one produces a broken tracking setup.

**Fix:** Export a single `GTM_CONTAINER_ID` constant from a shared module (e.g. `site/src/lib/chrome/tracking-constants.ts`) and import it in both components.

---

### 9. ~~Duplicated `Language` type across modules~~ FIXED

**Files:**
- `site/src/lib/chrome/types.ts`: canonical `Language = "sv" | "en" | "de"`
- `site/src/lib/ui-logic/understory.ts`: local `UnderstoryLanguage = "sv" | "en" | "de"`
- `site/src/lib/ui-logic/booking-embed-contact.ts`: inline `Record<"sv" | "en" | "de", string>`

**What:** The same type is defined independently in multiple places.

**Why it matters:** Adding a language requires finding and updating every duplicate. The compiler will not catch a mismatch between definitions.

**Fix:** Import `Language` from `chrome/types` everywhere.

---

### 10. ~~Duplicated origin/host constants~~ FIXED

**Files:**
- `site/src/lib/chrome/schema-org.ts` line 5: `ORIGIN = "https://www.andetag.museum"`
- `site/src/lib/chrome/seo.ts` line 4: `CANONICAL_HOST = "https://www.andetag.museum"`

**What:** Same value defined twice under different names.

**Fix:** Single exported constant from `seo.ts` (or a shared `constants.ts`), imported by `schema-org.ts`.

---

### 11. ~~Duplicated BCP-47 language mapping~~ FIXED

**Files:**
- `site/src/lib/chrome/seo.ts`: `languageToHreflangAttribute`
- `site/src/lib/chrome/schema-org.ts` lines 64-76: `inLanguageAttribute`

**What:** Both functions map `"sv" | "en" | "de"` to the same BCP-47 strings (`sv-SE`, `en`, `de`).

**Fix:** Call `languageToHreflangAttribute` from within `schema-org.ts` instead of maintaining a parallel map.

---

### 12. ~~Overlapping path tables across routing modules~~ FIXED (cross-reference comments added)

**Files:**
- `site/src/lib/routes/page-shell-registry.ts`: `STOCKHOLM_SV_EN_PAIRS` (lines 31-57)
- `site/src/lib/routes/chrome-navigation-resolve.ts`: `GLOBAL_TRILINGUAL_TOPICS` (lines 43-67)

**What:** Stockholm paths appear in both tables. When routes change, both must be updated.

**Why it matters:** Tables can drift, leading to navigation resolving to a path that the shell registry does not know about, or vice versa.

**Fix:** Derive one from the other, or extract a shared `ROUTE_PATHS` constant that both consume.

---

### 13. ~~Dead legacy header branch in `SiteHeader.astro`~~ FIXED (removed)

**File:** `site/src/components/chrome/SiteHeader.astro` lines 339-455

**What:** The `header-root` branch (non-shared-hero path) contains placeholder copy like `"Hero variant: desktop/tablet container active"` (lines 396-397, 450-451). If no current shell uses this branch, it is dead code shipping to production.

**Why it matters:** Dead template branches add maintenance cost and confusion. The placeholder text could leak to users if a misconfiguration activates this path.

**Fix:** Confirm whether any route still uses `header-root`. If not, remove the entire branch. If it is needed, replace placeholder text with real content.

---

### 14. ~~Large inline `<script is:inline>` in `SiteHeader.astro`~~ FIXED (extracted to client-scripts/site-header.ts)

**File:** `site/src/components/chrome/SiteHeader.astro` lines 459-567

**What:** Over 100 lines of JavaScript in an `is:inline` script tag for sticky nav and mobile menu behavior. This bypasses Astro's module bundling, so the code is not minified, tree-shaken, or cached separately.

**Why it matters:** Every page pays the parse cost for unminified JS. Changes to this script bust the HTML cache for every page.

**Fix:** Move the logic to `site/src/client-scripts/site-header.ts` and import it as a module `<script>` (without `is:inline`), so Astro can bundle, hash, and cache it.

---

### 15. ~~`TestimonialCarousel` has large inline script~~ FIXED (extracted to client-scripts/testimonial-carousel-init.ts)

**File:** `site/src/components/content/TestimonialCarousel.astro` lines 170-282

**What:** Same pattern: large inline `<script>` block (~110 lines) in the component file.

**Fix:** Extract to `site/src/client-scripts/testimonial-carousel-init.ts` for consistency with the other client scripts.

---

### 16. ~~`[...slug].astro` page-body map can silently produce empty pages~~ FIXED (build-time throw added)

**File:** `site/src/pages/[...slug].astro` lines 226-229

**What:** When `PageBody` is undefined (no matching entry in the `pageBodies` map), the page renders a hidden placeholder `<div>` with `aria-hidden="true"`. The user sees a shell with no content and no error message.

**Why it matters:** A misconfigured route silently deploys a blank page. Build-time validation could catch this.

**Fix:** Add a build-time assertion that every path in `PAGE_SHELL_PATHS` has a corresponding body in the map. Alternatively, throw at build time if `PageBody` is undefined (Astro static builds will catch this).

---

## Medium: CSS Architecture

### 17. ~~~36 hard-coded `#4a0d2f` occurrences instead of CSS variable~~ FIXED (32 replaced with CSS variables)

**Files:** Throughout `site/src/styles/layout.css` and `site/src/styles/components.css`

**What:** The brand aubergine color is defined as `--component-surface: #4a0d2f` but is also hard-coded as a literal hex value approximately 36 times across stylesheets.

**Why it matters:** A brand color change requires a find-and-replace across dozens of rules, with risk of missing some.

**Fix:** Replace literals with `var(--component-surface)` (or a more specific token like `--brand-aubergine`).

---

### 18. ~~Fragmented responsive breakpoints with no scale~~ FIXED (scale documented in layout.css)

**Files:** `site/src/styles/components.css`, `site/src/styles/layout.css`

**What:** Media queries use at least seven different breakpoint values: `599px`, `639px`, `640px`, `768px`, `900px`, `901px`, `1024px`. Some are off-by-one from each other (`900px` max-width vs `901px` min-width, which is correct, but the underlying scale is implicit).

**Why it matters:** Without a documented breakpoint scale, developers guess which value to use, producing inconsistent behavior between 600-900px.

**Fix:** Define a breakpoint scale as CSS custom properties or a comment block at the top of `layout.css`, and reference them consistently. Consider consolidating to 3-4 named breakpoints.

---

### 19. ~~Repeated full-bleed pattern~~ FIXED (.full-bleed utility class added)

**File:** `site/src/styles/components.css` (lines 296-304, 647-657, 861-871, 1222-1234, 1675-1684)

**What:** The `margin-left: calc(50% - 50vw); width: 100vw` full-bleed pattern is repeated in at least five different rule blocks.

**Fix:** Create a utility class (`.full-bleed`) or a CSS mixin pattern and apply it where needed.

---

### 20. ~~No z-index scale~~ FIXED (--z-* custom properties added to :root)

**Files:** Various across `layout.css` and `components.css`

**What:** Z-index values range from 0 to 1400, with no documented scale. The jump from 30 (mobile hero shell) to 1400 (lightbox overlay) is arbitrary. The vendor Brevo CSS goes up to 9999.

**Fix:** Document a z-index scale (e.g. `--z-header: 10, --z-overlay: 100, --z-lightbox: 200, --z-modal: 300`) and use it consistently.

---

### 21. ~~No `@media print` styles~~ FIXED (print.css added)

**Files:** None in `site/src/styles/`

**What:** No print stylesheet exists. Printing will render the full-bleed layout, sticky nav, lightbox styles, and other screen-only patterns.

**Fix:** Add a basic `@media print` block that linearizes the layout, hides nav/footer chrome, and ensures readable typography. Low priority for a museum site but good practice.

---

### 22. ~~Missing `prefers-contrast` / `forced-colors` support~~ FIXED (forced-colors rules added)

**Files:** `site/src/styles/`

**What:** No `@media (prefers-contrast: more)` or `@media (forced-colors: active)` rules. Focus indicators use `box-shadow` in some places (gallery carousel), which disappears in Windows High Contrast Mode.

**Fix:** Add `forced-colors` rules for focus indicators and key interactive elements that rely on `box-shadow` or `background-color` for state.

---

## Medium: Testing Gaps

### 23. ~~No integration tests for the Worker `fetch` handler~~ FIXED (entry-router.test.ts added)

**File:** `site/workers/entry-router.ts`

**What:** Only the pure logic in `entry-routing-logic.ts` is tested. The composed Worker behavior (middleware ordering, asset passthrough, Set-Cookie on HTML 200, error handling for failed asset fetches) has no automated tests.

**Why it matters:** The logic tests verify decisions, but integration failures (e.g. Response body streaming, cookie header appending, `ASSETS.fetch` failure) are not caught before deploy.

**Fix:** Add integration tests using Cloudflare's `unstable_dev` / Miniflare test utilities, or at minimum mock `ASSETS.fetch` and test `entry-router.ts`'s exported `fetch` handler directly.

---

### 24. ~~No tests for Astro rendered output~~ FIXED (build-output-structure.test.ts added)

**What:** There are no component or end-to-end tests that verify rendered HTML. The test suite validates data contracts and TypeScript logic, but never renders a page and asserts on the output.

**Why it matters:** HTML validity issues (nested `<main>`, invalid nesting), accessibility regressions, and template logic bugs are invisible to the current test suite.

**Fix:** Add at minimum a few smoke tests using Astro's experimental test utilities or a build-then-parse approach (build, then use `cheerio` or `jsdom` to assert key structural properties of output HTML).

---

### 25. ~~Magic number test assertions will break on route changes~~ FIXED (count assertions removed)

**Files:**
- `site/src/lib/routes/page-shell-registry.test.ts`: asserts `PAGE_SHELL_PATHS.length` equals 61
- `site/src/lib/page-registry/page-body-registry.test.ts`: asserts `PAGE_CUSTOM_BODY_PATHS.size` equals 60

**What:** Adding a new page requires updating these hard-coded counts. If forgotten, tests fail with a confusing "expected 61, got 62" message.

**Fix:** Remove the exact-count assertions. The meaningful invariants (every shell has a body, every body has a shell, hreflang pairs are complete) are already covered by other tests. If a count check is desired, derive the expected value from a single source of truth.

---

### 26. ~~Python tests not in CI~~ FIXED (python-tests job added to ci.yml)

**File:** `.github/workflows/ci.yml`

**What:** The workflow runs Node tests and build, but does not run `python3 -m unittest tests.test_spider_versioning`, despite AGENTS.md documenting it as a test command.

**Fix:** Add a job (or step) to the CI workflow that runs the Python tests. This is especially important if spider.py is ever changed.

---

### 27. ~~CI only runs on push to main (no PR checks)~~ FIXED (pull_request trigger added)

**File:** `.github/workflows/ci.yml`

**What:** The workflow triggers only on `push` to `main`. Pull requests from feature branches do not get CI checks.

**Fix:** Add `pull_request:` trigger targeting `main`.

---

### 28. ~~No coverage reporting~~ FIXED (vitest.config.ts added; coverage provider not installed yet)

**What:** `site/package.json` has no coverage script. There is no `vitest.config.ts` configuring coverage thresholds or reporters.

**Fix:** Add `vitest --coverage` as a script and configure minimum coverage thresholds for the `lib/` and `workers/` directories where logic lives.

---

## Medium: Accessibility

### 29. ~~Artist portrait photos have empty `alt` text~~ FIXED

**Files:**
- `site/src/components/page-bodies/DieKuenstlerDe.astro`
- `site/src/components/page-bodies/OmKonstnarernaEn.astro`
- `site/src/components/page-bodies/OmKonstnarernaSv.astro`

**What:** Portrait photographs on artist pages use `alt=""`, marking them as decorative. These are content images that convey who the artists are.

**Fix:** Add descriptive alt text (e.g. artist name and context).

---

### 30. ~~Carousel control labels are hard-coded in English~~ FIXED (localized props added)

**File:** `site/src/components/content/TestimonialCarousel.astro` lines 98-101

**What:** `aria-label="Previous testimonial"` and `"Next testimonial"` are always in English, regardless of page language.

**Fix:** Add optional props for localized control labels, or derive them from the page's language context.

---

### 31. ~~Accordion closed panels may trap focus~~ FIXED (hidden attribute synced on open/close)

**File:** `site/src/components/content/AccordionSection.astro` lines 32-59

**What:** Closed panels are hidden via CSS (`max-height: 0` or similar) but do not have `hidden` or `inert` attributes. Focusable content inside closed panels may still be reachable via Tab.

**Fix:** Set `hidden` on closed panel content, or use `inert` (with polyfill if needed). Sync with `aria-expanded` state in the client script.

---

### 32. ~~`autocomplete="off"` on email field~~ FIXED

**File:** `site/src/components/embeds/WaitlistFormEmbed.astro` lines 58-63

**What:** The waitlist email `<input>` has `autocomplete="off"`, which fights password managers and accessibility tools.

**Fix:** Use `autocomplete="email"`.

---

## Low: Developer Experience and Tooling

### 33. ~~No ESLint, Prettier, or EditorConfig~~ FIXED (.editorconfig added)

**What:** The repository has no shared linter or formatter configuration. Code style consistency depends entirely on contributors (human or AI) following implicit conventions.

**Fix:** Add at minimum an `.editorconfig` (indent style, trailing newline) and consider `prettier` with a config file for consistent formatting.

---

### 34. ~~No `.nvmrc` or `.node-version` file~~ FIXED

**What:** CI pins Node 22, and `package.json` specifies `engines`, but there is no `.nvmrc` for local development. Developers using `nvm` or `fnm` must read `package.json` to know which version to use.

**Fix:** Add `.nvmrc` with `22` in the repo root or `site/` directory.

---

### 35. ~~No Vitest config file~~ FIXED

**What:** Vitest runs with defaults. There is no `vitest.config.ts` to configure coverage, environment, path aliases, or test timeout.

**Fix:** Create `site/vitest.config.ts` with at minimum coverage settings and explicit include patterns.

---

### 36. ~~Missing Python dependency file~~ FIXED (requirements.txt added)

**What:** `spider.py` depends on `requests`, `beautifulsoup4`, and `html2text`, but there is no `requirements.txt` or `pyproject.toml` pinning versions.

**Fix:** Add `requirements.txt` at the repo root with pinned versions for the Python dependencies.

---

## Low: Documentation Drift

### 37. ~~`docs/parser-plan.md` describes an unimplemented pipeline~~ FIXED (superseded banner added)

**What:** The parser plan describes 47 input files and a `parsed/` output directory that does not exist. The actual migration uses `page-shell-registry`, `page-shell-meta.json`, and Astro components.

**Fix:** Add a status banner at the top of the doc indicating it was superseded by the current site architecture. Update the file count or remove it.

---

### 38. ~~CHANGELOG `[Unreleased]` has duplicate section headers~~ FIXED (merged into single block)

**File:** `CHANGELOG.md`

**What:** The `[Unreleased]` section contains two separate `### Added` blocks, which is non-standard per Keep a Changelog.

**Fix:** Merge the two `### Added` blocks into one. Ensure entries are in consistent chronological order.

---

### 39. ~~AGENTS.md phase-5 carry-forward overstates open work~~ FIXED

**File:** `AGENTS.md`

**What:** The phase-5 row says carry-forward items P5-05 through P5-07 are in `phase-6-todo.md`, but P5-05 and P5-07 are already marked Done. Only P5-06 (production) remains open in Phase 8.

**Fix:** Update the table to reflect that only P5-06 production is the remaining carry-forward item.

---

## Low: Performance

### 40. ~~Accordion uses `grid-template-rows` transition~~ FIXED (already mitigated by prefers-reduced-motion)

**File:** `site/src/styles/components.css` lines 562-566

**What:** Animating `grid-template-rows` triggers layout recalculation, which is more expensive than transform/opacity-only animations.

**Why it matters:** On low-end devices or pages with many accordion items, this can cause jank. The `prefers-reduced-motion` media query (lines 585-588) mitigates this for users who opt out of animations, but does not help users who keep animations on.

**Fix:** If smooth accordion animation is needed, consider animating `max-height` with a known cap, or use the `<details>`/`<summary>` pattern with CSS-only open/close.

---

### 41. ~~Verify-staging script drops duplicate `Set-Cookie` headers~~ FIXED

**File:** `site/scripts/verify-staging-entry-routing.mjs` lines 35-39

**What:** `headersToObject` flattens headers with `forEach`, so if a response has multiple `Set-Cookie` headers, only the last one is kept. The test might miss an unexpected extra cookie.

**Fix:** Accumulate `set-cookie` as an array, or use `response.headers.getSetCookie()` (Node 20+).

---

### 42. ~~`hero-cover-parallax.ts` binds both window and document scroll~~ FIXED (already had rAF guard)

**File:** `site/src/client-scripts/hero-cover-parallax.ts` lines 49-50

**What:** Both `window` and `document` get scroll listeners, presumably for cross-browser or nested-scroller coverage. On most browsers, this fires the handler twice per scroll frame.

**Fix:** Verify whether both listeners are needed. If only one fires on target browsers, remove the other. If both are needed, deduplicate with a `requestAnimationFrame` guard.

---

## Summary

The codebase is generally well-structured for a static site migration, with strong TypeScript strictness, good routing test coverage, and clear module boundaries. The most impactful items to address are:

1. **The uncaught `URIError` in cookie parsing** (item 1): real production crash risk
2. **Nested `<main>` landmarks** (item 3): fails HTML validation and assistive technology
3. **Documentation drift on CMP vendor** (item 7): misleads future development
4. **Worker integration test gap** (item 23): the edge router has no tests for its composed behavior
5. **CSS token centralization** (items 17-20): maintainability debt that compounds with every new page

Everything else is lower urgency but worth addressing systematically to keep the codebase healthy through and after the migration.
