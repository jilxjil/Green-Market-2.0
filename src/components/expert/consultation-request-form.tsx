"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConsultationRequestFormProps {
  serviceId: string;
  serviceTitle: string;
}

export default function ConsultationRequestForm({
  serviceId,
  serviceTitle,
}: ConsultationRequestFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/consultation-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        message: message.trim() || null,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (res.status === 401) {
      router.push(`/login?next=/experts/${serviceId}`);
      return;
    }

    if (!res.ok) {
      setError(data.error || "Unable to submit request.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-lg font-semibold">Request sent</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your consultation request for {serviceTitle} has been submitted.
        </p>
        <Button
          className="mt-4"
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          View dashboard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-5">
      <div>
        <h2 className="text-lg font-semibold">Request a consultation</h2>
        <p className="text-sm text-muted-foreground">
          Tell the expert what you need help with.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Input
          id="message"
          placeholder="Describe your question or farm challenge"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Send request"}
      </Button>
    </form>
  );
}
