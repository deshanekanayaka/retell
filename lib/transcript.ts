import type { ResolvedRails } from "./rails";
import type { WordTiming } from "./signals";

// Turns stored rail positions back into something renderable: the whole
// transcript in order, cut into runs, each run either claimed by one part or
// claimed by none. Every word appears exactly once, because the feedback
// screen shows the user's complete answer and the rails only annotate it
// (docs/04 section 4.1).

export type TranscriptSegment = {
  label: keyof ResolvedRails | null;
  text: string;
};

// Which part owns a given word, if any. Rails never overlap by the time they
// are stored, so the first match is the only match.
function labelAt(position: number, rails: ResolvedRails): keyof ResolvedRails | null {
  for (const part of ["situation", "action", "result"] as const) {
    const range = rails[part];
    if (range && position >= range.startWord && position <= range.endWord) {
      return part;
    }
  }

  return null;
}

export function toTranscriptSegments(
  wordTimings: WordTiming[],
  rails: ResolvedRails
): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];

  for (let position = 0; position < wordTimings.length; position++) {
    const label = labelAt(position, rails);
    const previous = segments[segments.length - 1];

    if (previous && previous.label === label) {
      previous.text = `${previous.text} ${wordTimings[position].punctuatedWord}`;
      continue;
    }

    segments.push({ label, text: wordTimings[position].punctuatedWord });
  }

  return segments;
}
