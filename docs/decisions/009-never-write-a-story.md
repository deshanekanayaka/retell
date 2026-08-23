# ADR-009: Retell never writes a story for the user

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

The primary user is a new graduate who believes they have no experience worth telling. The
strongest temptation in the product is to help by generating or embellishing a story. Anything
Retell writes will be repeated by a candidate in a real interview.

## Decision

Retell elicits, structures, probes and labels. It never generates story content, never supplies
an example answer built from the user's material, and never invents detail the speaker did not
say.

## Alternatives rejected

- **Generate a draft story for the user to edit**: produces claims the candidate did not earn
  and cannot defend under follow up questioning.
- **Suggest specific details to add**: the same failure in smaller units.

## Consequences

- Onboarding must work by asking questions rather than offering drafts, which is harder and is
  why the elicitation ladder and the "describe the place" fallback exist.
- Feedback names a gap as a question ("what did you do?") rather than proposing content.
- The worked example shown on the permission denial path is built from a clearly labelled
  fictional character, never from the user.

## References

01-PRD.md FR-9, section 5. 04-voice-and-evaluation.md sections 3.4 and 5.
