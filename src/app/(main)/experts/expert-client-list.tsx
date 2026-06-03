"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bug,
  Clock,
  FlaskConical,
  LineChart,
  PackageCheck,
  Search,
  SlidersHorizontal,
  Sprout,
  UserRound,
  Wheat,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getExpertServiceImage } from "@/lib/expert-service-images";
import type { getPublicExpertServices } from "@/lib/expert-services";

type ExpertServiceListItem = Awaited<ReturnType<typeof getPublicExpertServices>>[number];

const categories: Array<{
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
}> = [
  {
    id: "all",
    name: "All services",
    description: "Browse every available advisory service",
    icon: Sprout,
    keywords: [],
  },
  {
    id: "crop-advisory",
    name: "Crop advisory",
    description: "Planning, planting, and yield improvement",
    icon: Wheat,
    keywords: ["crop", "planting", "yield", "farm", "maize", "tomato"],
  },
  {
    id: "soil-fertility",
    name: "Soil fertility",
    description: "Compost, fertilizer, and rotation planning",
    icon: FlaskConical,
    keywords: ["soil", "fertility", "fertilizer", "compost", "rotation"],
  },
  {
    id: "pest-disease",
    name: "Pest and disease",
    description: "Diagnosis and practical treatment guidance",
    icon: Bug,
    keywords: ["disease", "pest", "diagnosis", "treatment", "symptom"],
  },
  {
    id: "post-harvest",
    name: "Post-harvest",
    description: "Storage, sorting, packaging, and loss reduction",
    icon: PackageCheck,
    keywords: ["post-harvest", "storage", "handling", "packaging", "loss"],
  },
  {
    id: "farm-business",
    name: "Farm business",
    description: "Market access, operations, and growth support",
    icon: LineChart,
    keywords: ["business", "market", "logistics", "supply", "planning"],
  },
];

function serviceText(service: ExpertServiceListItem) {
  return `${service.title} ${service.description ?? ""} ${service.expertise ?? ""}`.toLowerCase();
}

function matchesCategory(service: ExpertServiceListItem, categoryId: string) {
  if (categoryId === "all") return true;
  const category = categories.find((item) => item.id === categoryId);
  if (!category) return true;
  const haystack = serviceText(service);
  return category.keywords.some((keyword) => haystack.includes(keyword));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ExpertClientList({
  services,
}: {
  services: ExpertServiceListItem[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("1000");

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.id,
          services.filter((service) => matchesCategory(service, category.id)).length,
        ])
      ),
    [services]
  );

  const filtered = services.filter((service) => {
    const q = search.toLowerCase().trim();
    const max = maxPrice ? Number(maxPrice) : null;
    const matchesSearch =
      !q ||
      service.title.toLowerCase().includes(q) ||
      service.expertName?.toLowerCase().includes(q) ||
      service.expertise?.toLowerCase().includes(q) ||
      service.description?.toLowerCase().includes(q);
    const matchesMax = max === null || service.price <= max;

    return matchesSearch && matchesMax && matchesCategory(service, selectedCategory);
  });

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {categories.map(({ id, name, description, icon: Icon }) => {
          const selected = selectedCategory === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedCategory(id)}
              className={`group flex min-h-36 flex-col items-start justify-between rounded-lg border p-4 text-left transition ${
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selected ? "bg-primary-foreground/15" : "bg-green-accent/30 text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="space-y-1">
                <span className="block text-sm font-semibold">{name}</span>
                <span
                  className={`block text-xs leading-5 ${
                    selected ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {description}
                </span>
              </span>
              <span
                className={`text-xs font-medium ${
                  selected ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {categoryCounts[id] ?? 0} service{(categoryCounts[id] ?? 0) === 1 ? "" : "s"}
              </span>
            </button>
          );
        })}
      </section>

      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 pl-9"
              placeholder="Search expertise, service, or expert name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="flex h-11 items-center gap-3 rounded-lg border px-3">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Max GH₵
            </span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
            />
          </label>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center">
          <h2 className="text-xl font-semibold">No matching expert services</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different category, search term, or price range.
          </p>
        </div>
      ) : (
        <section className="grid gap-5 lg:grid-cols-2">
          {filtered.map((service) => (
            <article
              key={service.id}
              className="group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative min-h-48 overflow-hidden">
                <img
                  src={getExpertServiceImage(service)}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative flex min-h-48 flex-col justify-between p-5 text-primary-foreground">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified expert
                    </span>
                    <div className="rounded-lg bg-background/90 px-3 py-2 text-right text-foreground shadow-sm">
                      <p className="text-xs text-muted-foreground">Consultation</p>
                      <p className="text-lg font-bold">GH₵ {service.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-background text-lg font-bold text-primary ring-1 ring-background/70">
                      {getInitials(service.expertName)}
                    </div>
                    <div>
                      <p className="font-semibold">{service.expertName}</p>
                      <p className="mt-1 text-sm text-primary-foreground/80">
                        Agricultural advisor
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <Link
                    href={`/experts/${service.id}`}
                    className="text-xl font-semibold tracking-tight hover:text-primary"
                  >
                    {service.title}
                  </Link>
                  {service.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    {service.durationMinutes} min
                  </span>
                  {service.yearsOfExperience != null && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                      <UserRound className="h-3.5 w-3.5" />
                      {service.yearsOfExperience} years
                    </span>
                  )}
                  {service.expertise && (
                    <span className="inline-flex rounded-full bg-muted px-3 py-1">
                      {service.expertise}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Manual Meet, Zoom, Teams, or phone link after scheduling.
                  </p>
                  <Button asChild className="h-10 shrink-0">
                    <Link href={`/experts/${service.id}`}>
                      View & request
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
