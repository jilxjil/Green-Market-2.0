import Link from "next/link";

import { getPublicExpertServices } from "@/lib/expert-services";

export default async function ExpertsPage() {
  const services = await getPublicExpertServices();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Agricultural Experts</h1>
        <p className="text-muted-foreground">
          Book consultations with verified experts across crop planning, soil health, and more.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No expert services are available yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/experts/${service.id}`}
              className="rounded-lg border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm text-muted-foreground">{service.expertName}</p>
              <h2 className="mt-1 text-xl font-semibold">{service.title}</h2>
              {service.expertise && (
                <p className="mt-2 text-sm text-muted-foreground">{service.expertise}</p>
              )}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-bold">GH₵ {service.price}</span>
                <span className="text-muted-foreground">
                  {service.durationMinutes} min
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
