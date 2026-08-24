// A numbered step in "What actually happens". The number is set in tabular
// sans and sits in its own column so the three lines align on the text, not on
// the digit (docs/07 section 2.2 keeps tabular numerals off the jitter path).
export function Step({ number, children }: { number: number; children: string }) {
  return (
    <li className="flex gap-6">
      <span
        aria-hidden="true"
        className="w-6 shrink-0 pt-1 font-sans text-[13px] font-medium tabular-nums text-muted"
      >
        {number}
      </span>
      <p className="max-w-[52ch] font-serif text-[22px] leading-[1.45] text-ink">{children}</p>
    </li>
  );
}
