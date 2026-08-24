import { Button } from "@/components/ui/Button";
import { NeutralChip } from "@/components/ui/NeutralChip";

// Preview only. Ships for real in S6. No streak, no reminder control in
// Phase 1 (docs/07 6.4 worked example: "You have 3 stories now.").
export default function SessionCompleteScreen() {
  return (
    <div className="mx-auto grid min-h-screen max-w-225 grid-cols-[1.2fr_1fr] items-center gap-16 px-12 py-24">
      <div className="flex flex-col gap-4">
        <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          What you made today
        </span>
        <div className="flex flex-col gap-2 rounded border border-rule bg-surface p-4">
          <div className="h-2.5 w-full rounded-sm bg-rule" />
          <div className="h-2.5 w-[84%] rounded-sm bg-rule" />
          <div className="flex gap-2 pt-1">
            <NeutralChip>conflict</NeutralChip>
            <NeutralChip>communication</NeutralChip>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded border border-rule bg-surface p-4">
          <div className="h-2.5 w-[94%] rounded-sm bg-rule" />
          <div className="h-2.5 w-[60%] rounded-sm bg-rule" />
          <div className="flex gap-2 pt-1">
            <NeutralChip>ownership</NeutralChip>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-[42px] leading-tight text-ink">Done for today.</h1>
          <p className="font-serif text-[22px] leading-[1.35] text-ink-soft">
            You have 3 stories now. That covers most of a first round.
          </p>
          <p className="font-sans text-base leading-[1.55] text-ink-soft">
            Tomorrow takes about five minutes.
          </p>
        </div>
        <Button className="w-fit">See my stories</Button>
      </div>
    </div>
  );
}
