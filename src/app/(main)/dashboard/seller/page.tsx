import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AddProductForm from "./addProductForm";
import SellerProducts from "./sellerProducts";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function SellerDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.user.id),
  });

  if (profile?.role !== "seller") {
    redirect("/dashboard");
  }

  return <div className="p-6 space-y-8">
      
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Overview
        </h2>

        <p className="text-muted-foreground">
          Welcome back to your seller dashboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Total Products
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            12
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Orders
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            34
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Revenue
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            GHS 4,500
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Pending Orders
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            5
          </h3>
        </div>
      </div>
    </div>
  


      <AddProductForm />

      <SellerProducts />
    </div>
}



