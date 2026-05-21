import { NextResponse } from "next/server"
import { db } from "@/db"
import { profiles } from "@/db/schema"


export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {userId, role } = body

        if (!userId || !role) {
            return NextResponse.json(
                { error: "Missing fields"},
                { status: 400 }
            )
        }

        await db.insert(profiles).values({
            userId,
            role,
        })

        return NextResponse.json(
            { success: true },
            { status:200}

        )
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Server Error"},
            { status: 500}
        )
    }
}