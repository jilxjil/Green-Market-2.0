import { redirect } from "next/navigation";
import { getCurrentUser } from "./get-current-user";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function requireSession() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireProfile() {
  const user = await requireSession();

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  if (!profile) {
    redirect("/dashboard/setup");
  }

  return { user, profile };
}

export async function requireRole(role: string) {
  const { user, profile } = await requireProfile();

  if (profile.role !== role) {
    redirect(`/dashboard/${profile.role}`);
  }

  return { user, profile };
}