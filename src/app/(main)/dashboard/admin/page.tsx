import Link from "next/link";
import { Package, ShieldCheck, Store, Users } from "lucide-react";

import { db } from "@/db";
import { products, sellerProfiles, user as users } from "@/db/schema";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [allUsers, allSellers, allProducts] = await Promise.all([
    db.select({ id: users.id }).from(users),
    db.select({ status: sellerProfiles.verificationStatus }).from(sellerProfiles),
    db.select({ status: products.status }).from(products),
  ]);

  const pendingSellers = allSellers.filter(
    (seller) => (seller.status ?? "pending") === "pending"
  ).length;
  const activeProducts = allProducts.filter(
    (product) => product.status !== "archived"
  ).length;

  const cards = [
    {
      label: "Users",
      value: allUsers.length,
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Sellers",
      value: allSellers.length,
      href: "/dashboard/admin/sellers",
      icon: Store,
    },
    {
      label: "Pending sellers",
      value: pendingSellers,
      href: "/dashboard/admin/sellers",
      icon: ShieldCheck,
    },
    {
      label: "Live products",
      value: activeProducts,
      href: "/dashboard/admin/products",
      icon: Package,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Review users, verify sellers, and moderate marketplace listings.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/sellers">Review sellers</Link>
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-lg border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold">{card.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold">Moderation queue</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {pendingSellers > 0
            ? `${pendingSellers} seller profile${pendingSellers === 1 ? "" : "s"} waiting for verification.`
            : "No seller verification requests are waiting right now."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/users">View users</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/products">Moderate products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
