"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div
      className="
        flex items-center gap-3
        rounded-2xl border
        bg-muted/40
        px-4 py-3
      "
    >
      <Search className="h-5 w-5 text-muted-foreground" />

      <input
        type="text"
        placeholder="Search for products..."
        className="
          w-full bg-transparent
          text-sm outline-none
          placeholder:text-muted-foreground
        "
      />
    </div>
  );
}