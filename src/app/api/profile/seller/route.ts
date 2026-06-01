import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { sellerProfileUpdateSchema } from "@/lib/validations/seller-profile";
import { db } from "@/db";
import { profiles, sellerProfiles } from "@/db/schema";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "seller") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sellerProfile = await db.query.sellerProfiles.findFirst({
    where: eq(sellerProfiles.userId, user.id),
  });

  if (!sellerProfile) {
    const [created] = await db
      .insert(sellerProfiles)
      .values({ userId: user.id })
      .returning();

    return NextResponse.json({
      farmName: created?.farmName ?? "",
      location: created?.location ?? "",
      verificationStatus: created?.verificationStatus ?? "pending",
    });
  }

  return NextResponse.json({
    farmName: sellerProfile.farmName ?? "",
    location: sellerProfile.location ?? "",
    verificationStatus: sellerProfile.verificationStatus ?? "pending",
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

  if (!profile || profile.role !== "seller") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = sellerProfileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updates: { farmName?: string | null; location?: string | null } = {};

  if (parsed.data.farmName !== undefined) {
    updates.farmName = parsed.data.farmName.length ? parsed.data.farmName : null;
  }

  if (parsed.data.location !== undefined) {
    updates.location = parsed.data.location.length ? parsed.data.location : null;
  }

  const [updated] = await db
    .update(sellerProfiles)
    .set(updates)
    .where(eq(sellerProfiles.userId, user.id))
    .returning({
      farmName: sellerProfiles.farmName,
      location: sellerProfiles.location,
      verificationStatus: sellerProfiles.verificationStatus,
    });

  if (updated) {
    return NextResponse.json(updated);
  }

  const [created] = await db
    .insert(sellerProfiles)
    .values({ userId: user.id, ...updates })
    .returning({
      farmName: sellerProfiles.farmName,
      location: sellerProfiles.location,
      verificationStatus: sellerProfiles.verificationStatus,
    });

  return NextResponse.json(created);
}
