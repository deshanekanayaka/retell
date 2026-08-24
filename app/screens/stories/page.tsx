import { Button } from "@/components/ui/Button";
import { NeutralChip } from "@/components/ui/NeutralChip";

// Preview only. Ships for real in S4/S6, FR-9, FR-12.
const STORIES = [
  { widths: ["100%", "96%", "88%", "62%"], chips: ["conflict", "communication"] },
  { widths: ["98%", "90%", "54%"], chips: ["ownership"] },
  { widths: ["100%", "70%"], chips: ["initiative"] },
];

export default function StoriesListScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-225 flex-col justify-center gap-8 px-12 py-16">
      <div className="flex items-center justify-between border-b border-rule pb-6">
        <h1 className="font-serif text-[28px] leading-tight text-ink">Your stories</h1>
        <Button>Start today&apos;s session</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {STORIES.map((story, index) => (
          <div key={index} className="flex flex-col gap-3 rounded border border-rule bg-surface p-4">
            <div className="flex flex-col gap-2">
              {story.widths.map((width, i) => (
                <div key={i} className="h-2.5 rounded-sm bg-rule" style={{ width }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {story.chips.map((chip) => (
                <NeutralChip key={chip}>{chip}</NeutralChip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
