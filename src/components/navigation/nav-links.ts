import {
  Home,
  LayoutDashboard,
  Package,
  ClipboardList,
  ShoppingCart,
  Store,
  User,
  type LucideIcon,
} from "lucide-react"

export interface NavigationLink {
  label: string
  href: string
  icon?: LucideIcon
  exact?: boolean
}

export const publicLinks: NavigationLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    label: "Experts",
    href: "/experts",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
]

export const marketplaceLinks: NavigationLink[] = [
  {
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    label: "Experts",
    href: "/experts",
  },
  {
    label: "Cart",
    href: "/cart",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
]

export const mobileMarketplaceLinks: NavigationLink[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Market",
    href: "/marketplace",
    icon: Store,
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
]

export const sellerLinks: NavigationLink[] = [
  {
    label: "Overview",
    href: "/dashboard/seller",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Profile",
    href: "/dashboard/seller/profile",
    icon: User,
  },
  {
    label: "Products",
    href: "/dashboard/seller/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/dashboard/seller/orders",
    icon: ClipboardList,
  },
]

export const expertLinks: NavigationLink[] = [
  {
    label: "Profile",
    href: "/dashboard/expert/profile",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Services",
    href: "/dashboard/expert/services",
    icon: Package,
  },
  {
    label: "Requests",
    href: "/dashboard/expert/requests",
    icon: ClipboardList,
  },
]

export function isNavLinkActive(pathname: string, href: string, exact = false) {
  if (href === "/" || exact) {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
