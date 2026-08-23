# 04: Voice and Evaluation

Product: Retell
Status: Draft for approval
Owner: Deshan Ekanayaka (engineer of record)
Version: 0.1

Owns the decisions about how a spoken answer is captured, turned into text and numbers, and
turned into feedback. Implements FR-2, FR-3, FR-14 to FR-25 of 01-PRD.md. The pipeline shape
is in 02-system-architecture.md section 3.2 and is not repeated here.

## 1. Capture

### 1.1 Permission

Permission is requested once, from a full screen, after the user has been told what they are
agreeing to (FR-2). The copy is fixed and is not softened:

> **You'll be speaking out loud.**
> That's the point. Interview answers live in your mouth, not on a page.
>
> Your recordings stay on your account. Nobody else hears them.
> The first one doesn't count. It's a mic check.

Button: **Turn on my microphone**

Three deliberate choices. Naming the awkward thing pre-empts the surprise that causes denial.
"Nobody else hears them" answers the real fear, which is being heard rather than privacy in the
abstract. "The first one doesn't count" removes the performance stake before the decision is
made.

Implementation is a plain button calling `navigator.mediaDevices.getUserMedia({ audio: true })`
(ADR-014 — Chrome's declarative `usermedia` element was tried first but only supports combined
audio and video, no audio-only mode).

**On denial**, never re-prompt and never show a settings tutorial. The screen changes to an
explanation plus the same button, since tapping it again re-triggers the browser's own recovery
flow. Below it, show the question they would have answered and a worked example built from a
clearly labelled fictional character.

**On dismissal**, ideally this is reported separately from denial: change nothing and say
nothing, treat it as not yet asked. In practice `getUserMedia()` cannot tell the two apart —
both reject with the same `NotAllowedError` — so dismissal currently gets the same gentle
denial screen rather than staying silent (ADR-014).

### 1.2 Recording

- 60 second countdown, stops at zero (FR-18).
- Restart before submitting is free and always visible.
- Stopping early keeps the answer.
- A live waveform shows the microphone is working. This is the only feedback during recording.
- Audio is uploaded directly from the browser to object storage with a signed URL, never
  proxied through an API route.

### 1.3 The mic check

The first spoken act is reading one supplied sentence aloud (FR-3):

> "Read this out loud so I can check your mic: *I'm here because I have an interview coming
> up.*"

It is never transcribed, evaluated, counted or played back. Scripted speech has no content to
fail at, and the sentence is first person and true, so the step from it to speaking about
themselves is one step rather than two.

**Decided:** the mic check audio is stored, flagged `mic_check`, and never transcribed,
evaluated or counted. It costs almost nothing to keep and it is the only recording of the user
before they had any practice, which makes a later before-and-after possible.

### 1.4 Playback

No recording is played back to the user during their first four sessions (FR-25).

Hearing your own recorded voice is reliably uncomfortable, and the discomfort is strongest when
the recording carries audible anxiety and hesitation, which is exactly what a first attempt
contains. On day one that is a reason to leave. Later, once the user has evidence they can do
this, it becomes useful.

## 2. Transcription

Deepgram, pre-recorded endpoint. Required options:

- Word level timestamps, used to compute pauses and pace.
- Filler words enabled, so hesitation survives into the transcript.

Whisper in any form is rejected for this product. It is trained to produce clean readable text
and silently removes "um", "uh" and false starts. That is not a setting, the information never
arrives.

**Signals are computed from the audio and the timestamps, never inferred by a language model**
(FR-17):

| Signal | Computed as |
| --- | --- |
| `duration_ms` | Length of the audio file |
| `words_per_minute` | Word count divided by duration |
| `longest_pause_ms` | Largest gap between consecutive word end and start times |
| `filler_count` | Count of tokens in the filler list |

Filler list for v1: `um`, `uh`, `er`, `erm`, `like` (only when not followed by a noun phrase is
too clever for v1, so `like` counts every time and the threshold is set accordingly), `you
know`, `I mean`, `basically`, `actually`.

**Decided:** the filler list is a contract. Adding or removing a word changes historical
comparability, so any change increments `rubric_version` and is recorded as an ADR.

## 3. The rubric

### 3.1 Dimensions

Three, each scored 0 to 3 by the model (FR-19).

| Dimension | The question it answers |
| --- | --- |
| `relevance` | Did this answer the question actually asked, including any twist? |
| `structure` | Is there a situation, an action, and a result? |
| `specificity` | Concrete details, names, numbers, or generic filler? |

Three, not five. Every added dimension is another thing to tune and another way to be
confidently wrong. These three are all observable in a transcript.

Rejected: any dimension that cannot be seen in the text. Scoring "cultural fit" or "confidence"
from a transcript produces a number that means nothing, and Retell does not tell users things
about themselves it cannot support.

Duration and pace are not scored. They are facts, reported as facts.

### 3.2 Scoring anchors

The model is given these anchors, not left to invent a scale.

**relevance**
- 0: answered a different question entirely
- 1: touched the topic but did not address what was asked, or ignored the twist
- 2: addressed the question, with some drift
- 3: addressed exactly what was asked, twist included

**structure**
- 0: no discernible situation, action or result
- 1: one of the three present
- 2: two of the three present
- 3: all three present and in a followable order

**specificity**
- 0: entirely generic, could describe anyone
- 1: one concrete detail
- 2: several concrete details, but the speaker's own contribution is vague
- 3: concrete throughout, and clear about what the speaker personally did

The specificity ladder deliberately makes "what did *you* do" the difference between 2 and 3.
Answers that say "we" throughout are the single most common weakness in student answers.

### 3.3 What the model returns

Schema enforced. The model returns only:

```
{
  relevance: 0 | 1 | 2 | 3,
  structure: 0 | 1 | 2 | 3,
  specificity: 0 | 1 | 2 | 3,
  gap: string,          // one thing missing, phrased as a question
  angles: string[]      // which question angles this answer could serve
}
```

The model never returns a grade, a total, or free prose beyond `gap`. Grade derivation is in
05-spaced-repetition.md and happens in application code (FR-27).

### 3.4 Prompt rules

The prompt is a contract as much as the schema is. Fixed rules:

- The model scores a transcript. It is never asked how long someone spoke or how fast.
- The model never rewrites the answer, never supplies an example answer, and never invents
  detail the speaker did not say. Suggesting content the user did not experience would produce
  claims they repeat in a real interview.
- `gap` is one sentence, phrased as a question, about something absent from the answer. Never
  a judgement, never the word "wrong" (FR-24).
- Tone is level. Not harsh, not congratulatory. A daily habit product that is harsh on day two
  loses the user on day three.
- The prompt is versioned. Any change to it increments `rubric_version` (FR-20).

## 4. What the user sees

After every answer, in this order (FR-22):

1. **Their transcript**, their own words, with the situation, action and result parts
   highlighted where they exist.
2. **The gap**, as a question. "You told me what the team did. What did you do?"
3. **The facts**: how long they spoke, and their pace. Numbers presented as numbers.
4. **The labels**: which question types this story now covers. "That works for conflict and for
   communication."

**Not shown in Phase 1: any score** (FR-23). The three numbers are stored from day one because
the scheduler and calibration need them, and because a rubric cannot be validated against data
that was never collected. A number on screen turns daily practice into a verdict.

Point 4 does the emotional work. It is the only thing on the screen that tells a student who
believes they have no experience that one bad week on a group project is two interview answers.

## 5. Recovery when an answer fails

Never treated as failure, never shown as an empty result (FR-10, FR-11).

**Under 15 seconds, or almost nothing said.** Not scored, not saved as a story. An easier
question replaces it, from a fixed ladder:

1. "Tell me about the last thing you worked on with other people."
2. "Describe where you did it. The room, the people who were usually there."
3. "Who was the person you dealt with most? What were they like?"

Step 2 carries the weight. Describing a place requires no judgement about whether anything was
significant, so almost nobody fails it, and a story usually falls out of the description.

**A full minute of nothing concrete.** This is a real answer and gets real feedback. The gap
question does the work, and they answer the same question again. Second attempts are almost
always better, and the user learns what specific means without being told they were vague.

**Stopped halfway.** Nothing lost, one button to continue.

**"I have nothing."** A skip is available on every question, always visible, never discouraged.
Three consecutive skips ends the session with whatever was produced and one line saying it gets
easier.

The rule beneath all of it: the product never says an answer was too short, too vague, or
wrong. It asks an easier question.

## 6. Model and cost

Built and tuned on a strong model, because a rubric cannot be tuned against a model that has
not been seen doing the job well. Once the rubric is stable, the same real answers are re-scored
on a cheaper tier and compared. The switch, if it happens, is recorded as an ADR.

Evaluation is isolated behind `lib/evaluate.ts`. No other file knows which provider is behind
it (02-system-architecture.md section 3.2).

Cost is bounded by the three limits in 02-system-architecture.md section 3.5, not by choosing a
cheap model early.
