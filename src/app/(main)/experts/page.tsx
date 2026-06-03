import { getPublicExpertServices } from "@/lib/expert-services";
import ExpertClientList from "./expert-client-list";

export default async function ExpertsPage() {
  const services = await getPublicExpertServices();
  const expertCount = new Set(services.map((service) => service.expertUserId)).size;
  const lowestPrice = services.length
    ? Math.min(...services.map((service) => service.price))
    : 0;

  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[360px] bg-[url('/consultingImage.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end px-4 py-10 text-primary-foreground md:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/80">
              Green Market Expert Network
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Practical agricultural advice from people who know the field.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-primary-foreground/85 sm:text-lg">
              Book crop, soil, disease, and post-harvest consultations. Experts confirm
              the time, then send a Meet, Zoom, Teams, or phone link.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 md:grid-cols-3 md:px-6 lg:px-8">
          <div>
            <p className="text-2xl font-bold">{services.length}</p>
            <p className="text-sm text-muted-foreground">Available services</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{expertCount}</p>
            <p className="text-sm text-muted-foreground">Active experts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {lowestPrice ? `From GH₵ ${lowestPrice}` : "New listings soon"}
            </p>
            <p className="text-sm text-muted-foreground">Manual scheduling, no payment gateway</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Find the right support</h2>
          <p className="max-w-2xl text-muted-foreground">
            Filter by advisory area, search expertise, and compare consultation length
            before requesting a session.
          </p>
        </div>
        <ExpertClientList services={services} />
      </section>
    </main>
  );
}
