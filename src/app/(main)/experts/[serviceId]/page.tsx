import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  MessageSquare,
  MonitorUp,
  UserRound,
} from "lucide-react";

import ConsultationRequestForm from "@/components/expert/consultation-request-form";
import { getPublicExpertService } from "@/lib/expert-services";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function ExpertServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const service = await getPublicExpertService(serviceId);

  if (!service) {
    notFound();
  }

  return (
    <main className="bg-background">
      <section className="border-b bg-green-accent/20">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to experts
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-medium text-primary ring-1 ring-border">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified expert
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-medium ring-1 ring-border">
                  <MonitorUp className="h-3.5 w-3.5" />
                  Manual meeting link
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Consultation with {service.expertName}
                </p>
                <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                  {service.title}
                </h1>
                {service.expertise && (
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                    {service.expertise}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                  {getInitials(service.expertName)}
                </div>
                <div>
                  <p className="font-semibold">{service.expertName}</p>
                  <p className="text-sm text-muted-foreground">Agricultural advisor</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground">Price</p>
                  <p className="mt-1 font-bold">GH₵ {service.price}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="mt-1 font-bold">{service.durationMinutes} min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <div className="space-y-6">
          {service.description && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold">About this service</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {service.description}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-5">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">Session length</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {service.durationMinutes} minutes for focused guidance.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-5">
              <UserRound className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">Experience</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {service.yearsOfExperience != null
                  ? `${service.yearsOfExperience} years of agricultural advisory work.`
                  : "Expert profile details available after request."}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-5">
              <CalendarClock className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">Scheduling</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The expert confirms a time and sends the meeting link.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">How booking works</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: MessageSquare,
                  title: "Send your request",
                  copy: "Describe the crop, soil, storage, or business challenge.",
                },
                {
                  icon: CheckCircle2,
                  title: "Expert accepts",
                  copy: "They review the request and confirm next steps.",
                },
                {
                  icon: MonitorUp,
                  title: "Join externally",
                  copy: "Use the Meet, Zoom, Teams, or phone link they provide.",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-lg bg-muted p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ConsultationRequestForm serviceId={service.id} serviceTitle={service.title} />
        </div>
      </section>
    </main>
  );
}
