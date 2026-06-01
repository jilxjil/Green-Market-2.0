import BuyerMobileNav from "@/components/navigation/buyer/buyer-mobile-nav";
import { requireRole } from "@/lib/auth/require-role";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("buyer");

  return (
    <>
      <BuyerMobileNav />
      <div className="min-h-[calc(100vh-4rem)] px-4 py-4 sm:px-6 sm:py-6">
        {children}
      </div>
    </>
  );
}
