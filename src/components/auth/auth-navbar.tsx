"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {Button} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/navigation/shared/logo";
import { isNavLinkActive, publicLinks } from "@/components/navigation/nav-links";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="
        sticky start-0 top-0 z-20
        w-full border-b border-default
        bg-background/80 backdrop-blur
      "
    >
      <div
        className="
          mx-auto flex max-w-screen-xl
          flex-wrap items-center
          justify-between px-4
        "
      >
        {/* Logo */}
        <Logo />

        {/* Right Actions */}
        <div
          className="
            flex items-center
            space-x-3 md:order-2
            md:space-x-0 rtl:space-x-reverse
          "
        >
          <Button
            asChild
            type="button"
            className="
              max-sm:hidden
              rounded-xl border
              border-transparent
              bg-primary px-6 py-4
              text-sm font-normal
              leading-5 text-green-50
              shadow-xs
              hover:bg-green-900
              focus:outline-none
              focus:ring-4
              focus:ring-brand-medium
            "
          >
            <Link href="/register">Get started</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="
              inline-flex h-10 w-10
              items-center justify-center
              rounded-base p-2
              text-sm text-body
              hover:bg-neutral-secondary-soft
              hover:text-heading
              focus:outline-none
              focus:ring-2
              focus:ring-neutral-tertiary
              md:hidden
            "
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
          >
            <span className="sr-only">
              Open main menu
            </span>

            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div
          className={`
            ${
              isOpen ? "flex" : "hidden"
            }
            w-full items-center
            justify-between
            md:order-1 md:flex
            md:w-auto
          `}
          id="navbar-sticky"
        >
          <ul
            className="
              mt-4 flex w-full
              flex-col rounded-base
              border border-default
              bg-neutral-secondary-soft
              p-4 font-medium
              md:mt-0 md:w-auto
              md:flex-row md:space-x-8
              md:border-0
              md:bg-neutral-primary
            "
          >
            {publicLinks.map((link) => {
              const active = isNavLinkActive(pathname, link.href, link.exact);

              return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-full px-4 py-1 text-sm transition-colors",
                    active
                      ? "bg-green-accent text-green-900"
                      : "text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
