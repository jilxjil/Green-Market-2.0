import { requireRole } from "@/lib/auth/require-role";
import ExpertMobileDrawer from "@/components/navigation/expert/expert-mobile-drawer";
import ExpertMobileNav from "@/components/navigation/expert/expert-mobile-nav";
import ExpertSidebar from "@/components/navigation/expert/expert-sidebar";

export default async function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("expert");

  return (
    <>
      <ExpertMobileNav />
      <ExpertMobileDrawer />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <ExpertSidebar />
        <div className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</div>
      </div>
    </>
  );
}
