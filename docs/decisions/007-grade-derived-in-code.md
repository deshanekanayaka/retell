# ADR-007: The grade is derived in code, not returned by the model

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

The scheduler needs one outcome per attempt. The model already produces three rubric scores, so
it could produce the grade directly. The scheduler is the mechanism that makes Retell different
from a mock interview tool, and it must behave predictably.

## Decision

The model returns three scores (relevance, structure, specificity) and nothing else that the
scheduler reads. The grade is derived in application code from those scores plus the measured
duration.

## Alternatives rejected

- **Ask the model for the grade**: makes scheduling depend on model behaviour, prevents replaying
  threshold changes over history, and cannot be tuned without editing a prompt.

## Consequences

- Thresholds can be changed and replayed over every historical attempt.
- The scheduler stays independent of rubric evolution, because it reads one field.
- Relevance acts as a gate: a well structured, specific answer to the wrong question fails. This
  is what gives twist questions their force.
- Threshold values themselves are founder authored and start as an estimate, to be corrected
  against real cohort answers.

## References

01-PRD.md FR-19, FR-27. 05-spaced-repetition.md section 2.
