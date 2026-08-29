export type WordTiming = {
  word: string;
  // The same word carrying Deepgram's punctuation and capitalisation. Added
  // alongside `word` rather than replacing it: `filler_count` is a contract
  // (docs/04 section 2) and reads `word`, so it must not move when sentence
  // splitting starts reading `punctuatedWord`.
  punctuatedWord: string;
  start: number;
  end: number;
};

export function computeDurationMs(durationSeconds: number): number {
  return Math.round(durationSeconds * 1000);
}

export function computeWordsPerMinute(wordCount: number, durationMs: number): number {
  if (durationMs <= 0) {
    return 0;
  }

  const durationMinutes = durationMs / 60_000;
  return Math.round(wordCount / durationMinutes);
}

export function computeLongestPauseMs(wordTimings: WordTiming[]): number {
  let longestPauseSeconds = 0;

  for (let i = 1; i < wordTimings.length; i++) {
    const gapSeconds = wordTimings[i].start - wordTimings[i - 1].end;
    longestPauseSeconds = Math.max(longestPauseSeconds, gapSeconds);
  }

  return Math.round(longestPauseSeconds * 1000);
}

// FR-10: under this floor an answer is not scored and not saved as a story.
// A fact about the audio, not a judgement, which is why it is checked here
// rather than folded into the rubric.
export const MIN_SCORABLE_DURATION_MS = 15_000;

export function isTooShortToScore(durationMs: number): boolean {
  return durationMs < MIN_SCORABLE_DURATION_MS;
}

// Fixed by docs/04-voice-and-evaluation.md section 2: a contract, not a
// tuning knob. Changing it changes historical comparability and needs an
// ADR plus a rubric_version bump.
export const FILLER_WORDS = [
  "um",
  "uh",
  "er",
  "erm",
  "like",
  "you know",
  "i mean",
  "basically",
  "actually",
];

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "");
}

export function computeFillerCount(wordTimings: WordTiming[]): number {
  const normalized = wordTimings.map((timing) => normalize(timing.word));
  const singleWordFillers = new Set(FILLER_WORDS.filter((filler) => !filler.includes(" ")));
  const multiWordFillers = FILLER_WORDS.filter((filler) => filler.includes(" ")).map((filler) =>
    filler.split(" ")
  );

  let count = 0;
  let i = 0;
  while (i < normalized.length) {
    const multiMatch = multiWordFillers.find((phrase) =>
      phrase.every((phraseWord, offset) => normalized[i + offset] === phraseWord)
    );

    if (multiMatch) {
      count++;
      i += multiMatch.length;
      continue;
    }

    if (singleWordFillers.has(normalized[i])) {
      count++;
    }
    i++;
  }

  return count;
}
