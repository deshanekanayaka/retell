// Pure scoring for the evaluation harness. No I/O, no API calls, so this is
// ordinary TDD territory unlike the rest of lib/harness (context/coding
// -standards.md). Compares Deshan's own gold-set labels against the model's
// scores on the same transcripts, one dimension at a time.

export type Score = 0 | 1 | 2 | 3;

export type ScorePair = {
  gold: Score;
  model: Score;
};

// Rows are gold labels, columns are model scores. cell[gold][model] is a
// count. The diagonal is exact agreement; one step off it is within-one.
export type ConfusionMatrix = number[][];

export function buildConfusionMatrix(pairs: ScorePair[]): ConfusionMatrix {
  const matrix: ConfusionMatrix = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

  for (const pair of pairs) {
    matrix[pair.gold][pair.model]++;
  }

  return matrix;
}

export function exactAgreement(pairs: ScorePair[]): number {
  if (pairs.length === 0) {
    return 0;
  }

  const matches = pairs.filter((pair) => pair.gold === pair.model).length;
  return matches / pairs.length;
}

export function withinOneAgreement(pairs: ScorePair[]): number {
  if (pairs.length === 0) {
    return 0;
  }

  const matches = pairs.filter((pair) => Math.abs(pair.gold - pair.model) <= 1).length;
  return matches / pairs.length;
}

// Corrects agreement for how much of it chance alone would produce. Exact
// agreement can look strong on a skewed gold set (most answers score 2)
// purely because guessing the common label is often right; kappa's expected
// matrix (`goldHist[i] * modelHist[j] / total`) is what a judge with the same
// marginal habits but no real signal would produce, subtracted out. The
// "quadratic" weight, `(gold - model)^2`, then makes an off-by-two miss cost
// four times an off-by-one miss, matching how much worse the two mistakes
// actually are for a rubric scored 0 to 3 (decision 24,
// context/docs-review-decisions.md).
export function quadraticWeightedKappa(pairs: ScorePair[]): number {
  if (pairs.length === 0) {
    return 0;
  }

  const numCategories = 4;
  const observed = buildConfusionMatrix(pairs);
  const goldTotals = Array(numCategories).fill(0);
  const modelTotals = Array(numCategories).fill(0);

  for (const pair of pairs) {
    goldTotals[pair.gold]++;
    modelTotals[pair.model]++;
  }

  const total = pairs.length;
  const maxDistanceSquared = (numCategories - 1) ** 2;

  let weightedObserved = 0;
  let weightedExpected = 0;

  for (let gold = 0; gold < numCategories; gold++) {
    for (let model = 0; model < numCategories; model++) {
      const weight = (gold - model) ** 2 / maxDistanceSquared;
      const expected = (goldTotals[gold] * modelTotals[model]) / total;

      weightedObserved += weight * observed[gold][model];
      weightedExpected += weight * expected;
    }
  }

  // Only zero when every pair lands in the same single cell, which is
  // already perfect agreement with no disagreement left to weigh.
  if (weightedExpected === 0) {
    return 1;
  }

  return 1 - weightedObserved / weightedExpected;
}

// The floor any real judge has to clear. "Always guess the most common gold
// label" is free, uses no model at all, and a judge that cannot beat it is
// adding nothing (04-voice-and-evaluation.md section 6 exists to check this
// rather than assume it).
export function majorityClassBaseline(pairs: ScorePair[]): number {
  if (pairs.length === 0) {
    return 0;
  }

  const counts = [0, 0, 0, 0];
  for (const pair of pairs) {
    counts[pair.gold]++;
  }

  const mostCommonCount = Math.max(...counts);
  return mostCommonCount / pairs.length;
}
