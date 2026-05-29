import { requireRole } from "@/lib/auth/require-role";
import SellerSidebar from "@/components/navigation/seller/seller-sidebar";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("seller");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <SellerSidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
