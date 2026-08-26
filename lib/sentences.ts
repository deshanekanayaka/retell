import type { WordTiming } from "./signals";

// A run of words forming one sentence, as positions in the word array.
// Deliberately carries no sentence number: it would duplicate the array
// position and could drift from it. The model-facing 1-based numbering exists
// only where it is needed, printing the prompt and resolving the reply.
export type Sentence = {
  startWord: number;
  endWord: number;
};

// docs/04 section 4.1 rules out finer cuts: splitting on commas as well would
// shred a sixty second answer into fragments and destroy the calm the rail
// treatment exists for.
const SENTENCE_TERMINATORS = [".", "?", "!"];

function endsSentence(punctuatedWord: string): boolean {
  return SENTENCE_TERMINATORS.some((terminator) => punctuatedWord.endsWith(terminator));
}

export function splitIntoSentences(wordTimings: WordTiming[]): Sentence[] {
  const sentences: Sentence[] = [];
  let startWord = 0;

  for (let i = 0; i < wordTimings.length; i++) {
    if (endsSentence(wordTimings[i].punctuatedWord)) {
      sentences.push({ startWord, endWord: i });
      startWord = i + 1;
    }
  }

  // Words left open past the last terminator are still speech the user
  // produced, so they close as their own sentence.
  if (startWord < wordTimings.length) {
    sentences.push({ startWord, endWord: wordTimings.length - 1 });
  }

  return sentences;
}
