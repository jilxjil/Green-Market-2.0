import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { profiles } from "@/db/schema";
import {
  createPendingOrders,
  validateCheckout,
} from "@/lib/checkout";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "buyer") {
    return NextResponse.json(
      { error: "Only buyers can place orders" },
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

  for (const createdOrder of createdOrders) {
    await createNotification({
      userId: createdOrder.sellerId,
      type: "new_order",
      title: "New Order",
      body: `You received a new unpaid order with ${createdOrder.itemCount} item(s).`,
      metadata: {
        orderId: createdOrder.orderId,
        href: "/dashboard/seller/orders",
      },
    });
  }

  const orderIds = createdOrders.map((order) => order.orderId);

  return NextResponse.json({
    success: true,
    orderIds,
    orderId: orderIds[0],
  });
}
