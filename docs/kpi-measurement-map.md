# KPI Measurement Map (Phase 1)

Purpose: map conversion goals to measurable events that can be implemented via GTM and validated in Phase 7.

## Reused Inputs

- `docs/grand-plan.md`
- `docs/tracking-and-consent-requirements.md`
- `docs/existing-site-structure.md`
- `docs/phase-1-analysis-schema.md`

## Primary KPI

- Completed purchase in the external ticketing flow (Understory checkout completion).

## Funnel Stages

1. Discover and land on route.
2. Engage with conversion-oriented content.
3. Trigger booking intent (open widget or click booking CTA).
4. Handoff to external ticketing flow.
5. Completed purchase (measured via external platform integration or approved proxy signal).

## Event Taxonomy

| event_name | stage | trigger | pages | category | required_params | consent_category |
|------------|-------|---------|-------|----------|-----------------|------------------|
| `page_view_route` | 1 | route render | all | engagement | `route`, `lang`, `destination` | analytics |
| `cta_click_primary` | 2-3 | click on primary CTA buttons | homepage, tickets, date, group/corporate pages | engagement | `route`, `lang`, `cta_label`, `cta_target` | analytics |
| `booking_widget_visible` | 3 | booking widget enters viewport | pages with embedded Understory | conversion_proxy | `route`, `lang`, `widget_type` | analytics |
| `booking_widget_interaction` | 3 | interaction inside booking widget frame shell | pages with embedded Understory | conversion_proxy | `route`, `lang`, `interaction_type` | analytics |
| `booking_handoff_click` | 4 | outbound click to Understory flow | widget pages and Art Yoga external booking links | conversion_proxy | `route`, `lang`, `destination`, `outbound_url` | analytics |
| `brevo_form_submit` | 3-4 | Berlin waitlist form submit | German pre-launch pages | lead | `route`, `lang`, `form_id` | marketing |
| `consent_updated` | support | user changes consent categories | all | compliance | `analytics_allowed`, `marketing_allowed` | necessary |

## Mapping to Business KPI

| business_goal | primary_signal | backup_signal | owner_system |
|---------------|----------------|---------------|--------------|
| Completed purchase | external checkout completion event from ticketing integration | `booking_handoff_click` with campaign attribution | ticketing platform + analytics warehouse |
| Improve conversion rate from key pages | purchase completion attributed to route group | `booking_widget_visible` to `booking_handoff_click` ratio | GTM + analytics |
| Berlin pre-launch demand capture | qualified waitlist submissions | Brevo form starts and completion rate | Brevo + GTM |

## GTM Implementation Requirements

- Use one event naming standard across sv/en/de routes.
- Include `lang` and `destination` on all conversion and proxy events.
- Treat Understory booking widget runtime as `necessary` so conversion path is never blocked by optional consent categories.
- Keep optional tag firing behind consent categories:
  - analytics events: `analytics`
  - marketing tags: `marketing`
- Prevent duplicate event firing when both widget load and route hydration occur.

## Minimum Validation Plan (Phase 7 Input)

1. Verify every taxonomy event in GTM preview on one representative route per language.
2. Verify consent gating by category before and after opt-in.
3. Verify booking proxy sequence on:
   - `/stockholm/biljetter/`
   - `/en/stockholm/tickets/`
   - `/stockholm/dejt/`
4. Verify Berlin lead flow sequence on `/de/berlin/`.
5. Compare event counts between staging and production dry run window before launch.

## Open Measurement Dependencies

- Purchase completion callback capabilities from Understory integration.
- Final event implementation details and reporting destinations must be validated in Phase 7 staging runs.
