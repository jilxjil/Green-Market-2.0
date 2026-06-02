import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { consultationRequests, expertServices, user as users } from "@/db/schema";

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

export async function getConsultationRequestDetail(requestId: string, userId: string) {
  const rows = await db
    .select({
      request: consultationRequests,
      service: expertServices,
      requester: users,
    })
    .from(consultationRequests)
    .innerJoin(expertServices, eq(expertServices.id, consultationRequests.serviceId))
    .innerJoin(users, eq(users.id, consultationRequests.requesterUserId))
    .where(eq(consultationRequests.id, requestId))
    .limit(1);

  const detail = rows[0];

  if (!detail) {
    return null;
  }

  const isRequester = detail.request.requesterUserId === userId;
  const isExpert = detail.service.expertUserId === userId;

  if (!isRequester && !isExpert) {
    return null;
  }

  return {
    ...detail,
    canReadMeeting: detail.request.status === "scheduled",
    isRequester,
    isExpert,
  };
}
