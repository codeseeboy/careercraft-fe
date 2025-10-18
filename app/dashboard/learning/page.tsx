"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  loadAllRoadmaps,
  deleteRoadmap,
  getTrendingCourses,
  getPopularPaths,
  enrollFromTrending,
  getUserCourses,
  type UserCourse,
} from "@/lib/roadmap-store"
import { analyzeResumeAI, generateRoadmap } from "@/lib/api-client"
import {
  BookOpen,
  Calendar,
  Trash2,
  Award,
  TrendingUp,
  Play,
  Clock,
  BarChart3,
  Target,
  GraduationCap,
  FileUp,
  Wand2,
  Layers,
  Plus,
} from "lucide-react"

export default function LearningHubPage() {
  const [roadmaps, setRoadmaps] = useState(loadAllRoadmaps())
  const [courses, setCourses] = useState<UserCourse[]>(getUserCourses())
  const trendingCourses = getTrendingCourses()
  const popularPaths = getPopularPaths()
  const [creating, setCreating] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [skillsWanted, setSkillsWanted] = useState("")
  const [jobDesc, setJobDesc] = useState("") // optional to enrich roadmap generation
  const [error, setError] = useState<string | null>(null)

  function handleDeleteRoadmap(id: string) {
    if (confirm("Are you sure you want to delete this roadmap?")) {
      deleteRoadmap(id)
      setRoadmaps(loadAllRoadmaps())
    }
  }

  async function handleStartTrendingCourse(courseId: string) {
    try {
      const course = trendingCourses.find((c) => c.id === courseId)
      if (!course) return
      const enrolled = await enrollFromTrending(course)
      setCourses(getUserCourses())
      // Go to the course player
      window.location.href = `/dashboard/learning/courses/${enrolled.id}`
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to start the course."
      alert(errorMessage)
    }
  }

  async function handleCreateRoadmapCourse() {
    setError(null)
    try {
      if (!resumeFile) {
        setError("Please upload your resume (PDF).")
        return
      }
      if (!skillsWanted.trim()) {
        setError("Please enter the skill(s) you want to learn.")
        return
      }

      setCreating(true)

      // Analyze resume (uses your backend)
      const analysis = await analyzeResumeAI(resumeFile)
      
      // Extract relevant information to use as resumeText since it's required by the API
      const resumeSummary = analysis.suggestions?.join(" ") || "Resume summary not available";
      
      // Generate roadmap from Gemini via backend (we'll use skillsWanted in the jobDescription to bias results)
      const roadmap = await generateRoadmap({
        score: analysis.score || 0,
        reason: analysis.reason || "Learning plan",
        jobDescription: jobDesc || `Create a learning roadmap to master: ${skillsWanted}`,
        resumeText: `Skills to learn: ${skillsWanted}. ${resumeSummary}`, // Using suggestions as resume text context
      })

      // Compose a unified YouTube suggestions list and create course
      const skills = roadmap.learningRoadmap || []
      for (const item of skills) {
        const youtubeList = (item.resources?.youtube || []).map(({ title }) => ({ title }))
        // Create a course per skill for richer structure
        const { createCourseFromRoadmap } = await import("@/lib/roadmap-store")
        await createCourseFromRoadmap(item.skill, youtubeList, { description: item.reasoning })
      }

      setCourses(getUserCourses())
      setCreating(false)
      setResumeFile(null)
      setSkillsWanted("")
      setJobDesc("")
      // Open the latest created course
      const latest = getUserCourses()[0]
      if (latest) window.location.href = `/dashboard/learning/courses/${latest.id}`
    } catch (e: unknown) {
      setCreating(false)
      setError(e instanceof Error ? e.message : "Failed to create roadmap course")
    }
  }

  return (
    <main className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Hub</h1>
          <p className="text-muted-foreground">Your personalized learning journey to career success</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Wand2 className="h-4 w-4 mr-2" />
              Create Your Own Roadmap
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a Personalized Roadmap</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  Upload your resume (PDF)
                </label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">What skill(s) do you want to learn?</label>
                <Input
                  placeholder="e.g., React, TypeScript, System Design"
                  value={skillsWanted}
                  onChange={(e) => setSkillsWanted(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Optional context (job description)</label>
                <Textarea
                  placeholder="Paste a JD or context to tailor your roadmap"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Cancel
              </Button>
              <Button onClick={handleCreateRoadmapCourse} disabled={creating}>
                {creating ? "Creating..." : "Generate Roadmap"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue={courses.length > 0 ? "my-courses" : roadmaps.length > 0 ? "my-roadmaps" : "trending"}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-courses">
            <GraduationCap className="h-4 w-4 mr-2" />
            My Courses ({courses.length})
          </TabsTrigger>
          <TabsTrigger value="my-roadmaps">
            <BookOpen className="h-4 w-4 mr-2" />
            My Roadmaps ({roadmaps.length})
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending Courses
          </TabsTrigger>
          <TabsTrigger value="paths">
            <Target className="h-4 w-4 mr-2" />
            Career Paths
          </TabsTrigger>
        </TabsList>

        {/* My Courses */}
        <TabsContent value="my-courses" className="space-y-4">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Courses Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start with a trending course or generate a personalized roadmap course
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button asChild variant="outline">
                    <Link href="#trending">Explore Trending</Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Roadmap
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Create a Personalized Roadmap</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <FileUp className="h-4 w-4" />
                            Upload your resume (PDF)
                          </label>
                          <Input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">What skill(s) do you want to learn?</label>
                          <Input
                            placeholder="e.g., React, TypeScript, System Design"
                            value={skillsWanted}
                            onChange={(e) => setSkillsWanted(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Optional context (job description)</label>
                          <Textarea
                            placeholder="Paste a JD or context to tailor your roadmap"
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                          />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateRoadmapCourse} disabled={creating}>
                          {creating ? "Creating..." : "Generate Roadmap"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <Card key={c.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-full">
                        <Image
                          src={c.thumbnail || "/placeholder-course.jpg"}
                          alt={c.title}
                          fill
                          className="object-cover"
                          unoptimized={c.thumbnail?.includes('ytimg.com')} // For YouTube thumbnails
                          onError={() => {
                            // This won't actually run with Next.js Image, error handled by unoptimized
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40"></div>
                      </div>
                      {c.status === "completed" && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-600 text-white border-0">Completed</Badge>
                        </div>
                      )}
                      {c.skills?.length > 0 && (
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="outline" className="bg-black/30 text-white border-white/20">
                            {c.skills[0]}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-base">{c.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{c.subtitle || c.category || "Custom Course"}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {c.status}
                      </Badge>
                    </div>

                    <CardDescription className="text-xs line-clamp-2">{c.description}</CardDescription>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        <span>{c.modules.length} modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{c.estimatedHours} hrs est.</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">Progress</span>
                        <span className="text-muted-foreground">{c.progress}%</span>
                      </div>
                      <Progress value={c.progress} />
                    </div>

                    <Button asChild className="w-full" size="sm">
                      <Link href={`/dashboard/learning/courses/${c.id}`}>
                        {c.progress === 0 ? "Start Course" : "Continue"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Roadmaps (existing) */}
        <TabsContent value="my-roadmaps" className="space-y-4">
          {roadmaps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Custom Roadmaps Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyze a job in JD Matcher to create a personalized learning roadmap based on your skill gaps
                </p>
                <Button asChild>
                  <Link href="/dashboard/jd-matcher">Go to JD Matcher</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roadmaps.map((roadmap) => (
                <Card key={roadmap.id} className="relative hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{roadmap.jobTitle}</CardTitle>
                        <p className="text-sm text-muted-foreground">{roadmap.company}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteRoadmap(roadmap.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{roadmap.totalDays} days program</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Progress</span>
                        <span className="text-muted-foreground">{roadmap.progress}%</span>
                      </div>
                      <Progress value={roadmap.progress} />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Skills to Learn:</p>
                      <div className="flex flex-wrap gap-1">
                        {roadmap.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {roadmap.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{roadmap.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {roadmap.courses.length} courses • {roadmap.courses.filter((c) => c.completed).length} completed
                      </p>
                    </div>

                    {roadmap.certificateIssued && (
                      <div className="flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-900/20 px-3 py-2">
                        <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Certificate Earned!
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/dashboard/learning/${roadmap.id}`}>
                          {roadmap.progress === 0 ? "Start Learning" : "Continue"}
                        </Link>
                      </Button>
                      {roadmap.certificateIssued && (
                        <Button asChild variant="outline" size="icon">
                          <Link href={`/dashboard/learning/${roadmap.id}/certificate`}>
                            <Award className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Trending */}
        <TabsContent value="trending" className="space-y-4" id="trending">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trendingCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <div className="w-full h-full bg-muted relative">
                      <Image
                        src={course.thumbnail || "/placeholder-course.jpg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                        unoptimized={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    </div>
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <Badge className="bg-primary text-white border-0">{course.level}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      {course.category}
                    </Badge>
                    <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">by {course.instructor}</p>
                  </div>

                  <CardDescription className="text-xs line-clamp-2">{course.description}</CardDescription>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      <span>{course.videoCount} videos</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {course.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {course.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{course.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button className="w-full" size="sm" onClick={() => handleStartTrendingCourse(course.id)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Career Paths (unchanged display) */}
        <TabsContent value="paths" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {popularPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{path.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>Estimated time: {path.duration}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Start This Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
