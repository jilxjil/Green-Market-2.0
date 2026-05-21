import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"      
import { db } from "@/db"
import { products } from "@/db/schema"

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers:  req.headers,
    })

    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized"},
            { status: 401}
        )
    }

    const body = await req.json()

    const {
        name,
        description,
        category,
        price,
        quantity,
        imageUrl,
    } = body

    await db.insert(products).values({
        sellerId: session.user.id,
        name,
        description,
        category,
        price,
        quantity,
        imageUrl,
    })

    return NextResponse.json(
        
       { success: true },
       { status: 200})
}