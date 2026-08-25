# Test Action

Step 7 of the feature workflow. These are gates, never weakened, skipped, or marked flaky to
merge.

1. Run, in order, stopping at the first failure: `pnpm lint`, `pnpm typecheck`, `pnpm test`,
   `pnpm build`.
2. Report each command's result plainly — pass or fail, do not soften a failure.
3. If a gate fails in a way that suggests the gate itself is wrong (not the code), say so and
   explain why. Never adjust a gate to make it pass.
4. If anything in this feature touches audio capture or layout, note that it still needs to be
   checked in Chrome on a real phone before `/feature complete` — this action cannot verify that.
5. Do not proceed to `review` until lint, typecheck, tests, and build all pass.
