import { User } from "lucide-react"

export default function UserMenu() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted cursor-pointer">
      <User className="h-4 w-4" />
    </div>
  )
}