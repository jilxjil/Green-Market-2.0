// app/api/test-db/route.ts

import { db } from "@/db"

export async function GET() {
  try {
    const result = await db.execute("select 1")

    return Response.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error(error)

    return Response.json({
      success: false,
      error,
    })
  }
}