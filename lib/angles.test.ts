import { describe, expect, it } from "vitest";
import { ANGLE_SLUGS } from "./angles";

describe("ANGLE_SLUGS", () => {
  it("pins the exact nine slugs docs/05-spaced-repetition.md section 1.1 states", () => {
    // Deliberately written out rather than derived, the same way
    // signals.test.ts pins the filler list. Adding a slug is allowed and this
    // test is the place to record it; renaming one invalidates every item
    // pointing at it and needs an ADR plus a migration. Either way it should
    // fail loudly here rather than pass by construction.
    expect(ANGLE_SLUGS).toEqual([
      "conflict",
      "failure",
      "initiative",
      "teamwork",
      "leadership",
      "pressure",
      "ambiguity",
      "persuasion",
      "learning",
    ]);
  });

  it("matches the slugs the database check constraint allows", () => {
    // supabase/migrations/20260825213449_evaluation.sql enforces the same nine.
    // Two enforcement points means two places to drift, so this pins them
    // together: a slug added here without the migration would insert-fail in
    // production rather than in CI.
    const inMigration = [
      "conflict",
      "failure",
      "initiative",
      "teamwork",
      "leadership",
      "pressure",
      "ambiguity",
      "persuasion",
      "learning",
    ];

    expect([...ANGLE_SLUGS].sort()).toEqual([...inMigration].sort());
  });
});
