"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ResumeData } from "../resume-builder"

interface SummaryFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function SummaryForm({ data, onChange }: SummaryFormProps) {
  const updateSummary = (value: string) => {
    onChange({
      ...data,
      summary: value,
    })
  }

  const exampleSummary = `Results-oriented marketing professional with over 5 years of experience in digital marketing, brand strategy, and content creation. Proven ability to drive brand growth, increase online engagement, and deliver data-driven results. Expert in utilizing digital tools and analytics to optimize marketing campaigns and achieve business objectives.`

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg text-gray-900">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-gray-700 font-medium">
              Professional Summary *
            </Label>
            <Textarea
              id="summary"
              value={data.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder={exampleSummary}
              className="min-h-[120px] border-gray-300"
              rows={6}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Write 3-4 sentences highlighting your key achievements, skills, and career goals.</span>
              <span>{data.summary.length} characters</span>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Writing Tips</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Start with your years of experience and main expertise</li>
              <li>• Include 2-3 key skills or achievements</li>
              <li>• Use action words like "proven," "expert," "results-oriented"</li>
              <li>• Keep it between 50-150 words</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">ATS Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use keywords from the job description</li>
          <li>• Include quantifiable achievements</li>
          <li>• Recommended: 50-150 words</li>
        </ul>
      </div>
    </div>
  )
}
