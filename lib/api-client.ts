export type UploadResumeResponse = {
  message: string
  fileId: string
  url: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function uploadResume(file: File): Promise<UploadResumeResponse> {
  if (!file) throw new Error("No file")
  const form = new FormData()
  form.append("resume", file)
  const res = await fetch(`${API_BASE_URL}/api/upload`, { method: "POST", body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to upload resume")
  return json
}

// Magical APIs
export async function resumeReviewByUrl(url: string) {
  const res = await fetch(`${API_BASE_URL}/api/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to review resume")
  return json as {
    data: {
      request_id: string
      status: "completed" | "processing"
      review?: { summary: string; recommendations: string[] }
    }
  }
}

export async function resumeScoreByUrl(url: string, jobDescription: string) {
  const res = await fetch(`${API_BASE_URL}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, job_description: jobDescription }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to score resume")
  console.log("API Response in client:", json)
  // Support both direct completion formats and processing status formats
  return json as {
    data: {
      request_id?: string
      status?: "completed" | "processing"
      score?: number
      reason?: string
    }
  }
}

export async function resumeScoreByFile(file: File, jobDescription: string) {
  const form = new FormData()
  form.append("resume", file)
  form.append("job_description", jobDescription)
  const res = await fetch(`${API_BASE_URL}/api/score`, { method: "POST", body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to score resume")
  return json as {
    data: {
      request_id: string
      status: "completed" | "processing"
      score?: number
      reason?: string
    }
  }
}

export async function checkStatus(requestId: string) {
  const res = await fetch(`${API_BASE_URL}/api/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request_id: requestId }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to fetch status")
  console.log("Status API Response:", json)
  return json as {
    data: {
      request_id: string
      status: "completed" | "processing"
      score?: number
      reason?: string
    }
  }
}

// Job Listings APIs (JSearch)
export type JobItem = {
  job_highlights: Record<string, string[]> | undefined;
  employer_name: string
  employer_logo?: string
  job_title: string
  job_description: string
  job_city?: string
  job_state?: string
  job_country?: string
  job_is_remote?: boolean
  job_employment_type?: string
  job_apply_link?: string
  job_posted_at_datetime_utc?: string
  job_required_skills?: string[]
  job_min_salary?: number
  job_max_salary?: number
  job_salary_currency?: string
  job_id?: string // some providers include
}

export async function getJobs(params: Record<string, string | number | boolean | undefined> = {}) {
  const defaults = { query: "developer", location: "India", page: 1, num_pages: 1 }
  const sp = new URLSearchParams()
  const all = { ...defaults, ...params }
  Object.entries(all).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v))
  })
  const res = await fetch(`${API_BASE_URL}/api/jobs?${sp.toString()}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to fetch jobs")
  return json as { data: JobItem[] }
}

export async function advancedJobSearch(params: Record<string, string | number | boolean | undefined> = {}) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v))
  })
  const res = await fetch(`${API_BASE_URL}/api/jobs/search?${sp.toString()}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to search jobs")
  return json as { data: JobItem[] }
}

export async function getJobDetails(id: string) {
  try {
    // Ensure we're using the original job_id (prevent double-encoding issues)
    const jobId = id.includes('%') ? id : encodeURIComponent(id);
    
    console.log(`Fetching job details for ID: ${jobId}`);
    const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`)
    const json = await res.json()
    
    console.log(`Job details API response: status=${res.status}, hasData=${!!json?.data}, dataLength=${json?.data?.length || 0}`);
    
    if (!res.ok) {
      const errorDetails = {
        status: res.status,
        statusText: res.statusText,
        error: json?.error,
        message: json?.message,
        details: json?.details
      };
      console.error("Job details fetch error:", errorDetails);
      
      // Create a more descriptive error message
      let errorMsg = json?.error || "Failed to fetch job details";
      if (json?.message) {
        errorMsg += `: ${json.message}`;
      }
      
      throw new Error(errorMsg);
    }
    
    if (!json.data || json.data.length === 0) {
      console.error("No job data found in response:", json);
      throw new Error("No job details found for this ID. The job may no longer be available.");
    }
    
    // Process employer_logo URLs to ensure they're compatible with Next.js Image component
    if (json.data && json.data.length > 0) {
      json.data = json.data.map(job => {
        if (job.employer_logo) {
          // Convert potential data URLs to null (Next.js Image doesn't support data: URLs)
          if (job.employer_logo.startsWith('data:')) {
            console.log("Converting data URL to null for employer logo");
            job.employer_logo = null;
          }
          
          // Ensure HTTPS for image URLs
          if (job.employer_logo && job.employer_logo.startsWith('http:')) {
            job.employer_logo = job.employer_logo.replace('http:', 'https:');
          }
        }
        return job;
      });
    }
    
    return json as { data: JobItem[] }
  } catch (error) {
    console.error("Error in getJobDetails:", error);
    throw error;
  }
}

// AI Career (Gemini-backed) APIs
export async function analyzeResumeAI(pdfFile: File) {
  if (!pdfFile || pdfFile.type !== "application/pdf") throw new Error("Only PDF files are allowed")
  const form = new FormData()
  form.append("resume", pdfFile)
  const res = await fetch(`${API_BASE_URL}/api/career/analyze-resume`, { method: "POST", body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to analyze resume")
  return json as {
    score: number
    reason: string
    suggestions: string[]
  }
}

export async function generateRoadmap(payload: {
  score: number
  reason: string
  jobDescription: string
  resumeText: string
}) {
  const res = await fetch(`${API_BASE_URL}/api/career/generate-roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to generate roadmap")
  return json as {
    learningRoadmap: {
      skill: string
      reasoning: string
      resources: {
        books?: string[]
        youtube?: { title: string; creator?: string }[]
      }
    }[]
  }
}

// Resolve YouTube titles using our server route
export type VideoSearchResult = { id: string; title: string; channelTitle?: string; thumbnail?: string }
export async function searchVideosByTitle(title: string, limit = 6): Promise<VideoSearchResult[]> {
  const res = await fetch(`${API_BASE_URL}/api/videos/search?title=${encodeURIComponent(title)}&limit=${limit}`)
  if (!res.ok) return []
  const json = (await res.json()) as { data: VideoSearchResult[] }
  return json.data || []
}

export async function createAssessment(topic: string, level = "intermediate", questionCount = 5) {
  const res = await fetch(`${API_BASE_URL}/api/career/create-assessment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, level, questionCount }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to create assessment")
  return json as {
    assessment: { question: string; options: string[]; correctAnswer: string }[]
  }
}

export async function aiCareerChat(prompt: string) {
  const res = await fetch(`${API_BASE_URL}/api/chat/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || "Failed to get AI response")
  return json as { response: string }
}
