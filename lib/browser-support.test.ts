import { describe, expect, it } from "vitest";
import { isChromeSupported } from "./browser-support";

describe("isChromeSupported", () => {
  it("returns true when userAgentData is present", () => {
    expect(isChromeSupported({ userAgentData: {} })).toBe(true);
  });

  it("returns false when userAgentData is missing", () => {
    expect(isChromeSupported({})).toBe(false);
  });
});
