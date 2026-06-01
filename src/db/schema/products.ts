import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  sellerId: text("seller_id")
    .notNull(),

  title: text("title")
    .notNull(),

  description: text("description"),

  category: text("category"),

  price: integer("price")
    .notNull(),

  stockQuantity: integer("stock_quantity")
    .default(0),

  imageUrl: text("image_url"),

  status: text("status")
    .notNull()
    .default("active"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});