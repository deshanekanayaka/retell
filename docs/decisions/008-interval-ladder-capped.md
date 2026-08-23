# ADR-008: Fixed interval ladder capped at 14 days, not FSRS

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

Spaced repetition algorithms optimise for recall over long horizons and push intervals into
months. Retell's user is job hunting for roughly eight weeks. Modern algorithms such as FSRS
learn from large review histories.

## Decision

A fixed interval ladder: again returns within the session, hard sets one day, good steps through
1, 2, 4, 7, 14 days, easy skips a step. Maximum interval is 14 days.

## Alternatives rejected

- **FSRS**: better with thousands of reviews per user to learn from. Retell will have tens.
- **Uncapped intervals**: an item scheduled 45 days out never returns within the user's lifetime
  on the product.

## Consequences

- Every item a user has attempted stays in circulation for as long as they use the product.
- The scheduler is simple enough to unit test exhaustively.
- An `again` drops one step rather than resetting to zero, so a single bad day is not punished
  disproportionately in a product built on showing up daily.

## Revisit trigger

More than about 50 reviews per active user.

## References

01-PRD.md FR-28. 05-spaced-repetition.md section 3.
