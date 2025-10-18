"use client"

import type React from "react"
import { useCallback, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { uploadResume, resumeScoreByUrl, checkStatus } from "@/lib/api-client"
import { Copy, ExternalLink, Loader2 } from "lucide-react"

type MatchResult = {
  score: number // 0-10 scale preferred
  reason?: string
  requestId?: string
}

function getScoreLevel(score: number | null) {
  if (score == null || Number.isNaN(score)) {
    return { label: "No score", color: "text-muted-foreground", bg: "bg-muted", emoji: "–" }
  }
  if (score >= 8) return { label: "Great match", color: "text-green-700", bg: "bg-green-100", emoji: "🚀" }
  if (score >= 6.5) return { label: "Good match", color: "text-emerald-700", bg: "bg-emerald-100", emoji: "✅" }
  if (score >= 5) return { label: "Partial match", color: "text-amber-700", bg: "bg-amber-100", emoji: "🟡" }
  if (score >= 3.5) return { label: "Needs improvement", color: "text-orange-700", bg: "bg-orange-100", emoji: "😕" }
  return { label: "Not recommended", color: "text-red-700", bg: "bg-red-100", emoji: "❌" }
}

function normalizeToTen(score: unknown): number {
  // Backend might return 0-10 or 0-100. Keep under-10, as requested.
  if (typeof score !== "number") return 0
  if (score <= 10) return Math.round(score * 10) / 10 // keep one decimal
  // Convert 0-100 to 0-10 with one decimal
  return Math.round((score / 10) * 10) / 10
}

export default function JDMatcherPage() {
  // Upload
  const [resumeUrl, setResumeUrl] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)

  // JD
  const [jobUrl, setJobUrl] = useState("")
  const [jd, setJd] = useState("")
  const [matching, setMatching] = useState(false)

  // Result
  const [result, setResult] = useState<MatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const level = useMemo(() => getScoreLevel(result?.score ?? null), [result])

  const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const uploaded = await uploadResume(file)
      setResumeUrl(uploaded.url)
      // Persist for later reuse in Jobs/other modules if needed
      localStorage.setItem("uploaded-resume-url", uploaded.url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload resume";
      setError(errorMessage);
    } finally {
      setUploading(false)
    }
  }, [])

  const copyUrl = useCallback(async () => {
    if (!resumeUrl) return
    try {
      await navigator.clipboard.writeText(resumeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }, [resumeUrl])

  async function pollStatusOnce(requestId: string): Promise<MatchResult | null> {
    try {
      const fin = await checkStatus(requestId)
      
      // Handle direct response with score
      if (fin?.data?.score !== undefined) {
        return {
          score: normalizeToTen(fin.data.score),
          reason: fin?.data?.reason || "",
          requestId,
        }
      }
      
      // Handle status-based response
      if (fin?.data?.status === "completed") {
        return {
          score: normalizeToTen(fin.data.score),
          reason: fin?.data?.reason || "",
          requestId,
        }
      }
    } catch {
      // ignore one-off errors
    }
    return null
  }

  async function matchMyResume() {
    setError(null)
    setResult(null)
    if (!resumeUrl) {
      setError("Please upload a resume first to get a public URL.")
      return
    }
    if (!jd.trim()) {
      setError("Please paste the Job Description.")
      return
    }
    try {
      setMatching(true)
      // Show a loading animation for 3 seconds before making the API call
      // This gives a better UX by showing the user that something is happening
      await new Promise((r) => setTimeout(r, 1000))
      
      // Call the API to score the resume against the job description
      const s = await resumeScoreByUrl(resumeUrl, jd)
      
      console.log("API Response:", s)

      // Direct response with score in data.data.score format
      if (s?.data?.score !== undefined) {
        // Handle direct completion response
        setResult({
          score: normalizeToTen(s.data.score),
          reason: s?.data?.reason || "",
          requestId: s?.data?.request_id,
        })
        return
      }
      
      // If the status is "processing", poll the status API to get the final result
      if (s?.data?.status === "processing" && s?.data?.request_id) {
        const reqId = s.data.request_id
        // Poll up to 10 attempts, 3s apart (30 seconds total)
        const maxAttempts = 10
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((r) => setTimeout(r, 3000))
          const res = await pollStatusOnce(reqId)
          if (res) {
            setResult(res)
            return
          }
        }
        setError("Still processing. Please try again in a moment.")
      } else if (s?.data?.status === "completed") {
        // If the status is "completed", show the result immediately
        setResult({
          score: normalizeToTen(s.data.score),
          reason: s?.data?.reason || "",
          requestId: s?.data?.request_id,
        })
      } else {
        setError("Failed to get a valid score response.")
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Failed to match resume against JD";
      setError(errorMessage);
    } finally {
      setMatching(false)
    }
  }

  const reasonBullets = useMemo(() => {
    if (!result?.reason) return []
    return result.reason
      .split(/\n|\. /)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6)
  }, [result])

  return (
    <main className="container py-6 grid gap-6 lg:grid-cols-[1fr_420px]">
      {/* LEFT COLUMN */}
      <section className="space-y-4">
        {/* 1) Upload Resume - Topmost */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="resume-file">Resume file (.pdf, .doc, .docx)</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="resume-file"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={onUpload}
                  disabled={uploading}
                />
                <Button type="button" variant="outline" disabled>
                  {uploading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
              {resumeUrl && (
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground mb-2">Public Resume URL</div>
                  <div className="flex items-center gap-2">
                    <Input readOnly value={resumeUrl} className="text-xs" />
                    <Button type="button" variant="outline" size="icon" onClick={copyUrl} aria-label="Copy URL">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button asChild variant="outline" size="icon" aria-label="Open URL">
                      <a href={resumeUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  {copied && <p className="text-xs text-emerald-600 mt-2">Copied!</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2) Job Description Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="job-url">Job URL (used for Apply button)</Label>
              <Input
                id="job-url"
                placeholder="https://company.com/careers/job"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jd">Paste JD Text</Label>
              <Textarea
                id="jd"
                rows={10}
                placeholder={"Paste the full Job Description here."}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={matchMyResume} disabled={matching || !resumeUrl || !jd.trim()} className="min-w-[150px]">
                {matching ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </span>
                ) : (
                  "Match My Resume"
                )}
              </Button>
            </div>

            {matching && (
              <div className="mt-4 p-4 border rounded-md bg-blue-50">
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="animate-pulse bg-blue-200 h-12 w-12 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Analyzing your resume against the job description</p>
                    <p className="text-sm text-blue-600">This may take up to 30 seconds...</p>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
        </Card>
      </section>

      {/* RIGHT COLUMN */}
      <section className="space-y-4">
        <Card className="h-fit sticky top-20">
          <CardHeader>
            <CardTitle>Result Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Score block (0-10) with color + reaction */}
            <div className={`rounded-md p-4 ${level.bg}`}>
              <div className="flex items-baseline justify-between">
                <div className={`text-5xl font-bold tabular-nums ${level.color}`}>
                  {result ? result.score.toFixed(1) : "--"}
                  {result && <span className="text-base font-medium text-muted-foreground">/10</span>}
                </div>
                <div className="text-2xl" aria-hidden="true">
                  {level.emoji}
                </div>
              </div>
              <div className={`mt-1 text-sm font-medium ${level.color}`}>{level.label}</div>
              {!result && (
                <p className="text-xs text-muted-foreground mt-2">Run “Match My Resume” to see your score.</p>
              )}
            </div>

            {/* Reason / Insights */}
            {result?.reason && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Why this score</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {reasonBullets.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply */}
            {jobUrl && (
              <Button asChild className="w-full">
                <a href={jobUrl} target="_blank" rel="noreferrer">
                  Apply Now
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
