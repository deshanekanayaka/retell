---
name: research
description: Investigate a question and write findings to context/research, docs only
argument-hint: <prompt-name>
---

## Task

Execute research task: $ARGUMENTS

---

### Instructions

1. If no argument is given, error: "Usage: /research <prompt-name>".
2. Look for a prompt file at `context/research/{$ARGUMENTS}.md`. If it does not exist, offer to
   create one with the sections below, then stop and let the topic be filled in before running.
3. A prompt file has:
   - **Output**: where findings go, default `context/research/{$ARGUMENTS}-findings.md`
   - **Research**: what to investigate
   - **Include**: specific details to capture
   - **Sources**: files, `docs/`, external APIs, MCP tools to use
4. Investigate using read-only tools: read code, read `docs/`, search the codebase, query
   external docs or APIs as needed. Use a subagent for anything wide enough to flood context.
5. Write findings to the specified output. Default to `context/research/`, never `docs/` —
   `docs/` is the founder-authored source of truth and only changes through the feature workflow
   with approval (`/feature spec`, step 8 of `/feature complete`).
6. Summarize what was found and, if relevant, what it implies for an upcoming spec.

---

### Rules

- Documentation only. Never modify source code, `docs/`, or any file outside `context/research/`.
- Never create a branch or commit.
- If a finding contradicts something stated in `docs/`, report the contradiction — do not
  silently resolve it or edit `docs/` to match. That is Deshan's decision.
