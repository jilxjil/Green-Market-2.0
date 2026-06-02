import { eq } from "drizzle-orm";

import SellerVerificationActions from "@/components/admin/seller-verification-actions";
import { db } from "@/db";
import { sellerProfiles, user as users } from "@/db/schema";

export default async function AdminSellersPage() {
  const sellers = await db
    .select({
      seller: sellerProfiles,
      user: users,
    })
    .from(sellerProfiles)
    .innerJoin(users, eq(users.id, sellerProfiles.userId));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sellers</h1>
        <p className="text-muted-foreground">
          Verify seller profiles before they receive public trust signals.
        </p>
      </div>

      <section className="grid gap-4">
        {sellers.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No seller profiles yet.
          </div>
        ) : (
          sellers.map(({ seller, user }) => {
            const status = seller.verificationStatus ?? "pending";

            return (
              <article
                key={seller.id}
                className="rounded-lg border bg-card p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        {seller.farmName || "Unnamed Farm"}
                      </h2>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                        {status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.name} · {user.email}
                    </p>
                    {seller.location && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {seller.location}
                      </p>
                    )}
                  </div>
                  <SellerVerificationActions
                    userId={user.id}
                    currentStatus={status}
                  />
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
