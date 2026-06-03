import { desc, eq, or } from "drizzle-orm";

import { db } from "@/db";
import {
  consultationRequests,
  conversations,
  expertServices,
  messages,
  orderItems,
  orders,
  products,
  profiles,
  user as users,
} from "@/db/schema";

export function userCanAccessConversation(
  conversation: typeof conversations.$inferSelect,
  userId: string
) {
  return (
    conversation.participantOneId === userId ||
    conversation.participantTwoId === userId
  );
}

export async function getUserConversations(userId: string) {
  const rows = await db
    .select({
      conversation: conversations,
    })
    .from(conversations)
    .innerJoin(users, eq(users.id, conversations.participantOneId))
    .where(
      or(
        eq(conversations.participantOneId, userId),
        eq(conversations.participantTwoId, userId)
      )
    )
    .orderBy(desc(conversations.updatedAt));

  return Promise.all(
    rows.map(async (row) => {
      const otherUserId =
        row.conversation.participantOneId === userId
          ? row.conversation.participantTwoId
          : row.conversation.participantOneId;
      const other = await db.query.user.findFirst({
        where: eq(users.id, otherUserId),
      });
      const [latestMessage] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, row.conversation.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      return {
        conversation: row.conversation,
        otherUser: other,
        latestMessage,
      };
    })
  );
}

export async function getConversationMessages(conversationId: string, userId: string) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conversation || !userCanAccessConversation(conversation, userId)) {
    return null;
  }

  const rows = await db
    .select({
      message: messages,
      senderName: users.name,
    })
    .from(messages)
    .innerJoin(users, eq(users.id, messages.senderUserId))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  const otherUserId =
    conversation.participantOneId === userId
      ? conversation.participantTwoId
      : conversation.participantOneId;
  const other = await db.query.user.findFirst({
    where: eq(users.id, otherUserId),
  });

  return { conversation, otherUser: other, messages: rows };
}

export async function createMessage(conversationId: string, userId: string, body: string) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conversation || !userCanAccessConversation(conversation, userId)) {
    return null;
  }

  const [message] = await db
    .insert(messages)
    .values({
      conversationId,
      senderUserId: userId,
      body,
    })
    .returning();

  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  return message;
}

export async function findOrCreateOrderConversation(orderId: string, userId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) return null;

  const buyerProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, order.buyerId),
  });

  if (!buyerProfile) return null;

  const itemRows = await db
    .select({ sellerId: products.sellerId })
    .from(orderItems)
    .innerJoin(products, eq(products.id, orderItems.productId))
    .where(eq(orderItems.orderId, orderId))
    .limit(1);

  const sellerId = itemRows[0]?.sellerId;
  if (!sellerId) return null;

  if (userId !== buyerProfile.userId && userId !== sellerId) {
    return null;
  }

  const [existing] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.orderId, orderId))
    .limit(1);

  if (existing) return existing;

  const [conversation] = await db
    .insert(conversations)
    .values({
      contextType: "order",
      orderId,
      participantOneId: buyerProfile.userId,
      participantTwoId: sellerId,
    })
    .returning();

  return conversation;
}

export async function findOrCreateConsultationConversation(
  requestId: string,
  userId: string
) {
  const rows = await db
    .select({
      request: consultationRequests,
      service: expertServices,
    })
    .from(consultationRequests)
    .innerJoin(expertServices, eq(expertServices.id, consultationRequests.serviceId))
    .where(eq(consultationRequests.id, requestId))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const requesterId = row.request.requesterUserId;
  const expertId = row.service.expertUserId;

  if (userId !== requesterId && userId !== expertId) {
    return null;
  }

  const [existing] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.consultationRequestId, requestId))
    .limit(1);

  if (existing) return existing;

  const [conversation] = await db
    .insert(conversations)
    .values({
      contextType: "consultation",
      consultationRequestId: requestId,
      participantOneId: requesterId,
      participantTwoId: expertId,
    })
    .returning();

  return conversation;
}
