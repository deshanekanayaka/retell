import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/deepgram";
import { evaluateAnswer } from "@/lib/evaluate";
import { PHASE_1_QUESTION } from "@/lib/questions";
import {
  computeDurationMs,
  computeFillerCount,
  computeLongestPauseMs,
  computeWordsPerMinute,
} from "@/lib/signals";
import { createAttempt, saveAttemptFacts } from "@/lib/supabase/attempts";
import { saveEvaluation } from "@/lib/supabase/evaluations";
import { createSignedDownloadUrl } from "@/lib/supabase/storage";

export async function POST(request: Request) {
  const body = await request.json();

  if (typeof body.path !== "string" || body.path.length === 0) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  // The question is resolved here, never taken from the request body. It is
  // what `relevance` is scored against, so a browser must not be able to
  // choose it.
  const attemptId = await createAttempt(body.path, PHASE_1_QUESTION);

  const downloadUrl = await createSignedDownloadUrl(body.path);
  const { transcript, wordTimings, durationSeconds } = await transcribeAudio(downloadUrl);

  const durationMs = computeDurationMs(durationSeconds);

  // Facts first, and separately. If evaluation fails below, the transcript,
  // the timings and the audio all survive and the answer can be re-scored
  // later without re-recording (FR-15, FR-21).
  await saveAttemptFacts(attemptId, {
    transcript,
    wordTimings,
    durationMs,
    wordsPerMinute: computeWordsPerMinute(wordTimings.length, durationMs),
    longestPauseMs: computeLongestPauseMs(wordTimings),
    fillerCount: computeFillerCount(wordTimings),
  });

  // A failed evaluation is not a failed answer. The user has just spoken for a
  // minute and docs/04 section 5 forbids showing that as an error, so the
  // attempt is reported as succeeded and the feedback screen degrades to the
  // transcript and the angle labels without a gap.
  try {
    const evaluation = await evaluateAnswer({
      questionText: PHASE_1_QUESTION,
      wordTimings,
    });
    await saveEvaluation(attemptId, evaluation);
  } catch (error) {
    console.error("[answer] evaluation failed", { attemptId, error });
    return NextResponse.json({ attemptId, evaluated: false });
  }

  return NextResponse.json({ attemptId, evaluated: true });
}
