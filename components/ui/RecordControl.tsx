// docs/07-design-system.md section 4.1: one circle, one position, two states.
// Identical control in the identical place on the mic check and the question
// screens, so the step between them is muscle memory. The label beneath is
// what stops the circle being a guessing game.
export function RecordControl({
  state,
  label,
  onClick,
}: {
  state: "idle" | "recording";
  label: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={
          state === "idle"
            ? "flex h-24 w-24 items-center justify-center rounded-full bg-accent transition-colors duration-100 active:bg-accent-press"
            : "flex h-24 w-24 items-center justify-center rounded-full border border-accent"
        }
      >
        {state === "idle" ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--color-surface)" aria-hidden="true">
            <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
            <path d="M6 11a1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 6 6 0 0 1-5 5.92V20h2a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h2v-3.08A6 6 0 0 1 6 11z" />
          </svg>
        ) : (
          <div className="h-6 w-6 rounded-sm bg-accent" />
        )}
      </button>
      <span className="font-sans text-[15px] text-ink-soft">{label}</span>
    </div>
  );
}
