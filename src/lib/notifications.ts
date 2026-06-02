import { db } from "@/db";
import { notifications } from "@/db/schema";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}) {
  return db.insert(notifications).values({
    userId: data.userId,
    type: data.type,
    title: data.title,
    body: data.body,
    metadata: data.metadata || null,
  });
}
