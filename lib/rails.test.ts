import { describe, expect, it } from "vitest";
import { resolveRails } from "./rails";
import type { RailClaims } from "./rails";
import type { Sentence } from "./sentences";

// Most cases only care about the resolved ranges. The drops are asserted
// directly in the tests that are about them.
function railsOf(claims: RailClaims, sentences: Sentence[]) {
  return resolveRails(claims, sentences).rails;
}

// Eight sentences of ten words each, so a sentence number maps to an obvious
// word range and an off-by-one is impossible to miss in a failure message.
const SENTENCES: Sentence[] = Array.from({ length: 8 }, (_, i) => ({
  startWord: i * 10,
  endWord: i * 10 + 9,
}));

describe("resolveRails", () => {
  it("resolves a one-based sentence number to that sentence's word range", () => {
    const resolved = railsOf(
      { situation: { start: 1, end: 1 }, action: null, result: null },
      SENTENCES
    );

    expect(resolved.situation).toEqual({ startWord: 0, endWord: 9 });
  });

  it("resolves all three parts across multi-sentence spans", () => {
    // The shape a real answer produced: setting in 1-3, action in 4-7,
    // result in 8.
    const resolved = railsOf(
      {
        situation: { start: 1, end: 3 },
        action: { start: 4, end: 7 },
        result: { start: 8, end: 8 },
      },
      SENTENCES
    );

    expect(resolved).toEqual({
      situation: { startWord: 0, endWord: 29 },
      action: { startWord: 30, endWord: 69 },
      result: { startWord: 70, endWord: 79 },
    });
  });

  it("drops a part numbered from zero rather than reading it as the first sentence", () => {
    // The one silent failure this design can produce. A model that zero-indexes
    // is off by one everywhere, so its claims render perfectly and mark the
    // wrong words. Numbering is one-based; zero is out of range, not a synonym
    // for the first sentence.
    const resolved = railsOf(
      { situation: { start: 0, end: 2 }, action: null, result: null },
      SENTENCES
    );

    expect(resolved.situation).toBeNull();
  });

  it("drops a later part whole when it overlaps sentences an earlier part already claimed", () => {
    // Two rails cannot occupy one span. Fixed order (situation, action,
    // result) keeps the decision deterministic and invents no boundary; the
    // loser degrades into the silent absence docs/04 section 4.1 sanctions.
    const resolved = railsOf(
      {
        situation: { start: 1, end: 3 },
        action: { start: 4, end: 7 },
        result: { start: 6, end: 8 },
      },
      SENTENCES
    );

    expect(resolved.action).toEqual({ startWord: 30, endWord: 69 });
    expect(resolved.result).toBeNull();
  });

  it("keeps a later part that merely abuts an earlier one without sharing a sentence", () => {
    const resolved = railsOf(
      {
        situation: null,
        action: { start: 4, end: 7 },
        result: { start: 8, end: 8 },
      },
      SENTENCES
    );

    expect(resolved.action).toEqual({ startWord: 30, endWord: 69 });
    expect(resolved.result).toEqual({ startWord: 70, endWord: 79 });
  });

  it("suppresses every rail when the split found only one sentence", () => {
    // Degraded transcription, not a structureless answer. Marking the whole
    // thing "the setting" would attribute our pipeline's failure to the user
    // as a claim about their answer.
    const oneSentence: Sentence[] = [{ startWord: 0, endWord: 129 }];

    const resolved = railsOf(
      {
        situation: { start: 1, end: 1 },
        action: { start: 1, end: 1 },
        result: { start: 1, end: 1 },
      },
      oneSentence
    );

    expect(resolved).toEqual({ situation: null, action: null, result: null });
  });

  it("drops a part whose end runs past the last sentence rather than clamping it", () => {
    const resolved = railsOf(
      { situation: null, action: null, result: { start: 7, end: 12 } },
      SENTENCES
    );

    expect(resolved.result).toBeNull();
  });

  it("drops an inverted range", () => {
    const resolved = railsOf(
      { situation: { start: 5, end: 2 }, action: null, result: null },
      SENTENCES
    );

    expect(resolved.situation).toBeNull();
  });

  it("returns null for a part the model did not claim, without affecting the others", () => {
    const resolved = railsOf(
      { situation: { start: 1, end: 3 }, action: null, result: { start: 8, end: 8 } },
      SENTENCES
    );

    expect(resolved).toEqual({
      situation: { startWord: 0, endWord: 29 },
      action: null,
      result: { startWord: 70, endWord: 79 },
    });
  });

  it("reports an overlap drop, which is otherwise indistinguishable from an unclaimed part", () => {
    // Both land in the database as NULL. Without this, there is no way to tell
    // whether the fixed-order rule is costing users their result rail.
    const { drops } = resolveRails(
      {
        situation: { start: 1, end: 3 },
        action: { start: 4, end: 7 },
        result: { start: 6, end: 8 },
      },
      SENTENCES
    );

    expect(drops).toEqual([{ part: "result", reason: "overlap" }]);
  });

  it("reports an out-of-range drop separately from an overlap", () => {
    const { drops } = resolveRails(
      { situation: { start: 0, end: 2 }, action: null, result: { start: 7, end: 99 } },
      SENTENCES
    );

    expect(drops).toEqual([
      { part: "situation", reason: "out_of_range" },
      { part: "result", reason: "out_of_range" },
    ]);
  });

  it("reports no drops when the model did not claim a part at all", () => {
    // An unclaimed part is not a drop. Counting it as one would make the
    // overlap rate look worse than it is.
    const { drops } = resolveRails(
      { situation: { start: 1, end: 3 }, action: null, result: null },
      SENTENCES
    );

    expect(drops).toEqual([]);
  });
});
