import { requireSession } from "@/lib/auth/require-role";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect all dashboard routes at the top level
  await requireSession();

  return <>{children}</>;
}
