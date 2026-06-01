"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BuyerProfile {
  businessName: string;
  businessType: string;
}

export default function BuyerProfileForm() {
  const [profile, setProfile] = useState<BuyerProfile>({
    businessName: "",
    businessType: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile/buyer");
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Unable to load profile.");
        setLoading(false);
        return;
      }

      setProfile({
        businessName: data.businessName ?? "",
        businessType: data.businessType ?? "",
      });
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/profile/buyer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: profile.businessName.trim(),
        businessType: profile.businessType.trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save profile.");
      return;
    }

    setProfile({
      businessName: data.businessName ?? "",
      businessType: data.businessType ?? "",
    });
    setMessage("Profile saved successfully.");
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading profile...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg space-y-5 rounded-lg border bg-card p-4 sm:p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="businessName">Business name</Label>
        <Input
          id="businessName"
          placeholder="e.g. Green Basket Stores"
          value={profile.businessName}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              businessName: event.target.value,
            }))
          }
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">Business type</Label>
        <Input
          id="businessType"
          placeholder="e.g. Retailer, Restaurant, Distributor"
          value={profile.businessType}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              businessType: event.target.value,
            }))
          }
          required
          className="w-full"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
