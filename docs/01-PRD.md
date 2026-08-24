# 01: Product Requirements Document

Product: Retell
Status: Draft for approval
Phase: 1
Owner: Deshan Ekanayaka (engineer of record)
Version: 0.1
Date: 2026-08-22

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

## 2. Users and personas

### Primary: the final year student or new graduate

Zero to two years of experience. Applying broadly. Has a group project, a part time job,
possibly a society or an internship, and does not believe any of it counts. Has never said
their own examples out loud to another person.

Job to be done: "I get one shot at each of these, and I do not want to find out I cannot
answer a basic question while it is happening."

### Secondary, served incidentally, never designed for

- Non-native English speakers, for whom speaking is the actual bottleneck.
- Career switchers, who have stories but need to reframe them.

Design decisions are made for the primary persona. Where the secondary personas conflict with
the primary, the primary wins.

## 3. Positioning

Everyone else gives you a mock interview once you already have one booked. Retell makes
interview practice a five minute daily habit, spoken out loud, so you are ready before you
apply.

**Wedge:** five minutes, spoken out loud, on your own stories.

**Moat:** none proven. Candidates are the accumulated story library, the recorded answer
history, and distribution through universities. Recorded as a risk in section 7 and reviewed
at the phase gate, not claimed as fact.

## 4. Functional requirements

Requirements are tagged with the phase in which they ship. FR numbers are contracts and are
never renumbered.

### Onboarding and stories

- **FR-1** (P1): A new user reaches a live microphone within 45 seconds of landing, and
  finishes their first spoken answer within 150 seconds, without creating an account.
- **FR-2** (P1): Before the browser permission prompt, the user sees a full screen explaining
  that they will speak, that recordings are private, and that the first recording does not
  count.
- **FR-3** (P1): The first spoken act is reading one supplied sentence aloud as a microphone
  check. It is never transcribed, evaluated, counted, or played back.
- **FR-4** (P1): The user selects the setting their experience comes from (group project, job,
  society, something they built, internship, other) by tapping a tile. No typing.
- **FR-5** (P1): The first real question is neutral in tone and asks for a single concrete
  episode. It never names a competency.
- **FR-6** (P1): No question shown to the user anywhere in the product names a competency
  (leadership, teamwork, problem solving). Competencies are applied as labels after the answer.
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
- **FR-15** (P1): Every raw audio file is retained and is downloadable by the user who made it.
- **FR-16** (P1): Each answer is transcribed with word level timestamps.
- **FR-17** (P1): Duration, words per minute, and longest pause are computed from the audio and
  timestamps, not inferred by a language model.
- **FR-18** (P1): Recording has a 60 second countdown. The user may restart before submitting
  at no cost, and may stop early without losing the answer.

### Evaluation

- **FR-19** (P1): Each answer is scored 0 to 3 on three dimensions: relevance, structure,
  specificity. The response is schema enforced.
- **FR-20** (P1): The evaluation record stores the model identifier and rubric version.
- **FR-21** (P1): Facts about an answer (transcript, timings, signals) are stored separately
  from judgements about it (scores, grade), so answers can be re-scored without re-recording.
- **FR-22** (P1): After each answer the user sees, in this order: their transcript with the
  situation, action and result parts highlighted; one gap phrased as a question; duration and
  pace as plain facts; the question types this story now covers.
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
  exceed 14 days.
- **FR-29** (P2): A session contains five answers: three items that are due, one twist on an
  item currently graded good or easy, and one new pairing. Shortfalls are backfilled with new
  pairings.
- **FR-30** (P2): A twist question asks the same angle under a harder constraint and is linked
  to the plain question it twists.
- **FR-31** (P1): The user may reveal a story's text before or during an answer. Any answer
  given with the text visible is flagged assisted, is evaluated normally, and never changes an
  item's schedule.
- **FR-32** (P2): The user can see a grid of their stories against question angles showing
  which pairings are strong, weak, or untried.
- **FR-33** (P2): The product has a daily streak and an optional daily reminder.

### Platform, cost and privacy

- **FR-34** (P1): Phase 1 supports Chrome and Chromium browsers only. Other browsers see a
  message explaining this.
- **FR-35** (P1): Users detected inside an in-app browser see an instruction to open the link
  in Chrome.
- **FR-36** (P1): A user may complete one session per day. Anonymous users are limited to one
  answer per IP per day.
- **FR-37** (P1): A global daily spend threshold stops new sessions being accepted.
- **FR-38** (P1): A user can delete any recording, and can delete their account and all
  associated audio and transcripts.
- **FR-39** (P1): Recordings are never used for model training without explicit opt in, and are
  never made visible to any other user.
- **FR-40** (P1): The daily session and the user's own stories and recordings are never
  paywalled.

## 5. Non-goals

- **Mock interviews.** Retell is a drill, not a conversation. No AI interviewer talks back and
  no follow up questions are improvised. Conversation costs roughly ten times as much, adds
  latency, and is not the thing being trained.
- **Typed answers.** Text is a way to skip a session, never a way to complete one. Typing
  trains the wrong skill.
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
- **iPhone support, payment, and sharing** are deferred to Phase 3 and are out of scope for
  Phase 1 and Phase 2.

## 6. Success metrics

Phase 1 has no revenue, so behaviour is the only signal.

| Metric | Working means | Reviewed |
| --- | --- | --- |
| Reaches a live microphone | 60 percent of landing visitors | Phase 1 gate |
| Completes a first spoken answer of 40 seconds or more containing a first person action verb | 40 percent of those who reach the microphone | Phase 1 gate |
| Returns on day 4 | 25 percent of users who completed session 1 | Phase 1 gate |
| Returns on day 14 | 10 percent of users who completed session 1 | Phase 2 gate |
| Reaches five stories by session 5 | 50 percent of users who reach session 5 | Phase 1 gate |
| Session completion, all five answers | 70 percent of started sessions | Phase 2 gate |

These thresholds are accepted as targets. They are estimates with no baseline behind them, and
are corrected after the first cohort test described in section 7.

## 7. Risks

| Risk | Severity | Response |
| --- | --- | --- |
| Users grant the microphone but freeze on the first open ended question, producing no usable story | High | Two arm test with 40 to 60 recruited students before building the full pipeline. Measured on answers over 40 seconds containing a first person action verb, not on completion rate |
| No moat. Users leave in about eight weeks and nothing accumulates that a competitor could not rebuild | High | Accepted and recorded. Revisited at the phase gate. Distribution is the fallback, which conflicts with the Chrome only decision |
| Chrome only makes the product unshareable, since most student to student links open on iPhone | High | Accepted for Phase 1. Revisit trigger: the moment anyone outside a recruited test group is expected to use it |
| Evaluation quality is the product, and a weak rubric produces confident nonsense | High | Rubric limited to three observable dimensions. Built and tuned on a strong model before any cost optimisation |
| Speaking out loud cannot be done in public, so the daily habit fails in a way tapping does not | Medium | Accepted. Watched through day 4 and day 14 return rates. No mitigation planned |
| Per user cost on a free product | Medium | Hard spend caps, one session per user per day, global kill switch. Costs pennies per session at Phase 1 scale |
| Interview preparation is episodic, so retention has a structural ceiling | Medium | Accepted. Monetisation shape deferred until the ceiling is measured |
| Transcription that removes filler words removes a delivery signal | Low | Deepgram with filler words enabled. Raw audio retained so any history can be re-transcribed |

## 8. Open questions

- TBD: eventual monetisation shape, free habit with paid depth or a fixed length season pass.
  Decided at the Phase 2 gate. This is the only genuinely undecided product question.

Everything else previously marked open has been decided. Two of those decisions are provisional
by design and have a written revisit point rather than an open marker: the grade thresholds
(05-spaced-repetition.md section 2) and the success metric targets in section 6, both corrected
against the first cohort's real answers.
