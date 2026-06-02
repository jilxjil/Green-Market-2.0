import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { admins, sellerProfiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";

const verificationStatuses = ["pending", "verified", "rejected"] as const;
type VerificationStatus = (typeof verificationStatuses)[number];

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;
  const body = await req.json().catch(() => null);
  const status = String(body?.verificationStatus ?? "").trim();

  if (!verificationStatuses.includes(status as VerificationStatus)) {
    return NextResponse.json(
      { error: "Invalid verificationStatus" },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(sellerProfiles)
    .set({ verificationStatus: status })
    .where(and(eq(sellerProfiles.userId, userId)))
    .returning({
      userId: sellerProfiles.userId,
      verificationStatus: sellerProfiles.verificationStatus,
    });

  if (!updated) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, seller: updated });
}

