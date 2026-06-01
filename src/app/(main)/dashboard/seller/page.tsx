import Link from "next/link";
import { eq } from "drizzle-orm";

import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSellerOrders } from "@/lib/orders";
import { requireRole } from "@/lib/auth/require-role";

export default async function SellerDashboard() {
  const { user } = await requireRole("seller");
  const sellerProducts = await db
    .select()
    .from(products)
    .where(eq(products.sellerId, user.id));
  const sellerOrders = await getSellerOrders(user.id);
  const pendingOrders = sellerOrders.filter((order) => order.status === "pending");
  const revenue = sellerOrders.reduce(
    (total, order) => total + Number(order.totalAmount),
    0
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Overview</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Welcome back to your seller dashboard.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/seller/products/new">Add product</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/dashboard/seller/profile">Edit profile</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total products", value: sellerProducts.length },
          { label: "Orders", value: sellerOrders.length },
          { label: "Revenue", value: `GHS ${revenue}` },
          { label: "Pending orders", value: pendingOrders.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
