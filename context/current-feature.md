# Current Feature

S1: record and upload. Spec at context/features/s1-record-and-upload-spec.md.

## Status

All 10 implementation steps done. Remaining before this closes out: Deshan flips ADR-012 and
ADR-014 from Proposed to Accepted, and this branch merges to main.

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
7. **Dev verification route**: done. `app/dev/verify-recording/page.tsx` fetches the most
   recent `recording` row for the current anonymous session via
   `lib/supabase/recordings.ts`'s `getLatestRecording()`, and plays it via a signed download
   URL. 404s outside development (`process.env.NODE_ENV === "production"`), never linked from
   any real screen. Verified live against the dev server: fresh session correctly shows "No
   recordings yet."
8. **Validation pages**: done. `components/ValidationFlow.tsx`, one component parameterized by
   `arm: "a" | "b"`, used by `app/validate/a/page.tsx` and `app/validate/b/page.tsx`. Arm A runs
   `RecordingUI` twice in sequence (`mic_check` then `validation_a`), tracked by a local
   `step: "micCheck" | "question" | "feedback"` state; arm B skips straight to `validation_b`.
   `RecordingUI` gained an optional `onDone` callback, fired once when a take reaches `done`, so
   the parent can advance to the next step automatically. Question text ("Tell me about
   something you worked on with other people recently. What happened?") and the mic-check
   sentence (docs/04 section 1.3, reused verbatim) are both fixed copy, agreed with Deshan.
   Verified end to end against the live project via ad-hoc Playwright: both arms recorded,
   uploaded, and reached the canned feedback screen, with arm A's mic check correctly
   auto-advancing into the question step without stopping on its own "done" state.
9. **Test pass**: done. `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass.
   Browser flows the automated gates don't cover verified against real Chrome via ad-hoc
   Playwright (installed then removed, per this session's pattern): unsupported-browser message
   (faked by deleting `Navigator.prototype.userAgentData`), denial and dismissal both landing on
   the identical flat `notGranted` screen (faked via a stubbed `getUserMedia` rejection, same
   `NotAllowedError` either way per ADR-014), restart mid-recording staying on the recording
   screen, stop-early reaching review with Submit available, and the 60s countdown auto-stopping
   into review (via Playwright's clock API). Full record → upload → dev-verification playback
   round trip and both validation arms were already verified live in steps 6-8. Real Firefox/
   Safari and real-phone checks remain manual, deferred per ADR-012.
10. **Docs**: done. Added the `recording`-is-interim note to docs/02 section 3.4 and docs/06
    section 2, explaining it predates `attempt`, is superseded by it in S2, and the
    migrate-forward-or-not decision is S2's to make.

Test plan is in the spec, unchanged here.

## Notes

Open follow-ups noted in the spec's Out of scope, not blocking S1: the 24h anonymous deletion
job, and rate limiting (S6).

ADR-012 (desktop Chrome first, real-phone testing deferred) is Status: Proposed — needs Deshan
to flip it to Accepted once reviewed.

Steps 3 to 6 have their logic settled (see plan above) but no code written yet. Next session
picks up at step 3, implementing what's already agreed rather than re-deriving it.
