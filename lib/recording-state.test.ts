import { describe, expect, it } from "vitest";
import { initialRecordingState, recordingReducer } from "./recording-state";

describe("recordingReducer", () => {
  it("starts recording from idle", () => {
    const state = recordingReducer(initialRecordingState, { type: "start" });
    expect(state).toEqual({ status: "recording", take: 1 });
  });

  it("ignores start once already recording", () => {
    const recording = { status: "recording" as const, take: 1 };
    expect(recordingReducer(recording, { type: "start" })).toEqual(recording);
  });

  it("moves to review on stop", () => {
    const recording = { status: "recording" as const, take: 1 };
    expect(recordingReducer(recording, { type: "stop" })).toEqual({
      status: "review",
      take: 1,
    });
  });

  it("restarts from recording, discarding the current take", () => {
    const recording = { status: "recording" as const, take: 1 };
    expect(recordingReducer(recording, { type: "restart" })).toEqual({
      status: "recording",
      take: 2,
    });
  });

  it("restarts from review, free at any point", () => {
    const review = { status: "review" as const, take: 1 };
    expect(recordingReducer(review, { type: "restart" })).toEqual({
      status: "recording",
      take: 2,
    });
  });

  it("ignores restart while idle", () => {
    expect(recordingReducer(initialRecordingState, { type: "restart" })).toEqual(
      initialRecordingState
    );
  });

  it("moves to uploading on submit from review", () => {
    const review = { status: "review" as const, take: 1 };
    expect(recordingReducer(review, { type: "submit" })).toEqual({
      status: "uploading",
      take: 1,
    });
  });

  it("moves to done when the upload succeeds", () => {
    const uploading = { status: "uploading" as const, take: 1 };
    expect(recordingReducer(uploading, { type: "uploadSucceeded" })).toEqual({
      status: "done",
      take: 1,
    });
  });

  it("returns to review, audio intact, when the upload fails", () => {
    const uploading = { status: "uploading" as const, take: 1 };
    expect(recordingReducer(uploading, { type: "uploadFailed" })).toEqual({
      status: "review",
      take: 1,
    });
  });
});
