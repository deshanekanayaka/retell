"use client";

import { useState } from "react";

type PermissionOutcome = "idle" | "notGranted";

// getUserMedia() can't distinguish a deliberate block from a dismissed
// prompt — both reject with NotAllowedError (ADR-014) — so both are handled
// the same way here, one flat outcome rather than a denied/dismissed split.
export function PermissionScreen({
  question,
  onGranted,
}: {
  question?: string;
  onGranted: (stream: MediaStream) => void;
}) {
  const [outcome, setOutcome] = useState<PermissionOutcome>("idle");

  async function requestMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      onGranted(stream);
    } catch {
      setOutcome("notGranted");
    }
  }

  return (
    <div>
      <h1>You&apos;ll be speaking out loud.</h1>
      <p>That&apos;s the point. Interview answers live in your mouth, not on a page.</p>
      <p>Your recordings stay on your account. Nobody else hears them.</p>
      <p>The first one doesn&apos;t count. It&apos;s a mic check.</p>

      <button type="button" onClick={requestMicrophone}>
        Turn on my microphone
      </button>

      {outcome === "notGranted" && (
        <div>
          <p>
            You can turn it on whenever you&apos;re ready. Tap the button
            above again when you want to try.
          </p>
          {question && <p>{question}</p>}
        </div>
      )}
    </div>
  );
}
