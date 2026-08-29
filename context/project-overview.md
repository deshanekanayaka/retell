# Project Overview (working summary)

Compact orientation for sessions. **This file summarises, it never overrides.** Source of truth
is `docs/`, index at docs/00-README.md.

## What Retell is

A voice-first interview practice web app for final year students and new graduates. The user
records their own career stories, then gets a five minute daily session of behavioural questions
answered by speaking out loud for about sixty seconds each. Typing is never an option. Answers
are transcribed, scored against a three dimension rubric, and returned as the user's own words
with one gap named. From Phase 2, question and story pairings return on a spaced repetition
schedule, with twist questions that break memorised answers.

**Wedge**: your own stories, spoken out loud, five minutes a day. Speaking and short sessions are
copyable in a sprint; the story library is the only part that compounds.
**Moat**: none proven. Recorded as a risk, reviewed at the phase gate.
**Money**: free in Phase 1, no payment code. Leans toward paid depth over paid volume, since the
daily session and a user's own stories are never paywalled (FR-40). Eventual shape TBD at the
Phase 2 gate.
**Language**: Retell practises interview delivery in English and does not teach English. The
rubric scores content only, deliberately blind to fluency, so a non-native speaker's content is
judged fairly (docs/01 section 1).

## Boundaries that shape every feature

- Never write a story for the user. Elicit, structure, probe, label (ADR-009, docs/01 section 5).
- Never promise an outcome (docs/01 section 5).
- Recordings are private, never training data without opt in (default off, docs/06), deletable
  for real, storage object and row both (docs/06 section 8).
- No competency word ever appears in a question during onboarding or on a new pairing (docs/01
  FR-6). A Phase 2 twist on an item already graded well may use real-world competency phrasing,
  since that is the harder constraint a twist is built to apply.
- No dark patterns on the habit layer (docs/01 section 5, docs/05 section 7).
- No device fingerprinting, no fine-tuning on user recordings, no analytics or marketing cookies
  (docs/01 section 5).
- Warm everywhere, praise nowhere it is not earned (docs/07 section 6).
- Raw audio is never lost. Facts and judgements stored separately (docs/06 section 3).

## Where things are decided

| Question | Doc |
| --- | --- |
| What we are building and for whom | docs/01-PRD.md |
| System design, stack, what is not built | docs/02-system-architecture.md |
| Order of work, gates, kill criteria | docs/03-delivery-plan.md |
| Capture, transcription, the rubric, the prompt | docs/04-voice-and-evaluation.md |
| Items, grading, scheduling, sessions, twists | docs/05-spaced-repetition.md |
| Schema, retention, privacy promises | docs/06-data-and-privacy.md |
| Why past decisions were made | docs/decisions/ |
| Type, colour, motion, voice and tone | docs/07-design-system.md |
| How we work | docs/workflow/development-workflow.md |

## Current phase

**Phase 1**, in progress. S0 through S3 (setup through evaluate and feedback) are built and
merged. Not deployed to real users.

Phase 1's gate is engineering, not a behavioural number: a recruited cohort test is unlikely
(path B, docs/03-delivery-plan.md section 1), so "do people come back" is not measured. The
gate is rubric agreement against a self-labelled gold set, model self-consistency, measured cost
per session, and a working real-phone flow (docs/01 section 6).

Live task state: context/tasks.md. Completed history: context/progress.md. Decisions from the
2026-08-29 full docs review: context/docs-review-decisions.md.
