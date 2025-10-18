"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoadmapModulesSection } from "@/components/roadmap-modules-section"
import { YouTubePlayer } from "@/components/youtube-player"
// Using the components directly which contain the roadmap data
import {
  getUserCourseById,
  updateLessonCompletion,
  updateLessonNotes,
  markCourseCompleted,
  type UserCourse,
  type Module as ModuleType,
  type Lesson as LessonType,
} from "@/lib/roadmap-store"
import { ArrowLeft, CheckCircle2, Circle, Award, BookOpen, Layers, Video } from "lucide-react"

export default function CoursePlayerPage() {
  const params = useParams()
  const courseId = (params?.courseId as string) || ""
  const [course, setCourse] = useState<UserCourse | null>(null)
  const [activeModule, setActiveModule] = useState(0)
  const [activeLesson, setActiveLesson] = useState(0)
  const [notes, setNotes] = useState("")

  // Load course once on mount/param change
  useEffect(() => {
    const c = getUserCourseById(courseId)
    setCourse(c || null)
    setActiveModule(0)
    setActiveLesson(0)
    if (c && c.modules?.[0]?.lessons?.[0]?.notes) {
      setNotes(c.modules[0].lessons[0].notes as string)
    } else {
      setNotes("")
    }
  }, [courseId])

  // Safe derived values
  const modules: ModuleType[] = useMemo(() => course?.modules ?? [], [course])
  const currentModule: ModuleType | null = useMemo(
    () => (modules.length > 0 ? modules[Math.min(activeModule, modules.length - 1)] : null),
    [modules, activeModule],
  )
  const lessons: LessonType[] = useMemo(() => currentModule?.lessons ?? [], [currentModule])
  const currentLesson: LessonType | null = useMemo(
    () => (lessons.length > 0 ? lessons[Math.min(activeLesson, lessons.length - 1)] : null),
    [lessons, activeLesson],
  )

  // Keep notes in sync with current lesson
  useEffect(() => {
    if (!currentLesson) {
      setNotes("")
      return
    }
    setNotes(currentLesson.notes || "")
  }, [currentLesson])

  // Aggregate progress safely
  const totalLessons = useMemo(() => modules.reduce((a, m) => a + (m.lessons?.length || 0), 0), [modules])
  const completedLessons = useMemo(
    () => modules.reduce((a, m) => a + (m.lessons?.filter((l) => l.completed).length || 0), 0),
    [modules],
  )

  // We'll check if this is a roadmap course by ID pattern
  const isRoadmapCourse = [
    "web-development", 
    "python-data-science", 
    "aws-certified", 
    "javascript-complete", 
    "docker-kubernetes", 
    "ui-ux-design", 
    "machine-learning"
  ].includes(courseId)
  
  // Early not-found view
  if (!course && !isRoadmapCourse) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Course not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/learning">Back to Learning Hub</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // If it's a roadmap course, show the roadmap course page
  if (isRoadmapCourse) {
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
              <h1 className="text-2xl font-bold">Learning Roadmap</h1>
              <p className="text-sm text-muted-foreground">YouTube Learning Path</p>
            </div>
          </div>
          <Badge variant="outline">YouTube Roadmap</Badge>
        </div>
        
        <RoadmapModulesSection courseId={courseId} />
      </div>
    )
  }

  function refreshCourse() {
    if (!course) return;
    const updated = getUserCourseById(course.id)
    setCourse(updated)
  }

  function toggleLessonComplete(checked: boolean) {
    if (!course || !currentModule || !currentLesson) return
    updateLessonCompletion(course.id, currentModule.id, currentLesson.id, checked)
    const updated = getUserCourseById(course.id)
    setCourse(updated)
    // If all done, auto-issue certificate
    if (updated && updated.progress === 100 && !updated.certificateIssued) {
      markCourseCompleted(updated.id)
      refreshCourse()
    }
  }

  function saveNotes(value: string) {
    setNotes(value)
    if (!course || !currentModule || !currentLesson) return
    updateLessonNotes(course.id, currentModule.id, currentLesson.id, value)
    refreshCourse()
  }

  const canNavigatePrev = modules.length > 0 && (activeModule > 0 || activeLesson > 0)
  const canNavigateNext =
    modules.length > 0 &&
    (activeModule < modules.length - 1 || (currentModule && lessons.length > 0 && activeLesson < lessons.length - 1))

  function goPrev() {
    if (!canNavigatePrev) return
    if (activeLesson > 0) {
      setActiveLesson(activeLesson - 1)
    } else if (activeModule > 0) {
      const prevModuleLessons = modules[activeModule - 1]?.lessons || []
      setActiveModule(activeModule - 1)
      setActiveLesson(Math.max(prevModuleLessons.length - 1, 0))
    }
  }

  function goNext() {
    if (!canNavigateNext || !currentModule) return
    const lastLessonIndex = Math.max(lessons.length - 1, 0)
    const lastModuleIndex = Math.max(modules.length - 1, 0)
    if (activeLesson < lastLessonIndex) {
      setActiveLesson(activeLesson + 1)
    } else if (activeModule < lastModuleIndex) {
      setActiveModule(activeModule + 1)
      const nextLessons = modules[activeModule + 1]?.lessons || []
      setActiveLesson(nextLessons.length > 0 ? 0 : 0)
    }
  }

  // We now know course is not null because isRoadmapCourse case is handled above
  const courseStatusBadge =
    course?.status === "completed" ? (
      <Badge className="bg-green-600 text-white border-0">Completed</Badge>
    ) : (
      <Badge variant="secondary">In Progress</Badge>
    )

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
            <h1 className="text-2xl font-bold">{course?.title || "Course"}</h1>
            <p className="text-sm text-muted-foreground">{course?.subtitle || course?.category || "Learning Path"}</p>
          </div>
        </div>
        {course?.certificateIssued && (
          <Badge className="bg-green-600 text-white border-0 flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Certificate Issued
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Progress</CardTitle>
            <span className="text-2xl font-bold">{course?.progress ?? 0}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={course?.progress ?? 0} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Modules Sidebar */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Modules
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {modules.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No modules available yet.</div>
            ) : (
              <div className="space-y-2">
                {modules.map((m, mi) => {
                  const total = m.lessons?.length || 0
                  const done = m.lessons?.filter((l) => l.completed).length || 0
                  const modActive = mi === activeModule
                  return (
                    <div key={m.id} className="border-b last:border-none">
                      <button
                        onClick={() => {
                          setActiveModule(mi)
                          setActiveLesson(0)
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                          modActive ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{m.title || `Module ${mi + 1}`}</p>
                            <p className="text-xs text-muted-foreground">
                              {done} / {total} lessons
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xxs">
                            {total > 0 ? Math.round((done / total) * 100) : 0}%
                          </Badge>
                        </div>
                      </button>
                      {modActive && (
                        <div className="px-4 pb-3">
                          <div className="mt-2 ml-2 space-y-1">
                            {(m.lessons || []).map((ls, li) => (
                              <button
                                key={ls.id}
                                onClick={() => setActiveLesson(li)}
                                className={`block w-full text-left text-xs px-2 py-1 rounded ${
                                  li === activeLesson ? "bg-muted" : "hover:bg-muted/50"
                                }`}
                              >
                                {ls.completed ? (
                                  <CheckCircle2 className="inline h-3 w-3 text-green-600 mr-1" />
                                ) : (
                                  <Circle className="inline h-3 w-3 text-muted-foreground mr-1" />
                                )}
                                {ls.title || `Lesson ${li + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player and Lesson */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{currentLesson?.title || "Lesson"}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course?.title || "Course"} • Module {modules.length ? Math.min(activeModule + 1, modules.length) : "-"} • Lesson{" "}
                    {lessons.length ? Math.min(activeLesson + 1, lessons.length) : "-"}
                  </p>
                </div>
                {courseStatusBadge}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                  {currentLesson?.videoId ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${currentLesson.videoId}?rel=0&modestbranding=1&enablejsapi=1&widgetid=1&color=white`}
                      title={currentLesson.title || "Lesson video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      id="youtube-player"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white p-6 text-center">
                      <div>
                        <p className="font-semibold">No video available</p>
                        <p className="text-sm text-white/80 mt-1">
                          Search on YouTube:{" "}
                          <a
                            className="underline"
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                              currentLesson?.title || course?.title || "Learning",
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {currentLesson?.title || course?.title || "Learning"}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {currentLesson?.videoId && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <h3 className="font-medium">{currentLesson.title}</h3>
                      </div>
                      {currentLesson.channelTitle && (
                        <div className="text-sm text-muted-foreground">
                          by {currentLesson.channelTitle}
                        </div>
                      )}
                    </div>
                    
                    {currentLesson.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {currentLesson.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 text-sm">
                        {currentLesson.durationMinutes && (
                          <span className="text-muted-foreground">{currentLesson.durationMinutes} min</span>
                        )}
                        {currentLesson.viewCount && (
                          <span className="text-muted-foreground">
                            {Number(currentLesson.viewCount).toLocaleString()} views
                          </span>
                        )}
                      </div>
                      
                      <Button asChild size="sm" variant="outline">
                        <a 
                          href={`https://www.youtube.com/watch?v=${currentLesson.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open in YouTube
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="complete"
                  checked={!!currentLesson?.completed}
                  disabled={!currentLesson}
                  onCheckedChange={(checked) => toggleLessonComplete(!!checked)}
                />
                <label htmlFor="complete" className="text-sm font-medium cursor-pointer">
                  Mark this lesson as complete
                </label>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <h3 className="font-semibold">Your Notes</h3>
                </div>
                <Textarea
                  placeholder="Take notes about this lesson..."
                  value={notes}
                  onChange={(e) => saveNotes(e.target.value)}
                  className="min-h-[150px]"
                  disabled={!currentLesson}
                />
                <p className="text-xs text-muted-foreground">Notes are automatically saved</p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" disabled={!canNavigatePrev} onClick={goPrev}>
                  Previous
                </Button>
                <Button disabled={!canNavigateNext} onClick={goNext}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
