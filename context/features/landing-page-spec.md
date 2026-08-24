# Landing Page Spec

## Overview

Replaces the create-next-app boilerplate still sitting at `/` with a real landing page: the
first thing anyone recruited to Retell sees. Implements the presentational half of FR-1 (a new
user reaches a live microphone within 45 seconds of landing, without creating an account) and
carries the positioning line in docs/00-README.md. Marketing surface, not app surface, so it is
the one place `web-design-engineer` is allowed to work, under the constraints in
CLAUDE.md's precedence block.

**This ships part of S5 ahead of its gate, deliberately.** docs/03-delivery-plan.md section 3
parks S5 until the validation results are read, and the landing screen is S5 work by any honest
reading. Deshan decided to override that because the deployed root is currently framework
scaffolding, which is worse than any landing page. Recorded here rather than left implicit. The
rest of S5 (mic check, tile picker, the short-answer ladder) stays parked and unbuilt.

## Requirements

- MUST replace `app/page.tsx` entirely. No Next.js logo, no Vercel links, no `dark:` classes
  fighting the light-only token system (docs/07 section 3.5).
- MUST put a Start control in the first viewport at 1280x800, with no scrolling required, so
  the 45 second budget in FR-1 is spent on the user deciding rather than on reading.
- MUST use the existing tokens, type scale and primitives. `web-design-engineer` contributes
  layout, sectioning and motion only, never its own palette, `oklch()` values or type scale.
- MUST NOT promise or imply an outcome anywhere: no "get hired", "pass", "ace", "nail", "land
  the job", no success rates, no testimonials implying results (docs/07 section 6.3).
- MUST NOT use the words "AI", "AI-powered" or "AI coach" in any user-facing string.
- MUST NOT claim anything about privacy wider than docs/06-data-and-privacy.md commits to.
- MUST state the Chrome-only limitation before the user commits effort, per FR-34, rather than
  letting them discover it at the permission step.
- MUST say the product is free, and say nothing about future pricing, which is undecided.
- MUST respect `prefers-reduced-motion`: any entrance or scroll motion becomes an opacity
  change or nothing (docs/07 section 5.4).
- MUST pass an `interface-review` pass and measured contrast on every rendered pair before it
  is called done.

## Out of scope

- Wiring Start to anything real. It links to the existing `/record` route; the onboarding flow
  behind it is S5 and stays parked.
- Signup, pricing, testimonials, blog, footer navigation, cookie banner, analytics.
- Mobile and tablet layouts. Desktop 1280x800 only, matching the ui-screens-desktop decision.
  The page must not visibly break narrower, but small viewports are not designed this round.
- The rest of the S5 onboarding screens.
- Any change to the app screens shipped in ui-screens-desktop.

## Implementation notes

Proposed section order, shortest path to the microphone first:

1. **Hero.** Positioning line, one supporting sentence, Start, and the Chrome note. Fits
   1280x800 without scrolling.
2. **What actually happens.** Three steps: you answer out loud for about a minute, you get your
   own words back, one thing to work on is named. No competency words anywhere (FR-6).
3. **Why out loud.** The wedge from docs/00: everyone else gives you a mock interview once you
   already have one booked. Reading an answer is not the same as saying it.
4. **What it will not do.** Retell never writes a story for you (ADR-009), and there is no
   interviewer talking back (docs/01 non-goals). Stating the boundary is a differentiator, not
   a disclaimer.
5. **Your recordings.** Private, deletable, never training data without opt in, exactly as far
   as docs/06 goes and no further.
6. **Close.** Start again, plus the free line.

**Copy is a proposal.** Every user-facing string here is founder-authored territory under
docs/07 section 6 and needs Deshan's approval before it ships, not just review after.

Reuse `Button` and the existing tokens. New landing-only components live in
`components/landing/`, keeping the marketing surface separate from `components/ui/`, which the
app screens share.

## Test plan

- No unit tests: presentational markup with no computed logic, per context/coding-standards.md.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass.
- Contrast measured on every rendered pair, not estimated, and reported.
- `interface-review` and `critique-visual-hierarchy` run against the result.
- Checked in Chrome at 1280x800 by Deshan. Time from load to a visible Start control confirmed
  against the 45 second budget in FR-1.

## Docs impacted

- `context/tasks.md`: note that the landing screen shipped ahead of S5's gate, so the parked S5
  line no longer covers all of it.
- `docs/03-delivery-plan.md` is **not** edited here. Changing step order is Deshan's call and
  this is a one-screen override, not a resequencing. If S5 is genuinely being unparked, that is
  a separate decision and belongs in that document.
