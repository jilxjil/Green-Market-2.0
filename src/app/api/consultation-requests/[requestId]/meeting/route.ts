import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { consultationRequests, expertServices, user as users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const row = rows[0];

  if (!row) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const isExpert = row.service.expertUserId === currentUser.id;
  const isRequester = row.request.requesterUserId === currentUser.id;

  if (!isExpert && !isRequester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: row.request.id,
    status: row.request.status,
    scheduledFor: row.request.scheduledFor,
    meetingUrl: row.request.status === "scheduled" ? row.request.meetingUrl : null,
    meetingNotes: row.request.status === "scheduled" ? row.request.meetingNotes : null,
    meetingProvider:
      row.request.status === "scheduled" ? row.request.meetingProvider : null,
    message: row.request.message,
    createdAt: row.request.createdAt,
    service: {
      id: row.service.id,
      title: row.service.title,
      durationMinutes: row.service.durationMinutes,
      price: row.service.price,
      expertUserId: row.service.expertUserId,
    },
    requester: {
      id: row.requester.id,
      name: row.requester.name,
      email: row.requester.email,
    },
  });
}
