---
name: feature
description: Run the Retell feature lifecycle from spec to merge (context/ai-interaction.md)
argument-hint: spec|load|plan|start|test|review|explain|complete
---

# Feature Workflow

Executable version of the 10-step loop in @context/ai-interaction.md and the lifecycle diagram
in @docs/workflow/development-workflow.md. Do not skip steps or reorder them.

## Working files

- @context/current-feature.md — the active feature's live state
- @context/progress.md — append-only completion log
- @context/features/_TEMPLATE-spec.md — spec template

## current-feature.md sections

`# Current Feature`, `## Status` (Not Started | In Progress | Complete), `## Goals`,
`## Implementation plan`, `## Notes`. No history section — completed work is logged to
`context/progress.md` and the file is reset, per docs/workflow/development-workflow.md section 5.

## Task

Execute the requested action: $ARGUMENTS

| Action | Maps to | Description |
|--------|---------|--------------|
| `spec` | step 2 | Write or update a `context/features/<name>-spec.md` from the template |
| `load` | step 3 | Copy an existing spec's goals into current-feature.md |
| `plan` | step 4 | Fill in the implementation plan — **gate** |
| `start` | steps 5-6 | Branch, set In Progress, implement goals incrementally |
| `test` | step 7 | Run lint, typecheck, tests, build — report pass/fail honestly |
| `review` | steps 7-8 | Check goals met, scope creep, stale docs |
| `explain` | working agreement step 4 | Walk through what changed, file by file |
| `complete` | steps 8-10 | Update docs, merge, log, reset — **gate** before the commit |

See [actions/](actions/) for exact instructions. If no action is given, explain the available
options and ask which step the feature is at.

## Gates

Two actions are **gates**: they stop and wait for explicit approval before anything after them
happens. `plan` gates because ambiguity gets resolved before code, not during. `complete` gates
because nothing gets committed without being shown first. A gated action ends its turn on the
thing to approve — it does not proceed, guess at approval, or fold the next action in.

## Rules that apply to every action

- Sizing rule: anything touching more than one file, any schema change, any contract (angle
  slug, error code, rubric version, event type), or any model behaviour change is significant and
  needs a spec. Smaller fixes can skip straight to `start`, but still get logged to progress.md
  if a user would notice.
- The rubric, scheduling rules, anything shown to a user as a claim about their ability, privacy
  handling of recordings, and pricing are founder authored. Draft and argue, never decide.
- If a spec or plan would contradict `docs/`, stop. That is Deshan's decision, possibly an ADR.
- Never weaken, skip, or mark a gate flaky to get to done.
- No AI attribution in commit messages.
