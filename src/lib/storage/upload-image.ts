import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Unsupported file type. Use JPG, PNG, WEBP, or GIF.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Maximum size is 5MB.";
  }

  return null;
}

function getExtension(mimeType: string) {
  return mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
}

async function uploadToLocalDisk(file: File, folder: string) {
  const extension = getExtension(file.type);
  const filename = `${randomUUID()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  const filePath = path.join(uploadsDir, filename);

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${folder}/${filename}`;
}

async function uploadToSupabase(file: File, userId: string, folder: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Supabase Storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for production uploads."
      );
    }

    return null;
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";
  const extension = getExtension(file.type);
  const objectPath = `${folder}/${userId}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function uploadImage(file: File, userId: string, folder = "products") {
  const validationError = validateImageFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const supabaseUrl = await uploadToSupabase(file, userId, folder);

  if (supabaseUrl) {
    return supabaseUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Production uploads require Supabase Storage configuration.");
  }

  return uploadToLocalDisk(file, folder);
}
