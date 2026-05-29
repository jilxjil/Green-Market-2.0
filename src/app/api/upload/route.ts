import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Image upload is not available yet. Use an image URL for now." },
    { status: 501 }
  );
}
