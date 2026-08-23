"use server";

import { RECORDINGS_BUCKET } from "./constants";
import { requireSession } from "./session";

export async function createSignedUploadUrl(): Promise<{
  path: string;
  token: string;
}> {
  const { supabase, userId } = await requireSession();
  const path = `${userId}/${crypto.randomUUID()}.webm`;

  const { data, error } = await supabase.storage
    .from(RECORDINGS_BUCKET)
    .createSignedUploadUrl(path);

  if (error) {
    throw error;
  }

  return { path: data.path, token: data.token };
}

export async function createSignedDownloadUrl(path: string): Promise<string> {
  const { supabase } = await requireSession();

  const { data, error } = await supabase.storage
    .from(RECORDINGS_BUCKET)
    .createSignedUrl(path, 60);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}
