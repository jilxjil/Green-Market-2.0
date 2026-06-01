import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { consultationRequests, expertServices } from "@/db/schema";

export async function getRequesterConsultationRequests(userId: string) {
  return db
    .select({
      request: consultationRequests,
      service: expertServices,
    })
    .from(consultationRequests)
    .innerJoin(expertServices, eq(expertServices.id, consultationRequests.serviceId))
    .where(eq(consultationRequests.requesterUserId, userId))
    .orderBy(desc(consultationRequests.createdAt));
}
