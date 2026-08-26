import { describe, expect, it } from "vitest";
import { splitIntoSentences } from "./sentences";
import type { WordTiming } from "./signals";

// Sentence splitting only reads punctuatedWord, so timings are placeholders.
// `word` is derived the way Deepgram derives it, stripped of punctuation, to
// keep fixtures honest rather than identical in both fields.
function words(punctuated: string[]): WordTiming[] {
  return punctuated.map((punctuatedWord, i) => ({
    word: punctuatedWord.toLowerCase().replace(/[^a-z']/g, ""),
    punctuatedWord,
    start: i,
    end: i + 0.5,
  }));
}

describe("splitIntoSentences", () => {
  it("returns one sentence spanning every word when the answer is a single sentence", () => {
    const result = splitIntoSentences(words(["I", "set", "up", "a", "doc."]));

    expect(result).toEqual([{ startWord: 0, endWord: 4 }]);
  });

  it("cuts a new sentence after each full stop", () => {
    const result = splitIntoSentences(
      words(["I", "set", "up", "a", "doc.", "Then", "I", "messaged", "everyone."])
    );

    expect(result).toEqual([
      { startWord: 0, endWord: 4 },
      { startWord: 5, endWord: 8 },
    ]);
  });

  it("cuts on question marks and exclamation marks too", () => {
    const result = splitIntoSentences(
      words(["Did", "it", "work?", "Honestly!", "We", "shipped", "on", "time."])
    );

    expect(result).toEqual([
      { startWord: 0, endWord: 2 },
      { startWord: 3, endWord: 3 },
      { startWord: 4, endWord: 7 },
    ]);
  });

  it("closes a trailing fragment as its own sentence rather than dropping or merging it", () => {
    // FR-18 stops recording dead at 60 seconds, so anyone using the full
    // minute ends mid-sentence. Merging the fragment into the previous
    // sentence would put one rail across two different parts of the answer;
    // dropping it would lose words the user said (docs/04 section 5).
    const result = splitIntoSentences(
      words(["I", "set", "up", "a", "doc.", "Then", "we", "handed", "it"])
    );

    expect(result).toEqual([
      { startWord: 0, endWord: 4 },
      { startWord: 5, endWord: 8 },
    ]);
  });

  it("returns one sentence spanning everything when there is no punctuation at all", () => {
    // Degraded transcription rather than a reason to fail. The evaluation
    // still produces scores, a gap and angles; the answer just gets at most
    // one rail, and docs/04 section 4.1 already treats a missing rail as a
    // silent, legitimate outcome.
    const result = splitIntoSentences(words(["so", "we", "just", "kept", "going", "and"]));

    expect(result).toEqual([{ startWord: 0, endWord: 5 }]);
  });

  it("returns nothing for an empty word list", () => {
    expect(splitIntoSentences([])).toEqual([]);
  });

  it("does not cut inside a decimal, where the full stop is not terminal", () => {
    // Guards the obvious wrong refactor, punctuatedWord.includes("."), which
    // would split "2.5" into its own sentence boundary.
    const result = splitIntoSentences(words(["it", "took", "2.5", "weeks", "total."]));

    expect(result).toEqual([{ startWord: 0, endWord: 4 }]);
  });
});
