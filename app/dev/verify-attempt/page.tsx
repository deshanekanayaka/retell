import { notFound } from "next/navigation";
import { getLatestAttempt } from "@/lib/supabase/attempts";
import { createSignedDownloadUrl } from "@/lib/supabase/storage";

export default async function VerifyAttemptPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const attempt = await getLatestAttempt();

  if (!attempt) {
    return <p>No attempts yet for this session.</p>;
  }

  const signedUrl = await createSignedDownloadUrl(attempt.audioUrl);

  return (
    <div>
      <p>attempt recorded {attempt.createdAt}</p>
      <audio controls src={signedUrl} />
      <p>duration_ms: {attempt.durationMs}</p>
      <p>words_per_minute: {attempt.wordsPerMinute}</p>
      <p>longest_pause_ms: {attempt.longestPauseMs}</p>
      <p>filler_count: {attempt.fillerCount}</p>
      <p>transcript:</p>
      <p>{attempt.transcript}</p>
    </div>
  );
}
