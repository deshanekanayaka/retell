"use server";

import { requireSession } from "./session";

export type RecordingType = "answer" | "mic_check" | "validation_a" | "validation_b";

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
