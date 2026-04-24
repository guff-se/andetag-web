# ANDETAG skills

Skills are modular instructions that teach agents how to perform specific maintenance tasks on this project. They live here, in `/skills/`, as canonical files. Agent-specific pointers elsewhere in the repo reference these.

---

## Layout

```
/skills/
├── README.md                  # This file, index and pattern
├── <skill-name>/
│   ├── SKILL.md               # Canonical skill content (Claude Code format)
│   └── ...                    # Optional supporting files
```

**Pointer locations:**

- **Claude Code** (primary) reads skills from `.claude/skills/<skill-name>/SKILL.md`. Each entry there is a symlink to the canonical `/skills/<skill-name>/` directory. This means Claude Code and any `/skills/` reader see the same file.
- **Cursor** reads rules from `.cursor/rules/<skill-name>.mdc`. Each file there is a thin Cursor-format wrapper that points at or mirrors the canonical skill.

**Rule:** canonical content lives in `/skills/`. Do not edit pointer files directly; update `/skills/<name>/SKILL.md`, then verify pointers still reflect it.

---

## SKILL.md template

Every canonical skill file starts with YAML frontmatter:

```yaml
---
name: <skill-name>
description: When to use this skill. One or two concrete sentences. This is what an agent reads when deciding whether to invoke the skill, so include real triggers (for example, "Use when adding, editing, or removing FAQ entries on Stockholm or Berlin pages").
---
```

Below the frontmatter, include these sections in order:

1. **Purpose** — one paragraph, what this skill is for and what it is explicitly not for.
2. **When to use** — concrete trigger conditions.
3. **Files touched** — read and write paths, with notes on what changes and what does not.
4. **Locale parity rules** — if applicable (Stockholm `sv + en`, Berlin `en + de`; no cross-location parity).
5. **Workflow** — ordered steps the agent takes.
6. **Verification** — commands to run before asking for merge; what "pass" looks like. If relevant, reference the performance check recipe in `/skills/performance-check/SKILL.md`.
7. **When to escalate** — conditions that mean the agent should stop and ask for guidance.
8. **Examples** — one or two realistic task descriptions with the expected outcome.

Keep SKILL.md tight. Supporting reference material can live as sibling files inside the same skill folder and be cross-linked from the main file. The skill should be self-contained enough that an agent with only this file and the repo can do the job.

---

## Index

| Skill | Id | Status | What it does |
|-------|----|--------|--------------|
| [`page`](page/SKILL.md) | P9-12 | active | Add, edit, rename, or remove a content page on the Astro site (`site/`). Covers shell meta, body registry, routing, navigation, locale parity, and image wiring. |
| [`faq`](faq/SKILL.md) | P9-16 | active | Add, edit, remove, or reorder Stockholm FAQ entries. Covers the single-source data file, shared "What is ANDETAG?" copy, marketing FAQ subset, FAQPage JSON-LD, and `sv + en` parity. |
| [`events`](events/SKILL.md) | P9-17 | active | Add, update, or remove events (recurring Art Yoga or one-off blocks on the Stockholm home) on the Astro site. Covers `stockholm-offers.ts` metadata, `computeArtYogaOccurrenceSeriesIso`, Understory booking CTAs, responsive event hero images, optional Event JSON-LD, and `sv + en` parity. |
| [`operational-facts`](operational-facts/SKILL.md) | P9-18 | active | Update Stockholm operational facts (hours, prices, daytime window, contact email, address, geo) with the correct propagation set. Flags which facts are centralised (prices, season pass, daytime window, Art Yoga metadata, address, geo) vs not (opening hours, contact email) and lists every file that must change together. |

Rows are added as each skill lands. Ids correspond to Phase 9 work items in [`docs/phase-9-plan.md`](../docs/phase-9-plan.md).

---

## Relationship to agent runtime

Skills are invoked automatically by the agent when a user request matches the skill's `description`. The agent does not need a human to name the skill; the description field drives matching.

For Claude Code, the `.claude/skills/` directory is the discoverable location. For Cursor, `.cursor/rules/` serves the same role. Both reference the canonical file so behavior stays consistent across tools.
