import { describe, expect, it } from "vitest";
import {
  buildConfusionMatrix,
  exactAgreement,
  majorityClassBaseline,
  withinOneAgreement,
  type ScorePair,
} from "./report";

const PAIRS: ScorePair[] = [
  { gold: 3, model: 3 }, // exact
  { gold: 2, model: 2 }, // exact
  { gold: 1, model: 2 }, // within one
  { gold: 3, model: 1 }, // off by two
  { gold: 2, model: 2 }, // exact
];

describe("buildConfusionMatrix", () => {
  it("counts each gold/model pair into its cell", () => {
    const matrix = buildConfusionMatrix(PAIRS);
    expect(matrix[3][3]).toBe(1);
    expect(matrix[2][2]).toBe(2);
    expect(matrix[1][2]).toBe(1);
    expect(matrix[3][1]).toBe(1);
  });

  it("returns a 4x4 matrix of zeros for no pairs", () => {
    const matrix = buildConfusionMatrix([]);
    expect(matrix).toHaveLength(4);
    expect(matrix.every((row) => row.every((cell) => cell === 0))).toBe(true);
  });
});

describe("exactAgreement", () => {
  it("is the fraction of pairs that match exactly", () => {
    expect(exactAgreement(PAIRS)).toBe(3 / 5);
  });

  it("is zero for no pairs, not NaN", () => {
    expect(exactAgreement([])).toBe(0);
  });
});

describe("withinOneAgreement", () => {
  it("counts exact matches and one-step-off matches, not the off-by-two pair", () => {
    expect(withinOneAgreement(PAIRS)).toBe(4 / 5);
  });
});

describe("majorityClassBaseline", () => {
  it("scores what always guessing the most common gold label would get", () => {
    // gold labels: 3, 2, 1, 3, 2 — 2 and 3 tie at two each, so the ceiling is 2/5
    expect(majorityClassBaseline(PAIRS)).toBe(2 / 5);
  });

  it("is zero for no pairs", () => {
    expect(majorityClassBaseline([])).toBe(0);
  });

  it("is a real judge test: a model reading 60 percent exact should still beat this on a skewed set", () => {
    const skewed: ScorePair[] = [
      { gold: 2, model: 2 },
      { gold: 2, model: 2 },
      { gold: 2, model: 1 },
      { gold: 2, model: 2 },
      { gold: 0, model: 0 },
    ];
    // baseline: guessing 2 every time gets 4/5, so an evaluator scoring 4/5
    // exact here has added nothing over always guessing the common label.
    expect(majorityClassBaseline(skewed)).toBe(4 / 5);
    expect(exactAgreement(skewed)).toBe(4 / 5);
  });
});
