"use client";

import { usePathname } from "next/navigation";

import NavItem from "./nav-item";
import { isNavLinkActive, mobileMarketplaceLinks } from "./nav-links";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-3 left-1/2 z-50
        flex w-[95%] max-w-md
        -translate-x-1/2
        items-center justify-between
        rounded-3xl border
        bg-background/80
        px-6 py-3
        shadow-xl
        backdrop-blur
        md:hidden
      "
    >
      {mobileMarketplaceLinks.map((item) => (
        item.icon && (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isNavLinkActive(pathname, item.href, item.exact)}
          />
        )
      ))}
    </nav>
  );
}
