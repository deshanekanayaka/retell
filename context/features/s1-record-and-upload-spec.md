# S1: Record and Upload Spec

## Overview

The first slice of the answer pipeline: capture a spoken answer in the browser, upload it
straight to object storage, and gate entry so only supported browsers reach the microphone.
Alongside it, the validation track's static two-arm test page, which reuses the same
record/upload work to measure whether a scripted mic check helps people answer. Implements
docs/01-PRD.md FR-2, FR-14, FR-15, FR-18, FR-34, and the validation track in
docs/03-delivery-plan.md section 4. No transcription, evaluation, or accounts yet; those are
S2 to S4.

Desktop Chrome only for now (ADR-012). In-app browser detection (FR-35) and real-phone
verification are deferred, tracked in `context/tasks.md`.

## Requirements

- MUST show a full screen permission explainer before the browser mic prompt, using the fixed
  copy in docs/04-voice-and-evaluation.md section 1.1, with the button "Turn on my microphone"
  (FR-2).
- MUST feature-detect Chrome/Chromium (`'userAgentData' in navigator`, ADR-014) and show an
  explanatory message on unsupported browsers, no permission prompt (FR-34).
- On mic permission denial: never re-prompt automatically, never show a settings tutorial.
  Change the screen per docs/04 section 1.1 ("On denial"). Dismissal gets the same screen —
  `getUserMedia()` can't distinguish the two (ADR-014), a documented deviation from docs/04's
  "change nothing" ideal for dismissal.
- MUST record audio with the browser `MediaRecorder`, no third party library (FR-14).
- MUST show a 60 second countdown that stops recording at zero (FR-18).
- MUST allow restarting the recording before submit, at no cost, always visible (FR-18).
- MUST allow stopping early without losing the answer (FR-18).
- MUST show a live waveform during recording as the only in-recording feedback (docs/04 section
  1.2).
- MUST upload the recorded audio directly from the browser to Supabase Storage via a signed
  upload URL. The server issues the signed URL; the file itself never transits a route handler
  (FR-14, architecture 3.2).
- MUST write one `recording` row per upload, scoped to an anonymous session id (see
  Implementation notes), so the file has an owner and a retention clock (FR-8, FR-15).
  `recording_type` distinguishes `answer` / `mic_check` / `validation_a` / `validation_b`.
- MUST retain the anonymous session id in a cookie, created on first visit if absent.
- MUST support a dev-only verification path that fetches a recording back by signed URL and
  plays it, to prove the upload/storage round trip. Not part of any user-facing screen.
- MUST implement the two-arm validation page as two static routes (arm A: scripted mic check
  then one question; arm B: the question only), both using the same record/upload flow, both
  storing to the `recording` table with `recording_type = 'validation_a'` / `'validation_b'`.
  Feedback after submit is a single canned message, no backend beyond the upload.

## Out of scope

- Transcription, speech signals, evaluation, feedback content (S2, S3).
- Accounts, signup, claiming anonymous recordings (S4).
- The seven onboarding screens, tile picker, real question content beyond the one static
  question used by the validation page (S5).
- User-facing playback of a recording (FR-25 forbids it in the first four sessions; nothing in
  S1 is a "session" in that sense, but no screen plays audio back to a real user regardless).
- Automatic 24-hour deletion job for unclaimed anonymous recordings. This spec creates the
  `recording` row and `created_at` the job will key off, but the deletion job itself is not
  built here; tracked as a follow-up before S4 claims recordings.
- Rate limiting (one answer per IP per day, FR-36) — not needed until the pipeline actually
  costs money, added in S6.
- Denial screen worked example (docs/04 section 1.1) — the fictional labelled example answer
  is founder-authored content (ADR-009 territory: not Claude's to draft), not yet written.
  Denial screen ships with the fixed copy and the question only, tracked in
  `context/tasks.md`.
- In-app browser detection (FR-35) — deferred, desktop Chrome is the focus for now (ADR-012).
- Real-phone verification — deferred to before the validation page recruits testers (ADR-012).

## Implementation notes

**Anonymous identity.** No `user` table exists yet (S4). Anonymous visitors get a real Supabase
Auth session via `supabase.auth.signInAnonymously()` on first visit, so `auth.uid()` exists
without an account. `recording.anonymous_session_id` stores that uid and RLS reads
`auth.uid() = anonymous_session_id`, the same shape a real user-owned table would use. This
also makes S4's "claim on signup" close to free: Supabase's identity linking
(`auth.updateUser`) upgrades the anonymous session to a real account in place, same uid, no row
reassignment needed. Requires anonymous sign-ins enabled on the hosted Supabase project
(dashboard: Authentication > Sign In / Providers), not just locally in `supabase/config.toml`.

**Schema.** One new migration, additive only:

```
recording
  id                   uuid, pk
  anonymous_session_id uuid, not null, references auth.users(id)
  recording_type       text: 'answer' | 'mic_check' | 'validation_a' | 'validation_b'
  audio_url            text, storage object path (not the public URL, RLS/signed access only)
  created_at           timestamptz, default now()
```

RLS: `using (auth.uid() = anonymous_session_id)`, same on the write side.

This is deliberately smaller than the `attempt` table in docs/06 section 2. `attempt` gets
introduced in S2 when transcription needs somewhere to write timings, signals, and the
`question_id` / `item_id` foreign keys that don't exist yet. `recording` is superseded by
`attempt` at that point; migrating rows forward (or leaving `recording` as the raw-audio
record `attempt` points at) is an S2 decision, not this one.

**Storage.** One private Supabase Storage bucket, `recordings`. Signed upload URL issued by a
server action scoped to the caller's `anonymous_session_id`, short-lived. Access is by signed
URL only, never a public bucket path (docs/06 section 6).

**Files touched (indicative, confirmed at plan step):**
- `supabase/migrations/<timestamp>_recording.sql`
- `lib/supabase/storage.ts` — signed upload/download URL helpers
- `app/record/` — permission screen, Chrome/Chromium gate, recording UI
- `app/validate/a/`, `app/validate/b/` — the two static arm pages
- `proxy.ts` + `lib/supabase/middleware.ts` — anonymous session, refreshed every request
  (Next 16 renamed `middleware.ts` to `proxy.ts`; the exported function is `proxy`)
- `components/` — waveform, countdown, recorder controls (shared between `/record` and the two
  validation arms)

**Browser detection** happens before anything touching audio, so a user on an unsupported
browser never sees the permission screen at all.

## Test plan

- Unit tests (Vitest) for anything with real logic and no I/O per context/coding-standards.md:
  browser detection function, countdown logic, anonymous session id generation/parsing. No
  tests for the recording screen itself or layout.
- Manual: full record → upload → dev verification playback round trip, in Chrome desktop
  (ADR-012: real-phone verification deferred).
- Manual: denial flow, dismissal flow, restart, stop-early, 60s auto-stop, unsupported browser
  message (Firefox/Safari).
- Manual: both validation arms end to end, canned feedback shown, `recording` rows land with
  the right `kind`.

## Docs impacted

- docs/02-system-architecture.md section 3.4 (data model) gets a note that `recording` is an
  interim table, superseded by `attempt` in S2 — add in the same branch once the migration is
  final.
- docs/06-data-and-privacy.md section 2 (schema) gets the same note.
- None of the FR text or architecture decisions change; this is additive documentation, not a
  spec contradiction.
