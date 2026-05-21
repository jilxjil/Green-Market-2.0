"use client";

import Link from "next/link";

import {
  Bell,
  ShoppingCart,
  User,
} from "lucide-react";

export default function Topbar() {
  return (
    <header
      className="
        flex items-center justify-between
        py-4
      "
    >
      {/* Logo */}
      <Link href="/">
        <div
          className="
            flex h-11 w-11
            items-center justify-center
            rounded-full
            bg-primary
            text-primary-foreground
            font-bold
          "
        >
          G
        </div>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        <ShoppingCart className="h-6 w-6 cursor-pointer" />

        <Bell className="h-6 w-6 cursor-pointer" />

        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-full
            bg-muted
          "
        >
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}