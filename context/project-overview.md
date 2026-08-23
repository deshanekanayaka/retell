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

**Wedge**: five minutes, spoken out loud, on your own stories.
**Moat**: none proven. Recorded as a risk, reviewed at the phase gate.
**Money**: free in Phase 1, no payment code. Eventual shape TBD at the Phase 2 gate.

## Boundaries that shape every feature

- Never write a story for the user. Elicit, structure, probe, label (ADR-009, docs/01 section 5).
- Never promise an outcome (docs/01 section 5).
- Recordings are private, never training data without opt in, deletable for real (docs/06).
- No competency word ever appears in a question shown to a user (docs/01 FR-6).
- No dark patterns on the habit layer (docs/01 section 5, docs/05 section 7).
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
| How we work | docs/workflow/development-workflow.md |

## Current phase

**Phase 1**, not started. Nothing is built, deployed or tested. Next step is S0, project setup.

Phase 1 answers one question: do people come back on day four?

Live task state: context/tasks.md. Completed history: context/progress.md.
