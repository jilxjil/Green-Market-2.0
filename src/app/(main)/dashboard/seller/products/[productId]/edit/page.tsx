import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";

import ProductForm from "@/components/seller/product-form";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireRole } from "@/lib/auth/require-role";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const { user } = await requireRole("seller");

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.sellerId, user.id)),
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit product</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Update listing details for {product.title}.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/dashboard/seller/products">Back to products</Link>
        </Button>
      </div>

      <ProductForm
        mode="edit"
        productId={product.id}
        initialValues={{
          title: product.title,
          description: product.description ?? "",
          category: product.category ?? "",
          price: String(product.price),
          stockQuantity: String(product.stockQuantity ?? 0),
          imageUrl: product.imageUrl ?? "",
        }}
      />
    </div>
  );
}
