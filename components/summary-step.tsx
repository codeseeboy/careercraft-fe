"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "../rich-text-editor"
import type { ResumeData } from "../resume-editor"

interface SummaryStepProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function SummaryStep({ data, onChange }: SummaryStepProps) {
  const updateSummary = (value: string) => {
    onChange({
      ...data,
      summary: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary">Summary *</Label>
          <RichTextEditor
            value={data.summary}
            onChange={updateSummary}
            placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives..."
            className="min-h-[200px]"
          />
        </div>
        <div className="text-sm text-gray-600">
          <p>Tips for a great summary:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Keep it concise (3-4 sentences)</li>
            <li>Highlight your most relevant skills</li>
            <li>Include quantifiable achievements</li>
            <li>Tailor it to your target role</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
