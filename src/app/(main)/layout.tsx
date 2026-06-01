export const dynamic = "force-dynamic";

import AppNavbar from "@/components/navigation/app-navbar";
import Footer from '../../components/common/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar/>
      <main className="flex-1">
        {children}
      </main>
      <Footer/>
    </>
  );
}
