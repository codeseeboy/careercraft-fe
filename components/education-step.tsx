"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import type { ResumeData, Education } from "../resume-editor"

interface EducationStepProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function EducationStep({ data, onChange }: EducationStepProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
  })

  const handleAdd = () => {
    if (formData.institution && formData.degree && formData.field && formData.startDate && formData.endDate) {
      const newEducation: Education = {
        id: Date.now().toString(),
        institution: formData.institution,
        degree: formData.degree,
        field: formData.field,
        startDate: formData.startDate,
        endDate: formData.endDate,
        gpa: formData.gpa || "",
      }

      onChange({
        ...data,
        education: [...data.education, newEducation],
      })

      setFormData({
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      })
      setIsAdding(false)
    }
  }

  const handleEdit = (education: Education) => {
    setFormData(education)
    setEditingId(education.id)
    setIsAdding(true)
  }

  const handleUpdate = () => {
    if (
      editingId &&
      formData.institution &&
      formData.degree &&
      formData.field &&
      formData.startDate &&
      formData.endDate
    ) {
      onChange({
        ...data,
        education: data.education.map((edu) =>
          edu.id === editingId
            ? {
                ...edu,
                institution: formData.institution!,
                degree: formData.degree!,
                field: formData.field!,
                startDate: formData.startDate!,
                endDate: formData.endDate!,
                gpa: formData.gpa || "",
              }
            : edu,
        ),
      })

      setFormData({
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      })
      setIsAdding(false)
      setEditingId(null)
    }
  }

  const handleDelete = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    })
  }

  const handleCancel = () => {
    setFormData({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const isFormValid =
    formData.institution && formData.degree && formData.field && formData.startDate && formData.endDate

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{editingId ? "Edit Education" : "Add New Education"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={formData.institution || ""}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="University of Technology"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  value={formData.degree || ""}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">Field of Study *</Label>
                <Input
                  id="field"
                  value={formData.field || ""}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate || ""}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA (Optional)</Label>
                <Input
                  id="gpa"
                  value={formData.gpa || ""}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  placeholder="3.8"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleAdd} disabled={!isFormValid} className="gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update" : "Add"} Education
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
        {data.education.map((education) => (
          <Card key={education.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">
                    {education.degree} in {education.field}
                  </h4>
                  <p className="text-sm text-gray-600">{education.institution}</p>
                  <p className="text-xs text-gray-500">
                    {education.startDate} - {education.endDate}
                  </p>
                  {education.gpa && <p className="text-xs text-gray-500">GPA: {education.gpa}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(education)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(education.id)}
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

      {data.education.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  )
}
