import Link from "next/link";

// Preview index only, not linked from any real navigation. Lets every screen
// in the ui-screens-desktop feature be reached without hunting URLs.
const FLOWS: { name: string; screens: { label: string; href: string; note?: string }[] }[] = [
  {
    name: "Getting in",
    screens: [
      { label: "01 Landing", href: "/screens/landing" },
      { label: "02 Browser gate", href: "/record", note: "live component, visit in a non-Chrome browser" },
      { label: "03 Permission explainer", href: "/record", note: "live component" },
      { label: "04 Permission denied", href: "/screens/permission-denied" },
      { label: "05 Mic check", href: "/validate/a", note: "live component" },
    ],
  },
  {
    name: "The answer loop",
    screens: [
      { label: "06 Setting picker", href: "/screens/setting-picker" },
      { label: "07 Question ready", href: "/screens/question-ready" },
      { label: "08 Recording", href: "/record", note: "live component, after granting the mic" },
      { label: "09 Processing", href: "/screens/processing" },
      { label: "10 Recovery", href: "/screens/recovery" },
      { label: "11 Feedback", href: "/screens/feedback" },
      { label: "11b Feedback, no result", href: "/screens/feedback/no-result" },
    ],
  },
  {
    name: "Endings and account",
    screens: [
      { label: "12 Signup", href: "/screens/signup" },
      { label: "13 Session end after skips", href: "/screens/session-end" },
      { label: "14 Session complete", href: "/screens/session-complete" },
    ],
  },
  {
    name: "What they keep",
    screens: [
      { label: "15 Stories list", href: "/screens/stories" },
      { label: "15b Stories list, empty", href: "/screens/stories/empty" },
      { label: "16 Recordings and privacy", href: "/screens/recordings-privacy" },
    ],
  },
];

export default function ScreensIndex() {
  return (
    <div className="mx-auto flex max-w-155 flex-col gap-12 px-12 py-16">
      <h1 className="font-serif text-[28px] leading-tight text-ink">Screens, desktop preview</h1>
      {FLOWS.map((flow) => (
        <div key={flow.name} className="flex flex-col gap-3">
          <h2 className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
            {flow.name}
          </h2>
          <ul className="flex flex-col gap-2">
            {flow.screens.map((screen) => (
              <li key={screen.label} className="flex items-baseline gap-3">
                <Link href={screen.href} className="font-sans text-base text-ink underline">
                  {screen.label}
                </Link>
                {screen.note && <span className="font-sans text-xs text-muted">{screen.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
