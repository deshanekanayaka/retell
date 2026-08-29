import type { ReactNode } from "react";

// One step of "What actually happens", as a card: illustration on top, the
// numbered sentence under it. Cards are surface plus a 1px rule at 4px radius
// (docs/07 section 4); the number stays tabular sans in its own slot so the
// three sentences align on the text, not on the digit.
export function Step({
  number,
  art,
  children,
}: {
  number: number;
  art: ReactNode;
  children: string;
}) {
  return (
    <li className="flex flex-col gap-4 rounded border border-rule bg-surface p-6">
      {art}
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="shrink-0 pt-0.5 font-sans text-[13px] font-medium tabular-nums text-muted"
        >
          {number}
        </span>
        <p className="font-serif text-[19px] leading-[1.45] text-ink">{children}</p>
      </div>
    </li>
  );
}
