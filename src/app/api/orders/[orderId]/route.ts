import { NextResponse } from "next/server";

import {
  canTransitionOrderStatus,
  isFulfillmentStatus,
  getOrderForSeller,
  isOrderStatus,
  updateOrderFulfillment,
  updateOrderStatus,
} from "@/lib/orders";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { orders, profiles, orderItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createNotification } from "@/lib/notifications";

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

  if (!profile || (profile.role !== "seller" && profile.role !== "buyer")) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const requestedStatus = body?.status == null ? null : String(body.status);
  const requestedFulfillmentStatus =
    body?.fulfillmentStatus == null ? null : String(body.fulfillmentStatus);

  if (!requestedStatus && !requestedFulfillmentStatus) {
    return NextResponse.json(
      { error: "status or fulfillmentStatus is required" },
      { status: 400 }
    );
  }

  if (requestedFulfillmentStatus && profile.role === "buyer") {
    return NextResponse.json(
      { error: "Only sellers can update fulfillment" },
      { status: 403 }
    );
  }

  if (requestedFulfillmentStatus) {
    if (!isFulfillmentStatus(requestedFulfillmentStatus)) {
      return NextResponse.json(
        { error: "Invalid fulfillment status" },
        { status: 400 }
      );
    }

    const sellerOrder = await getOrderForSeller(orderId, user.id);

    if (!sellerOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!sellerOrder.sellerOwnsAllItems) {
      return NextResponse.json(
        { error: "You cannot update an order owned by another seller" },
        { status: 403 }
      );
    }

    if (sellerOrder.order.status !== "confirmed" && sellerOrder.order.status !== "fulfilled") {
      return NextResponse.json(
        { error: "Confirm the order before updating delivery" },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderFulfillment(orderId, {
      fulfillmentStatus: requestedFulfillmentStatus,
      trackingNumber:
        body?.trackingNumber == null
          ? null
          : String(body.trackingNumber).trim() || null,
    });

    const buyerProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, sellerOrder.order.buyerId),
    });

    if (buyerProfile) {
      await createNotification({
        userId: buyerProfile.userId,
        type: "order_fulfillment",
        title: "Delivery Update",
        body: `Your order delivery status is now ${requestedFulfillmentStatus.replace("_", " ")}.`,
        metadata: { orderId, href: "/dashboard/buyer" },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      fulfillmentStatus: updatedOrder.fulfillmentStatus,
      trackingNumber: updatedOrder.trackingNumber,
    });
  }

  const status = requestedStatus ?? "";

  if (!isOrderStatus(status)) {
    return NextResponse.json(
      { error: "Invalid order status" },
      { status: 400 }
    );
  }

  if (profile.role === "buyer") {
    if (status !== "cancelled") {
      return NextResponse.json(
        { error: "Only cancellations are allowed for buyers" },
        { status: 403 }
      );
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.buyerId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!canTransitionOrderStatus(order.status, status)) {
      return NextResponse.json(
        { error: "Invalid status transition" },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderStatus(orderId, status);

    const row = await db
      .select({ sellerId: products.sellerId })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(eq(orderItems.orderId, orderId))
      .limit(1);

    if (row[0]?.sellerId) {
      await createNotification({
        userId: row[0].sellerId,
        type: "order_cancelled",
        title: "Order Cancelled",
        body: `Buyer has cancelled order #${orderId.slice(0, 8)}.`,
        metadata: { orderId, href: "/dashboard/seller/orders" },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      status: updatedOrder.status,
    });
  }

  const sellerOrder = await getOrderForSeller(orderId, user.id);

  if (!sellerOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
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

  const buyerProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, sellerOrder.order.buyerId),
  });

  if (buyerProfile) {
    await createNotification({
      userId: buyerProfile.userId,
      type: "order_status",
      title: "Order Update",
      body: `Your order status changed to ${status}.`,
      metadata: { orderId, href: "/dashboard/buyer" },
    });
  }

  return NextResponse.json({
    success: true,
    orderId: updatedOrder.id,
    status: updatedOrder.status,
  });
}
