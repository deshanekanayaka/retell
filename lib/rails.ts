import type { Sentence } from "./sentences";

// What the model claims, in the one-based sentence numbers the prompt printed.
export type SentenceRange = {
  start: number;
  end: number;
};

export type RailClaims = {
  situation: SentenceRange | null;
  action: SentenceRange | null;
  result: SentenceRange | null;
};

// What the screen draws: positions in the stored word array, inclusive.
export type WordRange = {
  startWord: number;
  endWord: number;
};

export type ResolvedRails = {
  situation: WordRange | null;
  action: WordRange | null;
  result: WordRange | null;
};

export type RailPart = "situation" | "action" | "result";

// A dropped rail and an unclaimed one are both NULL in the database, so the
// difference only survives if it is reported here. Logged rather than stored:
// step 8 reads 15 to 20 answers by hand, and a column can be added later if
// drops turn out to be common.
export type RailDrop = {
  part: RailPart;
  reason: "out_of_range" | "overlap";
};

export type RailResolution = {
  rails: ResolvedRails;
  drops: RailDrop[];
};

// An out-of-range number is not a near miss to be clamped. It means the
// model's sentence numbering does not match ours, so its other numbers cannot
// be trusted either, and a rail resolved from a shifted index renders
// correctly over the wrong words.
function isWithinRange(claimed: SentenceRange, sentenceCount: number): boolean {
  return (
    Number.isInteger(claimed.start) &&
    Number.isInteger(claimed.end) &&
    claimed.start >= 1 &&
    claimed.end <= sentenceCount &&
    claimed.start <= claimed.end
  );
}

// The single place one-based model numbering becomes a zero-based array
// position. Scattering this conversion is how a rail ends up one sentence off,
// which is the only failure in this design that renders correctly while being
// wrong.
function toWordRange(claimed: SentenceRange, sentences: Sentence[]): WordRange {
  return {
    startWord: sentences[claimed.start - 1].startWord,
    endWord: sentences[claimed.end - 1].endWord,
  };
}

function overlapsClaimed(claimed: SentenceRange, claimedSentences: Set<number>): boolean {
  for (let sentence = claimed.start; sentence <= claimed.end; sentence++) {
    if (claimedSentences.has(sentence)) {
      return true;
    }
  }

  return false;
}

// Fixed order, not a preference: it makes the outcome deterministic and needs
// no tiebreak. The cost is that `result` is the rail systematically lost when
// the model contradicts itself, which is worth watching once there is real
// data on how often that happens.
const PART_ORDER: RailPart[] = ["situation", "action", "result"];

export function resolveRails(claims: RailClaims, sentences: Sentence[]): RailResolution {
  const rails: ResolvedRails = { situation: null, action: null, result: null };
  const drops: RailDrop[] = [];

  // One sentence means no structure was detected. A lone rail labelled "the
  // setting" down a whole answer would read as "you never said what you did",
  // which is our transcription defect stated as a claim about the user
  // (docs/04 section 4.1).
  if (sentences.length < 2) {
    return { rails, drops };
  }

  const claimedSentences = new Set<number>();

  for (const part of PART_ORDER) {
    const claimed = claims[part];

    // Not claimed at all is not a drop. Counting it as one would overstate how
    // often our own rules are costing the user a rail.
    if (!claimed) {
      continue;
    }

    if (!isWithinRange(claimed, sentences.length)) {
      drops.push({ part, reason: "out_of_range" });
      continue;
    }

    if (overlapsClaimed(claimed, claimedSentences)) {
      drops.push({ part, reason: "overlap" });
      continue;
    }

    for (let sentence = claimed.start; sentence <= claimed.end; sentence++) {
      claimedSentences.add(sentence);
    }

    rails[part] = toWordRange(claimed, sentences);
  }

  return { rails, drops };
}
