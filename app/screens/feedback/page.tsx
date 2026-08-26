import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { TranscriptRail } from "@/components/ui/TranscriptRail";

// Preview only. Ships for real in S3, FR-22 to FR-24: transcript rails in
// fixed order, one gap question, facts as plain numbers, no colour beyond
// ink/muted/rule and the chips (docs/07 section 3.3).
const QUESTION = "Tell me about a time you worked in a team.";

// Greeked deliberately, not written as a plausible answer. ADR-009 bans
// drafting story content for a user, and an invented first-person account
// sitting under "What you said" is the exact shape of thing that gets copied
// into the product and then repeated in a real interview. This screen exists
// to show measure, rhythm and line length, all of which greeked text carries
// and a fabricated story does not improve.
const RAILS = [
  {
    label: "the setting",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    label: "what you did",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat, duis aute irure.",
  },
  {
    label: "how it ended",
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
  },
];

export default function FeedbackScreen() {
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
            <TranscriptRail key={rail.label} label={rail.label} text={rail.text} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-rule pt-6">
        <p className="max-w-[28ch] font-serif text-[34px] leading-tight text-ink">
          You told me what the team did. What did you do?
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
          <Chip>communication</Chip>
        </div>
        <p className="font-sans text-sm text-muted">
          That&apos;s two interview questions from one week of a group project.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-rule pt-6">
        <Button>Save this as a story</Button>
        <Button variant="secondary">Next question</Button>
      </div>
    </div>
  );
}
