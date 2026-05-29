import Link from "next/link";
import { desc, eq } from "drizzle-orm";

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

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Products</h1>
                <Button asChild>
                    <Link href="/dashboard/seller/products/new">
                        Add New Product
                    </Link>
                </Button>
            </div>

            {sellerProducts.length === 0 ? (
                <div className="border rounded-md p-8 text-center text-gray-500">
                    <p>You have no products listed yet.</p>
                    <p className="mt-2">Use Add New Product to get started.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {sellerProducts.map((product) => (
                        <div key={product.id} className="rounded-lg border bg-card p-4">
                            <h2 className="text-lg font-semibold">{product.title}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {product.category || "Fresh produce"}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="font-bold">GH₵ {product.price}</span>
                                <span className="text-sm text-muted-foreground">
                                    {product.stockQuantity ?? 0} in stock
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
