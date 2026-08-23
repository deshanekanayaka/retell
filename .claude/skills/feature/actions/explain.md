# Explain Action

The working agreement's step 4: walk through what was built and why, so Deshan can review it
knowing what each part does before it merges.

1. Read `context/current-feature.md` for what this feature set out to do.
2. Run `git diff main --name-only` for the changed files.
3. For each file created or modified:
   - Path, and whether it is new or modified
   - One to two sentences on what it does and why it exists
   - Any key function, component, or pattern worth naming
4. Close with a short summary of how the pieces connect — the data or control flow between them.

Keep it plain and short, one section at a time if it is long. This is not a substitute for
`/feature review` — that checks correctness, this explains intent.
