"use client"

import { Menu } from "lucide-react"
import Logo from "./shared/logo"
import Notifications from "./shared/notifications"
import UserMenu from "./shared/user-menu"

export default function SellerNavbar({
  title = "Dashboard",
  toggleSidebar,
}: {
  title?: string
  toggleSidebar?: () => void
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo />

          <div className="hidden md:block text-sm text-muted-foreground">
            {title}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Notifications />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}