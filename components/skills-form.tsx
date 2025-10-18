"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import type { ResumeData } from "../resume-builder"

interface SkillsFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({
    technical: "",
    soft: "",
    languages: "",
    certifications: "",
  })

  const addSkill = (category: keyof typeof newSkill) => {
    const skill = newSkill[category].trim()
    if (!skill) return

    onChange({
      ...data,
      skills: {
        ...data.skills,
        [category]: [...data.skills[category], skill],
      },
    })

    setNewSkill({ ...newSkill, [category]: "" })
  }

  const removeSkill = (category: keyof ResumeData["skills"], index: number) => {
    onChange({
      ...data,
      skills: {
        ...data.skills,
        [category]: data.skills[category].filter((_, i) => i !== index),
      },
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent, category: keyof typeof newSkill) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(category)
    }
  }

  const skillCategories = [
    {
      key: "technical" as const,
      title: "Technical Skills",
      placeholder: "JavaScript, Python, React, AWS...",
      examples: ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "SQL", "Git"],
    },
    {
      key: "soft" as const,
      title: "Soft Skills",
      placeholder: "Leadership, Communication, Problem Solving...",
      examples: ["Leadership", "Communication", "Problem Solving", "Team Management", "Project Management"],
    },
    {
      key: "languages" as const,
      title: "Languages",
      placeholder: "English (Native), Spanish (Fluent)...",
      examples: ["English (Native)", "Spanish (Fluent)", "French (Conversational)"],
    },
    {
      key: "certifications" as const,
      title: "Certifications",
      placeholder: "AWS Certified, Google Analytics...",
      examples: ["AWS Certified Solutions Architect", "Google Analytics Certified", "PMP Certified"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg text-gray-900">Skills & Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {skillCategories.map((category) => (
            <div key={category.key} className="space-y-3">
              <Label className="text-gray-700 font-medium">{category.title}</Label>

              <div className="flex gap-2">
                <Input
                  value={newSkill[category.key]}
                  onChange={(e) => setNewSkill({ ...newSkill, [category.key]: e.target.value })}
                  onKeyPress={(e) => handleKeyPress(e, category.key)}
                  placeholder={category.placeholder}
                  className="flex-1 border-gray-300"
                />
                <Button
                  type="button"
                  onClick={() => addSkill(category.key)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.skills[category.key].map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gap-1 bg-gray-100 text-gray-800">
                    {skill}
                    <button onClick={() => removeSkill(category.key, index)} className="ml-1 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {data.skills[category.key].length === 0 && (
                <div className="text-sm text-gray-500">Examples: {category.examples.join(", ")}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h4 className="font-medium text-orange-900 mb-2">Skills Tips</h4>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Include skills mentioned in the job description</li>
          <li>• List technical skills first, then soft skills</li>
          <li>• Be specific (e.g., "JavaScript ES6" vs "Programming")</li>
          <li>• Include proficiency levels for languages</li>
        </ul>
      </div>
    </div>
  )
}
