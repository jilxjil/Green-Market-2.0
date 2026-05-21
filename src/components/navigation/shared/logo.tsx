import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-sm text-primary-foreground">
        G
      </div>
    </Link>
  )
}