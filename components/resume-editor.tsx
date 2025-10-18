"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, Save, Download } from "lucide-react"
import type { TemplateData } from "@/app/dashboard/resume-builder/page"
import { EditorSidebar } from "./editor-sidebar"
import { ResumePreview } from "./resume-preview"
import { saveResume } from "@/lib/store"

interface ResumeEditorProps {
  template: TemplateData
  onBack: () => void
}

export type ResumeData = {
  personalInfo: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    website: string
    twitter: string
  }
  summary: string
  experience: Array<{
    id: string
    company: string
    position: string
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
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills: Array<{
    id: string
    category: string
    items: string[]
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    link?: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    link?: string
  }>
}

export function ResumeEditor({ template, onBack }: ResumeEditorProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      twitter: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  })

  const previewRef = useRef<HTMLDivElement>(null)

  const handleSave = () => {
    const id = saveResume({
      title: `${resumeData.personalInfo.fullName || "Untitled"} Resume`,
      name: resumeData.personalInfo.fullName,
      role: resumeData.personalInfo.jobTitle,
      summary: resumeData.summary,
      experience: resumeData.experience
        .map(
          (exp) =>
            `${exp.company} — ${exp.position} (${exp.startDate}–${exp.current ? "Present" : exp.endDate})\n${exp.description}`,
        )
        .join("\n\n"),
      education: resumeData.education
        .map(
          (edu) =>
            `${edu.institution} — ${edu.degree} in ${edu.field} (${edu.startDate}–${edu.endDate})${edu.gpa ? `\nGPA: ${edu.gpa}` : ""}`,
        )
        .join("\n\n"),
      skills: resumeData.skills.map((skill) => `${skill.category}: ${skill.items.join(", ")}`).join("\n"),
      template: template.id,
    })
    alert("Resume saved successfully!")
  }

  const handleDownload = () => {
    window.print()
  }

  const openPreviewInNewTab = () => {
    const previewWindow = window.open("", "_blank", "width=800,height=1000")
    if (previewWindow && previewRef.current) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume Preview</title>
            <style>
              body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
              .resume-container { max-width: 800px; margin: 0 auto; }
              .prose { line-height: 1.6; }
              .prose ul { margin: 0.5rem 0; padding-left: 1.5rem; }
              .prose li { margin: 0.25rem 0; }
            </style>
          </head>
          <body>
            <div class="resume-container">
              ${previewRef.current.innerHTML}
            </div>
          </body>
        </html>
      `)
      previewWindow.document.close()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 via-white to-yellow-50">
      {/* Header */}
      <div className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Templates
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Resume Builder</h1>
                <p className="text-sm text-muted-foreground">Using {template.name} template</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openPreviewInNewTab} className="gap-2 bg-transparent">
                <ExternalLink className="h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} className="gap-2 bg-transparent">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button size="sm" onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
          {/* Editor Sidebar */}
          <div className="bg-gradient-to-b from-purple-100 to-purple-50 rounded-xl p-6 overflow-y-auto shadow-lg">
            <EditorSidebar
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              resumeData={resumeData}
              onDataChange={setResumeData}
            />
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-xl p-6 overflow-y-auto shadow-lg">
            <Card className="h-full shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  Live Preview
                  <span className="text-sm font-normal text-muted-foreground">Click any text to edit</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={previewRef} className="bg-white rounded-lg shadow-inner overflow-hidden">
                  <ResumePreview template={template} data={resumeData} onDataChange={setResumeData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
