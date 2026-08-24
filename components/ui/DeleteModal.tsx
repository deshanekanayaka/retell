"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// docs/07-design-system.md section 3.2: live red is only ever the confirm
// control in a delete flow. A popup keeps that confirm control physically
// separate from the resting button, so there's no way to hit both in one
// careless click.
export function DeleteModal({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // A delete dialog is the one place in the product where a stray keystroke
  // is unrecoverable, so focus moves in on open, cannot Tab out to the page
  // behind, and returns to the trigger on close.
  useEffect(() => {
    if (!open) {
      return;
    }

    const trigger = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const stops = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center overscroll-contain bg-ink/40 px-6"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[420px] flex-col gap-4 rounded border border-rule bg-surface p-6"
      >
        <h2
          id="delete-modal-title"
          className="font-sans text-[13px] font-medium uppercase tracking-wide text-ink"
        >
          {title}
        </h2>
        <p id="delete-modal-description" className="font-sans text-[15px] leading-[1.45] text-ink-soft">
          {description}
        </p>
        <div className="flex items-center gap-4 pt-2">
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center px-2 font-sans text-[13px] text-ink-soft"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
