import {
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
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
    label: "Products",
    href: "/dashboard/seller/products",
    icon: Package,
  },
]

export function isNavLinkActive(pathname: string, href: string, exact = false) {
  if (href === "/" || exact) {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
