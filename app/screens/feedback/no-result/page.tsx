import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { TranscriptRail } from "@/components/ui/TranscriptRail";

// Preview only. Same screen as feedback/, when the answer has no result: two
// rails, no third label, nothing marking the absence. Per the wireframe's
// own note, leaving the rail undrawn is the whole treatment (docs/07 6.4).
const QUESTION = "Tell me about a time you worked in a team.";

const RAILS = [
  { label: "the setting", widths: ["100%", "96%", "62%"] },
  { label: "what you did", widths: ["100%", "98%", "92%", "88%", "50%"] },
];

export default function FeedbackNoResultScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-8 px-12 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-[17px] leading-[1.4] text-muted">{QUESTION}</h1>
        <div className="h-px bg-rule" />
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          What you said
        </span>
        <div className="flex flex-col gap-3">
          {RAILS.map((rail) => (
            <TranscriptRail key={rail.label} label={rail.label} widths={rail.widths} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-rule pt-6">
        <p className="max-w-[28ch] font-serif text-[34px] leading-tight text-ink">
          You told me what you did. How did it end?
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <p className="font-sans text-[15px] leading-[1.4] text-muted">
            There is no right answer to this. Just say what you personally did.
          </p>
          <button
            type="button"
            className="inline-flex min-h-11 items-center self-start font-sans text-base font-medium text-ink-soft"
          >
            Have another go at this one
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-rule pt-6">
        <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          This story already answers
        </span>
        <div className="flex flex-wrap gap-2">
          <Chip>conflict</Chip>
        </div>
        <p className="font-sans text-sm text-muted">
          That&apos;s one interview question from one week of a group project.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-rule pt-6">
        <Button>Save this as a story</Button>
        <Button variant="secondary">Next question</Button>
      </div>
    </div>
  );
}
