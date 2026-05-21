import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.user.id),
  });

 if (!profile) {
  redirect("/dashboard/setup");
}

if (!profile.role) {
  redirect("/dashboard/setup");
}

  switch (profile.role) {
    case "buyer":
      redirect("/dashboard/buyer");

    case "seller":
      redirect("/dashboard/seller");

    case "expert":
      redirect("/dashboard/expert");

    default:
      redirect("/dashboard/setup");
  }
}