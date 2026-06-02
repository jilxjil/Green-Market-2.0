import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { expertServices, profiles } from "@/db/schema";
import { expertServiceCreateSchema } from "@/lib/validations/expert-service";

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
  const parsed = expertServiceCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request data", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { title, description, price, durationMinutes } = parsed.data;

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
