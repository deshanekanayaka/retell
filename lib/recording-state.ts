export type RecordingStatus = "idle" | "recording" | "review" | "uploading" | "done";

export type RecordingState = {
  status: RecordingStatus;
  take: number;
};

export type RecordingEvent =
  | { type: "start" }
  | { type: "restart" }
  | { type: "stop" }
  | { type: "submit" }
  | { type: "uploadSucceeded" }
  | { type: "uploadFailed" };

export const initialRecordingState: RecordingState = { status: "idle", take: 0 };

// "take" increments on every fresh recording (start or restart), even when status
// stays "recording" across a restart, so effects keyed on it can tell a genuine
// restart from a no-op.
export function recordingReducer(
  state: RecordingState,
  event: RecordingEvent
): RecordingState {
  switch (event.type) {
    case "start":
      return state.status === "idle"
        ? { status: "recording", take: state.take + 1 }
        : state;
    case "restart":
      return state.status === "recording" || state.status === "review"
        ? { status: "recording", take: state.take + 1 }
        : state;
    case "stop":
      return state.status === "recording" ? { ...state, status: "review" } : state;
    case "submit":
      return state.status === "review" ? { ...state, status: "uploading" } : state;
    case "uploadSucceeded":
      return state.status === "uploading" ? { ...state, status: "done" } : state;
    case "uploadFailed":
      return state.status === "uploading" ? { ...state, status: "review" } : state;
    default:
      return state;
  }
}
