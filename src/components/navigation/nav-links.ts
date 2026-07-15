import {
  Home,
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  Shield,
  Users,
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
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    label: "Analytics",
    href: "/dashboard/seller/analytics",
    icon: BarChart3,
  },
  {
    label: "Requests",
    href: "/dashboard/seller/requests",
    icon: MessageSquare,
  },
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
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
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    label: "Analytics",
    href: "/dashboard/expert/analytics",
    icon: BarChart3,
  },
]

export const buyerLinks: NavigationLink[] = [
  {
    label: "Overview",
    href: "/dashboard/buyer",
    exact: true,
  },
  {
    label: "Profile",
    href: "/dashboard/buyer/profile",
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    label: "Experts",
    href: "/experts",
  },
]

export const adminLinks: NavigationLink[] = [
  {
    label: "Overview",
    href: "/dashboard/admin",
    icon: Shield,
    exact: true,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Sellers",
    href: "/dashboard/admin/sellers",
    icon: Store,
  },
  {
    label: "Products",
    href: "/dashboard/admin/products",
    icon: Package,
  },
]

export function isNavLinkActive(pathname: string, href: string, exact = false) {
  if (href === "/" || exact) {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
