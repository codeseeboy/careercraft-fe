"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Crown, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { TemplateData } from "@/app/dashboard/resume-builder/page"

const templates: TemplateData[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    category: "Professional",
    preview: "/placeholder.svg?height=400&width=300&text=Modern+Professional+Resume",
  },
  {
    id: "creative-modern",
    name: "Creative Modern",
    category: "Creative",
    preview: "/placeholder.svg?height=400&width=300&text=Creative+Modern+Resume",
  },
  {
    id: "minimal-ats",
    name: "Minimal ATS",
    category: "ATS-Friendly",
    preview: "/placeholder.svg?height=400&width=300&text=Minimal+ATS+Resume",
  },
]

const categories = ["All", "Professional", "Creative", "ATS-Friendly"]

interface TemplateGalleryProps {
  onSelectTemplate: (template: TemplateData) => void
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Choose Your Resume Template</h1>
              <p className="text-muted-foreground">
                Select from our collection of ATS-friendly, professional templates
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 xl:grid-cols-13 w-full">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="relative">
                          <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                            {template.id === "modern-professional" && (
                              <div className="w-full h-full bg-white rounded-t-lg p-4 text-xs">
                                <div className="bg-blue-900 text-white p-3 rounded mb-2">
                                  <div className="font-bold">John Doe</div>
                                  <div className="text-blue-200">Software Engineer</div>
                                </div>
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                  <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                                </div>
                              </div>
                            )}
                            {template.id === "creative-modern" && (
                              <div className="w-full h-full bg-white rounded-t-lg flex">
                                <div className="w-1/3 bg-purple-600 text-white p-3 rounded-tl-lg">
                                  <div className="w-8 h-8 bg-white/20 rounded-full mb-2"></div>
                                  <div className="text-xs font-bold">Jane Smith</div>
                                  <div className="text-xs opacity-80">Designer</div>
                                </div>
                                <div className="flex-1 p-3">
                                  <div className="space-y-1">
                                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {template.id === "minimal-ats" && (
                              <div className="w-full h-full bg-white rounded-t-lg p-4 text-xs">
                                <div className="border-b-2 border-gray-900 pb-2 mb-2">
                                  <div className="font-bold text-lg">Alex Johnson</div>
                                  <div className="text-gray-600">Data Analyst</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                                  <div className="h-1 bg-gray-200 rounded w-3/5"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          {template.isPro && (
                            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Pro
                            </Badge>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-t-lg" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                              Use This Template
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
