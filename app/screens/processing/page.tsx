// Preview only. Same markup as RecordingUI.tsx's "uploading" state
// (components/RecordingUI.tsx). That live component only reaches this state
// mid-upload after a real recording, so it's mirrored here as a static
// screen for review without needing to trigger that.
export default function ProcessingScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col items-center justify-center gap-6 px-12 py-24">
      <h1 className="font-sans text-base text-ink-soft">Give me a few seconds with that.</h1>
      <div className="relative h-px w-45 overflow-hidden bg-rule">
        <div className="processing-sweep absolute h-px w-14 bg-ink-soft" />
      </div>
    </div>
  );
}
