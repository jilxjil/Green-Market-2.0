"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function MessageComposer({
  conversationId,
}: {
  conversationId: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    const data = await res.json().catch(() => ({}));
    setSending(false);

    if (!res.ok) {
      toast.error(data.error || "Unable to send message.");
      return;
    }

    setBody("");
    window.dispatchEvent(new Event("green-market:message-sent"));
    router.refresh();
  }

  return (
    <form onSubmit={sendMessage} className="flex gap-2">
      <textarea
        className="min-h-12 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder="Write a message..."
        value={body}
        onChange={(event) => setBody(event.target.value)}
        maxLength={2000}
        required
      />
      <Button type="submit" className="h-12" disabled={sending || !body.trim()}>
        <Send className="h-4 w-4" />
        {sending ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
