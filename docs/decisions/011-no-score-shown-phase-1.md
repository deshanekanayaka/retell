# ADR-011: No numeric score shown to users in Phase 1

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

The rubric produces three numbers per answer. Showing them is the obvious thing to do and every
competitor does it. Retell is a daily habit product whose user is anxious about their own
adequacy, and the rubric has not been validated against real answers.

## Decision

The three scores are computed and stored from day one. None of them, and no total, is shown to
the user during Phase 1. The user sees their transcript, one gap phrased as a question, the
measured facts, and the question angles their story now covers.

## Alternatives rejected

- **Show the scores**: turns daily practice into a verdict, and publishes numbers from a rubric
  nobody has checked.
- **Do not compute the scores until they can be shown**: leaves no data to validate the rubric
  against, and no input for the scheduler.

## Consequences

- Calibration data accumulates from the first user.
- The feedback screen has to earn its value through the gap question and the angle labels rather
  than a number, which is harder to design and more useful.
- Progress over time cannot be shown as a chart in Phase 1.

## Revisit trigger

The rubric has been validated against real cohort answers and the score is defensible.

## References

01-PRD.md FR-22, FR-23. 04-voice-and-evaluation.md section 4.
