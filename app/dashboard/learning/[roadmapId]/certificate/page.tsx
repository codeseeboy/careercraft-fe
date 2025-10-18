"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { loadRoadmapById, type LearningRoadmap } from "@/lib/roadmap-store"
import { ArrowLeft, Download, Award } from "lucide-react"

export default function CertificatePage() {
  const params = useParams()
  const roadmapId = params.roadmapId as string
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null)

  useEffect(() => {
    const data = loadRoadmapById(roadmapId)
    setRoadmap(data)
  }, [roadmapId])

  if (!roadmap || !roadmap.certificateIssued) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Certificate not available yet</p>
            <Button asChild>
              <Link href="/dashboard/learning">Back to Learning Hub</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userName = "Student Name" // This will come from auth context
  const completionDate = new Date(roadmap.createdAt)
  completionDate.setDate(completionDate.getDate() + roadmap.totalDays)
  const certificateId = `CC-${roadmap.id.substring(0, 8).toUpperCase()}`

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/learning">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Course Completion Certificate</h1>
            <p className="text-sm text-muted-foreground">Congratulations on completing your learning journey!</p>
          </div>
        </div>
        <Button onClick={() => window.print()}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Certificate Design */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardContent className="p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="h-12 w-12 text-blue-600" />
              <h2 className="text-4xl font-bold text-blue-600">CareerCraft AI</h2>
            </div>
            <h3 className="text-2xl font-serif">Certificate of Completion</h3>
            <p className="text-sm text-muted-foreground">This certifies that</p>
          </div>

          {/* Student Name */}
          <div className="text-center py-6 border-b-2 border-blue-600">
            <h1 className="text-4xl font-bold">{userName}</h1>
          </div>

          {/* Course Details */}
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">has successfully completed the learning roadmap for</p>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{roadmap.jobTitle}</h2>
              <p className="text-lg text-muted-foreground">{roadmap.company}</p>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Courses Completed</p>
                <p className="text-2xl font-bold">{roadmap.courses.length}</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Program Duration</p>
                <p className="text-2xl font-bold">{roadmap.totalDays} Days</p>
              </div>
            </div>
          </div>

          {/* Skills Learned */}
          <div className="space-y-3">
            <h3 className="text-center font-semibold">Skills Mastered</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {roadmap.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-12 pt-8">
            <div className="space-y-3">
              <div className="h-16 flex items-end justify-center">
                <div className="text-center">
                  <div className="border-t-2 border-foreground pt-2 px-8">
                    <p className="font-bold">SRA</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Founder & CEO</p>
                  <p className="text-xs text-muted-foreground">CareerCraft AI</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-16 flex items-end justify-center">
                <div className="text-center">
                  <div className="border-t-2 border-foreground pt-2 px-8">
                    <p className="font-bold">{completionDate.toLocaleDateString()}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Date of Completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate ID and Seal */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-xs text-muted-foreground">
              <p>Certificate ID: {certificateId}</p>
              <p>Verify at: careercraft.ai/verify/{certificateId}</p>
            </div>
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-blue-600 flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="text-center">
                  <Award className="h-8 w-8 text-blue-600 mx-auto" />
                  <p className="text-xs font-bold text-blue-600 mt-1">OFFICIAL</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
