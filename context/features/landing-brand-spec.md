# Landing Brand and Motion Spec

## Overview

The landing page shipped in landing-page-spec.md is correct but under-executed: no wordmark, no
illustration, no motion, no crafted moments, and the mobile scale from docs/07 section 2.1 is
not implemented. This feature gives Retell a performed identity on the marketing surface:
a logotype, an SVG illustration language, a small character used sparingly, and a founder-approved
motion addendum to docs/07 scoped to marketing pages only. Landing page first; record, feedback
and privacy get the same treatment in a follow-up pass after review.

Marketing surface, so `web-design-engineer` and the newly installed design skills
(emil-design-eng, animate, apple-design, better-*, critique-*, perception laws) advise here,
under CLAUDE.md's precedence block: docs/07 wins every conflict, and conflicts are raised, never
applied silently.

## Founder decisions required before implementation

Three things below are founder-authored. Nothing is built until each is approved or edited.

### A. Proposed docs/07 addendum: section 5.5, "The marketing surface"

Draft text, to be added to docs/07 on approval:

> Sections 5.1 to 5.4 govern the app. Marketing pages (`/`, `/privacy`) may additionally use:
>
> - Entrance motion: opacity plus a vertical rise of at most 16px, ease-out only, 200 to 400ms,
>   fired once per element as it enters the viewport. Stagger across siblings at most 90ms.
> - Hover states: 150ms colour or underline changes on links and cards.
> - One ambient element per page at most: on the landing hero, a single slow-drifting waveform
>   line in `muted`, decorative, amplitude-free, drawn once and moving gently. It must be
>   ignorable; if it draws the eye from the headline it is wrong.
>
> Still banned on marketing pages, same as everywhere: spring and bounce easing, scale on press
> or hover, parallax, pinned or scroll-scrubbed scenes, pulses, counters, skeleton shimmer,
> gradients, shadows, celebration.
>
> `prefers-reduced-motion` removes entrance rises (elements render in place, at most a plain
> opacity fade) and freezes the ambient element into a static line.

### B. Character: decided, none

Founder decision 2026-08-29: no character. Retell has banned the two jobs a mascot exists to do
(streak pressure and celebration), and a mascot invites the Duolingo comparison.

Founder decision, same day, during the build: **the brand mark is a waveform, not the quote
mark**. A single voice burst drawn as one line (never bars, matching docs/07 section 5.1),
used in the wordmark, favicon, apple icon and OG image. It is the same object as the recording
waveform and the hero's ambient wave, so the logo, the product and the page draw one thing.
The Fraunces quote glyph survives only as typographic decoration on the landing pull-quote,
where it marks a quotation, not the brand.

### C. Copy

Any changed or new user-facing string is listed in the PR for approval before merge, per
docs/07 section 6. Existing approved copy is kept unless a layout change forces a rewrite.

## Requirements

- MUST add a Retell logotype: "Retell" set in Fraunces with a drawn opening-quote mark, as
  inline SVG plus a favicon and an OG image generated from the same mark.
- MUST implement the mobile type scale and paddings from docs/07 sections 2.1 and 4. The
  current page hardcodes desktop values (`px-12`, fixed 56px type).
- MUST build the SVG illustration language from product motifs: the waveform line, transcript
  rails, quote marks, paper. Filled shapes per docs/07 section 4; no hairline icon sets, no
  stock illustration style, no gradients, no shadows.
- MUST stay inside the docs/07 palette. No second hue, no accent fields behind large areas.
- MUST implement motion exactly as the approved section 5.5 text, nothing beyond it, and honour
  `prefers-reduced-motion` as written there.
- MUST keep Start in the first viewport with nothing to read above it (FR-1), on mobile too.
- MUST keep every copy rule: no outcome language, no "AI", no competency words, no praise
  inflation, no em dashes (docs/07 section 6.3).
- MUST pass measured contrast on every rendered pair, and an `interface-review` plus
  `critique-visual-hierarchy` pass before done.
- MUST be checked in Chrome on a real phone before done (coding standards, Next.js section).

## Out of scope

- Record, feedback, dev and privacy screens (follow-up pass after landing review).
- Any change to app-screen motion rules, the waveform behaviour in 5.1, or sections 5.2/5.3.
- Character animation, mascot merchandising moments, empty states.
- Dark theme (docs/07 section 3.5), analytics, signup, pricing.
- Any scroll-scrubbed or cinematic treatment (rejected in this session; would need an ADR).

## Implementation notes

- Branch `feature/landing-brand`.
- Files: `app/page.tsx`, `app/layout.tsx` (metadata, favicon, OG), `components/landing/*`
  (new `Wordmark`, `Illustration`/motif components, character SVG), `app/globals.css` or a
  small motion utility for the entrance classes, `public/` for favicon and OG assets.
- Entrance motion via IntersectionObserver plus CSS classes; no animation library. The ambient
  waveform is a single SVG path animated with CSS; no canvas, no rAF loop.
- docs/07 gets section 5.5 added in the same branch, once approved, since the change makes the
  doc stale (workflow step 8).
- Order: wordmark and favicon, then mobile scale fixes, then illustration components, then
  motion, then critique passes.

## Test plan

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass. No unit tests: markup and
  CSS only, no computed logic.
- Contrast measured on every new rendered pair.
- `interface-review`, `better-accessibility` (focus order, reduced motion), and
  `critique-visual-hierarchy` run against the built page.
- Chrome on a real phone: layout, tap targets at 44px, entrance motion, reduced-motion mode.

## Docs impacted

- `docs/07-design-system.md`: gains section 5.5 (founder-approved text only).
- `context/progress.md`: one line on completion.
