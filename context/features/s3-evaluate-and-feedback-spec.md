# S3 Evaluate and Feedback Spec

## Overview

Turns a transcribed attempt into three rubric scores, one gap question and a set of angle
labels, stores them separately from the facts, and shows the user the feedback screen. Implements
docs/01-PRD.md FR-19 (three dimensions, schema enforced), FR-20 (model and rubric version
stamped), FR-21 (facts and judgements in separate tables), FR-22 (the three blocks in order),
FR-23 (no score shown) and FR-24 (never wrong, one specific thing).

This is the third of the three steps that make one answer end to end (docs/03-delivery-plan.md
section 4), sitting after S2 (transcribe and signals) and before S4 (accounts and stories). Built
on `feature/s3-evaluate-and-feedback`, merged to main 2026-08-29 after the docs review
reconciliation in context/docs-review-decisions.md. A person can speak an answer and get real
feedback without an account.

Introduced the `evaluation` table from docs/06 section 2, and `lib/evaluate.ts`, the one module
that knows which model provider is used (docs/02 section 3.2).

The previous version of this spec gated implementation on five founder decisions, listed at the
bottom under "Open, needs Deshan". All five are resolved and folded into the sections below.

## Requirements

### Evaluation

- `evaluation` matches docs/06 section 2's column list: `id`, `attempt_id`, `model`,
  `rubric_version`, `relevance`, `structure`, `specificity`, `gap`, `angles`, `created_at`, plus
  the three span columns below. `grade` was created nullable and stays unpopulated, since grade
  derivation is FR-27 and Phase 2. Confirmed in
  `supabase/migrations/20260825213449_evaluation.sql`.
- Row level security is enabled on `evaluation`, scoped through `attempt_id` to the owning
  session (no `session_id` column of its own, so the two can't disagree).
- Each answer is scored 0 to 3 on `relevance`, `structure` and `specificity`. The anchors in
  docs/04 section 3.2 are reproduced verbatim in `lib/evaluate.ts`'s `SYSTEM_PROMPT`.
- The response schema is enforced with `zodOutputFormat`, never `JSON.parse` on free text
  (context/coding-standards.md).
- Every evaluation row is stamped with `model` and `rubric_version` (FR-20).
- `angles` is constrained to the nine slugs in docs/05 section 1.1, as a Postgres check
  constraint (`angles <@ array[...]`) and a Zod enum in the response schema, both sourced from
  the single list in `lib/angles.ts`. An invented slug cannot reach the database.
- `gap` is one sentence phrased as a question, no praise, no softener (docs/04 section 3.4),
  code-validated in `lib/gap.ts` (see "Built beyond this spec").
- The model is never given duration or pace. Speech signals are computed in S2 and never reach
  the prompt (docs/04 section 3.4).
- The model cannot return a grade, a total, or free prose beyond `gap`. The schema has no field
  for any of them.
- All provider knowledge is isolated in `lib/evaluate.ts`. No other file imports
  `@anthropic-ai/sdk`.
- `RUBRIC_VERSION` is held at 1 through S3 calibration, on Deshan's call: no answer has been
  evaluated by a real user yet, so the span fields and angle enum land inside version 1 rather
  than forcing a second migration once the cohort exists.

### Sentence spans, for the transcript rails

- The situation, action and result parts are locators into the transcript
  (`{ start, end }` sentence ranges), never text written by the model. Why: ADR-017, which is now
  the permanent record of this decision. This spec no longer restates the reasoning.
- Each part is one contiguous range. `lib/rails.ts`'s `resolveRails` enforces one rail per part
  structurally.
- Sentence indices are resolved to word index ranges once, in `lib/rails.ts`, and stored as
  `situation_start_word` / `situation_end_word` (and the `action_`/`result_` equivalents) on the
  `evaluation` row. Sentence numbering is a prompt-time convenience and is never persisted.
- The feedback screen never recomputes the sentence split. `lib/transcript.ts`'s
  `toTranscriptSegments` slices the stored transcript by stored word range.
- An individual part drops (no rail, no label) when its range is out of bounds, inverted, or
  overlaps a range already claimed by another part, per `lib/rails.ts`. A drop never fails the
  whole evaluation; each part resolves independently.
- Parts are not ordered relative to each other. `resolveRails` claims sentences in a fixed
  `situation, action, result` order for determinism, which means `result` is the rail
  systematically lost on the rare contradiction; not yet a problem seen in calibration reads.
- Sentences are split from the word array by terminal punctuation on each word
  (`lib/sentences.ts`), not by regex over the transcript string.
- Deepgram runs with `punctuate=true`; `WordTiming` carries `punctuatedWord` alongside `word`.
  Verified not to move `filler_count` (see Test plan).

### The feedback screen

Live at `app/feedback/[attemptId]/page.tsx`. In order, one column at every viewport (docs/04
section 4):

- The question answered, quiet and small at the top, from `attempt.question_text`.
- The transcript with situation, action and result marked. Rendered from
  `attempt.word_timings` via `lib/transcript.ts`, not from `attempt.transcript`: rails are word
  positions, so the screen slices the same array the positions index into. Every word appears
  exactly once, in order.
- Parts are labelled "the setting", "what you did", "how it ended" via `lib/rail-labels.ts`.
  Never "Situation", "Action", "Result".
- A part the answer does not contain draws no rail and no label. No empty row.
- No score, no total (FR-23, ADR-011). No duration or pace (ADR-016).
- One action beneath the gap, "Have another go at this one", linking to `/record`, which re-asks
  the original question, not the gap question.
- One retry on a failed model call before degrading the screen (`lib/evaluate.ts`,
  `requestEvaluation` called twice on failure). Not rate limiting or spend capping, which stay
  out of scope until S6.
- No "next question" control. Nothing follows the angle chips.
- The neutral line "There is no right answer to this. Just say what you personally did." under
  the gap.
- No example answer, no suggested phrasing, no sentence starter anywhere on this screen
  (ADR-009, docs/04 section 4.2).
- No playback of the recording (FR-25).

### The question

- The question text is stored on `attempt.question_text`, resolved server-side in
  `app/api/answer/route.ts` from `lib/questions.ts`'s `PHASE_1_QUESTION`, never sent from the
  browser: `relevance` is scored against it, so a client must not choose what its own answer is
  judged against.
- Approved wording: "Tell me about something you worked on with other people recently. What
  happened?" Names no competency (FR-6) and asks for an event, which `structure` needs.
- The `question` table and `question_id` foreign key are still deferred to the spec that wires up
  question selection (S6/S8).

## Built beyond this spec

Landed the same day as the merge (context/tasks.md, 2026-08-29), not described by the original
proposal below:

- **`gap` code-level validation**, `lib/gap.ts`: length cap, must end in exactly one `?`, rejects
  a second question clause joined by "and", rejects any number in `gap` not present in the
  transcript. A code-level backstop, since the prompt is a request, not a guarantee. A failed
  check is treated the same as a schema mismatch and feeds the existing retry.
- **Confidence capture**, `lib/signals.ts`'s `computeMeanConfidence`, threaded through
  `lib/deepgram.ts`, `lib/supabase/attempts.ts`, the route and the dev verify page. Migration
  `20260829140000_attempt_confidence.sql`. Collect-only for now, no threshold gate (parked item
  in context/tasks.md, "Low-confidence UX").
- **Replay guard**, `app/api/answer/route.ts`: `findAttemptByPath` checks for an existing attempt
  before processing, so a retried request, a resubmit, or a replay of a signed upload path
  resumes the existing attempt instead of re-spending the Deepgram and model budget. Fixed on the
  branch before merge, per the docs review reconciliation.
- **Too-short-to-score degrade path** (FR-10): `isTooShortToScore` short-circuits the route below
  15 seconds. Not an error; the attempt is saved and the feedback screen shows the transcript
  with no gap, the copy "Let's try an easier way in." The 15 second floor itself was previously
  unenforced and was fixed on the branch before merge.
- **Evaluation harness scaffolding**, `lib/harness/`: report math, gold-set types, four CI
  behavioural assertions, a gold-set runner. Reports but does not gate yet, kept out of the
  default `pnpm test` via `vitest.harness.config.mts`, run with `pnpm test:eval`. Not part of
  this spec's requirements; it exists because S3's real job, per
  context/docs-review-decisions.md decision 23, is producing the labelled dataset that proves the
  rubric is good.

## Out of scope

- Grade derivation, the interval ladder, the `review` row, anything scheduling (FR-27, FR-28).
  Phase 2, docs/05.
- "Save this as a story" on the feedback screen. Needs the `story` table and an account. S4.
- The `question` table, a question bank beyond `lib/questions.ts`'s `QUESTION_BANK` (built, not
  wired in), angles attached to questions, twist questions. S6/S8.
- Rate limits, spend caps, kill switch (docs/02 section 3.5). S6.
- The recovery ladder for answers under 15 seconds (docs/04 section 5) beyond the plain degrade
  message above. The `no-result` and `recovery` preview screens exist but are not wired to a real
  short answer.
- Playback anywhere (FR-25).
- Whether a second attempt replaces the first. Explicitly left open by docs/04 section 4.2 and
  owned by Deshan. Both attempts are stored either way.
- Re-scoring historical attempts. The separation exists to make it possible later, no tooling is
  built now.

## Implementation notes

### Why locators, not quotes

Reasoning now lives permanently in ADR-017. In short: a model given a free text field tidies a
false start into a sentence the user never said, and that would render beside their real
transcript as though they had said it, on the screen docs/04 section 4.2 calls the most dangerous
place to put invented words. Positions from a numbered sentence list were chosen over free text
(unsafe) and direct word indices (models count badly); see the ADR for the full comparison.

### Files touched

| File | Change |
| --- | --- |
| `supabase/migrations/20260825213449_evaluation.sql` | `evaluation` table, RLS, `attempt.question_text` |
| `supabase/migrations/20260829140000_attempt_confidence.sql` | `attempt.confidence`, built beyond this spec |
| `lib/questions.ts` | `PHASE_1_QUESTION`, plus the unwired `QUESTION_BANK` |
| `lib/gap.ts` | Built beyond this spec, code-level `gap` validation |
| `lib/deepgram.ts` | `punctuate=true`, parses `punctuated_word` |
| `lib/signals.ts` | `WordTiming` gains `punctuatedWord`; `computeMeanConfidence` added |
| `lib/sentences.ts` | Pure. Splits word array into sentences by terminal punctuation |
| `lib/rails.ts` | Pure. Validates model ranges, resolves to word ranges, drops invalid parts |
| `lib/angles.ts` | The nine angle slugs, shared by schema, migration and tests |
| `lib/evaluate.ts` | Prompt, enforced schema, retry, the only file knowing the provider |
| `lib/supabase/evaluations.ts` | Writes and reads an evaluation row |
| `lib/supabase/attempts.ts` | Stores and reads `question_text` and `confidence`; replay lookup |
| `app/api/answer/route.ts` | Calls evaluate after signals, writes the evaluation row, replay guard, too-short short-circuit |
| `lib/transcript.ts` | Pure. Rails plus words become ordered segments for rendering |
| `lib/rail-labels.ts` | The three margin labels, shared by the feedback screen and the dev page |
| `app/feedback/[attemptId]/page.tsx` | The real feedback screen |
| `components/ui/TranscriptRail.tsx` | Renders real transcript text |
| `app/dev/verify-attempt/page.tsx` | Shows sentence split, chosen ranges, confidence, for calibration |

### A free consistency check

`structure` is scored 0 to 3 by how many of the three parts are present, so the model states the
same thing twice in one response, once as a number and once as three ranges. Disagreement (for
example `structure` of 3 with only two ranges returned) is never enforced and never a reason to
discard the evaluation. Nothing is logged for it beyond the existing columns, since the
disagreement rate is one SQL query over data already kept. What is not recoverable is a rail
dropped for overlap or range, since a dropped rail and an unclaimed one are both `NULL`. So
`resolveRails` reports its drops and `evaluate.ts` logs them to the server console, unstored. If
drops turn out to be common, a diagnostics column can be added.

Open, unresolved: `lib/harness/assertions.eval.test.ts`'s "never says how it ended" fixture
(situation and action present, no result) scores `structure: 2` from the model consistently,
where the test expects 1 or lower. Tracked in context/tasks.md under "Still open" below, not
here, since it's a rubric anchor question and founder-decided.

## Test plan

`lib/sentences.ts` and `lib/rails.ts` were written test first per context/coding-standards.md and
the `tdd` skill.

- `lib/sentences.test.ts`: multiple sentences with `.`, `?` and `!`; a trailing fragment with no
  terminal punctuation; no punctuation at all (one sentence, not zero); a single word; an empty
  word array.
- `lib/rails.test.ts`: a valid three part answer; a null part; `start` after `end`; `end` past
  the last sentence; two parts claiming overlapping ranges; all three null. Each invalid part
  drops alone, the rest survive.
- `lib/angles.test.ts` pins the nine angle slugs, the same way S2 pins the filler list, so an
  accidental addition fails loudly.
- `lib/gap.test.ts` covers length, the double-barrelled shape, and invented numbers, added after
  gap validation caught two real bugs in itself during S2/S3 (question-mark counting missed the
  double-barrelled shape docs/04's own example uses; digit-only matching missed spelled-out
  numbers).
- `lib/questions.test.ts` covers the banned competency word list against `QUESTION_BANK`.
- The Deepgram punctuation gate (real recording, before and after `punctuate=true`, `filler_count`
  byte identical) was run manually before merge. No standing test, since it's a one-time provider
  behaviour check, not a regression to catch continuously.
- No unit test for the model call or the Deepgram call. External providers, per
  context/coding-standards.md.
- Manual: recorded real answers through `/dev/verify-attempt`, confirmed evaluation rows carry
  three scores, a gap, angles and resolved word ranges, and that the feedback screen shows no
  number anywhere.

### Calibration

Ran per docs-review-decisions.md decision 24: roughly 20 real spoken answers pushed through
`/dev/verify-attempt`, read by Deshan. Confirmed Deepgram punctuates run-on speech into usable
sentences and that sentence granularity holds up for a 140 word answer. The one open question
from that read is the structure-anchor ambiguity above, not sentence granularity.

The formal gold set (self-labelled, held out, scored for quadratic weighted kappa via
`pnpm test:eval`) is separate from this calibration read and is not yet built; see "Still open".

## Docs impacted

Applied:

- **docs/04 section 3.3**: schema carries three span fields, `angles` is an enum.
- **docs/04 section 4.1**: rails are sentence granular; ADR-017 records why.
- **docs/04 section 2**: `punctuate=true` required, alongside word timestamps and filler words.
  Model tier pinned to `nova-2`: the default base tier transcribes accented and second-language
  English badly, and `nova-3` silently drops `um`/`uh` even with `filler_words=true`, moving
  `filler_count` from 7 to 5 on identical audio, the same failure section 2 already rejects
  Whisper for. Provisional until cohort audio tests it.
- **docs/06 section 2**: `evaluation` gains the three span columns; `attempt` gains
  `question_text` and `confidence`. `evaluation` is one-to-many with `attempt`, not
  zero-or-one: re-scoring on a new model or rubric version writes a new row.
- **docs/02 section 3.4**: `question_text` recorded as an interim column ahead of the `question`
  table.
- **docs/02 section 3.2**: sequence diagram edge is `transcript only`. Speech signals are
  computed and stored under FR-17 but never reach the prompt, so a model can't fold speaking time
  into `specificity`.
- **ADR-017**: written and accepted, "Transcript rails are located, never quoted."

Not yet re-checked against this session's later changes (gap validation, confidence, the unwired
question bank): see "Still open".

## Still open

Carried from context/tasks.md's "Now" section, not this spec's job to resolve:

- **Gold-set data**: ~20 answers recorded by Deshan, deliberately varied quality, self-labelled
  before seeing model output, held-out split, into `lib/harness/gold-set.json`. Deshan's task,
  not an engineering one.
- **Structure anchor ambiguity**: docs/04 section 3.2's anchor for `structure: 2` ("two of the
  three present") matches the "never says how it ended" test fixture, which the test expects to
  score 1 or lower. Needs a founder decision: fix the anchor wording, fix the test's expected
  score, or confirm 2 is correct. Rubric anchors are propose-only (context/ai-interaction.md).
- **Docs pass re-check**: the reconciliation that landed with the merge has not been re-checked
  against this session's later edits (gap validation, confidence, the question bank existing but
  unwired).
- **Question bank wiring**: `lib/questions.ts`'s `QUESTION_BANK` is built and approved but not
  called from `app/api/answer/route.ts`. Question selection is S6/S8's job.
- **S4 dependency**: "Save this as a story" and account-scoped stories wait on S4 (accounts,
  anonymous session claim).
