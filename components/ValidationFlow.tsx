"use client";

import { useState } from "react";
import { BrowserGate } from "@/components/BrowserGate";
import { PermissionScreen } from "@/components/PermissionScreen";
import { RecordingUI } from "@/components/RecordingUI";

const QUESTION =
  "Tell me about something you worked on with other people recently. What happened?";
const MIC_CHECK_SENTENCE = "I'm here because I have an interview coming up.";

type Step = "micCheck" | "question" | "feedback";

export function ValidationFlow({ arm }: { arm: "a" | "b" }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [step, setStep] = useState<Step>(arm === "a" ? "micCheck" : "question");

  return (
    <BrowserGate>
      {!stream && <PermissionScreen question={QUESTION} onGranted={setStream} />}

      {stream && step === "micCheck" && (
        <div>
          <p>
            Read this out loud so I can check your mic:{" "}
            <em>&quot;{MIC_CHECK_SENTENCE}&quot;</em>
          </p>
          <RecordingUI
            stream={stream}
            recordingType="mic_check"
            onDone={() => setStep("question")}
          />
        </div>
      )}

      {stream && step === "question" && (
        <div>
          <p>{QUESTION}</p>
          <RecordingUI
            stream={stream}
            recordingType={arm === "a" ? "validation_a" : "validation_b"}
            onDone={() => setStep("feedback")}
          />
        </div>
      )}

      {stream && step === "feedback" && <p>Thanks for trying this out. That&apos;s everything for now.</p>}
    </BrowserGate>
  );
}
