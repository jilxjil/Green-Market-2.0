"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { type OrderStatus } from "@/lib/orders";

interface OrderStatusFormProps {
  orderId: string;
  status: string;
}

function getNextStatuses(status: string): OrderStatus[] {
  if (status === "pending") {
    return ["confirmed", "cancelled"];
  }

  if (status === "confirmed") {
    return ["fulfilled", "cancelled"];
  }

  return [];
}

export default function OrderStatusForm({ orderId, status }: OrderStatusFormProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const nextStatuses = getNextStatuses(status);

  async function updateStatus(nextStatus: OrderStatus) {
    setIsUpdating(true);
    setError("");

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not update order status.");
      setIsUpdating(false);
      return;
    }

    router.refresh();
    setIsUpdating(false);
  }

  if (nextStatuses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This order is {status}.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((nextStatus) => (
          <Button
            key={nextStatus}
            type="button"
            variant={nextStatus === "cancelled" ? "outline" : "default"}
            disabled={isUpdating}
            onClick={() => updateStatus(nextStatus)}
          >
            Mark {nextStatus}
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
