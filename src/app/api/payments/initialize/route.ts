import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { orders, payments, profiles } from "@/db/schema";
import { getAppBaseUrl } from "@/lib/app-url";
import {
  createPendingOrders,
  validateCheckout,
} from "@/lib/checkout";
import {
  cedisToPesewas,
  generatePaystackReference,
  initializeTransaction,
} from "@/lib/paystack";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, currentUser.id),
  });

  if (!profile || profile.role !== "buyer") {
    return NextResponse.json(
      { error: "Only buyers can initialize payments" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const checkout = await validateCheckout(body?.items, body?.shippingAddress);

  if (!checkout.ok) {
    return NextResponse.json({ error: checkout.error }, { status: checkout.status });
  }

  const createdOrders = await createPendingOrders(
    profile.id,
    checkout.itemsBySeller,
    checkout.shippingAddress
  );
  const orderIds = createdOrders.map((order) => order.orderId);

  const reference = generatePaystackReference();
  const amountInPesewas = cedisToPesewas(checkout.totalInCedis);
  const callbackUrl = `${getAppBaseUrl(req)}/cart/payment/callback?reference=${encodeURIComponent(reference)}`;

  await db.insert(payments).values({
    orderId: orderIds[0] ?? null,
    paystackReference: reference,
    amount: amountInPesewas,
    currency: "GHS",
    status: "pending",
    metadata: {
      orderIds,
      buyerProfileId: profile.id,
    },
  });

  try {
    const paystack = await initializeTransaction(
      currentUser.email,
      amountInPesewas,
      reference,
      callbackUrl,
      {
        orderIds,
        buyerProfileId: profile.id,
      }
    );

    return NextResponse.json({
      authorizationUrl: paystack.authorizationUrl,
      reference: paystack.reference,
      accessCode: paystack.accessCode,
      orderIds,
    });
  } catch (error) {
    await db.delete(payments).where(eq(payments.paystackReference, reference));
    if (orderIds.length > 0) {
      await db.delete(orders).where(inArray(orders.id, orderIds));
    }

    const message =
      error instanceof Error ? error.message : "Unable to initialize payment";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
