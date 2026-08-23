import { notFound } from "next/navigation";
import { createSignedDownloadUrl } from "@/lib/supabase/storage";
import { getLatestRecording } from "@/lib/supabase/recordings";

export default async function VerifyRecordingPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const recording = await getLatestRecording();

  if (!recording) {
    return <p>No recordings yet for this session.</p>;
  }

  const signedUrl = await createSignedDownloadUrl(recording.audioUrl);

  return (
    <div>
      <p>
        {recording.recordingType} recorded {recording.createdAt}
      </p>
      <audio controls src={signedUrl} />
    </div>
  );
}
