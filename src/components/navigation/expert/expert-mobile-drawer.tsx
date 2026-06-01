"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { expertLinks, isNavLinkActive } from "../nav-links";

export const EXPERT_NAV_OPEN_EVENT = "expert-nav-open";

export default function ExpertMobileDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }

    window.addEventListener(EXPERT_NAV_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(EXPERT_NAV_OPEN_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />

      <aside className="absolute left-0 top-0 flex h-full w-[min(100%,280px)] flex-col bg-background shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <p className="font-semibold text-primary">Green Market</p>
            <p className="text-xs text-muted-foreground">Expert Dashboard</p>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-md p-2 hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {expertLinks.map((link) => {
            const Icon = link.icon;
            const active = isNavLinkActive(pathname, link.href, link.exact);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  active
                    ? "bg-green-100 font-medium text-green-700"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {Icon && <Icon className="h-5 w-5 shrink-0" />}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
