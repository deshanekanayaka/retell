# S3 Evaluate and Feedback Spec

## Overview

Turns a transcribed attempt into three rubric scores, one gap question and a set of angle
labels, stores them separately from the facts, and shows the user the feedback screen. Implements
docs/01-PRD.md FR-19 (three dimensions, schema enforced), FR-20 (model and rubric version
stamped), FR-21 (facts and judgements in separate tables), FR-22 (the three blocks in order),
FR-23 (no score shown) and FR-24 (never wrong, one specific thing).

This is the third of the three steps that make one answer end to end (docs/03-delivery-plan.md
section 4), sitting after S2 (transcribe and signals) and before S4 (accounts and stories). After
this ships, a person can speak an answer and get real feedback without an account.

Introduces the `evaluation` table from docs/06 section 2, and `lib/evaluate.ts`, the one module
that knows which model provider is used (docs/02 section 3.2).

**This spec contains three founder-authored proposals that gate implementation.** They are listed
under "Open, needs Deshan" at the bottom and nothing is built until they are settled.

## Requirements

### Evaluation

- MUST create an `evaluation` table matching docs/06 section 2's column list: `id`, `attempt_id`,
  `model`, `rubric_version`, `relevance`, `structure`, `specificity`, `gap`, `angles`,
  `created_at`, plus the three span columns proposed below. `grade` is created nullable and left
  unpopulated, since grade derivation is FR-27 and Phase 2.
- MUST enable row level security on `evaluation`, scoped through `attempt_id` to the owning
  session, matching the shape every other user-owned table uses.
- MUST score each answer 0 to 3 on `relevance`, `structure` and `specificity`, using the anchors
  in docs/04 section 3.2 verbatim in the prompt. The model is given the anchors, never left to
  invent a scale.
- MUST enforce the response schema. Never `JSON.parse` free text from a model
  (context/coding-standards.md).
- MUST stamp every evaluation row with `model` and `rubric_version` (FR-20).
- MUST constrain `angles` to the nine slugs in docs/05 section 1.1 (`conflict`, `failure`,
  `initiative`, `teamwork`, `leadership`, `pressure`, `ambiguity`, `persuasion`, `learning`) as an
  enum in the schema, not a free string array. An invented slug is a label nothing downstream can
  point at.
- MUST keep `gap` to one sentence phrased as a question, about something absent from the answer,
  carrying no praise, no softener and no compliment (docs/04 section 3.4).
- MUST NOT ask the model how long the user spoke or how fast (docs/04 section 3.4). Speech signals
  are computed in S2 and are passed to the prompt as context only.
- MUST NOT let the model return a grade, a total, or free prose beyond `gap` (docs/04 section
  3.3).
- MUST isolate all provider knowledge in `lib/evaluate.ts`. No other file imports a provider SDK
  (docs/02 section 3.2, context/coding-standards.md).

### Sentence spans, for the transcript rails

- MUST return the situation, action and result parts as **locators into the transcript, never as
  text written by the model**. See "Why locators, not quotes" below. Proposed schema addition:

  ```
  situation: { start: number, end: number } | null
  action:    { start: number, end: number } | null
  result:    { start: number, end: number } | null
  ```

  where the numbers are sentence indices from a split the prompt supplies.
- MUST express each part as a single contiguous range, not a list of indices, so that "one rail
  per part" (docs/04 section 4.1) is structurally impossible to violate.
- MUST resolve sentence indices to word index ranges at the boundary in `lib/evaluate.ts` and
  store the resolved word ranges on the `evaluation` row. Sentence numbering is a prompt-time
  convenience and is never persisted.
- MUST NOT recompute the sentence split at render time. The feedback screen slices the stored
  transcript by stored word range.
- MUST drop an individual part, rendering no rail and no label, when its range is out of bounds,
  inverted (`start` after `end`), or overlaps a range already claimed by another part. Dropping one
  part MUST NOT fail the whole evaluation.
- MUST NOT enforce ordering between the three parts. docs/04 section 4.1 is explicit that speech
  backtracks and the parts arrive interleaved, so a result before a setting is legitimate.
- MUST split sentences from the word array by terminal punctuation on each word, not by regex over
  the transcript string, so that every sentence is a word index range by construction.
- MUST enable Deepgram's `punctuate=true` and carry a `punctuatedWord` field through
  `WordTiming`, added alongside `word` rather than replacing it.
- MUST NOT alter `computeFillerCount`'s input. It continues to read `word`. `filler_count` is a
  contract (docs/04 section 2) and this spec must not move it.

### The feedback screen

- MUST show, in this order and in one column at every viewport (docs/04 section 4): the question
  answered, quiet and small at the top; the transcript with situation, action and result marked;
  the gap as a question; the angle labels.
- MUST render the transcript verbatim from the stored `attempt.word_timings`, joining the
  punctuated words in order. Not from `attempt.transcript`: rails are stored as word positions,
  so the screen has to slice the same array the positions index into, and rendering the transcript
  string beside positions derived from a different array is how the two drift. Every word appears
  exactly once, in order. No highlighter fill, no underline, no reflowing (docs/04 section 4.1).
- MUST label the marked parts "the setting", "what you did", "how it ended". Never "Situation",
  "Action", "Result" (docs/04 section 4.1).
- MUST show no rail and no label for a part the answer does not contain. No empty row, no greyed
  placeholder (docs/04 section 4.1).
- MUST NOT show any of the three scores, or any total (FR-23, ADR-011).
- MUST NOT show duration or pace (ADR-016). They stay computed and stored under FR-17.
- MUST show one action directly beneath the gap question, copy "Have another go at this one",
  which re-asks the original question, not the gap question (docs/04 section 4.2).
- MUST retry a failed model call exactly once before degrading the screen. Timeouts and rate
  limits are usually transient and the user is already watching a processing screen. This is not
  rate limiting or spend capping, which stay out of scope until S6; it is one retry on a single
  request.
- MUST end the screen at the angle labels. No "next question" control, which would be inert until
  a question bank exists.
- MUST show the neutral line "There is no right answer to this. Just say what you personally did."
  under the gap.
- MUST NOT show an example answer, a suggested phrasing, or a sentence starter anywhere on this
  screen (ADR-009, docs/04 section 4.2).
- MUST NOT play back the recording (FR-25).

### The question

- MUST store the question text that was asked on the `attempt` row, as a new `question_text`
  column. `relevance` is meaningless without it, and docs/04 section 4 requires the question be
  visible on the feedback screen to a user returning later.
- MUST source that question from a single constant in `lib/questions.ts` for Phase 1's single
  question. The `question` table and `question_id` foreign key are deferred to the spec that adds
  a question bank.
- MUST NOT contain any competency word in the question shown to a user (FR-6, docs/05 section
  1.1). No "leadership", "teamwork", "problem solving".

## Out of scope

- Grade derivation, the interval ladder, the `review` row, anything scheduling (FR-27, FR-28).
  Phase 2, docs/05.
- "Save this as a story" on the feedback screen. Needs the `story` table and an account. S4.
- The `question` table, a question bank, angles attached to questions, twist questions. Later.
- Rate limits, spend caps, kill switch (docs/02 section 3.5). S6.
- The recovery ladder for answers under 15 seconds (docs/04 section 5). The `no-result` and
  `recovery` preview screens exist but wiring them to a real short answer is not this spec.
- Playback anywhere (FR-25).
- Whether a second attempt replaces the first. Explicitly left open by docs/04 section 4.2 and
  owned by Deshan, not needed before Phase 2. Both attempts are stored either way.
- Re-scoring historical attempts. The separation exists to make it possible later, no tooling is
  built now.

## Implementation notes

### Why locators, not quotes

The rails need to know where each part sits in the transcript. Only a model can judge which part
is which, but a model given a free text field will tidy: it fixes a false start, drops a stumble,
smooths a broken clause. Render that and the user reads a sentence they never spoke, presented as
their own words, next to their real transcript, at the moment docs/04 section 4.2 identifies as
the most dangerous place to put words in front of them. That is ADR-009 and docs/04 section 4.1
("the words themselves are never touched").

Three shapes were considered:

1. **Free text per part.** Rejected. The failure above.
2. **Word index ranges direct from the model.** Safe, since an integer cannot smuggle in a word,
   but models count badly and rails would land wrong or go missing often.
3. **Numbered sentences.** The prompt supplies the transcript pre-split and numbered; the model
   returns which numbers belong to which part. Chosen. Not counting, since the numbers are printed
   in front of it. Cannot fail to match the way a quote can drift by a word. Rails land on sentence
   boundaries, which reads better than a rule starting mid-clause.

A fourth shape, verbatim quotes matched back against the transcript, is safe but strictly worse
than 3: a quote that drifts by one word silently costs the user a rail they earned.

### Files touched

| File | Change |
| --- | --- |
| `supabase/migrations/<ts>_evaluation.sql` | New. `evaluation` table, RLS, plus `attempt.question_text` |
| `lib/questions.ts` | New. The single Phase 1 question constant |
| `lib/deepgram.ts` | Add `punctuate=true`, parse `punctuated_word` |
| `lib/signals.ts` | `WordTiming` gains `punctuatedWord`. No behaviour change |
| `lib/sentences.ts` | New, pure. Split word array into sentences by terminal punctuation |
| `lib/rails.ts` | New, pure. Validate model ranges, resolve to word ranges, drop invalid parts |
| `lib/evaluate.ts` | New. Prompt, enforced schema, the only file knowing the provider |
| `lib/supabase/evaluations.ts` | New. Write and read an evaluation row |
| `lib/supabase/attempts.ts` | Store and read `question_text`; expose what feedback needs |
| `app/api/answer/route.ts` | Call evaluate after signals, write the evaluation row |
| `app/record/page.tsx` | Show the question. It is **not** sent with the upload: the route resolves it server-side, because `relevance` is scored against it and a browser must not be able to choose what its own answer is judged against |
| `lib/transcript.ts` | New, pure. Rails plus words become ordered segments for rendering |
| `lib/rail-labels.ts` | New. The three margin labels, shared by the feedback screen and the dev page |
| `app/feedback/[attemptId]/page.tsx` | New. The real feedback screen |
| `components/ui/TranscriptRail.tsx` | Take real transcript text, not placeholder bar widths |
| `app/dev/verify-attempt/page.tsx` | Show the sentence split and chosen ranges, for calibration |

`lib/sentences.ts` and `lib/rails.ts` are separate from `lib/evaluate.ts` deliberately. Both are
pure logic the feedback path and the tests need, and neither may drag provider knowledge into
anything that imports it.

### rubric_version stays 1

docs/04 section 3.4 makes any prompt change increment `rubric_version`. It set its own precedent
when the prompt was warmed before any answer had been evaluated: there is no earlier version to be
incomparable with, so the warmed prompt simply is version 1. The same holds here. No answer has
ever been evaluated, so the span fields and the angle enum land inside version 1.

This is a reason to make this change now rather than after the cohort test, when it would split
the calibration data.

### The punctuation change carries a contract risk

`FILLER_WORDS` is a contract and lib/signals.ts:31 records that changing it needs an ADR and a
version bump. Turning on punctuation could in principle alter Deepgram's word list and move
`filler_count` without anyone editing the list. Use `punctuate=true` only, never `smart_format`,
which reformats more aggressively. The before-and-after check in the test plan is a hard gate, not
a nice to have.

### A free consistency check

`structure` is scored 0 to 3 by how many of the three parts are present, so the model states the
same thing twice in one response, once as a number and once as three ranges. Disagreement (for
example `structure` of 3 with only two ranges returned) is never enforced and never a reason to
discard the evaluation.

**Nothing needs to be logged for it.** The `evaluation` row already stores `structure` and all
three span columns, so the disagreement rate is one SQL query over data being kept anyway. What
is *not* recoverable is a rail that was dropped for overlap or being out of range, because a
dropped rail and an unclaimed one are both `NULL` in the database. So `resolveRails` reports its
drops, `evaluate.ts` logs them to the server console, and nothing is stored. If drops turn out to
be common, a diagnostics column can be added before any cohort exists.

Observed once in calibration: `structure` of 2 with three rails returned, on the vaguest answer.

## Test plan

Pure logic, so `lib/sentences.ts` and `lib/rails.ts` are written test first per
context/coding-standards.md and the `tdd` skill.

- `lib/sentences.test.ts`: multiple sentences with `.`, `?` and `!`; a trailing fragment with no
  terminal punctuation; a transcript with no punctuation at all, which must yield one sentence
  rather than none; a single word; an empty word array.
- `lib/rails.test.ts`: a valid three part answer; a part that is null; `start` after `end`; `end`
  past the last sentence; two parts claiming overlapping ranges; all three null. Each invalid part
  drops alone and the rest survive.
- A test pins the nine angle slugs, the same way S2 pins the filler list, so an accidental addition
  fails loudly.
- **Hard gate**: run one real recording through Deepgram before and after `punctuate=true` and
  confirm `filler_count` is byte identical. If it moves, stop, because that is a contract change
  and needs Deshan and an ADR.
- No unit test for the model call or the Deepgram call. External providers, per
  context/coding-standards.md.
- Manual: record a real answer, confirm the evaluation row has three scores, a gap, angles and
  three resolved word ranges, and that the feedback screen shows no number anywhere.

### Calibration

Everything above proves the rails are safe and stable. None of it proves the model picks the right
sentences, which only reading real answers can. Extend `/dev/verify-attempt` to show the numbered
split beside the chosen ranges, push 15 to 20 real spoken answers through, and read them. This is
the same tuning loop docs/04 section 6 describes for the rubric as a whole, over the same batch of
answers, so it is not extra recording work.

Two questions it answers: whether Deepgram punctuates run-on speech into usable sentences, and
whether sentence granularity is too coarse for a 140 word answer.

## Docs impacted

- **docs/04 section 3.3**: the returned schema gains three span fields and `angles` becomes an
  enum. Founder-authored, proposed here, not applied until signed off.
- **docs/04 section 4.1**: note that rails are sentence granular and why, since "the longest run of
  speech carrying it" currently implies free-form spans.
- **docs/04 section 2**: record that `punctuate=true` is now a required Deepgram option, alongside
  word timestamps and filler words. Also record the **model tier**, which that section never
  specified and which turned out to matter: Deepgram's default base tier transcribes accented and
  second-language English badly, and nova-3 silently drops `um` and `uh` even with
  `filler_words=true`, moving `filler_count` from 7 to 5 on identical audio. That is the same
  behaviour the section rejects Whisper for. `nova-2` is pinned as the only tier measured to hold
  both accuracy and the filler contract. Provisional until cohort audio tests it.
- **docs/06 section 2**: `evaluation` gains the three span columns; `attempt` gains `question_text`.
  Note which columns S3 populates and which stay deferred.
- **docs/02 section 3.4**: note `question_text` on `attempt` as an interim ahead of the `question`
  table, the same way S2 recorded its deferred foreign keys.
- **docs/02 section 3.2**: the sequence diagram shows `S->>C: transcript + speech signals`. Speech
  signals are **not** sent to the model, decided by Deshan. docs/04 section 3.4 says the model is
  never asked how long someone spoke or how fast, and section 3.1 chose the three dimensions
  precisely because they are observable in the transcript alone. Handing the model a duration
  invites it to fold speaking time into `specificity`, turning a text-observable score into a
  partly time-based one. Signals stay computed and stored under FR-17; they just do not reach the
  prompt. Diagram edge becomes `transcript only`.
- **docs/06 section 2**: `evaluation` is one-to-many with `attempt`, not zero-or-one as the ERD
  currently draws it. Re-scoring on a new model or rubric version writes a new row rather than
  overwriting, which is what makes the comparison in docs/04 section 6 possible.
- **New ADR-017 proposed**: "Transcript rails are located, never quoted." The reasoning above needs
  a permanent home, because the next person to read `situation: { start, end }` will reasonably ask
  why it is not just the text, and the answer is a product boundary rather than a technical
  preference.

## Open, needs Deshan

Batched, blocking implementation:

1. **The schema addition** (docs/04 section 3.3). Founder-authored territory. Approve the three
   span fields and the angle enum, or send it back.
2. **The question text itself.** Phase 1 has one question and it is user-facing copy, so it is
   yours. It must contain no competency word (FR-6). The preview screens currently use "Tell me
   about a time you worked in a team."
3. **ADR-017**, or a decision that the spec is enough of a record.
4. **The feedback route.** `app/feedback/[attemptId]/page.tsx` proposed. `app/screens/feedback` is
   a preview and stays one.
5. **`grade` column now or later.** Proposed: create it nullable in this migration and leave it
   unpopulated, so Phase 2 does not need a second migration on the same table.
