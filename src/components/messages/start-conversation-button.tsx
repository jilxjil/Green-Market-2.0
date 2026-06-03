"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function StartConversationButton({
  orderId,
  consultationRequestId,
  label = "Message",
}: {
  orderId?: string;
  consultationRequestId?: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function startConversation() {
    setLoading(true);

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, consultationRequestId }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Unable to open conversation.");
      return;
    }

    router.push(`/dashboard/messages/${data.conversation.id}`);
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={loading}
      onClick={startConversation}
    >
      <MessageSquare className="h-3.5 w-3.5" />
      {loading ? "Opening..." : label}
    </Button>
  );
}
