# Current Feature: UI Screens, Desktop

## Status

In Progress

## Goals

- Cover all 16 screens from the wireframe, desktop viewport only (1280x800): Landing, Browser
  gate, Permission explainer, Permission denied, Mic check, Setting picker, Question ready,
  Recording, Processing, Recovery, Feedback (+ no-result variant), Signup, Session end after
  skips, Session complete, Stories list (+ empty variant), Recordings and privacy.
- Use docs/07-design-system.md tokens for type, colour, spacing, shape, motion. No greyscale
  wireframe styling in the shipped result.
- Restyle PermissionScreen, BrowserGate, RecordingUI, Waveform in place rather than creating
  parallel components, since their behaviour (S1) already ships.
- No new functionality: no signup submission, no story save, no session composition, no
  deletion, no real transcript/evaluation data. Static or visually-placeholder content stands in.
- No not-yet-shipped screen wired into a real, user-reachable route. They live under a
  non-production preview path so nothing ships ahead of its gate in docs/03-delivery-plan.md.
- Real wireframe copy verbatim, except the 04 Permission denied fictional example answer, which
  stays a visible placeholder (founder-authored worked example is tracked separately in
  context/tasks.md).

## Implementation plan

**Price**: roughly 3 to 3.5 days. Tokens/fonts and shared primitives are quick; the eleven new
static screens matching desktop layout precisely are where most of the time goes. Flagging
before, not after, per the working agreement.

docs/07 section 5.1 was updated to a continuous wave, matching what `Waveform.tsx` already draws
(a live redrawn line, not bars, and no scroll history). This drops what was the one rewrite in
this plan down to a styling pass: `muted` colour, no mirroring, fast-attack/slow-decay smoothing,
minimum amplitude floor while live. Same analyser node, same real amplitude, no new data source.

Files, in the order touched:

1. `app/layout.tsx`: replace Geist with Fraunces + Instrument Sans via `next/font/google`
   (docs/07 section 2).
2. `app/globals.css`: add colour tokens to `@theme inline` (`ground`, `surface`, `ink`,
   `ink-soft`, `muted`, `rule`, `accent`, `accent-press`, `live`, docs/07 section 3), radius
   (4px), stroke (1px / 1.5px), and the 4px spacing scale (docs/07 section 4).
3. `components/ui/Button.tsx`: primary (filled `accent`) and secondary (`ink-soft` text, no
   fill) variants, 14px/24px padding, 44px minimum touch target (docs/07 section 4.1 line).
4. `components/ui/RecordControl.tsx`: the 96px desktop circle, idle/recording states, "Start
   recording" / "Read it out loud" / "Stop" labels beneath. One component because docs/07 4.1
   requires it identical across mic check, question ready, and recovery.
5. `components/ui/Chip.tsx`: pill shape, used on the feedback screen only (docs/07 3.1).
6. `components/Waveform.tsx`: style pass per the note above (colour, smoothing, floor), draw
   loop otherwise unchanged.
7. `components/PermissionScreen.tsx`: restyle explainer and denied states; add the denied
   state's placeholder "fictional example answer" card (dashed border, chip label, no real
   content, real copy is the separate parked task).
8. `components/BrowserGate.tsx`: restyle the unsupported message.
9. `components/RecordingUI.tsx`: restyle idle/recording/review/uploading/done using
   `RecordControl` and `Button`; uploading state becomes the Processing screen's hairline sweep
   (docs/07 5.2).
10. `components/ValidationFlow.tsx`: restyle the inline mic-check block (serif italic sentence
    per docs/07 2.1, `RecordControl` for the button).
11. `app/screens/landing/page.tsx`: new, static.
12. `app/screens/setting-picker/page.tsx`: new, static, six tiles.
13. `app/screens/question-ready/page.tsx`: new, static question header + `RecordControl` idle
    + skip. (No live equivalent exists today: `RecordingUI`'s idle state is just the button,
    not the question header, so this is a new composition, not a restyle.)
14. `app/screens/recovery/page.tsx`: new, static, reuses `RecordControl`.
15. `app/screens/feedback/page.tsx` and `app/screens/feedback/no-result/page.tsx`: new, static,
    no colour except `ink`/`muted`/`rule` and the chips (docs/07 3.3).
16. `app/screens/signup/page.tsx`: new, static.
17. `app/screens/session-end/page.tsx`: new, static.
18. `app/screens/session-complete/page.tsx`: new, static.
19. `app/screens/stories/page.tsx` and `app/screens/stories/empty/page.tsx`: new, static.
20. `app/screens/recordings-privacy/page.tsx`: new, static. Revised from the original plan: the
    actual wireframe (checked against the 16D desktop variant, not assumed) uses text buttons
    for Download/Delete throughout, not icons, and has no "close" control anywhere on this
    screen. No SVG icons were built; none were needed.
21. `app/screens/page.tsx`: an index linking every screen above, so they're reachable for the
    Chrome review without hunting URLs. Not linked from any real navigation.
22. `app/screens/permission-denied/page.tsx`, `app/screens/processing/page.tsx`: added after
    Deshan's first review pass: both states only exist live behind an action (deny the mic
    prompt, complete a real upload) that isn't practical to trigger for a quick review, so they
    got the same static-preview treatment as the eleven screens above, mirroring the exact
    markup of `PermissionScreen`'s denied state and `RecordingUI`'s uploading state.
23. `components/ui/DeleteButton.tsx`, `components/ui/DeleteModal.tsx`: added when Deshan asked
    for the account-delete button to be red with its confirmation as a popup. docs/07 3.2 only
    permitted red on a delete flow's confirm control, never the resting button; Deshan chose to
    add a real confirm popup and, for the account-level control specifically, also override the
    resting-button rule (docs/07 3.2 updated with the new exception, see the spec's Docs
    impacted section). Per-recording row deletes keep the original rule: neutral at rest, red
    only in the popup.

**Test plan**: no unit tests (presentational, no computed logic: coding-standards.md). `pnpm
lint`, `pnpm typecheck`, `pnpm build` must all pass. No migration, no RLS change. Every screen
reviewed in Chrome at 1280x800 before this feature is marked complete.

## Notes

**Out of scope**: backend logic (Deepgram, lib/evaluate.ts, Supabase schema/queries beyond what
S1 already calls, rate limiting, deletion, account claim); mobile viewport screens; promoting any
screen to a real production route; the denial-screen worked example content; any change to
lib/evaluate.ts, the rubric, or scheduling.

**Implementation notes**: shared design tokens in one place, consumed by all screens (matches
docs/07-design-system.md sections 2-3). Not-yet-shipped screens live under
app/screens/<name>/page.tsx, a preview-only route not linked from real navigation (precedent:
app/dev/verify-recording). S1 components keep their existing routes (/record, /validate/a,
/validate/b), restyled in place. The 05 Mic check screen's live equivalent is ValidationFlow's
micCheck step: restyle that inline block, don't invent a second component. Waveform keyframes
in the wireframe are decorative CSS; Waveform.tsx already drives a live waveform from the real
stream, so only styling changes. Reference docs/07-design-system.md for exact tokens.

Full spec: context/features/ui-screens-desktop-spec.md
