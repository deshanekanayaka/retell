// One row of the feedback screen's "What you said" transcript, docs/07
// section 3.3: the label at left, a hairline rule, then the answer as
// placeholder bars (real transcript text is S3 work, not this feature's).
export function TranscriptRail({ label, widths }: { label: string; widths: string[] }) {
  return (
    <div className="flex items-stretch gap-3">
      <span className="w-20 shrink-0 text-right font-sans text-xs font-medium text-muted">
        {label}
      </span>
      <div className="w-px shrink-0 bg-rule" />
      <div className="flex flex-1 flex-col gap-2">
        {widths.map((width, index) => (
          <div key={index} className="h-2.5 rounded-sm bg-rule" style={{ width }} />
        ))}
      </div>
    </div>
  );
}
