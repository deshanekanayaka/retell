# S2 Transcribe and Signals Spec

## Overview

Turns a raw answer recording into a transcript with word timings and the four speech signals
computed from it. Implements docs/01-PRD.md FR-16 (word level transcription) and FR-17
(duration, pace, longest pause, filler count, computed not inferred). This is the second of the
three steps that make up one answer end to end (docs/03-delivery-plan.md), sitting between S1
(record and upload) and S3 (evaluation and feedback).

Introduces the `attempt` table from docs/02-system-architecture.md section 3.4 / docs/06 section
2, the first table facts about an answer live on. `evaluation` is not part of this spec; it
ships in S3.

## Requirements

- MUST create an `attempt` table matching docs/06 section 2's column list, restricted to the
  columns this spec populates: `id`, `audio_url`, `duration_ms`, `transcript`, `word_timings`,
  `filler_count`, `words_per_minute`, `longest_pause_ms`, `created_at`, plus
  `anonymous_session_id` for RLS (no `user`, `session`, `item`, or `question` tables exist yet,
  so `user_id`, `session_id`, `item_id`, `question_id` are deferred to the spec that adds them).
- MUST enable row level security on `attempt`, same shape as every other user-owned table
  (`auth.uid() = anonymous_session_id`).
- MUST create a private Supabase Storage bucket policy for `attempt` audio objects, same
  ownership-scoped shape as the existing `recordings` bucket policy from S1.
- MUST call Deepgram's pre-recorded endpoint with word level timestamps and filler words enabled
  (docs/04 section 2).
- MUST reject Whisper or any transcription path that strips filler words or false starts
  (docs/04 section 2).
- MUST compute `duration_ms`, `words_per_minute`, `longest_pause_ms`, and `filler_count` in
  application code from the audio and Deepgram's word timestamps, per the formulas in docs/04
  section 2's table. Never ask a model to estimate any of these.
- MUST use the fixed filler list from docs/04 section 2 exactly: `um`, `uh`, `er`, `erm`,
  `like` (every occurrence counts), `you know`, `I mean`, `basically`, `actually`.
- MUST keep the `recording` table exactly as it is today, still used for `mic_check`,
  `validation_a`, `validation_b` recordings, which are never transcribed (docs/04 section 1.3).
- MUST switch the `answer` capture path (`app/record/page.tsx` and whatever route it posts to)
  to write directly into `attempt` rather than `recording`. No new `recording` rows with
  `recording_type = 'answer'` are created after this ships.
- MUST NOT migrate existing `recording` rows with `recording_type = 'answer'` into `attempt`.
  Confirmed with Deshan: nothing is deployed to real users yet, so there is no answer data worth
  preserving. `recording` narrows to the three non-transcribed types going forward.
- MUST NOT show any transcript, signal, or score to the user in this spec. Nothing in S2 is user
  facing; docs/04 section 4's feedback screen is S3.

## Out of scope

- Evaluation (`lib/evaluate.ts`, the three rubric scores, `gap`, `angles`) — S3.
- The feedback screen — S3.
- `user`, `session`, `item`, `question` tables and the foreign keys on `attempt` that reference
  them — added when the spec that needs each one is written (S4 accounts, later item/session
  work). `attempt` gets those columns then, not now.
- Rate limiting and spend caps (docs/02 section 3.5) — S6.
- Any change to the `recording` table's schema or RLS.
- Deleting or backfilling old `answer`-type `recording` rows. They are simply not read by
  anything after this ships. Cleaning them up, if ever wanted, is a separate small task, not
  part of this spec.

## Implementation notes

- New migration, forward only: `create table attempt (...)`, RLS policy. Reuses the existing
  `recordings` bucket and its policy rather than provisioning a new one — the policy scopes
  access by the first path segment (`auth.uid()`), not by which table points at the object, so
  it already covers attempt audio. Object key convention matches S1 exactly: a random id per
  upload (`{anonymous_session_id}/{random-uuid}.webm`), not the attempt's own id — the file is
  uploaded before the attempt row exists, so there's no attempt id yet to key the path on.
- `lib/deepgram.ts` (new): the only file that calls Deepgram, mirroring the isolation pattern
  `lib/evaluate.ts` uses for the model provider (context/coding-standards.md). Takes an audio
  URL, returns transcript plus word timings, schema validated at the boundary.
- `lib/signals.ts` (new): pure functions, one per signal in docs/04's table, computed from
  duration and word timings. No I/O, so this is TDD territory per context/coding-standards.md
  and the `tdd` skill: signal computation is exactly "real logic and no I/O."
- Route handler or server action receiving the upload (per docs/02's `POST /answer` in the
  sequence diagram) creates the `attempt` row, calls Deepgram, computes signals, writes them
  back to the same row.
- `filler_count` matching: case insensitive, word boundary matching against the filler list.
  Multi-word entries (`you know`, `I mean`) match as contiguous token sequences.

## Test plan

- `lib/signals.test.ts`: each signal function against fixed word-timing fixtures — known
  duration, known gaps, known filler occurrences (including multi-word `you know` / `I mean` and
  case variants), zero-filler and zero-pause edge cases.
- Filler list is a contract (docs/04 section 2): a test pins the exact list so an accidental
  addition or removal fails loudly rather than silently changing a signal.
- No unit test for the Deepgram call itself (external I/O, per context/coding-standards.md
  "do not test... external providers"); verified live against a real recording the way S1's
  dev-only `/dev/verify-recording` route was.
- Manual check: record a real answer through `/record`, confirm the `attempt` row has a
  transcript, word timings, and all four signals populated, and that Deepgram's filler words are
  present in the transcript text (proves Whisper-style stripping didn't happen).
- No calibration impact: this spec writes facts only, nothing scored yet.

## Docs impacted

- docs/02-system-architecture.md: remove or update the "Interim table... Superseded by `attempt`
  in S2" note under section 2's schema diagram, now that the decision (no migration, `recording`
  narrows to the three non-transcribed types) is made. Add `attempt` to the schema diagram.
- docs/06-data-and-privacy.md: same interim-table note in section 2, resolve it the same way.
  `attempt` table's column list already exists there; note which columns are populated by S2
  versus later specs.
