// Same pill shape as Chip, but the neutral bordered form used everywhere a
// story's angle labels appear outside the feedback screen (docs/07 section
// 3.1: accent is reserved for the feedback screen's chips, nowhere else).
export function NeutralChip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-rule px-3 py-1 font-sans text-[11px] font-medium text-ink-soft">
      {children}
    </span>
  );
}
