"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      signIn(email.trim(), password)
      router.replace(next)
    } catch (error) {
      const err = error as Error;
      setError(err.message || "Failed to sign in.")
    }
  }

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6">
      <div className="w-full max-w-lg mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to CareerCraft AI</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          New here?{" "}
          <Link className="underline" href="/auth/sign-up">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
