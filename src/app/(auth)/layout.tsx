"use client"
import "./../globals.css"
import Navbar from "@/components/auth/auth-navbar";
import Footer from "@/components/common/footer";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <html lang="en">
              <body>
                {/* Wrap the children with ThemeProvider */}
                <Navbar/>
                  {children}
                  <Footer/>
              </body>
            </html>
    )
}

