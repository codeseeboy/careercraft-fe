"use client"

import { getCurrentUserId } from "./auth"

export interface AdvancedResume {
  id: string
  title: string
  template: string
  data: any
  lastModified: number
  autoSaveEnabled: boolean
}

class AdvancedResumeStorage {
  private getKey(suffix: string): string {
    const uid = getCurrentUserId()
    return `resume:${uid || "anon"}:${suffix}`
  }

  // Auto-save functionality
  private autoSaveTimeouts: Map<string, NodeJS.Timeout> = new Map()

  enableAutoSave(resumeId: string, data: any, delay = 2000) {
    // Clear existing timeout
    const existingTimeout = this.autoSaveTimeouts.get(resumeId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      this.saveResume(resumeId, data)
    }, delay)

    this.autoSaveTimeouts.set(resumeId, timeout)
  }

  saveResume(resumeId: string, data: any): void {
    try {
      const resumes = this.loadAllResumes()
      const existingIndex = resumes.findIndex((r) => r.id === resumeId)

      const resumeData: AdvancedResume = {
        id: resumeId,
        title: data.personalInfo?.fullName ? `${data.personalInfo.fullName} Resume` : "Untitled Resume",
        template: data.template || "modern-professional",
        data,
        lastModified: Date.now(),
        autoSaveEnabled: true,
      }

      if (existingIndex !== -1) {
        resumes[existingIndex] = resumeData
      } else {
        resumes.push(resumeData)
      }

      localStorage.setItem(this.getKey("resumes"), JSON.stringify(resumes))
    } catch (error) {
      console.error("Failed to save resume:", error)
    }
  }

  loadAllResumes(): AdvancedResume[] {
    try {
      const data = localStorage.getItem(this.getKey("resumes"))
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  loadResume(resumeId: string): AdvancedResume | null {
    const resumes = this.loadAllResumes()
    return resumes.find((r) => r.id === resumeId) || null
  }

  deleteResume(resumeId: string): void {
    const resumes = this.loadAllResumes()
    const filtered = resumes.filter((r) => r.id !== resumeId)
    localStorage.setItem(this.getKey("resumes"), JSON.stringify(filtered))
  }
}

export const advancedStorage = new AdvancedResumeStorage()
