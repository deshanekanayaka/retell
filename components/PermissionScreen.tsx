"use client";

import { useEffect, useRef, useState } from "react";

type PermissionOutcome = "idle" | "denied";

export function PermissionScreen({
  question,
  onGranted,
}: {
  question?: string;
  onGranted: (stream: MediaStream) => void;
}) {
  const elementRef = useRef<HTMLUserMediaElement>(null);
  const [outcome, setOutcome] = useState<PermissionOutcome>("idle");

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    element.setConstraints({ audio: {} });

    function handleStream() {
      const stream = elementRef.current?.stream;
      if (stream) {
        onGranted(stream);
      }
    }

    function handleError() {
      setOutcome("denied");
    }

    // "cancel" (dismissal) intentionally has no handler: docs/04 says change
    // nothing and say nothing on dismissal, so there's nothing to wire up.
    element.addEventListener("stream", handleStream);
    element.addEventListener("error", handleError);

    return () => {
      element.removeEventListener("stream", handleStream);
      element.removeEventListener("error", handleError);
    };
  }, [onGranted]);

  return (
    <div>
      <h1>You&apos;ll be speaking out loud.</h1>
      <p>That&apos;s the point. Interview answers live in your mouth, not on a page.</p>
      <p>Your recordings stay on your account. Nobody else hears them.</p>
      <p>The first one doesn&apos;t count. It&apos;s a mic check.</p>

      <usermedia ref={elementRef}>
        <button type="button">Turn on my microphone</button>
      </usermedia>

      {outcome === "denied" && (
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
