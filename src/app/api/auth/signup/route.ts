import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { db } from "@/db"
import { profiles } from "@/db/schema"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      name,
      email,
      password,
      role,
    } = body

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    })

    await db.insert(profiles).values({
      userId: result.user.id,
      role,
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
  console.error(error)

  return NextResponse.json(
    {
      success: false,
      message:
        error?.body?.message ||
        "Something went wrong",
    },
    {
      status: error?.statusCode || 500,
    }
  )
}
}