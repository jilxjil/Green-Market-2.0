"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { getPublicExpertServices } from "@/lib/expert-services";

type ExpertServiceListItem = Awaited<ReturnType<typeof getPublicExpertServices>>[number];

export default function ExpertClientList({
  services,
}: {
  services: ExpertServiceListItem[];
}) {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    const matchesSearch =
      s.title.toLowerCase().includes(q) ||
      s.expertName?.toLowerCase().includes(q) ||
      s.expertise?.toLowerCase().includes(q);
    const matchesMin = min === null || s.price >= min;
    const matchesMax = max === null || s.price <= max;

    return matchesSearch && matchesMin && matchesMax;
  });

  return (
    <div>
      <div className="mb-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_140px_140px]">
        <Input
          placeholder="Search by expertise, name, or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="Min GH₵"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="Max GH₵"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No matching expert services found.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((service) => (
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
    </div>
  );
}
