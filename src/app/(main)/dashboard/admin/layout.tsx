import AdminMobileNav from "@/components/navigation/admin/admin-mobile-nav";
import AdminSidebar from "@/components/navigation/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <>
      <AdminMobileNav />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <div className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</div>
      </div>
    </>
  );
}
