import { RecordControl } from "@/components/ui/RecordControl";
import { Button } from "@/components/ui/Button";

// Preview only. Ships for real in S6 (docs/03-delivery-plan.md). No live
// equivalent today: RecordingUI's idle state is only the control, not this
// full composition with the question above it.
const QUESTION = "Tell me about a time you had to change your plan partway through.";

export default function QuestionReadyScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col items-center justify-center gap-12 px-12 py-24 text-center">
      <h1 className="max-w-[22ch] font-serif text-[42px] leading-tight text-ink">{QUESTION}</h1>
      <div className="flex flex-col items-center gap-6">
        <RecordControl state="idle" label="Start recording" />
        <p className="font-sans text-sm text-muted">
          About a minute. Start again as many times as you like.
        </p>
      </div>
      <Button variant="secondary">Skip this one</Button>
    </div>
  );
}
