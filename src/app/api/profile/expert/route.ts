import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { expertProfiles, profiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { expertProfileUpdateSchema } from "@/lib/validations/expert-profile";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "expert") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const expertProfile = await db.query.expertProfiles.findFirst({
    where: eq(expertProfiles.userId, user.id),
  });

  if (!expertProfile) {
    const [created] = await db
      .insert(expertProfiles)
      .values({ userId: user.id })
      .returning({
        expertise: expertProfiles.expertise,
        yearsOfExperience: expertProfiles.yearsOfExperience,
      });

    return NextResponse.json(created ?? { expertise: null, yearsOfExperience: null });
  }

  return NextResponse.json({
    expertise: expertProfile.expertise ?? null,
    yearsOfExperience: expertProfile.yearsOfExperience ?? null,
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

  if (!profile || profile.role !== "expert") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = expertProfileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updates: {
    expertise?: string | null;
    yearsOfExperience?: number | null;
  } = {};

  if (parsed.data.expertise !== undefined) {
    updates.expertise = parsed.data.expertise.length ? parsed.data.expertise : null;
  }

  if (parsed.data.yearsOfExperience !== undefined) {
    updates.yearsOfExperience = parsed.data.yearsOfExperience;
  }

  const [updated] = await db
    .update(expertProfiles)
    .set(updates)
    .where(eq(expertProfiles.userId, user.id))
    .returning({
      expertise: expertProfiles.expertise,
      yearsOfExperience: expertProfiles.yearsOfExperience,
    });

  if (updated) {
    return NextResponse.json(updated);
  }

  const [created] = await db
    .insert(expertProfiles)
    .values({ userId: user.id, ...updates })
    .returning({
      expertise: expertProfiles.expertise,
      yearsOfExperience: expertProfiles.yearsOfExperience,
    });

  return NextResponse.json(created ?? { expertise: null, yearsOfExperience: null });
}
