import Link from "next/link";


import { ShoppingCart } from "lucide-react";
import Logo from "./shared/logo";
import Notifications from "./shared/notifications";
import UserMenu from "./shared/user-menu";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import SearchBar from "./search-bar";

export default function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">

          {/* Single unified row: Logo | Nav | ─spacer─ | Actions */}
          <div className="flex items-center gap-4 py-3">
            <Link href="/">
              <Logo />
            </Link>

            <div className="hidden h-5 w-px bg-border md:block" />

            <DesktopNav />

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <Notifications />
                <ShoppingCart className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />
                <UserMenu />    
            </div>
          </div>

          {/* Search below, full container width */}
          <div className="pb-3">
            <SearchBar />
          </div>

        </div>
      </header>

      <MobileNav />
    </>
  );
}