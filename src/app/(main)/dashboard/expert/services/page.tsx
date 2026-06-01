import ExpertServicesManager from "@/components/expert/expert-services-manager";

export default async function ExpertServicesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Services</h1>
        <p className="text-muted-foreground">
          Create and manage the services you offer to buyers and sellers.
        </p>
      </div>

      <ExpertServicesManager />
    </div>
  );
}
