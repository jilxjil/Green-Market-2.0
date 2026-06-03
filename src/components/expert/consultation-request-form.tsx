"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Request sent</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your consultation request for {serviceTitle} has been submitted. The
          expert will send a meeting link once your time is confirmed.
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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6 shadow-sm">
      <div>
        <p className="text-sm text-muted-foreground">Request consultation</p>
        <h2 className="mt-1 text-2xl font-bold">Start with your question</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tell the expert what you need help with.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          className="min-h-36 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Describe your question, farm challenge, crop symptoms, location, or timeline."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={1200}
        />
        <p className="text-xs text-muted-foreground">
          The expert will send a meeting link once your time is confirmed.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="h-11 w-full" disabled={loading}>
        <Send className="h-4 w-4" />
        {loading ? "Submitting..." : "Send request"}
      </Button>
    </form>
  );
}
