# 01: Product Requirements Document

Product: Retell
Status: Draft for approval
Phase: 1
Owner: Deshan Ekanayaka (engineer of record)
Version: 0.2
Date: 2026-08-29

## 1. Problem

Interview failure is a delivery problem, not a knowledge problem. Candidates know their own
experience. They cannot say it out loud, under pressure, in sixty seconds, to a question they
did not expect.

New graduates have it worst. They have had few or no real interviews, so the first time they
say any of it aloud is the interview itself. The job market gives them few chances, so a bad
first answer is expensive.

Existing tools fail them in two ways. They let the candidate type, which trains the wrong
skill. And they ask generic questions rather than working from the candidate's own material,
so practice does not transfer to the interview where the candidate must talk about themselves.

The remaining problem is that most new graduates believe they have no stories worth telling.
Any product that starts by asking them to write their stories down loses them before it
begins.

**Repetition is the mechanism, not the risk.** Saying your own story many times over weeks
builds fluency the same way rehearsing a presentation does. The failure mode this product
guards against is not repetition itself, it is repeating someone else's words, an AI-drafted
answer that sounds rehearsed because it was never the speaker's material to begin with. The
rubric's structure and specificity dimensions exist to keep the content genuinely the user's
own; delivery pacing is a separate, later concern (see FR-42 and the Phase 2 pace guidance in
04-voice-and-evaluation.md).

**Retell is deliberately blind to language proficiency.** It practises interview delivery in
English and does not teach English. The rubric scores content only, relevance, structure,
specificity, never grammar, vocabulary or fluency, so a non-native speaker's content is judged
fairly. Where the product cannot separate a language limitation from a content weakness, notably
a low-confidence transcription, it says nothing rather than risk naming a fault that is not
there (FR-42).

## 2. Users and personas

### Primary: the final year student or new graduate

Zero to two years of experience. Applying broadly. Has a group project, a part time job,
possibly a society or an internship, and does not believe any of it counts. Has never said
their own examples out loud to another person.

Job to be done: "I get one shot at each of these, and I do not want to find out I cannot
answer a basic question while it is happening."

### Secondary, served incidentally, never designed for

- Non-native English speakers, for whom speaking is the actual bottleneck. See section 1: the
  product stays fair to their content and silent about their English, rather than either
  ignoring the risk or trying to coach a thing it cannot responsibly measure.
- Career switchers, who have stories but need to reframe them.

Design decisions are made for the primary persona. Where the secondary personas conflict with
the primary, the primary wins. Worked example: the 60 second recording cap (FR-18) is tighter
for someone composing in a second language; it stays fixed at 60 seconds because loosening it
for one persona would change the product's central constraint for everyone.

## 3. Positioning

Retell makes practising your own interview stories, spoken out loud, a five minute daily habit.

**Wedge:** your own stories, spoken out loud, five minutes a day. Speaking and short sessions
are both things a competitor could copy in a sprint; the story library is the only part that
compounds, because it is the only part a new entrant cannot have on day one.

**"Ready before you apply" is a bet, not a claim shown to users.** It assumes a student applying
broadly has a live reason to practise daily across a two to three month window. That is the
single largest assumption in the product, recorded as a risk in section 7, not asserted as fact.
User-facing copy stays inside what 07-design-system.md section 6 allows: never a promise, never
an outcome word.

**Churn is a success case.** A user who stops because they got hired is the product working, not
attrition to fight. Nothing in Retell should assume long tenure: no levels, no long-horizon
progression, no year view. FR-28's 14 day interval cap already reflects this instinct correctly.

**Moat:** none proven. Candidates are the accumulated story library, the recorded answer
history, and distribution through universities. Recorded as a risk in section 7 and reviewed
at the phase gate, not claimed as fact.

## 4. Functional requirements

Requirements are tagged with the phase in which they ship. FR numbers are contracts and are
never renumbered; a requirement's wording may still be amended as decisions are corrected.

### Onboarding and stories

- **FR-1** (P1): A new user reaches a live microphone within 45 seconds of landing, and
  finishes their first spoken answer within 150 seconds, without creating an account.
- **FR-2** (P1): Before the browser permission prompt, the user sees a full screen explaining
  that they will speak, that recordings are private, and that the first recording does not
  count.
- **FR-3** (P1): The first spoken act is reading one supplied sentence aloud as a microphone
  check. It is never evaluated, counted, or played back. It is transcribed internally against
  its known text, solely to measure transcription reliability; this never reaches the user and
  never contributes to a score.
- **FR-4** (P1): The user selects the setting their experience comes from (group project, job,
  society, something they built, internship, other) by tapping a tile. No typing.
- **FR-5** (P1): The first real question is neutral in tone and asks for a single concrete
  episode. It never names a competency.
- **FR-6** (P1/P2): No question shown to the user during onboarding or on a new pairing names a
  competency (leadership, teamwork, problem solving). Competencies are applied as labels after
  the answer. In Phase 2, a twist on an item the user has already answered well may use
  real-world competency phrasing, since a twist is the same angle under a harder constraint and
  a named competency is exactly that kind of constraint; this exception never applies to a
  user's first encounter with a story or angle, and never to an item currently graded `again` or
  `hard`.
- **FR-7** (P1): The user sees their feedback before being asked to create an account.
- **FR-8** (P1): An answer given before signup is retained for 24 hours against an anonymous
  session and claimed on signup. Unclaimed audio is deleted.
- **FR-9** (P1): An answer can be saved as a story. The story body is the user's own transcript.
  The system never generates story content.
- **FR-10** (P1): If an answer is under 15 seconds, it is not scored and not saved as a story.
  The user is offered an easier question from a fixed ladder and may answer again.
- **FR-11** (P1): Every question can be skipped. Skipping is always available and never
  discouraged. After three consecutive skips the session ends with what was produced.
- **FR-12** (P1): The user reaches five to seven stories through questions asked across the
  first five sessions. There is no story entry form in the onboarding path.
- **FR-13** (P2): Document import of existing written stories is available from the stories
  page. It never appears in the path of a new user.

### Recording and transcription

- **FR-14** (P1): Answers are recorded in the browser and uploaded as a file. The product does
  not use a real time voice agent.
- **FR-15** (P1): Every raw audio file is retained. Deletion is user initiated (FR-38); there is
  no user-facing download.
- **FR-16** (P1): Each answer is transcribed with word level timestamps.
- **FR-17** (P1): Duration, words per minute, longest pause, and filler count are computed from
  the audio and timestamps, not inferred by a language model. Per-word transcription confidence
  is captured and stored alongside them, for reliability calibration (FR-42).
- **FR-18** (P1): Recording has a 60 second countdown. A false start, stopped within the first
  10 seconds, may always be restarted at no cost. A redo after 10 seconds, restarting because
  the speaker wants a cleaner take rather than because the start was a fumble, is limited to one
  per answer. The user may stop early without losing the answer.

### Evaluation

- **FR-19** (P1): Each answer is scored 0 to 3 on three dimensions: relevance, structure,
  specificity. The response is schema enforced. The model receives only the question and the
  transcript, never duration, pace, filler count, or any prior score; a model told how an answer
  sounded scores its content differently for that reason alone.
- **FR-20** (P1): The evaluation record stores the model identifier and rubric version.
- **FR-21** (P1): Facts about an answer (transcript, timings, signals) are stored separately
  from judgements about it (scores, grade), so answers can be re-scored without re-recording.
- **FR-22** (P1): After each answer the user sees, in this order: their transcript with the
  situation, action and result parts highlighted; one gap phrased as a question; the question
  types this story now covers. Duration and pace are not shown (ADR-016). They are still
  computed and stored under FR-17.
- **FR-23** (P1): No numeric score is shown to the user in Phase 1. Scores are stored from day
  one for calibration.
- **FR-24** (P1): Feedback never states that an answer is wrong. It names one specific thing to
  do differently.
- **FR-25** (P1): No recording is played back to the user during their first four sessions.

### Repetition and sessions

- **FR-26** (P2): An item is a pairing of one story with one question angle. Items are created
  when a pairing is first attempted, not generated in advance.
- **FR-27** (P2): Each evaluated answer produces one grade (again, hard, good, easy) derived in
  application code from the three rubric scores and the duration, not requested from the model.
- **FR-28** (P2): Each item has a next due date. Intervals step 1, 2, 4, 7, 14 days and never
  exceed 14 days. An overdue item is simply due; lateness is never penalised and no backlog
  count is ever shown.
- **FR-29** (P2): A Phase 2 session contains three answers: one item that is due, one twist on
  an item currently graded good or easy, and one new pairing. Shortfalls (nothing eligible for a
  slot) are backfilled with new pairings.
- **FR-30** (P2): A twist question asks the same angle under a harder constraint and is linked
  to the plain question it twists.
- **FR-31** (P1/P2): Before starting an answer, the user chooses one of three states: cold
  (question only, story text appears afterwards beside the transcript), peek (ten seconds of the
  story text, then it disappears and recording starts), or assisted (text stays up throughout).
  Peek and assisted are flagged `assisted`; the answer is transcribed, scored, and given full
  feedback normally. In Phase 2, an `assisted` attempt never changes an item's schedule.
- **FR-32** (P2): The user can see a grid of their stories against question angles showing
  which pairings are strong, weak, or untried.
- **FR-33** (P2): The product has a daily streak and an optional daily reminder.

### Platform, cost and privacy

- **FR-34** (P1): Phase 1 supports Chrome and Chromium browsers only. Other browsers see a
  message explaining this.
- **FR-35** (P1): Users detected inside an in-app browser see an instruction to open the link
  in Chrome.
- **FR-36** (P1): A user may complete one session per day, hard stop. Anonymous users are
  metered by session, with IP address used only as a coarse ceiling, not the primary limit, and
  Turnstile is required before the first anonymous answer.
- **FR-37** (P1): A global daily spend threshold and a per-hour spend ceiling both stop new
  sessions being accepted.
- **FR-38** (P1): A user can delete any recording, and can delete their account and all
  associated audio and transcripts. Deletion removes the storage object first, then the account
  row, so that a partial failure never leaves an orphaned recording pointed at by nothing.
- **FR-39** (P1): Recordings are never used to improve or train any model unless the user
  explicitly opts in via account settings, default off. Recordings are never made visible to any
  other user.
- **FR-40** (P1): The daily session and the user's own stories and recordings are never
  paywalled.
- **FR-41** (P1): An answer whose audio has uploaded is never lost. If transcription or
  evaluation fails, the user is told plainly and the answer is retried, never discarded and
  never shown as an error.
- **FR-42** (P1): When transcription confidence is low, the transcript is still shown but the
  gap question is omitted, the user is told plainly that part of the answer did not come through
  clearly, and one re-record is offered for that answer. Both attempts are kept. The product
  never names a weakness it might have mis-heard.
- **FR-43** (P1): A Phase 1 session contains three answers.
- **FR-44** (P1): On return after a long absence, an optional one-tap prompt may ask why the
  user stopped. Dismissable, never a retention save attempt, never framed as loss.

## 5. Non-goals

- **Mock interviews.** Retell is a drill, not a conversation. No AI interviewer talks back and
  no follow up questions are improvised. Conversation costs roughly ten times as much, adds
  latency, and is not the thing being trained.
- **Typed answers.** Every answer is spoken. In an interview you have to say it out loud, so
  that is what Retell practises. There is no typing path and typing is never offered as an
  alternative, including as a way to skip a session (FR-11 already provides skipping).
- **Technical interview preparation.** Different problem, different product.
- **Writing stories for the user.** The system elicits, structures and labels. It never
  generates content. Invented achievements become lies repeated in a real interview.
- **Outcome claims.** Retell never states or implies that it will get anyone hired or that they
  will pass an interview.
- **Public or shared recordings.** No feed, no browsing other users' answers.
- **Scraped or leaked real company interview questions.**
- **Guilt mechanics.** Streaks and reminders are permitted. Shame, loss framing and fake
  urgency are not.
- **Praise inflation.** Warmth is required everywhere, but praise the work does not support is
  not warmth. Generic encouragement teaches the user that nothing on the screen means anything.
  Voice and tone are owned by 07-design-system.md section 6.
- **Device fingerprinting.** No covert device identification of anonymous visitors. Collides
  with the product's own privacy promises in 06-data-and-privacy.md; abuse defence uses
  Turnstile and server-side rate limiting instead (FR-36, FR-37).
- **Fine-tuning on user recordings.** Ruled out permanently, not just pending an opt-in. A
  fine-tuned model cannot be un-trained, so it is incompatible with "delete means delete"
  (FR-38) the moment a deleted user's data was ever used this way.
- **Analytics and marketing cookies.** No event tracking beyond what a person directly observes.
  Keeps the product out of consent-banner territory; any future analytics tooling reopens that
  question and should be weighed against this cost, not added by default.
- **iPhone support, payment, and sharing** are deferred to Phase 3 and are out of scope for
  Phase 1 and Phase 2.

## 6. Success metrics

Phase 1 is not expected to reach real users (section 8, and see the delivery plan's engineering
definition of done). Its gate is therefore engineering, not behavioural.

### Phase 1 gate

| Metric | Working means |
| --- | --- |
| Rubric agreement against a self-labelled gold set | Measured against ~20 answers Deshan labels himself, held-out split, exact and within-one agreement against a majority-class baseline |
| Model self-consistency | Identical input returns identical scores across repeated runs |
| Cost per session | Measured, not estimated |
| Full flow on a real phone | Record, upload, transcribe, evaluate, feedback working end to end in Chrome |
| Deletion | Deleting a recording removes the storage object and the row, proven by a test |

### Diagnostics, not gates

Observed informally by Deshan and anyone he shares the product with directly, not measured
against a recruited cohort (the cohort test itself is cut, section 7). No pass/fail threshold;
useful signal about whether the design reasoning in 04-voice-and-evaluation.md is holding up.

| Signal | What it would suggest |
| --- | --- |
| Reaches a live microphone quickly | The permission flow and copy are not the barrier |
| A first spoken answer with a first person action verb, 40 seconds or more | The mic check and first question work as intended |
| Five to seven stories accumulate by session five | Elicitation is working |

Phase 2's gate is the scheduling logic in 05-spaced-repetition.md working correctly against
simulated histories, for the same reason: no cohort to measure it against.

## 7. Risks

| Risk | Severity | Response |
| --- | --- | --- |
| Users grant the microphone but freeze on the first open ended question, producing no usable story | High | Accepted, unmeasured (the cohort test is cut, see the delivery plan). Mitigated by design instead: the easier-question ladder in 04-voice-and-evaluation.md section 5 exists specifically for this, and its step 2 (describing a place) is chosen because almost nobody fails it |
| No moat. Users leave in about eight weeks and nothing accumulates that a competitor could not rebuild | High | Accepted and recorded. Revisited at the phase gate. Distribution is the fallback, which conflicts with the Chrome only decision |
| Chrome only makes the product unshareable, since most student to student links open on iPhone | High | Accepted for Phase 1. Revisit trigger: the moment anyone outside a recruited test group is expected to use it |
| Evaluation quality is the product, and a weak rubric produces confident nonsense | High | Rubric limited to three observable dimensions. Built and tuned on a strong model before any cost optimisation. Checked against a self-labelled gold set (section 6) rather than assumed |
| Speaking out loud cannot be done in public, so the daily habit fails in a way tapping does not | Medium | Accepted, unmeasured. No mitigation planned |
| Per user cost on a free product | Medium | Hard spend caps, one session per user per day, global kill switch. Costs pennies per session at Phase 1 scale |
| Interview preparation is episodic, so retention has a structural ceiling | Medium | Accepted. Monetisation shape deferred until the ceiling is measured. Churn from getting hired is treated as success, not attrition (section 3) |
| Transcription that removes filler words removes a delivery signal | Low | Deepgram with filler words enabled. Raw audio retained so any history can be re-transcribed |
| A mis-transcribed answer produces feedback naming a weakness the user does not have | Medium | Per-word confidence stored and gated (FR-17, FR-42); low confidence suppresses the gap rather than showing it |
| Deliberate cost abuse: repeated or automated requests spend the daily budget for free | Medium | Turnstile, session-based rate limiting with IP as a coarse ceiling only, and a per-hour spend ceiling alongside the daily one (FR-36, FR-37) |
| Scope creep: learning goals unrelated to the product (agent frameworks, RAG, fine-tuning) land in a build whose non-goals rule them out | Medium | The non-goals list in section 5 is the enforcement mechanism. ML work stays scoped to evaluation calibration and LLMOps, the parts of the curriculum that genuinely serve this product |
| The project stalls indefinitely with no external signal to stop | Low | Committed to finishing. The response is a hard stop date on Phase 1 polishing in the delivery plan, not a metric, since no cohort exists to force one |

## 8. Open questions

- TBD: eventual monetisation shape. Leans toward paid depth over paid volume, since FR-40 rules
  out paywalling the daily session or a user's own stories and recordings, which is most of what
  a volume-based paywall would gate. Decided at the Phase 2 gate. This is the only genuinely
  undecided product question.
- Whether a second attempt on the same answer (FR-9's "have another go") replaces the first
  attempt or the first stands, when an item is graded. Founder authored, not needed before
  Phase 2 (04-voice-and-evaluation.md section 4.2).
- Whether a user can play back their own recordings after their first four sessions (FR-25),
  now that FR-15 no longer offers download as the way to hear them back.

Several decisions are provisional by design, with a stated revisit point rather than an open
marker, corrected against real use rather than argued about now:

| Decision | Revisit trigger |
| --- | --- |
| Grade thresholds (05-spaced-repetition.md section 2) | The first real cohort's answers, if one exists |
| Rubric agreement bar (section 6) | The first gold-set run |
| Transcription confidence threshold (FR-42) | Once the confidence distribution is known |
| Redo cap at one, false start boundary at 10 seconds (FR-18) | If either turns out to be hit constantly in normal use |
