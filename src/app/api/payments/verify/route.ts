import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { payments, profiles } from "@/db/schema";
import { completePaymentSuccess } from "@/lib/payments";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function GET(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference")?.trim();

  if (!reference) {
    return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
  }

  const [profile, payment] = await Promise.all([
    db.query.profiles.findFirst({ where: eq(profiles.userId, user.id) }),
    db.query.payments.findFirst({ where: eq(payments.paystackReference, reference) }),
  ]);

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (!profile || payment.metadata?.buyerProfileId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await completePaymentSuccess(reference);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    success: true,
    alreadyProcessed: result.alreadyProcessed,
    orderIds: result.orderIds,
    orderId: result.orderIds[0] ?? null,
  });
}
