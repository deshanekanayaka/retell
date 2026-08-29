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
  confidence: number;
};

export type Attempt = {
  id: string;
  audioUrl: string;
  questionText: string | null;
  transcript: string | null;
  // Needed wherever rails are drawn: they are stored as positions in this
  // array, so the transcript string alone cannot be sliced by them.
  wordTimings: WordTiming[] | null;
  durationMs: number | null;
  wordsPerMinute: number | null;
  longestPauseMs: number | null;
  fillerCount: number | null;
  confidence: number | null;
  createdAt: string;
};

const ATTEMPT_COLUMNS =
  "id, audio_url, question_text, transcript, word_timings, duration_ms, words_per_minute, longest_pause_ms, filler_count, confidence, created_at";

type AttemptRow = {
  id: string;
  audio_url: string;
  question_text: string | null;
  transcript: string | null;
  word_timings: WordTiming[] | null;
  duration_ms: number | null;
  words_per_minute: number | null;
  longest_pause_ms: number | null;
  filler_count: number | null;
  confidence: number | null;
  created_at: string;
};

function toAttempt(row: AttemptRow): Attempt {
  return {
    id: row.id,
    audioUrl: row.audio_url,
    questionText: row.question_text,
    transcript: row.transcript,
    wordTimings: row.word_timings,
    durationMs: row.duration_ms,
    wordsPerMinute: row.words_per_minute,
    longestPauseMs: row.longest_pause_ms,
    fillerCount: row.filler_count,
    confidence: row.confidence,
    createdAt: row.created_at,
  };
}

// RLS scopes this to the owning session, so an attempt id from another user
// returns nothing rather than someone else's recording.
export async function getAttempt(attemptId: string): Promise<Attempt | null> {
  const { supabase } = await requireSession();

  const { data, error } = await supabase
    .from("attempt")
    .select(ATTEMPT_COLUMNS)
    .eq("id", attemptId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toAttempt(data) : null;
}

export async function getLatestAttempt(): Promise<Attempt | null> {
  const { supabase, userId } = await requireSession();

  const { data, error } = await supabase
    .from("attempt")
    .select(ATTEMPT_COLUMNS)
    .eq("anonymous_session_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toAttempt(data) : null;
}

// The path is chosen by the browser (lib/supabase/storage.ts's
// createSignedUploadUrl), so it arrives here as caller-supplied input, not as
// something the server already trusts. Every upload path is keyed
// `{userId}/{uuid}.webm`; a path with any other prefix cannot be this
// caller's own recording, whatever the request body claims.
function assertPathOwnedByCaller(path: string, userId: string): void {
  if (!path.startsWith(`${userId}/`)) {
    throw new Error("Path does not belong to the caller");
  }
}

// Looked up before creating a new attempt, so the same signed upload path
// POSTed twice resumes the existing attempt rather than re-transcribing and
// re-evaluating audio that has already been processed.
export async function findAttemptByPath(path: string): Promise<Attempt | null> {
  const { supabase, userId } = await requireSession();

  assertPathOwnedByCaller(path, userId);

  const { data, error } = await supabase
    .from("attempt")
    .select(ATTEMPT_COLUMNS)
    .eq("audio_url", path)
    .eq("anonymous_session_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toAttempt(data) : null;
}

export async function createAttempt(path: string, questionText: string): Promise<string> {
  const { supabase, userId } = await requireSession();

  assertPathOwnedByCaller(path, userId);

  const { data, error } = await supabase
    .from("attempt")
    .insert({
      anonymous_session_id: userId,
      audio_url: path,
      question_text: questionText,
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
      confidence: facts.confidence,
    })
    .eq("id", attemptId);

  if (error) {
    throw error;
  }
}
