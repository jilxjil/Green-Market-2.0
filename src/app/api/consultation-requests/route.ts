import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { consultationRequests, expertServices, profiles, user as users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createNotification } from "@/lib/notifications";

function hideMeetingUntilScheduled<T extends { request: typeof consultationRequests.$inferSelect }>(
  row: T
) {
  if (row.request.status === "scheduled") {
    return row;
  }

  return {
    ...row,
    request: {
      ...row.request,
      meetingUrl: null,
      meetingNotes: null,
      meetingProvider: null,
    },
  };
}

export async function GET() {
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

  if (profile.role === "expert") {
    const rows = await db
      .select({
        request: consultationRequests,
        service: expertServices,
        requester: users,
      })
      .from(consultationRequests)
      .innerJoin(expertServices, eq(expertServices.id, consultationRequests.serviceId))
      .innerJoin(users, eq(users.id, consultationRequests.requesterUserId))
      .where(eq(expertServices.expertUserId, user.id))
      .orderBy(desc(consultationRequests.createdAt));

    return NextResponse.json(rows.map(hideMeetingUntilScheduled));
  }

  if (profile.role === "buyer" || profile.role === "seller") {
    const rows = await db
      .select({
        request: consultationRequests,
        service: expertServices,
      })
      .from(consultationRequests)
      .innerJoin(expertServices, eq(expertServices.id, consultationRequests.serviceId))
      .where(eq(consultationRequests.requesterUserId, user.id))
      .orderBy(desc(consultationRequests.createdAt));

    return NextResponse.json(rows.map(hideMeetingUntilScheduled));
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || (profile.role !== "buyer" && profile.role !== "seller")) {
    return NextResponse.json(
      { error: "Only buyers or sellers can create consultation requests" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const serviceId = String(body?.serviceId ?? "").trim();
  const message =
    body && "message" in body ? (body.message == null ? null : String(body.message)) : undefined;

  if (!serviceId) {
    return NextResponse.json(
      { error: "serviceId is required" },
      { status: 400 }
    );
  }

  const service = await db.query.expertServices.findFirst({
    where: eq(expertServices.id, serviceId),
  });

  if (!service) {
    return NextResponse.json(
      { error: "Service not found" },
      { status: 404 }
    );
  }

  if (service.archivedAt) {
    return NextResponse.json(
      { error: "Service is archived" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(consultationRequests)
    .values({
      serviceId,
      requesterUserId: user.id,
      message: message === undefined ? null : message,
    })
    .returning();

  await createNotification({
    userId: service.expertUserId,
    type: "new_consultation",
    title: "New Consultation Request",
    body: `You received a new consultation request for ${service.title}.`,
    metadata: {
      requestId: created.id,
      href: "/dashboard/expert/requests",
    },
  });

  return NextResponse.json({
    success: true,
    request: created,
  });
}
