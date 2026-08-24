import type { CSSProperties } from "react";
import FeedbackScreen from "@/app/screens/feedback/page";

// Throwaway dev route, same precedent as app/dev/verify-recording. Renders the
// real feedback screen twice with two candidate `muted` values, so the colour
// decision in docs/07 section 3 gets made by eye and not from a number.
//
// It works by overriding the --color-muted custom property on a wrapper: every
// `text-muted` utility below it resolves to the override, so nothing about the
// screens themselves is forked or duplicated for this comparison.
const CANDIDATES = [
  { hex: "#6D736A", name: "was", ratio: "4.25:1", verdict: "failed 4.5:1" },
  { hex: "#696F66", name: "shipped", ratio: "4.51:1", verdict: "passes 4.5:1" },
];

// The real sizes `muted` is used at across the product, all normal-size text
// by WCAG's definition, so all needing the full 4.5:1 rather than 3:1.
const SAMPLES = [
  { label: "13px uppercase, eyebrow labels", className: "text-[13px] font-medium uppercase tracking-wide", text: "What you said" },
  { label: "12px, transcript rail labels", className: "text-xs font-medium", text: "the setting" },
  { label: "15px, the gap explainer", className: "text-[15px] leading-[1.4]", text: "There is no right answer to this. Just say what you personally did." },
  { label: "17px serif, question as context", className: "font-serif text-[17px] leading-[1.4]", text: "Tell me about a time you worked in a team." },
];

function Column({ hex, name, ratio, verdict }: (typeof CANDIDATES)[number]) {
  return (
    <div className="flex flex-col gap-4" style={{ "--color-muted": hex } as CSSProperties}>
      <div className="flex flex-col gap-1 border-b border-rule pb-3">
        <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-ink">
          {name}
        </span>
        <span className="font-mono text-xs text-ink-soft">
          {hex} · {ratio} · {verdict}
        </span>
      </div>
      {SAMPLES.map((sample) => (
        <div key={sample.label} className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-ink-soft opacity-60">{sample.label}</span>
          <p className={`font-sans text-muted ${sample.className}`}>{sample.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function ContrastCheckPage() {
  return (
    <div className="flex flex-col gap-12 px-12 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[34px] leading-tight text-ink">
          The muted token, measured two ways
        </h1>
        <p className="max-w-[70ch] font-sans text-base leading-[1.55] text-ink-soft">
          Both columns sit on <code className="font-mono text-sm">ground</code> (#EFF0EA), the
          background this token renders on nearly everywhere. docs/07 section 3.4 commits to
          4.5:1 for body text. The old value missed it by 0.26, so the right-hand column is now
          what ships. Kept as the record of why.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-[13px] font-medium uppercase tracking-wide text-ink-soft">
          Isolated, at the real sizes
        </h2>
        <div className="grid max-w-[900px] grid-cols-2 gap-12">
          {CANDIDATES.map((candidate) => (
            <Column key={candidate.hex} {...candidate} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-[13px] font-medium uppercase tracking-wide text-ink-soft">
          In situ, the real feedback screen rendered twice
        </h2>
        <div className="flex gap-8 overflow-x-auto">
          {CANDIDATES.map((candidate) => (
            <div
              key={candidate.hex}
              className="flex w-[680px] shrink-0 flex-col gap-2"
              style={{ "--color-muted": candidate.hex } as CSSProperties}
            >
              <span className="font-mono text-xs text-ink-soft">
                {candidate.name} · {candidate.hex} · {candidate.ratio}
              </span>
              <div className="rounded border border-rule">
                <FeedbackScreen />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
