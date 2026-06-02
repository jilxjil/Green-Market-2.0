"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type FulfillmentStatus } from "@/lib/orders";

interface FulfillmentStatusFormProps {
  orderId: string;
  orderStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
}

function getNextFulfillmentStatuses(status: string): FulfillmentStatus[] {
  if (status === "not_shipped") {
    return ["shipped"];
  }

  if (status === "shipped") {
    return ["delivered"];
  }

  return [];
}

export default function FulfillmentStatusForm({
  orderId,
  orderStatus,
  fulfillmentStatus,
  trackingNumber,
}: FulfillmentStatusFormProps) {
  const router = useRouter();
  const [nextTrackingNumber, setNextTrackingNumber] = useState(trackingNumber ?? "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const nextStatuses = getNextFulfillmentStatuses(fulfillmentStatus);
  const canUpdate = orderStatus === "confirmed" || orderStatus === "fulfilled";

  async function updateFulfillment(nextStatus: FulfillmentStatus) {
    setIsUpdating(true);
    setError("");

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fulfillmentStatus: nextStatus,
        trackingNumber: nextTrackingNumber.trim() || null,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not update delivery status.");
      setIsUpdating(false);
      return;
    }

    router.refresh();
    setIsUpdating(false);
  }

  if (!canUpdate) {
    return (
      <p className="text-sm text-muted-foreground">
        Confirm the order before updating delivery.
      </p>
    );
  }

  if (nextStatuses.length === 0) {
    return <p className="text-sm text-muted-foreground">Delivery is delivered.</p>;
  }

  return (
    <div className="space-y-3">
      <Input
        className="h-10"
        placeholder="Optional tracking or rider reference"
        value={nextTrackingNumber}
        onChange={(event) => setNextTrackingNumber(event.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((nextStatus) => (
          <Button
            key={nextStatus}
            type="button"
            disabled={isUpdating}
            onClick={() => updateFulfillment(nextStatus)}
          >
            Mark {nextStatus.replace("_", " ")}
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
