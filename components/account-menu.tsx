"use client"

import { useRouter } from "next/navigation"
import { signOut, getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AccountMenu() {
  const router = useRouter()
  const user = getCurrentUser()
  const initials = user?.email?.[0]?.toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>My Profile</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            signOut()
            router.push("/auth/sign-in")
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
