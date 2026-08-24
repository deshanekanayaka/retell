# ADR-015: Warm tone everywhere, including the evaluation

- **Status**: Accepted
- **Date**: 2026-08-24

## Context

Two pieces of copy were written as fixed and not to be softened: the permission screen in
04-voice-and-evaluation.md section 1.1, and the evaluation tone rule in section 3.4, which read
"Tone is level. Not harsh, not congratulatory."

Reviewing the permission copy showed the problem with the first. "That's the point" answers an
objection the user has not raised, which reads as a rebuke on the one screen that cannot afford
one, and that screen guards the 60 percent reach-the-microphone metric in 01-PRD.md section 6.

The wider question followed: whether warmth is a property of individual screens, negotiated one
at a time, or a property of the product. Tone was specified in three unrelated places with no
owner, which is why it drifted.

The evaluation tone rule was the contested part. Warming it changes the prompt, and any prompt
change increments `rubric_version` under FR-20. It was warmed before any answer had been
evaluated, so the cost of the change was zero at the moment it was made and would have risen
sharply after the cohort test.

## Decision

Voice and tone are owned by one section, 07-design-system.md section 6, and every user-facing
word in the product answers to it. The tone is warm everywhere, including the evaluation.

The one thing that stays plain is the `gap` field itself: a question about something absent,
carrying no praise, softener or compliment. Warmth belongs in the copy the product writes around
the model's finding, not inside the finding.

Praise inflation is added to the non-goals in 01-PRD.md section 5. Warmth is required; generic
encouragement is banned.

## Alternatives rejected

- **Keep 3.4 level and warm only the surrounding screens**: defensible, and the position argued
  first. Rejected because it makes tone a per-screen negotiation again, which is the condition
  that produced the original drift.
- **Warm 3.4 including the gap question**: rejected. Praise attached to the gap makes the praise
  unearned and the question unserious, and both halves stop being believed.
- **A separate voice and tone document**: rejected. 07 already existed by the time this was
  written, and two documents governing words and appearance would contradict each other.

## Consequences

- 07 section 6 is the owner. 01 section 5, 04 sections 1.1, 3.4 and 5, 05 section 7, CLAUDE.md
  and context/project-overview.md point at it and do not restate it.
- The warmed prompt is `rubric_version` 1. Nothing had been evaluated, so no version is
  superseded and no data becomes incomparable. Any future tone change to the prompt does
  increment it.
- Two rules previously written as fixed are now superseded. The original permission wording is
  recorded in 04 section 1.1 so it is not reintroduced by someone reading an older draft.
- Warmth is now a gate on copy review. "Would you say this out loud to a nervous 21 year old
  sitting opposite you" is the test, and it applies to error states and empty states as much as
  to the happy path.

## References

- 01-PRD.md section 5, FR-6, FR-20, FR-23, FR-24
- 04-voice-and-evaluation.md sections 1.1, 3.4, 4.2, 5
- 05-spaced-repetition.md section 7
- 07-design-system.md section 6
- ADR-009, which this does not weaken: warmth never extends to supplying content
