"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { isChromeSupported } from "@/lib/browser-support";

type GateStatus = "checking" | "supported" | "unsupported";

// Chrome/Chromium support never changes during a session, so there's nothing
// to subscribe to — useSyncExternalStore is used purely to read window safely
// without the server/client mismatch a direct render-time check would cause.
function subscribe() {
  return () => {};
}

function getSnapshot(): GateStatus {
  return isChromeSupported(navigator) ? "supported" : "unsupported";
}

function getServerSnapshot(): GateStatus {
  return "checking";
}

export function BrowserGate({ children }: { children: ReactNode }) {
  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (status === "checking") {
    return null;
  }

  if (status === "unsupported") {
    return (
      <div>
        <h1>This needs Chrome</h1>
        <p>
          Retell only works in Chrome or a Chromium-based browser (like Edge
          or Brave) right now. Open this page there to continue.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
