import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton({ actions = 2 }: { actions?: number }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      {actions > 0 && (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: actions }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-32 rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="rounded-lg border bg-card p-5">
          <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-7/12" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <PageHeaderSkeleton />
      <section className="space-y-5">
        <Skeleton className="h-7 w-32" />
        <CardListSkeleton count={2} />
      </section>
      <section className="space-y-5">
        <Skeleton className="h-7 w-52" />
        <CardListSkeleton count={2} />
      </section>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeaderSkeleton actions={1} />
      <StatCardsSkeleton />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-lg border bg-card p-5">
          <Skeleton className="h-6 w-36" />
          <div className="mt-6 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-6 h-12 w-24" />
          <Skeleton className="mt-5 h-3 w-full rounded-full" />
          <Skeleton className="mt-4 h-4 w-56" />
        </div>
      </section>
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeaderSkeleton actions={0} />
      <CardListSkeleton count={4} />
    </div>
  );
}

export function ConversationSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      <section className="min-h-[360px] space-y-4 rounded-lg border bg-card p-4">
        <div className="flex justify-start">
          <Skeleton className="h-16 w-72 max-w-[80%] rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-20 w-80 max-w-[80%] rounded-lg" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-14 w-64 max-w-[80%] rounded-lg" />
        </div>
      </section>
      <div className="flex gap-2">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function ProfileFormSkeleton() {
  return (
    <div className="w-full max-w-lg space-y-5 rounded-lg border bg-card p-4 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <Skeleton className="h-10 w-32 rounded-lg" />
    </div>
  );
}

export function NotificationListSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-md p-3">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-9/12" />
        </div>
      ))}
    </div>
  );
}
