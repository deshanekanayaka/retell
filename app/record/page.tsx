"use client";

import { useState } from "react";
import { BrowserGate } from "@/components/BrowserGate";
import { PermissionScreen } from "@/components/PermissionScreen";
import { RecordingUI } from "@/components/RecordingUI";

export default function RecordPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  // PermissionScreen centres itself, so only the recording side needs the
  // wrapper. Without it the record and processing states sat at the top of the
  // page with the whole lower half empty.
  return (
    <BrowserGate>
      {stream ? (
        <div className="mx-auto flex min-h-screen w-full max-w-155 flex-col items-center justify-center px-12 py-24">
          <RecordingUI stream={stream} recordingType="answer" />
        </div>
      ) : (
        <PermissionScreen onGranted={setStream} />
      )}
    </BrowserGate>
  );
}
