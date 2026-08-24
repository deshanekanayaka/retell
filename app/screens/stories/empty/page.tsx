import { Button } from "@/components/ui/Button";

// Preview only. No shame, no instruction to write. Stories only ever arrive
// by speaking (docs/07 6.4).
export default function StoriesListEmptyScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-225 flex-col gap-8 px-12 py-16">
      <div className="flex items-center justify-between border-b border-rule pb-6">
        <h1 className="font-serif text-[28px] leading-tight text-ink">Your stories</h1>
        <Button>Start today&apos;s session</Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-24">
        <div className="h-38 w-full max-w-155 rounded border border-dashed border-rule" />
        <p className="max-w-[56ch] text-center font-sans text-base leading-[1.55] text-ink-soft">
          Your stories build up as you answer. Nothing to do here yet.
        </p>
      </div>
    </div>
  );
}
