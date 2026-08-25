# Review Action

Two-axis review of the diff against `main`, run as two parallel subagents so neither axis
masks the other. Covers the rest of steps 7-8: goal completion, code quality, stale docs.

## 1. Pin the diff

`git diff main...HEAD` (three-dot, against the merge-base) and `git log main..HEAD --oneline`.
Confirm the diff is non-empty before spawning anything.

## 2. Spawn both subagents in parallel

**Standards subagent** gets, pasted in full (it has no other access):

- The diff and commit list
- `CLAUDE.md`'s hard rules and `context/coding-standards.md` in full
- The smell baseline below
- Brief: "Report, per file/hunk where relevant: (a) every place the diff violates a documented
  standard — cite the file and rule; (b) any baseline smell spotted — name it, quote the hunk.
  Hard rule violations (product boundaries, engineering gates) are always violations. Baseline
  smells are always judgement calls, and a documented Retell standard overrides the baseline
  where they'd conflict. Skip anything lint/typecheck already enforces. Under 400 words."

**Spec subagent** gets:

- The diff and commit list
- `context/current-feature.md` and the source spec at `context/features/<name>-spec.md`, if one
  exists
- Brief: "Report: (a) requirements from Goals/the spec that are missing or partial; (b) behavior
  in the diff not asked for (scope creep); (c) requirements that look implemented but wrong.
  Quote the spec or Goals line for each finding. If no spec exists, note that and check only
  against current-feature.md's Goals. Under 400 words."

## 3. Smell baseline (Standards subagent input, Fowler ch.3)

Mysterious Name, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Repeated
Switches, Shotgun Surgery, Divergent Change, Speculative Generality (abstraction the spec
doesn't ask for — delete it, inline back to a real need), Message Chains, Middle Man, Refused
Bequest. Each is a labelled heuristic, never a hard violation, unless it also breaks a
documented Retell rule.

## 4. Aggregate

Present both reports under `## Standards` and `## Spec` headings, unmerged, unreranked. Add a
`## Docs impacted` line comparing the diff against the spec's "Docs impacted" section.

End with a verdict: ready for `/feature complete`, or what needs to change first. A change can
pass one axis and fail the other — say so plainly rather than averaging into one score.
