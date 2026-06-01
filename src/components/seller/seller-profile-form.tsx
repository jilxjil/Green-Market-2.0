"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SellerProfile {
  farmName: string;
  location: string;
  verificationStatus: string;
}

export default function SellerProfileForm() {
  const [profile, setProfile] = useState<SellerProfile>({
    farmName: "",
    location: "",
    verificationStatus: "pending",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile/seller");
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Unable to load profile.");
        setLoading(false);
        return;
      }

      setProfile({
        farmName: data.farmName ?? "",
        location: data.location ?? "",
        verificationStatus: data.verificationStatus ?? "pending",
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

    const res = await fetch("/api/profile/seller", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        farmName: profile.farmName.trim(),
        location: profile.location.trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save profile.");
      return;
    }

    setProfile({
      farmName: data.farmName ?? "",
      location: data.location ?? "",
      verificationStatus: data.verificationStatus ?? "pending",
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
        <Label htmlFor="farmName">Farm / business name</Label>
        <Input
          id="farmName"
          placeholder="e.g. Sunrise Farms"
          value={profile.farmName}
          onChange={(event) =>
            setProfile((current) => ({ ...current, farmName: event.target.value }))
          }
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. Kumasi, Ashanti Region"
          value={profile.location}
          onChange={(event) =>
            setProfile((current) => ({ ...current, location: event.target.value }))
          }
          className="w-full"
        />
      </div>

      <div className="rounded-md bg-muted/60 px-3 py-2 text-sm">
        <span className="text-muted-foreground">Verification: </span>
        <span className="font-medium capitalize">{profile.verificationStatus}</span>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
