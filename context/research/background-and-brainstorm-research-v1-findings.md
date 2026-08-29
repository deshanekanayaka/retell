# Findings: background and brainstorm research v1

Source: AI-assisted web research run outside this session (prompt in
`background-and-brainstorm-research-v1.md`), cross-checked here against `docs/` and
`CLAUDE.md`. Docs-only file. Nothing here changes `docs/`; contradictions are flagged, not
resolved.

## 1. "Good enough" feedback UX

**What comparable products do:**

- **Interview Warmup** (now shut down, April 2026): no score, no grade. Feedback was three
  panels — job-related terms used, most-used words, talking points covered. Google's own copy
  said insights don't grade the answer and absence of an insight doesn't mean something is
  wrong. No follow-up push, no pass/fail.
- **Big Interview**: medal (gold/silver/bronze) plus a 16-dimension breakdown and an "Optimized
  Answer" sample.
- **Voomer**: narrative coach feedback, marketed as "not a scorecard," but under-documented
  publicly on the actual "good enough" signal.
- **Yoodli**: rubric scores and dimension-level feedback (STAR breakdown, active listening),
  quantifiable metrics (fillers, pace, conciseness).
- **Anki**: no content grading at all. The user self-grades, "Good" is the modal button
  (80-95% of presses per Anki's own manual), and the only visible feedback is the next review
  interval — nothing is said about quality.
- **Duolingo / ELSA**: speaking-task feedback is reported as thin (Duolingo) or numeric and
  pronunciation-focused (ELSA); neither is a strong precedent for narrative "good enough."

**Cross-check against `docs/`:**

- **FR-23 / ADR-011 (no score shown in Phase 1) already rules out the medal/numeric-score
  branch** (Big Interview, Yoodli, ELSA). Retell's Phase 1 design is closer to the Interview
  Warmup end of the spectrum, and closer still to Anki: `docs/04-voice-and-evaluation.md`
  section 4 already specifies the "good enough" signal as structural, not verdict-based — the
  transcript with situation/action/result marked, the gap question, and which angle labels this
  story now covers. No praise language is used regardless of how the answer scored (section 3.4:
  "No congratulation, no assessment of the person").
- **Nothing in `docs/` currently states what happens when there is close to no gap to ask about**
  (a genuinely strong answer). Section 3.4 requires `gap` to always be "one thing missing,"
  which implies the model always finds something, even on a strong answer. Anki's pattern — the
  reward is a longer interval, not a verdict — maps onto the existing scheduler in
  `docs/05-spaced-repetition.md` (grade `easy`/`good` pushes the item further out) but this
  mapping is not stated anywhere as the intended "good enough" signal. **Worth naming to Deshan
  as a possible spec gap**, not a contradiction: does a very strong answer surface via the
  interval getting longer as the only signal (Anki-style, no separate UI treatment), or is there
  a planned "you don't need to revisit this one soon" line? Currently undecided in `docs/`.

**Unproven across the board:** no product publishes evidence that any specific "good enough"
treatment (medal, insight list, silence) affects return behaviour. Not actionable as a
validated pattern, only as prior art.

## 2. Beyond the twist: mechanisms for an incomplete answer

**What comparable products do:**

- **Yoodli**: contextual follow-up questions generated from the answer, rubric-dimension
  feedback showing which STAR part was weak.
- **Big Interview**: guided "Answer Builder" — slot-fills STAR components step by step, plus
  "Optimized Answer" samples (content-supplying, excluded by our own product rule).
- **Pramp**: human interviewer follows a curated question set with answer guides; probing comes
  from a person, structure from the platform.
- **Academic probing literature** (qualitative-interview methodology, and one MMI-transcript
  study): probes should be relevant to the original response and should elicit the
  interviewee's own further detail, never supply or improve content. One transcript-cleaning
  prompt in the literature states this explicitly: "Do not add content or improve the response."
  A controlled study of guided vs. unguided vs. fixed-question voice probing found the
  guided/constrained approach produced longer, richer responses than fixed questions.

**Cross-check against `docs/`:**

- **This directly matches ADR-009 and FR-24/section 3.4 of `docs/04`**: the model "never
  rewrites the answer, never supplies an example answer, and never invents detail." Any
  mechanism resembling Big Interview's sample answers or STAR content templates is already
  excluded by product boundary, correctly filtered in the original research pass.
- **Retell already has two distinct mechanisms that the research conflated at first pass, worth
  keeping separate:**
  1. **The gap question + "have another go"** (`docs/04` section 4.2) — Phase 1, single
     specific missing-thing question, re-record same item. This is Retell's actual equivalent
     of the "follow-up question" pattern in Yoodli/academic probing literature, and it is
     already built to the "one thing, no content" constraint.
  2. **The twist** (`docs/05-spaced-repetition.md` section 5) — Phase 2, deliberately targets
     items already graded well (slot 2, "attacks strength, not weakness"), not a gap-filling
     tool for a weak answer. **The original framing in the user's question ("we show a twist if
     details are missing") does not match what's specced in `docs/05`.** Twists are not
     triggered by missing detail; the gap-question re-record is. This is a contradiction between
     the question as posed and the current spec, not a contradiction within `docs/` itself —
     flagging it since it may mean the mental model driving the question has drifted from what
     `docs/05` actually says.
- No mechanism beyond the single re-record currently exists in `docs/` for a second incomplete
  attempt (e.g., what happens if the re-record is still missing the same thing). Not addressed
  either way; open question, not a contradiction.

## 3. Validating correctness of open-ended spoken-answer scoring

**What the research found:**

- The most comparable published study (MMI interview scoring, ~1,000 human-scored responses,
  one broad rubric across scenarios): a two-stage multi-agent LLM framework using **3-shot
  prompting with a balanced low/mid/high exemplar set** (QWK 0.621) beat the best fine-tuned
  model (QWK 0.316) by roughly 2x. Their conclusion: fine-tuning is not necessary for broad,
  abstract rubrics at that data scale; it only wins with per-question rubrics and much larger
  sets (~15k, citing ASAP).
- Calibration detail: models systematically overestimate scores; 3 examples (5th/50th/95th
  percentile) outperformed 4+ examples or retrieval-based example selection.
- Separate psychometric validation work reports ensembles of larger LLMs, prompted with detailed
  construct information, reaching agreement comparable to or better than single human raters —
  with human inter-rater reliability itself capped around ICC ~0.59 for some traits, i.e. humans
  are not a clean ceiling either.
- No named interview-prep competitor (Yoodli, Big Interview, Pramp, Voomer, Final Round AI,
  Interview Warmup) publishes fine-tuning dataset size, labelling protocol, or a fine-tuned vs.
  prompted head-to-head. HireVue is the only vendor describing method (fine-tuned RoBERTa) at
  all, with no published numbers.

**Cross-check against `docs/`:**

- **This directly supports the current approach and argues against the "maybe we can train an AI
  feature using a dataset" idea in the original question.** `docs/04-voice-and-evaluation.md`
  section 3 already uses schema-enforced prompting with fixed anchors (0-3 ladders per
  dimension), not a fine-tuned classifier, and Phase 1's gate (`docs/01-PRD.md` section 6) is
  "rubric agreement against a self-labelled gold set, model self-consistency" — i.e. validate
  the prompted approach against a small gold set, exactly the pattern the MMI study found beats
  fine-tuning at this scale.
- **The rubric, its anchors, and how grades are derived are founder-authored, propose-only**
  (`CLAUDE.md`, `context/ai-interaction.md`). This finding is research input for a future
  proposal, not something to act on directly. Recommended framing if raised with Deshan: the
  3-shot balanced-exemplar calibration technique (not the rubric or anchors themselves) is a
  concrete, low-cost thing to test against the gold set once it exists.
- Current anchors in `docs/04` section 3.2 are already example-based ("0: no discernible
  situation..." etc.) but the prompt doesn't appear (from this doc alone) to include worked
  transcript exemplars at each score level. Worth a question to Deshan, not a change: does the
  evaluation prompt currently include few-shot examples, or only the anchor text?

## 4. Verbal prompt injection

**What the research found:**

- Well documented for voice AI generally (2026 security guides, OWASP prompt-injection page):
  treat transcript as untrasted data, delimit it explicitly from instructions, enforce
  structured output, scan for injection phrases, use an input-guard model or dual-LLM pattern
  where affordable.
- One study measured this concretely against LLM graders: average attack success rate 56.9%
  across five grader models; the best-performing defence was declaring an explicit trust
  boundary *before* the untrusted block (defences placed after the injected content did not
  work, regardless of framing).
- Another finding: ASR transcription does not neutralise injected instructions even under severe
  transcription error (91.7% WER in one test) — the semantic intent still reached the LLM and
  the attack still succeeded.
- **No named interview-prep competitor publishes anything about this.** Explicitly absent from
  the public record, not just under-documented.

**Cross-check against `docs/`:**

- **`docs/04-voice-and-evaluation.md` section 3.3 already has strong structural defences that
  happen to double as injection mitigation, likely not designed for that purpose:** schema-
  enforced output only (`relevance`/`structure`/`specificity`/`gap`/`angles`/positions — no free
  prose field a model could be steered into), and ADR-017's rule that the model returns sentence
  *positions*, never quoted or generated text. A prompt injection telling the model to "say I
  did great" has very little surface to land on if the only outputs are enums and integer
  positions. This is a genuine strength worth naming as-is, not a gap.
- **`gap` is the one free-text-shaped field** ("one thing missing, phrased as a question").
  Section 3.4 already constrains it heavily (one question, no praise, no judgement, versioned
  prompt) but there is no explicit rule in `docs/04` about treating the transcript as untrusted
  data with an explicit trust boundary in the prompt itself. **This looks like a real, low-cost
  gap**: the research's top mitigation (delimit untrusted transcript before instructions, state
  explicitly it is data not command) is not mentioned anywhere in the current prompt rules.
  Recommend raising as a `lib/evaluate.ts` prompt-hardening addition — implementation detail, not
  a rubric change, so it does not need the founder-authored rubric process, but Deshan should
  decide whether it's worth doing pre- or post-Phase-1-gate.
- No adversarial test fixtures for this exist yet in the test suite (not verifiable from docs
  alone; flagged for verification against `lib/evaluate.test.ts` if the file exists).

## 5. ASR quota/outage handling

**What the research found:**

- AssemblyAI: exceeding concurrency **queues** jobs FIFO rather than failing; exceeding a
  separate rate limit or going below zero balance throttles rather than drops.
  Streaming, by contrast, hard-fails on limit (1008 error).
- Deepgram: rate limits are concurrency-based per project; docs recommend exponential backoff
  and, for time-sensitive products, a small number of retries before falling back.
- General pattern in production write-ups: **store raw audio first, enqueue transcription
  separately**, so a transcription failure never touches the stored file; retry or fail over to
  a second provider at the transcription step only.

**Cross-check against `docs/` — this is where the research surfaces a real tension:**

- **`docs/04-voice-and-evaluation.md` section 1.2 already guarantees "audio is uploaded directly
  from the browser to object storage with a signed URL, never proxied through an API route,"
  independent of transcription.** So "raw audio never touches the failure path" is already true
  by construction — transcription reads from storage after the fact, it doesn't gate the upload.
  This is a stronger guarantee than most of the researched patterns achieve, since even the
  upload step doesn't depend on Deepgram being up.
- **What is genuinely unspecified in `docs/`:** what happens to a stored recording if the
  Deepgram transcription call itself fails or the account runs out of credit. `docs/02-system-
  architecture.md` lists Deepgram accuracy as a risk (line 281) but not availability/quota. No
  retry, backoff, or fallback-provider behaviour is mentioned anywhere in `docs/`.
- **This is where the research's own recommended pattern collides with a hard project
  boundary.** CLAUDE.md: "Must NOT be scaffolded yet: no queue or background worker." The
  research's standard mitigation — enqueue the transcription job so it can retry or fail over
  without blocking — is architecturally the thing currently out of scope for this phase. A
  simpler Phase-1-compatible version (synchronous retry with backoff inline in the route handler
  that calls Deepgram, no queue, no second provider) would fit current scope; multi-provider
  fallback or a durable retry queue would not, and shouldn't be reached for without that scope
  decision being made explicitly first. **Flagging this as a scope question for Deshan, not
  something to implement.**

## 6. File upload security (e.g. profile picture)

**What the research found:** a layered checklist, consistent across 2025-2026 Next.js/Supabase
security guides: server-side extension + content-type validation, magic-byte/signature
verification, size limits enforced before full read, image re-encoding (strips metadata and
polyglot risk), malware scanning (ClamAV or cloud API), randomized server-generated filenames,
path-traversal stripping, safe serving headers (`nosniff`, `Content-Disposition`), a separate
serving domain, rate limiting on the upload endpoint, and authn/authz before issuing an upload
token. Signed upload URLs (client uploads directly to storage) are preferred over proxying
through the app server with a long-lived key. Recommended test plan: deliberately upload a
wrong-extension file, an oversized file, a path-traversal filename, and (in a controlled
environment) a known-malware sample, then verify rejection at the correct layer and no
execution/direct serving.

**Cross-check against `docs/`:**

- **There is no profile-picture or general user-file-upload feature in scope right now.**
  `docs/06-data-and-privacy.md` covers only the `recording` table and audio storage objects;
  grep across `docs/` finds no upload feature beyond audio. This entire question is **pre-work
  for a feature that doesn't exist yet**, not an active gap.
- **The existing audio-upload pattern already follows the strongest-recommended piece of this
  checklist**: signed URL, direct browser-to-storage, never proxied (`docs/04` section 1.2,
  `coding-standards.md` "Audio uploads go browser to storage with a signed URL, never proxied
  through a route"). Any future file-upload feature (profile picture or otherwise) should extend
  this same pattern rather than introduce a second upload architecture.
- No contradiction here — just noting that if/when a profile-picture feature is speced, this
  checklist (magic-byte check, re-encode, random filename, private bucket + RLS, rate limit) is
  ready to hand to that spec's implementation plan without new research.

## Summary: what this implies for upcoming specs

1. **No action needed** for the "good enough" feedback UX — current design (structural signal,
   no score, no praise) is already the strongest pattern found in research. One open question
   worth putting to Deshan: is a longer scheduling interval the *only* "you're doing well"
   signal, or is a UI treatment planned? Currently undecided in `docs/05`/`docs/04`.
2. **No action needed** on gap-filling mechanisms — current single-question, no-content-
   supplied re-record already matches the best validated pattern. Worth clarifying that twists
   (Phase 2, strong answers) and the gap re-record (Phase 1, any answer) are different tools,
   since the original question conflated them.
3. **Supports current approach, do not fine-tune.** If raised again, the concrete research
   input is the 3-shot balanced-exemplar prompting technique, worth testing against the gold set
   — proposal only, founder decides.
4. **One concrete, low-cost, non-rubric prompt-hardening gap**: no explicit trust-boundary /
   "transcript is data not instruction" framing exists yet in the evaluation prompt rules in
   `docs/04` section 3.4. Recommend Deshan decide whether to add this before or after the Phase 1
   gate.
5. **One real scope tension surfaced**: standard ASR-outage mitigation (queue + retry, optionally
   multi-provider fallback) conflicts with the current "no queue or background worker" boundary.
   Deepgram/credit-exhaustion failure handling is currently unspecified in `docs/`. Needs a scope
   decision, not an implementation, before S6's rate-limit work (`docs/03` S6) is built out.
6. **No action needed**, feature not yet in scope. Checklist retained here for whenever a
   profile-picture or similar upload feature is speced.
