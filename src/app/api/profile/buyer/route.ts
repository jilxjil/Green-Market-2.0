import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { buyerProfileUpdateSchema } from "@/lib/validations/buyer-profile";
import { db } from "@/db";
import { buyerProfiles, profiles } from "@/db/schema";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "buyer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const buyerProfile = await db.query.buyerProfiles.findFirst({
    where: eq(buyerProfiles.userId, user.id),
  });

  if (!buyerProfile) {
    const [created] = await db
      .insert(buyerProfiles)
      .values({ userId: user.id })
      .returning();

    return NextResponse.json({
      businessName: created?.businessName ?? "",
      businessType: created?.businessType ?? "",
    });
  }

  return NextResponse.json({
    businessName: buyerProfile.businessName ?? "",
    businessType: buyerProfile.businessType ?? "",
  });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "buyer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = buyerProfileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updates: { businessName?: string | null; businessType?: string | null } = {};

  if (parsed.data.businessName !== undefined) {
    updates.businessName = parsed.data.businessName.length
      ? parsed.data.businessName
      : null;
  }

  if (parsed.data.businessType !== undefined) {
    updates.businessType = parsed.data.businessType.length
      ? parsed.data.businessType
      : null;
  }

  const [updated] = await db
    .update(buyerProfiles)
    .set(updates)
    .where(eq(buyerProfiles.userId, user.id))
    .returning({
      businessName: buyerProfiles.businessName,
      businessType: buyerProfiles.businessType,
    });

  if (updated) {
    return NextResponse.json(updated);
  }

  const [created] = await db
    .insert(buyerProfiles)
    .values({ userId: user.id, ...updates })
    .returning({
      businessName: buyerProfiles.businessName,
      businessType: buyerProfiles.businessType,
    });

  return NextResponse.json(created);
}
