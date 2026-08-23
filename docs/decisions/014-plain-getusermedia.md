# ADR-014: Plain `getUserMedia()`, not `<usermedia>`

- **Status**: Accepted
- **Date**: 2026-08-23

## Context

ADR-013 accepted Chrome's native `<usermedia>` control label over the fixed "Turn on my
microphone" copy. Building the actual permission request revealed a harder problem than a
label: `<usermedia>` currently only supports combined audio+video requests. There is no
audio-only mode. Chrome's own documentation names a future `<microphone>` element for
audio-only scenarios, not yet shipped. Continuing with `<usermedia>` would mean asking every
visitor for camera access Retell never uses, undercutting the permission screen's own trust
copy ("Nobody else hears them") by requesting hardware access beyond what's needed.

Separately, plain `getUserMedia()` cannot distinguish a dismissed permission prompt from a
deliberately blocked one — both reject with the same `NotAllowedError`. This is a documented,
long-standing platform ambiguity, not something `<usermedia>` and its distinct `cancel`/`error`
events would have solved for audio-only requests either, since audio-only isn't available
through it at all.

## Decision

Use `navigator.mediaDevices.getUserMedia({ audio: true })` directly, triggered by a plain
button reading "Turn on my microphone" — restoring the exact copy docs/04 section 1.1
specifies. Denial and dismissal are handled identically, one flat outcome, rather than
attempting to preserve a distinction the platform doesn't reliably expose. This supersedes
ADR-013, which is now moot: the native-label tradeoff it accepted doesn't arise once
`<usermedia>` itself is dropped.

`lib/browser-support.ts`'s Chrome/Chromium feature-detect also changes, as a direct
consequence: it checked for `<usermedia>`'s existence (`'HTMLUserMediaElement' in window`),
which is Chrome 151+ only. Since the actual capture no longer needs that version, the check
now uses `navigator.userAgentData` (User-Agent Client Hints — Chromium-exclusive, not
UA-string sniffing, and not pinned to a specific version), so FR-34's "Chrome and Chromium
browsers" gate isn't narrower than the product actually requires.

## Alternatives rejected

- **Keep `<usermedia>`, request audio and video**: rejected outright. Retell never uses video;
  asking for camera access anyway is a real privacy-minimalism problem, not just an annoyance,
  and directly contradicts the trust framing the permission screen exists to establish.
- **Approximate the denial/dismissal distinction with a heuristic** (e.g. visibility-change
  timing): rejected as fragile, unreliable engineering in exchange for a UX nuance the fixed
  copy doesn't lean heavily on anyway — the denial-screen copy was already gentle
  ("whenever you're ready"), not accusatory, so the two outcomes converge to nearly the same
  experience either way.

## Consequences

- docs/04 section 1.1's button copy is accurate again, with no caveat needed.
- Dismissal no longer stays perfectly silent as docs/04 originally specified; it shows the
  same gentle message denial does. Minor, accepted spec deviation.
- Camera is never requested. No change to what audio recording itself looks like.
- `lib/browser-support.ts` and its test changed to check `userAgentData`, not
  `HTMLUserMediaElement`.

## Revisit trigger

If Chrome ships an audio-only Capability Element (`<microphone>` or similar), or if the
Permissions API ever exposes a reliable dismiss-vs-deny signal for `getUserMedia()`.

## References

ADR-013 (superseded). docs/04-voice-and-evaluation.md section 1.1. `context/bugs.md`.
`lib/browser-support.ts`.
