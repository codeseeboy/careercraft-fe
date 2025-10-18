"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, FileText, Briefcase, GraduationCap, Code, Award, ChevronRight } from "lucide-react"
import type { ResumeData } from "./resume-editor"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { SummaryStep } from "./steps/summary-step"
import { ExperienceStep } from "./steps/experience-step"
import { EducationStep } from "./steps/education-step"
import { SkillsStep } from "./steps/skills-step"
import { ProjectsStep } from "./steps/projects-step"

interface EditorSidebarProps {
  currentStep: number
  onStepChange: (step: number) => void
  resumeData: ResumeData
  onDataChange: (data: ResumeData) => void
}

const steps = [
  { id: 0, title: "Personal Info", icon: User, description: "Basic contact information" },
  { id: 1, title: "Summary", icon: FileText, description: "Professional summary" },
  { id: 2, title: "Experience", icon: Briefcase, description: "Work experience" },
  { id: 3, title: "Education", icon: GraduationCap, description: "Educational background" },
  { id: 4, title: "Skills", icon: Code, description: "Technical and soft skills" },
  { id: 5, title: "Projects", icon: Award, description: "Notable projects" },
]

export function EditorSidebar({ currentStep, onStepChange, resumeData, onDataChange }: EditorSidebarProps) {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep data={resumeData} onChange={onDataChange} />
      case 1:
        return <SummaryStep data={resumeData} onChange={onDataChange} />
      case 2:
        return <ExperienceStep data={resumeData} onChange={onDataChange} />
      case 3:
        return <EducationStep data={resumeData} onChange={onDataChange} />
      case 4:
        return <SkillsStep data={resumeData} onChange={onDataChange} />
      case 5:
        return <ProjectsStep data={resumeData} onChange={onDataChange} />
      default:
        return null
    }
  }

  const isStepComplete = (stepId: number) => {
    switch (stepId) {
      case 0:
        return resumeData.personalInfo.fullName && resumeData.personalInfo.email
      case 1:
        return resumeData.summary.length > 0
      case 2:
        return resumeData.experience.length > 0
      case 3:
        return resumeData.education.length > 0
      case 4:
        return resumeData.skills.length > 0
      case 5:
        return resumeData.projects.length > 0
      default:
        return false
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resume Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isComplete = isStepComplete(step.id)

            return (
              <Button
                key={step.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-auto p-3 ${
                  isActive ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => onStepChange(step.id)}
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{step.title}</span>
                    {isComplete && (
                      <Badge variant="secondary" className="text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs opacity-70">{step.description}</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
