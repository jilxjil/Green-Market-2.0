import { pgTable, text, timestamp, uuid, numeric, integer } from "drizzle-orm/pg-core";
import {users} from "./users";

export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id")
        .notNull()
        .references(() => users.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    price: numeric("price", {precision: 10, scale: 2}).notNull(),
    quantity: integer("quantity").notNull(),
    unit: text("unit").notNull(),
    imageUrl: text("image_url"),
    location: text("location"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})