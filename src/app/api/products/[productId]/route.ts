import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { isProductPurchasable, resolveProductStatus } from "@/lib/products";
import { productUpdateSchema } from "@/lib/validations/product";
import { products, profiles } from "@/db/schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product || product.status === "archived") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!profile || profile.role !== "seller") {
      return NextResponse.json(
        { error: "Only sellers can update products" },
        { status: 403 }
      );
    }

    const existing = await db.query.products.findFirst({
      where: and(eq(products.id, productId), eq(products.sellerId, session.user.id)),
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const parsed = productUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const nextStock =
      parsed.data.stockQuantity !== undefined
        ? parsed.data.stockQuantity
        : (existing.stockQuantity ?? 0);
    const nextStatus = resolveProductStatus(
      nextStock,
      parsed.data.status ?? (existing.status as "active" | "out_of_stock" | "archived" | null)
    );

    const updates: Partial<typeof products.$inferInsert> = {
      status: nextStatus,
    };

    if (parsed.data.title !== undefined) updates.title = parsed.data.title;
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;
    if (parsed.data.category !== undefined) updates.category = parsed.data.category;
    if (parsed.data.price !== undefined) updates.price = parsed.data.price;
    if (parsed.data.stockQuantity !== undefined) updates.stockQuantity = parsed.data.stockQuantity;
    if (parsed.data.imageUrl !== undefined) updates.imageUrl = parsed.data.imageUrl || null;

    const [updated] = await db
      .update(products)
      .set(updates)
      .where(and(eq(products.id, productId), eq(products.sellerId, session.user.id)))
      .returning();

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
