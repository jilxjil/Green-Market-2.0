import { pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    buyerId: uuid("buyer_id")
        .notNull()
        .references(() => profiles.id, {onDelete: "cascade"}),
    totalAmount: numeric("total_amount", {precision: 10, scale: 2}).notNull(),
    status: text("status").notNull().default("pending"),
    shippingAddress: text("shipping_address"),
    fulfillmentStatus: text("fulfillment_status").notNull().default("not_shipped"),
    paymentStatus: text("payment_status").notNull().default("unpaid"),
    trackingNumber: text("tracking_number"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})
