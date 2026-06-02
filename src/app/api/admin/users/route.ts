import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { admins, profiles, user as users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";

async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, user.id),
  });

  if (!admin) {
    return null;
  }

  return user;
}

export async function GET() {
  const user = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await db
    .select({
      user: users,
      profile: profiles,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .orderBy(users.createdAt);

  return NextResponse.json(
    rows.map((row) => ({
      id: row.user.id,
      name: row.user.name,
      email: row.user.email,
      createdAt: row.user.createdAt,
      role: row.profile?.role ?? null,
    }))
  );
}

