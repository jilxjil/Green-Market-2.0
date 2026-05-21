"use client";

import { usePathname } from "next/navigation";

import {
  Home,
  ShoppingCart,
  LayoutDashboard,
  Package,
  User,
} from "lucide-react";

import NavItem from "./nav-item";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: Package,
  },
  {
    label: "Account",
    href: "/account",
    icon: User,
  },
];

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
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={pathname === item.href}
        />
      ))}
    </nav>
  );
}