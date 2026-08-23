"use client";

import { createClient } from "./client";
import { RECORDINGS_BUCKET } from "./constants";

export async function uploadToSignedUrl(
  path: string,
  token: string,
  blob: Blob
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(RECORDINGS_BUCKET)
    .uploadToSignedUrl(path, token, blob);

  if (error) {
    throw error;
  }
}
