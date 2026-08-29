import { describe, expect, it } from "vitest";
import { evaluateAnswer } from "@/lib/evaluate";
import goldSetData from "./gold-set.json";
import { synthesizeWordTimings, type GoldSetEntry } from "./gold-set";
import {
  buildConfusionMatrix,
  exactAgreement,
  majorityClassBaseline,
  withinOneAgreement,
  type ScorePair,
} from "./report";

// Calls the real model provider for every entry in gold-set.json. Costs
// money, needs ANTHROPIC_API_KEY. Run with `pnpm test:eval`.
//
// This reports, it does not gate (context/docs-review-decisions.md decision
// 24): there is no pass/fail threshold here, only a printed confusion
// matrix and agreement numbers per dimension. The threshold in 01-PRD.md
// section 6 gets set once this has run against real labelled answers, not
// guessed in advance.
//
// gold-set.json starts empty. Fill it with roughly 20 entries: recorded by
// Deshan with deliberately varied quality (including some that should score
// 0 or 1 on each dimension, not just good answers), each labelled by Deshan
// himself before looking at what the model returns. See
// context/docs-review-decisions.md decisions 23 and 24, and the GoldSetEntry
// type in gold-set.ts for the exact shape.

const goldSet = goldSetData as GoldSetEntry[];

function printDimensionReport(dimension: string, pairs: ScorePair[]) {
  const matrix = buildConfusionMatrix(pairs);
  console.log(`\n${dimension}`);
  console.log(`  exact agreement:       ${(exactAgreement(pairs) * 100).toFixed(0)}%`);
  console.log(`  within-one agreement:  ${(withinOneAgreement(pairs) * 100).toFixed(0)}%`);
  console.log(`  majority-class baseline: ${(majorityClassBaseline(pairs) * 100).toFixed(0)}%`);
  console.log(`  confusion matrix (rows = gold, columns = model, 0 to 3):`);
  for (const row of matrix) {
    console.log(`    ${row.join("  ")}`);
  }
}

describe("evaluation harness: gold set", () => {
  it("reports agreement between Deshan's labels and the model's scores", async () => {
    if (goldSet.length === 0) {
      console.warn(
        "\ngold-set.json is empty. Nothing to report. See the comment at the top of this " +
          "file for how to fill it in."
      );
      expect(goldSet).toEqual([]);
      return;
    }

    const relevancePairs: ScorePair[] = [];
    const structurePairs: ScorePair[] = [];
    const specificityPairs: ScorePair[] = [];

    for (const entry of goldSet) {
      const result = await evaluateAnswer({
        questionText: entry.question,
        wordTimings: synthesizeWordTimings(entry.transcript),
      });

      relevancePairs.push({ gold: entry.labels.relevance, model: result.relevance as 0 | 1 | 2 | 3 });
      structurePairs.push({ gold: entry.labels.structure, model: result.structure as 0 | 1 | 2 | 3 });
      specificityPairs.push({
        gold: entry.labels.specificity,
        model: result.specificity as 0 | 1 | 2 | 3,
      });
    }

    console.log(`\nGold set report, ${goldSet.length} answers`);
    printDimensionReport("relevance", relevancePairs);
    printDimensionReport("structure", structurePairs);
    printDimensionReport("specificity", specificityPairs);

    // Reports, does not gate. The assertion below only confirms the run
    // completed; it is never a pass/fail bar on the numbers above.
    expect(relevancePairs).toHaveLength(goldSet.length);
  }, 120_000);
});
