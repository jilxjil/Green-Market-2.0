import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

type LogoProps = {
  href?: string
  className?: string
  markClassName?: string
  textClassName?: string
}

export default function Logo({
  href = "/",
  className,
  markClassName,
  textClassName,
}: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white",
          markClassName
        )}
      >
        <Image
          src="/greenMarketLogo.png"
          alt="Green Market logo"
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </span>
      <span
        className={cn(
          "hidden text-base font-semibold text-foreground sm:inline",
          textClassName
        )}
      >
        Green Market
      </span>
    </Link>
  )
}
