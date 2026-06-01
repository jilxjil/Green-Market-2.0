"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { ProductStatus } from "@/lib/product-utils";

interface ProductStatusActionsProps {
  productId: string;
  status: string | null;
  stockQuantity: number | null;
}

const statusLabels: Record<ProductStatus, string> = {
  active: "Active",
  out_of_stock: "Out of stock",
  archived: "Archived",
};

export default function ProductStatusActions({
  productId,
  status,
  stockQuantity,
}: ProductStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const currentStatus = (status ?? "active") as ProductStatus;

  async function updateStatus(nextStatus: ProductStatus) {
    setLoading(true);

    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Unable to update product status.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-4 space-y-3 border-t pt-4">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
          {statusLabels[currentStatus] ?? currentStatus}
        </span>
        <span className="text-sm text-muted-foreground">
          {stockQuantity ?? 0} in stock
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {currentStatus !== "active" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => updateStatus("active")}
          >
            Mark active
          </Button>
        )}
        {currentStatus !== "out_of_stock" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => updateStatus("out_of_stock")}
          >
            Mark out of stock
          </Button>
        )}
        {currentStatus !== "archived" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => updateStatus("archived")}
          >
            Archive
          </Button>
        )}
      </div>
    </div>
  );
}
