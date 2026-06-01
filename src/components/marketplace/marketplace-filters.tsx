"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface MarketplaceFiltersProps {
  categories: string[];
}

export default function MarketplaceFilters({ categories }: MarketplaceFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const query = searchParams.get("q");

  function buildHref(category?: string) {
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }

    if (category) {
      params.set("category", category);
    }

    const next = params.toString();
    return next ? `${pathname}?${next}` : pathname;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref()}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          !activeCategory
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={buildHref(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
            activeCategory === category
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
