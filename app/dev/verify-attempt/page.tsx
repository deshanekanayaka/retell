import { notFound } from "next/navigation";
import { RAIL_LABELS } from "@/lib/rail-labels";
import type { RailPart } from "@/lib/rails";
import { splitIntoSentences } from "@/lib/sentences";
import { getLatestAttempt } from "@/lib/supabase/attempts";
import { getLatestEvaluation, getScoresForCalibration } from "@/lib/supabase/evaluations";
import { createSignedDownloadUrl } from "@/lib/supabase/storage";

// Dev only, and the only screen in the product allowed to show a rubric score.
// FR-23 keeps scores away from users; calibration needs to read them, and
// docs/04 section 6 requires comparing them across models. The NODE_ENV guard
// is what keeps those two facts compatible.

export default async function VerifyAttemptPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const attempt = await getLatestAttempt();

  if (!attempt) {
    return <p>No attempts yet for this session.</p>;
  }

  const signedUrl = await createSignedDownloadUrl(attempt.audioUrl);
  const evaluation = await getLatestEvaluation(attempt.id);
  const scores = await getScoresForCalibration(attempt.id);

  const wordTimings = attempt.wordTimings ?? [];
  const sentences = splitIntoSentences(wordTimings);

  // Which part, if any, claimed each sentence. Rails are stored as word
  // positions, so this maps back through the same split the prompt used.
  function partOf(startWord: number): RailPart | null {
    if (!evaluation) {
      return null;
    }
    for (const part of ["situation", "action", "result"] as const) {
      const range = evaluation[part];
      if (range && startWord >= range.startWord && startWord <= range.endWord) {
        return part;
      }
    }
    return null;
  }

  return (
    <div style={{ padding: 24, fontFamily: "monospace", maxWidth: 900 }}>
      <h1>Calibration: attempt {attempt.id.slice(0, 8)}</h1>
      <p>recorded {attempt.createdAt}</p>
      <audio controls src={signedUrl} />

      <h2>Question asked</h2>
      <p>{attempt.questionText ?? "(none recorded, pre-S3 attempt)"}</p>

      <h2>Signals (computed, never sent to the model)</h2>
      <ul>
        <li>duration_ms: {attempt.durationMs}</li>
        <li>words_per_minute: {attempt.wordsPerMinute}</li>
        <li>longest_pause_ms: {attempt.longestPauseMs}</li>
        <li>filler_count: {attempt.fillerCount}</li>
        <li>confidence: {attempt.confidence}</li>
        <li>words: {wordTimings.length}</li>
      </ul>

      {!evaluation ? (
        <>
          <h2>Evaluation</h2>
          <p>None. Either it failed, or this attempt predates S3.</p>
        </>
      ) : (
        <>
          <h2>Scores (dev only, never shown to a user)</h2>
          <ul>
            <li>relevance: {scores?.relevance}</li>
            <li>structure: {scores?.structure}</li>
            <li>specificity: {scores?.specificity}</li>
          </ul>
          <p>
            model: {evaluation.model} / rubric_version: {evaluation.rubricVersion}
          </p>

          <h2>Gap</h2>
          <p>{evaluation.gap}</p>

          <h2>Angles</h2>
          <p>{evaluation.angles.length > 0 ? evaluation.angles.join(", ") : "(none)"}</p>
        </>
      )}

      <h2>The split, and what claimed each sentence</h2>
      <p>
        {sentences.length} sentences.{" "}
        {sentences.length < 2 && "Rails suppressed: one sentence means no structure detected."}
      </p>
      <table cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {sentences.map((sentence, index) => {
            const part = partOf(sentence.startWord);
            return (
              <tr key={index} style={{ borderTop: "1px solid #ccc" }}>
                <td style={{ verticalAlign: "top", width: 28 }}>{index + 1}.</td>
                <td style={{ verticalAlign: "top", width: 110, color: part ? "#000" : "#bbb" }}>
                  {part ? RAIL_LABELS[part] : "-"}
                </td>
                <td>
                  {wordTimings
                    .slice(sentence.startWord, sentence.endWord + 1)
                    .map((timing) => timing.punctuatedWord)
                    .join(" ")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Raw transcript</h2>
      <p>{attempt.transcript}</p>
    </div>
  );
}
