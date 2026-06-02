import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { getPublicProducts } from "@/lib/products";
import { productCreateSchema } from "@/lib/validations/product";
import { products, profiles } from "@/db/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  const allProducts = await getPublicProducts({ q, category });

  return NextResponse.json(allProducts);
}

export async function POST(req: Request) {
  try {
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
        { error: "Only sellers can create products" },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const stockQuantity = parsed.data.stockQuantity ?? 0;

    await db.insert(products).values({
      sellerId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      price: parsed.data.price,
      unitOfMeasure: parsed.data.unitOfMeasure,
      stockQuantity,
      imageUrl: parsed.data.imageUrl || null,
      status: stockQuantity > 0 ? "active" : "out_of_stock",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
