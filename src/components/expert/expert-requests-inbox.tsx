"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConsultationRequestRow {
  request: {
    id: string;
    status: string;
    message: string | null;
    scheduledFor: string | null;
    meetingUrl: string | null;
    meetingNotes: string | null;
    meetingProvider: string | null;
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
  const [meetingUrlByRequest, setMeetingUrlByRequest] = useState<Record<string, string>>({});
  const [meetingProviderByRequest, setMeetingProviderByRequest] = useState<
    Record<string, string>
  >({});
  const [meetingNotesByRequest, setMeetingNotesByRequest] = useState<
    Record<string, string>
  >({});
  const [copiedRequestId, setCopiedRequestId] = useState<string | null>(null);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

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

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  async function updateStatus(
    requestId: string,
    status: string,
    scheduledFor?: string,
    meetingUrl?: string,
    meetingProvider?: string,
    meetingNotes?: string
  ) {
    setError("");
    setUpdatingRequestId(requestId);

    const res = await fetch(`/api/consultation-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        ...(scheduledFor ? { scheduledFor } : {}),
        ...(meetingUrl ? { meetingUrl } : {}),
        ...(meetingProvider ? { meetingProvider } : {}),
        ...(meetingNotes ? { meetingNotes } : {}),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Unable to update request.");
      toast.error(data.error || "Unable to update request.");
      setUpdatingRequestId(null);
      return;
    }

    await loadRequests();
    toast.success(
      status === "scheduled"
        ? "Consultation scheduled and link sent."
        : `Consultation ${status}.`
    );
    setUpdatingRequestId(null);
  }

  async function copyLink(requestId: string, meetingUrl: string) {
    await navigator.clipboard.writeText(meetingUrl);
    setCopiedRequestId(requestId);
    toast.success("Meeting link copied.");
    window.setTimeout(() => setCopiedRequestId(null), 1600);
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

      {requests.map(({ request, service, requester }) => {
        const isUpdating = updatingRequestId === request.id;
        const scheduledFor = request.scheduledFor
          ? new Date(request.scheduledFor)
          : null;
        const canComplete =
          request.status === "scheduled" &&
          scheduledFor !== null &&
          scheduledFor.getTime() <= now;

        return (
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
                  disabled={isUpdating}
                  onClick={() => updateStatus(request.id, "accepted")}
                >
                  {isUpdating ? "Saving..." : "Accept"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() => updateStatus(request.id, "rejected")}
                >
                  Reject
                </Button>
              </>
            )}

            {request.status === "accepted" && (
              <div className="w-full rounded-lg border bg-background p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`scheduled-for-${request.id}`}>Date and time</Label>
                    <Input
                      id={`scheduled-for-${request.id}`}
                      className="h-11"
                      type="datetime-local"
                      value={scheduledForByRequest[request.id] ?? ""}
                      onChange={(e) =>
                        setScheduledForByRequest((current) => ({
                          ...current,
                          [request.id]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`meeting-provider-${request.id}`}>Provider</Label>
                    <select
                      id={`meeting-provider-${request.id}`}
                      className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      value={meetingProviderByRequest[request.id] ?? "google_meet"}
                      onChange={(e) =>
                        setMeetingProviderByRequest((current) => ({
                          ...current,
                          [request.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="google_meet">Google Meet</option>
                      <option value="zoom">Zoom</option>
                      <option value="teams">Microsoft Teams</option>
                      <option value="phone">Phone link</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`meeting-url-${request.id}`}>Meeting link</Label>
                    <Input
                      id={`meeting-url-${request.id}`}
                      className="h-11"
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={meetingUrlByRequest[request.id] ?? ""}
                      onChange={(e) =>
                        setMeetingUrlByRequest((current) => ({
                          ...current,
                          [request.id]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`meeting-notes-${request.id}`}>Notes</Label>
                    <textarea
                      id={`meeting-notes-${request.id}`}
                      className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      placeholder="Optional dial-in details or agenda"
                      value={meetingNotesByRequest[request.id] ?? ""}
                      onChange={(e) =>
                        setMeetingNotesByRequest((current) => ({
                          ...current,
                          [request.id]: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  className="mt-4 h-11 w-full sm:w-auto"
                  disabled={
                    isUpdating ||
                    !scheduledForByRequest[request.id] ||
                    !meetingUrlByRequest[request.id]
                  }
                  onClick={() =>
                    updateStatus(
                      request.id,
                      "scheduled",
                      scheduledForByRequest[request.id]
                        ? new Date(scheduledForByRequest[request.id]).toISOString()
                        : undefined,
                      meetingUrlByRequest[request.id],
                      meetingProviderByRequest[request.id] ?? "google_meet",
                      meetingNotesByRequest[request.id]
                    )
                  }
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule & send link"
                  )}
                </Button>
              </div>
            )}

            {request.status === "scheduled" && (
              <>
                {request.meetingUrl && (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => copyLink(request.id, request.meetingUrl!)}
                    >
                      <Copy className="h-4 w-4" />
                      {copiedRequestId === request.id ? "Copied" : "Copy link"}
                    </Button>
                    <Button asChild type="button" size="sm" variant="outline">
                      <a
                        href={request.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open meeting
                      </a>
                    </Button>
                  </>
                )}
                <Button
                  type="button"
                  size="sm"
                  disabled={isUpdating || !canComplete}
                  title={
                    canComplete
                      ? undefined
                      : "You can mark this completed after the scheduled time."
                  }
                  onClick={() => updateStatus(request.id, "completed")}
                >
                  {isUpdating ? "Saving..." : "Mark completed"}
                </Button>
              </>
            )}
          </div>

          {request.scheduledFor && (
            <p className="mt-3 text-sm text-muted-foreground">
              Scheduled for {new Date(request.scheduledFor).toLocaleString()}
            </p>
          )}
          <div className="mt-3">
            <Link
              href={`/dashboard/expert/requests/${request.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              View request details
            </Link>
          </div>
        </article>
        );
      })}
    </div>
  );
}
