import type { AngleSlug } from "./angles";

// Phase 1 asks one question. The `question` table and question selection
// (S6/S8) arrive later; this is the single string used until then.
//
// Taken unchanged from the validation flow, which is the only wording real
// people have answered, so S3 calibration stays comparable with the validation
// arms.
//
// Two things it has to keep if it is ever reworded. It names no competency, so
// FR-6 holds (docs/05 section 1.1 bans leadership, teamwork and problem
// solving, and the preview screens' "worked in a team" announces the
// competency being assessed, which is what FR-6 exists to prevent). And it asks
// for an event rather than an opinion, which is what `structure` needs in order
// to find a situation, an action and a result.
export const PHASE_1_QUESTION =
  "Tell me about something you worked on with other people recently. What happened?";

// The real per-angle bank (docs/05 section 1.1, decision 46 in
// context/docs-review-decisions.md). Not wired into the answer route yet:
// question selection is S6/S8's job, which do not exist on main yet. This is
// the data those steps will select from.
//
// Approved by Deshan 2026-08-29. One plain question and one twist per angle,
// each asking for a single concrete episode (FR-5), none naming the angle's
// competency word (FR-6). Four of the twists (conflict, failure, initiative,
// teamwork) are unchanged from the examples already in docs/05 section 5.
export type AngleQuestions = {
  plain: string;
  twist: string;
};

export const QUESTION_BANK: Record<AngleSlug, AngleQuestions> = {
  conflict: {
    plain: "Tell me about a time you disagreed with someone you were working with.",
    twist: "Tell me about a disagreement where you turned out to be the one in the wrong.",
  },
  failure: {
    plain: "Tell me about something that didn't go to plan.",
    twist: "Tell me about something that did not go to plan and was your fault.",
  },
  initiative: {
    plain: "Tell me about something you started without being asked to.",
    twist: "Tell me about something you started that nobody thanked you for.",
  },
  teamwork: {
    plain: "Tell me about a time you worked with someone you found difficult.",
    twist: "Tell me about being the difficult one.",
  },
  leadership: {
    plain: "Tell me about a time you had to get a group of people moving in the same direction.",
    twist: "Tell me about a time that didn't work.",
  },
  pressure: {
    plain: "Tell me about a time you had very little time to get something done.",
    twist: "Tell me about a time you ran out of time anyway.",
  },
  ambiguity: {
    plain: "Tell me about a time nobody had told you exactly what to do.",
    twist: "Tell me about a time you guessed wrong about what was expected.",
  },
  persuasion: {
    plain: "Tell me about a time you got someone to change their mind.",
    twist: "Tell me about a time you couldn't get someone to change their mind.",
  },
  learning: {
    plain: "Tell me about something you had to figure out from scratch.",
    twist: "Tell me about something you had to figure out from scratch and still got wrong the first time.",
  },
};

// Guards against the exact failure the question bank most has to avoid: a
// question that announces the competency it is testing. Kept in sync with
// FR-6's named examples rather than every possible competency word, since
// those are the ones a reviewer is least likely to notice sneaking back in.
export const BANNED_COMPETENCY_WORDS = ["leadership", "teamwork", "problem solving"];
