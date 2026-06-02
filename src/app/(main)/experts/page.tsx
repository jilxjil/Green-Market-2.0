import { getPublicExpertServices } from "@/lib/expert-services";
import ExpertClientList from "./expert-client-list";

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

      <ExpertClientList services={services} />
    </main>
  );
}
