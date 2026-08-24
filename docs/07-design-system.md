# 07: Design System

Product: Retell
Status: Draft for approval
Owner: Deshan Ekanayaka (engineer of record)
Version: 0.1

Owns type, colour, shape, spacing, icons and motion. What each screen contains is owned by
01-PRD.md and 04-voice-and-evaluation.md; this document owns how it looks and behaves.

Voice and tone are owned here too, in section 6. Everything that writes user-facing words in
this repo defers to it.

## 1. The idea underneath it

Both obvious reference products, Duolingo and every language app shaped like it, are tap apps.
The user is looking at the screen and visual delight is the reward.

On Retell's most important screen the user's eyes are not on the screen. They are talking,
probably alone, probably self conscious. Every pixel of visual interest during those sixty
seconds competes with the act.

**So the most important screen in the product is the least designed one, and the craft budget
goes to the screens either side of it.** Every rule below follows from that.

## 2. Type

**Fraunces** for the human voice. **Instrument Sans** for the system voice.

Serif carries the question asked of the user, the mic check sentence, the gap question, and the
user's own transcript. Sans carries everything the product says about itself: buttons, labels,
facts, chips, navigation, settings.

The reason is that Retell's screens are mostly one sentence on an empty field, so the sentence
is the interface. A serif at large size reads as something a person wrote to you. A neutral sans
at large size reads as a system prompt, and a rounded sans reads as a game. It also means the
user's own transcript is set in the same face as the question, which says visually that their
words and ours are the same class of thing.

Both are variable, free, and self hosted through `next/font`. Two families is the cap.

### 2.1 Scale

| Role | Family | Mobile | Desktop | Weight | Line height | Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Question, ready and recording | Serif | 32px | 42px | 400 | 1.2 | 22ch |
| Mic check sentence | Serif italic | 30px | 38px | 400 | 1.3 | 24ch |
| The gap question | Serif | 28px | 34px | 400 | 1.25 | 28ch |
| Permission heading | Serif | 28px | 34px | 400 | 1.25 | 20ch |
| Question as context, feedback screen | Serif | 17px | 17px | 400 | 1.4 | 46ch |
| Transcript body | Serif | 18px | 19px | 400 | 1.7 | 62ch |
| Body and explainer copy | Sans | 16px | 16px | 400 | 1.55 | 56ch |
| Buttons | Sans | 17px | 17px | 500 | 1.2 | n/a |
| Facts, the numbers (unused in Phase 1, ADR-016) | Sans, tabular | 26px | 30px | 500 | 1.1 | n/a |
| Facts, the labels (unused in Phase 1, ADR-016) | Sans | 13px | 13px | 500 | 1.3 | n/a |
| Transcript rail labels | Sans | 12px | 12px | 500 | 1.3 | n/a |
| Chips and small labels | Sans | 13px | 13px | 500 | 1.2 | n/a |
| Countdown | Sans, tabular | 22px | 22px | 400 | 1 | n/a |

### 2.2 Rules

- Nothing below 13px. Body never below 16px. A user reading a question then looking away cannot
  afford a second glance.
- **No bold serif anywhere**, including the largest question. Emphasis is size and space. A bold
  serif headline shouts and this product does not shout.
- Tabular numerals on the countdown, so it does not jitter as it changes. The same applies to
  the facts roles above if they are ever reinstated.
- Measure caps are hard limits. The question wraps to two or three short lines, never one long
  one, because a question read once before speaking has to be graspable in a single glance.
- No all caps except chips and small section labels, and there with modest letter spacing.
- Italic is reserved for the mic check sentence, marking it as a thing to read aloud rather than
  a thing to understand. It is the only italic in the product.

## 3. Colour

Warm paper, deep moss, one red used twice.

| Token | Value | Role |
| --- | --- | --- |
| `ground` | `#EFF0EA` | Page background, every screen. Never pure white |
| `surface` | `#FAFAF5` | Cards, the transcript field |
| `ink` | `#1A1D19` | Headings, questions, transcript text |
| `ink-soft` | `#3F443C` | Secondary prose, the countdown |
| `muted` | `#696F66` | Rail labels, facts labels, small captions |
| `rule` | `#DBD9D1` | Hairlines, dividers, transcript rails |
| `accent` | `#2F5D45` | Deep moss |
| `accent-press` | `#244936` | Pressed state |
| `live` | `#C43C2B` | Two permitted uses only, section 3.2 |

Ruled out, and why: blue and violet accents, cool grey grounds and near black with an acid pop
are the three looks that read as generated. A cream ground with a serif and a terracotta accent
is the fourth, and having chosen a serif we were closest to it. Yellow and orange are playful
and attention grabbing, wrong for a screen the user should be able to ignore while talking.
Dark blue is the generic professional answer. Black is the wrong kind of serious.

**On green.** Duolingo owns bright yellow green in daily habit learning. Ours is dark,
desaturated, and used only on controls, never as a field or a celebration, so the two are not
confusable. The stronger risk is that green means correct; that is handled by the usage rules
below, not by the hue.

### 3.1 Where accent is allowed

Primary buttons, the record control, focus rings, and the story chips on the feedback screen.
Nowhere else. Secondary controls (Skip this one, Start again, Not now) are `ink-soft` text with
no fill.

### 3.2 Where live red is allowed

Exactly three places in the product:

1. An 8px solid dot beside the countdown while recording. No pulse, no glow, no ring, no red
   border, no red field.
2. The confirm control in a delete flow. Never the resting Delete button for a single recording.
3. The resting "Delete everything" account-deletion control, as an exception to rule 2. Account
   deletion is the one irreversible, whole-account action in the product, so the resting button
   carries the warning too, not only its confirm step (which still opens as a separate popup,
   never inline).

### 3.3 Forbidden

- No colour on the feedback screen except `ink`, `muted` and `rule`. The transcript rails stay
  hairlines and the gap question stays ink. The accent appears there only on
  the chips.
- **No red, amber or green used as judgement anywhere.** No coloured pace ranges, no traffic
  lights, no good or bad states, no gauges. No score is shown in Phase 1 (FR-23) and a coloured
  number is a score.
- No green used to mean correct, complete or good. No ticks, no success states.
- No gradients, no coloured shadows, no tinted glass, no accent coloured backgrounds behind
  large areas.
- No second accent hue, for any reason.

### 3.4 Checks

- Body text clears 4.5 to 1 against its background. This is why `muted` is `#696F66` and not
  something lighter: at 4.51 to 1 on `ground` it is the darkest the small-caption grey is
  allowed to be, and anything lighter fails the rule above.
- **Hairlines are deliberately below 3 to 1.** `rule` on `ground` measures 1.23 to 1, and that
  is intentional, not an oversight. WCAG's 3 to 1 applies to controls and to graphics that
  carry information; a divider that only separates is exempt. The exemption is only honest
  while the rule below holds, so it is a hard constraint, not a note:
- **A hairline never carries meaning alone.** The margin label, the heading, or the spacing
  carries it. Anything that would break if the line were invisible has to be redrawn, because
  for some readers it effectively is.
- Convert a screen to greyscale. If two elements merge, the contrast is wrong, not the hue.

### 3.5 Themes

**Phase 1 ships light only.** Every colour is a token so a dark theme is a swap later, but a
second theme is not designed, tested or QA'd for a validation build running on desktop Chrome
with 40 to 60 recruited students. Doing it properly costs about a day plus drag on every screen
after; doing it badly produces the unreadable dark mode bug on the screen where the user is
already anxious.

## 4. Shape, spacing, stroke, icons

**Radius.** One value, 4px, on buttons, cards and inputs. Chips are full pill, because a pill
reads as a label and a 4px chip reads as a small button. 0px reads brutalist and fights the
warmth in the copy; 8 to 12px is the generated-app default.

**Stroke.** Exactly two weights: 1px for every hairline (rules, dividers, outlined buttons,
transcript rails) and 1.5px for icon strokes. No 2px borders, no double rules.

**Shadows.** None, anywhere. Surfaces separate with a 1px rule and the step from `ground` to
`surface`. Shadow is how app UIs say "card" and this product says "paper".

**Icons.** Retell needs five: microphone, download, delete, close, chevron, and three of those
appear only on the recordings and privacy screen. So: **text labels wherever a label fits**, and
an icon only where one genuinely does not. This kills the single biggest generated-app tell for
free, since the tell is a set of hairline icons rather than any one icon. Where an icon is
unavoidable it is solid filled at 20px, never a hairline outline. Filled shapes read as drawn;
outlines read as installed.

**Spacing.** 4px base unit. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. Nothing off the scale.

| Context | Value |
| --- | --- |
| Page padding, mobile | 24px |
| Page padding, desktop | 48px |
| Content column max width | 620px |
| Between feedback blocks | 32px, with a 1px rule |
| Label to its content | 8px |
| Button padding | 14px vertical, 24px horizontal |
| Minimum touch target | 44px |
| Above and below the gap question | 40px |

The last row is the one deliberate irregularity. The gap question gets more air than its
neighbours because it is the one thing on the screen the user has to act on.

### 4.1 The record control

A circle, 88px on mobile and 96px on desktop, filled `accent`, no border, with a solid filled
microphone glyph inside at 32px in `surface`.

**A text label sits directly beneath it**: "Start recording" on the question screen, "Read it out
loud" on the mic check. The circle is the hardware convention and the label is what stops it
being a guessing game, which matters against the 45 second clock in FR-1. Identical control in
the identical place on both screens, so the step from mic check to first real question is muscle
memory.

Pressed state fills `accent-press`. Focus is a 2px accent ring at 3px offset, never a browser
default outline. No red, no pulse, no ring animation at rest.

**While recording the circle stays put and changes state**: outlined accent circle with a filled
square glyph for Stop, in the same position, with "Start again" and "Skip this one" as plain
text buttons beneath. Continuity of the one object the user is looking at is worth more than
equal weighting of the three controls, and the two secondary actions stay plainly available.

## 5. Motion

### 5.1 The waveform

The only feedback during recording, so it proves the microphone is live without being worth
watching. If it is beautiful, users watch it instead of thinking about their answer.

- A continuous wave, one line, height driven by real amplitude, redrawn live. Not bars.
- `muted` colour. No accent, no gradient, no glow, no mirroring around a centre line. Mirrored
  waveforms look like audio software and invite admiration.
- Fast attack, slow decay, so it does not jitter frame to frame.
- Minimum amplitude held at all times while the microphone is live (04 section 1.2).

### 5.2 Everything else

- **Countdown:** no animation at all. No depleting ring, no colour change, no pulse, no scale on
  each tick. The ten second line is in 04 section 1.2.
- **Processing:** no spinner. A 1px hairline sweeping left to right on a two second loop in
  `rule` colour, under the waiting line. Spinners are the generated-app default and imply an
  unbounded wait.
- **Screen transitions:** 120ms opacity crossfade, nothing else. No slide, no spring, no shared
  element. A slide implies a wizard with a beginning and an end; this is a loop run daily.
- **The feedback screen appears complete.** No staggered reveal, no rails drawing themselves in,
  no chips arriving one at a time. An animated reveal is a small celebration and 04 section 3.4
  fixes that screen's tone as level.
- **Button press** is a 100ms colour change. That is the whole interaction vocabulary.

### 5.3 Never

Confetti, celebration, bounce, spring easing, scale on press, skeleton shimmer, numbers counting
up, anything that pulses to draw attention.

### 5.4 Reduced motion

`prefers-reduced-motion` removes the crossfade and freezes the processing sweep into a static
line. The waveform stays, because it is functional feedback rather than decoration, but drops
the scroll and becomes a single level bar rising and falling in place. Proof the microphone is
live is the accessibility floor here, not the animation.

## 6. Voice and tone

This section owns every user-facing word in the product. Where another document quotes fixed
copy, that copy still answers to the rules here.

### 6.1 The five rules

**1. Warm everywhere, including the evaluation.** There is no screen where coldness is the
correct register. The one thing that stays plain is the `gap` itself: a question about something
absent, never wrapped in praise or apology (04 section 3.4).

**2. Talk to the person, not at them.** Never answer an objection the user has not raised.
Arguing with the reader, or justifying the product to them, reads as a rebuke. This is what made
the original permission copy ("That's the point") land as a telling-off.

**3. Lower the stake before asking for the effort.** Any screen that asks the user to speak says
what does not count, before the control that starts it.

**4. Warm never means vague.** Never soften a fact about what is about to happen. The user always
knows they are being recorded and roughly for how long. A softened fact is a surprise deferred to
a worse moment.

**5. Never reassure with something untrue.** No praise the work does not support, no outcome
claim, no privacy promise wider than what 06-data-and-privacy.md actually commits to.

### 6.2 The test

Would you say this out loud, in these words, to a nervous 21 year old sitting opposite you?

If it would sound like a brochure, a teacher, or a cheerleader, it fails.

### 6.3 Banned outright

- Em dashes, anywhere, in prose, docs or UI.
- Telling a user their answer is wrong. Weak, vague or unstructured, never wrong (FR-24).
- The words "AI-powered" or "AI coach", or "AI" at all in user-facing copy.
- Outcome language: hired, pass, ace, nail, succeed, land the job.
- Competency words inside any question shown to a user (FR-6). They exist only as labels applied
  afterwards.
- Praise inflation: "great job", "amazing", "well done", exclamation marks, celebration copy.
- Guilt, shame, loss framing and fake urgency (05 section 7.2).
- Any number presented as a verdict on the user (FR-23).

### 6.4 Worked examples

| Instead of | Write |
| --- | --- |
| "That's the point." | "It's allowed to come out messy. That's what practice is for." |
| "Your answer was too short." | "Let's try an easier way in." |
| "Great answer! What did you do?" | "You told me what the team did. What did you do?" |
| "Don't lose your streak." | "Tomorrow takes about five minutes." |
| "You failed to give a result." | Nothing. Leave the rail undrawn and let the gap question ask. |
| "Great work today!" | "You have 3 stories now. That covers most of a first round." |

### 6.5 Register

Plain, short, warm, level. Contractions throughout. Second person. Active voice. A control says
exactly what happens. No slogans, no coaching language, no exclamation marks.

