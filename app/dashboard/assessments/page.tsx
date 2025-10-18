"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createAssessment } from "@/lib/api-client"
import { 
  getAllCourses, 
  getUserBadges, 
  initializeDefaultCourses,
  getAssessmentHistory,
  StoredAssessment,
  Course
} from "@/lib/jobScoringService"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Check, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

type QA = { question: string; options: string[]; correctAnswer: string }

export default function AssessmentsPage() {
  // We use getAllCourses instead of roadmaps
  const [customCourses, setCustomCourses] = useState<Course[]>([])
  
  // We're not using completedCourses anymore as we show all courses with completion indicators
  const [topic, setTopic] = useState<string>("")
  const [quiz, setQuiz] = useState<QA[] | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)
  const [activeTab, setActiveTab] = useState('assessments')
  const [loading, setLoading] = useState(false)
  // Define types for badge UI
  interface Badge {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    earnedAt: number;
    courseId: string;
    // Legacy fields
    topic?: string;
    date?: string;
    kind?: string;
  }

  const [userBadges, setUserBadges] = useState<Badge[]>([])
  const [assessmentHistory, setAssessmentHistory] = useState<StoredAssessment[]>([])

  // Initialize default courses if needed and load user data
  useEffect(() => {
    // Initialize default data
    initializeDefaultCourses();
    
    // Load data
    setCustomCourses(getAllCourses());
    setUserBadges(getUserBadges());
    setAssessmentHistory(getAssessmentHistory());
    
    // Preselect Data Structures course for assessment
    setTopic("Data Structures");
  }, [setCustomCourses, setUserBadges, setAssessmentHistory, setTopic]);

  async function startAssessment() {
    if (!topic) {
      alert("Select a course/topic first.")
      return
    }
    
    setLoading(true);
    try {
      // Find if we have a pre-defined assessment for this topic
      const selectedCourse = customCourses.find(c => c.title === topic);
      
      if (selectedCourse) {
        // Check if there's a pending assessment for this course
        const existingAssessment = assessmentHistory.find(
          a => a.courseId === selectedCourse.id && !a.completed
        );
        
        if (existingAssessment && existingAssessment.questions && existingAssessment.questions.length > 0) {
          setQuiz(existingAssessment.questions);
        } else {
          // Create new assessment from the API
          const res = await createAssessment(topic, selectedCourse.level || "intermediate", 5);
          setQuiz(res.assessment);
        }
      } else {
        // Create new assessment from the API for custom topic
        const res = await createAssessment(topic, "intermediate", 5);
        setQuiz(res.assessment);
      }
      
      setAnswers({});
      setResult(null);
    } catch (error) {
      console.error("Failed to start assessment:", error);
      alert("Failed to generate assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!quiz) return
    setSubmitting(true)
    try {
      const total = quiz.length
      let correct = 0
      quiz.forEach((q, idx) => {
        if (answers[idx] && answers[idx] === q.correctAnswer) correct++
      })
      const score = Math.round((correct / total) * 100)
      const passed = score >= 70
      setResult({ score, passed })
      // Persist a simple badge in localStorage
      const prev = JSON.parse(localStorage.getItem("assessment-history") || "[]")
      prev.push({ topic, score, passed, date: new Date().toISOString() })
      localStorage.setItem("assessment-history", JSON.stringify(prev))
      if (passed) {
        const badges = JSON.parse(localStorage.getItem("badges") || "[]")
        badges.push({ kind: "course-assessment", topic, date: new Date().toISOString() })
        localStorage.setItem("badges", JSON.stringify(badges))
      }
      
      // Refresh our data
      setUserBadges(getUserBadges());
      setAssessmentHistory(getAssessmentHistory());
    } finally {
      setSubmitting(false)
    }
  }
  
  // Format date helper
  const formatDate = (timestamp: number | string) => {
    const date = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assessments & Badges</h1>
        <p className="text-sm text-muted-foreground">Generate and take AI assessments for your completed courses</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          <TabsTrigger value="badges">My Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select a Course</CardTitle>
              <CardDescription>We detected your completed courses from Learning Hub</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Default Courses */}
              <div>
                <h3 className="text-sm font-medium mb-2">Available Courses</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {customCourses.map((c) => (
                    <Button
                      key={c.id}
                      variant={topic === c.title ? "default" : "outline"}
                      onClick={() => setTopic(c.title)}
                      size="sm"
                      className={c.completed ? "border-green-500" : ""}
                    >
                      {c.title} {c.completed && <Check className="ml-1 h-3 w-3" />}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Topic Input */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Or enter a custom topic</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. JavaScript Promises" 
                    value={!customCourses.some(c => c.title === topic) ? topic : ""}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={startAssessment} disabled={!topic} className="relative">
                  {loading ? (
                    <>
                      <span className="opacity-0">Generate Assessment</span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    </>
                  ) : (
                    <>Generate Assessment</>
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/learning">Go to Learning Hub</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {quiz && (
            <Card>
              <CardHeader>
                <CardTitle>Quiz: {topic}</CardTitle>
                <CardDescription>Answer all questions and submit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quiz.map((q, idx) => (
                  <div key={idx} className="space-y-3">
                    <p className="font-medium">
                      {idx + 1}. {q.question}
                    </p>
                    <RadioGroup
                      value={answers[idx] || ""}
                      onValueChange={(v) => setAnswers((prev) => ({ ...prev, [idx]: v }))}
                    >
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem id={`q${idx}-o${i}`} value={opt} />
                          <Label htmlFor={`q${idx}-o${i}`}>{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <Button onClick={submit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                  {result && (
                    <div className="text-sm">
                      Score: <span className="font-semibold">{result.score}%</span>{" "}
                      {result.passed ? "— Badge awarded!" : "— Try again to pass (70%+)."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Assessment History */}
          {assessmentHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
                <CardDescription>Your previous assessment results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessmentHistory.map((assessment, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{assessment.courseId ? 
                          customCourses.find(c => c.id === assessment.courseId)?.title || "Unknown Course" : 
                          assessment.topic || "Unknown Topic"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {assessment.timestamp ? formatDate(assessment.timestamp) : 
                           assessment.date ? formatDate(assessment.date) : "Unknown date"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={assessment.passed ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                          {assessment.score}%
                        </Badge>
                        <Badge variant="outline">
                          {assessment.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customCourses.map(course => (
              <Card key={course.id} className="relative overflow-hidden">
                {course.completed && (
                  <div className="absolute right-2 top-2">
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" /> Completed
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)} level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.skills.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-6 pt-0">
                  <Button 
                    className="w-full" 
                    disabled={!course.completed}
                    asChild
                  >
                    {course.completed ? (
                      <Link href={`/dashboard/assessment/${course.id}`}>
                        Take Assessment <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    ) : "Complete Course First"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Badges Tab */}
        <TabsContent value="badges">
          {userBadges.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Award className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">You haven&apos;t earned any badges yet</p>
                  <p className="text-sm text-gray-400 mt-2">Complete courses and pass assessments to earn badges</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userBadges.map((badge, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2"></div>
                  <CardHeader>
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-yellow-50 p-6 rounded-full mb-4">
                        <Award className="h-10 w-10 text-yellow-500" />
                      </div>
                      <CardTitle>{badge.title}</CardTitle>
                      <CardDescription>
                        Earned on {formatDate(badge.earnedAt || badge.date || Date.now())}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p>{badge.description || `${badge.topic || "Course"} assessment completed`}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
