# Architecture Decision Records

Purpose: capture important migration decisions in a stable, reviewable format.

## Why this exists

- Phase 0 requires a deterministic way to track architecture decisions.
- Decision history must be explicit so later phases can validate behavior against approved intent.

## ADR Naming Convention

- File path: `docs/decisions/NNNN-short-kebab-title.md`
- `NNNN` is a zero-padded sequence (`0001`, `0002`, ...).
- Title uses concise kebab case and focuses on the decision scope.

Examples:

- `docs/decisions/0001-static-stack-selection.md`
- `docs/decisions/0002-consent-platform-selection.md`

## ADR One-Page Template

Create new ADR files using this structure:

```md
# ADR NNNN: Decision Title

Status: Proposed | Accepted | Superseded | Deprecated
Date: YYYY-MM-DD
Deciders: name(s)
Related docs:
- docs/grand-plan.md
- docs/parser-plan.md
- docs/url-migration-policy.md

## Context

What problem or pressure created this decision?

## Decision

What is decided, exactly?

## Options considered

### Option A
- Pros:
- Cons:

### Option B
- Pros:
- Cons:

## Consequences

### Positive
- ...

### Negative
- ...

### Operational notes
- Rollout implications
- Validation/check requirements

## SEO and migration impact

- URL impact:
- hreflang/canonical impact:
- Redirect impact:

## Follow-up actions

- [ ] Action one
- [ ] Action two
```

## ADR Process Rules

1. Open ADR in `Proposed` status before implementing a major decision.
2. Set ADR to `Accepted` only after explicit approval.
3. If changed later, create a new ADR and mark the previous one as `Superseded`.
4. Link implementation docs and policy files that depend on the ADR.
