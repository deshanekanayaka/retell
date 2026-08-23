# Bugs

Append-only log of real bugs found during work, and how they were fixed. Brief. Each entry has
a technical version and a plain version of the same thing, not a summary and a detail level.

## `setConstraints` rejected a boolean audio constraint — 2026-08-23

**Technical**: `element.setConstraints({ audio: true })` on Chrome's `<usermedia>` element threw
`Failed to read the 'audio' property from 'HTMLMediaStreamConstraints'` — unlike legacy
`getUserMedia()`, it requires a constraint set object, not a boolean.
**Plain**: The line of code that asks for microphone access was written the old way (just
"yes, audio please"), but this newer browser feature wants it phrased as "audio, with these
settings" even when there are no settings to set.
**Fix**: `components/PermissionScreen.tsx` — changed to `setConstraints({ audio: {} })`. Caught
by actually loading the page in real Chrome, not by lint/typecheck/tests, which all passed
first.

## `<usermedia>`'s native prompt ignores the fixed button copy — 2026-08-23

**Technical**: Chrome's `<usermedia>` element renders its own native permission control
("Use microphone and camera") and only falls back to light-DOM child content
(`<button>Turn on my microphone</button>`) on browsers that don't recognize the element at all.
Since `BrowserGate` already filters out every browser except Chrome/Chromium, the custom button
label specified in docs/04 section 1.1 can never actually be seen by a real visitor.
**Plain**: We wrote specific words for the microphone button ("Turn on my microphone"), but it
turns out Chrome shows its own button text instead and won't let us change it, so nobody would
ever see our version.
**Fix**: Deshan approved keeping Chrome's native control instead of hand-rolling a plain button
that would show our custom label — the native element measurably improves how often people
successfully grant the permission after an initial denial, which was worth more than the exact
wording. The rest of the fixed copy (the explainer paragraphs) is unaffected.

## Countdown reset via setState-in-effect, and a stale closure narrowing — 2026-08-23

**Technical**: `RecordingUI.tsx` reset `secondsRemaining` with a direct `setState` call inside
the MediaRecorder-management effect, tripping ESLint's `react-hooks/set-state-in-effect`.
Separately, `Waveform.tsx`'s null checks on `canvas`/`context` didn't survive TypeScript's
narrowing into the nested `draw()` function declaration, producing real `tsc` errors.
**Plain**: Restarting a recording was resetting its own timer in a way React considers unsafe
(it can cause extra re-renders), and a null-check on the drawing canvas stopped "counting" once
the code moved into a nested function, even though the check already happened one line above.
**Fix**: Each recording attempt is now its own small component, remounted fresh on restart
instead of manually resetting state — React's own recommended fix for this exact pattern, and
it also closes a real race where a discarded restart's late-firing recorder event could have
overwritten a newer take. The canvas fix just rebinds the checked values to new, explicitly
non-nullable constants. Caught by ESLint and `tsc` respectively, not by a live browser test.
