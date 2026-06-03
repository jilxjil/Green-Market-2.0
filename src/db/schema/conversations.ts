import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { consultationRequests } from "./consultation-requests";
import { orders } from "./orders";
import { user } from "./auth";

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contextType: text("context_type").notNull(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
    consultationRequestId: uuid("consultation_request_id").references(
      () => consultationRequests.id,
      { onDelete: "cascade" }
    ),
    participantOneId: text("participant_one_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    participantTwoId: text("participant_two_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    orderConversation: uniqueIndex("conversations_order_unique").on(table.orderId),
    consultationConversation: uniqueIndex("conversations_consultation_unique").on(
      table.consultationRequestId
    ),
  })
);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderUserId: text("sender_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
