# Phase 1 Analysis Schema

Purpose: define structured tables for Phase 1 population using existing analysis docs and sitemap-derived URL data.

## Reused Inputs

Populate this schema from:

- `docs/existing-site-structure.md`
- `docs/parser-plan.md`
- `site-html/sitemap.xml` and URL matrix inputs

## 1) Header and Footer Variant Registry

| variant_id | type | elementor_id | languages | source_files | nav_variant | notes | status |
|------------|------|--------------|-----------|--------------|-------------|-------|--------|
| header-192 | header | 192 | sv,en,de | index.html,en.html,de-*.html | sv-main/en-main/de-main | hero style | draft |
| footer-207 | footer | 207 | sv,en | index.html,en.html | n/a | schema in html widget | draft |

Field notes:

- `type`: `header` or `footer`
- `status`: `draft`, `validated`, `deprecated`

## 2) Navigation Variant Coverage by Language/Context

| nav_variant_id | lang | destination_context | source_header_variant | depth_max | has_cta_item | evidence_files | validation_status | notes |
|----------------|------|---------------------|-----------------------|-----------|--------------|----------------|-------------------|-------|
| sv-main | sv | stockholm | header-192 | 2 | yes | index.html | draft | includes tickets CTA |

Field notes:

- `destination_context`: `stockholm`, `berlin`, `shared`
- `validation_status`: `draft`, `validated`, `needs-review`

## 3) Widget Coverage Matrix by Page

| page_id | source_file | canonical_path | lang | widget_family | count | criticality | mapped_component | mapping_status | notes |
|---------|-------------|----------------|------|---------------|-------|-------------|------------------|----------------|-------|
| 3729 | en-stockholm-faq.html | /en/stockholm/faq/ | en | nested-accordion.default | 1 | high | AccordionSection | mapped | faq body |

Field notes:

- `criticality`: `high`, `medium`, `low` for migration priority
- `mapping_status`: `mapped`, `partial`, `unmapped`

## 4) Integration Disposition Matrix

| integration | current_usage | pages_or_templates | business_role | disposition | rationale | replacement_target | phase_target | risk_level | notes |
|-------------|---------------|--------------------|---------------|-------------|-----------|--------------------|--------------|------------|-------|
| gtm | global | header/footer templates | attribution and analytics | keep | required in grand plan | GTM in static runtime | 6 | medium | consent gating required |

Disposition values:

- `keep`
- `replace`
- `remove`

## 5) Known Gaps and Unknowns Register

| gap_id | area | description | source_reference | impact | owner | resolution_status | target_phase |
|--------|------|-------------|------------------|--------|-------|-------------------|--------------|
| GAP-001 | widget mapping | tripadvisor shortcode handling | parser-plan.md | medium | AI agent | open | 1 |

## Population Rules

1. Do not invent variants or integrations not present in source artifacts.
2. Every row must include source evidence (`source_files`, `source_reference`, or both).
3. Unknown items must be explicitly logged in the gaps register.
4. Schema updates that add/remove columns must be reflected in `docs/parser-plan.md` or related policy docs when contract impact exists.
