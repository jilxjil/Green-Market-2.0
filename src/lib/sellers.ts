import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { products, sellerProfiles, user } from "@/db/schema";

export async function getSellerStorefront(sellerId: string) {
  const [sellerRow] = await db
    .select({
      id: user.id,
      name: user.name,
      farmName: sellerProfiles.farmName,
      location: sellerProfiles.location,
      verificationStatus: sellerProfiles.verificationStatus,
    })
    .from(user)
    .leftJoin(sellerProfiles, eq(sellerProfiles.userId, user.id))
    .where(eq(user.id, sellerId))
    .limit(1);

  if (!sellerRow) {
    return null;
  }

  const sellerProducts = await db
    .select()
    .from(products)
    .where(and(eq(products.sellerId, sellerId), eq(products.status, "active")))
    .orderBy(desc(products.createdAt));

  return {
    seller: {
      id: sellerRow.id,
      name: sellerRow.name,
      farmName: sellerRow.farmName,
      location: sellerRow.location,
      verificationStatus: sellerRow.verificationStatus,
    },
    products: sellerProducts,
  };
}

