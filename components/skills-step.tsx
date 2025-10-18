"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, X } from "lucide-react"
import type { ResumeData } from "../resume-editor"

interface SkillsStepProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function SkillsStep({ data, onChange }: SkillsStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    items: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")

  const addSkillGroup = () => {
    const newSkillGroup = {
      id: Date.now().toString(),
      ...formData,
    }

    onChange({
      ...data,
      skills: [...data.skills, newSkillGroup],
    })

    setFormData({
      category: "",
      items: [],
    })
  }

  const updateSkillGroup = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) => (skill.id === id ? { ...skill, ...formData } : skill)),
    })
    setEditingId(null)
    setFormData({
      category: "",
      items: [],
    })
  }

  const deleteSkillGroup = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    })
  }

  const startEditing = (skillGroup: any) => {
    setEditingId(skillGroup.id)
    setFormData({
      category: skillGroup.category,
      items: [...skillGroup.items],
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.items.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        items: [...formData.items, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item !== skill),
    })
  }

  return (
    <div className="space-y-6">
      {/* Existing Skill Groups */}
      {data.skills.map((skillGroup) => (
        <Card key={skillGroup.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{skillGroup.category}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillGroup.items.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => startEditing(skillGroup)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteSkillGroup(skillGroup.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{editingId ? "Edit Skill Category" : "Add Skill Category"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Programming Languages"
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="JavaScript"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill()
                  }
                }}
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.items.map((skill, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={editingId ? () => updateSkillGroup(editingId) : addSkillGroup}
              disabled={!formData.category.trim() || formData.items.length === 0}
            >
              {editingId ? "Update Skills" : "Add Skills"}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    category: "",
                    items: [],
                  })
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
