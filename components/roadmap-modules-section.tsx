"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video } from "lucide-react"

// Define the structure of our course modules
interface CourseModule {
  id: string;
  title: string;
  focus: string;
  videoLink: string;
}

interface RoadmapCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  level: string;
  modules: CourseModule[];
}

// Sample roadmap courses data
const ROADMAP_COURSES: RoadmapCourse[] = [
  {
    id: "web-development",
    title: "Complete Web Development Bootcamp",
    description: "A comprehensive web development course covering HTML, CSS, JavaScript, and modern frameworks.",
    category: "Web Development",
    thumbnail: "https://i.ytimg.com/vi/GxmfcnU3feo/mqdefault.jpg",
    level: "Beginner",
    modules: [
      {
        id: "web-mod-1",
        title: "Module 1 – Foundations",
        focus: "HTML, CSS, JS basics",
        videoLink: "https://www.youtube.com/watch?v=GxmfcnU3feo"
      },
      {
        id: "web-mod-2",
        title: "Module 2 – Frontend Frameworks & UI",
        focus: "Web Development Complete RoadMap 2025",
        videoLink: "https://www.youtube.com/watch?v=4WjtQjPQGIs"
      },
      {
        id: "web-mod-3",
        title: "Module 3 – Backend & APIs",
        focus: "Web Development Roadmap 2025 (free resources)",
        videoLink: "https://www.youtube.com/watch?v=lQrcQ3e4mkA"
      },
      {
        id: "web-mod-4",
        title: "Module 4 – Deployment & Full Stack Integration",
        focus: "Web Developer Roadmap 2025 (Everything is Changing)",
        videoLink: "https://www.youtube.com/watch?v=X8BYu3dMKf0"
      }
    ]
  },
  {
    id: "python-data-science",
    title: "Python for Data Science & Machine Learning",
    description: "Learn Python for data science, including data analysis, visualization, and machine learning.",
    category: "Data Science",
    thumbnail: "https://i.ytimg.com/vi/1fcfZ_Ne8ok/mqdefault.jpg",
    level: "Intermediate",
    modules: [
      {
        id: "py-mod-1",
        title: "Module 1 – Python Basics & Setup",
        focus: "Python fundamentals and environment setup",
        videoLink: "https://www.youtube.com/watch?v=1fcfZ_Ne8ok"
      },
      {
        id: "py-mod-2",
        title: "Module 2 – Data Libraries & Tools",
        focus: "Pandas, NumPy, and visualization libraries",
        videoLink: "https://www.youtube.com/watch?v=hDKCxebp88A"
      },
      {
        id: "py-mod-3",
        title: "Module 3 – ML Algorithms & Models",
        focus: "Machine learning fundamentals and models",
        videoLink: "https://www.youtube.com/watch?v=29ZQ3TDGgRQ"
      },
      {
        id: "py-mod-4",
        title: "Module 4 – Advanced Topics",
        focus: "Deep learning and model deployment",
        videoLink: "https://www.youtube.com/watch?v=1fcfZ_Ne8ok"
      }
    ]
  },
  {
    id: "aws-certified",
    title: "AWS Certified Solutions Architect",
    description: "Prepare for AWS certification with comprehensive training on cloud services.",
    category: "Cloud Computing",
    thumbnail: "https://i.ytimg.com/vi/c3Cn4xYfxJY/mqdefault.jpg",
    level: "Intermediate",
    modules: [
      {
        id: "aws-mod-1",
        title: "Module 1 – Cloud & AWS Basics",
        focus: "AWS Cloud Computing Tutorial for Beginners",
        videoLink: "https://www.youtube.com/watch?v=j_StCjwpfmk"
      },
      {
        id: "aws-mod-2",
        title: "Module 2 – Core AWS Services",
        focus: "AWS Tutorial For Beginners",
        videoLink: "https://www.youtube.com/watch?v=j_StCjwpfmk"
      },
      {
        id: "aws-mod-3",
        title: "Module 3 – Certification Prep & Architecture",
        focus: "AWS Certified Solutions Architect Associate (SAA-C03)",
        videoLink: "https://www.youtube.com/watch?v=c3Cn4xYfxJY"
      },
      {
        id: "aws-mod-4",
        title: "Module 4 – Advanced / Real-World AWS Use",
        focus: "AWS Cloud Engineer Full Course for Beginners",
        videoLink: "https://www.youtube.com/watch?v=j_StCjwpfmk"
      }
    ]
  },
  {
    id: "javascript-complete",
    title: "The Complete JavaScript Course",
    description: "Master JavaScript from basics to advanced concepts and modern frameworks.",
    category: "Programming",
    thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
    level: "Beginner",
    modules: [
      {
        id: "js-mod-1",
        title: "Module 1 – JS Fundamentals, ES6",
        focus: "JavaScript fundamentals and ES6 features",
        videoLink: "https://www.youtube.com/watch?v=PkZNo7MFNFg"
      },
      {
        id: "js-mod-2",
        title: "Module 2 – Advanced JS, Async",
        focus: "Advanced JavaScript and asynchronous programming",
        videoLink: "https://www.youtube.com/watch?v=4WjtQjPQGIs"
      },
      {
        id: "js-mod-3",
        title: "Module 3 – JS in Web / DOM / Browser APIs",
        focus: "DOM manipulation and browser APIs",
        videoLink: "https://www.youtube.com/watch?v=4WjtQjPQGIs"
      },
      {
        id: "js-mod-4",
        title: "Module 4 – JS + Frameworks / Modern Ecosystem",
        focus: "JavaScript with modern frameworks",
        videoLink: "https://www.youtube.com/watch?v=4WjtQjPQGIs"
      }
    ]
  },
  {
    id: "docker-kubernetes",
    title: "Docker & Kubernetes / DevOps Course",
    description: "Learn Docker, Kubernetes, and DevOps practices for modern application deployment.",
    category: "DevOps",
    thumbnail: "https://i.ytimg.com/vi/RqTEHSBrYFw/mqdefault.jpg",
    level: "Advanced",
    modules: [
      {
        id: "devops-mod-1",
        title: "Module 1 – Docker Basics & Containers",
        focus: "Complete Docker Course – From BEGINNER to PRO",
        videoLink: "https://www.youtube.com/watch?v=RqTEHSBrYFw"
      },
      {
        id: "devops-mod-2",
        title: "Module 2 – Kubernetes Fundamentals",
        focus: "Complete Kubernetes Course – From BEGINNER to PRO",
        videoLink: "https://www.youtube.com/watch?v=2T86xAtR6Fo"
      },
      {
        id: "devops-mod-3",
        title: "Module 3 – Docker + Kubernetes Combined",
        focus: "Docker and Kubernetes Tutorial for Beginners",
        videoLink: "https://www.youtube.com/playlist?list=PLy7NrYWoggjwPggqtFsI_zMAwvG0SqYCb"
      },
      {
        id: "devops-mod-4",
        title: "Module 4 – Deployment & Advanced Concepts",
        focus: "Docker Containers and Kubernetes Fundamentals",
        videoLink: "https://www.youtube.com/watch?v=kTp5xUtcalw"
      }
    ]
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design Course",
    description: "Master UI/UX design principles, tools, and create professional design portfolios.",
    category: "Design",
    thumbnail: "https://i.ytimg.com/vi/cvm_ECH94x4/mqdefault.jpg",
    level: "Beginner",
    modules: [
      {
        id: "design-mod-1",
        title: "Module 1 – UI/UX Fundamentals & Design Principles",
        focus: "UI UX Full Course 2025",
        videoLink: "https://www.youtube.com/watch?v=cvm_ECH94x4"
      },
      {
        id: "design-mod-2",
        title: "Module 2 – Tools & Prototyping (Figma etc.)",
        focus: "Free Figma Crash Course for Beginners 2025",
        videoLink: "https://www.youtube.com/watch?v=1SNZRCVNizg"
      },
      {
        id: "design-mod-3",
        title: "Module 3 – Hands-on UI/UX Workflow",
        focus: "UI UX Design Full Course",
        videoLink: "https://www.youtube.com/watch?v=cvm_ECH94x4"
      },
      {
        id: "design-mod-4",
        title: "Module 4 – UI/UX Portfolio & Advanced Design",
        focus: "The 2025 UI/UX Crash Course for Beginners – Learn Figma",
        videoLink: "https://www.youtube.com/watch?v=cvm_ECH94x4"
      }
    ]
  },
  {
    id: "machine-learning",
    title: "Machine Learning / Python / Data Science Course",
    description: "Comprehensive machine learning course with Python and practical projects.",
    category: "Data Science",
    thumbnail: "https://i.ytimg.com/vi/hDKCxebp88A/mqdefault.jpg",
    level: "Advanced",
    modules: [
      {
        id: "ml-mod-1",
        title: "Module 1 – Python & ML Foundations",
        focus: "Machine Learning with Python Full Course [2025]",
        videoLink: "https://www.youtube.com/watch?v=1fcfZ_Ne8ok"
      },
      {
        id: "ml-mod-2",
        title: "Module 2 – Core ML Algorithms & Models",
        focus: "Machine Learning with Python and Scikit-Learn – Full Course",
        videoLink: "https://www.youtube.com/watch?v=hDKCxebp88A"
      },
      {
        id: "ml-mod-3",
        title: "Module 3 – Project / Model Building",
        focus: "Build your first machine learning model in Python",
        videoLink: "https://www.youtube.com/watch?v=29ZQ3TDGgRQ"
      },
      {
        id: "ml-mod-4",
        title: "Module 4 – Applied ML & Deployment",
        focus: "Free Machine Learning Course",
        videoLink: "https://www.youtube.com/watch?v=hDKCxebp88A"
      }
    ]
  }
];

// Helper function to get YouTube video ID from URL
function getYouTubeVideoId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : "";
}

export function RoadmapModulesSection({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<string>("overview")
  
  // Get the course data
  const course = ROADMAP_COURSES.find((c: RoadmapCourse) => c.id === courseId)
  
  if (!course) {
    return <div className="text-center py-4">Course not found</div>
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Module Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="aspect-video relative overflow-hidden rounded-md">
            {course.thumbnail && (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
                unoptimized={false}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white">{course.title}</h3>
              <p className="text-white/90 text-sm mt-1">{course.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge>{course.category}</Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base">Experience Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{course.level}</Badge>
              </CardContent>
            </Card>
            
            <Card className="col-span-2">
              <CardHeader className="py-4">
                <CardTitle className="text-base">Course Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {course.modules.map((module: CourseModule) => (
                    <li key={module.id} className="text-sm">{module.title} - <span className="text-muted-foreground">{module.focus}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Button className="w-full" onClick={() => setActiveTab("modules")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Start Learning
          </Button>
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-6 mt-4">
          {course.modules.map((module: CourseModule) => {
            const videoId = getYouTubeVideoId(module.videoLink)
            const thumbnailUrl = videoId 
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              : "/placeholder-video.jpg"
            
            return (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.focus}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <Image
                      src={thumbnailUrl}
                      alt={module.title}
                      fill
                      className="object-cover"
                      unoptimized={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <a href={module.videoLink} target="_blank" rel="noopener noreferrer">
                      <Video className="mr-2 h-4 w-4" />
                      Watch Video
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}