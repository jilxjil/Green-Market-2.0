"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { authClient } from "@/lib/auth/auth-client";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = useMemo(() => session?.user ?? null, [session]);

  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setRole(null);
      return;
    }

    let canceled = false;

    async function loadRole() {
      const res = await fetch("/api/profile/role");
      const data = await res.json().catch(() => ({}));
      if (canceled) {
        return;
      }
      setRole(typeof data.role === "string" ? data.role : null);
    }

    loadRole();

    return () => {
      canceled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!isOpen) {
        return;
      }
      const target = event.target as Node | null;
      if (target && rootRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  async function signOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    setIsOpen(false);
    router.refresh();
    router.push("/login");
  }

  if (isPending) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        <User className="h-4 w-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        Sign in
      </Link>
    );
  }

  const initials = getInitials(user.name || user.email || "");

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Open user menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-semibold text-foreground"
        onClick={() => setIsOpen((open) => !open)}
      >
        {initials ? (
          <span className="text-xs">{initials}</span>
        ) : (
          <User className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border bg-popover shadow-md">
          <div className="space-y-1 border-b px-4 py-3">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex flex-col p-2">
            <Link
              href="/account"
              className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Account
            </Link>
            {role && (
              <Link
                href={`/dashboard/${role}`}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <button
              type="button"
              className="rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-muted disabled:opacity-60"
              disabled={isSigningOut}
              onClick={signOut}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
