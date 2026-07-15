import { and, eq, gte, inArray } from "drizzle-orm";

import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { parseAnalyticsRange, rangeStart } from "@/lib/analytics";
import { requireRole } from "@/lib/auth/require-role";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function GET(req: Request) {
  const { user } = await requireRole("seller");
  const days = parseAnalyticsRange(new URL(req.url).searchParams.get("days") ?? undefined);
  const rows = await db.select({ orderId: orders.id, date: orders.createdAt, status: orders.status, product: products.title, quantity: orderItems.quantity, unitPrice: orderItems.priceAtPurchase }).from(orderItems).innerJoin(orders, eq(orders.id, orderItems.orderId)).innerJoin(products, eq(products.id, orderItems.productId)).where(and(eq(products.sellerId, user.id), gte(orders.createdAt, rangeStart(days)), inArray(orders.status, ["confirmed", "fulfilled"])));
  const csv = ["Order ID,Date,Status,Product,Quantity,Unit price (GHS),Revenue (GHS)", ...rows.map((row) => [row.orderId, row.date.toISOString(), row.status, row.product, row.quantity, row.unitPrice, Number(row.unitPrice) * row.quantity].map(csvCell).join(","))].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="seller-analytics-${days}d.csv"`, "Cache-Control": "no-store" } });
}
