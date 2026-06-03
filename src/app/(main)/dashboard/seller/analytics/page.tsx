import Link from "next/link";
import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { orderItems, orders, products, reviews } from "@/db/schema";
import { requireRole } from "@/lib/auth/require-role";
import { getSellerReviewSummary } from "@/lib/reviews";

const revenueStatuses = ["confirmed", "fulfilled"] as const;

function formatCurrency(value: number) {
  return `GH₵ ${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default async function SellerAnalyticsPage() {
  const { user } = await requireRole("seller");

  const [orderRows, reviewSummary, recentReviews] = await Promise.all([
    db
      .select({
        orderId: orders.id,
        orderStatus: orders.status,
        createdAt: orders.createdAt,
        productId: products.id,
        productTitle: products.title,
        quantity: orderItems.quantity,
        priceAtPurchase: orderItems.priceAtPurchase,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(
        and(
          eq(products.sellerId, user.id),
          inArray(orders.status, [...revenueStatuses])
        )
      )
      .orderBy(desc(orders.createdAt)),
    getSellerReviewSummary(user.id),
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(eq(reviews.sellerUserId, user.id))
      .orderBy(desc(reviews.createdAt))
      .limit(5),
  ]);

  const totalRevenue = orderRows.reduce(
    (sum, row) => sum + Number(row.priceAtPurchase) * row.quantity,
    0
  );
  const orderIds = new Set(orderRows.map((row) => row.orderId));
  const fulfilledOrderIds = new Set(
    orderRows.filter((row) => row.orderStatus === "fulfilled").map((row) => row.orderId)
  );
  const productRevenue = new Map<
    string,
    { title: string; revenue: number; units: number }
  >();

  for (const row of orderRows) {
    const current =
      productRevenue.get(row.productId) ?? {
        title: row.productTitle,
        revenue: 0,
        units: 0,
      };
    current.revenue += Number(row.priceAtPurchase) * row.quantity;
    current.units += row.quantity;
    productRevenue.set(row.productId, current);
  }

  const topProducts = Array.from(productRevenue.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const maxRevenue = Math.max(...topProducts.map((product) => product.revenue), 1);
  const averageRating = reviewSummary.averageRating
    ? Number(reviewSummary.averageRating).toFixed(1)
    : "N/A";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Seller analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Revenue, fulfilled order progress, and product performance.
          </p>
        </div>
        <Link
          href="/dashboard/seller/orders"
          className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-muted"
        >
          View orders
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Active orders</p>
          <p className="mt-2 text-2xl font-bold">{orderIds.size}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Fulfilled orders</p>
          <p className="mt-2 text-2xl font-bold">{fulfilledOrderIds.size}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Seller rating</p>
          <p className="mt-2 text-2xl font-bold">{averageRating}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Top products</h2>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Confirmed and fulfilled order revenue will appear here.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {topProducts.map((product) => (
                <div key={product.title} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <p className="font-medium">{product.title}</p>
                    <p className="text-muted-foreground">
                      {formatCurrency(product.revenue)} · {product.units} sold
                    </p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Recent reviews</h2>
          {recentReviews.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Buyer reviews will appear after fulfilled orders.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {recentReviews.map((review) => (
                <article key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold">{review.rating}/5</p>
                  {review.comment && (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
