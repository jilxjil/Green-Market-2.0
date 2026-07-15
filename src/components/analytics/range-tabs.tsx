import Link from "next/link";

export function RangeTabs({ active }: { active: number }) {
  return (
    <nav aria-label="Analytics date range" className="flex gap-2 overflow-x-auto">
      {[7, 30, 90].map((days) => (
        <Link key={days} href={`?days=${days}`} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${active === days ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
          {days} days
        </Link>
      ))}
    </nav>
  );
}
