"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Experts",
    href: "/experts",
  },
];

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        hidden items-center gap-10
        md:flex
      "
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-lg font-medium transition-colors",
            pathname === link.href
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