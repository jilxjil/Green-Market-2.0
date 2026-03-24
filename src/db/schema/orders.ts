import { pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { users } from "./users";

export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    buyerId: uuid("buyer_id")
        .notNull()
        .references(() => users.id, {onDelete: "cascade"}),
    totalAmount: numeric("total_amount", {precision: 10, scale: 2}).notNull(),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})