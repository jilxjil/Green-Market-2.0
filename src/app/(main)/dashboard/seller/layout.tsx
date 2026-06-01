import { requireRole } from "@/lib/auth/require-role";
import SellerMobileDrawer from "@/components/navigation/seller/seller-mobile-drawer";
import SellerMobileNav from "@/components/navigation/seller/seller-mobile-nav";
import SellerSidebar from "@/components/navigation/seller/seller-sidebar";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("seller");

  return (
    <>
      <SellerMobileNav />
      <SellerMobileDrawer />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <SellerSidebar />
        <div className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</div>
      </div>
    </>
  );
}
