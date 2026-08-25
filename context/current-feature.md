# Current Feature: S2 Transcribe and Signals

## Status

In Progress

## Goals

- Create an `attempt` table matching docs/06 section 2's column list, restricted to `id`,
  `audio_url`, `duration_ms`, `transcript`, `word_timings`, `filler_count`, `words_per_minute`,
  `longest_pause_ms`, `created_at`, plus `anonymous_session_id` for RLS. `user_id`, `session_id`,
  `item_id`, `question_id` deferred to later specs.
- Enable row level security on `attempt`, same shape as every other user-owned table
  (`auth.uid() = anonymous_session_id`).
- Create a private storage bucket policy for `attempt` audio objects, same ownership-scoped
  shape as the existing `recordings` bucket policy from S1.
- Call Deepgram's pre-recorded endpoint with word level timestamps and filler words enabled
  (docs/04 section 2). Reject any transcription path that strips filler words or false starts.
- Compute `duration_ms`, `words_per_minute`, `longest_pause_ms`, `filler_count` in application
  code from the audio and Deepgram's word timestamps, per docs/04 section 2's table. Never ask a
  model to estimate these.
- Use the fixed filler list exactly as docs/04 section 2 states it: `um`, `uh`, `er`, `erm`,
  `like` (every occurrence counts), `you know`, `I mean`, `basically`, `actually`.
- Keep the `recording` table exactly as it is today, still used for `mic_check`,
  `validation_a`, `validation_b`, which are never transcribed.
- Switch the `answer` capture path (`app/record/page.tsx` and whatever it posts to) to write
  directly into `attempt` rather than `recording`. No new `recording_type = 'answer'` rows after
  this ships.
- Do not migrate existing `answer`-type `recording` rows into `attempt`.
- Nothing in this spec is user facing. No transcript, signal, or score is shown on screen.

## Implementation plan

Two corrections from the spec, found while planning, neither changes a testable requirement:

- No new storage bucket policy needed. The existing `recordings` bucket policy scopes access by
  the first path segment (`auth.uid()`), not by which table points at the object, so it already
  covers attempt audio. Reuses `RECORDINGS_BUCKET`.
- Object path stays the existing pattern from `createSignedUploadUrl`
  (`{anonymous_session_id}/{random-uuid}.webm`), not `{anonymous_session_id}/{attempt_id}.webm`.
  The upload happens before the attempt row exists (browser uploads first, then the row is
  created), same as `recording` today, so there's no attempt id yet to key the path on. The row's
  `audio_url` just points at whatever path the upload used, exactly like `recording` does now.

Files, in order:

1. `lib/signals.ts` + `lib/signals.test.ts` — pure functions, no I/O. `computeDurationMs`,
   `computeWordsPerMinute`, `computeLongestPauseMs`, `computeFillerCount`, plus the fixed filler
   list as an exported constant. TDD per the `tdd` skill: tests first, red before green. Smallest
   working slice, fully testable with no external dependency.
2. `supabase/migrations/20260825_attempt.sql` — `create table attempt` (`id`,
   `anonymous_session_id`, `audio_url`, `duration_ms`, `transcript`, `word_timings` jsonb,
   `filler_count`, `words_per_minute`, `longest_pause_ms`, `created_at`), RLS enabled, same
   owner-only policy shape as `recording`.
3. `lib/supabase/attempts.ts` — `createAttempt(path)` inserts the row with just `audio_url`,
   returns its id; `saveAttemptFacts(id, facts)` updates the row with transcript, word timings,
   and the four signals. Mirrors `lib/supabase/recordings.ts`'s shape.
4. `lib/deepgram.ts` — the only file that calls Deepgram, mirroring `lib/evaluate.ts`'s
   provider-isolation pattern. Plain `fetch` against Deepgram's pre-recorded REST endpoint
   (word timestamps + filler words on), no new SDK dependency. Takes an audio URL, returns
   `{ transcript, wordTimings }`, validated at the boundary. Needs a new `DEEPGRAM_API_KEY`
   env var, checked with the same `required()` pattern `lib/supabase/env.ts` uses, added to
   Vercel and local `.env` outside this diff.
5. `app/api/answer/route.ts` — new route handler, matches docs/02's `POST /answer`. Body:
   `{ path }`. Creates the attempt row, calls `lib/deepgram.ts`, computes signals via
   `lib/signals.ts`, calls `saveAttemptFacts`, returns `{ attemptId }`. Nothing else yet, since
   `item`/`question` don't exist.
6. `components/RecordingUI.tsx` — in `handleSubmit`, branch on `recordingType`: `"answer"` posts
   to `/api/answer` instead of calling `createRecordingRow`; the other three types are
   unchanged. The existing `uploading` → `done` state machine already covers the longer wait for
   transcription, so no new UI state.
7. `app/dev/verify-attempt/page.tsx` — dev-only, same precedent as `app/dev/verify-recording`
   (already allowed without a spec exception per its own comment). Shows the latest attempt's
   transcript, signals, and a `<audio>` player, so transcript-preserves-fillers and
   signal-correctness can be checked by hand against a real recording.

Test plan:

- `lib/signals.test.ts`: each signal against fixed word-timing fixtures, per the spec's test
  plan — known duration/gaps/filler counts, multi-word (`you know`, `I mean`) and case-variant
  matches, zero-filler and zero-pause edges. A test pins the exact filler list so an accidental
  edit fails loudly.
- No unit test for `lib/deepgram.ts` (external I/O, per coding-standards.md) — verified live via
  `/dev/verify-attempt` against a real recording, checking fillers survived into the transcript
  text.
- Migration: RLS policy shape checked by hand the same way S1's was (own row visible, other
  session's row not), no automated RLS test in this repo yet.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass before this is done.

## Notes

Out of scope: evaluation (`lib/evaluate.ts`, rubric scores, gap, angles) and the feedback screen
are S3, not this spec. `user`/`session`/`item`/`question` tables and their foreign keys on
`attempt` land with the specs that need them, not here. Rate limiting and spend caps are S6. No
change to `recording`'s schema or RLS. No backfill or deletion of old `answer`-type `recording`
rows.

Chosen approach, confirmed with Deshan: no migration of `recording` rows. Nothing is deployed to
real users yet, so there is no answer data worth preserving; `recording` narrows to the three
non-transcribed types going forward.

Proposed new files: `lib/deepgram.ts` (only file that calls Deepgram, mirrors the
`lib/evaluate.ts` provider-isolation pattern), `lib/signals.ts` (pure functions, no I/O, TDD
territory per the `tdd` skill). Object key convention for attempt audio matches S1 exactly: a
random id per upload, not the attempt's own id (see the correction under Implementation plan
above). `filler_count` matching is case insensitive, word boundary, with multi-word entries
(`you know`, `I mean`) matched as contiguous token sequences.

Docs impacted: done. docs/02-system-architecture.md and docs/06-data-and-privacy.md both carried
an "interim table... superseded by `attempt` in S2" note that read as an open question; both now
state the settled decision (`recording` narrows, doesn't get replaced) as fact. Their diagrams
already showed `attempt` — no diagram change was needed.
