import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { expertServices } from "./expert-services";

export const consultationRequests = pgTable("consultation_requests", {
  id: uuid("id").defaultRandom().primaryKey(),

  serviceId: uuid("service_id")
    .notNull()
    .references(() => expertServices.id, { onDelete: "cascade" }),

  requesterUserId: text("requester_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  message: text("message"),

  status: text("status").notNull().default("pending"),

  scheduledFor: timestamp("scheduled_for"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
