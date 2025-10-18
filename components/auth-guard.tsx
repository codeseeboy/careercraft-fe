"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) {
      router.replace(`/auth/sign-in?next=${encodeURIComponent(pathname)}`)
    } else {
      setReady(true)
    }
  }, [router, pathname])

  if (!ready) return null
  return <>{children}</>
}
