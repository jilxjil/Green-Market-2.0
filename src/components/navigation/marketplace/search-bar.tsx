"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    const next = params.toString();
    const target = next ? `/marketplace?${next}` : "/marketplace";

    if (pathname.startsWith("/marketplace")) {
      router.push(target);
      return;
    }

    router.push(target);
  }

  return (
    <form
      onSubmit={submitSearch}
      className="flex items-center gap-3 rounded-2xl border bg-muted/40 px-4 py-3"
    >
      <Search className="h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </form>
  );
}
