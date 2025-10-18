"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeData } from "../resume-builder"

interface ExperienceFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }

    onChange({
      ...data,
      experience: [...data.experience, newExperience],
    })
    setEditingId(newExperience.id)
  }

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    })
  }

  const exampleDescription = `• Developed and executed comprehensive digital marketing strategies that increased brand awareness by 40% and generated $2M in additional revenue
• Managed social media campaigns across 5 platforms, growing follower base by 150% and engagement rates by 85%
• Led cross-functional team of 8 marketing professionals to deliver integrated campaigns on time and under budget
• Analyzed marketing performance data using Google Analytics and HubSpot to optimize campaigns and improve ROI by 25%`

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg text-gray-900">Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {data.experience.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No work experience added yet</p>
              <Button onClick={addExperience} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Work Experience
              </Button>
            </div>
          ) : (
            <>
              {data.experience.map((exp, index) => (
                <Card key={exp.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base text-gray-900">
                        {exp.position || `Experience ${index + 1}`}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Job Title *</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          placeholder="Senior Marketing Manager"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Company *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          placeholder="TechCorp Australia"
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                          placeholder="Sydney, Australia"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Start Date *</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          disabled={exp.current}
                          className="border-gray-300"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onCheckedChange={(checked) => updateExperience(exp.id, "current", checked as boolean)}
                          />
                          <Label htmlFor={`current-${exp.id}`} className="text-sm text-gray-600">
                            Currently working here
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Job Description *</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        placeholder={exampleDescription}
                        className="min-h-[120px] border-gray-300"
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addExperience} variant="outline" className="w-full gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Add Another Experience
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-900 mb-2">Writing Tips</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Start each bullet point with an action verb</li>
          <li>• Include specific numbers and achievements</li>
          <li>• Focus on results, not just responsibilities</li>
          <li>• Use 3-5 bullet points per role</li>
        </ul>
      </div>
    </div>
  )
}
