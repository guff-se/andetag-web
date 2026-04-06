# Phase 3 Fixture Strategy, Layout and Component Regressions

Purpose: define deterministic fixture coverage for layout and upcoming component regression checks, so CI-facing tests can validate behavior without ad hoc inline test data.

## Scope

This strategy covers:

- Existing layout regressions from Phase 2 outputs (navigation, selectors, page layout model, Swedish footer model).
- Component fixture requirements for Phase 3 implementation tasks (`P3-04` through `P3-06`).

## Source Integrity Rules

- Every fixture case must map to source-backed behavior in:
  - `docs/phase-1-analysis-schema.md`
  - `docs/existing-site-structure.md`
  - `docs/content-model.md`
- Do not invent route, variant, or language behaviors that are not documented in source artifacts.
- If a fixture cannot be tied to source evidence, log the gap in `docs/migration-exceptions.md` before use.

## Implemented Fixture Artifacts (P3-02)

- `site/src/lib/chrome/fixtures.ts`
  - `NAVIGATION_FIXTURES`
  - `SELECTOR_FIXTURES`
  - `PAGE_LAYOUT_FIXTURES`
  - `FOOTER_SV_EXPECTED_SECTION_TITLES`
  - `FOOTER_SV_EXPECTED_GROUPED_SECTION_TITLES`
  - `FOOTER_SV_EXPECTED_PRIVACY_LABEL`

## Tests Wired to Fixture Inputs

- `site/src/lib/chrome/layout.test.ts`
  - Uses `NAVIGATION_FIXTURES` and `SELECTOR_FIXTURES`
- `site/src/lib/chrome/page-layout.test.ts`
  - Uses `PAGE_LAYOUT_FIXTURES`
- `site/src/lib/chrome/footer-sv.test.ts`
  - Uses footer fixture expectations

## Fixture Coverage Matrix

| area | fixture id or set | source rationale | current status |
|------|-------------------|------------------|----------------|
| navigation mapping | `sv-small-header-desktop` | `chrome-hdr-sv-stockholm-small` maps to `sv-main` in variant registry | implemented |
| navigation mapping | `en-brand-desktop` | `chrome-hdr-en-stockholm-brand` desktop maps to `en-brand` | implemented |
| mobile fallback mapping | `en-brand-mobile-fallback` | `chrome-hdr-en-stockholm-brand` mobile fallback maps to `en-main` | implemented |
| legacy header alias mapping | `legacy-berlin-alias-header` | `header-4136` resolves to `chrome-hdr-en-berlin-hero` (**EX-0005**) | implemented |
| selector independence | `english-stockholm-selectors` | destination and language controls stay independent | implemented |
| canonical and hreflang model | `stockholm-en-tickets` | canonical and language-link hooks for core route | implemented |
| legacy route model | `legacy-berlin-alias-route` | alias reconciliation behavior for Berlin EN route | implemented |
| footer structure | footer expected title sets | source-backed Swedish footer columns and policy link | implemented |

## Component Fixture Contract (for P3-04 and P3-05)

Before implementing a new component test, add deterministic fixtures with this schema:

```ts
type ComponentFixture<TProps> = {
  id: string;
  sourceRef: string;
  props: TProps;
  expected: {
    hasPrimaryCta?: boolean;
    hasFallbackState?: boolean;
    requiredText?: string[];
    requiredLinks?: string[];
  };
};
```

Rules:

- `id` is stable and descriptive.
- `sourceRef` points to the source artifact or analysis row used as evidence.
- `props` is minimal data required to render the component.
- `expected` captures assertable behavior only (no vague visual claims).

## Change Management

- Add fixture updates in the same PR/task as behavior changes.
- If fixture changes alter expected behavior, update `docs/phase-3-todo.md` and `CHANGELOG.md`.
- If fixture changes imply policy or contract updates, also update:
  - `docs/content-model.md`
  - `docs/parser-plan.md`
  - `docs/migration-exceptions.md` (if deviation applies)
