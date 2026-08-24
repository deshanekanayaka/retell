# ADR-016: The feedback screen shows no duration or pace

Status: Accepted
Date: 2026-08-24
Deciders: Deshan Ekanayaka

## Context

FR-22 required the feedback screen to show four blocks in a fixed order: the transcript with
situation, action and result highlighted; one gap phrased as a question; **duration and pace as
plain facts**; and the question types the story covers.

The third block was built, reviewed on screen, and removed during the desktop UI pass because
it did not earn its place next to the gap. That left a P1 requirement unmet by the shipped
design, recorded as a gap in `context/screens.md` and `context/tasks.md` rather than quietly
ignored.

This ADR closes that gap by changing the requirement rather than restoring the block.

## Decision

**Duration and pace are no longer shown to the user in Phase 1.** FR-22 drops to three blocks:
transcript, gap, labels.

**Nothing changes about computing or storing them.** FR-17 stands unaltered: duration, words
per minute and longest pause are still computed from the audio and timestamps, never inferred
by a model, and still written to the `attempt` row. They are needed for grade derivation in
Phase 2 (FR-27), for rubric calibration, and for reading the validation results. Removing a
block from a screen is not permission to stop collecting the data behind it.

## Why

**The gap is the only thing on that screen the user acts on.** docs/04 section 3.4 already
gives it the most weight and warns that two questions on one screen is a real risk. A pair of
numbers sitting under it competes for the same attention without asking for anything.

**A number next to feedback reads as a score, whatever the label says.** FR-23 keeps every
rubric score off the screen in Phase 1, on the reasoning that a number on screen turns daily
practice into a verdict. "138 wpm" is not a rubric score, but it is a number about the user's
performance shown immediately after their answer, and the distinction is clearer in the
document than it is to an anxious 21 year old. docs/07 section 3.3 already had to ban coloured
pace ranges and gauges for the same reason, which is a sign the block was pulling toward
judgement.

**No user action follows from it.** The product never says what a good pace is, and it should
not: pace advice depends on the question, the person and the room. A fact with no interpretation
and no next step is decoration on a screen whose whole design thesis is restraint.

## Alternatives considered

**Restore the block as specified.** Rejected: it was removed after seeing it, and the reasons
above are the reasons it looked wrong.

**Show duration only, drop pace.** Rejected as the worst of both. Duration alone still reads as
a measurement, and "64 sec" invites the same "is that good?" question with even less context.

**Move the facts elsewhere, such as the recordings screen.** Not rejected, deferred. There is a
reasonable case for surfacing speech signals somewhere the user can look at them deliberately,
away from the moment of feedback. Nothing is designed for that today and it is not Phase 1 work.

## Consequences

- FR-22 is amended in docs/01-PRD.md. FR numbers are contracts and are not renumbered; the
  requirement's text changes and this ADR records why.
- docs/02-system-architecture.md, docs/04-voice-and-evaluation.md and docs/07-design-system.md
  are updated in the same change to stop describing a block that will not exist.
- docs/07's `Facts, the numbers` and `Facts, the labels` type roles keep their rows but are
  marked unused in Phase 1, since the deferred alternative above would need them back.
- The validation track and Phase 1 metrics are unaffected. They read stored signals, not the
  screen.
- **Revisit trigger.** If cohort testers ask how long they spoke or how fast, that is evidence
  the deferred alternative is worth designing, and this decision gets reopened.
