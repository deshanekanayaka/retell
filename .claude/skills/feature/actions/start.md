# Start Action

Steps 5-6 of the feature workflow.

1. Read `context/current-feature.md`. Verify `## Implementation plan` is filled in and was
   approved. If it is empty, error: "Run /feature plan first."
2. Create and check out a branch: `feature/<name>` or `fix/<name>`, derived from the H1 heading.
   Never commit directly to `main`.
3. Set `## Status` to `In Progress`.
4. Implement the smallest working slice from the plan first, not everything at once. Add tests
   as you go, not at the end.
5. Follow `context/coding-standards.md` without exception: strict TypeScript, validate at
   boundaries, server components by default, `lib/evaluate.ts` is the only file that imports a
   model provider SDK, migrations forward-only, RLS on every user-owned table.
6. Do not add anything beyond the plan's goals. Scope creep gets caught at `review`, but it is
   cheaper not to write it.
