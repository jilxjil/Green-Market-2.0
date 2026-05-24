"use client"

import { usePathname } from "next/navigation"

import MarketplaceNavbar from "./marketplace/marketplace-navbar"
import SellerNavbar from "./seller/seller-navbar"

export default function AppNavbar() {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard/seller")) {
    return <SellerNavbar />
  }

  return <MarketplaceNavbar />
}
