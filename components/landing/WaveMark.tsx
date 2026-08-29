// The brand mark: a single voice burst, one line rising to a tall centre and
// settling back to the midline. It is the same object as the recording
// waveform (docs/07 section 5.1, a continuous line, never bars) and the hero's
// ambient wave, so the logo, the product and the page all draw one thing.
// Founder-chosen over the quote-mark concept, 2026-08-29.
const WAVE_MARK_PATH =
  "M2 16 C5.63636 16 6.36364 12 10 12 C13.6364 12 14.3636 25 18 25 C21.6364 25 22.3636 4 26 4 C29.6364 4 30.3636 21 34 21 C37.6364 21 38.3636 16 42 16";

export function WaveMark({
  className = "",
  strokeWidth = 3.2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 44 32"
      aria-hidden="true"
      fill="none"
      className={className}
    >
      <path
        d={WAVE_MARK_PATH}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
