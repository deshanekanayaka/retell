---
name: tdd
description: Test-driven development for pure logic. Default approach for the rubric, scheduler, and signal-computation code in Retell — anything with real logic and no I/O.
---

# Test-Driven Development

Red before green, one seam at a time. `context/coding-standards.md` already says "unit test
anything with real logic and no I/O" — this is the loop that produces those tests, used by
default for that category of code: grade derivation, the interval ladder, signal computation
(duration, pace, pauses, fillers), session composition. Not the default for pages, layout, or
provider calls — coding-standards.md excludes those from unit testing.

Vitest, test files beside the code as `foo.test.ts`, per coding-standards.md.

## What a good test is

Tests verify behavior through the public function or module interface, not internal structure.
"grade derives EASY from three correct answers under the time limit" tells you exactly what
capability exists, and survives refactors because it doesn't reach inside.

See [tests.md](tests.md) for good/bad examples and [mocking.md](mocking.md) for when to mock.

## Seams: where tests go

A **seam** is the public boundary under test: the function or module surface, never internals.
Before writing any test, name the seams under test — for Retell's pure-logic pieces this is
usually one function (`deriveGrade`, `nextInterval`, `computeSignals`) with no I/O to fake.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private functions, or reaches
  past the interface to check a side effect. Tell: it breaks on a refactor with no behavior
  change.
- **Tautological**: the expected value is recomputed the way the code computes it, so it passes
  by construction. Expected values come from an independent source — a known-good literal, a
  worked example from the spec, never `items.reduce(...)` mirroring the implementation.
- **Horizontal slicing**: writing every test first, then every implementation. Work in vertical
  slices instead — one test, one minimal implementation, repeat — so each test responds to what
  the last cycle taught, rather than testing an imagined shape.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Do not
  anticipate later tests or add anything the current test doesn't demand.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It happens after green, at `/feature review`, not
  mid-cycle.
- If the rubric or scheduler logic is what's under test, the anchors and thresholds themselves
  are founder authored — write the test against values Deshan has confirmed, never invent one.
