import { and, desc, eq, ne } from "drizzle-orm";
import Link from "next/link";

import ArchiveProductButton from "@/components/admin/archive-product-button";
import { db } from "@/db";
import { products, user as users } from "@/db/schema";
import { formatProductAvailability, formatProductPrice } from "@/lib/product-units";

export default async function AdminProductsPage() {
  const rows = await db
    .select({
      product: products,
      sellerName: users.name,
      sellerEmail: users.email,
    })
    .from(products)
    .innerJoin(users, eq(users.id, products.sellerId))
    .where(and(ne(products.status, "archived")))
    .orderBy(desc(products.createdAt));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Moderate active and out-of-stock marketplace listings.
        </p>
      </div>

      <section className="grid gap-4">
        {rows.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No products available for moderation.
          </div>
        ) : (
          rows.map(({ product, sellerName, sellerEmail }) => (
            <article key={product.id} className="rounded-lg border bg-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/marketplace/${product.id}`}
                      className="text-lg font-semibold hover:text-primary"
                    >
                      {product.title}
                    </Link>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                      {product.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.category || "Uncategorized"} ·{" "}
                    {formatProductPrice(product.price, product.unitOfMeasure)} ·{" "}
                    {formatProductAvailability(product.stockQuantity, product.unitOfMeasure)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Seller: {sellerName} · {sellerEmail}
                  </p>
                </div>
                <ArchiveProductButton productId={product.id} />
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
