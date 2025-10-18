"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import type { TemplateType } from "@/app/dashboard/resume-builder/page"

interface TemplateSelectorProps {
  onSelectTemplate: (template: TemplateType) => void
}

const templates = [
  {
    id: "ats-professional" as TemplateType,
    name: "ATS Professional",
    description: "Clean, professional layout optimized for ATS systems",
    features: ["ATS Optimized", "Clean Layout", "Professional"],
    preview: "Modern professional resume with clear sections and excellent readability",
    recommended: true,
  },
  {
    id: "ats-modern" as TemplateType,
    name: "ATS Modern",
    description: "Contemporary design while maintaining ATS compatibility",
    features: ["ATS Friendly", "Modern Design", "Versatile"],
    preview: "Sleek modern design with subtle styling and great structure",
    recommended: false,
  },
  {
    id: "ats-executive" as TemplateType,
    name: "ATS Executive",
    description: "Executive-level template for senior positions",
    features: ["Executive Level", "ATS Compatible", "Leadership Focus"],
    preview: "Professional executive template emphasizing leadership experience",
    recommended: false,
  },
  {
    id: "ats-technical" as TemplateType,
    name: "ATS Technical",
    description: "Designed for technical roles with skills emphasis",
    features: ["Tech Focused", "Skills Highlight", "ATS Safe"],
    preview: "Technical resume template with emphasis on skills and projects",
    recommended: false,
  },
]

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Choose Your Resume Template</h1>
              <p className="text-gray-600">All templates are ATS-friendly and professionally designed</p>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                template.recommended ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {template.name}
                      {template.recommended && (
                        <Badge className="bg-blue-500">
                          <Star className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Preview Area */}
                <div className="bg-white border rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-2 bg-gray-400 rounded mb-2 mx-auto"></div>
                      <div className="w-24 h-1 bg-gray-300 rounded mb-4 mx-auto"></div>
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-gray-300 rounded"></div>
                        <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                        <div className="w-5/6 h-1 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mb-4">{template.preview}</p>

                <Button className="w-full" onClick={() => onSelectTemplate(template.id)}>
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ATS Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">Why ATS-Friendly Templates Matter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Applicant Tracking Systems</h4>
              <p className="text-blue-700">
                Over 90% of large companies use ATS to screen resumes. Our templates ensure your resume gets through.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Clean Formatting</h4>
              <p className="text-blue-700">
                Simple, clean layouts with standard fonts and clear section headers that ATS systems can easily parse.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Keyword Optimization</h4>
              <p className="text-blue-700">
                Built-in guidance for including relevant keywords and phrases that match job descriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
