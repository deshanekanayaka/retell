import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";

// Preview only. Ships for real in S6, FR-15, FR-38, FR-39: every raw audio
// file downloadable, deletable, account deletion kept as a separate block,
// not a row in the list.
const RECORDINGS = [
  { widths: ["62%", "32%"] },
  { widths: ["54%", "28%"] },
  { widths: ["70%", "34%"] },
  { widths: ["58%", "30%"] },
];

export default function RecordingsPrivacyScreen() {
  return (
    <div className="mx-auto grid min-h-screen max-w-250 content-center grid-cols-[1.5fr_1fr] items-start gap-16 px-12 py-16">
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-[28px] leading-tight text-ink">Recordings and privacy</h1>
        <div className="flex flex-col border-t border-rule">
          {RECORDINGS.map((recording, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 border-b border-rule py-4"
            >
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-2.5 rounded-sm bg-rule" style={{ width: recording.widths[0] }} />
                <div className="h-2 rounded-sm bg-rule" style={{ width: recording.widths[1] }} />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="min-h-11 border border-rule px-4 py-2 text-[13px]">
                  Download
                </Button>
                <DeleteButton
                  className="min-h-11 border border-rule px-4 py-2 text-[13px]"
                  confirmTitle="Delete this recording?"
                  confirmDescription="Deleting removes the audio and the transcript. It doesn't go anywhere else first."
                />
              </div>
            </div>
          ))}
        </div>
        <p className="max-w-[56ch] font-sans text-sm leading-[1.55] text-muted">
          Deleting a recording removes the audio and the transcript. It never trains a model
          without you saying yes first.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded border border-ink p-6">
        <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-ink">
          Delete my account
        </span>
        <p className="font-sans text-[15px] leading-[1.45] text-ink-soft">
          Deleting removes the audio and the transcript. It doesn&apos;t go anywhere else first.
        </p>
        <DeleteButton
          label="Delete everything"
          restColor="live"
          confirmTitle="Delete your account?"
          confirmDescription="This deletes your account and all associated audio and transcripts. It doesn't go anywhere else first."
          confirmLabel="Confirm, delete everything"
        />
      </div>
    </div>
  );
}
