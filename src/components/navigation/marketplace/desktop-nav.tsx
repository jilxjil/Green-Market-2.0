"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { isNavLinkActive, marketplaceLinks } from "../nav-links";

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        hidden items-center gap-10
        md:flex
      "
    >
      {marketplaceLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md px-2 py-1 text-sm font-medium transition-colors",
            isNavLinkActive(pathname, link.href, link.exact)
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
