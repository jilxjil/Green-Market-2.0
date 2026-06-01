import Link from "next/link";

import { requireRole } from "@/lib/auth/require-role";
import { getRequesterConsultationRequests } from "@/lib/consultation-requests-db";

export default async function SellerRequestsPage() {
  const { user } = await requireRole("seller");
  const requests = await getRequesterConsultationRequests(user.id);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Consultation requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Track expert consultation requests you have placed.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No consultation requests yet.
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map(({ request, service }) => (
            <article key={request.id} className="rounded-lg border bg-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={`/experts/${service.id}`}
                    className="text-lg font-semibold hover:text-primary"
                  >
                    {service.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
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

              {request.scheduledFor && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Scheduled for {new Date(request.scheduledFor).toLocaleString()}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

