import Link from "next/link";
import { eq } from "drizzle-orm";

import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireRole } from "@/lib/auth/require-role";

export default async function SellerDashboard() {
  const { user } = await requireRole("seller");
  const sellerProducts = await db
    .select()
    .from(products)
    .where(eq(products.sellerId, user.id));

  return <div className="p-6 space-y-8">
      
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Overview
        </h2>

        <p className="text-muted-foreground">
          Welcome back to your seller dashboard.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/seller/products/new">Add product</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Total Products
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {sellerProducts.length}
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Orders
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            34
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Revenue
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            GHS 4,500
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Pending Orders
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            5
          </h3>
        </div>
      </div>
    </div>
    </div>
}


