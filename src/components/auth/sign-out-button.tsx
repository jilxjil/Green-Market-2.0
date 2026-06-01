"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function SignOutButton({
  variant = "outline",
  className,
}: {
  variant?: "default" | "outline";
  className?: string;
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    router.refresh();
    router.push("/login");
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={isSigningOut}
      onClick={signOut}
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
