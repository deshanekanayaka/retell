import Link from "next/link";
import { WaveMark } from "./WaveMark";

// Brand lockup: the voice-burst mark plus "Retell" in the serif. The mark
// carries accent here as brand identity, a deliberate reading of docs/07
// section 3.1: that rule keeps accent off competing UI, and a wordmark is not
// a control. Flagged in the landing-brand spec rather than decided silently.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="Retell, home"
    >
      <WaveMark className="h-5 w-auto text-accent" strokeWidth={3.6} />
      <span className="font-serif text-[22px] leading-none text-ink">Retell</span>
    </Link>
  );
}
