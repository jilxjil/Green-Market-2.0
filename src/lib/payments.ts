import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { orderItems, orders, payments, products } from "@/db/schema";
import { createNotification } from "@/lib/notifications";
import { decrementProductStock } from "@/lib/products";
import { verifyTransaction } from "@/lib/paystack";

interface CompletePaymentOptions {
  channel?: string | null;
  paidAt?: Date | null;
  skipPaystackVerify?: boolean;
}

export async function completePaymentSuccess(
  reference: string,
  options: CompletePaymentOptions = {}
) {
  const payment = await db.query.payments.findFirst({
    where: eq(payments.paystackReference, reference),
  });

  if (!payment) {
    return { ok: false as const, error: "Payment not found", status: 404 };
  }

  const orderIds = [...(payment.metadata?.orderIds ?? [])];
  if (orderIds.length === 0 && payment.orderId) {
    orderIds.push(payment.orderId);
  }

  if (payment.status === "success") {
    return {
      ok: true as const,
      alreadyProcessed: true,
      orderIds,
      paymentId: payment.id,
    };
  }

  if (!options.skipPaystackVerify) {
    const verified = await verifyTransaction(reference);
    if (verified.status !== "success") {
      await db
        .update(payments)
        .set({ status: "failed" })
        .where(eq(payments.id, payment.id));

      return {
        ok: false as const,
        error: "Payment was not successful",
        status: 400,
      };
    }

    if (verified.amount !== payment.amount) {
      return {
        ok: false as const,
        error: "Payment amount mismatch",
        status: 400,
      };
    }

    if (verified.reference !== reference || verified.currency !== payment.currency) {
      return {
        ok: false as const,
        error: "Payment verification details did not match",
        status: 400,
      };
    }

    options.channel = verified.channel;
    options.paidAt = verified.paidAt ? new Date(verified.paidAt) : new Date();
  }

  const paidAt = options.paidAt ?? new Date();

  await db.transaction(async (tx) => {
    const [updatedPayment] = await tx
      .update(payments)
      .set({
        status: "success",
        channel: options.channel ?? null,
        paidAt,
      })
      .where(and(eq(payments.id, payment.id), eq(payments.status, "pending")))
      .returning({ id: payments.id, status: payments.status });

    if (!updatedPayment) {
      return;
    }

    if (orderIds.length === 0) {
      return;
    }

    const linkedOrders = await tx
      .select({ id: orders.id, paymentStatus: orders.paymentStatus })
      .from(orders)
      .where(inArray(orders.id, orderIds));

    const unpaidOrderIds = linkedOrders
      .filter((order) => order.paymentStatus !== "paid")
      .map((order) => order.id);

    if (unpaidOrderIds.length === 0) {
      return;
    }

    await tx
      .update(orders)
      .set({ paymentStatus: "paid" })
      .where(inArray(orders.id, unpaidOrderIds));

    const lineItems = await tx
      .select({
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        stockQuantity: products.stockQuantity,
        sellerId: products.sellerId,
      })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(inArray(orderItems.orderId, unpaidOrderIds));

    for (const item of lineItems) {
      await decrementProductStock(
        tx,
        item.productId,
        item.quantity,
        item.stockQuantity ?? 0
      );
    }

    const sellerOrderCounts = new Map<string, { orderId: string; itemCount: number }>();

    for (const item of lineItems) {
      const existing = sellerOrderCounts.get(item.sellerId);
      if (existing) {
        existing.itemCount += 1;
        continue;
      }

      sellerOrderCounts.set(item.sellerId, {
        orderId: item.orderId,
        itemCount: 1,
      });
    }

    for (const [sellerId, info] of sellerOrderCounts) {
      await createNotification({
        userId: sellerId,
        type: "new_order",
        title: "New paid order",
        body: `You received a paid order with ${info.itemCount} item(s).`,
        metadata: {
          orderId: info.orderId,
          href: "/dashboard/seller/orders",
        },
      });
    }
  });

  return {
    ok: true as const,
    alreadyProcessed: false,
    orderIds,
    paymentId: payment.id,
  };
}

export async function markPaymentFailed(reference: string) {
  await db
    .update(payments)
    .set({ status: "failed" })
    .where(eq(payments.paystackReference, reference));
}
