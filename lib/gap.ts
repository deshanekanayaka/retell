// docs/04 section 3.4: `gap` is the one field the model returns as free text,
// which makes it the one field that can break ADR-009 in front of a user. The
// prompt says exactly one question, plain, no invented detail; this is the
// code-level backstop, since a prompt is a request, not a guarantee.
//
// What this can and cannot catch: shape is fully checkable (a question,
// short, not two questions stapled together). Content is only partly
// checkable. "No invented detail" in general needs judgement a regex does
// not have; the one concrete piece this does check is numbers, since an
// invented number is a common, unambiguous failure mode. Names and other
// invented specifics are not caught here; that risk is covered by the
// evaluation harness's CI assertions instead, run against known fixtures.

const MAX_GAP_LENGTH = 140;

// A double-barrelled question typically still ends in one "?", the docs/04
// section 3.4 example that motivated this check does: "Which section did you
// take on yourself, and what did you do about the teammate who stopped
// replying?" Counting question marks does not catch that shape. This does,
// tied to the exact pattern the prompt is told to avoid: a second clause
// joined by "and" that itself starts a new question.
const SECOND_QUESTION_CLAUSE = new RegExp(
  String.raw`,\s*and\s+(who|what|when|where|why|how|which|did|do|does|could|would|is|are)\b`,
  "i"
);

// Covers the small numbers a short spoken answer actually produces. Not
// exhaustive by design, digits alone would almost never fire, since real
// speech spells numbers out; this is a safety net, not a parser.
const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "hundred",
];

function extractNumbers(text: string): string[] {
  const digits = text.match(/\d+/g) ?? [];
  const words = text
    .toLowerCase()
    .match(new RegExp(`\\b(${NUMBER_WORDS.join("|")})\\b`, "g"));
  return [...digits, ...(words ?? [])];
}

export function isValidGap(gap: string, transcript: string): boolean {
  const trimmed = gap.trim();

  if (trimmed.length === 0 || trimmed.length > MAX_GAP_LENGTH) {
    return false;
  }

  if (!trimmed.endsWith("?")) {
    return false;
  }

  const questionMarks = trimmed.match(/\?/g) ?? [];
  if (questionMarks.length !== 1) {
    return false;
  }

  if (SECOND_QUESTION_CLAUSE.test(trimmed)) {
    return false;
  }

  const transcriptNumbers = new Set(extractNumbers(transcript));
  const gapNumbers = extractNumbers(trimmed);
  if (gapNumbers.some((number) => !transcriptNumbers.has(number))) {
    return false;
  }

  return true;
}
