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
4. **Browser gate**: done. `lib/browser-support.ts` feature-detects Chrome 151's `<usermedia>`
   element (`'HTMLUserMediaElement' in window`, confirmed against Chrome's own docs — never
   user-agent matching). `components/BrowserGate.tsx` + `app/record/page.tsx`. Verified live in
   real Chrome (both branches, no console errors) via a one-off Playwright install, plus a unit
   test for the detection function.
5. **Permission screen**: in progress. Fixed copy from docs/04 section 1.1, using the real
   `<usermedia>` element (fires `stream` / `error` / `cancel` events, mapping directly onto
   granted / denied / dismissed). On denial: explanation + the same control, show the question
   they'd have answered — worked example deferred (founder-authored content, not yet written,
   see spec's Out of scope and `context/tasks.md`). On dismissal: change nothing, treat as not
   yet asked.
6. **Recording UI**: logic agreed, not yet coded. State machine:
   `idle → recording → review → uploading → done`, with `restart` reachable from both
   `recording` (discards in-progress audio, starts a fresh 60s take) and `review` (goes back to
   `recording`). Countdown and waveform run during `recording` with no urgency styling as it
   nears zero (waveform is the only in-recording feedback, per docs/04). Timeout and manual
   stop both land in `review` the same way; stop finalizes whatever was captured with no
   minimum-length gate (the FR-10 15-second rule is an S2/S3 evaluation-stage check, not a
   capture-stage one). Submit: request a signed upload URL, upload the audio, write the
   `recording` row only after the upload succeeds (not before — keeps "fewest moving parts,"
   docs/02 constraint 1), then move to `done`. On upload failure, stay in `review` with the
   audio intact so they can retry (raw audio is never lost, CLAUDE.md hard rule).
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
