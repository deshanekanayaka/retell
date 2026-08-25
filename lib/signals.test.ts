import { describe, expect, it } from "vitest";
import {
  computeDurationMs,
  computeFillerCount,
  computeLongestPauseMs,
  computeWordsPerMinute,
  FILLER_WORDS,
} from "./signals";

describe("computeDurationMs", () => {
  it("converts seconds to milliseconds", () => {
    expect(computeDurationMs(12.5)).toBe(12500);
  });
});

describe("computeWordsPerMinute", () => {
  it("scales a word count over a duration up to a full minute", () => {
    // 30 words in 30 seconds is 60 words per minute
    expect(computeWordsPerMinute(30, 30_000)).toBe(60);
  });

  it("returns zero rather than dividing by zero when duration is zero", () => {
    expect(computeWordsPerMinute(0, 0)).toBe(0);
  });
});

describe("computeLongestPauseMs", () => {
  it("finds the largest gap between one word's end and the next word's start", () => {
    // gaps: 0.2s, 1.5s, 0.1s — the middle one is longest
    const wordTimings = [
      { word: "so", start: 0, end: 0.3 },
      { word: "i", start: 0.5, end: 0.6 },
      { word: "think", start: 2.1, end: 2.4 },
      { word: "that", start: 2.5, end: 2.7 },
    ];
    expect(computeLongestPauseMs(wordTimings)).toBe(1500);
  });

  it("returns zero when there are fewer than two words to have a gap between", () => {
    expect(computeLongestPauseMs([])).toBe(0);
    expect(computeLongestPauseMs([{ word: "hi", start: 0, end: 0.2 }])).toBe(0);
  });
});

// Word timings only matter to computeFillerCount for their word text, not
// timing, so these fixtures use placeholder start/end values.
function wordsAt(words: string[]) {
  return words.map((word, i) => ({ word, start: i, end: i + 0.5 }));
}

describe("computeFillerCount", () => {
  it("counts single-word fillers from the fixed list", () => {
    const wordTimings = wordsAt(["um", "so", "i", "uh", "went", "there"]);
    expect(computeFillerCount(wordTimings)).toBe(2);
  });

  it("does not count ordinary words", () => {
    const wordTimings = wordsAt(["i", "went", "to", "the", "store"]);
    expect(computeFillerCount(wordTimings)).toBe(0);
  });

  it("counts multi-word fillers as one occurrence across contiguous tokens", () => {
    const wordTimings = wordsAt(["and", "you", "know", "i", "mean", "it", "was", "fine"]);
    expect(computeFillerCount(wordTimings)).toBe(2);
  });

  it("matches regardless of case", () => {
    const wordTimings = wordsAt(["Um", "So", "UH", "yeah"]);
    expect(computeFillerCount(wordTimings)).toBe(2);
  });

  it("counts every occurrence of 'like', not just the first", () => {
    const wordTimings = wordsAt(["it", "was", "like", "really", "like", "good"]);
    expect(computeFillerCount(wordTimings)).toBe(2);
  });

  it("pins the exact filler list docs/04-voice-and-evaluation.md section 2 states", () => {
    // Deliberately not imported from a shared source — an accidental edit to
    // FILLER_WORDS should fail this test loudly rather than pass by
    // construction.
    expect(FILLER_WORDS).toEqual([
      "um",
      "uh",
      "er",
      "erm",
      "like",
      "you know",
      "i mean",
      "basically",
      "actually",
    ]);
  });
});
