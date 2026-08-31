# Tasks

Live task state. One line per task. Completed items move to progress.md as one line each, they
do not accumulate here.

Steps are defined in docs/03-delivery-plan.md. There are no dates.

## Now

`feature/s3-evaluate-and-feedback` merged 2026-08-29, three days after it was built, following
the reconciliation in context/docs-review-decisions.md. Tenant id injection, the replay hole,
and FR-10's unenforced 15 second floor were fixed on the branch before merging; the bare retry
now logs its first failure. `temperature: 0` was considered and dropped, models released after
Opus 4.6 reject any value but 1.0, so self-consistency is verified empirically, not pinned. Same
day, the full docs pass (69 decisions applied across docs/01 through 07) landed, and so did:

- [x] `gap` code-level validation (`lib/gap.ts`): single question, length cap, no invented
  numbers. Caught two real bugs of its own in the process (question-mark counting missed the
  double-barrelled shape docs/04's own example uses; digit-only number matching missed spelled-
  out numbers), both fixed with tests.
- [x] Confidence capture: `lib/signals.ts`'s `computeMeanConfidence`, threaded through
  `lib/deepgram.ts`, `lib/supabase/attempts.ts`, the route, and the dev verify page. New
  migration `20260829140000_attempt_confidence.sql`. Still collect-only, no threshold gate.
- [x] Evaluation harness scaffolding: `lib/harness/` (report math, gold-set types, the four CI
  behavioural assertions, a gold-set runner that reports but does not gate), kept out of the
  default `pnpm test` via `vitest.config.mts` / `vitest.harness.config.mts` and run with
  `pnpm test:eval`.
- [x] Question bank: `lib/questions.ts`'s `QUESTION_BANK`, one plain question and one twist per
  angle, approved by Deshan. Not yet wired into the answer route, since question selection is
  S6/S8's job and neither exists on main yet; this is the data those steps will select from.
- [x] Phase 1 hard stop, docs/03 section 1: condition based, not a calendar date. Phase 1 is
  finished when every item in section 7.1's engineering definition of done is checked off, full
  stop, regardless of what else still seems improvable.

- [ ] The evaluation harness needs real data before it says anything: ~20 answers recorded by
  Deshan with deliberately varied quality, self-labelled before seeing model output, held-out
  split, dropped into `lib/harness/gold-set.json`. `pnpm test:eval` reports agreement once it's
  filled in. **5 of ~20 done 2026-08-30.** First read: structure exact agreement 40%, model
  consistently scores structure a point above Deshan's label on the three `structure: 1` entries,
  a second data point corroborating the anchor bug below. Relevance also worth a second look:
  entries 2 and 4 were labelled `relevance: 1` for being vague, but relevance and specificity are
  meant to be scored independently (docs/04 section 3.2), and both entries are arguably on-topic
  just unspecific, the same conflation caught and corrected on a fifth (off-topic) entry before
  filing. n=5 is too small to read as more than a first look.
- [x] Rewrite context/features/s3-evaluate-and-feedback-spec.md to describe what's actually
  built plus what's left, not a from-scratch plan
- [ ] S4: accounts, anonymous session claim, save an answer as a story
- [ ] Check the `structure` anchor in docs/04 section 3.2 against
  `lib/harness/assertions.eval.test.ts`'s "never says how it ended" case. That fixture (situation
  and action present, no result stated) scores `structure: 2` from the model consistently, every
  run, both before and after the transcript trust-boundary prompt edit (2026-08-29). The test
  expects 1 or lower. This is not model flakiness: the anchor as written ("2: two of the three
  present") literally matches this transcript, since situation and action are both present. The
  test's author likely intended "structure clearly incomplete" to mean 1, which the current
  wording does not enforce. Needs a decision: fix the anchor wording, fix the test's expected
  score, or confirm 2 is correct and the test fixture was written on a wrong assumption. Founder
  decision, rubric anchors are propose-only (context/ai-interaction.md).

## General hardening, needed before real users

- [ ] Explicit auth guard at the top of the route, before `request.json()`. Auth is currently
  transitive via `requireSession()` several lines in
- [ ] `Cache-Control: private, no-store` on route handler responses carrying per-user data
- [ ] `file_size_limit` and `allowed_mime_types` on the `recordings` bucket. The 60 second cap
  is client side only, and the upload goes straight to a signed URL
- [ ] One error shape across routes, per context/coding-standards.md. The answer route returns
  a JSON error for a bad body and an unhandled 500 for everything else
- [ ] Turnstile before the first anonymous answer, verified server side; session-based rate
  limiting with IP as a coarse ceiling only; a per-hour spend ceiling alongside the daily one

## Later, parked

- [ ] Restart handling: a false start under 10 seconds is free and unlimited, a redo after 10
  seconds is capped at one (S1, RecordingUI)
- [ ] Mic check transcribed internally against its known sentence, solely to measure
  transcription reliability. Never shown, scored, or played back. Amends FR-3
- [ ] Low-confidence UX: plain message that it didn't come through clearly, gap sentence
  omitted, one optional re-record kept alongside the original. Confidence capture is done
  (`attempt.confidence`); the threshold and the screen behaviour are not built yet
- [ ] `training_opt_in` column, default false, lands with accounts in S4
- [ ] S5: the seven onboarding screens (unparks after the validation results are read)
- [ ] S6: five question session, rate limits, kill switch, deletion (unparks after S5)
- [ ] S7: cohort test — cut per context/docs-review-decisions.md decision 52. Ships on docs/04's
  design reasoning alone, no cohort measurement in Phase 1
- [ ] Phase 2 (S8 to S13) unparks once the engineering definition of done in
  context/docs-review-decisions.md decision 9 is met
- [ ] Confirm Deepgram and model provider retention and training defaults (required before
  deploying to friends, per decision 68)
- [ ] Test Supabase restore (required before real users)
- [ ] In-app browser detection and gate, FR-35 — deferred out of S1, desktop Chrome is the
  focus for now, revisit if mobile/social recruitment needs it
- [ ] Denial-screen worked example (docs/04 section 1.1) — a fictional labelled example answer
  plus the question it answers. Founder-authored content, required before the denial path is
  fully spec-compliant. Ships without it for now; fixed copy and question only.
- [ ] Real privacy policy. `/privacy` is a plain-language placeholder built from docs/06 and
  says so on the page. Needs the named processors (transcription and model providers), a data
  controller, a contact route for data requests, and formal terms. Required before deploying to
  friends, and pairs with the Deepgram retention item above, which answers part of it.
- [ ] Account deletion: delete the user's storage objects first, then the `auth.users` row via
  the admin API, letting existing foreign keys cascade the rest. Test asserts the storage object
  is actually gone, not just the row (decision 64)
