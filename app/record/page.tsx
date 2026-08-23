"use client";

import { useState } from "react";
import { BrowserGate } from "@/components/BrowserGate";
import { PermissionScreen } from "@/components/PermissionScreen";
import { RecordingUI } from "@/components/RecordingUI";

export default function RecordPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  return (
    <BrowserGate>
      {stream ? (
        <RecordingUI stream={stream} recordingType="answer" />
      ) : (
        <PermissionScreen onGranted={setStream} />
      )}
    </BrowserGate>
  );
}
