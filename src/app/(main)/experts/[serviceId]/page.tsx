import Link from "next/link";
import { notFound } from "next/navigation";

import ConsultationRequestForm from "@/components/expert/consultation-request-form";
import { getPublicExpertService } from "@/lib/expert-services";

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
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        <Link
          href="/experts"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Back to experts
        </Link>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{service.expertName}</p>
          <h1 className="text-4xl font-bold tracking-tight">{service.title}</h1>
          {service.expertise && (
            <p className="text-muted-foreground">{service.expertise}</p>
          )}
        </div>

        {service.description && (
          <div className="rounded-lg border bg-card p-5">
            <h2 className="text-lg font-semibold">About this service</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              {service.description}
            </p>
          </div>
        )}

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Session details</p>
          <p className="mt-1 text-2xl font-bold">GH₵ {service.price}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {service.durationMinutes} minutes
          </p>
          {service.yearsOfExperience != null && (
            <p className="mt-2 text-sm text-muted-foreground">
              {service.yearsOfExperience} years of experience
            </p>
          )}
        </div>
      </section>

      <ConsultationRequestForm serviceId={service.id} serviceTitle={service.title} />
    </main>
  );
}
