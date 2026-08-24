// Preview only. Ships for real in S5 (docs/03-delivery-plan.md), FR-4: tapping
// a tile advances, no typing, no multi-select.
const SETTINGS = [
  "A group project",
  "A job",
  "A society",
  "Something I built",
  "An internship",
  "Other",
];

export default function SettingPickerScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-8 px-12 py-24">
      <div className="flex flex-col gap-2">
        <h1 className="max-w-[20ch] font-serif text-[34px] leading-tight text-ink">
          Where does most of your experience come from?
        </h1>
        <p className="font-sans text-sm text-muted">
          Pick the closest one. You can talk about other things later.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SETTINGS.map((setting) => (
          <button
            key={setting}
            type="button"
            className="flex h-30 items-end rounded border border-rule p-3 text-left font-sans text-base font-medium text-ink"
          >
            {setting}
          </button>
        ))}
      </div>
    </div>
  );
}
