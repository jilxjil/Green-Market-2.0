import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { admins, sellerProfiles, user as users } from "@/db/schema";
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
      sellerProfile: sellerProfiles,
      sellerUser: users,
    })
    .from(sellerProfiles)
    .innerJoin(users, eq(users.id, sellerProfiles.userId));

  return NextResponse.json(
    rows.map((row) => ({
      userId: row.sellerUser.id,
      name: row.sellerUser.name,
      email: row.sellerUser.email,
      farmName: row.sellerProfile.farmName,
      location: row.sellerProfile.location,
      verificationStatus: row.sellerProfile.verificationStatus ?? "pending",
    }))
  );
}

