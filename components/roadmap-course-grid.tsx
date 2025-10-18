"use client"

import { useState } from "react"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"
import { ROADMAP_COURSES, type RoadmapCourse } from "@/lib/roadmap-courses"

export function RoadmapCourseGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Get unique categories
  const categories = ["all", ...new Set(ROADMAP_COURSES.map((course: RoadmapCourse) => course.category))]
  
  // Filter courses by category
  const filteredCourses = selectedCategory === "all" 
    ? ROADMAP_COURSES 
    : ROADMAP_COURSES.filter((course: RoadmapCourse) => course.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Badge 
            key={category}
            className={`cursor-pointer hover:bg-primary/90 text-sm px-3 py-1 ${
              selectedCategory === category 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course: RoadmapCourse) => (
          <Link key={course.id} href={`/dashboard/learning/course/${course.id}`}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{course.modules.length}</span> modules
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{course.difficulty}</span>
                </div>
                <div>{course.estimatedHours} hours</div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
