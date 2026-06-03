import Link from "next/link";

import { getUserConversations } from "@/lib/conversations";
import { requireProfile } from "@/lib/auth/require-role";

export default async function MessagesPage() {
  const { user } = await requireProfile();
  const conversations = await getUserConversations(user.id);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Chat with sellers, buyers, experts, and consultation clients.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No conversations yet. Start one from an order or consultation.
        </div>
      ) : (
        <div className="divide-y overflow-hidden rounded-lg border bg-card">
          {conversations.map(({ conversation, otherUser, latestMessage }) => (
            <Link
              key={conversation.id}
              href={`/dashboard/messages/${conversation.id}`}
              className="block p-4 transition hover:bg-muted"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">{otherUser?.name ?? "Conversation"}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {latestMessage?.body ?? `${conversation.contextType} conversation`}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                  {conversation.contextType}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
