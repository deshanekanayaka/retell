import { Button } from "@/components/ui/Button";

// Preview only. Ships for real in S4, FR-7 to FR-9: shown only after
// feedback, email is the only typed input in the product besides the
// browser gate, opt out sits beside the primary control.
export default function SignupScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-8 px-12 py-24">
      <h1 className="font-serif text-[42px] leading-tight text-ink">Want to keep this?</h1>
      <p className="max-w-[56ch] font-sans text-base leading-[1.55] text-ink-soft">
        Your answer is saved for the next 24 hours. Sign up and it stays.
      </p>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          disabled
          className="min-h-15 rounded border border-rule bg-surface px-4 py-3 font-sans text-base text-ink"
        />
      </div>
      <div className="flex items-center gap-6">
        <Button>Continue</Button>
        <Button variant="secondary" className="underline">
          Not now
        </Button>
      </div>
    </div>
  );
}
