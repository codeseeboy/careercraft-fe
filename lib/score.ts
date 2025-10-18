const ACTION_VERBS = [
  "led",
  "built",
  "created",
  "designed",
  "implemented",
  "optimized",
  "reduced",
  "increased",
  "launched",
  "delivered",
  "migrated",
  "scaled",
  "drove",
  "owned",
  "improved",
  "automated",
]

const MUST_SECTIONS = ["summary", "experience", "education", "skills"]

export function analyzeResume(resume: {
  summary: string
  experience: string
  education: string
  skills: string
}) {
  const pros: string[] = []
  const cons: string[] = []
  const improvements: string[] = []
  let score = 0

  // Section completeness (70 points)
  const sections: Record<string, string> = {
    summary: resume.summary || "",
    experience: resume.experience || "",
    education: resume.education || "",
    skills: resume.skills || "",
  }
  MUST_SECTIONS.forEach((s) => {
    const v = (sections[s] || "").trim()
    if (v) {
      score += 70 / MUST_SECTIONS.length
      pros.push(`Has ${s} section`)
    } else {
      cons.push(`Missing ${s} section`)
      improvements.push(`Add a clear ${s} section with relevant details.`)
    }
  })

  // Action verbs (20 points)
  const text = [resume.summary, resume.experience].join(" ").toLowerCase()
  const verbHits = ACTION_VERBS.filter((v) => text.includes(v))
  const verbPoints = Math.min(verbHits.length * 4, 20)
  score += verbPoints
  if (verbHits.length >= 3) pros.push("Uses strong action verbs")
  else improvements.push("Incorporate action verbs (e.g., led, built, optimized)")

  // Quantification (10 points)
  const hasNumbers = /\b\d+(\.\d+)?%?/.test(resume.experience)
  if (hasNumbers) {
    score += 10
    pros.push("Includes quantifiable achievements")
  } else {
    cons.push("Lacks quantifiable achievements")
    improvements.push("Add metrics (e.g., 'Increased X by 15%')")
  }

  score = Math.min(100, Math.round(score))
  return { score, pros, cons, improvements }
}

// JD matching (keyword coverage + rough relevancy)
export function calcMatchScore(resumeText: string, jdText: string) {
  const r = normalize(resumeText)
  const j = normalize(jdText)
  const resumeSet = new Set(r.split(/\s+/).filter(Boolean))
  const jdTokens = j.split(/\s+/).filter(Boolean)

  const KEYWORDS = extractKeywords(jdTokens)
  let hits = 0
  const pros: string[] = []
  const missing: string[] = []

  KEYWORDS.forEach((kw) => {
    if (resumeSet.has(kw)) {
      hits++
      pros.push(`Contains keyword: ${kw}`)
    } else {
      missing.push(kw)
    }
  })

  const coverage = KEYWORDS.length ? hits / KEYWORDS.length : 0
  const lenFactor = Math.min(resumeText.length / (jdText.length || 1), 1.2)
  const score = Math.min(100, Math.round(60 * coverage + 40 * Math.min(lenFactor, 1)))

  const cons: string[] = []
  if (coverage < 0.6) cons.push("Low keyword coverage vs JD")
  if (lenFactor < 0.5) cons.push("Resume content seems brief vs JD")

  const suggestions: string[] = []
  if (missing.length) suggestions.push("Add missing skills and keywords highlighted below.")
  if (coverage < 0.6) suggestions.push("Tailor experience bullets to mirror JD phrasing.")
  if (!/\b\d+(\.\d+)?%?/.test(resumeText)) suggestions.push("Quantify achievements to strengthen impact.")

  return { score, pros, cons, missing, suggestions }
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ")
}

function extractKeywords(tokens: string[]) {
  const STOP = new Set([
    "the",
    "and",
    "of",
    "to",
    "a",
    "in",
    "for",
    "with",
    "on",
    "at",
    "by",
    "an",
    "is",
    "are",
    "as",
    "or",
    "be",
    "you",
    "we",
    "our",
  ])
  const freq: Record<string, number> = {}
  tokens.forEach((t) => {
    if (STOP.has(t) || t.length < 3) return
    freq[t] = (freq[t] || 0) + 1
  })
  return Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, 20)
}
