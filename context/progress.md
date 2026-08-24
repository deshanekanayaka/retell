# Progress

Append-only completion log. One line per completed piece of work: date, name, one sentence
outcome. Written at step 10 of the feature workflow.

- 2026-08-23: S0 commands — filled in real pnpm commands in CLAUDE.md (dev, build, test, lint,
  typecheck) and verified each one runs clean against the scaffolded app.
- 2026-08-23: S0 complete — repo pushed to origin/main, CI green, Vercel deploy live, Supabase
  project wired with client/server helpers in lib/supabase/.
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
