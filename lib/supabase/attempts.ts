"use server";

import type { WordTiming } from "../signals";
import { requireSession } from "./session";

export type AttemptFacts = {
  transcript: string;
  wordTimings: WordTiming[];
  durationMs: number;
  wordsPerMinute: number;
  longestPauseMs: number;
  fillerCount: number;
};

export type Attempt = {
  id: string;
  audioUrl: string;
  transcript: string | null;
  durationMs: number | null;
  wordsPerMinute: number | null;
  longestPauseMs: number | null;
  fillerCount: number | null;
  createdAt: string;
};

export async function getLatestAttempt(): Promise<Attempt | null> {
  const { supabase, userId } = await requireSession();

  const { data, error } = await supabase
    .from("attempt")
    .select(
      "id, audio_url, transcript, duration_ms, words_per_minute, longest_pause_ms, filler_count, created_at"
    )
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
    audioUrl: data.audio_url,
    transcript: data.transcript,
    durationMs: data.duration_ms,
    wordsPerMinute: data.words_per_minute,
    longestPauseMs: data.longest_pause_ms,
    fillerCount: data.filler_count,
    createdAt: data.created_at,
  };
}

export async function createAttempt(path: string): Promise<string> {
  const { supabase, userId } = await requireSession();

  const { data, error } = await supabase
    .from("attempt")
    .insert({
      anonymous_session_id: userId,
      audio_url: path,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function saveAttemptFacts(attemptId: string, facts: AttemptFacts): Promise<void> {
  const { supabase } = await requireSession();

  const { error } = await supabase
    .from("attempt")
    .update({
      transcript: facts.transcript,
      word_timings: facts.wordTimings,
      duration_ms: facts.durationMs,
      words_per_minute: facts.wordsPerMinute,
      longest_pause_ms: facts.longestPauseMs,
      filler_count: facts.fillerCount,
    })
    .eq("id", attemptId);

  if (error) {
    throw error;
  }
}
