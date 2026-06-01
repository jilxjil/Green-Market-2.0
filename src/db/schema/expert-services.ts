import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const expertServices = pgTable("expert_services", {
  id: uuid("id").defaultRandom().primaryKey(),

  expertUserId: text("expert_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  title: text("title").notNull(),

  description: text("description"),

  price: integer("price").notNull(),

  durationMinutes: integer("duration_minutes").notNull().default(60),

  archivedAt: timestamp("archived_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
