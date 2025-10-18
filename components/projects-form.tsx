"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X } from "lucide-react"
import type { ResumeData } from "../resume-builder"

interface ProjectsFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [newTechnology, setNewTechnology] = useState<{ [key: string]: string }>({})

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
    }

    onChange({
      ...data,
      projects: [...data.projects, newProject],
    })
  }

  const updateProject = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
    })
  }

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((project) => project.id !== id),
    })
  }

  const addTechnology = (projectId: string) => {
    const tech = newTechnology[projectId]?.trim()
    if (!tech) return

    onChange({
      ...data,
      projects: data.projects.map((project) =>
        project.id === projectId ? { ...project, technologies: [...project.technologies, tech] } : project,
      ),
    })

    setNewTechnology({ ...newTechnology, [projectId]: "" })
  }

  const removeTechnology = (projectId: string, index: number) => {
    onChange({
      ...data,
      projects: data.projects.map((project) =>
        project.id === projectId
          ? { ...project, technologies: project.technologies.filter((_, i) => i !== index) }
          : project,
      ),
    })
  }

  const exampleDescription = `Developed a full-stack e-commerce web application with user authentication, payment processing, and inventory management. Implemented responsive design and optimized for mobile devices. Achieved 99% uptime and handled 1000+ concurrent users during peak traffic.`

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg text-gray-900">Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {data.projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No projects added yet</p>
              <Button onClick={addProject} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </div>
          ) : (
            <>
              {data.projects.map((project, index) => (
                <Card key={project.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base text-gray-900">
                        {project.name || `Project ${index + 1}`}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Project Name *</Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, "name", e.target.value)}
                          placeholder="E-commerce Platform"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Project URL</Label>
                        <Input
                          value={project.url || ""}
                          onChange={(e) => updateProject(project.id, "url", e.target.value)}
                          placeholder="https://github.com/username/project"
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Start Date</Label>
                        <Input
                          type="month"
                          value={project.startDate}
                          onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">End Date</Label>
                        <Input
                          type="month"
                          value={project.endDate}
                          onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Description *</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        placeholder={exampleDescription}
                        className="min-h-[100px] border-gray-300"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Technologies Used</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newTechnology[project.id] || ""}
                          onChange={(e) => setNewTechnology({ ...newTechnology, [project.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTechnology(project.id)
                            }
                          }}
                          placeholder="React, Node.js, MongoDB..."
                          className="flex-1 border-gray-300"
                        />
                        <Button
                          type="button"
                          onClick={() => addTechnology(project.id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="gap-1 bg-gray-100 text-gray-800">
                            {tech}
                            <button
                              onClick={() => removeTechnology(project.id, techIndex)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addProject} variant="outline" className="w-full gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Add Another Project
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <h4 className="font-medium text-indigo-900 mb-2">Project Tips</h4>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Focus on projects relevant to the job you're applying for</li>
          <li>• Include quantifiable results and impact</li>
          <li>• Mention specific technologies and tools used</li>
          <li>• Provide links to live demos or GitHub repositories</li>
        </ul>
      </div>
    </div>
  )
}
