"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_STORAGE_KEY = "green-market-signup-role";

export default function SetupForm({ userId }: { userId: string }) {
  const [role, setRole] = useState("buyer");
  const [roleLocked, setRoleLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedRole = window.sessionStorage.getItem(ROLE_STORAGE_KEY);
    if (
      storedRole === "buyer" ||
      storedRole === "seller" ||
      storedRole === "expert"
    ) {
      setRole(storedRole);
      setRoleLocked(true);
    }
  }, []);

  async function submit() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/profile/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Unable to complete setup.");
      setLoading(false);
      return;
    }

    window.sessionStorage.removeItem(ROLE_STORAGE_KEY);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Complete setup</h1>
        <p className="text-muted-foreground">
          {roleLocked
            ? "Confirm your account details to continue."
            : "Choose how you want to use Green Market."}
        </p>
      </div>

      <div className="mt-8 space-y-6 rounded-lg border bg-card p-4 sm:p-6">
        <div className="space-y-2">
          <Label>Your role</Label>
          {roleLocked ? (
            <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium capitalize">
              {role}
            </div>
          ) : (
            <Select value={role} onValueChange={(value) => value && setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full" type="button" disabled={loading} onClick={submit}>
          {loading ? "Saving..." : "Continue to dashboard"}
        </Button>
      </div>
    </div>
  );
}

export { ROLE_STORAGE_KEY };
