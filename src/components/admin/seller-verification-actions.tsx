"use client";

import { useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const actions = [
  { status: "pending", label: "Pending", icon: Clock },
  { status: "verified", label: "Verify", icon: CheckCircle },
  { status: "rejected", label: "Reject", icon: XCircle },
] as const;

interface SellerVerificationActionsProps {
  userId: string;
  currentStatus: string;
}

export default function SellerVerificationActions({
  userId,
  currentStatus,
}: SellerVerificationActionsProps) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  async function updateVerificationStatus(verificationStatus: string) {
    setLoadingStatus(verificationStatus);

    const res = await fetch(`/api/admin/sellers/${userId}/verification`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationStatus }),
    });

    setLoadingStatus(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Unable to update seller verification.");
      return;
    }

    toast.success("Seller verification updated.");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const isCurrent = currentStatus === action.status;
        const isLoading = loadingStatus === action.status;

        return (
          <Button
            key={action.status}
            type="button"
            size="sm"
            variant={isCurrent ? "default" : "outline"}
            disabled={Boolean(loadingStatus) || isCurrent}
            onClick={() => updateVerificationStatus(action.status)}
          >
            <Icon className="h-3.5 w-3.5" />
            {isLoading ? "Saving..." : action.label}
          </Button>
        );
      })}
    </div>
  );
}
