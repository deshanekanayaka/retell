# Tasks

Live task state. One line per task. Completed items move to progress.md as one line each, they
do not accumulate here.

Steps are defined in docs/03-delivery-plan.md. There are no dates.

## Now

- [ ] S1: record in the browser, upload to storage, play back (FR-14, FR-15, FR-18)
- [ ] S1: permission screen with the fixed copy, Chrome gate (FR-2, FR-34)
- [ ] S1: static two arm validation page, arm A with mic check, arm B without
- [ ] S2: Deepgram transcription with word timings and filler words (FR-16)
- [ ] S2: compute duration, pace, longest pause, filler count (FR-17)
- [ ] S3: lib/evaluate.ts, schema enforced, three scores (FR-19, FR-20, FR-21)
- [ ] S3: feedback screen, transcript, gap, facts, angle labels (FR-22, FR-23, FR-24)

## Later, parked

- [ ] S4: accounts, anonymous session claim, save an answer as a story (unparks after S3)
- [ ] S5: the seven onboarding screens (unparks after the validation results are read)
- [ ] S6: five question session, rate limits, kill switch, deletion (unparks after S5)
- [ ] S7: cohort test, recruit 40 to 60 students, measure (unparks after S6)
- [ ] Phase 2 (S8 to S13) unparks only if the Phase 1 gate passes
- [ ] Separate Supabase project for preview deployments (required before S7)
- [ ] Confirm Deepgram and model provider retention and training defaults (required before S7)
- [ ] Test Supabase restore (required before real users)
- [ ] In-app browser detection and gate, FR-35 — deferred out of S1, desktop Chrome is the
  focus for now, revisit if mobile/social recruitment needs it
