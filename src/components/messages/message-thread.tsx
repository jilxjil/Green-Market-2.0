"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ThreadMessage {
  id: string;
  senderUserId: string;
  body: string;
  createdAt: string;
  senderName: string;
}

export default function MessageThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: ThreadMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    let cancelled = false;

    async function refreshMessages() {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (!cancelled) {
          toast.error(data.error || "Unable to refresh messages.");
        }
        return;
      }

      if (!cancelled && Array.isArray(data.messages)) {
        setMessages(
          data.messages.map(
            ({ message, senderName }: { message: ThreadMessage; senderName: string }) => ({
              ...message,
              senderName,
            })
          )
        );
      }
    }

    const interval = window.setInterval(refreshMessages, 4000);
    window.addEventListener("green-market:message-sent", refreshMessages);
    return () => {
      cancelled = true;
      window.removeEventListener("green-market:message-sent", refreshMessages);
      window.clearInterval(interval);
    };
  }, [conversationId]);

  return (
    <section className="min-h-[360px] space-y-3 rounded-lg border bg-card p-4">
      {messages.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        messages.map((message) => {
          const own = message.senderUserId === currentUserId;

          return (
            <div key={message.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  own ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-xs opacity-80">{own ? "You" : message.senderName}</p>
                <p className="mt-1 whitespace-pre-wrap">{message.body}</p>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
