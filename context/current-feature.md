# Current Feature: Landing Page

## Status

In Progress

## Goals

- Replace the create-next-app boilerplate at `app/page.tsx` entirely. No Next.js logo, no
  Vercel links, no `dark:` classes fighting the light-only tokens (docs/07 section 3.5).
- Start control visible in the first viewport at 1280x800 with no scrolling, so FR-1's 45
  second budget goes on deciding, not reading.
- Existing tokens, type scale and primitives only. `web-design-engineer` contributes layout,
  sectioning and motion, never its own palette, `oklch()` values or type scale.
- No outcome language anywhere, no "AI", no privacy claim wider than docs/06 commits to, no
  pricing claim beyond "free".
- Chrome-only stated before the user commits effort (FR-34), not discovered at the mic prompt.
- `prefers-reduced-motion` respected. Contrast measured, not estimated. `interface-review`
  clean before it is called done.

## Implementation plan

**Price**: about a day. The page itself is half of it; the copy is the part that needs your
eyes, and the review passes are the rest.

**Ships part of S5 ahead of its gate, on purpose.** Recorded in the spec, not left implicit.
The rest of S5 stays parked. docs/03-delivery-plan.md is not edited, because a one-screen
override is not a resequencing; if S5 is genuinely being unparked, that is a separate call.

Files, in order:

1. `components/landing/` — new directory. Landing-only components live apart from
   `components/ui/`, which the app screens share, so marketing craft cannot leak into the app.
2. `app/page.tsx` — full replacement, composing the sections below.
3. `context/tasks.md` — note that the landing screen shipped ahead of S5's gate.

**Section order**, shortest path to the microphone first:

| # | Section | Job |
| --- | --- | --- |
| 1 | Hero | Positioning, Start, Chrome note. Fits 1280x800 unscrolled |
| 2 | What actually happens | Three steps. No competency words (FR-6) |
| 3 | Why out loud | The wedge from docs/00 |
| 4 | What it will not do | ADR-009 and the non-goals, stated as a differentiator |
| 5 | Your recordings | Exactly as far as docs/06 goes, no further |
| 6 | Close | Start again, plus the free line |

**Draft copy, for approval, not for shipping.** Every string here is founder-authored under
docs/07 section 6:

- **Hero.** "Practise your interview answers out loud." / "Five minutes a day, in your own
  words. No account needed to start." / `Start` / "Chrome or Edge for now, because it needs
  your microphone."
- **What actually happens.** "You get a question and answer it out loud, for about a minute." /
  "You get your own words back, laid out so you can see the shape of the answer." / "One thing
  to work on is named. Specific, or it isn't shown."
- **Why out loud.** "Reading an answer back to yourself is not the same as saying it to a
  person. Most people find that out in the room. Retell is the practice you do before you have
  an interview booked, not after."
- **What it will not do.** "It won't write your stories for you. They're yours, in your words,
  or they're something you'd have to repeat in a room and hope nobody asks about." / "No
  interviewer talks back. This is a drill, not a conversation."
- **Your recordings.** "Your recordings are private. No other user ever hears them, they are
  never used to train a model unless you say yes, and deleting one deletes its transcript too."
- **Close.** "Five minutes, out loud, on your own stories." / `Start` / "Free."

**One copy risk worth your call before I write it.** The permission screen already ships
"Nobody else hears them." On a landing page that sentence is doing more work, and audio does
reach a transcription provider. context/tasks.md still lists "Confirm Deepgram and model
provider retention and training defaults" as open. So the draft above says "No other user ever
hears them", which is exactly FR-39 and defensible today. Tell me if you want the warmer,
looser line instead and I will match the permission screen.

**Test plan**: no unit tests (presentational, no computed logic). `pnpm lint`, `pnpm typecheck`,
`pnpm test`, `pnpm build` all pass. Contrast measured on every rendered pair. `interface-review`
and `critique-visual-hierarchy` run against the result. Checked in Chrome at 1280x800, with
time-to-visible-Start confirmed against FR-1.

## Notes

**Out of scope**: wiring Start to anything real (it links to `/record`, the flow behind it is
parked S5); signup, pricing, testimonials, footer nav, analytics; mobile and tablet layouts
(must not visibly break, but not designed this round); the rest of the S5 onboarding screens;
any change to the app screens already merged.

Full spec: context/features/landing-page-spec.md
