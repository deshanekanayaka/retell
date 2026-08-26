import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { required } from "@/lib/env";
import { ANGLE_SLUGS, type AngleSlug } from "./angles";
import { resolveRails, type ResolvedRails } from "./rails";
import { splitIntoSentences, type Sentence } from "./sentences";
import type { WordTiming } from "./signals";

// The only file that knows which model provider is used (docs/02 section 3.2).
// Nothing else imports a provider SDK, so changing vendor is a change here and
// nowhere else.

const MODEL = "claude-opus-5";

// FR-20. Incremented by any change to the prompt or the anchors (docs/04
// section 3.4).
//
// Held at 1 for the duration of S3 calibration, decided by Deshan. The only
// answers evaluated so far are throwaway tuning reads by the founder, and
// incrementing per tweak would reach the cohort at version 6 with five
// versions nobody can compare against. Same reasoning section 3.4 used when
// the prompt was warmed. Freezes before any real user sees it; after that,
// every prompt edit increments.
const RUBRIC_VERSION = 1;

// Literal unions rather than min/max, so the scores arrive as a closed enum
// the API enforces rather than a number we have to range-check afterwards.
const score = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);

const sentenceRange = z.object({
  start: z.number().int().describe("First sentence number, counting from 1"),
  end: z.number().int().describe("Last sentence number, inclusive"),
});

// docs/04 section 3.3. The model returns positions, never text: a free text
// field would let it tidy a false start into a sentence the user never said,
// which would then be shown back as their own words (ADR-009).
const responseSchema = z.object({
  relevance: score,
  structure: score,
  specificity: score,
  gap: z.string().describe("One sentence, phrased as a question, about something absent"),
  angles: z.array(z.enum(ANGLE_SLUGS)),
  situation: sentenceRange.nullable(),
  action: sentenceRange.nullable(),
  result: sentenceRange.nullable(),
});

// Anchors reproduced verbatim from docs/04 section 3.2. Any edit here is a
// rubric change and increments RUBRIC_VERSION.
const SYSTEM_PROMPT = `You score one spoken answer to an interview practice question, and you locate its parts. The speaker is a final year student or recent graduate practising out loud. Their answer was transcribed from speech, so it contains filler words, false starts and repetition. That is normal and is never itself a fault.

Score three dimensions, 0 to 3, using these anchors exactly.

relevance
- 0: answered a different question entirely
- 1: touched the topic but did not address what was asked, or ignored the twist
- 2: addressed the question, with some drift
- 3: addressed exactly what was asked, twist included

structure
- 0: no discernible situation, action or result
- 1: one of the three present
- 2: two of the three present
- 3: all three present and in a followable order

specificity
- 0: entirely generic, could describe anyone
- 1: one concrete detail
- 2: several concrete details, but the speaker's own contribution is vague
- 3: concrete throughout, and clear about what the speaker personally did

Then locate the situation, the action and the result by sentence number.

- The transcript is given to you as numbered sentences. Refer to them by those numbers, counting from 1.
- Give each part one continuous range. If a part appears in several places, choose the longest run of speech carrying it.
- The three ranges must not overlap. A sentence belongs to at most one part.
- Sentences that belong to no part are fine, and most answers have some. Never widen a range to swallow a sentence that does not belong to that part just to reach one that does.
- If a part is not present in the answer, return null for it. Do not guess.

Rules that are not negotiable.

- Never rewrite, quote back, paraphrase or tidy the speaker's words. You return numbers only. The transcript shown to the user is their own recording, and any wording you invented would appear beside it as though they had said it.
- Never invent detail the speaker did not say, and never suggest what they could have said instead.
- gap is exactly one question about exactly one thing that is missing. Not two questions joined by "and", not a second ask appended to the first. The speaker answers this question out loud as their next attempt, and a double question gets half answered. If two things are missing, ask about the more important one and say nothing about the other.
- gap carries no praise, no compliment and no softener. "Really strong answer! What did you do?" is wrong on both halves: the praise is unearned and the question stops being taken seriously.
- Never state or imply that the answer is wrong. Weak, vague or unstructured are observations. Wrong is a verdict, and this product does not give one.
- Never comment on how long they spoke or how fast. You are not given that information and must not infer it.
- angles are the question types this answer could serve if it were reused as a story. Choose only from the nine provided. Choose none rather than a poor fit.`;

export type EvaluationInput = {
  questionText: string;
  wordTimings: WordTiming[];
};

export type Evaluation = {
  model: string;
  rubricVersion: number;
  relevance: number;
  structure: number;
  specificity: number;
  gap: string;
  angles: AngleSlug[];
  rails: ResolvedRails;
};

// Numbered from 1, because that is how lists are written and a model shown a
// list starting at 0 tends to renumber it in its head. The conversion back to
// array positions happens once, in lib/rails.ts.
function buildUserMessage(input: EvaluationInput, sentences: Sentence[]): string {
  const numbered = sentences
    .map((sentence, index) => {
      const text = input.wordTimings
        .slice(sentence.startWord, sentence.endWord + 1)
        .map((timing) => timing.punctuatedWord)
        .join(" ");
      return `${index + 1}. ${text}`;
    })
    .join("\n");

  return `The question they were asked:
${input.questionText}

Their answer, as numbered sentences:
${numbered}`;
}

async function requestEvaluation(userMessage: string) {
  const client = new Anthropic({
    apiKey: required("ANTHROPIC_API_KEY", process.env.ANTHROPIC_API_KEY),
  });

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: zodOutputFormat(responseSchema),
    },
    messages: [{ role: "user", content: userMessage }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error(`Evaluation refused: ${response.stop_details?.category ?? "unknown"}`);
  }

  if (!response.parsed_output) {
    throw new Error("Evaluation response did not match the schema");
  }

  return response.parsed_output;
}

export async function evaluateAnswer(input: EvaluationInput): Promise<Evaluation> {
  // Split once. The same sentences number the prompt and resolve the reply, so
  // recomputing would risk the two disagreeing as well as costing the work.
  const sentences = splitIntoSentences(input.wordTimings);
  const userMessage = buildUserMessage(input, sentences);

  // One retry. Timeouts and rate limits are usually transient and the user is
  // already watching a processing screen; a second attempt costs a few seconds
  // and catches most of them. Beyond that the caller degrades the screen rather
  // than showing an error (docs/04 section 5).
  let parsed;
  try {
    parsed = await requestEvaluation(userMessage);
  } catch {
    parsed = await requestEvaluation(userMessage);
  }

  const { rails, drops } = resolveRails(
    { situation: parsed.situation, action: parsed.action, result: parsed.result },
    sentences
  );

  // Logged, not stored. A dropped rail and an unclaimed one are both NULL in
  // the database, so without this there is no way to tell whether the
  // fixed-order rule in rails.ts is costing users their result rail.
  if (drops.length > 0) {
    console.warn("[evaluate] rails dropped", { drops, sentenceCount: sentences.length });
  }

  return {
    model: MODEL,
    rubricVersion: RUBRIC_VERSION,
    relevance: parsed.relevance,
    structure: parsed.structure,
    specificity: parsed.specificity,
    gap: parsed.gap,
    angles: parsed.angles,
    rails,
  };
}
