import Link from "next/link";
import { Suspense } from "react";
import { ShoppingCart } from "lucide-react";
import Logo from "../shared/logo";
import Notifications from "../shared/notifications";
import UserMenu from "../shared/user-menu";
import DesktopNav from "./desktop-nav";
import MobileNav from "../mobile-nav";
import SearchBar from "./search-bar";

export default function MarketplaceNavbar() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">

          {/* Single unified row: Logo | Nav | ─spacer─ | Actions */}
          <div className="flex items-center gap-4 py-3">
            <Logo />

            <div className="hidden h-5 w-px bg-border md:block" />

            <DesktopNav />

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <Notifications />
              <Link href="/cart" aria-label="Cart">
                <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
              <UserMenu />
            </div>
          </div>

          {/* Search below, full container width */}
          <div className="pb-3">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>

        </div>
      </header>

      <MobileNav />
    </>
  );
}
