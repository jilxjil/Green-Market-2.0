"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const items = [
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
  { value: "expert", label: "Expert" },
]

export function SignupForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "buyer",
    password: "",
    confirmPassword: "",
  })

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    if (!formData.role) {
      alert("Please select a role")
      return
    }

    try{
      const res = await authClient.signUp.email({
  email: formData.email,
  password: formData.password,
  name: formData.name,
})

if (res.error) {
  alert(res.error.message)
  return
}

if (res.data?.user) {
  const profileRes = await fetch("/api/profile/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: res.data.user.id,
      role: formData.role,
    }),
  })

  if (!profileRes.ok) {
    alert("Profile creation failed")
    return
  }
}
console.log(res.data)
router.replace("/dashboard")
    } catch (error) {
      console.error(error)
    }
   
    
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>

        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>

              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

              <FieldDescription>
                We&apos;ll use this to contact you.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Account Type</FieldLabel>

              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {items.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                Password
              </FieldLabel>

              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />

              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>

              <Input
                id="confirm-password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Field>

            <Field className="space-y-3">
              <Button type="submit" className="w-full">
                Create Account
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full"
              >
                Sign up with Google
              </Button>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a href="/login">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}