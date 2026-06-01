"use client"

import Logo from "../shared/logo"
import Notifications from "../shared/notifications"
import UserMenu from "../shared/user-menu"

export default function BuyerNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Logo />

          <div className="hidden sm:block">
            <p className="text-sm text-muted-foreground">Buyer Dashboard</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Notifications />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
