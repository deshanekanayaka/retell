"use server";

import { requireSession } from "./session";

export type RecordingType = "answer" | "mic_check" | "validation_a" | "validation_b";

export type Recording = {
  id: string;
  recordingType: RecordingType;
  audioUrl: string;
  createdAt: string;
};

export async function getLatestRecording(): Promise<Recording | null> {
  const { supabase, userId } = await requireSession();

  const { data, error } = await supabase
    .from("recording")
    .select("id, recording_type, audio_url, created_at")
    .eq("anonymous_session_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    recordingType: data.recording_type,
    audioUrl: data.audio_url,
    createdAt: data.created_at,
  };
}

export async function createRecordingRow(
  recordingType: RecordingType,
  path: string
): Promise<void> {
  const { supabase, userId } = await requireSession();

  const { error } = await supabase.from("recording").insert({
    anonymous_session_id: userId,
    recording_type: recordingType,
    audio_url: path,
  });

  if (error) {
    throw error;
  }
}
