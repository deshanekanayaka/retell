"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type PermissionOutcome = "idle" | "notGranted";

// getUserMedia() can't distinguish a deliberate block from a dismissed
// prompt: both reject with NotAllowedError (ADR-014), so both are handled
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

  if (outcome === "notGranted") {
    return (
      <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-6 px-12 py-24">
        <p className="max-w-[56ch] font-sans text-base leading-[1.55] text-ink-soft">
          No problem. Whenever you&apos;re ready, tap the button again.
        </p>

        <Button onClick={requestMicrophone}>Turn on my microphone</Button>

        {question && (
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
              The question you would have answered
            </span>
            <p className="font-serif text-[22px] leading-[1.3] text-ink">{question}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 rounded border border-dashed border-muted bg-surface p-4">
          <span className="self-start rounded border border-muted px-2 py-1 font-sans text-[13px] font-medium tracking-wide text-ink-soft">
            Fictional example answer
          </span>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded-sm bg-rule" />
            <div className="h-3 w-[92%] rounded-sm bg-rule" />
            <div className="h-3 w-[60%] rounded-sm bg-rule" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-8 px-12 py-24">
      <h1 className="max-w-[20ch] font-serif text-[34px] leading-tight text-ink">
        You&apos;ll be saying this out loud.
      </h1>
      <div className="flex max-w-[56ch] flex-col gap-4 font-sans text-base leading-[1.55] text-ink-soft">
        <p>It&apos;s allowed to come out messy. That&apos;s what practice is for.</p>
        <p>Your recordings stay on your account. Nobody else hears them.</p>
        <p>The first one is only a mic check. It doesn&apos;t count for anything.</p>
      </div>

      <Button onClick={requestMicrophone}>Turn on my microphone</Button>
    </div>
  );
}
