"use client"

import { getCurrentUserId } from "./auth"

type Resume = {
  id?: string
  title: string
  name?: string
  role?: string
  summary: string
  experience: string
  education: string
  skills: string
  contact?: {
    email?: string
    phone?: string
    location?: string
    links?: { label: string; url: string }[]
  }
  template?: string
  score?: number
  pros?: string[]
  cons?: string[]
  improvements?: string[]
}

type Badge = { id: string; name: string; issuedAt: number; credentialId: string }

type Job = {
  id: string
  title: string
  company: string
  location: string
  match: number
  status: "Saved" | "Applied" | "Interviewing" | "Rejected"
  url: string
  postedAt?: string
  source?: string
}

type Profile = {
  name?: string
  title?: string
  education?: string
  college?: string
  cgpa?: string
  achievements?: string
  skills?: string
  profileCompletion?: number
}

function key(k: string) {
  const uid = getCurrentUserId()
  return `ccai:${uid || "anon"}:${k}`
}

export function loadResumes(): (Resume & { id: string })[] {
  try {
    const s = localStorage.getItem(key("resumes"))
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}

export function saveResume(r: Resume) {
  const current = loadResumes()
  const id = r.id || `res-${Date.now()}`
  const next = [{ ...r, id }, ...current.filter((x) => x.id !== id)]
  localStorage.setItem(key("resumes"), JSON.stringify(next))
  return id
}

export function duplicateResume(id: string) {
  const current = loadResumes()
  const src = current.find((r) => r.id === id)
  if (!src) return ""
  const cloneId = `res-${Date.now()}-copy`
  const next = [{ ...src, id: cloneId, title: `${src.title || "Resume"} (Copy)` }, ...current]
  localStorage.setItem(key("resumes"), JSON.stringify(next))
  return cloneId
}

export function loadJobs(): Job[] {
  try {
    const s = localStorage.getItem(key("jobs"))
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}

export function saveJob(j: Job) {
  const current = loadJobs()
  const exists = current.find((x) => x.id === j.id)
  const next = exists ? current.map((x) => (x.id === j.id ? j : x)) : [j, ...current]
  localStorage.setItem(key("jobs"), JSON.stringify(next))
}

export function loadSkills(): { badges: Badge[] } {
  try {
    const s = localStorage.getItem(key("skills"))
    return s ? JSON.parse(s) : { badges: [] }
  } catch {
    return { badges: [] }
  }
}

export function addBadge(b: Badge) {
  const current = loadSkills()
  const next = { badges: [b, ...current.badges.filter((x) => x.id !== b.id)] }
  localStorage.setItem(key("skills"), JSON.stringify(next))
}

export function loadProfile(): Profile | null {
  try {
    const s = localStorage.getItem(key("profile"))
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(key("profile"), JSON.stringify(p))
}

export function saveRoadmap(steps: { id: string; title: string; done: boolean }[]) {
  localStorage.setItem(key("roadmap"), JSON.stringify(steps))
}

export function loadRoadmap(): { id: string; title: string; done: boolean }[] | null {
  try {
    const s = localStorage.getItem(key("roadmap"))
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}
