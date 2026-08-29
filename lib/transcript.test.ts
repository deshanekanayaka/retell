import { describe, expect, it } from "vitest";
import { toTranscriptSegments } from "./transcript";
import type { WordTiming } from "./signals";

function words(punctuated: string[]): WordTiming[] {
  return punctuated.map((punctuatedWord, i) => ({
    word: punctuatedWord.toLowerCase().replace(/[^a-z']/g, ""),
    punctuatedWord,
    start: i,
    end: i + 0.5,
    confidence: 1,
  }));
}

const WORDS = words(["We", "argued.", "I", "split", "it.", "We", "shipped."]);

describe("toTranscriptSegments", () => {
  it("returns the whole transcript as one unlabelled segment when no part was located", () => {
    const segments = toTranscriptSegments(WORDS, {
      situation: null,
      action: null,
      result: null,
    });

    expect(segments).toEqual([{ label: null, text: "We argued. I split it. We shipped." }]);
  });

  it("cuts the transcript into claimed and unclaimed runs, in order, losing no words", () => {
    const segments = toTranscriptSegments(WORDS, {
      situation: { startWord: 0, endWord: 1 },
      action: { startWord: 2, endWord: 4 },
      result: { startWord: 5, endWord: 6 },
    });

    expect(segments).toEqual([
      { label: "situation", text: "We argued." },
      { label: "action", text: "I split it." },
      { label: "result", text: "We shipped." },
    ]);
  });

  it("leaves a gap between two parts as its own unlabelled run", () => {
    // Most answers have sentences belonging to no part. They are still the
    // user's words and must appear, just without a rule or a label.
    const segments = toTranscriptSegments(WORDS, {
      situation: { startWord: 0, endWord: 1 },
      action: null,
      result: { startWord: 5, endWord: 6 },
    });

    expect(segments).toEqual([
      { label: "situation", text: "We argued." },
      { label: null, text: "I split it." },
      { label: "result", text: "We shipped." },
    ]);
  });

  it("handles parts that appear out of narrative order", () => {
    // docs/04 section 4.1: speech backtracks, so a result can precede a
    // setting. Nothing enforces ordering, so segments follow word position.
    const segments = toTranscriptSegments(WORDS, {
      situation: { startWord: 5, endWord: 6 },
      action: null,
      result: { startWord: 0, endWord: 1 },
    });

    expect(segments).toEqual([
      { label: "result", text: "We argued." },
      { label: null, text: "I split it." },
      { label: "situation", text: "We shipped." },
    ]);
  });

  it("returns nothing for an empty transcript rather than an empty segment", () => {
    expect(toTranscriptSegments([], { situation: null, action: null, result: null })).toEqual([]);
  });
});
