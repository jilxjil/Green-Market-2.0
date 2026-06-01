"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExpertProfile {
  expertise: string | null;
  yearsOfExperience: number | null;
}

export default function ExpertProfileForm() {
  const [profile, setProfile] = useState<ExpertProfile>({
    expertise: "",
    yearsOfExperience: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile/expert");
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Unable to load profile.");
        setLoading(false);
        return;
      }

      setProfile({
        expertise: data.expertise ?? "",
        yearsOfExperience: data.yearsOfExperience ?? null,
      });
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/profile/expert", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expertise: profile.expertise?.trim() || undefined,
        yearsOfExperience:
          profile.yearsOfExperience == null
            ? undefined
            : profile.yearsOfExperience,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Unable to save profile.");
      setSaving(false);
      return;
    }

    setProfile({
      expertise: data.expertise ?? "",
      yearsOfExperience: data.yearsOfExperience ?? null,
    });
    setMessage("Profile saved.");
    setSaving(false);
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading profile...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-6 rounded-lg border bg-card p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="expertise">Areas of expertise</Label>
        <Input
          id="expertise"
          placeholder="e.g. Crop planning, soil health, pest management"
          value={profile.expertise ?? ""}
          onChange={(e) =>
            setProfile((current) => ({
              ...current,
              expertise: e.target.value,
            }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">Years of experience</Label>
        <Input
          id="yearsOfExperience"
          type="number"
          min={0}
          max={80}
          placeholder="0"
          value={profile.yearsOfExperience ?? ""}
          onChange={(e) =>
            setProfile((current) => ({
              ...current,
              yearsOfExperience:
                e.target.value === "" ? null : Number(e.target.value),
            }))
          }
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
