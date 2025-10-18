"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getJobDetails, resumeScoreByUrl } from "@/lib/api-client"
import { normalizeScore, getScoreVerdict, getVerdictClasses } from "@/lib/score-utils"
import Link from "next/link"
import Image from "next/image"

type JobDetail = {
  employer_name: string
  employer_logo?: string
  job_title: string
  job_description: string
  job_highlights?: Record<string, string[]>
  job_apply_link?: string
  job_required_skills?: string[]
  job_posted_at_datetime_utc?: string
}

export default function JobDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  // Define the type for our resume-job match result
  const [fit, setFit] = useState<{
    verdict: "Good match" | "Partial match" | "Not recommended"
    score: number
    reason?: string
  } | null>(null)
  const [checking, setChecking] = useState(false)

  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        
        const res = await getJobDetails(id)
        const d = res.data?.[0]
        
        if (d) {
          setJob({
            employer_name: d.employer_name,
            employer_logo: d.employer_logo,
            job_title: d.job_title,
            job_description: d.job_description,
            job_highlights: d.job_highlights,
            job_apply_link: d.job_apply_link,
            job_required_skills: d.job_required_skills,
            job_posted_at_datetime_utc: d.job_posted_at_datetime_utc,
          })
        } else {
          setError("No job details found for this ID")
        }
      } catch (e) {
        console.error("Failed to fetch job details:", e)
        setError(e instanceof Error ? e.message : "Failed to fetch job details")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function checkFitForThisJob() {
    const resumeUrl = localStorage.getItem("uploaded-resume-url")
    if (!resumeUrl) {
      alert("Please upload a PDF resume on the Jobs page first.")
      return
    }
    if (!job?.job_description) {
      alert("Job description is missing.")
      return
    }
    try {
      setChecking(true)
      const res = await resumeScoreByUrl(resumeUrl, job.job_description)
      console.log("Resume score API response:", res)
      
      // Get the raw score from the response and normalize it
      const normalizedScore = normalizeScore(res.data.score)
      
      // Get the verdict based on the normalized score
      const verdict = getScoreVerdict(normalizedScore)
      
      // Set fit state with the processed data
      setFit({ 
        verdict, 
        score: normalizedScore, 
        reason: res.data.reason || "No specific feedback provided."
      })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Failed to evaluate fit."
      alert(errorMessage)
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-12 text-center">Loading job details...</CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Job Details</h2>
            <p className="mb-4">{error}</p>
            <p className="text-sm text-muted-foreground mb-4">
              This may occur if the job listing has expired or was removed by the employer, 
              or if there was a temporary issue with the job search API.
            </p>
            <div className="flex flex-col gap-2 items-center">
              <Button asChild>
                <Link href="/dashboard/jobs">Back to Job Search</Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (!job) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Job not found.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/jobs">Back to Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="container max-w-5xl mx-auto py-6 px-4 space-y-6">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
            <div>
              <Link 
                href="/dashboard/jobs" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to Jobs
              </Link>
              <h1 className="text-2xl font-bold text-primary">{job.job_title}</h1>
              <div className="flex items-center mt-2">
                {job.employer_logo ? (
                  <div className="w-8 h-8 mr-2 relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Image 
                      src={job.employer_logo} 
                      alt={job.employer_name} 
                      width={32}
                      height={32}
                      className="object-contain"
                      onError={(e) => {
                        console.log("Image failed to load:", job.employer_logo);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 mr-2 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <span className="font-bold text-xs">{job.employer_name?.[0]?.toUpperCase()}</span>
                  </div>
                )}
                <p className="text-sm font-medium">{job.employer_name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {job.job_apply_link && (
                <Button size="lg" asChild className="shadow-sm">
                  <a href={job.job_apply_link} target="_blank" rel="noreferrer">
                    Apply Now
                  </a>
                </Button>
              )}
              <Button variant="outline" size="lg" className="shadow-sm" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              {job.job_posted_at_datetime_utc && (
                <CardDescription>
                  Posted: {new Date(job.job_posted_at_datetime_utc).toLocaleString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{job.job_description}</p>
              </div>
            </CardContent>
          </Card>

          {job.job_highlights && Object.keys(job.job_highlights).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Job Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(job.job_highlights).map(([k, arr]) => (
                    <div key={k} className="border-b last:border-0 pb-4 last:pb-0">
                      <p className="font-medium mb-2 capitalize">{k}</p>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {arr.map((it, idx) => (
                          <li key={idx}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.job_required_skills && job.job_required_skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.job_required_skills.map((sk) => (
                      <Badge key={sk} variant="secondary" className="text-xs">
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <CardTitle className="text-base mb-3">Resume Match</CardTitle>
                <Button 
                  className="w-full mb-3" 
                  onClick={checkFitForThisJob} 
                  disabled={checking}
                >
                  {checking ? "Checking..." : "Check Job Match"}
                </Button>
                
                {fit && (
                  <>
                  {/* Use our utility to get the appropriate styling classes */}
                  {(() => {
                    const classes = getVerdictClasses(fit.verdict);
                    return (
                      <div className={`rounded-md border p-4 space-y-2 ${classes.container}`}>
                        <div className="text-sm text-muted-foreground">Resume Match</div>
                        <div className={`text-xl font-bold ${classes.text}`}>{fit.verdict}</div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${classes.progress}`} 
                              style={{ width: `${fit.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{fit.score}/100</span>
                        </div>
                        {fit.reason && (
                          <div className="mt-2 text-sm border-t pt-2 border-gray-100">
                            <p className="font-medium mb-1">Feedback:</p>
                            <p className="text-muted-foreground">{fit.reason}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
