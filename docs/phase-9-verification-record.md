# Phase 9 verification record

Purpose: evidence and maintainer sign-off for **Phase 9** checklist items that are not fully captured in **`docs/phase-9-todo.md`** row text alone.

Normative plan: **`docs/phase-9-plan.md`**. Execution checklist: **`docs/phase-9-todo.md`**.

## Status

- **P9-20**–**P9-22** (PR-gate convention): **complete** **2026-04-25** — see §PR-gate convention (P9-20–P9-22).
- **P9-26** (post-cutover organic monitoring): **complete** **2026-04-25** — see §P9-26 (post-cutover organic monitoring).
- **Phase 9 archive sweep** (**P9-90**–**P9-99**): not started; forward-looking per **`docs/phase-9-plan.md`** §H–I.

---

## PR-gate convention (P9-20–P9-22)

Normative definition: **`docs/phase-9-plan.md`** §E.

- **P9-20** The agent performing a change runs that skill’s **Verification** steps (and any related commands in **`AGENTS.md`**) before requesting merge. If a check is skipped, the agent states that in the **PR** body with a short reason.
- **P9-21** Standing exceptions (for example a route that cannot meet a performance target without structural work) live as **`EX-NNNN`** rows in **`docs/migration-exceptions.md`** (and, for ongoing SEO-specific decisions, **`docs/seo/decisions.md`**) with owner and rationale.
- **P9-22** No **in-repo CI Lighthouse budget**; optional GitHub Actions performance work stays **deferred** until a concrete need is recorded (same §E).

This record is the **evidence model** for “convention documented.”

---

## P9-26 (post-cutover organic monitoring)

**Checklist complete 2026-04-25.**

The cutover baseline is **2026-04-14** (**`docs/phase-8-verification-record.md`** §Closure). The **2–4 week** observation window in **`docs/phase-9-todo.md`** **P9-26** is **closed** for checklist purposes.

The §Organic monitoring log table in **`docs/phase-8-verification-record.md`** was **not** filled with dated GSC rows. **Going forward**, read-only **GSC** / **GA4** spot work for agents uses the **`andetag-stats`** / **`../stats/cli`** bridge described in **`skills/performance-check/SKILL.md`** §E and **`skills/seo/SKILL.md`**.

No **unresolved** organic SEO regression was **reported** to the maintainer in the post-cutover period that would block this closure. If anomalies appear later, treat them as **routine operations** (and document standing constraints in **`docs/migration-exceptions.md`** / **`docs/seo/decisions.md`** as needed).

---

## Sign-off

- **Gustaf:** **Approved** (P9-26 monitoring checklist and P9-20–P9-22 PR-gate convention recorded **2026-04-25**).
- **Date:** **2026-04-25**
