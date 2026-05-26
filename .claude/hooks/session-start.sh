#!/bin/bash
# Inject AGENTS.md into the session context at startup so every agent
# session begins with the project's operating contract already loaded.
# Without this hook, agents have historically skipped the file and
# violated normative rules like locale parity (AGENTS.md §3).
set -euo pipefail

AGENTS_FILE="${CLAUDE_PROJECT_DIR:-$(pwd)}/AGENTS.md"

if [ ! -f "$AGENTS_FILE" ]; then
  exit 0
fi

CONTENT=$(cat "$AGENTS_FILE")
PREAMBLE="The project AGENTS.md is required reading at the start of every session. Its full contents are included below verbatim. Treat the Operating principles as a binding contract — do not begin any work that would violate locale parity (§3), source integrity (§1), or skills-as-contract (§4) without an explicit user override. When the same logical page exists in multiple locales, edits apply to every locale in the same task unless the user explicitly scopes to one."

jq -n --arg ctx "$PREAMBLE

---

$CONTENT" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $ctx
  }
}'
