# Phase 1 Analysis Schema

Purpose: define structured tables for Phase 1 population using existing analysis docs and sitemap-derived URL data.

## Reused Inputs

Populate this schema from:

- `docs/existing-site-structure.md`
- `docs/parser-plan.md`
- `site-html/sitemap.xml`
- `docs/url-matrix.csv`

## 1) Header and Footer Variant Registry

| variant_id | type | elementor_id | languages | source_files | nav_variant | notes | status |
|------------|------|--------------|-----------|--------------|-------------|-------|--------|
| header-192 | header | 192 | sv | index.html | sv-main | Swedish hero header with desktop/mobile video backgrounds and `#book` CTA anchor | validated |
| header-918 | header | 918 | en | en.html | en-main | English hero header, same video pattern as Swedish hero variant | validated |
| header-4344 | header | 4344 | de | de.html, de-berlin.html | de-main | German hero header used for Berlin pre-launch pages | validated |
| header-2223 | header | 2223 | sv | stockholm-*.html, musik.html, om-andetag.html | sv-main | Swedish small header for non-hero pages | validated |
| header-3305 | header | 3305 | en | en-stockholm-*.html | en-main | English small header for most English Stockholm pages | validated |
| header-4287 | header | 4287 | en | en-about-andetag.html, en-optical-fibre-textile.html, en-about-the-artists-malin-gustaf-tadaa.html, en-music.html | en-brand | English brand menu on desktop with simplified art-focused navigation | validated |
| header-4136 | header | 4136 | en | en-berlin-en.html | en-berlin | Single-page English Berlin variant, not listed in preliminary docs, added as gap-linked variant | needs-review |
| footer-207 | footer | 207 | sv | index.html, stockholm-*.html, musik.html, om-andetag.html, privacy.html | n/a | Swedish footer with legal/privacy links and social block | validated |
| footer-3100 | footer | 3100 | en | en.html, en-stockholm-*.html, en-about-*.html, en-music.html, en-optical-fibre-textile.html, en-berlin-en.html | n/a | English footer with JSON-LD widget | validated |
| footer-4229 | footer | 4229 | de | de.html, de-berlin.html, de-*.html | n/a | German footer with JSON-LD widget | validated |

Field notes:

- `type`: `header` or `footer`
- `status`: `draft`, `validated`, `deprecated`, `needs-review`

## 2) Navigation Variant Coverage by Language/Context

| nav_variant_id | lang | destination_context | source_header_variant | depth_max | has_cta_item | evidence_files | validation_status | notes |
|----------------|------|---------------------|-----------------------|-----------|--------------|----------------|-------------------|-------|
| sv-main | sv | stockholm | header-192, header-2223 | 2 | yes | index.html, stockholm-biljetter.html | validated | Includes standalone Biljetter CTA item and language switcher |
| en-main | en | stockholm | header-918, header-3305 | 2 | yes | en.html, en-stockholm-tickets.html | validated | Includes standalone Tickets CTA item and language switcher |
| en-brand | en | shared | header-4287 | 2 | no | en-about-andetag.html | validated | Desktop-only simplified brand/art menu with Locations branch |
| de-main | de | berlin | header-4344 | 1 | yes | de.html, de-berlin.html | validated | Berlin-first primary nav and multilingual switcher |
| en-berlin | en | berlin | header-4136 | 1 | no | en-berlin-en.html | needs-review | Variant appears on legacy alias page, should be reconciled with `/en/berlin/` target path |

Field notes:

- `destination_context`: `stockholm`, `berlin`, `shared`
- `validation_status`: `draft`, `validated`, `needs-review`

## 3) Widget Coverage Matrix by Page

| page_id | source_file | canonical_path | lang | widget_family | count | criticality | mapped_component | mapping_status | notes |
|---------|-------------|----------------|------|---------------|-------|-------------|------------------|----------------|-------|
| 2 | index.html | / | sv | html.default (Understory embed) | 1 | high | BookingEmbed | mapped | Includes `#book` anchor and external Understory booking widget |
| 2780 | stockholm-biljetter.html | /stockholm/biljetter/ | sv | html.default (Understory embed) | 1 | high | BookingEmbed | mapped | Core conversion page for completed purchase flow |
| 2693 | stockholm-dejt.html | /stockholm/dejt/ | sv | html.default (Understory embed) | 1 | high | BookingEmbed | mapped | Conversion-support page with booking handoff |
| 2789 | en-stockholm-tickets.html | /en/stockholm/tickets/ | en | html.default (Understory embed) | 1 | high | BookingEmbed | mapped | English conversion-equivalent of Swedish tickets page |
| 3729 | en-stockholm-faq.html | /en/stockholm/faq/ | en | nested-accordion.default | 1 | high | AccordionSection | mapped | FAQ interaction pattern using Elementor nested accordion |
| 2881 | stockholm-fragor-svar.html | /stockholm/fragor-svar/ | sv | nested-accordion.default | 1 | high | AccordionSection | mapped | Swedish FAQ equivalent |
| 4323 | de.html | /de/berlin/ | de | html.default (Brevo form) | 1 | high | WaitlistFormEmbed | partial | Brevo form present on Berlin pre-launch flow, consent gating required |
| n/a | index.html, en.html, de.html | /, /en/, /de/berlin/ | sv,en,de | video.default | 1 per hero page | medium | HeroVideo | mapped | Vimeo embed appears in hero/homepage flows |
| n/a | index.html, en.html, de.html | /, /en/, /de/berlin/ | sv,en,de | google_maps.default | 1 per hero page | medium | MapEmbed | mapped | Requires consent-aware lazy render |
| n/a | index.html, en.html, de.html | /, /en/, /de/berlin/ | sv,en,de | shortcode.default | 1 per hero page | low | ReviewsBlock | unmapped | TripAdvisor shortcode planned for removal per parser-plan exclusions |

Coverage note (source extraction):

- Across unsuffixed snapshots, the most common widget families are: `text-editor.default` (234), `heading.default` (130), `image.default` (43), and `button.default` (34).
- Secondary families include `nested-accordion.default` (12), `html.default` (12), `gallery.default` (5), `video.default` (5), `google_maps.default` (5), and `shortcode.default` (5).

Field notes:

- `criticality`: `high`, `medium`, `low` for migration priority
- `mapping_status`: `mapped`, `partial`, `unmapped`

## 4) Integration Disposition Matrix

| integration | current_usage | pages_or_templates | business_role | disposition | rationale | replacement_target | phase_target | risk_level | notes |
|-------------|---------------|--------------------|---------------|-------------|-----------|--------------------|--------------|------------|-------|
| understory | embedded booking widget | index + tickets/date pages in sv/en | primary conversion handoff | keep | Required for completed purchase flow continuity | Understory embed component with consent-safe wrapper | 5-7 | high | Must preserve widget language and company-id behavior |
| gtm | global script | all pages | attribution and analytics orchestration | keep | Mandatory in `docs/grand-plan.md` and tracking requirements | GTM runtime in static site with env-aware container IDs | 7 | high | Event taxonomy tied to KPI map |
| ga4 | currently direct and GTM-linked | all pages | analytics measurement | replace | Consolidate to GTM-managed GA4 to avoid duplicate instrumentation paths | GA4 via GTM only | 7 | medium | Validate no duplicate `page_view` events |
| meta-pixel | consent-blocked marketing script | all pages via Complianz | paid attribution | keep | Required marketing attribution path | Meta Pixel via GTM with marketing consent gate | 7 | medium | Category-gated firing only |
| brevo | global script + German embedded form | all pages, form on German pages | CRM and waitlist capture | keep | Explicitly retained in grand plan and tracking requirements | Brevo embed component + controlled load policy | 5-7 | medium | Fallback content required when blocked |
| consent-manager (Complianz) | WordPress plugin markup/runtime | all pages | legal consent and tag gating | replace | WordPress-dependent plugin is not suitable for static runtime | CookieYes CMP with GTM Consent Mode v2 integration | 7 | high | Must support category gating and audit logs |
| wonderpush | push notification SDK | all pages | re-engagement | remove | Not in retained integration scope and not required for conversion-first rebuild | n/a | 7 | low | Log as approved removal exception |
| tripadvisor-slider | shortcode/plugin output | homepages | social proof | remove | Parser plan excludes shortcode content and unified component system avoids plugin dependency | Native testimonials/reviews content block | 5 | low | Preserve review intent without plugin runtime |
| yoast/wp-seo runtime | WP plugin output | all pages | metadata generation | replace | Static site will emit metadata and sitemap directly from source model | Build-time metadata generation in static stack | 4-7 | medium | Canonical/hreflang parity must be validated |
| polylang switcher runtime | WP plugin output | headers | language routing | replace | Static routing will own locale switching logic | Static language switcher + hreflang map | 2-4 | medium | Must preserve existing sv/en/de relationships |

Disposition values:

- `keep`
- `replace`
- `remove`

## 5) Known Gaps and Unknowns Register

| gap_id | area | description | source_reference | impact | owner | resolution_status | target_phase |
|--------|------|-------------|------------------|--------|-------|-------------------|--------------|
| GAP-001 | widget mapping | TripAdvisor shortcode handling and replacement content strategy needs explicit sign-off | `docs/parser-plan.md` exclusion list + homepage `shortcode.default` usage | medium | AI agent + Gustaf | resolved (approved via EX-0002) | 3 |
| GAP-002 | header variant coverage | Header Elementor ID `4136` appears on `en-berlin-en.html` but is not in baseline header registry docs | `site-html/en-berlin-en.html` + `docs/existing-site-structure.md` header section | medium | AI agent | resolved (mapped via EX-0005 to `header-918`) | 2 |
| GAP-003 | canonical route target | Legacy URL `/en/berlin-en/` redirects to `/en/berlin/`, but canonical snapshot file naming still centers alias slug | `docs/url-migration-policy.md` + `site-html/sitemap.xml` | high | AI agent + Gustaf | resolved (approved via EX-0004) | 4 |
| GAP-004 | URL inventory noise | Unsuffixed snapshot set includes non-sitemap legacy slugs (for example `stockholm-event-stockholm.html`) requiring explicit keep/remove decision | `site-html/*.html` inventory vs `site-html/sitemap.xml` | medium | AI agent | carried-forward | 4 |
| GAP-005 | consent platform selection | Static-site consent platform selection is complete, implementation validation remains for Phase 7 | `docs/decisions/0002-consent-platform-selection.md` + `docs/tracking-and-consent-requirements.md` | high | Gustaf + AI agent | resolved (ADR 0002 accepted: CookieYes) | 7 |

## Population Rules

1. Do not invent variants or integrations not present in source artifacts.
2. Every row must include source evidence (`source_files`, `source_reference`, or both).
3. Unknown items must be explicitly logged in the gaps register.
4. Schema updates that add/remove columns must be reflected in `docs/parser-plan.md` or related policy docs when contract impact exists.
