import { describe, expect, it } from "vitest";
import { ANGLE_SLUGS } from "./angles";
import { BANNED_COMPETENCY_WORDS, PHASE_1_QUESTION, QUESTION_BANK } from "./questions";

function containsBannedWord(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_COMPETENCY_WORDS.some((word) => lower.includes(word));
}

describe("QUESTION_BANK", () => {
  it("has exactly one plain question and one twist for every angle", () => {
    for (const angle of ANGLE_SLUGS) {
      expect(QUESTION_BANK[angle].plain.length).toBeGreaterThan(0);
      expect(QUESTION_BANK[angle].twist.length).toBeGreaterThan(0);
    }
  });

  it("never names a competency in any plain or twist question (FR-6)", () => {
    for (const angle of ANGLE_SLUGS) {
      expect(containsBannedWord(QUESTION_BANK[angle].plain)).toBe(false);
      expect(containsBannedWord(QUESTION_BANK[angle].twist)).toBe(false);
    }
  });

  it("asks every question as a request for an episode, not an opinion", () => {
    // A loose but real guard: docs/05 section 5's pattern is "Tell me about
    // a time/something...", never a self-assessment question. Every entry
    // should start that way.
    for (const angle of ANGLE_SLUGS) {
      expect(QUESTION_BANK[angle].plain).toMatch(/^Tell me about/);
      expect(QUESTION_BANK[angle].twist).toMatch(/^Tell me about/);
    }
  });
});

describe("PHASE_1_QUESTION", () => {
  it("never names a competency either (FR-6)", () => {
    expect(containsBannedWord(PHASE_1_QUESTION)).toBe(false);
  });
});
