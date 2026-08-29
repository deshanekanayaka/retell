// The one ambient element docs/07 section 5.5 allows per marketing page: a
// single amplitude-free waveform line drifting slowly across the hero. It is
// decoration, not the recording waveform from section 5.1, so it carries no
// real signal and must stay ignorable: muted colour, low opacity, slow linear
// drift. Reduced motion freezes it into a static line (globals.css).
//
// The path tile is 720 units wide and starts and ends flat at the midline, so
// two copies side by side loop seamlessly when the group drifts one tile left.
const WAVE_TILE =
  "M0 40 C15 40 15 32 30 32 C50 32 70 56 90 56 C110 56 130 35 150 35 C170 35 190 62 210 62 C230 62 250 28 270 28 C290 28 310 44 330 44 C350 44 370 22 390 22 C410 22 430 49 450 49 C470 49 490 16 510 16 C530 16 550 47 570 47 C590 47 610 26 630 26 C650 26 700 40 720 40";

export function AmbientWave({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 720 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <g className="ambient-wave-drift">
        <path
          d={WAVE_TILE}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={WAVE_TILE}
          transform="translate(720 0)"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
