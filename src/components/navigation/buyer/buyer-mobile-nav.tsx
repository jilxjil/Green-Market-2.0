"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buyerLinks, isNavLinkActive } from "../nav-links";

export default function BuyerMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Buyer navigation"
      className="md:hidden sticky top-14 z-30 border-b bg-background/95 backdrop-blur sm:top-16"
    >
      <div className="flex gap-1 overflow-x-auto px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {buyerLinks.map((link) => {
          const active = isNavLinkActive(pathname, link.href, link.exact);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
