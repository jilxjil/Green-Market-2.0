import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { consultationRequests, expertServices, profiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  canTransitionConsultationRequestStatus,
  isConsultationRequestStatus,
  isExpertNextStatus,
} from "@/lib/consultation-requests";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await db.query.consultationRequests.findFirst({
    where: eq(consultationRequests.id, requestId),
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Request not found" },
      { status: 404 }
    );
  }

  const service = await db.query.expertServices.findFirst({
    where: eq(expertServices.id, existing.serviceId),
  });

  if (!service) {
    return NextResponse.json(
      { error: "Service not found" },
      { status: 404 }
    );
  }

  const isExpert = profile.role === "expert" && service.expertUserId === user.id;
  const isOwner = existing.requesterUserId === user.id;

  if (!isExpert && !isOwner) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const nextStatus = String(body?.status ?? "");

  if (!isConsultationRequestStatus(nextStatus)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  if (isExpert && isOwner) {
    return NextResponse.json(
      { error: "Invalid request ownership" },
      { status: 400 }
    );
  }

  if (isExpert) {
    if (!isExpertNextStatus(nextStatus)) {
      return NextResponse.json(
        { error: "Only the requester can set this status" },
        { status: 403 }
      );
    }
  }

  if (isOwner) {
    if (nextStatus !== "cancelled") {
      return NextResponse.json(
        { error: "Only the expert can set this status" },
        { status: 403 }
      );
    }
  }

  if (!canTransitionConsultationRequestStatus(existing.status, nextStatus)) {
    return NextResponse.json(
      { error: "Invalid status transition" },
      { status: 400 }
    );
  }

  if (body && "scheduledFor" in body) {
    if (!isExpert) {
      return NextResponse.json(
        { error: "Only the expert can set scheduledFor" },
        { status: 403 }
      );
    }

    if (nextStatus !== "scheduled") {
      return NextResponse.json(
        { error: "scheduledFor can only be set when scheduling" },
        { status: 400 }
      );
    }

    if (body.scheduledFor != null) {
      const scheduledDate = new Date(String(body.scheduledFor));
      if (Number.isNaN(scheduledDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid scheduledFor" },
          { status: 400 }
        );
      }
    }
  }

  const whereClause = isExpert
    ? and(
        eq(consultationRequests.id, requestId),
        eq(consultationRequests.serviceId, service.id)
      )
    : and(
        eq(consultationRequests.id, requestId),
        eq(consultationRequests.requesterUserId, user.id)
      );

  const [updated] = await db
    .update(consultationRequests)
    .set({
      status: nextStatus,
      scheduledFor:
        body && "scheduledFor" in body
          ? body.scheduledFor == null
            ? null
            : new Date(String(body.scheduledFor))
          : undefined,
    })
    .where(whereClause)
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    request: updated,
  });
}
