"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { isNavLinkActive, sellerLinks } from "../nav-links"

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
                {sellerLinks.map((link) => {
                    const Icon = link.icon
                    const active = isNavLinkActive(pathname, link.href, link.exact)

                    return (
                        <Link 
                            key = {link.href}
                            href = {link.href}
                            className = {`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition  ${
                                active
                                ? "bg-green-100 text-green-700 font-medium"
                                : "text-muted-foreground hover:bg-muted"}`}
                        >
                            {Icon && <Icon className="h-5 w-5"/>}
                            {link.label}
                        </Link>        
                    )
                })}
            </nav>
        </aside>
    )
}
