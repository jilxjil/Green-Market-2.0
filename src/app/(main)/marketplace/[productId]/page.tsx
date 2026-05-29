import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import AddToCartButton from "@/components/Product/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    notFound();
  }

  const stockQuantity = product.stockQuantity ?? 0;

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[minmax(0,1fr)_420px]">
      <div className="overflow-hidden rounded-lg border bg-card">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-green-accent/30 text-lg font-semibold text-primary">
            Green Market
          </div>
        )}
      </div>

      <section className="space-y-6">
        <div className="space-y-2">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Back to marketplace
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">{product.title}</h1>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {product.category || "Fresh produce"}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="mt-1 text-3xl font-bold">GH₵ {product.price}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {stockQuantity > 0
              ? `${stockQuantity} available`
              : "Currently unavailable"}
          </p>
        </div>

        {product.description && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="leading-7 text-muted-foreground">
              {product.description}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <AddToCartButton product={product} />
          <Button asChild className="h-11 px-5" variant="outline">
            <Link href="/cart">Go to cart</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
