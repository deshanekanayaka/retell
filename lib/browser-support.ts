// Feature-detect, never user-agent sniff: Chromium-based browsers (Edge, Opera,
// Brave, Samsung Internet) all include "Chrome" in their UA string, so matching
// on that would let unsupported browsers through. FR-34 needs Chrome/Chromium
// broadly, not a specific version, so this checks for User-Agent Client Hints
// (navigator.userAgentData) — currently Chromium-exclusive, unlike the
// <usermedia> element check this replaced (ADR-014), which pinned to Chrome 151+
// for no reason once <usermedia> itself was dropped.
export function isChromeSupported(navigatorObject: object): boolean {
  return "userAgentData" in navigatorObject;
}
