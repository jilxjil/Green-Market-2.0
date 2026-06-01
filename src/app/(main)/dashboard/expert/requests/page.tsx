import ExpertRequestsInbox from "@/components/expert/expert-requests-inbox";

export default async function ExpertRequestsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Requests</h1>
        <p className="text-muted-foreground">
          Review and respond to consultation requests.
        </p>
      </div>

      <ExpertRequestsInbox />
    </div>
  );
}
