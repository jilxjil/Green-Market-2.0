"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buyerLinks, isNavLinkActive } from "../nav-links";

export default function BuyerDesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Buyer navigation" className="hidden items-center gap-1 md:flex">
      {buyerLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isNavLinkActive(pathname, link.href, link.exact)
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
