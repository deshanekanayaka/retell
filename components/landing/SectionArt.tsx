// Decorative section illustrations for the marketing page, drawn from the
// product's own objects: the record control, transcript rails, story chips,
// the waveform. Palette tokens only, hairline strokes and solid fills per
// docs/07 section 4. All are aria-hidden; every one of them repeats something
// the neighbouring text already says, so nothing is lost if they are unseen.

// The record control in miniature: accent circle, solid surface mic glyph,
// with a voice line leaving it. Step 1, answering out loud.
export function SpeakArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 72" aria-hidden="true" className={className}>
      <circle cx="34" cy="36" r="26" fill="var(--color-accent)" />
      <g fill="var(--color-surface)">
        <rect x="30" y="24" width="8" height="15" rx="4" />
        <path d="M25 36a9 9 0 0 0 18 0h-3a6 6 0 0 1-12 0z" />
        <rect x="32.7" y="44" width="2.6" height="4" />
        <rect x="28" y="48" width="12" height="2.4" rx="1.2" />
      </g>
      <path
        d="M70 36 C76 36 77 28 83 28 C89 28 90 47 96 47 C102 47 103 20 109 20 C115 20 116 44 122 44 C128 44 129 32 135 32 C141 32 144 36 148 36"
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// A transcript card: your own words back, as rail-marked lines. Step 2.
export function TranscriptArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 72" aria-hidden="true" className={className}>
      <rect x="24" y="8" width="112" height="56" rx="4" fill="var(--color-surface)" stroke="var(--color-rule)" />
      <line x1="38" y1="18" x2="38" y2="54" stroke="var(--color-rule)" />
      <g fill="var(--color-muted)" opacity="0.55">
        <rect x="46" y="18" width="66" height="4" rx="2" />
        <rect x="46" y="28" width="76" height="4" rx="2" />
        <rect x="46" y="38" width="58" height="4" rx="2" />
        <rect x="46" y="48" width="70" height="4" rx="2" />
      </g>
    </svg>
  );
}

// The same card with one thing named: rails stay quiet, a single chip stands
// out. Accent on a chip is one of its four permitted homes (docs/07 3.1).
// Step 3.
export function GapArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 72" aria-hidden="true" className={className}>
      <rect x="24" y="8" width="112" height="56" rx="4" fill="var(--color-surface)" stroke="var(--color-rule)" />
      <g fill="var(--color-muted)" opacity="0.55">
        <rect x="38" y="18" width="72" height="4" rx="2" />
        <rect x="38" y="28" width="84" height="4" rx="2" />
      </g>
      <rect x="38" y="40" width="52" height="14" rx="7" fill="var(--color-accent)" />
      <g fill="var(--color-surface)" opacity="0.9">
        <rect x="46" y="46" width="36" height="2.6" rx="1.3" />
      </g>
    </svg>
  );
}

// Reading versus saying: the same sentence as flat print, then as a voice.
export function SpokenVsReadArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 140" aria-hidden="true" className={className}>
      <g fill="var(--color-muted)" opacity="0.45">
        <rect x="20" y="24" width="150" height="5" rx="2.5" />
        <rect x="20" y="40" width="180" height="5" rx="2.5" />
        <rect x="20" y="56" width="120" height="5" rx="2.5" />
      </g>
      <path
        d="M20 104 C30 104 32 92 42 92 C52 92 54 118 64 118 C74 118 76 84 86 84 C96 84 98 122 108 122 C118 122 120 88 130 88 C140 88 142 112 152 112 C162 112 164 96 174 96 C184 96 186 108 196 108 C206 108 210 104 218 104 C228 104 232 104 240 104"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Three private recordings; the third is being deleted, and its line is
// already breaking up. The X is the delete affordance, solid per docs/07
// section 4 icons.
export function PrivateRecordingsArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 140" aria-hidden="true" className={className}>
      <g stroke="var(--color-muted)" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M24 30 C32 30 34 22 42 22 C50 22 52 38 60 38 C68 38 70 24 78 24 C86 24 88 34 96 34 C104 34 108 30 116 30 h60" />
        <path d="M24 70 C32 70 34 60 42 60 C50 60 52 80 60 80 C68 80 70 62 78 62 C86 62 88 76 96 76 C104 76 108 70 116 70 h60" />
      </g>
      <path
        d="M24 110 C32 110 34 102 42 102 C50 102 52 118 60 118 C68 118 70 106 78 106"
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M92 110 h12 M116 110 h10 M138 110 h7 M157 110 h4"
        stroke="var(--color-muted)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <g stroke="var(--color-ink-soft)" strokeWidth="3" strokeLinecap="round">
        <path d="M216 102 l16 16 M232 102 l-16 16" />
      </g>
    </svg>
  );
}
