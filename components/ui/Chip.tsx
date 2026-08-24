// docs/07-design-system.md section 4: chips are a full pill, never the 4px
// button radius, so a chip reads as a label and not a small button. Accent is
// allowed here (section 3.1), the one splash of colour on the feedback screen.
export function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent px-3 py-1 font-sans text-[13px] font-medium text-accent">
      {children}
    </span>
  );
}
