# Current Feature

S1: record and upload. Spec at context/features/s1-record-and-upload-spec.md.

## Status

In Progress

## Goals

- Full screen permission explainer with fixed copy, Chrome/Chromium gate (FR-2, FR-34).
  Desktop Chrome only for now; in-app browser gate (FR-35) deferred (ADR-012).
- Record in the browser with MediaRecorder, 60s countdown, restart, stop early, live waveform
  (FR-14, FR-18).
- Upload directly from browser to Supabase Storage via signed URL, one `recording` row per
  upload keyed to an anonymous session cookie (FR-15, FR-8).
- Dev-only verification path: fetch a recording back and play it, proves the round trip works.
  Never user-facing (avoids the FR-25 conflict).
- Two-arm validation page (arm A: mic check + question, arm B: question only), same
  record/upload flow, canned feedback, `recording.recording_type` distinguishes the arms.

## Implementation plan

Order, smallest working slice first:

1. **Migration**: `supabase/migrations/20260823113237_recording.sql` — done. `recording`
   table, RLS via `auth.uid() = anonymous_session_id`. Pushed to the hosted Retell project.
2. **Anonymous session id**: done. `proxy.ts` (Next 16's replacement for `middleware.ts`) +
   `lib/supabase/middleware.ts`'s `updateSession`, refreshing the session on every request and
   calling `signInAnonymously()` when there isn't one. Verified: cookie set on first request,
   reused on the second, no duplicate sign-in.
3. **Storage**: done. Private `recordings` bucket + `lib/supabase/storage.ts` signed
   upload/download URL helpers. `uid` read server-side from the verified session. Verified end
   to end against the live bucket: upload, download, cross-user access denial.
4. **Browser gate**: done. `lib/browser-support.ts` feature-detects Chromium via
   `navigator.userAgentData` (User-Agent Client Hints — never user-agent string matching).
   Originally checked `<usermedia>`'s existence, which pinned to Chrome 151+ for no reason once
   `<usermedia>` itself was dropped (ADR-014). `components/BrowserGate.tsx` +
   `app/record/page.tsx`. Verified live in real Chrome, plus a unit test for the detection
   function.
5. **Permission screen**: done. Fixed copy from docs/04 section 1.1, using plain
   `getUserMedia({ audio: true })` (ADR-014, superseding ADR-013 — Chrome's `<usermedia>`
   element only supports combined audio+video, no audio-only mode). One flat outcome for
   denial and dismissal, since `getUserMedia()` can't distinguish them (both reject with
   `NotAllowedError`); shows the explanation + the question they'd have answered — worked
   example deferred (founder-authored content, not yet written, see spec's Out of scope and
   `context/tasks.md`).
6. **Recording UI**: done. `lib/recording-state.ts` — pure reducer, unit tested, state machine
   as agreed. `components/RecordingUI.tsx` + `components/Waveform.tsx`. Each take is its own
   `RecordingTake` subcomponent remounted on `state.take` (a restart is a clean remount, not a
   manual state reset — also closes a race where a discarded take's late-firing recorder event
   could otherwise clobber a newer one). Submit requests a signed upload URL, uploads client-side
   via `lib/supabase/upload.ts`, writes the `recording` row via `lib/supabase/recordings.ts`
   only after the upload succeeds, then moves to `done`. On failure, stays in `review` with the
   audio intact. Verified end to end against the live project: real MediaRecorder capture (fake
   device via a temporary bypass page, since `<usermedia>`'s native prompt can't be automated —
   see `context/bugs.md`), full state transitions including both restart paths, a real
   `recording` row and a real ~21KB `audio/webm` file landing in storage. Extracted
   `lib/supabase/session.ts` (shared auth check) and `lib/supabase/constants.ts` (bucket name)
   out of `storage.ts` to avoid duplicating them into `recordings.ts`.
7. **Dev verification route**: not started. Fetch-and-play, confirms the round trip, not linked
   from any real screen.
8. **Validation pages**: `/validate/a` (mic check + question) and `/validate/b` (question
   only), reusing the recording UI component, canned feedback screen, `recording_type` set per
   arm.
9. **Test pass**: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Manual pass on
   Chrome desktop per the spec's test plan (ADR-012: real-phone deferred).
10. **Docs**: add the `recording`-is-interim note to docs/02 section 3.4 and docs/06 section 2.

Test plan is in the spec, unchanged here.

## Notes

Open follow-ups noted in the spec's Out of scope, not blocking S1: the 24h anonymous deletion
job, and rate limiting (S6).

ADR-012 (desktop Chrome first, real-phone testing deferred) is Status: Proposed — needs Deshan
to flip it to Accepted once reviewed.

Steps 3 to 6 have their logic settled (see plan above) but no code written yet. Next session
picks up at step 3, implementing what's already agreed rather than re-deriving it.
