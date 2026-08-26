"use server";

import type { AngleSlug } from "../angles";
import type { Evaluation } from "../evaluate";
import type { WordRange } from "../rails";
import { requireSession } from "./session";

// Judgements only. Facts about the answer live on `attempt` and are never
// merged in here (FR-21, docs/06 section 3).

export type StoredEvaluation = {
  id: string;
  model: string;
  rubricVersion: number;
  gap: string;
  angles: AngleSlug[];
  situation: WordRange | null;
  action: WordRange | null;
  result: WordRange | null;
};

// The three scores are deliberately absent from the read shape. They are
// stored from day one for calibration and the Phase 2 scheduler, and nothing
// user-facing may show them (FR-23, ADR-011). Leaving them out means the
// feedback screen cannot render one by accident.

function toWordRange(startWord: number | null, endWord: number | null): WordRange | null {
  if (startWord === null || endWord === null) {
    return null;
  }

  return { startWord, endWord };
}

export async function saveEvaluation(
  attemptId: string,
  evaluation: Evaluation
): Promise<void> {
  const { supabase } = await requireSession();

  const { error } = await supabase.from("evaluation").insert({
    attempt_id: attemptId,
    model: evaluation.model,
    rubric_version: evaluation.rubricVersion,
    relevance: evaluation.relevance,
    structure: evaluation.structure,
    specificity: evaluation.specificity,
    gap: evaluation.gap,
    angles: evaluation.angles,
    situation_start_word: evaluation.rails.situation?.startWord ?? null,
    situation_end_word: evaluation.rails.situation?.endWord ?? null,
    action_start_word: evaluation.rails.action?.startWord ?? null,
    action_end_word: evaluation.rails.action?.endWord ?? null,
    result_start_word: evaluation.rails.result?.startWord ?? null,
    result_end_word: evaluation.rails.result?.endWord ?? null,
  });

  if (error) {
    throw error;
  }
}

// Deliberately named for its one legitimate use. The three scores must never
// reach a user in Phase 1 (FR-23, ADR-011), but the rubric cannot be calibrated
// without reading them, and docs/04 section 6 requires exactly that comparison.
// Anything user-facing calls getLatestEvaluation, which cannot return a score.
export type CalibrationScores = {
  relevance: number;
  structure: number;
  specificity: number;
};

export async function getScoresForCalibration(
  attemptId: string
): Promise<CalibrationScores | null> {
  const { supabase } = await requireSession();

  const { data, error } = await supabase
    .from("evaluation")
    .select("relevance, structure, specificity")
    .eq("attempt_id", attemptId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}

export async function getLatestEvaluation(attemptId: string): Promise<StoredEvaluation | null> {
  const { supabase } = await requireSession();

  // Newest wins. An attempt can carry more than one evaluation, because
  // re-scoring on a new model or rubric version adds a row rather than
  // overwriting the earlier judgement (docs/04 section 6).
  const { data, error } = await supabase
    .from("evaluation")
    .select(
      "id, model, rubric_version, gap, angles, situation_start_word, situation_end_word, action_start_word, action_end_word, result_start_word, result_end_word"
    )
    .eq("attempt_id", attemptId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    model: data.model,
    rubricVersion: data.rubric_version,
    gap: data.gap,
    angles: data.angles,
    situation: toWordRange(data.situation_start_word, data.situation_end_word),
    action: toWordRange(data.action_start_word, data.action_end_word),
    result: toWordRange(data.result_start_word, data.result_end_word),
  };
}
