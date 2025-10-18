"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Save,
  Download,
  ExternalLink,
  Settings,
  Eye,
  Palette,
  Type,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"
import type { TemplateData } from "@/app/dashboard/resume-builder/page"
import type { ResumeData } from "./resume-editor"
import { ModernProfessionalTemplate } from "./templates/modern-professional"
import { CreativeModernTemplate } from "./templates/creative-modern"
import { MinimalATSTemplate } from "./templates/minimal-ats"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { SummaryStep } from "./steps/summary-step"
import { ExperienceStep } from "./steps/experience-step"
import { EducationStep } from "./steps/education-step"
import { SkillsStep } from "./steps/skills-step"
import { ProjectsStep } from "./steps/projects-step"
import { saveResume } from "@/lib/store"

interface ProfessionalEditorProps {
  template: TemplateData
  onBack: () => void
}

const steps = [
  { id: "personal", label: "Personal Info" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
]

export function ProfessionalEditor({ template, onBack }: ProfessionalEditorProps) {
  const [currentStep, setCurrentStep] = useState("personal")
  const [leftPanelWidth, setLeftPanelWidth] = useState(400)
  const [rightPanelWidth, setRightPanelWidth] = useState(800)
  const [isResizing, setIsResizing] = useState<"left" | "right" | null>(null)
  const [zoom, setZoom] = useState(0.7)
  const [isEditMode, setIsEditMode] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

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

  const handleMouseDown = useCallback(
    (side: "left" | "right") => (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(side)
    },
    [],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - containerRect.left

      if (isResizing === "left") {
        const newWidth = Math.max(300, Math.min(600, mouseX))
        setLeftPanelWidth(newWidth)
      } else if (isResizing === "right") {
        const newWidth = Math.max(600, Math.min(1200, containerRect.width - mouseX))
        setRightPanelWidth(newWidth)
      }
    },
    [isResizing],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(null)
  }, [])

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

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
    const previewWindow = window.open("", "_blank", "width=1000,height=1200")
    if (previewWindow && previewRef.current) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume Preview - ${resumeData.personalInfo.fullName || "Resume"}</title>
            <meta charset="utf-8">
            <style>
              * { box-sizing: border-box; }
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: system-ui, -apple-system, sans-serif;
                background: #f5f5f5;
              }
              .resume-container { 
                max-width: 210mm; 
                margin: 0 auto; 
                background: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .prose { line-height: 1.6; }
              .prose ul { margin: 0.5rem 0; padding-left: 1.5rem; }
              .prose li { margin: 0.25rem 0; }
              @media print {
                body { background: white; padding: 0; }
                .resume-container { box-shadow: none; max-width: none; }
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              ${previewRef.current.innerHTML}
            </div>
            <script>
              // Auto-print functionality
              window.onload = function() {
                setTimeout(() => window.print(), 1000);
              }
            </script>
          </body>
        </html>
      `)
      previewWindow.document.close()
    }
  }

  const renderTemplate = () => {
    switch (template.id) {
      case "modern-professional":
        return <ModernProfessionalTemplate data={resumeData} />
      case "creative-modern":
        return <CreativeModernTemplate data={resumeData} />
      case "minimal-ats":
        return <MinimalATSTemplate data={resumeData} />
      default:
        return <ModernProfessionalTemplate data={resumeData} />
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "personal":
        return <PersonalInfoStep data={resumeData} onChange={setResumeData} />
      case "summary":
        return <SummaryStep data={resumeData} onChange={setResumeData} />
      case "experience":
        return <ExperienceStep data={resumeData} onChange={setResumeData} />
      case "education":
        return <EducationStep data={resumeData} onChange={setResumeData} />
      case "skills":
        return <SkillsStep data={resumeData} onChange={setResumeData} />
      case "projects":
        return <ProjectsStep data={resumeData} onChange={setResumeData} />
      default:
        return <PersonalInfoStep data={resumeData} onChange={setResumeData} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b shadow-sm z-20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Templates
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold text-lg">Resume Builder</h1>
              <p className="text-sm text-gray-600">{template.name} Template</p>
            </div>
          </div>

          {/* Step Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Section:</span>
            <Select value={currentStep} onValueChange={setCurrentStep}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {steps.map((step) => (
                  <SelectItem key={step.id} value={step.id}>
                    {step.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={!isEditMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsEditMode(false)}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant={isEditMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsEditMode(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Design
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
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

        {/* Design Toolbar (shown when in design mode) */}
        {isEditMode && (
          <div className="border-t bg-gray-50 px-6 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Zoom:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
                  disabled={zoom <= 0.3}
                >
                  -
                </Button>
                <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                  disabled={zoom >= 1.5}
                >
                  +
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" title="Bold">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Italic">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Underline">
                  <Underline className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" title="Align Left">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Align Center">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Align Right">
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="ghost" size="sm" title="Colors">
                <Palette className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Typography">
                <Type className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Layout">
                <Layout className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        {!isEditMode && (
          <>
            <div className="bg-white border-r shadow-sm overflow-y-auto" style={{ width: leftPanelWidth }}>
              <div className="p-6">{renderStepContent()}</div>
            </div>

            {/* Left Resize Handle */}
            <div
              className="w-1 bg-gray-200 hover:bg-blue-400 cursor-ew-resize relative group"
              onMouseDown={handleMouseDown("left")}
            >
              <div className="absolute inset-y-0 -left-1 -right-1" />
              <div className="absolute top-1/2 left-0 w-1 h-12 bg-gray-400 group-hover:bg-blue-500 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </>
        )}

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="flex justify-center">
              <div
                ref={previewRef}
                className="transition-transform origin-top"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                }}
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
