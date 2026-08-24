import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { LandingSection } from "@/components/landing/LandingSection";
import { Step } from "@/components/landing/Step";
import { Faq } from "@/components/landing/Faq";

// The marketing surface, and the only place docs/07's "the most important
// screen is the least designed one" does not apply: nobody is talking into a
// microphone while reading this. It still answers to the same tokens, the same
// type scale, and the same voice rules (docs/07 section 6).
//
// Start is a link rather than a button because it navigates. FR-1 gives the
// user 45 seconds from landing to a live microphone, so it sits in the first
// viewport with nothing above it to read first.
const STEPS = [
  "You get a question and answer it out loud, for about a minute.",
  "You get your own words back, laid out so you can see the shape of the answer.",
  "One thing to work on is named. Specific, or it isn't shown.",
];

function StartLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/record" className={buttonClasses("primary", className)}>
      Start
    </Link>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-10 focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:font-sans focus:text-base focus:text-ink"
      >
        Skip to content
      </a>

      <section className="flex min-h-screen flex-col justify-center">
        <div className="mx-auto flex w-full max-w-215 flex-col gap-8 px-12">
          <h1 className="max-w-170 text-balance font-serif text-[56px] leading-[1.1] text-ink">
            Practise your interview answers out loud.
          </h1>
          <p className="max-w-170 text-pretty font-sans text-xl leading-normal text-ink-soft">
            Five minutes a day, in your own words. No account needed to start.
          </p>
          <div className="flex flex-col gap-3">
            <StartLink className="w-fit" />
            <p className="font-sans text-sm text-muted">
              Chrome or Edge for now, because it needs your microphone.
            </p>
          </div>
        </div>
      </section>

      <div id="content" />

      {/* The one large-type moment away from the hero. Static, not a scroll
          reveal: docs/07 section 5.3 bans staggered word-by-word activation,
          and section 5.2 fixes screen motion at a 120ms opacity crossfade. */}
      <section className="border-t border-rule py-24">
        <div className="mx-auto w-full max-w-215 px-12">
          <p className="max-w-170 text-balance font-serif text-[44px] leading-[1.2] text-ink">
            Everyone else gives you a mock interview once you already have one booked. This is
            the practice you do before you apply.
          </p>
        </div>
      </section>

      <LandingSection label="What actually happens">
        <ol className="flex flex-col gap-6">
          {STEPS.map((step, index) => (
            <Step key={step} number={index + 1}>
              {step}
            </Step>
          ))}
        </ol>
      </LandingSection>

      <LandingSection label="Why out loud">
        <div className="flex flex-col gap-6">
          <p className="max-w-[30ch] text-balance font-serif text-[34px] leading-tight text-ink">
            Reading an answer back to yourself is not the same as saying it to a person.
          </p>
          <div className="flex max-w-[62ch] flex-col gap-4 text-pretty font-sans text-base leading-[1.55] text-ink-soft">
            <p>Most people find that out in the room.</p>
            <p>
              Saying it out loud is the only way to notice that the story you have told yourself
              for years takes ninety seconds and has no ending.
            </p>
          </div>
        </div>
      </LandingSection>

      <LandingSection label="What it will not do">
        <div className="flex max-w-[62ch] flex-col gap-6 text-pretty font-sans text-base leading-[1.55] text-ink-soft">
          <p>
            It won&apos;t write your stories for you. They&apos;re yours, in your words, or
            they&apos;re something you&apos;d have to repeat in a room and hope nobody asks
            about.
          </p>
          <p>No interviewer talks back. This is a drill, not a conversation.</p>
        </div>
      </LandingSection>

      <LandingSection label="Your recordings">
        <p className="max-w-[62ch] text-pretty font-sans text-base leading-[1.55] text-ink-soft">
          Your recordings are private. No other user ever hears them, they are never used to
          train a model unless you say yes, and deleting one deletes its transcript too.
        </p>
      </LandingSection>

      <LandingSection label="Questions">
        <Faq />
      </LandingSection>

      <section className="border-t border-rule py-24">
        <div className="mx-auto flex w-full max-w-215 flex-col gap-8 px-12">
          <p className="max-w-[24ch] text-balance font-serif text-[34px] leading-tight text-ink">
            Five minutes, out loud, on your own stories.
          </p>
          <div className="flex flex-col gap-3">
            <StartLink className="w-fit" />
            <p className="font-sans text-sm text-muted">Free.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-rule py-8">
        <div className="mx-auto w-full max-w-215 px-12">
          <Link href="/privacy" className="font-sans text-sm text-muted underline">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
