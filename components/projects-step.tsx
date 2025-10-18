"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, X } from "lucide-react"
import type { ResumeData } from "../resume-editor"

interface ProjectsStepProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function ProjectsStep({ data, onChange }: ProjectsStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: [] as string[],
    link: "",
  })
  const [newTech, setNewTech] = useState("")

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      ...formData,
    }

    onChange({
      ...data,
      projects: [...data.projects, newProject],
    })

    setFormData({
      name: "",
      description: "",
      technologies: [],
      link: "",
    })
  }

  const updateProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.map((project) => (project.id === id ? { ...project, ...formData } : project)),
    })
    setEditingId(null)
    setFormData({
      name: "",
      description: "",
      technologies: [],
      link: "",
    })
  }

  const deleteProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((project) => project.id !== id),
    })
  }

  const startEditing = (project: any) => {
    setEditingId(project.id)
    setFormData({
      name: project.name,
      description: project.description,
      technologies: [...project.technologies],
      link: project.link || "",
    })
  }

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()],
      })
      setNewTech("")
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  return (
    <div className="space-y-6">
      {/* Existing Projects */}
      {data.projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {project.link && (
                  <p className="text-sm text-blue-600 mt-2">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {project.link}
                    </a>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => startEditing(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteProject(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{project.description}</p>
          </CardContent>
        </Card>
      ))}

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{editingId ? "Edit Project" : "Add Project"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="E-commerce Website"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description *</Label>
            <Textarea
              id="projectDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Built a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Technologies Used</Label>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="React"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTechnology()
                  }
                }}
              />
              <Button type="button" onClick={addTechnology} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)} className="ml-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectLink">Project Link (Optional)</Label>
            <Input
              id="projectLink"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={editingId ? () => updateProject(editingId) : addProject}
              disabled={!formData.name.trim() || !formData.description.trim()}
            >
              {editingId ? "Update Project" : "Add Project"}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    name: "",
                    description: "",
                    technologies: [],
                    link: "",
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
