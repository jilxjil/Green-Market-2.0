import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";

import CancelConsultationButton from "@/components/expert/cancel-consultation-button";
import ConsultationCountdown from "@/components/expert/consultation-countdown";
import StartConversationButton from "@/components/messages/start-conversation-button";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getConsultationRequestDetail } from "@/lib/consultation-requests-db";

export default async function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { requestId } = await params;
  const detail = await getConsultationRequestDetail(requestId, user.id);

  if (!detail) {
    notFound();
  }

  const meetingUrl =
    detail.canReadMeeting && detail.request.meetingUrl
      ? detail.request.meetingUrl
      : null;
  const scheduledForIso = detail.request.scheduledFor?.toISOString();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <Link
          href={detail.isExpert ? "/dashboard/expert/requests" : "/dashboard"}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Back to dashboard
        </Link>
      </div>

      <section className="space-y-6 rounded-lg border bg-card p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Consultation</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {detail.service.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Request from {detail.requester.name} · {detail.service.durationMinutes} minutes
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
            {detail.request.status}
          </span>
        </div>

        {detail.request.message && (
          <div className="rounded-lg border bg-background p-4">
            <h2 className="font-semibold">Request message</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {detail.request.message}
            </p>
          </div>
        )}

        {scheduledForIso && (
          <div className="rounded-lg border bg-background p-4">
            <h2 className="font-semibold">Scheduled time</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {detail.request.scheduledFor!.toLocaleString()}
            </p>
            {detail.request.status === "scheduled" && (
              <p className="mt-1 text-sm font-medium text-primary">
                <ConsultationCountdown scheduledFor={scheduledForIso} />
              </p>
            )}
          </div>
        )}

        {meetingUrl ? (
          <div className="rounded-lg border bg-background p-4">
            <h2 className="font-semibold">Meeting link</h2>
            <Button asChild className="mt-4 h-12 w-full sm:w-auto">
              <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Join consultation
              </a>
            </Button>
            {detail.request.meetingNotes && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {detail.request.meetingNotes}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border bg-background p-4">
            <h2 className="font-semibold">Meeting link</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The expert will send a meeting link once your time is confirmed.
            </p>
          </div>
        )}

        {detail.isRequester && (
          <CancelConsultationButton
            requestId={detail.request.id}
            status={detail.request.status}
          />
        )}

        <div className="border-t pt-4">
          <StartConversationButton
            consultationRequestId={detail.request.id}
            label={detail.isExpert ? "Message requester" : "Message expert"}
          />
        </div>
      </section>
    </main>
  );
}
