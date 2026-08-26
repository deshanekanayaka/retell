// The angle slugs from docs/05-spaced-repetition.md section 1.1.
//
// A contract: adding one is fine, renaming one invalidates every item pointing
// at it and needs an ADR plus a migration. Enforced in three places, which is
// why they live here rather than inside any one of them: the evaluation
// response schema, the `evaluation.angles` check constraint in the database,
// and lib/angles.test.ts.
//
// Deliberately not in lib/evaluate.ts. These are domain vocabulary, not model
// provider knowledge, and putting them there made the Supabase layer import
// the module that holds the Anthropic SDK just to name a type.
export const ANGLE_SLUGS = [
  "conflict",
  "failure",
  "initiative",
  "teamwork",
  "leadership",
  "pressure",
  "ambiguity",
  "persuasion",
  "learning",
] as const;

export type AngleSlug = (typeof ANGLE_SLUGS)[number];
