"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { loadRoadmapById, updateCourseProgress, type LearningRoadmap } from "@/lib/roadmap-store"
import { ArrowLeft, CheckCircle2, Circle, Award, BookOpen, Clock } from "lucide-react"

export default function RoadmapDetailPage() {
  const params = useParams()
  const roadmapId = params.roadmapId as string
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null)
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0)
  const [notes, setNotes] = useState("")
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0)

  useEffect(() => {
    const data = loadRoadmapById(roadmapId)
    setRoadmap(data)
    if (data && data.courses[0]) {
      setNotes(data.courses[0].notes || "")
    }
  }, [roadmapId])

  useEffect(() => {
    if (roadmap && roadmap.courses[selectedCourseIndex]) {
      setNotes(roadmap.courses[selectedCourseIndex].notes || "")
    }
  }, [selectedCourseIndex, roadmap])

  if (!roadmap) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Roadmap not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/learning">Back to Learning Hub</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentCourse = roadmap.courses[selectedCourseIndex]
  const hasLessons = Array.isArray(currentCourse.lessons) && currentCourse.lessons.length > 0
  const currentLesson = hasLessons ? currentCourse.lessons[selectedLessonIndex] : null

  function handleCourseComplete(courseId: string, completed: boolean) {
    updateCourseProgress(roadmapId, courseId, completed, notes)
    const updated = loadRoadmapById(roadmapId)
    setRoadmap(updated)
  }

  function handleNotesChange(value: string) {
    setNotes(value)
    updateCourseProgress(roadmapId, currentCourse.id, currentCourse.completed, value)
    const updated = loadRoadmapById(roadmapId)
    setRoadmap(updated)
  }

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
            <h1 className="text-2xl font-bold">{roadmap.jobTitle}</h1>
            <p className="text-sm text-muted-foreground">{roadmap.company}</p>
          </div>
        </div>
        {roadmap.certificateIssued && (
          <Button asChild>
            <Link href={`/dashboard/learning/${roadmapId}/certificate`}>
              <Award className="h-4 w-4 mr-2" />
              View Certificate
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Overall Progress</CardTitle>
            <span className="text-2xl font-bold">{roadmap.progress}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={roadmap.progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {roadmap.courses.filter((c) => c.completed).length} of {roadmap.courses.length} courses completed
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Curriculum Sidebar */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Course Curriculum</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {roadmap.courses.map((course, idx) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseIndex(idx)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                    idx === selectedCourseIndex ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {course.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{course.duration}</span>
                      </div>
                      {idx === selectedCourseIndex && hasLessons && (
                        <div className="mt-2 ml-8 space-y-1">
                          {currentCourse.lessons.map((ls: any, li: number) => (
                            <button
                              key={ls.id || li}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedLessonIndex(li)
                              }}
                              className={`block text-left text-xs px-2 py-1 rounded ${li === selectedLessonIndex ? "bg-muted" : "hover:bg-muted/50"}`}
                            >
                              {ls.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{currentCourse.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{currentCourse.description}</p>
                </div>
                <Badge variant={currentCourse.completed ? "default" : "secondary"}>
                  {currentCourse.completed ? "Completed" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* YouTube Video Player */}
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                {hasLessons ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentCourse.videoUrl}`}
                    title={currentCourse.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Mark as Complete */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="complete"
                  checked={currentCourse.completed}
                  onCheckedChange={(checked) => handleCourseComplete(currentCourse.id, !!checked)}
                />
                <label htmlFor="complete" className="text-sm font-medium cursor-pointer">
                  Mark this video as complete
                </label>
              </div>

              <Separator />

              {/* Notes Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <h3 className="font-semibold">Your Notes</h3>
                </div>
                <Textarea
                  placeholder="Take notes about this video..."
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">Notes are automatically saved</p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  disabled={selectedCourseIndex === 0}
                  onClick={() => setSelectedCourseIndex(selectedCourseIndex - 1)}
                >
                  Previous Video
                </Button>
                <Button
                  disabled={selectedCourseIndex === roadmap.courses.length - 1}
                  onClick={() => setSelectedCourseIndex(selectedCourseIndex + 1)}
                >
                  Next Video
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
