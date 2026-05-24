import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        G
      </span>
      <span className="hidden text-base font-semibold text-foreground sm:inline">
        Green Market
      </span>
    </Link>
  )
}
