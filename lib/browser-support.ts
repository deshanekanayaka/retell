// Feature-detect, never user-agent sniff: Chromium-based browsers (Edge, Opera,
// Brave, Samsung Internet) all include "Chrome" in their UA string, so matching
// on that would let unsupported browsers through. docs/04-voice-and-evaluation.md
// section 1.1.
export function isChromeSupported(globalObject: object): boolean {
  return "HTMLUserMediaElement" in globalObject;
}
