import { describe, expect, it } from "vitest";
import { synthesizeWordTimings } from "./gold-set";

describe("synthesizeWordTimings", () => {
  it("splits on whitespace and strips punctuation into word, keeps it in punctuatedWord", () => {
    const timings = synthesizeWordTimings("So I went, and it was fine.");
    expect(timings.map((t) => t.word)).toEqual(["so", "i", "went", "and", "it", "was", "fine"]);
    expect(timings.map((t) => t.punctuatedWord)).toEqual([
      "So",
      "I",
      "went,",
      "and",
      "it",
      "was",
      "fine.",
    ]);
  });

  it("gives every word full confidence and non-overlapping timing", () => {
    const timings = synthesizeWordTimings("one two three");
    expect(timings.every((t) => t.confidence === 1)).toBe(true);
    for (let i = 1; i < timings.length; i++) {
      expect(timings[i].start).toBeGreaterThanOrEqual(timings[i - 1].end);
    }
  });

  it("returns an empty array for empty or whitespace-only input", () => {
    expect(synthesizeWordTimings("")).toEqual([]);
    expect(synthesizeWordTimings("   ")).toEqual([]);
  });
});
