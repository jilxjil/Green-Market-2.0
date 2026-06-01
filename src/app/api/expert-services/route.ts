import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { expertServices, profiles } from "@/db/schema";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "expert") {
    return NextResponse.json(
      { error: "Only experts can access services" },
      { status: 403 }
    );
  }

  const services = await db
    .select()
    .from(expertServices)
    .where(eq(expertServices.expertUserId, user.id))
    .orderBy(desc(expertServices.createdAt));

  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "expert") {
    return NextResponse.json(
      { error: "Only experts can create services" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const description =
    body && "description" in body ? (body.description == null ? null : String(body.description)) : undefined;
  const price = Number(body?.price);
  const durationMinutes =
    body?.durationMinutes == null ? 60 : Number(body.durationMinutes);

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  if (!Number.isFinite(price) || !Number.isInteger(price) || price <= 0) {
    return NextResponse.json(
      { error: "Price must be a positive integer" },
      { status: 400 }
    );
  }

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

  const [service] = await db
    .insert(expertServices)
    .values({
      expertUserId: user.id,
      title,
      description: description === undefined ? null : description,
      price,
      durationMinutes,
    })
    .returning();

  return NextResponse.json({
    success: true,
    service,
  });
}

