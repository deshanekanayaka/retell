"use client";

import { useState } from "react";
import { BrowserGate } from "@/components/BrowserGate";
import { PermissionScreen } from "@/components/PermissionScreen";
import { RecordingUI } from "@/components/RecordingUI";
import type { RecordingStatus } from "@/lib/recording-state";

const QUESTION =
  "Tell me about something you worked on with other people recently. What happened?";
const MIC_CHECK_SENTENCE = "I'm here because I have an interview coming up.";

type Step = "micCheck" | "question" | "feedback";

// Processing (09) is its own isolated screen in the wireframe, nothing else
// on it, so the question above RecordingUI hides once it gets there,
// instead of leaving stale header content sitting above the sweep.
const HEADER_HIDDEN_STATUSES: RecordingStatus[] = ["uploading", "done"];

export function ValidationFlow({ arm }: { arm: "a" | "b" }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [step, setStep] = useState<Step>(arm === "a" ? "micCheck" : "question");
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("idle");
  const showHeader = !HEADER_HIDDEN_STATUSES.includes(recordingStatus);

  return (
    <BrowserGate>
      {!stream && <PermissionScreen question={QUESTION} onGranted={setStream} />}

      {stream && step === "micCheck" && (
        <div className="mx-auto flex min-h-screen max-w-155 flex-col items-center justify-center gap-12 px-12 py-24 text-center">
          {showHeader && (
            <div className="flex flex-col items-center gap-3">
              <p className="font-sans text-base text-ink-soft">
                Read this out loud so I can check your mic:
              </p>
              <p className="max-w-[24ch] font-serif text-[38px] italic leading-[1.3] text-ink">
                {MIC_CHECK_SENTENCE}
              </p>
              <p className="font-sans text-sm text-muted">Nothing here is saved as an answer.</p>
            </div>
          )}
          <RecordingUI
            stream={stream}
            recordingType="mic_check"
            onDone={() => setStep("question")}
            onStatusChange={setRecordingStatus}
          />
        </div>
      )}

      {stream && step === "question" && (
        <div className="mx-auto flex min-h-screen max-w-155 flex-col items-center justify-center gap-12 px-12 py-24 text-center">
          {showHeader && (
            <p className="max-w-[22ch] font-serif text-[42px] leading-tight text-ink">
              {QUESTION}
            </p>
          )}
          <RecordingUI
            stream={stream}
            recordingType={arm === "a" ? "validation_a" : "validation_b"}
            onDone={() => setStep("feedback")}
            onStatusChange={setRecordingStatus}
          />
        </div>
      )}

      {stream && step === "feedback" && (
        <div className="mx-auto flex min-h-screen max-w-155 flex-col items-center justify-center px-12 py-24 text-center">
          <p className="font-sans text-base text-ink-soft">
            Thanks for trying this out. That&apos;s everything for now.
          </p>
        </div>
      )}
    </BrowserGate>
  );
}
