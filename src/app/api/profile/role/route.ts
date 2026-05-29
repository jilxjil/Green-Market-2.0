import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { profiles } from "@/db/schema";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  return NextResponse.json({
    role: profile?.role ?? null,
  });
}
