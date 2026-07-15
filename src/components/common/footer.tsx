"use client"
import Link from "next/link";

import Logo from "@/components/navigation/shared/logo";



export default function Footer(){
    const footerLinks = [
  "Marketplace",
  "Products",
  "Farmers",
  "Buyers",
  "Experts",
  "About Us",
];
    return(
        <footer className="bg-gray-900 px-6 py-14 text-white md:px-14 lg:px-24">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Logo
              markClassName="h-9 w-9"
              textClassName="inline font-semibold tracking-tight text-white"
            />
            <p className="mt-6 text-sm text-gray-400">+233 20 600 3234</p>
            <p className="text-sm text-gray-400">info@greenmarket.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((label) => (
                <li key={label}>
                  <Link
                    href={`/${label.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Download App
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="
                  flex items-center gap-3
                  rounded-xl border border-gray-700
                  px-4 py-3
                  text-sm transition-colors hover:border-gray-500
                "
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
                  <path d="M3.18 23.76c.37.21.8.22 1.17.04l11.65-6.56-2.52-2.52-10.3 9.04zm-1.11-20.1a1.77 1.77 0 0 0-.07.5v15.68c0 .18.02.35.07.5l.07.07L13.4 12v-.28L2.14 3.59l-.07.07zm16.1 9.08-2.95-1.66-2.84 2.84 2.84 2.84 2.96-1.67a1.69 1.69 0 0 0 0-2.35zm-14.98 9.18L14.54 15l-2.52-2.52-9.87 8.44z"/>
                </svg>
                Google Play
              </a>
              <a
                href="#"
                className="
                  flex items-center gap-3
                  rounded-xl border border-gray-700
                  px-4 py-3
                  text-sm transition-colors hover:border-gray-500
                "
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Green Market. All rights reserved.
        </div>
      </footer>
    )
}
