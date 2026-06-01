import { NextResponse } from "next/server";

import {
  canTransitionOrderStatus,
  getOrderForSeller,
  isOrderStatus,
  updateOrderStatus,
} from "@/lib/orders";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "seller") {
    return NextResponse.json(
      { error: "Only sellers can update orders" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const status = String(body?.status ?? "");

  if (!isOrderStatus(status)) {
    return NextResponse.json(
      { error: "Invalid order status" },
      { status: 400 }
    );
  }

  const sellerOrder = await getOrderForSeller(orderId, user.id);

  if (!sellerOrder) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  if (!sellerOrder.sellerOwnsAllItems) {
    return NextResponse.json(
      { error: "You cannot update an order owned by another seller" },
      { status: 403 }
    );
  }

  if (!canTransitionOrderStatus(sellerOrder.order.status, status)) {
    return NextResponse.json(
      { error: "Invalid status transition" },
      { status: 400 }
    );
  }

  const updatedOrder = await updateOrderStatus(orderId, status);

  return NextResponse.json({
    success: true,
    orderId: updatedOrder.id,
    status: updatedOrder.status,
  });
}
