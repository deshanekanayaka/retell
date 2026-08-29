import { describe, expect, it } from "vitest";
import { evaluateAnswer } from "@/lib/evaluate";
import { synthesizeWordTimings } from "./gold-set";

// Calls the real model provider. Costs money, needs ANTHROPIC_API_KEY, and
// is deliberately not part of `pnpm test` (vitest.config.mts excludes
// *.eval.test.ts). Run with `pnpm test:eval`.
//
// These fixtures are authored, not a real user's story. ADR-009 forbids
// writing story content for a user; it does not cover test fixtures written
// to check the product's own invariants (context/docs-review-decisions.md
// notes this distinction explicitly).
//
// Each assertion checks one thing the rubric must never get wrong, per
// context/features/s3-evaluate-and-feedback-spec.md's evaluation harness
// requirements. A failure here means the prompt or anchors regressed, not
// that the threshold in 01-PRD.md section 6 was missed by a little.

const QUESTION = "Tell me about something you worked on with other people recently.";

describe("evaluation harness: behavioural assertions", () => {
  it("scores structure 1 or lower when the answer never says how it ended", async () => {
    const transcript =
      "So basically we had this group project for one of my final year modules, " +
      "four of us on the team. I set up a shared doc and started messaging everyone " +
      "about what they could actually commit to each week.";

    const result = await evaluateAnswer({
      questionText: QUESTION,
      wordTimings: synthesizeWordTimings(transcript),
    });

    expect(result.structure).toBeLessThanOrEqual(1);
  }, 30_000);

  it("scores specificity 1 or lower when the speaker never names their own contribution", async () => {
    const transcript =
      "We had a group project and we worked on it together. We ran into some " +
      "problems along the way but we figured it out as a team and we finished " +
      "it and handed it in on time.";

    const result = await evaluateAnswer({
      questionText: QUESTION,
      wordTimings: synthesizeWordTimings(transcript),
    });

    expect(result.specificity).toBeLessThanOrEqual(1);
  }, 30_000);

  it("scores relevance 1 or lower when the answer addresses a different question", async () => {
    const transcript =
      "My biggest strength is probably that I'm really organised. I always keep " +
      "a to-do list and I check things off as I go, and I think that's helped me " +
      "stay on top of my coursework this year.";

    const result = await evaluateAnswer({
      questionText: QUESTION,
      wordTimings: synthesizeWordTimings(transcript),
    });

    expect(result.relevance).toBeLessThanOrEqual(1);
  }, 30_000);

  it("returns identical scores across repeated runs of identical input", async () => {
    const transcript =
      "Last term I was on a group project and two people stopped replying about " +
      "three weeks before the deadline. I set up a shared doc and messaged everyone " +
      "to ask what they could actually commit to, then split their sections between " +
      "me and one other person. We ended up handing it in a day early.";

    const input = { questionText: QUESTION, wordTimings: synthesizeWordTimings(transcript) };

    const [first, second] = await Promise.all([evaluateAnswer(input), evaluateAnswer(input)]);

    expect(second.relevance).toBe(first.relevance);
    expect(second.structure).toBe(first.structure);
    expect(second.specificity).toBe(first.specificity);
  }, 30_000);
});
