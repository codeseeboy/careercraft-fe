"use client"

import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ATSScoreBadge({
  score,
  loading,
  size = "sm",
}: {
  score: number | null
  loading?: boolean
  size?: "sm" | "lg"
}) {
  if (loading) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        ATS
      </Badge>
    )
  }
  if (score == null) {
    return (
      <Badge variant="outline" className="gap-1">
        ATS
      </Badge>
    )
  }
  const color =
    score >= 80 ? "bg-green-600 text-white" : score >= 60 ? "bg-yellow-500 text-black" : "bg-red-600 text-white"
  const textSize = size === "lg" ? "text-base px-3 py-1.5" : "text-xs px-2 py-1"
  return <span className={cn("inline-flex items-center rounded-md font-medium", color, textSize)}>{score}/100 ATS</span>
}
