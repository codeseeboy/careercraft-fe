"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Download, ExternalLink, ZoomIn, ZoomOut, Lock, Unlock, Eye, EyeOff, Move } from "lucide-react"
import type { TemplateData } from "@/app/dashboard/resume-builder/page"
import type { ResumeData } from "./resume-editor"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { SummaryStep } from "./steps/summary-step"
import { ExperienceStep } from "./steps/experience-step"
import { EducationStep } from "./steps/education-step"
import { SkillsStep } from "./steps/skills-step"
import { ProjectsStep } from "./steps/projects-step"
import { EditableModernProfessionalTemplate } from "./templates/editable-modern-professional"
import { EditableCreativeModernTemplate } from "./templates/editable-creative-modern"
import { EditableMinimalATSTemplate } from "./templates/editable-minimal-ats"
import { saveResume } from "@/lib/store"
import { advancedStorage } from "@/lib/advanced-storage"

interface AdvancedEditorProps {
  template: TemplateData
  onBack: () => void
}

interface TemplateElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  locked: boolean
  visible: boolean
  opacity: number
  styles: Record<string, any>
}

const steps = [
  { id: "personal", label: "Personal Info" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
]

// Canvas constraints
const CANVAS_WIDTH = 794 // A4 width in pixels at 96 DPI
const CANVAS_HEIGHT = 1123 // A4 height in pixels at 96 DPI

export function AdvancedEditor({ template, onBack }: AdvancedEditorProps) {
  const [currentStep, setCurrentStep] = useState("personal")
  const [zoom, setZoom] = useState(0.7)
  const [isDesignMode, setIsDesignMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [templateElements, setTemplateElements] = useState<Record<string, TemplateElement>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 })
  const [currentEditingField, setCurrentEditingField] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(10)
  const [resumeId] = useState(`resume_${Date.now()}`)

  const canvasRef = useRef<HTMLDivElement>(null)
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

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (resumeData.personalInfo.fullName || resumeData.summary) {
        advancedStorage.saveResume(resumeId, {
          ...resumeData,
          template: template.id,
          elements: templateElements,
        })
      }
    }, 5000) // Auto-save every 5 seconds

    return () => clearInterval(autoSaveInterval)
  }, [resumeData, templateElements, resumeId, template.id])

  // Handle zoom with Ctrl + Mouse Wheel only in design mode
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey && isDesignMode) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setZoom((prev) => Math.max(0.3, Math.min(2, prev + delta)))
      }
    }

    if (canvasRef.current) {
      canvasRef.current.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("wheel", handleWheel)
      }
    }
  }, [isDesignMode])

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

  const handleDownload = async () => {
    try {
      // Import the PDF generation library dynamically
      const { jsPDF } = await import("jspdf")
      const html2canvas = await import("html2canvas")

      if (!previewRef.current) return

      // Show loading notification
      const notification = document.createElement("div")
      notification.className = "fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
      notification.textContent = "Generating PDF..."
      document.body.appendChild(notification)

      // Create high-quality canvas from the resume
      const canvas = await html2canvas.default(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      })

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add metadata
      pdf.setProperties({
        title: `${resumeData.personalInfo.fullName || "Resume"}`,
        subject: "Professional Resume",
        author: resumeData.personalInfo.fullName || "User",
        creator: "Resume Builder",
      })

      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL("image/png", 1.0)
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297)

      // Download the PDF
      const filename = `${resumeData.personalInfo.fullName || "Resume"}_${new Date().toISOString().slice(0, 10)}.pdf`
      pdf.save(filename)

      // Update notification
      notification.textContent = "PDF downloaded successfully!"
      notification.className = "fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"

      setTimeout(() => {
        document.body.removeChild(notification)
      }, 3000)
    } catch (error) {
      console.error("PDF generation failed:", error)

      // Fallback to browser print
      window.print()

      const notification = document.createElement("div")
      notification.className = "fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg"
      notification.textContent = "Using browser print as fallback"
      document.body.appendChild(notification)

      setTimeout(() => {
        document.body.removeChild(notification)
      }, 3000)
    }
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
              @media print {
                body { background: white; padding: 0; }
                .resume-container { box-shadow: none; max-width: none; }
              }
              .prose ul { list-style-type: disc; margin-left: 1.5rem; }
              .prose li { margin: 0.25rem 0; }
              .prose p { margin: 0.5rem 0; }
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

  const handleElementSelect = (elementId: string) => {
    if (isDesignMode) {
      setSelectedElement(elementId)
    }
  }

  const handleElementDelete = (elementId: string) => {
    if (isDesignMode) {
      // Hide the element instead of actually deleting it
      setTemplateElements((prev) => ({
        ...prev,
        [elementId]: {
          ...prev[elementId],
          visible: false,
        },
      }))
      setSelectedElement(null)
    }
  }

  const handleElementUpdate = (elementId: string, updates: any) => {
    setTemplateElements((prev) => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        ...updates,
      },
    }))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDesignMode || !selectedElement) return

    e.preventDefault()
    e.stopPropagation()

    const element = templateElements[selectedElement]
    if (element && !element.locked) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        elementX: element.x || 0,
        elementY: element.y || 0,
      })
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !selectedElement) return

      const deltaX = (e.clientX - dragStart.x) / zoom
      const deltaY = (e.clientY - dragStart.y) / zoom

      const newX = dragStart.elementX + deltaX
      const newY = dragStart.elementY + deltaY

      handleElementUpdate(selectedElement, { x: newX, y: newY })
    },
    [isDragging, selectedElement, dragStart, zoom],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

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

  // Render the correct template based on selection
  const renderTemplate = () => {
    const templateProps = {
      data: resumeData,
      isDesignMode,
      onElementSelect: handleElementSelect,
      selectedElement,
      onElementUpdate: handleElementUpdate,
      onElementDelete: handleElementDelete,
    }

    switch (template.id) {
      case "modern-professional":
        return <EditableModernProfessionalTemplate {...templateProps} />
      case "creative-modern":
        return <EditableCreativeModernTemplate {...templateProps} />
      case "minimal-ats":
        return <EditableMinimalATSTemplate {...templateProps} />
      default:
        return <EditableModernProfessionalTemplate {...templateProps} />
    }
  }

  const selectedElementData = selectedElement ? templateElements[selectedElement] : null

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b shadow-sm z-20">
        <div className="flex items-center justify-between px-4 py-3">
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

          {/* Mode Toggle */}
          <div className="flex items-center gap-3">
            <Tabs
              value={isDesignMode ? "design" : "edit"}
              onValueChange={(value) => setIsDesignMode(value === "design")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit Content</TabsTrigger>
                <TabsTrigger value="design">Design Mode</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Action Buttons */}
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
              Download PDF
            </Button>
          </div>
        </div>

        {/* Design Toolbar */}
        {isDesignMode && (
          <div className="border-t bg-gray-50 px-4 py-2">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
                  disabled={zoom <= 0.3}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  disabled={zoom >= 2}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Instructions */}
              <div className="text-sm text-gray-600">
                <Move className="h-4 w-4 inline mr-1" />
                Click any section to select and move it
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Element Actions */}
              {selectedElement && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600 mr-2">Selected: {selectedElement}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleElementDelete(selectedElement)}
                    title="Hide Element"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleElementUpdate(selectedElement, { locked: !selectedElementData?.locked })}
                    title={selectedElementData?.locked ? "Unlock" : "Lock"}
                  >
                    {selectedElementData?.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Content Editor or Design Properties */}
        {!isDesignMode && (
          <div className="w-80 bg-white border-r shadow-sm overflow-y-auto">
            <div className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select value={currentStep} onValueChange={setCurrentStep}>
                    <SelectTrigger>
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
                {renderStepContent()}
              </div>
            </div>
          </div>
        )}

        {/* Design Properties Panel (only in design mode) */}
        {isDesignMode && (
          <div className="w-80 bg-white border-r shadow-sm overflow-y-auto">
            <div className="p-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Design Properties</h3>

                {selectedElement ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Element ID</Label>
                      <Input value={selectedElement} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label>Visibility</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleElementUpdate(selectedElement, { visible: !selectedElementData?.visible })}
                        className="w-full"
                      >
                        {selectedElementData?.visible !== false ? (
                          <Eye className="h-4 w-4 mr-2" />
                        ) : (
                          <EyeOff className="h-4 w-4 mr-2" />
                        )}
                        {selectedElementData?.visible !== false ? "Visible" : "Hidden"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Lock Element</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleElementUpdate(selectedElement, { locked: !selectedElementData?.locked })}
                        className="w-full"
                      >
                        {selectedElementData?.locked ? (
                          <Unlock className="h-4 w-4 mr-2" />
                        ) : (
                          <Lock className="h-4 w-4 mr-2" />
                        )}
                        {selectedElementData?.locked ? "Locked" : "Unlocked"}
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Position</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">X</Label>
                          <Input
                            type="number"
                            value={Math.round(selectedElementData?.x || 0)}
                            onChange={(e) =>
                              handleElementUpdate(selectedElement, { x: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Y</Label>
                          <Input
                            type="number"
                            value={Math.round(selectedElementData?.y || 0)}
                            onChange={(e) =>
                              handleElementUpdate(selectedElement, { y: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Z-Index (Layer)</Label>
                      <Slider
                        value={[selectedElementData?.zIndex || 0]}
                        onValueChange={([value]) => handleElementUpdate(selectedElement, { zIndex: value })}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Move className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-sm mb-2">Click any section to select it</p>
                    <p className="text-xs text-gray-400">
                      Each section of your resume can be moved, hidden, or locked independently
                    </p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Template Elements</h4>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {Object.entries(templateElements).map(([elementId, element]) => (
                      <div
                        key={elementId}
                        className={`p-2 rounded cursor-pointer text-sm flex items-center justify-between ${
                          selectedElement === elementId ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedElement(elementId)}
                      >
                        <span className="truncate text-xs">
                          {elementId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                        <div className="flex items-center gap-1">
                          {element.visible === false && <EyeOff className="h-3 w-3 text-gray-400" />}
                          {element.locked && <Lock className="h-3 w-3 text-gray-400" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Reset all elements to visible
                      const resetElements = Object.keys(templateElements).reduce(
                        (acc, key) => {
                          acc[key] = { ...templateElements[key], visible: true, locked: false }
                          return acc
                        },
                        {} as Record<string, TemplateElement>,
                      )
                      setTemplateElements(resetElements)
                      setSelectedElement(null)
                    }}
                    className="w-full"
                  >
                    Reset All Elements
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="flex justify-center">
              <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
                {/* Resume Template Container */}
                <div
                  ref={canvasRef}
                  className="relative bg-white shadow-lg"
                  style={{
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                  }}
                  onClick={() => !isDragging && setSelectedElement(null)}
                  onMouseDown={handleMouseDown}
                >
                  {/* Grid overlay for design mode */}
                  {isDesignMode && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                        `,
                        backgroundSize: "20px 20px",
                      }}
                    />
                  )}

                  {/* Actual Resume Template */}
                  <div className="absolute inset-0">{renderTemplate()}</div>

                  {/* Hidden preview for export */}
                  <div ref={previewRef} className="hidden">
                    {renderTemplate()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
