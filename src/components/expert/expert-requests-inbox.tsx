"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConsultationRequestRow {
  request: {
    id: string;
    status: string;
    message: string | null;
    scheduledFor: string | null;
    createdAt: string;
  };
  service: {
    id: string;
    title: string;
    price: number;
    durationMinutes: number;
  };
  requester: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ExpertRequestsInbox() {
  const [requests, setRequests] = useState<ConsultationRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scheduledForByRequest, setScheduledForByRequest] = useState<
    Record<string, string>
  >({});

  async function loadRequests() {
    const res = await fetch("/api/consultation-requests");
    const data = await res.json().catch(() => []);

    if (!res.ok) {
      setError(data.error || "Unable to load requests.");
      setLoading(false);
      return;
    }

    setRequests(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateStatus(
    requestId: string,
    status: string,
    scheduledFor?: string
  ) {
    setError("");

    const res = await fetch(`/api/consultation-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        ...(scheduledFor ? { scheduledFor } : {}),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Unable to update request.");
      return;
    }

    await loadRequests();
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading requests...</p>;
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No consultation requests yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {requests.map(({ request, service, requester }) => (
        <article key={request.id} className="rounded-lg border bg-card p-5">
          <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{service.title}</h2>
              <p className="text-sm text-muted-foreground">
                From {requester.name} ({requester.email})
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
              {request.status}
            </span>
          </div>

          {request.message && (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {request.message}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {request.status === "pending" && (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => updateStatus(request.id, "accepted")}
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(request.id, "rejected")}
                >
                  Reject
                </Button>
              </>
            )}

            {request.status === "accepted" && (
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  type="datetime-local"
                  value={scheduledForByRequest[request.id] ?? ""}
                  onChange={(e) =>
                    setScheduledForByRequest((current) => ({
                      ...current,
                      [request.id]: e.target.value,
                    }))
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    updateStatus(
                      request.id,
                      "scheduled",
                      scheduledForByRequest[request.id]
                        ? new Date(
                            scheduledForByRequest[request.id]
                          ).toISOString()
                        : undefined
                    )
                  }
                >
                  Schedule
                </Button>
              </div>
            )}

            {request.status === "scheduled" && (
              <Button
                type="button"
                size="sm"
                onClick={() => updateStatus(request.id, "completed")}
              >
                Mark completed
              </Button>
            )}
          </div>

          {request.scheduledFor && (
            <p className="mt-3 text-sm text-muted-foreground">
              Scheduled for {new Date(request.scheduledFor).toLocaleString()}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
