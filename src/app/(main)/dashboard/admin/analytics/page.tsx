import { and, eq, gte, inArray } from "drizzle-orm";

import { BarSeries } from "@/components/analytics/bar-series";
import { RangeTabs } from "@/components/analytics/range-tabs";
import { db } from "@/db";
import { consultationRequests, orderItems, orders, products, profiles, user } from "@/db/schema";
import { buildDailySeries, parseAnalyticsRange, rangeStart } from "@/lib/analytics";

function money(value: number) { return `GH₵ ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`; }

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = parseAnalyticsRange((await searchParams).days);
  const start = rangeStart(days);
  const [orderRows, roleRows, consultations, sellerRows] = await Promise.all([
    db.select({ id: orders.id, amount: orders.totalAmount, status: orders.status, paymentStatus: orders.paymentStatus, createdAt: orders.createdAt }).from(orders).where(gte(orders.createdAt, start)),
    db.select({ role: profiles.role }).from(profiles),
    db.select({ id: consultationRequests.id, createdAt: consultationRequests.createdAt }).from(consultationRequests).where(gte(consultationRequests.createdAt, start)),
    db.select({ sellerId: products.sellerId, orderId: orderItems.orderId, price: orderItems.priceAtPurchase, quantity: orderItems.quantity }).from(orderItems).innerJoin(orders, eq(orders.id, orderItems.orderId)).innerJoin(products, eq(products.id, orderItems.productId)).where(and(gte(orders.createdAt, start), inArray(orders.paymentStatus, ["paid"]))),
  ]);
  const paidOrders = orderRows.filter((order) => order.paymentStatus === "paid");
  const gmv = paidOrders.reduce((sum, order) => sum + Number(order.amount), 0);
  const roles = new Map<string, number>();
  roleRows.forEach((row) => roles.set(row.role, (roles.get(row.role) ?? 0) + 1));
  const sellerTotals = new Map<string, number>();
  sellerRows.forEach((row) => sellerTotals.set(row.sellerId, (sellerTotals.get(row.sellerId) ?? 0) + Number(row.price) * row.quantity));
  const topSellerIds = [...sellerTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sellerNames = topSellerIds.length ? await db.select({ id: user.id, name: user.name }).from(user).where(inArray(user.id, topSellerIds.map(([id]) => id))) : [];
  const names = new Map(sellerNames.map((seller) => [seller.id, seller.name]));
  const series = buildDailySeries(paidOrders, days, (row) => row.createdAt, (row) => Number(row.amount));

  return <div className="mx-auto w-full max-w-6xl space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold">Platform analytics</h1><p className="mt-1 text-muted-foreground">Paid GMV, adoption, and marketplace activity.</p></div><RangeTabs active={days} /></header>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Paid GMV", money(gmv)], ["Paid orders", paidOrders.length], ["Consultations", consultations.length], ["Users", roleRows.length]].map(([label, value]) => <div key={label} className="rounded-lg border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</section>
    <section className="rounded-lg border bg-card p-5"><h2 className="text-lg font-semibold">GMV over time</h2><BarSeries data={series} valueLabel={money} /></section>
    <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-lg border bg-card p-5"><h2 className="font-semibold">Users by role</h2><div className="mt-4 space-y-3">{["buyer", "seller", "expert", "admin"].map((role) => <div key={role} className="flex justify-between border-b pb-2 capitalize last:border-0"><span>{role}</span><strong>{roles.get(role) ?? 0}</strong></div>)}</div></div><div className="rounded-lg border bg-card p-5"><h2 className="font-semibold">Top sellers</h2><div className="mt-4 space-y-3">{topSellerIds.length ? topSellerIds.map(([id, total]) => <div key={id} className="flex justify-between gap-4 border-b pb-2 last:border-0"><span className="truncate">{names.get(id) ?? "Seller"}</span><strong>{money(total)}</strong></div>) : <p className="text-sm text-muted-foreground">Paid sales will appear here.</p>}</div></div></section>
  </div>;
}
