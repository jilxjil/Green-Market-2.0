import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { expertServices, profiles } from "@/db/schema";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const { serviceId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "expert") {
    return NextResponse.json(
      { error: "Only experts can update services" },
      { status: 403 }
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

  if (service.expertUserId !== user.id) {
    return NextResponse.json(
      { error: "You cannot update a service owned by another expert" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const updates: Partial<typeof expertServices.$inferInsert> = {};

  if (body && "title" in body) {
    const title = String(body.title ?? "").trim();
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    updates.title = title;
  }

  if (body && "description" in body) {
    updates.description = body.description == null ? null : String(body.description);
  }

  if (body && "price" in body) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || !Number.isInteger(price) || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive integer" },
        { status: 400 }
      );
    }
    updates.price = price;
  }

  if (body && "durationMinutes" in body) {
    const durationMinutes = Number(body.durationMinutes);
    if (
      !Number.isFinite(durationMinutes) ||
      !Number.isInteger(durationMinutes) ||
      durationMinutes <= 0
    ) {
      return NextResponse.json(
        { error: "Duration must be a positive integer (minutes)" },
        { status: 400 }
      );
    }
    updates.durationMinutes = durationMinutes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const [updatedService] = await db
    .update(expertServices)
    .set(updates)
    .where(and(eq(expertServices.id, serviceId), eq(expertServices.expertUserId, user.id)))
    .returning();

  return NextResponse.json({
    success: true,
    service: updatedService,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const { serviceId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "expert") {
    return NextResponse.json(
      { error: "Only experts can archive services" },
      { status: 403 }
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

  if (service.expertUserId !== user.id) {
    return NextResponse.json(
      { error: "You cannot archive a service owned by another expert" },
      { status: 403 }
    );
  }

  const [archivedService] = await db
    .update(expertServices)
    .set({ archivedAt: new Date() })
    .where(
      and(eq(expertServices.id, serviceId), eq(expertServices.expertUserId, user.id))
    )
    .returning();

  return NextResponse.json({
    success: true,
    service: archivedService,
  });
}
