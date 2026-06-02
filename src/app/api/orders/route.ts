import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { orderItems, orders, profiles } from "@/db/schema";
import { getProductsByIds } from "@/lib/orders";
import { decrementProductStock, isProductPurchasable } from "@/lib/products";
import { createNotification } from "@/lib/notifications";

interface OrderRequestItem {
  productId: string;
  quantity: number;
}

function normalizeItems(items: unknown): OrderRequestItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (
        !item ||
        typeof item !== "object" ||
        !("productId" in item) ||
        !("quantity" in item)
      ) {
        return null;
      }

      return {
        productId: String(item.productId),
        quantity: Number(item.quantity),
      };
    })
    .filter(
      (item): item is OrderRequestItem =>
        !!item && item.productId.length > 0 && Number.isInteger(item.quantity)
    );
}

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
  const items = normalizeItems(body?.items);
  const shippingAddress = String(body?.shippingAddress ?? "").trim();

  if (items.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 }
    );
  }

  if (shippingAddress.length < 8) {
    return NextResponse.json(
      { error: "Shipping address is required" },
      { status: 400 }
    );
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const dbProducts = await getProductsByIds(productIds);

  if (dbProducts.length !== productIds.length) {
    return NextResponse.json(
      { error: "One or more products are no longer available" },
      { status: 400 }
    );
  }

  const productsById = new Map(
    dbProducts.map((product) => [product.id, product])
  );

  const checkoutItems = items.map((item) => {
    const product = productsById.get(item.productId);
    const stockQuantity = product?.stockQuantity ?? 0;

    if (
      !product ||
      !isProductPurchasable(product) ||
      item.quantity < 1 ||
      item.quantity > stockQuantity
    ) {
      return null;
    }

    return {
      product,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    };
  });

  if (checkoutItems.some((item) => item === null)) {
    return NextResponse.json(
      { error: "One or more cart quantities exceed available stock" },
      { status: 400 }
    );
  }

  const validItems = checkoutItems.filter(
    (item): item is NonNullable<(typeof checkoutItems)[number]> => item !== null
  );
  const itemsBySeller = new Map<string, typeof validItems>();

  for (const item of validItems) {
    const sellerItems = itemsBySeller.get(item.product.sellerId) ?? [];
    sellerItems.push(item);
    itemsBySeller.set(item.product.sellerId, sellerItems);
  }

  const createdOrders = await db.transaction(async (tx) => {
    const orderIds: string[] = [];

    for (const sellerItems of itemsBySeller.values()) {
      const total = sellerItems.reduce((sum, item) => sum + item.lineTotal, 0);

      const [createdOrder] = await tx
        .insert(orders)
        .values({
          buyerId: profile.id,
          totalAmount: total.toString(),
          status: "pending",
          shippingAddress,
          fulfillmentStatus: "not_shipped",
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        sellerItems.map((item) => ({
          orderId: createdOrder.id,
          productId: item.product.id,
          quantity: item.quantity,
          priceAtPurchase: item.product.price.toString(),
        }))
      );

      for (const item of sellerItems) {
        await decrementProductStock(
          tx,
          item.product.id,
          item.quantity,
          item.product.stockQuantity ?? 0
        );
      }

      orderIds.push(createdOrder.id);
      
      // Notify seller
      const sellerId = sellerItems[0].product.sellerId;
      await createNotification({
        userId: sellerId,
        type: "new_order",
        title: "New Order",
        body: `You received a new order with ${sellerItems.length} item(s).`,
        metadata: {
          orderId: createdOrder.id,
          href: "/dashboard/seller/orders",
        },
      });
    }

    return orderIds;
  });

  return NextResponse.json({
    success: true,
    orderIds: createdOrders,
    orderId: createdOrders[0],
  });
}
