"use client"

import { usePathname } from "next/navigation"

import BuyerNavbar from "./buyer/buyer-navbar"
import ExpertNavbar from "./expert/expert-navbar"
import MarketplaceNavbar from "./marketplace/marketplace-navbar"
import SellerNavbar from "./seller/seller-navbar"

export default function AppNavbar() {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard/seller")) {
    return <SellerNavbar />
  }

  if (pathname.startsWith("/dashboard/expert")) {
    return <ExpertNavbar />
  }

  if (pathname.startsWith("/dashboard/buyer")) {
    return <BuyerNavbar />
  }

  return <MarketplaceNavbar />
}
