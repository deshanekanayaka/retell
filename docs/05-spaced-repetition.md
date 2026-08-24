# 05: Spaced Repetition

Product: Retell
Status: Draft for approval
Owner: Deshan Ekanayaka (engineer of record)
Version: 0.1

Owns the decisions about what gets repeated, how an attempt is graded, when it comes back, and
what a session contains. Implements FR-26 to FR-33 of 01-PRD.md. Everything here is Phase 2
except FR-31, which ships in Phase 1.

## 1. What gets repeated

**An item is one story paired with one question angle** (FR-26).

Your dashboard story asked as a conflict question is one item. The same story asked as a
failure question is a different item with its own history.

Rejected: **the question as the item.** The user answers with the same story every time, gets
fluent at that one pairing, and never discovers the other stories they could have used.

Rejected: **the story as the item.** A story can be strong for one angle and useless for
another. One schedule per story averages over the distinction that matters.

The pairing model matches how interviews actually go wrong. A student is not bad at stories in
general. They are bad at reframing one story for an angle they did not expect. That is also why
a twist question is not a gimmick here: a twist is simply a new angle on a story the user
thought was covered.

### 1.1 Angles

An angle is what a question is really asking. Angle slugs for v1:

`conflict`, `failure`, `initiative`, `teamwork`, `leadership`, `pressure`, `ambiguity`,
`persuasion`, `learning`

**Angle slugs are a contract.** Adding one is fine. Renaming one invalidates every item that
points at it, so a rename needs an ADR and a migration.

Angles are never shown to the user as a question. No question text contains the word
leadership, teamwork or problem solving (FR-6). Angles appear only as labels after an answer,
where they read as something the user earned rather than something they must self assess.

### 1.2 Items are created lazily

Seven stories across nine angles is 63 possible pairings, which is far more than a five minute
daily session can ever cover. Items are therefore created when a pairing is first attempted,
not generated in advance (FR-26). The item table grows to describe what the user has actually
done.

## 2. Grading

**The model returns three scores. The grade is derived in application code** (FR-27).

```
relevance <= 1                        -> again
duration_ms < 25000                   -> again
structure <= 1 or specificity <= 1    -> hard
all three >= 2                        -> good
all three == 3 and 45s <= duration <= 90s -> easy
```

Evaluated in that order; the first match wins.

**Why in code, not in the prompt.** It is deterministic, it can be tuned without touching a
prompt, it can be replayed over every historical attempt when a threshold changes, and it is
auditable. Asking a model to output a grade makes the scheduler depend on model mood.

**Relevance is a gate, deliberately.** A well structured, specific answer to the wrong question
is a fail, because in a real interview it is. This one rule is what gives twist questions their
force.

**The 25 second floor** catches the answer that was never really attempted. It is a fact about
the audio, not a judgement, which is why it sits alongside relevance rather than inside the
rubric.

**Founder authored, accepted as v1.** The thresholds above are a starting position, not a
finding. They are checked against the first real cohort's answers and adjusted if wrong, with
the change recorded as an ADR and the rubric version incremented.

### 2.1 Assisted attempts

An answer given with the story text visible is flagged `assisted` (FR-31). It is transcribed,
scored and given full feedback, and **it never changes an item's schedule.**

Three states, chosen by the user before they start:

| State | Behaviour |
| --- | --- |
| Cold, the default | Question only. Story text appears afterwards, beside the transcript |
| Peek | Ten seconds of the story text, then it disappears and recording starts. Flagged assisted |
| Assisted | Text stays up throughout. Flagged assisted |

Assisted is freely available and never nagged about. A student on day three who cannot remember
their own story needs the text, and removing the crutch makes them close the app. It simply
does not count as a repetition, because a graded reading exercise would feed the scheduler a
number that reflects nothing.

## 3. Scheduling

A fixed interval ladder (FR-28).

```
again -> returns later in the same session
hard  -> 1 day
good  -> next step up the ladder: 1, 2, 4, 7, 14
easy  -> skips one step up the ladder
```

**Maximum interval is 14 days, and the cap is the important part.** General spaced repetition
pushes intervals to months because it optimises for recall years later. A Retell user is job
hunting for about eight weeks. An item scheduled 45 days out never returns. The cap is not a
limitation, it is the correct setting for the real horizon.

Rejected: **FSRS.** It is better than a fixed ladder when there are thousands of reviews per
user to learn from. Retell will have tens. It would be sophistication with nothing to feed it.

Revisit trigger: more than about 50 reviews per active user.

### 3.1 State per item

One `review` row per item: `due_at`, `interval_days`, `reps`, `lapses`, `last_grade`,
`last_attempt_at`.

An `again` increments `lapses` and returns the item to the end of the current session's queue.
It does not reset the ladder to zero; it drops one step. Resetting to zero punishes a single bad
day disproportionately in a product whose whole premise is showing up daily.

## 4. Session composition

Five answers (FR-29):

| Slot | Contents |
| --- | --- |
| 1 to 3 | Items that are due, oldest due first |
| 4 | A twist, on an item currently graded `good` or `easy` |
| 5 | A new pairing, never attempted |

Shortfalls are backfilled with new pairings. Early on almost every session is new pairings,
which is correct: the first two weeks are for discovering which stories cover which angles.

**Slot 4 attacks strength, not weakness.** Twisting an item the user is already failing teaches
them nothing except that they are failing. Twisting one they think they have mastered is where
the learning is.

**Slot 5 is how the item table grows.** Choose a pairing from a story with few items and an
angle the user has thin coverage of, so the grid fills in rather than clustering.

## 5. Twist questions

A twist asks the same angle under a harder constraint, and is linked to the plain question it
twists (FR-30).

| Angle | Plain | Twist |
| --- | --- | --- |
| conflict | Tell me about a disagreement with someone on your team | Tell me about a disagreement where you turned out to be the one in the wrong |
| failure | Tell me about something that did not go to plan | Tell me about something that did not go to plan and was your fault |
| initiative | Tell me about something you started | Tell me about something you started that nobody thanked you for |
| teamwork | Tell me about working with someone difficult | Tell me about being the difficult one |

The pattern: remove the escape route that lets the answer flatter the speaker. A memorised
answer collapses under a twist, which is the point.

Twists count as the same item as their plain question, because the angle and the story are the
same. That is the whole reason `item` points at an angle rather than a question
(02-system-architecture.md section 3.4).

## 6. The grid

Stories down one side, angles across the top, each cell showing strong, weak, or untried
(FR-32).

This is the only screen in the product that shows a user their whole position at once, and it
is the most likely thing they will screenshot or show a careers adviser. It is also the clearest
statement of what Retell is for: not "you scored 72", but "you have nothing for ambiguity".

Cell states derive from the item's last grade: `good` or `easy` is strong, `hard` or `again` is
weak, no item is untried.

## 7. Habit layer

Streak and one optional daily reminder (FR-33).

Rules, from the boundaries in 01-PRD.md section 5:

- No guilt, no loss framing, no fake urgency, no shaming a missed day.
- A streak may be lost quietly. It is never used as a threat.
- One reminder, at a time the user chooses, switchable off in one tap.
- Nothing about the streak appears before the user has completed a second session. It is
  revealed when it means something, not announced on day one.

### 7.2 What the habit layer runs on

Duolingo's streak works through loss aversion. Their retention team says so directly: the jump
between day one and day seven is loss aversion arriving, and most of their published findings
sit downstream of it.

01-PRD.md section 5 rules that out. So Retell runs on approach rather than avoidance: the user
returns because returning is worth something, not because stopping costs something.

That fits this user better than the alternative would. The primary persona's actual problem
(01-PRD.md section 2) is believing that none of their experience counts. A product that proves
them wrong week by week is pushing on the thing that is stopping them. A product that threatens
them with a broken streak is not.

**The test for anything added to this layer:** does it work by making stopping feel bad, or by
making returning feel worth it? If it is the first, it does not ship.

**Taken from Duolingo, none of it dependent on loss:**

- **Protect the unit of use.** They gained nothing by lowering the streak requirement to a single
  exercise, and captured only their least engaged users. Ours is one spoken answer and never
  becomes less than that.
- **Intentional commitment beats a Continue button**, and being allowed to decline is part of what
  makes the choice real. Their opt-out button was almost as large a win as the easier goal it sat
  next to.
- **Never pre-select the harder option.** They pre-selected a tougher goal to speed users through
  and lost significantly. No pre-ticked reminder, no default goal, no pre-selected anything.
- **The early window is where retention is won.** For us that is day 4. Design and copy effort
  belongs in sessions one to four.

**Banned, and written down before the phase gate makes them tempting:**

- Loss framing of any kind. No "don't lose your streak", no "your streak is at risk", no
  countdown to losing something.
- Guilt or shame for a missed day. No "we missed you", no sad mascot, no day counter since last
  visit.
- Fake urgency. No expiring offers, no artificial deadlines, no red timers.
- Variable or unpredictable rewards. No chests, no surprise bonuses, nothing borrowed from slot
  machines.
- Social comparison. No leaderboards, no percentiles, no ranking against other users. This also
  collides with the privacy promise in 06-data-and-privacy.md.
- The streak as identity. It may exist and may be lost quietly. It is never framed as who the
  user is.
- Notification copy referencing anything the user stands to lose.

### 7.3 The commitment moment

At the end of session one only, one screen asking when they will do tomorrow's session. Three or
four time choices and a visible decline. Choosing sets the reminder time. Declining means no
reminder and no second ask, ever.

The mechanism is implementation intention: making the next occasion concrete. It works by
specifying the opportunity, not by making the alternative painful, which is why it passes the
test in 7.2 when a streak warning does not.

Rules:

- It appears after the first feedback screen, never before. FR-1 puts a clock on reaching a
  microphone and nothing may be inserted ahead of that.
- The decline is the same size and weight as the choices (7.2, on pre-selection).
- Nothing is pre-selected.
- The copy stays a preference and never becomes an agreement. "When suits you tomorrow" is a
  preference. "Promise you'll come back" is not.
- Asked once in the product's lifetime.

**Open, and blocking implementation, not the design.** FR-33 places the daily reminder in Phase 2,
so a Phase 1 commitment screen would set a reminder time that nothing sends. Three ways out:
ship this screen in Phase 2 alongside the reminder; ship it in Phase 1 as a stated intention with
no notification behind it; or move the reminder to Phase 1, which is an FR change and Deshan's
decision. Until that is settled this section describes the design, not a scheduled build.

### 7.1 The session end message

Ships in Phase 1 with the session screen (S6), ahead of the rest of this section.

One line at the end of every session, under "Done for today." It is the counterpart to point 4
of 04-voice-and-evaluation.md section 4: the place where a student who believes they have no
experience is shown, in facts, that they have some.

**It is evidence, never a compliment.** Every line is built from what actually happened in the
session: answers given, stories now held, angles now covered, days practised, answers completed
without stopping. A rotating bank of fixed encouragements is the failure mode. "Great work
today" is empty, students detect it immediately, and it teaches them that nothing on the screen
means anything.

Rules:

- Derived from session facts. The only fixed lines are the first session, where there is nothing
  yet to count, and a session that produced almost nothing.
- Never an outcome claim. Nothing about interviews going well, being ready, or getting hired.
- Never a comparison with other users.
- No exclamation marks. Never "amazing", "great job", "well done".
- One line, no reward object. No badge, no points, no unlockable, no animation.
- A weak session still gets a true line. Never silence, and never praise that the session does
  not support.

This is not the evaluation tone rule in 04 section 3.4 and does not conflict with it. That rule
governs the feedback screen, where praise makes the gap question unbelievable. Session end is a
different screen with a different job.
