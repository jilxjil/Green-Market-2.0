import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles, user as users } from "@/db/schema";

export default async function AdminUsersPage() {
  const rows = await db
    .select({
      user: users,
      profile: profiles,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .orderBy(users.createdAt);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Review registered accounts and their marketplace roles.
        </p>
      </div>

      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_120px_150px] gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground md:grid">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
        </div>
        <div className="divide-y">
          {rows.map((row) => (
            <article
              key={row.user.id}
              className="grid gap-2 px-4 py-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_120px_150px] md:items-center md:gap-4"
            >
              <div>
                <p className="font-medium">{row.user.name}</p>
                <p className="text-xs text-muted-foreground md:hidden">
                  {row.user.email}
                </p>
              </div>
              <p className="hidden truncate text-sm text-muted-foreground md:block">
                {row.user.email}
              </p>
              <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                {row.profile?.role ?? "unassigned"}
              </span>
              <p className="text-sm text-muted-foreground">
                {row.user.createdAt.toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
