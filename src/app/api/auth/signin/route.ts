import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email, password } = body

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    })

    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message:
          error?.body?.message ||
          "Invalid credentials",
      },
      {
        status: error?.statusCode || 500,
      }
    )
  }
}