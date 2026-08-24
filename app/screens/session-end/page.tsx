import { Button } from "@/components/ui/Button";
import { NeutralChip } from "@/components/ui/NeutralChip";

// Preview only. Ships for real in S6, FR-11: after three consecutive skips
// the session ends with what was produced, no loss framing, skipped slots
// shown plainly.
export default function SessionEndScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-8 px-12 py-24">
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-[42px] leading-tight text-ink">That&apos;s enough for today.</h1>
        <p className="font-serif text-[22px] leading-[1.35] text-ink-soft">
          You turned up and spoke. Some days that is the whole thing.
        </p>
        <p className="font-sans text-base leading-[1.55] text-ink-soft">
          Nothing&apos;s lost. It gets easier once you have a few stories down.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          What you made today
        </span>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 rounded border border-rule bg-surface p-4">
            <div className="flex flex-col gap-2">
              <div className="h-2.5 w-full rounded-sm bg-rule" />
              <div className="h-2.5 w-[92%] rounded-sm bg-rule" />
              <div className="h-2.5 w-[58%] rounded-sm bg-rule" />
            </div>
            <NeutralChip>conflict</NeutralChip>
          </div>
          <div className="flex min-h-32 items-center justify-center rounded border border-dashed border-rule font-sans text-xs text-muted">
            Skipped
          </div>
          <div className="flex min-h-32 items-center justify-center rounded border border-dashed border-rule font-sans text-xs text-muted">
            Skipped
          </div>
        </div>
      </div>

      <Button className="w-fit">Done for today</Button>
    </div>
  );
}
