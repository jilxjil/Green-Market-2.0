"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function CancelConsultationButton({
  requestId,
  status,
}: {
  requestId: string;
  status: string;
}) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  if (status !== "pending" && status !== "accepted") {
    return null;
  }

  async function cancelRequest() {
    setIsCancelling(true);
    setError("");

    const res = await fetch(`/api/consultation-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Unable to cancel consultation.");
      setIsCancelling(false);
      return;
    }

    router.refresh();
    setIsCancelling(false);
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        disabled={isCancelling}
        onClick={cancelRequest}
      >
        {isCancelling ? "Cancelling..." : "Cancel request"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
