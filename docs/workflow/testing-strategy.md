# Testing Strategy

Honest state: **nothing is tested yet.** This describes what will exist, and what deliberately
will not. Sections marked *not yet real* are aspirations, not practice.

## Layers

**Unit tests (Vitest).** Everything with real logic and no I/O:

- Speech signal computation: duration, words per minute, longest pause, filler count from a
  fixture transcript with word timings.
- Grade derivation from rubric scores plus duration. Every branch of the threshold table.
- The interval ladder: each grade from each ladder position.
- Session composition: due first, backfill behaviour, twist selection, new pairing selection.

Test files sit beside the code as `*.test.ts`.

**Integration tests.** *Not yet real.* When they exist, they cover the answer pipeline end to
end against a test database with the external calls stubbed: upload, attempt row, transcription
response, evaluation response, rows written.

**Calibration set.** *Not yet real, and the most important one.* A fixed set of real spoken
answers with grades agreed by hand. The rubric prompt is scored against it, and agreement below
an agreed threshold fails the gate. This is what stops a prompt edit silently changing every
user's schedule. It cannot be built until the first cohort has produced real answers.

**Browser tests (Playwright).** Deferred to Phase 2. Phase 1 flows change too fast for them to
be worth maintaining.

## What is deliberately not tested

- Pages, layout and styling. Verified by looking at them.
- The external providers themselves. Their responses are stubbed from fixtures.
- Anything whose test would only assert that the code is what it is.

## Gates

CI runs lint, typecheck, tests and build on every pull request. A failing gate is never
weakened, skipped, or marked flaky to get a merge through. If a gate looks wrong, that is a
conversation, not a workaround.
