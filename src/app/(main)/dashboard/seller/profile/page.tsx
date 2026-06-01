import SellerProfileForm from "@/components/seller/seller-profile-form";

export default async function SellerProfilePage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Seller profile</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Update your farm details shown to buyers on product pages.
        </p>
      </div>

      <SellerProfileForm />
    </div>
  );
}
