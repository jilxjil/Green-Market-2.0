import BuyerProfileForm from "@/components/buyer/buyer-profile-form";
import { requireRole } from "@/lib/auth/require-role";

export default async function BuyerProfilePage() {
  await requireRole("buyer");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Buyer profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Keep your business details up to date for smoother orders.
        </p>
      </div>

      <BuyerProfileForm />
    </div>
  );
}
