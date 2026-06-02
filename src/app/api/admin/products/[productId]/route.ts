import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { admins, products } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";

async function requireAdminUser() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 as const };
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, user.id),
  });

  if (!admin) {
    return { error: "Forbidden", status: 403 as const };
  }

  return { user };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const auth = await requireAdminUser();

  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { productId } = await params;
  const body = await req.json().catch(() => null);
  const status = String(body?.status ?? "").trim();

  if (status !== "archived") {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(products)
    .set({ status })
    .where(eq(products.id, productId))
    .returning({
      id: products.id,
      status: products.status,
    });

  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, product: updated });
}
