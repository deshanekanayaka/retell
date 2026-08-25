import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/deepgram";
import {
  computeDurationMs,
  computeFillerCount,
  computeLongestPauseMs,
  computeWordsPerMinute,
} from "@/lib/signals";
import { createAttempt, saveAttemptFacts } from "@/lib/supabase/attempts";
import { createSignedDownloadUrl } from "@/lib/supabase/storage";

export async function POST(request: Request) {
  const body = await request.json();

  if (typeof body.path !== "string" || body.path.length === 0) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  const attemptId = await createAttempt(body.path);

  const downloadUrl = await createSignedDownloadUrl(body.path);
  const { transcript, wordTimings, durationSeconds } = await transcribeAudio(downloadUrl);

  const durationMs = computeDurationMs(durationSeconds);

  await saveAttemptFacts(attemptId, {
    transcript,
    wordTimings,
    durationMs,
    wordsPerMinute: computeWordsPerMinute(wordTimings.length, durationMs),
    longestPauseMs: computeLongestPauseMs(wordTimings),
    fillerCount: computeFillerCount(wordTimings),
  });

  return NextResponse.json({ attemptId });
}
