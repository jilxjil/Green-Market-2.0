import { NextResponse } from "next/server";
import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { admins, products, user as users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";

async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, user.id),
  });

  if (!admin) {
    return null;
  }

  return user;
}

export async function GET() {
  const user = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

  return NextResponse.json(
    rows.map((row) => ({
      id: row.product.id,
      title: row.product.title,
      category: row.product.category,
      price: row.product.price,
      unitOfMeasure: row.product.unitOfMeasure,
      stockQuantity: row.product.stockQuantity,
      status: row.product.status,
      createdAt: row.product.createdAt,
      sellerId: row.product.sellerId,
      sellerName: row.sellerName,
      sellerEmail: row.sellerEmail,
    }))
  );
}
