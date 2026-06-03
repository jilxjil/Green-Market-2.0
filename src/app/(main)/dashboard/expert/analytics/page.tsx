import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { consultationRequests, expertServices } from "@/db/schema";
import { requireRole } from "@/lib/auth/require-role";

function formatCurrency(value: number) {
  return `GH₵ ${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default async function ExpertAnalyticsPage() {
  const { user } = await requireRole("expert");

  const requestRows = await db
    .select({
      requestId: consultationRequests.id,
      status: consultationRequests.status,
      createdAt: consultationRequests.createdAt,
      serviceId: expertServices.id,
      serviceTitle: expertServices.title,
      servicePrice: expertServices.price,
      durationMinutes: expertServices.durationMinutes,
    })
    .from(consultationRequests)
    .innerJoin(expertServices, eq(expertServices.id, consultationRequests.serviceId))
    .where(eq(expertServices.expertUserId, user.id))
    .orderBy(desc(consultationRequests.createdAt));

  const totalRequests = requestRows.length;
  const scheduledRequests = requestRows.filter((row) => row.status === "scheduled").length;
  const completedRequests = requestRows.filter((row) => row.status === "completed").length;
  const completionRate =
    totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;
  const completedRevenue = requestRows
    .filter((row) => row.status === "completed")
    .reduce((sum, row) => sum + row.servicePrice, 0);

  const serviceStats = new Map<
    string,
    { title: string; requests: number; completed: number; revenue: number }
  >();

  for (const row of requestRows) {
    const current =
      serviceStats.get(row.serviceId) ?? {
        title: row.serviceTitle,
        requests: 0,
        completed: 0,
        revenue: 0,
      };
    current.requests += 1;
    if (row.status === "completed") {
      current.completed += 1;
      current.revenue += row.servicePrice;
    }
    serviceStats.set(row.serviceId, current);
  }

  const services = Array.from(serviceStats.values())
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 6);
  const maxRequests = Math.max(...services.map((service) => service.requests), 1);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Expert analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Track booking volume, completions, and service demand.
          </p>
        </div>
        <Link
          href="/dashboard/expert/requests"
          className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-muted"
        >
          View requests
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Requests</p>
          <p className="mt-2 text-2xl font-bold">{totalRequests}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Scheduled</p>
          <p className="mt-2 text-2xl font-bold">{scheduledRequests}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-2 text-2xl font-bold">{completedRequests}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Completed value</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(completedRevenue)}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Service demand</h2>
          {services.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Consultation request activity will appear here.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {services.map((service) => (
                <div key={service.title} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <p className="font-medium">{service.title}</p>
                    <p className="text-muted-foreground">
                      {service.requests} request{service.requests === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(service.requests / maxRequests) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {service.completed} completed · {formatCurrency(service.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Completion rate</h2>
          <p className="mt-4 text-4xl font-bold">{completionRate}%</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Completed consultations compared with all requests.
          </p>
        </div>
      </section>
    </div>
  );
}
