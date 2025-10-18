"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import type { ResumeData, Experience } from "../resume-editor"
import { RichTextEditor } from "../rich-text-editor"

interface ExperienceStepProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function ExperienceStep({ data, onChange }: ExperienceStepProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Experience>>({
    position: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  })

  const handleAdd = () => {
    if (formData.position && formData.company && formData.startDate && (formData.endDate || formData.current)) {
      const newExperience: Experience = {
        id: Date.now().toString(),
        position: formData.position,
        company: formData.company,
        startDate: formData.startDate,
        endDate: formData.current ? "" : formData.endDate || "",
        current: formData.current || false,
        description: formData.description || "",
      }

      onChange({
        ...data,
        experience: [...data.experience, newExperience],
      })

      setFormData({
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      })
      setIsAdding(false)
    }
  }

  const handleEdit = (experience: Experience) => {
    setFormData(experience)
    setEditingId(experience.id)
    setIsAdding(true)
  }

  const handleUpdate = () => {
    if (
      editingId &&
      formData.position &&
      formData.company &&
      formData.startDate &&
      (formData.endDate || formData.current)
    ) {
      onChange({
        ...data,
        experience: data.experience.map((exp) =>
          exp.id === editingId
            ? {
                ...exp,
                position: formData.position!,
                company: formData.company!,
                startDate: formData.startDate!,
                endDate: formData.current ? "" : formData.endDate || "",
                current: formData.current || false,
                description: formData.description || "",
              }
            : exp,
        ),
      })

      setFormData({
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      })
      setIsAdding(false)
      setEditingId(null)
    }
  }

  const handleDelete = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    })
  }

  const handleCancel = () => {
    setFormData({
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const isFormValid =
    formData.position && formData.company && formData.startDate && (formData.endDate || formData.current)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{editingId ? "Edit Experience" : "Add New Experience"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position || ""}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company || ""}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate || ""}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date {!formData.current && "*"}</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate || ""}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={formData.current || false}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    current: checked as boolean,
                    endDate: checked ? "" : formData.endDate,
                  })
                }
              />
              <Label htmlFor="current">I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <RichTextEditor
                value={formData.description || ""}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleAdd} disabled={!isFormValid} className="gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update" : "Add"} Experience
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {data.experience.map((experience) => (
          <Card key={experience.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{experience.position}</h4>
                  <p className="text-sm text-gray-600">{experience.company}</p>
                  <p className="text-xs text-gray-500">
                    {experience.startDate} - {experience.current ? "Present" : experience.endDate}
                  </p>
                  {experience.description && (
                    <div
                      className="text-sm text-gray-700 mt-2 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: experience.description }}
                    />
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(experience)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(experience.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.experience.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  )
}
