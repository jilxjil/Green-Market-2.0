"use client"

import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEndIcon } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            Green Market
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="bg-[url('/landscapeView.jpeg')] absolute inset-0 h-full w-full bg-cover bg-center dark:brightness-[0.2] dark:grayscale">
          <p className="text-6xl text-green-50 font-alan font-semibold mt-10 text-center">Green Market</p>
          <div className="flex flex-col mt-60 px-8 w-[90%] items-center justify-center text-center">
            <p className= "text-6xl w-[80%] text-justify-center items-center text-green-50 font-alan font-semibold space-y-4 )">&quot;Creativity is intelligence having fun&quot;</p>
            <p className="mt-6 text-lg font-medium text-green-50">- Albert Einstein</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}
