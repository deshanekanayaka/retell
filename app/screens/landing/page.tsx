import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Preview only, not linked from real navigation. Landing ships for real in
// S5 (docs/03-delivery-plan.md section 3), gated on the validation read.
export default function LandingScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-8 px-12 py-24">
      <h1 className="max-w-[16ch] font-serif text-[42px] leading-tight text-ink">
        Practise your interview answers out loud.
      </h1>
      <p className="max-w-[56ch] font-sans text-base leading-[1.55] text-ink-soft">
        Five minutes a day, in your own words. No account needed to start.
      </p>
      <Button className="self-start">Start</Button>
      <Link href="#" className="self-start font-sans text-[13px] text-muted underline">
        Privacy
      </Link>
    </div>
  );
}
