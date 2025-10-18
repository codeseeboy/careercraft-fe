export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    website?: string
  }
  summary: string
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    location: string
    graduationDate: string
    gpa?: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
    certifications: string[]
  }
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url?: string
    startDate: string
    endDate: string
  }>
}

/**
 - Convert the structured editor state into clean, ATS-friendly plain text.
 - Keep headings standard so the pre-parser and LLM can understand it well.
*/
export function serializeResumeToText(data: ResumeData): string {
  const lines: string[] = []

  const pi = data.personalInfo
  const links = [pi.linkedin, pi.github, pi.website].filter(Boolean).join(" • ")

  lines.push(`${pi.fullName || ""}`)
  lines.push([pi.email, pi.phone, pi.location].filter(Boolean).join(" • "))
  if (links) lines.push(links)
  lines.push("")
  lines.push("SUMMARY")
  lines.push((data.summary || "").trim())
  lines.push("")
  lines.push("EXPERIENCE")
  for (const exp of data.experience) {
    const dates = [exp.startDate || "", exp.current ? "Present" : exp.endDate || ""].filter(Boolean).join(" – ")
    lines.push(`${exp.position || ""} — ${exp.company || ""} (${dates}) ${exp.location ? "— " + exp.location : ""}`)
    for (const bullet of exp.description.split("\n").filter(Boolean)) {
      lines.push(`• ${bullet.trim()}`)
    }
  }
  lines.push("")
  lines.push("EDUCATION")
  for (const edu of data.education) {
    const line = `${edu.degree || ""} ${edu.field ? "in " + edu.field : ""} — ${edu.institution || ""} (${edu.graduationDate || ""}) ${edu.location ? "— " + edu.location : ""}`
    lines.push(line.trim())
    if (edu.gpa) lines.push(`• GPA: ${edu.gpa}`)
  }
  lines.push("")
  lines.push("SKILLS")
  const skillsBlocks = [
    ["Technical", data.skills.technical],
    ["Soft", data.skills.soft],
    ["Languages", data.skills.languages],
    ["Certifications", data.skills.certifications],
  ]
  for (const [label, arr] of skillsBlocks) {
    if ((arr as string[]).length) lines.push(`${label}: ${(arr as string[]).join(", ")}`)
  }
  lines.push("")
  if (data.projects?.length) {
    lines.push("PROJECTS")
    for (const p of data.projects) {
      const dates = [p.startDate || "", p.endDate || ""].filter(Boolean).join(" – ")
      const tech = p.technologies?.length ? ` [${p.technologies.join(", ")}]` : ""
      const url = p.url ? ` — ${p.url}` : ""
      lines.push(`${p.name || ""}${tech}${url} (${dates})`)
      for (const bullet of p.description.split("\n").filter(Boolean)) {
        lines.push(`• ${bullet.trim()}`)
      }
    }
  }

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
