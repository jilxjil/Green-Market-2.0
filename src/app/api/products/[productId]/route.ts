import { NextResponse } from "next/server"

import { db } from "@/db"

import { products } from "@/db/schema"

import { eq } from "drizzle-orm"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })

    if (!product) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
