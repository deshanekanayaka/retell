"use client";

import { useEffect, useRef, useReducer, useState } from "react";
import { Waveform } from "@/components/Waveform";
import { initialRecordingState, recordingReducer } from "@/lib/recording-state";
import { createRecordingRow, type RecordingType } from "@/lib/supabase/recordings";
import { createSignedUploadUrl } from "@/lib/supabase/storage";
import { uploadToSignedUrl } from "@/lib/supabase/upload";

const RECORDING_SECONDS = 60;

// One take's MediaRecorder lifecycle, isolated in its own component so a
// restart is a clean remount (a fresh key from the parent) rather than a
// manual state reset — sidesteps both the "reset local state on dependency
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
    <div>
      <p>{secondsRemaining}s left</p>
      <Waveform stream={stream} active />
      <button type="button" onClick={() => requestStopRef.current()}>
        Stop
      </button>
    </div>
  );
}

export function RecordingUI({
  stream,
  recordingType,
}: {
  stream: MediaStream;
  recordingType: RecordingType;
}) {
  const [state, dispatch] = useReducer(recordingReducer, initialRecordingState);
  const blobRef = useRef<Blob | null>(null);
  const [uploadFailed, setUploadFailed] = useState(false);

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
      await createRecordingRow(recordingType, path);

      dispatch({ type: "uploadSucceeded" });
    } catch {
      setUploadFailed(true);
      dispatch({ type: "uploadFailed" });
    }
  }

  if (state.status === "idle") {
    return (
      <button type="button" onClick={() => dispatch({ type: "start" })}>
        Start recording
      </button>
    );
  }

  if (state.status === "recording") {
    return (
      <div>
        <RecordingTake key={state.take} stream={stream} onStopped={handleStopped} />
        <button type="button" onClick={() => dispatch({ type: "restart" })}>
          Restart
        </button>
      </div>
    );
  }

  if (state.status === "review") {
    return (
      <div>
        <p>Review your answer.</p>
        {uploadFailed && (
          <p>That didn&apos;t upload. Your recording is still here — try again.</p>
        )}
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
        <button type="button" onClick={() => dispatch({ type: "restart" })}>
          Restart
        </button>
      </div>
    );
  }

  if (state.status === "uploading") {
    return <p>Uploading...</p>;
  }

  return <p>Done. Thank you.</p>;
}
