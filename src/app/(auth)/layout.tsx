"use client"

import Navbar from "@/components/auth/auth-navbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <>
            <Navbar/>
            <main className="flex-1">
                {children}
            </main>
        </>
    )
}
