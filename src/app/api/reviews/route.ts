import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canReviewProductOrder, getProductReviewSummary } from "@/lib/reviews";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const summary = await getProductReviewSummary(productId);
  return NextResponse.json(summary);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const orderId = String(body?.orderId ?? "");
  const productId = String(body?.productId ?? "");
  const rating = Number(body?.rating);
  const comment = String(body?.comment ?? "").trim();

  if (!orderId || !productId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "orderId, productId, and a 1-5 rating are required" },
      { status: 400 }
    );
  }

  const product = await canReviewProductOrder({
    userId: user.id,
    orderId,
    productId,
  });

  if (!product) {
    return NextResponse.json(
      { error: "Only fulfilled, unreviewed purchases can be reviewed" },
      { status: 403 }
    );
  }

  const [duplicate] = await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.orderId, orderId),
        eq(reviews.productId, productId),
        eq(reviews.buyerUserId, user.id)
      )
    )
    .limit(1);

  if (duplicate) {
    return NextResponse.json({ error: "Review already exists" }, { status: 409 });
  }

  const [review] = await db
    .insert(reviews)
    .values({
      orderId,
      productId,
      sellerUserId: product.sellerId,
      buyerUserId: user.id,
      rating,
      comment: comment || null,
    })
    .returning();

  return NextResponse.json({ success: true, review });
}
