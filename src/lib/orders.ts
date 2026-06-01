import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { orderItems, orders, products, profiles } from "@/db/schema";

export const orderStatuses = ["pending", "confirmed", "fulfilled", "cancelled"] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export interface OrderLine {
  id: string;
  orderId: string;
  quantity: number;
  priceAtPurchase: string;
  productId: string;
  productTitle: string;
  productSellerId: string;
}

export interface OrderSummary {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: Date;
  buyerId: string;
  buyerUserId: string;
  items: OrderLine[];
}

export function isOrderStatus(status: string): status is OrderStatus {
  return orderStatuses.includes(status as OrderStatus);
}

export function canTransitionOrderStatus(currentStatus: string, nextStatus: OrderStatus) {
  if (currentStatus === "pending") {
    return nextStatus === "confirmed" || nextStatus === "cancelled";
  }

  if (currentStatus === "confirmed") {
    return nextStatus === "fulfilled" || nextStatus === "cancelled";
  }

  return false;
}

function groupOrderRows(
  rows: Array<{
    order: typeof orders.$inferSelect;
    item: typeof orderItems.$inferSelect;
    product: typeof products.$inferSelect;
    buyer: typeof profiles.$inferSelect;
  }>
) {
  const groupedOrders = new Map<string, OrderSummary>();

  for (const row of rows) {
    const existingOrder = groupedOrders.get(row.order.id);
    const order =
      existingOrder ??
      {
        id: row.order.id,
        status: row.order.status,
        totalAmount: row.order.totalAmount,
        createdAt: row.order.createdAt,
        buyerId: row.order.buyerId,
        buyerUserId: row.buyer.userId,
        items: [],
      };

    order.items.push({
      id: row.item.id,
      orderId: row.item.orderId,
      quantity: row.item.quantity,
      priceAtPurchase: row.item.priceAtPurchase,
      productId: row.product.id,
      productTitle: row.product.title,
      productSellerId: row.product.sellerId,
    });

    groupedOrders.set(order.id, order);
  }

  return Array.from(groupedOrders.values());
}

export async function getBuyerOrders(buyerProfileId: string) {
  const rows = await db
    .select({
      order: orders,
      item: orderItems,
      product: products,
      buyer: profiles,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(products.id, orderItems.productId))
    .innerJoin(profiles, eq(profiles.id, orders.buyerId))
    .where(eq(orders.buyerId, buyerProfileId))
    .orderBy(desc(orders.createdAt));

  return groupOrderRows(rows);
}

export async function getSellerOrders(sellerId: string) {
  const rows = await db
    .select({
      order: orders,
      item: orderItems,
      product: products,
      buyer: profiles,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(products.id, orderItems.productId))
    .innerJoin(profiles, eq(profiles.id, orders.buyerId))
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(orders.createdAt));

  return groupOrderRows(rows);
}

export async function getOrderForSeller(orderId: string, sellerId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) {
    return null;
  }

  const items = await db
    .select({
      item: orderItems,
      product: products,
    })
    .from(orderItems)
    .innerJoin(products, eq(products.id, orderItems.productId))
    .where(eq(orderItems.orderId, orderId));

  if (items.length === 0) {
    return null;
  }

  const sellerOwnsAllItems = items.every((item) => item.product.sellerId === sellerId);

  return {
    order,
    sellerOwnsAllItems,
  };
}

export async function getProductsByIds(productIds: string[]) {
  if (productIds.length === 0) {
    return [];
  }

  return db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const [updatedOrder] = await db
    .update(orders)
    .set({ status })
    .where(and(eq(orders.id, orderId)))
    .returning({ id: orders.id, status: orders.status });

  return updatedOrder;
}
