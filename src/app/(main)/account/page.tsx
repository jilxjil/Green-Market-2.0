import Link from "next/link";

import SignOutButton from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth/require-role";

export default async function AccountPage() {
  const { user, profile } = await requireProfile();

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile and session.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border bg-card p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-semibold">{user.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-semibold">{user.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="font-semibold capitalize">{profile.role}</p>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button asChild>
            <Link href={`/dashboard/${profile.role}`}>Go to dashboard</Link>
          </Button>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
