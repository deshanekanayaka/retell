import type { WordTiming } from "@/lib/signals";

// One labelled example for the evaluation harness. `transcript` is plain
// text (not real Deepgram word timings), because gold-set entries are either
// typed directly or read off a real recording after the fact; either way
// they start as text. `synthesizeWordTimings` below turns that text into the
// shape `evaluateAnswer` actually needs.
export type GoldSetEntry = {
  question: string;
  transcript: string;
  labels: {
    relevance: 0 | 1 | 2 | 3;
    structure: 0 | 1 | 2 | 3;
    specificity: 0 | 1 | 2 | 3;
  };
};

// Real Deepgram output carries genuine timing and confidence per word.
// Authored or typed-up fixtures have neither, so this fabricates plausible
// values: a flat rate of one word per 0.4 seconds (roughly conversational
// pace) and full confidence, since the harness is testing the rubric, not
// the transcription pipeline. `word` strips trailing punctuation the way
// Deepgram's raw field does, since `filler_count` reads `word`, not
// `punctuatedWord`.
export function synthesizeWordTimings(transcript: string): WordTiming[] {
  const WORD_DURATION_SECONDS = 0.4;

  return transcript
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((punctuatedWord, index) => ({
      word: punctuatedWord.toLowerCase().replace(/[^a-z']/g, ""),
      punctuatedWord,
      start: index * WORD_DURATION_SECONDS,
      end: (index + 1) * WORD_DURATION_SECONDS,
      confidence: 1,
    }));
}
