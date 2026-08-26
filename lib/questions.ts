// Phase 1 asks one question. The `question` table, the per-angle bank in
// docs/05 section 5, and twists all arrive later; this is the single string
// that exists until then.
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
