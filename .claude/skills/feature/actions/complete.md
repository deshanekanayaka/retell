# Complete Action

Steps 8-10 of the feature workflow. Do not run this until `/feature test` passes and
`/feature review` gives a ready verdict.

1. Update any `docs/` files the spec or review flagged as stale, in this same branch.
2. **Gate: show what will be committed and end the turn here.** Never commit with a failing
   build or failing tests, and never treat silence as approval.
3. On explicit approval, stage the relevant files (not `git add -A`) and commit with a conventional
   message (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`). No AI attribution line.
4. Switch to `main` and merge the feature branch. Delete the local feature branch.
5. Append one line to `context/progress.md`: date, feature name, one sentence outcome.
6. Reset `context/current-feature.md`:
   - H1 back to `# Current Feature`
   - Status back to `Not Started`
   - Clear Goals, Implementation plan, and Notes
7. If `context/tasks.md` had a matching item, check it off or move it, per its own rules.
8. Do not push to a remote unless asked — pushing is a separate, explicit decision.
