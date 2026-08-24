import { Button } from "@/components/ui/Button";

// Preview only. Same markup as PermissionScreen.tsx's "notGranted" state
// (components/PermissionScreen.tsx). That live component only reaches this
// state after a real denied getUserMedia() prompt, so it's mirrored here as a
// static screen for review without needing to trigger that.
const QUESTION = "Tell me about a time you worked in a team.";

export default function PermissionDeniedScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-6 px-12 py-24">
      <h1 className="max-w-[56ch] font-sans text-base leading-[1.55] text-ink-soft">
        No problem. Whenever you&apos;re ready, tap the button again.
      </h1>

      <Button>Turn on my microphone</Button>

      <div className="flex flex-col gap-3">
        <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          The question you would have answered
        </span>
        <p className="font-serif text-[22px] leading-[1.3] text-ink">{QUESTION}</p>
      </div>

      <div className="flex flex-col gap-3 rounded border border-dashed border-muted bg-surface p-4">
        <span className="self-start rounded border border-muted px-2 py-1 font-sans text-[13px] font-medium tracking-wide text-ink-soft">
          Fictional example answer
        </span>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full rounded-sm bg-rule" />
          <div className="h-3 w-[92%] rounded-sm bg-rule" />
          <div className="h-3 w-[60%] rounded-sm bg-rule" />
        </div>
      </div>
    </div>
  );
}
