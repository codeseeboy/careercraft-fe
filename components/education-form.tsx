"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeData } from "../resume-builder"

interface EducationFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      graduationDate: "",
      gpa: "",
    }

    onChange({
      ...data,
      education: [...data.education, newEducation],
    })
  }

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })
  }

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg text-gray-900">Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {data.education.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No education added yet</p>
              <Button onClick={addEducation} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            </div>
          ) : (
            <>
              {data.education.map((edu, index) => (
                <Card key={edu.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base text-gray-900">
                        {edu.degree || `Education ${index + 1}`}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Degree *</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          placeholder="Bachelor of Business Administration"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Field of Study</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                          placeholder="Marketing"
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Institution *</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          placeholder="University of Sydney"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Location</Label>
                        <Input
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                          placeholder="Sydney, Australia"
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Graduation Date *</Label>
                        <Input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">GPA (Optional)</Label>
                        <Input
                          value={edu.gpa || ""}
                          onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                          placeholder="3.8/4.0"
                          className="border-gray-300"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addEducation} variant="outline" className="w-full gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Add Another Education
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-900 mb-2">Education Tips</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• List your highest degree first</li>
          <li>• Include GPA if it's 3.5 or higher</li>
          <li>• Add relevant coursework for entry-level positions</li>
          <li>• Include honors, awards, or relevant projects</li>
        </ul>
      </div>
    </div>
  )
}
