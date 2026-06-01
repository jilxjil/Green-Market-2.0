import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { uploadImage } from "@/lib/storage/upload-image";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile || profile.role !== "seller") {
    return NextResponse.json(
      { error: "Only sellers can upload product images" },
      { status: 403 }
    );
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const url = await uploadImage(file, user.id, "products");

    return NextResponse.json({
      success: true,
      url,
      storage: process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "local",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
