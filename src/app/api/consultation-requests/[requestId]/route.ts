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
import { createNotification } from "@/lib/notifications";
import { normalizeScheduleInput } from "@/lib/validations/consultation-meeting";

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

  if (
    nextStatus === "completed" &&
    existing.scheduledFor &&
    existing.scheduledFor.getTime() > Date.now()
  ) {
    return NextResponse.json(
      { error: "Consultations can only be completed after their scheduled time" },
      { status: 400 }
    );
  }

  let scheduleData:
    | ReturnType<typeof normalizeScheduleInput>
    | null = null;

  if (nextStatus === "scheduled") {
    if (!isExpert) {
      return NextResponse.json(
        { error: "Only the expert can schedule consultations" },
        { status: 403 }
      );
    }

    try {
      scheduleData = normalizeScheduleInput(body);
    } catch {
      return NextResponse.json(
        { error: "A future scheduledFor time and valid https meetingUrl are required" },
        { status: 400 }
      );
    }
  } else if (
    body &&
    ("scheduledFor" in body ||
      "meetingUrl" in body ||
      "meetingNotes" in body ||
      "meetingProvider" in body)
  ) {
    return NextResponse.json(
      { error: "Meeting details can only be set when scheduling" },
      { status: 400 }
    );
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
      scheduledFor: scheduleData?.scheduledFor,
      meetingUrl: scheduleData?.meetingUrl,
      meetingNotes: scheduleData?.meetingNotes,
      meetingProvider: scheduleData?.meetingProvider,
    })
    .where(whereClause)
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Request not found" },
      { status: 404 }
    );
  }

  if (isExpert) {
    const scheduledSuffix =
      nextStatus === "scheduled" && scheduleData
        ? ` for ${scheduleData.scheduledFor.toLocaleString()}`
        : "";

    await createNotification({
      userId: existing.requesterUserId,
      type:
        nextStatus === "scheduled"
          ? "consultation_scheduled"
          : "consultation_update",
      title:
        nextStatus === "scheduled"
          ? "Consultation Scheduled"
          : "Consultation Request Updated",
      body:
        nextStatus === "scheduled"
          ? `Your consultation has been scheduled${scheduledSuffix}.`
          : `Your consultation request status changed to ${nextStatus}.`,
      metadata: {
        requestId,
        href: `/consultations/${requestId}`,
        ...(scheduleData
          ? { scheduledFor: scheduleData.scheduledFor.toISOString() }
          : {}),
      },
    });
  } else if (isOwner && nextStatus === "cancelled") {
    await createNotification({
      userId: service.expertUserId,
      type: "consultation_cancelled",
      title: "Consultation Cancelled",
      body: `A client has cancelled their consultation request.`,
      metadata: {
        requestId,
        href: "/dashboard/expert/requests",
      },
    });
  }

  return NextResponse.json({
    success: true,
    request: updated,
  });
}
