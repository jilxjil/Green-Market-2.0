"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  User,
  Settings,
} from "lucide-react"

const links = [
  {
    label: "Overview",
    href: "/dashboard/seller",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/dashboard/seller/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/dashboard/seller/orders",
    icon: ShoppingCart,
  },
  {
    label: "Analytics",
    href: "/dashboard/seller/analytics",
    icon: BarChart3,
  },
  {
    label: "Messages",
    href: "/dashboard/seller/messages",
    icon: MessageSquare,
  },
]

export default function SellerSidebar() {
    const pathname = usePathname();

    return(
        <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-white">
            <div className="border-b p-6">
                <h2 className="text-xl text-primary font-alan font bold">
                    Green Market
                </h2>
                <p className="text-sm text-muted-foreground">
                Seller Dashboard
                </p>

            </div>

            <nav className="flex-1 space-y-2 p-4">
                {links.map((link) => {
                    const Icon = link.icon
                    const active = pathname === link.href

                    return (
                        <Link 
                            key = {link.href}
                            href = {link.href}
                            className = {`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition  ${
                                active
                                ? "bg-green-100 text-green-700 font-medium"
                                : "text-muted-foreground hover:bg-muted"}`}
                        >
                            <Icon className="h-5 w-5"/>
                            {link.label}
                        </Link>        
                    )
                })}
            </nav>
        </aside>
    )
}