import { and, avg, count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { orderItems, orders, products, profiles, reviews, user as users } from "@/db/schema";

export async function getProductReviewSummary(productId: string) {
  const [summary] = await db
    .select({
      averageRating: avg(reviews.rating),
      reviewCount: count(reviews.id),
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  const rows = await db
    .select({
      review: reviews,
      buyerName: users.name,
    })
    .from(reviews)
    .innerJoin(users, eq(users.id, reviews.buyerUserId))
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));

  return {
    averageRating: summary?.averageRating ? Number(summary.averageRating) : 0,
    reviewCount: summary?.reviewCount ?? 0,
    reviews: rows,
  };
}

export async function getSellerReviewSummary(sellerUserId: string) {
  const [summary] = await db
    .select({
      averageRating: avg(reviews.rating),
      reviewCount: count(reviews.id),
    })
    .from(reviews)
    .where(eq(reviews.sellerUserId, sellerUserId));

  return {
    averageRating: summary?.averageRating ? Number(summary.averageRating) : 0,
    reviewCount: summary?.reviewCount ?? 0,
  };
}

export async function canReviewProductOrder({
  userId,
  orderId,
  productId,
}: {
  userId: string;
  orderId: string;
  productId: string;
}) {
  const rows = await db
    .select({
      order: orders,
      product: products,
      profile: profiles,
      item: orderItems,
    })
    .from(orders)
    .innerJoin(profiles, eq(profiles.id, orders.buyerId))
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(products.id, orderItems.productId))
    .where(and(eq(orders.id, orderId), eq(products.id, productId)))
    .limit(1);

  const row = rows[0];

  if (!row || row.profile.userId !== userId || row.order.status !== "fulfilled") {
    return null;
  }

  const [existing] = await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.orderId, orderId),
        eq(reviews.productId, productId),
        eq(reviews.buyerUserId, userId)
      )
    )
    .limit(1);

  if (existing) {
    return null;
  }

  return row.product;
}
