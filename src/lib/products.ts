import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { products, sellerProfiles, user } from "@/db/schema";

export {
  isProductPurchasable,
  isProductStatus,
  productStatuses,
  resolveProductStatus,
  type ProductStatus,
} from "@/lib/product-utils";

interface MarketplaceFilters {
  q?: string;
  category?: string;
}

export async function getPublicProducts(filters: MarketplaceFilters = {}) {
  const conditions = [ne(products.status, "archived")];

  if (filters.category) {
    conditions.push(eq(products.category, filters.category));
  }

  if (filters.q?.trim()) {
    const term = `%${filters.q.trim()}%`;
    conditions.push(
      or(ilike(products.title, term), ilike(products.description, term))!
    );
  }

  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.createdAt));
}

export async function getMarketplaceCategories() {
  const rows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .where(and(ne(products.status, "archived"), sql`${products.category} IS NOT NULL`))
    .orderBy(products.category);

  return rows
    .map((row) => row.category)
    .filter((category): category is string => Boolean(category));
}

export async function getProductWithSeller(productId: string) {
  const [row] = await db
    .select({
      product: products,
      sellerName: user.name,
      farmName: sellerProfiles.farmName,
      location: sellerProfiles.location,
      verificationStatus: sellerProfiles.verificationStatus,
    })
    .from(products)
    .innerJoin(user, eq(user.id, products.sellerId))
    .leftJoin(sellerProfiles, eq(sellerProfiles.userId, products.sellerId))
    .where(eq(products.id, productId))
    .limit(1);

  return row ?? null;
}

export async function decrementProductStock(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  productId: string,
  quantity: number,
  currentStock: number
) {
  const newStock = Math.max(0, currentStock - quantity);

  await tx
    .update(products)
    .set({
      stockQuantity: newStock,
      status: newStock <= 0 ? "out_of_stock" : "active",
    })
    .where(eq(products.id, productId));
}
