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
        words?: Array<{
          word?: string;
          punctuated_word?: string;
          start?: number;
          end?: number;
          confidence?: number;
        }>;
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
    if (typeof word.punctuated_word !== "string") {
      throw new Error("Deepgram response is missing punctuated words");
    }
    if (typeof word.confidence !== "number") {
      throw new Error("Deepgram response is missing word confidence");
    }
    return {
      word: word.word,
      punctuatedWord: word.punctuated_word,
      start: word.start,
      end: word.end,
      confidence: word.confidence,
    };
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
//
// `punctuate` is required by S3: sentence boundaries are what the evaluation
// prompt numbers so the model can locate the situation, action and result
// without writing any text of its own. Deliberately not `smart_format`, which
// reformats far more aggressively than sentence punctuation needs and could
// disturb the filler tokens `filler_count` depends on.
//
// `model=nova-2` is pinned, and the pin is load bearing in both directions.
//
// Against the default base tier: accuracy on second-language and accented
// English is a product requirement, not a quality preference. The transcript is
// shown back to the user as their own words (docs/04 section 4.1), and a large
// share of final year students and new graduates are not native English
// speakers. The base tier produced nine errors in 130 words on a real answer,
// including "a shared doc" as "a shared door".
//
// Against nova-3, which is newer: DO NOT UPGRADE without re-running the filler
// comparison. Measured on identical audio, nova-3 silently drops `um` and `uh`
// and repairs false starts even with filler_words=true, taking filler_count
// from 7 to 5. That is precisely the behaviour docs/04 section 2 rejects
// Whisper for, and filler_count is a contract signal. nova-2 matches nova-3's
// accuracy (it is in fact better on "I messaged" vs "I message") while leaving
// the signal intact.
export async function transcribeAudio(audioUrl: string): Promise<TranscriptionResult> {
  const response = await fetch(
    "https://api.deepgram.com/v1/listen?filler_words=true&punctuate=true&model=nova-2",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${required("DEEPGRAM_API_KEY", process.env.DEEPGRAM_API_KEY)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: audioUrl }),
    }
  );

  if (!response.ok) {
    throw new Error(`Deepgram transcription failed with status ${response.status}`);
  }

  const data = (await response.json()) as DeepgramResponse;
  return parseResponse(data);
}
