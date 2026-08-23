"use client";

import { useState } from "react";
import { BrowserGate } from "@/components/BrowserGate";
import { PermissionScreen } from "@/components/PermissionScreen";

export default function RecordPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  return (
    <BrowserGate>
      {stream ? (
        <p>Recording UI goes here next.</p>
      ) : (
        <PermissionScreen onGranted={setStream} />
      )}
    </BrowserGate>
  );
}
