import { jsonb, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const paymentStatuses = ["pending", "success", "failed"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export interface PaymentMetadata {
  orderIds?: string[];
  buyerProfileId?: string;
}

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  paystackReference: text("paystack_reference").notNull().unique(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("GHS"),
  status: text("status").notNull().default("pending"),
  channel: text("channel"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: jsonb("metadata").$type<PaymentMetadata>(),
});
