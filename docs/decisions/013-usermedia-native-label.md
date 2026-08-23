# ADR-013: Accept Chrome's native `<usermedia>` label over the fixed button copy

- **Status**: Proposed
- **Date**: 2026-08-23

## Context

docs/04-voice-and-evaluation.md section 1.1 specifies the permission screen's button copy as
"Turn on my microphone." Implementing the permission screen with Chrome 151's `<usermedia>`
element (chosen for a measured 10%→65% jump in successful re-grant after an initial denial)
revealed that the element's native permission control is not customizable: it always shows
Chrome's own label ("Use microphone and camera"), and only falls back to the element's
light-DOM child content (where the custom button lives) on browsers that don't recognize
`<usermedia>` at all. Since S1's browser gate already filters every visitor down to
Chrome/Chromium, no real visitor can ever reach a browser state where the custom button label
renders. See `context/bugs.md` for the technical trail.

## Decision

Keep `<usermedia>` and accept Chrome's native control label. The fixed explainer copy above the
button (the four paragraphs) is unaffected and still shows exactly as specified; only the
button's own text is Chrome's, not "Turn on my microphone."

## Alternatives rejected

- **Drop `<usermedia>`, hand-roll a plain button calling `getUserMedia()` directly**: restores
  the exact button copy, but gives up the re-grant improvement and the browser's own trust
  signal that motivated choosing `<usermedia>` in the first place (docs/04 section 1.1). A
  wording difference on one button was judged cheaper than reverting to the worse-performing
  pattern.

## Consequences

- docs/04 section 1.1's "Button: **Turn on my microphone**" line no longer matches what ships.
  The fixed button `<button>Turn on my microphone</button>` still exists in the component as
  fallback content for genuinely unsupported browsers, but they never reach it, since the
  browser gate filters them out first.
- If `<usermedia>` ever ships a way to customize the native label, this ADR is worth revisiting.

## Revisit trigger

If Chrome (or the eventual cross-browser standard) adds a way to customize the native control's
label, or if the browser gate is ever relaxed to let unsupported browsers reach this screen.

## References

docs/04-voice-and-evaluation.md section 1.1. `context/bugs.md`.
`context/features/s1-record-and-upload-spec.md`.
