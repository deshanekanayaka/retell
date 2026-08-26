"use client";

import { useState } from "react";
import { BrowserGate } from "@/components/BrowserGate";
import { PermissionScreen } from "@/components/PermissionScreen";
import { RecordingUI } from "@/components/RecordingUI";
import { PHASE_1_QUESTION } from "@/lib/questions";

export default function RecordPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  // PermissionScreen centres itself, so only the recording side needs the
  // wrapper. Without it the record and processing states sat at the top of the
  // page with the whole lower half empty.
  return (
    <BrowserGate>
      {stream ? (
        <div className="mx-auto flex min-h-screen w-full max-w-155 flex-col items-center justify-center gap-12 px-12 py-24 text-center">
          {/* Stays visible while recording. It is the thing being answered,
              not feedback, so docs/04 section 1.2's "the waveform is the only
              feedback during recording" does not cover it. The full
              question-ready composition is S6. */}
          <h1 className="max-w-[22ch] font-serif text-[42px] leading-tight text-ink">
            {PHASE_1_QUESTION}
          </h1>
          <RecordingUI stream={stream} recordingType="answer" />
        </div>
      ) : (
        <PermissionScreen onGranted={setStream} />
      )}
    </BrowserGate>
  );
}
