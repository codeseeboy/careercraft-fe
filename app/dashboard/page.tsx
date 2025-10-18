"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Define interfaces for our component types
interface AssessmentBadge {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  earnedAt: number;
  courseId: string;
}

interface UserActivity {
  type: 'resume' | 'badge' | 'login' | 'job';
  date: string;
  description: string;
}
import { 
  FileText, 
  SearchCheck, 
  GraduationCap, 
  Award, 
  User,
  Bookmark,
  Send,
  CalendarDays,
  Trophy
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { loadProfile, loadResumes, loadSkills, loadJobs } from "@/lib/store"

export default function DashboardPage() {
  const resumes = loadResumes()
  const skills = loadSkills()
  const jobs = loadJobs()
  const profile = loadProfile()
  
  // Initialize state for course assessment badges
  const [assessmentBadges, setAssessmentBadges] = useState<AssessmentBadge[]>([])
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  
  // Load assessment badges from localStorage on component mount
  useEffect(() => {
    // Get badges from localStorage (both from skills system and our assessment system)
    try {
      // Get badges from our assessment system
      const storedBadges = localStorage.getItem('userProgress') 
        ? JSON.parse(localStorage.getItem('userProgress') || '{"badges":[]}').badges
        : [];
      
      // Load activity history
      const now = new Date();
      const activities: UserActivity[] = [
        { 
          type: 'login', 
          date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          description: 'Last login'
        },
        { 
          type: 'resume', 
          date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
          description: 'Updated resume'
        }
      ];
      
      // Add resume saves to activities
      if (resumes.length > 0) {
        activities.push({
          type: 'resume',
          date: new Date().toISOString(),
          description: `Saved ${resumes.length} resume(s)`
        });
      }
      
      // Add badge earns to activities
      storedBadges.forEach((badge: AssessmentBadge) => {
        activities.push({
          type: 'badge',
          date: new Date(badge.earnedAt).toISOString(),
          description: `Earned badge: ${badge.title}`
        });
      });
      
      setAssessmentBadges(storedBadges);
      // Sort activities by date (newest first)
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setUserActivities(activities);
    } catch (error) {
      console.error("Error loading badges:", error);
    }
  }, [resumes.length]);

  const [profileStrength, setProfileStrength] = useState(40)
  useEffect(() => {
    let score = 40
    if (resumes.length > 0) score += 20
    if ((skills.badges.length + assessmentBadges.length) > 0) score += 20
    if (profile?.name && profile?.title) score += 20
    setProfileStrength(Math.min(score, 100))
  }, [resumes.length, skills.badges.length, assessmentBadges.length, profile?.name, profile?.title])

  const columns = useMemo(() => {
    const all = jobs
    return {
      saved: all.filter((j) => j.status === "Saved"),
      applied: all.filter((j) => j.status === "Applied"),
      interviewing: all.filter((j) => j.status === "Interviewing"),
      rejected: all.filter((j) => j.status === "Rejected"),
    }
  }, [jobs])

  return (
    <main className="container py-6 space-y-6 px-4 sm:px-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Create New Resume</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Build ATS‑friendly resume</p>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/resume-builder">
                <FileText className="h-4 w-4" />
                Open
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Analyze a Job Description</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Match resume to JD</p>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/jd-matcher">
                <SearchCheck className="h-4 w-4" />
                Open
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Find Jobs for Me</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Proactive job discovery</p>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/jobs">
                <GraduationCap className="h-4 w-4" />
                Open
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Profile Strength</CardTitle>
            <div className={`h-2 w-2 rounded-full ${profileStrength < 70 ? 'bg-yellow-500' : 'bg-green-500'}`} />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{profileStrength}%</span>
              <span className="text-sm text-muted-foreground">Complete</span>
            </div>
            <Progress value={profileStrength} className={profileStrength < 70 ? 'text-yellow-500' : 'text-green-500'} />
            <p className="text-xs text-muted-foreground">
              Improve by adding certified skills and completing your resume.
            </p>
          </CardContent>
        </Card>
        
        {/* Activity Feed */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[200px] overflow-y-auto">
            {userActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity to display.</p>
            ) : (
              <div className="space-y-3">
                {userActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm border-b border-gray-100 pb-2">
                    {activity.type === 'resume' && <FileText className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'badge' && <Award className="h-4 w-4 text-yellow-500" />}
                    {activity.type === 'login' && <User className="h-4 w-4 text-gray-500" />}
                    <div className="flex-1">
                      <p>{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">My Skills & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {skills.badges.length === 0 && assessmentBadges.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No certified skills yet. Take an assessment to earn a badge.
              </p>
            ) : (
              <>
                {skills.badges.map((b) => (
                  <Badge key={b.id} variant="secondary">
                    {b.name}
                  </Badge>
                ))}
                
                {assessmentBadges.map((b) => (
                  <Badge key={b.id} variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                    {b.title}
                  </Badge>
                ))}
                
                {skills.badges.length + assessmentBadges.length > 0 && (
                  <Link href="/dashboard/badges" className="text-xs text-blue-600 hover:underline ml-2 flex items-center">
                    View all badges →
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">My Resumes</h2>
        {resumes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No resumes yet. Create one in the builder.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {resumes.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{r.title || "Untitled Resume"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="aspect-[4/3] rounded-md bg-muted" aria-hidden />
                  <div className="text-xs text-muted-foreground">Score: {Math.round(r.score || 0)}/100</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Job Applications</h2>
          <Link href="/dashboard/jobs" className="text-xs text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-50"></div>
            <CardHeader className="pb-1 relative">
              <CardTitle className="text-sm">Bookmarked</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold relative flex items-center">
              {columns.saved.length}
              <div className="ml-auto bg-blue-100 rounded-full p-2">
                <Bookmark className="h-4 w-4 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 opacity-50"></div>
            <CardHeader className="pb-1 relative">
              <CardTitle className="text-sm">Applied</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold relative flex items-center">
              {columns.applied.length}
              <div className="ml-auto bg-purple-100 rounded-full p-2">
                <Send className="h-4 w-4 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-50"></div>
            <CardHeader className="pb-1 relative">
              <CardTitle className="text-sm">Interviewing</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold relative flex items-center">
              {columns.interviewing.length}
              <div className="ml-auto bg-green-100 rounded-full p-2">
                <CalendarDays className="h-4 w-4 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 opacity-50"></div>
            <CardHeader className="pb-1 relative">
              <CardTitle className="text-sm">Offers</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold relative flex items-center">
              {columns.rejected.length}
              <div className="ml-auto bg-orange-100 rounded-full p-2">
                <Trophy className="h-4 w-4 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
