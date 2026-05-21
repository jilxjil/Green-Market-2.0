import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth/auth"
import { db } from "@/db"

import { products } from "@/db/schema"

import { eq, desc } from "drizzle-orm"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const sellerProducts = await db
      .select()
      .from(products)
      .where(eq(products.sellerId, session.user.id))
      .orderBy(desc(products.createdAt))

    return NextResponse.json(sellerProducts)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}