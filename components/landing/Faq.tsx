// Objection handling as a section rather than a footnote. Every answer here is
// a fact the docs already commit to; nothing is softened to sell better, per
// docs/07 section 6.1 rule 5.
//
// Plain markup, not an accordion. A student scanning for the one thing
// stopping them should not have to click six times to find it, and docs/07
// section 5 gives no motion budget for expanding panels.
const QUESTIONS = [
  {
    question: "Do I need an interview booked?",
    answer:
      "No. That is the point. Most practice tools only make sense once you already have one in the diary. This is the bit you do before you apply.",
  },
  {
    question: "Do I have to say it out loud?",
    answer:
      "Yes. Typing is never an option here. Writing a good answer and saying a good answer are different skills, and only one of them is tested in the room.",
  },
  {
    question: "What if I do not have any good stories yet?",
    answer:
      "Most people think that and are wrong. Retell asks questions until the ordinary week you had turns out to contain one. It never writes a story for you, because an answer you did not live is one you have to defend later.",
  },
  {
    question: "How long does it take?",
    answer: "About five minutes a day. One question takes roughly a minute to answer.",
  },
  {
    question: "Who hears my recordings?",
    answer:
      "No other user, ever. They are not shared, and they are never used to train a model unless you explicitly opt in.",
  },
  {
    question: "Can I delete them?",
    answer:
      "Any recording, or all of them with your account. Deleting a recording deletes its transcript too, not just the audio file.",
  },
  {
    question: "Why only Chrome?",
    answer:
      "Recording in the browser behaves differently everywhere else, and shipping it half working on four browsers is worse than shipping it properly on one. Edge and other Chromium browsers work too.",
  },
  {
    question: "What does it cost?",
    answer: "Nothing. Your daily session, your stories and your recordings are not paywalled.",
  },
];

export function Faq() {
  return (
    <dl className="flex flex-col">
      {QUESTIONS.map(({ question, answer }) => (
        <div key={question} className="flex flex-col gap-2 border-t border-rule py-6 first:border-t-0 first:pt-0">
          <dt className="font-serif text-xl leading-snug text-ink">{question}</dt>
          <dd className="max-w-[62ch] font-sans text-base leading-[1.55] text-pretty text-ink-soft">
            {answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}
