import { describe, expect, it } from "vitest";
import { isValidGap } from "./gap";

describe("isValidGap", () => {
  it("accepts a plain single question within the length cap", () => {
    expect(isValidGap("How did it end?", "we worked on it for a while")).toBe(true);
  });

  it("rejects a gap that does not end in a question mark", () => {
    expect(isValidGap("You should say how it ended.", "we worked on it")).toBe(false);
  });

  it("rejects a double-barrelled question", () => {
    expect(
      isValidGap(
        "What did you do, and how did the team react?",
        "we worked on it for a while"
      )
    ).toBe(false);
  });

  it("rejects a gap over the length cap", () => {
    const long = "How did it end, and could you also mention ".padEnd(150, "a") + "?";
    expect(isValidGap(long, "we worked on it")).toBe(false);
  });

  it("rejects a gap that invents a number the speaker never said", () => {
    expect(
      isValidGap("Could you say more about the two people who joined later?", "we worked on it")
    ).toBe(false);
  });

  it("accepts a gap whose number appears in the transcript", () => {
    expect(
      isValidGap(
        "What happened with the other two people?",
        "there were four of us, two of them stopped replying"
      )
    ).toBe(true);
  });

  it("rejects an empty gap", () => {
    expect(isValidGap("", "we worked on it")).toBe(false);
    expect(isValidGap("   ", "we worked on it")).toBe(false);
  });
});
