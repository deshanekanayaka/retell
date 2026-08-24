import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

// docs/07-design-system.md section 4.1: primary is filled accent, secondary is
// ink-soft text with no fill. Nothing else, accent never appears on a
// secondary control (section 3.1). Danger is the one live-red exception,
// section 3.2: only ever a delete flow's confirm control, or the resting
// account-deletion button.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-surface active:bg-accent-press",
  secondary: "bg-transparent text-ink-soft",
  danger: "border border-live bg-transparent text-live",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded px-6 py-3.5 font-sans text-[17px] font-medium transition-colors duration-100";

  return (
    <button
      type="button"
      className={`${base} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
