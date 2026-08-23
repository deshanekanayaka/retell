import { describe, expect, it } from "vitest";
import { isChromeSupported } from "./browser-support";

describe("isChromeSupported", () => {
  it("returns true when the Chrome-only feature is present", () => {
    expect(isChromeSupported({ HTMLUserMediaElement: class {} })).toBe(true);
  });

  it("returns false when the Chrome-only feature is missing", () => {
    expect(isChromeSupported({})).toBe(false);
  });
});
