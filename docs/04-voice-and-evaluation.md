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
agreeing to (FR-2). The copy is a contract and answers to 07-design-system.md section 6. It may
be made warmer, it is never made vaguer:

> **You'll be saying this out loud.**
> It's allowed to come out messy. That's what practice is for.
>
> Your recordings stay on your account. Nobody else hears them.
> The first one is only a mic check. It doesn't count for anything.

Button: **Turn on my microphone**

Four jobs, and a rewrite keeps all four. Naming the awkward thing before the browser prompt
fires pre-empts the surprise that causes denial. "It's allowed to come out messy" answers the
reason people actually abandon this screen, which is fear of sounding stupid rather than fear
of speaking. "Nobody else hears them" answers the real privacy fear, which is being overheard
rather than data handling in the abstract. "It doesn't count for anything" removes the
performance stake before the decision is made.

The button stays literal. Warmth belongs in the body copy, not in the control, because a vague
button in front of a browser permission dialog is how a grant becomes a dismissal.

**Superseded:** the original wording opened "You'll be speaking out loud. That's the point."
and was marked fixed and not to be softened. "That's the point" answered an objection the user
had not raised yet, which reads as a rebuke on the one screen that cannot afford one. Changed
before the cohort test so that permission copy is not a moving variable while the mic check is
being measured (03-delivery-plan.md section 4).

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
  It never flatlines while the microphone is live: a minimum bar height is held even in silence,
  because a flat trace during a thinking pause reads as "it stopped recording" at the moment the
  user is least sure of themselves.
- At ten seconds, one line appears beneath the countdown: "about 10 seconds remaining". The
  number itself never changes colour, size or weight, and nothing turns red. The answer is kept
  at zero, so there is nothing to be urgent about, and fake urgency is a non-goal
  (01-PRD.md section 5).
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
- Tone is warm, in line with 07-design-system.md section 6, which owns voice and tone for the
  whole product. Warm means the words around the finding: plain, level with the reader, and
  never cold about work someone was nervous to produce.
- **Warm the frame, keep the gap plain.** The `gap` field itself is a question about something
  absent and carries no praise, no softener and no compliment attached to it. "Really strong
  answer! What did you do?" destroys both halves: the praise is unearned and the question stops
  being taken seriously. Warmth belongs in the copy the product writes around the model's
  output, not inside the model's finding.
- No congratulation, no assessment of the person, no encouragement the answer does not support.
  Praise that is not earned teaches the user that nothing on the screen means anything.
- The prompt is versioned. Any change to it increments `rubric_version` (FR-20). This warming
  happened before any answer had been evaluated, so it does not increment anything: the warmed
  prompt is `rubric_version` 1, and there is no earlier version to be incomparable with.

## 4. What the user sees

The question they answered sits at the top of the screen, quiet, above everything else. It is
context, not content: without it the transcript is an answer to nothing, and a user returning to
the screen later has no idea what they were asked. It is set small enough that it never competes
with the gap question further down, which is the question the user acts on. Two questions on one
screen is a real risk, and the size difference is what resolves it.

Then, after every answer, in this order (FR-22):

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

**One column, every viewport.** The order above is a requirement, not a preference, so the screen
never splits into columns, including on desktop. A two column layout puts the gap beside the
transcript rather than after it, and since the gap is the largest object on the screen the eye
reaches it first. Reading the one thing missing before reading your own words changes how you
read your own words. The content column keeps the same measure as the phone layout, centred, so
the transcript stays near 62 characters a line.

### 4.1 How the transcript is marked

The three parts are marked with a hairline rule down the left of the marked passage and a label
in the margin. The words themselves are never touched: no highlighter fill, no underline, no
reflowing of what was said into tidier paragraphs.

**Labels are plain, never the framework words.** In the margin, in sentence case:

| Part | Label shown |
| --- | --- |
| situation | the setting |
| action | what you did |
| result | how it ended |

Rejected: "Situation", "Action", "Result". Naming the framework invites the user to notice that
Task is absent and conclude the product has STAR wrong, rather than that it deliberately marks
three parts. Plain labels invoke no framework, so nothing looks missing from one.

**Task is not a fourth part.** The reason Task matters, that the speaker names what they were
personally on the hook for, is already carried by the `specificity` ladder in section 3.2, where
the 2 to 3 boundary is exactly whether the speaker's own contribution is clear. Adding a fourth
part would ask the model to draw a line between situation and task that speakers do not draw
when talking, and would put four rails on an answer of roughly 140 words.

**One rail per part, on the clearest instance, not on every occurrence.** Speech backtracks, so
the three parts frequently arrive interleaved rather than in blocks. Marking every occurrence
shreds a sixty second answer into six or seven fragments and destroys the calm the treatment
exists for. Each part gets one rail, placed on the longest run of speech carrying it.

**A part the answer does not contain gets no rail and no label.** No empty row, no greyed
placeholder, no missing marker. The absence in the margin is the whole signal, and the gap
question directly above it is already asking for the part that is not there. Drawing an empty
labelled rail says the same thing a second time in a colder voice, and an unticked box on
someone's own words is close to marking them down, which section 5 rules out.

### 4.2 Answering again

The gap question is a question, so the screen has to let the user answer it. Without that, it is
posed and then abandoned, which reads as being left hanging at the one moment the user is most
exposed.

**One action, directly beneath the gap question**, not in the footer with the other two. Copy:
"Have another go at this one". An invitation, never an instruction, and never phrased in a way
that implies the first attempt failed.

Placement is the decision. In the footer it becomes a third equal option sitting a long way from
the thing it responds to. Directly under the gap it reads as the answer to the question.

**It re-asks the original question, not the gap question.** The gap is generated per answer and is
not in the question bank, and answering it as a short follow up would break the one answer equals
one unit model the rest of the product rests on (section 5). The original question is re-asked
with the gap still visible.

**Never an example answer, a suggested phrasing, or a sentence starter here.** ADR-009 rules it
out everywhere, and the reason is sharpest on this screen: anything placed next to a user's own
transcript at the moment they feel caught short becomes the thing they repeat in a real
interview. The worked example in section 1.1 is for the permission denial screen, where the user
has not spoken yet and has nothing to copy against.

Guidance about form is still allowed, since that is elicitation rather than content. One neutral
line under the gap: "There is no right answer to this. Just say what you personally did."

**Open, and owned by Deshan, not needed before Phase 2.** When an item is graded, whether a second
attempt replaces the first or the first stands. Recorded here so it is not decided by accident in
code. Both attempts are stored either way, since raw audio is never lost.

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
wrong. It asks an easier question. Wording throughout this section answers to
07-design-system.md section 6.

## 6. Model and cost

Built and tuned on a strong model, because a rubric cannot be tuned against a model that has
not been seen doing the job well. Once the rubric is stable, the same real answers are re-scored
on a cheaper tier and compared. The switch, if it happens, is recorded as an ADR.

Evaluation is isolated behind `lib/evaluate.ts`. No other file knows which provider is behind
it (02-system-architecture.md section 3.2).

Cost is bounded by the three limits in 02-system-architecture.md section 3.5, not by choosing a
cheap model early.
