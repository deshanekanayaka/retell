---
name: cleanup
description: Housekeeping check against Retell's own coding standards (add "run" to fix)
argument-hint: check|run
---

Review the codebase for cleanup tasks:

1. `context/progress.md` is in order, oldest to newest, one line per entry.
2. `context/current-feature.md` matches an actually-active feature — flag it if Status says
   "In Progress" but there is no matching branch, or vice versa.
3. `context/tasks.md` reflects real state — nothing checked off that isn't done, nothing done
   that isn't checked off.
4. Stray `console.log` statements in `app/`, `components/`, `lib/`.
5. Unused imports and exports.
6. Stale TODO comments and stale `@ts-ignore` comments — flag any without a comment explaining
   why, per coding-standards.md.
7. Orphaned or unused files.
8. `any` used in TypeScript without a comment explaining why (coding-standards.md rule).
9. Any file other than `lib/evaluate.ts` that imports a model provider SDK directly — this is a
   hard boundary in coding-standards.md, not a style preference.
10. Any `JSON.parse` of raw model output — model responses must be schema enforced, never parsed
    as free text.
11. Any table migration that looks like it stores facts (`attempt`) and judgements
    (`evaluation`) in the same table — these must stay separate per coding-standards.md.
12. `.env.local.example` (or equivalent) has the same variable names as any real env file in use,
    values aside. Flag anything missing either direction.

**Mode: $ARGUMENTS**

If no argument or argument is "check":

- Only report findings, do not modify anything.
- List what would be cleaned up, grouped by the numbered item above.

If the argument is "run" or "fix":

- First report all findings with numbered items.
- Then ask: "Which items would you like me to fix? (numbers like 1,3,5 or 'all' or 'none')"
- Wait for a response before changing anything.
- Only fix what was specified, then report what changed.
- This does not replace `/feature test` — run the real gates before treating anything as done.
