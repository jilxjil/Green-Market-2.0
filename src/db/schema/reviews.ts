import { integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { orders } from "./orders";
import { products } from "./products";
import { user } from "./auth";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sellerUserId: text("seller_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    buyerUserId: text("buyer_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    oneReviewPerProductOrder: uniqueIndex("reviews_order_product_buyer_unique").on(
      table.orderId,
      table.productId,
      table.buyerUserId
    ),
  })
);
