import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { db } from "@/db";
import { admins } from "@/db/schema";

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, user.id),
  });

  if (!admin) {
    redirect("/dashboard");
  }

  return { user, admin };
}

