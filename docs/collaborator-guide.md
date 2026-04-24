# Collaborator guide

For **museum directors** and other content owners who keep the ANDETAG website up to date. You do not need to know how code works. You describe what you want, an agent does it, you preview the result, and you approve it.

---

## What you can change

- Page copy (headings, paragraphs, calls to action).
- FAQ entries (questions and answers).
- Events (add, update, remove, including times, prices, descriptions).
- Opening hours, ticket prices, public contact information.
- Images on any page. You can pick specific ones from the photo library, or ask the agent to recommend a selection.
- Testimonials and review numbers.
- Revert a change that went wrong.

## What stays off-limits for now

- URLs, redirects, and the overall site structure.
- Design system: fonts, colors, layout rules.
- Third-party integrations (booking system, analytics, cookie consent).
- Build configuration and the edge worker.

If you think you need one of these, contact Gustaf.

---

## How to reach an agent

Pick the path that suits your setup.

### Path A, Cloud Claude Code

Use **Claude Code** directly in the cloud, tied to the ANDETAG website repository.

1. Open Claude (for example, at claude.ai/code or in the desktop app).
2. Ask for what you want. Example: *"Update the Swedish FAQ on the Stockholm page to add a question about photography, with a short answer that says we welcome photos without flash."*
3. The agent will make the change and open a **pull request** on its own.

### Path B, OpenClaw

Chat with **OpenClaw** from your preferred messaging app (WhatsApp, Telegram, Slack, Signal, iMessage, Discord, or Teams). OpenClaw runs Claude Code locally on your behalf.

1. Send the same kind of instruction to OpenClaw as you would to Cloud Claude Code.
2. OpenClaw opens the pull request for you.

You can switch between the two paths freely. Either opens a real pull request you can review.

---

## What happens after the pull request is opened

1. Within a minute or two, **Cloudflare** posts a comment on the pull request with a **Commit Preview URL**. Click that link to see a live preview of your change on the real site.
2. If the preview looks right, click **Merge pull request** on GitHub. The change goes live on `www.andetag.museum` within a minute or two.
3. If the preview is wrong, go back to the agent and describe what to change. The preview URL updates automatically each time the agent makes a new commit; wait a minute after each update and refresh.

You do not need to approve your own pull request before merging. Every collaborator has full merge rights.

---

## Language rules, important

- **Stockholm** pages have **Swedish** and **English** versions. If you update one, update the other.
- **Berlin** pages have **German** and **English** versions. Same rule.

You do not translate yourself. Ask the agent to update both languages at once. It will.

---

## If something breaks

- **The live site shows an error or wrong content after a recent change:** ask an agent to perform an **emergency content rollback** of the most recent pull request. That reverts the last change.
- **You are unsure what to do:** contact Gustaf.

---

## First change, suggested

Try something small and safe as a first run. For example, fix a typo in one page, or change one FAQ answer. That way you get comfortable with the preview-URL flow before making bigger changes.

---

## Quick checklist for every change

- [ ] Describe what you want in plain language to the agent.
- [ ] Wait for the pull request to open.
- [ ] Click the **Commit Preview URL** when it appears.
- [ ] Check the preview: does the change look right, on both mobile and desktop?
- [ ] For multilingual pages, check all the language versions that apply.
- [ ] Merge if happy. If not, tell the agent what to change and repeat.
