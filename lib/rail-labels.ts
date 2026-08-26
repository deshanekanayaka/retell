import type { RailPart } from "./rails";

// docs/04 section 4.1 owns this wording. Plain labels, never the framework
// words: naming STAR invites the user to notice Task is absent and conclude
// the product has the framework wrong, rather than that it deliberately marks
// three parts.
//
// Shared rather than duplicated because section 4.1 has already renamed these
// once, and two copies means the next rename silently misses one.
export const RAIL_LABELS: Record<RailPart, string> = {
  situation: "the setting",
  action: "what you did",
  result: "how it ended",
};
