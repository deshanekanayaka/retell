# Tasks

Live task state. One line per task. Completed items move to progress.md as one line each, they
do not accumulate here.

Steps are defined in docs/03-delivery-plan.md. There are no dates.

## Now

`feature/s3-evaluate-and-feedback` merged 2026-08-29, three days after it was built, following
the reconciliation in context/docs-review-decisions.md. Tenant id injection, the replay hole,
and FR-10's unenforced 15 second floor were fixed on the branch before merging; the bare retry
now logs its first failure. `temperature: 0` was considered and dropped, models released after
Opus 4.6 reject any value but 1.0, so self-consistency is verified empirically, not pinned.

- [ ] `gap` is validated by the prompt only. Add a code-level check: ends as a question, within
  a length cap, no supplied detail the speaker didn't say (the one field that can break
  ADR-009 in front of a user)
- [ ] Deepgram's per-word `confidence` isn't captured at all. Keep it when parsing, store one
  summary figure on `attempt`. Collect only, no threshold gate yet, distribution unknown
- [ ] Build the evaluation harness: ~20 answers recorded by Deshan with deliberately varied
  quality, self-labelled before seeing model output, held-out split, majority-class baseline,
  CI assertions (no outcome → structure ≤1, "we" throughout → specificity ≤1, wrong question →
  relevance ≤1, identical input → identical output)
- [ ] Docs pass: reconcile the branch's own docs edits (docs/02, 04, 06, already merged in) with
  context/docs-review-decisions.md's 69 logged decisions. Not yet done, the two were never read
  against each other
- [ ] Rewrite context/features/s3-evaluate-and-feedback-spec.md to describe what's actually
  built plus what's left, not a from-scratch plan
- [ ] S4: accounts, anonymous session claim, save an answer as a story

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

- [ ] Question bank: replace the single hardcoded `PHASE_1_QUESTION` with the real per-angle
  bank (docs/05 section 1.1), roughly 3 per angle plus a twist each. Needed before S8, and
  ideally before the gold set so calibration answers span real questions, not one stopgap
- [ ] Restart handling: a false start under 10 seconds is free and unlimited, a redo after 10
  seconds is capped at one (S1, RecordingUI)
- [ ] Mic check transcribed internally against its known sentence, solely to measure
  transcription reliability. Never shown, scored, or played back. Amends FR-3
- [ ] Low-confidence UX: plain message that it didn't come through clearly, gap sentence
  omitted, one optional re-record kept alongside the original. Needs confidence capture first
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
