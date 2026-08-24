import type { ReactNode } from "react";

// One section of the marketing page. The eyebrow label is the only all-caps in
// the product outside the app's small section labels (docs/07 section 2.2),
// and the 1px rule above it is the only separator, since docs/07 section 4
// rules out shadows and tinted panels for creating structure.
export function LandingSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-rule py-16">
      <div className="mx-auto flex max-w-215 flex-col gap-8 px-12">
        <h2 className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          {label}
        </h2>
        {children}
      </div>
    </section>
  );
}
