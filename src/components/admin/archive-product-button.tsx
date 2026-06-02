"use client";

import { useState } from "react";
import { Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface ArchiveProductButtonProps {
  productId: string;
}

export default function ArchiveProductButton({
  productId,
}: ArchiveProductButtonProps) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  async function archiveProduct() {
    setIsArchiving(true);

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "archived" }),
    });

    setIsArchiving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Unable to archive product.");
      return;
    }

    toast.success("Product archived.");
    router.refresh();
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isArchiving}
      onClick={archiveProduct}
    >
      <Archive className="h-3.5 w-3.5" />
      {isArchiving ? "Archiving..." : "Archive"}
    </Button>
  );
}
