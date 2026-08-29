import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { LandingSection } from "@/components/landing/LandingSection";
import { Step } from "@/components/landing/Step";
import { Faq } from "@/components/landing/Faq";
import { Wordmark } from "@/components/landing/Wordmark";
import { QuoteMark } from "@/components/landing/QuoteMark";
import { AmbientWave } from "@/components/landing/AmbientWave";
import {
  SpeakArt,
  TranscriptArt,
  GapArt,
  SpokenVsReadArt,
  PrivateRecordingsArt,
} from "@/components/landing/SectionArt";

// The marketing surface, and the only place docs/07's "the most important
// screen is the least designed one" does not apply: nobody is talking into a
// microphone while reading this. It still answers to the same tokens, the same
// type scale, and the same voice rules (docs/07 section 6). Motion here runs
// on the marketing budget in section 5.5 and nothing beyond it.
//
// Start is a link rather than a button because it navigates. FR-1 gives the
// user 45 seconds from landing to a live microphone, so it sits in the first
// viewport with nothing above it to read first.
const STEP_ART = [
  {
    text: "You get a question and answer it out loud, for about a minute.",
    art: <SpeakArt className="w-full max-w-40 self-center" />,
  },
  {
    text: "You get your own words back, laid out so you can see the shape of the answer.",
    art: <TranscriptArt className="w-full max-w-40 self-center" />,
  },
  {
    text: "One thing to work on is named. Specific, or it isn't shown.",
    art: <GapArt className="w-full max-w-40 self-center" />,
  },
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

      <header className="absolute inset-x-0 top-0">
        <div className="mx-auto w-full max-w-215 px-6 py-6 md:px-12 md:py-8">
          <Wordmark />
        </div>
      </header>

      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-215 flex-col gap-8 px-6 py-24 md:px-12">
          <h1 className="max-w-170 text-balance font-serif text-[38px] leading-[1.15] text-ink md:text-[56px] md:leading-[1.1]">
            Practise your interview answers out loud.
          </h1>
          <p className="max-w-170 text-pretty font-sans text-lg leading-normal text-ink-soft md:text-xl">
            Five minutes a day, in your own words. No account needed to start.
          </p>
          <div className="flex flex-col gap-3">
            <StartLink className="w-fit" />
            <p className="font-sans text-sm text-muted">
              Chrome or Edge for now. It is the only place we have made the
              microphone flow reliable.
            </p>
          </div>
        </div>
        {/* Width is pinned to 200% below md so the 720-unit tile never
            compresses into a busy scribble on a narrow viewport. */}
        <AmbientWave className="pointer-events-none absolute bottom-10 left-0 h-16 w-[200%] max-w-none md:h-20 md:w-full" />
      </section>

      <div id="content" />

      {/* The one large-type moment away from the hero. The oversized quote
          mark sits in rule tone: decoration at hairline weight, carrying no
          meaning a reader would lose if it were invisible (docs/07 3.4). */}
      <section className="border-t border-rule py-14 md:py-20">
        <div className="mx-auto flex w-full max-w-215 flex-col gap-8 px-6 md:px-12">
          <QuoteMark className="h-10 w-auto self-start text-rule md:h-14" />
          <p className="max-w-170 text-balance font-serif text-[32px] leading-tight text-ink md:text-[44px] md:leading-[1.2]">
            Everyone else gives you a mock interview once you already have one booked. This is
            the practice you do before you apply.
          </p>
        </div>
      </section>

      <LandingSection label="What actually happens">
        <ol className="grid gap-4 md:grid-cols-3">
          {STEP_ART.map(({ text, art }, index) => (
            <Step key={text} number={index + 1} art={art}>
              {text}
            </Step>
          ))}
        </ol>
      </LandingSection>

      <LandingSection label="Why out loud">
        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
          <div className="flex flex-col gap-6">
            <p className="max-w-[30ch] text-balance font-serif text-[26px] leading-[1.3] text-ink md:text-[34px] md:leading-tight">
              Reading an answer back to yourself is not the same as saying it to a person.
            </p>
            <div className="flex max-w-[62ch] flex-col gap-4 text-pretty font-sans text-base leading-[1.55] text-ink-soft">
              <p>Most people find that out in the room.</p>
              <p>
                Saying it out loud is the only way to notice that the story you have told
                yourself for years takes ninety seconds and has no ending.
              </p>
            </div>
          </div>
          <SpokenVsReadArt className="w-full max-w-90 justify-self-center md:justify-self-end" />
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
        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
          <p className="max-w-[62ch] text-pretty font-sans text-base leading-[1.55] text-ink-soft">
            Your recordings are private. No other user ever hears them, they are never used to
            train a model unless you say yes, and deleting one deletes its transcript too.
          </p>
          <PrivateRecordingsArt className="w-full max-w-72 justify-self-center md:justify-self-end" />
        </div>
      </LandingSection>

      <LandingSection label="Questions">
        <Faq />
      </LandingSection>

      <section className="border-t border-rule py-14 md:py-20">
        <div className="mx-auto flex w-full max-w-215 flex-col gap-8 px-6 md:px-12">
          <p className="max-w-[24ch] text-balance font-serif text-[28px] leading-[1.3] text-ink md:text-[34px] md:leading-tight">
            Five minutes, out loud, on your own stories.
          </p>
          <div className="flex flex-col gap-3">
            <StartLink className="w-fit" />
            <p className="font-sans text-sm text-muted">Free.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-rule py-8">
        <div className="mx-auto flex w-full max-w-215 items-center justify-between px-6 md:px-12">
          <Wordmark />
          <Link href="/privacy" className="font-sans text-sm text-muted underline">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
