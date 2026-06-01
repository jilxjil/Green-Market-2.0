import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Pencil } from "lucide-react";

import ProductStatusActions from "@/components/marketplace/product-status-actions";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireRole } from "@/lib/auth/require-role";

export default async function ProductsPage() {
  const { user } = await requireRole("seller");
  const sellerProducts = await db
    .select()
    .from(products)
    .where(eq(products.sellerId, user.id))
    .orderBy(desc(products.createdAt));

  const visibleProducts = sellerProducts.filter((product) => product.status !== "archived");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Your products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage listings, stock, and availability.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/seller/products/new">Add new product</Link>
        </Button>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground sm:p-8">
          <p>You have no products listed yet.</p>
          <p className="mt-2">Use Add new product to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <article key={product.id} className="flex flex-col rounded-lg border bg-card p-4">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="mb-3 aspect-[4/3] w-full rounded-md object-cover"
                />
              ) : (
                <div className="mb-3 flex aspect-[4/3] w-full items-center justify-center rounded-md bg-green-accent/20 text-sm font-medium text-primary">
                  No image
                </div>
              )}

              <h2 className="text-lg font-semibold leading-snug">{product.title}</h2>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {product.category || "Fresh produce"}
              </p>
              <p className="mt-3 text-lg font-bold">GH₵ {product.price}</p>

              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link
                    href={`/dashboard/seller/products/${product.id}/edit`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>

              <ProductStatusActions
                productId={product.id}
                status={product.status}
                stockQuantity={product.stockQuantity}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
