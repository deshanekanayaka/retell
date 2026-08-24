"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/DeleteModal";

// docs/07-design-system.md section 3.2: live red is the confirm control in a
// delete flow. Account deletion is the one exception, the resting button
// takes it too, since it's the single irreversible action in the product.
export function DeleteButton({
  label = "Delete",
  confirmTitle,
  confirmDescription,
  confirmLabel = "Confirm delete",
  restColor = "neutral",
  className = "",
}: {
  label?: string;
  confirmTitle: string;
  confirmDescription: string;
  confirmLabel?: string;
  restColor?: "neutral" | "live";
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Button
        variant={restColor === "live" ? "danger" : "secondary"}
        className={className}
        onClick={() => setConfirming(true)}
      >
        {label}
      </Button>

      <DeleteModal
        open={confirming}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        onCancel={() => setConfirming(false)}
        onConfirm={() => setConfirming(false)}
      />
    </>
  );
}
