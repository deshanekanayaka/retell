# Progress

Append-only completion log. One line per completed piece of work: date, name, one sentence
outcome. Written at step 10 of the feature workflow.

- 2026-08-23: S0 commands — filled in real pnpm commands in CLAUDE.md (dev, build, test, lint,
  typecheck) and verified each one runs clean against the scaffolded app.
- 2026-08-23: S0 complete — repo pushed to origin/main, CI green, Vercel deploy live, Supabase
  project wired with client/server helpers in lib/supabase/.
- 2026-08-31: Docs pass re-check against today's code — gap validation, confidence capture,
  angles/parts schema and the question bank all matched their decisions in
  context/docs-review-decisions.md. One gap found and fixed: decision 24 names quadratic
  weighted kappa as the gold-set metric, but `lib/harness/report.ts` only had exact/within-one
  agreement and a majority-class baseline. Added `quadraticWeightedKappa` (test-first, 5 new
  tests) and wired it into `run-gold-set.eval.test.ts`'s printout.
- 2026-08-23: S1 complete — record and upload merged to main. Anonymous Supabase auth,
  Chrome/Chromium gate, permission screen (ADR-014: plain `getUserMedia`, not `<usermedia>`,
  ADR-013 superseded), MediaRecorder capture with countdown/restart/waveform, signed-URL upload
  to Supabase Storage, dev-only verification route, and the two-arm validation pages
  (`/validate/a`, `/validate/b`). Real-phone testing and FR-35 deferred (ADR-012). Verified live
  against the hosted Supabase project throughout, plus ad-hoc Playwright checks for flows the
  automated gates don't cover.
- 2026-08-24: UI screens, desktop — all 16 Phase 1 wireframe screens built at the desktop
  viewport against docs/07, presentational only. Fraunces and Instrument Sans, colour tokens,
  seven shared primitives, S1 components restyled in place, 13 static preview screens under
  `app/screens` kept off real routes so nothing ships ahead of its gate. Accessibility pass
  added a focus trap on the delete dialog, the reduced-motion waveform docs/07 5.4 already
  specified, a live region for recording state, headings and a main landmark. `muted` moved to
  `#696F66` to clear the 4.5:1 docs/07 3.4 commits to; 3.4 rewritten so the hairline exemption
  is a stated constraint rather than an unmet claim.
- 2026-08-24: Landing page — real page at `/`, replacing the create-next-app boilerplate that
  was still the deployed root. Hero, tagline moment, how it works, why out loud, the ADR-009
  boundary as a selling point, privacy, an eight question FAQ, closing CTA. No testimonials or
  stats, since the product has no users and fabricating proof is not on the table. Ships part
  of S5 ahead of its gate deliberately, recorded in the spec; the rest of S5 stays parked.
  Also fixed two recording-screen defects from the previous step (waveform drew a flat step
  because smoothing was applied per frequency bin; `/record` never centred its content), and
  added `context/screens.md`, an inventory of all 17 screens with status. That inventory
  surfaced two open gaps: FR-22's duration and pace block is missing from the feedback screen,
  and the privacy page does not exist while the landing footer needs it.
- 2026-08-25: S2 complete — transcribe and signals merged to main. New `attempt` table holds
  facts for `answer`-type recordings; `recording` narrows to `mic_check`/`validation_a`/
  `validation_b`, which are never transcribed, with no migration since no real user data existed
  yet. Deepgram transcription isolated in `lib/deepgram.ts` (mirrors `lib/evaluate.ts`'s
  provider isolation), word-level signal computation (duration, pace, longest pause, filler
  count) in `lib/signals.ts`, TDD'd against the fixed filler list docs/04 specifies. Verified
  live against the dev Supabase project: a real recording with six deliberate fillers came back
  with all six intact in the transcript and correct signal values. docs/02 and docs/06 updated
  to close out the `recording`/`attempt` interim-table question left open since S1.
- 2026-08-26: S3 complete — evaluate and feedback merged to main. `lib/evaluate.ts` scores three
  rubric dimensions with claude-opus-5 against a Zod-enforced schema (FR-19), stamps model and
  rubric version (FR-20), and writes to a new `evaluation` table kept separate from `attempt`
  (FR-21). Rails (situation, action, result) are returned as sentence positions, never text, and
  resolved to word ranges in `lib/rails.ts`, so the model can never write words that land next
  to the user's own transcript (ADR-017). Feedback screen shows the three blocks in order with
  no score (FR-22, FR-23), degrading to transcript-only if evaluation fails. Deepgram pinned to
  `model=nova-2` with `punctuate=true`: the default base tier mistranscribed second-language
  speech and nova-3 drops the filler words `filler_count` depends on as a contract signal.
  Verified live against six real recordings across the calibration and post-review passes.
  Accepted, not fixed: a vague answer can leave a plausible action sentence unclaimed and score
  structure one point lower than a generous read would, watched in the cohort rather than tuned
  on three samples.
- 2026-08-29: S3 reconciled and merged to main. Built on `feature/s3-evaluate-and-feedback`
  2026-08-26 but never merged; found three days later during a full docs walkthrough
  (context/docs-review-decisions.md). Reviewed properly, then fixed on the branch before
  merging: `createAttempt` and a new `findAttemptByPath` reject any storage path not prefixed
  with the caller's verified user id (tenant id injection), an existing attempt for a path now
  resumes instead of reprocessing (the replay hole), and FR-10's 15 second floor is enforced via
  a new `isTooShortToScore` (`lib/signals.ts`), with the feedback screen distinguishing that
  case from a genuine evaluation failure without ever calling an answer too short. `evaluateAnswer`'s
  retry now logs the first failure instead of swallowing it. `temperature: 0` was considered and
  dropped: the installed SDK rejects any value but 1.0 on models released after Opus 4.6, so
  self-consistency is verified empirically rather than pinned. Confidence capture and code-level
  `gap` validation remain open, tracked in context/tasks.md alongside the evaluation harness and
  the docs pass still owed against the branch's own docs/02, 04, 06 edits.
- 2026-08-29: docs pass, remaining hardening, and the evaluation harness. The 69 decisions from
  the docs walkthrough applied across docs/01 through 07 (largest changes: docs/01 drops the
  day-4/day-14 metrics for an engineering gate and gains four new FRs; docs/03 cuts the cohort
  test entirely, path B; docs/05 fixes an unreachable grade-formula bound and reverses `again`'s
  reset behaviour). `gap` gets a code-level check (`lib/gap.ts`), catching two bugs in its own
  first draft along the way. Deepgram's per-word confidence is captured, summarised
  (`computeMeanConfidence`), and stored (`attempt.confidence`, new migration). The evaluation
  harness (`lib/harness/`) is scaffolded: confusion matrix and agreement math, four CI
  behavioural assertions against authored fixtures, a gold-set runner that reports and does not
  gate, kept out of `pnpm test` via a second vitest config and run with `pnpm test:eval`; the 20
  recorded, self-labelled answers it needs are still Deshan's to produce. The real per-angle
  question bank (`lib/questions.ts`) is drafted, approved, and committed, not yet wired into the
  answer route since question selection is S6/S8's job. docs/03's Phase 1 stop is now a
  condition (the engineering gate, section 7.1 met, full stop) rather than an unset date.
- 2026-08-29: Landing brand and motion — a wordmark (a single-line voice-burst waveform, echoing
  the recording waveform and a new ambient hero wave), favicon/apple-icon/OG image, five SVG
  section illustrations built from product objects (the record control, transcript rails, story
  chips), and entrance/ambient motion under a new founder-approved docs/07 section 5.5 scoped to
  marketing pages only. A second pass tightened section padding, added the illustrations, and
  moved the three-step list and FAQ to multi-column grids after Deshan flagged the first cut as
  too spaced out and too text-heavy. Considered and rejected without an ADR: a Duolingo-style
  mascot (banned outright) and a cinematic scroll-film treatment (conflicts with docs/07 5.2/5.3
  as written). Design skill packs installed to `~/.claude/skills` this session for advisory use.
  Record, feedback and privacy screens still carry the old plain treatment; that follow-up pass
  is unscoped.
- 2026-08-30: Rewrote context/features/s3-evaluate-and-feedback-spec.md from a pre-implementation
  proposal to an as-built record. Resolved all five "Open, needs Deshan" gate items inline
  (question text, ADR-017, feedback route, grade column, schema), added a "Built beyond this
  spec" section for gap validation, confidence capture, the replay guard and the too-short
  degrade path, trimmed the locators-not-quotes reasoning to point at ADR-017 instead of
  duplicating it, and closed with a "Still open" section mirroring tasks.md's five remaining Now
  items. Doc-only, no code changed.
- 2026-08-30: First 5 of ~20 gold-set entries recorded, self-labelled, added to
  `lib/harness/gold-set.json`. Running the harness surfaced a real bug: a rejected `gap` (caught
  correctly by `lib/gap.ts`, most often on vague answers producing a double-barrelled question)
  discarded the entire evaluation, scores and rails included, after one retry. Fixed in
  `lib/evaluate.ts`: `gap` now gets its own dedicated one-shot retry separate from the
  schema/refusal retry, and a second gap failure stores everything else with `gap: null` rather
  than throwing the evaluation away. `Evaluation.gap` and `StoredEvaluation.gap` are now
  `string | null`; the feedback screen gained a third branch (evaluation present, gap null) with
  its own degrade copy. Migration `20260830203456_evaluation_gap_nullable.sql` drops the
  column's `not null`. First gold-set report (n=5, too small to read as more than a first look):
  structure exact agreement 40%, a second data point corroborating the structure-anchor bug
  already in tasks.md.
