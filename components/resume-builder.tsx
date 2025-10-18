"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Save,
  Download,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Eye,
  Gauge,
} from "lucide-react"
import Link from "next/link"
import { PersonalInfoForm } from "./personal-info-form"
import { SummaryForm } from "./summary-form"
import { ExperienceForm } from "./experience-form"
import { EducationForm } from "./education-form"
import { SkillsForm } from "./skills-form"
import { ProjectsForm } from "./projects-form"
import { ResumePreview } from "./resume-preview"
import type { ResumeData as RD } from "@/lib/resume-serializer"
import { serializeResumeToText } from "@/lib/resume-serializer"
import { ATSScoreBadge } from "./ats-score-badge"

export type ResumeData = RD;

export function ResumeBuilder() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  const [isDownloading, setIsDownloading] = useState(false)
  const [atsLoading, setAtsLoading] = useState(false)
  const [atsScore, setAtsScore] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      certifications: [],
    },
    projects: [],
  })

  const previewRef = useRef<HTMLDivElement>(null)

  const handleDataChange = useCallback((newData: ResumeData) => {
    setResumeData(newData)
  }, [])

  // This function has been replaced with direct use of the chat API in handleCheckScore

  const handleSave = async () => {
    // Persist locally
    localStorage.setItem("resume-data", JSON.stringify(resumeData))
    // Score via API
    try {
      await handleCheckScore()
      alert("Resume saved successfully!")
    } catch (e) {
      console.error(e)
      const errorMessage = e instanceof Error ? e.message : "ATS scoring failed."
      alert("Resume saved, but ATS scoring failed: " + errorMessage)
    }
  }

  const handleCheckScore = async () => {
    try {
      setAtsLoading(true)
      
      // Get the resume text using the serializer
      const resumeText = serializeResumeToText(resumeData)
      
      // Use the Gemini chat API to get a score
      const response = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `You are an expert ATS score evaluator. Please analyze this resume and give it a score out of 100 based on ATS compatibility. Also provide 2-4 specific suggestions for improvement. Format your response like this: "Score: 75\n\nSuggestions:\n1. Add more keywords from job descriptions\n2. Quantify achievements with metrics"\n\nResume:\n${resumeText}` 
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to get ATS score from API")
      }
      
      const result = await response.json()
      const responseText = result.response || ""
      
      // Parse the score from the response
      const scoreMatch = responseText.match(/Score:\s*(\d+)/i)
      const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : null
      
      if (extractedScore !== null && !isNaN(extractedScore)) {
        setAtsScore(extractedScore)
      } else {
        setAtsScore(null)
        throw new Error("Could not extract a valid score from the AI response")
      }
      
      // Extract suggestions
      const suggestionsMatch = responseText.split(/Suggestions:/i)[1]
      if (suggestionsMatch) {
        const extractedSuggestions = suggestionsMatch
          .split(/\d+\./)
          .slice(1)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0)
        
        setSuggestions(extractedSuggestions.slice(0, 4))
      } else {
        setSuggestions([])
      }
    } catch (e) {
      console.error(e)
      setAtsScore(null)
      setSuggestions([])
      const errorMessage = e instanceof Error ? e.message : "ATS scoring failed."
      alert(errorMessage)
    } finally {
      setAtsLoading(false)
    }
  }

    const handleDownload = async () => {
    if (!previewRef.current) return
    setIsDownloading(true)
    try {
      // First try using browser's print functionality (better color support)
      const printResult = window.confirm(
        "For best results with modern colors, click OK to open the print dialog. " +
        "Choose 'Save as PDF' in the print options. " +
        "Click Cancel to use the direct PDF download (may have color issues)."
      );
      
      if (printResult) {
        window.print();
        setIsDownloading(false);
        return;
      }
      
      // Import our PDF generator utility as fallback
      const { ResumeePDFGenerator } = await import("@/lib/pdf-generator")
      
      // Prepare the element for PDF generation
      const element = previewRef.current;
      
      // Wait for all images to load for better rendering
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(
        images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
      
      // Generate the PDF using our utility
      const fileName = `${resumeData.personalInfo.fullName || "Resume"}_ATS_Resume.pdf`;
      await ResumeePDFGenerator.generatePDF(previewRef.current, fileName, {
        format: "A4",
        orientation: "portrait",
        quality: 2.0, // Higher quality
        margins: {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5,
        },
      });
      
      toast({
        title: "PDF Downloaded",
        description: "Your resume PDF has been generated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to download resume:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: Award },
  ]

  const getCompletionStatus = (tabId: string) => {
    switch (tabId) {
      case "personal":
        return Boolean(
          resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.phone,
        )
      case "summary":
        return resumeData.summary.length > 50
      case "experience":
        return resumeData.experience.length > 0
      case "education":
        return resumeData.education.length > 0
      case "skills":
        return resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0
      case "projects":
        return resumeData.projects.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ATS Resume Builder</h1>
                <p className="text-sm text-gray-600">Create an ATS-friendly professional resume</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ATSScoreBadge score={atsScore} loading={atsLoading} />
              <Button variant="outline" size="sm" onClick={handleSave} className="gap-2 bg-transparent">
                <Save className="h-4 w-4" />
                Save & Score
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCheckScore}
                disabled={atsLoading}
                className="gap-2"
                title="Check ATS score without saving"
              >
                <Gauge className="h-4 w-4" />
                Check ATS Score
              </Button>
              <Button size="sm" onClick={handleDownload} disabled={isDownloading} className="gap-2">
                <Download className="h-4 w-4" />
                {isDownloading ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FileText className="h-5 w-5" />
                  Resume Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full mb-6 h-auto bg-gray-100">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      const isComplete = getCompletionStatus(tab.id)
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className={`flex flex-col gap-1 p-3 min-h-[60px] text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600 ${
                            isComplete ? "bg-green-50 text-green-700 border-green-200" : ""
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs font-medium">{tab.label}</span>
                          {isComplete && <div className="w-1 h-1 bg-green-500 rounded-full"></div>}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="personal" className="mt-0">
                      <PersonalInfoForm data={resumeData} onChange={handleDataChange} />
                    </TabsContent>

                    <TabsContent value="summary" className="mt-0">
                      <SummaryForm data={resumeData} onChange={handleDataChange} />
                    </TabsContent>

                    <TabsContent value="experience" className="mt-0">
                      <ExperienceForm data={resumeData} onChange={handleDataChange} />
                    </TabsContent>

                    <TabsContent value="education" className="mt-0">
                      <EducationForm data={resumeData} onChange={handleDataChange} />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-0">
                      <SkillsForm data={resumeData} onChange={handleDataChange} />
                    </TabsContent>

                    <TabsContent value="projects" className="mt-0">
                      <ProjectsForm data={resumeData} onChange={handleDataChange} />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Suggestions */}
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-gray-900">ATS Score</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {atsScore == null ? "--" : `${atsScore}`}
                    <span className="text-sm font-normal text-muted-foreground">{atsScore == null ? "" : "/100"}</span>
                  </div>
                  <ATSScoreBadge score={atsScore} loading={atsLoading} size="lg" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Eye className="h-5 w-5" />
                  ATS Resume Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white border rounded-lg shadow-inner overflow-auto max-h-[800px]">
                  <div ref={previewRef} className="p-4">
                    <ResumePreview data={resumeData} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {suggestions.length > 0 && (
              <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-gray-900">Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {suggestions.map((s, i) => (
                      <details key={i} className="group">
                        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium">
                          <span className="line-clamp-1">
                            {"Suggestion "}
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground group-open:rotate-180 transition">{"▾"}</span>
                        </summary>
                        <div className="px-4 pb-4 text-sm text-gray-800">{s}</div>
                      </details>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Print-specific styles */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #resume-preview, #resume-preview * {
                visibility: visible;
              }
              #resume-preview {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
              }
              .template-wrapper {
                box-shadow: none !important;
                transform: scale(1) !important;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}
