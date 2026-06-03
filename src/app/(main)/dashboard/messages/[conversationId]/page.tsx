import Link from "next/link";
import { notFound } from "next/navigation";

import MessageComposer from "@/components/messages/message-composer";
import MessageThread from "@/components/messages/message-thread";
import { getConversationMessages } from "@/lib/conversations";
import { requireProfile } from "@/lib/auth/require-role";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { user } = await requireProfile();
  const { conversationId } = await params;
  const detail = await getConversationMessages(conversationId, user.id);

  if (!detail) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <Link
          href="/dashboard/messages"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Back to messages
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {detail.otherUser?.name ?? "Conversation"}
        </h1>
        <p className="text-muted-foreground capitalize">
          {detail.conversation.contextType} conversation
        </p>
      </div>

      <MessageThread
        conversationId={conversationId}
        currentUserId={user.id}
        initialMessages={detail.messages.map(({ message, senderName }) => ({
          id: message.id,
          senderUserId: message.senderUserId,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
          senderName,
        }))}
      />

      <MessageComposer conversationId={conversationId} />
    </div>
  );
}
