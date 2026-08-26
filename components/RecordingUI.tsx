"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useReducer, useState } from "react";
import { Waveform } from "@/components/Waveform";
import { Button } from "@/components/ui/Button";
import { RecordControl } from "@/components/ui/RecordControl";
import {
  initialRecordingState,
  recordingReducer,
  type RecordingStatus,
} from "@/lib/recording-state";
import { createRecordingRow, type RecordingType } from "@/lib/supabase/recordings";
import { createSignedUploadUrl } from "@/lib/supabase/storage";
import { uploadToSignedUrl } from "@/lib/supabase/upload";

const RECORDING_SECONDS = 60;

const STATUS_ANNOUNCEMENTS: Record<RecordingStatus, string> = {
  idle: "",
  recording: "Recording. About a minute.",
  review: "Recording stopped.",
  uploading: "Saving your answer.",
  done: "Saved.",
};

// One take's MediaRecorder lifecycle, isolated in its own component so a
// restart is a clean remount (a fresh key from the parent) rather than a
// manual state reset. Sidesteps both the "reset local state on dependency
// change" anti-pattern and, via the stoppedIntentionally guard, a discarded
// take's late-firing onstop from ever reaching the parent.
function RecordingTake({
  stream,
  onStopped,
}: {
  stream: MediaStream;
  onStopped: (blob: Blob) => void;
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(RECORDING_SECONDS);
  const requestStopRef = useRef<() => void>(() => {});

  useEffect(() => {
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream);
    let stoppedIntentionally = false;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      if (stoppedIntentionally) {
        onStopped(new Blob(chunks, { type: recorder.mimeType }));
      }
    };

    requestStopRef.current = () => {
      if (recorder.state === "recording") {
        stoppedIntentionally = true;
        recorder.stop();
      }
    };

    recorder.start();

    return () => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  }, [stream, onStopped]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((seconds) => {
        if (seconds <= 1) {
          requestStopRef.current();
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {/* The red dot is the only live-red in the product outside a delete
              flow (docs/07 3.2). It carries no meaning colour alone must
              carry, so the countdown text beside it states the same fact. */}
          <div className="h-2 w-2 rounded-full bg-live" aria-hidden="true" />
          <span className="font-sans text-[22px] leading-none tabular-nums text-ink-soft">
            {secondsRemaining}
          </span>
        </div>
        <span className="font-sans text-[13px] leading-tight text-muted">
          about {secondsRemaining} seconds remaining
        </span>
      </div>

      <Waveform stream={stream} active />

      <RecordControl state="recording" label="Stop" onClick={() => requestStopRef.current()} />
    </div>
  );
}

export function RecordingUI({
  stream,
  recordingType,
  onDone,
  onStatusChange,
}: {
  stream: MediaStream;
  recordingType: RecordingType;
  onDone?: () => void;
  onStatusChange?: (status: RecordingStatus) => void;
}) {
  const [state, dispatch] = useReducer(recordingReducer, initialRecordingState);
  const blobRef = useRef<Blob | null>(null);
  const [uploadFailed, setUploadFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onStatusChange?.(state.status);
    if (state.status === "done") {
      onDone?.();
    }
  }, [state.status, onDone, onStatusChange]);

  function handleStopped(blob: Blob) {
    blobRef.current = blob;
    dispatch({ type: "stop" });
  }

  async function handleSubmit() {
    dispatch({ type: "submit" });
    setUploadFailed(false);

    try {
      const blob = blobRef.current;
      if (!blob) {
        throw new Error("No recording to submit");
      }

      const { path, token } = await createSignedUploadUrl();
      await uploadToSignedUrl(path, token, blob);

      if (recordingType === "answer") {
        const response = await fetch("/api/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path }),
        });
        if (!response.ok) {
          throw new Error("Answer processing failed");
        }

        const { attemptId } = await response.json();
        if (typeof attemptId !== "string") {
          throw new Error("Answer processing returned no attempt");
        }

        // Deliberately stays in `uploading` rather than dispatching success
        // first. The sweep keeps running until the feedback screen paints, so
        // there is no flash of "Done. Thank you." between an answer and the
        // feedback it was recorded for.
        router.push(`/feedback/${attemptId}`);
        return;
      }

      await createRecordingRow(recordingType, path);
      dispatch({ type: "uploadSucceeded" });
    } catch {
      setUploadFailed(true);
      dispatch({ type: "uploadFailed" });
    }
  }

  // A stable status region, rendered in every state so repeated polite
  // announcements land reliably. It carries state transitions only, never the
  // ticking countdown, which would announce once a second.
  const statusRegion = (
    <p role="status" aria-live="polite" className="sr-only">
      {STATUS_ANNOUNCEMENTS[state.status]}
    </p>
  );

  if (state.status === "idle") {
    const label = recordingType === "mic_check" ? "Read it out loud" : "Start recording";
    return (
      <>
        {statusRegion}
        <RecordControl state="idle" label={label} onClick={() => dispatch({ type: "start" })} />
      </>
    );
  }

  if (state.status === "recording") {
    return (
      <div className="flex flex-col items-center gap-6">
        {statusRegion}
        <RecordingTake key={state.take} stream={stream} onStopped={handleStopped} />
        <Button variant="secondary" onClick={() => dispatch({ type: "restart" })}>
          Start again
        </Button>
      </div>
    );
  }

  if (state.status === "review") {
    return (
      <div className="flex flex-col items-center gap-6">
        {statusRegion}
        <p className="font-sans text-base text-ink-soft">Review your answer.</p>
        {uploadFailed && (
          <p className="font-sans text-base text-ink-soft">
            That didn&apos;t upload. Your recording is still here, try again.
          </p>
        )}
        <Button onClick={handleSubmit}>Submit</Button>
        <Button variant="secondary" onClick={() => dispatch({ type: "restart" })}>
          Start again
        </Button>
      </div>
    );
  }

  if (state.status === "uploading") {
    return (
      <div className="flex flex-col items-center gap-6 px-12">
        {statusRegion}
        <p className="font-sans text-base text-ink-soft">Give me a few seconds with that.</p>
        <div className="relative h-px w-45 overflow-hidden bg-rule">
          <div className="processing-sweep absolute h-px w-14 bg-ink-soft" />
        </div>
      </div>
    );
  }

  return (
    <>
      {statusRegion}
      <p className="font-sans text-base text-ink-soft">Done. Thank you.</p>
    </>
  );
}
