import { required } from "@/lib/env";
import type { WordTiming } from "./signals";

// The only file that calls Deepgram. Mirrors lib/evaluate.ts's provider
// isolation: nothing else knows this is Deepgram, so swapping transcription
// vendors later is a single-file change.

export type TranscriptionResult = {
  transcript: string;
  wordTimings: WordTiming[];
  durationSeconds: number;
};

type DeepgramResponse = {
  metadata?: { duration?: number };
  results?: {
    channels?: Array<{
      alternatives?: Array<{
        transcript?: string;
        words?: Array<{ word?: string; start?: number; end?: number }>;
      }>;
    }>;
  };
};

function parseResponse(data: DeepgramResponse): TranscriptionResult {
  const alternative = data.results?.channels?.[0]?.alternatives?.[0];

  if (!alternative || typeof alternative.transcript !== "string" || !alternative.words) {
    throw new Error("Deepgram response is missing a transcript or word timings");
  }

  if (typeof data.metadata?.duration !== "number") {
    throw new Error("Deepgram response is missing audio duration");
  }

  const wordTimings: WordTiming[] = alternative.words.map((word) => {
    if (typeof word.word !== "string" || typeof word.start !== "number" || typeof word.end !== "number") {
      throw new Error("Deepgram response contains a malformed word timing");
    }
    return { word: word.word, start: word.start, end: word.end };
  });

  return {
    transcript: alternative.transcript,
    wordTimings,
    durationSeconds: data.metadata.duration,
  };
}

// docs/04-voice-and-evaluation.md section 2: word timestamps and filler
// words are required options, not optional tuning. Whisper is rejected
// specifically for lacking an equivalent to filler_words.
export async function transcribeAudio(audioUrl: string): Promise<TranscriptionResult> {
  const response = await fetch("https://api.deepgram.com/v1/listen?filler_words=true", {
    method: "POST",
    headers: {
      Authorization: `Token ${required("DEEPGRAM_API_KEY", process.env.DEEPGRAM_API_KEY)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: audioUrl }),
  });

  if (!response.ok) {
    throw new Error(`Deepgram transcription failed with status ${response.status}`);
  }

  const data = (await response.json()) as DeepgramResponse;
  return parseResponse(data);
}
