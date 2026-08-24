import Link from "next/link";
import type { Metadata } from "next";

// Placeholder, not a legal document. Everything here restates a commitment
// docs/06-data-and-privacy.md already makes, in plain language, so the landing
// footer has somewhere honest to point. It deliberately claims nothing docs/06
// does not, and says so at the top rather than pretending to be finished.
//
// Before real users: this needs the named third parties (transcription and
// model providers), a data controller, a retention statement that survives
// legal review, and a contact route. Tracked in context/tasks.md.
export const metadata: Metadata = {
  title: "Privacy | Retell",
  description: "What Retell records, what it keeps, and what deleting actually does.",
};

const PROMISES = [
  {
    heading: "Nobody else hears your recordings",
    body: "There is no feed, no sharing, and no way to browse anyone else's answers. No other user ever hears yours.",
  },
  {
    heading: "They are never used to train a model unless you say yes",
    body: "Opting in means a deliberate action you take. Never a pre-ticked box, never a line buried in terms you did not read.",
  },
  {
    heading: "Delete means delete",
    body: "The audio comes out of storage and the rows come out of the database. It is not a flag that hides a file we kept. Deleting a recording also deletes its transcript and anything derived from it.",
  },
];

const RETENTION = [
  ["Your recordings, once you have an account", "Kept until you delete them"],
  ["A recording made before you sign up", "Deleted after 24 hours unless you claim it by signing up"],
  ["The first mic check", "Never transcribed, never evaluated, deleted with your account"],
  ["Transcripts and feedback", "Kept with the recording, deleted with it"],
  ["Your account", "Deleted on request, along with every recording and row"],
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-215 flex-col gap-12 px-12 py-24">
      <div className="flex flex-col gap-6">
        <h1 className="max-w-170 text-balance font-serif text-[44px] leading-tight text-ink">
          What Retell records, and what happens to it.
        </h1>
        <div className="rounded border border-rule bg-surface p-6">
          <p className="max-w-[62ch] text-pretty font-sans text-base leading-[1.55] text-ink-soft">
            This is a plain-language summary while Retell is being built, not a finished legal
            document. It will be replaced before the product is opened up properly. Everything
            below is a commitment the product is built around, not marketing copy.
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-8 border-t border-rule pt-12">
        <h2 className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          Three promises
        </h2>
        <div className="flex flex-col gap-8">
          {PROMISES.map(({ heading, body }) => (
            <div key={heading} className="flex flex-col gap-2">
              <h3 className="max-w-[46ch] text-balance font-serif text-2xl leading-snug text-ink">
                {heading}
              </h3>
              <p className="max-w-[62ch] text-pretty font-sans text-base leading-[1.55] text-ink-soft">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 border-t border-rule pt-12">
        <h2 className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          What is kept, and for how long
        </h2>
        <dl className="flex flex-col">
          {RETENTION.map(([what, howLong]) => (
            <div
              key={what}
              className="flex flex-col gap-1 border-t border-rule py-4 first:border-t-0 first:pt-0 sm:flex-row sm:gap-8"
            >
              <dt className="font-sans text-base text-ink sm:w-80 sm:shrink-0">{what}</dt>
              <dd className="text-pretty font-sans text-base leading-[1.55] text-ink-soft">
                {howLong}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-4 border-t border-rule pt-12">
        <h2 className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          Why the audio is kept at all
        </h2>
        <p className="max-w-[62ch] text-pretty font-sans text-base leading-[1.55] text-ink-soft">
          Your recording is the only thing that cannot be recreated. The transcript and the
          feedback are both worked out from it, so if either is wrong, the audio is what makes
          fixing it possible. That is why it is kept until you say otherwise, and why deleting
          it takes everything derived from it with it.
        </p>
      </section>

      <section className="flex flex-col gap-4 border-t border-rule pt-12">
        <h2 className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          Still to be written
        </h2>
        <p className="max-w-[62ch] text-pretty font-sans text-base leading-[1.55] text-ink-soft">
          Naming the services that process recordings on Retell&apos;s behalf, a contact route
          for data requests, and the formal terms. Listed here rather than left as a gap you
          would have to notice.
        </p>
      </section>

      <div className="border-t border-rule pt-12">
        <Link href="/" className="font-sans text-base text-ink underline">
          Back to the start
        </Link>
      </div>
    </div>
  );
}
