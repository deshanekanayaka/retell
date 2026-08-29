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
