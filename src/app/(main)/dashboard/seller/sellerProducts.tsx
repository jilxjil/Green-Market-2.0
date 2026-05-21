import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/db";

import { products } from "@/db/schema";

export default async function SellerProducts() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const sellerProducts =
    await db.query.products.findMany({
      where: eq(
        products.sellerId,
        session.user.id
      ),
    });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Your Products
      </h2>

      {sellerProducts.map((product) => (
        <div
          key={product.id}
          className="border p-4 rounded-lg"
        >
          <h3 className="font-bold">
            {product.title}
          </h3>

          <p>
            GH₵ {product.price}
          </p>
        </div>
      ))}
    </div>
  );
}