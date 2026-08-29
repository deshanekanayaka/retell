// One row of the feedback screen's transcript, docs/07 section 3.3: the label
// at left, a hairline rule, then the user's own words.
//
// docs/04 section 4.1: the words themselves are never touched. No highlighter
// fill, no underline, no reflowing. The rule and the margin label are the
// entire treatment, which is why this component takes text and renders it
// unchanged rather than marking anything up inside it.
export function TranscriptRail({ label, text }: { label: string | null; text: string }) {
  return (
    <div className="flex items-stretch gap-3">
      <span className="w-20 shrink-0 pt-0.5 text-right font-sans text-xs font-medium text-muted">
        {label}
      </span>
      {/* A passage no part claimed gets no rule and no label, only the words.
          docs/04 section 4.1: the absence in the margin is the whole signal,
          and an empty labelled rail on someone's own words reads as marking
          them down. */}
      <div className={`w-px shrink-0 ${label ? "bg-rule" : "bg-transparent"}`} />
      <p className="flex-1 font-serif text-[17px] leading-[1.6] text-ink">{text}</p>
    </div>
  );
}
