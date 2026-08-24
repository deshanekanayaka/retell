import { RecordControl } from "@/components/ui/RecordControl";
import { Button } from "@/components/ui/Button";

// Preview only. Ships for real in S6, FR-10: an answer under 15 seconds is
// never framed as a failure, just offered an easier question from a fixed
// ladder.
const EASIER_QUESTION = "Describe where you did it. The room, the people who were usually there.";

export default function RecoveryScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col items-center justify-center gap-8 px-12 py-24 text-center">
      <p className="font-sans text-base text-ink-soft">Let&apos;s try an easier way in.</p>
      <h1 className="max-w-[22ch] font-serif text-[42px] leading-tight text-ink">
        {EASIER_QUESTION}
      </h1>
      <div className="flex items-center gap-6">
        <RecordControl state="idle" label="Start recording" />
        <Button variant="secondary">Skip this one</Button>
      </div>
    </div>
  );
}
