# ADR-004: Chrome only in Phase 1

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

Browser microphone behaviour is the riskiest part of the build. Chrome offers a declarative
permission element with a recovery flow that measurably improves grant and recovery rates.
Safari grants are per session, and audio capture inside iOS in-app browsers is unreliable.
Supporting everything would consume a large share of Phase 1.

## Decision

Phase 1 supports Chrome and Chromium browsers only. Other browsers see a message explaining
this. Users detected inside an in-app browser are told to open the link in Chrome.

## Alternatives rejected

- **Chrome plus mobile Safari with an in-app browser escape**: more work, worse permission UX on
  iOS, and Phase 1 is not trying to reach users at scale.

## Consequences

- iPhone users cannot use Retell at all. There is no partial experience for them.
- The share link does not work in practice, since student to student links mostly open on
  iPhones. This conflicts directly with distribution being the fallback moat named in 01-PRD.md
  section 3, and that conflict is accepted for Phase 1 only.
- Cohort testing must recruit knowing iPhone users cannot take part, which skews the sample.

## Revisit trigger

The moment anyone outside a recruited test group is expected to use the product.

## References

01-PRD.md FR-34, FR-35, section 7. 02-system-architecture.md section 4.
