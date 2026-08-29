# Docs review, decisions log

Working file from the docs walkthrough started 2026-08-27. Not a spec and not authoritative.
These are agreed changes waiting to be written into `docs/` and ADRs in one pass. Delete this
file once that pass is done.

## Product framing

1. Naturalness comes from repetition on your own material, not from avoiding repetition. The
   "memorised script" problem is about whose words they are, not how often they were said.
2. Retell practises interview delivery in English and does not teach English. Deliberately
   blind to language proficiency. Non-native speakers get a fair content evaluation, never a
   diagnosis of their English. ADR-level.
3. Positioning drops the competitor claim. Say what Retell is, not what others are not.
4. Wedge reorders to lead with "your own stories", which is the only part that compounds.
5. Landing page browser line reworded. Done in `app/page.tsx`.
6. "So you are ready before you apply" stays out of user-facing copy.
7. Churn is a success case. A user leaving because they got hired is the product working.
8. Monetisation leans paid depth over paid volume. Charging for volume monetises cramming,
   which is the behaviour the product exists to replace. FR-40 is the guardrail. Still open,
   decided at the Phase 2 gate.

## Phase 1 shape

9. Path B. The cohort test probably does not happen. `docs/03` gates become conditional, and
   Phase 1 gains an engineering definition of done reachable alone. Needs a hard stop date.
10. Phase 1 session is three answers. FR-29's five is a Phase 2 number.
11. FR-36 stands. One session per day, hard stop, warm copy.
12. Extra practice arrives in Phase 2, flagged, never affects the schedule.
13. Exit reason capture in Phase 1. One tap, dismissable, on return after absence. Never a
    retention save attempt.

## Voice and evaluation

14. Pace surfaces in Phase 2 only past a threshold, phrased as "that came out fast, try it
    again slower". Never a number. Thresholds are relative to the user's own rolling baseline,
    never a population norm.
15. Restarts split: a false start under ten seconds is free and unlimited, a redo after ten
    seconds is capped at one.
16. FR-3 amended. The mic check is transcribed internally against its known sentence, solely to
    measure transcription reliability. Never evaluated, counted or played back.
17. The transcript is a fact with a stated reliability. Retell never names a weakness it might
    have mis-heard.
18. Store Deepgram per-word confidence from Phase 1. Gate on it once the distribution is known.
19. Low confidence behaviour: plain message that it did not come through clearly, no gap
    sentence, one optional re-record per answer, both attempts kept.
20. New Phase 1 FR for the failure path. An answer whose audio uploaded is never lost. On
    transcription or evaluation failure the user is told plainly and it is retried, never
    discarded.
21. Remove audio download. FR-15 becomes retention-only. Data requests handled manually via the
    privacy contact.
22. FR-15 and FR-25 no longer contradict as a result.

## Evaluation and the rubric

23. Phase 1 evaluation ships as specified, reframed: its job is producing the labelled dataset
    that makes the rubric provably good. That becomes part of the engineering definition of
    done owed to `docs/03`.
24. Gold set is roughly 20 answers recorded by Deshan with deliberately varied quality,
    self-labelled before seeing model output, committed as JSON, measured in CI without gating
    at first. Quadratic weighted kappa is the metric. If transcripts are ever authored with
    model help, draft with a different provider than the one judging.
25. Transcript highlighting uses sentence index ranges. Schema gains `parts` with nullable
    `{start, end}` per part. Requires `punctuate=true` on Deepgram and deterministic sentence
    segmentation in code.
26. `angles` becomes a constrained enum of the fixed slug list, not free strings.
27. `gap` gets validated: length cap, must be a question, checked for supplied detail rather
    than trusted to the prompt. It is the one unconstrained field and the one that can break
    ADR-009.
28. Temperature 0, prompt version stored alongside `rubric_version`.

## Repetition

29. Phase 2 session is three answers: one due, one twist, one new.
30. Overdue items are simply due. Lateness is never penalised and the backlog is never
    displayed. Keeps the 1, 2, 4, 7, 14 ladder.
31. FR-31 splits into a Phase 1 flag with the three states from `docs/05` section 2.1, and a
    Phase 2 schedule rule. FR-31's "before or during an answer" wording is wrong and yields to
    `docs/05`, where the state is chosen before recording starts.

## Security, abuse and privacy

32. Abuse defences, in order: bucket `file_size_limit` and `allowed_mime_types`, Turnstile
    before the first anonymous answer verified server side, server-side rate limiting by
    session with IP as a coarse ceiling, and a per-hour global spend ceiling alongside FR-37's
    daily one.
33. No device fingerprinting. No weighted risk score until real abuse gives it labels. Log the
    signals now, score later.
34. Disposable email domain blocklist at signup. Free list, no vendor, low expectations.
35. Hardening defects logged in `context/tasks.md`, blocking S3.
36. Two module-scope rules go into `context/coding-standards.md`: never hoist a client, user id
    or request-scoped value to module scope; identity is derived from the session and never
    accepted from the request.
37. Storage deletion gets its own requirement and its own test. Rows cascade, storage objects
    do not.
38. Data export parked, blocking real users rather than blocking a step.
39. Security and privacy copy: promise what you control, disclose what you do not, no absolutes
    that cannot be verified. Permission screen becomes "No other user ever hears them".
40. Training tiers. Aggregate statistics need no opt-in. Any use of a user's transcript or
    audio as an example, gold sets included, requires opt-in. Never shared, sold, or sent to a
    provider that trains on inputs.
41. FR-39 kept as written. `training_opt_in boolean not null default false` lands with accounts
    in S4. The corpus stays a query, never a copy, so deletion keeps working.
42. Noted as fact rather than decision: fine-tuning on user data cannot be undone by deletion.

## Architecture (docs/02)

43. Signals never reach the judgement service. The pipeline is now: question and transcript in,
    scores and gap and angles and parts out. `SIG --> SC` deleted from the data-flow diagram,
    `SIG --> G` kept, the grade uses duration in code.
44. The server derives the caller's id from the verified session and rejects any storage path
    that doesn't match it. Never trusts a client-supplied path. Stated as a rule in docs/02, not
    just fixed in one route.
45. The answer pipeline gets a status field and becomes resumable: uploaded, transcribed,
    evaluated, each step a no-op if already done. Closes the replay hole and gives failure a
    place to live. No queue, no worker.
46. New reusable method for architecture work, written to context/architecture-method.md: list
    components, isolate each one's in/out/must-never, connect one arrow at a time, then check
    every "must never" shows up as an arrow or a deliberate absence of one.
47. The seven components of the answer pipeline, each with a stated boundary: Browser, Object
    storage, Transcription service, Judgement service, Auth layer, Orchestrator, Store. This
    supersedes docs/02 section 3.2's sequence diagram.
48. One numeric feedback-latency target needs to be set, since section 5's queue trigger
    ("when p95 exceeds the feedback target") currently names no target.
49. Anonymous rate limiting moves from IP-only to session-based with IP as a coarse ceiling,
    plus Turnstile before the first anonymous answer, plus a per-hour spend ceiling alongside
    the daily one.

## Delivery plan (docs/03)

50. The question bank becomes its own step, sequenced before or alongside S3. S3 cannot score
    `relevance` without a question to evaluate against.
51. Phase 1's gate becomes the engineering definition of done from decision 9, not day 4 return.
    Every kill criterion in section 8 either gets a conditional wrapper ("if a cohort exists")
    or a checkable replacement.
52. The validation track (two-arm mic check test) is cut entirely, along with the cohort test.
    No measurement of the mic check's effect in Phase 1; it ships on the design reasoning in
    docs/04 alone.
53. Definition of done, point 3, is reworded around deployment to friends as the trigger for
    real-phone testing, replacing the cohort-recruitment trigger.

## Spaced repetition (docs/05)

54. Grade formula keeps its ordered-gate shape, not a weighted average. Relevance below 2 stays
    a hard veto regardless of other scores, and a specificity failure (generic, "we" throughout)
    is correctly diagnosed as more urgent than an incomplete-but-specific answer, matching the
    specificity ladder in docs/04.
55. The `easy` duration upper bound (90s) is unreachable under FR-18's 60 second cap. Needs
    fixing once the reachable range is confirmed; not yet resolved.
56. An `again` resets an item's interval to the first step, not one step down. Reverses the
    reasoning currently written in docs/05 ("resetting to zero punishes a single bad day
    disproportionately"), so that reasoning needs to be replaced, not just the number.
57. Due items are ordered weakest-first, not oldest-due-first. Implemented without any
    decaying-strength estimation: sort by `last_grade` severity (hard, then good, then easy),
    then by `interval_days` ascending as a tiebreak. Both fields already exist on `review`.

58. A twist slot with no eligible strong item (nothing graded good or easy) is a shortfall,
    backfilled with a new pairing, per the existing backfill rule in section 4. Never twist a
    currently-weak item, and never twist a different angle's strong item just to fill the slot.
59. Twist and plain question share one item and one schedule (docs/05's existing design,
    confirmed rather than changed). A twist failure pulling back a good item's interval is the
    intended signal, not a flaw, since FR-30 exists specifically to catch memorised answers that
    don't reflect real understanding.
60. Grid cell state stays last-grade-only, no streak requirement. The grid is a live snapshot,
    not a mastery certification, the interval length already carries the deeper confidence
    signal for anyone who looks closer.

61. Habit layer commits fully to approach-based design, confirmed as a real preference, not
    just an inherited draft. Avoidance-style copy (streak-loss warnings) is ruled out
    permanently, not provisionally.
62. No competitive or comparison features (leaderboards, rankings) in the habit layer. Confirmed
    deliberately, not just accepted because of the privacy collision already noted in docs/06.
63. The commitment-moment feature (asking the user to schedule tomorrow's session) stays
    rejected. One of its two supporting reasons in docs/05 section 7.3 (protecting a clean day 4
    number) is now stale since the day 4 metric was cut; the rejection holds on the surviving
    reason alone, that a good enough product doesn't need to ask. Section 7.3 needs rewording
    to drop the stale justification, not the conclusion.

## Data and privacy (docs/06)

64. "Delete means delete" stays exactly as written, CLAUDE.md hard rule, not weakened. Scoped
    into a concrete small task rather than left vague: delete the user's storage objects first,
    then delete the auth.users row via the admin API, letting existing foreign keys cascade the
    rest. Tracked as its own task with a test asserting the storage object is actually gone.
65. Mic check wording in docs/06 sections 1 and 8 amended to match decision 16: transcribed
    internally for reliability calibration only, never shown, scored, or played back.
66. `evaluation` gains `parts`, `attempt` gains the confidence summary column, in docs/06's
    schema section.
67. Section 5's "one anonymous answer per IP per day" updated to session-based limiting with IP
    as a coarse ceiling, plus Turnstile, per decision 49.
68. Section 9's "required before any real user other than a recruited tester" retagged to
    "required before deploying to friends." The verification requirement itself (Deepgram and
    model provider retention defaults) stays, only the trigger wording changes.
69. Section 7, "what is not collected," confirmed unchanged. No fingerprinting, no demographic
    data, both carry real legal exposure and no product justification, worth resisting even
    when a future feature makes them look tempting.

## Still open

- Monetisation shape. Phase 2 gate.
- Whether a second attempt replaces the first when an item is graded. `docs/04` section 4.2,
  Phase 2.
- Whether the user can play back their own recordings after session 4, now that download is
  gone.
