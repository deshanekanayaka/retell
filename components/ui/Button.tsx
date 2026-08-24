import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

// docs/07-design-system.md section 4.1: primary is filled accent, secondary is
// ink-soft text with no fill. Nothing else, accent never appears on a
// secondary control (section 3.1). Danger is the one live-red exception,
// section 3.2: only ever a delete flow's confirm control, or the resting
// account-deletion button.
// Hover and press are colour changes only. docs/07 section 5.2 fixes the whole
// interaction vocabulary at a 100ms colour change, and 5.3 bans scale on press,
// so the usual `scale(0.98)` press feedback is deliberately absent.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-surface hover:bg-accent-press active:bg-accent-press",
  secondary: "bg-transparent text-ink-soft hover:text-ink",
  danger: "border border-live bg-transparent text-live hover:bg-live hover:text-surface",
};

const BASE_CLASSES =
  "inline-flex min-h-11 items-center justify-center rounded px-6 py-3.5 font-sans text-[17px] font-medium transition-colors duration-100";

// Exported so a real <a> can carry the same treatment without duplicating the
// class string. A control that navigates must be a link, not a button, so it
// supports Cmd-click and middle-click like any other link.
export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type="button" className={buttonClasses(variant, className)} {...props} />;
}
