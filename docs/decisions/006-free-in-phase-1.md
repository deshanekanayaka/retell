# ADR-006: Free in Phase 1, no payment code

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

The primary user is a student or new graduate with low willingness to pay, using the product
for roughly the length of a job search. Phase 1 exists to answer whether anyone returns on day
four. Building payment before that is answered would be work spent on a question nobody has
asked yet.

## Decision

Phase 1 is free with no payment code and no artificial limits. Cost is bounded in application
code: a hard spend cap per provider, one session per user per day, one anonymous answer per IP
per day, and a global daily spend threshold that stops new sessions.

The daily session, and the user's own stories and recordings, are never paywalled at any point
in the product's life.

## Alternatives rejected

- **Freemium from the start**: requires inventing limits before knowing what people value.
- **Ninety day season pass from the start**: matches the real user lifecycle, but prices a
  product whose value is unproven.

## Consequences

- Phase 1 has no revenue signal, so success is measured entirely by behaviour.
- Metered API costs are borne directly. At Phase 1 scale this is a few pounds.
- The eventual monetisation shape is TBD and decided at the Phase 2 gate.

## References

01-PRD.md FR-36, FR-37, FR-40, section 6.
