import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/db";

import { products, profiles } from "@/db/schema";

export async function GET() {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return NextResponse.json(allProducts);
}

export async function POST(req: Request) {
  try {
    // 1. SESSION CHECK
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    // 3. REQUEST BODY
    const body = await req.json();

    const {
      title,
      description,
      category,
      price,
      stockQuantity,
      imageUrl,
    } = body;

    // 4. VALIDATION (minimal MVP level)
    if (!title || Number(price) <= 0) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    // 5. INSERT PRODUCT
    await db.insert(products).values({
      sellerId: session.user.id,
      title,
      description,
      category,
      price: Number(price),
      stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
      imageUrl,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
